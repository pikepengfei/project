const fetch = require('node-fetch');

async function testPDFGeneration() {
    const PDF_SERVER_URL = 'http://localhost:3001';
    
    console.log('开始测试PDF生成...');
    
    try {
        // 先检查服务器健康状态
        console.log('检查服务器状态...');
        const healthResponse = await fetch(`${PDF_SERVER_URL}/health`);
        const healthResult = await healthResponse.json();
        console.log('服务器状态:', healthResult);
        
        // 生成一个简单的PDF测试
        console.log('开始生成测试PDF...');
        const pdfResponse = await fetch(`${PDF_SERVER_URL}/api/generate-pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: 'https://www.baidu.com',
                reportId: 'test-baidu',
                filename: 'test-baidu.pdf',
                options: {
                    format: 'A4',
                    printBackground: true,
                    margin: {
                        top: '0mm',
                        right: '0mm',
                        bottom: '0mm',
                        left: '0mm'
                    }
                }
            })
        });
        
        const pdfResult = await pdfResponse.json();
        console.log('PDF生成结果:', pdfResult);
        
        if (pdfResult.success) {
            console.log('✓ PDF生成成功!');
            console.log('文件名:', pdfResult.data.filename);
            console.log('文件大小:', pdfResult.data.size, 'bytes');
            console.log('下载URL:', pdfResult.data.downloadUrl);
        } else {
            console.log('✗ PDF生成失败:', pdfResult.error);
        }
        
    } catch (error) {
        console.error('测试失败:', error.message);
    }
}

testPDFGeneration().catch(console.error);
