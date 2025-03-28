import { defineConfig } from "vite";
import reactCompiler from "@vitejs/plugin-react-compiler";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactCompiler()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
