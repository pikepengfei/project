<template>
	<div class="report-page report-font" :class="{ 'min-width-wrapper bg-gray': route.query.preview === 'true' }"
		:style="mobileScaleStyle">
		<div class="footer-wrapper">
			<img class="footer-image"
				:src="optimizeImageUrl('https://test-lyy-manage.oss-cn-beijing.aliyuncs.com/static/ai-report_cover.png', { width: 800, quality: 100 })"
				alt="" />
			<div class="serial-number">
				{{ data.serialNumber }}
			</div>
		</div>
		<div class="report-container">
			<!-- 调试信息（开发时可见，打印时隐藏） -->
			<div class="debug-info"
				style="position: fixed; top: 10px; left: 10px; background: #f0f0f0; padding: 10px; z-index: 9999; font-size: 12px; border: 1px solid #ccc">
				<div>报告ID: {{ reportId }}</div>
				<div>数据状态: {{ loading ? '加载中' : '已加载' }}</div>
				<div style="margin-top: 8px">
					<button @click="debugContainerHeight"
						style="margin-right: 5px; padding: 4px 8px; font-size: 11px">检查容器高度</button>
					<button @click="() => testImageOptimization('print')"
						style="margin-right: 5px; padding: 4px 8px; font-size: 11px; background: #ffc107; color: black; border: none; border-radius: 2px;">测试图片优化</button>
					<button @click="printReport"
						style="margin-right: 5px; padding: 4px 8px; font-size: 11px; background: #007bff; color: white; border: none; border-radius: 2px;">图片优化打印</button>
					<button @click="printReportWithoutOptimization"
						style="padding: 4px 8px; font-size: 11px; background: #28a745; color: white; border: none; border-radius: 2px;">原始图片打印</button>
				</div>
			</div>

			<!-- <p class="page-title">立业云选址报告</p> -->
			<!-- 载体详情 -->
			<!-- <p key="detail" class="sec-title content-padding">载体详情</p> -->
			<AddressReport v-if="data.reportDetail" :reportDetail="data.reportDetail" :data="data"
				:optimizeImageUrl="optimizeImageUrl" @mounted="debouncedSetHeight" @updated="debouncedSetHeight" />
		</div>
		<div class="footer-wrapper">
			<img class="footer-image"
				:src="optimizeImageUrl('https://test-lyy-manage.oss-cn-beijing.aliyuncs.com/static/reportCover0.png', { width: 800, quality: 100 })"
				alt="" />
			<!-- <div class="disclaimer-text">
        本报告所采用的所有信息和数据均截止至{{
          data?.createPdfDate
        }}，以合法获得的权威、可靠、准确、完整的互联网公开信息为基础。本报告仅为您的决策提供参考，我方不对因使用此报告结果而引致的损失承担任何法律责任，同时我方不保证文中观点或陈述不发生任何变更。
      </div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
import { ref, defineAsyncComponent, nextTick, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useReportApi } from '@/api/report/index';
// import {  newData } from './TextData';
// 动态导入AddressReport组件
const AddressReport = defineAsyncComponent(() => import('./address-report.vue'));
import imgTop1 from '@/assets/images/icon_top1.webp';
import imgTop2 from '@/assets/images/icon_top2.webp';
import imgTop3 from '@/assets/images/icon_top3.webp';
import imgTop4 from '@/assets/images/icon_top4.webp';

const imgList = [imgTop1, imgTop2, imgTop3, imgTop4];

// API实例
const reportApi = useReportApi();

const route = useRoute();
const reportId = route.params.id as string;
const usersId = route.params.userId as string;

// 使用假数据代替接口请求
const data = ref<any>({});
const loading = ref(false);
let resizeObserver: ResizeObserver | null = null;

const originalUrl = 'https://test-lyy-manage.oss-cn-beijing.aliyuncs.com/static/ai-report_cover.png';

// 图片优化函数 - 增强版
const optimizeImageUrl = (url: string, options: {
	width?: number;
	height?: number;
	quality?: number;
	format?: 'webp' | 'jpg' | 'png';
	forPrint?: boolean;
	isPuppeteer?: boolean;
} = {}) => {
	if (!url || !url.includes('oss-cn-beijing.aliyuncs.com')) {
		return url;
	}

	// 检测是否为Puppeteer环境
	const isPuppeteerEnv = options.isPuppeteer || isPuppeteerEnvironment();

	// 检查URL是否已经包含处理参数
	const hasProcessing = url.includes('x-oss-process=image');

	// 对于Puppeteer/PDF生成，使用最激进的优化
	if (isPuppeteerEnv || options.forPrint) {
		const baseUrl = url.split('?')[0];
		const {
			width = 800,     // 大幅降低宽度
			quality = 100     // 极低质量以减小文件大小
		} = options;

		return `${baseUrl}?x-oss-process=image/resize,w_${width}/format,jpg/quality,q_${quality}`;
	}

	// 如果已经有处理参数但不是PDF模式，保持原有逻辑
	if (hasProcessing && !options.forPrint && !isPuppeteerEnv) {
		return url;
	}

	// 常规优化参数
	const {
		width = 900,
		height,
		quality = 100,
		format = 'webp'
	} = options;

	const processParams: string[] = [];

	// 尺寸调整
	if (width && height) {
		processParams.push(`resize,w_${width},h_${height},m_fill`);
	} else if (width) {
		processParams.push(`resize,w_${width}`);
	}

	// 格式转换
	if (format) {
		processParams.push(`format,${format}`);
	}

	// 质量压缩
	processParams.push(`quality,q_${quality}`);

	return `${url}?x-oss-process=image/${processParams.join('/')}`;
};

// 图片优化配置表
const IMAGE_OPTIMIZATION_CONFIG = {
	// 封面图片配置
	cover: {
		normal: { width: 900, quality: 100, format: 'webp' as const },
		print: { width: 600, quality: 40, format: 'jpg' as const },
		puppeteer: { width: 800, quality: 100, format: 'jpg' as const }
	},
	// 内容图片配置
	content: {
		normal: { width: 600, quality: 85, format: 'webp' as const },
		print: { width: 200, quality: 15, format: 'jpg' as const },
		puppeteer: { width: 250, quality: 70, format: 'jpg' as const }
	},
	// 头像配置
	avatar: {
		normal: { width: 120, quality: 85, format: 'webp' as const },
		print: { width: 50, quality: 25, format: 'jpg' as const },
		puppeteer: { width: 100, quality: 50, format: 'jpg' as const }
	},
	// 其他图片配置
	other: {
		normal: { width: 400, quality: 80, format: 'webp' as const },
		print: { width: 150, quality: 10, format: 'jpg' as const },
		puppeteer: { width: 250, quality: 50, format: 'jpg' as const }
	}
};

// 获取图片类型
const getImageType = (img: HTMLImageElement): keyof typeof IMAGE_OPTIMIZATION_CONFIG => {
	if (img.classList.contains('footer-image')) return 'cover';
	if (img.classList.contains('park-image') ||
		img.classList.contains('carrier-image') ||
		img.classList.contains('floor-image')) return 'content';
	if (img.classList.contains('broker-avatar')) return 'avatar';
	return 'other';
};

// 统一图片优化函数
const optimizeImagesByEnvironment = (environment: 'normal' | 'print' | 'puppeteer' = 'normal') => {
	console.log(`开始为${environment}环境优化图片...`);
	const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;

	images.forEach((img, index) => {
		// 保存原始src用于恢复
		if (!img.dataset.originalSrc) {
			img.dataset.originalSrc = img.src;
		}

		// 如果是阿里云OSS图片，应用优化
		if (img.src.includes('oss-cn-beijing.aliyuncs.com')) {
			const imageType = getImageType(img);
			const config = IMAGE_OPTIMIZATION_CONFIG[imageType][environment];

			const optimizedSrc = optimizeImageUrl(img.dataset.originalSrc || img.src, {
				width: config.width,
				quality: config.quality,
				format: config.format,
				forPrint: environment !== 'normal',
				isPuppeteer: environment === 'puppeteer'
			});

			console.log(`图片 ${index + 1} (${imageType}): ${img.dataset.originalSrc} -> ${optimizedSrc}`);
			img.src = optimizedSrc;
		}
	});

	console.log(`完成 ${images.length} 个图片的${environment}环境优化`);
};

// 移动端缩放样式
const mobileScaleStyle = ref<{ transform?: string; height?: string }>({});

const applyMobileScale = () => {
	if (window.innerWidth <= 767) {
		const scale = window.innerWidth / 794; // 210mm ≈ 794px
		mobileScaleStyle.value = {
			transform: `scale(${scale})`,
			height: `${window.innerHeight / scale}px`,
		};
	} else {
		mobileScaleStyle.value = {};
	}
};

// 检测是否为Puppeteer环境
const isPuppeteerEnvironment = () => {
	return window.navigator.webdriver ||
		window.navigator.userAgent.includes('HeadlessChrome') ||
		window.location.search.includes('puppeteer=true') ||
		window.location.search.includes('pdf=true');
};

// 为Puppeteer优化页面
const optimizeForPuppeteer = () => {
	if (!isPuppeteerEnvironment()) return;

	console.log('开始Puppeteer页面优化...');

	// 添加Puppeteer标识类
	document.documentElement.classList.add('puppeteer-env');

	// 移除调试信息
	const debugInfo = document.querySelector('.debug-info') as HTMLElement;
	if (debugInfo) {
		debugInfo.style.display = 'none';
	}

	// 移除或简化装饰性元素
	const decorativeElements = [
		'.vr-icon',
		'.pdf-icon',
		'.top-icon',
		'.img-cover'
	];

	decorativeElements.forEach(selector => {
		const elements = document.querySelectorAll(selector);
		elements.forEach(el => (el as HTMLElement).style.display = 'none');
	});

	// 简化样式以减小渲染复杂度
	const styleSheet = document.createElement('style');
	styleSheet.textContent = `
		.puppeteer-env * {
			transition: none !important;
			animation: none !important;
			transform: none !important;
			filter: none !important;
			backdrop-filter: none !important;
		}
		
		.puppeteer-env .footer-image,
		.puppeteer-env .park-image,
		.puppeteer-env .carrier-image {
			image-rendering: optimizeSpeed !important;
			image-rendering: -webkit-optimize-contrast !important;
		}
	`;
	document.head.appendChild(styleSheet);

	// 优化字体加载
	document.fonts.ready.then(() => {
		console.log('Fonts loaded for Puppeteer');
		// 在图片优化完成后通知Puppeteer准备就绪
		setTimeout(() => {
			(window as any).puppeteerReady = true;
			console.log('Puppeteer准备就绪信号已发送');
		}, 1000);
	});
};

// 打印前处理（支持Puppeteer）
const handleBeforePrint = () => {
	const container = document.querySelector('.report-container') as HTMLElement;
	const footerWrappers = document.querySelectorAll('.footer-wrapper') as NodeListOf<HTMLElement>;
	const isPuppeteer = isPuppeteerEnvironment();

	// 容器高度处理
	if (container) {
		// 保存当前样式
		container.dataset.originalHeight = container.style.height;
		container.dataset.originalMinHeight = container.style.minHeight;

		// 打印时移除所有固定高度设置
		container.style.height = 'auto';
		container.style.minHeight = 'auto';
		container.style.removeProperty('--content-height');

		// 移除可能的内联样式
		if (container.hasAttribute('style')) {
			const style = container.getAttribute('style') || '';
			const newStyle = style.replace(/height\s*:\s*[^;]+;?/g, '').replace(/min-height\s*:\s*[^;]+;?/g, '');
			container.setAttribute('style', newStyle);
		}
	}

	// 处理footer包装器的高度
	footerWrappers.forEach((footer) => {
		footer.dataset.originalHeight = footer.style.height;
		footer.style.height = 'auto';
	});

	// 根据环境优化图片
	if (isPuppeteer) {
		optimizeImagesByEnvironment('puppeteer');
	} else {
		optimizeImagesByEnvironment('print');
	}
};

// 打印后恢复
const handleAfterPrint = () => {
	const container = document.querySelector('.report-container') as HTMLElement;
	const footerWrappers = document.querySelectorAll('.footer-wrapper') as NodeListOf<HTMLElement>;

	if (container) {
		// 恢复原始样式
		const originalHeight = container.dataset.originalHeight;
		const originalMinHeight = container.dataset.originalMinHeight;

		if (originalHeight && originalHeight !== 'auto') {
			container.style.height = originalHeight;
		}
		if (originalMinHeight && originalMinHeight !== 'auto') {
			container.style.minHeight = originalMinHeight;
		}

		// 清理临时数据
		delete container.dataset.originalHeight;
		delete container.dataset.originalMinHeight;

		// 重新计算高度
		setTimeout(() => {
			setReportContainerHeight();
		}, 100);
	}

	// 恢复footer包装器
	footerWrappers.forEach((footer) => {
		const originalHeight = footer.dataset.originalHeight;
		if (originalHeight) {
			footer.style.height = originalHeight;
			delete footer.dataset.originalHeight;
		}
	});

	// 恢复图片原始URL
	restoreImageUrls();
};

// 恢复图片原始URL
const restoreImageUrls = () => {
	const images = document.querySelectorAll('img[data-original-src]') as NodeListOf<HTMLImageElement>;
	console.log(`恢复 ${images.length} 个图片的原始URL`);

	images.forEach((img) => {
		if (img.dataset.originalSrc) {
			img.src = img.dataset.originalSrc;
			delete img.dataset.originalSrc;
		}
	});
};

// 生命周期钩子
onMounted(async () => {
	// 初始化Puppeteer优化
	optimizeForPuppeteer();

	applyMobileScale();

	window.addEventListener('resize', applyMobileScale);

	// 添加打印相关事件监听
	window.addEventListener('beforeprint', handleBeforePrint);
	window.addEventListener('afterprint', handleAfterPrint);

	// 初始化详情
	await initDetail();
	// 计算并设置报告容器高度
	setReportContainerHeight();

	// 添加 ResizeObserver 监听容器内容变化
	const container = document.querySelector('.report-container');
	if (container && 'ResizeObserver' in window) {
		resizeObserver = new ResizeObserver(debouncedSetHeight);
		resizeObserver.observe(container);
	}
});

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect();
		resizeObserver = null;
	}
});

// 设置报告容器高度为297mm的倍数
const setReportContainerHeight = () => {
	nextTick(() => {
		// 添加延迟确保所有内容都已渲染
		setTimeout(() => {
			const container = document.querySelector('.report-container') as HTMLElement;
			if (container) {
				// 检查是否在打印模式或打印预览模式
				const isPrinting = window.matchMedia('print').matches;
				const isPrintPreview = window.location.search.includes('print-preview');

				if (isPrinting || isPrintPreview) {
					// 打印模式下不设置固定高度，让内容自然流动
					container.style.height = 'auto';
					container.style.minHeight = 'auto';
					container.style.removeProperty('--content-height');
					return;
				}

				// 只在非打印模式下设置固定高度
				// 临时移除设置的高度，让容器自然展开以获取真实内容高度
				container.style.height = 'auto';
				container.style.minHeight = '297mm';

				// 强制重新计算布局
				container.offsetHeight;

				// 获取容器内容的实际高度（像素）
				const contentHeight = container.scrollHeight;

				// 使用浏览器的 CSS 单位转换来获取准确的 mm 到 px 的转换比例
				const testDiv = document.createElement('div');
				testDiv.style.position = 'absolute';
				testDiv.style.visibility = 'hidden';
				testDiv.style.width = '1px';
				testDiv.style.height = '297mm';
				testDiv.style.top = '-9999px';
				testDiv.style.left = '-9999px';
				document.body.appendChild(testDiv);
				const pageHeightPx = testDiv.offsetHeight;
				document.body.removeChild(testDiv);

				console.log('contentHeight:', contentHeight, 'pageHeightPx:', pageHeightPx);

				// 计算需要多少页，至少1页
				const pages = Math.max(1, Math.ceil(contentHeight / pageHeightPx));

				console.log('calculated pages:', pages);

				// 设置CSS变量
				container.style.setProperty('--content-height', pages.toString());

				// 直接设置高度为页数的倍数
				container.style.height = `${pages * 297}mm`;
				container.style.minHeight = `${pages * 297}mm`;
			}
		}, 100); // 延迟100ms确保渲染完成
	});
};

// 防抖函数
const debounce = (fn: Function, delay: number) => {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn.apply(null, args), delay);
	};
};

// 防抖的高度设置函数
const debouncedSetHeight = debounce(setReportContainerHeight, 300);

// 监听数据变化，重新计算高度
watch(
	data,
	() => {
		debouncedSetHeight();
	},
	{ deep: true, flush: 'post' }
);
const judgeExist = (type: 'plant' | 'office', ...fields: string[]) => {
	const list = type === 'plant' ? data.value.plantList : data.value.officeList;
	const judge = (field: string) => {
		return list.some((item: any) => {
			const current = item[field];
			if (typeof item === 'object') {
				return Array.isArray(current) ? current.length > 0 : current ? Object.values(current) : false;
			} else {
				return current || current === 0;
			}
		});
	};
	return fields.some((item) => {
		return judge(item);
	});
};

// 模拟初始化详情的函数
const initDetail = async () => {
	// data.value.parkPlantOfficeData = newData;
	loading.value = true;
	// console.log('开始获取报告详情', reportId)
	// // 使用假数据，不再调用真实接口
	// console.log('使用假数据初始化报告详情', reportId, route.params)
	try {
		const result = await reportApi.getDetaliReport(reportId, usersId);
		if (result.code === 200) {
			console.log('result>', result);
			data.value.reportDetail = result.data.reportDetailVos || [];
			// 报告数据
			data.value.serialNumber = result.data.serialNumber || '';
			data.value.carrierListVos = result.data.carrierListVos || [];
			// data.value.siteAnalysis = marked.parse(result.data.data.siteAnalysis)
			// console.log('data.value', data.value)
		}
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false;
	}
};

const handleElevator = ({ elevatorLength, elevatorWidth, elevatorHigh }: any) => {
	return [
		{
			label: '长',
			value: elevatorLength,
		},
		{
			label: '宽',
			value: elevatorWidth,
		},
		{
			label: '高',
			value: elevatorHigh,
		},
	]
		.map(({ label, value }) => {
			return value ? `${label}${value}` : '';
		})
		.filter((i) => i)
		.join('，');
};

console.log('报告data:', data.value);
const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function toUpperCase(num) {
	if (typeof num !== 'number' && typeof num !== 'string') return '';
	num = String(num);
	if (!/^\d+$/.test(num)) return '';
	let result = '';
	for (let i = 0; i < num.length; i++) {
		result += CN_NUM[Number(num[i])];
	}
	return result;
}

// 打印预览功能（优化版）
const printReport = () => {
	// 在打印前先处理样式
	handleBeforePrint();

	// 触发浏览器打印
	setTimeout(() => {
		window.print();
	}, 100);
};

// 原始打印功能（不进行图片优化）
const printReportWithoutOptimization = () => {
	const container = document.querySelector('.report-container') as HTMLElement;
	const footerWrappers = document.querySelectorAll('.footer-wrapper') as NodeListOf<HTMLElement>;

	if (container) {
		// 保存当前样式
		container.dataset.originalHeight = container.style.height;
		container.dataset.originalMinHeight = container.style.minHeight;

		// 打印时移除所有固定高度设置
		container.style.height = 'auto';
		container.style.minHeight = 'auto';
		container.style.removeProperty('--content-height');
	}

	// 处理footer包装器的高度
	footerWrappers.forEach((footer) => {
		footer.dataset.originalHeight = footer.style.height;
		footer.style.height = 'auto';
	});

	// 触发浏览器打印（不进行图片优化）
	setTimeout(() => {
		window.print();
	}, 100);
};

// 检查打印支持
const checkPrintSupport = () => {
	return 'print' in window && typeof window.print === 'function';
};

// 调试函数：显示当前容器高度信息
const debugContainerHeight = () => {
	const container = document.querySelector('.report-container') as HTMLElement;
	if (container) {
		console.log('Container info:', {
			height: container.style.height,
			minHeight: container.style.minHeight,
			scrollHeight: container.scrollHeight,
			offsetHeight: container.offsetHeight,
			clientHeight: container.clientHeight,
		});
	}
};

// 调试函数：手动测试图片优化
const testImageOptimization = (environment: 'normal' | 'print' | 'puppeteer' = 'print') => {
	console.log(`开始测试${environment}环境的图片优化...`);
	optimizeImagesByEnvironment(environment);

	// 3秒后恢复原始图片
	setTimeout(() => {
		console.log('恢复原始图片URL...');
		restoreImageUrls();
	}, 3000);
};
</script>
<style scoped lang="scss">
// 全局样式
html,
body {
	height: 100%;
	margin: 0;
	padding: 0;
	overflow-y: auto;
}

.report-page {
	background-color: #f3f3f5;
	position: relative;
	min-height: 100%;
	width: 100%;
	height: 100%;
	// overflow-y: auto;
}

.report-font {
	font-family: 'PingFang SC', sans-serif;
}

// 原Tailwind类名转换为SCSS
.min-width-wrapper {
	min-width: 1440px;
}

.bg-gray {
	background-color: #f3f3f5;
}

.header-wrapper {
	width: 100%;
	background-color: white;
	padding-top: 25px;
	padding-bottom: 25px;
	display: flex;
	justify-content: center;
	margin-bottom: 24px;

	.header-logo {
		width: 285px;
	}
}

.report-container {
	width: 210mm;
	min-height: 297mm;
	margin-left: auto;
	margin-right: auto;
	background-color: white;
	padding-bottom: 12px;
	// padding-top: 25px;
	position: relative;

	// 为打印添加页面分隔符标记
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: transparent;
		page-break-before: auto;
	}

	// width: 21cm;
	// min-height: 29.7cm;
	// margin: 1cm auto;
	// box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	// padding: 2cm;
	// background-color: #fff;
	.relative {
		position: relative;
		height: 297mm;
	}
}

.cover-image {
	width: 100%;
	height: 100%;
}

.page-title {
	font-family: 'FZLTTHK--GBK1';
	color: #222;
	font-weight: bold;
	font-size: 24px;
	text-align: center;
	margin-top: 50px;
}

.top-analysis {
	font-size: 16px;
	color: #222;
	line-height: 29px;
	margin-top: 18px;
	margin-bottom: 18px;
	padding-left: 40px;
	padding-right: 40px;
}

.reason-text {
	width: 100%;
	font-family:
		PingFang SC,
		PingFang SC;
	font-weight: 400;
	font-size: 16px;
	color: #303030;
	line-height: 34px;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.sec-title {
	// font-family: 'PingFang SC';
	// font-weight: 600;
	// color: #222;
	// font-size: 18px;
	// line-height: 29px;
	// margin-bottom: 12px;
	margin: 16px 0;
	height: 31px;
	font-family: 'PingFang SC, PingFang SC';
	font-weight: 600;
	font-size: 22px;
	color: #171717;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.thre-title {
	margin: 16px 0;
	height: 25px;
	font-family:
		PingFang SC,
		PingFang SC;
	font-weight: 500;
	font-size: 18px;
	color: #303030;
	text-align: left;
	font-style: normal;
	text-transform: none;
}

.content-padding {
	padding-left: 40px;
	padding-right: 40px;
}

.carrier-container {
	display: flex;
	justify-content: space-between;
}

.carrier-view {
	width: 320px;
	margin-bottom: 24px;
	border-radius: 4px;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	overflow: hidden;
	cursor: pointer;
	position: relative;
}

.vr-icon {
	position: absolute;
	top: 82.5px;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 10;
	width: 100px;
	height: 100px;
	background: url('@/assets/images/vr-animation.png') no-repeat;
	background-size: auto 100px;
	animation: vr-ani 3.08333333s 0s steps(74) infinite normal;
}

.pdf-icon {
	position: absolute;
	right: 6px;
	top: 6px;
	z-index: 10;

	img {
		width: 54px;
		height: 26px;
	}
}

.carrier-image-wrapper {
	width: 320px;
	height: 165px;
	position: relative;
	color: white;
	overflow: hidden;
}

.carrier-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: all 0.5s ease-in-out;
}

.carrier-view:hover .carrier-img {
	transform: scale(1.3);
}

.top-icon {
	width: 37px;
	height: 43px;
	position: absolute;
	top: 0;
	left: 0;
}

.img-cover {
	background: linear-gradient(180deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.14) 13%,
			rgba(0, 0, 0, 0.25) 28%,
			rgba(0, 0, 0, 0.33) 53%,
			rgba(0, 0, 0, 0.39) 75%,
			rgba(0, 0, 0, 0.5) 100%);
	backdrop-filter: blur(0px);
	position: absolute;
	bottom: 0;
	left: 0;
	height: 57px;
	width: 100%;
	padding-top: 5px;
	padding-left: 11px;
}

.carrier-name {
	font-size: 14px;
	font-weight: 500;
	line-height: 24px;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	overflow: hidden;
}

.carrier-info {
	font-size: 12px;
	line-height: 24px;
	display: flex;
	align-items: center;
	font-weight: 500;
}

.line {
	width: 1px;
	height: 12px;
	background: #fff;
	opacity: 0.5;
	margin-left: 12px;
	margin-right: 12px;
}

.carrier-detail {
	width: 320px;
	border: 1px solid #eee;
	padding: 12px;
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
}

.feature-text {
	color: #042d77;
	font-size: 13px;
	font-weight: 500;
	line-height: 20px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.address-wrapper {
	display: flex;
	align-items: center;
}

.address-text {
	font-size: 12px;
	line-height: 24px;
	color: #7d8086;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.analysis-view {
	background: linear-gradient(171deg, #fafbff 0%, #f1f7ff 100%);
	display: flex;
	align-items: center;
	padding: 18px;
	border-radius: 4px;
	color: #66686d;
	font-size: 16px;
	line-height: 29px;

	.ai-icon {
		width: 50px;
		height: 56px;
		margin-right: 18px;
		flex-shrink: 0;
	}
}

.my-10 {
	margin-top: 40px;
	margin-bottom: 40px;
}

.break-before-page {
	page-break-before: always;
}

.table-header {
	display: flex;
	color: #222222;
	font-weight: 600;
	font-size: 14px;

	div {
		flex: 1;
		text-align: center;
	}
}

.underline {
	text-decoration: underline;
}

.text-blue {
	color: #04286d;
}

.text-dark {
	color: #222;
}

.table-cell {
	display: flex;
	font-size: 13px;
	color: #666;
	margin-left: 40px;
	margin-right: 40px;
	border: 1px solid #e9ecf3;

	div {
		flex: 1;
		text-align: center;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		max-height: 52px;
		padding: 10px 2px;

		&:nth-child(1) {
			width: 20%;
		}

		&+div {
			border-left: 1px solid #e9ecf3;
		}
	}
}

.sub-title {
	font-size: 14px;
	color: #222222;
	font-weight: 600;
	line-height: 29px;
	padding: 6px 24px;
	background: #f5f7fa;
}

.footer-wrapper {
	// display: flex;
	// justify-content: center;
	position: relative;
	width: 210mm;
	margin-left: auto;
	margin-right: auto;
	height: 297mm;

	.footer-image {
		width: 100%;
		height: 100%;
	}

	.serial-number {
		position: absolute;
		color: #29497a;
		font-size: 18px;
		font-weight: 500;
		letter-spacing: 4px;
		top: 16px;
		right: 24px;
	}
}

.disclaimer-text {
	position: absolute;
	top: 280px;
	width: 740px;
	padding-left: 46px;
	padding-right: 46px;
	font-size: 14px;
	line-height: 28px;
	color: #3e4b58;
}

.qrcode-container {
	width: 277px;
	height: 370px;
	padding-top: 36px;
	position: fixed;
	top: 98px;
	left: 50%;
	transform: translateX(400px);
	background-color: white;
	border-radius: 16px;
}

.download-btn {
	border: 1px solid #e5e5f0;
	cursor: pointer;
	width: 127px;
	height: 56px;
	border-radius: 4px;
	background-color: #f4f6ff;
	margin: 0 auto;
	color: #1c66ff;
	font-size: 16px;
	display: flex;
	align-items: center;
	justify-content: center;

	.pdf-icon-small {
		width: 30px;
		height: 36px;
		margin-right: 10px;
	}
}

.divider {
	width: 233px;
	height: 1px;
	margin: 36px auto 0;
	background-color: #eee;
}

.qrcode-wrapper {
	margin-top: 27px;

	.qrcode-title {
		color: #222222;
		font-size: 18px;
		text-align: center;
	}

	.qrcode {
		width: 138px;
		height: 138px;
		display: block;
		margin: 16px auto 0;
	}
}

.low-price::after {
	content: '低';
	width: 20px;
	height: 18px;
	display: inline-flex;
	margin-left: 2px;
	justify-content: center;
	align-items: center;
	font-size: 11px;
	color: white;
	background: #d60000;
	border-radius: 3px;
}

/* A4 分页样式 */
.page-section {
	width: 21cm;
	min-height: 29.7cm;
	margin: 1cm auto;
	padding: 2cm;
	background-color: #fff;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	page-break-after: always;
	position: relative;

	// 页面头部
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2cm;
		background-color: #f8f9fa;
		border-bottom: 1px solid #e9ecef;
	}

	// 页面底部
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2cm;
		background-color: #f8f9fa;
		border-top: 1px solid #e9ecef;
	}
}

/* 打印样式 */
@media print {
	* {
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;
	}

	html,
	body {
		margin: 0;
		padding: 0;
		height: auto !important;
		min-height: auto !important;
		overflow: visible;
	}

	.report-page {
		box-shadow: none;
		margin: 0;
		padding: 0;
		width: 100%;
		height: auto !important;
		min-height: auto !important;
		background-color: white !important;
		overflow: visible;
	}

	.report-container {
		width: 100%;
		margin: 0;
		padding: 0mm 0mm;
		box-shadow: none;
		background-color: white !important;
		height: auto !important;
		min-height: auto !important;
		page-break-inside: auto;

		// 强制移除任何动态设置的高度
		&[style] {
			height: auto !important;
			min-height: auto !important;
		}

		// 移除伪元素可能造成的分页问题
		&::before {
			display: none !important;
		}
	}

	.footer-wrapper {
		page-break-before: always;
		width: 100%;
		margin: 0;
		height: auto !important;
		min-height: auto !important;
		display: block;
		position: relative;

		.footer-image {
			width: 100%;
			height: auto;
			max-height: none;
			object-fit: contain;
			display: block;
		}

		.serial-number {
			position: absolute;
			top: 16px;
			right: 24px;
		}

		// 移除第一个footer-wrapper的分页
		&:first-of-type {
			page-break-before: auto;
		}
	}

	// 隐藏不需要打印的元素
	.min-width-wrapper,
	.header-wrapper,
	.qrcode-container,
	.debug-info {
		display: none !important;
	}

	// 确保文本清晰和对齐
	.sec-title,
	.thre-title,
	.page-title {
		color: #000 !important;
		font-weight: bold !important;
	}

	// 调整内容边距避免偏右
	.content-padding {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.top-analysis {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	.table-cell {
		margin-left: 0 !important;
		margin-right: 0 !important;
	}

	// 表格打印优化
	.table-cell {
		border: 1px solid #000 !important;

		div {
			border-left: 1px solid #000 !important;
		}
	}

	// 图片打印优化
	img {
		max-width: 100% !important;
		height: auto !important;
		page-break-inside: avoid;
		image-rendering: optimizeQuality !important;
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;

		// 对于大图片，降低分辨率以减小PDF体积
		&.park-image,
		&.carrier-image {
			max-width: 600px !important;
			image-rendering: optimizeSpeed !important;
		}

		// 头像和小图标保持清晰度
		&.broker-avatar {
			max-width: 60px !important;
			max-height: 60px !important;
		}
	}

	// 避免在不合适的地方分页
	.carrier-view,
	.analysis-view,
	.sub-title+.table-cell {
		page-break-inside: avoid;
		break-inside: avoid;
	}

	// 标题和内容不分离
	.sec-title,
	.thre-title {
		page-break-after: avoid;
		break-after: avoid;
	}

	// 表格相关的分页控制
	.table-header {
		page-break-after: avoid;
		break-after: avoid;
	}

	.table-cell:first-of-type {
		page-break-before: avoid;
		break-before: avoid;
	}

	// 载体详情区域分页控制
	.carrier-container {
		page-break-inside: avoid;
		break-inside: avoid;
	}

	// 分析内容分页控制
	.top-analysis,
	.reason-text {
		orphans: 2;
		widows: 2;
	}

	// AddressReport 组件的分页控制
	.address-report {
		height: auto !important;
		min-height: auto !important;
		padding-left: 0 !important;
		padding-right: 0 !important;
		margin-left: 0 !important;
		margin-right: 0 !important;
		width: 100% !important;
	}

	// 避免每个载体项目都强制分页
	.break-after-page {
		page-break-after: auto !important;
		break-after: auto !important;
	}

	// 页面设置
	@page {
		size: A4;
		margin: 15mm 15mm;

		// 移除页眉页脚避免额外空间
		@top-center {
			content: none;
		}

		@bottom-center {
			content: none;
		}
	}

	// 确保第一页不显示页眉
	@page :first {
		@top-center {
			content: none;
		}
	}

	// PDF优化设置
	* {
		// 减少不必要的阴影和效果
		box-shadow: none !important;
		text-shadow: none !important;

		// 优化文本渲染
		text-rendering: optimizeSpeed !important;
		-webkit-font-smoothing: antialiased !important;
	}

	// 避免不必要的背景
	.bg-gray,
	.min-width-wrapper {
		background: white !important;
	}

	.page-section {
		page-break-after: auto;
		margin: 0;
		padding: 0;
		box-shadow: none;
		width: 100%;
		height: auto;

		&::before,
		&::after {
			display: none;
		}
	}
}

/* Puppeteer 专用样式 */
.puppeteer-env {
	.debug-info {
		display: none !important;
	}

	.report-container {
		width: 210mm !important;
		min-height: auto !important;
		height: auto !important;
		margin: 0 auto !important;
		background-color: white !important;
		box-shadow: none !important;
		padding: 0 !important;
		page-break-inside: auto;
	}

	.footer-wrapper {
		width: 210mm !important;
		height: auto !important;
		margin: 0 auto !important;
		page-break-before: always;
		position: relative;

		&:first-of-type {
			page-break-before: auto;
		}

		.footer-image {
			width: 100% !important;
			height: auto !important;
			display: block !important;
		}
	}

	// 确保字体渲染优化
	* {
		-webkit-font-smoothing: antialiased !important;
		-moz-osx-font-smoothing: grayscale !important;
		text-rendering: optimizeLegibility !important;
	}

	// 移除不必要的元素
	.min-width-wrapper,
	.header-wrapper,
	.qrcode-container,
	.bg-gray {
		display: none !important;
	}

	// 图片优化 - 保持封面合理大小
	img {
		max-width: 100% !important;
		height: auto !important;
		image-rendering: optimizeSpeed !important; // 优化速度而非质量
		-webkit-print-color-adjust: exact !important;
		print-color-adjust: exact !important;

		// 封面图片保持合理尺寸
		&.footer-image {
			width: 100% !important;
			height: auto !important;
			max-width: none !important;
			max-height: none !important;
		}

		&.park-image,
		&.carrier-image,
		&.floor-image {
			max-width: 150px !important;
			max-height: 100px !important;
		}

		&.broker-avatar {
			max-width: 30px !important;
			max-height: 30px !important;
		}
	}

	// 移除装饰性元素以减小PDF大小
	.carrier-view:hover .carrier-img,
	.img-cover,
	.top-icon,
	.vr-icon,
	.pdf-icon {
		display: none !important;
	}

	// 简化边框和阴影
	* {
		box-shadow: none !important;
		border-radius: 0 !important;
		text-shadow: none !important;
		background-image: none !important;
	}

	// 表格优化
	.table-cell {
		border: 1px solid #000 !important;
		margin: 0 !important;

		div {
			border-left: 1px solid #000 !important;
		}
	}

	// 文本优化
	.sec-title,
	.thre-title,
	.page-title {
		color: #000 !important;
		font-weight: 600 !important;
	}

	// 内容边距优化
	.content-padding {
		padding-left: 15mm !important;
		padding-right: 15mm !important;
	}

	.top-analysis {
		padding-left: 15mm !important;
		padding-right: 15mm !important;
	}
}

.market-cs {
	// Markdown 文本基础样式
	font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
	line-height: 1.8;
	color: #333;
	font-size: 14px;

	// 基础间距
	margin: 0;
	padding: 0;

	// 文本对齐
	text-align: justify;

	// 首行缩进
	text-indent: 2em;

	// 标题样式
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-weight: 600;
		margin: 24px 0 16px 0;
		color: #222;

		&:first-child {
			margin-top: 0;
		}
	}

	h1 {
		font-size: 24px;
		border-bottom: 2px solid #eaecef;
		padding-bottom: 8px;
	}

	h2 {
		font-size: 20px;
		border-bottom: 1px solid #eaecef;
		padding-bottom: 6px;
	}

	h3 {
		font-size: 18px;
	}

	h4 {
		font-size: 16px;
	}

	h5,
	h6 {
		font-size: 14px;
	}

	// 段落样式
	p {
		margin: 16px 0;
		text-align: justify;
		text-indent: 2em; // 首行缩进
	}

	// 列表样式
	ul,
	ol {
		margin: 16px 0;
		padding-left: 24px;

		li {
			margin: 8px 0;
			line-height: 1.6;
		}
	}

	ul {
		list-style-type: disc;
	}

	ol {
		list-style-type: decimal;
	}

	// 强调样式
	strong,
	b {
		font-weight: 600;
		color: #222;
	}

	em,
	i {
		font-style: italic;
		color: #666;
	}

	// 代码样式
	code {
		background-color: #f6f8fa;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Consolas', 'Monaco', monospace;
		font-size: 13px;
		color: #e36209;
	}

	pre {
		background-color: #f6f8fa;
		padding: 16px;
		border-radius: 6px;
		overflow-x: auto;
		margin: 16px 0;

		code {
			background: none;
			padding: 0;
			color: #333;
		}
	}

	// 引用样式
	blockquote {
		border-left: 4px solid #1c66ff;
		padding-left: 16px;
		margin: 16px 0;
		color: #666;
		font-style: italic;
		background-color: #f8f9fa;
		padding: 12px 16px;
		border-radius: 0 4px 4px 0;
	}

	// 分割线
	hr {
		border: none;
		border-top: 1px solid #eaecef;
		margin: 24px 0;
	}

	// 链接样式
	a {
		color: #1c66ff;
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	// 表格样式
	table {
		border-collapse: collapse;
		width: 100%;
		margin: 16px 0;

		th,
		td {
			border: 1px solid #eaecef;
			padding: 8px 12px;
			text-align: left;
		}

		th {
			background-color: #f6f8fa;
			font-weight: 600;
		}

		tr:nth-child(even) {
			background-color: #f8f9fa;
		}
	}

	// 图片样式
	img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		margin: 8px 0;
	}

	// 排除 DetailSupport 中的图片样式
	.support-icon img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		max-width: 100%;
		max-height: 100%;
		margin: 0;
		border-radius: 0;
	}

	// 特殊字段样式
	.highlight {
		background-color: #fff3cd;
		padding: 2px 4px;
		border-radius: 3px;
		color: #856404;
	}

	// 数据字段样式
	.data-field {
		font-weight: 500;
		color: #1c66ff;
	}

	// 数值样式
	.number {
		font-family: 'Consolas', 'Monaco', monospace;
		color: #e36209;
		font-weight: 600;
	}

	// 百分比样式
	.percentage {
		color: #28a745;
		font-weight: 600;
	}

	// 时间样式
	.time {
		color: #6c757d;
		font-style: italic;
	}

	// 地址样式
	.address {
		color: #495057;
		font-family: 'Consolas', 'Monaco', monospace;
	}

	// 公司名称样式
	.company {
		font-weight: 600;
		color: #222;
	}

	// 政策相关样式
	.policy {
		background-color: #d1ecf1;
		border-left: 4px solid #17a2b8;
		padding: 12px 16px;
		margin: 16px 0;
		border-radius: 0 4px 4px 0;
	}

	// 优势样式
	.advantage {
		background-color: #d4edda;
		border-left: 4px solid #28a745;
		padding: 12px 16px;
		margin: 16px 0;
		border-radius: 0 4px 4px 0;
	}

	// 注意事项样式
	.notice {
		background-color: #fff3cd;
		border-left: 4px solid #ffc107;
		padding: 12px 16px;
		margin: 16px 0;
		border-radius: 0 4px 4px 0;
	}
}

// 排除 DetailSupport 中的图片样式
:deep .support-icon img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	max-width: 100%;
	max-height: 100%;
	margin: 0;
	border-radius: 0;
}

:global(html, body) {
	height: auto;
	min-height: 100vh;
	overflow-x: hidden;
	overflow-y: auto;
}

:global(#app) {
	height: auto;
	min-height: 100vh;
}
</style>
