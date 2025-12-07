import { motion, HTMLMotionProps } from 'framer-motion';
import { TableRow } from '@/components/ui/table';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type TableRowProps = React.ComponentProps<typeof TableRow>;

// Omit conflicting event handlers that have different signatures in Framer Motion
interface AnimatedTableRowProps extends Omit<TableRowProps, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "style"> {
    index?: number;
    // Allow motion props if needed, though usually standard props suffice
}

export function AnimatedTableRow({
    children,
    index = 0,
    ...props
}: AnimatedTableRowProps) {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
        return <TableRow {...(props as TableRowProps)}>{children}</TableRow>;
    }

    return (
        <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                delay: index * 0.03, // Faster stagger for tables
                duration: 0.3,
                ease: 'easeOut'
            }}
            className={props.className}
            {...(props as HTMLMotionProps<"tr">)}
        >
            {children}
        </motion.tr>
    );
}
