import { Editor, Element, Frame } from "@craftjs/core";
import { ColorPickerDialog } from "components/editor/Toolbar/Tools/ColorPickerDialog";
import { FontFamilyDialog } from "components/editor/Toolbar/Tools/FontFamilyDialog";
import { IconDialogDialog } from "components/editor/Toolbar/Tools/IconDialog";
import { PatternDialog } from "components/editor/Toolbar/Tools/PatternDialog";
import { ToolTipDialog } from "components/editor/Toolbar/Tools/TooltipDialog";
import { Background } from "components/selectors/Background";
import { Container } from "components/selectors/Container";
import { Divider } from "components/selectors/Divider";
import { Embed } from "components/selectors/Embed";
import { OnlyText, Text } from "components/selectors/Text";
import debounce from "lodash.debounce";
import lz from "lzutf8";
import { NextSeo } from "next-seo";
import { useSetRecoilState } from "recoil";
import { SessionTokenAtom } from "utils/atoms";
import { siteDescription, siteTitle } from "utils/lib";
import { templates } from "utils/templates";

import { RenderNodeNewer } from "components/editor/RenderNodeNewer";
import { Toolbar } from "components/editor/Toolbar";

import { UnsavedChangesAtom, Viewport } from "components/editor/Viewport";
import { SavedComponentLoader } from "components/editor/Viewport/Toolbox/savedComponents";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { useEffect } from "react";
import { Save } from "../../components/Save";
import { Button, OnlyButtons } from "../../components/selectors/Button";
import { Image } from "../../components/selectors/Image";
import { Video } from "../../components/selectors/Video";
import { useSetTenant } from "../../utils/tenantStore";
import { loadTenantSettings, runTenantWebhook } from "../../utils/tenantUtils";


function App({ data, slug, result, session, tenant, sessionToken }) {
  data = data ? lz.decompress(lz.decodeBase64(data)) : null;
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
    Image,
    Embed,
    Divider,
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
                    background: "bg-white",
                    color: "text-black",
                  }}
                  mobile={{
                    height: "h-full",
                    width: "w-screen",
                    display: "flex",
                    flexDirection: "flex-col",
                    overflow: "overflow-auto",
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
                      height: "h-screen",
                      overflow: "overflow-auto",
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