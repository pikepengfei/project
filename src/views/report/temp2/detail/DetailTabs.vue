<template>
  <div class="detail-tabs bg-white">
    <div class="py-[60px]">
      <div
        class="mb-[34px] flex items-center justify-center space-x-[90px] h-[50px] bg-white px-5 sticky top-[63px] z-[100] border-b border-b-solid border-b-[#DCDFE6]"
      >
        <h2
          v-for="tab in sortedTabs"
          :key="tab.title"
          class="cursor-pointer text-xl text-[#3e4b58] hover:text-[#c0322b] select-none"
          :class="{
            'text-[#c0322b] active-tab font-bold': isActive(tab),
          }"
          @click="handleTabChange(tab)"
        >
          {{ tab.title }}
        </h2>
      </div>
      <div>
        <div class="pb-[10px] space-y-[50px]">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { debounce } from 'lodash-es'

const emit = defineEmits(['update:tabList'])

const activeTab = ref<any>()
const tabs = ref<any[]>([])

const sortedTabs = computed(() => {
  const list = [...tabs.value]
  list.sort((a, b) => {
    return a - b
  })
  return list
})

const setTab = (tab: any, isDestroy = false) => {
  if (isDestroy) {
    tab.value = tabs.value.filter((item) => item.id !== tab.id)
  } else {
    const isExist = tabs.value.some((item) => item.id === tab.id)

    if (!isExist) {
      tabs.value.push(tab)
    }
  }
}

const isActive = (tab: any) => {
  return tab.id === activeTab.value?.id
}

const handleScroll = debounce(() => {
  const scrollTop = document.scrollingElement!.scrollTop
  for (const tab of sortedTabs.value) {
    if (tab.el?.offsetTop > scrollTop + 20) {
      activeTab.value = tab
      return
    }
  }
}, 200)

const addListener = () => {
  document.addEventListener('scroll', handleScroll)
}

const removeListener = () => {
  document.removeEventListener('scroll', handleScroll)
}

provide('setTab', setTab)

const scrollTo = (tab: any) => {
  const rect = tab.el.getBoundingClientRect()
  console.log(tab.el.offsetTop)
  document.scrollingElement!.scrollTo({
    top: rect.y + document.scrollingElement!.scrollTop - 114,
    behavior: 'smooth',
  })
}

const handleTabChange = (tab: any) => {
  activeTab.value = tab
  removeListener()
  scrollTo(tab)
  setTimeout(() => {
    addListener()
  }, 800)
}

onBeforeMount(() => {
  removeListener()
})

onMounted(() => {
  handleScroll()
  addListener()
})
</script>
<style lang="scss">
.detail-tabs {
  .active-tab {
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 50%;
      bottom: -10px;
      transform: translateX(-50%);
      height: 2px;
      width: 30px;
      background-color: #c0322b;
    }
  }
  .detail-icon {
    position: relative;
    &.active-tab::before {
      content: '';
      display: block;
      position: absolute;
      bottom: -10px;
      height: 2px;
      width: calc(100% - 37px);
      background-color: #c0322b;
    }
    &::after {
      content: 'Hot';
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 29px;
      height: 14px;
      color: white;
      background-color: #e13a3a;
      border-radius: 2px 0px 2px 0px;
      transform: translateY(-50%);
      font-size: 10px;
      font-weight: normal;
    }
  }
}
</style>
