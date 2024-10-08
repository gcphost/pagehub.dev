import { useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp, getProp } from "components/editor/Viewport/lib";
import { SelectedButtonAtom } from "components/selectors/Button/ButtonSettings";
import { TbTrash } from "react-icons/tb";
import { useRecoilState, useRecoilValue } from "recoil";
import { ColorInput } from "../Inputs/ColorInput";
import { IconDialogInput } from "../Inputs/IconDialogInput";

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
              <ToolbarSection full={2}>
                <ToolbarItem
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="url"
                  type="text"
                  label="URL"
                  placeholder="https://pagehub.dev"
                  labelHide={true}
                />

                <IconDialogInput
                  propKey="buttons"
                  propType="component"
                  index={butKey}
                  propItemKey="icon"
                  label="Icon"
                />
              </ToolbarSection>

              <ToolbarSection full={2}>
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
            </div>
          </Accord>
        ))}
      </div>

      <button
        className="p-3 bg-gray-700 border-gray-500 border hover:bg-gray-800 rounded-md w-full"
        onClick={() => {
          const _buttons = [...buttons];

          _buttons.push({ text: "Button" });

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
