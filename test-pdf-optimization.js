#!/usr/bin/env node
/**
 * PDF文件大小优化测试脚本
 */

const axios = require('axios');

const PDF_SERVER_URL = 'http://localhost:3001';

async function testPDFOptimization() {
    console.log('🔧 开始PDF文件大小优化测试...\n');

    // 测试不同的优化选项
    const testConfigs = [
        {
            name: '标准质量',
            options: {
                format: 'A4',
                printBackground: true,
                scale: 1.0
            }
        },
        {
            name: '优化大小 - 80%缩放',
            options: {
                format: 'A4',
                printBackground: true,
                scale: 0.8,
                omitBackground: false
            }
        },
        {
            name: '优化大小 - 70%缩放',
            options: {
                format: 'A4',
                printBackground: true,
                scale: 0.7,
                omitBackground: false
            }
        },
        {
            name: '最小文件 - 60%缩放',
            options: {
                format: 'A4',
                printBackground: false,
                scale: 0.6,
                omitBackground: true
            }
        }
    ];

    const results = [];

    for (let i = 0; i < testConfigs.length; i++) {
        const config = testConfigs[i];
        console.log(`\n${i + 1}. 测试配置: ${config.name}`);
        
        try {
            const response = await axios.post(`${PDF_SERVER_URL}/api/generate-pdf`, {
                url: 'http://localhost:8899/report/temp3/1952661286780297217/1904469602410389505',
                reportId: `optimization-test-${i + 1}`,
                filename: `optimization-test-${i + 1}-${Date.now()}.pdf`,
                options: config.options
            });

            if (response.data.success) {
                const fileSize = response.data.data.size;
                const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
                
                console.log(`✅ 生成成功: ${response.data.data.filename}`);
                console.log(`📏 文件大小: ${fileSizeMB} MB`);
                
                results.push({
                    name: config.name,
                    filename: response.data.data.filename,
                    size: fileSize,
                    sizeMB: fileSizeMB,
                    options: config.options
                });
            } else {
                console.log(`❌ 生成失败: ${response.data.error}`);
            }
        } catch (error) {
            console.log(`❌ 请求失败: ${error.message}`);
        }

        // 等待2秒避免过快请求
        if (i < testConfigs.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // 显示结果对比
    console.log('\n' + '='.repeat(60));
    console.log('📊 文件大小对比结果:');
    console.log('='.repeat(60));
    
    results.sort((a, b) => a.size - b.size);
    
    results.forEach((result, index) => {
        const percentage = index === 0 ? '基准' : 
            `${((result.size / results[0].size - 1) * 100).toFixed(1)}%`;
        
        console.log(`${index + 1}. ${result.name}`);
        console.log(`   文件大小: ${result.sizeMB} MB (${percentage})`);
        console.log(`   文件名: ${result.filename}`);
        console.log('');
    });

    if (results.length > 1) {
        const largest = results[results.length - 1];
        const smallest = results[0];
        const reduction = ((largest.size - smallest.size) / largest.size * 100).toFixed(1);
        
        console.log(`💡 最佳优化: ${smallest.name}`);
        console.log(`📉 文件大小减少: ${reduction}%`);
        console.log(`📁 从 ${largest.sizeMB} MB 减少到 ${smallest.sizeMB} MB`);
    }

    console.log('\n🎉 优化测试完成!');
}

// 运行测试
if (require.main === module) {
    testPDFOptimization().catch(console.error);
}

module.exports = { testPDFOptimization };
