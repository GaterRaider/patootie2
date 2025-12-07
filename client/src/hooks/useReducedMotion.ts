import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user prefers reduced motion.
 * Respects the prefers-reduced-motion media query.
 * 
 * @returns {boolean} True if user prefers reduced motion
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * <motion.div
 *   animate={prefersReducedMotion ? false : { opacity: 1 }}
 * >
 *   Content
 * </motion.div>
 */
export function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        // Set initial value
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for changes
        const listener = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', listener);
            return () => mediaQuery.removeEventListener('change', listener);
        }
        // Fallback for older browsers
        else {
            // @ts-ignore - deprecated but needed for older browsers
            mediaQuery.addListener(listener);
            // @ts-ignore
            return () => mediaQuery.removeListener(listener);
        }
    }, []);

    return prefersReducedMotion;
}

/**
 * Hook to get animation config based on reduced motion preference.
 * Returns false if reduced motion is preferred, otherwise returns the config.
 * 
 * @param config - Animation configuration object
 * @returns Animation config or false
 * 
 * @example
 * const animationConfig = useAnimationConfig({ opacity: 1, y: 0 });
 * 
 * <motion.div animate={animationConfig}>
 *   Content
 * </motion.div>
 */
export function useAnimationConfig<T>(config: T): T | false {
    const prefersReducedMotion = useReducedMotion();
    return prefersReducedMotion ? false : config;
}
