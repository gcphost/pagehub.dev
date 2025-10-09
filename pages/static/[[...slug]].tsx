import { Editor, Frame, useEditor } from "@craftjs/core";
import lz from "lzutf8";

import { HomePage } from "components/home";
import { useSetRecoilState } from "recoil";

import { Background } from "components/selectors/Background";
import { Embed } from "components/selectors/Embed";

import { Container } from "components/selectors/Container";
import { Divider } from "components/selectors/Divider";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { OnlyText, Text } from "components/selectors/Text";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { parseContent } from "pages/api/page/[[...slug]]";
import { useEffect } from "react";
import { SettingsAtom } from "utils/atoms";
import dbConnect from "utils/dbConnect";
import { waitForFonts } from "utils/fontLoader";
import { loadTenantByDomain, runTenantWebhook } from "utils/tenantUtils";
import { Audio } from "../../components/selectors/Audio";
import { Button } from "../../components/selectors/Button";
import { ButtonList } from "../../components/selectors/ButtonList";
import { Footer } from "../../components/selectors/Footer";
import { Header } from "../../components/selectors/Header";
import { Image } from "../../components/selectors/Image";
import { ImageGallery } from "../../components/selectors/ImageGallery";
import { ImageList } from "../../components/selectors/ImageList";
import { Video } from "../../components/selectors/Video";
import Page from "../../models/page";
import Tenant from "../../models/tenant.model";

const CustomDeserializer = ({ data }) => {
  const { actions } = useEditor();
  useEffect(() => {
    try {
      if (data) {
        actions.deserialize(data);
      }
    } catch (error) {
      console.error("Failed to deserialize Craft.js data:", error);
      // Return empty frame if deserialization fails
    }
  }, [actions, data]);
  
  try {
    return <Frame data={data} />;
  } catch (error) {
    console.error("Failed to render Frame:", error);
    return <div>Error loading page content</div>;
  }
};

function App({ subdomain, data, meta, seo }) {
  const setSettings = useSetRecoilState(SettingsAtom);

  console.log("static");

  data = data ? lz.decompress(lz.decodeBase64(data)) : null;

  if (data) {
    try {
      JSON.parse(data);
    } catch (e) {
      console.error(e);
      data = null;
    }
  }

  const router = useRouter();

  // Preload fonts in background (non-blocking)
  useEffect(() => {
    if (!subdomain) return;

    // Just preload fonts, don't block rendering
    waitForFonts({
      timeout: 1000,
      onLoaded: () => {
        console.log('Fonts ready');
      }
    });
  }, [subdomain]);

  useEffect(() => {
    if (!subdomain) return;

    const handlePopstate = () => {
      router.push(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [router, subdomain]);

  useEffect(() => {
    if (!subdomain) return;
    console.log({ meta });
    setSettings(meta);
  }, [meta, setSettings, subdomain]);

  useEffect(() => {
    if (!subdomain) return;
    const path = window.location.hash;
    if (path && path.includes("#")) {
      setTimeout(() => {
        const id = path.replace("#", "");
        const el = document.getElementById(id);
        if (!el) return;

        const r = el.getBoundingClientRect();

        const root = document.querySelector('[data-root="true"]');

        if (root) {
          root?.scroll({
            top: r.top,
            behavior: "smooth",
          });
        }
      }, 600);
    }

    router.beforePopState(({ url, as, options }) => {
      const root = document.querySelector('[data-root="true"]');

      if (as === "/") {
        root?.scroll({
          top: 0,
          behavior: "smooth",
        });
      } else {
        const b = as.split("/");
        const c = b[1].replace("#", "");

        const el = document.getElementById(c);
        if (!el) return;

        const r = el.getBoundingClientRect();

        if (!r) return;

        setTimeout(() => {
          if (!root) return;
          root?.scroll({
            top: r.top,
            behavior: "smooth",
          });
        }, 600);
      }

      return true;
    });
  }, [router, subdomain]);

  if (subdomain) {
    if (!data) {
      return <div>404</div>;
    }

    const editorComponents = {
      Background,
      Container,
      Text,
      OnlyFormElement,
      OnlyText,
      Form,
      FormElement,
      FormDrop,
      Button,
      ButtonList,
      ImageGallery,
      ImageList,
      Video,
      Audio,
      Image,
      Embed,
      Divider,
      Header,
      Footer,
    };

    const {
      title = "",
      description = "",
      keywords,
      author,
      ogTitle,
      ogDescription,
      ogImage,
      ogType = 'website',
      twitterCard = 'summary_large_image',
      twitterSite,
      twitterCreator,
      canonicalUrl,
      robots,
      themeColor
    } = seo || {};

    // Build the full URL for canonical and OG
    const host = typeof window !== 'undefined' ? window.location.host : '';
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const fullUrl = `${protocol}//${host}${pathname}`;

    return (
      <>
        <NextSeo
          title={title || meta?.title || ""}
          description={description || meta?.description || ""}
          canonical={canonicalUrl || fullUrl}

          additionalMetaTags={[
            ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
            ...(author ? [{ name: 'author', content: author }] : []),
            ...(robots ? [{ name: 'robots', content: robots }] : []),
            ...(themeColor ? [{ name: 'theme-color', content: themeColor }] : []),
          ]}

          openGraph={{
            type: ogType,
            url: canonicalUrl || fullUrl,
            title: ogTitle || title || meta?.title || "",
            description: ogDescription || description || meta?.description || "",
            ...(ogImage && {
              images: [
                {
                  url: ogImage,
                  width: 1200,
                  height: 630,
                  alt: ogTitle || title || "",
                },
              ],
            }),
          }}

          twitter={{
            cardType: twitterCard,
            ...(twitterSite && { site: twitterSite }),
            ...(twitterCreator && { handle: twitterCreator }),
          }}
        />

        <Editor resolver={editorComponents} enabled={false}>
          <CustomDeserializer data={data} />
        </Editor>
      </>
    );
  }

  return <HomePage />;
}

export async function getStaticProps({ params }) {
  await dbConnect();

  // Check if this is a tenant subdomain
  const domain = params.slug[0];

  let pageData = null;

  // Skip webhook calls in dev mode for faster compilation
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    // Try to load tenant by domain to check for webhook
    const tenant = await loadTenantByDomain(domain);

    console.log({ tenant, domain });

    // If tenant has fetchPage webhook, use that
    if (tenant?.webhooks?.fetchPage) {
      try {
        const webhookResult = await runTenantWebhook(tenant, 'fetchPage', {
          method: 'GET',
          pageId: domain,
        });

        if (webhookResult) {
          pageData = webhookResult;
        }
      } catch (error) {
        console.error("Error calling fetchPage webhook:", error);
      }
    }
  }

  // Fall back to database query if no webhook or webhook failed
  if (!pageData) {
    const pageByDomain = await Page.findOne({ domain });
    if (pageByDomain) {
      pageData = {
        title: pageByDomain.title || "",
        description: pageByDomain.description || "",
        content: pageByDomain.content,
        draft: pageByDomain.draft,
        name: pageByDomain.name,
        draftId: pageByDomain.draftId,
      };
    }
  }

  if (pageData) {
    const {
      title = "",
      description = "",
      content,
      draft,
      name,
      draftId,
    } = pageData;
    
    let seo = null;
    try {
      seo = parseContent(content || draft, params.slug[0]);
    } catch (error) {
      console.error("Failed to parse content for page:", params.slug[0], error);
      // Return empty page if content parsing fails
      return {
        props: {
          subdomain: params.slug[0] || null,
          data: null,
          meta: {
            name: name || null,
            draftId,
            title: title || null,
            description: description || null,
            content: null,
            seo: null,
          },
          seo: null,
          slug: params.slug[0] || null,
        },
        revalidate: 60,
      };
    }

    return {
      props: {
        subdomain: params.slug[0] || null,
        data: content || draft || null,
        meta: {
          name: name || null,
          draftId,
          title: title || null,
          description: description || null,
          content: content || draft || null,
          seo,
        },
        seo,
        slug: params.slug[0] || null,
      },
      // Enable ISR - revalidate every 60 seconds
      revalidate: 60,
    };
  }
  return {
    props: {},
    // Enable ISR for 404 pages too
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  await dbConnect();

  let paths = [];

  // Only fetch webhook paths in production builds (skip in dev for speed)
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    // Try to get all tenants with fetchPageList webhook
    const tenants = await Tenant.find({ 'webhooks.fetchPageList': { $exists: true, $ne: null } });

    // Collect pages from webhooks
    for (const tenantDoc of tenants) {
      try {
        // Convert Mongoose document to plain object
        const tenant = tenantDoc.toObject ? tenantDoc.toObject() : tenantDoc;

        const webhookResult = await runTenantWebhook(tenant, 'fetchPageList', {
          method: 'GET',
        });

        if (webhookResult?.pages && Array.isArray(webhookResult.pages)) {
          const webhookPaths = webhookResult.pages
            .filter((domain) => domain !== 'oij') // Skip problematic page
            .map((domain) => ({
              params: {
                slug: [domain],
              },
            }));
          paths = [...paths, ...webhookPaths];
        }
      } catch (error) {
        console.error("Error calling fetchPageList webhook for tenant:", tenantDoc.subdomain, error);
      }
    }
  }

  // Add pages from database
  const pagesWithDomains = await Page.find({ domain: { $ne: null } });
  const dbPaths = pagesWithDomains
    .filter((page) => page.domain !== 'oij') // Skip problematic page
    .map((page) => ({
      params: {
        slug: [`${page.domain}`],
      },
    }));

  paths = [...paths, ...dbPaths];

  return {
    paths,
    fallback: "blocking",
  };
}


export default App;
