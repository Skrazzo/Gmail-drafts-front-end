import { createRoot } from "react-dom/client";
import { API_URL } from "./global.ts";

import App from "./App.tsx";
import "./index.css";

import axios from "axios";
axios.defaults.baseURL = API_URL + "/";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 60000; // 1 minute request timeout

createRoot(document.getElementById("root")!).render(<App />);
