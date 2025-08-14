<template>
  <div class="mb-5">
    <el-breadcrumb separator=">" class="text-base">
      <el-breadcrumb-item>
        <span class="!text-[#B9BFCE]">我要选址</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <a :href="listPath" :title="`找${typeName}`" class="!text-[#424A53]">{{
          `找${typeName}`
        }}</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span class="!text-[#B9BFCE]">{{ `${typeName}详情` }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: '',
  },
})

const isPark = computed(() => {
  return props.type === 'park'
})

const isPlant = computed(() => {
  return props.type === 'plant'
})

const isOffice = computed(() => {
  return props.type === 'office'
})

const typeName = computed(() => {
  if (isPark.value) {
    return '园区'
  } else if (isPlant.value) {
    return '厂房'
  } else {
    return '办公'
  }
})

const listPath = computed(() => {
  if (isPark.value) {
    return '/park'
  } else if (isPlant.value) {
    return '/plant'
  } else {
    return '/office'
  }
})
</script>
