# SEO Improvements for PageHub

## Overview
This document outlines the comprehensive SEO improvements made to the PageHub page builder platform.

## What Was Added

### 1. Enhanced SEO Input Component (`components/editor/Toolbar/Inputs/SEOInput.tsx`)

#### Basic SEO Section
- **Page Title** - Optimized for 50-60 characters
- **Meta Description** - Optimized for 150-160 characters
- **Keywords** - Comma-separated keyword list
- **Author** - Content author name

#### Open Graph (Social Media) Section
- **OG Title** - Custom title for social sharing (defaults to page title)
- **OG Description** - Custom description for social sharing
- **OG Image** - Social media preview image (1200x630px recommended)
- **OG Type** - Content type (website, article, product, profile)

#### Twitter/X Card Section
- **Card Type** - Summary large image or summary
- **Twitter Site** - Website's Twitter handle (@username)
- **Twitter Creator** - Author's Twitter handle

#### Advanced SEO Section
- **Canonical URL** - Prevent duplicate content issues
- **Robots** - Control indexing (noindex, nofollow options)
- **Theme Color** - Mobile browser theme color

### 2. Updated Data Parsing (`pages/api/page/[[...slug]].js`)

The `parseContent` function now extracts and passes all SEO fields:
- Basic metadata (title, description, keywords, author)
- Open Graph data
- Twitter card data
- Advanced settings (canonical, robots, theme color)

### 3. Enhanced Static Page Rendering (`pages/static/[[...slug]].tsx`)

Now generates complete meta tags using NextSeo:
```tsx
<NextSeo
  title={...}
  description={...}
  canonical={...}
  additionalMetaTags={[...]}
  openGraph={{...}}
  twitter={{...}}
/>
```

### 4. Enhanced Dynamic Page Rendering (`pages/[[...slug]].tsx`)

Same comprehensive meta tag generation as static pages.

### 5. Improved Document Head (`pages/_document.tsx`)

Added essential meta tags:
- Viewport configuration
- Complete favicon setup
- Apple touch icons
- Web manifest link

### 6. SEO Utilities (`utils/seo.ts`)

New utility functions for:
- Generating JSON-LD structured data (WebPage, Organization, Breadcrumb)
- Sanitizing titles and descriptions
- URL manipulation helpers
- Schema.org markup generation

## What Gets Rendered

When a page is published, the following meta tags are now generated:

```html
<head>
  <!-- Basic Meta -->
  <title>Your Page Title</title>
  <meta name="description" content="Your page description">
  <meta name="keywords" content="keyword1, keyword2, keyword3">
  <meta name="author" content="Author Name">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
  <meta name="theme-color" content="#000000">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://yourdomain.com/page">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yourdomain.com/page">
  <meta property="og:title" content="Your OG Title">
  <meta property="og:description" content="Your OG Description">
  <meta property="og:image" content="https://yourdomain.com/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@yourusername">
  <meta name="twitter:creator" content="@authorusername">

  <!-- Favicons -->
  <link rel="icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
</head>
```

## Still Missing (Recommendations)

### High Priority
1. **Sitemap Generation** - Automatic sitemap.xml generation for all published pages
2. **JSON-LD Integration** - Add structured data to page output (use utilities in `utils/seo.ts`)
3. **Image Alt Text Enforcement** - Ensure all images have proper alt text
4. **Heading Structure Validation** - Warn if page doesn't have proper H1, H2 hierarchy

### Medium Priority
5. **Page Speed Optimization**
   - Lazy loading for images (may already be implemented)
   - Font optimization
   - CSS/JS minification
   
6. **Mobile Optimization Validation**
   - Mobile-friendly test warnings
   - Touch target size validation

7. **Accessibility (which affects SEO)**
   - ARIA labels
   - Semantic HTML validation
   - Color contrast checking

### Nice to Have
8. **SEO Score/Preview** - Show real-time SEO score in the editor
9. **Social Media Preview** - Live preview of how page looks on Twitter/Facebook
10. **Broken Link Checker** - Validate all internal/external links
11. **Duplicate Content Detection** - Warn about similar content
12. **Multilingual Support** - hreflang tags for international SEO

## Usage for Customers

### Setting Up SEO for a Page

1. **Open your page in the builder**
2. **Navigate to the Page Settings** (usually in the left sidebar or top toolbar)
3. **Find the SEO section** - now expanded with multiple subsections
4. **Fill in the fields:**

   **Basic SEO (Required):**
   - Add a compelling title (keep it under 60 characters)
   - Write a description that summarizes the page (150-160 characters)
   - Add relevant keywords separated by commas
   
   **Social Media (Highly Recommended):**
   - Upload an OG Image (1200x630px) - this is what shows when someone shares your page
   - Customize the social media title/description if you want it different from the main title
   
   **Twitter (Optional but Recommended):**
   - Add your Twitter handle
   
   **Advanced (Optional):**
   - Set a canonical URL if this page is similar to another
   - Use "noindex" if you don't want search engines to find this page

### Best Practices

1. **Every page needs:**
   - Unique title (no duplicates across your site)
   - Unique description
   - At least one image with proper alt text
   - An OG image for social sharing

2. **Title writing tips:**
   - Include primary keyword
   - Make it compelling (people need to want to click)
   - Front-load important words
   - Don't stuff keywords

3. **Description writing tips:**
   - Include a call-to-action
   - Mention key benefits
   - Include primary and secondary keywords naturally

4. **Image recommendations:**
   - OG images should be 1200x630px
   - Use high-quality, relevant images
   - Include text overlay if appropriate (but keep it readable)
   - File size under 1MB for fast loading

## Testing Your SEO

After publishing, test your SEO with:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **Google Rich Results Test**: https://search.google.com/test/rich-results
4. **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

## Implementation Notes for Developers

### Adding Structured Data

To add JSON-LD structured data to a page, use the utilities in `utils/seo.ts`:

```typescript
import { generateWebPageSchema } from 'utils/seo';

const schema = generateWebPageSchema({
  name: seo.title,
  description: seo.description,
  url: fullUrl,
  image: seo.ogImage,
  author: seo.author,
});

// Add to page:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
```

### Sitemap Generation

Consider implementing automated sitemap generation in `pages/api/sitemap.xml.js`:

```javascript
// Generate sitemap for all published pages
// Should include:
// - All pages with public visibility
// - Last modified dates
// - Change frequency
// - Priority
```

### Analytics Integration

Consider adding:
- Google Analytics 4
- Google Search Console integration
- Core Web Vitals tracking

## Performance Considerations

The new SEO features add minimal overhead:
- All SEO data is extracted during the existing `parseContent` call
- NextSeo is already in use, just with more complete data
- No additional API calls or database queries
- Static pages benefit from ISR caching

## Migration

Existing pages will continue to work with their current SEO setup. The new fields will be empty until populated by users. All new fields have sensible defaults:
- OG Title/Description fall back to page title/description
- Twitter card defaults to "summary_large_image"
- OG Type defaults to "website"
- Robots defaults to standard indexing

No database migration needed - the SEO fields are stored in the page content JSON.

