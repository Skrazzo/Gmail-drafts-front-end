import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")!).render(<App />);
