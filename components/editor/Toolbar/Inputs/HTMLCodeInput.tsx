import { html } from "@codemirror/lang-html";
import { Diagnostic, linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";

// HTML validation linter
const htmlLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc.toString();

  // Basic HTML validation
  try {
    // Check for unclosed tags (basic check)
    const openTags = (doc.match(/<[^/][^>]*>/g) || []).length;
    const closeTags = (doc.match(/<\/[^>]*>/g) || []).length;

    // Check for script and style tags
    const scriptTags = (doc.match(/<script[^>]*>/gi) || []).length;
    const scriptCloseTags = (doc.match(/<\/script>/gi) || []).length;

    if (scriptTags !== scriptCloseTags) {
      diagnostics.push({
        from: 0,
        to: doc.length,
        severity: "error",
        message: "Unclosed <script> tags detected",
      });
    }

    const styleTags = (doc.match(/<style[^>]*>/gi) || []).length;
    const styleCloseTags = (doc.match(/<\/style>/gi) || []).length;

    if (styleTags !== styleCloseTags) {
      diagnostics.push({
        from: 0,
        to: doc.length,
        severity: "error",
        message: "Unclosed <style> tags detected",
      });
    }

    // Check for common HTML syntax issues
    const lines = doc.split('\n');
    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check for unclosed quotes in attributes
      if (trimmed.includes('="') && !trimmed.includes('"')) {
        const lineStart = doc.split('\n').slice(0, index).join('\n').length + index;
        diagnostics.push({
          from: lineStart,
          to: lineStart + line.length,
          severity: "warning",
          message: "Unclosed quote in attribute",
        });
      }
    });
  } catch (e) {
    // Ignore parsing errors
  }

  return diagnostics;
});

interface HTMLCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  helpText?: string;
  className?: string;
}

export const HTMLCodeInput = ({
  value,
  onChange,
  placeholder = "<script>...</script>",
  height = "200px",
  label,
  helpText,
  className = "",
}: HTMLCodeInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className={`rounded-lg overflow-hidden border transition-colors ${isFocused ? "border-accent-400" : "border-gray-300"
        }`}>
        <CodeMirror
          value={value}
          height={height}
          theme="light"
          extensions={[EditorView.lineWrapping, html(), htmlLinter]}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: false,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          placeholder={placeholder}
          className="text-sm"
        />
      </div>

      {helpText && (
        <p className="text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default HTMLCodeInput;
