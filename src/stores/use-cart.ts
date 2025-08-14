export const useCartStore = defineStore(
  'cart',
  () => {
    /// 园区id列表
    const parkList = ref<string[]>([])

    /// 厂房id列表
    const plantList = ref<string[]>([])

    /// 办公id列表
    const officeList = ref<string[]>([])
    const { message } = useMessage()
    const addPark = (id: string) => {
      console.log('addPark', id)
      if (parkList.value.length >= 6) {
        message.warning('最多添加6套园区至预选址清单')
        return
      }
      parkList.value.push(id)
      message.success('成功加入预选址清单')
    }
    const removePark = (id: string) => {
      parkList.value = parkList.value.filter((item) => item !== id)
      message.success('已取消预选址')
    }
    const addPlant = (id: string) => {
      if (plantList.value.length >= 6) {
        message.warning('最多添加6套厂房至预选址清单')
        return
      }
      plantList.value.push(id)
      message.success('成功加入预选址清单')
    }
    const removePlant = (id: string) => {
      plantList.value = plantList.value.filter((item) => item !== id)
      message.success('已取消预选址')
    }

    const addOffice = (id: string) => {
      if (officeList.value.length >= 6) {
        message.warning('最多添加6套办公至预选址清单')
        return
      }
      officeList.value.push(id)
      message.success('成功加入预选址清单')
    }
    const removeOffice = (id: string) => {
      officeList.value = officeList.value.filter((item) => item !== id)
      message.success('已取消预选址')
    }
    const setPark = (ids: string[]) => {
      parkList.value = ids
    }

    const setPlant = (ids: string[]) => {
      plantList.value = ids
    }

    const setOffice = (ids: string[]) => {
      officeList.value = ids
    }

    return {
      plantList,
      addPlant,
      removePlant,
      parkList,
      addPark,
      removePark,
      officeList,
      addOffice,
      removeOffice,

      setPark,
      setPlant,
      setOffice,
    }
  },
  {
    // @ts-ignore
    persist: import.meta.client && {
      storage: localStorage,
    },
  },
)
