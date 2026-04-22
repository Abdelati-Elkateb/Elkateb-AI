import { createApp } from 'vue'
import App from './App.vue'

// 1. Import your Tailwind/shadcn styles
// Make sure this file contains the @tailwind directives!
import './style.css' 

// 2. Import your existing plugins
import vuetify from '@/Plugins/vuetify'
import route from '@/Plugins/route'

const app = createApp(App)

app.use(route)
app.use(vuetify) // You can keep this for now

app.mount('#app')