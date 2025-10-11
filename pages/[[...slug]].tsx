import { Editor, Frame, useEditor } from "@craftjs/core";
import lz from "lzutf8";

import { HomePage } from "components/home";
import { useSetRecoilState } from "recoil";

import { Background } from "components/selectors/Background";
import { Embed } from "components/selectors/Embed";

import { Container } from "components/selectors/Container";
import { ContainerGroup } from "components/selectors/ContainerGroup";
import { Divider } from "components/selectors/Divider";
import { Form, FormDrop } from "components/selectors/Form";
import { FormElement, OnlyFormElement } from "components/selectors/FormElement";
import { RenderGradient, RenderPattern } from "components/selectors/lib";
import { OnlyText, Text } from "components/selectors/Text";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SettingsAtom } from "utils/atoms";
import { waitForFonts } from "utils/fontLoader";
import { Audio } from "../components/selectors/Audio";
import { Button } from "../components/selectors/Button";
import { ButtonList } from "../components/selectors/ButtonList";
import { Footer } from "../components/selectors/Footer";
import { Header } from "../components/selectors/Header";
import { Image } from "../components/selectors/Image";
import { ImageGallery } from "../components/selectors/ImageGallery";
import { ImageList } from "../components/selectors/ImageList";
import { Video } from "../components/selectors/Video";
import dbConnect from "../utils/dbConnect";
import { loadTenantByDomain, loadTenantSettings } from "../utils/tenantUtils";

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

  console.log("app");

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
        console.log("Fonts ready");
      },
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
      ContainerGroup,
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
      RenderPattern,
      RenderGradient,
    };

    const {
      title = "",
      description = "",
      keywords,
      author,
      ogTitle,
      ogDescription,
      ogImage,
      ogType = "website",
      twitterCard = "summary_large_image",
      twitterSite,
      twitterCreator,
      canonicalUrl,
      robots,
      themeColor,
    } = seo || {};

    // Build the full URL for canonical and OG
    const host = typeof window !== "undefined" ? window.location.host : "";
    const protocol =
      typeof window !== "undefined" ? window.location.protocol : "https:";
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "";
    const fullUrl = `${protocol}//${host}${pathname}`;

    return (
      <>
        <NextSeo
          title={title || meta?.title || ""}
          description={description || meta?.description || ""}
          canonical={canonicalUrl || fullUrl}
          additionalMetaTags={[
            ...(keywords ? [{ name: "keywords", content: keywords }] : []),
            ...(author ? [{ name: "author", content: author }] : []),
            ...(robots ? [{ name: "robots", content: robots }] : []),
            ...(themeColor
              ? [{ name: "theme-color", content: themeColor }]
              : []),
          ]}
          openGraph={{
            type: ogType,
            url: canonicalUrl || fullUrl,
            title: ogTitle || title || meta?.title || "",
            description:
              ogDescription || description || meta?.description || "",
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

export async function getServerSideProps({ req, res, params }) {
  const host = req.headers.host;

  // Check if this is a tenant subdomain or custom domain - if so, don't show PageHub brand
  const tenantBySubdomain = await loadTenantSettings(host);
  const tenantByDomain = await loadTenantByDomain(host.split(":")[0]); // Remove port for domain lookup

  if (tenantBySubdomain || tenantByDomain) {
    return {
      notFound: true, // Return 404 for tenant domains - they should use /static routes
    };
  }

  // Strip port from host for tenant lookup
  const hostParts = host.split(".");
  let subdomain = hostParts[0];

  if (["localhost:3000", "pagehub"].includes(subdomain)) {
    subdomain = "";
  }

  let data = "";
  let meta = null;
  let seo = {};

  if (subdomain) {
    try {
      await dbConnect();

      const apiRes = await fetch(
        `${process.env.API_ENDPOINT}/page/${subdomain}/${
          params?.slug?.join("/") || ""
        }`,
      );

      let result = null;

      try {
        result = await apiRes.json();
      } catch (e) {
        console.error(e);
      }

      seo = result.seo || {};

      if (result && (result.content || result.draft)) {
        data = result.preview ? result.draft : result.content;
      }

      meta = result || {};
    } catch (e) {
      console.error(e);
    }
  }

  // Set cache headers to enable bfcache (back/forward cache)
  // Cache for 60 seconds, allow stale content for 300 seconds while revalidating
  res.setHeader(
    "Cache-Control",
    "public, max-age=60, stale-while-revalidate=300",
  );

  return {
    props: {
      subdomain,
      data,
      meta,
      seo,
      slug: params.slug || null,
    },
  };
}

export default App;
