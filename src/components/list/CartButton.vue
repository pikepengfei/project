<template>
  <div
    v-stat="{
      type: 'click',
      category: 'pre-address_list',
      label: `${fromPageList}-悬浮框-[预选址清单]`,
      action: 'click',
      id: trackId,
    }"
    class="cursor-pointer"
  >
    <div class="relative">
      <el-image
        :src="cart"
        class="w-[70px] h-[200px] transition-all duration-300"
        fit="contain"
      />
      <div
        v-if="showNumber > 0"
        class="absolute top-[-10px] right-[-10px] bg-[#c0322b] w-[24px] h-[24px] rounded-[13px] text-[16px] text-white font-medium text-center leading-[24px]"
      >
        {{ showNumber }}
      </div>
    </div>
  </div>
</template>
<script setup>
import cart from '@/assets/images/cart.png'
import { useCartStore } from '@/stores/use-cart'
const hovered = ref(false)
const { parkList, plantList, officeList } = storeToRefs(useCartStore())

const showNumber = computed(() => {
  return (
    parkList.value?.length + plantList.value?.length + officeList.value?.length
  )
})
const route = useRoute()
const fromPageList = computed(() => {
  switch (route.path.split('/')[1]) {
    case 'office':
      return '办公列表页'
    case 'park':
      return '园区列表页'
    case 'plant':
      return '厂房列表页'
    default:
      return ''
  }
})
const trackId = computed(() => {
  switch (route.path.split('/')[1]) {
    case 'office':
      return 'yb_014'
    case 'park':
      return 'yq_011'
    case 'plant':
      return 'cf_013'
    default:
      return ''
  }
})
</script>
