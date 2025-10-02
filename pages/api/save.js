import { nanoid } from "nanoid";

// @ts-ignore
import User from "models/user.model";
import { getServerSession } from "next-auth";
import Page from "../../models/page";
import dbConnect from "../../utils/dbConnect";
import { loadTenantSettings, runTenantWebhook } from "../../utils/tenantUtils";
import { authOptions } from "./auth/[...nextauth]";
import { addDomain, deploy, getDomain, removeDomain } from "./domain";

const generate = require("boring-name-generator");

export async function uniqueNanoId(query = null) {
  const nanoId = nanoid();
  const existingPageByNanoId = await Page.findOne({ nano_id: nanoId });
  if (existingPageByNanoId) {
    return uniqueNanoId(query);
  }
  return nanoId;
}

export async function uniqueNameId(query = null) {
  const nanoId = generate().dashed;
  const existingPageByDraftId = await Page.findOne({ draftId: nanoId });
  if (existingPageByDraftId) {
    return uniqueNameId(query);
  }
  return nanoId;
}

// content draft are lzs..
// lets decompress and validate before saving..
// "title", 60 "description" 160 should be filtered for gaba, limited to wc3 standards
// add a char counter in settings..
// sanitize and limit name
// limit namme lenghts to prevent bs

const newPage = async (content, draft) => {
  const _id = (await uniqueNanoId()).toLowerCase();
  const draftId = (await uniqueNameId()).toLowerCase();

  const page = new Page({
    _id,
    content,
    draft,
    draftId,
    editable: true,
  });

  await page.save();

  return page;
};

const createPage = async (req) => {
  const { _id, content, draft, name, type } = req.body;

  if (_id && _id.length > 50) {
    return { error: "Id too long" };
  }

  if (!_id) return newPage(content, draft);

  const existingPage = await Page.findOne({ _id });

  if (!existingPage || !existingPage.editable) return newPage(content, draft);

  const domain = req.body.domain;
  const res = {};
  console.log("d", type, domain, existingPage.domain);

  if (type === "publish" && domain && domain !== existingPage.domain) {
    const existing = await getDomain(domain);
    console.log(existing);

    if (existing?.error?.code === "not_found") {
      await removeDomain(existingPage.domain);
      const add = await addDomain(domain);
      console.log("add", add);
      existingPage.domain = domain;
    } else {
      res.error = "Domain already exists";
    }
  }

  if (type === "publish" && !domain && existingPage.domain) {
    console.log("removing");
    await removeDomain(existingPage.domain);
    existingPage.domain = null;
  }

  if (type === "publish" && existingPage.domain) {
    await deploy();
  }

  [
    "content",
    "draft",
    "title",
    "description",
    "company",
    "companyType",
    "companyLocation",
  ].forEach((_) => {
    const value = req.body[_];

    if (["content", "draft", "title", "description"].includes(_)) {
      if (!value) return;
    }

    if (value) {
      if (_ === "title" && value.length > 60) {
        return { error: "Title limit 60." };
      }

      if (_ === "description" && value.length > 160) {
        return { error: "Description limit 60." };
      }
    }

    existingPage[_] = value;
  });

  if (name && name !== existingPage.name) {
    if (name.length > 50) {
      return { error: "Name limit 50" };
    }
    const pageByName = await Page.findOne({ name });
    if (!pageByName) existingPage.name = name;
  }

  await existingPage.save();

  const savedPage = await Page.findOne({ _id });
  return { ...savedPage._doc, ...res };
};

export default async function api(req, res) {
  await dbConnect();

  try {
    // Get tenant from subdomain
    const tenant = await loadTenantSettings(req.headers.host);

    // Check if tenant has onSave webhook
    if (tenant?.webhooks?.onSave) {
      console.log("Tenant has onSave webhook, calling instead of internal save");

      const { _id, content, draft, sessionToken } = req.body;
      const document = content || draft;
      const isDraft = !!draft;

      // Extract token from body or header
      const token = sessionToken || req.headers['x-pagehub-token'];

      console.log("Save request body:", {
        _id: _id,
        hasContent: !!content,
        hasDraft: !!draft,
        hasToken: !!token,
        bodyKeys: Object.keys(req.body)
      });

      // Try to extract pageId from referer if _id is not available
      let pageId = _id;
      if (!pageId && req.headers.referer) {
        const refererMatch = req.headers.referer.match(/\/build\/([^\/\?]+)/);
        if (refererMatch) {
          pageId = refererMatch[1];
          console.log("Extracted pageId from referer:", pageId);
        }
      }

      const webhookResult = await runTenantWebhook(tenant, 'onSave', {
        req,
        query: req.query,
        method: 'POST',
        body: {
          tenantId: tenant._id,
          pageId: pageId,
          document: document,
          isDraft: isDraft,
          settings: req.body,
          timestamp: new Date().toISOString(),
        },
        pageId,
        token, // Pass the token to the webhook
      });

      if (webhookResult) {
        return res.status(200).json(webhookResult);
      } else {
        console.error("Tenant webhook failed, returning error");
        return res.status(500).json({ error: "Save failed - tenant webhook error" });
      }
    }

    // Only use internal save for non-tenant requests
    const page = await createPage(req);
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      const _page = await Page.findOne({ _id: page._id });
      const user = await User.findOne({ email: session.user.email });

      if (user) {
        const existingUser = page.users.includes(user._id);

        if (!existingUser) {
          _page.users.push(user._id);
          await _page.save();
        }

        const existingPageUser = user.pages.includes(_page._id);
        console.log({ existingPageUser });
        if (!existingPageUser) {
          user.pages.push(_page._id);
          await user.save();
        }
      }
    }

    return res.status(200).json(page);
  } catch (e) {
    return res.status(500).json(e);
  }
}
