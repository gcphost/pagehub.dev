# PageHub - Website Builder Platform

## Overview
PageHub is a **multi-tenant, drag-and-drop website builder** platform built with Next.js and Craft.js. It enables users to create, edit, and publish websites through a visual editor with real-time preview capabilities. The platform supports both internal hosting and external webhook integrations for headless CMS architectures.

## Tech Stack

### Core Technologies
- **Framework**: Next.js 14.2.7 (React 18.3.1)
- **Editor Engine**: Craft.js (@craftjs/core) - Drag-and-drop page builder
- **State Management**: Recoil (global state)
- **Database**: MongoDB (via Mongoose 8.6.0)
- **Authentication**: NextAuth 4.24.7 with MongoDB adapter
- **Styling**: Tailwind CSS with custom utility system
- **Animations**: Framer Motion 11.3.31 + AOS (Animate On Scroll)
- **Compression**: LZUTF8 (for page content serialization)
- **Rich Text**: Quill 2.0.2

### Key Dependencies
- **Form Handling**: Form components with iframe submission support
- **Media**: HTML-to-image, HTML2Canvas for screenshots
- **Icons**: React Icons, FontAwesome 6.6.0
- **Color Picker**: @hello-pangea/color-picker, react-color
- **Drag & Drop**: @craftjs/core, re-resizable, react-rnd
- **SEO**: next-seo for meta tags
- **AI Integration**: OpenAI API (for content generation)

## Architecture

### Multi-Tenant System
PageHub operates as a **multi-tenant SaaS platform** with three modes:

1. **Marketing Site** (`pagehub.dev`)
   - Homepage, templates gallery, privacy/terms pages
   - Public-facing marketing content

2. **Builder/Editor** (`/build/[tenant]/[page]`)
   - Visual drag-and-drop editor interface
   - Real-time editing with undo/redo
   - Component toolbox and settings panels
   - Auto-save with unsaved changes tracking

3. **Published Sites** (`/static/[domain]` or custom domains)
   - Static site generation (SSG) with ISR (60s revalidation)
   - Optimized for performance (disabled editor features)
   - SEO-optimized with meta tags

### Tenant Configuration
Each tenant has:
- **Subdomain**: `{tenant}.pagehub.dev`
- **Custom Domains**: Array of domains for published sites
- **Branding**: Logo, colors (primary/secondary/accent)
- **Settings**: Toolbar visibility, sidebar preferences, component restrictions
- **Webhooks** (optional):
  - `onLoad`: Fetch page data from external CMS
  - `onSave`: Save page data to external CMS
  - `fetchPage`: Retrieve single page for static generation
  - `fetchPageList`: List all pages for static path generation
- **Auth Token**: `ph_` prefix token for webhook authentication

### Data Flow

#### Page Loading
1. **Editor Mode** (`/build/[tenant]/[page]`):
   - Server checks for tenant webhooks
   - If `onLoad` webhook exists → calls external API
   - Otherwise → loads from MongoDB
   - Returns compressed (LZUTF8) JSON representation of page tree

2. **Static Mode** (`/static/[domain]`):
   - Uses Next.js Static Site Generation (SSG)
   - Calls `fetchPage` webhook or MongoDB
   - Enables Incremental Static Regeneration (ISR) - 60s

3. **Preview Mode** (`/[subdomain]/[slug]`):
   - Draft preview for non-published pages
   - Uses `draftId` to access unpublished content

#### Page Saving
1. User edits in visual editor
2. Changes tracked via Craft.js `onNodesChange` (debounced 1s)
3. Manual save (Cmd/Ctrl+S) or auto-save triggers:
   - If tenant has `onSave` webhook → POST to external API
   - Otherwise → save to MongoDB Page collection
4. Returns updated page metadata

### Page Data Model

#### MongoDB Schema (`Page`)
```javascript
{
  _id: String,              // Unique page ID (nanoid)
  draftId: String,          // Human-readable slug for draft preview
  name: String,             // Page name
  domain: String,           // Custom domain for publishing
  content: String,          // Published version (LZUTF8 compressed)
  draft: String,            // Draft version (LZUTF8 compressed)
  editable: Boolean,        // Can be edited
  title: String,            // SEO title (max 60 chars)
  description: String,      // SEO description (max 160 chars)
  users: [String],          // Associated user IDs
  submissions: [Object],    // Form submissions
  media: [Object],          // Uploaded media
  createdAt: Date,
  updatedAt: Date
}
```

#### Craft.js Node Tree Structure
Pages are stored as **serialized Craft.js node trees**:
```javascript
{
  "ROOT": { ... },
  "node-id-1": {
    type: { resolvedName: "Container" },
    props: { root: {...}, mobile: {...}, tablet: {...}, desktop: {...} },
    nodes: ["child-node-1", "child-node-2"],
    custom: { displayName: "Hero Section" }
  },
  // ... more nodes
}
```

## Component System

### Core Selectors (Drag-and-Drop Components)

1. **Container** - Flexbox layout wrapper
   - Types: `container`, `page`, `form`
   - Responsive props: `root`, `mobile`, `tablet`, `desktop`
   - Features: Background images/gradients/patterns, click actions, anchors

2. **Text** - Rich text with Quill editor
   - Inline editing with formatting toolbar
   - Font family, size, color, alignment
   - Supports animations and accessibility props

3. **Button** - Interactive button/link
   - Click actions: URL navigation, scroll to section, show/hide elements
   - Hover states and animations
   - Icon support

4. **Image** - Responsive images
   - Upload or URL
   - Object-fit options
   - Lazy loading with `fetchPriority`

5. **Video** - YouTube embeds or native video
   - Autoplay, loop, muted options
   - Responsive aspect ratios

6. **Audio** - Audio player
   - Custom controls
   - Autoplay support

7. **Form** - Form builder with elements
   - **FormElement**: Input, textarea, select, checkbox, radio
   - **FormDrop**: Form container with submission handling
   - Supports iframe submission and Mailchimp integration

8. **Nav** - Navigation menu
   - Multiple items with links
   - Responsive hamburger menu
   - Logo support

9. **Header/Footer** - Page sections
   - Pre-styled layouts
   - Responsive design

10. **Divider** - Horizontal separator
    - Custom color, thickness, style

11. **Spacer** - Empty space
    - Adjustable height

12. **Embed** - iFrame embeds
    - Custom HTML/JavaScript injection

13. **Background** - Full-width sections
    - Parallax effects
    - Overlay patterns/gradients

14. **ButtonList** - Button group
    - Multiple buttons in flex layout

### Component Properties System

Each component has **responsive breakpoint props**:
```typescript
interface BaseSelectorProps {
  root: { [key: string]: any };      // Base styles
  mobile: { [key: string]: any };    // Mobile overrides
  tablet: { [key: string]: any };    // Tablet overrides
  desktop: { [key: string]: any };   // Desktop overrides
  canDelete: boolean;
  canEditName: boolean;
}
```

**Common Style Props**:
- Layout: `display`, `flexDirection`, `alignItems`, `justifyContent`, `gap`
- Spacing: `mt`, `mb`, `ml`, `mr`, `pt`, `pb`, `pl`, `pr`, `width`, `height`
- Typography: `fontSize`, `fontFamily`, `fontWeight`, `textAlign`, `textColor`, `lineHeight`
- Background: `backgroundColor`, `backgroundImage`, `backgroundGradient`, `backgroundPattern`
- Border: `border`, `borderColor`, `borderRadius`
- Effects: `shadow`, `opacity`, `overflow`
- Accessibility: `role`, `aria-label`, `aria-*` attributes

### Toolbar (Settings Panel)

The right sidebar provides component-specific settings:

**Layout Tab**:
- Display, flex direction, alignment, gap
- Container type (div, section, article, etc.)

**Style Tab**:
- Width, height, padding, margin
- Background (solid, gradient, image, pattern)
- Border, radius, shadow
- Typography (font, size, color, weight)

**Advanced Tab**:
- Custom CSS classes
- Animations (AOS integration)
- Accessibility attributes
- SEO settings (for pages)
- Click interactions

**Content Tab** (text/buttons):
- Rich text editor (Quill)
- Button text and icons
- Link settings

## Editor Features

### Visual Editing
1. **Node Controllers** (hover overlays):
   - **NameNodeController**: Display component name
   - **HoverNodeController**: Show outline on hover
   - **ToolNodeController**: Settings button (opens toolbar)
   - **DragAdjustNodeController**: Drag handles for margin, padding, width, height
   - **DeleteNodeController**: Delete button
   - **DuplicateNodeController**: Copy component
   - **AddSectionNodeController**: Insert section templates

2. **Inline Tools**:
   - Rendered as floating controls on each component
   - Position: top, bottom, left, right (with alt placements)
   - Alignment: start, middle, end

3. **Measurement Lines**:
   - Visual spacing indicators (SVG overlay)
   - Shows padding/margin dimensions

4. **Proximity Hover**:
   - Smart hover detection for nested components
   - Prevents accidental parent selection

### Keyboard Shortcuts
- **Cmd/Ctrl+C**: Copy component
- **Cmd/Ctrl+V**: Paste component
- **Cmd/Ctrl+Z**: Undo
- **Cmd/Ctrl+Y**: Redo
- **Cmd/Ctrl+S**: Save page
- **Tab**: Select next sibling
- **Escape**: Select parent or exit preview
- **Backspace**: Delete selected component

### Toolbox (Left Sidebar)

**Components**:
- Text, Image, Video, Audio
- Button, Button List
- Container, Divider, Spacer
- Form, Form Element
- Nav, Header, Footer
- Embed

**Sections** (Pre-built Templates):
- Hero, CTA, Services, Team, Pricing
- Header, Footer, Text blocks
- Image+Text layouts, Video sections
- Loaded from `/data/section-templates/*.json`

**Saved Components**:
- User-saved reusable components
- Copy/paste across pages

### Page Management
- **Multi-Page Support**: Single project can have multiple pages
- **Page Isolation**: Edit one page at a time (URL-based: `/build/[tenant]/[page-slug]`)
- **Home Page**: Designated page shown at root URL
- **Page Routing**: Automatic slug generation from page names
- **Page Visibility**: Hide pages (don't render in output)
- **Page SEO**: Per-page title, description, keywords, OG tags, Twitter cards

### Viewport Modes
- **Desktop**: Full-width editing
- **Mobile**: 380px preview with device chrome
- **Device Toggle**: Render actual breakpoints

## Section Templates

### Template System
- **JSON-based**: Defined in `/data/section-templates/*.json`
- **Categories**: Hero, CTA, Services, Team, Pricing, Header, Footer, etc.
- **Structure**: Nested component definitions with props

Example template structure:
```json
{
  "id": "hero",
  "name": "Hero Sections",
  "templates": [
    {
      "id": "hero-1",
      "name": "Hero with Image",
      "structure": {
        "type": "Container",
        "props": { ... },
        "children": [
          { "type": "Text", "props": { ... } },
          { "type": "Button", "props": { ... } }
        ]
      }
    }
  ]
}
```

### Build Process
- `scripts/build-templates.js`: Combines individual JSON files
- Output: `data/section-templates.json` (used by `SectionPickerDialog`)

## Styling System

### Tailwind Integration
- **ClassGenerator**: Converts props to Tailwind classes
- **Responsive**: `sm:`, `md:`, `lg:` prefixes automatically applied
- **Custom Config**: `tailwind.config.js` with extended colors/spacing
- **Dynamic CDN**: Loads Tailwind via CDN with custom config

### Custom CSS Support
- **style prop**: Raw CSS string converted to object (`CSStoObj`)
- **Inline styles**: Directly applied to elements
- **Custom classes**: Can add arbitrary CSS classes (if enabled)

### Color System
- **Palette Context**: Theme colors (primary, secondary, accent)
- **Color Variables**: CSS custom properties (`--primary-500`)
- **Color Picker**: Full HSL/RGB picker with palette favorites

### Pattern/Gradient System
- **Patterns**: SVG patterns (grid, dots, lines, waves)
- **Gradients**: Linear/radial gradients with multiple stops
- **Background Layers**: Pattern + gradient + image compositing

## Animations

### AOS (Animate On Scroll)
- **Trigger**: Animations play when component enters viewport
- **Types**: fade, slide, zoom, flip
- **Customization**: Duration, delay, easing, offset

### Framer Motion
- **Interactive**: Hover, tap, drag animations
- **Layout**: Automatic layout animations
- **Page Transitions**: Smooth route changes
- **Gestures**: Used in dialogs, modals, toolbox

## Accessibility

### Features
- **ARIA Attributes**: role, aria-label, aria-describedby, etc.
- **Semantic HTML**: Proper heading hierarchy (h1-h6)
- **Keyboard Navigation**: Tab order, focus management
- **Alt Text**: Required for images
- **Form Labels**: Associated with inputs

### SEO
- **Meta Tags**: Title, description, keywords, author
- **Open Graph**: OG:title, OG:description, OG:image, OG:type
- **Twitter Cards**: twitter:card, twitter:site, twitter:creator
- **Canonical URLs**: Custom canonical tags
- **Robots**: Control indexing/following
- **Structured Data**: Can add JSON-LD via embed component

## API Routes

### Page Management
- **`POST /api/save`**: Save page (calls webhook or MongoDB)
- **`GET /api/page/[...slug]`**: Load page by ID, draftId, domain, or name
- **`GET /api/check`**: Verify page exists
- **`POST /api/previous`**: Restore previous version

### Media
- **`POST /api/files`**: Upload files
- **`GET /api/media/[...slug]`**: Serve media files
- **`POST /api/media/get`**: Fetch media by ID
- **`GET /api/media/svg`**: Generate SVG icons

### Domain Management
- **`GET /api/domain`**: Get domain status (Vercel integration)
- **`POST /api/domain`**: Add custom domain
- **`DELETE /api/domain`**: Remove custom domain
- **`GET /api/checkDomain`**: Verify domain availability

### Utilities
- **`POST /api/compress`**: Compress content (LZUTF8)
- **`POST /api/decompress`**: Decompress content
- **`POST /api/convert`**: HTML to Craft.js conversion
- **`POST /api/generate`**: AI content generation (OpenAI)
- **`GET /api/patterns`**: List available patterns
- **`POST /api/submissions`**: Handle form submissions
- **`GET /api/favicon`**: Generate favicon
- **`GET /api/robots.txt`**: Generate robots.txt
- **`GET /api/sitemap.xml`**: Generate sitemap

### Authentication
- **`/api/auth/[...nextauth]`**: NextAuth handlers
  - Google OAuth provider
  - Email magic link (optional)
  - Session management

## Webhook System

### Headless CMS Integration
PageHub can act as a **visual editor for headless CMSs** via webhooks.

#### Webhook Types

**1. onLoad** - Fetch page for editing
```javascript
// PageHub calls:
GET {webhook}/onLoad?token={sessionToken}
Headers: { 'x-pagehub-auth': tenant.authToken }

// Expected response:
{
  "document": "base64-compressed-page-data",
  "token": "session-token-for-saves"
}
```

**2. onSave** - Save edited page
```javascript
// PageHub calls:
POST {webhook}/onSave/{pageId}
Headers: { 'x-pagehub-auth': tenant.authToken, 'x-pagehub-token': sessionToken }
Body: {
  "tenantId": "tenant-id",
  "pageId": "page-id",
  "document": "base64-compressed-page-data",
  "isDraft": true,
  "settings": { title, description, etc. },
  "timestamp": "2025-10-06T..."
}

// Expected response:
{ "success": true, "_id": "page-id", ... }
```

**3. fetchPage** - Get page for static generation
```javascript
// PageHub calls during build:
GET {webhook}/fetchPage/{domain}
Headers: { 'x-pagehub-auth': tenant.authToken }

// Expected response:
{
  "title": "Page Title",
  "description": "Page Description",
  "content": "base64-compressed-page-data",
  "draft": "base64-compressed-draft-data"
}
```

**4. fetchPageList** - List pages for static paths
```javascript
// PageHub calls during build:
GET {webhook}/fetchPageList
Headers: { 'x-pagehub-auth': tenant.authToken }

// Expected response:
{
  "pages": ["domain1.com", "domain2.com", ...]
}
```

### Authentication Flow
1. Tenant webhook receives `x-pagehub-auth` header (verifies request from PageHub)
2. User's session token passed as `x-pagehub-token` header (identifies user)
3. External CMS validates both tokens before returning data

## Performance Optimizations

### Compression
- **LZUTF8**: Page data compressed to ~10-20% of original size
- **Base64 Encoding**: Safe URL/storage transmission

### Lazy Loading
- **Component Splitting**: Heavy components code-split
- **Intersection Observer**: Load components as they enter viewport
- **Font Loading**: Progressive font enhancement

### Caching
- **Static Generation**: Pre-render published pages
- **ISR**: Revalidate every 60 seconds
- **CDN**: Static assets cached at edge
- **Browser Cache**: `Cache-Control` headers (60s + 300s stale-while-revalidate)

### Virtualization
- **react-window**: Virtual scrolling for long lists
- **Viewport List**: Only render visible components

## Development Workflow

### Setup
```bash
npm install
npm run start  # Dev server on localhost:3000
```

### Environment Variables
```
MONGODB_URI=mongodb://...
API_ENDPOINT=https://api.pagehub.dev
DOMAIN=pagehub.dev
NEXTAUTH_URL=https://pagehub.dev
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Scripts
- `npm run build` - Production build
- `npm run create-test-tenant` - Generate test tenant
- `npm run build-templates` - Compile section templates

### File Structure
```
pages/
  _app.tsx                 - Global app wrapper
  [[...slug]].tsx          - Marketing/preview pages
  build/[[...slug]].tsx    - Editor interface
  static/[[...slug]].tsx   - Static site output
  api/                     - API routes

components/
  editor/                  - Editor UI components
    NodeControllers/       - Visual editing controls
    Toolbar/              - Settings panel
      Inputs/             - Input components
      Tools/              - Dialogs (color, font, pattern)
    Viewport/             - Main editor viewport
      Toolbox/            - Left sidebar components
  selectors/              - Drag-drop components
  home/                   - Marketing homepage

models/                   - MongoDB schemas
utils/                    - Utilities (tailwind, color, etc.)
data/section-templates/   - Pre-built sections
```

## Key Concepts

### Craft.js Fundamentals
- **Node**: Single component instance with ID
- **Node Tree**: Hierarchical structure of all components
- **Serialization**: Convert tree to JSON
- **Deserialization**: Restore tree from JSON
- **Connector**: Drag/drop/hover attachment
- **useNode Hook**: Access node data/methods
- **useEditor Hook**: Access global editor state
- **Element Component**: Wrapper that registers component with Craft.js

### Recoil State Atoms
- **SettingsAtom**: Page/site settings
- **PreviewAtom**: Preview mode enabled
- **ViewAtom**: desktop/mobile viewport
- **IsolateAtom**: Current isolated page ID
- **UnsavedChangesAtom**: Pending changes
- **ToolboxMenu**: Context menu state
- **SelectedNodeAtom**: Currently selected component
- **SessionTokenAtom**: Auth token for webhooks

### Multi-Page Editing
- Pages stored as children of ROOT_NODE
- **Page Isolation**: Hide all pages except active one
- URL reflects active page: `/build/[tenant]/[page-slug]`
- Page navigation updates URL without reload
- Each page has own displayName, SEO, and settings

## Common Patterns

### Adding a New Component
1. Create component in `components/selectors/[Name]/`
2. Define props interface extending `BaseSelectorProps`
3. Implement component with `useNode` hook
4. Add `[Name].craft` config (displayName, rules, toolbar)
5. Create settings component (toolbar)
6. Register in `editorComponents` object
7. Add to toolbox in `Toolbox/Components.tsx`

### Custom Styling
1. Use `ClassGenerator` to convert props to Tailwind
2. Support responsive props (mobile/tablet/desktop)
3. Add custom style string for raw CSS
4. Apply accessibility props via `mergeAccessibilityProps`
5. Use `applyAnimation` for AOS integration

### Webhook Integration
1. Create tenant in MongoDB with webhook URLs
2. Implement webhook endpoints matching PageHub spec
3. Return/accept base64-compressed data
4. Validate `x-pagehub-auth` token
5. Handle session tokens for user-specific data

## Troubleshooting

### Common Issues
- **Hydration Errors**: Use `isMounted` state to avoid SSR/client mismatch
- **Circular Dependencies**: Lazy load components in dialogs
- **State Updates**: Use Recoil or Craft.js state, not React state for global data
- **Undo/Redo**: Only works with Craft.js state changes (use `setProp`)
- **Z-Index Conflicts**: Editor overlays use high z-index (9997+)

### Debug Tools
- Set `enableContext = true` in code to enable right-click debugging
- Check `window.localStorage.clipBoard` for copy/paste data
- Use `query.node(id).get()` to inspect node tree
- Console logs in `lib.tsx` show isolation/page changes

## Deployment

### Vercel (Recommended)
1. Connect GitHub repo
2. Set environment variables
3. Deploy via Git push
4. Configure custom domains via Vercel dashboard

### Custom Domain Setup
1. Add domain to tenant `domains` array
2. Configure DNS: CNAME to Vercel
3. Page uses `/static/[domain]` route
4. ISR handles cache revalidation

## Future Enhancements
- Component marketplace
- Team collaboration (real-time editing)
- Version history UI
- A/B testing support
- Advanced analytics integration
- Custom code blocks (HTML/CSS/JS)
- Plugin system for third-party integrations

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Maintained By**: PageHub Team
