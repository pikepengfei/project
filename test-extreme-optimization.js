/**
 * PDF极致优化测试脚本
 */

const https = require('https');
const http = require('http');

const PDF_SERVER_URL = 'http://localhost:3001';
const REPORT_URL = 'http://localhost:8899/report/temp3/1952661286780297217/1904469602410389505';

// 简单的HTTP请求函数
function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = http.request(requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (e) {
                    resolve(data);
                }
            });
        });

        req.on('error', reject);
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

async function testPDFOptimization() {
    console.log('🚀 开始PDF极致优化测试...');
    console.log('报告URL:', REPORT_URL);
    
    try {
        // 检查服务器状态
        console.log('\n📡 检查服务器状态...');
        const health = await httpRequest(`${PDF_SERVER_URL}/health`);
        console.log('服务器状态:', health.message);
        
        // 测试配置
        const testConfigs = [
            {
                name: '🔥 极致压缩',
                description: '最小文件大小，可能影响质量',
                options: {
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
                    scale: 0.5,              // 极小缩放
                    deviceScaleFactor: 0.8,  // 超低DPI
                    preferCSSPageSize: true,
                    displayHeaderFooter: false
                }
            },
            {
                name: '⚡ 激进优化',
                description: '平衡文件大小和质量',
                options: {
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '2mm', right: '2mm', bottom: '2mm', left: '2mm' },
                    scale: 0.7,
                    deviceScaleFactor: 1.0,
                    preferCSSPageSize: true
                }
            },
            {
                name: '🎯 平衡模式',
                description: '质量和大小的平衡',
                options: {
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
                    scale: 0.8,
                    deviceScaleFactor: 1.2
                }
            },
            {
                name: '📄 质量优先',
                description: '高质量，文件较大',
                options: {
                    format: 'A4',
                    printBackground: true,
                    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
                    scale: 1.0,
                    deviceScaleFactor: 1.5
                }
            }
        ];

        const results = [];
        
        for (let i = 0; i < testConfigs.length; i++) {
            const config = testConfigs[i];
            console.log(`\n${i + 1}/${testConfigs.length} 测试: ${config.name}`);
            console.log(`📝 ${config.description}`);
            console.log('⚙️  参数:', JSON.stringify(config.options, null, 2));
            
            const filename = `extreme-optimization-${config.name.replace(/[^\w]/g, '')}-${Date.now()}.pdf`;
            
            try {
                const startTime = Date.now();
                
                const response = await httpRequest(`${PDF_SERVER_URL}/api/generate-pdf`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: REPORT_URL,
                        reportId: 'extreme-optimization-test',
                        filename,
                        options: config.options
                    })
                });

                const endTime = Date.now();
                const duration = endTime - startTime;
                
                if (response.success) {
                    const sizeInMB = (response.data.size / 1024 / 1024).toFixed(2);
                    const sizeInKB = (response.data.size / 1024).toFixed(0);
                    
                    results.push({
                        name: config.name,
                        size: response.data.size,
                        sizeInMB,
                        duration,
                        filename
                    });
                    
                    console.log(`✅ 成功生成: ${filename}`);
                    console.log(`📦 文件大小: ${sizeInMB} MB (${sizeInKB} KB)`);
                    console.log(`⏱️  生成时间: ${duration}ms`);
                    console.log(`📥 下载: ${PDF_SERVER_URL}${response.data.downloadUrl}`);
                } else {
                    console.log(`❌ 失败: ${response.error}`);
                }
            } catch (error) {
                console.log(`💥 错误: ${error.message}`);
            }
            
            // 等待间隔避免服务器压力
            if (i < testConfigs.length - 1) {
                console.log('⏳ 等待2秒...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // 显示结果汇总
        if (results.length > 0) {
            console.log('\n📊 优化结果汇总:');
            console.log('=' * 60);
            results.sort((a, b) => a.size - b.size);
            
            results.forEach((result, index) => {
                const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                console.log(`${rank} ${result.name}: ${result.sizeInMB} MB (${result.duration}ms)`);
            });
            
            const smallest = results[0];
            const largest = results[results.length - 1];
            const reduction = ((largest.size - smallest.size) / largest.size * 100).toFixed(1);
            
            console.log('\n🎯 优化效果:');
            console.log(`最小文件: ${smallest.sizeInMB} MB (${smallest.name})`);
            console.log(`最大文件: ${largest.sizeInMB} MB (${largest.name})`);
            console.log(`压缩率: ${reduction}%`);
        }
        
        console.log('\n🎉 极致优化测试完成！');
        
    } catch (error) {
        console.error('💥 测试失败:', error.message);
    }
}

// 运行测试
testPDFOptimization().catch(console.error);
