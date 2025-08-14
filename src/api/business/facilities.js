import request from '@/utils/request';
// 查询配套设施信息列表
export function search(name) {
  return request({
    url: '/business/supporting/search',
    method: 'get',
  });
}
// 查询配套设施信息名字
export function checkName(name) {
  return request({
    url: '/business/supporting/checkName/' + name,
    method: 'get',
  });
}

// 新增修改配套设施信息
export function addOrUpdate(data) {
  return request({
    url: '/business/supporting/addOrUpdate',
    method: 'post',
    data: data,
  });
}
// 删除
export function supporting(id) {
  return request({
    url: '/business/supporting/' + id,
    method: 'delete',
  });
}

