# PageHub Documentation

This directory contains comprehensive documentation for PageHub's tenant webhook system.

## Files

- **[webhooks.md](./webhooks.md)** - Complete guide to implementing tenant webhooks
- **[webhook-api.json](./webhook-api.json)** - OpenAPI 3.0 specification for webhook endpoints

## Quick Start

1. **Read the webhook guide**: Start with `webhooks.md` for implementation details
2. **Use the API spec**: Reference `webhook-api.json` for exact request/response formats
3. **Test your implementation**: Use the test webhook endpoint to verify your setup

## Key Features

### Authentication Forwarding
PageHub automatically forwards authentication information from the original user request to your webhook endpoints:

- **Headers**: `Authorization`, `X-API-Key`, `X-Auth-Token`, `Cookie`, etc.
- **Query Parameters**: All URL parameters (e.g., `?auth=token123&user=john`)
- **Context**: User agent, IP address, request timestamp

### Webhook Types

#### onLoad Webhook (GET)
- **Purpose**: Load page content when users visit tenant subdomains
- **Authentication**: Headers + query params forwarded
- **Response**: Page document, title, description, metadata

#### onSave Webhook (POST)
- **Purpose**: Save page content when users edit pages
- **Authentication**: Headers + query params + auth context in body
- **Response**: Save confirmation with page details

## Implementation Examples

### Node.js/Express
```javascript
app.get('/webhook/load/:pageId', (req, res) => {
  const authToken = req.headers.authorization;
  // Validate token and load page
  res.json({ document: pageContent, title: pageTitle });
});

app.post('/webhook/save/:pageId', (req, res) => {
  const { auth } = req.body;
  // Validate auth.query.token and save page
  res.json({ _id: pageId, saved: true, webhookReceived: true });
});
```

### Python/Flask
```python
@app.route('/webhook/load/<page_id>', methods=['GET'])
def load_page(page_id):
    auth_token = request.headers.get('Authorization')
    # Validate and load page
    return jsonify({'document': page_content, 'title': page_title})

@app.route('/webhook/save/<page_id>', methods=['POST'])
def save_page(page_id):
    data = request.get_json()
    auth_info = data.get('auth', {})
    # Validate auth_info['query']['token'] and save
    return jsonify({'_id': page_id, 'saved': True, 'webhookReceived': True})
```

## Security Considerations

1. **Always validate authentication** from forwarded headers/query params
2. **Check token expiration** for time-sensitive tokens
3. **Implement rate limiting** to prevent abuse
4. **Use HTTPS only** for webhook endpoints
5. **Validate and sanitize** all input data
6. **Log authentication attempts** for monitoring

## Testing

Use the test webhook endpoint to verify your implementation:
```
GET/POST http://localhost:3000/api/test-webhook/{pageId}
```

This endpoint logs all received authentication information and helps verify that your webhook receives the expected data format.

## Support

For questions or issues with webhook implementation:
- Check the detailed guide in `webhooks.md`
- Reference the API specification in `webhook-api.json`
- Use the test webhook endpoint for debugging
