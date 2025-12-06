
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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // 1. Heavy libraries - Admin/Visualization specific
            // Return undefined to let Vite/Rollup naturally split them (lazy load)
            if (
              id.includes('pdfkit') ||
              id.includes('jspdf') ||
              id.includes('html2canvas') ||
              id.includes('recharts') ||
              id.includes('drizzle-orm') ||
              id.includes('@aws-sdk')
            ) {
              return undefined;
            }

            // 2. UI Libraries & Icons
            if (
              id.includes('@radix-ui') ||
              id.includes('lucide-react') ||
              id.includes('framer-motion') ||
              id.includes('sonner') ||
              id.includes('vaul') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge') ||
              id.includes('embla-carousel') ||
              id.includes('react-day-picker')
            ) {
              return 'vendor-ui';
            }

            // 3. Core React ecosystem
            if (
              id.includes('/react/') || // matches node_modules/react/
              id.includes('/react-dom/') ||
              id.includes('wouter') ||
              id.includes('react-helmet-async') ||
              id.includes('@tanstack/react-query') ||
              id.includes('@trpc') ||
              id.includes('react-hook-form') ||
              id.includes('zod')
            ) {
              return 'vendor-react';
            }

            // 4. Everything else (utils, small libs)
            return 'vendor-utils';
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
