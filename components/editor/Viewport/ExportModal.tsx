import { useEditor } from "@craftjs/core";
import copy from "copy-to-clipboard";
import lz from "lzutf8";

export const ExportModal = () => {
  const { query } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const json = query.serialize();

  const data = lz.encodeBase64(lz.compress(json));

  return (
    <div className="space-y-6 px-3 pb-4 sm:pb-6 xl:pb-8 ">
      <h3 className="text-xl font-medium">Export Page Layout</h3>
      <p>
        Copy and save this exported version of your page. You can then import it
        at anytime into a builder.
      </p>

      <pre
        className="w-full overflow-auto input  h-32 max-h-[200px]"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        {data}
      </pre>

      <div className="w-full flex gap-3">
        <button
          className="btn w-full py-3"
          autoFocus={true}
          onClick={() => {
            copy(data);
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );
};
