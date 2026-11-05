import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/opsz.css";
import "./index.css";

const root = document.getElementById("root");
if (root) createRoot(root).render(<App />);

// Start independently of image loading; the pages share this in-flight request.
const prefetchDates = () => import("@/lib/tourDatesCache").then((m) => m.fetchTourDates().catch(() => {}));
void prefetchDates();
