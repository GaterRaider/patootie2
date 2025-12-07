# 🚀 Phase 1 Quick Reference Card

## Import Statements

```typescript
// Motion Components
import { 
  PageTransition, 
  StaggerContainer, 
  StaggerItem,
  FadeIn,
  AnimatedPresenceWrapper 
} from '@/components/motion';

// Animation Variants
import { 
  scaleOnHover,
  hoverLift,
  fadeInUp,
  slideInFromLeft,
  pageVariants,
  containerVariants
} from '@/lib/animations';

// Hooks
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Framer Motion
import { motion } from 'framer-motion';
```

## Common Patterns

### 1. Page with Transition
```typescript
<PageTransition>
  <YourPageContent />
</PageTransition>
```

### 2. Staggered Grid
```typescript
<StaggerContainer>
  <div className="grid gap-4 md:grid-cols-3">
    {items.map(item => (
      <StaggerItem key={item.id}>
        <Card>{item.content}</Card>
      </StaggerItem>
    ))}
  </div>
</StaggerContainer>
```

### 3. Hover Effect
```typescript
<motion.div {...scaleOnHover}>
  <Button>Click Me</Button>
</motion.div>
```

### 4. Glassmorphic Card
```typescript
<Card className="glass shadow-modern">
  <CardContent>Content</CardContent>
</Card>
```

### 5. Gradient Background
```typescript
<div className="gradient-primary rounded-xl p-6 text-white">
  <h3>Title</h3>
</div>
```

### 6. Fade In with Delay
```typescript
<FadeIn delay={0.3}>
  <Component />
</FadeIn>
```

### 7. Custom Animation
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  <Content />
</motion.div>
```

### 8. Conditional with Exit
```typescript
<AnimatedPresenceWrapper mode="wait">
  {isVisible && (
    <motion.div exit={{ opacity: 0 }}>
      <Component />
    </motion.div>
  )}
</AnimatedPresenceWrapper>
```

## CSS Classes

| Class | Effect |
|-------|--------|
| `.glass` | Glassmorphism (70% opacity, 12px blur) |
| `.glass-strong` | Strong glass (85% opacity, 16px blur) |
| `.shadow-modern` | Multi-layer modern shadow |
| `.shadow-glow` | Colored glow shadow |
| `.gradient-primary` | Deep indigo gradient |
| `.gradient-accent` | Vibrant teal gradient |
| `.gradient-radial` | Radial gradient |
| `.animate-fade-in` | CSS fade animation |
| `.animate-slide-up` | CSS slide up animation |
| `.animate-scale-in` | CSS scale animation |

## Animation Timings

| Type | Duration | Easing |
|------|----------|--------|
| Page transitions | 300ms | ease-out |
| Micro-interactions | 150ms | ease-in-out |
| Stagger delay | 100ms | - |
| Hover effects | 150-200ms | ease-out |
| Loading states | 1500ms | ease-in-out |

## Accessibility

All animations automatically respect `prefers-reduced-motion`:

```typescript
const prefersReducedMotion = useReducedMotion();

<motion.div
  animate={prefersReducedMotion ? false : { opacity: 1 }}
>
  Content
</motion.div>
```

## Pro Tips

1. **Keep it subtle** - Animations should enhance, not distract
2. **Use stagger sparingly** - Max 4-6 items for best effect
3. **Combine effects** - Glass + shadow + gradient = premium feel
4. **Test dark mode** - All utilities work in both themes
5. **Mobile first** - Animations are touch-optimized

## Common Combinations

### Premium Card
```typescript
<motion.div {...scaleOnHover}>
  <Card className="glass shadow-modern">
    <CardContent>Premium content</CardContent>
  </Card>
</motion.div>
```

### Hero Section
```typescript
<div className="gradient-radial p-12">
  <FadeIn>
    <h1 className="text-4xl text-white">Title</h1>
  </FadeIn>
</div>
```

### Interactive List
```typescript
<StaggerContainer>
  {items.map((item, i) => (
    <StaggerItem key={i}>
      <motion.div {...hoverLift}>
        <Card className="shadow-modern">
          {item.content}
        </Card>
      </motion.div>
    </StaggerItem>
  ))}
</StaggerContainer>
```

---

**Remember**: Less is more. Use animations purposefully! ✨
