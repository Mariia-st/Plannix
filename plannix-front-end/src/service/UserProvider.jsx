import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

//creamos el contexto para compartir datos entre los componentes
export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  //variables de usuario/ loading/ navegación
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  

// carga una vez el info de usuario al entrar
  useEffect(() => {
    fetchUser();
  }, []);


//Obtener, actualizar el info de usuario 
  const fetchUser = async () => {

    setLoading(true)

    try {
      //si no hay token no hacemos petición en casos antes de logearse 
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      // Llamada al endpoint /me 
      const response = await api.get("auth/me");
      setUser(response.data);

    } catch (error) {
      console.error("Error al cargar usuario", error);
      localStorage.removeItem('token');

    } finally {
      setLoading(false);
    }
  };


  //guarda el token y carga el info de usuario 
  const setTokenUser = async (token) => {

    localStorage.setItem("token", token)

    await fetchUser()
  }

  //logout de usuario 
  //TODO: metodo de logout en back
  const logout=()=>{
    localStorage.removeItem('token')
    setUser(null)
    
     navigate("/")

  }

  return (
    // pasa los datos
    <UserContext.Provider value={{ user,loading, logout, setTokenUser, }}>
      {children}
    </UserContext.Provider>
  );
};