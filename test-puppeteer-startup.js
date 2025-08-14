const puppeteer = require('puppeteer');

async function testPuppeteerStartup() {
    console.log('开始测试 Puppeteer 启动...');
    
    let browser;
    try {
        console.log('正在启动浏览器...');
        const startTime = Date.now();
        
        browser = await puppeteer.launch({
            headless: true,
            timeout: 60000, // 60秒超时
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--no-first-run',
                '--no-default-browser-check',
            ],
        });
        
        const endTime = Date.now();
        console.log(`✓ 浏览器启动成功，耗时: ${endTime - startTime}ms`);
        
        console.log('创建新页面...');
        const page = await browser.newPage();
        console.log('✓ 页面创建成功');
        
        console.log('测试导航到简单页面...');
        await page.goto('https://www.baidu.com', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        console.log('✓ 页面导航成功');
        
        const title = await page.title();
        console.log(`页面标题: ${title}`);
        
        console.log('✓ Puppeteer 测试成功完成');
        
    } catch (error) {
        console.error('✗ Puppeteer 测试失败:');
        console.error('错误信息:', error.message);
        console.error('错误堆栈:', error.stack);
        
        // 检查是否是 Chrome 未找到的错误
        if (error.message.includes('Could not find Chrome')) {
            console.log('\n可能的解决方案:');
            console.log('1. 确保已安装 Chrome 浏览器');
            console.log('2. 或者设置 PUPPETEER_EXECUTABLE_PATH 环境变量');
            console.log('3. 或者使用 PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false 重新安装 puppeteer');
        }
        
        // 检查是否是超时错误
        if (error.message.includes('Timed out')) {
            console.log('\n可能的解决方案:');
            console.log('1. 增加超时时间');
            console.log('2. 检查系统资源是否充足');
            console.log('3. 检查防火墙或杀毒软件是否阻止了 Chrome 进程');
        }
        
    } finally {
        if (browser) {
            await browser.close();
            console.log('浏览器已关闭');
        }
    }
}

// 运行测试
testPuppeteerStartup().catch(console.error);
