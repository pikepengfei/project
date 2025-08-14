import { concat, forEach } from 'lodash-es'

import type { FilterOption } from '../models/list'
export const letters = (() => {
  const pre = []
  const next = []

  for (let i = 0; i < 26; i++) {
    pre.push(String.fromCharCode(97 + i))
    next.push(String.fromCharCode(65 + i))
  }

  return pre.concat(next)
})()

export const addUrlKey = (options: FilterOption[]) => {
  let tempList: any[] = []
  options.forEach((item, index) => {
    if (item.more) {
      tempList = concat(tempList, item.more)
    } else {
      tempList.push(item)
    }
  })
  forEach(tempList, (item: any, index: number) => {
    forEach(item.options, (option: any) => {
      option.urlKey = letters[index]
    })
    item.urlKey = letters[index]
  })
  // console.log('最终筛选', tempList)
  return options
}
export const getOneOptionList = (options: FilterOption[]) => {
  let tempList: any[] = []
  options.forEach((item, index) => {
    if (item.more) {
      tempList = concat(tempList, item.more)
    } else {
      tempList.push(item)
    }
  })
  return tempList
}

export const parseFilterParams = (params: string) => {
  if (params) {
    const result: any = {}
    let key = ''
    for (const ch of params) {
      if (/[a-zA-Z]/.test(ch)) {
        key = ch
        result[key] = ''
      } else {
        result[key] += ch
      }
    }
    for (const k in result) {
      const v = result[k]
      result[k] = v.split(';')
    }
    return result
  } else {
    return null
  }
}
