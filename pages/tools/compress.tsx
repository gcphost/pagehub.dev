import lz from "lzutf8";
import { useState } from "react";

export default function CompressPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleCompress = () => {
    setError("");
    setInfo("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter data in the input field");
      return;
    }

    try {
      const inputData = input.trim();

      // Compress the data
      const compressed = lz.encodeBase64(lz.compress(inputData));

      // Calculate compression stats
      const originalSize = inputData.length;
      const compressedSize = compressed.length;
      const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

      setOutput(compressed);
      setInfo(
        `Successfully compressed ${originalSize} → ${compressedSize} characters (${ratio}% reduction)`
      );
    } catch (err) {
      setError(`Compression failed: ${err.message}`);
    }
  };

  const handlePrettifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setInfo("JSON prettified successfully");
      setTimeout(() => setInfo(""), 2000);
    } catch (err) {
      setError(`Not valid JSON: ${err.message}`);
    }
  };

  const handleMinifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setInfo("JSON minified successfully");
      setTimeout(() => setInfo(""), 2000);
    } catch (err) {
      setError(`Not valid JSON: ${err.message}`);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Compress Site Data</h1>
        <p className="text-gray-600 mb-8">
          Enter your JSON or text data to compress it for export or storage.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">
              Input (Original Data)
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON or text data here..."
              className="flex-1 min-h-[400px] p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCompress}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Compress →
              </button>
              <button
                onClick={handlePrettifyJSON}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                title="Format JSON with indentation"
              >
                Prettify
              </button>
              <button
                onClick={handleMinifyJSON}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                title="Minify JSON (remove whitespace)"
              >
                Minify
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-2">
              Output (Compressed Data)
            </label>
            <textarea
              value={output}
              readOnly
              placeholder="Compressed base64 data will appear here..."
              className="flex-1 min-h-[400px] p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleCopyOutput}
              disabled={!output}
              className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
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

