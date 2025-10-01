import { getCdnAuthHeaders, getCdnUploadUrl } from "utils/cdn";

export default async function MediaGet(req, res) {
  try {
    const url = getCdnUploadUrl();
    const authHeaders = getCdnAuthHeaders();

    const options = {
      method: "POST",
      headers: {
        ...authHeaders,
        //  "Content-Type": "application/json",
      },
    };

    // options.body.append("requireSignedURLs", "true");
    // options.body.append("metadata", '{"key":"value"}');

    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
