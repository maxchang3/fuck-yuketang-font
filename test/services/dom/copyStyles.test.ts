import { beforeEach, describe, expect, it } from 'vitest'
import { COPY_STYLE_ID, installCopyStyles } from '../../../src/services/dom/copyStyles'

describe('copy styles', () => {
  beforeEach(() => {
    document.head.replaceChildren()
  })

  it('injects a rule scoped to the exercise pane', () => {
    installCopyStyles()

    const style = document.getElementById(COPY_STYLE_ID)
    expect(style).not.toBeNull()
    expect(style?.textContent).toContain('.container-problem')
    expect(style?.textContent).toContain('user-select: text !important')
    expect(style?.textContent).not.toContain('body *')
  })

  it('keeps a single style element when called repeatedly', () => {
    installCopyStyles()
    installCopyStyles()

    expect(document.querySelectorAll(`#${COPY_STYLE_ID}`)).toHaveLength(1)
  })
})
