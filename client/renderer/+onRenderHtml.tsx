import { renderToString } from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";

export { onRenderHtml };

async function onRenderHtml(pageContext: any) {
  const { Page, urlPathname } = pageContext;
  const helmetContext: any = {};

  // Wouter SSR: improved static location hook
  const staticLocationHook = () => {
    let current = urlPathname;
    return [
      current,
      (to: string) => { current = to; },
    ];
  };

  const pageHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <Router hook={staticLocationHook}>
        <Page />
      </Router>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dangerouslySkipEscape(helmet?.title?.toString() || "")}
        ${dangerouslySkipEscape(helmet?.meta?.toString() || "")}
        ${dangerouslySkipEscape(helmet?.link?.toString() || "")}
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
}
