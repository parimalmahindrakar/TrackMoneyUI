import App from './App.vue'
import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { fetchAccessToken } from './helper/helper'

const app = createApp(App)
registerPlugins(app)
app.use(createPinia())
fetchAccessToken();
app.mount('#app');
