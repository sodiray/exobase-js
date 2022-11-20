
export function DocLinkAndPreview({
  path
}) {
  return (
    <>
      <p>
        Edit this document on <a href={`https://github.com/rayepps/exobase-js/blob/master/${path}`}>GitHub</a>.
      </p>
    </>
  )
}
