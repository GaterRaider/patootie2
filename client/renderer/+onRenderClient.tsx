import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Router } from "wouter";

export { onRenderClient };

async function onRenderClient(pageContext: any) {
    const { Page } = pageContext;

    hydrateRoot(
        document.getElementById("root")!,
        <HelmetProvider>
            <Router>
                <Page />
            </Router>
        </HelmetProvider>
    );
}
