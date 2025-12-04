# Mobile-First Design

## Responsive Patterns

### Layout Strategy
- Mobile-first approach with progressive enhancement
- Bottom navigation bar for mobile (fixed at bottom, z-50)
- Desktop sidebar hidden on mobile
- Content padding adjusted: `px-4 py-4 pb-24` on mobile, `md:px-6 md:pb-4` on desktop
- Bottom padding (pb-24) accounts for mobile navigation bar

### Table to Card Transformation
Tables are difficult to use on mobile. Use conditional rendering:

```tsx
{/* Desktop Table */}
<Card className="hidden md:block">
  <DataTable ... />
</Card>

{/* Mobile Cards */}
<div className="space-y-3 md:hidden">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card layout with key info */}
    </Card>
  ))}
</div>
```

### Mobile Card Design
- Compact padding: `p-4` instead of `p-6`
- Vertical stacking of information
- Full-width action buttons with icons
- Badges and tags for categories/status
- Prominent display of key metrics (amount, date)

### Responsive Components

#### Headers
- Smaller icons on mobile: `size-10 md:size-12`
- Smaller text: `text-xl md:text-2xl`
- Stack elements vertically on mobile

#### Filters
- Stack filters vertically on mobile: `flex-col sm:flex-row`
- Full-width selects on mobile: `w-full sm:w-48`
- Group related filters together

#### Stats Cards
- Single column on mobile: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Smaller text and icons on mobile
- Hide less critical info on mobile

#### Forms
- Full-width inputs on mobile
- Larger touch targets (min 44x44px)
- Clear labels with icons
- Helper text for guidance

### Breakpoints
- Mobile: default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `md:` (≥ 768px)
- Large: `lg:` (≥ 1024px)

### Touch Targets
- Minimum 44x44px for interactive elements
- Adequate spacing between buttons (gap-2 or gap-3)
- Use `size="lg"` for primary actions on mobile

### Performance
- Lazy load images and heavy components
- Use `hidden md:block` to avoid rendering desktop-only content on mobile
- Minimize animations on mobile for better performance
