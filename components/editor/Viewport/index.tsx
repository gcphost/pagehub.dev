import { NodeTree, useEditor } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import { Tooltip } from "components/layout/Tooltip";
import { Background } from "components/selectors/Background";
import { Button, OnlyButtons } from "components/selectors/Button";
import { Container } from "components/selectors/Container";
import { Divider } from "components/selectors/Divider";
import { Embed } from "components/selectors/Embed";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { Image } from "components/selectors/Image";
import { OnlyText, Text } from "components/selectors/Text";
import { Video } from "components/selectors/Video";
import router from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { TbCode } from "react-icons/tb";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { SettingsAtom } from "utils/atoms";
import {
  IsolateAtom,
  LastctiveAtom,
  OnlineAtom,
  ScreenshotAtom,
  SideBarAtom,
  SideBarOpen,
} from "utils/lib";
import { DeviceOffline } from "../Toolbar/DeviceOffline";
import {
  GetHtmlToComponent,
  SaveToServer,
  buildClonedTree,
  deleteNode,
} from "./lib";

export const PreviewAtom = atom({
  key: "preview",
  default: false,
});

export const ViewportScrollAtom = atom({
  key: "vpscroll",
  default: false,
});

export const MouseInEditor = atom({
  key: "mousein",
  default: false,
});

export const UnsavedChangesAtom = atom({
  key: "unsavedchanges",
  default: {},
});

export const ViewAtom = atom({
  key: "view",
  default: "desktop",
});

export const ToolbarTitleAtom = atom({
  key: "ttt",
  default: "",
});

export const TabAtom = atom({
  key: "editorTab",
  default: "",
});

export const DeviceAtom = atom({
  key: "device",
  default: false,
});

export const EnabledAtom = atom({
  key: "enabled",
  default: true,
});

export const Viewport: React.FC<any> = ({ children }) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  useEffect(() => {
    if (!window) {
      return;
    }

    window.requestAnimationFrame(() => {
      setTimeout(() => {
        setOptions((options) => {
          options.enabled = true;
        });
      }, 200);
    });
  }, [setOptions]);

  const { canUndo, canRedo, actions, query } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [ac, setAc] = useState(false);

  useEffect(() => {
    const active = query.getEvent("selected").first();

    if (!active && !ac) {
      const nl = query?.node(ROOT_NODE).get()?.data?.nodes;

      if (nl && nl.length >= 1) {
        setTimeout(() => actions.selectNode(nl[0]), 200);
        setAc(true);
      }
    }
  }, []);

  const [unsavedChanges, setUnsavedChanged] =
    useRecoilState(UnsavedChangesAtom);

  const view = useRecoilValue(ViewAtom);
  const device = useRecoilValue(DeviceAtom);
  const [settings, setSettings] = useRecoilState(SettingsAtom);
  const [preview, setPreview] = useRecoilState(PreviewAtom);
  const setEnabled = useSetRecoilState(EnabledAtom);
  const isolated = useRecoilValue(IsolateAtom);
  const lastActive = useRecoilValue(LastctiveAtom);
  const screenshot = useRecoilValue(ScreenshotAtom);
  const [online, setOnline] = useRecoilState(OnlineAtom);
  const sideBarOpen = useRecoilValue(SideBarOpen);
  const sideBarLeft = useRecoilValue(SideBarAtom);

  useEffect(() => {
    localStorage.setItem("clipBoard", JSON.stringify({}));
  }, []);

  const onlineStateChange = async (event) => {
    setOnline(event.type === "online");

    if (event.type !== "online") return;

    setUnsavedChanged(false);
  };

  useEffect(() => {
    setOnline(window.navigator.onLine);

    window.addEventListener("online", onlineStateChange);
    window.addEventListener("offline", onlineStateChange);
    return () => {
      window.removeEventListener("online", onlineStateChange);
      window.removeEventListener("offline", onlineStateChange);
    };
  }, []);

  useEffect(() => {
    const warningText = "Leave site? Changes you made may not be saved.";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      throw new Error("routeChange aborted.");
    };
    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [unsavedChanges]);

  const {
    actions: { setProp },
  } = useEditor(() => ({}));

  const fromEntries = (pairs) => {
    if (Object.fromEntries) {
      return Object.fromEntries(pairs);
    }
    return pairs.reduce(
      (accum, [id, value]) => ({
        ...accum,
        [id]: value,
      }),
      {}
    );
  };

  const getCloneTree = useCallback(
    (tree: NodeTree) => buildClonedTree({ tree, query, setProp }),
    [query]
  );

  async function checkIfHtmlInClipboard() {
    let text = await navigator.clipboard.readText();
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/\s{2,}/g, " "); // replace any sequence of 2 or more whitespace characters with a single space

    if (text.startsWith("<")) {
      // The clipboard contains HTML starting with <div>
      return text;
    }

    return null;
  }

  const handleSaveTemplate = useCallback(() => {
    const active = query.getEvent("selected").first();
    const node = query.node(active).get();

    if (["page", "background"].includes(node.data.props.type))
      return localStorage.setItem("clipBoard", JSON.stringify({}));

    const tree = query.node(active).toNodeTree();
    const nodePairs = Object.keys(tree.nodes).map((id) => [
      id,
      query.node(id).toSerializedNode(),
    ]);
    const serializedNodesJSON = JSON.stringify(fromEntries(nodePairs));
    const saveData = {
      rootNodeId: tree.rootNodeId,
      nodes: serializedNodesJSON,
    };
    // save to your database
    localStorage.setItem("clipBoard", JSON.stringify(saveData));
  }, [query]);

  // add templates where you want
  const handleAdd = useCallback(async () => {
    let active = query.getEvent("selected").first();

    if (!active) active = ROOT_NODE;
    const id = active;
    // get the template from your database

    const pasties = await checkIfHtmlInClipboard();
    if (pasties) {
      const editorComponents = {
        Background,
        Container,
        Text,
        OnlyFormElement,
        OnlyText,
        Form,
        FormDrop,
        FormElement,
        OnlyButtons,
        Button,
        Video,
        Image,
        Embed,
        Divider,
      };

      const toNode = (data, parent = ROOT_NODE) => {
        console.log(data.type);
        if (!data.type) return;

        const result = {
          data: {
            type: editorComponents[data.type],
            props: data.props,
          },
        };

        console.log(result);
        let freoshNode = null;

        try {
          freoshNode = query.parseFreshNode(result).toNode();

          actions.add(freoshNode, parent);
        } catch (e) {
          console.error(e);
        }

        if (!freoshNode) return null;

        if (data.children) {
          data.children.forEach((child) => {
            toNode(child, freoshNode.id);
          });
        }

        console.log("toNode", freoshNode.id, parent);

        return freoshNode;
      };

      const data = await GetHtmlToComponent(pasties);
      console.log(data.result);

      console.log({ originalNodeTree: query.node(ROOT_NODE).toNodeTree() });

      if (data.result) {
        console.log({ newTree: query.node(ROOT_NODE).toNodeTree() });
      }
    }
  }, [actions, getCloneTree, query]);

  const handleBodyKeyDown = (event) => {
    if (event.key === "Escape") {
      if (preview) {
        event.preventDefault();
        actions.setOptions((options) => {
          // selectNode(ROOT_NODE);
          options.enabled = !enabled;

          setPreview(false);
          setEnabled(true);

          setTimeout(() => {
            if (!lastActive) return;
            const node = query.node(lastActive).get();
            if (node) actions.selectNode(lastActive);
          }, 100);
        });
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.target.getAttribute("contenteditable") === "true") {
      return;
    }

    const charCode = String.fromCharCode(event.which).toLowerCase();

    handleBodyKeyDown(event);
    // copy
    if ((event.ctrlKey || event.metaKey) && charCode === "c") {
      event.preventDefault();

      try {
        handleSaveTemplate();
      } catch (e) {
        console.error(e);
      }

      return;
    }

    // paste
    if ((event.ctrlKey || event.metaKey) && charCode === "v") {
      event.preventDefault();

      // if we get position of mouse over selected div we can order better..
      // var elements = Array.from(document.querySelectorAll(":hover"));

      handleAdd();

      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();

      try {
        const active = query.getEvent("selected").first();
        const theNode = query.node(active).get();
        const parentNode = query.node(theNode.data.parent).get();
        const indexToAdd = parentNode.data.nodes.indexOf(active);
        let index = indexToAdd + 1;

        if (index + 1 > parentNode.data.nodes.length) index = 0;

        const ee = query.node(parentNode.data.nodes[index]).get();
        const theNewNode = query.node(ee.id).get();

        actions.selectNode(theNewNode.id);
      } catch (e) {
        console.error(e);
      }

      return;
    }

    if (event.which === 8) {
      try {
        event.preventDefault();
        const active = query.getEvent("selected").first();
        const theNode = query.node(active).get();

        if (!theNode.data.props.canDelete) return;

        return deleteNode(query, actions, active, settings);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      try {
        event.preventDefault();
        SaveToServer(query.serialize(), true, settings, setSettings);
        setUnsavedChanged(false);
      } catch (e) {
        console.error(e);
      }

      return;
    }

    if ((event.ctrlKey || event.metaKey) && charCode === "z") {
      try {
        event.preventDefault();
        canUndo && actions?.history?.undo();
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if ((event.ctrlKey || event.metaKey) && charCode === "y") {
      try {
        event.preventDefault();
        canRedo && actions?.history?.redo();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const sb =
    enabled && sideBarOpen
      ? sideBarLeft
        ? "lg:ml-[360px]"
        : "lg:mr-[360px]"
      : null;

  const deviceClasses = {
    mobile: [
      "mx-auto flex z-2 transition overflow-hidden mt-32 mx-auto w-full md:w-[380px] mb-32 px-2 py-6 rounded-2xl bg-gray-700 border-4 border-gray-800 drop-shadow-2xl",
      "w-full h-full flex overflow-auto rounded-xl border-4 border-gray-900 disable-scrollbars",
    ],

    desktop: [
      enabled
        ? "flex h-screen overflow-hidden flex-row w-full bg-gray-200 w-screen absolute top-0 left-0 right-0 bottom-0"
        : "",
      enabled ? "w-full overflow-hidden" : "w-screen h-screen overflow-auto",
    ],
  };

  let viewClasses = {
    mobile: [
      `flex h-screen overflow-hidden flex-row mx-auto w-${
        enabled ? "[380px]" : "screen"
      } mx-auto bg-gray-200`,
      enabled
        ? "w-full my-6 rounded-lg overflow-auto scrollbar bg-white"
        : "w-screen h-screen overflow-auto",
    ],

    desktop: [
      enabled
        ? `${sb} mx-auto flex h-screen overflow-hidden flex-row w-screen bg-gray-200`
        : "w-screen",
      enabled
        ? "w-full m-1 relative overflow-auto  bg-white"
        : "w-screen h-screen overflow-show",
    ],
  };

  if (device) {
    viewClasses = deviceClasses;
  }

  const activeClass = viewClasses[view];

  useEffect(() => {
    document.addEventListener("keydown", handleBodyKeyDown);
    return () => {
      document.removeEventListener("keydown", handleBodyKeyDown);
    };
  }, []);

  return (
    <div
      data-container={true}
      className={`flex h-screen overflow-hidden flex-row w-full ${
        enabled && "bg-gray-200"
      }`}
    >
      {!enabled && !screenshot && (
        <div className="absolute right-12 top-12 z-50">
          <Tooltip content="Edit" placement="bottom" arrow={false}>
            <button
              className="p-4 btn text-2xl bg-violet-500/90 cursor-pointer select-none rounded-md text-white"
              onClick={() =>
                setOptions((options) => {
                  options.enabled = true;
                  setPreview(false);
                  setTimeout(() => {
                    if (!lastActive) return;

                    const node = query.node(lastActive).get();
                    if (node) actions.selectNode(lastActive);
                  }, 0);
                })
              }
            >
              <TbCode />
            </button>
          </Tooltip>
        </div>
      )}

      {enabled && !online && <DeviceOffline />}

      <div className={activeClass[0]}>
        <div
          id="viewport"
          role="button"
          onKeyDown={handleKeyDown}
          data-isolated={!!isolated}
          tabIndex={0}
          className={activeClass[1]}
          ref={(ref: any) =>
            connectors.select(connectors.hover(ref, null), null)
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};
