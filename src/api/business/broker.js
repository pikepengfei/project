import request from '@/utils/request';

// 查询经纪人信息列表
export function listBroker(query) {
  return request({
    url: '/business/broker/list',
    method: 'get',
    params: query,
  });
}

// 查询经纪人信息详细
export function getBroker(id) {
  return request({
    url: '/business/broker/' + id,
    method: 'get',
  });
}

// 新增经纪人信息
export function addBroker(data) {
  return request({
    url: '/business/broker',
    method: 'post',
    data: data,
  });
}

// 修改经纪人信息
export function updateBroker(data) {
  return request({
    url: '/business/broker',
    method: 'put',
    data: data,
  });
}

// 删除经纪人信息
export function delBroker(id) {
  return request({
    url: '/business/broker/' + id,
    method: 'delete',
  });
}
