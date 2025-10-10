import { improveCopywriting } from "../../utils/openai";

export default async function improveText(req, res) {
  const text = req.body.text || "";
  const customPrompt = req.body.customPrompt;
  const styleTags = req.body.styleTags;

  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Text cannot be empty",
      },
    });
    return;
  }

  try {
    const result = await improveCopywriting(text, customPrompt, styleTags);

    if (!result.success) {
      res.status(500).json({
        error: {
          message: result.error || "An error occurred during your request.",
        },
      });
      return;
    }

    res.status(200).json({
      result: result.content,
      success: true
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
