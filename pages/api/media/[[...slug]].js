// @ts-ignore
import Page from "../../../models/page";
import dbConnect from "../../../utils/dbConnect";

export default async function media(req, res) {
  await dbConnect();

  const [_id, mediaId] = req.query.slug;

  const named = await Page.findOne({
    $or: [{ draftId: _id }, { name: _id }, { _id: _id }],
  });

  if (named) {
    const image = named.media.find(
      (_) => _._id === mediaId.replace(".webp", "")
    );

    if (!image) return res.status(404).json({ first: true });

    const decoded = image.content
      .toString()
      .replace("data:image/webp;base64,", "");
    const imageResp = Buffer.from(decoded, "base64");

    res.writeHead(200, {
      "Content-Type": "image/webp",
      "Content-Length": imageResp.length,
    });

    return res.end(imageResp);
  }

  return res.status(404).json({ last: true });
}
