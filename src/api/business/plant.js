import request from '@/utils/request';

// 查询厂房基本信息列表
export function listInfo(data, query) {
  return request({
    url: '/business/plant/list',
    method: 'post',
    data: data,
    params: query,
    headers: {
      repeatSubmit: false,
    },
  });
}

// 查询厂房基本信息详细
export function getInfo(id) {
  return request({
    url: `/business/plant/detail/${id}`,
    method: 'get',
  });
}

// 新增厂房基本信息
export function addInfo(data) {
  return request({
    url: '/business/plant',
    method: 'post',
    data: data,
  });
}

// 修改厂房基本信息
export function updateInfo(data) {
  return request({
    url: '/business/plant',
    method: 'put',
    data: data,
  });
}

// 删除厂房基本信息
export function delInfo(id, version) {
  return request({
    url: '/business/plant/' + id + `/${version}`,
    method: 'delete',
  });
}
// 上架厂房
export function upList(id, version) {
  return request({
    url: '/business/plant/upList/' + id + `/${version}`,
    method: 'get',
  });
}
// 下架厂房
export function downList(id, version) {
  return request({
    url: '/business/plant/downList/' + id + `/${version}`,
    method: 'get',
  });
}
/**
 * @description: 厂房置顶
 * @return {*}
 * @param {*} data { id, status:0-取消置顶 1-置顶}
 */
export function updateTop(data) {
  return request({
    url: '/business/plant/updateTop',
    method: 'post',
    data,
  });
}
