export const useListStore = defineStore(
  'list',
  () => {
    const mapSwitchRef = ref(true)

    return { mapSwitchRef }
  },
  {
    // @ts-ignore
    persist: import.meta.client && {
      storage: sessionStorage,
    },
  },
)
