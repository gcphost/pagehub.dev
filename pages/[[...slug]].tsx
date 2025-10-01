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
import { useEffect, useState } from "react";
import { SettingsAtom } from "utils/atoms";
import { Button, OnlyButtons } from "../components/selectors/Button";
import { Image } from "../components/selectors/Image";
import { Video } from "../components/selectors/Video";
import Tenant from "../models/tenant.model";
import dbConnect from "../utils/dbConnect";

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

  const [favicon, setFavicon] = useState("/alt.ico");

  useEffect(() => {
    if (!subdomain) return;

    const link = document.querySelector("link[rel~='icon']") as any;
    if (link) {
      link.href = favicon;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = favicon;
      document.head.appendChild(newLink);
    }
  }, [favicon, subdomain]);

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

  // Strip port from host for tenant lookup
  const hostWithoutPort = host.split(':')[0];

  // Check if this is NOT pagehub.dev (i.e., it's a tenant domain)
  if (!hostWithoutPort.includes("pagehub.dev") && !hostWithoutPort.includes("localhost")) {
    try {
      await dbConnect();

      // Look up tenant by subdomain (treating the full host as subdomain)
      const tenant = await Tenant.findOne({ subdomain: hostWithoutPort });

      if (tenant) {
        // This is a tenant domain - redirect to editor
        return {
          redirect: {
            destination: `/build/${tenant._id}`,
            permanent: false,
          },
        };
      }
    } catch (e) {
      console.error("Error checking tenant:", e);
    }
  }

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
