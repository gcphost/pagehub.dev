import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface InlineTiptapProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

export const InlineTiptap = ({
  content,
  onChange,
  isEditing,
  onFocus,
  onBlur,
  className = '',
}: InlineTiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable features we don't need for inline editing
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content,
    editable: isEditing,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      onBlur?.();
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[1.5em] ${className}`,
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [editor, isEditing]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
};
