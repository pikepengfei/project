<template>
  <div
    class="1360:w-[23.75vw] w-[324.42px] rounded-[.3125vw] bg-white overflow-hidden relative"
    :class="{ 'border border-[#DCDFE6] border-solid': fromDetail }"
    @mouseover="showRemoveCart = true"
    @mouseleave="showRemoveCart = false"
  >
    <NuxtLink
      v-stat="{
        type: 'click',
        category: 'park_card',
        label: `${fromPageList}-园区卡片-${data.id}`,
        action: 'click',
        id: 'yq_008',
      }"
      :to="`/park/detail_${data.id}`"
      :title="data.parkName"
      target="_blank"
    >
      <div class="relative">
        <img
          class="w-full 1360:h-[13.5417vw] h-[184.17px] object-cover"
          :src="mainImg"
        />
        <div
          v-if="props.data.haveVr"
          class="absolute t1360:top-[.7292vw] 1360:left-[.7292vw] left-[13px] top-[10px] 1360:w-[2.9167vw] 1360:h-[1.25vw] w-[40px] h-[17px] rounded bg-white/[0.51] 1360:text-[.7292vw] text-[10px] text-[#424a53] text-center leading-6"
        >
          VR
        </div>
        <div
          class="box-border px-[.7813vw] w-full h-[1.875vw] bg-black/[0.29] leading-[1.875vw] absolute bottom-0 left-0 whitespace-pre 1360:text-[.7292vw] text-[10px] text-white"
        >
          <div class="w-full truncate">{{ featureLine }}</div>
        </div>
        <div
          v-if="props.data.haveVr"
          class="vr-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
      <div class="pt-[.7292vw] pb-[.8333vw] px-[.8333vw]">
        <div
          class="1360:text-[.9375vw] text-[13px] text-black leading-snug truncate font-medium"
        >
          {{ props.data.parkName }}
        </div>
        <!-- tag -->
        <div
          v-if="props.data.supportingName?.length"
          class="flex items-center mt-3 flex-wrap gap-2 1360:h-[1.0417vw] h-[15px] overflow-hidden"
          :title="props.data.supportingName.join(',')"
        >
          <div
            v-for="tag in props.data.supportingName"
            :key="tag"
            class="1360:text-[.7292vw] text-[10px] text-[#7f7e7e] 1360:h-[1.0417vw] h-[15px] leading-[1.0417vw] px-[.3125vw] bg-[#F1F3F8] rounded-[.1042vw]"
          >
            {{ tag }}
          </div>
        </div>
        <!-- 面积、租金 -->
        <!-- <div class="flex items-center mt-[.7293vw] justify-between">
          <div
            class="flex items-end text-sm text-[#c0322b] font-medium leading-4"
          >
            <span>面积</span>
            <span class="ml-1 text-[1.1457vw] leading-[1.1457vw]">{{ props.data. }}</span>
            <span>㎡</span>
          </div>
          <div
            class="flex items-end text-sm text-[#c0322b] font-medium leading-4"
          >
            <span>租金</span>
            <span class="ml-1 text-[1.1457vw] leading-[1.1457vw]">{{ data.price }}</span>
            <span>元/㎡/月</span>
          </div>
        </div> -->
        <!-- 操作按钮 -->
        <div
          v-if="!props.fromCart && !fromDetail"
          class="flex items-center mt-[.5208vw] justify-between text-[#3E4B58] 1360:text-[.7292vw] text-[10px]"
        >
          <div
            v-if="!parkList.includes(props.data.id as string)"
            v-stat="{
              type: 'click',
              category: 'park_card',
              label: `${fromPageList}-[添加预选址]按钮-${data.id}`,
              action: 'click',
              id: 'yq_009',
            }"
            class="text-[.8333vw] cursor-pointer 1360:w-[10.8854vw] 1360:h-[1.6667vw] w-[148px] h-[23px] flex justify-center items-center border-[.0521vw] border-solid border-[#B9BFCE] rounded hover:border-[#c0322b] hover:bg-[#c0322b] hover:text-white"
            @mouseover="addHovered = true"
            @mouseleave="addHovered = false"
            @click.stop.prevent="addCartAction"
          >
            <img
              :src="addHovered ? addCartHover : addCart"
              class="1360:w-[.8333vw] 1360:h-[.8333vw] w-[11.3px] h-[11.3px] mr-[.1563vw]"
            />
            添加预选址
          </div>
          <div
            v-if="parkList.includes(props.data.id as string)"
            class="text-[.8333vw] cursor-pointer 1360:w-[10.8854vw] 1360:h-[1.6667vw] w-[148px] h-[23px] flex justify-center items-center bg-[#edeff4] rounded-[.2083vw]"
            @click.stop.prevent="removeCartAction"
          >
            <img
              src="@/assets/images/remove_cart.png"
              class="1360:w-[.8333vw] 1360:h-[.8333vw] w-[11.3px] h-[11.3px] mr-[.1563vw]"
            />
            取消预选址
          </div>
          <div
            v-stat="{
              type: 'click',
              category: 'park_card',
              label: `${fromPageList}-[下载载体报告]按钮-${data.id}`,
              action: 'click',
              id: 'yq_010',
            }"
            class="text-[.8333vw] cursor-pointer 1360:w-[10.8854vw] 1360:h-[1.6667vw] w-[148px] h-[23px] flex justify-center items-center border-[.0521vw] border-solid border-[#B9BFCE] rounded-[.2083vw] hover:text-white hover:bg-[#c0322b] hover:border-[#c0322b]"
            @click.stop.prevent="downloadAction"
            @mouseover="downloadHoverd = true"
            @mouseleave="downloadHoverd = false"
          >
            <img
              :src="`${downloadHoverd ? downloadHoverIcon : downloadIcon}`"
              class="1360:w-[.8333vw] 1360:h-[.8333vw] w-[11.3px] h-[11.3px] mr-[.1563vw]"
            />
            下载园区报告
          </div>
        </div>
      </div>
      <div
        v-if="showRemoveCart && props.fromCart"
        class="absolute w-full h-[2.5vw] bg-black/[0.4] bottom-0 left-0 flex items-center justify-center cursor-pointer"
        @click.stop.prevent="removeCartAction"
      >
        <img
          src="@/assets/images/delete_cart.png"
          class="w-[1.1458vw] h-[1.1458vw] mr-[.3125vw]"
        />
        <div class="text-white text-[.7292vw]">取消预选址</div>
      </div>
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import addCart from '@/assets/images/add_cart.png'
import addCartHover from '@/assets/images/add_cart_hover.png'
import type { IParkRecord } from '@/models/list'
import { getFileUrl } from '@/utils/file'
import { useCartStore } from '@/stores/use-cart'
import downloadIcon from '@/assets/images/download.png'
import downloadHoverIcon from '@/assets/images/download_hover.png'
const props = withDefaults(
  defineProps<{
    inCart?: boolean
    fromCart?: boolean
    data: IParkRecord
    fromDetail?: boolean
  }>(),
  {
    inCart: false,
    fromCart: false,
    fromDetail: false,
  },
)

const featureLine = computed(() => {
  const industryStr = props.data.industryName?.join(',')
  const parkType = props.data.parkType?.join(',')
  const tempList = [props.data.streetName, parkType, industryStr].filter(
    (i) => !!i,
  )
  return tempList.join(' | ')
})

const addHovered = ref(false)
const downloadHoverd = ref(false)
const showRemoveCart = ref(false)

const { parkList } = storeToRefs(useCartStore())
const { addPark, removePark } = useCartStore()

const emits = defineEmits(['delete', 'download'])

const mainImg = computed(() => {
  return getFileUrl(props.data.externalFacadeUrl)
})

// const emits = defineEmits(['addCart', 'removeCart', 'download'])
/**
 * @description: 添加预选址清单
 * @return {*}
 */
function addCartAction() {
  addPark(props.data.id as string)
}
/**
 * @description: 移除预选址清单
 * @return {*}
 */
function removeCartAction() {
  removePark(props.data.id as string)
  emits('delete')
}
/**
 * @description: 下载报告
 * @return {*}
 */
function downloadAction() {
  console.log('下载报告')
  emits('download', props.data)
}
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
</script>
<style lang="scss" scoped>
.vr-icon {
  width: 6.875vw;
  height: 6.875vw;
  background: url('@/assets/images/vr-animation.png') no-repeat;
  background-size: auto 6.875vw;
  animation: vr-ani 3.08333333s 0s steps(74) infinite normal;
}
@keyframes vr-ani {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 0;
  }
}
</style>
