# Design System Documentation

## Typography Hierarchy

### Headings (Semantic HTML)
- `<h1>` - 3xl (30px) - Bold - Page titles, main headings
- `<h2>` - 2xl (24px) - Bold - Section headings
- `<h3>` - xl (20px) - Semibold - Subsection headings
- `<h4>` - lg (18px) - Semibold - Card titles
- `<h5>` - base (16px) - Semibold - Small headings

### Body Text
- Large: text-lg (18px) - Important descriptions
- Base: text-base (16px) - Standard body text
- Small: text-sm (14px) - Labels, captions, helper text

## Button Hierarchy

### Quiz App (Standard & Embed Modes)

**Standard Mode:**
- `.btn-primary` - px-6 py-3, text-base - Primary actions
- `.btn-secondary` - px-6 py-3, text-base - Secondary actions
- `.btn-answer-scam` - px-6 py-3, text-base - Scam answer button
- `.btn-answer-safe` - px-6 py-3, text-base - Safe answer button

**Embed Mode (Compact):**
- `.btn-primary-sm` - px-4 py-2, text-sm - Primary actions
- `.btn-secondary-sm` - px-4 py-2, text-sm - Secondary actions
- `.btn-answer-scam-sm` - px-4 py-2, text-sm - Scam answer button
- `.btn-answer-safe-sm` - px-4 py-2, text-sm - Safe answer button

### Admin App
- `.btn-primary` - px-6 py-3 - Main actions (Publish, Save)
- `.btn-secondary` - px-6 py-3 - Alternative actions (Draft)
- `.btn-danger` - px-4 py-2 - Destructive actions (Remove)
- `.btn-ghost` - px-4 py-2 - Tertiary actions (Cancel)

## Form Elements (Admin)

- `.input-field` - px-4 py-2.5, text-base - Text inputs
- `.textarea-field` - px-4 py-2.5, text-base - Textareas

## Card Components

### Quiz App
- `.card` - p-8, rounded-xl, shadow-lg - Standard cards
- `.card-sm` - p-5, rounded-lg, shadow-md - Embed mode cards
- `.result-card-success` - p-5, border-2 - Success feedback
- `.result-card-error` - p-5, border-2 - Error feedback
- `.result-card-success-sm` - p-4, border - Compact success
- `.result-card-error-sm` - p-4, border - Compact error

### Admin App
- `.card` - p-6, rounded-lg, shadow-sm - Main content cards
- `.card-section` - p-5, rounded-lg - Nested sections

## Spacing Scale

### Margins & Padding
- Small: 3-4 (12-16px)
- Medium: 5-6 (20-24px)
- Large: 8 (32px)

### Gaps
- Compact: gap-2 (8px)
- Standard: gap-3 (12px)
- Comfortable: gap-4 (16px)

## Design Principles

1. **Clear Hierarchy**: Each element has a distinct size and weight
2. **Consistent Spacing**: Uses 4px base unit (Tailwind's spacing scale)
3. **Responsive Sizing**: Embed mode uses smaller, more compact sizing
4. **Semantic HTML**: Uses proper heading tags for accessibility
5. **Reusable Classes**: Component classes in @layer for consistency
6. **Touch Targets**: Minimum 44px height for interactive elements
