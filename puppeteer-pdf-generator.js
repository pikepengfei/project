const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

/**
 * 使用Puppeteer生成PDF报告
 * @param {Object} options - 配置选项
 * @param {string} options.url - 报告页面URL
 * @param {string} options.outputPath - PDF输出路径
 * @param {Object} options.pdfOptions - PDF生成选项
 * @param {number} options.timeout - 页面加载超时时间
 * @param {boolean} options.debug - 是否启用调试模式
 */
async function generateReportPDF(options = {}) {
	const { url, outputPath = './report.pdf', timeout = 30000, debug = false, pdfOptions = {} } = options;

	if (!url) {
		throw new Error('URL是必需的参数');
	}

	let browser;
	try {
		console.log('正在启动Puppeteer浏览器...');
		
		// 启动浏览器 - 增加超时时间和更多配置
		browser = await puppeteer.launch({
			headless: !debug, // 调试模式下显示浏览器
			timeout: 60000, // 增加浏览器启动超时时间到60秒
			protocolTimeout: 60000, // 增加协议超时时间
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-web-security',
				'--allow-running-insecure-content',
				'--disable-features=VizDisplayCompositor',
				'--font-render-hinting=none', // 改善字体渲染
				'--disable-gpu', // 禁用GPU加速
				'--disable-software-rasterizer',
				'--disable-background-timer-throttling',
				'--disable-backgrounding-occluded-windows',
				'--disable-renderer-backgrounding',
				'--no-first-run',
				'--no-default-browser-check',
			],
			// 设置默认视窗大小为A4纸张比例 - 优化文件大小
			defaultViewport: {
				width: 794, // 210mm at 96dpi
				height: 1123, // 297mm at 96dpi
				deviceScaleFactor: 2, // 高DPI渲染
			},
		});
		
		console.log('浏览器启动成功');

		const page = await browser.newPage();

		// 设置页面选项 - 优化文件大小
		await page.setViewport({
			width: 794,
			height: 1123,
			deviceScaleFactor: 2,
		});

		// 设置用户代理以便前端识别
		await page.setUserAgent(
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36'
		);

		// 监听控制台输出（调试用）
		page.on('console', (msg) => {
			const type = msg.type();
			const text = msg.text();
			console.log(`[页面 ${type.toUpperCase()}]:`, text);
		});

		page.on('pageerror', (error) => {
			console.log('[页面错误]:', error.message);
		});

		// 监听请求失败
		page.on('requestfailed', (request) => {
			console.log('[请求失败]:', request.url(), request.failure()?.errorText);
		});

		// 监听响应错误
		page.on('response', (response) => {
			if (!response.ok()) {
				console.log(`[响应错误]: ${response.url()} - ${response.status()}`);
			}
		});

		// 构建带有Puppeteer标识的URL
		const targetUrl = new URL(url);
		targetUrl.searchParams.set('puppeteer', 'true');
		targetUrl.searchParams.set('pdf', 'true');

		console.log('正在加载页面:', targetUrl.toString());

		// 访问页面 - 优化超时设置
		try {
			await page.goto(targetUrl.toString(), {
				waitUntil: ['networkidle2'], // 改为更宽松的等待条件
				timeout: Math.max(timeout, 60000), // 确保至少60秒超时
			});
			console.log('页面导航完成');
		} catch (error) {
			console.log('页面导航可能超时，尝试继续:', error.message);
			// 如果导航超时，仍然尝试继续生成PDF
		}

		// 优化页面图片以减小PDF文件大小
		await page.evaluate(() => {
			const images = document.querySelectorAll('img');
			images.forEach(img => {
				// 如果图片很大，减小其显示尺寸
				// if (img.naturalWidth > 800) {
				// 	img.style.maxWidth = '800px';
				// 	img.style.height = 'auto';
				// }
				// 降低图片质量属性（如果支持）
				// img.style.imageRendering = 'optimizeSpeed';
			});
		});

		// 等待字体加载完成
		try {
			await page.evaluateHandle(() => document.fonts.ready);
			console.log('字体加载完成');
		} catch (error) {
			console.log('字体加载可能失败，继续:', error.message);
		}

		// 等待Puppeteer准备就绪信号
		console.log('等待页面准备信号...');
		await page
			.waitForFunction(() => window.puppeteerReady === true, {
				timeout: 15000, // 增加超时时间到15秒
			})
			.then(() => {
				console.log('收到页面准备信号');
			})
			.catch(() => {
				console.log('警告: 未收到puppeteerReady信号，继续生成PDF');
			});

		// 等待所有图片加载完成
		console.log('等待图片加载...');
		await page.evaluate(() => {
			return new Promise((resolve) => {
				const images = Array.from(document.querySelectorAll('img'));
				let loadedCount = 0;
				const totalImages = images.length;
				
				console.log(`找到 ${totalImages} 个图片`);

				if (totalImages === 0) {
					console.log('页面中没有图片');
					resolve();
					return;
				}

				const checkComplete = () => {
					loadedCount++;
					console.log(`图片加载进度: ${loadedCount}/${totalImages}`);
					if (loadedCount === totalImages) {
						console.log('所有图片加载完成！');
						resolve();
					}
				};

				images.forEach((img, index) => {
					if (img.complete) {
						console.log(`图片 ${index + 1} 已缓存: ${img.src.substring(0, 100)}...`);
						checkComplete();
					} else {
						console.log(`等待图片 ${index + 1} 加载: ${img.src.substring(0, 100)}...`);
						img.addEventListener('load', () => {
							console.log(`✓ 图片 ${index + 1} 加载成功`);
							checkComplete();
						});
						img.addEventListener('error', () => {
							console.log(`✗ 图片 ${index + 1} 加载失败: ${img.src}`);
							checkComplete();
						});
					}
				});

				// 8秒超时
				setTimeout(() => {
					console.log(`图片加载超时 (${loadedCount}/${totalImages} 已加载)，继续生成PDF`);
					resolve();
				}, 8000);
			});
		});

		console.log('图片加载完成，等待页面渲染...');
		
		// 获取页面优化信息
		const pageInfo = await page.evaluate(() => {
			const images = document.querySelectorAll('img');
			const isPuppeteerEnv = window.navigator.webdriver || 
								   window.navigator.userAgent.includes('HeadlessChrome') ||
								   window.location.search.includes('puppeteer=true');
			
			const imageInfo = Array.from(images).map((img, index) => ({
				index: index + 1,
				src: img.src.substring(0, 80) + (img.src.length > 80 ? '...' : ''),
				size: `${img.naturalWidth || 0}x${img.naturalHeight || 0}`,
				displayed: `${img.width || 0}x${img.height || 0}`,
				complete: img.complete,
				classes: Array.from(img.classList).join(' ')
			}));
			
			return {
				isPuppeteerDetected: isPuppeteerEnv,
				puppeteerReady: window.puppeteerReady,
				totalImages: images.length,
				imageDetails: imageInfo,
				documentReady: document.readyState,
				url: window.location.href
			};
		});
		
		console.log('=== 页面优化信息 ===');
		console.log(`Puppeteer环境检测: ${pageInfo.isPuppeteerDetected ? '✓' : '✗'}`);
		console.log(`PuppeteerReady信号: ${pageInfo.puppeteerReady ? '✓' : '✗'}`);
		console.log(`文档状态: ${pageInfo.documentReady}`);
		console.log(`页面URL: ${pageInfo.url}`);
		console.log(`图片总数: ${pageInfo.totalImages}`);
		
		if (pageInfo.imageDetails.length > 0) {
			console.log('=== 图片详情 ===');
			pageInfo.imageDetails.forEach(img => {
				console.log(`图片${img.index}: ${img.src}`);
				console.log(`  原始尺寸: ${img.size} | 显示尺寸: ${img.displayed} | 状态: ${img.complete ? '✓' : '✗'}`);
				if (img.classes) console.log(`  CSS类: ${img.classes}`);
			});
		}
		
		// 额外等待确保内容完全渲染
		await new Promise((resolve) => setTimeout(resolve, 3000));

		console.log('页面加载完成，开始生成PDF...');

		// 默认PDF选项 - 优化文件大小
		const defaultPdfOptions = {
			format: 'A4',
			printBackground: true,
			margin: {
				top: '0mm',
				right: '0mm',
				bottom: '0mm',
				left: '0mm',
			},
			preferCSSPageSize: true,
			displayHeaderFooter: false,
			// 优化PDF质量和文件大小
			omitBackground: false, // 保留背景但优化处理
			// 移除 quality 和 tagged 以减小文件大小
		};

		// 合并PDF选项
		const finalPdfOptions = { ...defaultPdfOptions, ...pdfOptions };

		// 生成PDF
		const pdfBuffer = await page.pdf(finalPdfOptions);

		// 保存PDF文件
		await fs.writeFile(outputPath, pdfBuffer);

		console.log(`PDF生成成功: ${outputPath}`);
		console.log(`文件大小: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);

		return {
			success: true,
			outputPath,
			fileSize: pdfBuffer.length,
		};
	} catch (error) {
		console.error('PDF生成失败:', error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

/**
 * 批量生成PDF报告
 * @param {Array} reports - 报告配置数组
 */
async function generateBatchReports(reports) {
	const results = [];

	for (const report of reports) {
		try {
			console.log(`正在生成报告: ${report.name || report.url}`);
			const result = await generateReportPDF(report);
			results.push({ ...result, name: report.name });
		} catch (error) {
			console.error(`报告生成失败 ${report.name}:`, error.message);
			results.push({
				success: false,
				name: report.name,
				error: error.message,
			});
		}
	}

	return results;
}

// 使用示例
async function example() {
	try {
		// 单个PDF生成
		await generateReportPDF({
			url: 'http://localhost:3000/report/temp3/123/456', // 替换为实际URL
			outputPath: './reports/report-123.pdf',
			timeout: 60000,
			debug: false, // 设置为true可以看到浏览器运行过程
			pdfOptions: {
				format: 'A4',
				margin: {
					top: '10mm',
					right: '10mm',
					bottom: '10mm',
					left: '10mm',
				},
			},
		});

		// 批量生成示例
		const batchReports = [
			{
				name: '报告1',
				url: 'http://localhost:3000/report/temp3/123/456',
				outputPath: './reports/report-1.pdf',
			},
			{
				name: '报告2',
				url: 'http://localhost:3000/report/temp3/789/012',
				outputPath: './reports/report-2.pdf',
			},
		];

		const results = await generateBatchReports(batchReports);
		console.log('批量生成结果:', results);
	} catch (error) {
		console.error('示例执行失败:', error);
	}
}

// 导出函数
module.exports = {
	generateReportPDF,
	generateBatchReports,
};

// 如果直接运行此脚本
if (require.main === module) {
	example();
}
