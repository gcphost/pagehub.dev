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
import { Button, OnlyButtons } from "../../components/selectors/Button";
import { Image } from "../../components/selectors/Image";
import { Video } from "../../components/selectors/Video";
import Page from "../../models/page";
import Tenant from "../../models/tenant.model";

const CustomDeserializer = ({ data }) => {
  const { actions } = useEditor();
  useEffect(() => {
    actions.deserialize(data);
  }, [actions, data]);
  return <Frame data={data} />;
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
      OnlyButtons,
      Button,
      Video,
      Image,
      Embed,
      Divider,
    };

    const { title, descripton } = seo || { title: "", descripton: "" };

    return (
      <>
        <NextSeo
          title={`${title} ${meta?.title || ""}`}
          description={`${descripton || meta.description || ""}`}
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
    const { seo } = parseContent(content || draft, params.slug[0]);

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
          const webhookPaths = webhookResult.pages.map((domain) => ({
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
  const dbPaths = pagesWithDomains.map((page) => ({
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
