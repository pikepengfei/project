<template>
  <div class="support-container">
    <div v-for="item in supporting" :key="item.dictLabel" class="support-item" :style="itemStyle">
      <div class="support-icon" :style="iconStyle">
        <img :src="item.labelIcon" alt="" />
      </div>
      <div class="support-label">{{ item.dictLabel }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    list: any[]
    itemStyle?: any
    iconStyle?: any
  }>(),
  {
    list: () => [],
    itemStyle: () => ({}),
    iconStyle: () => ({}),
  },
)

const supporting = computed(() => {
  return props.list
})
</script>

<style lang="scss">
.support-container {
  display: flex;
  align-items: center;
  margin-top: -12px;
  margin-left: -12px;
  flex-wrap: wrap;

  .support-item {
    margin-top: 12px;
    margin-left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 241px;
    height: 90px;
    background-color: #f5f7fb;
    border-radius: 4px;
    gap: 8px;
    font-size: 14px;
  }

  .support-icon {
    width: 30px;
    height: 30px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
    }
  }

  .support-label {
    color: #3e4b58;
  }
}
</style>
