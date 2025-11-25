import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { Router } from 'wouter';

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
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => { },
    removeEventListener: () => { },
    createElement: () => ({
      setAttribute: () => { },
      style: {}
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

    userAgent: 'Node.js'
  };
}

// Import providers and pages
import { trpc } from '../client/src/lib/trpc';
import { LanguageProvider } from '../client/src/contexts/LanguageContext';
import { ThemeProvider } from '../client/src/contexts/ThemeContext';
import { TooltipProvider } from '../client/src/components/ui/tooltip';
import Home from '../client/src/pages/Home';
import PrivacyPolicy from '../client/src/pages/PrivacyPolicy';
import Imprint from '../client/src/pages/Imprint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  { path: '/', component: Home, outPath: 'index.html' },
  { path: '/privacy-policy', component: PrivacyPolicy, outPath: 'privacy-policy/index.html' },
  { path: '/imprint', component: Imprint, outPath: 'imprint/index.html' },
];

// Static location hook for wouter
const staticLocation = (path: string) => () => [path, () => { }] as [string, (to: string) => void];

async function prerender() {
  console.log('Starting manual SSG prerendering...');

  const distPublic = path.join(__dirname, '../dist/public');
  const templatePath = path.join(distPublic, 'index.html');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at ${templatePath}. Run 'vite build' first.`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

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

    const helmetContext: any = {};

    const appHtml = renderToString(
      React.createElement(
        trpc.Provider,
        { client: trpcClient, queryClient },
        React.createElement(
          QueryClientProvider,
          { client: queryClient },
          React.createElement(
            HelmetProvider,
            { context: helmetContext },
            React.createElement(
              Router,
              { hook: staticLocation(route.path) },
              React.createElement(
                ThemeProvider,
                {},
                React.createElement(
                  LanguageProvider,
                  {},
                  React.createElement(
                    TooltipProvider,
                    {},
                    React.createElement(route.component)
                  )
                )
              )
            )
          )
        )
      )
    );

    const { helmet } = helmetContext;

    // Inject into template
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Inject Helmet data
    if (helmet) {
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
  }

  console.log('✓ SSG complete!');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
