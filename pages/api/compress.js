import lz from "lzutf8";

/**
 * API route to compress site data for export
 * POST /api/compress
 * 
 * Accepts JSON object or text and returns compressed/base64-encoded string
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        error: "Missing 'data' field in request body"
      });
    }

    // Convert data to string if it's not already
    let dataString;
    if (typeof data === "string") {
      dataString = data;
    } else if (typeof data === "object") {
      try {
        dataString = JSON.stringify(data);
      } catch (stringifyError) {
        return res.status(400).json({
          error: "Failed to stringify data object",
          details: stringifyError.message
        });
      }
    } else {
      dataString = String(data);
    }

    // Compress the data (lz compress + base64 encode)
    let compressed;
    try {
      compressed = lz.encodeBase64(lz.compress(dataString));
    } catch (compressError) {
      return res.status(500).json({
        error: "Failed to compress data",
        details: compressError.message
      });
    }

    // Calculate compression ratio
    const originalSize = dataString.length;
    const compressedSize = compressed.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    return res.status(200).json({
      success: true,
      compressed,
      meta: {
        originalSize,
        compressedSize,
        compressionRatio: `${ratio}%`,
        saved: originalSize - compressedSize
      }
    });

  } catch (error) {
    console.error("Compression error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}

