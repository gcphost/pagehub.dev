import { generateTailwindClasses } from "../../utils/openai";

export default async function generate(req, res) {
  const search = req.body.search || "";
  const existing = req.body.existing || "";

  if (search.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid search",
      },
    });
    return;
  }

  try {
    const result = await generateTailwindClasses(search, existing);

    if (!result.success) {
      res.status(500).json({
        error: {
          message: result.error || "An error occurred during your request.",
        },
      });
      return;
    }

    // Process the result for Tailwind classes
    const reps = result.content?.split(/\s+/) || [];
    const cleanedArray = reps.filter(item => item.trim() !== "" && /^[a-zA-Z0-9-:]+$/.test(item));

    res.status(200).json({
      result: cleanedArray,
      og: result.content
    });
  } catch (error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
