import fs from "fs";
import Document, { Head, Html, Main, NextScript } from "next/document";
import path from "path";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en-US">
        <Head>
          <script dangerouslySetInnerHTML={{
            __html: fs.readFileSync(path.join(process.cwd(), 'tailwind-cdn.js'), 'utf8')
          }} />

          {/* Preconnect to Google Fonts with crossorigin */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
