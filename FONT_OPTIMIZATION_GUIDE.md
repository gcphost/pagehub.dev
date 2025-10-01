# Font Loading Optimization Guide

## Problem Statement
The site was experiencing a poor loading experience with a noticeable waterfall effect:
1. Data loads instantly
2. Styles load next
3. Fonts load last (causing FOUC - Flash of Unstyled Content)

This created a jarring user experience while also needing to maintain good PageSpeed Insights scores.

## Solutions Implemented

### 1. Optimized Tailwind CDN Loading Strategy
**File: `pages/_document.tsx`**

- **Changed** Tailwind CDN from `beforeInteractive` to `lazyOnload`
  - Previously blocked rendering, now loads asynchronously
  - Inlined critical Tailwind base styles to prevent FOUC
  
- **Added** crossOrigin attribute to Google Fonts preconnect
  - Improves font loading performance

- **Inlined** critical CSS for immediate rendering
  - Box-sizing, font-family fallbacks, basic resets
  - Prevents layout shifts before Tailwind loads

### 2. Enhanced Font Loading with CSS2 API
**Files: `utils/lib.ts`, `components/editor/Toolbar/Inputs/FontFamiltAltInput.tsx`**

- **Upgraded** from Google Fonts CSS v1 to CSS2 API
  - Better caching and performance
  - More efficient font delivery
  
- **Improved** weight syntax for proper font loading
  - Uses `:wght@400;700` format instead of legacy syntax
  
- **Added** preload hints for faster font fetching
  - Fonts begin loading sooner in the page lifecycle

### 3. Font Loading API Integration
**File: `utils/fontLoader.ts` (new)**

Created comprehensive font loading utilities:
- `waitForFonts()` - Waits for fonts using CSS Font Loading API
- `loadGoogleFont()` - Dynamic font loader with proper display strategies
- `preloadFont()` - Preload critical fonts
- `getFontLoadingState()` - Check loading status
- Built-in timeout mechanism (default 2-3 seconds)

### 4. Opacity Transition for Smooth Loading
**Files: `pages/[[...slug]].tsx`, `pages/static/[[...slug]].tsx`**

- **Added** font readiness state tracking
- **Implemented** smooth fade-in transition (opacity 0→1)
  - Prevents flash of unstyled/mismatched fonts
  - 150ms transition for imperceptible load
  
- **Set** reasonable timeout (2 seconds)
  - Shows content even if fonts are slow
  - Prevents blank page issues

## Performance Impact

### Before:
```
HTML → Tailwind (blocking) → Content → JS → Fonts (FOUC)
```

### After:
```
HTML + Critical CSS → Content (opacity: 0) → Fonts → Fade-in (opacity: 1)
                   ↓
              Tailwind (async)
```

## Additional Optimization Tips

### 1. Consider Font Subsetting
Reduce font file size by only including characters you need:
```
https://fonts.googleapis.com/css2?family=Inter:wght@400;700&text=YourTextHere
```

### 2. Use Variable Fonts
Instead of loading multiple weights:
```
https://fonts.googleapis.com/css2?family=Inter:wght@100..900
```

### 3. Self-Host Fonts (Advanced)
For maximum control and performance:
- Download fonts from Google Fonts
- Use `@font-face` with proper `font-display: swap`
- Serve from your CDN

### 4. Preload Critical Fonts in _document.tsx
```tsx
<link
  rel="preload"
  href="/fonts/inter-var.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

### 5. Adjust Timeout Based on Analytics
Monitor actual font load times:
- If fonts load quickly (< 1s): reduce timeout
- If fonts are slow (> 2s): consider self-hosting

### 6. Use font-display Strategically
- `swap` - Best for most cases (used in this implementation)
- `optional` - Best for performance (font only loads if cached)
- `fallback` - Compromise between swap and optional

## PageSpeed Insights Optimization

These changes should improve:
- **First Contentful Paint (FCP)** - Faster initial render with critical CSS
- **Largest Contentful Paint (LCP)** - Optimized font loading
- **Cumulative Layout Shift (CLS)** - Reduced layout shifts
- **Total Blocking Time (TBT)** - Removed blocking scripts

## Monitoring & Testing

### Test Font Loading Performance:
```javascript
// In browser console
document.fonts.ready.then(() => {
  console.log('Fonts loaded at:', performance.now(), 'ms');
});
```

### Check for FOUC:
1. Open DevTools → Network tab
2. Throttle to "Slow 3G"
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Watch for font swapping

### Verify PageSpeed Score:
1. Run lighthouse in DevTools
2. Check https://pagespeed.web.dev/
3. Monitor Core Web Vitals in Google Search Console

## Rollback Instructions

If issues occur, revert these changes:

1. **_document.tsx**: Change Tailwind back to `beforeInteractive`
2. **Remove** font loading utilities imports
3. **Remove** opacity transition wrapper from page components

## Future Considerations

- **Next.js Font Optimization**: Consider using `next/font/google` for automatic optimization
- **Critical Font Detection**: Analyze which fonts are actually needed on first paint
- **CDN Strategy**: Serve fonts from same origin as main site for better caching
- **Font Loading Metrics**: Add analytics to track font load performance

---

**Last Updated**: October 1, 2025
**Performance Target**: LCP < 2.5s, CLS < 0.1, FCP < 1.8s

