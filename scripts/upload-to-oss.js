const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 获取构建模式（从命令行参数或环境变量）
const buildMode = process.argv.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 
                  process.env.VITE_MODE || 
                  process.env.NODE_ENV || 
                  'production';

console.log(chalk.blue(`🎯 当前构建模式: ${buildMode}`));

// 根据构建模式选择对应的环境配置文件
let envFile = '.env.local'; // 默认配置文件

if (buildMode === 'test') {
  envFile = '.env.test.local';
} else if (buildMode === 'staging') {
  envFile = '.env.staging.local';
} else if (buildMode === 'production') {
  envFile = '.env.production.local';
}

console.log(chalk.blue(`📁 加载配置文件: ${envFile}`));

// 加载对应环境的配置文件
if (fs.existsSync(envFile)) {
  require('dotenv').config({ path: envFile });
} else {
  console.log(chalk.yellow(`⚠️  配置文件 ${envFile} 不存在，使用默认配置`));
  require('dotenv').config({ path: '.env.local' });
}

// OSS配置 - 从环境变量获取
const ossConfig = {
  region: process.env.OSS_REGION || 'oss-cn-hangzhou',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
};

// 上传配置
const uploadConfig = {
  distDir: path.resolve(__dirname, '../dist'), // 打包目录
  ossDir: process.env.OSS_DIR || '', // OSS上传目录前缀
  ignoreFiles: ['.DS_Store', 'Thumbs.db'], // 忽略的文件
  // 文件类型映射
  contentTypeMap: {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
  }
};

class OSSUploader {
  constructor() {
    this.client = null;
    this.uploadedCount = 0;
    this.totalCount = 0;
    this.failedFiles = [];
  }

  // 初始化OSS客户端
  initClient() {
    if (!ossConfig.accessKeyId || !ossConfig.accessKeySecret || !ossConfig.bucket) {
      throw new Error('OSS配置不完整，请检查环境变量：OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET');
    }

    this.client = new OSS(ossConfig);
    console.log(chalk.green('✓ OSS客户端初始化成功'));
  }

  // 获取文件的Content-Type
  getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return uploadConfig.contentTypeMap[ext] || 'application/octet-stream';
  }

  // 递归获取所有需要上传的文件
  getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (uploadConfig.ignoreFiles.includes(file)) {
        return;
      }

      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        this.getAllFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    });
    
    return fileList;
  }

  // 上传单个文件
  async uploadFile(localPath) {
    try {
      // 计算相对路径作为OSS对象名
      const relativePath = path.relative(uploadConfig.distDir, localPath);
      const ossPath = uploadConfig.ossDir 
        ? `${uploadConfig.ossDir}/${relativePath}`.replace(/\\/g, '/')
        : relativePath.replace(/\\/g, '/');

      // 获取文件内容
      const fileContent = fs.readFileSync(localPath);
      
      // 上传配置
      const options = {
        headers: {
          'Content-Type': this.getContentType(localPath),
          'Cache-Control': this.getCacheControl(localPath)
        }
      };

      const result = await this.client.put(ossPath, fileContent, options);
      
      if (result.res.status === 200) {
        this.uploadedCount++;
        console.log(chalk.green(`✓ [${this.uploadedCount}/${this.totalCount}] ${relativePath}`));
        return true;
      } else {
        throw new Error(`上传失败: ${result.res.status}`);
      }
    } catch (error) {
      this.failedFiles.push({ file: localPath, error: error.message });
      console.log(chalk.red(`✗ ${path.relative(uploadConfig.distDir, localPath)}: ${error.message}`));
      return false;
    }
  }

  // 获取缓存控制策略
  getCacheControl(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    // 静态资源设置长期缓存
    if (['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
      return 'public, max-age=31536000'; // 1年
    }
    
    // HTML文件设置短期缓存
    if (ext === '.html') {
      return 'public, max-age=3600'; // 1小时
    }
    
    return 'public, max-age=86400'; // 1天
  }

  // 批量上传
  async uploadAll() {
    try {
      console.log(chalk.blue('🚀 开始上传到阿里云OSS...'));
      
      // 检查dist目录是否存在
      if (!fs.existsSync(uploadConfig.distDir)) {
        throw new Error(`打包目录不存在: ${uploadConfig.distDir}`);
      }

      // 获取所有文件
      const files = this.getAllFiles(uploadConfig.distDir);
      this.totalCount = files.length;
      
      if (this.totalCount === 0) {
        console.log(chalk.yellow('⚠ 没有找到需要上传的文件'));
        return;
      }

      console.log(chalk.blue(`📦 发现 ${this.totalCount} 个文件需要上传`));

      // 并发上传（限制并发数量避免超出OSS限制）
      const concurrency = 5;
      const chunks = [];
      for (let i = 0; i < files.length; i += concurrency) {
        chunks.push(files.slice(i, i + concurrency));
      }

      for (const chunk of chunks) {
        await Promise.all(chunk.map(file => this.uploadFile(file)));
      }

      // 输出结果
      console.log(chalk.blue('\n📊 上传完成统计:'));
      console.log(chalk.green(`✓ 成功: ${this.uploadedCount} 个文件`));
      
      if (this.failedFiles.length > 0) {
        console.log(chalk.red(`✗ 失败: ${this.failedFiles.length} 个文件`));
        console.log(chalk.red('失败文件列表:'));
        this.failedFiles.forEach(({ file, error }) => {
          console.log(chalk.red(`  - ${path.relative(uploadConfig.distDir, file)}: ${error}`));
        });
      }

      if (this.uploadedCount > 0) {
        const ossUrl = `https://${ossConfig.bucket}.${ossConfig.region}.aliyuncs.com`;
        const deployUrl = uploadConfig.ossDir 
          ? `${ossUrl}/${uploadConfig.ossDir}/index.html`
          : `${ossUrl}/index.html`;
        // console.log(chalk.green(`\n🎉 部署成功！访问地址: ${deployUrl}`));
        console.log(chalk.green(`\n🎉 部署成功！`));
      }

    } catch (error) {
      console.error(chalk.red(`❌ 上传失败: ${error.message}`));
      process.exit(1);
    }
  }
}

// 主函数
async function main() {
  try {
    const uploader = new OSSUploader();
    uploader.initClient();
    await uploader.uploadAll();
  } catch (error) {
    console.error(chalk.red(`❌ 程序执行失败: ${error.message}`));
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = OSSUploader;
