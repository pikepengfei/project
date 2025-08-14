export const usePersonCardStore = defineStore('person-card', () => {
  const isShowPhone = ref(false)

  const changeShowPhone = (b: boolean) => {
    isShowPhone.value = b
  }

  return {
    isShowPhone,
    changeShowPhone,
  }
})
