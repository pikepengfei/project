<template>
  <div v-if="detail" class="report-map">
    <div class="map-box">
      <div class="map-content">
        <div class="info-container">
          <div v-for="info in infoList" :key="info.type" class="info-item">
            <div class="info-type">
              {{ info.type }}
            </div>
            <div class="info-details">
              <div v-for="pos in info.mapInfos" :key="pos.name" class="position-info">
                <div>{{ pos.name }}</div>
                <div>{{ pos.distance }}m</div>
              </div>
            </div>
          </div>
        </div>
        <div ref="containerRef" class="map-container">
          <img class="map-image" :src="detail.picUrl" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    detail: any
  }>(),
  {},
)

const infoList = computed(() => {
  return props.detail?.aroundInfo || []
})
</script>

<style lang="scss">
.report-map {
  .map-box {
    .map-content {
      display: flex;
      gap: 20px;
      position: relative;
    }

    .info-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .info-item {
      display: flex;
      font-size: 12px;
      color: #67727f;
      position: relative;

      &::after {
        content: '';
        display: block;
        height: 1px;
        background: #f5f7fb;
        position: absolute;
        bottom: -14px;
        left: 0;
        right: 40px;
      }
    }

    .info-type {
      width: 2em;
      overflow: hidden;
      white-space: nowrap;
    }

    .info-details {
      margin-left: 18px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
    }

    .position-info {
      display: flex;
      justify-content: space-between;
    }

    .map-container {
      width: 344px;
      min-height: 381px;
      background-color: white;
    }

    .map-image {
      width: 100%;
      height: auto;
    }
  }
}
</style>
