import './assets/base.css'
import './assets/components.css'


import router from './router/index.js'
import { createApp } from 'vue'

import App from './App.vue'



createApp(App).use(router).mount('#app')