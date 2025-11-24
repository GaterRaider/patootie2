import { renderToString } from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import { HelmetProvider } from "react-helmet-async";
import App from "../src/App";
import { Router } from "wouter";

export { onRenderHtml };

async function onRenderHtml(pageContext: any) {
    const helmetContext: any = {};

    // Wouter SSR integration: mock location
    const staticLocationHook = (path = pageContext.urlPathname) => [path, (to: string) => { }];

    const pageHtml = renderToString(
        <HelmetProvider context={helmetContext}>
            <Router hook={staticLocationHook}>
                <App />
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
