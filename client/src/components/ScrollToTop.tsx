import { useEffect } from "react";

import { useLocation } from "wouter";

export default function ScrollToTop() {
    const [pathname] = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        // Backup scroll to ensure it catches after render
        const timeout = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }, 10);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}
