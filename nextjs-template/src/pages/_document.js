import { Html, Head, Main, NextScript } from "next/document";


export default function Document({ db }) {
  return (
    <Html lang="en">
      <link rel="icon" type="image/webp" sizes="16x16" href="/favicon.webp"></link>
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.db = ${JSON.stringify(db)};`,
          }}
        />
      </body>
    </Html>
  );
}
