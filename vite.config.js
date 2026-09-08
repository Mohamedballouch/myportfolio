import { defineConfig } from "vite";

// Relative asset URLs support both the existing custom domain and /myportfolio/.
export default defineConfig({ base: "./", publicDir: "public" });
