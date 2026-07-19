import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Editor GUI di InteractiveWriter (Tauri + React).
// Il frontend è anche eseguibile in un browser normale (adapter in src/lib/fileIO.ts),
// così è verificabile in preview senza il guscio Tauri.
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    // Consente l'import del core e degli esempi che stanno fuori dalla cartella editor/.
    fs: { allow: [".."] },
  },
});
