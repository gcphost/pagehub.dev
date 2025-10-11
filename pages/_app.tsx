import { RecoilEnv, RecoilRoot } from "recoil";

import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Script from "next/script";
import "react-tooltip/dist/react-tooltip.css";
import "../styles/app.css";
import "../styles/tweakcn.css";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  // Marketing pages where we want GTM to load
  const marketingPages = ['/', '/templates', '/privacy', '/terms', '/page-builder-api'];
  const isMarketingPage = marketingPages.includes(router.pathname);



  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        {isMarketingPage && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KQC7T779');
            `}
          </Script>
        )}

        <Component {...pageProps} />

        <iframe
          className="hidden"
          name="iframe"
          id="iframe"
          title="Submission Frame"
        ></iframe>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
