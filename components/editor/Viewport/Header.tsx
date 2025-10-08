import { ROOT_NODE, useEditor } from "@craftjs/core";
import { Tooltip } from "components/layout/Tooltip";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import TbHidden from "icons/TbHidden";
import TbNotHidden from "icons/TbNotHidden";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  TbArrowBackUp,
  TbArrowForwardUp,
  TbBoxModel2,
  TbCode,
  TbDeviceDesktop,
  TbDeviceFloppy,
  TbDeviceMobile,
  TbDevices,
  TbDevices2,
  TbDevicesOff,
  TbDownload,
  TbExternalLink,
  TbEye,
  TbFilePlus,
  TbFileText,
  TbForms,
  TbLayoutSidebar,
  TbLayoutSidebarRight,
  TbLogin,
  TbLogout,
  TbMenu2,
  TbPalette,
  TbPhoto,
  TbPlayerPlay,
  TbPlus,
  TbSettings,
  TbUpload,
  TbX
} from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SessionTokenAtom, SettingsAtom } from "utils/atoms";
import { getAltView } from "utils/craft";
import {
  ComponentsAtom,
  LastctiveAtom,
  MenuItemState,
  MenuState,
  SideBarAtom,
  ViewModeAtom,
  popupCenter
} from "utils/lib";
import { useTenant } from "utils/tenantStore";
import { DeviceAtom, EnabledAtom, PreviewAtom, ViewAtom } from ".";
import { MediaManagerModal } from "../Toolbar/Inputs/MediaManagerModal";
import { AnimatedSaveButton } from "../Tools/AnimatedSaveButton";
import { ComponentSelector } from "./ComponentSelector";
import { ComponentSettings } from "./ComponentSettings";
import { DesignSystemPanel } from "./DesignSystemPanel";
import { DomainSettings } from "./DomainSettings";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { SaveToServer } from "./lib";
import { PageSelector } from "./PageSelector";
import { SiteSettingsModal } from "./SiteSettingsModal";

export function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

const Item = ({ onClick, children, disabled = false, className = "", ariaLabel = "" }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`cursor-pointer hover:bg-gray-600/20 hover:text-white py-3 px-1.5 text-xl flex items-center justify-center rounded-lg text-white ${disabled && "opacity-50"
      } ${className}`}
    whileHover={{
      scale: 1.1,
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.9 }}
    style={{
      willChange: "transform",
      backfaceVisibility: "hidden",
      WebkitFontSmoothing: "antialiased",
    }}
  >
    {children}
  </motion.button>
);

export const Header = () => {
  const { enabled, canUndo, canRedo, actions, query } = useEditor(
    (state, query) => ({
      enabled: state.options.enabled,
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  );

  const setComponents = useSetRecoilState(ComponentsAtom);

  // Load components by querying for type="component" nodes
  useEffect(() => {
    if (!query || !enabled) return;

    try {
      const rootNode = query.node(ROOT_NODE).get();
      const rootChildren = rootNode?.data?.nodes || [];

      // Find all Container nodes with type="component"
      const componentNodes = rootChildren
        .map(nodeId => {
          try {
            const node = query.node(nodeId).get();
            if (node?.data?.props?.type === 'component') {
              // Get the first child of the component container (the actual content)
              const childNodeId = node.data.nodes?.[0];

              if (childNodeId) {
                // Serialize the child node tree for dragging
                const tree = query.node(childNodeId).toNodeTree();
                const nodePairs = Object.keys(tree.nodes).map((id) => [
                  id,
                  query.node(id).toSerializedNode(),
                ]);
                const entries = Object.fromEntries(nodePairs);
                const serializedNodes = JSON.stringify(entries);

                return {
                  rootNodeId: childNodeId, // The actual content node
                  nodes: serializedNodes,
                  name: node?.data?.custom?.displayName || node?.data?.displayName || 'Unnamed Component',
                };
              }
            }
          } catch (e) {
            return null;
          }
          return null;
        })
        .filter(Boolean);

      console.log('📦 Header: Found component nodes:', componentNodes.length);
      setComponents(componentNodes);
    } catch (e) {
      console.error("❌ Error loading components:", e);
    }
  }, [query, enabled, setComponents]);

  const setActive = useSetRecoilState(LastctiveAtom);
  const [stateToLoad, setStateToLoad] = useState(null);

  const [showMenu, setShowMenu] = useRecoilState(MenuState);
  const [showMenuType, setShowMenuType] = useRecoilState(MenuItemState);
  const [isMediaManagerModalOpen, setIsMediaManagerModalOpen] = useState(false);
  const [isSiteSettingsModalOpen, setIsSiteSettingsModalOpen] = useState(false);
  const [isDesignSystemPanelOpen, setIsDesignSystemPanelOpen] = useState(false);

  const setEnabled = useSetRecoilState(EnabledAtom);

  // Check if this is a tenant
  const tenant = useTenant();
  const isTenant = !!tenant;

  const ref = useRef(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [ref, setShowMenu]);

  const [preview, setPreview] = useRecoilState(PreviewAtom);

  const toggle = () =>
    actions.setOptions((options) => {
      // selectNode(ROOT_NODE);
      options.enabled = !enabled;

      if (!options.enabled) {
        const dom = document.getElementById("viewport");

        const arr_elms = dom.getElementsByTagName("*") || [];
        const elms_len = arr_elms.length;

        for (var i = 0; i < elms_len; i++) {
          [
            "data-bounding-box",
            "data-empty-state",
            "data-renderer",
            "contenteditable",
            "data-no-scrollbars",
            "draggable",
            "data-enabled",
            "data-selected",
            "data-border",
            "data-hover",
            "draggable",
            "main-node",
            "node-id",
          ].forEach((_) => arr_elms[i].removeAttribute(_));
        }
      }

      const active = query.getEvent("selected").first();
      setActive(active);

      setEnabled(options.enabled);
    });

  const [view, setView] = useRecoilState(ViewAtom);
  const [device, setDevice] = useRecoilState(DeviceAtom);
  const [lsIds, setLsIds] = useState([]);
  const [showHidden, setShowHidden] = useState(true);

  useEffect(
    () => setLsIds(JSON.parse(localStorage.getItem("history")) || []),
    []
  );

  const altView = getAltView(view);

  const animate = false;
  const [settings, setSettings] = useRecoilState(SettingsAtom);
  const sessionToken = useRecoilValue(SessionTokenAtom);

  const [sideBarLeft, setSideBarLeft] = useRecoilState(SideBarAtom);
  const [viewMode, setViewMode] = useRecoilState(ViewModeAtom);

  const { data: session, status } = useSession();

  if (!enabled) return null;

  return (
    <>
      <header
        role="banner"
        className="inside-shadow pointer-events-auto  bg-primary-900 text-black items-center  flex flex-row-reverse justify-between"
        data-tutorial="header"
      >
        <Tooltip content="Add Component" placement="bottom" arrow={false}>
          <Item
            ariaLabel="Add Component"
            onClick={() => {
              setShowMenuType("components");
              setShowMenu(true);
            }}
          >
            <TbPlus />
          </Item>
        </Tooltip>


        <Tooltip content="Redo" placement="bottom" arrow={false}>
          <Item
            ariaLabel="Redo"
            disabled={!canRedo}
            onClick={() => {
              actions.history.redo();

              const active = query.getEvent("selected");
              if (!active) actions.selectNode(ROOT_NODE);
            }}
          >
            <TbArrowForwardUp />
          </Item>
        </Tooltip>


        <Tooltip content="Undo" placement="bottom" arrow={false}>
          <Item
            ariaLabel="Undo"
            disabled={!canUndo}
            onClick={() => {
              actions.history.undo();

              const active = query.getEvent("selected");
              if (!active) actions.selectNode(ROOT_NODE);
            }}
          >
            <TbArrowBackUp />
          </Item>
        </Tooltip>

        {animate && (
          <Tooltip content="Play Animations" placement="bottom" arrow={false}>
            <Item ariaLabel="Play Animations" onClick={() => { }}>
              <TbPlayerPlay />
            </Item>
          </Tooltip>
        )}

        <Tooltip
          content={`${showHidden ? "Show" : "Hide"} Hidden Components`}
          placement="bottom"
          arrow={false}
        >
          <Item
            ariaLabel={`${showHidden ? "Show" : "Hide"} Hidden Components`}
            onClick={() => {
              const viewport = document.getElementById("viewport");

              setShowHidden(!showHidden);
              viewport.setAttribute(
                "data-show-hidden",
                showHidden ? "true" : "false"
              );
            }}
          >
            {showHidden ? <TbHidden /> : <TbNotHidden />}
          </Item>
        </Tooltip>

        <Tooltip content={`Edit ${altView}`} placement="bottom" arrow={false}>
          <Item
            ariaLabel={`Edit ${altView}`}
            onClick={() => {
              setView(altView);

              setTimeout(() => {
                const selected = document.querySelector(
                  '[data-selected="true"]'
                );

                if (selected) selected.scrollIntoView();
              }, 200);
            }}
          >
            {view === "desktop" && <TbDeviceDesktop />}
            {view === "mobile" && <TbDeviceMobile />}
          </Item>
        </Tooltip>

        <Tooltip
          content={`${device ? "Disable" : "Enable"} Device View`}
          placement="bottom"
          arrow={false}
        >
          <Item
            ariaLabel={`${device ? "Disable" : "Enable"} Device View`}
            onClick={() => {
              setDevice(!device);
            }}
          >
            {!device ? <TbDevices /> : <TbDevicesOff />}
          </Item>
        </Tooltip>

        <Tooltip content={`Switch to ${viewMode === 'page' ? 'Component' : 'Page'} View`} placement="bottom" arrow={false}>
          <Item
            ariaLabel={`Switch to ${viewMode === 'page' ? 'Component' : 'Page'} View`}
            onClick={() => {
              const newMode = viewMode === 'page' ? 'component' : 'page';
              setViewMode(newMode);

              // When switching to page view, restore normal state
              if (newMode === 'page') {
                // Deselect any active node
                actions.selectNode(null);

                // Un-isolate to show all pages
                const { isolatePageAlt } = require('utils/lib');
                isolatePageAlt(true, query, null, actions, () => { }, false);

                // Show headers and footers
                const rootNode = query.node(ROOT_NODE).get();
                rootNode.data.nodes.forEach((nodeId) => {
                  const node = query.node(nodeId).get();
                  const nodeType = node?.data?.props?.type;

                  if (nodeType === 'header' || nodeType === 'footer') {
                    actions.setHidden(nodeId, false);
                    actions.setProp(nodeId, (prop) => (prop.hidden = false));
                  }
                });
              } else {
                // Just deselect when switching to component view
                actions.selectNode(null);
              }
            }}
          >
            {viewMode === 'page' ? <TbBoxModel2 /> : <TbFileText />}
          </Item>
        </Tooltip>

        <Tooltip content="Preview" placement="bottom" arrow={false}>
          <Item
            ariaLabel="Preview"
            onClick={() => {
              toggle();
              setPreview(!preview);
              // Deselect any active node when toggling preview
              if (enabled) {
                actions.selectNode(null);
              }
              document.getElementById("viewport").focus();
            }}
          >
            {enabled ? <TbEye /> : <TbCode />}
          </Item>
        </Tooltip>

        <Tooltip content="Save" placement="bottom" arrow={false}>
          {isTenant ? (
            <AnimatedSaveButton
              onClick={async () => {
                if (!canUndo) return;
                const json = query.serialize();
                await SaveToServer(json, true, settings, setSettings, sessionToken);
              }}
              disabled={!canUndo || !settings}
            />
          ) : (
            <Item
              ariaLabel="Save"
              disabled={!canUndo || !settings}
              onClick={async () => {
                if (!canUndo) return;

                // For non-tenants, show the domain settings editor pane
                setShowMenuType("domain");
                setShowMenu(true);
              }}
            >
              <TbDeviceFloppy />
            </Item>
          )}
        </Tooltip>

        <Tooltip content="More Options" placement="bottom" arrow={false}>
          <Item
            ariaLabel="More Options"
            onClick={() => {
              setShowMenuType(null);
              setShowMenu(!showMenu);
            }}
          >
            {showMenu ? <TbX /> : <TbMenu2 />}
          </Item>
        </Tooltip>
      </header>

      {/* Page/Component Selector Bar - Below Header */}
      <div className="pointer-events-auto bg-primary-900 border-b-2 border-gray-600 px-3 py-2">
        {viewMode === 'page' ? (
          <PageSelector className="w-full" />
        ) : (
          <ComponentSelector className="w-full" />
        )}
      </div>

      {showMenu && (
        <nav
          ref={ref}
          role="navigation"
          aria-label="Editor menu"
          className="pointer-events-auto drop-shadow-2xl overflow-y-auto scrollbar bg-gray-700    gap-3 pt-3 flex flex-col text-white absolute w-full bottom-0 z-50 top-12"
        >

          {showMenuType === "export" && <ExportModal />}
          {showMenuType === "import" && (
            <ImportModal
              stateToLoad={stateToLoad}
              setStateToLoad={setStateToLoad}
              actions={actions}
            />
          )}
          {showMenuType === "components" && <ComponentSettings />}
          {showMenuType === "domain" && <DomainSettings />}

          {showMenuType === "builds" && lsIds.length > 0 && (
            <>
              <div className="p-3 flex flex-col gap-6">
                <div className="text-xl">Account Builds</div>
                <p>
                  These builds have been saved to your account and can be
                  accessed anywhere you login.
                </p>
              </div>

              {lsIds.length ? (
                <div className="p-3 flex flex-col gap-6">
                  <div className="text-xl">Local Builds</div>
                  <p>
                    These builds are saved but only referenced locally, you will
                    need the link to access them outside of your current browser
                  </p>

                  <div className="flex flex-col gap-3">
                    {lsIds.reverse().map((_, key) => (
                      <div className="flex flex-row gap-3 w-full" key={key}>
                        <div className="text-2xl">
                          <TbExternalLink />
                        </div>
                        <div className="capitalize">
                          <Link href={`/build/${_._id}`} target="_blank">
                            {_.draftId}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
          {showMenuType === "submissions" && (
            <div className="p-3">
              <h3 className="text-2xl">Form Submissions</h3>
              <p className="mb-3">
                When users submit forms to your website the data will be
                available here.
              </p>

              <hr className="border-b border-gray-500 -mx-3 mb-6" />

              {settings?.submissions?.length ? (
                <div className="flex flex-col gap-6">
                  {settings?.submissions.map((submission, _key) => {
                    const items = Object.keys(submission.data);

                    // const a = Object.keys(items);

                    return (
                      <div
                        className="border border-gray-600  rounded p-3 gap-3 flex flex-col"
                        key={_key}
                      >
                        <p>
                          {submission.formName} {submission.createdAt}
                        </p>

                        {items.map((item, key) => {
                          const value = submission.data[item];
                          return (
                            <div key={key} className="flex flex-row gap-3">
                              <div className="font-bold capitalize">
                                {item}:
                              </div>
                              <div>{value}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          )}

          {!showMenuType && (
            <>
              {isTenant ? (
                // For tenant users, show background and settings panel buttons
                <>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      actions.selectNode(ROOT_NODE);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbBoxModel2 />
                    </div>{" "}
                    Select Background
                  </button>

                  <button
                    onClick={() => setSideBarLeft(!sideBarLeft)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      {sideBarLeft ? <TbLayoutSidebarRight /> : <TbLayoutSidebar />}
                    </div>
                    Move this panel to the {sideBarLeft ? "right" : "left"} side
                  </button>
                </>
              ) : (
                // For regular users, show all the original items
                <>
                  <Link
                    href="/build"
                    className="hidden items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <TbFilePlus /> New Builder
                  </Link>

                  {settings?.submissions?.length ? (
                    <button
                      onClick={() => {
                        setShowMenu(true);
                        setShowMenuType("submissions");
                      }}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                    >
                      <div className="text-2xl">
                        <TbForms />
                      </div>{" "}
                      Form Submissions
                    </button>
                  ) : null}


                  <button
                    onClick={() => {
                      setIsMediaManagerModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbPhoto />
                    </div>
                    <div className="">Media Manager</div>
                  </button>


                  <button
                    onClick={() => {
                      setIsDesignSystemPanelOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbPalette />
                    </div>
                    <div className="">Design System</div>
                  </button>



                  <button
                    onClick={() => {
                      setIsSiteSettingsModalOpen(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbSettings />
                    </div>
                    <div className="">Site Settings</div>
                  </button>

                  {settings?.name && (
                    <a
                      href={`https://${settings.name}.pagehub.dev`}
                      target="_blank"
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                    >
                      <div className="text-2xl">
                        <TbExternalLink />
                      </div>{" "}
                      View Live Version
                    </a>
                  )}


                  <hr className="border-b border-gray-500 " />

                  {settings?.draftId && (
                    <a
                      href={`https://${settings.draftId}.pagehub.dev`}
                      target="_blank"
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                    >
                      <div className="text-2xl">
                        <TbExternalLink />
                      </div>{" "}
                      View Draft Version
                    </a>
                  )}


                  <button
                    onClick={async () => {
                      //  return;

                      toggle();

                      setShowMenu(false);

                      actions.setOptions((options) => (options.enabled = true));

                      const nl = query?.node(ROOT_NODE).get()?.data?.nodes;

                      if (nl) actions.selectNode(nl[0]);

                      // isetDialogOpen(htmlOutput);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbCode />
                    </div>
                    <div className="">Copy As Html</div>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenuType("export");
                      setShowMenu(true);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbDownload />
                    </div>
                    <div className="">Export</div>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenuType("import");
                      setShowMenu(true);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbUpload />
                    </div>{" "}
                    Import
                  </button>

                  <hr className="border-b border-gray-500 " />

                  {lsIds.length ? (
                    <button
                      onClick={() => {
                        setShowMenu(true);
                        setShowMenuType("builds");
                      }}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                    >
                      <div className="text-2xl">
                        <TbDevices2 />
                      </div>{" "}
                      Previous Builds
                    </button>
                  ) : null}

                  <hr className="border-b border-gray-500 " />

                  {status === "authenticated" ? (
                    <>
                      <p className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3">
                        Signed in as {session.user.email}
                      </p>{" "}
                      <button
                        onClick={() => popupCenter("/google-signout", "Sign Out")}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                      >
                        <div className="text-2xl">
                          <TbLogout />
                        </div>{" "}
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => popupCenter("/google-signin", "Sign In")}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                    >
                      <div className="text-2xl">
                        <TbLogin />
                      </div>{" "}
                      Sign in
                    </button>
                  )}

                  <button
                    onClick={() => setSideBarLeft(!sideBarLeft)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      {sideBarLeft ? <TbLayoutSidebarRight /> : <TbLayoutSidebar />}
                    </div>
                    {sideBarLeft ? "Right" : "Left"} Settings Panel
                  </button>
                </>
              )}
            </>
          )}
        </nav>
      )}

      <MediaManagerModal
        isOpen={isMediaManagerModalOpen}
        onClose={() => setIsMediaManagerModalOpen(false)}
      />

      <SiteSettingsModal
        isOpen={isSiteSettingsModalOpen}
        onClose={() => setIsSiteSettingsModalOpen(false)}
      />

      <DesignSystemPanel
        isOpen={isDesignSystemPanelOpen}
        onClose={() => setIsDesignSystemPanelOpen(false)}
      />
    </>
  );
};
