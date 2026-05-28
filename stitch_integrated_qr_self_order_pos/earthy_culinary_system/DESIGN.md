---
name: Earthy Culinary System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#51443b'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#837469'
  outline-variant: '#d5c3b7'
  surface-tint: '#825429'
  primary: '#825429'
  on-primary: '#ffffff'
  primary-container: '#c89060'
  on-primary-container: '#502a03'
  inverse-primary: '#f7ba86'
  secondary: '#9a4433'
  on-secondary: '#ffffff'
  secondary-container: '#ff937d'
  on-secondary-container: '#772a1b'
  tertiary: '#356759'
  on-tertiary: '#ffffff'
  tertiary-container: '#73a696'
  on-tertiary-container: '#003b2f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#f7ba86'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#673d14'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#7b2d1e'
  tertiary-fixed: '#b8eedb'
  tertiary-fixed-dim: '#9dd1c0'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#1b4f42'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
  page-bg: '#f8f6f1'
  card-surface: '#fafaf8'
  highlight-surface: '#FFF8F0'
  info-blue: '#6b9cc4'
  muted-text: '#666666'
  border-subtle: '#e5e5e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  subheading:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1280px
---

## Brand & Style
The design system is anchored in the "Burjo" (Bubur Kacang Ijo) culture—a ubiquitous Indonesian culinary staple known for warmth, community, and comfort. The brand personality is **inviting, organic, and efficient**, bridging the gap between traditional roadside warmth and modern digital reliability. 

The aesthetic style is **Corporate Minimalism with Tactile Warmth**. It avoids the clinical coldness of typical SaaS by utilizing a palette that stimulates appetite while maintaining a rigorous structural grid. The focus remains squarely on the food photography, using white space and soft cream surfaces to reduce cognitive load during the fast-paced ordering and POS checkout processes.

The target audience ranges from tech-savvy students using the mobile self-order interface to busy kitchen staff and cashiers requiring high-density data clarity on desktop POS terminals.

## Colors
The palette is intentionally earthy to evoke the organic nature of traditional ingredients. 

- **Primary (#C89060):** A warm, toasted brown used exclusively for high-priority conversion actions (e.g., "Add to Cart").
- **Secondary (#d97560):** A muted coral used for urgency, special offers, and quantity modifiers to differentiate from primary actions.
- **Tertiary (#4a7c6d):** A sage green reserved for success states, confirmations, and "Paid" statuses, providing a natural contrast to the warm palette.
- **Neutral (#2d2d2d):** Deep charcoal for high-readability typography and structural anchors.

The background system uses a tiered cream approach: `#f8f6f1` for the main canvas to reduce eye strain, and `#fafaf8` for interactive cards to provide a subtle visual lift without relying on heavy borders.

## Typography
The system utilizes a dual-font approach. **Inter** serves as the workhorse for most of the UI, chosen for its exceptional legibility and systematic feel across both mobile and desktop. **JetBrains Mono** is introduced specifically for labels and POS-specific data (receipts, order numbers, timestamps) to provide a distinct "utility" feel that separates metadata from content.

On mobile devices, headlines are scaled down to preserve vertical space, ensuring menu items remain visible above the fold. Line heights are kept generous in body text (1.6) to ensure ingredient lists and descriptions are readable in varied lighting conditions found in physical restaurants.

## Layout & Spacing
This design system employs a **4px base unit** spacing scale. The layout philosophy shifts based on the surface:

- **Self-Order (Mobile):** A fluid, single-column layout for menu feeds and a bottom-docked cart bar for accessibility. Margins are fixed at 16px to maximize screen real estate for food photography.
- **POS/Admin (Desktop):** A fixed 12-column grid within a 1280px container. It uses high-density spacing (8px–12px) to allow cashiers to view multiple order cards simultaneously without excessive scrolling.

Transitions between viewports use standard breakpoints: Mobile (<640px), Tablet (640px–1024px), and Desktop (>1024px). The spacing rhythm transitions from "Comfortable" on mobile to "Compact" on POS interfaces to support operational speed.

## Elevation & Depth
Depth is communicated primarily through **Tonal Layering** supplemented by **Ambient Shadows**. 

- **Level 0 (Base):** The cream background (`#f8f6f1`) acts as the furthest depth layer.
- **Level 1 (Cards):** Surfaces using `#fafaf8` with a subtle `Shadow SM` (5% opacity) provide a slight lift for interactive menu items.
- **Level 2 (Overlays):** Modals, bottom sheets, and floating cart buttons use `Shadow LG` (15% opacity) to create a distinct separation from the page content.

Shadows must never use pure black; they are tinted with the primary text color (`#2d2d2d`) to maintain the earthy, warm aesthetic. Low-contrast outlines (`1px solid #e5e5e5`) are used on Level 1 cards to define boundaries without adding visual weight.

## Shapes
The shape language is **Rounded**, reflecting the approachable and organic nature of the brand. 

- **Interactive Elements:** Buttons and form inputs use a `0.5rem` (8px) radius. 
- **Containers:** Menu cards and image containers use a softer `1rem` (12px) radius to feel more inviting.
- **Status Pills:** Badges and chips use a `1000px` (pill-shaped) radius to differentiate them from actionable buttons.

The use of rounded corners softens the systematic nature of the POS grid, making the professional admin tools feel more integrated with the friendly customer-facing application.

## Components

### Buttons
- **Primary:** Filled with `#C89060`, white text, 8px radius. Used for the "final" action in a flow.
- **Secondary:** Outlined with `#e5e5e5`, text in `#2d2d2d`. Used for "Add more" or "Cancel" actions.
- **Urgent/Special:** Filled with `#d97560`, used for quantity modifiers (+/-) and limited-time offers.

### Cards
- **Menu Card:** Minimalist with a focus on high-vibrancy food photography. Uses 12px radius and `#fafaf8` background. Price is highlighted in `info-blue`.
- **Order Card (POS):** Dense, text-heavy layout using `JetBrains Mono` for order numbers and `Inter` for item lists.

### Input Fields
- **Standard:** 1px border (`#e5e5e5`) that shifts to `#C89060` on focus. 
- **Order Notes:** Text areas for customization should use a slightly smaller font size (`body-sm`) to accommodate longer text without breaking the layout.

### Chips & Badges
- **Status Pills:** Used in the POS to indicate "Processing", "Completed", or "Cancelled". These use the tertiary palette with low-opacity background fills (e.g., green text on light green background).
- **Spicy Level:** Specific iconography (chili icons) or numerical chips using the secondary coral color to indicate intensity.

### POS-Specific Table
- High-density rows with alternating row colors (zebra striping) using `#fafaf8` and `#f8f6f1` to maintain readability across hundreds of transactions.