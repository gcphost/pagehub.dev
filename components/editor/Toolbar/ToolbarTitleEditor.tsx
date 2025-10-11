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
    <div className="flex items-center justify-between gap-3">
      {!propValues.canEditName && (
        <div className="max-w-xs truncate" title={name}>
          {name}
        </div>
      )}

      {propValues.canEditName && (
        <input
          type="text"
          defaultValue={name}
          placeholder={name}
          className="p w-full truncate rounded bg-transparent capitalize text-foreground focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          onChange={debounce((e) => {
            actions.setCustom(
              id,
              (custom) => (custom.displayName = e.target.value),
            );
          }, 500)}
        />
      )}

      <div className="whitespace-nowrap text-xs capitalize">{title}</div>
    </div>
  );
};
