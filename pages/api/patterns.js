// @ts-ignore
import Pattern from "../../models/patterns.model";
import dbConnect from "../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const patterns = await Pattern.find();

    return res.status(200).json(patterns);
  } catch (e) {
    return res.status(500).json(e);
  }

  res.status(200).json({});
}
