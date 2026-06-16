import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate =useNavigate()
  const [isRegistering, setIsRegistering] = useState(false); //control interfaz de formulario
  const [loading,setLoading]= useState(false) //control de boton
  const [error, setError] = useState(null); //control error


  //login/register
  const handleSubmit = async () => {
    setError(null)
    // Si isRegistering es true, usamos la ruta de registro
    const endpoint = isRegistering ? "auth/register" : "auth/login";
    setLoading(true)
    try {
      const response = await api.post(endpoint, formData);
      console.log(response);

      // Si fue login, guardamos el token
      if (!isRegistering && response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else if (isRegistering) {
        setIsRegistering(false); // Cambiamos a login tras registrarse
      }
      navigate("/home")
      
    } catch (error) {
      setError("Error: credenciales incorrectas o servidor no disponible.");
    }finally{
      setLoading(false)
    }
  };

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
        action=""
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
          onClick={handleSubmit}
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
