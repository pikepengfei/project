export interface IUserInfo {
  // nickName: string
  // avatar: string
  token: string
  phone: string
  userId: number
}

// const initState = {
//   token:
//     'eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVfdGltZSI6MTcyOTUxMjMzMzI2NiwiZGV0YWlscyI6eyJwaG9uZSI6IjE1ODExNDI2MDYxIiwidXNlcklkIjoxODQ2ODI4ODczNjQ3NjI0MTkzfX0.OdydJu27-85XmFQ87rpzRBYeFzJNbvdiv7bZn7uYjOc',
// }
export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>()

    const setUserInfo = (val?: IUserInfo) => {
      userInfo.value = val
    }

    // const clearUserInfo = () => {
    //   userInfo.value = { ...initState }
    // }
    const isLogined = computed(() => !!userInfo.value?.token)

    return {
      userInfo,
      setUserInfo,
      isLogined,
    }
  },
  {
    // @ts-ignore
    persist: import.meta.client && {
      storage: localStorage,
    },
  },
)
