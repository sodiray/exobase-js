// import pkg from 'radash/package.json?fields=version'
import { Menu } from '@headlessui/react'

const pkg = {
  version: "1.0.0"
}

export function VersionSwitcher({ className }) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="text-xs leading-5 font-semibold bg-slate-400/10 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 ">
        v{pkg.version}
        <svg width="6" height="3" className="ml-2 overflow-visible" aria-hidden="true">
          <path
            d="M0 0L3 3L6 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Menu.Button>
      <Menu.Items className="absolute top-full mt-1 py-2 w-40 rounded-lg bg-white shadow ring-1 ring-slate-900/5 text-sm leading-6 font-semibold text-slate-700   ">
        <Menu.Item disabled>
          <span className="flex items-center justify-between px-3 py-1 text-blue-600">
            v{pkg.version}
            <svg width="24" height="24" fill="none" aria-hidden="true">
              <path
                d="m7.75 12.75 2.25 2.5 6.25-6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
