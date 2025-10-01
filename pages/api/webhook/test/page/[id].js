import lz from "lzutf8";

// Test webhook for fetchPage
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  console.log("Test fetchPage webhook called with domain:", id);
  console.log("Query params:", req.query);
  console.log("Headers:", req.headers);

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
        "text": `Hello from the test webhook! Domain: ${id || 'none'}`,
        "root": {},
        "mobile": {
          "fontSize": "text-4xl",
          "fontWeight": "font-bold",
          "color": "text-green-600"
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
    title: `Test Page for ${id}`,
    description: `This is a test page returned from fetchPage webhook for domain: ${id}`,
    content: encoded,
    draft: encoded,
    name: id || 'test-page',
    draftId: `draft-${id || 'test'}`,
  });
}

