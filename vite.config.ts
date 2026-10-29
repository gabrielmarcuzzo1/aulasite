import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Only scan the development entry, not the generated, bundled preview.
  optimizeDeps: { entries: ["index.html"] },
  build: {
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
