import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content="Exobase - An incredible API design that runs on any framework"
        />
        <meta
          key="og:title"
          property="og:title"
          content="Exobase - An incredible API design that runs on any framework"
        />
        <title>Exobase - An incredible API design that runs on any framework</title>
      </Head>
      <div>
        <span>view docs at /docs</span>
      </div>
    </>
  )
}
