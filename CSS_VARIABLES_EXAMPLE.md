# CSS Variables System - Examples

## Example 1: Basic Palette Usage

### Before (Old System)
```typescript
// Component props
props = {
  root: {
    background: "bg-palette:Primary",  // Would resolve to "bg-blue-500" at runtime
    color: "text-palette:Primary Text" // Would resolve to "text-white" at runtime
  }
}

// Generated className: "bg-blue-500 text-white"
```

### After (New System)
```typescript
// Component props (SAME AS BEFORE - no changes needed!)
props = {
  root: {
    background: "bg-palette:Primary",  // Now resolves to "bg-[var(--palette-primary)]"
    color: "text-palette:Primary Text" // Now resolves to "text-[var(--palette-primary-text)]"
  }
}

// Generated className: "bg-[var(--palette-primary)] text-[var(--palette-primary-text)]"
// CSS injected: 
// :root {
//   --palette-primary: blue-500;
//   --palette-primary-text: white;
// }
```

## Example 2: Style Guide References

### Before (Old System)
```typescript
// Design System
styleGuide = {
  inputBorderWidth: "border",
  inputBorderColor: "palette:Neutral",
  inputBorderRadius: "rounded-md"
}

// Component using style references
formInput = {
  root: {
    border: "style:inputBorderWidth",           // Resolves to "border"
    borderColor: "border-style:inputBorderColor", // Resolves to "border-gray-500"
    radius: "style:inputBorderRadius"            // Resolves to "rounded-md"
  }
}
```

### After (New System)
```typescript
// Design System (SAME AS BEFORE!)
styleGuide = {
  inputBorderWidth: "border",
  inputBorderColor: "palette:Neutral",
  inputBorderRadius: "rounded-md"
}

// Component using style references (SAME AS BEFORE!)
formInput = {
  root: {
    border: "style:inputBorderWidth",              // Now: "var(--style-input-border-width)"
    borderColor: "border-style:inputBorderColor",  // Now: "border-[var(--style-input-border-color)]"
    radius: "style:inputBorderRadius"              // Now: "var(--style-input-border-radius)"
  }
}

// CSS injected:
// :root {
//   --palette-neutral: gray-500;
//   --style-input-border-width: border;
//   --style-input-border-color: var(--palette-neutral);
//   --style-input-border-radius: rounded-md;
// }
```

## Example 3: Direct Tailwind Usage

```tsx
// You can now use CSS variables DIRECTLY in your JSX!
function MyComponent() {
  return (
    <div>
      {/* Using palette colors */}
      <button className="bg-[var(--palette-primary)] text-[var(--palette-primary-text)] hover:bg-[var(--palette-secondary)]">
        Click Me
      </button>
      
      {/* Using style guide values */}
      <input 
        className="border-[var(--style-input-border-color)] rounded-[var(--style-input-border-radius)] px-[var(--style-input-padding)]"
        placeholder="Enter text..."
      />
      
      {/* Mix and match */}
      <div className="bg-[var(--ph-background)] text-[var(--ph-text)] p-[var(--ph-container-padding)]">
        Content here
      </div>
    </div>
  );
}
```

## Example 4: Dynamic Theme Switching

```typescript
// Change theme colors on the fly!
function switchToRedTheme() {
  // Update primary color
  document.documentElement.style.setProperty('--palette-primary', '#ef4444');
  document.documentElement.style.setProperty('--palette-primary-text', 'white');
  
  // All components using palette:Primary will update instantly!
}

function switchToLargeRadius() {
  document.documentElement.style.setProperty('--style-border-radius', 'rounded-2xl');
  
  // All components using style:borderRadius will update!
}

function switchToNightMode() {
  document.documentElement.style.setProperty('--palette-background', '#1a1a1a');
  document.documentElement.style.setProperty('--palette-text', '#ffffff');
  document.documentElement.style.setProperty('--palette-alternate-background', '#2a2a2a');
}
```

## Example 5: Custom CSS with Variables

```css
/* You can use the variables in custom CSS too! */
.my-custom-button {
  background: var(--palette-primary);
  color: var(--palette-primary-text);
  border-radius: var(--style-border-radius);
  padding: var(--style-button-padding);
  transition: all 0.2s;
}

.my-custom-button:hover {
  background: var(--palette-secondary);
  color: var(--palette-secondary-text);
}

.my-custom-input {
  border: var(--style-input-border-width) solid var(--style-input-border-color);
  border-radius: var(--style-input-border-radius);
  padding: var(--style-input-padding);
  background: var(--style-input-bg-color);
  color: var(--style-input-text-color);
}

.my-custom-input:focus {
  outline: none;
  ring: var(--style-input-focus-ring);
  ring-color: var(--style-input-focus-ring-color);
}
```

## Example 6: Debugging with DevTools

Open your browser's DevTools and check the computed styles:

```javascript
// In browser console:

// See all design system variables
getComputedStyle(document.documentElement).getPropertyValue('--palette-primary')
// Output: "blue-500"

getComputedStyle(document.documentElement).getPropertyValue('--style-border-radius')
// Output: "rounded-lg"

// List all palette variables
Object.keys(getComputedStyle(document.documentElement))
  .filter(key => key.startsWith('--palette'))
  .map(key => `${key}: ${getComputedStyle(document.documentElement).getPropertyValue(key)}`)

// List all style variables
Object.keys(getComputedStyle(document.documentElement))
  .filter(key => key.startsWith('--style'))
  .map(key => `${key}: ${getComputedStyle(document.documentElement).getPropertyValue(key)}`)
```

## Example 7: Real-world Form Component

```tsx
// Form element using the design system
const FormElement = () => {
  return (
    <form className="space-y-4">
      <input 
        type="text"
        placeholder="Name"
        className="
          w-full
          border-[var(--style-input-border-color)]
          rounded-[var(--style-input-border-radius)]
          px-[var(--style-input-padding)]
          bg-[var(--style-input-bg-color)]
          text-[var(--style-input-text-color)]
          placeholder-[var(--style-input-placeholder-color)]
          focus:outline-none
          focus:ring-[var(--style-input-focus-ring)]
          focus:ring-[var(--style-input-focus-ring-color)]
        "
      />
      
      <button 
        className="
          bg-[var(--palette-primary)]
          text-[var(--palette-primary-text)]
          px-[var(--style-button-padding)]
          rounded-[var(--style-border-radius)]
          hover:bg-[var(--palette-secondary)]
          hover:text-[var(--palette-secondary-text)]
          transition-colors
        "
      >
        Submit
      </button>
    </form>
  );
};
```

## Key Takeaways

✅ **No Migration Needed**: Existing `palette:` and `style:` references work automatically  
✅ **Better Performance**: Browser handles CSS variables natively  
✅ **Dynamic Theming**: Change variables without re-rendering  
✅ **Direct Usage**: Use variables in Tailwind classes, custom CSS, or inline styles  
✅ **Debugging**: Inspect variables in DevTools  
✅ **Type Safe**: TypeScript still validates your palette and style references  

## What Gets Generated

For this design system:
```typescript
palette: [
  { name: "Primary", color: "blue-500" },
  { name: "Primary Text", color: "white" },
  { name: "Neutral", color: "gray-500" }
]

styleGuide: {
  borderRadius: "rounded-lg",
  buttonPadding: "px-6 py-3",
  inputBorderColor: "palette:Neutral"
}
```

This CSS gets injected:
```css
:root {
  --palette-primary: blue-500;
  --palette-primary-text: white;
  --palette-neutral: gray-500;
  --style-border-radius: rounded-lg;
  --style-button-padding: px-6 py-3;
  --style-input-border-color: var(--palette-neutral);
}
```

And when you use `bg-palette:Primary`, it becomes `bg-[var(--palette-primary)]` which Tailwind resolves! 🎉
