<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef } from 'vue'
import '@amap/amap-jsapi-types'
import { parkMapData, getPlantMap, getOfficeMap } from '@/api'
import type { IOfficeMapItem, IPlantMapItem } from '@/models/list'
import { useGlobalStore } from '@/stores'
import cancelIcon from '@/assets/images/cancel_select.png'
const {
  plantSelectedPark,
  officeSelectedPark,
  filterPlantParkId,
  filterOfficeParkId,
  filterPlantPlantId,
  selectPlantId,
} = storeToRefs(useGlobalStore())
const { setPlantSelectedPark, setOfficeSelectedPark } = useGlobalStore()

const props = defineProps<{
  pageType: string
}>()
const currentMapBounds = ref({
  maxLatitude: 31.275053,
  maxLongitude: 121.664247,
  minLatitude: 30.975959,
  minLongitude: 121.186803,
})

const emits = defineEmits(['choosePark', 'cancelChoose', 'mapChanged'])

const markers = ref<AMap.Marker[]>([])
// let map = null
// 地图实例
const map = shallowRef()
const amapId = computed(() => {
  return `amap_${Date.now()}`
})
// onNuxtReady(() => {
onMounted(() => {
  setupMap()
})
// })
const setupMap = () => {
  //   window._AMapSecurityConfig = {
  //     securityJsCode: '159384515e1b8b456c142dba5c933dfb',
  //   }
  //   AMapLoader.load({
  //     key: '75ff1c8fdbf7f75d6b129998f1b813ba',
  //     version: '2.0', // 申请好的Web端开发者Key，首次调用 load 时必填 // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  //     plugins: ['AMap.DistrictSearch', 'AMap.Polyline', 'AMap.Polygon'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  //   })
  //     .then((AMap) => {
  AMap.plugin('AMap.DistrictSearch', function () {
    // @ts-ignore
    const district = new AMap.DistrictSearch({
      subdistrict: 0, // 获取边界不需要返回下级行政区
      extensions: 'all', // 返回行政区边界坐标组等具体信息
      level: 'city', // 查询行政级别为区县
    })
    district.setLevel('district')
    district.search('廊坊市', function (status: any, result: any) {
      const bounds = result.districtList[0].boundaries
      const mask = []
      for (let i = 0; i < bounds.length; i++) {
        mask.push([bounds[i]])
      }

      map.value = new AMap.Map(amapId.value, {
        // 设置地图容器id
        viewMode: '2D', // 是否为3D地图模式
        zoom: 8.5, // 初始化地图级别
        center: [116.699744, 39.312834], // 初始化地图中心点位
        layers: [
          // new AMap.TileLayer.RoadNet({
          //   zIndex: 20,
          // }),
          //   new AMap.TileLayer({
          //     zIndex: 6,
          //     opacity: 1,
          //     getTileUrl:
          //       'https://t{1,2,3,4}.tianditu.gov.cn/DataServer?T=ter_w&x=[x]&y=[y]&l=[z]',
          //   }),
        ],
        mapStyle: 'amap://styles/20513570f5c6332f45befec4c72c5a12',
      })
      map.value.setZooms([8.5, 20])
      // map.value.on('click', function (e) {
      //   console.log('dddddd', e.lnglat.getLng(), e.lnglat.getLat())
      // })
      // const limitBounds = new AMap.Bounds(
      //   [120.491572, 30.554166], // 西南角坐标

      //   [122.17954, 31.574679], // 东北角坐标
      // )
      // map.value.setLimitBounds(limitBounds)
      // const outer = [
      //   new AMap.LngLat(-360, 90, true),
      //   new AMap.LngLat(-360, -90, true),
      //   new AMap.LngLat(360, -90, true),
      //   new AMap.LngLat(360, 90, true),
      // ]
      // const holes = result.districtList[0].boundaries

      // const pathArray = [outer]
      // pathArray.push.apply(pathArray, holes)
      // const polygon = new AMap.Polygon({
      //   strokeColor: '#00eeff',
      //   strokeWeight: 1,
      //   fillColor: '#71B3ff',
      //   fillOpacity: 0.7,
      // })
      // polygon.setPath(pathArray)
      // map.value.add(polygon)
      for (let i = 0; i < bounds.length; i++) {
        const polyline = new AMap.Polyline({
          path: bounds[i],
          strokeColor: '#EC9C9C',
          strokeWeight: 2,
          // @ts-ignore
          map: map.value,
          // fillColor: '#256edc',
        })
        // const polygon = new AMap.Polygon({
        //   strokeColor: '#00eeff',
        //   strokeWeight: 1,
        //   fillColor: '#71B3ff',
        //   fillOpacity: 0.3,
        //   path: [bounds[i]],
        //   map: map.value,
        // })
        // map.value.setFitView(polyline)
      }
      // 绑定地图移动与缩放事件
      map.value.on('moveend', getMapBounds)
      map.value.on('zoomend', getMapBounds)
      function getMapBounds() {
        const bounds = map.value.getBounds()
        // console.log('获取地图范围', bounds)
        currentMapBounds.value = {
          maxLatitude: bounds.northEast.lat,
          maxLongitude: bounds.northEast.lng,
          minLatitude: bounds.southWest.lat,
          minLongitude: bounds.southWest.lng,
        }
        emits('mapChanged', currentMapBounds.value)
      }
      getMapBounds()
    })
  })
  // })
  // .catch((e) => {
  //   console.log('地图初始化失败', e)
  // })
}
onUnmounted(() => {
  map.value?.destroy()
})

async function getMapData(filterData: object = {}) {
  map.value?.remove(markers.value)
  console.log('当前范围', currentMapBounds.value)
  if (props.pageType === 'park') {
    const result = await parkMapData({
      ...filterData,
      ...currentMapBounds.value,
    })
    result.data?.forEach((item) => {
      const position = new AMap.LngLat(
        item.longitude as number,
        item.latitude as number,
      ) // Marker 经纬度
      const marker = new AMap.Marker({
        position,
        content: `<div class="h-[55px] rounded-md">
        <div class="hover:text-[#c0322b] text-[#3e4b58] hover:border hover:border-[#c0322b] hover:border-b-2 border border-[#b8bfc4] box-border p-[12px] flex items-center bg-white rounded-md whitespace-nowrap marker-shadow">
      <div class="max-w-[175px] truncate">${item.parkName}</div>
      </div>
            <div class="flex justify-center">
            <svg
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0L5.5 9L11 0H0Z" fill="#c0322b" />
            </svg>
      </div>
    </div>`,
        offset: new AMap.Pixel(-100, -30), // 以 icon 的 [center bottom] 为原点
      })
      marker.on('click', () => {
        navigateTo(`/park/detail_${item.parkId}`, {
          open: { target: '_blank' },
        })
      })
      marker.on('mouseover', () => {
        // console.log('鼠标移入', item)
        marker.setTop(true)
      })
      marker.on('mouseout', () => {
        // marker.setTop(false)
      })
      map.value?.add(marker)
      markers.value.push(marker)
    })
  }
  if (props.pageType === 'plant') {
    const result = await getPlantMap({
      ...filterData,
      ...currentMapBounds.value,
      parkId: '',
      plantId: '',
    })
    // console.log('厂房地图数据', result)
    result.data?.forEach((item: IPlantMapItem) => {
      const position = new AMap.LngLat(
        item.longitude as number,
        item.latitude as number,
      ) // Marker 经纬度
      const marker = new AMap.Marker({
        position,
        content: setCustomContent(
          item.parkId as string,
          item.parkName as string,
          item.plantForm === 2 ? '独立厂房' : (item.plantNumStr as string),
          item.plantId,
          item.plantForm === 2,
        ),
        offset: new AMap.Pixel(-100, -30), // 以 icon 的 [center bottom] 为原点
      })
      if (plantSelectedPark.value?.parkId === item.parkId) {
        marker.setTop(true)
      }
      marker.on('mouseover', () => {
        // console.log('鼠标移入', item)
        marker.setTop(true)
      })
      marker.on('mouseout', () => {
        // marker.setTop(false)
      })
      marker.on('click', () => {
        // @ts-ignore
        if (item.parkId === plantSelectedPark.value?.parkId) {
          // 取消选中
          setPlantSelectedPark(undefined, '')
          filterPlantParkId.value = ''
          filterPlantPlantId.value = ''
          emits('cancelChoose')
          return
        }
        // console.log('点击了', item)
        map.value.setZoomAndCenter(13, [
          item.longitude as number,
          item.latitude as number,
        ])

        setPlantSelectedPark(
          {
            parkName: item.parkName as string,
            parkId: item.parkId as string,
          },
          item.plantId,
        )
        emits('choosePark', item.parkId)
        filterPlantParkId.value = item.parkId || ''
        filterPlantPlantId.value = item.plantForm === 2 ? item.plantId : ''
        marker.setContent(
          setCustomContent(
            item.parkId as string,
            item.parkName as string,
            item.plantForm === 2 ? '独立厂房' : (item.plantNumStr as string),
            item.plantId,
            item.plantForm === 2,
          ),
        )
      })
      map.value.add(marker)
      markers.value.push(marker)
    })
  }
  if (props.pageType === 'office') {
    const result = await getOfficeMap({
      ...filterData,
      ...currentMapBounds.value,
    })
    // console.log('办公地图数据', result)
    result.data?.forEach((item: IOfficeMapItem) => {
      const position = new AMap.LngLat(
        item.longitude as number,
        item.latitude as number,
      ) // Marker 经纬度
      const marker = new AMap.Marker({
        position,
        content: setCustomContent(
          item.parkId as string,
          item.parkName as string,
          item.officeNumStr as string,
        ),
        offset: new AMap.Pixel(-100, -30), // 以 icon 的 [center bottom] 为原点
      })
      if (officeSelectedPark.value?.parkId === item.parkId) {
        marker.setTop(true)
      }
      marker.on('mouseover', () => {
        // console.log('鼠标移入', item)
        marker.setTop(true)
      })
      marker.on('mouseout', () => {
        // marker.setTop(false)
      })
      marker.on('click', () => {
        // @ts-ignore
        if (item.parkId === officeSelectedPark.value?.parkId) {
          // 取消选中
          setOfficeSelectedPark(undefined)
          emits('cancelChoose')
          filterOfficeParkId.value = ''
          return
        }
        map.value.setZoomAndCenter(13, [
          item.longitude as number,
          item.latitude as number,
        ])
        setOfficeSelectedPark({
          parkName: item.parkName as string,
          parkId: item.parkId as string,
        })

        emits('choosePark', item.parkId)
        filterOfficeParkId.value = item.parkId || ''
        marker.setContent(
          setCustomContent(
            item.parkId as string,
            item.parkName as string,
            item.officeNumStr as string,
          ),
        )
        // console.log('点击了', item)
      })
      map.value.add(marker)
      markers.value.push(marker)
    })
  }
}
function setCustomContent(
  id: string,
  name: string,
  count: string,
  plantId?: string,
  isSinglePlant?: boolean,
) {
  let isSelected = false
  if (props.pageType === 'plant') {
    isSelected = isSinglePlant
      ? plantId === selectPlantId.value
      : plantSelectedPark.value?.parkId === id
  }
  if (props.pageType === 'office') {
    isSelected = officeSelectedPark.value?.parkId === id
  }
  let classString =
    'hover:text-[#c0322b] text-[#3e4b58] hover:border hover:border-[#c0322b] hover:border-b-2 border border-[#b8bfc4]  box-border py-[7px] px-[12px] flex items-center bg-white rounded-md whitespace-nowrap marker-shadow'
  if (isSelected) {
    classString =
      'bg-[#c0322b] text-white box-border py-[7px] px-[12px] flex items-center rounded-md whitespace-nowrap marker-shadow'
  }
  let countClass = 'bg-[#FFF1F1] text-[#e66b6b]'
  if (isSelected) {
    countClass = 'bg-white text-[#e66b6b]'
  }
  let imgString = ''
  if (isSelected) {
    imgString = `<img src="${cancelIcon}" class="w-[26px] h-[26px] absolute right-[-23px] top-[-13px]" />`
  } else {
    imgString = ''
  }
  return `<div class="h-[55px] rounded-md relative" onclick="window.handleMarkerClick('${id}', '${name}', '${count}')">
      ${imgString}
      <div

        class="${classString}"
      >
        <div class="max-w-[175px] truncate">${name}</div>

        <div
          class="${countClass} h-[30px] box-border rounded px-[8px] leading-[30px] text-[16px] font-medium ml-[10px]"
        >
      ${count}
        </div>
      </div>
      <div class="flex justify-center">
             <svg
              width="11"
              height="9"
              viewBox="0 0 11 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0L5.5 9L11 0H0Z" fill="#c0322b" />
            </svg>
      </div>
    </div>`
}
function testClick() {
  // console.log('点击了')
}
function clearMapSelectPark() {
  console.log('清除选中')
  map.value.setZoomAndCenter(10.4, [116.699744, 39.312834])

  // markers.value.forEach((marker) => {
  //   marker.setContent(marker.getContent())
  // })
}

function resetMap() {
  // console.log('重置地图')
  map.value.setZoomAndCenter(10.4, [116.699744, 39.312834])
}
onMounted(() => {
  // @ts-ignore
  window.handleMarkerClick = testClick
})

defineExpose({ getMapData, clearMapSelectPark, resetMap })

// setupMap()
</script>

<template>
  <ClientOnly>
    <div :id="amapId" class="w-full h-full"></div>
  </ClientOnly>
</template>

<style scoped>
.marker-shadow {
  box-shadow: 0px 0px 4px 0px rgba(187, 194, 204, 0.8);
  border-radius: 6px;
}
.triangle {
  position: relative;
  width: 0;
  height: 0;
  border-left: 5.5px solid transparent;
  border-right: 5.5px solid transparent;
  border-bottom: 9px solid transparent; /* 修改为 border-bottom */
}

.triangle::before {
  content: '';
  position: absolute;
  top: 0; /* 修改为 top: 0 */
  left: -5.5px;
  width: 11px;
  height: 9px;
  background: linear-gradient(to top, #fe382e, #e43e31); /* 修改为 to top */
  clip-path: polygon(50% 100%, 0% 0%, 100% 0%); /* 修改为倒三角形 */
}
</style>
