export function HorizontalTabs({ tabs, selected, onChange, className, iconClassName }) {
  return (
    <div className="flex overflow-auto -mx-4 sm:mx-0">
      <ul
        className="flex-none inline-grid gap-x-2 px-4 sm:px-0 xl:gap-x-6"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(6rem, 1fr))` }}
      >
        {tabs.map(({ icon, label }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => onChange(label)}
              className={`group text-sm font-semibold w-full flex flex-col items-center ${
                selected === label ? className : ''
              }`}
            >
              <svg
                width="48"
                height="48"
                fill="none"
                aria-hidden="true"
                className={`mb-6 ${
                  selected === label
                    ? iconClassName
                    : 'text-slate-300 group-hover:text-slate-400'
                }`}
              >
                {icon(selected === label)}
              </svg>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
