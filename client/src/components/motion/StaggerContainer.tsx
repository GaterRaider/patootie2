import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
    index?: number;
}

/**
 * Container component that staggers the animation of its children.
 * Use with StaggerItem components for best results.
 * 
 * @example
 * <StaggerContainer>
 *   <StaggerItem><Card>1</Card></StaggerItem>
 *   <StaggerItem><Card>2</Card></StaggerItem>
 *   <StaggerItem><Card>3</Card></StaggerItem>
 * </StaggerContainer>
 */
export function StaggerContainer({
    children,
    className,
    delay = 0.1
}: StaggerContainerProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    const customVariants = {
        ...containerVariants,
        show: {
            ...containerVariants.show,
            transition: {
                staggerChildren: delay,
                delayChildren: delay
            }
        }
    };

    return (
        <motion.div
            variants={customVariants}
            initial="hidden"
            animate="show"
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Item component to be used inside StaggerContainer.
 * Animates in with a stagger effect.
 */
export function StaggerItem({ children, className, index }: StaggerItemProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            variants={itemVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
