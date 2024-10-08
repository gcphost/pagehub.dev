// @ts-ignore
import Pattern from "../../models/patterns.model";
import dbConnect from "../../utils/dbConnect";

const patterns = [];

export default async function seed(req, res) {
  await dbConnect();

  if (patterns.length) {
    try {
      for (const pattern of patterns) {
        try {
          await Pattern.create(pattern);
          console.log(`Created pattern: ${pattern.title}`);
        } catch (error) {
          console.error(`Error creating pattern: ${pattern.title}`, error);
        }
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  return res.status(200).json({});
}
