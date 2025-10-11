import { useEditor, useNode } from "@craftjs/core";
import debounce from "lodash.debounce";
import { useRecoilValue } from "recoil";
import { TabAtom } from "../Viewport";

export const ToolbarTitleEditor = () => {
  const { id, name, propValues } = useNode((node) => ({
    propValue: node.data.props.activeTab,
    propValues: node.data.props,
    activeSettingVa: node.data.props.activeSetting,
    nodeData: node.data,
    id: node.id,
    name: node.data.custom.displayName || node.data.displayName,
  }));

  const { actions } = useEditor(() => ({}));
  const title = useRecoilValue(TabAtom);

  return (
    <div className="flex items-center gap-3 justify-between">
      {!propValues.canEditName && (
        <div className="truncate max-w-xs" title={name}>
          {name}
        </div>
      )}

      {propValues.canEditName && (
        <input
          type="text"
          defaultValue={name}
          placeholder={name}
          className="w-full bg-transparent text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:bg-background p rounded capitalize truncate"
          onChange={debounce((e) => {
            actions.setCustom(
              id,
              (custom) => (custom.displayName = e.target.value)
            );
          }, 500)}
        />
      )}

      <div className="text-xs whitespace-nowrap capitalize">{title}</div>
    </div>
  );
};
