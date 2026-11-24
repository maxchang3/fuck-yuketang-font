export const COPY_STYLE_ID = 'fuck-yuketang-font-copy-style'

// `.container-problem` is the exercise pane that holds the question stem,
// the option list, and the answer analysis. Everything outside of it (course
// tree, question navigator, action bar) keeps the page's own selection rules.
const COPY_STYLE = `
.container-problem,
.container-problem * {
  -webkit-user-select: text !important;
  user-select: text !important;
}
`

export function installCopyStyles(doc: Document = document): void {
  if (doc.getElementById(COPY_STYLE_ID) !== null)
    return

  const style = doc.createElement('style')
  style.id = COPY_STYLE_ID
  style.textContent = COPY_STYLE
  ;(doc.head ?? doc.documentElement).append(style)
}
