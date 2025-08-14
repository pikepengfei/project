<template>
  <div class="flex justify-center items-center">
    <div
      v-if="hovered"
      class="w-[82px] h-[28px] text-[14px] text-[#3e4b58] leading-[28px] box-border px-[12px]"
      :style="{
        backgroundImage: `url(${ResetMapPopup})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }"
    >
      还原地图
    </div>
    <img
      :src="`${hovered ? ResetMapHover : ResetMap}`"
      class="w-[46px] h-[46px] cursor-pointer"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
      @click="$emit('resetMap')"
    />
  </div>
</template>

<script lang="ts" setup>
import ResetMap from '@/assets/images/reset_map.png'
import ResetMapHover from '@/assets/images/reset_map_hover.png'
import ResetMapPopup from '@/assets/images/reset_map_popup.png'
const hovered = ref(false)

const emits = defineEmits(['resetMap'])
</script>

<style></style>
