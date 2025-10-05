import { Editor, Element, Frame } from "@craftjs/core";
import CustomEventHandlers from "components/editor/CustomEventHandlers";
import { ColorPickerDialog } from "components/editor/Toolbar/Tools/ColorPickerDialog";
import { FontFamilyDialog } from "components/editor/Toolbar/Tools/FontFamilyDialog";
import { IconDialogDialog } from "components/editor/Toolbar/Tools/IconDialog";
import { PatternDialog } from "components/editor/Toolbar/Tools/PatternDialog";
import { ToolTipDialog } from "components/editor/Toolbar/Tools/TooltipDialog";
import { Background } from "components/selectors/Background";
import { Container } from "components/selectors/Container";
import { Divider } from "components/selectors/Divider";
import { Embed } from "components/selectors/Embed";
import { Spacer } from "components/selectors/Spacer";
import { OnlyText, Text } from "components/selectors/Text";
import debounce from "lodash.debounce";
import lz from "lzutf8";
import { NextSeo } from "next-seo";
import { useSetRecoilState } from "recoil";
import { SessionTokenAtom } from "utils/atoms";
import { siteDescription, siteTitle } from "utils/lib";
import { templates } from "utils/templates";

// Custom template data - set to null to use default JSX template
let CUSTOM_TEMPLATE_DATA = "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"
//CUSTOM_TEMPLATE_DATA = ''

import { RenderNodeNewer } from "components/editor/RenderNodeNewer";
import { Toolbar } from "components/editor/Toolbar";

import { UnsavedChangesAtom, Viewport } from "components/editor/Viewport";
import { SavedComponentLoader } from "components/editor/Viewport/Toolbox/savedComponents";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { useEffect } from "react";
import { Save } from "../../components/Save";
import { Audio } from "../../components/selectors/Audio";
import { Button, OnlyButtons } from "../../components/selectors/Button";
import { Image } from "../../components/selectors/Image";
import { Video } from "../../components/selectors/Video";
import { useSetTenant } from "../../utils/tenantStore";
import { loadTenantSettings, runTenantWebhook } from "../../utils/tenantUtils";


function App({ data, slug, result, session, tenant, sessionToken }) {
  console.log({ data });
  data = data ? lz.decompress(lz.decodeBase64(data)) : lz.decompress(lz.decodeBase64(CUSTOM_TEMPLATE_DATA));
  const setTenant = useSetTenant();
  const setSessionToken = useSetRecoilState(SessionTokenAtom);
  // Use tenant prop directly to avoid delay from client-side store
  const tenantSiteTitle = tenant?.settings?.siteTitle || tenant?.name || null;

  // Set tenant data in store when component mounts
  useEffect(() => {
    if (tenant) {
      setTenant(tenant);
    }
  }, [tenant, setTenant]);

  // Set session token for authenticated saves
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken, setSessionToken]);

  if (data) {
    try {
      JSON.parse(data);
    } catch (e) {
      console.error(e);
      data = null;
    }
  } else {
    // Ensure data is null, not empty string, for Frame to use JSX children
    data = null;
  }
  const setUnsavedChanged = useSetRecoilState(UnsavedChangesAtom);

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
    Audio,
    Image,
    Embed,
    Divider,
    Spacer,
    SavedComponentLoader,
  };


  return (
    <div className="h-screen w-screen">
      <NextSeo
        title={`${result?.title || result?.domain || result?.subdomain || slug
          } - ${tenantSiteTitle || siteTitle}`}
        description={siteDescription}
        canonical={tenant?.domain ? `https://${tenant.domain}/` : tenant?.subdomain ? `https://${tenant.subdomain}.pagehub.dev/` : "https://pagehub.dev/"}
      />

      <ToolTipDialog />

      <Editor
        resolver={editorComponents}
        enabled={true}
        onRender={RenderNodeNewer}
        handlers={(store) => new CustomEventHandlers({
          store,
          isMultiSelectEnabled: () => false,
          removeHoverOnMouseleave: true
        })}
        indicator={{
          success: "currentColor",
          error: "rgb(153 27 27)",
          transition: "currentColor",
          thickness: 10,
        }}
        onNodesChange={debounce((query) => {
          setUnsavedChanged(query.serialize());
        }, 1000)}
      >
        <div
          className="flex flex-row w-full h-screen overflow-hidden fixed bg-gray-200"
          data-base={true}
        >
          <Toolbar />

          <ColorPickerDialog />
          <FontFamilyDialog />
          <IconDialogDialog />
          <PatternDialog />


          <Save result={result} />

          <Viewport>
            {data ? (
              <Frame data={data} />
            ) : (
              <Frame>
                <Element
                  canvas
                  type="background"
                  is={Background}
                  data-renderer={true}
                  custom={{ displayName: "Background" }}
                  pallet={[
                    { name: "Primary", color: "blue-500" },
                    { name: "Secondary", color: "purple-500" },
                    { name: "Accent", color: "orange-500" },
                    { name: "Neutral", color: "gray-500" },
                    { name: "Background", color: "white" },
                    { name: "Alternate Background", color: "gray-50" },
                    { name: "Text", color: "gray-900" },
                    { name: "Alternate Text", color: "gray-600" },
                  ]}
                  root={{

                  }}
                  mobile={{

                  }}
                  desktop={{}}
                >
                  {/* Global Header/Nav */}
                  <Element
                    canvas
                    is={Container}
                    canDelete={true}
                    canEditName={true}
                    root={{
                      background: "bg-palette:Background",
                    }}
                    mobile={{
                      display: "flex",
                      flexDirection: "flex-row",
                      justifyContent: "justify-between",
                      alignItems: "items-center",
                      width: "w-full",
                      px: "px-6",
                      py: "py-4",
                      gap: "gap-4",
                    }}
                    desktop={{
                      px: "px-12",
                    }}
                    custom={{ displayName: "Header" }}
                  >
                    <Element
                      is={Text}
                      canDelete={true}
                      canEditName={true}
                      root={{
                        color: "text-palette:Primary",
                      }}
                      mobile={{
                        fontSize: "text-2xl",
                        fontWeight: "font-bold",
                      }}
                      desktop={{}}
                      custom={{ displayName: "Logo" }}
                      text="<p>YourBrand</p>"
                    />
                    <Element
                      is={Button}
                      canDelete={true}
                      canEditName={true}
                      root={{
                        color: "text-palette:Alternate Text",
                      }}
                      mobile={{
                        fontSize: "text-sm",
                        gap: "gap-6",
                      }}
                      desktop={{}}
                      custom={{ displayName: "Nav Links" }}
                      buttons={[
                        { text: "About", url: "#" },
                        { text: "Services", url: "#" },
                        { text: "Contact", url: "#" },
                      ]}
                    />
                  </Element>

                  {/* Home Page Container */}
                  <Element
                    canvas
                    is={Container}
                    type="page"
                    canDelete={false}
                    canEditName={true}
                    isHomePage={true}
                    root={{}}
                    mobile={{
                      display: "flex",
                      flexDirection: "flex-col",
                      justifyContent: "justify-center",
                      alignItems: "items-center",
                      width: "w-full",
                      px: "px-6",
                      py: "py-12",
                      gap: "gap-6",
                    }}
                    desktop={{}}
                    custom={{ displayName: "Home Page" }}
                  >
                    <Element
                      canvas
                      is={Container}
                      canDelete={true}
                      canEditName={true}
                      root={{}}
                      mobile={{
                        display: "flex",
                        flexDirection: "flex-col",
                        alignItems: "items-center",
                        gap: "gap-32",
                        maxWidth: "max-w-4xl",
                        px: "px-6",
                        py: "py-12",

                      }}
                      desktop={{}}
                      custom={{ displayName: "Hero Content" }}
                    >
                      <Element
                        canvas
                        is={Container}
                        canDelete={true}
                        canEditName={true}
                        root={{}}
                        mobile={{
                          display: "flex",
                          flexDirection: "flex-col",
                          alignItems: "items-center",
                          gap: "gap-4",
                        }}
                        desktop={{}}
                        custom={{ displayName: "Hero Text" }}
                      >
                        <Element
                          is={Text}
                          canDelete={true}
                          canEditName={true}
                          root={{
                            color: "text-palette:Text",
                          }}
                          mobile={{
                            fontSize: "text-5xl",
                            fontWeight: "font-bold",
                            textAlign: "text-center",
                          }}
                          desktop={{
                            fontSize: "text-6xl",
                          }}
                          custom={{ displayName: "Hero Title" }}
                          text="<p>Welcome to Your New Website</p>"
                        />
                        <Element
                          is={Text}
                          canDelete={true}
                          canEditName={true}
                          root={{
                            color: "text-palette:Alternate Text",
                          }}
                          mobile={{
                            fontSize: "text-lg",
                            textAlign: "text-center",
                            maxWidth: "max-w-2xl",
                          }}
                          desktop={{}}
                          custom={{ displayName: "Hero Subtitle" }}
                          text="<p>Create beautiful pages with ease. Start building your dream website today.</p>"
                        />
                      </Element>
                      <Element
                        canvas
                        is={Container}
                        canDelete={true}
                        canEditName={true}
                        root={{}}
                        mobile={{
                          display: "flex",
                          flexDirection: "flex-col",
                          alignItems: "items-center",
                          gap: "gap-4",
                        }}
                        desktop={{
                          flexDirection: "flex-row",
                        }}
                        custom={{ displayName: "Hero Buttons" }}
                      >
                        <Element
                          is={Button}
                          canDelete={true}
                          canEditName={true}
                          root={{
                            radius: "rounded-lg",
                          }}
                          mobile={{
                            px: "px-8",
                            py: "py-4",
                            fontSize: "text-lg",
                            fontWeight: "font-semibold",
                            gap: "gap-4",
                          }}
                          desktop={{}}
                          custom={{ displayName: "CTA Buttons" }}
                          buttons={[
                            {
                              text: "Get Started",
                              url: "#",
                              background: "bg-palette:Primary",
                              color: "text-white",
                            },
                            {
                              text: "Learn More",
                              url: "#",
                              background: "bg-transparent",
                              color: "text-palette:Primary",
                            },
                          ]}
                        />
                      </Element>
                    </Element>

                  </Element>

                  {/* Global Footer */}
                  <Element
                    canvas
                    is={Container}
                    canDelete={true}
                    canEditName={true}
                    root={{
                      background: "bg-palette:Alternate Background",
                    }}
                    mobile={{
                      display: "flex",
                      flexDirection: "flex-col",
                      justifyContent: "justify-center",
                      alignItems: "items-center",
                      width: "w-full",
                      px: "px-6",
                      py: "py-8",
                      gap: "gap-4",
                    }}
                    desktop={{}}
                    custom={{ displayName: "Footer" }}
                  >
                    <Element
                      is={Text}
                      canDelete={true}
                      canEditName={true}
                      root={{
                        color: "text-palette:Alternate Text",
                      }}
                      mobile={{
                        fontSize: "text-sm",
                        textAlign: "text-center",
                      }}
                      desktop={{}}
                      custom={{ displayName: "Footer Text" }}
                      text="<p>© 2025 YourBrand. All rights reserved.</p>"
                    />
                  </Element>
                </Element>
              </Frame>
            )}
          </Viewport>
        </div>
      </Editor>
    </div>
  );
}

export async function getServerSideProps({ req, query }) {
  const host = req.headers.host;

  let data = "";
  let json = null;
  let result = null;
  let tenant = null;
  let sessionToken = null;

  // Extract token from query params (for auth)
  const incomingToken = query.token as string | undefined;

  // Check for data parameter in query string (fallback for direct URL usage)
  if (!data && query.data) {
    try {
      // Use the provided data directly (should be base64 encoded)
      data = query.data as string;
    } catch (e) {
      console.error("Error parsing data parameter:", e);
    }
  }

  // Load tenant by subdomain
  try {
    tenant = await loadTenantSettings(host);

    if (tenant) {
      // Check if tenant has onLoad webhook and call it directly
      if (!data) {
        const pageId = query?.slug?.length ? query.slug[0] : null;
        const webhookData = await runTenantWebhook(tenant, 'onLoad', {
          req,
          query,
          method: 'GET',
          pageId,
          token: incomingToken, // Pass the token to the webhook
        });

        if (webhookData?.document) {
          data = webhookData.document;
        }

        // Store the returned token for use in saves
        if (webhookData?.token) {
          sessionToken = webhookData.token;
        }
      }

      // Only use default template if no data parameter was provided and no webhook data
      if (!data) {
        // templates is an array, not an object, so we can't access templates["blank"]
        // Just leave data empty to use the JSX template in the Frame
        data = "";
      }
    }
  } catch (e) {
    console.error("Error loading tenant:", e);
  }

  // Handle slug-based content if provided (only if no data from webhook)
  if (query?.slug?.length && !data) {
    const slug = query.slug[0];

    // Handle regular templates and existing pages
    const template = Object.keys(templates).find(
      (_) => templates[_].href === slug
    );

    if (template) {
      data = templates[template].content;
    } else {
      const res = await fetch(
        `${process.env.API_ENDPOINT}/page/${slug}`
      );

      try {
        result = await res.json();
      } catch (e) {
        console.error(e);
      }

      if (result) {
        data = result.draft || result.content || "";
      }
    }
  }

  json = data ? lz.decompress(lz.decodeBase64(data)) : null;


  return {
    props: {
      subdomain: tenant?.subdomain || null,
      data: (json && json.trim()) ? lz.encodeBase64(lz.compress(json)) : null,
      slug: query?.slug?.length ? query.slug[0] : "",
      domain: process.env.DOMAIN,
      result,
      tenant,
      sessionToken: sessionToken || null, // Token for subsequent saves
    }, // will be passed to the page component as props
  };
}

export default App;