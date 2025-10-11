import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filePath = path.join(process.cwd(), "openapi.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const openApiSpec = JSON.parse(fileContents);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(openApiSpec);
  } catch (error) {
    console.error("Error reading OpenAPI spec:", error);
    res.status(500).json({ error: "Failed to load OpenAPI specification" });
  }
}
