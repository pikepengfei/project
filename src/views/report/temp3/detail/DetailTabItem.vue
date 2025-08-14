<template>
  <div ref="el">
    <div class="text-xl font-semibold text-[#3E4B58]">{{ title }}</div>
    <div class="mt-[19px]">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  id: {
    type: Number,
    default: -1,
  },
})

const setTab = inject<any>('setTab')

const el = ref<any>(null)

const currentTab = computed(() => {
  return { id: props.id, title: props.title }
})

const changeTab = (b?: boolean) => {
  setTab({ ...currentTab.value, el: el.value }, b)
}

onUpdated(() => {
  changeTab(true)
})

onUnmounted(() => {
  changeTab()
})

onMounted(() => {
  changeTab()
})
</script>
