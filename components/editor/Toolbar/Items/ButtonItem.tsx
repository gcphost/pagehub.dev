import { useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp, getProp } from "components/editor/Viewport/lib";
import { SelectedButtonAtom } from "components/selectors/Button/ButtonSettings";
import { TbTrash } from "react-icons/tb";
import { useRecoilState, useRecoilValue } from "recoil";
import { ColorInput } from "../Inputs/ColorInput";
import { IconDialogInput } from "../Inputs/IconDialogInput";
import LinkSettingsInput from "../Inputs/LinkSettingsInput";

import { ToolbarItem, ToolbarItemProps } from "../ToolbarItem";
import { ToolbarSection } from "../ToolbarSection";
import { Accord, Wrap } from "../ToolbarStyle";

const Input = ({ nodeProps, setProp }) => {
  const [accordion, setAccordion] = useRecoilState(SelectedButtonAtom);

  const buttons = nodeProps.buttons ? [...nodeProps.buttons] : [];

  const saveButtons = (_buttons) => {
    changeProp({
      setProp,
      propKey: "buttons",
      propType: "component",
      value: _buttons,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="border rounded-md border-gray-500">
        {buttons.map((but, butKey) => (
          <Accord
            className="border-b p-3 border-gray-500"
            key={butKey}
            prop={butKey}
            accordion={accordion}
            setAccordion={setAccordion}
            title={
              <ToolbarItem
                propKey="buttons"
                propType="component"
                index={butKey}
                propItemKey="text"
                type="text"
                label=""
                placeholder="Enter text"
                labelHide={true}
              />
            }
            buttons={[
              <button
                key="button-1"
                className="text-gray-500"
                aria-label="Delete button"
                onClick={(e) => {
                  e.preventDefault();

                  const _buttons = [...buttons];

                  delete _buttons[butKey];

                  saveButtons(_buttons.filter((_) => _));
                }}
              >
                <TbTrash />
              </button>,
            ]}
          >
            <div className="flex flex-col gap-3">
              <LinkSettingsInput
                propKey="buttons"
                index={butKey}
                showAnchor={false}
                suggestedPageName={but.text}
              />

              <ToolbarSection full={2}>
                <IconDialogInput
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="icon"
                  label="Icon"
                />

                <ToolbarItem
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="iconOnly"
                  type="checkbox"
                  label="Icon Only"
                  on={true}
                  labelHide
                />
              </ToolbarSection>

              <ToolbarSection full={1}>
                <ToolbarItem
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="type"
                  type="select"
                  label="Type"
                >
                  <option value="button">Button</option>
                  <option value="submit">Submit</option>
                </ToolbarItem>
              </ToolbarSection>

              <ToolbarSection full={1}>
                <ColorInput
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="background"
                  label="Background"
                  prefix="bg"
                />
                <ColorInput
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="color"
                  label="Text"
                  prefix="text"
                />
              </ToolbarSection>
            </div>
          </Accord>
        ))}
      </div>

      <button
        className="btn p-3 w-full"
        onClick={async () => {
          const _buttons = [...buttons];

          // Fetch default icon SVG
          const defaultIconPath = "/icons/fa/solid/star.svg";
          let iconSvg = "";
          try {
            const response = await fetch(defaultIconPath);
            iconSvg = await response.text();
          } catch (error) {
            console.error("Failed to load default icon:", error);
          }

          _buttons.push({
            text: "Button",
            icon: iconSvg,
            iconOnly: true
          });

          setAccordion(buttons.length - 1);

          saveButtons(_buttons);
        }}
      >
        Add Button
      </button>
    </div>
  );
};

export const ButtonItem = (__props: ToolbarItemProps) => {
  const view = useRecoilValue(ViewAtom);

  const {
    full = false,
    propKey,
    type,
    onChange,
    index,
    propItemKey,
    ...props
  } = __props;

  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  const value = getProp(__props, view, nodeProps);

  let lab = value || "";

  if (props.valueLabels && props.valueLabels[value]) {
    lab = props.valueLabels[value];
  }

  return (
    <Wrap props={props} lab={lab} propKey={propKey}>
      <Input nodeProps={nodeProps} setProp={setProp} />
    </Wrap>
  );
};
