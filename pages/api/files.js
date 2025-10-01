// @ts-ignore
import Page from "../../models/page";
import dbConnect from "../../utils/dbConnect";
import { uniqueNanoId } from "./save";

export default async function media(req, res) {
  await dbConnect();

  const { _id } = req.body;

  const page = await Page.findOne({ _id });

  if (!page) return res.status(404).json({});

  if (req.method === "DELETE") {
    return res.status(200).json({ _id: null, updated: false });
  }

  if (req.method === "POST") {
    if (req.body.media) {
      const media = page.media || [];

      if (media.length >= 10) {
        // return { error: "Media limit reached." };
      }

      if (req.body.mediaId) {
        try {
          const updated = await Page.updateOne(
            { "media._id": req.body.mediaId },
            { $set: { "media.$.content": req.body.media } },
            { $upsert: true }
          );

          return res.status(200).json({ _id: req.body.mediaId, updated });
        } catch (e) {
          return res.status(500).json(e);
        }
      }

      try {
        const ne = {
          _id: (await uniqueNanoId()).toLowerCase(),
          content: req.body.media,
        };
        media.push(ne);

        await page.save();

        return res.status(200).json({ _id: ne._id });
      } catch (e) {
        return res.status(500).json(e);
      }
    }
  }

  res.status(200).json({});
}
