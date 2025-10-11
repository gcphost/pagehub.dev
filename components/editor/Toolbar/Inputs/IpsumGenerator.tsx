import { useEditor, useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";

import { ViewAtom } from "components/editor/Viewport";
import { LoremIpsum } from "lorem-ipsum";
import { useRecoilValue } from "recoil";
import { Wrap } from "../ToolbarStyle";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const IpsumGenerator = ({ propKey, propType }) => {
  const view = useRecoilValue(ViewAtom);
  const { actions, query } = useEditor();

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 5,
      min: 3,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });

  const {
    actions: { setProp },
    propValues,
    id,
  } = useNode((node) => ({
    propValues: node.data.props,
    id: node.id,
  }));

  const save = (value) => {
    changeProp({
      propKey,
      value,
      setProp,
      view,
      propType,
      query,
      actions,
      nodeId: id,
    });
  };

  return (
    <Wrap
      props={{
        ...propValues,
        label: "Lorem Ipsum",
        labelHide: true,
      }}
    >
      <div className="flex gap-3">
        <button
          className="h-fill btn px-3 py-1.5"
          onClick={() => save(capitalizeFirstLetter(lorem.generateWords(1)))}
        >
          Word
        </button>

        <button
          className="h-fill btn px-3 py-1.5"
          onClick={() => save(lorem.generateSentences(1))}
        >
          Sentence
        </button>

        <button
          className="h-fill btn px-3 py-1.5"
          onClick={() => save(lorem.generateParagraphs(1))}
        >
          Paragraph
        </button>
      </div>
    </Wrap>
  );
};
