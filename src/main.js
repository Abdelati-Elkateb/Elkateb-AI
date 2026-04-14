import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import route from '@/router/index.js'


const vuetify = createVuetify()

createApp(App).use(vuetify).mount('#app')
