import lz from "lzutf8";

/**
 * API route to decompress exported site data
 * POST /api/decompress
 *
 * Accepts compressed/base64-encoded data and returns decompressed JSON object
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { data, format = "json" } = req.body;

    if (!data) {
      return res.status(400).json({
        error: "Missing 'data' field in request body",
      });
    }

    if (typeof data !== "string") {
      return res.status(400).json({
        error: "'data' field must be a string",
      });
    }

    // Decompress the data (base64 decode + lz decompress)
    let decompressed;
    try {
      decompressed = lz.decompress(lz.decodeBase64(data));
    } catch (decompressError) {
      return res.status(400).json({
        error:
          "Failed to decompress data. Ensure data is properly compressed using lzutf8.",
        details: decompressError.message,
      });
    }

    // Parse as JSON
    let parsed;
    try {
      parsed = JSON.parse(decompressed);

      // Return based on format preference
      if (format === "pretty") {
        // Return pretty-printed JSON as plain text
        res.setHeader("Content-Type", "application/json");
        return res.status(200).send(JSON.stringify(parsed, null, 2));
      } else {
        // Return the decompressed object in a wrapper
        return res.status(200).json({
          success: true,
          data: parsed,
          meta: {
            type: "object",
            size: decompressed.length,
          },
        });
      }
    } catch (parseError) {
      // If it's not valid JSON, return as plain text with error details
      return res.status(200).json({
        success: false,
        error: "JSON parse failed",
        parseError: parseError.message,
        raw: decompressed.substring(0, 1000), // First 1000 chars for debugging
        meta: {
          type: "text",
          size: decompressed.length,
        },
      });
    }
  } catch (error) {
    console.error("Decompression error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
