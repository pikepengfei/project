import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import install from './install'
// import 'xe-utils'
import router from './router'
import store from './store'
import i18n from './locales'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);
import ganttastic from '@infectoone/vue-ganttastic'


app.use(ganttastic)

app.use(store);
app.use(router);
app.use(ElementPlus, { size: 'small' });
app.use(i18n);
app.use(install);
//挂载app
app.mount('#app');