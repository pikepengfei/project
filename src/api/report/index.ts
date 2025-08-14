import request from '@/utils/request';

/**
 * 报告API接口集合
 * @method getReportDetail 获取报告详情数据
 * @method getReportList 获取报告列表
 */
export function useReportApi() {
	return {
		// 获取报告列表
		getReportList: (params?: object) => {
			return request({
				url: '/api/report/list',
				method: 'get',
				params,
			});
		},
		// 获取报告详情测试数据
		getReportDetail: (dataId) => {
			return request({
				url: `/api/report/detail/${dataId}`,
				method: 'post',
				// params,
			});
		},

		// 获取选址报告数据
		getAddressReport: (reportId) => {
			return request({
				url: `/api/siteReport/parkRecommendation/detail/${reportId}`,
				method: 'post',
			});
		},

		// 获取选址报告数据
		getDetaliReport: (reportId, userId) => {
			return request({
				url: `/applet/report/reportDetail/${reportId}/${userId}`,
				method: 'get',
			});
		},
	};
}
