import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider, HydrationBoundary, type DehydratedState } from "@tanstack/react-query";
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
    const dehydratedState = (window as any).__REACT_QUERY_STATE__
        ? superjson.parse<DehydratedState>((window as any).__REACT_QUERY_STATE__)
        : undefined;

    const app = (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    <HelmetProvider>
                        <App initialLanguage={
                            window.location.pathname.startsWith('/ko') ? 'ko' :
                                window.location.pathname.startsWith('/de') ? 'de' :
                                    'en'
                        } />
                    </HelmetProvider>
                </HydrationBoundary>
            </QueryClientProvider>
        </trpc.Provider>
    );

    if (root.hasChildNodes()) {
        // Hydrate pre-rendered content without StrictMode to avoid mismatch
        ReactDOM.hydrateRoot(root, app, {
            onRecoverableError: (error, errorInfo) => {
                console.error("Hydration Error:", error);
                console.error("Hydration Error Info:", errorInfo);
            }
        });
    } else {
        // For client-only renders (dev mode), we can use StrictMode
        ReactDOM.createRoot(root).render(
            <React.StrictMode>
                {app}
            </React.StrictMode>
        );
    }
}
