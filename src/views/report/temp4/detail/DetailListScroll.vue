<template>
  <div class="relative">
    <div class="overflow-hidden" :style="{ width: `${width * 2 + 21}px` }">
      <div ref="el" class="transition-transform">
        <slot></slot>
      </div>
    </div>

    <div
      v-if="list.length > 2"
      class="absolute -left-[9px] top-1/2 -translate-y-1/2 -translate-x-full z-10 flex cursor-pointer items-center text-center"
      @click="handleScroll(-2)"
    >
      <img
        class="w-[44px] h-[44px]"
        src="@/assets/images/detail-circle_left.png"
        alt=""
      />
    </div>
    <div
      v-if="list.length > 2"
      class="absolute -right-[9px] top-1/2 -translate-y-1/2 translate-x-full z-10 flex cursor-pointer items-center text-center"
      @click="handleScroll(2)"
    >
      <img
        class="w-[44px] h-[44px]"
        src="@/assets/images/detail-circle_right.png"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    list: any[]
    width?: number
  }>(),
  {
    width: 380,
    list: () => [],
  },
)
const el = ref<any>()

const itemIndex = ref(0)

const handleScroll = (i: number) => {
  const max =
    props.list.length % 2 === 0 ? props.list.length - 2 : props.list.length - 1
  const index = itemIndex.value + i
  if (index < 0) {
    itemIndex.value = 0
  } else if (index > max) {
    itemIndex.value = max
  } else {
    itemIndex.value = index
  }
  el.value.style.transform = `translateX(${index > 0 ? '-' : ''}${itemIndex.value * (props.width + 21)}px)`
}
</script>
