import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COPY_STYLE_ID } from '../src/services/dom/copyStyles'

describe('main.tsx entrypoint', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
    document.head.replaceChildren()
    document.body.replaceChildren()
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(new ArrayBuffer(0), { status: 404 }))))
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    window.history.replaceState({}, '', '/')
    document.head.replaceChildren()
    document.body.replaceChildren()
  })

  it('installs copy styles and starts font capture without mounting a panel', async () => {
    await import('../src/main.tsx')

    expect(document.getElementById(COPY_STYLE_ID)).not.toBeNull()
    expect(document.getElementById('fuck-yuketang-font-root')).toBeNull()
    expect(vi.getTimerCount()).toBeGreaterThan(0)
  })

  it('does nothing inside an unrelated iframe', async () => {
    const parentWindow = {} as Window
    vi.spyOn(window, 'top', 'get').mockReturnValue(parentWindow)
    const fetchMock = vi.mocked(fetch)

    await import('../src/main.tsx')
    await vi.advanceTimersByTimeAsync(500)

    expect(document.getElementById(COPY_STYLE_ID)).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('starts inside the exercise content iframe', async () => {
    const parentWindow = {} as Window
    vi.spyOn(window, 'top', 'get').mockReturnValue(parentWindow)
    window.history.replaceState({}, '', '/v2/web/iframe-exercise/33439457/91166140?noLeftMenu=1&node_id=10509699')

    await import('../src/main.tsx')

    expect(document.getElementById(COPY_STYLE_ID)).not.toBeNull()
    expect(vi.getTimerCount()).toBeGreaterThan(0)
  })
})
