const path = require('path');

/**
 * Vite插件：构建完成后自动上传到阿里云OSS
 */
function vitePluginOssUpload(options = {}) {
  const {
    enabled = true, // 是否启用
    skipEmptyDist = true, // 跳过空的dist目录
    ...uploadOptions
  } = options;

  return {
    name: 'vite-plugin-oss-upload',
    apply: 'build', // 只在构建时应用
    
    async closeBundle() {
      if (!enabled) {
        console.log('OSS上传已禁用');
        return;
      }

      try {
        // 动态导入上传脚本
        const OSSUploader = require('./upload-to-oss');
        const uploader = new OSSUploader();
        
        // 检查dist目录
        const distDir = path.resolve(process.cwd(), 'dist');
        const fs = require('fs');
        
        if (skipEmptyDist && (!fs.existsSync(distDir) || fs.readdirSync(distDir).length === 0)) {
          console.log('⚠ dist目录为空，跳过OSS上传');
          return;
        }

        uploader.initClient();
        await uploader.uploadAll();
      } catch (error) {
        console.error('OSS上传失败:', error.message);
        // 不抛出错误，避免中断构建流程
      }
    }
  };
}

module.exports = vitePluginOssUpload;
