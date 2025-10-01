// Test webhook for onSave
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

