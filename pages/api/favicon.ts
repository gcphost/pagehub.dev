import lz from "lzutf8";
import { NextApiRequest, NextApiResponse } from "next";
import Page from "../../models/page";
import dbConnect from "../../utils/dbConnect";
import { loadTenantSettings, runTenantWebhook } from "../../utils/tenantUtils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await dbConnect();

    const host = req.headers.host;

    if (!host) {
      console.log("No host header, using default favicon");
      res.status(302).setHeader("Location", "/default.ico").end();
      return;
    }

    // Check if this is bare pagehub domain (no subdomain, any TLD)
    const hostWithoutPort = host.split(":")[0];
    const parts = hostWithoutPort.split(".");
    // Check if it's pagehub.{tld} or www.pagehub.{tld}
    const isBarePagehub =
      (parts.length === 2 && parts[0] === "pagehub") || // pagehub.com, pagehub.dev
      (parts.length === 3 && parts[0] === "www" && parts[1] === "pagehub"); // www.pagehub.com

    // Check for tenant by subdomain or domain
    const tenant = await loadTenantSettings(host);

    if (!tenant) {
      // Only use default for bare pagehub domain, otherwise 404
      if (isBarePagehub) {
        res.status(302).setHeader("Location", "/default.ico").end();
      } else {
        res.status(404).end();
      }
      return;
    }

    // Get the page data
    let data = null;

    // Check if tenant has onLoad webhook
    if (tenant?.webhooks?.onLoad) {
      const webhookData = await runTenantWebhook(tenant, "onLoad", {
        req,
        query: req.query,
        method: "GET",
        pageId: null, // Homepage
      });

      if (webhookData?.document) {
        data = webhookData.document;
      }
    }

    // If no webhook data, try to load from database
    if (!data && tenant?.subdomain) {
      const page = await Page.findOne({ name: tenant.subdomain });
      if (page) {
        data = page.content || page.draft;
      }
    }

    // Parse the page data to get the favicon
    if (data) {
      try {
        const decompressed = lz.decompress(lz.decodeBase64(data));
        const pageData = JSON.parse(decompressed);
        const rootNode = pageData?.ROOT;

        if (rootNode?.props?.ico) {
          const { ico, icoType, icoContent } = rootNode.props;

          // Handle different icon types
          if (icoType === "img" && ico) {
            // Direct URL
            res.status(302).setHeader("Location", ico).end();
            return;
          } else if (icoType === "cdn" && ico) {
            // CDN URL
            const { getCdnUrl } = require("../../utils/cdn");
            res.status(302).setHeader("Location", getCdnUrl(ico)).end();
            return;
          } else if (icoContent) {
            // Base64 or direct content
            // Determine content type
            const contentType = ico?.endsWith(".png")
              ? "image/png"
              : ico?.endsWith(".gif")
                ? "image/gif"
                : "image/x-icon";

            // If it's a data URL, extract the base64
            if (icoContent.startsWith("data:")) {
              const [header, base64] = icoContent.split(",");
              const buffer = Buffer.from(base64, "base64");
              res.setHeader("Content-Type", contentType);
              res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable",
              );
              res.send(buffer);
              return;
            } else {
              // Assume it's already base64
              const buffer = Buffer.from(icoContent, "base64");
              res.setHeader("Content-Type", contentType);
              res.setHeader(
                "Cache-Control",
                "public, max-age=31536000, immutable",
              );
              res.send(buffer);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error parsing favicon from page data:", e);
      }
    }

    // No custom favicon found
    res.status(404).end();
  } catch (e) {
    console.error("Error in favicon route:", e);
    console.error("Error stack:", e instanceof Error ? e.stack : e);
    res.status(404).end();
  }
}
