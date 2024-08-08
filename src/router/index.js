import { createRouter, createWebHashHistory } from 'vue-router';
import { ElNotification } from 'element-plus';
import config from "@/config"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import tool from '@/utils/tool';
import { beforeEach, afterEach } from './scrollBehavior';
import menu from './menu';

//系统路由
const routes = menu


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

//设置标题
document.title = config.APP_NAME

//判断是否已加载过动态/静态路由
router.beforeEach(async(to, from, next) => {
    NProgress.start()
        //动态标题
    document.title = to.meta.title ? `${to.meta.title} - ${config.APP_NAME}` : `${config.APP_NAME}`

    //整页路由处理
    if (to.meta.fullpage) {
        to.matched = [to.matched[to.matched.length - 1]]
    }
  
    beforeEach(to, from)
    next();
});

router.afterEach((to, from) => {
    afterEach(to, from)
    NProgress.done()
});

router.onError((error) => {
    NProgress.done();
    ElNotification.error({
        title: '路由错误',
        message: error.message
    });
});

//入侵追加自定义方法、对象
router.sc_getMenu = () => {
    var apiMenu = tool.data.get("MENU") || []
    var menu = [...apiMenu]

    return menu
}



export default router