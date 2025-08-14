<template>
  <div>
    <div class="map-box">
      <!-- <div class="commom-module-header">
        <div class="common-module-text">
          <div class="common-module-left">
            <h3>区位交通</h3>
          </div>
        </div>
      </div> -->
      <div id="mmap">
        <div id="container" :class="containerClass"></div>
        <div id="panel"></div>
        <div class="map-table w-[400px]">
          <div class="table-search">
            <div class="flex space-x-[1px] items-center">
              <div
                v-for="item in typeList"
                :key="item.name"
                class="table-li"
                :class="{ 'table-li-active': item.isActive }"
                @click="handleSearch(item)"
              >
                <div>
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="map-search-info relative">
            <div
              v-if="activeItem?.subItems"
              class="flex items-center absolute top-0 right-5 left-0 pt-2 pl-4 bg-white"
            >
              <div
                v-for="sub in activeItem.subItems"
                :key="sub.name"
                class="w-[68px] h-[29px] flex items-center justify-center sub-item cursor-pointer"
                :class="{ '!text-[#C0322B] font-bold': sub.isActive }"
                @click="handleSearch(sub)"
              >
                {{ sub.name }}
              </div>
            </div>
            <div
              class="map-search-body"
              :class="{ '!pt-[50px]': !!activeItem?.subItems }"
            >
              <div
                v-for="(item, index) in infoList"
                :key="index + item.name"
                class="flex justify-between font-yahei space-x-5 py-[11px]"
              >
                <div
                  class="position-item flex items-center text-sm leading-[18px] text-[#1A1A1A]"
                  @mousemove="showInfoWindow(item)"
                  @mouseout="hideInfoWindow"
                >
                  <div class="ell2 flex-none w-[19em]" :title="item.name">
                    {{ item.name }}
                  </div>
                </div>
                <div class="flex flex-none items-center text-sm text-[#4d4d4d]">
                  <img
                    class="mr-1 h-3 w-3"
                    src="@/assets/images/icon-map_nav.png"
                  />
                  <span class="text-[#c0322b]">{{ item.distance }}米</span>
                </div>
              </div>
              <div
                v-if="infoList.length === 0"
                class="flex h-full items-center justify-center text-sm text-[#4d4d4d]"
              >
                <span>暂无内容</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
let map1: any = null
let placeSearch: any = null
let infoWindow: any = null
const markers: any = []
const props = defineProps<{
  lng: number
  lat: number
  containerClass?: string
}>()
const infoList = ref<any[]>([])

const typeList = ref<any[]>([
  {
    name: '高速',
    keywords: '高速',
    radius: 30000,
    code: '180200|180201|180202|180300|190301|190304|190305',
    isActive: true,
  },
  {
    name: '机场',
    keywords: '机场',
    radius: 100000,
    code: '150100',
    isActive: false,
  },
  {
    name: '交通',
    isActive: false,
    subItems: [
      {
        name: '火车站',
        keywords: '火车站',
        radius: 50000,
        code: '150200',
        isActive: false,
      },
      {
        name: '公交站',
        keywords: '公交站',
        radius: 1000,
        code: '150700|150701|150702|150703|150704|150705|150706',
        isActive: true,
      },
      {
        name: '地铁站',
        keywords: '地铁站',
        radius: 3000,
        code: '150500|150501|150600',
        isActive: false,
      },
    ],
  },
  {
    name: '物流',
    keywords: '物流',
    radius: 10000,
    code: '070500|070501|070400|070401',
    isActive: false,
  },
  {
    name: '医院',
    keywords: '医院',
    radius: 3000,
    code: '090100|090101|090102',
    isActive: false,
  },
  {
    name: '生活',
    isActive: false,
    subItems: [
      {
        name: '小区',
        keywords: '小区',
        radius: 3000,
        code: '120300|120301|120302|120303',
        isActive: false,
      },
      {
        name: '商场',
        keywords: '商场',
        radius: 3000,
        code: '060100|060101|060102|060103',
        isActive: false,
      },
    ],
  },
])

const activeItem = computed(() => {
  return typeList.value.find(({ isActive }) => {
    return isActive
  })
})

const changeActive = (item: any) => {
  typeList.value.forEach((type) => {
    if (type.subItems) {
      let isActive = false
      type.subItems.forEach((sub: any) => {
        const current = item.name === sub.name
        sub.isActive = current
        if (!isActive && current) {
          isActive = true
        }
      })

      type.isActive = isActive
    } else {
      type.isActive = type.name === item.name
    }
  })
}

const handleSearch = (typeItem: any) => {
  const currentType = typeItem.subItems ? typeItem.subItems[0] : typeItem
  const { keywords, radius, code: type } = currentType
  changeActive(currentType)
  map1.remove(markers)
  placeSearch.setType(type)
  placeSearch.searchNearBy(
    keywords,
    new AMap.LngLat(props.lng, props.lat),
    radius,
    (status: String, results: any) => {
      infoList.value = []
      const icon = new AMap.Icon({
        size: new AMap.Size(27, 33), // 图标尺寸
        image:
          'https://cfld-obs-pro01.obs.cn-north-4.myhuaweicloud.com/img/system/single.png', // Icon的图像
        imageSize: new AMap.Size(27, 33),
      })
      if (status === 'complete') {
        infoList.value = results.poiList.pois
        for (const item of results.poiList.pois) {
          const marker = new AMap.Marker({
            map: map1,
            position: [item.location.lng, item.location.lat],
            icon,
            offset: new AMap.Pixel(-10, -30),
            // content: item.name
          })

          marker.on('mouseover', () => {
            const info = []
            info.push("<div class='input-card'>")
            info.push(`<p class='input-item'>${item.name}</p>`)
            info.push(`<p class='input-item'>${item.distance}米</p></div>`)

            infoWindow = new AMap.InfoWindow({
              content: info.join(''), // 使用默认信息窗体框样式，显示信息内容
              isCustom: true,
              autoMove: false,
              offset: new AMap.Pixel(0, -35),
            })
            infoWindow.open(map1, [item.location.lng, item.location.lat])
          })
          marker.on('mousemove', () => {
            infoWindow.open()
          })
          marker.on('mouseout', () => {
            infoWindow.close()
          })
          markers.push(marker)
        }
      }
    },
  )
}
onMounted(() => {
  map1 = new AMap.Map('container', {
    // 设置地图容器id
    // resizeEnable: true,
    zoom: 11,
    // center: ['116.506911', '37.434738'],
    center: [props.lng, props.lat],
    mapStyle: 'amap://styles/20513570f5c6332f45befec4c72c5a12',
  })
  // 创建 AMap.Icon 实例：
  const icon = new AMap.Icon({
    size: new AMap.Size(27, 33), // 图标尺寸
    image:
      'https://cfld-obs-pro01.obs.cn-north-4.myhuaweicloud.com/img/system/single1.png', // Icon的图像
    imageSize: new AMap.Size(27, 33),
  })
  // eslint-disable-next-line no-new
  new AMap.Marker({
    map: map1,
    // position: ['116.506911', '37.434738'],
    position: [props.lng, props.lat],
    offset: new AMap.Pixel(-10, -15),
    icon,

    // offset: new AMap.Pixel(-13, -30),
    // content: item.name
  })
  map1.plugin(['AMap.PlaceSearch'], () => {
    // 构造地点查询类
    placeSearch = new (AMap as any).PlaceSearch({
      // map: map1, // 展现结果的地图实例
      // panel: "panel",
      autoFitView: false,
      type: '',
    })
  })
  map1.on('complete', () => {
    handleSearch(typeList.value[0])
  })
})

const showInfoWindow = (info: any) => {
  const infoContent = []
  infoContent.push("<div class='input-card'>")
  infoContent.push(`<p class='input-item'>${info.name}</p>`)
  infoContent.push(`<p class='input-item'>${info.distance}米</p></div>`)
  infoWindow = new AMap.InfoWindow({
    content: infoContent.join(''), // 使用默认信息窗体框样式，显示信息内容
    isCustom: true,
    autoMove: false,
    offset: new AMap.Pixel(0, -35),
  })
  infoWindow.open(map1, [info.location.lng, info.location.lat])
}

const hideInfoWindow = () => {
  infoWindow.close()
}

onUnmounted(() => {
  map1?.destroy()
})
</script>
<style lang="scss" scoped>
#container {
  width: 1200px;
  height: 440px;
  background: #fff;
}
#mmap {
  position: relative;
  z-index: 101;
}
.map-table {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 99;
}
.table-search {
  background: #ffffff;
  box-shadow: 0px 1px 10px 0px rgba(31, 108, 221, 0.11);
  border-bottom: 1px solid #dcdfe6;
  border-radius: 2px;
  overflow: hidden;
  font-size: 14px;
  color: #666666;
}
.table-li {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  width: 58px;
  border-bottom: 2px solid #fff;
  cursor: pointer;
}
.table-li-active {
  color: #c0322b;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: 25px;
    height: 2px;
    background: #c0322b;
  }
}
.map-search-info {
  background: #ffffff;
}

.map-search-body {
  padding: 0 16px;
  height: 270px;
  overflow-y: auto;
  border-radius: 2px;
  &::-webkit-scrollbar {
    width: unset;
  }
}
.position-item {
  font-size: 14px;
  color: #4d4d4d;
  cursor: pointer;
  &:hover {
    color: #d50000;
  }
}
:deep(.input-card) {
  width: 100px;
  height: 60px;
  background: #ffffff;
  padding: 10px;
  text-align: center;
  font-size: 14px;
}
:deep(.input-item) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.sub-item {
  border-radius: 2px 0px 0px 2px;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  color: #424a53;
  & + & {
    border-left: none;
  }
}
</style>
