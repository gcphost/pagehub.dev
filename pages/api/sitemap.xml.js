import Page from "../../models/page";
import dbConnect from "../../utils/dbConnect";

/**
 * Generate XML sitemap for published pages
 * Accessible at /api/sitemap.xml
 */
export default async function handler(req, res) {
  await dbConnect();

  try {
    // Fetch all published pages with domains
    const pages = await Page.find({
      domain: { $ne: null, $exists: true },
      content: { $ne: null, $exists: true },
    }).select('domain updatedAt');

    // Build sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
        .map((page) => {
          // Build the URL based on the domain
          const url = `https://${page.domain}`;
          const lastmod = page.updatedAt
            ? new Date(page.updatedAt).toISOString()
            : new Date().toISOString();

          return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
        .join('\n')}
</urlset>`;

    // Set headers for XML response
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200');

    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}

