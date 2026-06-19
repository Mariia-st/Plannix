import { useContext, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../service/UserProvider";


export default function Login() {

  //datos de usuario 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  //variables de control/ nevegación/ userContext
  const navigate =useNavigate()
  const [isRegistering, setIsRegistering] = useState(false); //control interfaz de formulario
  const [loading,setLoading]= useState(false) //control de boton
  const [error, setError] = useState(null); //control error
  const {setTokenUser}= useContext(UserContext) // user provider para asignar el token


  //método de logearse o registrarse
  const handleSubmit = async (e) => {
 
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Si isRegistering es true, usamos la ruta de registro
    const endpoint = isRegistering ? "auth/register" : "auth/login";

    try {
      const response = await api.post(endpoint, formData);
    
      // Guardamos el token si viene
      if ( response.data.token) {
        //guardamos el token en userContext tras un metodo 
         await setTokenUser(response.data.token)

         navigate("/home")
      } 
      
    } catch (error) {
      setError("Error: credenciales incorrectas o servidor no disponible.");
      
    }finally{
      setLoading(false)
    }
  };

  //método de guardar datos 
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form
        className=" bg-light-subtle  d-flex flex-column p-5 gap-3 rounded-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-black text-center">
          {isRegistering ? "Registro" : "Login"}
        </h2>

        {isRegistering && (
          <div className="form-floating">
            <input
              name="name"
              type="text"
              className="form-control form-control-lg"
              id="floatingName"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="floatingName">Nombre</label>
          </div>
        )}

        <div className="form-floating ">
          <input
            name="email"
            type="email"
            className="form-control form-control-lg"
            id="floatingEmail"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating ">
          <input
            name="password"
            type="password"
            className="form-control form-control-lg"
            id="floatingPassword"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <label htmlFor="floatingPassword">Contraseña</label>
        </div>
        <div className=" text-danger small ">
          {error}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-outline-dark mt-2"
        >
          {isRegistering ? "Registrarme" : "Login"}
        </button>
        {!isRegistering ? (
          <p type="button" className="text-center text-muted text-decoration-underline" onClick={() => setIsRegistering(true)}>
            registrarme
          </p>
        ) : (
          <p type="button" className="text-center text-muted text-decoration-underline " onClick={() => setIsRegistering(false)}>
            login
          </p>
        )}
      </form>
    </div>
  );
}
