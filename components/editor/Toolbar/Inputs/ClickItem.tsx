import { useEditor, useNode } from "@craftjs/core";
import { useState } from "react";
import { TbExternalLink, TbPlayerPlay, TbPointer } from "react-icons/tb";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import LinkSettingsInput from "./LinkSettingsInput";

export default function ClickItem() {
  const { id } = useNode();
  const { query } = useEditor();

  const { clickMode, clickType, clickDirection, clickValue } = useNode((node) => ({
    clickMode: node.data.props.clickMode || "link",
    clickType: node.data.props.clickType,
    clickDirection: node.data.props.clickDirection,
    clickValue: node.data.props.clickValue,
  }));

  const [mode, setMode] = useState(clickMode);

  const handleTestAction = () => {
    if (!clickValue || !clickType) return;

    const element = document.getElementById(clickValue);
    if (!element) {
      console.warn(`Element with id "${clickValue}" not found`);
      return;
    }

    if (clickType === "click" && clickDirection) {
      if (clickDirection === "show") {
        element.classList.remove("hidden");
      } else if (clickDirection === "hide") {
        element.classList.add("hidden");
      } else if (clickDirection === "toggle") {
        if (element.classList.contains("hidden")) {
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      }
    }
  };

  return (
    <>
      <ToolbarSection title="Click">
        {/* Mode Toggle Buttons */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${mode === "link"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-primary-500 text-white"
              }`}
          >
            <TbExternalLink className="inline mr-1" />
            Link
          </button>
          <button
            type="button"
            onClick={() => setMode("action")}
            className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${mode === "action"
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-primary-500 text-white"
              }`}
          >
            <TbPointer className="inline mr-1" />
            Action
          </button>
        </div>

        {/* Link Mode */}
        {mode === "link" && <LinkSettingsInput />}

        {/* Action Mode */}
        {mode === "action" && (
          <>
            <ToolbarSection full={1} title="Action">
              <p className="text-xs">Control a components visibility.</p>

              <ToolbarItem
                propKey="clickType"
                type="select"
                labelHide={true}
                label="Type"
                cols={true}
                propType="component"
              >
                <option value="">None</option>
                {["click", "hover"].map((_, k) => (
                  <option key={_}>{_}</option>
                ))}
              </ToolbarItem>

              <ToolbarItem
                propKey="clickDirection"
                type="select"
                labelHide={true}
                label="Direction"
                cols={true}
                propType="component"
              >
                {["toggle", "show", "hide"].map((_, k) => (
                  <option key={_}>{_}</option>
                ))}
              </ToolbarItem>

              <ToolbarItem
                propKey="clickValue"
                propType="component"
                type="text"
                label="Component"
                placeholder="ID of a component"
                labelHide={true}
                cols={true}
              />

              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleTestAction}
                  disabled={!clickValue || !clickType}
                  className="btn w-full"
                  title="Test Action"
                >
                  <TbPlayerPlay className="w-4 h-4" />
                  Test
                </button>
              </div>
            </ToolbarSection>
          </>
        )}
      </ToolbarSection>
    </>
  );
}
