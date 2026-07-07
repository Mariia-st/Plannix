import axios from 'axios';

//configuracion base de mi api
const api=axios.create({
    baseURL: import.meta.env.VITE_API_URL, //mi back
    headers:{
        'Content-Type':'application/json'
    },
});

//se ejecuta antes de cada pet
api.interceptors.request.use((config)=>{
    const token= localStorage.getItem('token');
    if(token){
        // si existe añadimos header
        config.headers.Authorization=`Bearer ${token}`
    }

    return config
},(error)=>{
    return Promise.reject(error)
})

export default api