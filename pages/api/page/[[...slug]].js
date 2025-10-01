import lz from "lzutf8";
// @ts-ignore
import { getServerSession } from "next-auth";
import Page from "../../../models/page";
import dbConnect from "../../../utils/dbConnect";
import { authOptions } from "../auth/[...nextauth]";
import { getDomain } from "../domain";

const sluggit = require("slug");

// sanitize inputs for lenghts

export const parseContent = (content, slug) => {
  let data = lz.decompress(lz.decodeBase64(content));
  let onlyPage;

  let da;

  const pageData = {};
  const seo = {};

  try {
    da = JSON.parse(data);
  } catch (e) { }

  if (!da) return { data: null, seo: null };

  Object.keys(da)
    .map((_) => {
      if (da[_]?.props?.type === "page") {
        const slug = sluggit(da[_]?.custom?.displayName, "-");
        pageData[slug] = { key: _, data: da[_], slug };
        return slug;
      }
    })
    .filter((_) => _);

  if (!slug?.length || slug?.length > 1) {
    const homePage = Object.keys(pageData).find(
      (_) => pageData[_].data?.props?.isHomePage === true
    );

    if (homePage) {
      onlyPage = homePage;
    }
  } else if (slug[0] === "index") {
    const homePage = Object.keys(pageData).find(
      (_) => pageData[_].data?.props?.isHomePage === true
    );

    if (homePage) {
      onlyPage = homePage;
    }
  } else {
    const aPage = Object.keys(pageData).find(
      (_) => pageData[_].slug === slug[0]
    );

    console.log('pd', pageData, slug[0])

    if (aPage) {
      onlyPage = aPage;
    }
  }

  if (onlyPage) {
    const k = pageData[onlyPage].key;
    const props = da[k];

    seo.title =
      props.props.pageTitle ||
      props.pageTitle ||
      props?.custom?.displayName ||
      null;
    seo.description =
      props.props.pageDescription || props.pageDescription || null;



    console.log('k', k)

    Object.keys(da).forEach((_) => {
      console.log('check', da[_]?.props?.type, _, k)
      if (da[_]?.props?.type === "page" && _ !== k) {
        da[_].props.isHidden = true;
        da[_].hidden = true;
      }
    });

    console.log("final", da)

    data = JSON.stringify(da);
    return { data: lz.encodeBase64(lz.compress(data)), seo };
  }
  console.error("404");
};

export default async function api(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  const [page, ...slug] = req.query.slug;

  if (page === "&") return res.status(200).json({});

  try {
    const pageByDomain = await Page.findOne({ domain: page });

    if (pageByDomain) {
      const { title, description, content, domain, name } = pageByDomain;
      const { data, seo } = parseContent(content, slug);
      return res.status(200).json({
        title,
        description,
        content: data,
        seo,
        domain,
        name,
      });
    }
  } catch (e) {
    return res.status(500).json(e);
  }

  try {
    const pageByName = await Page.findOne({ name: page });

    if (pageByName) {
      const { title, description, content, domain, name } = pageByName;
      const { data, seo } = parseContent(content, slug);
      return res.status(200).json({
        title,
        description,
        content: data,
        seo,
        domain,
        name,
      });
    }
  } catch (e) {
    return res.status(500).json(e);
  }

  try {
    const pageByDraftId = await Page.findOne({ draftId: page });

    if (pageByDraftId) {
      const { data, seo } = parseContent(pageByDraftId.draft, slug);

      return res.status(200).json({
        title: pageByDraftId.title,
        description: pageByDraftId.description,
        content: data,
        seo,
        draft: data,
        draftId: pageByDraftId.draftId,
        preview: true,
        name: pageByDraftId.name,
        domain: pageByDraftId.domain,
      });
    }
  } catch (e) {
    return res.status(500).json(e);
  }

  try {
    const pageById = await Page.findOne({ _id: page });

    if (!pageById) return res.status(404).json({});

    let data = null;

    if (pageById.domain) {
      data = await getDomain(pageById.domain);
    }
    pageById.submissions.reverse();

    return res.status(200).json({
      title: pageById.title || "",
      description: pageById.description || "",
      content: pageById.draft || "",
      _id: pageById._id,
      draftId: pageById.draftId || "",
      name: pageById.name || null,
      submissions: pageById.submissions || [],
      domain: pageById.domain || "",
      domainData: data || null,
      company: pageById.company || null,
      companyType: pageById.companyType || null,
      companyLocation: pageById.companyLocation || null,
    });
  } catch (e) {
    return res.status(500).json(e);
  }
}
