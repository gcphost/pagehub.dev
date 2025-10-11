import lz from "lzutf8";
import { useState } from "react";

export default function DecompressPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleDecompress = () => {
    setError("");
    setInfo("");
    setOutput("");

    if (!input.trim()) {
      setError("Please paste compressed data in the input field");
      return;
    }

    try {
      // Decompress the data
      const decompressed = lz.decompress(lz.decodeBase64(input.trim()));

      // Try to parse as JSON and pretty print
      try {
        const parsed = JSON.parse(decompressed);
        const pretty = JSON.stringify(parsed, null, 2);
        setOutput(pretty);
        setInfo(`Successfully decompressed ${decompressed.length} characters`);
      } catch (parseError) {
        // If not valid JSON, just show the raw decompressed text
        setOutput(decompressed);
        setInfo(`Decompressed ${decompressed.length} characters (not valid JSON)`);
      }
    } catch (err) {
      setError(`Decompression failed: ${err.message}`);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setInfo("");
  };

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setInfo("Copied to clipboard!");
      setTimeout(() => setInfo(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Decompress Site Data</h1>
        <p className="text-muted-foreground mb-8">
          Paste your compressed/exported site data to decompress and view it.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">
              Input (Compressed Data)
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your compressed base64 data here..."
              className="flex-1 min-h-[400px] p-4 border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleDecompress}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition"
              >
                Decompress →
              </button>
              <button
                onClick={handleClear}
                className="bg-muted hover:bg-muted text-foreground font-semibold py-3 px-6 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">
              Output (Decompressed Data)
            </label>
            <textarea
              value={output}
              readOnly
              placeholder="Decompressed data will appear here..."
              className="flex-1 min-h-[400px] p-4 border border-border rounded-lg font-mono text-sm resize-none bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={handleCopyOutput}
              disabled={!output}
              className="mt-4 bg-secondary hover:bg-secondary disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 px-6 rounded-lg transition"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-6 p-4 bg-destructive border border-red-400 text-destructive rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        {info && (
          <div className="mt-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
            {info}
          </div>
        )}
      </div>
    </div>
  );
}

