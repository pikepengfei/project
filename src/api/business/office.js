import request from '@/utils/request';

// 查询研发办公信息列表
export function listOffice(query) {
  return request({
    url: '/business/office/list',
    method: 'get',
    params: query,
  });
}

// 查询研发办公信息详细
export function getOffice(id) {
  return request({
    url: '/business/office/' + id,
    method: 'get',
  });
}

// 新增研发办公信息
export function addOffice(data) {
  return request({
    url: '/business/office',
    method: 'post',
    data: data,
  });
}

// 修改研发办公信息
export function updateOffice(data) {
  return request({
    url: '/business/office',
    method: 'put',
    data: data,
  });
}

// 删除研发办公信息
export function delOffice(id, version) {
  return request({
    url: '/business/office/' + id + `/${version}`,
    method: 'delete',
  });
}
/**
 * @description: 研发办公上下架
 * @param data : { id, status:1-下架 2-上架}
 * @return {*}
 */

export function upOrDownList(data) {
  return request({
    url: '/business/office/updateStatus',
    method: 'post',
    data,
  });
}
/**
 * @description: 办公置顶
 * @return {*}
 * @param {*} data { id, status:0-取消置顶 1-置顶}
 */
export function updateTop(data) {
  return request({
    url: '/business/office/updateTop',
    method: 'post',
    data,
  });
}
/**
 * @description: 复制办公列表项
 * @return {*}
 * @param {*} id
 */
export function copyItem(id, version) {
  return request({
    url: '/business/office/copy/' + id + `/${version}`,
    method: 'get',
  });
}
