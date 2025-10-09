import { useEditor, useNode } from "@craftjs/core";
import { TbPlayerPlay } from "react-icons/tb";
import { ToolbarItem } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";

export default function ClickItem() {
  const { id } = useNode();
  const { query } = useEditor();

  const { clickType, clickDirection, clickValue } = useNode((node) => ({
    clickType: node.data.props.clickType,
    clickDirection: node.data.props.clickDirection,
    clickValue: node.data.props.clickValue,
  }));

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
      <ToolbarSection title="Control">
        <p className="py-3">Toggle a components visiblity.</p>
        <ToolbarSection full={2}>
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
            placeholder="ID of a comoponent"
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
      </ToolbarSection>
    </>
  );
}
