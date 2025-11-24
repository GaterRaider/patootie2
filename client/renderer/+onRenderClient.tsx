import { hydrateRoot } from "react-dom/client";
import App from "../src/App";
import { HelmetProvider } from "react-helmet-async";

export { onRenderClient };

async function onRenderClient(pageContext: any) {
    hydrateRoot(
        document.getElementById("root")!,
        <HelmetProvider>
            <App />
        </HelmetProvider>
    );
}
