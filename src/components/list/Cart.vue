<template>
  <el-dialog
    v-model="showCart"
    width="75.3125vw"
    :show-close="false"
    top=".5208vw"
    style="background-color: transparent; box-shadow: none"
    :close-on-click-modal="false"
  >
    <div class="relative w-[77.3958vw] h-[85vh]">
      <div class="w-[75.3125vw] bg-[#f5f7fb] rounded-lg h-full">
        <div
          class="w-full text-center text-[.9375vw] font-medium text-black pt-[.8333vw] pb-[.3646vw] bg-white rounded-t-lg"
        >
          预选址清单
        </div>
        <div class="relative">
          <el-tabs
            v-model="activeTab"
            class="demo-tabs"
            @tab-click="handleClick"
          >
            <el-tab-pane :label="parkTabTitle" name="park">
              <div
                class="w-full tab-content-height rounded-b-lg overflow-y-auto scrollbar px-[1.0938vw] pb-[2.0833vw]"
              >
                <div class="flex items-start flex-wrap gap-x-[.8854vw]">
                  <CardPark
                    v-for="(item, index) in parkDataSource"
                    :key="index"
                    :data="item"
                    from-cart
                    class="mb-[1.0417vw]"
                    @delete="refreshListData"
                  />
                </div>

                <div
                  v-if="parkList.length === 0"
                  class="w-full h-full flex items-center justify-center"
                >
                  <div>
                    <img
                      src="@/assets/images/no_data.png"
                      class="w-[20.8333vw] h-[14.7917vw]"
                    />
                    <div class="w-full text-center mt-[1.0417vw]">
                      您还未添加意向园区，<NuxtLink
                        class="text-[#1763ff]"
                        to="/park"
                        target="_blank"
                        >去添加</NuxtLink
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute w-[75.3125vw] h-[3.0208vw] bg-white rounded-b-lg bottom-0 left-0 flex items-center justify-center"
              >
                <el-button
                  v-stat="{
                    type: 'click',
                    category: 'pre-address_list',
                    label: `[预选址清单]弹窗-[下载报告]按钮`,
                    action: 'click',
                    id: 'yxz_001',
                  }"
                  type="primary"
                  style="
                    width: 12.6042vw;
                    height: 2.1875vw;
                    font-size: 0.7292vw;
                  "
                  :disabled="parkList.length === 0"
                  @click="handleGenerateReport"
                >
                  <template #icon>
                    <img src="@/assets/images/paper_download.png" />
                  </template>
                  一键生成载体报告</el-button
                >
              </div>
            </el-tab-pane>
            <el-tab-pane :label="plantTabTitle" name="plant">
              <div
                class="w-full tab-content-height rounded-b-lg overflow-y-auto px-[1.0938vw] scrollbar pb-[3.3854vw]"
              >
                <div class="flex items-start flex-wrap gap-x-[.8854vw]">
                  <div
                    v-for="(item, index) in plantDataSource"
                    :key="index"
                    class="mb-[1.0417vw]"
                  >
                    <CardPlant
                      :data="item"
                      from-cart
                      @delete="refreshListData"
                    />
                  </div>
                </div>
                <div
                  v-if="plantList.length === 0"
                  class="w-full h-full flex items-center justify-center"
                >
                  <div>
                    <img
                      src="@/assets/images/no_data.png"
                      class="w-[20.8333vw] h-[14.7917vw]"
                    />
                    <div class="w-full text-center mt-[1.0417vw]">
                      您还未添加意向厂房，<NuxtLink
                        class="text-[#1763ff]"
                        to="/plant"
                        target="_blank"
                        >去添加</NuxtLink
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute w-[75.3125vw] h-[3.0208vw] bg-white rounded-b-lg bottom-0 left-0 flex items-center justify-center"
              >
                <el-button
                  v-stat="{
                    type: 'click',
                    category: 'pre-address_list',
                    label: `[预选址清单]弹窗-[下载报告]按钮`,
                    action: 'click',
                    id: 'yxz_001',
                  }"
                  type="primary"
                  style="
                    width: 12.6042vw;
                    height: 2.1875vw;
                    font-size: 0.7292vw;
                  "
                  :disabled="plantList.length === 0"
                  @click="handleGenerateReport"
                >
                  <template #icon>
                    <img src="@/assets/images/paper_download.png" />
                  </template>
                  一键生成载体报告</el-button
                >
              </div>
            </el-tab-pane>
            <el-tab-pane :label="officeTabTitle" name="office">
              <div
                class="tab-content-height rounded-b-lg overflow-y-auto px-[1.0938vw] scrollbar pb-[3.3854vw]"
              >
                <div class="w-full flex items-start flex-wrap gap-x-[.8854vw]">
                  <div
                    v-for="(item, index) in officeDataSource"
                    :key="index"
                    class="mb-[1.0417vw]"
                  >
                    <CardOffice
                      :data="item"
                      from-cart
                      @delete="refreshListData"
                    />
                  </div>
                </div>
                <div
                  v-if="officeList.length === 0"
                  class="w-full h-full flex items-center justify-center"
                >
                  <div>
                    <img
                      src="@/assets/images/no_data.png"
                      class="w-[20.8333vw] h-[14.7917vw]"
                    />
                    <div class="w-full text-center mt-[1.0417vw]">
                      您还未添加意向办公，<NuxtLink
                        class="text-[#1763ff]"
                        to="/office"
                        target="_blank"
                        >去添加</NuxtLink
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="absolute w-[75.3125vw] h-[3.0208vw] bg-white rounded-b-lg bottom-0 left-0 flex items-center justify-center"
              >
                <el-button
                  v-stat="{
                    type: 'click',
                    category: 'pre-address_list',
                    label: `[预选址清单]弹窗-[下载报告]按钮`,
                    action: 'click',
                    id: 'yxz_001',
                  }"
                  type="primary"
                  style="
                    width: 12.6042vw;
                    height: 2.1875vw;
                    font-size: 0.7292vw;
                  "
                  :disabled="officeList.length === 0"
                  @click="handleGenerateReport"
                >
                  <template #icon>
                    <img src="@/assets/images/paper_download.png" />
                  </template>
                  一键生成载体报告</el-button
                >
              </div></el-tab-pane
            >
          </el-tabs>
          <div
            v-if="showDeleteAll"
            class="absolute right-[20px] top-[3px] flex items-center z-10 w-[100px] h-[28px] hover:bg-[#ff352c] hover:bg-opacity-5 cursor-pointer text-[#7f7e7e] text-[14px] hover:text-[#c0322b] justify-center rounded-sm"
            @mouseleave="deleteAllHovered = false"
            @mouseover="deleteAllHovered = true"
            @click="handleDeleteAll"
          >
            <img
              :src="`${deleteAllHovered ? deleteAllHoveredIcon : deleteAllIcon}`"
              class="w-[15px] h-[15px] mr-[8px]"
            />
            <span>一键清空</span>
          </div>
        </div>
      </div>
      <img
        src="@/assets/images/close_dialog.png"
        class="absolute w-[2.2917vw] h-[2.2917vw] z-10 right-0 top-[-1.25vw] cursor-pointer"
        @click="emits('close')"
      />
    </div>
    <el-dialog v-model="showConfirmClearAll" width="418px" :show-close="false">
      <div
        class="w-[418px] h-[190px] rounded-[8px] bg-white flex flex-col justify-between"
      >
        <div>
          <div
            class="w-full flex items-center justify-between h-[56px] box-border px-[16px]"
          >
            <div class="text-[14px] font-medium text-black">一键清空</div>
            <div class="cursor-pointer" @click="showConfirmClearAll = false">
              <el-icon size="12px"><Close /></el-icon>
            </div>
          </div>
          <div class="w-full h-[1px] bg-[#f0f0f0]"></div>
        </div>
        <div
          class="pt-[15px] box-border px-[16px] text-[14px] text-[#505d6e] h-full"
        >
          确认删除{{
            activeTab === 'park'
              ? '园区'
              : activeTab === 'plant'
                ? '厂房'
                : '办公'
          }}预选址清单？
        </div>
        <div>
          <div class="w-full h-[1px] bg-[#f0f0f0]"></div>
          <div
            class="w-full h-[51px] flex justify-end items-center box-border px-[16px]"
          >
            <div
              class="w-[60px] h-[32px] bg-[#f1f5f8] rounded-[4px] leading-[32px] text-center text-[#505d6e] text-[14px] cursor-pointer"
              @click="showConfirmClearAll = false"
            >
              取消
            </div>
            <div
              class="w-[60px] h-[32px] bg-[#c0233b] rounded-[4px] leading-[32px] text-center text-white text-[14px] ml-[8px] cursor-pointer"
              @click="handleConfirmClearAll"
            >
              删除
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script setup lang="ts">
import CardPark from '@/components/card/Park.vue'
import CardPlant from '@/components/card/Plant.vue'
import CardOffice from '@/components/card/Office.vue'

import { getCartParkList, getCartPlantList, getCartOfficeList } from '@/api'
import { useCartStore } from '@/stores/use-cart'
import type {
  IOfficeRecord,
  IParkRecord,
  IPlantRecord,
} from '@/models/list'
import deleteAllIcon from '@/assets/images/delete_all.png'
import deleteAllHoveredIcon from '@/assets/images/delete_all_hover.png'
const props = defineProps<{
  modelValue: boolean
  pageType?: string
}>()
const emits = defineEmits(['close', 'update:modelValue', 'generate'])
const activeTab = ref('park')
const { plantList, parkList, officeList } = storeToRefs(useCartStore())
const { setPark, setPlant, setOffice } = useCartStore()

const parkDataSource = ref<IParkRecord[]>([])
const plantDataSource = ref<IPlantRecord[]>([])
const officeDataSource = ref<IOfficeRecord[]>([])
const deleteAllHovered = ref(false)
const showConfirmClearAll = ref(false)

const handleClick = (tab: any, event: any) => {}
const showCart = computed({
  // 子组件v-model绑定 计算属性, 一旦发生变化, 就会给父组件传递值
  get: () => props.modelValue,
  set: (nv) => {
    emits('update:modelValue', nv)
  },
})
const parkTabTitle = computed(() => {
  return parkList.value.length > 0
    ? `找园区(${parkList.value.length})`
    : '找园区'
})
const plantTabTitle = computed(() => {
  return plantList.value.length > 0
    ? `找厂房(${plantList.value.length})`
    : '找厂房'
})
const officeTabTitle = computed(() => {
  return officeList.value.length > 0
    ? `找办公(${officeList.value.length})`
    : '找办公'
})
watch(
  () => props.modelValue,
  (nv) => {
    if (nv) {
      getParkDataList()
      getPlantDataList()
      getOfficeDataList()
      activeTab.value = props.pageType as string
    }
  },
)
function refreshListData() {
  getParkDataList()
  getPlantDataList()
  getOfficeDataList()
}
async function getParkDataList() {
  const { plantList, parkList, officeList } = storeToRefs(useCartStore())

  const result = await getCartParkList(parkList.value)
  parkDataSource.value = result.data as IParkRecord[]
}
async function getPlantDataList() {
  const { plantList, parkList, officeList } = storeToRefs(useCartStore())

  const result = await getCartPlantList(plantList.value)
  plantDataSource.value = result.data as IPlantRecord[]
}
async function getOfficeDataList() {
  const { plantList, parkList, officeList } = storeToRefs(useCartStore())

  const result = await getCartOfficeList(officeList.value)
  officeDataSource.value = result.data as IOfficeRecord[]
}

function handleGenerateReport() {
  if (activeTab.value === 'park') {
    emits('generate', {
      type: 0,
      ids: parkList.value.join(','),
    })
  }
  if (activeTab.value === 'plant') {
    emits('generate', {
      type: 1,
      ids: plantList.value.join(','),
    })
  }
  if (activeTab.value === 'office') {
    emits('generate', {
      type: 2,
      ids: officeList.value.join(','),
    })
  }
  emits('close')
}
const route = useRoute()
onMounted(() => {
  // activeTab.value = props.pageType || 'park'
  activeTab.value = route.path.split('/')[1]
})
watch(
  () => parkList,
  (newVal) => {
    getParkDataList()
  },
  { deep: true },
)
watch(
  () => plantList,
  (newVal) => {
    getPlantDataList()
  },
  { deep: true },
)
watch(
  () => officeList,
  (newVal) => {
    getOfficeDataList()
  },
  { deep: true },
)
const showDeleteAll = computed(() => {
  return activeTab.value === 'park'
    ? parkList.value.length > 0
    : activeTab.value === 'plant'
      ? plantList.value.length > 0
      : officeList.value.length > 0
})
function handleDeleteAll() {
  showConfirmClearAll.value = true
}
function handleConfirmClearAll() {
  if (activeTab.value === 'park') {
    setPark([])
  }
  if (activeTab.value === 'plant') {
    setPlant([])
  }
  if (activeTab.value === 'office') {
    setOffice([])
  }
  showConfirmClearAll.value = false
}
</script>

<style lang="scss" scoped>
.content-height {
  height: 85vh;
}
:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent !important;
}
:deep(.el-tabs__nav) {
  float: none;
  justify-content: center;
  background-color: white;
}
:deep(.el-tabs__item.is-active) {
  font-size: 0.8333vw;
  font-weight: 500;
}
:deep(.el-tabs__item) {
  width: 122px;
  font-size: 0.8333vw;
  font-weight: 500;
}
.tab-content-height {
  height: calc(85vh - 3.0208vw);
  background-color: #f5f7fb;
}
.scrollbar::-webkit-scrollbar {
  width: 0vw !important;
}
:deep(.el-tabs__item) {
  padding: 0 2.2917vw !important;
}
:deep(.el-icon) {
  width: 1.1458vw;
  height: 1.1458vw;
}
</style>
