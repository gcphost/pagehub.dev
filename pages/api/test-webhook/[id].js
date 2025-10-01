import lz from "lzutf8";

export default async function handler(req, res) {
  console.log("Test webhook - Method:", req.method);
  console.log("Test webhook - Query:", req.query);
  console.log("Test webhook - Headers:", req.headers);

  // Handle POST requests (save webhook)
  if (req.method === "POST") {
    console.log("Test onSave webhook - Method:", req.method);
    console.log("Test onSave webhook - Body:", req.body);
    console.log("Test onSave webhook - Headers:", req.headers);
    console.log("Test onSave webhook - Query:", req.query);

    try {
      const { tenantId, pageId, document, isDraft, settings, timestamp, auth } = req.body;

      console.log("Test onSave webhook - Received data:", {
        tenantId,
        pageId,
        document: document ? `${document.substring(0, 50)}...` : null,
        isDraft,
        settings: settings ? Object.keys(settings) : null,
        timestamp,
        auth: auth ? {
          queryKeys: Object.keys(auth.query || {}),
          headerKeys: auth.headers || [],
          userAgent: auth.userAgent,
          ip: auth.ip,
        } : null,
      });

      // Log authentication information received
      if (auth) {
        console.log("Test onSave webhook - Auth info received:", {
          queryParams: auth.query,
          forwardedHeaders: auth.headers,
          userAgent: auth.userAgent,
          clientIP: auth.ip,
        });
      }

      // Simulate processing the save
      const result = {
        _id: pageId || `test-${Date.now()}`,
        title: settings?.title || "Test Page",
        draftId: pageId || `test-${Date.now()}`,
        saved: true,
        timestamp: new Date().toISOString(),
        webhookReceived: true,
        authReceived: !!auth,
      };

      console.log("Test onSave webhook - Returning result:", result);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Test onSave webhook error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Handle GET requests (load webhook)
  if (req.method !== "GET") {
    console.log("Test webhook - Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    console.log("Test webhook - Extracted pageId:", id);
    console.log("Test webhook - Query params:", req.query);
    console.log("Test webhook - Headers:", req.headers);

    // Log authentication information received
    console.log("Test onLoad webhook - Auth info received:", {
      queryParams: req.query,
      headers: req.headers,
      userAgent: req.headers['user-agent'],
      clientIP: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress,
    });

    // Simple hello world document structure
    const helloWorldDocument = {
      "ROOT": {
        "type": {
          "resolvedName": "Background"
        },
        "isCanvas": true,
        "props": {
          "type": "background",
          "root": {
            "background": "bg-white",
            "color": "text-black"
          },
          "mobile": {
            "height": "h-full",
            "width": "w-screen",
            "gap": "gap-3",
            "display": "flex",
            "flexDirection": "flex-col",
            "overflow": "overflow-auto"
          },
          "desktop": {},
          "custom": {
            "displayName": "Background"
          }
        },
        "displayName": "Background",
        "custom": {
          "displayName": "Background"
        },
        "parent": null,
        "nodes": ["page-container"]
      },
      "page-container": {
        "type": {
          "resolvedName": "Container"
        },
        "isCanvas": true,
        "props": {
          "type": "page",
          "canDelete": false,
          "canEditName": true,
          "isHomePage": true,
          "root": {},
          "mobile": {
            "mx": "mx-auto",
            "display": "flex",
            "justifyContent": "justify-start",
            "alignItems": "items-center",
            "flexDirection": "flex-col",
            "width": "w-full",
            "gap": "gap-3",
            "py": "py-12"
          },
          "desktop": {},
          "custom": {
            "displayName": "Home Page"
          }
        },
        "displayName": "Container",
        "custom": {
          "displayName": "Home Page"
        },
        "parent": "ROOT",
        "nodes": ["hello-text"]
      },
      "hello-text": {
        "type": {
          "resolvedName": "Text"
        },
        "isCanvas": false,
        "props": {
          "text": `Hello World from Webhook! Page ID: ${id || 'none'}`,
          "root": {},
          "mobile": {
            "fontSize": "text-4xl",
            "fontWeight": "font-bold",
            "color": "text-blue-600"
          },
          "desktop": {},
          "custom": {
            "displayName": "Hello Text"
          }
        },
        "displayName": "Text",
        "custom": {
          "displayName": "Hello Text"
        },
        "parent": "page-container",
        "nodes": []
      }
    };

    // Convert to JSON string, compress, and encode
    const jsonString = JSON.stringify(helloWorldDocument);
    const compressed = lz.compress(jsonString);
    const encoded = lz.encodeBase64(compressed);

    // Log the request for debugging
    console.log("Test webhook called with pageId:", id);

    return res.status(200).json({
      document: encoded,
      message: `Hello World from test webhook! Page ID: ${id || 'none'}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
