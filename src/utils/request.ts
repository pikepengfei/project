import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session, TokenKey } from '@/utils/storage';
import qs from 'qs';

// 域名配置 - 简化为只有两个域名
const API_DOMAINS = {
	// 报告相关域名：默认域名、报告接口
	report: import.meta.env.DEV ? '' : import.meta.env.VITE_REPORT_API_URL,
	// 管理相关域名：业务、用户、AI接口
	applet: import.meta.env.DEV ? '' : import.meta.env.VITE_APPLET_API_URL,
} as const;

// 根据URL路径判断使用哪个域名
function getDomainByUrl(url: string): string {
	// 管理相关接口使用 manage 域名
	if (url.startsWith('/api/')) {
		return API_DOMAINS.report;
	}
	if (url.startsWith('/applet/')) {
		return API_DOMAINS.applet;
	}

	// 其他所有接口（包括报告相关）使用 report 域名
	return API_DOMAINS.report;
}

// 创建axios实例的通用配置
function createAxiosInstance(baseURL: string): AxiosInstance {
	const instance = axios.create({
		baseURL,
		timeout: 50000,
		headers: { 'Content-Type': 'application/json' },
		paramsSerializer: {
			serialize(params) {
				return qs.stringify(params, { allowDots: true });
			},
		},
	});

	// 添加请求拦截器
	instance.interceptors.request.use(
		(config) => {
			// 在发送请求之前做些什么 token
			if (Session.get(TokenKey)) {
				config.headers!['Authorization'] = `Bearer ${Session.get(TokenKey)}`;
			}
			return config;
		},
		(error) => {
			// 对请求错误做些什么
			return Promise.reject(error);
		}
	);

	// 添加响应拦截器
	instance.interceptors.response.use(
		(response) => {
			// 对响应数据做点什么
			const res = response.data;
			if (res.code && res.code !== 200) {
				// `token` 过期或者账号已在别处登录
				// if (res.code === 401 || res.code === 4001) {
				// 	Session.clear(); // 清除浏览器全部临时缓存
				// 	window.location.href = '/'; // 去登录页
				// 	ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
				// 		.then(() => { })
				// 		.catch(() => { });
				// }
				return Promise.reject(res);
			} else {
				return res;
			}
		},
		(error) => {
			// 对响应错误做点什么
			if (error.message.indexOf('timeout') != -1) {
				ElMessage.error('网络请求超时，请稍后重试');
			} else if (error.message == 'Network Error') {
				ElMessage.error('网络连接异常，请检查网络');
			} else {
				if (error.response.data) ElMessage.error(error.response.statusText);
				else ElMessage.error('接口路径找不到');
			}
			return Promise.reject(error);
		}
	);

	return instance;
}

// 缓存axios实例
const axiosInstances: Map<string, AxiosInstance> = new Map();

// 获取或创建axios实例
function getAxiosInstance(baseURL: string): AxiosInstance {
	if (!axiosInstances.has(baseURL)) {
		axiosInstances.set(baseURL, createAxiosInstance(baseURL));
	}
	return axiosInstances.get(baseURL)!;
}

// 智能请求函数
function smartRequest(config: AxiosRequestConfig) {
	console.log('Request Config:', config);

	const url = config.url || '';
	const baseURL = getDomainByUrl(url);
	console.log('Using baseURL:', baseURL);

	const instance = getAxiosInstance(baseURL);

	return instance.request(config);
}

// 配置默认的 axios 实例（保持向后兼容）
const service: AxiosInstance = createAxiosInstance(API_DOMAINS.report);

// 导出智能请求函数作为默认导出
export default smartRequest;

// 也导出传统的service实例，保持兼容性
export { service };

// 导出特定域名的请求函数
export const gtvRequest = (config: AxiosRequestConfig) => getAxiosInstance(API_DOMAINS.gtv).request(config);
export const reportRequest = (config: AxiosRequestConfig) => getAxiosInstance(API_DOMAINS.report).request(config);
