import throttle from "lodash.throttle";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { ComponentsAtom } from "utils/lib";
import { AudioToolbox } from "./Toolbox/audioComponents";
import { ButtonToolbox } from "./Toolbox/buttonComponents";
import { DividerToolbox } from "./Toolbox/dividerComponents";
import { EmbedToolbox } from "./Toolbox/embedComponents";
import { FormToolbox } from "./Toolbox/formComponents";
import { FormElementToolbox } from "./Toolbox/formElement";
import { ImageToolbox } from "./Toolbox/imageComponents";
// Removed direct import to avoid circular dependency - loaded dynamically below
import { SavedComponentsToolbox } from "./Toolbox/savedComponents";
import { sectionToolboxItems } from "./Toolbox/sectionComponents";
import { SpacerToolbox } from "./Toolbox/spacerComponents";
import { TextToolbox } from "./Toolbox/textComponents";
import { VideoToolbox } from "./Toolbox/videoComponents";

// Dynamically load NavToolbox to avoid circular dependency
let NavToolbox: any = { content: [] };
import("./Toolbox/navComponents").then(module => {
  NavToolbox = module.NavToolbox;
});

const baseItems = [
  {
    title: "Basic",
    content: [
      ...TextToolbox.content,
      ...ButtonToolbox.content,
      ...DividerToolbox.content,
      ...SpacerToolbox.content,
      ...sectionToolboxItems[0].content, // always last

    ],
  },
  {
    title: "Navigation",
    get content() {
      return NavToolbox.content || [];
    },
  },
  {
    title: "Media",
    content: [
      ...ImageToolbox.content,
      ...VideoToolbox.content,
      ...AudioToolbox.content,
    ],
  },
  {
    title: "Forms",
    content: [
      ...FormToolbox.content,
      ...FormElementToolbox.content,
    ],
  },
  {
    title: "Advanced",
    content: [
      ...EmbedToolbox.content,
    ],
  },
  // ...pageToolboxItems,
];

export const ComponentSettings = () => {
  const components = useRecoilValue(ComponentsAtom);
  const [list, setList] = useState(baseItems);
  const [search, setSearch] = useState(null);

  // Create dynamic items array with saved components
  const items = useMemo(() => [
    ...baseItems,
    ...(components?.filter(component => !component.isSection)?.length ? [SavedComponentsToolbox(components)] : []),
  ], [components]);

  const focusRef = useRef(null);

  useEffect(() => {
    const time = setTimeout(() => focusRef?.current?.focus(), 50);

    return () => clearTimeout(time);
  }, [focusRef]);

  useEffect(() => {
    if (search) {
      const searchTerm = search.toLowerCase();
      setList(
        items
          .map((item) => {
            const title = item.title.toString().toLowerCase() || "";

            // Filter content by searching the entire React element as a string
            const filteredContent = item.content.filter((nestedItem) => {
              // Convert the entire React element to string and search in it
              const elementString = JSON.stringify(nestedItem) || "";
              return elementString.toLowerCase().includes(searchTerm);
            });

            // Only return category if it has matching content (always filter items)
            if (filteredContent.length > 0) {
              return { ...item, content: filteredContent };
            }
            // If title matches but no content matches, still show the category but with all items
            if (title.includes(searchTerm)) {
              return item;
            }
            return null;
          })
          .filter((item) => item !== null)
      );
      return;
    }

    setList(items);
  }, [search, items]);

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
            className="input px-2 py-1"
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

          <div className="bg-white text-black w-full grid grid-cols-3 gap-3 p-3">
            {a.content.map((item, kk) => (
              <div key={kk}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
