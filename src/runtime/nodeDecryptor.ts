import type { FontState, RuntimeState } from './types'

import { decryptText } from '../core/font'
import { markElementDecrypted } from '../services/dom/encryptedTextNodes'

export interface NodeDecryptorOptions {
  state: RuntimeState
  scanAndDecrypt: () => void
}

export async function decryptNode(span: Element, fontState: FontState, options: NodeDecryptorOptions): Promise<void> {
  const { state, scanAndDecrypt } = options

  try {
    const map = await fontState.promise
    if (state.disposed)
      return
    if (state.fontState?.url !== fontState.url) {
      state.decryptingNodes.delete(span)
      scanAndDecrypt()
      return
    }

    span.textContent = decryptText(span.textContent ?? '', map)
    markElementDecrypted(span)
  }
  catch (error) {
    console.error('雨课堂字形解密失败', error)
    state.decryptingNodes.delete(span)
  }
}
