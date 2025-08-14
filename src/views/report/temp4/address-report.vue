<template>
  <div class="address-report report-font">
    <div v-for="item in dataList" :key="item.id" class="break-after-page">
      <!-- 标题 -->
      <div class="flex">
        <NuxtLink :to="`/${item.itemType}/detail_${item.id || item.parkId}`" target="_blank">
          <div class="section-title">
            {{ handleNum(item) }} {{ item.name }}
          </div>
        </NuxtLink>
        <div class="vr-link-wrapper">
          <div v-if="item.vrUrl" class="vr-link">
            <NuxtLink :to="item.vrUrl" target="_blank">查看VR</NuxtLink>
          </div>
        </div>
      </div>
      <!-- 标签 -->
      <div v-if="item.tags?.length > 0 && isPark(item)" class="park-tags">
        <div v-for="tag in item.tags" :key="tag" class="park-tag">
          {{ tag }}
        </div>
      </div>
      <div class="mt-5">
        <!-- 园区 -->
        <div v-if="isPark(item)">
          <div class="flex">
            <div class="park-image-wrapper">
              <img class="park-image" :src="item.externalFacadeUrl" alt="" />
            </div>
            <div class="park-info-wrapper">
              <div>
                <div class="park-info-list">
                  <div v-for="info in handleParkTopInfo(item)" :key="info.name" class="park-info-item">
                    <div class="park-info-label">{{ info.name }}</div>
                    <div class="park-info-value">{{ info.value }}</div>
                  </div>
                </div>
              </div>
              <div class="park-broker-wrapper">
                <!-- <div class="broker-card">
                  <div class="broker-avatar-wrapper">
                    <img class="broker-avatar" :src="handleAvatar(item)" alt="" />
                  </div>
                  <div class="broker-info">
                    <div class="broker-header">
                      <div class="broker-name" :title="item.brokerInfo?.name">
                        {{ item.brokerInfo?.name || '' }}
                      </div>
                      <div class="broker-job">
                        {{ item.brokerInfo?.job || '' }}
                      </div>
                    </div>
                    <div class="broker-slogan">
                      敬待咨询，竭诚为您服务
                    </div>
                    <div class="broker-phone">
                      {{ item.brokerInfo?.phone || '' }}
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>

          <!-- 支持 -->
          <div class="support-wrapper">
            <DetailSupport :item-style="{ width: '114px', height: '42px', fontSize: '12px' }"
              :icon-style="{ width: '14px', height: '14px' }" :list="item.supporting"></DetailSupport>
          </div>

          <div class="desc-wrapper">
            <div class="cell-title">
              {{ getDescName(item) }}
            </div>
            <div class="desc-content">
              {{ item.description }}
            </div>
          </div>

          <div class="map-wrapper">
            <div class="cell-title">
              周边配套
            </div>
            <div class="map-container">
              <ReportMap :detail="item"></ReportMap>
            </div>
          </div>
        </div>

        <div v-if="!isPark(item)">
          <!-- 简介 -->
          <div>
            <div class="cell-title">
              {{ getDescName(item) }}
            </div>
            <div class="desc-content">
              {{ item.description }}
            </div>
          </div>

          <div class="flex mt-5">
            <div class="flex-1">
              <!-- 价格 -->
              <div v-if="!isPark(item)" class="price-wrapper">
                <div v-if="isRent(item)" class="price-item">
                  <div class="price-label">租金</div>
                  <div class="price-value">
                    {{ item.rentPrice || item.rentLowAndHeight || '' }}
                  </div>
                </div>
                <div v-if="isSale(item)" class="price-item">
                  <div class="price-label">售价</div>
                  <div class="price-value">
                    {{ item.salePrice || item.unitPrice || '' }}
                  </div>
                </div>
              </div>
              <div v-if="item.tags?.length > 0" class="carrier-tags">
                <div v-for="tag in item.tags" :key="tag" class="carrier-tag">
                  {{ tag }}
                </div>
              </div>
            </div>

            <!-- 名片 -->
            <!-- <div class="broker-card-wrapper">
              <div class="broker-card">
                <div class="broker-avatar-wrapper">
                  <img class="broker-avatar" :src="handleAvatar(item)" alt="" />
                </div>
                <div class="broker-info">
                  <div class="broker-header">
                    <div class="broker-name" :title="item.brokerInfo?.name">
                      {{ item.brokerInfo?.name || '' }}
                    </div>
                    <div class="broker-job">
                      {{ item.brokerInfo?.job || '' }}
                    </div>
                  </div>

                  <div class="broker-slogan">
                    敬待咨询，竭诚为您服务
                  </div>
                  <div class="broker-phone">
                    {{ item.brokerInfo?.phone || '' }}
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>

        <div v-if="!isPark(item)" class="flex">
          <!-- 图片 -->
          <div class="carrier-image-container">
            <img class="carrier-image" :src="item.externalFacadeUrl" alt="" />
          </div>
        </div>

        <div v-if="isOffice(item)" class="params-wrapper">
          <div class="cell-title">房源参数</div>
          <div class="params-grid">
            <div v-for="info in handleOfficeInfo(item)" :key="info.name" class="param-item">
              <div class="param-label">
                {{ info.name }}
              </div>
              <div class="param-value">{{ info.value }}</div>
            </div>
          </div>
        </div>

        <div v-if="isPlant(item)" class="params-wrapper">
          <div class="cell-title">厂房参数</div>
          <div class="params-grid">
            <div v-for="info in handlePlantInfo(item)" v-show="!info.isHide" :key="info.name" class="param-item">
              <div class="param-label">
                {{ info.name }}
              </div>
              <div class="param-value">
                {{ info.value }}
              </div>
            </div>
          </div>
        </div>
        <div v-for="(floor, floorIndex) in item.floorList || []" :key="floorIndex" class="floor-wrapper">
          <div class="cell-title">
            {{ `各楼层信息（${floor.layerNumber}）` }}
          </div>
          <div class="params-grid">
            <div v-for="info in handleFloor(floor)" :key="info.name" class="param-item">
              <div class="param-label">
                {{ info.name }}
              </div>
              <div class="param-value" :class="{ 'vr-link': info.isVR && info.value }">
                <NuxtLink v-if="info.isVR" :to="info.value" target="_blank">
                  {{ info.value ? '查看' : '--' }}
                </NuxtLink>
                <span v-else>{{ info.value }}</span>
              </div>
            </div>
          </div>
          <div class="floor-images">
            <div class="floor-images-grid">
              <div v-for="img in floor.interiorUrl?.slice?.(0, 2) || []" :key="img" class="floor-image-wrapper">
                <img class="floor-image" :src="img" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import DetailSupport from './detail/DetailSupport.vue'
import ReportMap from './report/ReportMap.vue'

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line vue/require-default-prop
    parkPlantOfficeData?: any[],
    data?: any,
  }>(),
  {},
)

console.log(
  props.parkPlantOfficeData
);

const detail = ref<any>(null)

// 组件挂载时初始化数据
onMounted(async () => {
  await initDetail()
})

// 监听props变化，当数据更新时重新初始化
watch(
  () => [props.parkPlantOfficeData, props.data],
  async () => {
    await initDetail()
  },
  { deep: true }
)
const handleOffice = (data: any, num: any, isActive: any) => {
  if (data) {
    const {
      officeName: name,
      officeFeatureName: tags,
      officeBrokerInfo: brokerInfo,
      introduce: description,
    } = data
    return {
      ...data,
      name,
      tags,
      itemType: 'office',
      index: isActive ? `${num.index}.${num.subIndex++}` : num.index++,
      brokerInfo,
      description,
    }
  }
}

const handlePark = (data: any, num: any) => {
  if (data) {
    const { parkName: name, introduce: description } = data
    num.subIndex = 1
    return {
      ...data,
      name,
      index: num.index,
      itemType: 'park',
      description,
    }
  }
}

const handlePlant = (data: any, num: any, isActive: any) => {
  if (data) {
    const {
      plantName: name,
      plantFeatureName: tags,
      plantBrokerInfo: brokerInfo,
    } = data
    return {
      ...data,
      name,
      tags,
      brokerInfo,
      itemType: 'plant',
      index: isActive ? `${num.index}.${num.subIndex++}` : num.index++,
    }
  }
}

const dataList = computed(() => {
  console.log('>>>', detail.value);
  
  if (detail.value) {
    const num = {
      index: 1,
      subIndex: 1,
    }
    return (
      detail.value.parkPlantOfficeData
        ?.map?.(
          ({
            officeReportData,
            parkReportData,
            plantReportData,
            parkStatus,
          }: any) => {
            const isActive = parkStatus === '已上架'
            const parks = parkReportData
              ? [handlePark(parkReportData, num)]
              : []
            const plants =
              plantReportData?.map((item: any) =>
                handlePlant(item, num, isActive),
              ) || []
            const offices =
              officeReportData?.map((item: any) =>
                handleOffice(item, num, isActive),
              ) || []

            if (isActive) {
              num.index++
            }

            return [...parks, ...plants, ...offices]
          },
        )
        ?.flat?.() || []
    )
  } else {
    return []
  }
})

const handleCompareList = (
  dataList: any[],
  configs: any[],
  type: 'plant' | 'office',
) => {
  const handle = (currentList: any, index = 0) => {
    const result = configs
      .map(({ name, list, ...others }) => {
        return {
          ...others,
          name,
          list: list
            .map((item: any) => {
              const line = {
                ...item,
                values:
                  currentList?.map?.((carrier: any, i: number) => {
                    const current = carrier[item.field]
                    return {
                      url: item.toDetail ? `/${type}/detail_${carrier.id}` : '',
                      value: current,
                      index: index + i,
                    }
                  }) || [],
              }

              if (
                line.values.some(
                  (item: any) => !!item.value || item.value === 0,
                )
              ) {
                return line
              } else {
                return null
              }
            })
            .filter((item: any) => !!item),
        }
      })
      .filter(({ list }: any) => {
        return list.length > 0
      })

    return result
  }

  const max = 4
  const n = 3

  let i = 0
  if (dataList?.length > 1) {
    if (dataList.length > max) {
      const result = []
      while (i < dataList.length - 1) {
        const current = dataList.slice(i, i + n)
        result.push(...handle(current, i))
        i = i + n
      }
      return result
    } else {
      return handle(dataList)
    }
  } else {
    return []
  }
}

const plantCompareList = computed<any[]>(() => {
  const configs = [
    {
      name: '',
      isStart: true,
      list: [
        {
          name: '载体名称',
          field: 'name',
          toDetail: true,
        },
      ],
    },
    {
      name: '价格',
      list: [
        {
          name: '出租单价',
          field: 'rentPrice',
        },
        {
          name: '出售单价',
          field: 'salePrice',
        },
        {
          name: '物业费',
          field: 'propertyPrice',
        },
      ],
    },
    {
      name: '特色',
      list: [
        {
          name: '载体特色',
          field: 'feature',
        },
      ],
    },
    {
      name: '结构',
      list: [
        {
          name: '总面积',
          field: 'sumArea',
        },
        {
          name: '总层数',
          field: 'totalNumber',
        },
        {
          name: '新旧程度',
          field: 'newOld',
        },
        {
          name: '厂房柱距',
          field: 'spacing',
        },
        {
          name: '厂房跨度',
          field: 'plantSpan',
        },
        {
          name: '现配电量',
          field: 'nowElectricity',
        },
        {
          name: '耐火等级',
          field: 'fireResistant',
        },
        {
          name: '消防等级',
          field: 'fireProtection',
        },
        {
          name: '货梯数量',
          field: 'elevatorNum',
        },
        {
          name: '货梯尺寸',
          field: 'elevatorSize',
        },
        {
          name: '可进大车',
          field: 'car',
        },
      ],
    },
    {
      name: '交易',
      list: [
        {
          name: '押付方式',
          field: 'stakePay',
        },
        {
          name: '产权年限',
          field: 'propertyDuration',
        },
      ],
    },
    {
      name: '园区',
      list: [
        {
          name: '园区配套',
          field: 'supporting',
        },
      ],
    },
  ]
  return handleCompareList(props.data?.plantCompareList, configs, 'plant')
})

const officeCompareList = computed<any[]>(() => {
  const configs = [
    {
      name: '',
      isStart: true,
      list: [
        {
          name: '载体名称',
          field: 'name',
          toDetail: true,
        },
      ],
    },
    {
      name: '价格',
      list: [
        {
          name: '出租单价',
          field: 'rentPrice',
        },
        {
          name: '出售单价',
          field: 'salePrice',
        },
        {
          name: '物业费',
          field: 'propertyPrice',
        },
      ],
    },
    {
      name: '特色',
      list: [
        {
          name: '载体特色',
          field: 'feature',
        },
      ],
    },
    {
      name: '结构',
      list: [
        {
          name: '装修',
          field: 'decorationType',
        },
        {
          name: '朝向',
          field: 'orientation',
        },
        {
          name: '层高',
          field: 'storeyHeight',
        },
        {
          name: '所在楼层',
          field: 'floor',
        },
        {
          name: '总层数',
          field: 'allFloor',
        },
        {
          name: '可注册',
          field: 'isRegister',
        },
      ],
    },
    {
      name: '交易',
      list: [
        {
          name: '押付方式',
          field: 'stakePay',
        },
        {
          name: '起租期',
          field: 'leaseRent',
        },
      ],
    },
    {
      name: '园区',
      list: [
        {
          name: '园区配套',
          field: 'supporting',
        },
      ],
    },
  ]
  return handleCompareList(props.data?.officeCompareList, configs, 'office')
})

const compareList = computed(() => {
  if (props.data?.plantCompareList?.length > 0) {
    return plantCompareList.value
  } else if (props.data?.officeCompareList?.length > 0) {
    return officeCompareList.value
  } else {
    return []
  }
})

const initDetail = async () => {
  console.log('props>>>>>>>>>>',props.parkPlantOfficeData, props.data.carrierList)
  try {
    if (props.parkPlantOfficeData) {
      detail.value = { parkPlantOfficeData: props.parkPlantOfficeData }
    }
    console.log('res>>>>>>>>>>',detail.value)
  } catch (error) {
    console.log(error)
  }
}

const isPark = (item: any) => {
  return item.itemType === 'park'
}

const isPlant = (item: any) => {
  return item.itemType === 'plant'
}

const isOffice = (item: any) => {
  return item.itemType === 'office'
}

const handleNum = (item: any) => {
  return item.index
}

const getDescName = (item: any) => {
  if (isPark(item)) {
    return '园区简介'
  } else if (isPlant(item)) {
    return '厂房简介'
  } else {
    return '房源简介'
  }
}

const handleInfo = (infos: any[]) => {
  return infos.map(({ name, value, ...others }) => {
    return {
      name,
      value: !!value || value === 0 || others.ignore ? value : '--',
      ...others,
    }
  })
}

const handlePlantInfo = (item: any) => {
  const {
    buildNum,
    structure,
    totalNumber,
    totalArea,
    rentSaleType,
    propertyPrice,
    stakePayWay,
    evaluate,
    newOld,
    completeDate,
    propertyDuration,
    spacing,
    fireResistant,
    fireProtection,
    cusElevatorNum,
    elevatorNum,
    elevatorWidthHigh,
    elevatorLoad,
    type,
    plantSpan,
    roofHigh,
    eavesHigh,
    plantDoor,
    wallType,
    isCar,
    carLength,
    startLeaseTime,
    nowElectricity,
    water,
    electricity,
    gas,
  } = item

  const isMulti = type === 2
  const isRent =
    rentSaleType.includes('整栋出租') || rentSaleType.includes('分层出租')

  return handleInfo([
    {
      name: '楼栋号',
      value: buildNum,
    },
    {
      name: '建筑结构',
      value: structure,
    },
    {
      name: '总层数',
      value: totalNumber,
    },
    {
      name: '总面积',
      value: totalArea,
    },
    {
      name: '租售类型',
      value: rentSaleType,
    },
    {
      name: '厂房类型',
      value: type === 1 ? '单层' : '多层',
    },
    {
      name: '新旧程度',
      value: newOld,
    },
    {
      name: '竣工时间',
      value: completeDate,
    },
    {
      name: '产权年限',
      value: propertyDuration,
    },
    {
      name: '厂房柱距',
      value: spacing,
    },
    {
      name: '厂房跨度',
      value: plantSpan,
    },
    {
      name: '顶高',
      value: roofHigh,
      isHide: isMulti,
    },
    {
      name: '檐高',
      value: eavesHigh,
      isHide: isMulti,
    },
    {
      name: '厂房门',
      value: plantDoor,
    },
    {
      name: '墙体类型',
      value: wallType,
    },
    {
      name: '可进大车',
      value: isCar,
    },
    {
      name: '最大可进车长',
      value: carLength,
      isHide: isCar === '不可以',
    },
    {
      name: '可办环评',
      value: evaluate,
    },
    {
      name: '押付方式',
      value: stakePayWay,
      isHide: !isRent,
    },
    {
      name: '起租期',
      value: startLeaseTime,
      isHide: !isRent,
    },
    {
      name: '现配电量',
      value: nowElectricity,
    },
    {
      name: '物业费',
      value: propertyPrice,
    },
    {
      name: '水费',
      value: water,
    },
    {
      name: '电费',
      value: electricity,
    },
    {
      name: '燃气费',
      value: gas,
    },
    {
      name: '耐火等级',
      value: fireResistant,
    },
    {
      name: '消防等级',
      value: fireProtection,
    },
    {
      name: '客梯数量',
      value: cusElevatorNum,
      isHide: !isMulti,
    },
    {
      name: '货梯数量',
      value: elevatorNum,
      isHide: !isMulti,
    },
    {
      name: '货梯尺寸',
      value: elevatorWidthHigh,
      isHide: !isMulti,
    },
    {
      name: '货梯荷载',
      value: elevatorLoad,
      isHide: !isMulti,
    },
  ])
}

const handleOfficeInfo = (item: any) => {
  const {
    area,
    floor,
    allFloor,
    orientation,
    storeyHeight,
    rentSaleType,
    leaseRent,
    propertyFee,
    betAndPay,
    decorationType,
    elevatorNum,
    airConfig,
    isDivision,
    isRegister,
  } = item

  return handleInfo([
    {
      name: '面积',
      value: area,
    },
    {
      name: '所在楼层',
      value: floor,
    },
    {
      name: '总层数',
      value: allFloor,
    },
    {
      name: '朝向',
      value: orientation,
    },
    {
      name: '层高',
      value: storeyHeight,
    },
    {
      name: '租售类型',
      value: rentSaleType,
    },
    {
      name: '起租期',
      value: leaseRent,
    },
    {
      name: '物业费',
      value: propertyFee,
    },
    {
      name: '押付方式',
      value: betAndPay,
    },
    {
      name: '装修类型',
      value: decorationType,
    },
    {
      name: '电梯数量',
      value: elevatorNum,
    },
    {
      name: '空调配置',
      value: airConfig,
    },
    {
      name: '可分割',
      value: isDivision,
    },
    {
      name: '可注册',
      value: isRegister,
    },
  ])
}

const handleAvatar = (item: any) => {
  const { brokerInfo } = item
  if (brokerInfo && brokerInfo.avatar) {
    const avatar = JSON.parse(brokerInfo.avatar) || []
    return avatar[0]?.fileUrl || ''
  } else {
    return ''
  }
}

const handleFloor = (item: any) => {
  const {
    floorHeight,
    singleArea,
    length,
    weight,
    isCrownBlock,
    crownBlock,
    isDivisible,
    // vrLink,
    layerNumber,
    floorType,
  } = item

  return handleInfo([
    {
      name: '所在楼层',
      value: layerNumber,
    },
    // {
    //   name: 'VR视频',
    //   value: vrLink,
    //   isVR: true,
    //   ignore: true,
    // },
    {
      name: '层高',
      value: floorHeight,
    },
    {
      name: '单层面积',
      value: singleArea,
    },
    {
      name: '厂房长宽',
      value: length,
    },
    {
      name: '楼面荷载',
      value: weight,
    },
    {
      name: '地面类型',
      value: floorType,
    },
    {
      name: '有无天车',
      value: isCrownBlock,
    },
    {
      name: '天车承重',
      value: crownBlock,
    },
    {
      name: '可分割',
      value: isDivisible,
    },
  ])
}

const handleParkTopInfo = (item: any) => {
  const { parkType, industryName, streetName, address } = item

  return handleInfo([
    {
      name: '园区类型',
      value: parkType?.join?.(',') || '',
    },
    {
      name: '产业方向',
      value: industryName?.join('、') || '',
    },
    {
      name: '所属区域',
      value: streetName,
    },
    {
      name: '详细地址',
      value: address,
    },
  ])
}

const isRent = (item: any) => {
  if (isPlant(item)) {
    return item.plantRentSaleType?.includes?.('1')
  } else if (isOffice(item)) {
    return item.officeRentSaleType?.includes?.('1')
  } else {
    return false
  }
}

const isSale = (item: any) => {
  if (isPlant(item)) {
    return item.plantRentSaleType?.includes?.('2')
  } else if (isOffice(item)) {
    return item.officeRentSaleType?.includes?.('2')
  } else {
    return false
  }
}

// await initDetail()
// useSeoMeta({
//   title: `选址报告`,
//   ogImage: '/favicon.icon',
// })
</script>

<style lang="scss">
.address-report {
  // width: 820px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 40px;
  font-family: 'PingFang SC', sans-serif;

  .cover-wrapper {
    width: 740px;
    display: flex;
    justify-content: center;
    position: relative;
    break-after: page;
  }

  .cover-image {
    width: 740px;
  }

  .serial-number {
    position: absolute;
    top: 19px;
    right: 30px;
    color: #254677;
    font-size: 18px;
    letter-spacing: 3px;
    font-weight: 500;
  }

  .carrier-list-wrapper {
    position: relative;
    padding-top: 92px;
    padding-bottom: 24px;
    padding-left: 40px;
    padding-right: 40px;
    break-after: page;
  }

  .carrier-list-title {
    width: 132px;
  }

  .computer-image-wrapper {
    position: absolute;
    top: 0;
    right: 30px;

    .computer-image {
      width: 184px;
    }
  }

  .carrier-list {
    margin-top: 21px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .carrier-cell {
    padding: 35px;
    padding-top: 24px;
    padding-bottom: 24px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 0px 44px 0px rgba(0, 0, 0, 0.03);
  }

  .carrier-name {
    border-bottom: 1px solid #EDF3F8;
    padding-bottom: 21px;
    font-weight: 500;
  }

  .carrier-info-wrapper {
    display: flex;
    margin-top: 21px;
    align-items: center;
    justify-content: space-around;
  }

  .carrier-info-item {
    display: flex;
    align-items: center;
    min-width: 137px;

    &.carrier-count {
      min-width: 75.21px;
    }
  }

  .info-label {
    color: #7F7E7E;
    font-size: 14px;
  }

  .info-value {
    margin-left: 11px;
    font-size: 14px;
    color: #3E4B58;
  }

  .compare-title {
    font-weight: 700;
    font-size: 18px;
  }

  .compare-section-padding {
    padding-left: 40px;
    padding-right: 40px;
  }

  .compare-subtitle {
    padding-left: 40px;
    padding-right: 40px;

    &.bg-white {
      background-color: white;
    }
  }

  .section-title {
    color: #000000;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    background: linear-gradient(61deg, rgba(23, 99, 255, 0.16) 0%, rgba(23, 99, 255, 0) 100%);
  }

  .vr-link-wrapper {
    margin-left: 8px;
    display: flex;
    flex: none;
    align-items: center;
    height: 28px;
  }

  .vr-link {
    padding-left: 6px;
    padding-right: 6px;
    padding-top: 2px;
    padding-bottom: 2px;
    color: #1763FF;
    font-size: 12px;
    background-color: rgba(23, 99, 255, 0.06);
    cursor: pointer;
  }

  .park-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-top: 6px;
  }

  .park-tag {
    margin-left: 10px;
    margin-top: 10px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
    padding-bottom: 6px;
    color: #1763FF;
    font-size: 14px;
    background-color: #F3F7FF;
    border-radius: 4px;
  }

  .park-image-wrapper {
    width: 378px;
    height: 242px;
    flex: none;

    .park-image {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: cover;
    }
  }

  .park-info-wrapper {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .park-info-list {
    margin-top: -12px;
  }

  .park-info-item {
    margin-top: 12px;
    display: flex;
    gap: 12px;
    font-size: 14px;
  }

  .park-info-label {
    color: #7F7E7E;
    flex: none;
  }

  .park-info-value {
    color: #3E4B58;
  }

  .park-broker-wrapper {
    flex: none;
    max-width: 300px;
    margin-top: 14px;
  }

  .broker-card {
    padding-left: 20px;
    padding-right: 14px;
    padding-top: 22px;
    padding-bottom: 22px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: flex;
  }

  .broker-avatar-wrapper {
    flex: none;

    .broker-avatar {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .broker-info {
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .broker-header {
    display: flex;
    align-items: center;
  }

  .broker-name {
    color: #000000;
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
  }

  .broker-job {
    margin-left: 13px;
    color: #7F7E7E;
    font-size: 12px;
    flex: none;
  }

  .broker-slogan {
    color: #7F7E7E;
    font-size: 12px;
  }

  .broker-phone {
    color: #000000;
    font-size: 14px;
  }

  .support-wrapper {
    margin-top: 14px;
  }

  .desc-wrapper {
    margin-top: 20px;
  }

  .cell-title {
    position: relative;
    font-size: 14px;
    color: black;
    font-weight: 500;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      display: none;
      width: 2px;
      height: 14px;
      background: #1763ff;
    }
  }

  .desc-content {
    margin-top: 10px;
    text-align: justify;
    color: #424A53;
    font-size: 14px;
    white-space: pre-line;
  }

  .map-wrapper {
    margin-top: 20px;
  }

  .map-container {
    margin-top: 10px;
  }

  .price-wrapper {
    display: flex;
    color: #1763FF;
    font-weight: 700;
    gap: 10px;
  }

  .price-item {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F6F8FB;
    border-radius: 4px;
    flex: 1;
    height: 45px;
    white-space: nowrap;
  }

  .price-label {
    font-size: 14px;
  }

  .price-value {
    font-size: 16px;
    margin-left: 4px;
  }

  .carrier-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-left: -10px;
    margin-top: -1px;
  }

  .carrier-tag {
    margin-left: 10px;
    margin-top: 10px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
    padding-bottom: 6px;
    color: #3E4B58;
    font-size: 14px;
    background-color: #F6F8FB;
    border-radius: 4px;
  }

  .broker-card-wrapper {
    flex: none;
    width: 300px;
    margin-left: 6px;
  }

  .carrier-image-container {
    margin-top: 26px;

    .carrier-image {
      width: 650px;
      height: 410px;
      border-radius: 6px;
      object-fit: cover;
    }
  }

  .params-wrapper {
    margin-top: 20px;
  }

  .params-grid {
    display: flex;
    flex-wrap: wrap;
    margin-top: -2px;
  }

  .param-item {
    margin-top: 14px;
    display: flex;
    width: 25%;
    align-items: center;
    gap: 12px;
    font-size: 14px;
  }

  .param-label {
    color: #7F7E7E;
    width: 4em;
    flex: none;
  }

  .param-value {
    color: #3E4B58;

    &.vr-link {
      color: #1763FF;
      cursor: pointer;
    }
  }

  .floor-wrapper {
    margin-top: 20px;
  }

  .floor-images {
    margin-top: 16px;
  }

  .floor-images-grid {
    display: flex;
    flex-wrap: wrap;
    margin-left: -20px;
    margin-top: -20px;
  }

  .floor-image-wrapper {
    width: 360px;
    margin-left: 20px;
    margin-top: 20px;
    border-radius: 6px;
    overflow: hidden;

    .floor-image {
      width: 100%;
      object-fit: cover;
    }
  }

  .footer-wrapper {
    width: 740px;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .footer-image {
    width: 740px;
  }

  .disclaimer-text {
    position: absolute;
    top: 280px;
    padding-left: 46px;
    padding-right: 46px;
    font-size: 14px;
    line-height: 28px;
    color: #3E4B58;
  }

  .break-after-page {
    break-after: page;
    padding-bottom: 20px;
  }

  .mt-3 {
    margin-top: 12px;
  }

  .break-before-page {
    break-before: page;
  }

  .table-cell {
    display: flex;
    font-size: 13px;
    color: #666;

    div {
      flex: 1;
      text-align: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 52px;
      padding: 10px 2px;

      &:nth-child(1) {
        width: 20%;
      }

      &+div {
        border-left: 1px solid #e9ecf3;
      }
    }
  }

  .text-dark {
    color: #222;
  }

  .detail-link {
    text-decoration: underline;
    color: #04286D;
  }

  .line-border {
    margin-left: 40px;
    margin-right: 40px;
    border: 1px solid #e9ecf3;
  }

  .mt-5 {
    margin-top: 20px;
  }

  .flex {
    display: flex;
  }

  .flex-1 {
    width: 40%;
    // flex: 1;
  }

  &__carrier-list {
    background: url('@/assets/images/bg-carrier_list.webp') no-repeat center;
    background-size: cover;
    width: 740px;
    min-height: 1040px;
  }

  .sub-title {
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    line-height: 29px;
    padding: 6px 24px;
    background: #f5f7fa;
  }
}

</style>
