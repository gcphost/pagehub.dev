import { ROOT_NODE, useEditor } from "@craftjs/core";
import { useEffect, useState } from "react";
import { TbArrowUpSquare, TbHash } from "react-icons/tb";
import { useRecoilState } from "recoil";
import { SettingsAtom } from "utils/atoms";
import { IsolateAtom, isolatePageAlt } from "utils/lib";

const sluggit = require("slug");

export const PagesSettings = () => {
  const [settings, setSettings] = useRecoilState(SettingsAtom);

  const [data, setData] = useState(settings);
  const [pages, setPages] = useState([]);
  const { query, actions } = useEditor();
  const [isolate, setIsolate] = useRecoilState(IsolateAtom);

  useEffect(() => {
    const root = query.node(ROOT_NODE).get();

    setPages(
      root.data.nodes
        .map((_) => {
          const _props = query.node(_).get();

          return _props?.data?.props?.type === "page"
            ? { ..._props.data, id: _ }
            : null;
        })
        .filter((_) => _),
    );
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <p className="px-3">
        All Pages will be displayed in the editor by default. Isolate specific
        pages here. When browsing your live site only the selected page will be
        visible at the route defined.
      </p>
      <div className="mx-3 flex flex-col overflow-hidden rounded-lg border border-border">
        <button
          className={`flex cursor-pointer flex-row items-center gap-3 p-3 ${
            !isolate
              ? "bg-muted hover:text-foreground"
              : "hover:text-muted-foreground"
          }`}
          onClick={() => {
            isolatePageAlt(true, query, null, actions, setIsolate, false);
          }}
        >
          <div className="w-min">
            <TbArrowUpSquare />
          </div>
          <div className="w-full">All Pages</div>
        </button>

        {pages.map((page) => (
          <button
            key={page.id}
            className={`flex cursor-pointer flex-row items-center gap-3 p-3 ${
              isolate === page.id
                ? "bg-muted hover:text-foreground"
                : "hover:text-muted-foreground"
            }`}
            onClick={() =>
              isolatePageAlt(
                isolate,
                query,
                page.id,
                actions,
                setIsolate,
                false,
              )
            }
          >
            <div className="w-min">
              <TbHash />
            </div>
            <div className="w-full">{page?.custom?.displayName}</div>
            <div className="w-full text-right">
              /{sluggit(page?.custom?.displayName, "-")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
