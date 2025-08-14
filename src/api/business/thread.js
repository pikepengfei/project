import request from '@/utils/request'

// 查询线索管理列表
export function listThread(query) {
  return request({
    url: '/business/thread/list',
    method: 'get',
    params: query
  })
}

// 处理线索
export function updateThread(id) {
  return request({
    url: '/business/thread/deal/'+id,
    method: 'post',
  })
}

export function getThreadNum() {
  return request({
    url: '/business/thread/number',
  })
}

