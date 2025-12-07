import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

/**
 * Animated number counter that counts up from 0 to the target value
 * Respects user's motion preferences
 */
export function AnimatedNumber({
    value,
    duration = 1000,
    decimals = 0,
    prefix = '',
    suffix = '',
    className = ''
}: AnimatedNumberProps) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        // If reduced motion, just show the final value
        if (prefersReducedMotion) {
            node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
            return;
        }

        const startTime = Date.now();
        const startValue = 0;
        const endValue = value;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (endValue - startValue) * easeOut;
            node.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration, decimals, prefix, suffix, prefersReducedMotion]);

    return <span ref={nodeRef} className={className} />;
}

interface AnimatedCurrencyProps {
    amount: number;
    currency?: string;
    locale?: string;
    duration?: number;
    className?: string;
}

/**
 * Animated currency display with proper formatting
 */
export function AnimatedCurrency({
    amount,
    currency = 'EUR',
    locale = 'de-DE',
    duration = 1000,
    className = ''
}: AnimatedCurrencyProps) {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        });

        // If reduced motion, just show the final value
        if (prefersReducedMotion) {
            node.textContent = formatter.format(amount);
            return;
        }

        const startTime = Date.now();
        const startValue = 0;
        const endValue = amount;

        const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (endValue - startValue) * easeOut;
            node.textContent = formatter.format(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [amount, currency, locale, duration, prefersReducedMotion]);

    return <span ref={nodeRef} className={className} />;
}

interface AnimatedPercentageProps {
    value: number;
    duration?: number;
    decimals?: number;
    className?: string;
}

/**
 * Animated percentage display
 */
export function AnimatedPercentage({
    value,
    duration = 1000,
    decimals = 1,
    className = ''
}: AnimatedPercentageProps) {
    return (
        <AnimatedNumber
            value={value}
            duration={duration}
            decimals={decimals}
            suffix="%"
            className={className}
        />
    );
}
