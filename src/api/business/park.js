import request from '@/utils/request';

// 查询园区列表
export function listPark(query) {
  return request({
    url: '/business/park/list',
    method: 'get',
    params: query,
  });
}

// 查询园区详细
export function getPark(id) {
  return request({
    url: '/business/park/' + id,
    method: 'get',
  });
}

// 新增园区
export function addPark(data) {
  return request({
    url: '/business/park',
    method: 'post',
    data: data,
  });
}

// 修改园区
export function updatePark(data) {
  return request({
    url: '/business/park',
    method: 'put',
    data: data,
  });
}

// 删除园区
export function delPark(id, version) {
  return request({
    url: '/business/park/' + id + `/${version}`,
    method: 'delete',
  });
}
/**
 * @description: 园区上下架
 * @param data : { id, status:1-下架 2-上架}
 * @return {*}
 */
export function upOrDownList(data) {
  return request({
    url: '/business/park/updateStatus',
    method: 'post',
    data,
  });
}
/**
 * @description: 园区置顶
 * @return {*}
 * @param {*} data { id, status:0-取消置顶 1-置顶}
 */
export function updateTop(data) {
  return request({
    url: '/business/park/updateTop',
    method: 'post',
    data,
  });
}

/**
 * 新增产业方向
 */
export function addIndustry({ name }) {
  return request({
    url: '/business/industry',
    method: 'post',
    data: { name },
  });
}

/**
 * 删除产业方向
 */
export function deleteIndustry(id) {
  return request({
    url: `/business/industry/${id}`,
    method: 'delete',
  });
}

/**
 * 查询产业方向
 */
export function queryIndustry() {
  return request({
    url: '/business/industry/list',
    method: 'get',
  });
}

/**
 * 修改是否首页展示
 */
export function changeShowHome(params) {
  return request({
    url: '/business/park/updateRepresent',
    method: 'post',
    data: params,
  });
}

export function checkParkName(params) {
  return request({
    url: `/business/park/check/${params.name}`,
    method: 'get',
    noMsg: true,
  });
}

/**
 * 查询园区录入-园区配套
 */
export function queryParkSupporting() {
  return request({
    url: '/business/supporting/supportingToPark',
    method: 'get',
  }).then((res) => {
    return { data: res };
  });
}
