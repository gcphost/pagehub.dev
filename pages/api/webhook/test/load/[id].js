import lz from "lzutf8";

// Test webhook for onLoad
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  console.log("Test onLoad webhook called with pageId:", id);
  console.log("Query params:", req.query);
  console.log("Headers:", req.headers);
  console.log("Auth info:", {
    userAgent: req.headers['user-agent'],
    clientIP: req.headers['x-forwarded-for'] || req.headers['x-real-ip'],
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
        "text": `Hello World from onLoad webhook! Page ID: ${id || 'none'}`,
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

  return res.status(200).json({
    document: encoded,
    message: `Hello World from test webhook! Page ID: ${id || 'none'}`,
    timestamp: new Date().toISOString()
  });
}

