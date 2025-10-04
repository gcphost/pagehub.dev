import { LoremIpsum } from "lorem-ipsum";
import { BsBodyText } from "react-icons/bs";
import { MdShortText } from "react-icons/md";
import { Text } from "../../../selectors/Text";
import { RenderToolComponent, ToolboxItemDisplay } from "./lib";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 3,
    min: 2,
  },
  wordsPerSentence: {
    max: 8,
    min: 4,
  },
});

export const RenderTextComponent = ({ mobile, desktop, display }) => {
  const text = lorem.generateSentences(1);

  return (
    <RenderToolComponent
      className={mobile}
      element={Text}
      text={text}
      mobile={{ fontSize: mobile }}
      desktop={{ fontSize: desktop }}
      display={display}
      custom={{ displayName: "Title" }}
    />
  );
};

export const RenderParagraphComponent = (props) => {
  const text = lorem.generateParagraphs(1);
  return (
    <RenderToolComponent
      {...props}
      tagName="p"
      text={text}
      display={<ToolboxItemDisplay icon={BsBodyText} label="Paragraph" />}
      custom={{ displayName: "Paragraph" }}
    />
  );
};

export const TextComponents = [
  <RenderTextComponent
    key="1"
    mobile="text-3xl"
    desktop="text-3xl"
    display={<ToolboxItemDisplay icon={MdShortText} label="Title" />}
  />,
  <RenderTextComponent
    key="2"
    mobile="text-xl"
    desktop="text-xl"
    display={<ToolboxItemDisplay icon={MdShortText} label="Sub-title" />}
  />,
  <RenderParagraphComponent
    key="2"
    element={Text}
  // mobile={{ lineHeight: "leading-10" }}
  />,
];

export const ParagraphComponents = [
  <RenderParagraphComponent key="1" element={Text} />,
  <RenderParagraphComponent
    key="2"
    element={Text}
    mobile={{ lineHeight: "leading-10" }}
  />,
];

export const TextToolbox = {
  title: "Text",
  content: TextComponents,
};

export const ParagraphToolbox = {
  title: "Paragraphs",
  content: ParagraphComponents,
};

export const textToolboxItems = {
  title: "Text",
  items: [TextToolbox, ParagraphToolbox],
};
