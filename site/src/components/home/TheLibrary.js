import { CodeWindow } from '@/components/CodeWindow'
import { Footer } from '@/components/home/Footer'
import { Token } from '@/components/Code'
import { HorizontalTabs } from '@/components/HorizontalTabs'
import { Button } from '@/components/Button'
import { HiArrowSmDown } from 'react-icons/hi'
import { Logo } from '@/components/Logo'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { HiArrowNarrowRight } from 'react-icons/hi'
import Link from 'next/link'

import * as endpointCode from '../../samples/home-library-endpoint.ts?highlight'

let tabs = [{
  label: "Root",
  title: "Root Hooks",
  highlight: '',
  content: (
    <div>
      <p className="max-w-[50ch] text-lg mb-4">
        Abstract the incoming requests framework's specific arguments and models
        to generic ones. Express, Koa, and Lambda all provide unique input. The
        mapper converts requests into generics. They also apply the generic response
        back to the specific framework.
      </p>
      <Link href="/docs/configuration" passHref>
        <a className="flex items-center text-blue-600 hover:text-blue-700 group mt-4">
          <HiArrowNarrowRight />
          <span className="block ml-2 left-0 relative group-hover:left-2 transition-[left]">
            Framework abstraction guide
          </span>
        </a>
      </Link>
    </div>
  ),
  icon: selected => (
    <>
      <rect
        x="5"
        y="5"
        width="28"
        height="28"
        rx="4"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 41h28M33 39v4M5 39v4M39 5h4M39 33h4M41 33V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}, {
  label: "Props",
  title: "Generic Props Input",
  highlight: '',
  content: (
    <div>
      <p className="max-w-[50ch] text-lg mb-8">
        Compose the pieces of the endpoint together using small
        functions developed against the generic request/response
        interface our framework mapper provides.
      </p>
      <Link href="/docs/configuration" passHref>
        <a className="flex items-center text-blue-600 hover:text-blue-700 group mt-4">
          <HiArrowNarrowRight />
          <span className="block ml-2 left-0 relative group-hover:left-2 transition-[left]">
            Framework abstraction guide
          </span>
        </a>
      </Link>
    </div>
  ),
  icon: selected => (
    <>
      <path
        d="M17.687 42.22 40.57 29.219a4 4 0 0 0 1.554-5.36L39 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27.477 7.121a1 1 0 1 0-.954 1.758l.954-1.758Zm5.209 3.966.477-.879-.477.88Zm1.555 5.515-.866-.5-.003.006.87.494ZM26.523 8.88l5.686 3.087.954-1.758-5.686-3.087-.954 1.758Zm6.849 7.23-12.616 22.21 1.738.987 12.617-22.21-1.74-.988Zm-1.163-4.143a3 3 0 0 1 1.166 4.136l1.732 1a5 5 0 0 0-1.944-6.894l-.954 1.758Z"
        fill="currentColor"
      />
      <path
        d="M5 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v25a9 9 0 1 1-18 0V9Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="14"
        cy="34"
        r="3"
        fill={selected ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  )
}, {
  label: "Hooks",
  title: "Composable Hooks",
  highlight: '',
  content: (
    <div>
      <p className="max-w-[50ch] text-lg mb-8">
        Package all the pieces you've composed up into a single functions. This
        packaged function is fully self contained -- it depends on no global application
        or shared middleware.
      </p>
      <Link href="/docs/configuration" passHref>
        <a className="flex items-center text-blue-600 hover:text-blue-700 group mt-4">
          <HiArrowNarrowRight />
          <span className="block ml-2 left-0 relative group-hover:left-2 transition-[left]">
            Framework abstraction guide
          </span>
        </a>
      </Link>
    </div>
  ),
  icon: (selected) => (
    <>
      <path
        d="M24 43c10.493 0 19-8.507 19-19S34.493 5 24 5m-4 .422C11.427 7.259 5 14.879 5 24c0 9.121 6.427 16.741 15 18.578"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 42.819V5.181c0-.1.081-.181.181-.181C34.574 5 43 13.607 43 24c0 10.394-8.426 19-18.819 19a.181.181 0 0 1-.181-.181Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 10h3M28 14h7M28 18h10M28 22h11M28 26h10M28 30h9M28 34h7M28 38h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
}, {
  label: "Endpoint",
  title: "Isolated Endpoints",
  highlight: '',
  content: (
    <div>
      <p className="max-w-[50ch] text-lg mb-8">
        Package all the pieces you've composed up into a single functions. This
        packaged function is fully self contained -- it depends on no global application
        or shared middleware.
      </p>
      <Link href="/docs/configuration" passHref>
        <a className="flex items-center text-blue-600 hover:text-blue-700 group mt-4">
          <HiArrowNarrowRight />
          <span className="block ml-2 left-0 relative group-hover:left-2 transition-[left]">
            Framework abstraction guide
          </span>
        </a>
      </Link>
    </div>
  ),
  icon: (selected) => (
    <>
      <path
        d="M24 43c10.493 0 19-8.507 19-19S34.493 5 24 5m-4 .422C11.427 7.259 5 14.879 5 24c0 9.121 6.427 16.741 15 18.578"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 42.819V5.181c0-.1.081-.181.181-.181C34.574 5 43 13.607 43 24c0 10.394-8.426 19-18.819 19a.181.181 0 0 1-.181-.181Z"
        fill="currentColor"
        fillOpacity={selected ? '.1' : '0'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 10h3M28 14h7M28 18h10M28 22h11M28 26h10M28 30h9M28 34h7M28 38h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  ),
}]

export function TheLibrary() {
  const [tab, setTab] = useState(tabs[0].label)
  const current = tabs.find(x => x.label === tab)
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-2xl w-full flex items-start">
        <div>
          <span className="font-bold text-blue-500">A Development Toolkit</span>
          <p className="text-slate-900 text-4xl tracking-tight font-extrabold sm:text-5xl max-w-[25vw]">
            Exobase<br />
            Library
          </p>
          <p className="max-w-[50ch] my-8 text-lg">
            Exobase endpoints live in their own file, exporting a fully
            self contained function ready to be called by the framework
            being used. One quick look at an endpoint file can answer any
            typical questions a developer has.
          </p>
          <HorizontalTabs
            tabs={tabs}
            selected={tab}
            onChange={setTab}
            className="text-blue-600"
            iconClassName="text-blue-500"
          />
          <div className="mt-12">
            <h4 className="text-lg text-slate-900 font-bold mb-2">
              {current.title}
            </h4>
            {current.content}
          </div>
        </div>
        <div className="grow flex items-start px-40">
          <CodeWindow className="!h-auto max-h-[none] w-full">
            <CodeWindow.Code2 lines={endpointCode.lines.length}>
              {endpointCode.lines.map((tokens, lineIndex) => {
                console.log(tokens, lineIndex)
                return (
                  <div key={lineIndex}>
                    {tokens.map((token, tokenIndex) => {
                      if (token.types[token.types.length - 1] !== 'attr-value') {
                        return (
                          <span key={tokenIndex} className={getClassNameForToken(token)}>
                            {token.content.split(/\[([^\]]+)\]/).map((part, i) =>
                              i % 2 === 0 ? (
                                part
                              ) : (
                                <span key={i} className="code-highlight bg-code-highlight">
                                  {part}
                                </span>
                              )
                            )}
                          </span>
                        )
                      }
                      return (
                        <span key={tokenIndex} className={getClassNameForToken(token)}>
                          {token.content}
                        </span>
                      )
                    })}
                  </div>
                )
              })}
            </CodeWindow.Code2>
          </CodeWindow>
        </div>
      </div>
    </div>
  )
}

export function getClassNameForToken({ types, empty }) {
  const typesSize = types.length
  if (typesSize === 1 && types[0] === 'plain') {
    return empty ? 'inline-block' : undefined
  }
  return [...types, empty ? 'inline-block' : 'token'].join(' ')
}
