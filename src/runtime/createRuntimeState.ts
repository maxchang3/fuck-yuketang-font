import type { RuntimeState } from './types'

export function createRuntimeState(initialUrl: string = location.href): RuntimeState {
  return {
    currentUrl: initialUrl,
    decryptingNodes: new WeakSet<Element>(),
    disposed: false,
  }
}
