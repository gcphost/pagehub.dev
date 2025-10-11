import { css } from "@codemirror/lang-css";
import { Diagnostic, linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { useEditor, useNode } from "@craftjs/core";
import CodeMirror from "@uiw/react-codemirror";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp, getPropFinalValue } from "components/editor/Viewport/lib";
import { useRecoilValue } from "recoil";
import { ToolbarSection } from "../ToolbarSection";

// CSS validation linter
const cssLinter = linter((view) => {
  const diagnostics: Diagnostic[] = [];
  const doc = view.state.doc.toString();

  // Basic CSS validation
  try {
    // Check for unclosed braces
    const openBraces = (doc.match(/{/g) || []).length;
    const closeBraces = (doc.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      diagnostics.push({
        from: 0,
        to: doc.length,
        severity: "error",
        message: "Unmatched braces in CSS",
      });
    }

    // Check for missing semicolons (basic check)
    const lines = doc.split("\n");
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // If line has a colon but no semicolon and isn't empty/comment/brace
      if (
        trimmed &&
        trimmed.includes(":") &&
        !trimmed.endsWith(";") &&
        !trimmed.endsWith("{") &&
        !trimmed.endsWith("}") &&
        !trimmed.startsWith("/*") &&
        !trimmed.startsWith("//")
      ) {
        const lineStart =
          doc.split("\n").slice(0, index).join("\n").length + index;
        diagnostics.push({
          from: lineStart,
          to: lineStart + line.length,
          severity: "warning",
          message: "Missing semicolon",
        });
      }
    });
  } catch (e) {
    // Ignore parsing errors
  }

  return diagnostics;
});

export const CSSEditorInput = () => {
  const view = useRecoilValue(ViewAtom);
  const { query, actions } = useEditor();

  const {
    actions: { setProp },
    nodeProps,
    id,
  } = useNode((node) => ({
    nodeProps: node.data.props || {},
    id: node.id,
  }));

  const { value } = getPropFinalValue(
    { propKey: "style", propType: "root" },
    view,
    nodeProps,
  );

  const handleChange = (val: string) => {
    changeProp({
      propKey: "style",
      value: val,
      setProp,
      view: "root",
      propType: "root",
      query,
      actions,
      nodeId: id,
    });
  };

  return (
    <ToolbarSection title="Inline Style Tag">
      <div className="w-full">
        <div className="overflow-hidden rounded-lg border border-border focus-within:border-accent focus:border-ring">
          <CodeMirror
            value={value || ""}
            height="150px"
            theme="dark"
            extensions={[EditorView.lineWrapping, css(), cssLinter]}
            onChange={handleChange}
            basicSetup={{
              lineNumbers: false,
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
            placeholder="color: tomato; border-style: dotted;"
            className="text-sm"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Use valid CSS syntax.
        </p>
      </div>
    </ToolbarSection>
  );
};
