import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type BadgeProps = React.ComponentProps<typeof Badge>;

export function AnimatedBadge({ children, ...props }: BadgeProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <Badge {...props}>{children}</Badge>;
    }

    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                duration: 0.3
            }}
        >
            <Badge {...props}>{children}</Badge>
        </motion.div>
    );
}

export function PulsingBadge({ children, ...props }: BadgeProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <Badge {...props}>{children}</Badge>;
    }

    return (
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
                opacity: [1, 0.9, 1]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        >
            <Badge {...props}>{children}</Badge>
        </motion.div>
    );
}
