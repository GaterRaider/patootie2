import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  console.log("🚀 Setting up Vite dev server...");
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  // Serve index.html for all routes (SPA fallback)
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Read index.html
      const template = fs.readFileSync(
        path.resolve(import.meta.dirname, "../../client/index.html"),
        "utf-8"
      );

      // Transform HTML with Vite
      const html = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  console.log("✅ Vite dev server ready!");
}

export function serveStatic(app: Express) {
  // When bundled by esbuild, server runs from dist/index.js
  // So import.meta.dirname is 'dist/', and we need './public' to get to dist/public
  const distPath = path.resolve(import.meta.dirname, "./public");

  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  console.log(`Serving static files from: ${distPath}`);

  // Serve static assets (CSS, JS, images, fonts)
  app.use(express.static(distPath));

  // Serve prerendered HTML - check for route-specific index.html first
  app.use("*", (req, res) => {
    // Try to serve route-specific HTML file
    const routePath = req.originalUrl.split('?')[0]; // Remove query params
    const htmlPath = routePath === '/'
      ? path.join(distPath, "index.html")
      : path.join(distPath, routePath, "index.html");

    if (fs.existsSync(htmlPath)) {
      res.set("Content-Type", "text/html");
      res.sendFile(htmlPath);
    } else {
      // Fallback to root index.html for client-side routing
      res.set("Content-Type", "text/html");
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
