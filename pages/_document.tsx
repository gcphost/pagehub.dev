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

          {/* Load tweakcn fonts */}
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" />

          {/* Viewport meta tag */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

          {/* Favicon and touch icons */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
