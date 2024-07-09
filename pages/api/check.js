// @ts-ignore
import Page from '../../models/page';
import dbConnect from '../../utils/dbConnect';

export default async function check(req, res) {
  await dbConnect();

  const { name } = req.body;

  // sanitize user input for normal search shit, limit
  // maybe slugify

  try {
    const named = await Page.findOne({ $or: [{ name }, { draftId: name }] });

    if (named) {
      const {
        title, description, content, name
      } = named;
      return res.status(200).json({
        name, title, description, content
      });
    }
  } catch (e) {
    return res.status(500).json(e);
  }

  res.status(200).json({});
}
