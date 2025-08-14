import { createApp } from 'vue';
import pinia from '@/stores/index';
import App from '@/App.vue';
import router from '@/router';
import { directive } from '@/directive/index';
import { i18n } from '@/i18n/index';
import other from '@/utils/other';
import { embedAdapter } from '@/utils/embed';

import ElementPlus from 'element-plus';
import '@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';

// 初始化嵌入适配器，如果失败会自动显示错误页面
if (!embedAdapter.init()) {
  throw new Error('Embedding not allowed（不允许嵌入）');
}

const app = createApp(App);

directive(app);
other.elSvg(app);

app.use(pinia).use(router).use(ElementPlus).use(i18n).use(VueGridLayout).mount('#app');