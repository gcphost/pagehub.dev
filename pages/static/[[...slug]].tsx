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
import { useEffect, useState } from "react";
import { SettingsAtom } from "utils/atoms";
import dbConnect from "utils/dbConnect";
import { Button, OnlyButtons } from "../../components/selectors/Button";
import { Image } from "../../components/selectors/Image";
import { Video } from "../../components/selectors/Video";

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

  const Page = require("../../models/page");

  const named = await Page.findOne({ domain: params.slug[0] });

  if (named) {
    const {
      title = "",
      description = "",
      content,
      draft,
      name,
      draftId,
    } = named;
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
    };
  }
  return { props: {} };
}

export async function getStaticPaths() {
  await dbConnect();

  const Page = require("../../models/page");

  const domains = await Page.find({ domain: { $ne: null } });

  return {
    paths: domains.map((post) => ({
      params: {
        slug: [`${post.domain}`],
      },
    })),
    fallback: "blocking",
  };
}
export async function getServerSidePropsDep({ req, params }) {
  const host = req.headers.host.split(".");
  let subdomain = host[0];

  if (["localhost:3000", "pagehub"].includes(subdomain)) {
    subdomain = "";
  }

  let data = "";
  let meta = null;
  let seo = {};

  if (subdomain) {
    try {
      const res = await fetch(
        `${process.env.API_ENDPOINT}/page/${subdomain}/${
          params?.slug?.join("/") || ""
        }`
      );

      let result = null;

      try {
        result = await res.json();

        console.log({ result });
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
