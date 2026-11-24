/* @refresh reload */
import { createUserscriptRuntime } from './runtime'
import { installCopyStyles } from './services/dom/copyStyles'

const isExerciseContentFrame = location.pathname.startsWith('/v2/web/iframe-exercise/')

if (window.self === window.top || isExerciseContentFrame) {
  installCopyStyles()
  createUserscriptRuntime()
}
