import { Configuration, OpenAIApi } from "openai";
const { AllStyles } = require('../../utils/tailwind')


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
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
      model: "curie:ft-personal-2023-01-31-00-33-14",
      prompt: `${search} `,
      temperature: 0,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: .5,
      presence_penalty: 0,
      stop: req.body.answer,
    });

    const repl = new RegExp(['output', "class", "Classes", "Output", "=", "Answer", ':'].join("|"), "gi");;

    const reps = completion?.data?.choices.length ? completion?.data?.choices[0].text.split(/\n| /).map(_ => _.replace(repl, "")).filter(_ => _) : []

    res.status(200).json({ result: reps, og: completion.data.choices[0].text });
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

