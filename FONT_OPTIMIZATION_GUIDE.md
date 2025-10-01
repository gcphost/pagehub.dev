# Font Loading Optimization Guide

## Problem Statement
The site was experiencing a poor loading experience with a noticeable waterfall effect:
1. Data loads instantly
2. Styles load next
3. Fonts load last (causing FOUC - Flash of Unstyled Content)

This created a jarring user experience while also needing to maintain good PageSpeed Insights scores.

## Solutions Implemented

### 1. Critical CSS Inlining Strategy
**File: `pages/_document.tsx`**

- **Kept** Tailwind CDN on `beforeInteractive` for consistent styling
  - Ensures styles are available immediately
  - Prevents major layout shifts
  
- **Added** crossOrigin attribute to Google Fonts preconnect
  - Improves font loading performance
  - Enables early connection to font servers

- **Inlined** critical CSS for immediate rendering
  - Box-sizing, font-family fallbacks, basic resets
  - Prevents layout shifts before Tailwind loads
  - Uses system fonts as fallback for instant text rendering

### 2. Enhanced Font Loading with CSS2 API
**Files: `utils/lib.ts`, `components/editor/Toolbar/Inputs/FontFamiltAltInput.tsx`**

- **Upgraded** from Google Fonts CSS v1 to CSS2 API
  - Better caching and performance
  - More efficient font delivery
  
- **Improved** weight syntax for proper font loading
  - Uses `:wght@400;700` format instead of legacy syntax
  
- **Uses** `font-display: swap` for optimal UX
  - Shows system font immediately
  - Swaps to custom font when ready
  - Prevents invisible text (FOIT)

### 3. Font Loading API Integration
**File: `utils/fontLoader.ts` (new)**

Created comprehensive font loading utilities:
- `waitForFonts()` - Preloads fonts using CSS Font Loading API (non-blocking)
- `loadGoogleFont()` - Dynamic font loader with proper display strategies
- `preloadFont()` - Preload critical fonts
- `getFontLoadingState()` - Check loading status
- Built-in timeout mechanism (default 1 second)

### 4. Non-Blocking Font Preload
**Files: `pages/[[...slug]].tsx`, `pages/static/[[...slug]].tsx`**

- **Added** background font preloading
- **Does NOT block** content rendering (critical for FCP)
- **Uses** `font-display: swap` to handle the transition
  
- **Allows** content to show immediately with fallback fonts
- **Seamlessly swaps** to custom fonts when ready

## Performance Impact

### Before:
```
HTML → Tailwind (blocking) → Content → JS → Fonts (FOUC)
```

### After:
```
HTML + Critical CSS → Content (with fallback fonts) → Fonts swap in gracefully
            ↓
    Tailwind (beforeInteractive)
            ↓
    Font preload (non-blocking)
```

## Key Principle: Never Block FCP

**CRITICAL:** Content must be visible immediately for PageSpeed Insights.
- ✅ Use `font-display: swap` to show fallback fonts
- ✅ Preload fonts in background
- ❌ Never hide content with opacity/visibility
- ❌ Never wait for fonts before rendering

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

