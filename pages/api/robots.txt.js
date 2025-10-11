export default async function handler(req, res) {
  const host = req.headers.host;
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");

  res.write("User-agent: *\n");
  res.write("Allow: /\n");
  res.write("\n");
  res.write(`Sitemap: ${baseUrl}/sitemap.xml\n`);
  res.end();
}
