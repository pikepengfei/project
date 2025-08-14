# 🚀 集成化部署流程说明

## 概述

现在所有的OSS部署命令都已经集成了配置检查功能，确保部署前配置的正确性，避免部署失败。

## 📋 环境配置文件

| 环境       | 配置文件                | 说明                 |
| ---------- | ----------------------- | -------------------- |
| 测试环境   | `.env.test.local`       | 测试环境的OSS配置    |
| 预发布环境 | `.env.staging.local`    | 预发布环境的OSS配置  |
| 生产环境   | `.env.production.local` | 生产环境的OSS配置    |
| 默认环境   | `.env.local`            | 默认配置（向后兼容） |

## 🎯 完整部署流程

每个部署命令都包含**三个步骤**：

### 1. 🔍 配置检查

- 验证环境配置文件是否存在
- 检查必需的OSS配置项
- 验证依赖是否安装
- 检查构建目录状态

### 2. 🔨 项目构建

- 根据指定模式构建项目
- 使用对应的Vite构建配置

### 3. 📤 OSS上传

- 使用对应环境的OSS配置
- 智能文件类型识别
- 并发上传优化

## 📝 可用命令

### 完整部署命令（构建 + 上传）

```bash
# 默认环境（生产）部署
pnpm run build:deploy

# 测试环境部署
pnpm run build:deploy:test

# 预发布环境部署
pnpm run build:deploy:stage

# 生产环境部署
pnpm run build:deploy:prod
```

### 仅上传命令（适用于已构建项目）

```bash
# 默认环境上传
pnpm run deploy

# 测试环境上传
pnpm run deploy:test

# 预发布环境上传
pnpm run deploy:stage

# 生产环境上传
pnpm run deploy:prod
```

### 配置检查命令（可选，已集成到部署中）

```bash
# 检查默认配置
pnpm run config:check

# 检查测试环境配置
pnpm run config:check:test

# 检查预发布环境配置
pnpm run config:check:stage

# 检查生产环境配置
pnpm run config:check:prod
```

## 🔧 使用示例

### 典型工作流程

1. **开发完成后，部署到测试环境**：

   ```bash
   pnpm run build:deploy:test
   ```

2. **测试通过后，部署到预发布环境**：

   ```bash
   pnpm run build:deploy:stage
   ```

3. **预发布验证通过，部署到生产环境**：
   ```bash
   pnpm run build:deploy:prod
   ```

### 部署输出示例

```
🚀 开始多环境部署流程...
📋 部署模式: staging

🔍 步骤1: 检查OSS配置...
=== OSS配置检查 (staging 环境) ===
📁 检查配置文件: .env.staging.local
✅ 配置文件加载成功
📋 必需配置检查:
✅ OSS_ACCESS_KEY_ID: **********************
✅ OSS_ACCESS_KEY_SECRET: **********************
✅ OSS_BUCKET: **********************
✅ 配置检查通过！

🔨 步骤2: 执行构建 - vite build --mode staging
✅ 构建完成！

📤 步骤3: 上传到OSS...
🎯 当前构建模式: staging
📁 加载配置文件: .env.staging.local
🚀 开始上传到阿里云OSS...
📦 发现 15 个文件需要上传
✓ [1/15] index.html
✓ [2/15] assets/style.css
...
🎉 部署完成！
🌐 访问地址: https://pro-investment-report.oss-cn-beijing.aliyuncs.com/index.html
```

## ❌ 错误处理

### 配置错误

如果配置检查失败，部署会立即停止：

```
❌ 配置检查失败，退出码: 1
请修复配置问题后重试
```

### 构建错误

如果构建失败，不会进行上传：

```
❌ 构建失败，退出码: 1
```

### 上传错误

上传失败时会显示详细错误信息：

```
❌ 上传失败，退出码: 1
```

## 🔒 安全特性

1. **配置文件保护**：

   - 所有 `.env.*.local` 文件都在 `.gitignore` 中
   - 敏感信息不会被提交到版本控制

2. **环境隔离**：

   - 每个环境使用独立的OSS配置
   - 避免误操作影响生产环境

3. **预检查机制**：
   - 部署前强制检查配置
   - 减少部署失败率

## 📊 对比优势

| 特性       | 集成前           | 集成后     |
| ---------- | ---------------- | ---------- |
| 配置检查   | 手动执行         | 自动执行   |
| 错误处理   | 分散处理         | 统一处理   |
| 操作步骤   | 3个命令          | 1个命令    |
| 部署安全性 | 依赖手动检查     | 强制预检查 |
| 用户体验   | 需要记忆多个命令 | 一键部署   |

## 🎉 升级亮点

✅ **一键部署**：单个命令完成检查、构建、上传全流程  
✅ **智能检查**：自动根据环境选择对应配置文件  
✅ **错误中断**：任何步骤失败都会立即停止后续操作  
✅ **清晰反馈**：每个步骤都有明确的状态显示  
✅ **向后兼容**：保留了原有的独立命令

现在您可以安心使用 `pnpm run build:deploy:stage` 这样的命令，系统会自动完成所有必要的检查和操作！
