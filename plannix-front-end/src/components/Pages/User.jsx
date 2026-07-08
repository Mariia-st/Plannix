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
    <>
      <div className=" container">
        <div className=" row ">
          <div className="bg-white d-flex flex-column gap-5 p-5 rounded ">
            <div>
              <button
                className="btn btn-outline-dark"
                onClick={() => navigate("/inicio")}
              >
                ← inicio
              </button>
            </div>
            <div className="d-flex flex  gap-4 align-items-center">
              <div
                className="position-relative"
                style={{ width: "200px", height: "200px" }}
              >
                {user.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${user.avatar}`}
                    alt="Avatar"
                    className="rounded-circle shadow-sm"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="bg-light text-secondary d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                    style={{
                      width: "100%",
                      height: "100%",
                      fontSize: "6rem",
                    }}
                  >
                    {user.name ? user.name[0].toUpperCase() : "?"}
                  </div>
                )}
                <label
                  htmlFor="upload-photo"
                  className="btn btn-light border border-1 border-black rounded-pill position-absolute"
                  style={{
                    bottom: "10px",
                    right: "10px",
                    cursor: "pointer",
                    padding: "10px 15px",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>📷</span>
                </label>

                <input
                  type="file"
                  id="upload-photo"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-2">
                  {!update ? (
                    <h1>{user.name}</h1>
                  ) : (
                    <div className="form-floating">
                      <input
                        name="name"
                        type="text"
                        className="form-control form-control-lg"
                        id="floatingName"
                        placeholder="Tu nombre"
                        value={form.name}
                        onChange={handleChange}
                      />
                      <label htmlFor="floatingName">Nombre</label>
                    </div>
                  )}
                  {!update ? (
                    <h1>{user.email}</h1>
                  ) : (
                    <div className="form-floating">
                      <input
                        name="email"
                        type="email"
                        className="form-control form-control-lg"
                        id="floatingName"
                        placeholder="Tu email"
                        value={form.email}
                        onChange={handleChange}
                      />
                      <label htmlFor="floatingEmail">Email</label>
                    </div>
                  )}
                </div>
                {!update ? (
                  <button
                    type="button"
                    className="btn btn-outline-dark btn-sm mt-2"
                    onClick={() => setUpdate(!update)}
                  >
                    Editar perfil
                  </button>
                ) : (
                  <div className="mt-2 d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-outline-success btn-sm "
                      disabled={
                        (form.name === user.name &&
                          form.email === user.email) ||
                        loading
                      }
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm "
                      onClick={close}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="d-flex flex-column gap-4">
              <div className="form-floating">
                <input
                  name="old_password"
                  type="password" // ¡Importante usar type="password"!
                  className="form-control"
                  placeholder="Contraseña actual"
                  value={form.old_password}
                  onChange={handleChange}
                />
                <label>Contraseña actual</label>
              </div>
              <div className="form-floating">
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Nueva contraseña"
                  value={form.password}
                  onChange={handleChange}
                />
                <label>Nueva contraseña</label>
              </div>

              <button
                className="btn btn-outline-dark"
                type="button"
                onClick={handlePasswordSubmit}
                disabled={!form.password || !form.old_password || loading}
              >
                Guardar contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
