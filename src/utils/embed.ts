/**
 * 嵌入配置接口
 * 定义了嵌入环境的各项配置参数
 */
export interface EmbedConfig {
  /** 是否在嵌入环境中（iframe） */
  isEmbedded: boolean;
  /** 父页面的域名 */
  parentOrigin: string;
  /** 允许嵌入的域名列表 */
  allowedOrigins: string[];
  /** 是否允许iframe嵌入 */
  allowIframe: boolean;
  /** 允许嵌入的页面路径列表 */
  allowedPaths: string[];
}

/**
 * 嵌入适配器类
 * 用于处理应用在iframe环境中的嵌入逻辑，包括权限验证、消息通信等
 * 
 * 主要功能：
 * 1. 检测嵌入环境并验证访问权限
 * 2. 处理与父页面的消息通信
 * 3. 提供路径和域名的访问控制
 * 4. 显示访问受限时的错误页面
 * 
 * 使用示例：
 * ```typescript
 * import { embedAdapter } from '@/utils/embed';
 * 
 * // 初始化嵌入适配器
 * embedAdapter.init();
 * 
 * // 监听父页面消息
 * embedAdapter.onMessageFromParent((data) => {
 *   console.log('收到消息:', data);
 * });
 * 
 * // 发送消息到父页面
 * embedAdapter.postMessageToParent({ type: 'USER_ACTION', data: '用户点击了按钮' });
 * ```
 */
export class EmbedAdapter {
  private config: EmbedConfig;
  /** 消息处理器列表，用于处理来自父页面的消息 */
  private messageHandlers: Array<(data: any) => void> = [];
  /** 错误覆盖层元素，避免破坏原有应用结构 */
  private errorOverlay: HTMLElement | null = null;
  /** 是否已显示错误页面 */
  private isShowingError: boolean = false;

  constructor() {
    this.config = {
      isEmbedded: window !== window.top,
      parentOrigin: this.getParentOrigin(),
      allowIframe: import.meta.env.VITE_ALLOW_IFRAME === 'true',
      allowedOrigins: this.parseAllowedOrigins(),
      allowedPaths: this.parseAllowedPaths()
    };
  }

  /**
   * 解析允许的嵌入域名列表
   * 从环境变量 VITE_ALLOWED_EMBED_ORIGINS 中读取，支持逗号分隔
   * 开发环境下默认允许所有域名（*）
   */
  private parseAllowedOrigins(): string[] {
    const origins = import.meta.env.VITE_ALLOWED_EMBED_ORIGINS;
    if (!origins) return import.meta.env.MODE === 'development' ? ['*'] : [];
    return origins.split(',').map(origin => origin.trim()).filter(Boolean);
  }

  /**
   * 解析允许的嵌入路径列表
   * 从环境变量 VITE_ALLOWED_EMBED_PATHS 中读取，支持逗号分隔
   * 默认允许报告相关页面和仪表板页面
   */
  private parseAllowedPaths(): string[] {
    const paths = import.meta.env.VITE_ALLOWED_EMBED_PATHS;
    return paths.split(',').map(path => path.trim()).filter(Boolean);
  }

  /**
   * 获取父页面的域名
   * 通过 document.referrer 获取，如果获取失败则返回空字符串
   */
  private getParentOrigin(): string {
    try {
      if (window.parent && window.parent !== window && document.referrer) {
        return new URL(document.referrer).origin;
      }
    } catch (error) {
      console.warn('无法获取父页面 origin:', error);
    }
    return '';
  }

  /**
   * 获取当前页面路径
   * 自动识别哈希路由（#/path）和历史路由（/path）模式
   * @returns 当前页面的路径字符串
   */
  private getCurrentPath(): string {
    return window.location.hash ? window.location.hash.slice(1) : window.location.pathname;
  }

  /**
   * 检查当前路径是否允许嵌入
   * 支持通配符匹配（如 /report/* 匹配所有 /report/ 开头的路径）
   * @returns 如果路径被允许则返回 true
   */
  private isPathAllowed(): boolean {
    const currentPath = this.getCurrentPath();

    // 如果配置中包含 * 则允许所有路径
    if (this.config.allowedPaths.includes('*')) {
      return true;
    }

    return this.config.allowedPaths.some(allowedPath => {
      if (allowedPath.endsWith('*')) {
        // 通配符匹配：检查路径前缀
        const basePath = allowedPath.slice(0, -1);
        return currentPath.startsWith(basePath);
      }
      // 精确匹配
      return currentPath === allowedPath;
    });
  }

  /**
   * 检查指定域名是否被允许
   * @param origin 要检查的域名
   * @returns 如果域名被允许则返回 true
   */
  private isOriginAllowed(origin: string): boolean {
    return this.config.allowedOrigins.includes('*') ||
      this.config.allowedOrigins.includes(origin);
  }

  /**
   * 统一的访问权限检查
   * 综合检查嵌入环境、iframe设置、路径权限和域名权限
   * @returns 如果允许访问则返回 true
   */
  private canAccess(): boolean {
    // 非嵌入环境总是允许访问
    if (!this.config.isEmbedded) return true;

    // 检查各项权限条件
    if (!this.config.allowIframe) return false;
    if (!this.isPathAllowed()) return false;
    if (!this.isOriginAllowed(this.config.parentOrigin)) return false;

    return true;
  }

  /**
   * 检查是否可以与父页面通信
   * 只有在嵌入环境且通过访问权限检查时才能通信
   * @returns 如果可以通信则返回 true
   */
  private canCommunicate(): boolean {
    return this.config.isEmbedded && this.canAccess();
  }

  /**
   * 获取访问被拒绝的具体原因
   * 用于错误页面显示和调试
   * @returns 访问被拒绝的原因描述
   */
  private getAccessDeniedReason(): string {
    if (!this.config.allowIframe) {
      return 'iframe 嵌入功能已被禁用';
    }
    if (!this.isPathAllowed()) {
      return `当前页面 "${this.getCurrentPath()}" 不允许嵌入`;
    }
    if (!this.isOriginAllowed(this.config.parentOrigin)) {
      return `域名 "${this.config.parentOrigin}" 不在允许列表中`;
    }
    return '未知原因';
  }

  // ==================== 公共 API ====================

  /**
   * 获取当前的嵌入配置
   * @returns 嵌入配置的副本
   */
  getConfig(): EmbedConfig {
    return { ...this.config };
  }

  /**
   * 向父页面发送消息
   * 只有在可以通信的情况下才会发送消息
   * @param message 要发送的消息对象
   */
  postMessageToParent(message: any): void {
    if (!this.canCommunicate() || !window.parent) return;

    try {
      window.parent.postMessage(message, this.config.parentOrigin || '*');
      console.log('📤 消息已发送到父页面:', message);
    } catch (error) {
      console.error('❌ 发送消息失败:', error);
    }
  }

  /**
   * 监听来自父页面的消息
   * 可以注册多个消息处理器，它们会按注册顺序依次执行
   * @param callback 消息处理回调函数
   */
  onMessageFromParent(callback: (data: any) => void): void {
    if (!this.canCommunicate()) return;

    // 首次添加监听器时注册全局事件监听
    if (this.messageHandlers.length === 0) {
      window.addEventListener('message', this.handleMessage.bind(this));
    }

    this.messageHandlers.push(callback);
  }

  /**
   * 处理接收到的消息
   * 验证消息来源后分发给所有注册的处理器
   * @param event 消息事件对象
   */
  private handleMessage(event: MessageEvent): void {
    // 验证消息来源域名
    if (!this.isOriginAllowed(event.origin)) {
      console.warn('❌ 消息来源不在允许列表中:', event.origin);
      return;
    }

    console.log('✅ 收到父页面消息:', event.data);

    // 分发消息给所有处理器
    this.messageHandlers.forEach(handler => {
      try {
        handler(event.data);
      } catch (error) {
        console.error('❌ 消息处理器执行错误:', error);
      }
    });
  }

  // ==================== 初始化和错误处理 ====================

  /**
   * 初始化嵌入适配器
   * 检查访问权限，设置消息监听器，通知父页面应用已加载
   * @returns 如果初始化成功则返回 true
   */
  init(): boolean {
    this.logStatus();

    // 如果访问权限检查失败，显示错误页面
    if (!this.canAccess()) {
      this.showEmbedError();
      return false;
    }

    // 如果之前显示了错误页面，现在需要隐藏它
    if (this.isShowingError) {
      this.hideEmbedError();
    }

    // 设置默认消息监听器和通知父页面
    this.setupDefaultMessageListener();
    this.notifyAppLoaded();
    return true;
  }

  /**
   * 显示嵌入访问受限的错误页面
   * 使用覆盖层方式，不破坏原有应用结构
   */
  private showEmbedError(): void {
    // 如果已经显示错误，先移除旧的
    if (this.errorOverlay) {
      this.hideEmbedError();
    }

    const reason = this.getAccessDeniedReason();

    // 创建错误覆盖层
    this.errorOverlay = document.createElement('div');
    this.errorOverlay.id = 'embed-error-overlay';
    this.errorOverlay.innerHTML = this.generateErrorHTML(reason);

    // 添加覆盖层样式
    Object.assign(this.errorOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(248, 249, 250, 0.98)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(3px)'
    });

    // 添加到页面
    document.body.appendChild(this.errorOverlay);
    this.isShowingError = true;

    console.error('嵌入访问被拒绝:', reason);
  }

  /**
   * 隐藏错误页面覆盖层
   */
  private hideEmbedError(): void {
    if (this.errorOverlay && this.errorOverlay.parentNode) {
      this.errorOverlay.parentNode.removeChild(this.errorOverlay);
    }
    this.errorOverlay = null;
    this.isShowingError = false;
    console.log('✅ 错误页面已隐藏，应用恢复正常');
  }

  /**
   * 生成错误页面的HTML内容
   * @param reason 访问被拒绝的原因
   * @returns 错误页面的HTML字符串
   */
  private generateErrorHTML(reason: string): string {
    return `
      <div style="
        padding: 40px 20px; 
        text-align: center; 
        font-family: Arial, sans-serif;
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        margin: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        max-width: 600px;
        width: 90%;
      ">
        <h3 style="color: #e74c3c; margin-bottom: 16px; font-size: 1.5rem;">🚫 嵌入访问受限</h3>
        <p style="color: #666; margin-bottom: 20px; font-size: 1rem;">此应用不允许在当前环境下使用</p>
        <div style="
          color: #999; 
          font-size: 14px; 
          text-align: left; 
          background: #f8f9fa; 
          padding: 16px; 
          border-radius: 8px; 
          margin-bottom: 20px;
        ">
          <p><strong>限制原因：</strong>${reason}</p>
          <p><strong>当前页面路径：</strong>${this.getCurrentPath()}</p>
          <p><strong>父页面域名：</strong>${this.config.parentOrigin || '无法获取'}</p>
          <p><strong>允许的域名：</strong>${this.config.allowedOrigins.join(', ')}</p>
          <p><strong>允许的路径：</strong>${this.config.allowedPaths.join(', ')}</p>
          <p><strong>iframe 支持：</strong>${this.config.allowIframe ? '已启用' : '已禁用'}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin: 0;">
          💡 提示：切换到允许的页面路径后，此限制将自动解除
        </p>
      </div>
    `;
  }

  /**
   * 设置默认的消息监听器
   * 处理常见的消息类型如 PING/PONG、父页面消息等
   */
  private setupDefaultMessageListener(): void {
    this.onMessageFromParent((data) => {
      switch (data.type) {
        case 'PING':
          // 响应父页面的心跳检测
          this.postMessageToParent({ type: 'PONG', timestamp: Date.now() });
          break;
        case 'PARENT_MESSAGE':
          // 处理父页面发送的通用消息
          console.log('父页面消息:', data.data);
          break;
        default:
          console.log('收到消息:', data);
      }
    });
  }

  /**
   * 通知父页面应用已加载完成
   * 发送应用状态和配置信息
   */
  private notifyAppLoaded(): void {
    this.postMessageToParent({
      type: 'APP_LOADED',
      timestamp: Date.now(),
      config: this.getConfig()
    });
  }

  // ==================== 状态检查和工具方法 ====================

  /**
   * 输出当前嵌入状态的详细日志
   * 用于调试和状态监控
   */
  logStatus(): void {
    console.log('=== 嵌入状态 ===');
    console.log('嵌入环境:', this.config.isEmbedded);
    console.log('允许iframe:', this.config.allowIframe);
    console.log('当前路径:', this.getCurrentPath());
    console.log('父页面域名:', this.config.parentOrigin);
    console.log('访问权限:', this.canAccess());

    if (!this.canAccess() && this.config.isEmbedded) {
      console.log('🚫 拒绝原因:', this.getAccessDeniedReason());
    }
    console.log('===============');
  }

  /**
   * 检查当前路径的访问权限
   * 用于路由切换时的权限验证，支持动态显示/隐藏错误页面
   * @returns 如果当前路径允许访问则返回 true
   */
  checkCurrentPath(): boolean {
    const isAllowed = this.canAccess();

    if (!isAllowed && this.config.isEmbedded) {
      console.warn('🚫 当前页面访问受限');
      this.showEmbedError();
    } else if (isAllowed && this.isShowingError) {
      // 如果当前路径允许访问且正在显示错误页面，则隐藏错误页面
      this.hideEmbedError();

      // 重新初始化通信
      this.setupDefaultMessageListener();
      this.notifyAppLoaded();
    }

    return isAllowed;
  }

  // ==================== 清理方法 ====================

  /**
   * 移除指定的消息处理器
   * @param handler 要移除的消息处理函数
   */
  removeMessageHandler(handler: (data: any) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  /**
   * 清理资源，移除所有消息处理器
   * 通常在组件卸载时调用
   */
  destroy(): void {
    this.messageHandlers = [];
  }
}

/**
 * 全局嵌入适配器实例
 * 可以直接导入使用，无需手动创建实例
 * 
 * @example
 * ```typescript
 * import { embedAdapter } from '@/utils/embed';
 * embedAdapter.init();
 * ```
 */
export const embedAdapter = new EmbedAdapter();