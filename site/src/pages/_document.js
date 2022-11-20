import clsx from 'clsx'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

const FAVICON_VERSION = 3

function v(href) {
  return `${href}?v=${FAVICON_VERSION}`
}

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en" className="[--scroll-mt:9.875rem] lg:[--scroll-mt:6.3125rem]">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href={v('/favicons/apple-touch-icon.png')} />
          <link rel="icon" type="image/png" sizes="32x32" href={v('/favicons/favicon-32x32.png')} />
          <link rel="icon" type="image/png" sizes="16x16" href={v('/favicons/favicon-16x16.png')} />
          <link rel="shortcut icon" href={v('/favicons/favicon.ico')} />
          <meta name="apple-mobile-web-app-title" content="Exobase" />
          <meta name="application-name" content="Exobase" />
        </Head>
        <body
          className='antialiased text-slate-500'
        >
          <Main />
          <NextScript />
          <script> </script>
        </body>
      </Html>
    )
  }
}
