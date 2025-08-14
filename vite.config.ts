import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import viteCompression from 'vite-plugin-compression';
import { buildConfig } from './src/utils/build';

// OSS上传插件
const vitePluginOssUpload = require('./scripts/vite-plugin-oss-upload');


// 文件路径
import path from "path";
const pathSrc = path.resolve(__dirname, "src");

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 图片压缩
// import viteImagemin from 'vite-plugin-imagemin';


const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());

	return {
		plugins: [
			vue(),
			vueSetupExtend(),
			viteCompression(),
			JSON.parse(env.VITE_OPEN_CDN) ? buildConfig.cdn() : null,
			// OSS自动上传插件（仅在启用时生效）
			mode.command === 'build' && env.VITE_ENABLE_OSS_UPLOAD === 'true' ? vitePluginOssUpload({
				enabled: true
			}) : null,
			AutoImport({
				// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
				imports: ["vue", "vue-router", "pinia",],
				resolvers: [ElementPlusResolver(),],
				// 自动导入组件类型声明文件位置，默认根目录; false 关闭自动生成
				dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"),
			}),
			// Components会在首次加载当前页面时导致页面刷新，可以选择不使用
			// 也可在 main.ts 中全局注册 Element Plus，这样就不需要 Components 插件了
			Components({
				resolvers: [ElementPlusResolver(),],
				// 自动导入组件类型声明文件位置，默认根目录; false 关闭自动生成
				dts: path.resolve(pathSrc, "types", "components.d.ts"),
			}),
			// 只在生产模式下启用图片压缩，减少开发时内存占用
			// ...(mode.command === 'build' ? [viteImagemin({
			// 	gifsicle: {
			// 		optimizationLevel: 7,
			// 		interlaced: false
			// 	},
			// 	optipng: {
			// 		optimizationLevel: 7
			// 	},
			// 	mozjpeg: {
			// 		quality: 20
			// 	},
			// 	pngquant: {
			// 		quality: [0.8, 0.9],
			// 		speed: 4
			// 	}
			// })] : [])
		],
		root: process.cwd(),
		resolve: { alias },
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: { exclude: ['vue-demi'] },
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: JSON.parse(env.VITE_OPEN),
			hmr: true,
			// 添加 CORS 支持，允许被其他域名嵌入
			cors: true,
			fs: {
				strict: false
			},
			// 减少监听的文件数量
			watch: {
				ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
			},
			proxy: {
				'/api': {
					target: env.VITE_REPORT_API_URL,
					ws: true,
					changeOrigin: true,
					rewrite: (p) => p.replace(/^\/api/, 'api'),
				},
				'/applet': {
					target: env.VITE_APPLET_API_URL,
					ws: true,
					changeOrigin: true,
					rewrite: (p) => p.replace(/^\/applet/, 'applet'),
				},
				// 添加阿里云字体代理
				'/alicdn': {
					target: 'https://at.alicdn.com',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/alicdn/, ''),
					configure: (proxy, options) => {
						proxy.on('error', (err, req, res) => {
							console.log('字体代理错误:', err);
						});
					},
				},
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			minify: 'terser',
			terserOptions: {
				compress: {
					// drop_console: true,
					// 移除调试器
					drop_debugger: true,
					// 添加更多压缩选项
					// pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
					passes: 2,
					dead_code: true,        // 移除无用代码
					conditionals: true,     // 优化条件语句
				},
				mangle: {
					toplevel: true,
					keep_fnames: false,
				},
			},
			rollupOptions: {
				output: {
					chunkFileNames: 'assets/js/[name]-[hash].js',
					entryFileNames: 'assets/js/[name]-[hash].js',
					assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
					manualChunks(id) {
						if (id.includes('node_modules')) {
							return id.toString().match(/\/node_modules\/(?!.pnpm)(?<moduleName>[^\/]*)\//)?.groups!.moduleName ?? 'vender';
						}
					},
					// 移除可能冲突的配置
					// format: 'iife',
					// name: 'InvestmentReportApp'
				},
				...(JSON.parse(env.VITE_OPEN_CDN) ? { external: buildConfig.external } : {}),
			},
		},
		css: {
			preprocessorOptions: {
				css: { charset: false },
			},
			// 添加 CSS 代码分割
			postcss: {
				plugins: [
					require('autoprefixer'),
					require('cssnano')({
						preset: 'default',
					}),
				],
			},
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__NEXT_VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
