import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper component for page-level animations.
 * Provides consistent enter/exit animations for all admin pages.
 * Automatically respects user's reduced motion preferences.
 * 
 * @example
 * export default function AdminDashboard() {
 *   return (
 *     <PageTransition>
 *       <h1>Dashboard</h1>
 *       {/* page content *\/}
 *     </PageTransition>
 *   );
 * }
 */
export function PageTransition({ children, className }: PageTransitionProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
