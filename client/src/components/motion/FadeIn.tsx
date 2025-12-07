import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

/**
 * Simple fade-in animation component.
 * 
 * @example
 * <FadeIn delay={0.2}>
 *   <div>Content that fades in</div>
 * </FadeIn>
 */
export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.3
}: FadeInProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay, duration }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedPresenceWrapperProps {
    children: React.ReactNode;
    mode?: 'wait' | 'sync' | 'popLayout';
}

/**
 * Wrapper around Framer Motion's AnimatePresence for easier use.
 * Handles exit animations when components are removed.
 * 
 * @example
 * <AnimatedPresenceWrapper mode="wait">
 *   {isVisible && (
 *     <motion.div exit={{ opacity: 0 }}>
 *       Content
 *     </motion.div>
 *   )}
 * </AnimatedPresenceWrapper>
 */
export function AnimatedPresenceWrapper({
    children,
    mode = 'sync'
}: AnimatedPresenceWrapperProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <>{children}</>;
    }

    return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
}
