export default async (req, res) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      //  "Content-Type": "application/json",
    },
  };

  // options.body.append("requireSignedURLs", "true");
  // options.body.append("metadata", '{"key":"value"}');

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
