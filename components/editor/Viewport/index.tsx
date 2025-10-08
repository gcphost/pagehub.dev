import { NodeTree, useEditor } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import { Tooltip } from "components/layout/Tooltip";
import { Background } from "components/selectors/Background";
import { Button } from "components/selectors/Button";
import { Container } from "components/selectors/Container";
import { Divider } from "components/selectors/Divider";
import { Embed } from "components/selectors/Embed";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { Image } from "components/selectors/Image";
import { OnlyText, Text } from "components/selectors/Text";
import { Video } from "components/selectors/Video";
import router, { useRouter } from "next/router";
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
  ViewModeAtom,
  isolatePageAlt,
} from "utils/lib";
import { DeviceOffline } from "../Toolbar/DeviceOffline";
import { useComponentSync } from "../useComponentSync";
import { ComponentEditorTabs } from "./ComponentEditorTabs";
import { DeviceSelector } from "./DeviceSelector";
import {
  GetHtmlToComponent,
  SaveToServer,
  buildClonedTree,
  deleteNode,
} from "./lib";
import { ViewportMeta } from "./ViewportMeta";

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

export const DeviceDimensionsAtom = atom({
  key: "deviceDimensions",
  default: { width: 390, height: 844 },
});

export const EnabledAtom = atom({
  key: "enabled",
  default: true,
});

export const InitialLoadCompleteAtom = atom({
  key: "initialLoadComplete",
  default: false,
});

export const Viewport: React.FC<any> = ({ children }) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  // Sync linked components when master components change
  useComponentSync();

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



  // TO-DO: what is this ? bad? lazy AI
  // Expose query to window for style guide resolution
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__CRAFT_EDITOR__ = { query };
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__CRAFT_EDITOR__;
      }
    };
  }, [query]);

  const [ac, setAc] = useState(false);
  const setInitialLoadComplete = useSetRecoilState(InitialLoadCompleteAtom);
  const nextRouter = useRouter();
  const [isolate, setIsolate] = useRecoilState(IsolateAtom);
  const viewMode = useRecoilValue(ViewModeAtom);

  // Handle URL-based page isolation
  useEffect(() => {
    const sluggit = require("slug");
    const pathParts = nextRouter.asPath.split('/').filter(p => p && !p.startsWith('?'));

    const root = query.node(ROOT_NODE).get();
    if (!root) return;

    // Check if there's a page slug in the URL (last part of the path)
    if (pathParts.length >= 3) {
      // Has page slug: /build/something/page-slug
      const pageSlug = pathParts[pathParts.length - 1];

      // Find the page that matches this slug
      const matchingPage = root.data.nodes.find(nodeId => {
        const node = query.node(nodeId).get();
        if (node?.data?.props?.type === "page") {
          const displayName = node.data.custom?.displayName;
          const nodeSlug = sluggit(displayName, "-");
          return nodeSlug === pageSlug;
        }
        return false;
      });

      if (matchingPage && matchingPage !== isolate) {
        // Isolate the page found in the URL
        setTimeout(() => {
          isolatePageAlt(isolate, query, matchingPage, actions, setIsolate, true);
        }, 500);
      }
    } else if (pathParts.length === 1 || pathParts.length === 2) {
      // Base URL: /build or /build/something - show home page
      // Find the page marked as home page
      const homePageId = root.data.nodes.find(nodeId => {
        const node = query.node(nodeId).get();
        const isPage = node?.data?.props?.type === "page";
        const isHomePage = node?.data?.props?.isHomePage;
        return isPage && isHomePage;
      });

      if (homePageId && homePageId !== isolate) {
        // Isolate the home page
        setTimeout(() => {
          isolatePageAlt(isolate, query, homePageId, actions, setIsolate, true);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextRouter.asPath]);


  const [unsavedChanges, setUnsavedChanged] =
    useRecoilState(UnsavedChangesAtom);

  const view = useRecoilValue(ViewAtom);
  const [device, setDevice] = useRecoilState(DeviceAtom);
  const deviceDimensions = useRecoilValue(DeviceDimensionsAtom);
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

    const handleBrowseAway = (url: string) => {
      // Check if navigating within the same build context (just changing pages)
      const currentPath = router.asPath;
      const currentParts = currentPath.split('/').filter(p => p && !p.startsWith('?'));
      const newParts = url.split('/').filter(p => p && !p.startsWith('?'));

      // If both URLs are /build/[tenant]/... then it's just page navigation
      if (currentParts.length >= 2 && newParts.length >= 2 &&
        currentParts[0] === 'build' && newParts[0] === 'build' &&
        currentParts[1] === newParts[1]) {
        // Same build context, allow navigation without warning
        return;
      }

      // Different context, show warning
      if (window.confirm(warningText)) return;
      router.events.emit("routeChangeError");
      // throw new Error("routeChange aborted.");
    };

    window.addEventListener("beforeunload", handleWindowClose);
    router.events.on("routeChangeStart", handleBrowseAway);
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
      router.events.off("routeChangeStart", handleBrowseAway);
    };
  }, [unsavedChanges, router]);

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

    if (event.key === "Escape") {
      event.preventDefault();

      try {
        const active = query.getEvent("selected").first();
        if (active) {
          // Get the background node (first child of ROOT_NODE)
          const rootNode = query.node(ROOT_NODE).get();
          const backgroundNodeId = rootNode?.data?.nodes?.[0];

          if (backgroundNodeId) {
            actions.selectNode(backgroundNodeId);
          }
        }
      } catch (e) {
        console.error(e);
      }

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

        // Check if a node is selected
        if (!active) return;

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
      "mx-auto flex z-2 transition overflow-hidden mt-32 mx-auto w-full mb-32 px-2 py-6 rounded-2xl bg-gray-700 border-4 border-gray-800 drop-shadow-2xl",
      "w-full h-full flex overflow-auto rounded-xl border-4 border-gray-900 disable-scrollbars relative",
    ],

    desktop: [
      enabled
        ? "flex h-screen overflow-hidden flex-row w-full w-screen absolute top-0 left-0 right-0 bottom-0"
        : "",
      enabled ? `w-screen h-screen overflow-auto ${viewMode === 'component' ? 'mt-[49px]' : ''} ` : "w-screen h-screen overflow-auto",
    ],
  };

  const deviceStyles = device && view === 'mobile' ? {
    width: `${deviceDimensions.width}px`,
    height: `${deviceDimensions.height}px`,
  } : {};

  let viewClasses = {
    mobile: [
      `flex h-screen overflow-hidden flex-row mx-auto w-${enabled ? "[380px]" : "screen"
      } mx-auto `,
      enabled
        ? "w-full rounded-lg overflow-scroll scrollbar-light bg-white relative"
        : "w-screen h-screen overflow-auto relative",
    ],

    desktop: [
      enabled
        ? `${sb} mx-auto flex h-screen overflow-hidden flex-row w-screen`
        : "w-screen",
      enabled
        ? `w-full !border-[7px] ${viewMode === 'component' ? 'border-purple-200' : 'border-gray-100'}   relative scrollbar-light bg-white overflow-scroll`
        : "w-screen h-screen overflow-show relative",
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
    <>
      <ViewportMeta />

      {/* Main layout container */}
      <div
        className={`flex h-screen overflow-visible flex-row ${view === 'mobile' && sideBarOpen ? `${sideBarLeft ? 'ml-[360px]' : 'mr-[360px]'} w-[calc(100vw-360px)]` : 'w-screen'}`}
        data-container={true}
      >

        {/* Preview mode: "Edit" button */}
        {!enabled && !screenshot && (
          <div className="absolute right-12 top-12 z-50">
            <Tooltip content="Edit" placement="bottom" arrow={false}>
              <button
                className="p-4 btn text-2xl bg-primary-500/90 cursor-pointer select-none rounded-md text-white"
                aria-label="Edit page"
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

        {/* Offline indicator */}
        {enabled && !online && <DeviceOffline />}

        {/* Component Editor Tabs - absolute positioned above viewport, after sidebar */}
        {enabled && (
          <div className={`absolute top-0 ${sideBarOpen && sideBarLeft ? 'left-[360px]' : 'left-0'} right-0 z-40  ${viewMode === 'component' ? '' : 'hidden'}`}>
            <ComponentEditorTabs />
          </div>
        )}

        {/* Device Selector - shown above device preview in mobile view */}
        {enabled && device && view === 'mobile' && (
          <div className={`absolute top-[100px] ${sideBarOpen && sideBarLeft ? 'left-[360px]' : 'left-0'} right-0 z-50  `}>
            <DeviceSelector onClose={() => setDevice(false)} />
          </div>
        )}

        {/* Viewport container */}
        <div className={activeClass[0]} style={deviceStyles}>
          <div
            id="viewport"
            role="main"
            onKeyDown={handleKeyDown}
            data-isolated={!!isolated}
            tabIndex={0}
            className={activeClass[1]}
            ref={(ref: any) => connectors.select(connectors.hover(ref, null), null)}
            style={viewMode === 'component' && !device && !preview ? { marginTop: '49px' } : undefined}
          >
            {children}
          </div>
        </div>

        {/* SVG overlay for measurement lines */}
        {enabled && (
          <svg
            id="measurement-lines-svg"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 9997,
            }}
          />
        )}
      </div>
    </>
  );
};
