import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KQC7T779');
            `}
          </Script>

          {/* Move Tailwind to lazyOnload - it doesn't need to block initial render */}
          <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

          {/* Preconnect to Google Fonts with crossorigin */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

          {/* Inline critical Tailwind base styles to prevent FOUC */}
          <style dangerouslySetInnerHTML={{
            __html: `
            *, ::before, ::after {
              box-sizing: border-box;
              border-width: 0;
              border-style: solid;
              border-color: #e5e7eb;
            }
            html { 
              line-height: 1.5; 
              -webkit-text-size-adjust: 100%; 
              -moz-tab-size: 4; 
              tab-size: 4; 
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            }
            body { margin: 0; line-height: inherit; }
            img, video { max-width: 100%; height: auto; display: block; }
            h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
            a { color: inherit; text-decoration: inherit; }
            button, input, optgroup, select, textarea { font-family: inherit; font-size: 100%; line-height: inherit; margin: 0; padding: 0; }
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
