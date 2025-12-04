# Dark Mode Guidelines

## Color Adjustments for Dark Mode

### Background Colors
Always add dark mode variants for background colors to ensure proper contrast:

```tsx
// Light backgrounds need darker variants
className="bg-primary/10 dark:bg-primary/20"
className="bg-destructive/10 dark:bg-destructive/20"
className="bg-secondary/10 dark:bg-secondary/20"

// White overlays need reduced opacity
className="bg-white/10 dark:bg-white/5"
className="bg-white/20 dark:bg-white/10"
```

### Text Colors
Destructive and accent colors need adjustment in dark mode:

```tsx
// Destructive text
className="text-destructive dark:text-red-400"

// Blue accent text
className="text-blue-700 dark:text-blue-400"

// Muted text automatically adapts via theme
className="text-muted-foreground"
```

### Borders
Reduce border opacity in dark mode for softer appearance:

```tsx
className="border-border/50 dark:border-border/30"
className="border-white/20 dark:border-white/10"
```

### Shadows
Adjust shadow colors and intensity for dark mode:

```tsx
className="hover:shadow-lg dark:hover:shadow-primary/10"
className="shadow-xl dark:shadow-primary/20"
```

### Gradients
Reduce gradient intensity in dark mode:

```tsx
className="bg-linear-to-br from-primary/90 via-primary to-primary/80 
           dark:from-primary/80 dark:via-primary/70 dark:to-primary/60"
```

## Component-Specific Patterns

### Cards
```tsx
<Card className="border-border/50 dark:border-border/30">
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Icon Backgrounds
```tsx
<div className="bg-primary/10 text-primary dark:bg-primary/20">
  <Icon className="size-6" />
</div>
```

### Badges
```tsx
<span className="bg-primary/10 text-primary dark:bg-primary/20">
  Badge Text
</span>

<span className="bg-destructive/10 text-destructive 
               dark:bg-destructive/20 dark:text-red-400">
  Destructive Badge
</span>
```

### Hover States
```tsx
<Button className="hover:bg-primary/10 dark:hover:bg-primary/20">
  Button
</Button>
```

## Testing Dark Mode

1. Always test both light and dark modes
2. Check contrast ratios meet WCAG standards
3. Verify text readability on all backgrounds
4. Test hover and active states in both modes
5. Ensure icons are visible in both themes

## Common Issues to Avoid

❌ **Don't:**
- Use pure white or black without opacity
- Forget to add dark mode variants for custom colors
- Use the same opacity values for light and dark
- Rely only on color to convey information

✅ **Do:**
- Use semantic color tokens (primary, destructive, muted-foreground)
- Add dark: variants for all custom background colors
- Reduce opacity/intensity in dark mode
- Test in both modes regularly
- Use icons alongside color for better accessibility

## Semantic Color Tokens

These automatically adapt to dark mode:
- `bg-background` - Main background
- `bg-card` - Card backgrounds
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `border-border` - Default borders
- `bg-primary` / `text-primary` - Primary brand color
- `bg-destructive` / `text-destructive` - Error/danger states
- `bg-secondary` / `text-secondary-foreground` - Secondary elements

Use these whenever possible instead of custom colors.
