<template>
  <div
    class="w-full flex items-center justify-between h-[46px] box-border px-[16px] bg-white"
  >
    <div class="flex items-center">
      <div
        class="whitespace-nowrap bg-[#EEF4FD] w-[80px] min-w-[80px] h-[28px] rounded-[2px] text-[14px] text-[#7f7e7e] text-center leading-[28px] hover:bg-[#c0322b] cursor-pointer hover:text-white"
        @click="clearAll"
      >
        清空筛选
      </div>
      <!-- <div v-if="showParkName" class="flex items-center ml-[40px]">
        <div class="text-[#7f7e7e] whitespace-nowrap">所属园区：</div>
        <div class="text-[#c0322b] mr-[6px] line-clamp-1">
          {{ showParkName }}
        </div>
        <div
          class="cursor-pointer flex items-center w-[50px] h-[30px]"
          @click="deleteSelected"
        >
          <el-icon color="#dedada"><CircleCloseFilled /></el-icon>
        </div>
      </div> -->
    </div>
    <div class="text-[14px] text-[#3e4b58] font-medium whitespace-nowrap">
      已为您找到<span class="text-[#c0322b]">{{ props.total || 0 }}</span
      >{{ typeName }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { filter } from 'lodash-es'
import { E_PAGE_TYPE } from '@/models/list'
import { useGlobalStore } from '@/stores'

const emits = defineEmits(['clearAll', 'clearSelectPark'])

const {
  plantSelectedPark,
  officeSelectedPark,
  filterPlantParkId,
  filterOfficeParkId,
  filterPlantPlantId,
} = storeToRefs(useGlobalStore())
const { cancelPlantSelectedPark, cancelOfficeSelectedPark } = useGlobalStore()

const props = defineProps<{
  // 总数
  total?: number
  pageType?: string
}>()
const typeName = computed(() => {
  switch (props.pageType) {
    case E_PAGE_TYPE.OFFICE:
      return '套办公'
    case E_PAGE_TYPE.PARK:
      return '个园区'
    case E_PAGE_TYPE.PLANT:
      return '套厂房'
    default:
      return '个园区'
  }
})
const showParkName = computed(() => {
  if (props.pageType === 'plant') {
    return plantSelectedPark.value?.parkName
  }
  if (props.pageType === 'office') {
    return officeSelectedPark.value?.parkName
  }
})
function clearAll() {
  if (props.pageType === 'plant') {
    filterPlantParkId.value = ''
    filterPlantPlantId.value = ''
    cancelPlantSelectedPark()
  } else if (props.pageType === 'office') {
    filterOfficeParkId.value = ''
    cancelOfficeSelectedPark()
  }
  emits('clearAll')
}
function deleteSelected() {
  if (props.pageType === 'plant') {
    filterPlantParkId.value = ''
    cancelPlantSelectedPark()
  } else if (props.pageType === 'office') {
    filterOfficeParkId.value = ''
    cancelOfficeSelectedPark()
  }
  emits('clearSelectPark')
}
</script>
