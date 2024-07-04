const formidable = require("formidable");

export default async function handler(req, res) {
  const { formData, url, method = "POST" } = req.body;

  // return res.status(200).json({});

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formidable({ EMAIL: "gcphost@gcp12.com" }),
    });

    if (!response.ok) {
      console.error(await response.text());
      throw new Error("Failed to submit form");
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit form" });
  }
}
