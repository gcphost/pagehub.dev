# PageHub Webhook Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing PageHub tenant webhooks with authentication forwarding.

## Prerequisites

- Webhook endpoints must be publicly accessible via HTTPS
- Endpoints must handle the expected request/response formats
- Authentication validation logic must be implemented

## Step 1: Configure Webhook URLs

Set up your webhook endpoints in your tenant configuration:

```javascript
const tenant = {
  webhooks: {
    onLoad: "https://your-domain.com/webhook/load",
    onSave: "https://your-domain.com/webhook/save"
  }
};
```

## Step 2: Implement onLoad Webhook (GET)

### Endpoint Structure
```
GET https://your-domain.com/webhook/load/{pageId}
```

### Headers You'll Receive
```
Authorization: Bearer {user-token}
X-API-Key: {user-api-key}
Cookie: {user-session-cookies}
```

### Query Parameters
```
GET /webhook/load/page123?auth=token123&user=john
```

### Implementation Example

```javascript
// Express.js example
app.get('/webhook/load/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    // Extract authentication
    const authToken = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];
    const queryToken = req.query.auth;
    
    // Validate authentication
    if (!authToken && !apiKey && !queryToken) {
      return res.status(401).json({ error: 'No authentication provided' });
    }
    
    // Validate token (implement your validation logic)
    if (authToken && !await validateToken(authToken)) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Load page from your system
    const page = await loadPageFromDatabase(pageId);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    // Return page data
    res.json({
      document: page.content, // Base64 encoded
      title: page.title,
      description: page.description,
      metadata: page.metadata || {}
    });
    
  } catch (error) {
    console.error('Load webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Step 3: Implement onSave Webhook (POST)

### Endpoint Structure
```
POST https://your-domain.com/webhook/save/{pageId}
```

### Request Body Structure
```json
{
  "tenantId": "tenant-mongodb-id",
  "pageId": "page-identifier",
  "document": "base64-encoded-content",
  "isDraft": true,
  "settings": {
    "title": "Page Title",
    "description": "Page Description",
    "_id": "page-identifier",
    "draft": "base64-encoded-draft"
  },
  "timestamp": "2025-01-01T00:00:00.000Z",
  "auth": {
    "query": {
      "auth": "token123",
      "user": "john"
    },
    "headers": ["authorization", "x-api-key"],
    "userAgent": "Mozilla/5.0...",
    "ip": "192.168.1.1"
  }
}
```

### Implementation Example

```javascript
// Express.js example
app.post('/webhook/save/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { tenantId, document, isDraft, settings, auth } = req.body;
    
    // Extract authentication from multiple sources
    const authToken = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];
    const queryToken = auth?.query?.auth;
    const userAgent = auth?.userAgent;
    const clientIP = auth?.ip;
    
    // Validate authentication
    if (!authToken && !apiKey && !queryToken) {
      return res.status(401).json({ error: 'No authentication provided' });
    }
    
    // Implement your validation logic
    if (authToken && !await validateToken(authToken)) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (queryToken && !await validateQueryToken(queryToken)) {
      return res.status(401).json({ error: 'Invalid query token' });
    }
    
    // Additional security checks
    if (!isValidUserAgent(userAgent)) {
      return res.status(403).json({ error: 'Invalid user agent' });
    }
    
    // Save page to your system
    await savePageToDatabase(pageId, {
      content: document,
      title: settings.title,
      description: settings.description,
      isDraft: isDraft,
      metadata: settings
    });
    
    // Return success response
    res.json({
      _id: pageId,
      title: settings.title,
      draftId: pageId,
      saved: true,
      timestamp: new Date().toISOString(),
      webhookReceived: true
    });
    
  } catch (error) {
    console.error('Save webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Step 4: Authentication Validation Functions

### JWT Token Validation
```javascript
const jwt = require('jsonwebtoken');

async function validateToken(authHeader) {
  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check expiration
    if (decoded.exp < Date.now() / 1000) {
      return false;
    }
    
    // Additional validation logic
    return await isValidUser(decoded.userId);
  } catch (error) {
    return false;
  }
}
```

### API Key Validation
```javascript
async function validateApiKey(apiKey) {
  const validKeys = process.env.VALID_API_KEYS.split(',');
  return validKeys.includes(apiKey);
}
```

### Short-lived Token Validation
```javascript
async function validateQueryToken(token) {
  try {
    const tokenData = decryptToken(token);
    const maxAge = 300; // 5 minutes
    
    if (!tokenData || !tokenData.timestamp) {
      return false;
    }
    
    const age = (Date.now() - tokenData.timestamp) / 1000;
    return age < maxAge;
  } catch (error) {
    return false;
  }
}
```

## Step 5: Error Handling

### Standard Error Responses
```javascript
// 401 Unauthorized
res.status(401).json({
  error: 'Unauthorized',
  code: 'INVALID_TOKEN',
  details: 'Token has expired'
});

// 403 Forbidden
res.status(403).json({
  error: 'Forbidden',
  code: 'INSUFFICIENT_PERMISSIONS',
  details: 'User does not have permission to access this page'
});

// 404 Not Found
res.status(404).json({
  error: 'Page not found',
  code: 'PAGE_NOT_FOUND'
});

// 500 Internal Server Error
res.status(500).json({
  error: 'Internal server error',
  code: 'INTERNAL_ERROR',
  details: 'Database connection failed'
});
```

## Step 6: Testing Your Implementation

### Using the Test Webhook
1. Set your webhook URL to: `http://localhost:3000/api/test-webhook`
2. Test with different authentication methods
3. Check the server logs for received authentication data

### Manual Testing
```bash
# Test onLoad webhook
curl -H "Authorization: Bearer test-token" \
     -H "X-API-Key: test-key" \
     "https://your-domain.com/webhook/load/test-page?auth=token123"

# Test onSave webhook
curl -X POST \
     -H "Authorization: Bearer test-token" \
     -H "Content-Type: application/json" \
     -d '{"tenantId":"test","pageId":"test-page","document":"content","isDraft":true,"settings":{"title":"Test"},"timestamp":"2025-01-01T00:00:00.000Z"}' \
     "https://your-domain.com/webhook/save/test-page"
```

## Step 7: Security Best Practices

### 1. Input Validation
```javascript
function validatePageId(pageId) {
  // Only allow alphanumeric and hyphens
  return /^[a-zA-Z0-9-]+$/.test(pageId) && pageId.length <= 50;
}

function validateDocument(document) {
  // Check if it's valid base64
  try {
    Buffer.from(document, 'base64');
    return true;
  } catch {
    return false;
  }
}
```

### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many webhook requests from this IP'
});

app.use('/webhook', webhookLimiter);
```

### 3. Logging and Monitoring
```javascript
function logWebhookRequest(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
}

app.use('/webhook', logWebhookRequest);
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving requests**
   - Check that your endpoint is publicly accessible
   - Verify HTTPS is enabled
   - Check firewall settings

2. **Authentication validation failing**
   - Verify token format and expiration
   - Check that headers are being forwarded correctly
   - Test with the test webhook endpoint

3. **Response format errors**
   - Ensure response matches expected JSON schema
   - Check that required fields are included
   - Verify content-type headers

### Debug Mode
```javascript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[WEBHOOK DEBUG] ${message}:`, data);
  }
}

// Use in your webhook handlers
debugLog('Received request', {
  headers: req.headers,
  query: req.query,
  body: req.body
});
```

## Next Steps

1. **Implement your webhook endpoints** following this guide
2. **Test thoroughly** using the test webhook endpoint
3. **Monitor performance** and implement proper logging
4. **Set up alerts** for webhook failures
5. **Document your authentication scheme** for your team
