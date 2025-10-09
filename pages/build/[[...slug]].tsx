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
import { DEFAULT_PALETTE, DEFAULT_STYLE_GUIDE } from "utils/defaults";
import { siteDescription, siteTitle } from "utils/lib";
import { templates } from "utils/templates";

// Custom template data - set to null to use default JSX template
let CUSTOM_TEMPLATE_DATA = "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"

CUSTOM_TEMPLATE_DATA = ''

import { RenderNodeNewer } from "components/editor/RenderNodeNewer";
import { Toolbar } from "components/editor/Toolbar";

import { UnsavedChangesAtom, Viewport } from "components/editor/Viewport";
import { SavedComponentLoader } from "components/editor/Viewport/Toolbox/savedComponents";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { useEffect } from "react";
import { Save } from "../../components/Save";
import { Audio } from "../../components/selectors/Audio";
import { Button } from "../../components/selectors/Button";
import { ButtonList } from "../../components/selectors/ButtonList";
import { Footer } from "../../components/selectors/Footer";
import { Header } from "../../components/selectors/Header";
import { Image } from "../../components/selectors/Image";
import { ImageGallery } from "../../components/selectors/ImageGallery";
import { ImageList } from "../../components/selectors/ImageList";
import { Video } from "../../components/selectors/Video";
import { useSetTenant } from "../../utils/tenantStore";
import { loadTenantSettings, runTenantWebhook } from "../../utils/tenantUtils";


function App({ data, slug, result, session, tenant, sessionToken }) {
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
    Button,
    ButtonList,
    ImageGallery,
    ImageList,
    Video,
    Audio,
    Image,
    Embed,
    Divider,
    Spacer,
    Header,
    Footer,
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
                  pallet={DEFAULT_PALETTE}
                  styleGuide={DEFAULT_STYLE_GUIDE}
                  root={{
                    background: "bg-[var(--ph-background)]",
                    color: "text-[var(--ph-text)]",
                    fontFamily: "var(--ph-body-font-family)",
                  }}
                  mobile={{
                    fontWeight: "font-[var(--ph-body-font)]",
                  }}
                  desktop={{}}
                >
                  {/* Global Header/Nav */}
                  <Element
                    canvas
                    is={Header}
                    type="header"
                    canDelete={false}
                    canEditName={false}
                  >
                    <Element
                      canvas
                      is={Container}
                      canDelete={true}
                      canEditName={true}
                      root={{
                        background: "bg-[var(--ph-background)]",
                        color: "text-[var(--ph-text)]",
                      }}
                      mobile={{
                        display: "flex",
                        flexDirection: "flex-row",
                        justifyContent: "justify-between",
                        alignItems: "items-center",
                        width: "w-full",
                        gap: "gap-4",
                        p: "p-[var(--ph-container-padding)]",
                      }}
                      desktop={{

                      }}
                      custom={{ displayName: "Header Content" }}
                    >
                      <Element
                        is={Text}
                        canDelete={true}
                        canEditName={true}
                        root={{
                          color: "text-[var(--ph-primary)]",

                        }}
                        mobile={{
                          fontSize: "text-2xl",
                          fontWeight: "font-[var(--ph-heading-font)]",
                        }}
                        desktop={{}}
                        custom={{ displayName: "Logo" }}
                        text="<p>{{company.name}}</p>"
                      />

                      [menu..]

                    </Element>
                  </Element>

                  {/* Home Page Container */}
                  <Element
                    canvas
                    is={Container}
                    type="page"
                    canDelete={false}
                    canEditName={true}
                    isHomePage={true}
                    root={{
                      background: "bg-[var(--ph-background)]",
                      color: "text-[var(--ph-text)]",
                    }}
                    mobile={{
                      display: "flex",
                      flexDirection: "flex-col",
                      justifyContent: "justify-center",
                      alignItems: "items-center",
                      width: "w-full",
                      gap: "gap-[var(--ph-section-gap)]",
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
                        justifyContent: "justify-center",
                        width: "w-full",
                        minHeight: "min-h-screen",
                      }}
                      desktop={{}}
                      custom={{ displayName: "Hero Section" }}
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
                          gap: "gap-[var(--ph-section-gap)]",
                          maxWidth: "max-w-[var(--ph-content-width)]",
                          p: "p-[var(--ph-container-padding)]",
                        }}
                        desktop={{

                        }}
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
                            gap: "gap-[var(--ph-container-gap)]",
                          }}
                          desktop={{}}
                          custom={{ displayName: "Hero Text" }}
                        >
                          <Element
                            is={Text}
                            canDelete={true}
                            canEditName={true}
                            root={{

                            }}
                            mobile={{
                              fontSize: "text-5xl",
                              fontWeight: "font-[var(--ph-heading-font)]",
                              textAlign: "text-center",
                            }}
                            desktop={{
                              fontSize: "text-6xl",
                            }}
                            custom={{ displayName: "Hero Title" }}
                            text="<p>Welcome to {{company.name}}</p>"
                          />
                          <Element
                            is={Text}
                            canDelete={true}
                            canEditName={true}
                            root={{
                            }}
                            mobile={{
                              fontSize: "text-lg",
                              textAlign: "text-center",
                              maxWidth: "max-w-2xl",
                            }}
                            desktop={{}}
                            custom={{ displayName: "Hero Subtitle" }}
                            text="<p>Professional {{company.type}} services in {{company.location}}</p>"
                          />
                        </Element>

                        <Element
                          canvas
                          is={ButtonList}
                          canDelete={true}
                          canEditName={true}
                          root={{

                          }}
                          mobile={{
                            display: "flex",
                            gap: "gap-[var(--ph-container-gap)]",
                            flexDirection: "flex-col",
                            width: "w-full",
                            justifyContent: "justify-center",
                            alignItems: "items-center",
                            fontSize: "text-lg",
                          }}
                          desktop={{ flexDirection: "flex-row", }}
                          custom={{ displayName: "Hero Buttons" }}
                        >
                          <Element
                            is={Button}
                            canDelete={true}
                            canEditName={true}
                            root={{
                              background: "bg-[var(--ph-primary)]",
                              color: "text-white",
                              radius: "rounded-[var(--ph-border-radius)]",
                              shadow: "shadow-[var(--ph-shadow-style)]",

                            }}
                            mobile={{
                              p: "p-[var(--ph-button-padding)]",
                              fontWeight: "font-[var(--ph-heading-font)]",
                              textAlign: "text-center",
                              display: "flex",
                              justifyContent: "justify-center",
                              alignItems: "items-center",
                              gap: "gap-4",
                            }}
                            custom={{ displayName: "Get Started Button" }}
                            text="Get Started"
                            url="#"
                          />
                          <Element
                            is={Button}
                            canDelete={true}
                            canEditName={true}
                            root={{
                              background: "bg-transparent",
                              color: "text-[var(--ph-primary)]",
                              radius: "rounded-[var(--ph-border-radius)]",
                              border: "border",
                              borderColor: "border-[var(--ph-primary)]",

                            }}
                            mobile={{
                              p: "p-[var(--ph-button-padding)]",
                              fontWeight: "font-[var(--ph-heading-font)]",
                              textAlign: "text-center",
                              display: "flex",
                              justifyContent: "justify-center",
                              alignItems: "items-center",
                              gap: "gap-4",
                            }}
                            custom={{ displayName: "Learn More Button" }}
                            text="Learn More"
                            url="#"
                          />
                        </Element>
                      </Element>

                    </Element>
                  </Element>

                  {/* Global Footer */}
                  <Element
                    canvas
                    is={Footer}
                    type="footer"
                    canDelete={false}
                    canEditName={false}
                  >
                    <Element
                      canvas
                      is={Container}
                      canDelete={true}
                      canEditName={true}
                      root={{
                        background: "bg-[var(--ph-alternate-background)]",
                      }}
                      mobile={{
                        display: "flex",
                        flexDirection: "flex-col",
                        justifyContent: "justify-center",
                        alignItems: "items-center",
                        width: "w-full",
                        p: "p-[var(--ph-container-padding)]",
                        gap: "gap-[var(--ph-container-gap)]",
                      }}
                      desktop={{}}
                      custom={{ displayName: "Footer Content" }}
                    >
                      <Element
                        is={Text}
                        canDelete={true}
                        canEditName={true}
                        root={{
                          color: "text-[var(--ph-alternate-text)]",
                        }}
                        mobile={{
                          fontSize: "text-sm",
                          textAlign: "text-center",
                        }}
                        desktop={{}}
                        custom={{ displayName: "Footer Text" }}
                        text="<p>© {{year}} {{company.name}} All rights reserved.</p>"
                      />
                    </Element>
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