import PropTypes from 'prop-types';
import Quill from 'quill';
import { useEffect, useRef } from 'react';

const defaultMenuItems = [
  {
    label: 'Bold',
    icon: '<i class="fa fa-bold"></i>',
    handler: () => {
      document.execCommand('bold', false, null);
    },
  },
  {
    label: 'Italic',
    icon: '<i class="fa fa-italic"></i>',
    handler: () => {
      document.execCommand('italic', false, null);
    },
  },
  {
    label: 'Underline',
    icon: '<i class="fa fa-underline"></i>',
    handler: () => {
      document.execCommand('underline', false, null);
    },
  },
  {
    label: 'Link',
    icon: '<i class="fa fa-link"></i>',
    handler: () => {
      const url = window.prompt('Enter URL');
      document.execCommand('createLink', false, url);
    },
  },
];

export const QuillInline = ({
  menuItems = defaultMenuItems,
  contentEditableRef,
}) => {
  const quillRef = useRef(null);
  const toolbarRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarRef.current,
          },
        },
      });

      if (contentEditableRef) {
        contentEditableRef.current.innerHTML = quill.root.innerHTML;
      }

      quill.on('text-change', () => {
        if (contentEditableRef) {
          contentEditableRef.current.innerHTML = quill.root.innerHTML;
        }
      });
    }
  }, [menuItems, contentEditableRef]);

  return (
    <div>
      <div ref={toolbarRef}>
        {menuItems.map((item, index) => (
          <button key={index} className="ql-custom">
            {item.label}
          </button>
        ))}
      </div>
      <div ref={quillRef} />
    </div>
  );
};

QuillInline.propTypes = {
  menuItems: PropTypes.array.isRequired,
  contentEditableRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

export default QuillInline;
