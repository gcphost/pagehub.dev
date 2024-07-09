// @ts-ignore
import Pattern from "../../models/patterns.model";
import User from "../../models/user.model";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (session) {
      const user = await User.findOne({ email: session.user.email }).populate({
        path: "pages",
        select: "_id title domain subdomain draftId",
      });

      if (user) {
        pages = user.pages || [];
      }
    }

    const patterns = await Pattern.find();

    return res.status(200).json(patterns);
  } catch (e) {
    return res.status(500).json(e);
  }

  res.status(200).json({});
}
