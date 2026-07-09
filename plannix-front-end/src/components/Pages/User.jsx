import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../service/UserProvider";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function User() {

  //variables de userContext con info de user/ navegación/ control de diseño con update/ control de bottones
  const { user, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  //formulario de datos  
  const [form, setForm] = useState({
    name: "",
    email: "",
    old_password: "",
    password: "",
  });

  // asignamos datos a formulario para enseñar en campos 
  useEffect(() => {
    setForm(user);
  }, [user]);

  //es de cambios de name y email 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //actualizar el imagen de avatar
  const handleImageChange = async (e) => {
    
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      //cambiamos el header para pasar el foto 
      await api.put("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Refrescamos el usuario para ver la nueva foto
      fetchUser();
    } catch (error) {
      console.error("Error al subir la imagen", error);

    } finally {
      setLoading(false);
    }
  };

  //actualizar la contraseña 
  const handlePasswordSubmit = async () => {

    if (!form.old_password || !form.password) return;

    setLoading(true);

    try {
      await api.put("/user/password", {
        oldPassword: form.old_password,
        newPassword: form.password,
      });

      // Limpiar campos de contraseña
      setForm((prev) => ({ ...prev, old_password: "", password: "" }));
    } catch (error) {
      console.error("Error al cambiar contraseña", error);
    
    } finally {
      setLoading(false);
    }
  };


  //método de modificar el nombre y email 
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put("/user", form);
  
      fetchUser();

    } catch (error) {

      setForm(user);
  
    } finally {

      setUpdate(!update);
      setLoading(false);
    }
  };

  // cerrar el modo de modificación de nombre y email de usuario 
  const close = () => {
    setUpdate(!update);
    setForm(user);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-10 col-md-10 col-lg-8 bg-white p-4 p-md-5 rounded shadow-sm">
          
   
          <div className="mb-4">
            <button className="btn btn-outline-dark btn-sm" onClick={() => navigate("/inicio")}>
              ← inicio
            </button>
          </div>
  
         
          <div className="d-flex flex-column flex-sm-row gap-4 align-items-center align-items-sm-start mb-5">
            
           
            <div className="position-relative" style={{ width: "180px", height: "180px", flexShrink: 0}}>
              {user.avatar ? (
                <img src={`${import.meta.env.VITE_API_URL}${user.avatar}`} alt="Avatar" className="rounded-circle shadow-sm w-100 h-100" style={{ objectFit: "cover" }} />
              ) : (
                <div className="bg-light text-secondary d-flex align-items-center justify-content-center rounded-circle shadow-sm w-100 h-100 fs-1">
                  {user.name ? user.name[0].toUpperCase() : "?"}
                </div>
              )}
              <label htmlFor="upload-photo" className="btn btn-light border rounded-pill position-absolute" style={{ bottom: "0", right: "0" }}>
                📷
              </label>
              <input type="file" id="upload-photo" hidden accept="image/*" onChange={handleImageChange} />
            </div>
  
     
            <form onSubmit={handleSubmit} className="w-100">
              <div className="d-flex flex-column gap-3">
                {!update ? (
                  <>
                    <h2 className="m-0">{user.name}</h2>
                    <p className="text-muted m-0">{user.email}</p>
                  </>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    <input name="name" className="form-control" value={form.name} onChange={handleChange} />
                    <input name="email" className="form-control" value={form.email} onChange={handleChange} />
                  </div>
                )}
               
                <div>
                  {!update 
                    ? <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setUpdate(true)}>Editar perfil</button>
                    : <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success btn-sm">Guardar</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={close}>Cancel</button>
                      </div>
                  }
                </div>
              </div>
            </form>
          </div>
  
 
          <hr />
          <div className="row g-3">
            <h5 className="mb-3">Cambiar contraseña</h5>
            <div className="col-12 col-md-6">
              <input name="old_password" type="password" className="form-control" placeholder="Contraseña actual" value={form.old_password} onChange={handleChange} />
            </div>
            <div className="col-12 col-md-6">
              <input name="password" type="password" className="form-control" placeholder="Nueva contraseña" value={form.password} onChange={handleChange} />
            </div>
            <div className="col-12">
              <button className="btn btn-dark w-100 w-md-auto" onClick={handlePasswordSubmit}>Guardar contraseña</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
