import { useEffect, useRef } from 'react';

export const QullInput = ({ value, changed, props }) => {
  const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

  const quillRef = useRef(null);

  useEffect(() => {
    const time = setTimeout(() => {
      quillRef?.current?.editor.focus();
      quillRef?.current?.editor.setSelection(
        quillRef?.current?.editor.getLength(),
        0
      );
    }, 10);

    return () => {
      clearTimeout(time);
    };
  }, [quillRef]);

  const qui = {
    modules: {
      clipboard: {
        matchVisual: false,
        pasteAsPlainText: true,
      },
      toolbar: [
        'bold',
        'italic',
        'underline',
        'strike',
        { color: [] },

        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },

        'link',
        'clean',
      ],
    },

    formats: [
      'header',
      'bold',
      'italic',
      'underline',
      'strike',
      'list',
      'bullet',
      'indent',
      'link',
    ],
  };

  return (
    <div className="mb-3">
      <ReactQuill
        ref={quillRef}
        id="quill"
        theme="snow"
        value={value}
        onChange={(text) => {
          changed(text);
        }}
        modules={qui.modules}
        formats={qui.formats}
        placeholder={props.placeholder}
        autoFocus={true}
      />
    </div>
  );
};
