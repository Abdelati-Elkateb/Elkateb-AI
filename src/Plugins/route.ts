import type { App, Plugin } from 'vue'
import router from '@/router'

const routePlugin: Plugin = {
  install(app: App) {
    app.use(router)
  },
}

export default routePlugin
