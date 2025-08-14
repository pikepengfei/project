#!/usr/bin/env node

const { spawn } = require('child_process');
const chalk = require('chalk');

// 获取命令行参数
const args = process.argv.slice(2);
const mode = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 'production';

console.log(chalk.blue('🚀 开始多环境部署流程...'));
console.log(chalk.blue(`📋 部署模式: ${mode}`));

// 步骤1：配置检查
console.log(chalk.blue('🔍 步骤1: 检查OSS配置...'));

const checkProcess = spawn('node', ['scripts/check-oss-config.js', `--mode=${mode}`], {
  stdio: 'inherit',
  shell: true
});

checkProcess.on('close', (checkCode) => {
  if (checkCode !== 0) {
    console.error(chalk.red(`❌ 配置检查失败，退出码: ${checkCode}`));
    console.error(chalk.red('请修复配置问题后重试'));
    process.exit(1);
  }

  console.log(chalk.green('✅ 配置检查通过！'));
  
  // 步骤2：构建
  const buildCmd = mode === 'production' ? 'vite build' : `vite build --mode ${mode}`;
  console.log(chalk.blue(`🔨 步骤2: 执行构建 - ${buildCmd}`));

  const buildProcess = spawn('npx', buildCmd.split(' '), {
    stdio: 'inherit',
    shell: true
  });

  buildProcess.on('close', (buildCode) => {
    if (buildCode !== 0) {
      console.error(chalk.red(`❌ 构建失败，退出码: ${buildCode}`));
      process.exit(1);
    }

    console.log(chalk.green('✅ 构建完成！'));
    
    // 步骤3：上传到OSS
    console.log(chalk.blue('📤 步骤3: 上传到OSS...'));

    const uploadProcess = spawn('node', ['scripts/upload-to-oss.js', `--mode=${mode}`], {
      stdio: 'inherit',
      shell: true
    });

    uploadProcess.on('close', (uploadCode) => {
      if (uploadCode !== 0) {
        console.error(chalk.red(`❌ 上传失败，退出码: ${uploadCode}`));
        process.exit(1);
      }

      console.log(chalk.green('🎉 部署完成！'));
    });

    uploadProcess.on('error', (error) => {
      console.error(chalk.red(`❌ 上传进程错误: ${error.message}`));
      process.exit(1);
    });
  });

  buildProcess.on('error', (error) => {
    console.error(chalk.red(`❌ 构建进程错误: ${error.message}`));
    process.exit(1);
  });
});

checkProcess.on('error', (error) => {
  console.error(chalk.red(`❌ 配置检查进程错误: ${error.message}`));
  process.exit(1);
});
