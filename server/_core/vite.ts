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
    ...viteConfig({ mode: 'development', command: 'serve' }),
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  // Helper function to detect language from Accept-Language header
  const detectLanguageFromHeader = (acceptLanguage: string | undefined): 'de' | 'ko' | 'en' => {
    if (!acceptLanguage) return 'en';

    const languages = acceptLanguage.toLowerCase().split(',').map(lang => {
      const parts = lang.split(';');
      return parts[0].trim();
    });

    for (const lang of languages) {
      if (lang.startsWith('de')) return 'de';
      if (lang.startsWith('ko')) return 'ko';
    }

    return 'en';
  };

  // Serve index.html for all routes (SPA fallback)
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const routePath = url.split('?')[0]; // Remove query params

    // Language detection for root path only
    if (routePath === '/') {
      const detectedLang = detectLanguageFromHeader(req.headers['accept-language']);
      console.log(`[Language Detection] Accept-Language: ${req.headers['accept-language']} -> Redirecting to /${detectedLang}`);
      return res.redirect(302, `/${detectedLang}`);
    }

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

  // Helper function to detect language from Accept-Language header
  const detectLanguageFromHeader = (acceptLanguage: string | undefined): 'de' | 'ko' | 'en' => {
    if (!acceptLanguage) return 'en';

    const languages = acceptLanguage.toLowerCase().split(',').map(lang => {
      const parts = lang.split(';');
      return parts[0].trim();
    });

    for (const lang of languages) {
      if (lang.startsWith('de')) return 'de';
      if (lang.startsWith('ko')) return 'ko';
    }

    return 'en';
  };

  // Serve prerendered HTML - check for route-specific index.html first
  app.use("*", (req, res) => {
    const routePath = req.originalUrl.split('?')[0]; // Remove query params

    // Language detection for root path only
    if (routePath === '/') {
      const detectedLang = detectLanguageFromHeader(req.headers['accept-language']);
      console.log(`[Language Detection] Accept-Language: ${req.headers['accept-language']} -> Redirecting to /${detectedLang}`);
      return res.redirect(302, `/${detectedLang}`);
    }

    // Special handling for admin routes - always serve root index.html (SPA)
    // This allows the client-side router to handle /admin/* routes
    if (routePath.startsWith('/admin')) {
      res.set("Content-Type", "text/html");
      return res.sendFile(path.resolve(distPath, "index.html"));
    }

    // Try to serve route-specific HTML file
    const htmlPath = path.join(distPath, routePath, "index.html");

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
