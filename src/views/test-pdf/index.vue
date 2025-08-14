<template>
  <div class="test-page">
    <!-- PDF生成测试控制台 -->
    <div class="test-console">
      <h2>PDF生成测试控制台</h2>
      
      <!-- 服务器状态检查 -->
      <div class="status-section">
        <h3>服务器状态</h3>
        <div class="status-item">
          <span class="label">PDF服务器:</span>
          <span :class="['status', serverStatus.pdf]">{{ serverStatus.pdf }}</span>
          <button @click="checkPDFServer" :disabled="checking">检查</button>
        </div>
        <div class="status-item">
          <span class="label">前端服务器:</span>
          <span :class="['status', serverStatus.frontend]">{{ serverStatus.frontend }}</span>
          <button @click="checkFrontendServer" :disabled="checking">检查</button>
        </div>
      </div>

      <!-- 报告URL配置 -->
      <div class="config-section">
        <h3>报告配置</h3>
        <div class="config-form">
          <div class="form-row">
            <label>报告类型:</label>
            <select v-model="reportConfig.template">
              <option value="temp3">模板3 (推荐)</option>
              <option value="temp2">模板2</option>
              <option value="temp1">模板1</option>
              <option value="temp0">模板0</option>
            </select>
          </div>
          <div class="form-row">
            <label>报告ID:</label>
            <input v-model="reportConfig.reportId" placeholder="例如: 123" />
          </div>
          <div class="form-row">
            <label>业务ID:</label>
            <input v-model="reportConfig.businessId" placeholder="例如: 456" />
          </div>
          <div class="form-row">
            <label>完整URL:</label>
            <input v-model="fullReportUrl" readonly class="readonly" />
          </div>
        </div>
      </div>

      <!-- PDF生成控制 -->
      <div class="generation-section">
        <h3>PDF生成</h3>
        <div class="generation-controls">
          <button 
            @click="generateSinglePDF" 
            :disabled="generating || !isConfigValid"
            class="primary-btn"
          >
            {{ generating ? '生成中...' : '生成单个PDF' }}
          </button>
          
          <button 
            @click="generateBatchPDF" 
            :disabled="generating"
            class="secondary-btn"
          >
            批量生成测试
          </button>
          
          <button 
            @click="testDirectAccess" 
            :disabled="checking"
            class="test-btn"
          >
            测试页面访问
          </button>
        </div>
        
        <!-- 高级选项 -->
        <details class="advanced-options">
          <summary>高级选项</summary>
          <div class="advanced-form">
            <div class="form-row">
              <label>PDF格式:</label>
              <select v-model="pdfOptions.format">
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
              </select>
            </div>
            <div class="form-row">
              <label>页边距 (mm):</label>
              <div class="margin-inputs">
                <input v-model.number="pdfOptions.margin.top" placeholder="上" type="number" min="0" max="50" />
                <input v-model.number="pdfOptions.margin.right" placeholder="右" type="number" min="0" max="50" />
                <input v-model.number="pdfOptions.margin.bottom" placeholder="下" type="number" min="0" max="50" />
                <input v-model.number="pdfOptions.margin.left" placeholder="左" type="number" min="0" max="50" />
              </div>
            </div>
            <div class="form-row">
              <label>
                <input type="checkbox" v-model="pdfOptions.printBackground" />
                打印背景
              </label>
            </div>
            <div class="form-row">
              <label>超时时间 (秒):</label>
              <input v-model.number="pdfOptions.timeout" type="number" min="10" max="300" />
            </div>
          </div>
        </details>
      </div>

      <!-- 日志和状态 -->
      <div class="log-section">
        <h3>运行日志</h3>
        <div class="log-container" ref="logContainer">
          <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
            <span class="timestamp">{{ log.timestamp }}</span>
            <span class="message">{{ log.message }}</span>
          </div>
        </div>
        <button @click="clearLogs" class="clear-btn">清空日志</button>
      </div>

      <!-- 生成的PDF列表 -->
      <div class="pdf-list-section">
        <h3>生成的PDF文件</h3>
        <button @click="refreshPDFList" :disabled="loading" class="refresh-btn">
          {{ loading ? '加载中...' : '刷新列表' }}
        </button>
        <div v-if="pdfList.length === 0" class="empty-state">
          暂无PDF文件
        </div>
        <div v-else class="pdf-list">
          <div v-for="pdf in pdfList" :key="pdf.filename" class="pdf-item">
            <div class="pdf-info">
              <h4>{{ pdf.filename }}</h4>
              <p>大小: {{ formatFileSize(pdf.size) }}</p>
              <p>创建时间: {{ formatTime(pdf.created) }}</p>
            </div>
            <div class="pdf-actions">
              <button @click="downloadPDF(pdf.filename)" class="download-btn">下载</button>
              <button @click="deletePDF(pdf.filename)" class="delete-btn">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

// 响应式数据
const checking = ref(false);
const generating = ref(false);
const loading = ref(false);

// 服务器状态
const serverStatus = ref({
  pdf: 'unknown',
  frontend: 'unknown'
});

// 报告配置
const reportConfig = ref({
  template: 'temp3',
  reportId: '1952661286780297217',
  businessId: '1904469602410389505'
});

// PDF选项
const pdfOptions = ref({
  format: 'A4',
  printBackground: true,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  timeout: 60
});

// 日志数据
const logs = ref<Array<{
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}>>([]);

// PDF文件列表
const pdfList = ref<Array<{
  filename: string;
  size: number;
  created: string;
  modified: string;
  downloadUrl: string;
}>>([]);

// 计算属性
const fullReportUrl = computed(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/report/${reportConfig.value.template}/${reportConfig.value.reportId}/${reportConfig.value.businessId}`;
});

const isConfigValid = computed(() => {
  return reportConfig.value.reportId.trim() && reportConfig.value.businessId.trim();
});

// API配置
const PDF_SERVER_URL = 'http://localhost:3001';

// 工具函数
const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
  logs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    message,
    type
  });
  
  // 自动滚动到底部
  nextTick(() => {
    const logContainer = document.querySelector('.log-container');
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  });
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatTime = (timeStr: string): string => {
  return new Date(timeStr).toLocaleString('zh-CN');
};

// API方法
const checkPDFServer = async () => {
  checking.value = true;
  addLog('检查PDF服务器状态...');
  
  try {
    const response = await fetch(`${PDF_SERVER_URL}/health`, {
      method: 'GET',
      timeout: 5000
    } as any);
    
    if (response.ok) {
      const result = await response.json();
      serverStatus.value.pdf = 'online';
      addLog('PDF服务器在线 ✓', 'success');
    } else {
      serverStatus.value.pdf = 'error';
      addLog('PDF服务器响应异常', 'error');
    }
  } catch (error: any) {
    serverStatus.value.pdf = 'offline';
    addLog(`PDF服务器离线: ${error.message}`, 'error');
  } finally {
    checking.value = false;
  }
};

const checkFrontendServer = async () => {
  checking.value = true;
  addLog('检查前端服务器状态...');
  
  try {
    const response = await fetch(fullReportUrl.value, {
      method: 'HEAD',
      timeout: 5000
    } as any);
    
    if (response.ok) {
      serverStatus.value.frontend = 'online';
      addLog('前端页面可访问 ✓', 'success');
    } else {
      serverStatus.value.frontend = 'error';
      addLog(`前端页面访问异常: ${response.status}`, 'error');
    }
  } catch (error: any) {
    serverStatus.value.frontend = 'offline';
    addLog(`前端页面无法访问: ${error.message}`, 'error');
  } finally {
    checking.value = false;
  }
};

const generateSinglePDF = async () => {
  if (!isConfigValid.value) {
    addLog('请先配置报告ID和业务ID', 'warning');
    return;
  }

  generating.value = true;
  const filename = `report-${reportConfig.value.template}-${reportConfig.value.reportId}-${Date.now()}.pdf`;
  
  addLog(`开始生成PDF: ${filename}`);

  try {
    const response = await fetch(`${PDF_SERVER_URL}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: fullReportUrl.value,
        reportId: reportConfig.value.reportId,
        filename,
        options: {
          format: pdfOptions.value.format,
          printBackground: pdfOptions.value.printBackground,
          margin: {
            top: `${pdfOptions.value.margin.top}mm`,
            right: `${pdfOptions.value.margin.right}mm`,
            bottom: `${pdfOptions.value.margin.bottom}mm`,
            left: `${pdfOptions.value.margin.left}mm`
          }
        }
      })
    });

    const result = await response.json();

    if (result.success) {
      addLog(`PDF生成成功: ${result.data.filename}`, 'success');
      addLog(`文件大小: ${formatFileSize(result.data.size)}`, 'info');
      
      // 自动下载
      const downloadUrl = `${PDF_SERVER_URL}${result.data.downloadUrl}`;
      window.open(downloadUrl, '_blank');
      
      // 刷新PDF列表
      await refreshPDFList();
    } else {
      addLog(`PDF生成失败: ${result.error}`, 'error');
    }
  } catch (error: any) {
    addLog(`PDF生成错误: ${error.message}`, 'error');
  } finally {
    generating.value = false;
  }
};

const generateBatchPDF = async () => {
  generating.value = true;
  addLog('开始批量生成PDF测试...');

  const testConfigs = [
    { reportId: '123', businessId: '456' },
    { reportId: '789', businessId: '012' },
    { reportId: '345', businessId: '678' }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < testConfigs.length; i++) {
    const config = testConfigs[i];
    const filename = `batch-test-${config.reportId}-${Date.now()}.pdf`;
    const url = `${window.location.origin}/report/${reportConfig.value.template}/${config.reportId}/${config.businessId}`;
    
    addLog(`生成第 ${i + 1}/${testConfigs.length} 个PDF: ${filename}`);

    try {
      const response = await fetch(`${PDF_SERVER_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          reportId: config.reportId,
          filename,
          options: pdfOptions.value
        })
      });

      const result = await response.json();

      if (result.success) {
        addLog(`✓ ${filename} 生成成功`, 'success');
        successCount++;
      } else {
        addLog(`✗ ${filename} 生成失败: ${result.error}`, 'error');
        errorCount++;
      }
    } catch (error: any) {
      addLog(`✗ ${filename} 生成错误: ${error.message}`, 'error');
      errorCount++;
    }

    // 等待1秒避免过快请求
    if (i < testConfigs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  addLog(`批量生成完成: 成功 ${successCount}, 失败 ${errorCount}`, successCount > errorCount ? 'success' : 'warning');
  await refreshPDFList();
  generating.value = false;
};

const testDirectAccess = async () => {
  checking.value = true;
  addLog('测试直接访问报告页面...');

  try {
    // 在新窗口打开报告页面
    const testUrl = `${fullReportUrl.value}?test=true`;
    const newWindow = window.open(testUrl, '_blank');
    
    if (newWindow) {
      addLog('页面已在新窗口打开，请检查是否正常显示', 'success');
    } else {
      addLog('无法打开新窗口，可能被浏览器阻止', 'warning');
    }
  } catch (error: any) {
    addLog(`页面访问失败: ${error.message}`, 'error');
  } finally {
    checking.value = false;
  }
};

const refreshPDFList = async () => {
  loading.value = true;
  addLog('刷新PDF文件列表...');

  try {
    const response = await fetch(`${PDF_SERVER_URL}/api/reports`);
    const result = await response.json();

    if (result.success) {
      pdfList.value = result.data;
      addLog(`获取到 ${result.data.length} 个PDF文件`, 'info');
    } else {
      addLog(`获取PDF列表失败: ${result.error}`, 'error');
    }
  } catch (error: any) {
    addLog(`获取PDF列表错误: ${error.message}`, 'error');
  } finally {
    loading.value = false;
  }
};

const downloadPDF = async (filename: string) => {
  addLog(`下载PDF: ${filename}`);
  
  try {
    const downloadUrl = `${PDF_SERVER_URL}/api/download/${filename}`;
    window.open(downloadUrl, '_blank');
    addLog(`开始下载: ${filename}`, 'success');
  } catch (error: any) {
    addLog(`下载失败: ${error.message}`, 'error');
  }
};

const deletePDF = async (filename: string) => {
  if (!confirm(`确定要删除 ${filename} 吗？`)) {
    return;
  }

  addLog(`删除PDF: ${filename}`);

  try {
    const response = await fetch(`${PDF_SERVER_URL}/api/reports/${filename}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();

    if (result.success) {
      addLog(`删除成功: ${filename}`, 'success');
      await refreshPDFList();
    } else {
      addLog(`删除失败: ${result.error}`, 'error');
    }
  } catch (error: any) {
    addLog(`删除错误: ${error.message}`, 'error');
  }
};

const clearLogs = () => {
  logs.value = [];
  addLog('日志已清空');
};

// 生命周期
onMounted(async () => {
  addLog('PDF生成测试页面已加载');
  
  // 自动检查服务器状态
  await checkPDFServer();
  await checkFrontendServer();
  
  // 加载PDF列表
  await refreshPDFList();
});
</script>

<style scoped lang="scss">
.test-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.test-console {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  overflow: hidden;

  h2 {
    background: linear-gradient(90deg, #1c66ff, #2b7eff);
    color: white;
    margin: 0;
    padding: 20px;
    font-size: 20px;
    font-weight: 600;
  }
}

.status-section, .config-section, .generation-section, .log-section, .pdf-list-section {
  padding: 20px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .label {
    min-width: 100px;
    font-weight: 500;
    color: #666;
  }

  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    min-width: 60px;
    text-align: center;

    &.online {
      background: #d4edda;
      color: #155724;
    }

    &.offline {
      background: #f8d7da;
      color: #721c24;
    }

    &.error {
      background: #f8d7da;
      color: #721c24;
    }

    &.unknown {
      background: #e2e3e5;
      color: #6c757d;
    }
  }

  button {
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background: #f8f9fa;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.config-form {
  display: grid;
  gap: 15px;

  .form-row {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      min-width: 100px;
      font-weight: 500;
      color: #666;
    }

    input, select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      flex: 1;

      &.readonly {
        background: #f8f9fa;
        color: #6c757d;
      }
    }

    .margin-inputs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      flex: 1;

      input {
        margin: 0;
        flex: none;
      }
    }
  }
}

.generation-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.primary-btn {
      background: #1c66ff;
      color: white;

      &:hover:not(:disabled) {
        background: #0d52d1;
      }
    }

    &.secondary-btn {
      background: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background: #545b62;
      }
    }

    &.test-btn {
      background: #28a745;
      color: white;

      &:hover:not(:disabled) {
        background: #1e7e34;
      }
    }
  }
}

.advanced-options {
  margin-top: 15px;

  summary {
    cursor: pointer;
    font-weight: 500;
    color: #666;
    margin-bottom: 10px;
  }

  .advanced-form {
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
    margin-top: 10px;
  }
}

.log-container {
  background: #1e1e1e;
  color: #e6e6e6;
  padding: 15px;
  border-radius: 6px;
  height: 300px;
  overflow-y: auto;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.5;

  .log-item {
    margin-bottom: 5px;
    word-wrap: break-word;

    .timestamp {
      color: #888;
      margin-right: 10px;
    }

    &.success .message {
      color: #4ade80;
    }

    &.error .message {
      color: #f87171;
    }

    &.warning .message {
      color: #fbbf24;
    }

    &.info .message {
      color: #60a5fa;
    }
  }
}

.clear-btn, .refresh-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  margin-top: 10px;

  &:hover {
    background: #f8f9fa;
  }
}

.empty-state {
  text-align: center;
  color: #6c757d;
  padding: 40px 20px;
  font-style: italic;
}

.pdf-list {
  display: grid;
  gap: 15px;
  margin-top: 15px;
}

.pdf-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f8f9fa;

  .pdf-info {
    flex: 1;

    h4 {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: #333;
    }

    p {
      margin: 2px 0;
      font-size: 12px;
      color: #666;
    }
  }

  .pdf-actions {
    display: flex;
    gap: 8px;

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;

      &.download-btn {
        background: #28a745;
        color: white;

        &:hover {
          background: #1e7e34;
        }
      }

      &.delete-btn {
        background: #dc3545;
        color: white;

        &:hover {
          background: #c82333;
        }
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-page {
    padding: 10px;
  }

  .generation-controls {
    flex-direction: column;
  }

  .pdf-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    .pdf-actions {
      align-self: stretch;
      justify-content: flex-end;
    }
  }

  .config-form .form-row {
    flex-direction: column;
    align-items: flex-start;

    label {
      min-width: auto;
    }

    input, select {
      width: 100%;
    }
  }
}
</style>
