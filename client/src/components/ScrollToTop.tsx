import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
    const [pathname] = useLocation();
    const prevPathnameRef = useRef<string | null>(null);

    useEffect(() => {
        const prevPathname = prevPathnameRef.current;
        prevPathnameRef.current = pathname;

        // Function to strip language prefix (/en, /ko, /de) and return the rest of the path
        // This allows us to detect if the route change is just a language switch
        const normalizePath = (path: string) => {
            return path.replace(/^\/(en|ko|de)(\/|$)/, '/');
        };

        // If this is the first mount (prevPathname is null), scroll to top
        if (prevPathname === null) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            return;
        }

        // If the path content is the same (ignoring language), do not scroll to top.
        // This handles language switching (preserves scroll position)
        if (normalizePath(prevPathname) === normalizePath(pathname)) {
            return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}
