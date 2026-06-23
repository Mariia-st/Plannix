import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../service/UserProvider";
import { useContext } from "react";

import * as THREE from "three"; // importamos tree js para vanta para renderizado 3D
import HALO from "vanta/dist/vanta.net.min"; // importamos efecto desde vanta

export default function Layout({ children }) {
  //variables de rutas/ user,logout/ sectiondeUsuario /navegación
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const isUserSection = location.pathname !== "/";
  const navigate = useNavigate();

  const vantaRef = useRef(null); // Referencia para montar el efecto Vanta directamente en el DOM

  useEffect(() => {
    let vantaEffect;

    if (vantaRef.current) {
      // Inicialización del efecto una vez que el componente se monta
      vantaEffect = HALO.default({
        el: vantaRef.current, // Elemento donde se renderiza la animación
        THREE: THREE, // Pasamos la instancia de Three.js requerida
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x0,
        backgroundColor: 0xf5f5f5,
        points: 14.0,
        maxDistance: 14.0,
      });
    }

    // Limpieza: destruimos el efecto al desmontar el componente
    // para evitar fugas de memoria y ralentización del navegador
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-black  text-white py-3 d-flex justify-content-center justify-content-between px-5">
        <div>Plannix</div>
        {isUserSection && (
          <div className="d-flex gap-2 ">
            <div className="d-flex flex-column">
              <span className="fw-bold text-white small">
                {user ? user.email : "Cargando..."}
              </span>
              <button
                className="btn btn-sm btn-link text-decoration-none text-white p-0"
                onClick={logout}
                style={{ fontSize: "0.8rem" }}
              >
                Cerrar sesión
              </button>
            </div>

            {user ? (
              user.avatar ? (
                <img
                  type="button"
                  onClick={() => navigate("/perfil")}
                  src={`http://localhost:3000${user.avatar}`}
                  alt="Avatar"
                  className="rounded-circle shadow-sm"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              ) : (
                <div
                  type="button"
                  onClick={() => navigate("/perfil")}
                  className="bg-light text-secondary d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                  style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}
                >
           
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>
              )
            ) : (

              <div
                className="bg-secondary rounded-circle"
                style={{ width: "40px", height: "40px" }}
              ></div>
            )}
          </div>
        )}
      </header>

      <main
        ref={vantaRef}
        className="flex-grow-1 d-flex flex-column justify-content-center align-items-center"
      >
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </main>

      <footer className="text-center text-secondary py-2 border-top">
        @2026 Plannix
      </footer>
    </div>
  );
}
