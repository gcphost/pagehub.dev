import { useTiptapContext } from "components/editor/TiptapContext";
import { ToolbarItem } from "components/editor/Toolbar";
import { ColorInput } from "components/editor/Toolbar/Inputs/ColorInput";
import { PresetInput } from "components/editor/Toolbar/Inputs/PresetInput";
import { NodeToolWrapper } from "components/editor/Tools/NodeDialog";
import { textPresets } from "components/selectors/Text/TextSettings";
import { AiOutlineAlignRight } from "react-icons/ai";
import { TbAlignCenter, TbAlignLeft } from "react-icons/tb";

export function TextSettingsTopNodeTool() {
  // Get the Tiptap editor from context
  const { editor: tiptapEditor } = useTiptapContext();

  // Debug logging
  console.log("TextSettingsTopNodeTool - tiptapEditor:", tiptapEditor);
  console.log("TextSettingsTopNodeTool - editor type:", typeof tiptapEditor);

  console.log(tiptapEditor);

  return (
    <NodeToolWrapper
      className="inside-shadow m-1 rounded-md bg-primary px-3 text-foreground"
      animate={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.5,
          },
        },
        exit: {
          opacity: 0,

          transition: {
            delay: 0.2,
            duration: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 0.5,
          },
        },
      }}
    >
      <div className="h-6 w-16 overflow-hidden rounded-md border border-border">
        <ColorInput
          propKey="color"
          label=""
          prefix="text"
          propType="root"
          labelHide={true}
        />
      </div>

      <PresetInput
        presets={textPresets}
        type="select"
        label=""
        labelHide={true}
        wrap="control"
      />

      {/* Tiptap Formatting Buttons */}
      {tiptapEditor && (
        <>
          <button
            onClick={() => tiptapEditor.chain().focus().toggleBold().run()}
            className={`rounded px-2 py-1 text-sm hover:bg-muted ${
              tiptapEditor.isActive("bold")
                ? "bg-muted text-primary"
                : "text-foreground"
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>

          <button
            onClick={() => tiptapEditor.chain().focus().toggleItalic().run()}
            className={`rounded px-2 py-1 text-sm hover:bg-muted ${
              tiptapEditor.isActive("italic")
                ? "bg-muted text-primary"
                : "text-foreground"
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            onClick={() => tiptapEditor.chain().focus().toggleUnderline().run()}
            className={`rounded px-2 py-1 text-sm hover:bg-muted ${
              tiptapEditor.isActive("underline")
                ? "bg-muted text-primary"
                : "text-foreground"
            }`}
            title="Underline"
          >
            <u>U</u>
          </button>

          <button
            onClick={() => tiptapEditor.chain().focus().toggleStrike().run()}
            className={`rounded px-2 py-1 text-sm hover:bg-muted ${
              tiptapEditor.isActive("strike")
                ? "bg-muted text-primary"
                : "text-foreground"
            }`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>

          <button
            onClick={() => tiptapEditor.chain().focus().toggleCode().run()}
            className={`rounded px-2 py-1 text-sm hover:bg-muted ${
              tiptapEditor.isActive("code")
                ? "bg-muted text-primary"
                : "text-foreground"
            }`}
            title="Code"
          >
            <code>&lt;/&gt;</code>
          </button>
        </>
      )}

      <ToolbarItem
        propKey="textAlign"
        type="radio"
        label=""
        labelHide={true}
        cols={true}
        wrap="control"
        options={[
          { value: "text-left", label: <TbAlignLeft /> },
          { value: "text-center", label: <TbAlignCenter /> },
          { value: "text-right", label: <AiOutlineAlignRight /> },
        ]}
      />
    </NodeToolWrapper>
  );
}

export default TextSettingsTopNodeTool;
