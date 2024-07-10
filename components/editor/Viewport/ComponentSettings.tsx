import throttle from "lodash.throttle";
import { useEffect, useRef, useState } from "react";
import { ButtonToolbox } from "./Toolbox/buttonComponents";
import { DividerToolbox } from "./Toolbox/dividerComponents";
import { EmbedToolbox } from "./Toolbox/embedComponents";
import { FormToolbox } from "./Toolbox/formComponents";
import { FormElementToolbox } from "./Toolbox/formElement";
import { ImageToolbox } from "./Toolbox/imageComponents";
import { pageToolboxItems } from "./Toolbox/pageComponents";
import { sectionToolboxItems } from "./Toolbox/sectionComponents";
import { TextToolbox } from "./Toolbox/textComponents";
import { VideoToolbox } from "./Toolbox/videoComponents";

const items = [
  ...sectionToolboxItems,
  TextToolbox,
  ButtonToolbox,
  ImageToolbox,
  VideoToolbox,
  FormToolbox,
  FormElementToolbox,
  DividerToolbox,
  EmbedToolbox,
  //  ListToolbox,
  ...pageToolboxItems,
];

export const ComponentSettings = () => {
  const [list, setList] = useState(items);
  const [search, setSearch] = useState(null);

  const focusRef = useRef(null);

  useEffect(() => {
    const time = setTimeout(() => focusRef?.current?.focus(), 50);

    return () => clearTimeout(time);
  }, [focusRef]);

  useEffect(() => {
    if (search) {
      const regex = new RegExp(search, "i"); // Create a case-insensitive regex
      setList(
        items
          .map((item) => {
            const title = item.title.toString() || ""; // Convert element to string
            if (title.match(regex)) {
              return item;
            }

            const filteredContent = item.content.filter((nestedItem) => {
              const text =
                nestedItem.props?.custom?.displayName?.toString() || ""; // Convert element to string
              if (text.match(regex)) {
                return true;
              }

              const text1 = nestedItem.props?.text?.toString() || ""; // Convert element to string
              if (text1.match(regex)) {
                return true;
              }
              return false;
            });
            if (filteredContent.length > 0) {
              return { ...item, content: filteredContent };
            }
            return null;
          })
          .filter((item) => item !== null)
      );
      return;
    }

    setList(items);
  }, [search]);

  return (
    <div className="px- flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          setSearch(e.target[0].value);
          e.preventDefault();
        }}
      >
        <div className="flex gap-1.5 px-3 mb-3">
          <input
            type="text"
            placeholder="Search Components"
            className="input"
            ref={focusRef}
            onKeyUp={throttle((e) => {
              setSearch(e.target.value);
            }, 100)}
          />
        </div>
      </form>
      {list?.map((a, k) => (
        <div key={k}>
          <div className="px-3 pb-3 font-bold">{a.title}</div>

          <div className="bg-white text-black w-full flex flex-col gap-3 p-3">
            {a.content.map((item, kk) => (
              <div className="w-full" key={kk}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
