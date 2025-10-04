import { useNode } from "@craftjs/core";
import { changeProp } from "components/editor/Viewport/lib";
import { PageSelector } from "components/editor/Viewport/PageSelector";
import { useEffect, useState } from "react";
import { TbExternalLink, TbHash } from "react-icons/tb";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { AnchorInput } from "./AnchorInput";

interface LinkSettingsInputProps {
  propKey?: string;
  index?: number;
  showAnchor?: boolean;
  suggestedPageName?: string;
}

const LinkSettingsInput = ({
  propKey = "url",
  index,
  showAnchor = true,
  suggestedPageName
}: LinkSettingsInputProps = {}) => {
  const {
    actions: { setProp },
  } = useNode((node) => ({
    id: node.id,
  }));

  // If index is provided, we're working with an array item (like buttons)
  const isArrayItem = index !== undefined;

  const [linkType, setLinkType] = useState<"external" | "page">("external");
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  // Get current URL value to detect if it's a page reference
  const {
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  const currentUrl = isArrayItem
    ? nodeProps[propKey]?.[index]?.url || ""
    : nodeProps.url || "";

  // Detect link type on mount and when URL changes
  useEffect(() => {
    if (currentUrl.startsWith('ref:')) {
      const pageId = currentUrl.replace('ref:', '');
      setSelectedPageId(pageId);
      setLinkType("page");
    } else if (currentUrl) {
      setLinkType("external");
    }
  }, [currentUrl]);

  const handlePagePick = (page: { id: string; displayName: string; isHomePage: boolean }) => {
    // Use internal page reference format: ref:<pageId>
    const pageRef = `ref:${page.id}`;

    // Update the URL field
    changeProp({
      setProp,
      propKey: isArrayItem ? propKey : "url",
      propType: "component",
      value: pageRef,
      index: isArrayItem ? index : undefined,
      propItemKey: isArrayItem ? "url" : undefined,
    });

    setSelectedPageId(page.id);
  };

  return (
    <>
      <ToolbarSection
        full={1}
        title="Link"
        help="Provide a valid URL or select an internal page."
      >
        {/* Link Type Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setLinkType("external")}
            className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${linkType === "external"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-primary-500 text-white"
              }`}
          >
            <TbExternalLink className="inline mr-1" />
            External URL
          </button>
          <button
            type="button"
            onClick={() => setLinkType("page")}
            className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${linkType === "page"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-primary-500 text-white"
              }`}
          >
            <TbHash className="inline mr-1" />
            Page
          </button>
        </div>

        {linkType === "external" ? (
          <ToolbarItem
            propKey={isArrayItem ? propKey : "url"}
            propType="component"
            index={isArrayItem ? index : undefined}
            propItemKey={isArrayItem ? "url" : undefined}
            type="text"
            label="URL"
            labelHide={true}
            placeholder="https://...."
          />
        ) : (
          <PageSelector
            pickerMode={true}
            onPagePick={handlePagePick}
            selectedPageId={selectedPageId}
            className="w-full"
            buttonClassName="input w-full flex items-center justify-between"
            suggestedPageName={suggestedPageName}
          />
        )}

        <ToolbarItem
          propKey={isArrayItem ? propKey : "urlTarget"}
          propType="component"
          index={isArrayItem ? index : undefined}
          propItemKey={isArrayItem ? "urlTarget" : undefined}
          type="select"
          label="Target"
        >
          <option value="_self">Same tab</option>
          <option value="_blank">New tab</option>
          <option value="_parent">Parent window</option>
          <option value="_top">New window</option>
        </ToolbarItem>
      </ToolbarSection>
      {showAnchor && <AnchorInput />}
    </>
  );
};

export default LinkSettingsInput;
