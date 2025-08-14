// 字体图标 url
const cssCdnUrlList: Array<string> = [
	'//at.alicdn.com/t/c/font_2298093_rnp72ifj3ba.css',
	'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
];

// 备用本地字体文件路径
const localCssList: Array<string> = [
	'/fonts/iconfont.css', // 可以下载阿里云字体到本地
	'/fonts/font-awesome.min.css', // 本地 FontAwesome
];

// 第三方 js url
const jsCdnUrlList: Array<string> = [];

// 检测是否在嵌入环境中
function isEmbedded(): boolean {
	return window !== window.top;
}

// 动态批量设置字体图标
export function setCssCdn() {
	if (cssCdnUrlList.length <= 0) return false;

	cssCdnUrlList.forEach((url, index) => {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;
		link.crossOrigin = 'anonymous';

		// 添加错误处理
		link.onerror = () => {
			console.warn(`字体图标加载失败: ${url}`);
			// 尝试使用本地备用文件
			if (localCssList[index]) {
				loadLocalFont(localCssList[index]);
			}
		};

		// 添加成功加载的回调
		link.onload = () => {
			console.log(`字体图标加载成功: ${url}`);
		};

		document.getElementsByTagName('head')[0].appendChild(link);
	});
}

// 加载本地字体文件
function loadLocalFont(localPath: string) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = localPath;

	link.onerror = () => {
		console.warn(`本地字体文件也加载失败: ${localPath}`);
	};

	link.onload = () => {
		console.log(`本地字体文件加载成功: ${localPath}`);
	};

	document.getElementsByTagName('head')[0].appendChild(link);
}

// 尝试使用代理加载字体
function setCssCdnWithProxy() {
	if (cssCdnUrlList.length <= 0) return false;

	cssCdnUrlList.forEach((url) => {
		// 如果是阿里云字体，尝试使用代理
		if (url.includes('alicdn.com')) {
			const proxyUrl = url.replace('//at.alicdn.com', '/alicdn');
			loadCssWithFallback(proxyUrl, url);
		} else {
			loadCssWithFallback(url);
		}
	});
}

// 带回退机制的 CSS 加载
function loadCssWithFallback(primaryUrl: string, fallbackUrl?: string) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = primaryUrl;
	link.crossOrigin = 'anonymous';

	link.onerror = () => {
		console.warn(`主要字体源加载失败: ${primaryUrl}`);
		if (fallbackUrl) {
			console.log(`尝试备用字体源: ${fallbackUrl}`);
			const fallbackLink = document.createElement('link');
			fallbackLink.rel = 'stylesheet';
			fallbackLink.href = fallbackUrl;
			fallbackLink.crossOrigin = 'anonymous';

			fallbackLink.onerror = () => {
				console.warn(`备用字体源也加载失败: ${fallbackUrl}`);
			};

			document.getElementsByTagName('head')[0].appendChild(fallbackLink);
		}
	};

	document.getElementsByTagName('head')[0].appendChild(link);
}

// 动态批量设置第三方js
export function setJsCdn() {
	if (jsCdnUrlList.length <= 0) return false;
	jsCdnUrlList.map((v) => {
		let script = document.createElement('script');
		script.src = v;
		script.crossOrigin = 'anonymous';

		// 添加错误处理
		script.onerror = () => {
			console.warn(`JS文件加载失败: ${v}`);
		};

		document.body.appendChild(script);
	});
}

/**
 * 批量设置字体图标、动态js
 * @method cssCdn 动态批量设置字体图标
 * @method jsCdn 动态批量设置第三方js
 */
const setIntroduction = {
	// 设置css - 根据环境选择加载方式
	cssCdn: () => {
		if (isEmbedded()) {
			console.log('检测到嵌入环境，使用代理加载字体');
			setCssCdnWithProxy();
		} else {
			console.log('常规环境，直接加载字体');
			setCssCdn();
		}
	},
	// 设置js
	jsCdn: () => {
		setJsCdn();
	},
};

// 导出函数方法
export default setIntroduction;