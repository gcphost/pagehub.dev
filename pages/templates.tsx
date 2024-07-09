import Examples from 'components/examples';
import { NextSeo } from 'next-seo';

export const siteTitle = 'Templates - Pagehub (beta) - Create a fast landing page in seconds - Free!';
export const siteDescription = 'Templates - Create stunning single page applications and components with TailwindCSS and OpenAI. No code going strong!';

function App({}) {
  return (
    <>
      <NextSeo title={siteTitle} description={siteDescription} />

      <Examples />
    </>
  );
}

export async function getServerSideProps({ req, params }) {
  return {
    props: {},
  };
}

export default App;
