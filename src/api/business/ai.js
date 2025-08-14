import request from '@/utils/request';


// 保存订单
export function saveAIOrder(params) {
  return request({
    url: '/business/ai/save',
    method: 'post',
    data: params,
  });
}

// 修改订单
export function changeAIOrder(params) {
  return request({
    url: '/business/ai/update',
    method: 'post',
    data: params,
  });
}

// 订单详情
export function getAIOrderDetail(id) {
  return request({
    url: `/business/ai/detail/${id}`,
    method: 'get',
  });
}

// 列表订单
export function getAIOrders(params) {
  return request({
    url: '/business/ai/list',
    method: 'get',
    params,
  });
}

// 用户列表
export function getAIUsers(params) {
  return request({
    url: '/business/ai/userList',
    method: 'get',
    params,
  });
}

// 企业列表
export function getCompanyList(params) {
  return request({
    url: '/aiassistantReport/searchEnterprise',
    method: 'post',
    data: params,
  });
}

// 关联订单
export function getAIOrderList(params) {
  return request({
    url: '/business/ai/orderList',
    method: 'get',
    params,
  });
}

// 成果中心列表
export function getAIResultList(params) {
  return request({
    url: '/business/ai/achievementPage',
    method: 'get',
    params,
  });
}

// 成果中心-处理状态
export function confirmStatus(params) {
  return request({
    url: `/business/ai/dealStatus/${params.companyId}`,
    method: 'post',
    data: params,
  });
}

// 订单管理-修改状态
export function changeOrderStatus(params) {
  return request({
    url: '/business/ai/updateStatus',
    method: 'post',
    data: params,
  });
}

// 短信触达列表
export function getSmsList(companyId) {
  return request({
    url: `/business/ai/smsList/${companyId}`,
    method: 'get',
  });
}

// 获取导入模板
export function getOrderTemplate() {
  return request({
    url: 'business/ai/getTemplate',
    method: 'get',
  });
}

// 导入数据
export function importData(params) {
  return request({
    url: 'business/ai/importData',
    method: 'post',
    data: params,
  });
}

// 选址动力分析
export function analysisReport(params) {
  return request({
    timeout: 0,
    url: '/api/report/createReport',
    method: 'post',
    data: params,
  });
}

// 获取导入模板
export function getAiFactoryNum() {
  return request({
    url: '/business/ai/countNoDeal',
    method: 'get',
  });
}

// 删除订单
export function deleteOrder(params) {
  return request({
    url: `business/ai/delOrder/${params.id}`,
    method: 'post',
    params: {
      type: params.type,
    },
  });
}

// 查询订单是否有高意向
export function checkOrder(params) {
  return request({
    url: `business/ai/checkHaveEnterprise/${params.id}`,
    method: 'get',
  });
}

// 查询报告生成状态
export function checkReportStatus(reportId) {
  return request({
    url: `/api/report/status/${reportId}`,
    method: 'get',
  });
}
