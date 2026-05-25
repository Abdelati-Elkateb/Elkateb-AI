import { createApp } from 'vue'
import App from './App.vue'

// 1. Import Pinia
import { createPinia } from 'pinia'

// 2. Import your Tailwind/shadcn styles
// Make sure this file contains the @tailwind directives!
import './style.css' 

// 3. Import your existing plugins
import vuetify from '@/Plugins/vuetify'
import route from '@/Plugins/route'

const app = createApp(App)

// 4. Initialize Pinia and use it
const pinia = createPinia()
app.use(pinia)

// 5. Use your other plugins
app.use(route)
app.use(vuetify) // You can keep this for now

app.mount('#app')