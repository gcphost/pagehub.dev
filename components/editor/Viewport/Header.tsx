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
  TbBrandOpenai,
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
  TbForms,
  TbLayoutSidebar,
  TbLayoutSidebarRight,
  TbListDetails,
  TbLogin,
  TbLogout,
  TbMenu2,
  TbPlayerPlay,
  TbPlus,
  TbUpload,
  TbX,
} from "react-icons/tb";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { SessionTokenAtom, SettingsAtom } from "utils/atoms";
import { getAltView } from "utils/craft";
import {
  LastctiveAtom,
  MenuItemState,
  MenuState,
  SideBarAtom,
  popupCenter,
} from "utils/lib";
import { useTenant } from "utils/tenantStore";
import { DeviceAtom, EnabledAtom, PreviewAtom, ViewAtom } from ".";
import { AnimatedSaveButton } from "../Tools/AnimatedSaveButton";
import { ComponentSettings } from "./ComponentSettings";
import { DomainSettings } from "./DomainSettings";
import { ExportModal } from "./ExportModal";
import { ImportModal } from "./ImportModal";
import { PageSettings } from "./PageSettings";
import { PagesSettings } from "./PagesSettings";
import { SaveToServer } from "./lib";

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

  const setActive = useSetRecoilState(LastctiveAtom);
  const [stateToLoad, setStateToLoad] = useState(null);

  const [showMenu, setShowMenu] = useRecoilState(MenuState);
  const [showMenuType, setShowMenuType] = useRecoilState(MenuItemState);

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

  const { data: session, status } = useSession();

  if (!enabled) return null;

  return (
    <>
      <header
        role="banner"
        className="inside-shadow pointer-events-auto  bg-primary-900 text-black border-2 border-gray-700 items-center  flex flex-row-reverse justify-between"
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

        <Tooltip content="Preview" placement="bottom" arrow={false}>
          <Item
            ariaLabel="Preview"
            onClick={() => {
              toggle();
              setPreview(!preview);
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
            <TbMenu2 />
          </Item>
        </Tooltip>
      </header>

      {showMenu && (
        <nav
          ref={ref}
          role="navigation"
          aria-label="Editor menu"
          className="pointer-events-auto drop-shadow-2xl overflow-y-auto scrollbar bg-gray-700    gap-3 pt-3 flex flex-col text-white absolute w-full bottom-0 z-50 top-12"
        >
          <button
            onClick={() => setShowMenu(false)}
            className="absolute right-3  "
            aria-label="Close menu"
          >
            <div className="w-5 hover:text-white text-gray-400 cursor-pointer">
              <Tooltip content="Close" arrow={false}>
                <TbX />
              </Tooltip>
            </div>
          </button>
          <div className="p-1.5 w-full"></div>

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
          {showMenuType === "page" && <PageSettings />}
          {showMenuType === "pages" && <PagesSettings />}
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
                      setShowMenu(false);
                      actions.selectNode(ROOT_NODE);
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbBoxModel2 />
                    </div>{" "}
                    Background
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(true);
                      setShowMenuType("pages");
                    }}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                  >
                    <div className="text-2xl">
                      <TbListDetails />
                    </div>{" "}
                    Pages
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

                  <hr className="border-b border-gray-500 " />
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

                  {settings && (
                    <button
                      onClick={() => {
                        setShowMenuType("page");
                        setShowMenu(true);
                      }}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-600 p-3"
                    >
                      <div className="text-2xl">
                        <TbBrandOpenai />
                      </div>{" "}
                      AI Settings
                    </button>
                  )}

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
    </>
  );
};
