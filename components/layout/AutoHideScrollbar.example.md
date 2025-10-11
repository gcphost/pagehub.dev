# AutoHideScrollbar Usage Examples

## Basic Usage
```jsx
import { AutoHideScrollbar } from "components/layout/AutoHideScrollbar";

<AutoHideScrollbar className="h-64 overflow-y-auto">
  <div>Your scrollable content here...</div>
</AutoHideScrollbar>
```

## Custom Timing
```jsx
<AutoHideScrollbar 
  hideDelay={3000}  // Hide after 3 seconds
  showDelay={200}   // Show after 200ms hover
  className="h-96 overflow-y-auto"
>
  <div>Content with custom timing...</div>
</AutoHideScrollbar>
```

## With ID for Jump Functionality
```jsx
<AutoHideScrollbar 
  id="myScrollableArea"
  className="h-64 overflow-y-auto"
>
  <div>Content that can be scrolled to programmatically...</div>
</AutoHideScrollbar>

// Later, scroll to top:
document.getElementById("myScrollableArea").scrollTo({ top: 0 });
```

## Props
- `children`: React.ReactNode - Content to wrap
- `className`: string - Additional CSS classes
- `hideDelay`: number - Milliseconds before hiding scrollbar (default: 2000)
- `showDelay`: number - Milliseconds before showing scrollbar on hover (default: 100)
- `id`: string - Optional ID for programmatic scrolling
