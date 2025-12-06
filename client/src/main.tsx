import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import App from "./App";
import { trpc } from "./lib/trpc";
import "./index.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
        },
    },
});

const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
            // Include credentials (cookies) with all requests
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: 'include',
                });
            },
        }),
    ],
});

const root = document.getElementById("root");
if (root) {
    const app = (
        <React.StrictMode>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <HelmetProvider>
                        <App />
                    </HelmetProvider>
                </QueryClientProvider>
            </trpc.Provider>
        </React.StrictMode>
    );

    if (root.hasChildNodes()) {
        ReactDOM.hydrateRoot(root, app);
    } else {
        ReactDOM.createRoot(root).render(app);
    }
}
