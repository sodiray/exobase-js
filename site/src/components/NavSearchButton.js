import { useState, useCallback, useRef, createContext, useContext, useEffect } from 'react'
import { useActionKey } from '@/hooks/useActionKey'

export const SearchContext = createContext()

export function NavSearchProvider({ children }) {
  const [filter, setFilter] = useState(false)

  const onInput = useCallback((e) => {
    setFilter(e.target.value)
  }, [])

  return (
    <SearchContext.Provider
      value={{
        onInput,
        filter
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function NavSearchButton({ children, ...props }) {
  const inputRef = useRef()
  let actionKey = useActionKey()
  let { onInput } = useContext(SearchContext)

  const focus = () => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }

  useEffect(() => {
    let pressed = null

    function onKeyDown(event) {
      if (!pressed && /[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        focus()
      }

      pressed = event
    }

    function onKeyUp(event) {
      if (event.keyCode === pressed?.keyCode) {
        pressed = null
      }

    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <div
      onClick={focus}
      className="flex p-2 items-center rounded border border-slate-200 hover:border-slate-300"
    >
      <svg
        width="24"
        height="24"
        fill="none"
        aria-hidden="true"
        className="mr-3 flex-none"
      >
        <path
          d="m19 19-3.5-3.5"
          strokeWidth="2"
          className="stroke-slate-400"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="11"
          cy="11"
          r="6"
          strokeWidth="2"
          className="stroke-slate-400"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        className="grow w-full"
        type="text"
        ref={inputRef}
        onChange={onInput}
        placeholder="Quick search..."
      />
      {actionKey && (
        <span className="ml-auto pl-3 flex-none text-xs font-semibold text-slate-400">
          {actionKey[0]}K
        </span>
      )}
    </div>
  )
}