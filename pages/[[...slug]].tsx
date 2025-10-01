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
import { useEffect } from "react";
import { SettingsAtom } from "utils/atoms";
import { Button, OnlyButtons } from "../components/selectors/Button";
import { Image } from "../components/selectors/Image";
import { Video } from "../components/selectors/Video";
import dbConnect from "../utils/dbConnect";
import { loadTenantByDomain, loadTenantSettings } from "../utils/tenantUtils";

const CustomDeserializer = ({ data }) => {
  const { actions } = useEditor();
  useEffect(() => {
    actions.deserialize(data);
  }, [actions, data]);
  return <Frame data={data} />;
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

    const { title, descripton } = seo;

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

export async function getServerSideProps({ req, params }) {
  const host = req.headers.host;

  // Check if this is a tenant subdomain or custom domain - if so, don't show PageHub brand
  const tenantBySubdomain = await loadTenantSettings(host);
  const tenantByDomain = await loadTenantByDomain(host.split(':')[0]); // Remove port for domain lookup

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

      const res = await fetch(
        `${process.env.API_ENDPOINT}/page/${subdomain}/${params?.slug?.join("/") || ""
        }`
      );

      let result = null;

      try {
        result = await res.json();
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
