import Examples from "components/examples";
import { NextSeo } from "next-seo";

export const siteTitle =
  "Templates - PageHub - Create a fast landing page in seconds - Free!";
export const siteDescription =
  "Templates - Create stunning single page applications and components with TailwindCSS and OpenAI. No code going strong!";

function App() {
  return (
    <>
      <NextSeo title={siteTitle} description={siteDescription} />

      <Examples />
    </>
  );
}

export async function getServerSideProps({ req, res, params }) {
  // Set cache headers to enable bfcache (back/forward cache)
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=86400'
  );

  return {
    props: {},
  };
}

export default App;
