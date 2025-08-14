import { find } from 'lodash-es'
import type { E_DICT_TYPE, IDictResponse } from '../models/dict'
import { useDictStore } from '@/stores/dict'
import { getDicts } from '@/api'

/**
 * 获取字典数据
 */
export function useDict(...args: any[]) {
  // console.log('args', args)
  const { data } = useAsyncData('dicts', () => getDicts(args.join(',')))
  console.log('args', data.value)
  return toRefs(data.value?.data as any)
  // return new Promise<any>((resolve, reject) => {
  //   args.forEach((dictType, index) => {
  //     res.value[dictType] = []
  //     // const dicts = useDictStore().getDict(dictType)

  //     getDicts(dictType)
  //       .then((resp) => {
  //         res.value[dictType] = resp.data[dictType]
  //         // useDictStore().setDict(dictType, res.value[dictType])
  //         resolve(toRefs(res.value as any))
  //       })
  //       .catch((e) => {
  //         reject(e)
  //       })
  //   })
  // })
}

export function translateDict(dictValue: any, dictList: IDictResponse[]) {
  if (!dictValue) return ''
  // find(dictList, (item) => {
  //   console.log('查找字典', item)
  // })

  // return ''
  return find(dictList, (item) => item.dictValue === dictValue)?.dictLabel || ''
}
