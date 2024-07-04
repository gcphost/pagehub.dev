import { nanoid } from "nanoid";
import { authOptions } from "./auth/[...nextauth]";


// @ts-ignore
import User from "models/user.model";
import { getServerSession } from "next-auth";
import Page from "../../models/page";
import dbConnect from "../../utils/dbConnect";
import { addDomain, deploy, getDomain, removeDomain } from "./domain";
var generate = require("project-name-generator");

export async function uniqueNanoId(query = null) {
  const nanoId = nanoid();
  const sameNanoId = await Page.findOne({ nano_id: nanoId });
  if (sameNanoId) {
    return uniqueNanoId(query);
  }
  return nanoId;
}

export async function uniqueNameId(query = null) {
  const nanoId = generate().dashed;
  const sameNanoId = await Page.findOne({ draftId: nanoId });
  if (sameNanoId) {
    return uniqueNameId(query);
  }
  return nanoId;
}

//content draft are lzs..
// lets decompress and validate before saving..
// "title", 60 "description" 160 should be filtered for gaba, limited to wc3 standards
// add a char counter in settings..
// sanitize and limit name
//limit namme lenghts to prevent bs

const newPage = async (content, draft) => {
  const _id = (await uniqueNanoId()).toLowerCase();
  const draftId = (await uniqueNameId()).toLowerCase();

  const page = new Page({ _id, content, draft, draftId, editable: true });

  await page.save();

  return page;
};

const createPage = async (req) => {
  let { _id, content, draft, name, type } = req.body;

  if (_id && _id.length > 50) {
    return { error: "Id too long" };
  }

  if (!_id) return newPage(content, draft);

  const found = await Page.findOne({ _id });

  if (!found || !found.editable) return newPage(content, draft);

  const domain = req.body["domain"];
  const res = {};
  console.log('d', type, domain, found.domain);

  if (type === "publish" && domain && domain !== found.domain) {
    const existing = await getDomain(domain);
    console.log(existing);

    if (existing?.error?.code === "not_found") {
      await removeDomain(found.domain);
      const add = await addDomain(domain);
      console.log('add', add)
      found.domain = domain;
    } else {
      res.error = "Domain already exists";
    }
  }

  if (type === "publish" && !domain && found.domain) {
    console.log('removing')
    await removeDomain(found.domain);
    found.domain = null;
  }

  if (type === "publish" && found.domain) {
    await deploy()
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

    found[_] = value;
  });

  if (name && name !== found.name) {
    if (name.length > 50) {
      return { error: "Name limit 50" };
    }
    const foundName = await Page.findOne({ name });
    if (!foundName) found.name = name;
  }

  await found.save();

  const page = await Page.findOne({ _id });
  return { ...page._doc, ...res };
};

export default async function api(req, res) {
  await dbConnect();


  try {
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
        console.log({ existingPageUser })
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
