import { useEffect, useRef } from "react";

import { useLocation } from "wouter";

export default function ScrollToTop() {
    const [pathname] = useLocation();
    const prevPathnameRef = useRef(pathname);

    useEffect(() => {
        const prevPathname = prevPathnameRef.current;
        prevPathnameRef.current = pathname;

        // Function to strip language prefix (/en, /ko, /de) and return the rest of the path
        // This allows us to detect if the route change is just a language switch
        const normalizePath = (path: string) => {
            return path.replace(/^\/(en|ko|de)(\/|$)/, '/');
        };

        // If the path content is the same (ignoring language), do not scroll to top.
        // This handles:
        // 1. Language switching (preserves scroll position)
        // 2. Page refresh (allows browser native scroll restoration)
        if (normalizePath(prevPathname) === normalizePath(pathname)) {
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // Backup scroll to ensure it catches after render
        const timeout = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }, 10);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}
