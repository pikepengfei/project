# Puppeteer PDF 生成指南

本文档介绍如何使用 Puppeteer 在服务器端生成高质量的投资报告 PDF。

## 安装依赖

```bash
# 安装 Puppeteer
npm install puppeteer

# 如果需要 Express 服务器
npm install express
```

## 基本用法

### 1. 直接使用 Puppeteer 脚本

```javascript
const { generateReportPDF } = require('./puppeteer-pdf-generator');

// 生成单个PDF
await generateReportPDF({
    url: 'http://localhost:3000/report/temp3/123/456?puppeteer=true',
    outputPath: './reports/report-123.pdf',
    timeout: 60000,
    debug: false
});
```

### 2. 使用 Express API 服务器

启动PDF生成服务器：

```bash
node pdf-server.js
```

通过API生成PDF：

```bash
curl -X POST http://localhost:3001/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:3000/report/temp3/123/456",
    "reportId": "123",
    "filename": "investment-report-123.pdf"
  }'
```

## 前端优化特性

### 1. 自动检测 Puppeteer 环境

前端代码会自动检测是否在 Puppeteer 环境中运行：

- 检测 `navigator.webdriver` 
- 检测 `HeadlessChrome` 用户代理
- 检测 URL 参数 `puppeteer=true` 或 `pdf=true`

### 2. 专用样式优化

当检测到 Puppeteer 环境时，会自动应用专用样式：

- 隐藏调试信息和不必要的UI元素
- 优化字体渲染和图片质量
- 确保A4页面尺寸和分页效果
- 使用高DPI渲染确保清晰度

### 3. 图片优化策略

根据图片类型应用不同的优化策略：

- **大图片**（封面、载体图片）：适度压缩，保持质量
- **头像图片**：保持清晰度，小尺寸优化
- **其他图片**：平衡质量和文件大小

### 4. 字体加载等待

确保所有字体加载完成后再生成PDF：

```javascript
// 前端会设置这个标志
window.puppeteerReady = true;
```

## 配置选项

### PDF生成选项

```javascript
const pdfOptions = {
    format: 'A4',                // 页面格式
    printBackground: true,       // 打印背景
    margin: {                    // 页边距
        top: '0mm',
        right: '0mm', 
        bottom: '0mm',
        left: '0mm'
    },
    preferCSSPageSize: true,     // 使用CSS页面尺寸
    displayHeaderFooter: false,  // 不显示页眉页脚
    quality: 100,               // 图片质量
    tagged: true                // 启用文本选择
};
```

### 浏览器启动选项

```javascript
const launchOptions = {
    headless: true,             // 无头模式
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--font-render-hinting=none'
    ],
    defaultViewport: {
        width: 794,             // A4宽度 (210mm)
        height: 1123,           // A4高度 (297mm) 
        deviceScaleFactor: 2    // 高DPI
    }
};
```

## API 端点

### POST /api/generate-pdf

生成PDF文件

**请求体:**
```json
{
    "url": "http://localhost:3000/report/temp3/123/456",
    "reportId": "123",
    "filename": "report-123.pdf",
    "options": {
        "format": "A4",
        "margin": {
            "top": "10mm"
        }
    }
}
```

**响应:**
```json
{
    "success": true,
    "message": "PDF生成成功",
    "data": {
        "filename": "report-123.pdf",
        "path": "/path/to/report-123.pdf",
        "size": 1234567,
        "downloadUrl": "/api/download/report-123.pdf"
    }
}
```

### GET /api/reports

获取所有生成的PDF列表

**响应:**
```json
{
    "success": true,
    "data": [
        {
            "filename": "report-123.pdf",
            "size": 1234567,
            "created": "2024-01-01T00:00:00.000Z",
            "modified": "2024-01-01T00:00:00.000Z",
            "downloadUrl": "/api/download/report-123.pdf"
        }
    ]
}
```

### GET /api/download/:filename

下载PDF文件

### DELETE /api/reports/:filename

删除PDF文件

## 使用建议

### 1. 性能优化

- 使用图片CDN加速
- 预加载关键资源
- 避免大量同时请求

### 2. 质量优化

- 确保网络稳定
- 设置合适的超时时间
- 使用高质量字体

### 3. 错误处理

- 监听页面错误
- 设置重试机制
- 记录详细日志

### 4. 安全考虑

- 验证URL合法性
- 限制文件大小
- 定期清理临时文件

## 故障排除

### 常见问题

1. **字体渲染问题**
   - 确保服务器安装了必要的字体
   - 使用 `--font-render-hinting=none` 参数

2. **图片加载失败**
   - 检查图片URL是否可访问
   - 增加图片加载等待时间

3. **PDF文件过大**
   - 调整图片压缩质量
   - 使用更激进的压缩参数

4. **分页问题**
   - 检查CSS分页样式
   - 调整内容高度计算

### 调试模式

启用调试模式查看详细信息：

```javascript
await generateReportPDF({
    url: 'your-url',
    debug: true  // 显示浏览器窗口和控制台输出
});
```

## 部署建议

### Docker 部署

```dockerfile
FROM node:16-alpine

# 安装 Puppeteer 依赖
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# 设置 Puppeteer 使用系统 Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

EXPOSE 3001
CMD ["node", "pdf-server.js"]
```

### 环境变量

```bash
# 端口设置
PORT=3001

# Puppeteer 配置
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 超时设置
PDF_GENERATION_TIMEOUT=60000
```

## 许可证

本项目遵循 MIT 许可证。
