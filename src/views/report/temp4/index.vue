<template>
  <div class="report-page report-font" :class="{ 'min-width-wrapper bg-gray': route.query.preview === 'true' }">
    <!-- 页眉 -->
    <!-- <div class="page-header">
      <div class="header-content">
        <img src="@/assets/images/headerLogo.png" alt="Logo" class="header-logo" />
        <div class="header-title">AI选址报告</div>
        <div class="header-date">{{ currentDate }}</div>
      </div>
    </div> -->

    <!-- A4分页容器 -->
    <div class="a4-container">
      <div 
        v-for="(page, pageIndex) in paginatedContent" 
        :key="pageIndex" 
        class="a4-page"
        :class="{ 'page-break': pageIndex > 0 }"
      >
        <!-- 页面内容 -->
        <div class="page-content">
          <!-- 第一页特殊处理 -->
          <div v-if="pageIndex === 0" class="first-page">
            <div class="relative">
              <img class="cover-image" src="@/assets/images/ai-report_cover.png" alt="" />
            </div>
            <div class="page-title">
              AI选址报告
            </div>
          </div>

          <!-- 动态内容 -->
          <div v-for="(section, sectionIndex) in page.sections" :key="sectionIndex" class="content-section">
            <!-- 载体推荐 -->
            <div v-if="section.type === 'carrier-recommendation'" class="section-wrapper">
              <div class="sec-title content-padding">载体推荐</div>
              <div v-for="(component, loop) in section.data.recommendationList" :key="loop" class="content-padding">
                <div>
                  <div class="thre-title">
                    {{ toUpperCase(loop + 1) }}、{{ component.region }}
                  </div>
                  <div v-if="component.regionReason" class="content-padding reason-text">
                    一句话理由:{{ component.regionReason }}
                  </div>
                  <div class="carrier-container">
                    <div v-for="(carrier, index) in component.carrierRecommendList" :key="index"
                      class="carrier-view content-padding">
                      <NuxtLink :to="carrier
                        ? carrier.vrLink
                        : `/${section.data.type == 1 ? 'plant' : 'office'}/detail_${carrier.id}`
                        " :disabled="true" :title="carrier.name" target="_blank">
                        <div v-if="carrier.vrLink && route.query.preview === 'true'" class="vr-icon"></div>
                        <div v-if="carrier.vrLink && route.query.preview !== 'true'" class="pdf-icon">
                          <img src="@/assets/images/ai-report-pdf-icon.png" alt="" />
                        </div>
                        <div class="carrier-image-wrapper">
                          <img :src="carrier.externalFacadeUrl" class="carrier-img" />
                          <img class="top-icon" :src="imgList[index]" />
                          <div class="img-cover">
                            <p class="carrier-name">
                              {{ carrier.name }}
                            </p>
                            <p class="carrier-info">
                              {{ carrier.area }} <span class="line"></span>
                              {{ carrier.price }}
                            </p>
                          </div>
                        </div>
                        <div class="carrier-detail">
                          <p class="feature-text">
                            {{ carrier.featureSuppert }}
                          </p>
                          <div class="address-wrapper">
                            <el-icon size="18">
                              <Location />
                            </el-icon>
                            <span class="address-text">{{ carrier.address }}</span>
                          </div>
                        </div>
                      </NuxtLink>
                    </div>
                  </div>
                  <div v-if="component.regionReasonReport" class="content-padding thre-title">
                    推荐理由:
                  </div>
                  <div class="content-padding" v-html="marked(component.regionReasonReport || '')"></div>
                  <!-- ai分析 -->
                  <div class="thre-title content-padding">微观分析</div>
                  <div class="content-padding">
                    <div class="analysis-view">
                      <img class="ai-icon" src="@/assets/images/icon_ai.webp" />
                      <div v-html="marked(section.data.siteAnalysis || '')"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 载体对比 -->
            <div v-if="section.type === 'carrier-comparison'" class="section-wrapper">
              <div class="sec-title content-padding my-10 break-before-page">
                载体比较
              </div>
              <div v-if="section.data.plantList">
                <!-- 厂房 -->
                <!-- 价格 -->
                <div v-if="judgeExist('plant', 'rentPrice', 'salePrice', 'propertyPrice')" class="content-padding">
                  <div class="sub-title">价格</div>
                </div>
                <div v-if="judgeExist('plant', 'rentPrice')" class="table-cell">
                  <div class="text-dark">出租单价</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index"
                    :class="{ 'low-price': item.rentPriceFlag === 1 }">
                    {{ item.rentPrice }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'salePrice')" class="table-cell">
                  <div class="text-dark">出售单价</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index"
                    :class="{ 'low-price': item.salePriceFlag === 1 }">
                    {{ item.salePrice }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'propertyPrice')" class="table-cell">
                  <div class="text-dark">物业费</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.propertyPrice }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'featureList')" class="content-padding">
                  <div class="sub-title">特色</div>
                </div>
                <div v-if="judgeExist('plant', 'featureList')" class="table-cell">
                  <div class="text-dark">载体特色</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index" class="ell3 !line-clamp-3 !max-h-[71px]">
                    {{ item.featureList.join('、') }}
                  </div>
                </div>
                <!-- 结构 -->
                <div v-if="judgeExist('plant', 'singleArea', 'newOld', 'structure', 'spacing', 'fireResistant', 'fireProtection', 'elevatorNum', 'totalNumber')" class="content-padding">
                  <div class="sub-title">结构</div>
                </div>
                <div v-if="judgeExist('plant', 'singleArea')" class="table-cell">
                  <div class="text-dark">面积（单层）</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.singleArea }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'totalNumber')" class="table-cell">
                  <div class="text-dark">总层数</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.totalNumber }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'newOld')" class="table-cell">
                  <div class="text-dark">新旧程度</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.newOld }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'structure')" class="table-cell">
                  <div class="text-dark">建筑结构</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.structure }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'spacing')" class="table-cell">
                  <div class="text-dark">厂房柱距</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.spacing }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'fireResistant')" class="table-cell">
                  <div class="text-dark">耐火等级</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.fireResistant }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'fireProtection')" class="table-cell">
                  <div class="text-dark">消防等级</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.fireProtection }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'elevatorNum')" class="table-cell">
                  <div class="text-dark">货梯数量</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.elevatorNum }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'elevatorWidth', 'elevatorHigh', 'elevatorLength')" class="table-cell">
                  <div class="text-dark">货梯尺寸</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ handleElevator(item) }}
                  </div>
                </div>
                <!-- 交易 -->
                <div v-if="judgeExist('plant', 'stakePayWay', 'propertyDuration')" class="content-padding">
                  <div class="sub-title">交易</div>
                </div>
                <div v-if="judgeExist('plant', 'stakePayWay')" class="table-cell">
                  <div class="text-dark">押付方式</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.stakePayWay }}
                  </div>
                </div>
                <div v-if="judgeExist('plant', 'propertyDuration')" class="table-cell">
                  <div class="text-dark">产权年限</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.propertyDuration }}
                  </div>
                </div>
                <!-- 园区 -->
                <div v-if="judgeExist('plant', 'supporting')" class="content-padding">
                  <div class="sub-title">园区</div>
                </div>
                <div v-if="judgeExist('plant', 'supporting')" class="table-cell">
                  <div class="text-dark">园区配套</div>
                  <div v-for="(item, index) in section.data.plantList" :key="index">
                    {{ item.supporting.join('、') }}
                  </div>
                </div>
              </div>
              <div v-else-if="section.data.officeList">
                <!-- 办公 -->
                <!-- 价格 -->
                <div v-if="judgeExist('office', 'rentPrice', 'unitPrice', 'propertyFee')" class="content-padding">
                  <div class="sub-title">价格</div>
                </div>
                <div v-if="judgeExist('office', 'rentPrice')" class="table-cell">
                  <div class="text-dark">出租单价</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index"
                    :class="{ 'low-price': item.salePriceFlag === 1 }">
                    {{ item.rentPrice }}
                  </div>
                </div>
                <div v-if="judgeExist('office', 'unitPrice')" class="table-cell">
                  <div class="text-dark">出售单价</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index"
                    :class="{ 'low-price': item.salePriceFlag === 1 }">
                    {{ item.unitPrice }}
                  </div>
                </div>
                <div v-if="judgeExist('office', 'propertyFee')" class="table-cell">
                  <div class="text-dark">物业费</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.propertyFee }}
                  </div>
                </div>
                <!-- 结构 -->
                <div v-if="judgeExist('office', 'decorationType', 'orientation', 'storeHeight', 'airConfig')" class="content-padding">
                  <div class="sub-title">结构</div>
                </div>
                <div v-if="judgeExist('office', 'decorationType')" class="table-cell">
                  <div class="text-dark">装修</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.decorationType }}
                  </div>
                </div>
                <div v-if="judgeExist('office', 'orientation')" class="table-cell">
                  <div class="text-dark">朝向</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.orientation }}
                  </div>
                </div>
                <div v-if="judgeExist('office', 'storeHeight')" class="table-cell">
                  <div class="text-dark">层高</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.storeyHeight }}
                  </div>
                </div>
                <div v-if="judgeExist('office', 'airConfig')" class="table-cell">
                  <div class="text-dark">空调配置</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.airConfig }}
                  </div>
                </div>
                <!-- 交易 -->
                <div v-if="judgeExist('office', 'betAndPay', 'leaseRent')" class="content-padding">
                  <div class="sub-title">交易</div>
                </div>
                <div v-if="judgeExist('office', 'betAndPay')" class="table-cell">
                  <div class="text-dark">押付方式</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.betAndPay }}
                  </div>
                </div>
                <div v-if="judgeExist('office', 'leaseRent')" class="table-cell">
                  <div class="text-dark">起租期</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.leaseRent }}
                  </div>
                </div>
                <!-- 园区 -->
                <div v-if="judgeExist('office', 'supporting')" class="content-padding">
                  <div class="sub-title">园区</div>
                </div>
                <div v-if="judgeExist('office', 'supporting')" class="table-cell">
                  <div class="text-dark">园区配套</div>
                  <div v-for="(item, index) in section.data.officeList" :key="index">
                    {{ item.supporting.join('、') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 载体详情 -->
            <div v-if="section.type === 'carrier-detail'" class="section-wrapper">
              <div class="sec-title content-padding my-10 break-before-page">
                载体详情
              </div>
              <AddressReport :park-plant-office-data="section.data.parkPlantOfficeData" :data="section.data">
              </AddressReport>
            </div>
          </div>
        </div>

        <!-- 页脚 -->
        <div class="page-footer">
          <div class="footer-content">
            <div class="page-number">第 {{ pageIndex + 1 }} 页</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打印按钮 -->
    <!-- <div class="print-actions">
      <button @click="generatePDF" class="print-btn">生成PDF</button>
      <button @click="printReport" class="print-btn">打印报告</button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useReportApi } from '@/api/report/index';
import { textData, oldData, newData } from './TextData';
// 动态导入AddressReport组件
const AddressReport = defineAsyncComponent(() => import('./address-report.vue'))
import imgTop1 from '@/assets/images/icon_top1.webp'
import imgTop2 from '@/assets/images/icon_top2.webp'
import imgTop3 from '@/assets/images/icon_top3.webp'
import imgTop4 from '@/assets/images/icon_top4.webp'

const imgList = [imgTop1, imgTop2, imgTop3, imgTop4]

// API实例
const reportApi = useReportApi();

const route = useRoute()
const reportId = route.params.id as string;

const detailId = computed(() => {
  return route.query.id || ''
})

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 使用假数据代替接口请求
const data = ref<any>({})

// 分页配置
const pageHeight = 1123 // A4高度减去页眉页脚 (297mm - 约40mm)
const sections = ref<any[]>([])

// 定义页面和section的类型
interface PageSection {
  type: string
  data: any
}

interface Page {
  sections: PageSection[]
  currentHeight: number
}

// 将内容分页
const paginatedContent = computed(() => {
  const pages: Page[] = []
  let currentPage: Page = {
    sections: [],
    currentHeight: 0
  }

  sections.value.forEach(section => {
    // 估算section高度（这里需要根据实际内容调整）
    const estimatedHeight = estimateSectionHeight(section)
    
    if (currentPage.currentHeight + estimatedHeight > pageHeight) {
      // 当前页已满，开始新页
      pages.push(currentPage)
      currentPage = {
        sections: [section],
        currentHeight: estimatedHeight
      }
    } else {
      // 添加到当前页
      currentPage.sections.push(section)
      currentPage.currentHeight += estimatedHeight
    }
  })

  // 添加最后一页
  if (currentPage.sections.length > 0) {
    pages.push(currentPage)
  }

  return pages
})

// 估算section高度（简化版本，实际应该根据DOM计算）
const estimateSectionHeight = (section: any) => {
  const baseHeights = {
    'carrier-recommendation': 1200,
    'carrier-comparison': 800,
    'carrier-detail': 1200
  }
  return baseHeights[section.type] || 200
}

const judgeExist = (type: 'plant' | 'office', ...fields: string[]) => {
  const list =
    type === 'plant'
      ? data.value.plantList
      : data.value.officeList
  const judge = (field: string) => {
    return list.some((item: any) => {
      const current = item[field]
      if (typeof item === 'object') {
        return Array.isArray(current)
          ? current.length > 0
          : current
            ? Object.values(current)
            : false
      } else {
        return current || current === 0
      }
    })
  }
  return fields.some((item) => {
    return judge(item)
  })
}

// 模拟初始化详情的函数
const initDetail = async () => {
  // data.value = textData
  data.value = newData
  
  // 构建sections
  sections.value = [
    {
      type: 'carrier-recommendation',
      data: data.value
    },
    {
      type: 'carrier-comparison',
      data: data.value
    },
    {
      type: 'carrier-detail',
      data: data.value
    }
  ]

  console.log('使用假数据初始化报告详情', reportId, data.value)
}

console.log('报告data:', data.value);
const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function toUpperCase(num) {
  if (typeof num !== 'number' && typeof num !== 'string') return '';
  num = String(num);
  if (!/^\d+$/.test(num)) return '';
  let result = '';
  for (let i = 0; i < num.length; i++) {
    result += CN_NUM[Number(num[i])];
  }
  return result;
}

const handleElevator = ({
  elevatorLength,
  elevatorWidth,
  elevatorHigh,
}: any) => {
  return [
    {
      label: '长',
      value: elevatorLength,
    },
    {
      label: '宽',
      value: elevatorWidth,
    },
    {
      label: '高',
      value: elevatorHigh,
    },
  ]
    .map(({ label, value }) => {
      return value ? `${label}${value}` : ''
    })
    .filter((i) => i)
    .join('，')
}



// 打印功能
const printReport = () => {
  window.print()
}

initDetail()
const downloadFile = () => {
  const x = new window.XMLHttpRequest()
  x.open('GET', data.value.reportUrl, true)
  x.responseType = 'blob'
  x.onload = () => {
    const url = window.URL.createObjectURL(x.response)
    const a = document.createElement('a')
    a.href = url
    a.download = data.value.name
    a.click()
  }
  x.send()
}
</script>

<style scoped lang="scss">
// A4页面样式
.a4-container {
  width: 210mm;
  margin: 0 auto;
  background: white;
}

.a4-page {
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  background: white;
  position: relative;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.page-break {
  page-break-before: always;
}

// 页眉样式
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.header-content {
  width: 210mm;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20mm;
}

.header-logo {
  height: 30px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.header-date {
  font-size: 12px;
  color: #666;
}

// 页面内容
.page-content {
  padding: 20mm;
  min-height: calc(297mm - 40mm); // 减去页眉页脚高度
  position: relative;
}

// 页脚样式
.page-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20mm;
  border-top: 1px solid #eee;
  background: white;
}

.footer-content {
  padding: 5mm 20mm;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.page-number {
  font-weight: bold;
}

.footer-text {
  flex: 1;
  text-align: center;
  line-height: 1.4;
}

// 内容区域样式
.content-section {
  margin-bottom: 20px;
}

.section-wrapper {
  break-inside: avoid;
}

// 打印按钮
.print-actions {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
}

.print-btn {
  padding: 10px 20px;
  background: #1C66FF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #0056cc;
  }
}

// 全局样式
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
}

.report-page {
  position: relative;
  min-height: 100%;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.report-font {
  font-family: 'PingFang SC', sans-serif;
}

// 原Tailwind类名转换为SCSS
.min-width-wrapper {
  min-width: 1440px;
}

.bg-gray {
  background-color: #F3F3F5;
}

.header-wrapper {
  width: 100%;
  background-color: white;
  padding-top: 25px;
  padding-bottom: 25px;
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  .header-logo {
    width: 285px;
  }
}

.report-container {
  width: 740px;
  margin-left: auto;
  margin-right: auto;
  background-color: white;
  padding-bottom: 12px;
}

.cover-image {
  width: 740px;
}

.serial-number {
  position: absolute;
  color: #29497A;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 4px;
  top: 16px;
  right: 24px;
}

.page-title {
  font-family: 'FZLTTHK--GBK1';
  color: #222;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  margin-top: 50px;
}

.top-analysis {
  font-size: 16px;
  color: #222;
  line-height: 29px;
  margin-top: 18px;
  margin-bottom: 18px;
  padding-left: 40px;
  padding-right: 40px;
}

.reason-text {
  width: 100%;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 16px;
  color: #303030;
  line-height: 34px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.sec-title {
  margin: 16px 0;
  height: 31px;
  font-family: 'PingFang SC, PingFang SC';
  font-weight: 600;
  font-size: 22px;
  color: #171717;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.thre-title {
  margin: 16px 0;
  height: 25px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 18px;
  color: #303030;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.content-padding {
  padding-left: 40px;
  padding-right: 40px;
}

.carrier-container {
  display: flex;
  justify-content: space-between;
}

.carrier-view {
  width: 320px;
  margin-bottom: 24px;
  border-radius: 4px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.vr-icon {
  position: absolute;
  top: 82.5px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 100px;
  height: 100px;
  background: url('@/assets/images/vr-animation.png') no-repeat;
  background-size: auto 100px;
  animation: vr-ani 3.08333333s 0s steps(74) infinite normal;
}

.pdf-icon {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 10;

  img {
    width: 54px;
    height: 26px;
  }
}

.carrier-image-wrapper {
  width: 320px;
  height: 165px;
  position: relative;
  color: white;
  overflow: hidden;
}

.carrier-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease-in-out;
}

.carrier-view:hover .carrier-img {
  transform: scale(1.3);
}

.top-icon {
  width: 37px;
  height: 43px;
  position: absolute;
  top: 0;
  left: 0;
}

.img-cover {
  background: linear-gradient(180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.14) 13%,
      rgba(0, 0, 0, 0.25) 28%,
      rgba(0, 0, 0, 0.33) 53%,
      rgba(0, 0, 0, 0.39) 75%,
      rgba(0, 0, 0, 0.5) 100%);
  backdrop-filter: blur(0px);
  position: absolute;
  bottom: 0;
  left: 0;
  height: 57px;
  width: 100%;
  padding-top: 5px;
  padding-left: 11px;
}

.carrier-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.carrier-info {
  font-size: 12px;
  line-height: 24px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.line {
  width: 1px;
  height: 12px;
  background: #fff;
  opacity: 0.5;
  margin-left: 12px;
  margin-right: 12px;
}

.carrier-detail {
  width: 320px;
  border: 1px solid #eee;
  padding: 12px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.feature-text {
  color: #042D77;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.address-wrapper {
  display: flex;
  align-items: center;
}

.address-text {
  font-size: 12px;
  line-height: 24px;
  color: #7d8086;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.analysis-view {
  background: linear-gradient(171deg, #fafbff 0%, #f1f7ff 100%);
  display: flex;
  align-items: center;
  padding: 18px;
  border-radius: 4px;
  color: #66686d;
  font-size: 16px;
  line-height: 29px;

  .ai-icon {
    width: 50px;
    height: 56px;
    margin-right: 18px;
    flex-shrink: 0;
  }
}

.my-10 {
  margin-top: 40px;
  margin-bottom: 40px;
}

.break-before-page {
  page-break-before: always;
}

.table-header {
  display: flex;
  color: #222222;
  font-weight: 600;
  font-size: 14px;

  div {
    flex: 1;
    text-align: center;
  }
}

.underline {
  text-decoration: underline;
}

.text-blue {
  color: #04286D;
}

.text-dark {
  color: #222;
}

.table-cell {
  display: flex;
  font-size: 13px;
  color: #666;
  margin-left: 40px;
  margin-right: 40px;
  border: 1px solid #e9ecf3;

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

.sub-title {
  font-size: 14px;
  color: #222222;
  font-weight: 600;
  line-height: 29px;
  padding: 6px 24px;
  background: #f5f7fa;
}

.footer-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 8px;

  .footer-image {
    width: 740px;
  }
}

.disclaimer-text {
  position: absolute;
  top: 280px;
  width: 740px;
  padding-left: 46px;
  padding-right: 46px;
  font-size: 14px;
  line-height: 28px;
  color: #3E4B58;
}

.qrcode-container {
  width: 277px;
  height: 370px;
  padding-top: 36px;
  position: fixed;
  top: 98px;
  left: 50%;
  transform: translateX(400px);
  background-color: white;
  border-radius: 16px;
}

.download-btn {
  border: 1px solid #e5e5f0;
  cursor: pointer;
  width: 127px;
  height: 56px;
  border-radius: 4px;
  background-color: #F4F6FF;
  margin: 0 auto;
  color: #1C66FF;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  .pdf-icon-small {
    width: 30px;
    height: 36px;
    margin-right: 10px;
  }
}

.divider {
  width: 233px;
  height: 1px;
  margin: 36px auto 0;
  background-color: #eee;
}

.qrcode-wrapper {
  margin-top: 27px;

  .qrcode-title {
    color: #222222;
    font-size: 18px;
    text-align: center;
  }

  .qrcode {
    width: 138px;
    height: 138px;
    display: block;
    margin: 16px auto 0;
  }
}

.low-price::after {
  content: '低';
  width: 20px;
  height: 18px;
  display: inline-flex;
  margin-left: 2px;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  color: white;
  background: #d60000;
  border-radius: 3px;
}

// 打印样式
@media print {
  .a4-page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }
  
  .page-header {
    position: fixed;
  }
  
  .page-footer {
    position: fixed;
  }
  
  .print-actions {
    display: none;
  }
}

@page {
  size: A4;
  margin: 0;
}
</style>
