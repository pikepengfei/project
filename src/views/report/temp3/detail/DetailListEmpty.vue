<template>
  <div v-if="!list.length" class="flex flex-col mx-auto">
    <img class="w-[400px] h-[284px]" src="@/assets/images/no_data.png" alt="" />
    <div class="text-[#3E4B58] text-base mt-[3px] text-center">暂无数据</div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    list: any
  }>(),
  {},
)
</script>
