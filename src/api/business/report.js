import request from '@/utils/request';

// 查询AI招商助手报告生成记录列表
export function listReport(query) {
  return request({
    url: '/aiassistantReport/list',
    method: 'get',
    params: query,
  });
}

// 报告中心删除报告
export function deleteReport(id) {
  return request({
    url: '/aiassistantReport/delete/' + id,
    method: 'get',
  });
}

// 查询AI招商助手报告生成记录详细
export function getReport(id) {
  return request({
    url: '/business/report/' + id,
    method: 'get',
  });
}

// 新增AI招商助手报告生成记录
export function addReport(data) {
  return request({
    url: '/business/report',
    method: 'post',
    data: data,
  });
}

// 修改AI招商助手报告生成记录
export function updateReport(data) {
  return request({
    url: '/business/report',
    method: 'put',
    data: data,
  });
}

// 删除AI招商助手报告生成记录
export function delReport(id) {
  return request({
    url: '/aiassistantReport/delete/' + id,
    method: 'get',
  });
}

// 企业搜索
export function searchEnterprise() {
  return request({
    url: '/aiassistantReport/searchEnterprise',
    method: 'post',
    data: {},
  });
}
