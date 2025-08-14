const http = require('http');

console.log('🧪 测试封面大小修复...');

const postData = JSON.stringify({
  url: 'http://localhost:8899/report/temp3/1952661286780297217/1904469602410389505',
  reportId: 'cover-size-test',
  filename: `cover-size-test-${Date.now()}.pdf`,
  options: {
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    scale: 0.8,
    deviceScaleFactor: 1.2
  }
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/generate-pdf',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.success) {
        const sizeInMB = (result.data.size / 1024 / 1024).toFixed(2);
        console.log('✅ PDF生成成功');
        console.log(`📁 文件名: ${result.data.filename}`);
        console.log(`📦 文件大小: ${sizeInMB} MB`);
        console.log(`📥 下载链接: http://localhost:3001${result.data.downloadUrl}`);
        console.log('📋 请检查PDF中的封面和封底图片是否大小正常');
      } else {
        console.log('❌ 生成失败:', result.error);
      }
    } catch (error) {
      console.log('❌ 解析响应失败:', error.message);
      console.log('原始响应:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ 请求失败:', error.message);
});

req.write(postData);
req.end();
