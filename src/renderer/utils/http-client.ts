/**
 * 渲染进程 HTTP 客户端
 * 基于 fetch API，支持拦截器和错误处理
 */

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor = <T>(response: Response<T>) => Response<T> | Promise<Response<T>>;
export type ErrorInterceptor = (error: Error) => Promise<never> | never;

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(options: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
  } = {}) {
    this.baseURL = options.baseURL || '';
    this.timeout = options.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * 执行请求拦截器
   */
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }

  /**
   * 执行响应拦截器
   */
  private async applyResponseInterceptors<T>(response: Response<T>): Promise<Response<T>> {
    let finalResponse = response;
    for (const interceptor of this.responseInterceptors) {
      finalResponse = await interceptor(finalResponse);
    }
    return finalResponse;
  }

  /**
   * 处理错误
   */
  private async handleError(error: Error): Promise<never> {
    console.error('HTTP 请求错误:', error);
    
    for (const interceptor of this.errorInterceptors) {
      try {
        await interceptor(error);
      } catch (e) {
        // 错误拦截器中的错误不应该阻止错误传播
      }
    }
    
    throw error;
  }

  /**
   * 构建完整的 URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    const urlObj = new URL(fullURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });

    return urlObj.toString();
  }

  /**
   * 发送 HTTP 请求
   */
  async request<T = any>(config: RequestConfig): Promise<Response<T>> {
    try {
      // 应用请求拦截器
      const finalConfig = await this.applyRequestInterceptors(config);

      // 构建 URL
      const url = this.buildURL(finalConfig.url, finalConfig.params);

      // 准备请求选项
      const requestOptions: RequestInit = {
        method: finalConfig.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...finalConfig.headers,
        },
      };

      // 添加请求体
      if (finalConfig.data && finalConfig.method !== 'GET') {
        if (finalConfig.data instanceof FormData) {
          // FormData 不需要设置 Content-Type，浏览器会自动设置
          delete (requestOptions.headers as Record<string, string>)['Content-Type'];
          requestOptions.body = finalConfig.data;
        } else if (typeof finalConfig.data === 'string') {
          requestOptions.body = finalConfig.data;
        } else {
          requestOptions.body = JSON.stringify(finalConfig.data);
        }
      }

      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout || this.timeout);
      requestOptions.signal = controller.signal;

      console.debug(`HTTP ${finalConfig.method || 'GET'} ${url}`);

      // 发送请求
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // 解析响应头
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // 解析响应体
      let data: T;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = (await response.text()) as T;
      } else {
        data = (await response.arrayBuffer()) as T;
      }

      const httpResponse: Response<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers,
      };

      // 检查 HTTP 状态码
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).response = httpResponse;
        throw error;
      }

      // 应用响应拦截器
      return await this.applyResponseInterceptors(httpResponse);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error(`请求超时 (${config.timeout || this.timeout}ms)`);
          return await this.handleError(timeoutError);
        }
        return await this.handleError(error);
      }
      return await this.handleError(new Error('未知错误'));
    }
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'POST', data });
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', data });
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'data'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', data });
  }
}

/**
 * 创建默认的 HTTP 客户端实例
 */
export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
});

