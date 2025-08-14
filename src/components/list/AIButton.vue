<template>
  <NuxtLink to="/ai" target="_blank">
    <div
      class="cursor-pointer"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
    >
      <div class="relative">
        <el-image
          :src="hovered ? cartHover : cart"
          class="w-[70px]"
          :class="hovered ? '!h-[167px]' : 'h-[70px]'"
        />
      </div>
    </div>
  </NuxtLink>
</template>
<script setup>
import cart from '@/assets/images/ai.png'
import cartHover from '@/assets/images/ai_hover.png'
const hovered = ref(false)
</script>
