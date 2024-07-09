import { useEditor, useNode } from "@craftjs/core";
import { Tooltip } from "components/layout/Tooltip";
import debounce from "lodash.debounce";
import { TbExternalLink, TbExternalLinkOff } from "react-icons/tb";
import { useRecoilValue } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { TabAtom } from "../Viewport";

const slug = require("slug");

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
  const settings = useRecoilValue(SettingsAtom);
  const title = useRecoilValue(TabAtom);

  return (
    <div className="flex items-center gap-3 justify-between">
      {!propValues.canEditName && <div>{name}</div>}

      {propValues.canEditName && (
        <input
          type="text"
          defaultValue={name}
          placeholder={name}
          className="bg-transparent border-0 w-full rounded-md font-bold text-2xl p-0 focus:ring-0 hover:bg-gray-500/10 capitalize"
          onChange={debounce((e) => {
            actions.setCustom(
              id,
              (custom) => (custom.displayName = e.target.value)
            );
          }, 500)}
        />
      )}

      <div className="text-xs whitespace-nowrap capitalize">{title}</div>

      {propValues.type === "page" && (
        <Tooltip
          content="Open page in a new tab"
          arrow={false}
          placement="bottom"
        >
          <a
            className="text-gray-300 text-base"
            href={
              settings?.draftId
                ? `https://${settings?.draftId}.pagehub.dev/${
                    !propValues.isHomePage ? slug(name, "-") : ""
                  }`
                : null
            }
            target="_blank"
          >
            {settings?.draftId ? <TbExternalLink /> : <TbExternalLinkOff />}
          </a>
        </Tooltip>
      )}
    </div>
  );
};
