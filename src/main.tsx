import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/opsz.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
