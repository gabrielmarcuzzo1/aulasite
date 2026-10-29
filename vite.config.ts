import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "deployment-version",
      transformIndexHtml() {
        return [
          {
            tag: "meta",
            attrs: {
              name: "v3-build",
              content:
                process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || "local",
            },
            injectTo: "head",
          },
        ];
      },
    },
  ],
  // Only scan the development entry, not the generated, bundled preview.
  optimizeDeps: { entries: ["index.html"] },
  build: {
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
