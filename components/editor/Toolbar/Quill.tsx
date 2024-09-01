import { useEffect } from "react";
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

  useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }
  }, [quill, value]);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
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
