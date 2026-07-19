import axios from 'axios';

//configuracion base de mi api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, //mi back
    headers: {
        'Content-Type': 'application/json'
    },
});

//se ejecuta antes de cada pet
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // si existe añadimos header
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
}, (error) => {
    return Promise.reject(error)
})


// se ejecuta cuando recibimos la respuesta de servidor 
api.interceptors.response.use((response) => {
    response
}, // si todo bien dejo pasar 
    async (error) => { //si error pasamos 
        const origRequest = error.config // lo guardamos para repetir la peticíon 

        // verificamos error y _retry 
        if (error.response?.status === 401 && !origRequest._retry) {
            // ponemos a true para no entrar a buvle infinito
            origRequest._retry = true


            try {
                // const {data} igual y entra a data directamente
                //hacemos refresh
                const res = await api.post("/refresh")
                // guardamos
                localStorage.setItem("token", res.data.access_token)
                //ponemos el header de nuevo 
                origRequest.headers.Authorization = `Bearer ${res.data.access_token}`
                //hacemos la petición otra vez
                return api(origRequest)

            } catch (refreshError) {
                // Si el refresh también falla, el usuario debe volver a loguearse
                localStorage.removeItem('token');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }


        }

        //error
        return Promise.reject(error);

    }
)

export default api