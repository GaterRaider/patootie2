import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    PageTransition,
    StaggerContainer,
    StaggerItem,
    FadeIn
} from '@/components/motion';
import {
    scaleOnHover,
    hoverLift,
    fadeInUp,
    slideInFromLeft,
    slideInFromRight
} from '@/lib/animations';
import { Sparkles, Zap, Rocket, Star } from 'lucide-react';

/**
 * Demo page showcasing all Phase 1 animation components and utilities.
 * This page demonstrates:
 * - Page transitions
 * - Stagger animations
 * - Glassmorphism
 * - Modern shadows
 * - Gradient backgrounds
 * - Hover effects
 * - Reduced motion support
 */
export default function AnimationDemo() {
    return (
        <PageTransition>
            <div className="space-y-8 p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl font-bold mb-2">Animation System Demo</h1>
                    <p className="text-muted-foreground">
                        Phase 1: Foundation & Animation System
                    </p>
                </motion.div>

                {/* Glassmorphism Examples */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Glassmorphism</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="glass shadow-modern">
                            <CardHeader>
                                <CardTitle>Glass Effect</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This card uses the .glass utility class with backdrop blur.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="glass-strong shadow-glow">
                            <CardHeader>
                                <CardTitle>Strong Glass Effect</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    This card uses .glass-strong with enhanced blur and glow shadow.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Gradient Backgrounds */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Gradient Backgrounds</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="gradient-primary rounded-xl p-6 text-white">
                            <h3 className="font-semibold mb-2">Primary Gradient</h3>
                            <p className="text-sm opacity-90">Deep indigo gradient</p>
                        </div>
                        <div className="gradient-accent rounded-xl p-6 text-white">
                            <h3 className="font-semibold mb-2">Accent Gradient</h3>
                            <p className="text-sm opacity-90">Vibrant teal gradient</p>
                        </div>
                        <div className="gradient-radial rounded-xl p-6 text-white">
                            <h3 className="font-semibold mb-2">Radial Gradient</h3>
                            <p className="text-sm opacity-90">Radial from top-right</p>
                        </div>
                    </div>
                </section>

                {/* Stagger Animation */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Stagger Animation</h2>
                    <StaggerContainer>
                        <div className="grid gap-4 md:grid-cols-4">
                            {[
                                { icon: Sparkles, title: 'Feature 1', color: 'text-purple-500' },
                                { icon: Zap, title: 'Feature 2', color: 'text-yellow-500' },
                                { icon: Rocket, title: 'Feature 3', color: 'text-blue-500' },
                                { icon: Star, title: 'Feature 4', color: 'text-pink-500' },
                            ].map((item, index) => (
                                <StaggerItem key={index}>
                                    <motion.div {...scaleOnHover}>
                                        <Card className="shadow-modern">
                                            <CardContent className="pt-6">
                                                <item.icon className={`h-8 w-8 mb-3 ${item.color}`} />
                                                <h3 className="font-semibold">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Card {index + 1} animates in sequence
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </div>
                    </StaggerContainer>
                </section>

                {/* Hover Effects */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Hover Effects</h2>
                    <div className="flex gap-4 flex-wrap">
                        <motion.div {...scaleOnHover}>
                            <Button>Scale on Hover</Button>
                        </motion.div>

                        <motion.div {...hoverLift}>
                            <Button variant="outline">Lift on Hover</Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button variant="secondary">Rotate on Hover</Button>
                        </motion.div>
                    </div>
                </section>

                {/* Directional Animations */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Directional Animations</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <motion.div
                            variants={slideInFromLeft}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="shadow-modern">
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">Slide from Left</h3>
                                    <p className="text-sm text-muted-foreground">
                                        This card slides in from the left side
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            variants={slideInFromRight}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="shadow-modern">
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">Slide from Right</h3>
                                    <p className="text-sm text-muted-foreground">
                                        This card slides in from the right side
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Fade In */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Fade In Component</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <FadeIn delay={0}>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm">Fades in immediately</p>
                                </CardContent>
                            </Card>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm">Fades in after 0.2s</p>
                                </CardContent>
                            </Card>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm">Fades in after 0.4s</p>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </section>

                {/* Modern Shadows */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Modern Shadows</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="shadow-modern">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">Modern Shadow</h3>
                                <p className="text-sm text-muted-foreground">
                                    Subtle multi-layer shadow for depth
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-glow">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-2">Glow Shadow</h3>
                                <p className="text-sm text-muted-foreground">
                                    Colored glow effect with shadow
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Info Section */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-8"
                >
                    <Card className="glass shadow-modern">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Accessibility Note
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                All animations respect the user's <code className="bg-muted px-1 py-0.5 rounded">prefers-reduced-motion</code> setting.
                                Users who prefer reduced motion will see instant transitions instead of animations.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </PageTransition>
    );
}
