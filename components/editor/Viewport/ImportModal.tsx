import { ROOT_NODE } from "@craftjs/core";
import lz from "lzutf8";

export const ImportModal = ({ stateToLoad, setStateToLoad, actions }) => (
  <div className="space-y-6 px-3 pb-4 sm:pb-6 xl:pb-8">
    <h3 className="text-xl font-medium">Import Page Layout</h3>
    <p>
      Paste an exported string and click Import to update this builder with your
      exported version.
    </p>

    <textarea
      placeholder="Paste your exported compressed data here."
      required={true}
      autoFocus={true}
      defaultValue={stateToLoad}
      onChange={(e) => setStateToLoad(e.target.value)}
      className="px-3 py-6 input  w-full"
    />

    <div className="w-full">
      <button
        className="btn w-full py-3 "
        onClick={() => {
          if (!stateToLoad) {
            return;
          }

          const json = lz.decompress(lz.decodeBase64(stateToLoad));

          try {
            actions.deserialize(json);

            actions.selectNode(ROOT_NODE);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Import
      </button>
    </div>
  </div>
);
