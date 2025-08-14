const express = require('express');
const { generateReportPDF } = require('./puppeteer-pdf-generator');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3001;

// CORS中间件
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

	// 处理预检请求
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 创建reports目录
const ensureReportsDir = async () => {
	const reportsDir = path.join(__dirname, 'reports');
	try {
		await fs.access(reportsDir);
	} catch {
		await fs.mkdir(reportsDir, { recursive: true });
	}
};

/**
 * PDF生成API端点
 * POST /api/generate-pdf
 * Body: {
 *   url: string,
 *   reportId?: string,
 *   filename?: string,
 *   options?: object
 * }
 */
app.post('/api/generate-pdf', async (req, res) => {
	try {
		const { url, reportId = Date.now().toString(), filename, options = {} } = req.body;

		if (!url) {
			return res.status(400).json({
				success: false,
				error: 'URL参数是必需的',
			});
		}

		// 确保reports目录存在
		await ensureReportsDir();

		// 生成文件名
		const outputFilename = filename || `report-${reportId}-${Date.now()}.pdf`;
		const outputPath = path.join(__dirname, 'reports', outputFilename);

		console.log(`开始生成PDF: ${url}`);

		// 生成PDF - 优化文件大小
		const result = await generateReportPDF({
			url,
			outputPath,
			timeout: 60000,
			debug: false,
			pdfOptions: {
				format: 'A4',
				printBackground: true,
				margin: {
					top: '0mm',
					right: '0mm',
					bottom: '0mm',
					left: '0mm',
				},
				// 文件大小优化选项
				omitBackground: false,
				scale: 0.85, // 适中的缩放比例，保持图片可读性
				// deviceScaleFactor: 1.5, // 适中的设备缩放因子
				preferCSSPageSize: true,
				// displayHeaderFooter: false, // 关闭页眉页脚以减小文件大小
				...options, // 从前端传来的额外选项会覆盖默认值
			},
		});

		res.json({
			success: true,
			message: 'PDF生成成功',
			data: {
				filename: outputFilename,
				path: outputPath,
				size: result.fileSize,
				downloadUrl: `/api/download/${outputFilename}`,
			},
		});
	} catch (error) {
		console.error('PDF生成失败:', error);
		res.status(500).json({
			success: false,
			error: error.message || 'PDF生成失败',
		});
	}
});

/**
 * PDF下载端点
 * GET /api/download/:filename
 */
app.get('/api/download/:filename', async (req, res) => {
	try {
		const { filename } = req.params;
		const filePath = path.join(__dirname, 'reports', filename);

		// 检查文件是否存在
		try {
			await fs.access(filePath);
		} catch {
			return res.status(404).json({
				success: false,
				error: '文件未找到',
			});
		}

		// 设置响应头
		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

		// 发送文件
		res.sendFile(filePath);
	} catch (error) {
		console.error('文件下载失败:', error);
		res.status(500).json({
			success: false,
			error: '文件下载失败',
		});
	}
});

/**
 * 获取PDF列表
 * GET /api/reports
 */
app.get('/api/reports', async (req, res) => {
	try {
		const reportsDir = path.join(__dirname, 'reports');

		// 确保目录存在
		await ensureReportsDir();

		const files = await fs.readdir(reportsDir);
		const pdfFiles = files.filter((file) => file.endsWith('.pdf'));

		const fileList = await Promise.all(
			pdfFiles.map(async (filename) => {
				const filePath = path.join(reportsDir, filename);
				const stats = await fs.stat(filePath);

				return {
					filename,
					size: stats.size,
					created: stats.birthtime,
					modified: stats.mtime,
					downloadUrl: `/api/download/${filename}`,
				};
			})
		);

		res.json({
			success: true,
			data: fileList.sort((a, b) => b.created - a.created),
		});
	} catch (error) {
		console.error('获取报告列表失败:', error);
		res.status(500).json({
			success: false,
			error: '获取报告列表失败',
		});
	}
});

/**
 * 删除PDF文件
 * DELETE /api/reports/:filename
 */
app.delete('/api/reports/:filename', async (req, res) => {
	try {
		const { filename } = req.params;
		const filePath = path.join(__dirname, 'reports', filename);

		// 检查文件是否存在
		try {
			await fs.access(filePath);
		} catch {
			return res.status(404).json({
				success: false,
				error: '文件未找到',
			});
		}

		// 删除文件
		await fs.unlink(filePath);

		res.json({
			success: true,
			message: '文件删除成功',
		});
	} catch (error) {
		console.error('文件删除失败:', error);
		res.status(500).json({
			success: false,
			error: '文件删除失败',
		});
	}
});

/**
 * 健康检查端点
 */
app.get('/health', (req, res) => {
	res.json({
		success: true,
		message: 'PDF生成服务运行正常',
		timestamp: new Date().toISOString(),
	});
});

// 启动服务器
app.listen(port, async () => {
	await ensureReportsDir();
	console.log(`PDF生成服务器运行在端口 ${port}`);
	console.log(`健康检查: http://localhost:${port}/health`);
	console.log(`API文档:`);
	console.log(`  POST /api/generate-pdf - 生成PDF`);
	console.log(`  GET  /api/reports - 获取PDF列表`);
	console.log(`  GET  /api/download/:filename - 下载PDF`);
	console.log(`  DELETE /api/reports/:filename - 删除PDF`);
});

module.exports = app;
