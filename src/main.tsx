import { createRoot } from "react-dom/client";
import "./index.css";
import { initLenis } from "./motion/setup";
import App from "./App";

initLenis();

// Se o JS de animação não carregar, mostra todo o conteúdo.
window.setTimeout(() => {
  if (!window.__motionReady) document.documentElement.classList.add("motion-failsafe");
}, 6000);

createRoot(document.getElementById("root")!).render(<App />);
