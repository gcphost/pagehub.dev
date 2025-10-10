# PageHub Design System

This document outlines the default color palette and style guide used in PageHub's website builder.

## Color Palette

The default color palette provides a comprehensive set of colors for building beautiful websites. All colors can be customized through the Design System Panel in the editor.

### Brand Colors

| Color Name | Default Value | Usage |
|------------|---------------|-------|
| **Primary** | `blue-500` | Primary brand color, used for main CTAs, links, and key UI elements |
| **Primary Text** | `white` | Text color on primary backgrounds for optimal contrast |
| **Secondary** | `purple-500` | Secondary brand color for alternative CTAs and accents |
| **Secondary Text** | `white` | Text color on secondary backgrounds |
| **Accent** | `orange-500` | Accent color for highlights, badges, and attention-grabbing elements |
| **Accent Text** | `white` | Text color on accent backgrounds |

### Neutral Colors

| Color Name | Default Value | Usage |
|------------|---------------|-------|
| **Neutral** | `gray-500` | Neutral color for borders, dividers, and subtle UI elements |
| **Neutral Text** | `white` | Text color on neutral backgrounds |

### Background & Text Colors

| Color Name | Default Value | Usage |
|------------|---------------|-------|
| **Background** | `white` | Primary background color for main content areas |
| **Text** | `gray-900` | Primary text color for body content and headings |
| **Alternate Background** | `gray-50` | Secondary background color for sections, cards, and footers |
| **Alternate Text** | `gray-600` | Secondary text color for less prominent content |

### Using Palette Colors

In the editor, reference palette colors using the syntax: `palette:ColorName`

**Examples:**
- `bg-palette:Primary` - Sets background to Primary color
- `text-palette:Text` - Sets text to Text color
- `border-palette:Neutral` - Sets border to Neutral color

## Style Guide

The style guide defines consistent design tokens that can be referenced throughout your site. All values can be customized in the Design System Panel.

### Border Radius

| Property | Default Value | Description |
|----------|---------------|-------------|
| **borderRadius** | `rounded-lg` | Standard border radius for buttons, cards, and containers |

**Usage:** `radius: "style:borderRadius"`

**Available Options:**
- `rounded-none` - No rounding
- `rounded-sm` - Small (2px)
- `rounded` - Default (4px)
- `rounded-md` - Medium (6px)
- `rounded-lg` - Large (8px) ⭐ Default
- `rounded-xl` - Extra Large (12px)
- `rounded-2xl` - 2XL (16px)
- `rounded-full` - Fully rounded

### Spacing

| Property | Default Value | Description |
|----------|---------------|-------------|
| **buttonPadding** | `px-6 py-3` | Standard padding for buttons |
| **containerSpacing** | `p-8` | Standard padding for containers |
| **sectionGap** | `gap-16` | Gap between sections (used on Page containers) |
| **containerGap** | `gap-6` | Default gap for container children |
| **contentWidth** | `max-w-7xl` | Maximum width for content containers |

**Usage:**
- `p: "style:buttonPadding"` - Button padding
- `p: "style:containerSpacing"` - Container padding
- `gap: "style:sectionGap"` - Section gap (for Pages)
- `gap: "style:containerGap"` - Container gap
- `maxWidth: "style:contentWidth"` - Content max width

**Available Options:**

**Button Padding:**
- `px-3 py-1` - Small
- `px-4 py-2` - Medium
- `px-6 py-3` - Large ⭐ Default
- `px-8 py-4` - Extra Large

**Container Padding:**
- `p-4` - Small
- `p-6` - Medium
- `p-8` - Large ⭐ Default
- `p-12` - Extra Large

**Section Gap:**
- `gap-8` - Small
- `gap-12` - Medium
- `gap-16` - Large ⭐ Default
- `gap-24` - Extra Large
- `gap-32` - 2XL

**Container Gap:**
- `gap-2` - Extra Small
- `gap-4` - Small
- `gap-6` - Medium ⭐ Default
- `gap-8` - Large
- `gap-12` - Extra Large

**Content Width:**
- `max-w-3xl` - Small (3XL)
- `max-w-4xl` - Medium (4XL)
- `max-w-5xl` - Large (5XL)
- `max-w-6xl` - Extra Large (6XL)
- `max-w-7xl` - 2XL (7XL) ⭐ Default
- `max-w-full` - Full Width

### Typography

| Property | Default Value | Description |
|----------|---------------|-------------|
| **headingFont** | `font-bold` | Font weight for headings and titles |
| **headingFontFamily** | `Open Sans, sans-serif` | Font family for headings |
| **bodyFont** | `font-normal` | Font weight for body text |
| **bodyFontFamily** | `Open Sans, sans-serif` | Font family for body text |

**Usage:**
- `fontWeight: "style:headingFont"` - Heading font weight
- `fontFamily: "style:headingFontFamily"` - Heading font family
- `fontWeight: "style:bodyFont"` - Body font weight
- `fontFamily: "style:bodyFontFamily"` - Body font family

**Available Font Weight Options:**
- `font-thin` - 100
- `font-extralight` - 200
- `font-light` - 300
- `font-normal` - 400 ⭐ Default for body
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700 ⭐ Default for headings
- `font-extrabold` - 800

### Shadows

| Property | Default Value | Description |
|----------|---------------|-------------|
| **shadowStyle** | `shadow-lg` | Standard shadow for elevated elements like buttons and cards |

**Usage:** `shadow: "style:shadowStyle"`

**Available Shadow Options:**
- `shadow-none` - No shadow
- `shadow-sm` - Small
- `shadow` - Default
- `shadow-md` - Medium
- `shadow-lg` - Large ⭐ Default
- `shadow-xl` - Extra Large
- `shadow-2xl` - 2XL

## Accessing the Design System

### In the Editor

1. Click the **Design System** button in the top menu (palette icon)
2. The Design System Panel will open as a draggable sidebar
3. Switch between **Colors** and **Styles** tabs
4. Changes are auto-saved and applied immediately

### Colors Tab

- View all palette colors with their names and values
- Click a color swatch to open the color picker
- Edit color names by clicking on them
- Add new colors with the "Add Color" button
- Delete colors by hovering and clicking the trash icon

### Styles Tab

- Adjust border radius, padding, and spacing
- Set font families and weights for headings and body text
- Configure shadow styles
- All changes update in real-time

## Default Template Usage

The default template automatically uses these design system values:

### Header
- Logo uses `style:headingFont` and `style:headingFontFamily`
- Navigation uses `style:bodyFont`
- Container padding uses `style:containerSpacing`

### Hero Section
- Title uses `style:headingFont` and `style:headingFontFamily`
- Subtitle uses `style:bodyFont`
- Buttons use:
  - `style:borderRadius` for rounded corners
  - `style:buttonPadding` for padding
  - `style:shadowStyle` for elevation
  - `style:headingFont` for font weight
  - `style:headingFontFamily` for font family

### Background
- Uses `style:bodyFontFamily` for default font
- Uses `style:bodyFont` for default font weight

### Footer
- Container padding uses `style:containerSpacing`

## Customization Best Practices

1. **Maintain Contrast**: Ensure text colors have sufficient contrast with their backgrounds (WCAG AA minimum: 4.5:1 for body text, 3:1 for large text)

2. **Consistent Spacing**: Use the style guide spacing values consistently across your site for a cohesive look

3. **Font Pairing**: When changing fonts, ensure heading and body fonts complement each other

4. **Color Harmony**: Keep your color palette balanced - typically 1-2 primary colors, 1-2 accent colors, and neutral tones

5. **Accessibility**: Test your color choices with accessibility tools to ensure they work for all users

## Technical Implementation

### Location
Default values are defined in `/utils/defaults.ts`

### Storage
Design system settings are stored in the Craft.js `ROOT_NODE` props:
- `pallet` - Array of color objects
- `styleGuide` - Object with style properties

### Resolution
Style guide references (e.g., `style:borderRadius`) are resolved at runtime by the `ClassGenerator` utility in `/utils/tailwind.ts`

### Global Access
The Craft.js query object is exposed via `window.__CRAFT_EDITOR__` for style guide resolution in utility functions.
