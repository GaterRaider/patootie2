import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Writable } from 'node:stream';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { getQueryKey } from '@trpc/react-query';
import superjson from 'superjson';
import { Router } from 'wouter';
import prettier from 'prettier';

// Import server router for direct calling
import { appRouter } from '../server/routers';

// Mock browser environment BEFORE imports that might use them
if (typeof window === 'undefined') {
  const globalAny = global as any;

  globalAny.window = {
    location: {
      search: '',
      pathname: '/',
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000'
    },
    matchMedia: () => ({ matches: false, addListener: () => { }, removeListener: () => { }, addEventListener: () => { }, removeEventListener: () => { } }),
    addEventListener: () => { },
    removeEventListener: () => { },
    history: {
      replaceState: () => { },
      pushState: () => { }
    },
    scrollTo: () => { },
    requestAnimationFrame: (cb: any) => setTimeout(cb, 0),
    cancelAnimationFrame: () => { },
  };

  globalAny.document = {
    documentElement: {
      classList: { add: () => { }, remove: () => { } },
    },
    body: {
      classList: { add: () => { }, remove: () => { } },
      appendChild: () => { },
    },
    head: {
      appendChild: () => { },
    },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => { },
    removeEventListener: () => { },
    createElement: () => ({
      setAttribute: () => { },
      style: {},
      appendChild: () => { },
    })
  };

  globalAny.localStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
  };

  globalAny.sessionStorage = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
  };
}

// Import providers and pages
import { trpc } from '../client/src/lib/trpc';
import Home from '../client/src/pages/Home';
import PrivacyPolicy from '../client/src/pages/PrivacyPolicy';
import Imprint from '../client/src/pages/Imprint';
import App from '../client/src/App';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  // Root (redirects)
  { path: '/', component: Home, outPath: 'index.html', language: 'en' as const, id: 'home', priority: 1.0, changefreq: 'weekly' },

  // English
  { path: '/en', component: Home, outPath: 'en/index.html', language: 'en' as const, id: 'home', priority: 1.0, changefreq: 'weekly' },
  { path: '/en/privacy-policy', component: PrivacyPolicy, outPath: 'en/privacy-policy/index.html', language: 'en' as const, id: 'privacy-policy', priority: 0.5, changefreq: 'monthly' },
  { path: '/en/imprint', component: Imprint, outPath: 'en/imprint/index.html', language: 'en' as const, id: 'imprint', priority: 0.3, changefreq: 'monthly' },

  // Korean
  { path: '/ko', component: Home, outPath: 'ko/index.html', language: 'ko' as const, id: 'home', priority: 1.0, changefreq: 'weekly' },
  { path: '/ko/privacy-policy', component: PrivacyPolicy, outPath: 'ko/privacy-policy/index.html', language: 'ko' as const, id: 'privacy-policy', priority: 0.5, changefreq: 'monthly' },
  { path: '/ko/imprint', component: Imprint, outPath: 'ko/imprint/index.html', language: 'ko' as const, id: 'imprint', priority: 0.3, changefreq: 'monthly' },

  // German
  { path: '/de', component: Home, outPath: 'de/index.html', language: 'de' as const, id: 'home', priority: 1.0, changefreq: 'weekly' },
  { path: '/de/privacy-policy', component: PrivacyPolicy, outPath: 'de/privacy-policy/index.html', language: 'de' as const, id: 'privacy-policy', priority: 0.5, changefreq: 'monthly' },
  { path: '/de/imprint', component: Imprint, outPath: 'de/imprint/index.html', language: 'de' as const, id: 'imprint', priority: 0.3, changefreq: 'monthly' },
];

// Static location hook for wouter
const staticLocation = (path: string) => () => [path, () => { }] as [string, (to: string) => void];

async function generateSitemap(distPublic: string) {
  console.log('Generating sitemap.xml...');
  const baseUrl = 'https://www.handokhelper.de';

  // Group routes by ID to find alternates
  const routesById = routes.reduce((acc, route) => {
    if (route.path === '/') return acc;
    if (!acc[route.id]) acc[route.id] = [];
    acc[route.id].push(route);
    return acc;
  }, {} as Record<string, typeof routes>);

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  const sitemapRoutes = routes.filter(r => r.path !== '/');

  for (const route of sitemapRoutes) {
    // Ensure trailing slash for consistency
    const loc = `${baseUrl}${route.path}/`;

    sitemap += `  <url>
    <loc>${loc}</loc>
`;

    const alternates = routesById[route.id];
    if (alternates) {
      for (const alt of alternates) {
        sitemap += `    <xhtml:link rel="alternate" hreflang="${alt.language}" href="${baseUrl}${alt.path}/"/>
`;
      }
      // Only add x-default for home page which has a root redirect
      if (route.id === 'home') {
        sitemap += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/"/>
`;
      }
    }

    sitemap += `    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  }

  sitemap += `</urlset>`;

  const sitemapPath = path.join(distPublic, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✓ Generated sitemap at ${sitemapPath}`);
}

async function prerender() {
  console.log('Starting manual SSG prerendering...');

  const distPublic = path.join(__dirname, '../dist/public');
  const templatePath = path.join(distPublic, 'index.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}. Run 'vite build' first.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Create tRPC caller for direct database access
  // Mock context - public procedures don't need real request/response
  const caller = appRouter.createCaller({
    req: {} as any,
    res: {} as any,
    user: null,
  });

  // Setup providers
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3000/api/trpc',
        transformer: superjson,
      }),
    ],
  });

  for (const route of routes) {
    console.log(`Prerendering ${route.path}...`);

    // Prefetch FAQ data for Home pages
    if (route.component === Home) {
      try {
        console.log(`  Fetching FAQ data for ${route.language}...`);
        const faqData = await caller.faq.getByLanguage({ language: route.language });

        const queryKey = getQueryKey(trpc.faq.getByLanguage, { language: route.language }, 'query');
        queryClient.setQueryData(queryKey, faqData);
        console.log(`  ✓ FAQ data cached (${faqData.items.length} items)`);
      } catch (error) {
        console.warn(`  ⚠ Failed to fetch FAQ data for ${route.language}:`, error);
        // Continue rendering without FAQ data if database fails
      }
    }

    const helmetContext: any = {};

    try {
      // Helper function to render React to HTML string using streaming (supports Suspense)
      const renderToHtml = (element: React.ReactElement): Promise<string> => {
        return new Promise((resolve, reject) => {
          let html = '';
          const writable = new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString();
              callback();
            }
          });

          const { pipe } = renderToPipeableStream(element, {
            onAllReady() {
              // All content including Suspense boundaries is ready
              pipe(writable);
            },
            onShellError(err) {
              reject(err);
            },
            onError(err) {
              console.error('Stream rendering error:', err);
            }
          });

          writable.on('finish', () => resolve(html));
          writable.on('error', reject);
        });
      };

      const appHtml = await renderToHtml(
        React.createElement(
          trpc.Provider as any,
          { client: trpcClient, queryClient },
          React.createElement(
            QueryClientProvider,
            { client: queryClient },
            React.createElement(
              HelmetProvider,
              { context: helmetContext },
              React.createElement(App as any, {
                initialLanguage: route.language,
                locationHook: staticLocation(route.path)
              })
            )
          )
        )
      );

      console.log(`Rendered ${route.path}, HTML length: ${appHtml.length} characters`);

      const { helmet } = helmetContext;
      const dehydratedState = dehydrate(queryClient);
      const serializedState = superjson.stringify(dehydratedState);

      // Inject into template
      let html = template.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div><script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(serializedState)};</script>`
      );

      // Inject Helmet data
      if (helmet) {
        // Inject HTML attributes (like lang)
        if (helmet.htmlAttributes) {
          const htmlAttrs = helmet.htmlAttributes.toString();
          // Extract lang attribute from helmet
          const langMatch = htmlAttrs.match(/lang="([^"]+)"/);
          if (langMatch) {
            html = html.replace('<html lang="en">', `<html lang="${langMatch[1]}">`);
          }
        }

        const helmetHead = `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      `;
        html = html.replace('</head>', `${helmetHead}</head>`);
      }

      // Write file
      const outFilePath = path.join(distPublic, route.outPath);
      const outDir = path.dirname(outFilePath);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFilePath, html);
      console.log(`✓ Written ${outFilePath}`);
    } catch (error) {
      console.error(`Error rendering ${route.path}:`, error);
      throw error;
    }
  }

  // Generate Sitemap
  await generateSitemap(distPublic);

  console.log('✓ SSG complete!');
}

prerender()
  .then(() => {
    console.log('✓ Prerender completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Prerender failed:', err);
    process.exit(1);
  });

