import { Configuration, OpenAIApi } from "openai";

const { AllStyles } = require("../../utils/tailwind");

// sanitize user input for normal search shit, limit

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function generate(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const search = req.body.search || "";
  if (search.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid search",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      // prompt: `input: tailwindcss class name for ${search} that is seperated by spaces, exclude the following ${req.body.existing.split(" ").join(", ")}`,
      prompt: `using tailwindcss version 3, I need a list of class names, seperated by a space, that would apply to this search term: "${search}", you can also list things that may be related to it, but if there is nothing thats a good match just return no response, and don't return partials, and make sure its an actual class name provided by tailwind css, and if its a class that has sizes, like space-x and i wasnt specific make sure you return it with all the sizes`,
      temperature: 0,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
      stop: ["input:"],
    });

    const reps = completion.data.choices[0].text.split(/\s+/).filter(item => item.trim() !== "");
    const cleanedArray = reps.filter(item => /^[a-zA-Z0-9-:]+$/.test(item));

    res.status(200).json({ result: cleanedArray, og: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
