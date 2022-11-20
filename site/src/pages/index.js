import { TheDesignPattern } from '@/components/home/TheDesignPattern'
import { TheProblem } from '@/components/home/TheProblem'
import { TheLibrary } from '@/components/home/TheLibrary'
import { TheArchitecture } from '@/components/home/TheArchitecture'
import { Footer } from '@/components/home/Footer'
import { HiArrowSmDown } from 'react-icons/hi'
import { Logo } from '@/components/Logo'
import Head from 'next/head'
import { Link } from '@/components/home/common'

export default function Home() {
  return (
    <>
      <Head>
        <meta
          key="twitter:title"
          name="twitter:title"
          content="Exobase - Rapidly build modern platforms with a design pattern and tool from this decade."
        />
        <meta
          key="og:title"
          property="og:title"
          content="Exobase - Rapidly build modern platforms with a design pattern and tool from this decade."
        />
        <title>Exobase - Rapidly build modern platforms with a design pattern and tool from this decade.</title>
      </Head>
      <div className="mb-20 bg-slate-50">

        <div className="min-h-screen p-16 relative flex items-center justify-center">
          <div className="absolute top-0 left-0 pt-16 px-16 w-full flex items-start">
            <div>
              <span className="font-bold text-blue-600">Exobase</span>
              <p className="text-slate-900 text-4xl tracking-tight font-extrabold sm:text-5xl max-w-[20vw]">
                Rapidly Build APIs that are out of this world.
              </p>
              <div className="mt-8 p-4 border border-slate-200 rounded-lg inline-block">
                <span className="text-slate-700 font-semibold">yarn add @exobase/core</span>
              </div>
            </div>
            <div className="grow flex items-center justify-end">
              <Link href="/docs" className="mt-0 block text-slate-900 hover:text-slate-800">Docs</Link>
              {/* <a href="https://github.com/rayepps/exobase-js/discussion" target="_blank" className="ml-6 block text-slate-900 hover:text-slate-800">Community</a> */}
              <a
                href="https://github.com/rayepps/exobase-js"
                className="ml-6 block text-slate-900 hover:text-slate-800"
              >
                <span className="sr-only">Exobase on GitHub</span>
                <svg
                  viewBox="0 0 16 16"
                  className="w-5 h-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="absolute bottom-16 left-0 pt-16 px-16 w-full flex items-start">
            <div>
              <span className="text-slate-900 text-xl italic font-medium">Better than best practices</span>
            </div>
          </div>
          <Logo className="w-[20vw] fill-slate-900" />
        </div>
      </div>

      {/* Best Practices Quote */}
      <section className="text-center px-8 mt-60">
        <h2 className="text-slate-900 text-4xl tracking-tight font-extrabold sm:text-5xl">
          “best practices”? We can do better.
        </h2>
        <figure>
          <blockquote>
            <p className="mt-6 max-w-3xl mx-auto text-lg">
              Over my 10 years of building I've had to solve the same problems
              on every project. I spent 4 years designing this solution so we
              can all do better than best practices. Try to keep an open mind.
            </p>
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center space-x-4 text-left">
            <img
              src={require('@/img/ray.jpg').default}
              alt=""
              className="w-14 h-14 rounded-full"
              loading="lazy"
            />
            <div>
              <div className="text-slate-900 font-semibold">Ray Epps</div>
              <div className="mt-0.5 text-sm leading-6">Creator of Exobase</div>
            </div>
          </figcaption>
        </figure>
      </section>

      {/* The Design Pattern */}
      <section className="my-80">
        <TheDesignPattern />
      </section>

      {/* The Library */}
      <section className="my-80">
        <TheLibrary />
      </section>

      {/* The Architecture */}
      <section className="my-80">
        <TheArchitecture />
      </section>

      <Footer />
    </>
  )
}
