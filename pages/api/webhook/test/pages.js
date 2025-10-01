// Test webhook for fetchPageList
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Test fetchPageList webhook called");
  console.log("Query params:", req.query);
  console.log("Headers:", req.headers);

  return res.status(200).json({
    pages: [
      'test-page-1',
      'test-page-2',
      'test-page-3',
      'example-domain',
      'demo-site',
    ],
    message: 'List of pages to compile',
    timestamp: new Date().toISOString(),
  });
}

