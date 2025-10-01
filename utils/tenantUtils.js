import Tenant from "../models/tenant.model";

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

  if (!subdomain) {
    return null;
  }

  return await Tenant.findOne({ subdomain: subdomain });
};
