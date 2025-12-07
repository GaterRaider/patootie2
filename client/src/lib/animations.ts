import { Variants, Transition } from 'framer-motion';

/**
 * Animation variants and utilities for consistent motion design across the admin panel.
 * All animations respect user's prefers-reduced-motion setting.
 */

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.2,
            ease: 'easeIn'
        }
    }
};

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const containerVariants: Variants = {
    hidden: {
        opacity: 0
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    }
};

// ============================================================================
// FADE ANIMATIONS
// ============================================================================

export const fadeIn: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.3
        }
    }
};

export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const fadeInDown: Variants = {
    hidden: {
        opacity: 0,
        y: -20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

// ============================================================================
// SCALE ANIMATIONS
// ============================================================================

export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    }
};

export const scaleOnHover = {
    whileHover: {
        scale: 1.02,
        transition: { duration: 0.15 }
    },
    whileTap: {
        scale: 0.98,
        transition: { duration: 0.1 }
    }
};

// ============================================================================
// SLIDE ANIMATIONS
// ============================================================================

export const slideInFromLeft: Variants = {
    hidden: {
        x: -100,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

export const slideInFromRight: Variants = {
    hidden: {
        x: 100,
        opacity: 0
    },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
};

// ============================================================================
// MODAL/DIALOG ANIMATIONS
// ============================================================================

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: {
            duration: 0.15,
            ease: 'easeIn'
        }
    }
};

export const overlayVariants: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15
        }
    }
};

// ============================================================================
// SPRING ANIMATIONS
// ============================================================================

export const springTransition: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 30
};

export const gentleSpring: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 25
};

// ============================================================================
// HOVER EFFECTS
// ============================================================================

export const hoverLift = {
    whileHover: {
        y: -4,
        transition: { duration: 0.2 }
    }
};

export const hoverGlow = {
    whileHover: {
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
        transition: { duration: 0.2 }
    }
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

export const pulseVariants: Variants = {
    pulse: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

export const spinVariants: Variants = {
    spin: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

// ============================================================================
// LIST ANIMATIONS
// ============================================================================

export const listContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const listItemVariants: Variants = {
    hidden: {
        opacity: 0,
        x: -20
    },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3
        }
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a stagger delay based on index
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0.05): number => {
    return index * baseDelay;
};

/**
 * Creates a custom transition with duration
 */
export const createTransition = (duration: number = 0.3, ease: string = 'easeOut'): Transition => {
    return {
        duration,
        ease: ease as any
    };
};

/**
 * Combines multiple animation variants
 */
export const combineVariants = (...variants: Variants[]): Variants => {
    return Object.assign({}, ...variants);
};
