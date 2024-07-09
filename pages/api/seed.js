// @ts-ignore
// import patterns from '../../../patterns';
import Pattern from '../../models/patterns.model';
import dbConnect from '../../utils/dbConnect';

const patterns = [];

export default async function seed(req, res) {
  await dbConnect();

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

  res.status(200).json({});
}
