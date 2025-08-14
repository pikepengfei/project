<template>
  <div
    class="fixed top-0 right-5 flex flex-col items-center justify-center h-full z-[200]"
  >
    <div class="h-[380px]">
      <CartButton
        v-stat="{
          type: 'click',
          category: 'plant',
          label: `${typeName}详情页-悬浮框[预选址清单]`,
          action: 'click',
          id: trackId,
        }"
        class="mb-[13px]"
        @click="handleCart"
      />
      <AIButton class="" />
    </div>
  </div>

  <CartDialog
    v-model="showCart"
    :page-type="props.pageType"
    @close="changeShowCart(false)"
    @generate="handleCartGenerate"
  />

  <LoginOrGen
    v-model="showLoginOrGen"
    :ids="downloadIds"
    :report-type="reportType"
    @close="showLoginOrGen = false"
  />
</template>

<script lang="ts" setup>
import CartButton from '@/components/list/CartButton.vue'
import CartDialog from '@/components/list/Cart.vue'
import AIButton from '@/components/list/AIButton.vue'
import LoginOrGen from '@/components/layouts/dialog/loginOrGen.vue'

const showCart = ref(false)
const showLoginOrGen = ref(false)
const downloadIds = ref('')
const reportType = ref<number>(-1)
const props = defineProps<{
  pageType: any
}>()

const typeName = computed(() => {
  if (props.pageType === 0) {
    return '园区'
  } else if (props.pageType === 1) {
    return '厂房'
  } else {
    return '研办'
  }
})
const trackId = computed(() => {
  if (props.pageType === 0) {
    return 'yx_004'
  } else if (props.pageType === 1) {
    return 'cx_004'
  } else {
    return 'ybx_004'
  }
})
const changeShowCart = (b: boolean) => {
  showCart.value = b
}

const changeShowGen = (b: boolean) => {
  showLoginOrGen.value = b
}

function handleCartGenerate(info: { type: number; ids: string }) {
  reportType.value = info.type
  showLoginOrGen.value = true
  downloadIds.value = info.ids
}

const handleCart = () => {
  showCart.value = true
}

defineExpose({
  handleCartGenerate,
})
</script>
