import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";

const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    manifest: true,
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split core React and React-DOM
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-core';
            }
            // Split Framer Motion (animation library, can be large)
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            // Split Radix UI components into their own chunk
            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }
            // Split charting/visualization libraries
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor';
            }
            // Split tRPC and React Query
            if (id.includes('@trpc') || id.includes('@tanstack')) {
              return 'query-vendor';
            }
            // Split DnD kit
            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor';
            }
            // Split other React ecosystem libraries
            if (id.includes('react-')) {
              return 'react-libs';
            }
            // Everything else goes to vendor
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
