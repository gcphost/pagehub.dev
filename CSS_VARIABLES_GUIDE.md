# CSS Variables System for Palette and Style Guide

## Overview

The palette and style guide system has been refactored to use **CSS custom properties (CSS variables)** instead of resolving values at the component level. This allows for better performance, dynamic theming, and direct CSS variable usage in Tailwind classes.

## What Changed

### Before
- `palette:Primary` would resolve to the actual color value (e.g., `blue-500`) at render time
- `style:inputBorder` would resolve to the full CSS classes (e.g., `border border-gray-300 rounded-md`)
- Values were resolved in JavaScript and then used as Tailwind classes

### After
- `palette:Primary` now resolves to `var(--palette-primary)` as a CSS variable
- `style:inputBorder` now resolves to `var(--style-input-border)` as a CSS variable
- CSS variables are injected into the document `<head>` and can be used directly

## How It Works

### 1. CSS Variable Generation

When the Design System (palette + style guide) is loaded, CSS variables are automatically injected:

```css
:root {
  /* Palette colors */
  --palette-primary: blue-500;
  --palette-primary-text: white;
  --palette-secondary: purple-500;
  /* ... more palette colors */
  
  /* Style guide values */
  --style-border-radius: rounded-lg;
  --style-button-padding: px-6 py-3;
  --style-input-border-color: var(--palette-neutral);
  /* ... more style values */
}
```

### 2. Automatic Conversion

The system automatically converts palette and style references:

| Input | Output | Usage |
|-------|--------|-------|
| `palette:Primary` | `var(--palette-primary)` | Direct CSS |
| `bg-palette:Primary` | `bg-[var(--palette-primary)]` | Tailwind class |
| `style:inputBorder` | `var(--style-input-border)` | Direct CSS |
| `border-style:inputBorderColor` | `border-[var(--style-input-border-color)]` | Tailwind class |

### 3. Nested References

Style guide values can reference palette colors:

```javascript
styleGuide: {
  inputBorderColor: "palette:Neutral",  // References palette
  inputFocusRingColor: "palette:Primary"
}
```

This generates:
```css
:root {
  --palette-neutral: gray-500;
  --palette-primary: blue-500;
  --style-input-border-color: var(--palette-neutral);
  --style-input-focus-ring-color: var(--palette-primary);
}
```

## Usage Examples

### In Component Props

```typescript
// Using palette reference
props = {
  root: {
    background: "bg-palette:Primary",
    color: "text-palette:Primary Text"
  }
}

// Using style reference
props = {
  root: {
    borderColor: "border-style:inputBorderColor",
    radius: "style:borderRadius"
  }
}
```

### Direct Tailwind Classes

You can now use CSS variables directly in Tailwind:

```jsx
<div className="bg-[var(--palette-primary)] text-[var(--palette-primary-text)]">
  Using CSS variables directly!
</div>

<input className="border-[var(--style-input-border-color)] rounded-[var(--style-border-radius)]" />
```

### Dynamic Theming

Since values are CSS variables, you can update them dynamically:

```javascript
// Change a palette color
document.documentElement.style.setProperty('--palette-primary', '#ff0000');

// Change a style value
document.documentElement.style.setProperty('--style-border-radius', 'rounded-full');
```

## Implementation Files

### New Files
- `utils/designSystemVars.ts` - Core CSS variable generation and injection

### Updated Files
- `utils/palette.ts` - Added CSS variable conversion utilities
- `utils/tailwind.ts` - Updated resolution to output CSS variables
- `components/selectors/Background/index.tsx` - Injects CSS variables on mount
- `tailwind.config.js` - Added safelist patterns for dynamic classes

## API Reference

### `designSystemVars.ts`

#### `toCSSVarName(name: string): string`
Converts any name to a valid CSS variable name.
```typescript
toCSSVarName("Primary Text") // "primary-text"
toCSSVarName("inputBorder") // "input-border"
```

#### `injectDesignSystemVars(designSystem: DesignSystemVars): void`
Injects all CSS variables into the document head.
```typescript
injectDesignSystemVars({
  palette: [{ name: "Primary", color: "blue-500" }],
  styleGuide: { borderRadius: "rounded-lg" }
});
```

#### `generateDesignSystemCSSVariables(designSystem: DesignSystemVars): string`
Returns the CSS text for all variables.

### `palette.ts`

#### `paletteToCSSVar(value: string): string`
Converts palette reference to CSS variable.
```typescript
paletteToCSSVar("palette:Primary") // "var(--palette-primary)"
```

#### `styleToCSSVar(value: string): string`
Converts style reference to CSS variable.
```typescript
styleToCSSVar("style:inputBorder") // "var(--style-input-border)"
```

#### `toTailwindCSSVar(value: string, prefix: string): string`
Converts to Tailwind arbitrary value format.
```typescript
toTailwindCSSVar("palette:Primary", "bg") // "bg-[var(--palette-primary)]"
```

## Benefits

1. **Performance**: CSS variables are resolved by the browser, not JavaScript
2. **Dynamic Theming**: Change theme colors on-the-fly without re-rendering
3. **Direct CSS Access**: Use variables in custom CSS or inline styles
4. **Better Debugging**: Inspect CSS variables in DevTools
5. **Type Safety**: Palette and style references are still type-checked
6. **Fallback Support**: CSS variables can have fallback values

## Migration Notes

- Existing `palette:` and `style:` references work automatically
- No changes needed to component code
- CSS variables are injected automatically by the Background component
- Old data with direct color values still works (backward compatible)

## Troubleshooting

**Variables not updating?**
- Check that Background component is mounted (it injects the variables)
- Verify palette/styleGuide props are passed correctly

**Classes not applying?**
- Check browser DevTools to see if CSS variables are present in `:root`
- Verify Tailwind is processing arbitrary values correctly
- Check the safelist in `tailwind.config.js`

**Nested references not working?**
- Ensure palette colors are defined before style guide references them
- Check variable names match (case-insensitive conversion happens automatically)
