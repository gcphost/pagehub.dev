import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";

export const QullInput = ({ value, changed, props }) => {
  const qui = {
    modules: {
      clipboard: {
        matchVisual: false,
        pasteAsPlainText: true,
      },
      toolbar: [
        "bold",
        "italic",
        "underline",
        "strike",
        { color: [] },

        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },

        "link",
        "clean",
      ],
    },

    formats: [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "indent",
      "link",
    ],
  };

  const theme = "snow";
  // const theme = 'bubble';

  const modules = qui.modules;

  const placeholder = props.placeholder;

  const formats = qui.formats;

  const { quill, quillRef } = useQuill({
    theme,
    modules,
    formats,
    placeholder,
  });

  const isInternalChange = useRef(false);

  useEffect(() => {
    if (quill) {
      // Only set HTML if it's different and not from internal change
      const currentHTML = quill.root.innerHTML;
      if (currentHTML !== value && !isInternalChange.current) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }
      isInternalChange.current = false;
    }
  }, [quill, value]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        isInternalChange.current = true;
        changed(quill.root.innerHTML);
      });
    }
  }, [changed, quill]);

  return (
    <div className="mb-3">
      <div ref={quillRef} id="quill" />
    </div>
  );
};
