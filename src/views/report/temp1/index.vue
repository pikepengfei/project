<template>
  <div class="report-container" :style="mobileScaleStyle" ref="reportContainer">
    <!-- 自动分页控制开关 -->
    <!-- <div class="auto-paging-control">
      <div class="control-panel">
        <span class="control-label">自动分页：</span>
        <el-switch v-model="enableAutoPaging" @change="handleAutoPagingChange" active-text="开启" inactive-text="关闭"
          active-color="#13ce66" inactive-color="#ff4949" />
      </div>
    </div> -->

    <!-- 报告封面 -->
    <div class="report-page cover-page">
      <img src="@/assets/image/reportCover.png" alt="">
    </div>

    <!-- 动态生成的内容页面 -->
    <template v-for="(pageContent, pageIndex) in contentPages" :key="`page-${pageIndex}`">
      <div class="report-page combined-content-page"
        :style="`${enableAutoPaging && 'max-height: 297mm;height: 297mm;'}`">
        <div class="report-page_header">
          <img src="@/assets/image/headerLogo.png" alt="Logo">
        </div>
        <div class="report-pageOne-content" v-html="pageContent"></div>
        <!-- 页码 -->
        <div class="report-page-number page-footer">
          <span>第 {{ pageIndex + 1 }} 页</span>
        </div>
      </div>
    </template>

    <!-- 如果没有动态页面，显示原始合并页面 -->
    <div v-if="contentPages.length === 0" class="report-page combined-content-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">
        <div class="company-analysis-container">
          <!-- 公司标题部分 -->
          <div class="company-header">
            <div class="company-info">
              <div class="company-logo">
                <div class="logo-circle">
                  <!-- 如果没有logo取公司名称前四个字 -->
                  <span class="logo-text">{{ reportData.companyLogo || reportData.companyName?.slice(0, 4) }}</span>
                </div>
              </div>
              <div class="company-details">
                <h1 class="company-title">{{ reportData.companyName }}</h1>
                <div class="company-tags">
                  <template v-for="(tag, index) in reportData.companyTags" :key="index">
                    <span class="tag tag-green" v-if="tag === '存续'">存续</span>
                    <span class="tag tag-blue" v-else>{{ tag }}</span>
                  </template>
                </div>
              </div>
            </div>
            <div class="company-meta">
              <div class="meta-row">
                <span class="meta-label">法人代表：</span>
                <span class="meta-value">{{ reportData.juridicalPerson }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">注册地址：</span>
                <span class="meta-value">{{ reportData.registeredAddress }}</span>
              </div>
            </div>
          </div>

          <!-- 相关分析部分 -->
          <div class="analysis-section">
            <h3 class="analysis-title">相关分析</h3>
            <div class="analysis-cards">
              <div class="analysis-card small-enterprise">
                <div class="card-header">{{ reportData.analysis.enterpriseScale || '小型企业' }}</div>
                <div class="card-rating" style="margin-bottom: 0px;">
                  <el-rate v-model="ratingValueComputed" :max="5" allow-half disabled />
                </div>
                <div class="card-category">企业规模</div>
              </div>

              <div class="analysis-card d7-card">
                <div class="card-header">{{ reportData.dynamics }}</div>
                <div class="card-status" :class="investmentPotentialClass">{{ investmentPotentialText }}</div>
                <div class="card-category">企业选址动力</div>
              </div>

              <div class="analysis-card e3-card">
                <div class="card-header">{{ reportData.riskDate }}</div>
                <div class="card-status" :class="riskStatusClass">{{ riskRatingText }}</div>
                <div class="card-category">企业风险评级</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 公司简介部分 -->
        <div class="company-profile">
          <h2 class="section-title">公司简介 <img src="@/assets/image/companyProfileLogo.png" alt=""> </h2>
        </div>
        <!-- 动态渲染Markdown格式的公司简介 -->
        <div class="markdown-content" v-html="parsedMdData(reportData.industry)"></div>

        <!-- 如果没有Markdown数据，显示占位符 -->
        <div v-if="!parsedMdData(reportData.industry)" class="placeholder-text">
          公司简介内容加载中...
        </div>
        <!-- 动态渲染Markdown格式的公司简介 -->
        <div class="markdown-content" v-html="parsedMdData(reportData.companyProfile)"></div>

        <!-- 如果没有Markdown数据，显示占位符 -->
        <div v-if="!parsedMdData(reportData.companyProfile)" class="placeholder-text">
          公司简介内容加载中...
        </div>
        <!-- 页面底部信息 -->
        <!-- <div class="page-footer">
          <div class="footer-text">报告生成日期：2025/06/05</div>
          <div class="footer-watermark">内容由AI生成，仅供参考</div>
        </div> -->
        <!-- 第一部分标题 -->
        <div class="pageOne-content-header">
          <img src="@/assets/image/pageTitle1.png" alt="">
        </div>
        <div class="pageOne-content-header">
          <div class="content-header-card">
            <div class="rating-card">
              <div class="rating-upper">
                <span class="rating-grade">{{ reportData.dynamics }}</span>
                <div class="rating-stars">
                  <el-rate v-model="ratingValue" disabled show-score />
                </div>
                <div class="rating-status">选址可能性较高</div>
              </div>
              <div class="rating-below">
                <p style="font-size: 16px; font-weight: 600;">企业综合选址动力评级</p>
                <p style="margin-left: 10px;">选址动力范围为 D1~D10，评级越高，企业选址动力越强</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 01宏观动力 -->
        <div class="enterprise-dynamics-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle101.png" alt="">
          </div>
        </div>
        <!-- 动态渲染Markdown格式的宏观动力 -->
        <div class="markdown-content" v-html="parsedMdData(reportData.macroDimension)"></div>

        <!-- 如果没有Markdown数据，显示占位符 -->
        <div v-if="!parsedMdData(reportData.macroDimension)" class="placeholder-text">
          宏观动力内容加载中...
        </div>
        <!-- 02企业动态 -->
        <div class="enterprise-dynamics-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle102.png" alt="">
          </div>
        </div>
        <!-- 动态渲染Markdown格式的企业动态 -->
        <div class="markdown-content" v-html="parsedMdData(reportData.selfDimension)"></div>

        <!-- 如果没有Markdown数据，显示占位符 -->
        <div v-if="!parsedMdData(reportData.selfDimension)" class="placeholder-text">
          宏观动力内容加载中...
        </div>
        <!-- 03招引策略 -->
        <div class="enterprise-dynamics-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle103.png" alt="">
          </div>
        </div>
        <!-- 动态渲染Markdown格式的招引策略 -->
        <div class="markdown-content" v-html="parsedMdData(reportData.strategy)"></div>

        <!-- 如果没有Markdown数据，显示占位符 -->
        <div v-if="!parsedMdData(reportData.strategy)" class="placeholder-text">
          宏观动力内容加载中...
        </div>


        <!-- 第二部分标题 -->
        <div class="pageOne-content-header">
          <img src="@/assets/image/pageTitle2.png" alt="">
        </div>
        <div class="pageOne-content-header">
          <div class="content-header-card risk-analysis-card">
            <div class="rating-card">
              <div class="rating-upper">
                <span class="rating-grade risk-grade">{{ reportData.riskDate }}</span>
                <div class="rating-stars">
                  <div class="star-display">
                    <el-rate v-model="reportData.riskDate" disabled show-score />
                  </div>
                </div>
                <div class="rating-status risk-status">{{ reportData.riskDate }}</div>
              </div>
              <div class="rating-below">
                <p style="font-size: 16px; font-weight: 600;">企业综合风险评级</p>
                <p style="margin-left: 10px;">风险评级范围为 E1~E10，评级越高，企业投资风险越高</p>
              </div>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="related-enterprise-risk-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle201.png" alt="">
          </div>
        </div>
        <!-- 风险分析 -->
        <div class="risk-analysis-section">
          <!-- 企业司法、经营风险 -->
          <div class="legal-business-risk-section">
            <!-- 风险分析 -->
            <div class="risk-analysis-content">
              <div class="risk-item-header">【风险分析】</div>

              <div class="risk-warning-box">
                <p>企业共扫描出 <strong>{{ reportData.riskJusticeCount }}</strong> 个异常提醒，其中重要风险 <strong>{{
                  reportData.riskJusticeImportantCount }}</strong> 个。</p>
              </div>

            </div>
          </div>
        </div>
        <div class="risk-details">
          <h4 class="risk-detail-title">详情分析</h4>
        </div>
        <div class="markdown-content" v-html="parsedMdData(reportData.riskJustice)"></div>

        <div v-if="!parsedMdData(reportData.riskJustice)" class="placeholder-text">
          详情分析内容加载中...
        </div>
        <!-- 关联企业风险 -->
        <div class="related-enterprise-risk-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle202.png" alt="">
          </div>
        </div>
        <div class="related-enterprise-risk-section">
          <!-- 企业司法、经营风险 -->
          <div class="legal-business-risk-section">
            <!-- 风险分析 -->
            <div class="risk-analysis-content">
              <div class="risk-item-header">【风险分析】</div>
              <div class="risk-warning-box">
                <p>公司关联企业共有 <strong>{{ reportData.relatedCompanyCount }}</strong> 家，共扫描出 <strong>{{
                  reportData.relatedCompanyRiskCount }}</strong> 个风险提醒，其中重要风险有<strong>{{
                      reportData.relatedCompanyImportantRiskCount }}</strong>个</p>
              </div>
            </div>

          </div>
        </div>
        <div class="risk-details">
          <h4 class="risk-detail-title">详情分析</h4>
        </div>
        <div class="markdown-content" v-html="parsedMdData(reportData.riskRelatedJustice)"></div>

        <div v-if="!parsedMdData(reportData.riskRelatedJustice)" class="placeholder-text">
          详情分析内容加载中...
        </div>
        <!-- 财务及风险管理 -->
        <div class="financial-risk-management-section">
          <div class="section-header">
            <img style="margin-top: 25px;" src="@/assets/image/pageTitle203.png" alt="">
          </div>
        </div>
        <div class="markdown-content" v-html="parsedMdData(reportData.riskFinancial)"></div>

        <div v-if="!parsedMdData(reportData.riskFinancial)" class="placeholder-text">
          财务及风险管理内容加载中...
        </div>
        <!-- 行业及竞争风险 -->
        <div class="industry-competitive-risk-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle204.png" alt="">
          </div>
        </div>
        <div class="markdown-content" v-html="parsedMdData(reportData.riskIndustryPolicy)"></div>

        <div v-if="!parsedMdData(reportData.riskIndustryPolicy)" class="placeholder-text">
          行业及竞争风险计内容加载中...
        </div>
        <!-- 第三部分 -->
        <div class="pageOne-content-header">
          <img src="@/assets/image/pageTitle3.png" alt="">
        </div>
        <div class="markdown-content" v-html="parsedMdData(reportData.componetsReport1)"></div>

        <div v-if="!parsedMdData(reportData.componetsReport1)" class="placeholder-text">
          内容加载中...
        </div>
        <div class="markdown-content" v-html="parsedMdData(reportData.componetsReport2)"></div>

        <div v-if="!parsedMdData(reportData.componetsReport2)" class="placeholder-text">
          内容加载中...
        </div>
      </div>
    </div>

    <!-- 报告封底 -->
    <div class="report-page cover-page">
      <img src="@/assets/image/reportCover0.png" alt="">
    </div>

  </div>
</template>

<script setup lang="ts" name="reportDetail">
import { reactive, onMounted, ref, nextTick, computed, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useReportApi } from '@/api/report/index';
import { mockReportData, mockApiCall } from '@/mock/reportData';
import type { ReportData } from '@/types/report';
import MarkdownIt from 'markdown-it';

// 初始化Markdown解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
});

// 获取路由参数
const route = useRoute();
const reportId = route.params.id as string;
const ratingValue = ref(4.5); // 添加评分值


// 自动分页开关(根据地址栏是否有enableAutoPaging参数)
const enableAutoPaging = ref(route.query.enableAutoPaging ? route.query.enableAutoPaging == '1' : false); // 默认关闭自动分页

// 报告数据
const reportData = reactive<ReportData>({
  star: 0,
  information: {
    name: '',
    tags: [],
    legalRepresentative: '',
    registeredAddress: '',
  },
  analysis: {
    enterpriseScale: '',
    investmentPotential: '',
    riskRating: '',
  },
  industryTrend: {
    background: {
      description: '',
      newEnergyEquipment: [],
      commercialAerospace: []
    },
    impact: []
  },
  policyImpact: {
    overallImpact: {
      marketOpportunity: [],
      technicalInnovation: [],
      costActual: []
    }
  },
  enterpriseDynamics: {
    marketExpansion: {
      description: '',
      keyMatters: []
    },
    capitalOperation: {
      description: ''
    },
    marketPenetration: []
  },
  governmentInspection: {
    overallOperation: [],
    policyImplementation: []
  },
  supplyChain: {
    introduction: '',
    customerExpansion: [],
    coordinationOptimization: []
  },
  riskAnalysis: {
    warningCount: 0,
    importantRiskCount: 0,
    analysisDescription: '',
    riskList: [],
    riskTableData: [],
    relatedRiskTableData: [],
    relatedWarningCount: 0,
    relatedImportantRiskCount: 0,
    relatedAnalysisDescription: '',
    relatedRiskList: []
  },
  financialRiskManagement: {
    riskDesignTitle: '',
    certaintyLocation: {
      title: '',
      probability: '',
      customerTypeSupport: {
        title: '',
        items: []
      }
    }
  },
  industryCompetitiveRisk: {
    riskDesignTitle: '',
    establishmentInfo: {
      establishmentTime: '',
      teamComposition: '',
      businessPositioning: ''
    },
    levelOneRiskTitle: '',
    certaintyLocationExpansion: {
      title: '',
      probability: '',
      customerCapacityExpansion: {
        title: '',
        items: []
      }
    }
  },
  investmentRegionalPreference: {
    title: '',
    groups: []
  },
  ratingInfo: {
    ratingValue: 0,
    riskRatingValue: 0,
    comprehensiveRating: '',
    comprehensiveRatingDescription: ''
  },
  metadata: {
    generationDate: '',
    watermark: ''
  },
  componetsReport2: "",
  componetsReport1: "",
  riskDate: "",
  industry: "",
  companyProfile: "",
  dynamics: "",
  macroDimension: "",
  selfDimension: "",
  strategy: "",
  riskJustice: "",
  riskRelatedJustice: "",
  riskFinancial: "",
  riskIndustryPolicy: "",
  companyStarRating: "",
});

// 评分分值除以2
const ratingValueComputed = computed(() => {
  return reportData.companyStarRating / 2;
});

// 根据dynamics值计算投资选址概率描述
const investmentPotentialText = computed(() => {
  const dynamicsValue = reportData.dynamics;
  if (!dynamicsValue) return '投资可能性高';

  // 提取数字部分，如 "D7" -> 7
  const match = dynamicsValue.match(/D(\d+)/i);
  if (!match) return '投资可能性高';

  const level = parseInt(match[1]);

  if (level >= 1 && level <= 5) {
    return '近期投资选址概率较低';
  } else if (level >= 6 && level <= 8) {
    return '近期投资选址概率较高';
  } else if (level >= 9 && level <= 10) {
    return '近期投资选址概率高';
  }

  return '投资可能性高';
});

// 根据riskDate值计算风险等级描述
const riskRatingText = computed(() => {
  const riskValue = reportData.riskDate;
  if (!riskValue) return '低风险';

  // 提取数字部分，如 "E3" -> 3
  const match = riskValue.match(/E(\d+)/i);
  if (!match) return '低风险';

  const level = parseInt(match[1]);

  if (level >= 1 && level <= 5) {
    return '低风险';
  } else if (level >= 6 && level <= 8) {
    return '中风险';
  } else if (level >= 9 && level <= 10) {
    return '高风险';
  }

  return '低风险';
});

// 根据风险等级计算CSS类名
const riskStatusClass = computed(() => {
  const riskValue = reportData.riskDate;
  if (!riskValue) return 'success';

  const match = riskValue.match(/E(\d+)/i);
  if (!match) return 'success';

  const level = parseInt(match[1]);

  if (level >= 1 && level <= 5) {
    return 'success'; // 绿色 - 低风险
  } else if (level >= 6 && level <= 8) {
    return 'warning'; // 黄色 - 中风险
  } else if (level >= 9 && level <= 10) {
    return 'danger'; // 红色 - 高风险
  }

  return 'success';
});

// 根据选址动力计算CSS类名
const investmentPotentialClass = computed(() => {
  const dynamicsValue = reportData.dynamics;
  if (!dynamicsValue) return 'success';

  // 提取数字部分，如 "D7" -> 7
  const match = dynamicsValue.match(/D(\d+)/i);
  if (!match) return 'success';

  const level = parseInt(match[1]);

  if (level >= 1 && level <= 5) {
    return 'danger'; // 红色 - 投资可能性低
  } else if (level >= 6 && level <= 8) {
    return 'warning'; // 黄色 - 投资可能性中等
  } else if (level >= 9 && level <= 10) {
    return 'success'; // 绿色 - 投资可能性高
  }

  return 'success';
});


// 风险表格数据 - 现在从API获取
const riskTableData = ref(reportData.riskAnalysis.riskTableData);
const relatedRiskTableData = ref(reportData.riskAnalysis.relatedRiskTableData);

// API实例
const reportApi = useReportApi();

// 页面高度设置（mm转px，大约1mm = 3.78px）
const PAGE_HEIGHT = 297 * 3.78; // A4页面高度
const HEADER_HEIGHT = 100; // 增加页头高度估算
const FOOTER_HEIGHT = 60; // 页脚高度
const CONTENT_MAX_HEIGHT = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT; // 减去页头和页脚

// 动态页面数组
const dynamicPages = ref<string[]>([]);
const contentSections = ref<HTMLElement[]>([]);
const contentPages = ref<string[]>([]);

// ========== 共用工具函数 ==========

// 简单标题判断函数 - 用于识别需要合并的子标题
const isSimpleTitle = (element: HTMLElement): boolean => {
  // 检查是否是章节标题但不是强制分页的大标题
  const titleClasses = [
    'enterprise-dynamics-section',
    'financial-risk-management-section',
    'industry-competitive-risk-section',
    'related-enterprise-risk-section'
  ];

  const hasSimpleTitleClass = titleClasses.some(className => element.classList.contains(className));

  // 检查是否包含子标题图片（需要合并的标题）
  const hasSubTitleImg = element.querySelector('img[src*="pageTitle101"]') !== null ||
    element.querySelector('img[src*="pageTitle102"]') !== null ||
    element.querySelector('img[src*="pageTitle103"]') !== null ||
    element.querySelector('img[src*="pageTitle201"]') !== null ||
    element.querySelector('img[src*="pageTitle202"]') !== null ||
    element.querySelector('img[src*="pageTitle203"]') !== null ||
    element.querySelector('img[src*="pageTitle204"]') !== null;

  // 是章节标题且包含子标题图片，但不是强制分页的大标题
  return hasSimpleTitleClass && hasSubTitleImg && !isPageBreakTitle(element);
};

// 🆕 更激进的页面优化函数 - 提高页面利用率
const optimizePagesAggressive = (pages: string[]): string[] => {
  const optimized: string[] = [];
  const MIN_PAGE_CONTENT_HEIGHT = CONTENT_MAX_HEIGHT * 0.2; // 降低最小内容要求到20%
  const MAX_MERGE_HEIGHT = CONTENT_MAX_HEIGHT * 0.98; // 允许合并到98%

  console.log(`🚀 开始激进页面优化，最小内容高度: ${MIN_PAGE_CONTENT_HEIGHT}px，最大合并高度: ${MAX_MERGE_HEIGHT}px`);

  for (let i = 0; i < pages.length; i++) {
    const currentPage = pages[i];

    // 创建临时元素来测算页面高度
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentPage;
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = '210mm';
    document.body.appendChild(tempDiv);

    const pageHeight = getElementHeight(tempDiv);
    document.body.removeChild(tempDiv);

    console.log(`📊 激进优化 - 页面 ${i + 1} 高度评估: ${pageHeight}px`);

    // 更激进的合并策略 - 尝试合并多个页面
    if (pageHeight < MIN_PAGE_CONTENT_HEIGHT && i < pages.length - 1) {
      let mergedContent = currentPage;
      let mergedHeight = pageHeight;
      let nextIndex = i + 1;
      let mergedCount = 1;

      // 尝试合并多个连续的页面
      while (nextIndex < pages.length && mergedCount < 3) { // 最多合并3个页面
        const nextPage = pages[nextIndex];

        // 测试合并效果
        const testDiv = document.createElement('div');
        testDiv.innerHTML = mergedContent + nextPage;
        testDiv.style.position = 'absolute';
        testDiv.style.visibility = 'hidden';
        testDiv.style.width = '210mm';
        document.body.appendChild(testDiv);

        const testHeight = getElementHeight(testDiv);
        document.body.removeChild(testDiv);

        if (testHeight <= MAX_MERGE_HEIGHT) {
          mergedContent += nextPage;
          mergedHeight = testHeight;
          nextIndex++;
          mergedCount++;
          console.log(`🔄 激进合并：成功合并第 ${nextIndex} 页，新高度: ${mergedHeight}px`);
        } else {
          console.log(`⚠️ 激进合并：合并第 ${nextIndex} 页会超出限制 (${testHeight}px > ${MAX_MERGE_HEIGHT}px)`);
          break;
        }
      }

      optimized.push(mergedContent);
      i = nextIndex - 1; // 跳过已合并的页面
      console.log(`✅ 激进合并完成：合并了 ${mergedCount} 个页面，最终高度: ${mergedHeight}px`);
    }
    // 对于接近最大高度但未超出的页面，检查是否可以添加下一页的部分内容
    else if (pageHeight >= CONTENT_MAX_HEIGHT * 0.6 && pageHeight < CONTENT_MAX_HEIGHT * 0.8 && i < pages.length - 1) {
      const nextPage = pages[i + 1];

      // 尝试提取下一页的前几个元素
      const nextDiv = document.createElement('div');
      nextDiv.innerHTML = nextPage;
      const nextElements = Array.from(nextDiv.children);

      if (nextElements.length > 1) {
        // 尝试添加下一页的第一个元素
        const firstElement = nextElements[0] as HTMLElement;
        const firstElementHeight = getElementHeight(firstElement);

        if (pageHeight + firstElementHeight <= MAX_MERGE_HEIGHT) {
          const enhancedPage = currentPage + firstElement.outerHTML;

          // 更新下一页内容（移除已合并的元素）
          const remainingElements = nextElements.slice(1);
          if (remainingElements.length > 0) {
            pages[i + 1] = remainingElements.map(el => (el as HTMLElement).outerHTML).join('');
          } else {
            // 如果下一页没有剩余内容，标记为删除
            pages.splice(i + 1, 1);
          }

          optimized.push(enhancedPage);
          console.log(`✨ 跨页优化：成功添加下一页首个元素，高度增加: ${firstElementHeight}px`);
        } else {
          optimized.push(currentPage);
        }
      } else {
        optimized.push(currentPage);
      }
    } else {
      optimized.push(currentPage);
    }
  }

  console.log(`🎉 激进页面优化完成：${pages.length} -> ${optimized.length} 页，压缩率: ${(((pages.length - optimized.length) / pages.length) * 100).toFixed(1)}%`);
  return optimized;
};

// 页面优化函数 - 合并过空的页面
const optimizePages = (pages: string[]): string[] => {
  const optimized: string[] = [];
  const MIN_PAGE_CONTENT_HEIGHT = CONTENT_MAX_HEIGHT * 0.3;

  for (let i = 0; i < pages.length; i++) {
    const currentPage = pages[i];

    // 创建临时元素来测算页面高度
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentPage;
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = '210mm';
    document.body.appendChild(tempDiv);

    const pageHeight = getElementHeight(tempDiv);
    document.body.removeChild(tempDiv);

    console.log(`📊 页面 ${i + 1} 高度评估: ${pageHeight}px`);

    // 如果页面内容过少且不是最后一页，尝试与下一页合并
    if (pageHeight < MIN_PAGE_CONTENT_HEIGHT && i < pages.length - 1) {
      const nextPage = pages[i + 1];

      // 创建合并后的页面测试
      const mergedDiv = document.createElement('div');
      mergedDiv.innerHTML = currentPage + nextPage;
      mergedDiv.style.position = 'absolute';
      mergedDiv.style.visibility = 'hidden';
      mergedDiv.style.width = '210mm';
      document.body.appendChild(mergedDiv);

      const mergedHeight = getElementHeight(mergedDiv);
      document.body.removeChild(mergedDiv);

      // 如果合并后不超过限制，则合并
      if (mergedHeight <= CONTENT_MAX_HEIGHT * 0.95) {
        console.log(`🔄 合并页面 ${i + 1} 和 ${i + 2}，合并后高度: ${mergedHeight}px`);
        optimized.push(currentPage + nextPage);
        i++; // 跳过下一页
      } else {
        optimized.push(currentPage);
      }
    } else {
      optimized.push(currentPage);
    }
  }

  console.log(`✨ 页面优化完成：${pages.length} -> ${optimized.length} 页`);
  return optimized;
};

// 强制分页判断 - 修复第三部分标题识别问题
const isPageBreakTitle = (element: HTMLElement): boolean => {
  // 1. 检查是否有特定的强制分页类名
  const pageBreakClasses = ['pageOne-content-header'];
  if (pageBreakClasses.some(className => element.classList.contains(className))) {
    return true;
  }

  // 2. 更精确地检查图片 - 包括第三部分标题
  const majorPageTitleImages = [
    'pageTitle1.png',      // 第一部分标题
    'pageTitle2.png',      // 第二部分标题  
    'pageTitle3.png'       // 第三部分标题 - 添加这个
  ];

  const img = element.querySelector('img[src]') as HTMLImageElement;
  if (img && img.src) {
    // 检查是否是主要页面标题图片
    const isMainTitle = majorPageTitleImages.some(imageName => img.src.includes(imageName));

    // 排除子标题图片（包含数字编号的子标题）
    const isSubTitle = /pageTitle\d{3}\.png/.test(img.src);

    return isMainTitle && !isSubTitle;
  }

  return false;
};

// markdown容器识别
const isMarkdownContainer = (element: HTMLElement): boolean => {
  return element.classList.contains('markdown-content');
};

// 逻辑分组判断
const isGroupStart = (element: HTMLElement): boolean => {
  if (element.tagName.match(/^H[1-6]$/)) return true;

  if (element.tagName === 'P') {
    const textContent = element.textContent || '';
    const innerHTML = element.innerHTML || '';

    // 各种标题格式判断
    if (/^\*\*\d+、[^*]+\*\*/.test(textContent)) return true;
    if (/^\*\*（\d+）[^*]+\*\*/.test(textContent)) return true;

    const strongElement = element.querySelector('strong');
    if (strongElement && strongElement.textContent &&
      !strongElement.textContent.includes('：') &&
      element.children.length === 1) return true;

    if (innerHTML.includes('<br>') && innerHTML.startsWith('<strong>')) {
      const firstLine = innerHTML.split('<br>')[0];
      if (firstLine.includes('**') && /\d+/.test(firstLine)) return true;
    }

    if (/^\*\*[^*]+\*\*$/.test(textContent.trim())) return true;
  }

  return false;
};

// 强制分组判断 - 添加缺失的函数
const shouldForceGroup = (element: HTMLElement): boolean => {
  // 检查是否是需要强制分组的元素
  if (element.tagName.match(/^H[1-4]$/)) return true;

  const textContent = element.textContent || '';

  // 检查是否是主要标题格式
  if (/^\*\*\d+、[^*]+\*\*$/.test(textContent.trim())) return true;
  if (/^#+ /.test(textContent)) return true;

  // 检查是否包含分割线标识
  if (textContent.includes('---') || textContent.includes('===')) return true;

  return false;
};

// 子标题判断
const isSubtitle = (element: HTMLElement): boolean => {
  if (element.tagName === 'P') {
    const textContent = element.textContent || '';
    const innerHTML = element.innerHTML || '';

    if (/^\*\*（\d+）[^*]+\*\*：/.test(textContent)) return true;

    if (innerHTML.includes('<br>') && innerHTML.includes('**（')) {
      const lines = innerHTML.split('<br>');
      return lines.some(line => /^\*\*（\d+）[^*]+\*\*：/.test(line.replace(/<[^>]*>/g, '')));
    }
  }
  return false;
};

// 元素高度估算 - 优化为更准确的估算
const getElementHeight = (element: HTMLElement): number => {
  // 首先尝试获取实际高度
  if (element.offsetHeight > 0) {
    return element.offsetHeight + 10; // 增加一些边距容忍度
  }

  // 如果元素还没有渲染，进行更精确的估算
  const textContent = element.textContent || '';
  const innerHTML = element.innerHTML || '';

  let estimatedHeight = 0;

  // 根据标签类型进行不同的高度估算
  if (element.tagName === 'H1') {
    estimatedHeight = 40;
  } else if (element.tagName === 'H2') {
    estimatedHeight = 35;
  } else if (element.tagName === 'H3') {
    estimatedHeight = 30;
  } else if (element.tagName === 'H4') {
    estimatedHeight = 25;
  } else if (element.tagName === 'P') {
    // 段落高度估算 - 考虑换行
    const averageCharsPerLine = 50; // 根据实际字体大小调整
    const lineHeight = 24; // 行高
    const lines = Math.max(1, Math.ceil(textContent.length / averageCharsPerLine));
    estimatedHeight = lines * lineHeight + 10; // 增加段落间距
  } else if (element.tagName === 'UL' || element.tagName === 'OL') {
    const listItems = element.querySelectorAll('li');
    // 每个列表项估算30px高度
    estimatedHeight = listItems.length * 30 + 20; // 增加列表容器边距
  } else if (element.tagName === 'DIV') {
    // DIV容器 - 基于子元素估算
    if (element.classList.contains('markdown-content')) {
      // Markdown内容特殊处理
      const childElements = Array.from(element.children) as HTMLElement[];
      estimatedHeight = childElements.reduce((total, child) => {
        return total + getElementHeight(child);
      }, 0) + 20; // 增加容器边距
    } else if (element.classList.contains('company-analysis-container')) {
      estimatedHeight = 300; // 公司分析容器固定高度
    } else if (element.classList.contains('pageOne-content-header')) {
      estimatedHeight = 180; // 页面标题头部固定高度
    } else if (element.classList.contains('section-header')) {
      estimatedHeight = 80; // 章节标题固定高度
    } else {
      // 通用DIV - 基于内容长度估算
      const averageCharsPerLine = 60;
      const lineHeight = 20;
      const lines = Math.ceil(textContent.length / averageCharsPerLine);
      estimatedHeight = Math.max(30, lines * lineHeight + 15);
    }
  } else {
    // 其他元素的默认估算
    const averageCharsPerLine = 60;
    const lineHeight = 20;
    const lines = Math.ceil(textContent.length / averageCharsPerLine);
    estimatedHeight = Math.max(25, lines * lineHeight + 10);
  }

  // 处理特殊样式调整
  if (innerHTML.includes('<strong>')) {
    estimatedHeight += 5; // 粗体文本增加高度
  }
  if (innerHTML.includes('<br>')) {
    const brCount = (innerHTML.match(/<br>/g) || []).length;
    estimatedHeight += brCount * 20; // 每个换行增加20px
  }
  if (innerHTML.includes('<img')) {
    estimatedHeight += 100; // 图片预估高度
  }

  return Math.max(estimatedHeight, 25); // 最小高度25px
};

// 尝试将块合并到页面的辅助函数 - 更严格的高度控制
const tryMergeBlocksToPage = (blocks: HTMLElement[], maxHeight: number, titleHeight: number = 0): { pages: HTMLElement[][], remainingBlocks: HTMLElement[] } => {
  const pages: HTMLElement[][] = [];
  let currentPage: HTMLElement[] = [];
  let currentPageHeight = titleHeight;
  let remainingBlocks: HTMLElement[] = [];

  console.log(`🔄 尝试合并 ${blocks.length} 个块到页面，最大高度: ${maxHeight}px，标题高度: ${titleHeight}px`);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHeight = getElementHeight(block);

    console.log(`📦 处理块 ${i + 1}/${blocks.length}，高度: ${blockHeight}px，当前页面高度: ${currentPageHeight}px`);

    // 更严格的高度检查 - 减少安全边距
    const safetyMargin = 50; // 安全边距
    if (currentPageHeight + blockHeight + safetyMargin <= maxHeight) {
      currentPage.push(block);
      currentPageHeight += blockHeight;
      console.log(`✅ 块已添加到当前页面，新高度: ${currentPageHeight}px`);
    } else {
      // 如果当前页面有内容，保存它
      if (currentPage.length > 0) {
        pages.push([...currentPage]);
        console.log(`💾 保存页面，包含 ${currentPage.length} 个块，总高度: ${currentPageHeight}px`);
      }

      // 检查单个块是否超过页面限制
      if (blockHeight + titleHeight + safetyMargin <= maxHeight) {
        // 开始新页面
        currentPage = [block];
        currentPageHeight = titleHeight + blockHeight;
        console.log(`🆕 开始新页面，高度: ${currentPageHeight}px`);
      } else {
        // 块太大，添加到剩余块中进行进一步处理
        remainingBlocks.push(block);
        console.log(`⚠️ 块太大，添加到剩余块中: ${blockHeight}px`);
      }
    }
  }

  // 保存最后一页
  if (currentPage.length > 0) {
    pages.push([...currentPage]);
    console.log(`💾 保存最后一页，包含 ${currentPage.length} 个块，总高度: ${currentPageHeight}px`);
  }

  console.log(`✨ 合并完成：生成 ${pages.length} 个页面，剩余 ${remainingBlocks.length} 个块`);

  return { pages, remainingBlocks };
};

// 拆分markdown-content内部元素的共用函数 - 优化合并逻辑
const splitMarkdownContent = (markdownElement: HTMLElement): HTMLElement[] => {
  console.log('📝 开始拆分 markdown-content 元素', markdownElement);

  const chunks: HTMLElement[] = [];
  const children = Array.from(markdownElement.children) as HTMLElement[];
  let currentChunk: HTMLElement[] = [];
  let currentChunkHeight = 0;
  const maxChunkHeight = CONTENT_MAX_HEIGHT * 0.6; // 降低块大小以避免超出

  console.log(`📏 Markdown 拆分参数: 子元素数=${children.length}, 最大块高度=${maxChunkHeight}px`);

  children.forEach((child, index) => {
    const childHeight = getElementHeight(child);

    console.log(`📖 处理 markdown 子元素 ${index + 1}/${children.length}:`, {
      tagName: child.tagName,
      textPreview: (child.textContent || '').substring(0, 50) + '...',
      estimatedHeight: childHeight,
      currentChunkHeight,
      isGroupStart: isGroupStart(child),
      isSubtitle: isSubtitle(child),
      shouldForceGroup: shouldForceGroup(child)
    });

    const isMainGroupStart = isGroupStart(child) && !isSubtitle(child);
    const hasEnoughContent = currentChunk.length >= 1; // 降低最小内容要求
    const isForceGroup = shouldForceGroup(child);

    // 如果单个元素就超过最大高度，强制创建独立块
    if (childHeight > maxChunkHeight) {
      console.log(`⚠️ 单个元素过大，创建独立块: ${childHeight}px`);

      // 先保存当前块（如果有内容）
      if (currentChunk.length > 0) {
        const chunkElement = markdownElement.cloneNode(false) as HTMLElement;
        currentChunk.forEach(item => chunkElement.appendChild(item.cloneNode(true)));
        chunks.push(chunkElement);
      }

      // 为超大元素创建独立块
      const chunkElement = markdownElement.cloneNode(false) as HTMLElement;
      chunkElement.appendChild(child.cloneNode(true));
      chunks.push(chunkElement);

      // 重置当前块
      currentChunk = [];
      currentChunkHeight = 0;
      return;
    }

    // 强制分组处理
    if (isForceGroup && currentChunk.length > 0 && hasEnoughContent) {
      console.log(`🔄 遇到强制分组标题，保存当前块 (${currentChunk.length} 个元素)`);

      const chunkElement = markdownElement.cloneNode(false) as HTMLElement;
      currentChunk.forEach(item => chunkElement.appendChild(item.cloneNode(true)));
      chunks.push(chunkElement);

      currentChunk = [child];
      currentChunkHeight = childHeight;
    }
    // 高度超限处理 - 降低容忍度
    else if (currentChunkHeight + childHeight > maxChunkHeight && currentChunk.length >= 1) {
      console.log(`📄 高度超限，保存当前块并开始新块 (${currentChunkHeight + childHeight}px > ${maxChunkHeight}px)`);

      const chunkElement = markdownElement.cloneNode(false) as HTMLElement;
      currentChunk.forEach(item => chunkElement.appendChild(item.cloneNode(true)));
      chunks.push(chunkElement);

      currentChunk = [child];
      currentChunkHeight = childHeight;
    }
    // 添加到当前块
    else {
      console.log(`➕ 添加到当前块`);
      currentChunk.push(child);
      currentChunkHeight += childHeight;
    }
  });

  // 添加最后一个块
  if (currentChunk.length > 0) {
    console.log(`💾 保存最后一个 markdown 块 (${currentChunk.length} 个元素)`);
    const chunkElement = markdownElement.cloneNode(false) as HTMLElement;
    currentChunk.forEach(item => chunkElement.appendChild(item.cloneNode(true)));
    chunks.push(chunkElement);
  }

  // 内容检查 - 如果只有很少内容，直接返回原始元素
  if (chunks.length === 0 || (chunks.length === 1 && children.length <= 2)) {
    console.log(`⚠️ 内容较少或未能有效拆分，返回原始元素`);
    return [markdownElement.cloneNode(true) as HTMLElement];
  }

  console.log(`✅ Markdown 拆分完成，生成 ${chunks.length} 个块`);
  return chunks;
};

// 创建页面HTML
const createPageHTML = (sections: HTMLElement[]): string => {
  return sections.map(section => section.outerHTML).join('');
};

// 分割大的section
const splitLargeSection = (section: HTMLElement): string[] => {
  const pages: string[] = [];
  const subsections = Array.from(section.children) as HTMLElement[];

  // 识别标题元素的函数
  const isTitleElement = (element: HTMLElement): boolean => {
    const titleClasses = [
      'section-header',
      'pageOne-content-header',
      'enterprise-dynamics-section',
      'section-title',
      'analysis-title',
      'industry-title',
      'dynamics-subtitle',
      'risk-item-header',
      'table-header'
    ];

    const hasClassMatch = titleClasses.some(className => element.classList.contains(className));
    const hasTagMatch = Boolean(element.tagName.match(/^H[1-6]$/));
    const hasPageTitleImg = element.querySelector('img[src*="pageTitle"]') !== null;
    const hasPageOneImg = element.querySelector('img[src*="pageOne"]') !== null;

    return hasClassMatch || hasTagMatch || hasPageTitleImg || hasPageOneImg;
  };

  // 获取section的标题部分（可能包含多个连续的标题元素）
  const getTitleElements = (): HTMLElement[] => {
    const titleElements: HTMLElement[] = [];

    for (let i = 0; i < subsections.length; i++) {
      const element = subsections[i];

      // 如果是标题元素，或者是紧跟在标题后面的相关元素
      if (isTitleElement(element)) {
        titleElements.push(element);
      } else if (titleElements.length > 0) {
        // 检查是否是标题的配套元素（如图片、评级卡片等）
        const isRelatedToTitle = element.classList.contains('content-header-card') ||
          element.classList.contains('rating-card') ||
          (element.tagName === 'IMG' && titleElements.length === 1);

        if (isRelatedToTitle) {
          titleElements.push(element);
        } else {
          // 遇到非相关元素，停止收集标题
          break;
        }
      } else {
        // 如果第一个元素不是标题，可能整个section都是内容
        break;
      }
    }

    return titleElements;
  };

  const titleElements = getTitleElements();
  let currentPageContent: HTMLElement[] = [];
  let currentPageHeight = 0;

  // 计算标题元素的总高度
  const titleHeight = titleElements.reduce((height, element) => height + getElementHeight(element), 0);

  // 如果有标题，先添加到当前页面
  if (titleElements.length > 0) {
    currentPageContent.push(...titleElements.map(el => el.cloneNode(true) as HTMLElement));
    currentPageHeight += titleHeight;
  }

  // 处理剩余的内容元素
  const contentElements = subsections.slice(titleElements.length);

  contentElements.forEach((subsection, index) => {
    const subsectionHeight = getElementHeight(subsection);

    // 检查是否是超大元素需要内部分页
    if (subsectionHeight > CONTENT_MAX_HEIGHT - titleHeight) {
      // 先保存当前页面内容（如果有的话）
      if (currentPageContent.length > 0) {
        console.log(`💾 保存当前页面 ${pageNumber}，包含 ${currentPageContent.length} 个元素`);
        pages.push(createPageHTML(currentPageContent));
        pageNumber++;
      }

      // 对大section进行内部分页
      console.log(`🔀 开始内部分页处理`);
      const subPages = splitLargeSection(subsection);
      console.log(`📄 内部分页生成了 ${subPages.length} 个子页面`);

      if (subPages.length > 0) {
        pages.push(...subPages);
        pageNumber += subPages.length;
      } else {
        // 如果分页失败，将原元素添加为新页面
        console.log(`⚠️ 内部分页失败，原样添加`);
        pages.push(subsection.outerHTML);
        pageNumber++;
      }

      // 重置当前页面状态
      currentPageContent = titleElements.map(el => el.cloneNode(true) as HTMLElement);
      currentPageHeight = titleHeight;
    }
    // 🆕 智能预填充策略 - 尝试向前看更多元素进行批量合并
    else if (isSimpleTitle(subsection) && i < subsections.length - 1) {
      console.log(`🔍 发现简单标题，启动智能预填充策略`);

      // 扩大向前看的范围和合并阈值
      const nextElements: HTMLElement[] = [];
      let totalHeight = subsectionHeight;
      let nextIndex = i + 1;
      const maxLookAhead = 5; // 增加向前看的元素数量

      // 更积极的合并策略
      while (nextIndex < subsections.length &&
        nextIndex - i <= maxLookAhead &&
        totalHeight < CONTENT_MAX_HEIGHT * 0.85) { // 提高合并阈值
        const nextElement = subsections[nextIndex];
        const nextHeight = getElementHeight(nextElement);

        // 只在遇到强制分页标题时停止合并
        if (isPageBreakTitle && isPageBreakTitle(nextElement)) {
          break;
        }

        // 更宽松的合并条件
        if (currentPageHeight + totalHeight + nextHeight <= CONTENT_MAX_HEIGHT * 0.92) {
          nextElements.push(nextElement);
          totalHeight += nextHeight;
          nextIndex++;
        } else {
          break;
        }
      }

      console.log(`📦 智能预填充：合并标题和 ${nextElements.length} 个后续元素，总高度: ${totalHeight}px`);

      // 检查是否能合并到当前页面
      if (currentPageHeight + totalHeight <= CONTENT_MAX_HEIGHT * 0.92) {
        // 合并到当前页面
        currentPageContent.push(subsection.cloneNode(true) as HTMLElement);
        nextElements.forEach(el => {
          currentPageContent.push(el.cloneNode(true) as HTMLElement);
        });
        currentPageHeight += totalHeight;
        i = nextIndex - 1; // 跳过已处理的元素
        console.log(`✅ 智能预填充成功，新高度: ${currentPageHeight}px`);
      } else {
        // 保存当前页面，开始新页面
        if (currentPageContent.length > 0) {
          pages.push(createPageHTML(currentPageContent));
          pageNumber++;
        }

        currentPageContent = [subsection.cloneNode(true) as HTMLElement];
        nextElements.forEach(el => {
          currentPageContent.push(el.cloneNode(true) as HTMLElement);
        });
        currentPageHeight = totalHeight;
        i = nextIndex - 1; // 跳过已处理的元素
        console.log(`🆕 开始新页面并批量合并内容，高度: ${currentPageHeight}px`);
      }
    }
    // 添加到当前页面
    else {
      console.log(`➕ 添加到当前页面，新高度: ${currentPageHeight + subsectionHeight}px`);
      currentPageContent.push(subsection.cloneNode(true) as HTMLElement);
      currentPageHeight += subsectionHeight;
    }
  });

  // 添加最后一页
  if (currentPageContent.length > titleElements.length) {
    const sectionClone = section.cloneNode(false) as HTMLElement;
    currentPageContent.forEach(child => {
      sectionClone.appendChild(child);
    });
    pages.push(sectionClone.outerHTML);
  }

  return pages;
};

// 主分页函数 - 基于剩余高度的细粒度智能分页
const createDynamicPages = () => {
  nextTick(() => {
    console.log('\n🚀 开始创建细粒度智能分页');

    const contentContainer = document.querySelector('.report-pageOne-content');
    if (!contentContainer) {
      console.error('❌ 未找到内容容器');
      return;
    }

    const sections = Array.from(contentContainer.children) as HTMLElement[];
    console.log(`📋 总共找到 ${sections.length} 个章节元素`);

    const pages: string[] = [];
    let currentPageContent: HTMLElement[] = [];
    let currentPageHeight = 0;
    let pageNumber = 1;

    // 页面高度参数
    const MAX_PAGE_HEIGHT = CONTENT_MAX_HEIGHT * 0.95; // 95%利用率
    const MIN_REMAINING_HEIGHT = CONTENT_MAX_HEIGHT * 0.05; // 最小剩余高度5%

    console.log(`📏 细粒度分页参数:`);
    console.log(`   页面最大高度: ${MAX_PAGE_HEIGHT}px (95%)`);
    console.log(`   最小剩余高度: ${MIN_REMAINING_HEIGHT}px (5%)`);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionHeight = getElementHeight(section);
      const remainingHeight = MAX_PAGE_HEIGHT - currentPageHeight;

      console.log(`\n📖 处理第 ${i + 1} 个元素:`, {
        className: section.className || '无class',
        tagName: section.tagName,
        elementHeight: sectionHeight,
        currentPageHeight,
        remainingHeight,
        isMarkdown: isMarkdownContainer(section)
      });

      // 🆕 核心逻辑：细粒度处理
      if (sectionHeight <= remainingHeight) {
        // 能完全放入当前页面
        console.log(`✅ 元素可以完全放入当前页面`);
        currentPageContent.push(section.cloneNode(true) as HTMLElement);
        currentPageHeight += sectionHeight;
      } else {
        // 需要拆分处理
        console.log(`🔀 元素超出剩余空间，开始细粒度拆分`);

        if (isMarkdownContainer(section)) {
          // 🆕 Markdown内容细粒度拆分
          const splitResult = splitMarkdownFinegrained(section, remainingHeight, MAX_PAGE_HEIGHT);

          if (splitResult.currentPagePart && splitResult.currentPagePart.children.length > 0) {
            // 有内容可以放在当前页
            currentPageContent.push(splitResult.currentPagePart);
            currentPageHeight += getElementHeight(splitResult.currentPagePart);
            console.log(`✅ 添加部分markdown内容到当前页，新高度: ${currentPageHeight}px`);

            // 保存当前页面
            pages.push(createPageHTML(currentPageContent));
            console.log(`💾 保存页面 ${pageNumber}，高度: ${currentPageHeight}px`);
            pageNumber++;

            // 处理剩余内容 - 按页面容量继续分配
            if (splitResult.remainingParts && splitResult.remainingParts.length > 0) {
              const remainingPages = distributeRemainingContent(splitResult.remainingParts, MAX_PAGE_HEIGHT);
              pages.push(...remainingPages);
              pageNumber += remainingPages.length;
              console.log(`📄 剩余内容分配到 ${remainingPages.length} 个页面`);

              currentPageContent = [];
              currentPageHeight = 0;
            } else {
              currentPageContent = [];
              currentPageHeight = 0;
            }
          } else {
            // 当前页面剩余空间太少，整体移到下一页
            if (currentPageContent.length > 0) {
              pages.push(createPageHTML(currentPageContent));
              console.log(`💾 保存当前页面 ${pageNumber}，高度: ${currentPageHeight}px`);
              pageNumber++;
            }

            // 对整个markdown进行分页处理
            const markdownPages = splitMarkdownIntoPages(section, MAX_PAGE_HEIGHT);
            pages.push(...markdownPages);
            pageNumber += markdownPages.length;
            console.log(`📄 Markdown整体分页，生成 ${markdownPages.length} 个页面`);

            currentPageContent = [];
            currentPageHeight = 0;
          }
        } else {
          // 非Markdown容器的处理
          if (remainingHeight < MIN_REMAINING_HEIGHT) {
            // 剩余空间太少，移到下一页
            if (currentPageContent.length > 0) {
              pages.push(createPageHTML(currentPageContent));
              console.log(`💾 保存当前页面 ${pageNumber}，高度: ${currentPageHeight}px`);
              pageNumber++;
            }

            currentPageContent = [section.cloneNode(true) as HTMLElement];
            currentPageHeight = sectionHeight;
          } else {
            // 尝试其他容器的拆分
            const splitResult = splitContainerFinegrained(section, remainingHeight, MAX_PAGE_HEIGHT);

            if (splitResult.currentPagePart) {
              currentPageContent.push(splitResult.currentPagePart);
              currentPageHeight += getElementHeight(splitResult.currentPagePart);

              pages.push(createPageHTML(currentPageContent));
              console.log(`💾 保存页面 ${pageNumber}，高度: ${currentPageHeight}px`);
              pageNumber++;

              if (splitResult.remainingParts && splitResult.remainingParts.length > 0) {
                const remainingPages = distributeRemainingContent(splitResult.remainingParts, MAX_PAGE_HEIGHT);
                pages.push(...remainingPages);
                pageNumber += remainingPages.length;
              }

              currentPageContent = [];
              currentPageHeight = 0;
            } else {
              // 无法拆分，移到下一页
              if (currentPageContent.length > 0) {
                pages.push(createPageHTML(currentPageContent));
                pageNumber++;
              }

              currentPageContent = [section.cloneNode(true) as HTMLElement];
              currentPageHeight = sectionHeight;
            }
          }
        }
      }
    }

    // 保存最后一页
    if (currentPageContent.length > 0) {
      pages.push(createPageHTML(currentPageContent));
      console.log(`💾 保存最后一页 ${pageNumber}，高度: ${currentPageHeight}px`);
    }

    // 🆕 更智能的页面优化
    const optimizedPages = optimizePagesFinegrained(pages);

    console.log(`\n🎉 细粒度分页处理完成!`);
    console.log(`📊 分页统计:`, {
      原始页数: pages.length,
      优化后页数: optimizedPages.length,
      页面利用率提升: `${(((pages.length - optimizedPages.length) / pages.length) * 100).toFixed(1)}%`,
      原始章节数: sections.length
    });

    dynamicPages.value = optimizedPages;
    contentPages.value = optimizedPages;

    console.log(`✅ 细粒度分页结果已保存到组件状态`);
  });
};

// 🆕 Markdown内容细粒度拆分函数
const splitMarkdownFinegrained = (markdownElement: HTMLElement, remainingHeight: number, maxPageHeight: number): {
  currentPagePart?: HTMLElement,
  remainingParts?: HTMLElement[]
} => {
  console.log(`🔍 Markdown细粒度拆分，剩余高度: ${remainingHeight}px`);

  const children = Array.from(markdownElement.children) as HTMLElement[];
  const currentPageElements: HTMLElement[] = [];
  const remainingElements: HTMLElement[] = [];
  let currentHeight = 0;

  console.log(`📝 Markdown包含 ${children.length} 个子元素`);

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childHeight = getElementHeight(child);

    console.log(`   元素 ${i + 1}: ${child.tagName} - ${childHeight}px`);

    if (currentHeight + childHeight <= remainingHeight) {
      currentPageElements.push(child.cloneNode(true) as HTMLElement);
      currentHeight += childHeight;
      console.log(`   ✅ 添加到当前页，累计高度: ${currentHeight}px`);
    } else {
      // 检查是否是可以进一步拆分的元素（如长列表）
      if ((child.tagName === 'UL' || child.tagName === 'OL') && child.children.length > 1) {
        console.log(`   🔀 发现长列表，进行子项拆分`);
        const listSplit = splitListFinegrained(child, remainingHeight - currentHeight, maxPageHeight);

        if (listSplit.currentPagePart && listSplit.currentPagePart.children.length > 0) {
          currentPageElements.push(listSplit.currentPagePart);
          currentHeight += getElementHeight(listSplit.currentPagePart);
          console.log(`   ✅ 添加部分列表项，累计高度: ${currentHeight}px`);
        }

        if (listSplit.remainingParts) {
          remainingElements.push(...listSplit.remainingParts);
        }
      } else {
        // 单个元素无法拆分，添加到剩余内容
        remainingElements.push(child.cloneNode(true) as HTMLElement);
        console.log(`   ➡️ 添加到剩余内容`);
      }
    }
  }

  let currentPagePart: HTMLElement | undefined;
  if (currentPageElements.length > 0) {
    currentPagePart = markdownElement.cloneNode(false) as HTMLElement;
    currentPageElements.forEach(el => currentPagePart!.appendChild(el));
    console.log(`✅ 创建当前页部分，包含 ${currentPageElements.length} 个元素`);
  }

  console.log(`📄 剩余 ${remainingElements.length} 个元素需要分配到后续页面`);

  return { currentPagePart, remainingParts: remainingElements };
};

// 🆕 列表细粒度拆分函数
const splitListFinegrained = (listElement: HTMLElement, remainingHeight: number, maxPageHeight: number): {
  currentPagePart?: HTMLElement,
  remainingParts?: HTMLElement[]
} => {
  const listItems = Array.from(listElement.children) as HTMLElement[];
  const currentPageItems: HTMLElement[] = [];
  const remainingItems: HTMLElement[] = [];
  let currentHeight = 0;

  console.log(`📋 列表包含 ${listItems.length} 个项目`);

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const itemHeight = getElementHeight(item);

    if (currentHeight + itemHeight <= remainingHeight) {
      currentPageItems.push(item.cloneNode(true) as HTMLElement);
      currentHeight += itemHeight;
    } else {
      remainingItems.push(...listItems.slice(i).map(item => item.cloneNode(true) as HTMLElement));
      console.log(`     剩余 ${listItems.length - i} 个项目移到后续页面`);
      break;
    }
  }

  let currentPagePart: HTMLElement | undefined;
  if (currentPageItems.length > 0) {
    currentPagePart = listElement.cloneNode(false) as HTMLElement;
    currentPageItems.forEach(item => currentPagePart!.appendChild(item));
  }

  const remainingParts: HTMLElement[] = [];
  if (remainingItems.length > 0) {
    const remainingList = listElement.cloneNode(false) as HTMLElement;
    remainingItems.forEach(item => remainingList.appendChild(item));
    remainingParts.push(remainingList);
  }

  return { currentPagePart, remainingParts };
};

// 🆕 将Markdown分割成完整页面
const splitMarkdownIntoPages = (markdownElement: HTMLElement, maxPageHeight: number): string[] => {
  const children = Array.from(markdownElement.children) as HTMLElement[];
  const pages: string[] = [];
  let currentPage: HTMLElement[] = [];
  let currentHeight = 0;

  console.log(`📄 将Markdown拆分成页面，共 ${children.length} 个子元素`);

  for (const child of children) {
    const childHeight = getElementHeight(child);

    if (currentHeight + childHeight <= maxPageHeight) {
      currentPage.push(child.cloneNode(true) as HTMLElement);
      currentHeight += childHeight;
    } else {
      // 保存当前页面
      if (currentPage.length > 0) {
        const pageContainer = markdownElement.cloneNode(false) as HTMLElement;
        currentPage.forEach(el => pageContainer.appendChild(el));
        pages.push(createPageHTML([pageContainer]));
      }

      // 检查单个元素是否过大
      if (childHeight > maxPageHeight && (child.tagName === 'UL' || child.tagName === 'OL')) {
        // 长列表需要进一步拆分
        const listPages = splitLongListIntoPages(child, markdownElement, maxPageHeight);
        pages.push(...listPages);
      } else {
        // 开始新页面
        currentPage = [child.cloneNode(true) as HTMLElement];
        currentHeight = childHeight;
      }
    }
  }

  // 保存最后一页
  if (currentPage.length > 0) {
    const pageContainer = markdownElement.cloneNode(false) as HTMLElement;
    currentPage.forEach(el => pageContainer.appendChild(el));
    pages.push(createPageHTML([pageContainer]));
  }

  console.log(`✅ Markdown拆分完成，生成 ${pages.length} 个页面`);
  return pages;
};

// 🆕 拆分超长列表为多个页面
const splitLongListIntoPages = (listElement: HTMLElement, containerElement: HTMLElement, maxPageHeight: number): string[] => {
  const listItems = Array.from(listElement.children) as HTMLElement[];
  const pages: string[] = [];
  let currentItems: HTMLElement[] = [];
  let currentHeight = 0;

  console.log(`📋 拆分超长列表，共 ${listItems.length} 个项目`);

  for (const item of listItems) {
    const itemHeight = getElementHeight(item);

    if (currentHeight + itemHeight <= maxPageHeight) {
      currentItems.push(item.cloneNode(true) as HTMLElement);
      currentHeight += itemHeight;
    } else {
      // 保存当前页面
      if (currentItems.length > 0) {
        const pageContainer = containerElement.cloneNode(false) as HTMLElement;
        const listContainer = listElement.cloneNode(false) as HTMLElement;
        currentItems.forEach(item => listContainer.appendChild(item));
        pageContainer.appendChild(listContainer);
        pages.push(createPageHTML([pageContainer]));
      }

      // 开始新页面
      currentItems = [item.cloneNode(true) as HTMLElement];
      currentHeight = itemHeight;
    }
  }

  // 保存最后一页
  if (currentItems.length > 0) {
    const pageContainer = containerElement.cloneNode(false) as HTMLElement;
    const listContainer = listElement.cloneNode(false) as HTMLElement;
    currentItems.forEach(item => listContainer.appendChild(item));
    pageContainer.appendChild(listContainer);
    pages.push(createPageHTML([pageContainer]));
  }

  console.log(`✅ 超长列表拆分完成，生成 ${pages.length} 个页面`);
  return pages;
};

// 🆕 分配剩余内容到页面
const distributeRemainingContent = (remainingElements: HTMLElement[], maxPageHeight: number): string[] => {
  const pages: string[] = [];
  let currentPage: HTMLElement[] = [];
  let currentHeight = 0;

  console.log(`📦 分配 ${remainingElements.length} 个剩余元素`);

  for (const element of remainingElements) {
    const elementHeight = getElementHeight(element);

    if (currentHeight + elementHeight <= maxPageHeight) {
      currentPage.push(element.cloneNode(true) as HTMLElement);
      currentHeight += elementHeight;
    } else {
      // 保存当前页面
      if (currentPage.length > 0) {
        // 创建markdown容器
        const markdownContainer = document.createElement('div');
        markdownContainer.className = 'markdown-content';
        currentPage.forEach(el => markdownContainer.appendChild(el));
        pages.push(createPageHTML([markdownContainer]));
      }

      // 开始新页面
      currentPage = [element.cloneNode(true) as HTMLElement];
      currentHeight = elementHeight;
    }
  }

  // 保存最后一页
  if (currentPage.length > 0) {
    const markdownContainer = document.createElement('div');
    markdownContainer.className = 'markdown-content';
    currentPage.forEach(el => markdownContainer.appendChild(el));
    pages.push(createPageHTML([markdownContainer]));
  }

  console.log(`✅ 剩余内容分配完成，生成 ${pages.length} 个页面`);
  return pages;
};

// 🆕 其他容器的细粒度拆分
const splitContainerFinegrained = (container: HTMLElement, remainingHeight: number, maxPageHeight: number): {
  currentPagePart?: HTMLElement,
  remainingParts?: HTMLElement[]
} => {
  const children = Array.from(container.children) as HTMLElement[];

  if (children.length <= 1) {
    return { currentPagePart: undefined, remainingParts: [container.cloneNode(true) as HTMLElement] };
  }

  const currentPageElements: HTMLElement[] = [];
  const remainingElements: HTMLElement[] = [];
  let currentHeight = 0;

  for (const child of children) {
    const childHeight = getElementHeight(child);

    if (currentHeight + childHeight <= remainingHeight) {
      currentPageElements.push(child.cloneNode(true) as HTMLElement);
      currentHeight += childHeight;
    } else {
      remainingElements.push(child.cloneNode(true) as HTMLElement);
    }
  }

  let currentPagePart: HTMLElement | undefined;
  if (currentPageElements.length > 0) {
    currentPagePart = container.cloneNode(false) as HTMLElement;
    currentPageElements.forEach(el => currentPagePart!.appendChild(el));
  }

  const remainingParts: HTMLElement[] = [];
  if (remainingElements.length > 0) {
    const remainingContainer = container.cloneNode(false) as HTMLElement;
    remainingElements.forEach(el => remainingContainer.appendChild(el));
    remainingParts.push(remainingContainer);
  }

  return { currentPagePart, remainingParts };
};

// 🆕 细粒度页面优化函数
const optimizePagesFinegrained = (pages: string[]): string[] => {
  const optimized: string[] = [];
  const MIN_PAGE_CONTENT_HEIGHT = CONTENT_MAX_HEIGHT * 0.3; // 30%最小内容
  const MAX_MERGE_HEIGHT = CONTENT_MAX_HEIGHT * 0.98; // 98%最大合并

  console.log(`🚀 开始细粒度页面优化`);

  for (let i = 0; i < pages.length; i++) {
    const currentPage = pages[i];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentPage;
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = '210mm';
    document.body.appendChild(tempDiv);

    const pageHeight = getElementHeight(tempDiv);
    document.body.removeChild(tempDiv);

    console.log(`📊 页面 ${i + 1} 高度: ${pageHeight}px`);

    if (pageHeight < MIN_PAGE_CONTENT_HEIGHT && i < pages.length - 1) {
      // 尝试与下一页合并
      const nextPage = pages[i + 1];
      const testDiv = document.createElement('div');
      testDiv.innerHTML = currentPage + nextPage;
      testDiv.style.position = 'absolute';
      testDiv.style.visibility = 'hidden';
      testDiv.style.width = '210mm';
      document.body.appendChild(testDiv);

      const mergedHeight = getElementHeight(testDiv);
      document.body.removeChild(testDiv);

      if (mergedHeight <= MAX_MERGE_HEIGHT) {
        console.log(`🔄 成功合并页面 ${i + 1} 和 ${i + 2}，合并后高度: ${mergedHeight}px`);
        optimized.push(currentPage + nextPage);
        i++; // 跳过下一页
      } else {
        optimized.push(currentPage);
      }
    } else {
      optimized.push(currentPage);
    }
  }

  console.log(`🎉 细粒度页面优化完成：${pages.length} -> ${optimized.length} 页`);
  return optimized;
};

const fetchReportData = async () => {
  try {

    const response = await reportApi.getReportDetail(reportId);

    if (response.code === 200) {
      // 更新响应式数据
      Object.assign(reportData, response.data);

      // 如果后端返回了Markdown格式的公司简介，设置到markdownContent字段
      reportData.companyProfile = response.data.companyProfile;


      // 更新表格数据的引用
      riskTableData.value = reportData.riskAnalysis.riskTableData;
      relatedRiskTableData.value = reportData.riskAnalysis.relatedRiskTableData;

      // 等待DOM更新后创建动态页面
      nextTick(() => {
        setTimeout(() => {
          if (enableAutoPaging.value) {
            createDynamicPages();
          }
        }, 100);
      });
    }
  } catch (error) {
    console.error('获取报告数据失败:', error);
  }
};

const parsedMdData = (data: string | undefined): string => {
  // 如果后端返回的是Markdown格式的数据
  if (!data || typeof data !== 'string') {
    return '';
  }
  return md.render(data);
};

// 自定义解析函数，将特定格式转换为项目样式
const parseMdData = (content: string): string => {
  if (!content) return '';

  // 先用markdown-it解析基本内容
  let html = md.render(content);

  // 处理主标题格式，如 "**1、行业趋势**" 或 "**2、政策影响**"
  // html = html.replace(
  //   /<p><strong>(\d+、[^<]+)<\/strong><\/p>/g,
  //   (match, title) => {
  //     return `<h2 class="industry-title">${title} <img src="@/assets/image/companyProfileLogo.png" alt=""> </h2>`;
  //   }
  // );

  // 处理带编号的子标题和描述，以及后续的列表项
  html = html.replace(
    /<p><strong>（(\d+)）([^<]+)<\/strong><br>\s*([^<]*?)<\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
    (match, number, title, description, listContent) => {
      // 解析列表项，匹配 "- **项目名**：内容" 格式
      const listItems = listContent.match(/<li><strong>([^<]+)<\/strong>：([^<]+)<\/li>/g) || [];

      let subsections = '';
      listItems.forEach(item => {
        const itemMatch = item.match(/<li><strong>([^<]+)<\/strong>：([^<]+)<\/li>/);
        if (itemMatch) {
          const [, itemTitle, itemText] = itemMatch;
          subsections += `
            <div class="policy-subsection">
              <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> ${itemTitle}：</h4>
              <div class="policy-item">
                <span class="policy-text">${itemText}</span>
              </div>
            </div>
          `;
        }
      });

      return `
        <div class="industry-section">
          <h3 class="industry-subtitle">(${number}) ${title}</h3>
          <div class="industry-content">
            ${description ? `<div class="industry-description"><p>${description}</p></div>` : ''}
            ${subsections}
          </div>
        </div>
      `;
    }
  );

  // 处理没有描述的子标题格式
  html = html.replace(
    /<p><strong>（(\d+)）([^<]+)<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
    (match, number, title, listContent) => {
      const listItems = listContent.match(/<li><strong>([^<]+)<\/strong>：([^<]+)<\/li>/g) || [];

      let subsections = '';
      listItems.forEach(item => {
        const itemMatch = item.match(/<li><strong>([^<]+)<\/strong>：([^<]+)<\/li>/);
        if (itemMatch) {
          const [, itemTitle, itemText] = itemMatch;
          subsections += `
            <div class="policy-subsection">
              <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> ${itemTitle}：</h4>
              <div class="policy-item">
                <span class="policy-text">${itemText}</span>
              </div>
            </div>
          `;
        }
      });

      return `
        <div class="industry-section">
          <h3 class="industry-subtitle">(${number}) ${title}</h3>
          <div class="industry-content">
            ${subsections}
          </div>
        </div>
      `;
    }
  );

  // 处理简单的强调标题（没有编号） 
  html = html.replace(
    /<p><strong>([^<]+)<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
    (match, title, listContent) => {
      const listItems = listContent.match(/<li><strong>([^<]+)<\/strong>：([^<]+)<\/li>/g) || [];

      let subsections = '';
      listItems.forEach(item => {
        const itemMatch = item.match(/<li><strong>([^<]+)<\/strong>：([^<]+)<\/li>/);
        if (itemMatch) {
          const [, itemTitle, itemText] = itemMatch;
          subsections += `
            <div class="policy-subsection">
              <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> ${itemTitle}：</h4>
              <div class="policy-item">
                <span class="policy-text">${itemText}</span>
              </div>
            </div>
          `;
        }
      });

      return `
        <div class="industry-section">
          <h3 class="industry-subtitle">${title}</h3>
          <div class="industry-content">
            ${subsections}
          </div>
        </div>
      `;
    }
  );

  // 处理分割线
  html = html.replace(/<hr>/g, '<div style="margin: 20px 0; border-top: 2px solid #e0e0e0;"></div>');

  return html;
};

const handleAutoPagingChange = (value: string | number | boolean) => {
  const boolValue = Boolean(value);
  console.log('自动分页开关状态:', boolValue);

  if (boolValue) {
    // 开启自动分页
    nextTick(() => {
      setTimeout(() => {
        createDynamicPages();
      }, 100);
    });
  } else {
    // 关闭自动分页，清空动态页面
    contentPages.value = [];
    dynamicPages.value = [];
  }
};

// 移动设备适配相关
const reportContainer = ref<HTMLElement | null>(null);
const isMobile = ref(false);
const scaleRatio = ref(1);
const containerHeight = ref('auto');
const mobileScaleStyle = computed(() => {
  if (isMobile.value) {
    return {
      transform: `scale(${scaleRatio.value})`,
      transformOrigin: 'top left',
      width: `${100 / scaleRatio.value}%`,
      height: containerHeight.value,
    };
  }
  return {};
});

// 检测是否为移动设备
const checkIsMobile = () => {
  // 通过屏幕宽度判断是否为移动设备（小于768px视为移动设备）
  const isMobileDevice = window.innerWidth < 768;
  isMobile.value = isMobileDevice;

  // 如果是移动设备，计算缩放比例
  if (isMobileDevice && reportContainer.value) {
    // 报告容器原始宽度（210mm约等于793px）
    const reportWidth = 793;
    // 窗口可用宽度（减去一些边距）
    const windowWidth = window.innerWidth;
    // 计算缩放比例
    scaleRatio.value = windowWidth / reportWidth;
    console.log(`移动设备检测：缩放比例 ${scaleRatio.value}`);

    // 等待DOM更新后调整容器高度
    nextTick(() => {
      updateContainerHeight();
    });
  } else {
    // 非移动设备，不缩放
    scaleRatio.value = 1;
    containerHeight.value = 'auto';
  }
};

// 更新容器高度以匹配缩放后的内容高度
const updateContainerHeight = () => {
  if (!reportContainer.value || !isMobile.value) return;

  // 获取实际内容高度
  const actualContentHeight = reportContainer.value.scrollHeight;

  // 根据缩放比例计算调整后的容器高度
  // 除以缩放比例是为了compensate缩放效果
  const adjustedHeight = actualContentHeight * scaleRatio.value;

  // 设置新的容器高度
  containerHeight.value = `${adjustedHeight}px`;

  console.log(`调整容器高度: 原始高度=${actualContentHeight}px, 调整后=${adjustedHeight}px`);
};

// 监听内容变化来更新高度
const setupHeightObserver = () => {
  if (!reportContainer.value) return;

  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(() => {
    if (isMobile.value) {
      updateContainerHeight();
    }
  });

  // 配置观察选项
  observer.observe(reportContainer.value, {
    childList: true,
    subtree: true,
    attributes: true
  });

  // 组件卸载时清理观察者
  onBeforeUnmount(() => {
    observer.disconnect();
  });
};

// 添加窗口调整大小的事件监听
const handleResize = () => {
  checkIsMobile();
};

// 监听缩放比例变化，更新容器高度
watch(scaleRatio, () => {
  if (isMobile.value) {
    nextTick(() => {
      updateContainerHeight();
    });
  }
});

// 监听报告数据变化，更新容器高度
watch(() => reportData, () => {
  if (isMobile.value) {
    nextTick(() => {
      updateContainerHeight();
    });
  }
}, { deep: true });

// 生命周期
onMounted(() => {
  console.log('报告ID:', reportId);
  fetchReportData();

  // 初始检测设备类型并设置缩放
  nextTick(() => {
    checkIsMobile();
    // 设置内容高度观察器
    setupHeightObserver();
  });

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
});

// 在组件销毁前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<style scoped lang="scss">
// SCSS变量定义
$primary-color: #4285f4;
$secondary-color: #007bff;
$success-color: #165DFF;
$warning-color: #ffc107;
$danger-color: #dc3545;
$text-primary: #333;
$text-secondary: #555;
$text-light: #666;
$text-muted: #86909C;
$border-color: #dee2e6;
$background-light: #f8f9fa;
$blue-dark: #2c3e50;

// 基础混入
@mixin flex-center {
  display: flex;
  align-items: center;
}

@mixin flex-start {
  display: flex;
  align-items: flex-start;
}

@mixin section-spacing {
  margin-bottom: 20px;
}

@mixin icon-size($size: 16px) {
  width: $size;
  height: $size;
  flex-shrink: 0;
}

// 通用基础类
.base-title {
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 12px;
  @include flex-center;

  img {
    @include icon-size(20px);
    height: 12px;
    vertical-align: middle;
    margin-left: 8px;
  }

  &--large {
    font-size: 22px;
    margin-bottom: 10px;
  }

  &--medium {
    font-size: 18px;
  }

  &--small {
    font-size: 16px;
  }

  &--blue {
    color: $blue-dark;
  }
}

.base-list-item {
  margin-bottom: 8px;
  margin-left: 20px;
  @include flex-start;

  &__bullet {
    color: $secondary-color;
    font-weight: bold;
    margin-right: 8px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  &__text {
    color: $text-secondary;
    line-height: 1.6;
    font-size: 14px;
  }
}

.base-icon-text {
  @include flex-start;
  margin-bottom: 12px;

  img {
    @include icon-size();
    margin-right: 8px;
    margin-top: 2px;
  }

  &__content {
    color: $text-secondary;
    line-height: 1.6;
    font-size: 14px;
    margin: 0;

    strong {
      font-weight: 600;
      color: $text-primary;
    }
  }
}

.base-subsection {
  margin-bottom: 16px;
  margin-left: 10px;

  &__title {
    font-size: 14px;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 8px;
    @include flex-center;

    img {
      @include icon-size(12px); // 从16px改为12px，使图标更小
      margin-right: 6px;
      margin-top: 1px; // 微调垂直对齐
    }
  }

  &__content {
    font-size: 14px;
    line-height: 1.6;
    color: $text-secondary;
  }
}

// 为子章节标题单独设置更小的图标样式
.subsection-title,
.industry-subtitle,
.dynamics-point-title,
.inspection-subtitle,
.supply-subtitle,
.certainty-title,
.customer-type-title,
.customer-expansion-title {
  font-size: 14px;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 8px;
  @include flex-start;
  display: flex;
  align-items: center;

  img {
    @include icon-size(14px); // 使用更小的图标尺寸
    margin-right: 6px;
    margin-top: 1px; // 微调对齐
    flex-shrink: 0;
  }
}

.base-section {
  @include section-spacing;

  &__header {
    text-align: center;
    margin-bottom: 15px;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  &__title {
    @extend .base-title;
    @extend .base-title--medium;
    @extend .base-title--blue;
  }
}

.section-header {
  text-align: center;
  margin-bottom: 15px;

  img {
    max-width: 100%;
    height: auto;
  }
}

.base-table {
  :deep(.el-table__header) {
    th {
      background-color: #5E9BFF !important;
      color: white !important;
      font-weight: 500;
      font-size: 12px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;

      &:first-child {
        background-color: #0071FF !important;
      }

      &:nth-child(2) {
        background-color: #308BFE !important;
      }
    }

    .cell {
      padding: 8px 6px;
      line-height: 1.2;
      font-size: 11px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }
  }

  :deep(.el-table__body) {
    tbody {
      tr {
        &:nth-child(even) {
          background-color: $background-light;
        }

        &:hover>td {
          background-color: #e3f2fd !important;
        }
      }

      td {
        padding: 8px 6px !important;
        text-align: center;
        border: 1px solid $border-color !important;
        font-size: 12px;
        color: $text-primary;
        line-height: 1.2;

        .cell {
          padding: 0;
          line-height: 1.2;
          font-size: 11px;
          word-break: break-word;
        }
      }
    }
  }

  :deep(.el-table--border) {
    border: 1px solid $border-color;

    &::after,
    &::before {
      display: none;
    }
  }
}

.auto-paging-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;

  .control-panel {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;

    .control-label {
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
      white-space: nowrap;
    }

    :deep(.el-switch) {
      .el-switch__label {
        font-size: 12px;
        color: $text-secondary;
      }

      &.is-checked .el-switch__label--left {
        color: $text-muted;
      }

      &:not(.is-checked) .el-switch__label--right {
        color: $text-muted;
      }
    }
  }

  @media print {
    display: none;
  }
}

.report-container {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  line-height: 1.6;
  color: $text-primary;
  min-height: 100vh;
  overflow-y: auto;
  transition: transform 0.3s ease, height 0.3s ease;

  @media print {
    box-shadow: none;
    margin: 0;
    max-width: none;
    overflow: visible;
  }

  // 移动设备适配样式
  @media (max-width: 767px) {
    box-shadow: none;
    margin: 0;
    max-width: none;
    transform-origin: top left;
    overflow-y: visible; // 避免在移动设备上出现双重滚动条
    height: auto; // 高度由JS动态控制
    min-height: auto; // 覆盖原来的min-height设置
  }

  .report-page {
    // height: 297mm;
    width: 210mm;
    // max-height: 297mm;
    min-height: 297mm;
    padding: 0 64px 25px 64px;
    background: url('@/assets/image/backgroundOfTheFirstPage.png') no-repeat center center;
    background-size: cover;
    position: relative;

    // 修复封面页样式 - 使用类名而不是位置选择器
    &.cover-page {
      padding: 0;
      background: none;
    }

    &:not(.cover-page):not(.combined-content-page) {
      background: url('@/assets/image/pageBackImg.png') no-repeat center center;
      background-size: cover;
    }
  }

  .cover-page {
    text-align: center;
    color: white;
    display: flex;
    justify-content: center;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .report-page_header {
    text-align: center;
    padding: 20px 0;
    // margin-bottom: 15px;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .company-analysis-container {
    background-color: rgb(244, 249, 255);
    background-image: url('@/assets/image/companyBackImg.png');
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);

    .company-header {
      margin-bottom: 15px;
      padding-bottom: 15px;

      .company-info {
        display: flex;
        align-items: flex-start;
        gap: 15px;

        .company-logo {
          .logo-circle {

            width: 60px;
            height: 60px;
            border-radius: 50%;

            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

            .logo-text {
              font-size: 14px;
              font-weight: bold;
              color: white;
              text-align: center;
              line-height: 1.2;
            }
          }
        }

        .company-details {
          flex: 1;

          .company-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 8px 0;
            color: $blue-dark;
            line-height: 1.3;
          }

          .company-tags {
            display: flex;
            gap: 6px;
            margin-bottom: 10px;
            flex-wrap: wrap;

            .tag {
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
              color: white;

              &.tag-green {
                background: #27ae60;
              }

              &.tag-blue {
                background: #3498db;
              }
            }
          }
        }
      }

      .company-meta {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #1D2129;
        line-height: 22px;
        text-align: left;
        margin-top: 10px;

        .meta-row {
          display: flex;
          margin-bottom: 4px;
          align-items: flex-start;
          line-height: 2;

          .meta-label {
            font-weight: 400;
            min-width: 70px;
            flex-shrink: 0;
            color: $text-muted;
          }

          .meta-value {
            font-weight: 500;
            flex: 1;
            word-break: break-all;
          }
        }
      }
    }

    .analysis-section {
      .analysis-title {
        @extend .base-title;
        @extend .base-title--small;
        @extend .base-title--blue;
      }

      .analysis-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;

        .analysis-card {
          border-radius: 8px;

          .card-header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #026EFF;
          }

          .card-rating {
            margin-bottom: 6px;

            .star {
              color: #f39c12;
              font-size: 14px;
              margin: 0 1px;
            }

            img {
              @include icon-size();
              vertical-align: middle;
              margin-left: 4px;
            }
          }

          .card-status {
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 6px;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            line-height: 1;

            &.warning {
              color: $warning-color;
              // 黄色
              background-color: rgba(241, 196, 15, 0.1);
            }

            &.success {
              color: $success-color;
              background-color: rgba(52, 152, 219, 0.1);
            }

            &.default {
              color: $text-muted;
              background-color: rgba(189, 195, 199, 0.1);
            }

            &.danger {
              color: $warning-color;
              background-color: rgba(231, 76, 60, 0.1);
            }

            &.info {
              color: $secondary-color;
              background-color: rgba(52, 152, 219, 0.1);
            }

            &.primary {
              color: $primary-color;
              background-color: rgba(66, 133, 244, 0.1);
            }

            &.blue {
              color: $blue-dark;
              background-color: rgba(44, 62, 80, 0.1);
            }
          }

          .card-category {
            font-size: 11px;
            color: #7f8c8d;
            font-weight: 400;
          }
        }
      }
    }
  }

  .company-profile {
    @extend .base-section;

    .section-title {
      @extend .base-title;
      @extend .base-title--large;
      font-weight: 600;
      color: #171717;
    }

    .profile-content {
      font-size: 14px;
      line-height: 1.8;
      color: $text-primary;

      // Markdown内容样式
      .markdown-content {

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: $text-primary;
          margin: 20px 0 12px 0;
          font-weight: 600;
          line-height: 1.4;
        }

        h1 {
          font-size: 20px;
          color: $blue-dark;
        }

        h2 {
          font-size: 18px;
          color: $blue-dark;
        }

        h3 {
          font-size: 16px;
          color: $text-primary;
        }

        h4 {
          font-size: 14px;
          color: $text-primary;
        }

        p {
          margin: 8px 0;
          line-height: 1.6;
          color: $text-secondary;
        }

        ul,
        ol {
          margin: 8px 0;
          padding-left: 0; // 取消默认的左内边距
          list-style: none; // 取消默认的列表样式

          li {
            margin-bottom: 0; // 取消默认的下边距
            line-height: 1.6;
            color: $text-secondary;
            list-style: none; // 确保没有列表样式

            // 取消默认的 marker 样式
            &::marker {
              display: none;
            }

            // 取消所有默认的伪元素
            &::before {
              display: none;
            }
          }
        }

        ul {
          list-style-type: none; // 明确取消 disc 样式
        }

        strong {
          font-weight: 600;
          color: $text-primary;
        }

        em {
          font-style: italic;
          color: $text-secondary;
        }



        blockquote {
          border-left: 4px solid $secondary-color;
          padding-left: 16px;
          margin: 12px 0;
          color: $text-light;
          font-style: italic;
        }

        // 确保段落间距合适
        &>*:first-child {
          margin-top: 0;
        }

        &>*:last-child {
          margin-bottom: 0;
        }
      }

      .profile-meta {
        @extend .base-icon-text;
      }

      .product-list {
        list-style: none;
        padding: 0;
        margin: 0 0 0 20px;

        li {
          margin-bottom: 8px;
          position: relative;
          padding-left: 20px;

          &::before {
            content: 'O';
            position: absolute;
            left: 0;
            top: 0;
            color: $secondary-color;
            font-weight: bold;
          }
        }
      }
    }
  }

  .page-footer {
    position: absolute;
    bottom: 35px;
    left: 0;
    right: 0;
    padding-top: 10px;
    text-align: center;
    font-size: 12px;
    color: $text-light;

    .footer-text {
      margin-bottom: 5px;
    }

    .footer-watermark {
      font-size: 10px;
      color: #ccc;
      font-style: italic;
    }
  }

  .report-pageOne-content {
    .pageOne-content-header {
      margin-bottom: 10px;

      img {
        max-width: 100%;
        height: auto;
      }

      .content-header-card {
        height: 124px;
        border-radius: 5px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background: url('@/assets/image/companyRatingImg.png') no-repeat center center;
        background-size: cover;
        background-color: rgba(255, 255, 255, 0.7);
        display: flex;
        flex-direction: column;

        .rating-card {
          display: flex;
          flex-direction: column;

          .rating-upper {
            @include flex-center;
            margin-bottom: 8px;

            .rating-grade {
              font-size: 24px;
              font-weight: bold;
              color: $text-primary;
              margin-right: 8px;
            }

            .rating-stars .el-rate {
              font-size: 14px;
              color: #f39c12;
            }

            .rating-status {
              font-size: 12px;
              font-weight: 500;
              margin-left: 8px;
              padding: 2px 6px;
              border-radius: 4px;
              color: $warning-color;
              background-color: rgba(231, 76, 60, 0.1);
              display: inline-block;
            }
          }

          .rating-below {
            font-size: 12px;
            margin-bottom: 4px;
            @include flex-center;

            p {
              color: $text-muted;
            }
          }
        }

        &.risk-analysis-card {
          .rating-upper {
            .risk-grade {
              color: $warning-color !important;
            }

            .star-display {
              display: flex;
              margin-right: 8px;

              .star {
                color: #f39c12;
                font-size: 16px;
                margin: 0 2px;

                &:not(.active) {
                  color: #ddd;
                }
              }
            }

            .risk-status {
              background-color: rgba(255, 193, 7, 0.1);
              color: #ffc107;
            }
          }
        }
      }
    }

    // 使用通用类替换重复的样式
    .pageOne-content-industry,
    .enterprise-dynamics-section,
    .government-inspection-section,
    .supply-chain-section,
    .comprehensive-rating-section,
    .financial-risk-management-section,
    .industry-competitive-risk-section,
    .investment-regional-preference-section {
      @extend .base-section;

      .industry-title,
      .dynamics-subtitle,
      .section-title-blue,
      .risk-design-title {
        @extend .base-section__title;
      }

      .industry-section,
      .dynamics-section,
      .inspection-subsection,
      .supply-subsection,
      .risk-design-section,
      .regional-section {
        @extend .base-subsection;

        .industry-subtitle,
        .dynamics-item-title,
        .inspection-subtitle,
        .supply-subtitle,
        .certainty-title,
        .regional-subtitle {
          @extend .base-subsection__title;
        }

        .industry-content,
        .dynamics-content,
        .supply-chain-intro,
        .regional-content {
          @extend .base-subsection__content;
        }
      }

      // 统一的列表项样式 - 使用::before伪元素添加圆点
      .policy-item,
      .dynamics-item,
      .market-item,
      .inspection-item,
      .supply-item,
      .customer-item {
        margin-bottom: 8px;
        margin-left: 20px;
        @include flex-start;
        position: relative;
        padding-left: 20px;

        &::before {
          content: 'O';
          position: absolute;
          left: 0;
          top: 2px;
          color: $secondary-color;
          font-weight: bold;
          flex-shrink: 0;
        }

        .policy-text,
        .dynamics-text,
        .market-text,
        .inspection-text,
        .supply-text,
        .customer-text {
          color: $text-secondary;
          line-height: 1.6;
          font-size: 14px;
          flex: 1;
        }
      }

      // 统一的带图标文本样式
      .impact-item,
      .info-item,
      .risk-point {
        @extend .base-icon-text;

        p {
          @extend .base-icon-text__content;
        }
      }

      .industry-list,
      .risk-list {
        list-style: none;
        padding: 0;
        margin: 0 0 0 20px;

        li {
          margin-bottom: 8px;
          position: relative;
          padding-left: 20px;

          &::before {
            content: 'O';
            position: absolute;
            left: 0;
            top: 0;
            color: $secondary-color;
            font-weight: bold;
          }
        }
      }
    }

    // 修复第三页特有的样式问题
    .pageOne-content-industry {
      .policy-subsection {
        @extend .base-subsection;
        margin-bottom: 16px;

        .subsection-title {
          @extend .base-subsection__title;
        }
      }
    }

    .enterprise-dynamics-section {
      .dynamics-subsection {
        @extend .base-subsection;
        margin-left: 20px;

        .dynamics-point-title {
          @extend .base-subsection__title;
        }
      }

      .capital-subsection {
        @extend .base-subsection;
        margin-left: 20px;

        .dynamics-point-title {
          @extend .base-subsection__title;
        }

        .dynamics-description {
          @extend .base-subsection__content;
        }
      }

      .dynamics-item-title {
        font-size: 16px;
        font-weight: bold;
        color: $text-primary;
        margin-bottom: 10px;
      }

      .dynamics-description {
        @extend .base-subsection__content;
        margin-bottom: 12px;
      }
    }

    .market-penetration-section {
      @extend .base-section;

      .market-subtitle {
        @extend .base-subsection__title;
        font-size: 16px;
        margin-bottom: 10px;
      }

      .market-item {
        @extend .base-list-item;

        .market-bullet {
          @extend .base-list-item__bullet;
        }

        .market-text {
          @extend .base-list-item__text;
        }
      }
    }

    // 修复supply-chain-section的样式问题
    .supply-chain-section {
      @extend .base-section;

      .supply-chain-intro {
        @extend .base-subsection__content;
        margin-bottom: 16px;
      }

      .supply-subsection {
        @extend .base-subsection;
        margin-bottom: 16px;

        .supply-subtitle {
          @extend .base-subsection__title;
        }

        .supply-item {
          @extend .base-list-item;

          .supply-bullet {
            @extend .base-list-item__bullet;
          }

          .supply-text {
            @extend .base-list-item__text;
          }
        }
      }
    }

    // 确保inspection和supply使用相同的样式
    .government-inspection-section,
    .supply-chain-section {

      .inspection-subsection,
      .supply-subsection {
        margin-bottom: 16px;
        margin-left: 10px;

        .inspection-subtitle,
        .supply-subtitle {
          font-size: 14px;
          font-weight: bold;
          color: $text-primary;
          margin-bottom: 8px;
          @include flex-start;
          display: flex;
          align-items: center;

          img {
            @include icon-size(14px);
            margin-right: 6px;
            margin-top: 1px;
            flex-shrink: 0;
          }
        }
      }
    }

    // 特殊样式保留
    .legal-business-risk-section,
    .related-enterprise-risk-section {
      .risk-analysis-content {
        .risk-item-header {
          color: $primary-color;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .risk-warning-box {
          background: #e8f4fd;
          border: 2px dashed $primary-color;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;

          p {
            margin: 0;
            color: #1565c0;
            font-weight: 500;
            text-align: center;

            strong {
              color: #d32f2f;
            }
          }
        }

        .risk-details {
          margin-bottom: 20px;

          .risk-detail-title {
            font-size: 14px;
            font-weight: bold;
            color: $text-primary;
            margin-bottom: 12px;
          }

          .risk-detail-content {
            margin-left: 10px;

            .risk-point {
              @extend .base-icon-text;

              p {
                @extend .base-icon-text__content;
              }
            }

            .risk-list {
              list-style: none;
              padding: 0;
              margin: 0 0 0 20px;

              li {
                margin-bottom: 8px;
                position: relative;
                padding-left: 20px;
                color: $text-secondary;
                font-size: 14px;
                line-height: 1.6;

                &::before {
                  content: 'O';
                  position: absolute;
                  left: 0;
                  top: 0;
                  color: $secondary-color;
                  font-weight: bold;
                }
              }
            }
          }
        }

        .enterprise-risk-table {
          .table-header {
            color: $primary-color;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .risk-table-container {

            .risk-table,
            .related-risk-table {
              // 移除通用表格样式，使用原始的Element Plus表格样式
              width: 100%;

              :deep(.el-table__header) {
                th {
                  background-color: #5E9BFF !important;
                  color: white !important;
                  font-weight: 500;
                  font-size: 10px;
                  text-align: center;
                  padding: 8px 4px !important;
                  border: 1px solid rgba(255, 255, 255, 0.2) !important;
                  line-height: 1.2;

                  &:first-child {
                    background-color: #0071FF !important;
                  }

                  &:nth-child(2) {
                    background-color: #308BFE !important;
                  }

                  .cell {
                    padding: 4px 2px;
                    line-height: 1.1;
                    font-size: 9px;
                    text-align: center;
                  }
                }
              }

              :deep(.el-table__body) {
                tbody {
                  tr {
                    &:nth-child(even) {
                      background-color: $background-light;
                    }

                    &:hover>td {
                      background-color: #e3f2fd !important;
                    }
                  }

                  td {
                    padding: 6px 4px !important;
                    text-align: center;
                    border: 1px solid $border-color !important;
                    font-size: 10px;
                    color: $text-primary;
                    line-height: 1.1;

                    .cell {
                      padding: 0;
                      line-height: 1.1;
                      font-size: 9px;
                      word-break: break-word;
                    }
                  }
                }
              }

              :deep(.el-table--border) {
                border: 1px solid $border-color;

                &::after,
                &::before {
                  display: none;
                }
              }

              // 确保表格列宽度适应内容
              :deep(.el-table__cell) {
                padding: 4px 2px !important;
              }
            }
          }
        }
      }
    }
  }

  @media print {
    .report-container {
      font-size: 12px;
      overflow: visible;
      min-height: auto;
    }

    .report-section {
      page-break-inside: avoid;
    }

    .chart-placeholder {
      height: 200px !important;
    }
  }
}

:global(html, body) {
  height: auto;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

:global(#app) {
  height: auto;
  min-height: 100vh;
}
</style>
