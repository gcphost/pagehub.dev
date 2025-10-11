import { useNode } from "@craftjs/core";
import { ViewAtom } from "components/editor/Viewport";
import { changeProp } from "components/editor/Viewport/lib";
import { TbPlus, TbTrash } from "react-icons/tb";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { ToolbarItem, ToolbarItemProps } from "../ToolbarItem";
import { Accord, Wrap } from "../ToolbarStyle";

// Create a simple state atom for managing which option is expanded
const SelectedOptionAtom = atom({
  key: "selectedOption",
  default: 0,
});

const Input = ({ options, setProp }) => {
  const [accordion, setAccordion] = useRecoilState(SelectedOptionAtom);
  const view = useRecoilValue(ViewAtom);

  // Ensure options is always an array
  const optionsArray = Array.isArray(options) ? options : [];

  console.log("Input component - optionsArray:", optionsArray);

  const saveOptions = (_options) => {
    console.log("Saving options:", _options);
    changeProp({
      setProp,
      propKey: "options",
      propType: "component",
      value: _options,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-border">
        {optionsArray.map((option, optionKey) => (
          <Accord
            className="border-b border-border p-3"
            key={optionKey}
            prop={optionKey}
            accordion={accordion}
            setAccordion={setAccordion}
            title={
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Option {optionKey + 1}:
                </span>
                <ToolbarItem
                  propKey="options"
                  propType="component"
                  index={optionKey}
                  propItemKey="label"
                  type="text"
                  label=""
                  placeholder="Option label"
                  labelHide={true}
                />
              </div>
            }
            buttons={[
              <button
                key="button-1"
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete option"
                onClick={(e) => {
                  e.preventDefault();
                  const _options = [...optionsArray];
                  delete _options[optionKey];
                  saveOptions(_options.filter((_) => _));
                }}
              >
                <TbTrash />
              </button>,
            ]}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Value</label>
                <ToolbarItem
                  propKey="options"
                  propType="component"
                  index={optionKey}
                  propItemKey="value"
                  type="text"
                  label=""
                  placeholder="Option value"
                  labelHide={true}
                />
              </div>

              <div className="flex items-center gap-2">
                <ToolbarItem
                  propKey="options"
                  propType="component"
                  index={optionKey}
                  propItemKey="disabled"
                  type="checkbox"
                  label="Disabled"
                  labelHide={false}
                />
              </div>
            </div>
          </Accord>
        ))}
      </div>

      <button
        className="btn flex w-full items-center justify-center gap-2 p-3"
        onClick={() => {
          const _options = [...optionsArray];
          _options.push({
            value: `option${optionsArray.length + 1}`,
            label: `Option ${optionsArray.length + 1}`,
            disabled: false,
          });

          setAccordion(optionsArray.length);
          saveOptions(_options);
        }}
      >
        <TbPlus />
        Add Option
      </button>
    </div>
  );
};

export const SelectOptionsItem = (__props: ToolbarItemProps) => {
  const {
    actions: { setProp },
    options,
  } = useNode((node) => {
    const opts = node.data.props?.options || [];
    // Ensure options is an array
    const optionsArray = Array.isArray(opts) ? opts : Object.values(opts);
    return {
      options: optionsArray,
    };
  });

  console.log("SelectOptionsItem - current options:", options);

  return (
    <Wrap {...__props} props={__props}>
      <Input options={options} setProp={setProp} />
    </Wrap>
  );
};
