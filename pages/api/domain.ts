import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  res.status(200).json(await getDomain(req.body.domain));
}

export async function getDomain(name) {
  const result = await fetch(
    `https://api.vercel.com/v9/projects/pagehub/domains/${name}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "get",
    }
  );

  return result.json();
}

export async function deploy() {
  const dd = await fetch("https://api.vercel.com/v6/deployments", {
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
    },
    method: "get",
  });

  const deployments = await dd.json();

  const result = await fetch(
    `https://vercel.com/api/v13/deployments?forceNew=1&withCache=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "POST",
      body: `{"deploymentId":"${deployments.deployments[0].uid}","meta":{"action":"redeploy"},"name":"pagehub","target":"production"}`,
    }
  );
  return result.json();
}

export async function removeDomain(name) {
  const result = await fetch(
    `https://api.vercel.com/v9/projects/pagehub/domains/${name}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "delete",
    }
  );
  return result.json();
}

export async function addDomain(name) {
  const result = await fetch(
    "https://api.vercel.com/v10/projects/pagehub/domains",
    {
      body: JSON.stringify({
        name,
      }),
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: "post",
    }
  );

  return result.json();
}
