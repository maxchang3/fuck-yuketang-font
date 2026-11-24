import type { DecryptionMap } from '../core/font'
import type { UserscriptRuntime } from './types'

import { decryptFont } from '../core/font'
import { containsEncryptedTextElement, findEncryptedTextNodes, isEncryptedTextElement } from '../services/dom/encryptedTextNodes'
import { extractFontUrlFromStyleElement } from '../services/dom/fontUrlExtractor'
import { requestFont } from '../services/http/requestFont'
import { installPromiseWithResolversFallback } from '../services/platform/promiseWithResolvers'
import { createRuntimeState } from './createRuntimeState'
import { createFontWatcher } from './fontWatcher'
import { decryptNode } from './nodeDecryptor'
import { startRouteWatcher } from './routeWatcher'

export function createUserscriptRuntime(): UserscriptRuntime {
  installPromiseWithResolversFallback()

  const state = createRuntimeState()

  const loadDecryptionMap = async (url: string): Promise<DecryptionMap> => {
    const fontBytes = await requestFont(url)
    return decryptFont(fontBytes)
  }

  const setFontUrl = (url: string): void => {
    if (state.fontState?.url === url)
      return
    state.fontState = { url, promise: loadDecryptionMap(url) }
  }

  const scanAndDecrypt = (): void => {
    const fontState = state.fontState
    if (fontState === undefined || state.disposed)
      return

    for (const span of findEncryptedTextNodes()) {
      if (state.decryptingNodes.has(span))
        continue
      state.decryptingNodes.add(span)
      void decryptNode(span, fontState, { state, scanAndDecrypt })
    }
  }

  const fontWatcher = createFontWatcher(setFontUrl, scanAndDecrypt)

  const observer = new MutationObserver((mutations) => {
    let shouldScan = false

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element))
          continue

        if (node instanceof HTMLStyleElement) {
          const url = extractFontUrlFromStyleElement(node)
          if (url !== undefined) {
            setFontUrl(url)
            shouldScan = true
          }
        }

        if (isEncryptedTextElement(node) || containsEncryptedTextElement(node))
          shouldScan = true
      }
    }

    if (shouldScan)
      scanAndDecrypt()
  })

  const observeTarget = document.body ?? document.documentElement
  observer.observe(observeTarget, { childList: true, subtree: true })

  const routeTimer = startRouteWatcher((url) => {
    if (url === state.currentUrl)
      return

    state.currentUrl = url
    state.fontState = undefined
    state.decryptingNodes = new WeakSet<Element>()
    fontWatcher.start()
  })

  fontWatcher.start()

  return {
    scanAndDecrypt,
    dispose: () => {
      state.disposed = true
      observer.disconnect()
      fontWatcher.stop()
      window.clearInterval(routeTimer)
    },
  }
}
