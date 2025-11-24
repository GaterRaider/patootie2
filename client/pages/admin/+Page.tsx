import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { UNAUTHED_ERR_MSG } from "../../../shared/const";
import superjson from "superjson";
import { trpc } from "../../src/lib/trpc";
import { getLoginUrl } from "../../src/const";
import AdminRouter from "../../src/AdminRouter";

// Top-level singletons (NOT inside component!)
const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
    if (!(error instanceof TRPCClientError)) return;
    if (typeof window === "undefined") return;
    const isUnauthorized = error.message === UNAUTHED_ERR_MSG;
    if (!isUnauthorized) return;
    window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
    if (event.type === "updated" && event.action.type === "error") {
        const error = event.query.state.error;
        redirectToLoginIfUnauthorized(error);
        console.error("[API Query Error]", error);
    }
});

queryClient.getMutationCache().subscribe(event => {
    if (event.type === "updated" && event.action.type === "error") {
        const error = event.mutation.state.error;
        redirectToLoginIfUnauthorized(error);
        console.error("[API Mutation Error]", error);
    }
});

// EXACT copy from main.tsx - transformer at top level
const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "/api/trpc",
            transformer: superjson,
            fetch(input, init) {
                return globalThis.fetch(input, {
                    ...(init ?? {}),
                    credentials: "include",
                });
            },
        }),
    ],
});

// No HelmetProvider here - it's in the renderer
export default function AdminApp() {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <AdminRouter />
            </QueryClientProvider>
        </trpc.Provider>
    );
}
