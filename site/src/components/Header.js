import Link from 'next/link'
import { VersionSwitcher } from '@/components/VersionSwitcher'
import Router from 'next/router'
import { Logo } from '@/components/Logo'
import { Dialog } from '@headlessui/react'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export function NavPopover({ display = 'md:hidden', className, ...props }) {
  let [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    function handleRouteChange() {
      setIsOpen(false)
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [isOpen])

  return (
    <div className={clsx(className, display)} {...props}>
      <button
        type="button"
        className="text-slate-500 w-8 h-8 flex items-center justify-center hover:text-slate-600  "
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">Navigation</span>
        <svg width="24" height="24" fill="none" aria-hidden="true">
          <path
            d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <Dialog
        as="div"
        className={clsx('fixed z-50 inset-0', display)}
        open={isOpen}
        onClose={setIsOpen}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 " />
        <div className="fixed top-4 right-4 w-full max-w-xs bg-white rounded-lg shadow-lg p-6 text-base font-semibold text-slate-900   ">
          <button
            type="button"
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-600  "
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close navigation</span>
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible" aria-hidden="true">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <ul className="space-y-6">
            <li>
              <a
                href="https://github.com/rayepps/exobase-js"
                className="hover:text-blue-600"
              >
                GitHub
              </a>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-slate-200 ">

          </div>
        </div>
      </Dialog>
    </div>
  )
}

export function Header({ hasNav = false, navIsOpen, onNavToggle, title, section }) {
  let [isOpaque, setIsOpaque] = useState(false)

  useEffect(() => {
    let offset = 50
    function onScroll() {
      if (!isOpaque && window.scrollY > offset) {
        setIsOpaque(true)
      } else if (isOpaque && window.scrollY <= offset) {
        setIsOpaque(false)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true })
    }
  }, [isOpaque])

  return (
    <>
      <div
        className={clsx(
          'sticky top-0 z-40 w-full flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 ',
          isOpaque
            ? 'bg-white '
            : 'bg-white/95 '
        )}
      >
        <div className="max-w-8xl mx-auto">
          <div
            className={clsx(
              'py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 ',
              hasNav ? 'mx-4 lg:mx-0' : 'px-4'
            )}
          >
            <div className="relative flex items-center justify-between">
              <Link href="/docs">
                <a
                  className="mr-3 flex-none overflow-hidden md:w-auto"
                >
                  <span className="sr-only">Exobase documentation home page</span>
                  <Logo className="w-auto h-5" />
                </a>
              </Link>
              <VersionSwitcher />
              <div className="relative lg:flex items-center ml-auto">
                <div className="flex items-center border-slate-200 ml-6 pl-6 ">
                  <a
                    href="https://github.com/rayepps/exobase-js"
                    className="ml-6 block text-slate-400 hover:text-slate-500 "
                  >
                    <span className="sr-only">Tailwind CSS on GitHub</span>
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
            </div>
          </div>
          {hasNav && (
            <div className="flex items-center p-4 border-b border-slate-900/10 lg:hidden ">
              <button
                type="button"
                onClick={() => onNavToggle(!navIsOpen)}
                className="text-slate-500 hover:text-slate-600  "
              >
                <span className="sr-only">Navigation</span>
                <svg width="24" height="24">
                  <path
                    d="M5 6h14M5 12h14M5 18h14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              {title && (
                <ol className="ml-4 flex text-sm leading-6 whitespace-nowrap min-w-0">
                  {section && (
                    <li className="flex items-center">
                      {section}
                      <svg
                        width="3"
                        height="6"
                        aria-hidden="true"
                        className="mx-3 overflow-visible text-slate-400"
                      >
                        <path
                          d="M0 0L3 3L0 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </li>
                  )}
                  <li className="font-semibold text-slate-900 truncate ">
                    {title}
                  </li>
                </ol>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
