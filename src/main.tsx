import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/opsz.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Prefetch tour dates in the background so tour pages show them instantly.
const prefetchDates = () => import("@/lib/tourDatesCache").then((m) => m.fetchTourDates().catch(() => {}));
if (document.readyState === "complete") setTimeout(prefetchDates, 1500);
else window.addEventListener("load", () => setTimeout(prefetchDates, 1500), { once: true });
