# PageHub Component API Reference

## Base Component Props

All components extend `BaseSelectorProps`:

```typescript
interface BaseSelectorProps {
  // Responsive style props
  root: { [key: string]: any };      // Base styles (all breakpoints)
  mobile: { [key: string]: any };    // Mobile overrides (<768px)
  tablet: { [key: string]: any };    // Tablet overrides (768px-1024px)
  desktop: { [key: string]: any };   // Desktop overrides (>1024px)
  
  // Component behavior
  canDelete: boolean;                // Can be deleted
  canEditName: boolean;              // Name can be edited
  
  // Accessibility
  role?: string;                     // ARIA role
  "aria-label"?: string;             // ARIA label
  "aria-describedby"?: string;       // ARIA description
  "aria-hidden"?: boolean;           // Hide from screen readers
  
  // Advanced
  backgroundFetchPriority?: 'high' | 'low' | 'auto';  // Image loading priority
}
```

## Container

**Location**: `components/selectors/Container/`

### Props
```typescript
interface ContainerProps extends BaseSelectorProps {
  type: 'container' | 'page' | 'form' | 'section' | 'article' | 'nav' | 'header' | 'footer';
  
  // Page-specific
  isHomePage?: boolean;              // Designate as home page
  pageTitle?: string;                // SEO title
  pageDescription?: string;          // SEO description
  pageKeywords?: string;             // SEO keywords
  pageAuthor?: string;               // SEO author
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  
  // Twitter
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  
  // Advanced SEO
  canonicalUrl?: string;
  robots?: string;
  themeColor?: string;
  
  // Navigation
  anchor?: string;                   // Anchor/ID for scroll-to
  url?: string;                      // Click to navigate
  urlTarget?: '_blank' | '_self';    // Link target
  
  // Form-specific (when type='form')
  action?: string;                   // Form action URL
  method?: 'GET' | 'POST';           // Form method
  target?: string;                   // Form target (e.g., 'iframe')
  
  // Click interactions
  clickType?: 'click' | 'hover';     // Trigger type
  clickValue?: string;               // Target element ID
  clickDirection?: 'show' | 'hide' | 'toggle';  // Action
}
```

### Common Style Props
- **Layout**: `display`, `flexDirection`, `alignItems`, `justifyContent`, `gap`
- **Spacing**: `mt`, `mb`, `ml`, `mr`, `pt`, `pb`, `pl`, `pr`, `width`, `height`
- **Background**: `backgroundColor`, `backgroundImage`, `backgroundGradient`, `backgroundPattern`
- **Border**: `border`, `borderColor`, `borderRadius`
- **Effects**: `shadow`, `opacity`, `overflow`

### Usage
```javascript
<Element is={Container} canvas>
  {/* Children */}
</Element>
```

---

## Text

**Location**: `components/selectors/Text/`

### Props
```typescript
interface TextProps extends BaseSelectorProps {
  text: string;                      // HTML content (from Quill)
  tag?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'label';
  
  // Typography
  fontFamily?: string;               // Font family name
  fontSize?: string;                 // Tailwind class (text-xl)
  fontWeight?: string;               // Tailwind class (font-bold)
  textAlign?: string;                // Tailwind class (text-center)
  textColor?: string;                // Tailwind class (text-blue-500)
  lineHeight?: string;               // Tailwind class (leading-normal)
  letterSpacing?: string;            // Tailwind class (tracking-wide)
  
  // Advanced
  maxLines?: number;                 // Line clamp
  autoSize?: boolean;                // Auto-fit text size
}
```

### Usage
```javascript
<Element is={Text} text="<p>Hello World</p>" />
```

---

## Button

**Location**: `components/selectors/Button/`

### Props
```typescript
interface ButtonProps extends BaseSelectorProps {
  text: string;                      // Button text
  icon?: string;                     // Icon name (from react-icons)
  iconPosition?: 'left' | 'right';   // Icon placement
  
  // Link behavior
  url?: string;                      // URL to navigate to
  urlTarget?: '_blank' | '_self';    // Link target
  
  // Click actions
  clickType?: 'url' | 'scroll' | 'show' | 'hide' | 'toggle' | 'submit';
  clickValue?: string;               // Target (element ID or section anchor)
  
  // Form
  type?: 'button' | 'submit' | 'reset';
  
  // Styling
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
```

### Usage
```javascript
<Element is={Button} text="Click Me" url="https://example.com" />
```

---

## ButtonList

**Location**: `components/selectors/ButtonList/`

### Props
```typescript
interface ButtonListProps extends BaseSelectorProps {
  buttons: Array<{
    text: string;
    url?: string;
    urlTarget?: string;
    icon?: string;
  }>;
  
  // Layout
  layout?: 'horizontal' | 'vertical';
  gap?: string;                      // Tailwind gap class
  alignment?: 'start' | 'center' | 'end';
}
```

---

## Image

**Location**: `components/selectors/Image/`

### Props
```typescript
interface ImageProps extends BaseSelectorProps {
  src: string;                       // Image URL
  alt: string;                       // Alt text (required for a11y)
  
  // Display
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;           // CSS object-position
  
  // Performance
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  
  // Link
  url?: string;                      // Clickable image
  urlTarget?: '_blank' | '_self';
  
  // Advanced
  aspectRatio?: string;              // CSS aspect-ratio
  blur?: boolean;                    // Apply blur effect
}
```

### Usage
```javascript
<Element is={Image} src="/logo.png" alt="Company Logo" />
```

---

## Video

**Location**: `components/selectors/Video/`

### Props
```typescript
interface VideoProps extends BaseSelectorProps {
  // Source
  videoType?: 'youtube' | 'native';
  youtubeUrl?: string;               // YouTube video ID or URL
  videoUrl?: string;                 // Native video URL
  
  // Playback
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  
  // Display
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'custom';
  poster?: string;                   // Thumbnail image
}
```

---

## Audio

**Location**: `components/selectors/Audio/`

### Props
```typescript
interface AudioProps extends BaseSelectorProps {
  src: string;                       // Audio file URL
  
  // Playback
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;                // Show browser controls
  
  // Display
  showWaveform?: boolean;            // Visual waveform (custom player)
}
```

---

## Form

**Location**: `components/selectors/Form/`

### FormDrop (Form Container)
```typescript
interface FormProps extends BaseSelectorProps {
  action: string;                    // Form submission URL
  method: 'GET' | 'POST';            // HTTP method
  target?: string;                   // Usually 'iframe' for same-page
  
  // Success handling
  successMessage?: string;           // Show after submit
  redirectUrl?: string;              // Redirect after submit
  
  // Mailchimp integration
  mailchimpUrl?: string;             // Mailchimp action URL
}
```

### FormElement (Input Field)
```typescript
interface FormElementProps extends BaseSelectorProps {
  // Field type
  inputType: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  
  // Attributes
  name: string;                      // Form field name
  label?: string;                    // Field label
  placeholder?: string;              // Placeholder text
  value?: string;                    // Default value
  required?: boolean;                // Required field
  
  // Select/Radio options
  options?: Array<{ label: string; value: string }>;
  
  // Textarea
  rows?: number;                     // Textarea rows
  
  // Validation
  pattern?: string;                  // Regex pattern
  minLength?: number;
  maxLength?: number;
  min?: number;                      // For number/date
  max?: number;
}
```

---

## Nav

**Location**: `components/selectors/Nav/`

### Props
```typescript
interface NavProps extends BaseSelectorProps {
  logo?: string;                     // Logo image URL
  logoAlt?: string;                  // Logo alt text
  logoHeight?: string;               // Logo height
  
  // Items
  items: Array<{
    text: string;
    url: string;
    target?: string;
  }>;
  
  // Layout
  layout?: 'horizontal' | 'vertical';
  sticky?: boolean;                  // Sticky navigation
  
  // Mobile
  mobileBreakpoint?: 'md' | 'lg';    // When to show hamburger
  hamburgerIcon?: 'default' | 'custom';
}
```

---

## Header / Footer

**Location**: `components/selectors/Header/`, `components/selectors/Footer/`

### Props
```typescript
interface HeaderFooterProps extends BaseSelectorProps {
  // Both inherit from Container with type='header' or type='footer'
  // Use standard container props
}
```

---

## Divider

**Location**: `components/selectors/Divider/`

### Props
```typescript
interface DividerProps extends BaseSelectorProps {
  color?: string;                    // Line color
  thickness?: string;                // Line thickness (border-t-2)
  style?: 'solid' | 'dashed' | 'dotted';
  width?: string;                    // Width (w-full, w-1/2, etc.)
  spacing?: string;                  // Vertical spacing (my-4)
}
```

---

## Spacer

**Location**: `components/selectors/Spacer/`

### Props
```typescript
interface SpacerProps extends BaseSelectorProps {
  height?: string;                   // Height (h-12, h-24, etc.)
}
```

---

## Embed

**Location**: `components/selectors/Embed/`

### Props
```typescript
interface EmbedProps extends BaseSelectorProps {
  embedType?: 'iframe' | 'html';
  
  // iFrame
  url?: string;                      // iFrame URL
  
  // HTML
  html?: string;                     // Raw HTML/JS to inject
  
  // Display
  aspectRatio?: string;              // Aspect ratio
  height?: string;                   // Fixed height
}
```

---

## Background

**Location**: `components/selectors/Background/`

### Props
```typescript
interface BackgroundProps extends BaseSelectorProps {
  // Background type
  backgroundType?: 'solid' | 'gradient' | 'image' | 'pattern' | 'video';
  
  // Solid
  backgroundColor?: string;
  
  // Gradient
  backgroundGradient?: string;       // CSS gradient
  
  // Image
  backgroundImage?: string;          // Image URL
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;       // CSS background-position
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
  backgroundAttachment?: 'scroll' | 'fixed' | 'local';  // Parallax
  
  // Pattern
  backgroundPattern?: string;        // Pattern ID
  
  // Video
  backgroundVideo?: string;          // Video URL
  
  // Overlay
  overlayColor?: string;             // Overlay color
  overlayOpacity?: number;           // 0-100
  
  // Effects
  blur?: number;                     // Blur amount
  brightness?: number;               // Brightness (0-200)
}
```

---

## Special Components

### RenderPattern
Renders SVG patterns as backgrounds.

### RenderGradient
Renders CSS gradients as backgrounds.

### EmptyState
Shows when a container has no children (editor only).

---

## Animation Props (All Components)

All components support AOS (Animate On Scroll) animations:

```typescript
interface AnimationProps {
  aos?: string;                      // Animation type
  aosDuration?: number;              // Duration (ms)
  aosDelay?: number;                 // Delay (ms)
  aosEasing?: string;                // Easing function
  aosOffset?: number;                // Trigger offset (px)
  aosOnce?: boolean;                 // Animate once or every time
}
```

### Available Animations
- **Fade**: fade, fade-up, fade-down, fade-left, fade-right
- **Slide**: slide-up, slide-down, slide-left, slide-right
- **Zoom**: zoom-in, zoom-out
- **Flip**: flip-up, flip-down, flip-left, flip-right

---

## Common Style Properties

### Layout
```typescript
{
  display: 'flex' | 'block' | 'inline-block' | 'grid' | 'hidden',
  flexDirection: 'flex-row' | 'flex-col' | 'flex-row-reverse' | 'flex-col-reverse',
  alignItems: 'items-start' | 'items-center' | 'items-end' | 'items-stretch',
  justifyContent: 'justify-start' | 'justify-center' | 'justify-end' | 'justify-between' | 'justify-around',
  gap: 'gap-0' | 'gap-1' | ... | 'gap-96',
  flexWrap: 'flex-wrap' | 'flex-nowrap',
}
```

### Spacing
```typescript
{
  // Margin
  mt: 'mt-0' | 'mt-1' | ... | 'mt-96',
  mb: 'mb-0' | 'mb-1' | ... | 'mb-96',
  ml: 'ml-0' | 'ml-1' | ... | 'ml-96',
  mr: 'mr-0' | 'mr-1' | ... | 'mr-96',
  
  // Padding
  pt: 'pt-0' | 'pt-1' | ... | 'pt-96',
  pb: 'pb-0' | 'pb-1' | ... | 'pb-96',
  pl: 'pl-0' | 'pl-1' | ... | 'pl-96',
  pr: 'pr-0' | 'pr-1' | ... | 'pr-96',
  
  // Dimensions
  width: 'w-auto' | 'w-full' | 'w-1/2' | 'w-96' | 'w-screen',
  height: 'h-auto' | 'h-full' | 'h-screen' | 'h-96',
  maxWidth: 'max-w-xs' | 'max-w-sm' | 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | ... | 'max-w-7xl',
}
```

### Typography
```typescript
{
  fontFamily: string,                // Font name from Google Fonts
  fontSize: 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl' | ... | 'text-9xl',
  fontWeight: 'font-thin' | 'font-extralight' | 'font-light' | 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold' | 'font-extrabold' | 'font-black',
  textAlign: 'text-left' | 'text-center' | 'text-right' | 'text-justify',
  textColor: 'text-{color}-{shade}',
  lineHeight: 'leading-none' | 'leading-tight' | 'leading-normal' | 'leading-relaxed' | 'leading-loose',
  letterSpacing: 'tracking-tighter' | 'tracking-tight' | 'tracking-normal' | 'tracking-wide' | 'tracking-wider' | 'tracking-widest',
}
```

### Colors
```typescript
{
  backgroundColor: 'bg-{color}-{shade}',
  textColor: 'text-{color}-{shade}',
  borderColor: 'border-{color}-{shade}',
}
```

**Color Palette**: white, black, gray, red, orange, yellow, green, teal, blue, indigo, purple, pink
**Shades**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### Border
```typescript
{
  border: 'border' | 'border-0' | 'border-2' | 'border-4' | 'border-8',
  borderColor: 'border-{color}-{shade}',
  borderRadius: 'rounded-none' | 'rounded-sm' | 'rounded' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full',
}
```

### Effects
```typescript
{
  shadow: 'shadow-none' | 'shadow-sm' | 'shadow' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl',
  opacity: 'opacity-0' | 'opacity-25' | 'opacity-50' | 'opacity-75' | 'opacity-100',
  overflow: 'overflow-auto' | 'overflow-hidden' | 'overflow-visible' | 'overflow-scroll',
  cursor: 'cursor-auto' | 'cursor-pointer' | 'cursor-not-allowed',
}
```

---

## Craft.js Configuration

### Component Registration
```typescript
Component.craft = {
  displayName: string;               // Name shown in UI
  props: object;                     // Default props
  rules: {
    canDrag: (node) => boolean;
    canDrop: (targetNode, dropNode) => boolean;
    canMoveIn: (incomingNodes, targetNode) => boolean;
    canMoveOut: (outgoingNodes, currentNode) => boolean;
  };
  related: {
    toolbar: Component;              // Settings component
  };
};
```

---

## Usage Examples

### Creating a Hero Section
```javascript
<Element is={Container} canvas 
  root={{ py: 'py-24', backgroundColor: 'bg-blue-600' }}>
  
  <Element is={Container} canvas
    root={{ maxWidth: 'max-w-4xl', mx: 'mx-auto', textAlign: 'text-center' }}>
    
    <Element is={Text} 
      text="<h1>Welcome to PageHub</h1>"
      root={{ fontSize: 'text-5xl', textColor: 'text-white', fontWeight: 'font-bold' }}
    />
    
    <Element is={Text}
      text="<p>Build amazing websites visually</p>"
      root={{ fontSize: 'text-xl', textColor: 'text-white', opacity: 'opacity-90', mt: 'mt-4' }}
    />
    
    <Element is={Button}
      text="Get Started"
      url="/signup"
      root={{ mt: 'mt-8' }}
    />
  </Element>
</Element>
```

### Creating a Contact Form
```javascript
<Element is={FormDrop} canvas
  action="/api/contact"
  method="POST"
  target="iframe">
  
  <Element is={FormElement}
    inputType="text"
    name="name"
    label="Your Name"
    placeholder="John Doe"
    required={true}
  />
  
  <Element is={FormElement}
    inputType="email"
    name="email"
    label="Email Address"
    required={true}
  />
  
  <Element is={FormElement}
    inputType="textarea"
    name="message"
    label="Message"
    rows={5}
  />
  
  <Element is={Button}
    text="Submit"
    type="submit"
  />
</Element>
```

---

**For implementation details, see `CURSOR_PROJECT_SUMMARY.md`**
