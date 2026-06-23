import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../service/UserProvider";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function User() {
  const { user, fetchUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); // 'image' debe coincidir con el nombre en tu backend (upload.single('image'))

    try {
      setLoading(true);
      // Cambia la ruta según tu endpoint (ej: /user/avatar)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put("/user", form);
      console.log(response);
      fetchUser();
    } catch (error) {
      setForm(user);
      console.log(error);
    } finally {
      setUpdate(!update);
      setLoading(false);
    }
  };

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
            <div className="d-flex flex  gap-4 align-items-center position-relative ">
              {/* Cambio: Si el usuario tiene avatar, mostramos <img>, si no, el div con las iniciales */}
              {user.avatar ? (
                <img
                  src={`http://localhost:3000${user.avatar}`} // Ajusta la URL de tu servidor
                  alt="Avatar"
                  className="rounded-circle shadow-sm"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="bg-light text-secondary d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                  style={{ width: "200px", height: "200px", fontSize: "6rem" }}
                >
                  {user.name[0].toUpperCase()}
                </div>
              )}
              <label
                htmlFor="upload-photo"
                className="btn btn-light border border-1 border-black rounded-pill position-absolute"
                style={{
                  bottom: "10px",
                  right: "180px",
                  cursor: "pointer",
                  padding: "10px 15px",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>📷</span>
              </label>

              {/* Скрытый инпут */}
              <input
                type="file"
                id="upload-photo"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
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
              {/* <div className="form-floating">
                <input
                  name="name"
                  type="text"
                  className="form-control form-control-lg"
                  id="floatingName"
                  placeholder="Tu nombre"
                />
                <label htmlFor="floatingName">Contraseña</label>
              </div>
              <div className="form-floating">
                <input
                  name="email"
                  type="email"
                  className="form-control form-control-lg"
                  id="floatingName"
                  placeholder="Tu email"
                />
                <label htmlFor="floatingEmail">Nueva Contraseña</label>
              </div>
 */}
              <button className="btn btn-outline-dark ">Editar perfil</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
