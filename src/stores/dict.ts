export const useDictStore = defineStore('dict', () => {
  const dict = ref<any>()
  // // 获取字典
  // const getDict = (_key: any) => {
  //   if (_key == null && _key === '') {
  //     return null
  //   }
  //   try {
  //     for (let i = 0; i < dict.value.length; i++) {
  //       if (dict.value[i].key === _key) {
  //         return dict.value[i].value
  //       }
  //     }
  //   } catch (e) {
  //     return null
  //   }
  // }
  // 设置字典
  const setDict = (_key: any, value: any) => {
    if (_key !== null && _key !== '') {
      dict.value[_key] = value
    }
  }
  // // 删除字典
  // const removeDict = (_key: any) => {
  //   let bln = false
  //   try {
  //     for (let i = 0; i < dict.value.length; i++) {
  //       if (dict.value[i].key === _key) {
  //         dict.value.splice(i, 1)
  //         return true
  //       }
  //     }
  //   } catch (e) {
  //     bln = false
  //   }
  //   return bln
  // }
  // 清空字典
  const cleanDict = () => {
    dict.value = []
  }
  // 初始字典
  const initDict = (allDicts: any) => {
    dict.value = allDicts
  }

  return {
    dict,
    // getDict,
    setDict,
    // removeDict,
    cleanDict,
    initDict,
  }
})
