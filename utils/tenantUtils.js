import Tenant from "../models/tenant.model";
import dbConnect from "./dbConnect";

export const extractSubdomain = (host) => {
  let subdomain = "";

  if (host.includes(":")) {
    const hostWithoutPort = host.split(":")[0];
    const parts = hostWithoutPort.split(".");
    subdomain = parts.length >= 3 ? parts[0] : "";
  } else {
    const parts = host.split(".");
    subdomain = parts.length >= 3 ? parts[0] : "";
  }

  return subdomain;
};

export const getTenantBySubdomain = async (host) => {
  const subdomain = extractSubdomain(host);

  if (["localhost:3000", "pagehub"].includes(subdomain)) {
    return null;
  }

  if (!subdomain) {
    return null;
  }

  return await Tenant.findOne({ subdomain: subdomain });
};

/**
 * Load tenant settings by subdomain or host
 * @param {string} subdomain - The subdomain or full host to load tenant for
 * @returns {Object|null} Serialized tenant object or null if not found
 */
export const loadTenantSettings = async (subdomain) => {
  try {
    await dbConnect();

    // If subdomain looks like a host (contains dots or colons), extract the subdomain
    const cleanSubdomain = subdomain.includes('.') || subdomain.includes(':')
      ? extractSubdomain(subdomain)
      : subdomain;

    // Also get the full domain without port for domain field lookup
    const fullDomain = subdomain.includes(':') ? subdomain.split(':')[0] : subdomain;

    if (["localhost:3000", "pagehub", "localhost"].includes(cleanSubdomain)) {
      return null;
    }

    console.log({ cleanSubdomain, fullDomain });

    // Check both subdomain field and domain field (for editor custom domains)
    let tenant = await Tenant.findOne({
      $or: [
        { domains: fullDomain },
        { domain: fullDomain }
      ]
    });

    if (!tenant) {
      return null;
    }

    // Convert Mongoose document to plain object for serialization
    tenant = tenant.toObject();

    // Convert non-serializable fields to strings for JSON serialization
    if (tenant._id) {
      tenant._id = tenant._id.toString();
    }
    if (tenant.createdAt) {
      tenant.createdAt = tenant.createdAt.toISOString();
    }
    if (tenant.updatedAt) {
      tenant.updatedAt = tenant.updatedAt.toISOString();
    }

    return tenant;
  } catch (error) {
    console.error("Error loading tenant settings:", error);
    return null;
  }
};

/**
 * Load tenant settings by custom domain (for static sites)
 * @param {string} domain - The custom domain to load tenant for
 * @returns {Object|null} Serialized tenant object or null if not found
 */
export const loadTenantByDomain = async (domain) => {
  try {
    await dbConnect();

    if (!domain) {
      return null;
    }

    // Search in domains array (static sites) first, then fall back to domain field (editor)
    let tenant = await Tenant.findOne({
      $or: [
        { domains: domain },
        { domain: domain }
      ]
    });

    if (!tenant) {
      return null;
    }

    // Convert Mongoose document to plain object for serialization
    tenant = tenant.toObject();

    // Convert non-serializable fields to strings for JSON serialization
    if (tenant._id) {
      tenant._id = tenant._id.toString();
    }
    if (tenant.createdAt) {
      tenant.createdAt = tenant.createdAt.toISOString();
    }
    if (tenant.updatedAt) {
      tenant.updatedAt = tenant.updatedAt.toISOString();
    }

    return tenant;
  } catch (error) {
    console.error("Error loading tenant by domain:", error);
    return null;
  }
};

/**
 * Run a tenant webhook
 * @param {Object} tenant - The tenant object with webhooks configuration
 * @param {string} webhookType - Type of webhook to run ('onLoad', 'onSave', 'fetchPage', or 'fetchPageList')
 * @param {Object} [options={}] - Options for the webhook
 * @param {Object} [options.req] - The request object (for headers, auth info)
 * @param {Object} [options.query] - Query parameters
 * @param {string} [options.method='GET'] - HTTP method (GET or POST)
 * @param {Object} [options.body] - Body data for POST requests
 * @param {string} [options.pageId] - Optional page ID to append to webhook URL
 * @param {string} [options.token] - Authentication token to pass to webhook
 * @returns {Object|null} Webhook response data or null if webhook fails
 */
export const runTenantWebhook = async (tenant, webhookType, options = {}) => {
  if (!tenant?.webhooks?.[webhookType]) {
    return null;
  }

  const {
    req,
    query,
    method = 'GET',
    body,
    pageId,
    token,
  } = options;

  try {
    const webhookBaseUrl = tenant.webhooks[webhookType];
    const webhookUrl = pageId ? `${webhookBaseUrl}/${pageId}` : webhookBaseUrl;

    // Build headers
    const headers = {};

    // Add PageHub's auth token to verify the request came from us
    if (tenant.authToken) {
      headers['x-pagehub-auth'] = tenant.authToken;
    }

    // Add user's session token if provided
    if (token) {
      headers['x-pagehub-token'] = token;
    }

    // Also extract any existing auth headers from request (backward compatibility)
    const authHeaders = [
      'authorization',
      'x-api-key',
      'x-auth-token',
      'x-access-token',
      'cookie'
    ];

    if (req?.headers) {
      authHeaders.forEach(headerName => {
        if (req.headers[headerName]) {
          headers[headerName] = req.headers[headerName];
        }
      });
    }

    // Add content-type for POST requests
    if (method === 'POST' && body) {
      headers['content-type'] = 'application/json';
    }

    // Build query string with token if provided (for GET requests)
    let finalWebhookUrl = webhookUrl;
    if (token && method === 'GET') {
      const url = new URL(webhookUrl);
      url.searchParams.set('token', token);
      finalWebhookUrl = url.toString();
    }

    console.log(`Calling ${webhookType} webhook:`, {
      webhookUrl: finalWebhookUrl,
      method,
      pageId,
      hasToken: !!token,
      queryKeys: query ? Object.keys(query) : [],
      headerKeys: Object.keys(headers),
    });

    const fetchOptions = {
      method,
      headers,
    };

    if (method === 'POST' && body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const webhookResponse = await fetch(finalWebhookUrl, fetchOptions);

    if (webhookResponse.ok) {
      const webhookData = await webhookResponse.json();
      return webhookData;
    } else {
      console.error(`Webhook ${webhookType} returned status:`, webhookResponse.status);
      return null;
    }
  } catch (webhookError) {
    console.error(`Error calling ${webhookType} webhook:`, webhookError);
    return null;
  }
};
