# CDN Configuration Guide

## Overview

The PageHub media system has been abstracted to support easy CDN provider switching. All CDN-related configuration is centralized in `utils/cdn.ts`.

## Environment Variables

### Client-Side Variables (NEXT_PUBLIC_*)

These variables are exposed to the browser and used for generating media URLs:

- **NEXT_PUBLIC_CDN_BASE_URL**: The base URL for your CDN provider
  - Default: `https://imagedelivery.net`
  - Example for other providers: `https://cdn.example.com`

- **NEXT_PUBLIC_CDN_ACCOUNT_HASH**: Your account identifier with the CDN provider
  - Default: `8PYt12v3QMuDRiYrOftNUQ`
  - For Cloudflare Images, this is your account hash

- **NEXT_PUBLIC_CDN_VARIANT**: The image variant/size to serve
  - Default: `public`
  - For Cloudflare Images, variants are defined in your dashboard

### Server-Side Variables

These variables are only used on the server for API operations:

- **CLOUDFLARE_API_URL**: Cloudflare API base URL
  - Default: `https://api.cloudflare.com/client/v4`

- **CLOUDFLARE_ID**: Your Cloudflare account ID
  - Required for uploading images

- **CLOUDFLARE_TOKEN**: Your Cloudflare API token
  - Required for authentication with Cloudflare APIs

## Files Changed

The following files have been updated to use the centralized CDN configuration:

1. **utils/cdn.ts** (NEW)
   - Central configuration and helper functions
   - All CDN URLs are generated here

2. **utils/lib.ts**
   - `getMedialUrl()` - Uses `getCdnUrl()`
   - `getBackgroundUrl()` - Uses `getCdnUrl()`

3. **next.config.js**
   - Remote image patterns now use `getCdnImageConfig()`

4. **pages/api/media/get.ts**
   - Upload URL generation uses `getCdnUploadUrl()`
   - Auth headers use `getCdnAuthHeaders()`

## Switching CDN Providers

To switch from Cloudflare Images to another CDN provider:

### 1. Update Environment Variables

Update `.env` or `.env.local` with your new CDN details:

```bash
NEXT_PUBLIC_CDN_BASE_URL=https://your-cdn-provider.com
NEXT_PUBLIC_CDN_ACCOUNT_HASH=your_account_id
NEXT_PUBLIC_CDN_VARIANT=your_variant_name
```

### 2. Update Upload Logic (if needed)

If your new CDN provider has a different upload API:

- Modify `pages/api/media/get.ts` to generate the correct upload URL
- Update `utils/cdn.ts` helper functions if the URL structure differs
- Adjust `getCdnUploadUrl()` and `getCdnAuthHeaders()` as needed

### 3. Test Media URLs

The media URL format is: `{CDN_BASE_URL}/{ACCOUNT_HASH}/{MEDIA_ID}/{VARIANT}`

Ensure this format works with your new provider, or modify `getCdnUrl()` in `utils/cdn.ts`.

## Alternative: MongoDB Storage

The system also includes a fallback MongoDB-based media storage system that stores images as base64. This is useful for:

- Development/testing without CDN setup
- Small deployments with limited media
- Backup storage system

Files involved:
- `pages/api/files.js` - Stores media in MongoDB
- `pages/api/media/[[...slug]].js` - Serves media from MongoDB

## Current Architecture

```
┌─────────────────────┐
│  Frontend Component │
│   (uploads image)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│  GetSignedUrl()             │
│  → /api/media/get           │
│  → getCdnUploadUrl()        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  SaveMedia(file, signedURL) │
│  → Direct upload to CDN     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  CDN stores media           │
│  Returns media ID           │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  getCdnUrl(mediaId)         │
│  → Generate public URL      │
└─────────────────────────────┘
```

## Example: Using Custom CDN

```typescript
// .env
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.myservice.com
NEXT_PUBLIC_CDN_ACCOUNT_HASH=my-bucket-name
NEXT_PUBLIC_CDN_VARIANT=optimized

// The system will now generate URLs like:
// https://cdn.myservice.com/my-bucket-name/{mediaId}/optimized
```

## Troubleshooting

1. **Images not loading**: Check that `NEXT_PUBLIC_CDN_BASE_URL` and `NEXT_PUBLIC_CDN_ACCOUNT_HASH` are set correctly

2. **Upload failures**: Verify `CLOUDFLARE_ID` and `CLOUDFLARE_TOKEN` are valid

3. **Next.js image optimization errors**: Ensure the hostname in `getCdnImageConfig()` matches your CDN domain

4. **Mixed content errors**: Ensure your CDN uses HTTPS

## Future Improvements

Consider implementing:
- Multiple CDN provider adapters (S3, Cloudinary, etc.)
- Image transformation parameters
- CDN purge/invalidation API
- Automatic failover between CDN and MongoDB storage


