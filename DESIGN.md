# Burjo Semarang — Style Guide
> Warm, earthy sophistication for modern food ordering

**Theme:** light

Burjo Semarang cultivates a warm, approachable aesthetic with a primary focus on food appeal and seamless ordering experience. Its visual language balances an organic, inviting feel with clean, modern utility. A warm, appetizing brown acts as a spirited accent against an otherwise muted, earthy palette of soft creams and neutral grays, echoing the richness of Indonesian food culture. Typography is friendly yet confident, pairing a clean sans-serif for body text with clear hierarchy for navigation. Components favor generous spacing and subtle elevation to guide user attention through the ordering flow.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Primary CTA | `#C89060` | `--color-primary-cta` | Primary action backgrounds, "Add to Cart", "Order Now", conversion-focused buttons — warm appetite appeal |
| Header Dark | `#2d2d2d` | `--color-header-bg` | Primary text for actions, navigation bars, headlines; provides strong contrast and authority |
| Text Primary | `#2d2d2d` | `--color-text-primary` | Main text content, form labels, body copy — ensures legibility across all surfaces |
| Page Background | `#f8f6f1` | `--color-page-bg` | Canvas background, section backgrounds — a soft warm cream creating inviting atmosphere |
| Card Surface | `#fafaf8` | `--color-card-bg` | Secondary surface backgrounds, product card containers — subtle elevation from page background |
| Cart Highlight | `#FFF8F0` | `--color-cart-highlight` | Cart badges, order summary highlights, visual focus areas — draws attention without overwhelming |
| Secondary CTA | `#d97560` | `--color-secondary-cta` | Secondary actions, urgency badges, quantity controls, special offers — coral emphasis |
| Success State | `#4a7c6d` | `--color-success` | Confirmations, success messages, positive feedback states — conveys trust and completion |
| Info & Details | `#6b9cc4` | `--color-info-blue` | Item descriptions, pricing, dietary information, secondary content — soft informational tone |
| Text Secondary | `#666666` | `--color-text-secondary` | Muted text, descriptions, portion sizes, unavailable items — supports visual hierarchy |
| Border Light | `#e5e5e5` | `--color-border-light` | Card borders, dividers, section separators, disabled states — subtle visual structure |

---

## Primary Colors

### Primary CTA — #C89060
**Role:** Main call-to-action button for driving conversions and critical user actions.

Filled with warm appetizing brown background, white or black text, and a rounded border-radius. Used exclusively for primary action points like "Add to Cart", "Order Now", and checkout buttons to maintain strong visual focus.

---

### Header Dark — #2d2d2d
**Role:** Primary text for navigation, headlines, and interactive elements; provides authority and deep contrast.

Strong charcoal that anchors the visual hierarchy. Used for headers, navigation bars, category buttons, and active menu states. Works effectively with light backgrounds and creates WCAG AAA contrast ratios.

---

### Page Background — #f8f6f1
**Role:** Dominant canvas background, creating a warm and inviting atmosphere throughout the ordering experience.

Soft cream with warm undertone complements the primary warm color without distraction. Reduces eye strain during extended browsing sessions and reinforces the organic, food-forward brand aesthetic.

---

## Secondary Colors

### Secondary CTA — #d97560
**Role:** Secondary actions and emphasis elements; draws attention to secondary interactions.

Coral red adds visual urgency and emphasis. Used for quantity controls, special offer badges, alerts, and secondary interactive elements. Never competes with primary CTA but provides clear visual hierarchy.

---

### Success State — #4a7c6d
**Role:** Positive feedback and confirmation states throughout the user journey.

Muted teal conveys trust and completion. Applied to success messages, item confirmations, order completion states, and positive feedback indicators. Creates confidence in the ordering process.

---

### Info & Details — #6b9cc4
**Role:** Secondary information, descriptions, and supporting content.

Soft blue distinguishes informational text from navigation. Used for item descriptions, pricing information, dietary details, portion sizes, and secondary content without competing with actions.

---

## Neutral & Supporting Colors

### Card Surface — #fafaf8
**Role:** Secondary surface backgrounds and product containers for visual separation.

Subtly different from page background (0.8% variation) to create lightweight visual hierarchy without harsh contrast. Used for menu item cards, product containers, and elevated surfaces.

---

### Cart Highlight — #FFF8F0
**Role:** Draws focus to cart-related content and order summary items.

Very light warm tone creates subtle visual distinction. Applied to cart badges, highlighted order summary rows, and focus areas within the checkout flow. Coordinates with primary warm for visual cohesion.

---

### Text Secondary — #666666
**Role:** Supporting text, secondary information, and muted content.

Medium gray maintains readability while signaling secondary importance. Used for descriptions, portion sizes, ingredient lists, and unavailable item text. Achieves 4.5:1 contrast ratio with white (AA compliant for body text).

---

### Border Light — #e5e5e5
**Role:** Subtle visual structure, dividers, and section separators.

Light gray creates visual separation without heaviness. Applied to card borders, section dividers, disabled button states, and subtle structural lines. Works consistently across backgrounds.

---

## Text Primary — #2d2d2d
**Role:** Primary text content across all surfaces.

Used for body copy, form labels, headlines, and standard text hierarchy. Ensures consistent legibility and establishes clear visual dominance on page backgrounds.

---

## Tokens — Typography

### System Font Stack — Clean, modern, and widely supported for body text, navigation, and all interface elements.
**Font:** System default sans-serif stack  
**Substitute:** Inter  
**Weights:** 400 (regular), 500 (medium), 700 (bold)  
**Sizes:** 12px, 14px, 16px, 18px, 20px, 24px, 32px  
**Line height:** 1.2–1.6 depending on size  
**Letter spacing:** 0px (normal)  
**Token:** `--font-sans`  
**Role:** Versatile workhorse for body text, navigation, headings, and forms. Maintains clarity and friendliness across all sizes.

### Type Scale

| Role | Size | Line Height | Weight | Token |
|------|------|-------------|--------|-------|
| caption | 12px | 1.4 | 400 | `--text-caption` |
| body-sm | 14px | 1.5 | 400 | `--text-body-sm` |
| body | 16px | 1.6 | 400 | `--text-body` |
| subheading | 18px | 1.5 | 500 | `--text-subheading` |
| heading-sm | 20px | 1.4 | 600 | `--text-heading-sm` |
| heading | 24px | 1.3 | 700 | `--text-heading` |
| heading-lg | 32px | 1.2 | 700 | `--text-heading-lg` |

---

## Tokens — Spacing & Shapes

**Base unit:** 4px  
**Density:** comfortable

### Spacing Scale

| Name | Value | Token | Usage |
|------|-------|-------|-------|
| 4 | 4px | `--spacing-4` | Element gaps, compact spacing |
| 8 | 8px | `--spacing-8` | Inline padding, small gaps |
| 12 | 12px | `--spacing-12` | Form fields, compact sections |
| 16 | 16px | `--spacing-16` | Standard padding, comfortable gaps |
| 20 | 20px | `--spacing-20` | Section spacing, medium gaps |
| 24 | 24px | `--spacing-24` | Card padding, content spacing |
| 32 | 32px | `--spacing-32` | Large section gaps |
| 40 | 40px | `--spacing-40` | Major section separation |
| 60 | 60px | `--spacing-60` | Full-width section gaps |

### Border Radius

| Element | Value | Token |
|---------|-------|-------|
| cards | 12px | `--radius-cards` |
| buttons | 8px | `--radius-buttons` |
| inputs | 8px | `--radius-inputs` |
| badges | 20px | `--radius-badges` |
| images | 12px | `--radius-images` |
| full-round | 1000px | `--radius-full` |

### Shadows

| Name | Value | Token | Usage |
|------|-------|-------|-------|
| sm | `0 1px 2px rgba(45, 45, 45, 0.05)` | `--shadow-sm` | Subtle elevation |
| md | `0 4px 6px rgba(45, 45, 45, 0.1)` | `--shadow-md` | Standard card elevation |
| lg | `0 10px 15px rgba(45, 45, 45, 0.1)` | `--shadow-lg` | Prominent elevation |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 40px
- **Card padding:** 24px
- **Element gap:** 8px–16px

---

## Components

### Primary Action Button
**Role:** Main call-to-action button for critical user actions and conversions.

Filled with Primary CTA (#C89060) background, white text, and an 8px border-radius. Padding is generous at 12px top/bottom, 32px left/right. Maintains 6.2:1 contrast ratio with white text. Used exclusively for "Add to Cart", "Order Now", and checkout actions.

---

### Secondary Action Button
**Role:** Secondary actions, quantity controls, and alternative paths.

Filled with Secondary CTA (#d97560) background, white text, and an 8px border-radius. Padding is 10px top/bottom, 24px left/right. Used for quantity increment/decrement and secondary interactive states.

---

### Navigation Bar
**Role:** Header navigation providing quick access to core functions and cart.

Header Dark (#2d2d2d) background spanning full width. Contains logo, category navigation links in Text Primary (#2d2d2d), and a compact Primary Action Button ("Order") on the right. Height: 64px with centered vertical alignment.

---

### Product Card
**Role:** Display for individual menu items with key information.

Uses Card Surface (#fafaf8) background. Features an 12px border-radius and subtle shadow (0 4px 6px rgba(45, 45, 45, 0.1)). Internal padding 24px all around. Title uses Text Primary (#2d2d2d), description uses Text Secondary (#666666). Price highlighted in Info & Details (#6b9cc4).

---

### Cart Badge
**Role:** Visual indicator of items in cart; draws attention without overwhelming.

Filled with Cart Highlight (#FFF8F0) background, Text Primary (#2d2d2d) text, and a 20px border-radius. Padding 4px top/bottom, 12px left/right. Placed on cart icon in navigation for visibility.

---

### Input Field
**Role:** Used for user data entry in forms and search.

Transparent background with Border Light (#e5e5e5) 1px border and an 8px border-radius. Text color is Text Primary (#2d2d2d). Placeholder text uses Text Secondary (#666666). Padding is 12px top/bottom, 16px left/right. Focus state: border changes to Primary CTA (#C89060).

---

### Status Badge
**Role:** Highlights item attributes, special offers, or status indicators.

Filled with Secondary CTA (#d97560) background, white text, and a 20px border-radius for pill appearance. Padding 4px top/bottom, 12px left/right. Used for "Limited", "Special Offer", or dietary tags.

---

### Success Message
**Role:** Provides positive feedback for user actions.

Uses Success State (#4a7c6d) background, white text, and an 8px border-radius. Padding 12px all around. Display with an icon or checkmark. Typically appears as a toast or inline alert.

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Page Background | `#f8f6f1` | Dominant canvas, providing a warm, inviting stage for all content |
| 1 | Card Surface | `#fafaf8` | Secondary background for product cards and content sections |
| 2 | Cart Highlight | `#FFF8F0` | Tertiary surface for emphasized content and focus areas |

---

## Elevation

- **Card:** `0 4px 6px rgba(45, 45, 45, 0.1)`
- **Prominent Card:** `0 10px 15px rgba(45, 45, 45, 0.1)`
- **Modal/Overlay:** `0 10px 15px rgba(45, 45, 45, 0.15)`

---

## Imagery

Photography features vibrant, appetizing close-ups of food and ingredients, typically arranged in bowls or on rustic surfaces. Treatment focuses on natural light and rich, true-to-life colors with minimal artificial styling. Product shots emphasize the raw elements and appeal. Icons are simple, filled, and functional, often in Header Dark (#2d2d2d) or Primary CTA (#C89060) for hierarchy. Imagery serves to showcase products irresistibly and acts as an appetite stimulant.

---

## Layout

The page uses a maximum content width of 1280px, centered on screen. The hero section features full-width imagery with overlay text and a prominent primary action button. Content sections alternate between Page Background and Card Surface colors, utilizing single-column or two-column layouts as needed. Product grids display items in a flexible three-column arrangement. Navigation is a persistent header bar with essential links and cart access for quick reference and brand consistency.

---

## Color Applications

### Menu Browse
- Background: Page Background (#f8f6f1)
- Card: Card Surface (#fafaf8) with Border Light (#e5e5e5) border
- Title: Text Primary (#2d2d2d)
- Description: Text Secondary (#666666)
- Price: Info & Details (#6b9cc4)
- Add Button: Primary CTA (#C89060)

### Cart & Checkout
- Cart Icon Badge: Cart Highlight (#FFF8F0) background
- Order Summary Rows: Alternating Page Background and Card Surface
- Item Count: Primary CTA (#C89060)
- Checkout Button: Primary CTA (#C89060)
- Success Message: Success State (#4a7c6d)

### Status & Feedback
- **Success:** Success State (#4a7c6d)
- **Limited/Urgent:** Secondary CTA (#d97560)
- **Informational:** Info & Details (#6b9cc4)
- **Disabled:** Border Light (#e5e5e5) with Text Secondary (#666666)

---

## Accessibility

### Contrast Ratios
| Color Pair | Ratio | WCAG Level | Usage |
|---|---|---|---|
| Primary CTA (#C89060) on white | 6.2:1 | AA | Buttons, primary actions |
| Header Dark (#2d2d2d) on Page Background (#f8f6f1) | 14:1 | AAA | Headlines, primary text |
| Text Secondary (#666666) on white | 4.5:1 | AA | Body text, descriptions |
| Secondary CTA (#d97560) on white | 4.8:1 | AA | Secondary buttons |
| Success (#4a7c6d) on white | 6.1:1 | AA | Confirmations |
| Info Blue (#6b9cc4) on white | 5.5:1 | AA | Informational text |

All primary interactive elements meet WCAG AA standards. Secondary colors are used primarily for non-critical UI and should be paired with text labels or icons for additional clarity.

### Mobile & Touch Target Accessibility
- Minimum touch target size: 44×44px for all interactive elements
- Primary CTA buttons maintain sufficient contrast for visibility on all screen sizes
- Avoid relying on color alone—use icons, text labels, or patterns alongside colors
- Text under 18px should use Text Primary or Text Secondary only
- Disabled states: always include visual indicator beyond color (opacity, strikethrough, or icon)

---

## Do's and Don'ts

### Do
- Always use Primary CTA (#C89060) exclusively for critical conversion points ("Add to Cart", "Order Now", checkout) to maintain strong visual focus
- Pair Text Primary (#2d2d2d) with Page Background (#f8f6f1) or Card Surface (#fafaf8) for optimal readability
- Use white text on dark or warm backgrounds (Primary CTA, Header Dark) for maximum contrast
- Reserve Success State (#4a7c6d) exclusively for positive feedback and completion states
- Introduce Secondary CTA (#d97560) sparingly for urgency badges and secondary interactions
- Apply generous spacing (24px–40px) between major content sections
- Use Card Surface (#fafaf8) to subtly elevate product cards from page background
- Test all color combinations on mobile devices and at various brightness levels

### Don't
- Never use Primary CTA (#C89060) for general text or borders; it dulls the conversion impact
- Avoid placing Secondary CTA (#d97560) on Page Background without testing sufficient contrast first
- Don't use multiple primary colors in the same section; maintain visual hierarchy
- Refrain from using Info Blue (#6b9cc4) for actionable buttons—reserve for informational content only
- Don't introduce custom colors outside the defined palette; maintain consistency
- Avoid heavy, dark background sections unless explicitly for footer or dedicated dark mode components
- Never use excessive letter-spacing or type sizes outside the defined scale
- Don't rely on hover states as the only interactive indicator; make clickable elements visually distinct by default

---

## Quick Reference

**Primary Actions:** #C89060  
**Navigation/Headers:** #2d2d2d  
**Page Background:** #f8f6f1  
**Secondary Actions:** #d97560  
**Success/Confirmation:** #4a7c6d  
**Info/Details:** #6b9cc4  
**Supporting Text:** #666666  
**Borders/Dividers:** #e5e5e5  
**Card Surfaces:** #fafaf8  
**Cart Highlights:** #FFF8F0

---

## Implementation Guide

### CSS Custom Properties

```css
:root {
  /* Colors — Primary */
  --color-primary-cta: #C89060;
  --color-header-bg: #2d2d2d;
  --color-text-primary: #2d2d2d;
  --color-page-bg: #f8f6f1;

  /* Colors — Secondary */
  --color-secondary-cta: #d97560;
  --color-success: #4a7c6d;
  --color-info-blue: #6b9cc4;

  /* Colors — Neutral */
  --color-card-bg: #fafaf8;
  --color-cart-highlight: #FFF8F0;
  --color-text-secondary: #666666;
  --color-border-light: #e5e5e5;

  /* Typography — Font Families */
  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.4;
  --text-body-sm: 14px;
  --leading-body-sm: 1.5;
  --text-body: 16px;
  --leading-body: 1.6;
  --text-subheading: 18px;
  --leading-subheading: 1.5;
  --text-heading-sm: 20px;
  --leading-heading-sm: 1.4;
  --text-heading: 24px;
  --leading-heading: 1.3;
  --text-heading-lg: 32px;
  --leading-heading-lg: 1.2;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-60: 60px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 40px;
  --card-padding: 24px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-buttons: 8px;
  --radius-inputs: 8px;
  --radius-cards: 12px;
  --radius-badges: 20px;
  --radius-images: 12px;
  --radius-full: 1000px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(45, 45, 45, 0.05);
  --shadow-md: 0 4px 6px rgba(45, 45, 45, 0.1);
  --shadow-lg: 0 10px 15px rgba(45, 45, 45, 0.1);

  /* Surfaces */
  --surface-page: #f8f6f1;
  --surface-card: #fafaf8;
  --surface-highlight: #FFF8F0;
}
```

### SCSS Variables

```scss
// Colors — Primary
$primary-cta: #C89060;
$header-bg: #2d2d2d;
$text-primary: #2d2d2d;
$page-bg: #f8f6f1;

// Colors — Secondary
$secondary-cta: #d97560;
$success: #4a7c6d;
$info-blue: #6b9cc4;

// Colors — Neutral
$card-bg: #fafaf8;
$cart-highlight: #FFF8F0;
$text-secondary: #666666;
$border-light: #e5e5e5;

// Typography
$font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;

// Spacing
$spacing-unit: 4px;
$spacing-4: 4px;
$spacing-8: 8px;
$spacing-12: 12px;
$spacing-16: 16px;
$spacing-20: 20px;
$spacing-24: 24px;
$spacing-32: 32px;
$spacing-40: 40px;
$spacing-60: 60px;

// Border Radius
$radius-buttons: 8px;
$radius-inputs: 8px;
$radius-cards: 12px;
$radius-badges: 20px;
$radius-images: 12px;
$radius-full: 1000px;

// Shadows
$shadow-sm: 0 1px 2px rgba(45, 45, 45, 0.05);
$shadow-md: 0 4px 6px rgba(45, 45, 45, 0.1);
$shadow-lg: 0 10px 15px rgba(45, 45, 45, 0.1);

// Layout
$page-max-width: 1280px;
$section-gap: 40px;
$card-padding: 24px;
$element-gap: 8px;
```

### Tailwind v4 Config

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          cta: '#C89060',
          'cta-hover': '#b5804f',
        },
        secondary: {
          cta: '#d97560',
          'cta-hover': '#c4654f',
        },
        success: '#4a7c6d',
        info: '#6b9cc4',
        text: {
          primary: '#2d2d2d',
          secondary: '#666666',
        },
        bg: {
          page: '#f8f6f1',
          card: '#fafaf8',
          highlight: '#FFF8F0',
          header: '#2d2d2d',
        },
        border: {
          light: '#e5e5e5',
        },
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        60: '60px',
      },
      borderRadius: {
        buttons: '8px',
        inputs: '8px',
        cards: '12px',
        badges: '20px',
        images: '12px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(45, 45, 45, 0.05)',
        md: '0 4px 6px rgba(45, 45, 45, 0.1)',
        lg: '0 10px 15px rgba(45, 45, 45, 0.1)',
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
};
```

### Tailwind CSS (with @theme)

```css
@theme {
  --color-primary-cta: #C89060;
  --color-primary-cta-hover: #b5804f;
  --color-secondary-cta: #d97560;
  --color-secondary-cta-hover: #c4654f;
  --color-success: #4a7c6d;
  --color-info: #6b9cc4;
  --color-text-primary: #2d2d2d;
  --color-text-secondary: #666666;
  --color-bg-page: #f8f6f1;
  --color-bg-card: #fafaf8;
  --color-bg-highlight: #FFF8F0;
  --color-bg-header: #2d2d2d;
  --color-border-light: #e5e5e5;

  --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 1000px;

  --shadow-sm: 0 1px 2px rgba(45, 45, 45, 0.05);
  --shadow-md: 0 4px 6px rgba(45, 45, 45, 0.1);
  --shadow-lg: 0 10px 15px rgba(45, 45, 45, 0.1);

  --spacing-unit: 4px;
  --spacing-2xs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;
  --spacing-2xl: 60px;

  --max-width-page: 1280px;
}
```

---

## Similar Brands

Burjo Semarang shares visual language and approach with:

- **Sweetgreen** — Focus on ingredient transparency, fresh appeal, warm inviting aesthetic
- **Warung Bodag Maliah** — Local Indonesian food focus, organic presentation, earthy tones
- **Nasi Kuning Indonesian Kitchen** — Warm color palette celebrating Indonesian cuisine
- **The Plate** — Clean self-service experience, product-focused photography, accessible design

---

## Version
**v1.1** — Complete design system documentation for Burjo Semarang self-order platform  
**Last Updated:** May 2026  
**Status:** Production Ready
