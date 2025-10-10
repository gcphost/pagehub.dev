# PageHub Tenant Webhooks

PageHub supports webhooks for tenant-specific page management, allowing tenants to handle their own page loading and saving logic while maintaining authentication context.

## Overview

When a tenant has webhooks configured, PageHub will forward page operations to the tenant's webhook endpoints instead of handling them internally. This enables tenants to:

- Implement custom authentication and authorization
- Store pages in their own systems
- Apply custom business logic during page operations
- Maintain full control over their data

## Webhook Types

### 1. onLoad Webhook (GET)
Triggered when a user loads a page on the tenant's subdomain.

**Endpoint**: `GET {tenant.webhooks.onLoad}/{pageId}`

**Purpose**: Load page content and metadata from the tenant's system.

### 2. onSave Webhook (POST)
Triggered when a user saves a page on the tenant's subdomain.

**Endpoint**: `POST {tenant.webhooks.onSave}/{pageId}`

**Purpose**: Save page content and metadata to the tenant's system.

## Authentication Forwarding

PageHub automatically forwards authentication information from the original user request to your webhook endpoints. This includes:

### Headers Forwarded
- `Authorization` - Bearer tokens, API keys, etc.
- `X-API-Key` - Custom API key headers
- `X-Auth-Token` - Custom auth token headers
- `X-Access-Token` - Access token headers
- `Cookie` - Session cookies and other cookie-based auth

### Query Parameters
All URL query parameters from the original request are included in the webhook payload.

### Additional Context
- User Agent
- Client IP Address
- Request timestamp

## Webhook Payloads

### onLoad Webhook (GET)

**Headers Received:**
```
Authorization: Bearer {original-token}
X-API-Key: {original-api-key}
Cookie: {original-cookies}
```

**Query Parameters:**
```
GET /webhook/endpoint/page123?auth=token123&user=john
```

**Expected Response:**
```json
{
  "document": "base64-encoded-page-content",
  "title": "Page Title",
  "description": "Page Description",
  "metadata": {
    "customField": "value"
  }
}
```

### onSave Webhook (POST)

**Headers Received:**
```
Authorization: Bearer {original-token}
X-API-Key: {original-api-key}
Cookie: {original-cookies}
Content-Type: application/json
```

**Request Body:**
```json
{
  "tenantId": "tenant-mongodb-id",
  "pageId": "page-identifier",
  "document": "base64-encoded-page-content",
  "isDraft": true,
  "settings": {
    "title": "Page Title",
    "description": "Page Description",
    "_id": "page-identifier",
    "draft": "base64-encoded-draft-content"
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

**Expected Response:**
```json
{
  "_id": "page-identifier",
  "title": "Page Title",
  "draftId": "draft-identifier",
  "saved": true,
  "timestamp": "2025-01-01T00:00:00.000Z",
  "webhookReceived": true
}
```

## Implementation Examples

### Node.js/Express Webhook Handler

```javascript
// onLoad webhook
app.get('/webhook/load/:pageId', (req, res) => {
  const { pageId } = req.params;
  const authToken = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];
  
  // Validate authentication
  if (!isValidToken(authToken)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Load page from your system
  const page = await loadPageFromDatabase(pageId);
  
  res.json({
    document: page.content,
    title: page.title,
    description: page.description
  });
});

// onSave webhook
app.post('/webhook/save/:pageId', async (req, res) => {
  const { pageId, document, isDraft, settings, auth } = req.body;
  
  // Validate authentication from forwarded auth info
  const authToken = req.headers.authorization;
  if (!isValidToken(authToken)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Additional validation using query params
  const queryToken = auth.query.token;
  if (!isValidQueryToken(queryToken)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Save to your system
  await savePageToDatabase(pageId, document, settings);
  
  res.json({
    _id: pageId,
    title: settings.title,
    draftId: pageId,
    saved: true,
    timestamp: new Date().toISOString(),
    webhookReceived: true
  });
});
```

### Python/Flask Webhook Handler

```python
from flask import Flask, request, jsonify
import jwt

app = Flask(__name__)

@app.route('/webhook/load/<page_id>', methods=['GET'])
def load_page(page_id):
    # Get auth from headers
    auth_token = request.headers.get('Authorization')
    api_key = request.headers.get('X-API-Key')
    
    # Validate authentication
    if not validate_token(auth_token):
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Load page from your system
    page = load_page_from_database(page_id)
    
    return jsonify({
        'document': page['content'],
        'title': page['title'],
        'description': page['description']
    })

@app.route('/webhook/save/<page_id>', methods=['POST'])
def save_page(page_id):
    data = request.get_json()
    
    # Validate authentication
    auth_token = request.headers.get('Authorization')
    if not validate_token(auth_token):
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Additional validation using forwarded auth info
    auth_info = data.get('auth', {})
    query_token = auth_info.get('query', {}).get('token')
    if not validate_query_token(query_token):
        return jsonify({'error': 'Invalid token'}), 401
    
    # Save to your system
    save_page_to_database(page_id, data['document'], data['settings'])
    
    return jsonify({
        '_id': page_id,
        'title': data['settings'].get('title'),
        'draftId': page_id,
        'saved': True,
        'timestamp': datetime.utcnow().isoformat(),
        'webhookReceived': True
    })
```

## Authentication Patterns

### JWT Token Validation
```javascript
function validateJWT(token) {
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    return decoded.exp > Date.now() / 1000; // Check expiration
  } catch (error) {
    return false;
  }
}
```

### API Key Validation
```javascript
function validateAPIKey(apiKey) {
  const validKeys = process.env.VALID_API_KEYS.split(',');
  return validKeys.includes(apiKey);
}
```

### Short-lived Token Pattern
```javascript
function validateShortLivedToken(token, maxAge = 300) { // 5 minutes
  const tokenData = decryptToken(token);
  return tokenData && (Date.now() - tokenData.timestamp) < maxAge * 1000;
}
```

## Error Handling

### Standard HTTP Status Codes
- `200` - Success
- `401` - Unauthorized (invalid/missing auth)
- `403` - Forbidden (valid auth but insufficient permissions)
- `404` - Page not found
- `500` - Internal server error

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## Security Considerations

1. **Validate All Authentication**: Always validate tokens, API keys, and other auth mechanisms
2. **Check Token Expiration**: Implement proper expiration checks for time-sensitive tokens
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **HTTPS Only**: Always use HTTPS for webhook endpoints
5. **Input Validation**: Validate and sanitize all input data
6. **Logging**: Log authentication attempts and failures for monitoring

## Testing

Use the test webhook endpoint to verify your implementation:

```
GET/POST http://localhost:3000/api/test-webhook/{pageId}
```

This endpoint logs all received authentication information and can help you verify that your webhook is receiving the expected data.

## Configuration

Configure webhooks in your tenant settings:

```javascript
const tenant = {
  webhooks: {
    onLoad: "https://your-domain.com/webhook/load",
    onSave: "https://your-domain.com/webhook/save"
  }
};
```

The webhook URLs should be publicly accessible HTTPS endpoints that can handle the expected request/response formats.
