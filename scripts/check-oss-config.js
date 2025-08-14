const fs = require('fs');
const path = require('path');

// 获取检查模式
const args = process.argv.slice(2);
const mode = args.find((arg) => arg.startsWith('--mode='))?.split('=')[1] || 'production';

console.log(`=== OSS配置检查 (${mode} 环境) ===\n`);

// 根据模式选择配置文件
let envFile = '.env.local';
if (mode === 'test') {
	envFile = '.env.test.local';
} else if (mode === 'staging') {
	envFile = '.env.staging.local';
} else if (mode === 'production') {
	envFile = '.env.production.local';
}

console.log(`📁 检查配置文件: ${envFile}`);

// 加载环境变量
if (fs.existsSync(envFile)) {
	require('dotenv').config({ path: envFile });
	console.log(`✅ 配置文件加载成功\n`);
} else {
	console.log(`❌ 配置文件不存在: ${envFile}\n`);
}

// 检查必需的环境变量
const requiredEnvs = ['OSS_ACCESS_KEY_ID', 'OSS_ACCESS_KEY_SECRET', 'OSS_BUCKET'];

const optionalEnvs = ['OSS_REGION', 'OSS_DIR'];

let hasErrors = false;

console.log('📋 必需配置检查:');
requiredEnvs.forEach((env) => {
	const value = process.env[env];
	if (value) {
		console.log(`✅ ${env}: ${'*'.repeat(Math.min(value.length, 20))}`);
	} else {
		console.log(`❌ ${env}: 未设置`);
		hasErrors = true;
	}
});

console.log('\n📋 可选配置检查:');
optionalEnvs.forEach((env) => {
	const value = process.env[env];
	console.log(`${value ? '✅' : '⚠️'} ${env}: ${value || '未设置（使用默认值）'}`);
});

// 检查.env.local文件
console.log('\n📁 配置文件检查:');
const envLocalPath = path.resolve(process.cwd(), envFile);
if (fs.existsSync(envLocalPath)) {
	console.log(`✅ ${envFile}: 存在`);
} else {
	console.log(`❌ ${envFile}: 不存在`);
	console.log(`   请创建 ${envFile} 并填入配置`);
	hasErrors = true;
}

// 检查dist目录
console.log('\n📦 构建目录检查:');
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
	const files = fs.readdirSync(distPath);
	console.log(`✅ dist目录: 存在 (${files.length} 个文件/目录)`);
	if (files.length === 0) {
		console.log('⚠️  dist目录为空，请先运行 pnpm run build');
	}
} else {
	console.log('❌ dist目录: 不存在');
	console.log('   请先运行 pnpm run build 构建项目');
}

// 检查依赖
console.log('\n📚 依赖检查:');
try {
	require('ali-oss');
	console.log('✅ ali-oss: 已安装');
} catch {
	console.log('❌ ali-oss: 未安装');
	hasErrors = true;
}

try {
	require('chalk');
	console.log('✅ chalk: 已安装');
} catch {
	console.log('❌ chalk: 未安装');
	hasErrors = true;
}

try {
	require('dotenv');
	console.log('✅ dotenv: 已安装');
} catch {
	console.log('❌ dotenv: 未安装');
	hasErrors = true;
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
	console.log('❌ 发现配置问题，请修复后重试');
	console.log('\n🔧 修复建议:');
	console.log('1. 复制 .env.example 为 .env.local');
	console.log('2. 在 .env.local 中填入正确的OSS配置');
	console.log('3. 运行 pnpm install 安装缺失的依赖');
	console.log('4. 运行 pnpm run build 构建项目');
	process.exit(1);
} else {
	console.log('✅ 所有配置检查通过！');
	// console.log('\n🚀 可以运行以下命令开始部署:');
	// console.log('   pnpm run build:deploy     # 构建并部署');
	// console.log('   pnpm run deploy           # 仅部署已构建的文件');

	// if (process.env.OSS_BUCKET && process.env.OSS_REGION) {
	// 	const baseUrl = `https://${process.env.OSS_BUCKET}.${process.env.OSS_REGION}.aliyuncs.com`;
	// 	const fullUrl = process.env.OSS_DIR ? `${baseUrl}/${process.env.OSS_DIR}/index.html` : `${baseUrl}/index.html`;
	// 	console.log(`\n🌐 部署后访问地址: ${fullUrl}`);
	// }
}
