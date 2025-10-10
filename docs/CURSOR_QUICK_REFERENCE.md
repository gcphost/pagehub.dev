# PageHub Quick Reference Guide

## Essential File Locations

### Components
- **Drag-drop components**: `components/selectors/[ComponentName]/index.tsx`
- **Component settings**: `components/selectors/[ComponentName]/[ComponentName]Settings.tsx`
- **Node controllers**: `components/editor/NodeControllers/`
- **Toolbar inputs**: `components/editor/Toolbar/Inputs/`

### Pages
- **Editor page**: `pages/build/[[...slug]].tsx`
- **Static/published**: `pages/static/[[...slug]].tsx`
- **Preview/marketing**: `pages/[[...slug]].tsx`

### API
- **Save endpoint**: `pages/api/save.js`
- **Load endpoint**: `pages/api/page/[[...slug]].js`
- **Media**: `pages/api/files.js`, `pages/api/media/`

### Data/Config
- **Section templates**: `data/section-templates/*.json`
- **Models**: `models/*.js` (tenant, page, user)
- **Utils**: `utils/*.ts` (tailwind, atoms, lib)

## Quick Code Snippets

### Creating a New Selector Component

```typescript
// components/selectors/MyComponent/index.tsx
import { useNode } from "@craftjs/core";
import { BaseSelectorProps } from "..";

export interface MyComponentProps extends BaseSelectorProps {
  customProp?: string;
}

export const MyComponent = (props: Partial<MyComponentProps>) => {
  const { connectors: { connect, drag } } = useNode();
  
  return (
    <div ref={(ref) => connect(drag(ref))}>
      {/* Your component JSX */}
    </div>
  );
};

MyComponent.craft = {
  displayName: "My Component",
  props: {
    canDelete: true,
    canEditName: true,
  },
  related: {
    toolbar: MyComponentSettings,
  },
};
```

### Accessing Component Props in Settings

```typescript
// components/selectors/MyComponent/MyComponentSettings.tsx
import { useNode } from "@craftjs/core";

export const MyComponentSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <input
        value={props.customProp || ""}
        onChange={(e) => 
          setProp((props) => (props.customProp = e.target.value))
        }
      />
    </div>
  );
};
```

### Responsive Props Pattern

```typescript
const className = ClassGenerator(
  props,        // All props
  view,         // 'desktop' | 'mobile' | 'tablet'
  enabled,      // Editor enabled?
  [],           // Props to skip
  [],           // Additional classes
  preview,      // Preview mode?
  false,        // Force mobile?
  palette       // Color palette
);
```

### Using Recoil State

```typescript
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { PreviewAtom, ViewAtom } from "components/editor/Viewport";

// Read-only
const view = useRecoilValue(ViewAtom);

// Read-write
const [preview, setPreview] = useRecoilState(PreviewAtom);

// Write-only
const setView = useSetRecoilState(ViewAtom);
```

### Accessing Craft.js Node Data

```typescript
import { useEditor, useNode } from "@craftjs/core";

// In a component
const { id, name } = useNode((node) => ({
  name: node.data.custom.displayName,
}));

// Global editor access
const { query, actions } = useEditor();

// Get node by ID
const node = query.node(nodeId).get();

// Get all nodes
const nodes = query.getNodes();

// Update prop
actions.setProp(nodeId, (props) => {
  props.myProp = newValue;
});

// Select node
actions.selectNode(nodeId);

// Delete node
actions.delete(nodeId);
```

### Adding Section Template

```json
// data/section-templates/mytemplate.json
{
  "id": "mytemplate",
  "name": "My Templates",
  "templates": [
    {
      "id": "my-template-1",
      "name": "My First Template",
      "structure": {
        "type": "Container",
        "props": {
          "root": {
            "py": "py-12",
            "backgroundColor": "bg-gray-100"
          }
        },
        "children": [
          {
            "type": "Text",
            "props": {
              "root": { "textAlign": "text-center" },
              "text": "<h2>Template Heading</h2>"
            }
          }
        ]
      }
    }
  ]
}
```

Then run: `npm run build-templates`

### Creating a Webhook Endpoint

```javascript
// Your external API
app.post('/pagehub/onSave/:pageId', async (req, res) => {
  // Verify PageHub auth token
  if (req.headers['x-pagehub-auth'] !== EXPECTED_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get session token (identifies user)
  const sessionToken = req.headers['x-pagehub-token'];
  
  // Extract data
  const { pageId, document, isDraft, settings } = req.body;
  
  // Save to your CMS
  await yourCMS.savePage(pageId, {
    content: document,
    draft: isDraft,
    ...settings
  });
  
  res.json({ success: true, _id: pageId });
});
```

## Common Tailwind Props

### Layout
- `display`: `flex`, `block`, `inline-block`, `grid`, `hidden`
- `flexDirection`: `flex-row`, `flex-col`
- `alignItems`: `items-start`, `items-center`, `items-end`
- `justifyContent`: `justify-start`, `justify-center`, `justify-end`, `justify-between`
- `gap`: `gap-0` to `gap-96`

### Spacing
- Margin: `mt-4`, `mb-4`, `ml-4`, `mr-4`, `mx-4`, `my-4`, `m-4`
- Padding: `pt-4`, `pb-4`, `pl-4`, `pr-4`, `px-4`, `py-4`, `p-4`
- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96

### Typography
- `fontSize`: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` to `text-9xl`
- `fontWeight`: `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- `textAlign`: `text-left`, `text-center`, `text-right`
- `textColor`: `text-{color}-{shade}` (e.g., `text-blue-500`)

### Background
- `backgroundColor`: `bg-{color}-{shade}`
- `backgroundGradient`: Use gradient picker (stored as CSS)
- `backgroundPattern`: SVG pattern ID

### Border
- `border`: `border`, `border-0`, `border-2`, `border-4`, `border-8`
- `borderColor`: `border-{color}-{shade}`
- `borderRadius`: `rounded-none`, `rounded-sm`, `rounded`, `rounded-lg`, `rounded-full`

## Debugging Commands

### In Browser Console

```javascript
// Get current editor state
window.__CRAFTJS_DEVTOOLS_STORE__

// Get selected node
const selected = window.__CRAFTJS_DEVTOOLS_STORE__.getState().events.selected;

// Inspect node tree
console.log(JSON.parse(localStorage.getItem('clipBoard')));

// Get all nodes
const editor = window.__CRAFTJS_EDITOR__;
const nodes = editor.query.getNodes();
```

### Common State Atoms (Recoil DevTools)

- `preview` - Preview mode
- `view` - desktop/mobile/tablet
- `settings` - Page settings
- `unsavedchanges` - Pending changes
- `enabled` - Editor enabled
- `device` - Device preview
- `editorTab` - Active toolbar tab

## API Endpoints Quick Reference

### Page Operations
```bash
# Load page
GET /api/page/:id

# Save page
POST /api/save
Body: { _id, content, draft, title, description }

# Check page exists
GET /api/check?id=:id
```

### Media
```bash
# Upload file
POST /api/files
Body: FormData with file

# Get media
GET /api/media/get?id=:id
```

### Utilities
```bash
# Compress content
POST /api/compress
Body: { content: "..." }

# Decompress content
POST /api/decompress
Body: { content: "base64..." }

# AI generate
POST /api/generate
Body: { prompt: "..." }
```

## Database Queries

### Find Pages
```javascript
// By ID
await Page.findOne({ _id: pageId });

// By domain
await Page.findOne({ domain: "example.com" });

// By draft ID
await Page.findOne({ draftId: "my-page" });

// All pages with domains
await Page.find({ domain: { $ne: null } });
```

### Tenant Operations
```javascript
// By subdomain
await Tenant.findOne({ subdomain: "acme" });

// By custom domain
await Tenant.findOne({ domains: "acme.com" });

// With webhooks
await Tenant.find({ 'webhooks.onSave': { $exists: true } });
```

## Environment Setup

### Required Variables
```bash
MONGODB_URI=mongodb+srv://...
API_ENDPOINT=http://localhost:3000/api
DOMAIN=localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### Optional Variables
```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
VERCEL_TOKEN=...
OPENAI_API_KEY=...
```

## Git Workflow

### Modified Files Check
```bash
git status
git diff
```

### Common Ignore Patterns
- `.next/` - Next.js build
- `node_modules/` - Dependencies
- `.env.local` - Local env vars
- `out/` - Export output

## Performance Tips

1. **Lazy Load Heavy Components**: Use dynamic imports
2. **Debounce User Input**: 300ms for search, 1000ms for save
3. **Memoize Expensive Calcs**: Use `useMemo` for ClassGenerator calls
4. **Virtual Scrolling**: For lists > 50 items
5. **Image Optimization**: Use Next.js Image, set fetchPriority
6. **Compress JSON**: Always use LZUTF8 for storage/transmission

## Common Pitfalls

1. **Don't use React setState for component props** → Use `setProp`
2. **Don't directly mutate node.data** → Use Craft.js actions
3. **Don't forget responsive breakpoints** → Support mobile/tablet/desktop
4. **Don't skip accessibility props** → Add ARIA labels
5. **Don't hardcode colors** → Use palette system
6. **Remember to compress page data** → LZUTF8 before save
7. **Check `enabled` flag** → Different behavior in editor vs preview

## Testing Checklist

### New Component
- [ ] Renders in all viewports (desktop/mobile/tablet)
- [ ] Drag and drop works
- [ ] Settings panel updates props
- [ ] Undo/redo works
- [ ] Copy/paste works
- [ ] Save/load persists correctly
- [ ] Preview mode works (no editor UI)
- [ ] Accessibility attributes present
- [ ] Animations work (if applicable)

### New Feature
- [ ] Works with existing pages
- [ ] Doesn't break serialization
- [ ] Handles missing/invalid data
- [ ] Mobile responsive
- [ ] Performance acceptable (no lag)
- [ ] Database schema updated (if needed)
- [ ] API docs updated (if needed)

---

**Need More Help?** See `CURSOR_PROJECT_SUMMARY.md` for detailed explanations.
