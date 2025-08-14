import { RouteRecordRaw } from 'vue-router';

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
	interface RouteMeta {
		title?: string;
		isLink?: string;
		isHide?: boolean;
		isKeepAlive?: boolean;
		isAffix?: boolean;
		isIframe?: boolean;
		roles?: string[];
		icon?: string;
	}
}

/**
 * 无需token访问的列表
 * 前端添加路由，请在dynamicRoutes顶级节点的 `children 数组` 里添加
 * @description 在无token的情况下，可以访问的页面
 */
export const whiteRoutesList = [
	'/login',
	'/AiTest/home',
	'/test-pdf',
	// '/report/temp\\d+/.*', // 修改为匹配任何字符
	// 或者更具体的匹配规则：
	'/report/temp\\d+/.*', // 包含下划线和连字符
	'/report/temp\\d+-\\d+/.*', // 只匹配 temp数字-数字 的格式，如 temp1-1
	'/report/temp\\d+/.*/.*', // 包含下划线和连字符
];

/**
 * 定义动态路由
 * 前端添加路由，请在顶级节点的 `children 数组` 里添加
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			// {
			// 	path: '/home',
			// 	name: 'home',
			// 	component: () => import('@/views/home/index.vue'),
			// 	meta: {
			// 		title: 'message.router.home',
			// 		isLink: '',
			// 		isHide: false,
			// 		isKeepAlive: true,
			// 		isAffix: true,
			// 		isIframe: false,
			// 		roles: ['admin', 'common'],
			// 		icon: 'iconfont icon-shouye',
			// 	},
			// },
		],
	},
];

/**
 * 定义404、401界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},
];

/**
 * 定义静态路由（默认路由）
 * 此路由不要动，前端添加路由的话，请在 `dynamicRoutes 数组` 中添加
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	/**
	 * 提示：写在这里的为全屏界面，需要导航的页面不建议写在这里
	 * 请写在 `dynamicRoutes` 路由数组中
	 */
	//  AI生成报告测试页
	{
		path: '/AiTest/home',
		name: 'AiTestHome',
		component: () => import('@/views/AiTest/home.vue'),
		meta: {
			title: 'AI生成报告测试',
			isLink: '',
			isHide: true, // 隐藏在菜单中，通过参数访问
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			roles: ['admin', 'common'],
			icon: 'iconfont icon-baogao',
		},
	},
	//  报告详情页面
	{
		path: '/report/temp0/:id',
		name: 'reportTemp0',
		component: () => import('@/views/report/temp0/index.vue'),
		meta: {
			title: 'message.router.reportDetail',
			isLink: '',
			isHide: true, // 隐藏在菜单中，通过参数访问
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			roles: ['admin', 'common'],
			icon: 'iconfont icon-baogao',
		},
	},
	// {
	// 	path: '/report/temp1/:id',
	// 	name: 'reportTemp1',
	// 	component: () => import('@/views/report/temp1/index.vue'),
	// 	meta: {
	// 		title: 'message.router.reportDetail',
	// 		isLink: '',
	// 		isHide: true, // 隐藏在菜单中，通过参数访问
	// 		isKeepAlive: false,
	// 		isAffix: false,
	// 		isIframe: false,
	// 		roles: ['admin', 'common'],
	// 		icon: 'iconfont icon-baogao',
	// 	},
	// },
	{
		path: '/report/temp1/:id',
		name: 'reportTemp1',
		component: () => import('@/views/report/temp1-1/index.vue'),
		meta: {
			title: 'message.router.reportDetail',
			isLink: '',
			isHide: true, // 隐藏在菜单中，通过参数访问
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			roles: ['admin', 'common'],
			icon: 'iconfont icon-baogao',
		},
	},
	{
		path: '/report/temp2/:id?',
		name: 'reportTemp2',
		component: () => import('@/views/report/temp2/index.vue'),
		meta: {
			title: 'message.router.reportDetail',
			isLink: '',
			isHide: true, // 隐藏在菜单中，通过参数访问
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			roles: ['admin', 'common'],
			icon: 'iconfont icon-baogao',
		},
	},
	{
		path: '/report/temp3/:id/:userId',
		name: 'reportTemp3',
		component: () => import('@/views/report/temp3/index.vue'),
		meta: {
			title: 'message.router.reportDetail',
			isLink: '',
			isHide: true, // 隐藏在菜单中，通过参数访问
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			roles: ['admin', 'common'],
			icon: 'iconfont icon-baogao',
		},
	},
	{
		path: '/test-pdf',
		name: 'testPdf',
		component: () => import('@/views/test-pdf/index.vue'),
		meta: {
			title: 'PDF生成测试',
			isLink: '',
			isHide: false, // 在菜单中显示
			isKeepAlive: false,
			isAffix: false,
			isIframe: false,
			roles: ['admin', 'common'],
			icon: 'iconfont icon-PDF',
		},
	},
];
