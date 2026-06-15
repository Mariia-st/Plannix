import { useEffect, useRef } from "react";
import * as THREE from "three"; // importamos tree js para vanta para renderizado 3D
import HALO from "vanta/dist/vanta.net.min"; // importamos efecto desde vanta

export default function Layout({ children }) {
  const vantaRef = useRef(null); // Referencia para montar el efecto Vanta directamente en el DOM

  useEffect(() => {
    let vantaEffect;

    // Inicialización del efecto una vez que el componente se monta
    vantaEffect = HALO.default({
      el: vantaRef.current, // Elemento donde se renderiza la animación
      THREE: THREE, // Pasamos la instancia de Three.js requerida
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x0,
      backgroundColor: 0xf5f5f5,
      points: 14.00,
      maxDistance: 14.00
    });

    // Limpieza: destruimos el efecto al desmontar el componente
    // para evitar fugas de memoria y ralentización del navegador
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="bg-black text-center text-white py-3">Plannix</header>

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
