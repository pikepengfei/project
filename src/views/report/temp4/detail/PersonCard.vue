<template>
  <div v-if="info" class="person-card">
    <div
      class="border border-solid border-[#DCDFE6] rounded-[4px] px-[30px] py-5 flex justify-between"
    >
      <div class="flex flex-col justify-center">
        <div class="w-[62px] h-[62px] rounded-[50%] overflow-hidden">
          <img class="w-full h-full" :src="avatar" alt="" />
        </div>
        <div class="mt-[10px] text-base text-center">{{ info.name }}</div>
      </div>
      <div class="space-y-[14px] min-w-[140px]">
        <div class="flex items-center">
          <div
            class="w-[60px] h-[22px] flex items-center justify-center border border-solid border-[#DCDFE6] bg-[#F5F7FB] text-[#7E7F7F] text-xs rounded-sm"
          >
            已认证
          </div>
          <div
            v-if="workCard"
            class="ml-[7px] text-lg cursor-pointer"
            @click="changeShowCard(true)"
          >
            <img
              class="h-[18.2px] w-[20px]"
              src="@/assets/images/person-icon.png"
              alt=""
            />
          </div>
        </div>
        <div class="text-[#7F7E7E]">{{ info.job }}</div>
        <div
          v-if="!isShowPhone"
          v-stat="{
            type: 'click',
            category: 'plant',
            label: `${typeName}详情页-[查看联系方式]按钮`,
            action: 'click',
            id: trackId,
          }"
          class="text-[#3E4B58] underline cursor-pointer"
          @click="changeShowPhone(true)"
        >
          查看联系方式
        </div>
        <div v-else class="text-[#3E4B58] cursor-pointer">
          {{ info.phone }}
        </div>
      </div>
      <div>
        <div class="w-[90px] h-[90px]">
          <img class="w-full h-full" :src="qrCode" alt="" />
        </div>
      </div>
    </div>
    <el-dialog
      v-model="isShowCard"
      title="工作证"
      width="500px"
      center
      append-to-body
      :show-close="false"
      class="person-card-dialog"
    >
      <img
        class="absolute -top-[35px] -right-[10px] translate-x-full cursor-pointer w-[44px] h-[44px]"
        src="@/assets/images/card-close.png"
        alt=""
        @click="changeShowCard(false)"
      />
      <div class="flex justify-center bg-white">
        <img class="w-[455px] h-[285px]" :src="workCard" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { getFileUrl } from '@/utils/file'
import { usePersonCardStore } from '@/stores/person-card'

const props = withDefaults(
  defineProps<{
    info: any
    type: string
  }>(),
  {},
)

const isShowCard = ref(false)
const personCardStore = usePersonCardStore()

const isShowPhone = computed(() => {
  return personCardStore.isShowPhone
})

const typeName = computed(() => {
  if (props.type === 'park') {
    return '园区'
  } else if (props.type === 'office') {
    return '研办'
  } else {
    return '厂房'
  }
})
const trackId = computed(() => {
  if (props.type === 'park') {
    return 'yx_003'
  } else if (props.type === 'office') {
    return 'ybx_003'
  } else {
    return 'cx_003'
  }
})
const avatar = computed(() => {
  if (props.info) {
    const result = JSON.parse(props.info.avatar)
    return getFileUrl(result?.[0]?.fileUrl || '')
  } else {
    return ''
  }
})

const workCard = computed(() => {
  if (props.info && props.info.workCard) {
    const result = JSON.parse(props.info.workCard)
    return getFileUrl(result?.[0]?.fileUrl || '')
  } else {
    return ''
  }
})

const qrCode = computed(() => {
  if (props.info) {
    const result = JSON.parse(props.info.qrCode)
    return getFileUrl(result?.[0]?.fileUrl || '')
  } else {
    return ''
  }
})

const changeShowCard = (b: boolean) => {
  isShowCard.value = b
}

const changeShowPhone = (b: boolean) => {
  personCardStore.changeShowPhone(b)
}

onUnmounted(() => {
  personCardStore.changeShowPhone(false)
})
</script>

<style lang="scss">
.person-card-dialog {
  .el-dialog__title {
    font-size: 16px;
  }
}
</style>
