<template>
	<div class="report-container" :style="mobileScaleStyle" ref="reportContainer">
		<!-- 报告封面 -->
		<div class="report-page cover-page">
			<!-- 封面左上角logo -->
			<div class="report-cover-logo">
				<img :src="reportData.reportCoverLogo || coverLogo" alt="" />
			</div>
			<!-- 封面 -->
			<img src="https://lyy-saas-oss.oss-cn-beijing.aliyuncs.com/arreport/converText/reportCover.png" alt="" />
			<!-- 封面中间test -->
			<div class="report-cover-text">
				<img :src="reportData.reportCoverText || coverText" alt="" />
			</div>
			<!-- 封面底部技术支持文字 -->
			<div class="report-cover-support" v-if="reportData.reportCoverSupport">
				<span>技术支持：{{ reportData.reportCoverSupport }}</span>
			</div>
		</div>

		<!-- 动态生成的内容页面 -->
		<template v-for="(pageContent, pageIndex) in contentPages" :key="`page-${pageIndex}`">
			<div
				class="report-page combined-content-page"
				:class="getPageBackgroundClass(pageContent)"
				:style="`${enableAutoPaging && 'max-height: 297mm;height: 297mm;'}`"
			>
				<div class="report-page_header">
					<img src="@/assets/image/headerLogo.png" alt="Logo" />
				</div>
				<div class="report-pageOne-content" v-html="pageContent"></div>
				<!-- 页码 -->
				<div class="report-page-number page-footer">
					<span>第 {{ pageIndex + 1 }} 页</span>
				</div>
			</div>
		</template>

		<!-- 如果没有动态页面，显示原始合并页面 -->
		<div v-if="contentPages.length === 0" class="report-page combined-content-page" :class="getStaticPageBackgroundClass()">
			<div class="report-page_header">
				<img src="@/assets/image/headerLogo.png" alt="Logo" />
			</div>
			<div class="report-pageOne-content">
				<div class="company-analysis-container">
					<!-- 公司标题部分 -->
					<div class="company-header">
						<div class="company-info">
							<div class="company-logo">
								<div class="logo-circle">
									<!-- 如果没有logo取公司名称前四个字，如果包含括号则只取括号前的文字 -->
									<span class="logo-text">{{ reportData.companyLogo || (reportData.companyName?.split('(')[0] || reportData.companyName)?.slice(0, 4) }}</span>
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
						<div class="analysis-cards" :class="{ 'two-cards': !reportData.companyStarRatingDesc }">
							<div v-if="reportData.companyStarRatingDesc" class="analysis-card small-enterprise">
								<div class="card-header">{{ reportData.companyStarRatingDesc }}</div>
								<div class="card-rating" style="margin-bottom: 0px">
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
					<h2 class="section-title">公司简介 <img src="@/assets/image/companyProfileLogo.png" alt="" /></h2>
				</div>
				<!-- 动态渲染Markdown格式的公司简介 -->
				<div class="markdown-content" v-html="parsedMdData(reportData.industry)"></div>

				<!-- 如果没有Markdown数据，显示占位符 -->
				<div v-if="!parsedMdData(reportData.industry)" class="placeholder-text">公司简介内容加载中...</div>
				<!-- 动态渲染Markdown格式的公司简介 -->
				<div class="markdown-content" v-html="parsedMdData(reportData.companyProfile)"></div>

				<!-- 如果没有Markdown数据，显示占位符 -->
				<div v-if="!parsedMdData(reportData.companyProfile)" class="placeholder-text">公司简介内容加载中...</div>
				<!-- 页面底部信息 -->
				<!-- <div class="page-footer">
          <div class="footer-text">报告生成日期：2025/06/05</div>
          <div class="footer-watermark">内容由AI生成，仅供参考</div>
        </div> -->
				<!-- 第一部分标题 -->
				<div class="pageOne-content-header">
					<img src="@/assets/image/pageTitle1.png" alt="" />
					<div class="content-header-card">
						<div class="rating-card">
							<div class="rating-upper">
								<span class="rating-grade">{{ reportData.dynamics }}</span>
								<div class="rating-stars">
									<el-rate v-model="investmentPotentialValueComputed" disabled />
								</div>
								<div class="rating-status">{{ investmentPotentialText }}</div>
							</div>
							<div class="rating-below">
								<p style="font-size: 16px; font-weight: 600">企业综合选址动力评级</p>
								<p style="margin-left: 10px">选址动力范围为 D1~D10，评级越高，企业选址动力越强</p>
							</div>
						</div>
					</div>
				</div>
				<!-- 01宏观动力 -->
				<div class="enterprise-dynamics-section">
					<div class="section-header">
						<img src="@/assets/image/pageTitle101.png" alt="" />
					</div>
				</div>
				<!-- 动态渲染Markdown格式的宏观动力 -->
				<div class="markdown-content" v-html="parsedMdData(reportData.macroDimension)"></div>

				<!-- 如果没有Markdown数据，显示占位符 -->
				<div v-if="!parsedMdData(reportData.macroDimension)" class="placeholder-text">宏观动力内容加载中...</div>
				<!-- 02企业动态 -->
				<div class="enterprise-dynamics-section">
					<div class="section-header">
						<img src="@/assets/image/pageTitle102.png" alt="" />
					</div>
				</div>
				<!-- 动态渲染Markdown格式的企业动态 -->
				<div class="markdown-content" v-html="parsedMdData(reportData.selfDimension)"></div>

				<!-- 如果没有Markdown数据，显示占位符 -->
				<div v-if="!parsedMdData(reportData.selfDimension)" class="placeholder-text">宏观动力内容加载中...</div>
				<!-- 03招引策略 -->
				<div class="enterprise-dynamics-section">
					<div class="section-header">
						<img src="@/assets/image/pageTitle103.png" alt="" />
					</div>
				</div>
				<!-- 动态渲染Markdown格式的招引策略 -->
				<div class="markdown-content" v-html="parsedMdData(reportData.strategy)"></div>

				<!-- 如果没有Markdown数据，显示占位符 -->
				<div v-if="!parsedMdData(reportData.strategy)" class="placeholder-text">宏观动力内容加载中...</div>

				<!-- 第二部分标题 -->
				<div class="pageOne-content-header">
					<img src="@/assets/image/pageTitle2.png" alt="" />
					<div class="content-header-card risk-analysis-card">
						<div class="rating-card">
							<div class="rating-upper">
								<span class="rating-grade risk-grade">{{ reportData.riskDate }}</span>
								<div class="rating-stars">
									<div class="star-display">
										<el-rate v-model="riskRatingValueComputed" disabled />
									</div>
								</div>
								<div class="rating-status risk-status">{{ riskRatingText }}</div>
							</div>
							<div class="rating-below">
								<p style="font-size: 16px; font-weight: 600">企业综合风险评级</p>
								<p style="margin-left: 10px">风险评级范围为 E1~E10，评级越高，企业投资风险越高</p>
							</div>
						</div>
					</div>
				</div>
				<!--  -->
				<div class="related-enterprise-risk-section">
					<div class="section-header">
						<img src="@/assets/image/pageTitle201.png" alt="" />
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
								<p>
									企业共扫描出 <strong>{{ reportData.riskJusticeCount }}</strong> 个异常提醒，其中重要风险
									<strong>{{ reportData.riskJusticeImportantCount }}</strong> 个。
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="risk-details">
					<h4 class="risk-detail-title">详情分析</h4>
				</div>
				<div class="markdown-content" v-html="parsedMdData(reportData.riskJustice)"></div>

				<div v-if="!parsedMdData(reportData.riskJustice)" class="placeholder-text">详情分析内容加载中...</div>
				<!-- 关联企业风险 -->
				<div class="related-enterprise-risk-section">
					<div class="section-header">
						<img src="@/assets/image/pageTitle202.png" alt="" />
					</div>
				</div>
				<div class="related-enterprise-risk-section">
					<!-- 企业司法、经营风险 -->
					<div class="legal-business-risk-section">
						<!-- 风险分析 -->
						<div class="risk-analysis-content">
							<div class="risk-item-header">【风险分析】</div>
							<div class="risk-warning-box">
								<p>
									公司关联企业共有 <strong>{{ reportData.relatedCompanyCount }}</strong> 家，共扫描出
									<strong>{{ reportData.relatedCompanyRiskCount }}</strong> 个风险提醒，其中重要风险有<strong>{{
										reportData.relatedCompanyImportantRiskCount
									}}</strong
									>个
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="risk-details">
					<h4 class="risk-detail-title">详情分析</h4>
				</div>
				<div class="markdown-content" v-html="parsedMdData(reportData.riskRelatedJustice)"></div>

				<div v-if="!parsedMdData(reportData.riskRelatedJustice)" class="placeholder-text">详情分析内容加载中...</div>
				<!-- 财务及风险管理 -->
				<div class="financial-risk-management-section">
					<div class="section-header">
						<img style="margin-top: 25px" src="@/assets/image/pageTitle203.png" alt="" />
					</div>
				</div>
				<div class="markdown-content" v-html="parsedMdData(reportData.riskFinancial)"></div>

				<div v-if="!parsedMdData(reportData.riskFinancial)" class="placeholder-text">财务及风险管理内容加载中...</div>
				<!-- 行业及竞争风险 -->
				<div class="industry-competitive-risk-section">
					<div class="section-header">
						<img src="@/assets/image/pageTitle204.png" alt="" />
					</div>
				</div>
				<div class="markdown-content" v-html="parsedMdData(reportData.riskIndustryPolicy)"></div>

				<div v-if="!parsedMdData(reportData.riskIndustryPolicy)" class="placeholder-text">行业及竞争风险计内容加载中...</div>
				<!-- 第三部分 -->
				<div class="pageOne-content-header">
					<img src="@/assets/image/pageTitle3.png" alt="" />
				</div>
				<div class="markdown-content" v-html="parsedMdData(reportData.componetsReport1)"></div>

				<div v-if="!parsedMdData(reportData.componetsReport1)" class="placeholder-text">内容加载中...</div>
				<div class="markdown-content" v-html="parsedMdData(reportData.componetsReport2)"></div>

				<div v-if="!parsedMdData(reportData.componetsReport2)" class="placeholder-text">内容加载中...</div>
			</div>
		</div>

		<!-- 报告封底 -->
		<div class="report-page cover-page">
			<!-- 版权所有 -->
			<div class="report-cover-copyright" v-if="reportData.copyright">@版权所有：{{ reportData.copyright }}</div>
			<!-- 版权声明 -->
			<div class="report-cover-copyrightNotice" v-if="reportData.copyrightStatement">
				{{ reportData.copyrightStatement }}
			</div>
			<img src="https://lyy-saas-oss.oss-cn-beijing.aliyuncs.com/arreport/converText/reportCover0.png" alt="" />
		</div>
	</div>
</template>

<script setup lang="ts" name="reportDetail">
import { reactive, onMounted, ref, nextTick, computed, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useReportApi } from '@/api/report/index';
import { mockReportData, mockApiCall } from '@/mock/reportData';
import MarkdownIt from 'markdown-it';

// 图片数据
import coverLogo from '@/assets/image/reportCoverLogo.png';
import coverText from '@/assets/image/reportCoverText.png';

import minHangCoverText from '@/assets/image/reportCoverText-minhang.png';
import minHangCoverLogo from '@/assets/image/reportCoverLogo-minhang.png';
import songJiangCoverText from '@/assets/image/reportCoverText-songjiang.png';
import songJiangCoverLogo from '@/assets/image/reportCoverLogo-songjiang.png';
import langFangCoverText from '@/assets/image/reportCoverText-langfang.png';
import langFangCoverLogo from '@/assets/image/reportCoverLogo-langfang.png';
import guanCoverText from '@/assets/image/reportCoverText-guan.png';
import guanCoverLogo from '@/assets/image/reportCoverLogo-guan.png';
import xinYuCoverText from '@/assets/image/reportCoverText-xinyu.png';
import xinYuCoverLogo from '@/assets/image/reportCoverLogo-xinyu.png';

// 初始化Markdown解析器
const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
	breaks: true,
});

// 获取路由参数
const route = useRoute();
const reportId = route.params.id as string;

// 自动分页开关(根据地址栏是否有enableAutoPaging参数)
const enableAutoPaging = ref(route.query.enableAutoPaging ? route.query.enableAutoPaging == '1' : false); // 默认关闭自动分页

// 报告数据
const reportData = reactive<any>({
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
			commercialAerospace: [],
		},
		impact: [],
	},
	policyImpact: {
		overallImpact: {
			marketOpportunity: [],
			technicalInnovation: [],
			costActual: [],
		},
	},
	enterpriseDynamics: {
		marketExpansion: {
			description: '',
			keyMatters: [],
		},
		capitalOperation: {
			description: '',
		},
		marketPenetration: [],
	},
	governmentInspection: {
		overallOperation: [],
		policyImplementation: [],
	},
	supplyChain: {
		introduction: '',
		customerExpansion: [],
		coordinationOptimization: [],
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
		relatedRiskList: [],
	},
	financialRiskManagement: {
		riskDesignTitle: '',
		certaintyLocation: {
			title: '',
			probability: '',
			customerTypeSupport: {
				title: '',
				items: [],
			},
		},
	},
	industryCompetitiveRisk: {
		riskDesignTitle: '',
		establishmentInfo: {
			establishmentTime: '',
			teamComposition: '',
			businessPositioning: '',
		},
		levelOneRiskTitle: '',
		certaintyLocationExpansion: {
			title: '',
			probability: '',
			customerCapacityExpansion: {
				title: '',
				items: [],
			},
		},
	},
	componetsReport2: '',
	componetsReport1: '',
	riskDate: '',
	industry: '',
	companyProfile: '',
	dynamics: '',
	macroDimension: '',
	selfDimension: '',
	strategy: '',
	riskJustice: '',
	riskRelatedJustice: '',
	riskFinancial: '',
	riskIndustryPolicy: '',
	companyStarRating: '',
	reportCoverSupport: '',
	reportCopyright: '',
	reportCopyrightNotice: '',
	mainUnit: '',
});

// 根据不同参数显示不同封面text图片
const coverTextImage = computed(() => {
	return reportData.reportCoverText || coverText; // 默认封面text图片

	// switch (reportData.mainUnit) {
	//   case 'minhang':
	//     return minHangCoverText;
	//   case 'songjiang':
	//     return songJiangCoverText;
	//   case 'langfang':
	//     return langFangCoverText;
	//   case 'guan':
	//     return guanCoverText;
	//   case 'xinyu':
	//     return xinYuCoverText;
	//   default:
	//     return coverText;
	// }
});

// 根据不同参数显示不同封面logo图片
const coverLogoImage = computed(() => {
	return reportData.reportCoverLogo || coverLogo; // 默认封面logo

	// switch (reportData.mainUnit) {
	//   case 'minhang':
	//     return minHangCoverLogo;
	//   case 'songjiang':
	//     return songJiangCoverLogo;
	//   case 'langfang':
	//     return langFangCoverLogo;
	//   case 'guan':
	//     return guanCoverLogo;
	//   case 'xinyu':
	//     return xinYuCoverLogo;
	//   default:
	//     return coverLogo;
	// }
});

// 评分分值除以2
const ratingValueComputed = computed(() => {
	return reportData.companyStarRating / 2;
});
// 企业综合选址动力评级评分分值除以2
const investmentPotentialValueComputed = computed(() => {
	const dynamicsValue = reportData.dynamics;
	if (!dynamicsValue) return 0;

	// 提取数字部分，如 "D7" -> 7
	const match = dynamicsValue.match(/D(\d+)/i);
	if (!match) return 0;

	const level = parseInt(match[1]);
	return level / 2; // 除以2以适应评分组件
});

// 企业综合风险评级评分分值除以2
const riskRatingValueComputed = computed(() => {
	const riskValue = reportData.riskDate;
	if (!riskValue) return 0;

	// 提取数字部分，如 "E3" -> 3
	const match = riskValue.match(/E(\d+)/i);
	if (!match) return 0;

	const level = parseInt(match[1]);
	return level / 2; // 除以2以适应评分组件
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

// API实例
const reportApi = useReportApi();

// 页面高度设置（mm转px，大约1mm = 3.78px）
const PAGE_HEIGHT = 297 * 3.78; // A4页面高度
const HEADER_HEIGHT = 100; // 页头高度
const FOOTER_HEIGHT = 80; // 页脚高度
const CONTENT_MAX_HEIGHT = PAGE_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT; // 可用内容高度

/**
 * 获取元素的完整高度（包括 margin、padding、border 和内容）
 * @param {HTMLElement} element - 要测量的元素
 * @param {Object} options - 配置选项
 * @param {boolean} options.includeMargin - 是否包括 margin，默认 true
 * @param {boolean} options.useBoundingRect - 是否使用 getBoundingClientRect，默认 true（更精确，支持小数）
 * @returns {number} 完整高度（像素）
 */
const getCompleteHeight = (element: HTMLElement, options: any = {}) => {
	const { includeMargin = true, useBoundingRect = true } = options;

	if (!element || !(element instanceof HTMLElement)) {
		console.warn('getCompleteHeight: 无效的元素参数');
		return 0;
	}

	try {
		const computedStyle = window.getComputedStyle(element);

		// 获取基础高度（内容 + padding + border）
		let baseHeight = 0;

		if (useBoundingRect) {
			// 使用 getBoundingClientRect 获取更精确的高度（支持小数）
			baseHeight = element.getBoundingClientRect().height;
		} else {
			// 使用 offsetHeight（整数）
			baseHeight = element.offsetHeight;
		}

		// 如果需要包括 margin
		if (includeMargin) {
			const marginTop = parseFloat(computedStyle.marginTop) || 0;
			const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
			const totalMargin = marginTop + marginBottom;

			console.log(`📏 元素高度详情:`, {
				tagName: element.tagName,
				className: element.className || '无class',
				baseHeight: Math.round(baseHeight * 100) / 100,
				marginTop: Math.round(marginTop * 100) / 100,
				marginBottom: Math.round(marginBottom * 100) / 100,
				totalHeight: Math.round((baseHeight + totalMargin) * 100) / 100,
			});

			return baseHeight + totalMargin;
		}

		return baseHeight;
	} catch (error) {
		console.error('getCompleteHeight: 计算高度时出错', error);
		return 0;
	}
};

/**
 * 在指定容器环境中测量元素高度
 * @param {HTMLElement} element - 要测量的元素
 * @param {Object} options - 配置选项
 * @param {string} options.containerClass - 容器CSS类名，默认 'report-pageOne-content'
 * @param {string} options.containerStyle - 额外的容器样式
 * @param {boolean} options.includeMargin - 是否包括 margin，默认 true
 * @returns {Promise<number>} 测量的高度
 */
const measureElementInContext = async (element: HTMLElement, options = {}) => {
	const { containerClass = 'report-pageOne-content', containerStyle = 'padding: 0 64px 25px 64px; width: 210mm;', includeMargin = true } = options;

	return new Promise<number>((resolve) => {
		// 创建临时测量容器
		const tempContainer = document.createElement('div');
		tempContainer.className = containerClass;
		tempContainer.style.cssText = `
      position: absolute;
      visibility: hidden;
      top: 0;
      left: -9999px;
      ${containerStyle}
    `;

		// 克隆要测量的元素
		const clonedElement = element.cloneNode(true) as HTMLElement;
		tempContainer.appendChild(clonedElement);
		document.body.appendChild(tempContainer);

		// 等待一帧确保样式完全应用
		requestAnimationFrame(() => {
			const height = getCompleteHeight(clonedElement, { includeMargin });

			// 清理临时元素
			document.body.removeChild(tempContainer);

			resolve(height);
		});
	});
};

/**
 * 批量测量多个元素的高度
 * @param {HTMLElement[]} elements - 要测量的元素数组
 * @param {Object} options - 配置选项
 * @returns {Promise<number[]>} 高度数组
 */
const batchMeasureHeights = async (elements: HTMLElement[], options = {}) => {
	const heights: number[] = [];

	for (const element of elements) {
		const height = await measureElementInContext(element, options);
		heights.push(height);
	}

	return heights;
};

// 动态页面数组
const contentPages = ref<string[]>([]);

// 判断是否为强制分页元素
const isForcePageBreak = (element: HTMLElement): boolean => {
	// 只检查是否有 pageOne-content-header 类名
	if (element.classList.contains('pageOne-content-header')) {
		console.log(`🔍 检测到主要页面标题，进行强制分页:`, element.className);
		return true;
	}

	// 明确排除所有小标题类型的元素
	const isSmallSection =
		element.classList.contains('enterprise-dynamics-section') ||
		element.classList.contains('related-enterprise-risk-section') ||
		element.classList.contains('financial-risk-management-section') ||
		element.classList.contains('industry-competitive-risk-section') ||
		element.classList.contains('risk-analysis-section') ||
		element.classList.contains('legal-business-risk-section') ||
		element.classList.contains('investment-regional-preference-section') ||
		element.classList.contains('government-inspection-section') ||
		element.classList.contains('supply-chain-section');

	if (isSmallSection) {
		console.log(`📝 检测到小标题，不进行强制分页:`, element.className);
		return false;
	}

	// 其他所有元素都不强制分页
	return false;
};

// 根据页面内容判断页面类型，返回对应的背景类名
const getPageBackgroundClass = (pageContent: string): string => {
	// 检查是否是第一页（包含公司分析容器）
	if (pageContent.includes('company-analysis-container')) {
		return 'page-first';
	}
	// 检查是否包含大标题（pageOne-content-header）
	if (pageContent.includes('pageOne-content-header')) {
		return 'page-with-main-title';
	}
	// 其他内容页面
	return 'page-data-content';
};

// 获取静态页面（未分页时）的背景类
const getStaticPageBackgroundClass = (): string => {
	// 检查页面是否包含公司分析容器，如果有则是第一页
	const hasCompanyAnalysis = document.querySelector('.company-analysis-container');
	if (hasCompanyAnalysis) {
		return 'page-first';
	}

	// 检查是否有大标题
	const hasMainTitle = document.querySelector('.pageOne-content-header');
	if (hasMainTitle) {
		return 'page-with-main-title';
	}

	// 默认使用数据内容页背景
	return 'page-data-content';
};

// 创建页面HTML（修改版，添加页面类型标识）
const createPageHTML = (elements: HTMLElement[], pageType?: string): string => {
	return elements.map((element) => element.outerHTML).join('');
};

// 基于实际DOM高度优化页面
const optimizePagesByActualHeight = (pages: string[]): string[] => {
	const optimized: string[] = [];
	const MIN_PAGE_HEIGHT = CONTENT_MAX_HEIGHT * 0.3; // 30%最小高度
	const MAX_MERGE_HEIGHT = CONTENT_MAX_HEIGHT * 0.9; // 90%最大合并高度

	console.log(`🚀 开始页面优化，最小高度: ${Math.round(MIN_PAGE_HEIGHT)}px`);

	for (let i = 0; i < pages.length; i++) {
		const currentPage = pages[i];

		// 创建临时元素测量实际高度
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = currentPage;
		tempDiv.style.position = 'absolute';
		tempDiv.style.visibility = 'hidden';
		tempDiv.style.width = '210mm';
		tempDiv.style.left = '-9999px';
		document.body.appendChild(tempDiv);

		const pageRect = tempDiv.getBoundingClientRect();
		const actualPageHeight = getCompleteHeight(tempDiv, { includeMargin: true });
		// const actualPageHeight = pageRect.height;
		document.body.removeChild(tempDiv);

		console.log(`📊 页面 ${i + 1} 实际高度: ${Math.round(actualPageHeight)}px`);

		// 如果页面高度过小且不是最后一页，尝试与下一页合并
		if (actualPageHeight < MIN_PAGE_HEIGHT && i < pages.length - 1) {
			const nextPage = pages[i + 1];

			// 测试合并效果
			const mergeTestDiv = document.createElement('div');
			mergeTestDiv.innerHTML = currentPage + nextPage;
			mergeTestDiv.style.position = 'absolute';
			mergeTestDiv.style.visibility = 'hidden';
			mergeTestDiv.style.width = '210mm';
			mergeTestDiv.style.left = '-9999px';
			document.body.appendChild(mergeTestDiv);

			const mergedRect = mergeTestDiv.getBoundingClientRect();
			const mergedHeight = getCompleteHeight(mergeTestDiv, { includeMargin: true });
			// const mergedHeight = mergedRect.height;
			document.body.removeChild(mergeTestDiv);

			if (mergedHeight <= MAX_MERGE_HEIGHT) {
				console.log(`🔄 合并页面 ${i + 1} 和 ${i + 2}，合并后高度: ${Math.round(mergedHeight)}px`);
				optimized.push(currentPage + nextPage);
				i++; // 跳过下一页
			} else {
				console.log(`❌ 无法合并，合并后高度过大: ${Math.round(mergedHeight)}px`);
				optimized.push(currentPage);
			}
		} else {
			optimized.push(currentPage);
		}
	}

	console.log(`🎉 页面优化完成：${pages.length} -> ${optimized.length} 页`);
	return optimized;
};

// 新的分页逻辑：先渲染完整内容，再基于实际DOM高度分页
const createDynamicPagesFromRenderedContent = async () => {
	nextTick(async () => {
		console.log('\n🚀 开始基于实际DOM高度的智能分页');

		const contentContainer = document.querySelector('.report-pageOne-content');
		if (!contentContainer) {
			console.error('❌ 未找到内容容器');
			return;
		}

		// 获取所有已渲染的子元素
		const allElements = Array.from(contentContainer.children) as HTMLElement[];
		console.log(`📋 找到 ${allElements.length} 个已渲染的元素`);

		const pages: string[] = [];
		let currentPageElements: HTMLElement[] = [];
		let currentPageHeight = 0;
		let pageNumber = 1;

		console.log(`📏 分页参数: 最大内容高度=${CONTENT_MAX_HEIGHT}px`);

		for (let i = 0; i < allElements.length; i++) {
			const element = allElements[i];

			// 获取元素的实际渲染高度
			const elementRect = element.getBoundingClientRect();
			const actualHeight = getCompleteHeight(element, { includeMargin: true });
			// const actualHeight = elementRect.height;

			console.log(`\n📖 处理元素 ${i + 1}/${allElements.length}:`, {
				className: element.className || '无class',
				tagName: element.tagName,
				actualHeight: Math.round(actualHeight),
				currentPageHeight: Math.round(currentPageHeight),
			});

			// 检查是否是强制分页的标题
			if (isForcePageBreak(element) && currentPageElements.length > 0) {
				// 保存当前页面
				pages.push(createPageHTML(currentPageElements));
				console.log(`💾 强制分页：保存页面 ${pageNumber}，高度: ${Math.round(currentPageHeight)}px`);
				pageNumber++;

				// 开始新页面
				currentPageElements = [element.cloneNode(true) as HTMLElement];
				currentPageHeight = actualHeight;
				console.log(`🆕 开始新页面，添加强制分页元素`);
			}
			// 检查是否能放入当前页面
			else if (currentPageHeight + actualHeight <= CONTENT_MAX_HEIGHT) {
				// 可以放入当前页面
				currentPageElements.push(element.cloneNode(true) as HTMLElement);
				currentPageHeight += actualHeight;
				console.log(`✅ 添加到当前页面，新高度: ${Math.round(currentPageHeight)}px`);

				// 添加安全检查：如果添加后超出页面高度，需要立即分页
				if (currentPageHeight > CONTENT_MAX_HEIGHT) {
					console.log(`⚠️ 页面高度溢出检测: ${Math.round(currentPageHeight)}px > ${Math.round(CONTENT_MAX_HEIGHT)}px`);

					// 移除刚添加的元素
					currentPageElements.pop();
					currentPageHeight -= actualHeight;

					// 保存当前页面
					if (currentPageElements.length > 0) {
						pages.push(createPageHTML(currentPageElements));
						console.log(`💾 保存溢出页面 ${pageNumber}，高度: ${Math.round(currentPageHeight)}px`);
						pageNumber++;
					}

					// 开始新页面，添加被移除的元素
					currentPageElements = [element.cloneNode(true) as HTMLElement];
					currentPageHeight = actualHeight;
					console.log(`🆕 开始新页面（溢出处理），元素高度: ${Math.round(actualHeight)}px`);
				}
			} else {
				// 无法放入当前页面，需要分页处理
				console.log(`🔀 元素无法放入当前页面，需要分页处理`);

				// 计算剩余页面高度
				const remainingHeight = CONTENT_MAX_HEIGHT - currentPageHeight;
				console.log(`📐 当前页面剩余高度: ${Math.round(remainingHeight)}px，元素高度: ${Math.round(actualHeight)}px`);

				// 如果剩余高度超过30px，尝试智能拆分
				if (remainingHeight > 30) {
					console.log(`🔧 尝试智能拆分以利用剩余空间`);
					const splitResult = smartSplitElement(element, remainingHeight);

					if (splitResult.canFitInCurrentPage && currentPageElements.length > 0) {
						// 部分内容可以放入当前页面
						currentPageElements.push(splitResult.currentPagePart!);
						pages.push(createPageHTML(currentPageElements));
						console.log(`💾 保存当前页面 ${pageNumber}（含拆分元素），高度: ${Math.round(currentPageHeight + splitResult.currentPageHeight)}px`);
						pageNumber++;

						// 处理剩余部分
						if (splitResult.nextPageParts && splitResult.nextPageParts.length > 0) {
							console.log(`🔄 开始处理拆分后的剩余部分`);

							const firstRemainingPart = splitResult.nextPageParts[0];

							// 🔧 改进的高度计算方法：使用与父容器相同的样式环境
							const tempContainer = document.createElement('div');
							tempContainer.className = 'report-pageOne-content'; // 使用相同的容器类名
							tempContainer.style.position = 'absolute';
							tempContainer.style.visibility = 'hidden';
							tempContainer.style.width = '210mm';
							tempContainer.style.left = '-9999px';
							tempContainer.style.top = '0';
							tempContainer.style.padding = '0 64px 25px 64px'; // 应用页面的实际padding

							// 克隆剩余部分并保持所有样式
							const clonedRemainingPart = firstRemainingPart.cloneNode(true) as HTMLElement;
							tempContainer.appendChild(clonedRemainingPart);
							document.body.appendChild(tempContainer);

							// 等待一帧确保样式完全应用
							await new Promise((resolve) => requestAnimationFrame(resolve));

							// const remainingPartHeight = clonedRemainingPart.getBoundingClientRect().height;
							const remainingPartHeight = getCompleteHeight(clonedRemainingPart, { includeMargin: true });

							// 清理临时元素
							document.body.removeChild(tempContainer);

							console.log(`📏 剩余部分实际高度: ${Math.round(remainingPartHeight)}px，页面限制: ${Math.round(CONTENT_MAX_HEIGHT)}px`);

							// 动态计算安全余量：基于元素类型和内容复杂度
							let SAFETY_MARGIN;
							const elementType = firstRemainingPart.tagName.toLowerCase();
							const hasComplexContent =
								firstRemainingPart.children.length > 3 || (firstRemainingPart.textContent && firstRemainingPart.textContent.length > 200);

							if (elementType === 'ul' || elementType === 'ol') {
								SAFETY_MARGIN = hasComplexContent ? 50 : 25; // 列表元素
							} else if (elementType === 'div' && firstRemainingPart.classList.contains('markdown-content')) {
								SAFETY_MARGIN = hasComplexContent ? 150 : 30; // Markdown内容
							} else if (remainingPartHeight < 80) {
								SAFETY_MARGIN = 10; // 很小的元素
							} else if (remainingPartHeight < 200) {
								SAFETY_MARGIN = 20; // 小元素
							} else if (remainingPartHeight < 400) {
								SAFETY_MARGIN = 35; // 中等元素
							} else {
								SAFETY_MARGIN = 50; // 大元素
							}

							const adjustedRemainingHeight = remainingPartHeight + SAFETY_MARGIN;

							console.log(
								`🛡️ 智能安全余量: ${SAFETY_MARGIN}px (元素类型:${elementType}, 复杂内容:${hasComplexContent}, 基础高度:${Math.round(remainingPartHeight)}px)，调整后高度: ${Math.round(adjustedRemainingHeight)}px`
							);

							// 优化检查阈值：确保页面利用率合理
							const MAX_REMAINING_RATIO = 0.75; // 降低到75%，给后续元素留更多空间
							const availableSpace = CONTENT_MAX_HEIGHT - adjustedRemainingHeight;
							const utilizationRatio = adjustedRemainingHeight / CONTENT_MAX_HEIGHT;

							console.log(`📊 页面利用率分析: 剩余元素占用${Math.round(utilizationRatio * 100)}%, 可用空间${Math.round(availableSpace)}px`);

							if (adjustedRemainingHeight <= CONTENT_MAX_HEIGHT * MAX_REMAINING_RATIO && availableSpace > 100) {
								// 将剩余部分设置为当前页面的起点
								currentPageElements = [firstRemainingPart.cloneNode(true) as HTMLElement];

								// 使用实际测量的高度，而不是调整后的高度，避免累积误差
								currentPageHeight = remainingPartHeight;

								console.log(
									`✅ 剩余部分设为新页面起点，实际高度: ${Math.round(remainingPartHeight)}px，剩余空间: ${Math.round(CONTENT_MAX_HEIGHT - remainingPartHeight)}px (${Math.round((1 - remainingPartHeight / CONTENT_MAX_HEIGHT) * 100)}%可用)`
								);

								// 处理额外的剩余部分（如果有多个）
								if (splitResult.nextPageParts.length > 1) {
									const extraParts = splitResult.nextPageParts.slice(1);
									const extraPages = processRemainingParts(extraParts);
									pages.push(...extraPages);
									pageNumber += extraPages.length;
									console.log(`📄 额外剩余部分生成 ${extraPages.length} 个页面`);
								}
							} else {
								// 剩余部分过大，直接保存为独立页面
								pages.push(firstRemainingPart.outerHTML);
								pageNumber++;
								currentPageElements = [];
								currentPageHeight = 0;
								console.log(
									`📄 剩余部分过大(${Math.round(adjustedRemainingHeight)}px > ${Math.round(CONTENT_MAX_HEIGHT * MAX_REMAINING_RATIO)}px 或可用空间不足${Math.round(availableSpace)}px)，保存为独立页面 ${pageNumber - 1}`
								);

								// 处理额外的剩余部分
								if (splitResult.nextPageParts.length > 1) {
									const extraParts = splitResult.nextPageParts.slice(1);
									const extraPages = processRemainingParts(extraParts);
									pages.push(...extraPages);
									pageNumber += extraPages.length;
									console.log(`📄 额外剩余部分生成 ${extraPages.length} 个页面`);
								}
							}
						}
					} else {
						console.log(`❌ 智能拆分失败，直接开始新页面`);
						// 保存当前页面并开始新页面
						if (currentPageElements.length > 0) {
							pages.push(createPageHTML(currentPageElements));
							console.log(`💾 保存当前页面 ${pageNumber}，剩余空间: ${Math.round(remainingHeight)}px`);
							pageNumber++;
						}

						// 开始新页面
						currentPageElements = [element.cloneNode(true) as HTMLElement];
						currentPageHeight = actualHeight;
						console.log(`🆕 开始新页面，元素高度: ${Math.round(actualHeight)}px`);
					}
				} else {
					console.log(`📏 剩余空间太小 (${Math.round(remainingHeight)}px)，直接开始新页面`);
					// 保存当前页面并开始新页面
					if (currentPageElements.length > 0) {
						pages.push(createPageHTML(currentPageElements));
						console.log(`💾 保存当前页面 ${pageNumber}，剩余空间: ${Math.round(remainingHeight)}px`);
						pageNumber++;
					}

					// 检查单个元素是否超过页面限制
					if (actualHeight > CONTENT_MAX_HEIGHT) {
						console.log(`⚠️ 单个元素过大 (${Math.round(actualHeight)}px)，进行深度拆分`);

						// 深度拆分大元素
						const splitPages = deepSplitLargeElement(element);
						if (splitPages.length > 0) {
							pages.push(...splitPages);
							pageNumber += splitPages.length;
							console.log(`📄 元素深度拆分成功，生成 ${splitPages.length} 个页面`);
						} else {
							// 拆分失败，强制添加
							pages.push(element.outerHTML);
							pageNumber++;
							console.log(`⚠️ 元素拆分失败，强制添加到单独页面`);
						}

						// 重置当前页面
						currentPageElements = [];
						currentPageHeight = 0;
					} else {
						// 开始新页面
						currentPageElements = [element.cloneNode(true) as HTMLElement];
						currentPageHeight = actualHeight;
						console.log(`🆕 开始新页面，高度: ${Math.round(actualHeight)}px`);
					}
				}
			}
		}

		// 保存最后一页
		if (currentPageElements.length > 0) {
			pages.push(createPageHTML(currentPageElements));
			console.log(`💾 保存最后一页 ${pageNumber}，高度: ${Math.round(currentPageHeight)}px`);
		}

		// 页面优化：合并过小的页面
		const optimizedPages = optimizePagesByActualHeight(pages);

		console.log(`\n🎉 基于实际DOM高度的分页完成!`);
		console.log(`📊 分页统计:`, {
			原始页数: pages.length,
			优化后页数: optimizedPages.length,
			原始元素数: allElements.length,
		});

		contentPages.value = optimizedPages;
		console.log(`✅ 分页结果已保存到组件状态`);
	});
};

// 智能拆分元素以充分利用剩余空间
const smartSplitElement = (element: HTMLElement, remainingHeight: number) => {
	const result = {
		canFitInCurrentPage: false,
		currentPagePart: null as HTMLElement | null,
		currentPageHeight: 0,
		nextPageParts: [] as HTMLElement[],
	};

	// 降低剩余高度阈值，更积极地利用空间
	if (remainingHeight < 50) {
		// 从100降低到50
		console.log(`📐 剩余高度过小 (${Math.round(remainingHeight)}px)，跳过拆分`);
		return result;
	}

	console.log(`🔧 尝试智能拆分元素，剩余高度: ${Math.round(remainingHeight)}px`, {
		tagName: element.tagName,
		className: element.className,
		childrenCount: element.children.length,
	});

	// 对于任何包含子元素的容器，都尝试拆分
	if (element.children.length > 0) {
		console.log(`📦 拆分容器元素，包含 ${element.children.length} 个子元素`);
		return splitContainerElementRecursively(element, remainingHeight);
	}

	// 对于文本元素，尝试按段落拆分
	if (element.tagName === 'P' || element.tagName === 'DIV') {
		console.log(`📄 拆分文本元素: ${element.tagName}`);
		return splitTextElement(element, remainingHeight);
	}

	console.log(`❌ 元素类型不支持拆分: ${element.tagName}`);
	return result;
};

// 递归拆分容器元素
const splitContainerElementRecursively = (element: HTMLElement, remainingHeight: number) => {
	const result = {
		canFitInCurrentPage: false,
		currentPagePart: null as HTMLElement | null,
		currentPageHeight: 0,
		nextPageParts: [] as HTMLElement[],
	};

	const children = Array.from(element.children) as HTMLElement[];
	let currentHeight = 0;
	let currentPageChildren: HTMLElement[] = [];
	let remainingElements: HTMLElement[] = [];

	console.log(`🔄 开始递归拆分容器，剩余高度: ${Math.round(remainingHeight)}px，子元素数: ${children.length}`);

	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		// const childHeight = child.getBoundingClientRect().height;
		const childHeight = getCompleteHeight(child, { includeMargin: true });

		console.log(`📝 处理子元素 ${i + 1}/${children.length}:`, {
			tagName: child.tagName,
			className: child.className,
			height: Math.round(childHeight),
			currentHeight: Math.round(currentHeight),
		});

		// 如果子元素可以完整放入当前页面
		if (currentHeight + childHeight <= remainingHeight) {
			currentPageChildren.push(child.cloneNode(true) as HTMLElement);
			currentHeight += childHeight;
			console.log(`✅ 子元素完整放入，新高度: ${Math.round(currentHeight)}px`);
		}
		// 如果子元素过高，尝试拆分
		else if (childHeight > remainingHeight - currentHeight) {
			const childRemainingHeight = remainingHeight - currentHeight;

			// 只有当剩余高度足够大时才尝试拆分子元素
			if (childRemainingHeight > 80 && canSplitElement(child)) {
				console.log(`🔨 尝试拆分过高的子元素，剩余高度: ${Math.round(childRemainingHeight)}px`);

				const childSplitResult = smartSplitElementRecursively(child, childRemainingHeight);

				if (childSplitResult.canFitInCurrentPage && childSplitResult.currentPagePart) {
					// 将子元素的拆分部分添加到当前页面
					currentPageChildren.push(childSplitResult.currentPagePart);
					currentHeight += childSplitResult.currentPageHeight;
					console.log(`✅ 子元素拆分成功，部分放入当前页面，高度: ${Math.round(childSplitResult.currentPageHeight)}px`);

					// 将剩余部分和后续元素都加入待处理列表
					if (childSplitResult.nextPageParts.length > 0) {
						remainingElements.push(...childSplitResult.nextPageParts);
					}
					remainingElements.push(...children.slice(i + 1));
					break;
				} else {
					console.log(`❌ 子元素拆分失败，加入剩余列表`);
					// 拆分失败，将当前元素和后续元素都加入剩余列表
					remainingElements.push(...children.slice(i));
					break;
				}
			} else {
				console.log(`📋 剩余高度不足或元素不可拆分，加入剩余列表`);
				// 将当前元素和后续元素都加入剩余列表
				remainingElements.push(...children.slice(i));
				break;
			}
		}
	}

	// 如果有元素放入了当前页面
	if (currentPageChildren.length > 0) {
		const container = element.cloneNode(false) as HTMLElement;
		currentPageChildren.forEach((child) => container.appendChild(child));
		result.canFitInCurrentPage = true;
		result.currentPagePart = container;
		result.currentPageHeight = currentHeight;
		console.log(`✅ 容器拆分成功，当前页面高度: ${Math.round(currentHeight)}px`);
	}

	// 处理剩余元素
	if (remainingElements.length > 0) {
		console.log(`📦 处理 ${remainingElements.length} 个剩余元素`);
		const remainingContainer = element.cloneNode(false) as HTMLElement;
		remainingElements.forEach((child) => {
			// 如果是HTMLElement，直接克隆；否则可能是拆分后的部分
			if (child instanceof HTMLElement && child.parentNode) {
				remainingContainer.appendChild(child.cloneNode(true));
			} else {
				remainingContainer.appendChild(child);
			}
		});
		result.nextPageParts = [remainingContainer];
	}

	return result;
};

// 递归智能拆分元素（新增函数）
const smartSplitElementRecursively = (element: HTMLElement, remainingHeight: number) => {
	const result = {
		canFitInCurrentPage: false,
		currentPagePart: null as HTMLElement | null,
		currentPageHeight: 0,
		nextPageParts: [] as HTMLElement[],
	};

	console.log(`🔄 递归拆分元素:`, {
		tagName: element.tagName,
		className: element.className,
		remainingHeight: Math.round(remainingHeight),
	});

	// 对于列表元素，按条目拆分
	if (element.tagName === 'UL' || element.tagName === 'OL') {
		return splitListElementRecursively(element, remainingHeight);
	}

	// 对于其他容器元素
	if (element.children.length > 0) {
		return splitContainerElementRecursively(element, remainingHeight);
	}

	// 对于文本元素
	if (element.tagName === 'P' || element.tagName === 'DIV') {
		return splitTextElementRecursively(element, remainingHeight);
	}

	return result;
};

// 递归拆分列表元素
const splitListElementRecursively = (element: HTMLElement, remainingHeight: number) => {
	const result = {
		canFitInCurrentPage: false,
		currentPagePart: null as HTMLElement | null,
		currentPageHeight: 0,
		nextPageParts: [] as HTMLElement[],
	};

	const listItems = Array.from(element.children) as HTMLElement[];
	let currentHeight = 0;
	let currentPageItems: HTMLElement[] = [];
	let remainingItems: HTMLElement[] = [];
	let currentItemIndex = 0; // 跟踪当前处理的项目索引

	console.log(`📋 递归拆分列表，包含 ${listItems.length} 个条目`);

	// 获取列表的起始序号（如果是有序列表）
	const isOrderedList = element.tagName === 'OL';
	let startNumber = 1;
	if (isOrderedList && element.hasAttribute('start')) {
		startNumber = parseInt(element.getAttribute('start') || '1', 10);
	}

	for (let i = 0; i < listItems.length; i++) {
		const item = listItems[i];
		// const itemHeight = item.getBoundingClientRect().height;
		const itemHeight = getCompleteHeight(item, { includeMargin: true });

		console.log(`📝 处理列表项 ${i + 1}/${listItems.length}:`, {
			height: Math.round(itemHeight),
			currentHeight: Math.round(currentHeight),
			itemIndex: currentItemIndex,
		});

		// 如果条目可以完整放入
		if (currentHeight + itemHeight <= remainingHeight) {
			currentPageItems.push(item.cloneNode(true) as HTMLElement);
			currentHeight += itemHeight;
			currentItemIndex++;
			console.log(`✅ 列表项完整放入，新高度: ${Math.round(currentHeight)}px`);
		}
		// 如果单个条目过高，尝试拆分条目内容
		else if (itemHeight > remainingHeight - currentHeight) {
			const itemRemainingHeight = remainingHeight - currentHeight;

			// 如果条目内容很复杂且剩余空间足够，尝试拆分
			if (itemRemainingHeight > 60 && (item.children.length > 0 || (item.textContent && item.textContent.length > 100))) {
				console.log(`🔨 尝试拆分复杂列表项，剩余高度: ${Math.round(itemRemainingHeight)}px`);

				const itemSplitResult = smartSplitElementRecursively(item, itemRemainingHeight);

				if (itemSplitResult.canFitInCurrentPage && itemSplitResult.currentPagePart) {
					currentPageItems.push(itemSplitResult.currentPagePart);
					currentHeight += itemSplitResult.currentPageHeight;
					console.log(`✅ 列表项拆分成功，部分放入当前页面`);

					// 处理拆分后的剩余部分和后续条目
					if (itemSplitResult.nextPageParts.length > 0) {
						// 为拆分的剩余部分创建一个特殊的标记，保持同一个序号
						const splitRemainingItems = itemSplitResult.nextPageParts.map((part) => {
							const wrapper = {
								element: part,
								isSplitContinuation: true,
								originalIndex: currentItemIndex, // 保持原始索引
							};
							return wrapper;
						});
						remainingItems.push(...(splitRemainingItems as any));
					}

					// 后续的完整条目需要递增索引
					const followingItems = listItems.slice(i + 1).map((item, idx) => {
						return {
							element: item,
							isSplitContinuation: false,
							originalIndex: currentItemIndex + 1 + idx,
						};
					});
					remainingItems.push(...(followingItems as any));
					currentItemIndex++; // 当前项已处理完毕
					break;
				} else {
					console.log(`❌ 列表项拆分失败`);
					remainingItems.push(
						...(listItems.slice(i).map((item, idx) => ({
							element: item,
							isSplitContinuation: false,
							originalIndex: currentItemIndex + idx,
						})) as any)
					);
					break;
				}
			} else {
				console.log(`📋 列表项不适合拆分或空间不足`);
				remainingItems.push(
					...(listItems.slice(i).map((item, idx) => ({
						element: item,
						isSplitContinuation: false,
						originalIndex: currentItemIndex + idx,
					})) as any)
				);
				break;
			}
		}
	}

	// 构建当前页面的列表
	if (currentPageItems.length > 0) {
		const currentList = element.cloneNode(false) as HTMLElement;

		// 为有序列表设置正确的起始序号
		if (isOrderedList) {
			currentList.setAttribute('start', startNumber.toString());
		}

		currentPageItems.forEach((item) => currentList.appendChild(item));
		result.canFitInCurrentPage = true;
		result.currentPagePart = currentList;
		result.currentPageHeight = currentHeight;
		console.log(`✅ 列表拆分成功，当前页面包含 ${currentPageItems.length} 个条目`);
	}

	// 构建剩余部分的列表
	if (remainingItems.length > 0) {
		console.log(`📋 处理剩余列表，包含 ${remainingItems.length} 个条目`);

		// 计算剩余列表的起始序号
		let nextStartNumber = startNumber + currentItemIndex;

		// 如果第一个剩余项是拆分的延续，保持原序号
		const firstRemainingItem = remainingItems[0] as any;
		if (firstRemainingItem.isSplitContinuation) {
			nextStartNumber = startNumber + firstRemainingItem.originalIndex;
		}

		const remainingList = element.cloneNode(false) as HTMLElement;

		// 为有序列表设置正确的起始序号
		if (isOrderedList) {
			remainingList.setAttribute('start', nextStartNumber.toString());
		}

		remainingItems.forEach((itemWrapper: any) => {
			const item = itemWrapper.element || itemWrapper;
			if (item instanceof HTMLElement && item.parentNode) {
				remainingList.appendChild(item.cloneNode(true));
			} else {
				remainingList.appendChild(item);
			}
		});

		result.nextPageParts = [remainingList];
		console.log(`📋 剩余列表包含 ${remainingItems.length} 个条目，起始序号: ${nextStartNumber}`);
	}

	return result;
};

// 判断元素是否可以拆分
const canSplitElement = (element: HTMLElement): boolean => {
	// 列表元素可以拆分
	if (element.tagName === 'UL' || element.tagName === 'OL') {
		return element.children.length > 1;
	}

	// 包含多个子元素的容器可以拆分
	if (element.children.length > 1) {
		return true;
	}

	// 长文本元素可以拆分
	if ((element.tagName === 'P' || element.tagName === 'DIV') && element.textContent && element.textContent.length > 100) {
		return true;
	}

	// 包含复杂内容的单子元素容器
	if (element.children.length === 1) {
		const child = element.children[0] as HTMLElement;
		return canSplitElement(child);
	}

	return false;
};

// 拆分文本元素
const splitTextElement = (element: HTMLElement, remainingHeight: number) => {
	const result = {
		canFitInCurrentPage: false,
		currentPagePart: null as HTMLElement | null,
		currentPageHeight: 0,
		nextPageParts: [] as HTMLElement[],
	};

	const text = element.textContent || '';
	if (text.length < 50) {
		console.log(`📄 文本过短，跳过拆分`);
		return result;
	}

	console.log(`📄 拆分文本元素，文本长度: ${text.length}`);

	// 按段落或句子拆分
	const sentences = text.split(/([。！？；\.\!\?;])/);
	let currentText = '';
	let remainingText = '';
	let foundSplit = false;

	for (let i = 0; i < sentences.length; i += 2) {
		const sentence = sentences[i] || '';
		const delimiter = sentences[i + 1] || '';
		const testText = currentText + sentence + delimiter;

		// 测试高度
		const testElement = element.cloneNode(false) as HTMLElement;
		testElement.textContent = testText;
		testElement.style.position = 'absolute';
		testElement.style.visibility = 'hidden';
		testElement.style.width = '210mm';
		testElement.style.left = '-9999px';
		document.body.appendChild(testElement);

		// const testHeight = testElement.getBoundingClientRect().height;
		const testHeight = getCompleteHeight(testElement, { includeMargin: true });
		document.body.removeChild(testElement);

		if (testHeight <= remainingHeight) {
			currentText = testText;
		} else {
			remainingText = sentences.slice(i).join('');
			foundSplit = true;
			break;
		}
	}

	if (foundSplit && currentText.trim()) {
		const currentPart = element.cloneNode(false) as HTMLElement;
		currentPart.textContent = currentText;
		result.canFitInCurrentPage = true;
		result.currentPagePart = currentPart;

		// 测量实际高度
		currentPart.style.position = 'absolute';
		currentPart.style.visibility = 'hidden';
		currentPart.style.width = '210mm';
		currentPart.style.left = '-9999px';
		document.body.appendChild(currentPart);
		// result.currentPageHeight = currentPart.getBoundingClientRect().height;
		result.currentPageHeight = getCompleteHeight(currentPart, { includeMargin: true });
		document.body.removeChild(currentPart);

		// 重置样式
		currentPart.style.position = '';
		currentPart.style.visibility = '';
		currentPart.style.width = '';
		currentPart.style.left = '';

		if (remainingText.trim()) {
			const remainingPart = element.cloneNode(false) as HTMLElement;
			remainingPart.textContent = remainingText;
			result.nextPageParts = [remainingPart];
		}

		console.log(`✅ 文本拆分成功，当前部分: ${currentText.length} 字符`);
	}

	return result;
};

// 深度拆分大元素
const deepSplitLargeElement = (element: HTMLElement): string[] => {
	const pages: string[] = [];
	console.log(`🔧 开始深度拆分大元素: ${element.tagName}`);

	// 如果元素包含子元素，递归拆分每个子元素
	if (element.children.length > 0) {
		const children = Array.from(element.children) as HTMLElement[];
		let currentPageElements: HTMLElement[] = [];
		let currentPageHeight = 0;

		for (const child of children) {
			// const childHeight = child.getBoundingClientRect().height;
			const childHeight = getCompleteHeight(child, { includeMargin: true });

			if (currentPageHeight + childHeight <= CONTENT_MAX_HEIGHT) {
				currentPageElements.push(child.cloneNode(true) as HTMLElement);
				currentPageHeight += childHeight;
			} else {
				// 保存当前页面
				if (currentPageElements.length > 0) {
					const container = element.cloneNode(false) as HTMLElement;
					currentPageElements.forEach((el) => container.appendChild(el));
					pages.push(container.outerHTML);
				}

				// 开始新页面
				currentPageElements = [child.cloneNode(true) as HTMLElement];
				currentPageHeight = childHeight;
			}
		}

		// 保存最后一页
		if (currentPageElements.length > 0) {
			const container = element.cloneNode(false) as HTMLElement;
			currentPageElements.forEach((el) => container.appendChild(el));
			pages.push(container.outerHTML);
		}
	} else {
		// 对于没有子元素的大元素，直接添加
		pages.push(element.outerHTML);
	}

	console.log(`✅ 深度拆分完成，生成 ${pages.length} 个页面`);
	return pages;
};

// 处理剩余部分
const processRemainingParts = (parts: HTMLElement[]): string[] => {
	const pages: string[] = [];

	for (const part of parts) {
		pages.push(part.outerHTML);
	}

	return pages;
};

const handleAutoPagingChange = (value: string | number | boolean) => {
	const boolValue = Boolean(value);
	console.log('自动分页开关状态:', boolValue);

	if (boolValue) {
		// 开启自动分页 - 基于已渲染的DOM进行分页
		nextTick(() => {
			setTimeout(() => {
				createDynamicPagesFromRenderedContent();
			}, 100);
		});
	} else {
		// 关闭自动分页，清空动态页面
		contentPages.value = [];
	}
};

// Markdown解析器函数
const parsedMdData = (mdContent: string): string => {
	if (!mdContent) return '';
	return md.render(mdContent);
};

// 获取报告数据
const fetchReportData = async () => {
	try {
		console.log('开始获取报告数据，ID:', reportId);

		// 这里可以使用真实的API调用
		// const data = await mockApiCall(reportId);
		// 模拟API调用
		const data = await reportApi.getReportDetail(reportId);
		if (data.code == 200) {
			// 更新报告数据
			Object.assign(reportData, data.data);

			console.log('报告数据获取成功');

			// 如果启用了自动分页，在数据加载完成后进行分页
			if (enableAutoPaging.value) {
				nextTick(() => {
					setTimeout(() => {
						createDynamicPagesFromRenderedContent();
					}, 500); // 给更多时间让DOM完全渲染
				});
			}
		}
	} catch (error) {
		console.error('获取报告数据失败:', error);
		// 使用模拟数据作为后备
		Object.assign(reportData, mockReportData);
	}
};

// 移动端缩放样式
const mobileScaleStyle = ref<{ transform?: string; height?: string }>({});

const applyMobileScale = () => {
	if (window.innerWidth <= 767) {
		const scale = window.innerWidth / 794; // 210mm ≈ 794px
		mobileScaleStyle.value = {
			transform: `scale(${scale})`,
			height: `${window.innerHeight / scale}px`,
		};
	} else {
		mobileScaleStyle.value = {};
	}
};

// 生命周期钩子
onMounted(async () => {
	await fetchReportData();
	applyMobileScale();

	window.addEventListener('resize', applyMobileScale);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', applyMobileScale);
});

// 监听路由变化，如果enableAutoPaging参数改变，更新自动分页状态
watch(
	() => route.query.enableAutoPaging,
	(newValue) => {
		const newState = newValue ? newValue == '1' : false;
		if (enableAutoPaging.value !== newState) {
			enableAutoPaging.value = newState;
			handleAutoPagingChange(newState);
		}
	}
);
</script>

<style scoped lang="scss">
// SCSS变量定义
$primary-color: #4285f4;
$secondary-color: #007bff;
$success-color: #165dff;
$warning-color: #ffc107;
$danger-color: #dc3545;
$text-primary: #333;
$text-secondary: #555;
$text-light: #666;
$text-muted: #86909c;
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
	margin-bottom: 10px;
}

@mixin icon-size($size: 16px) {
	width: $size;
	height: $size;
	flex-shrink: 0;
}

// Markdown内容样式
:deep(.markdown-content) {
	margin-bottom: 20px;

	line-height: 1.8 !important;

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

	// 表格样式
	table {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 2px solid #e8eaed;

		// 表头样式
		thead {
			tr {
				th {
					background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
					color: white;
					font-weight: 600;
					font-size: 12px;
					text-align: center;
					padding: 12px 8px;
					border: 1px solid rgba(255, 255, 255, 0.2);
					position: relative;
					line-height: 1.3;

					// 为不同列添加不同的渐变色
					&:first-child {
						background: linear-gradient(135deg, #2c5aa0 0%, #1e3f73 100%);
					}

					&:nth-child(2) {
						background: linear-gradient(135deg, #3a7bc8 0%, #2d5f99 100%);
					}

					&:nth-child(3) {
						background: linear-gradient(135deg, #5ba0f2 0%, #4682b4 100%);
					}

					// 添加边框分隔线
					&:not(:last-child)::after {
						content: '';
						position: absolute;
						right: 0;
						top: 20%;
						bottom: 20%;
						width: 1px;
						background: rgba(255, 255, 255, 0.3);
					}
				}
			}
		}

		// 表体样式
		tbody {
			tr {
				transition: all 0.2s ease;

				&:nth-child(even) {
					background-color: #fafbfc;
				}

				&:nth-child(odd) {
					background-color: #ffffff;
				}

				&:hover {
					background-color: #e8f4fd !important;
					transform: translateY(-1px);
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				}

				td {
					padding: 10px 8px;
					text-align: center;
					border: 1px solid #e8eaed;
					font-size: 11px;
					color: #2c3e50;
					line-height: 1.4;
					transition: all 0.2s ease;

					// 第一列样式（通常是标题列）
					&:first-child {
						font-weight: 600;
						color: #1565c0;
						background-color: rgba(21, 101, 192, 0.04);
						text-align: left;
						padding-left: 12px;
					}

					// 数字类型的单元格
					&.number-cell {
						font-family: 'Consolas', 'Monaco', monospace;
						font-weight: 600;
						color: #e67e22;
					}

					// 状态类型的单元格
					&.status-cell {
						font-weight: 500;

						&.success {
							color: #27ae60;
							background-color: rgba(39, 174, 96, 0.1);
						}

						&.warning {
							color: #f39c12;
							background-color: rgba(243, 156, 18, 0.1);
						}

						&.danger {
							color: #e74c3c;
							background-color: rgba(231, 76, 60, 0.1);
						}
					}

					// 强调文本
					strong {
						color: #1565c0;
						font-weight: 600;
					}

					// 链接样式
					a {
						color: #4a90e2;
						text-decoration: none;

						&:hover {
							text-decoration: underline;
						}
					}
				}
			}
		}

		// 表格标题（如果有caption）
		caption {
			font-size: 14px;
			font-weight: 600;
			color: #2c3e50;
			margin-bottom: 8px;
			text-align: left;
			padding: 8px 0;
		}
	}

	ul,
	ol {
		list-style: none; // 完全取消默认列表样式
		padding-left: 30px; // 增加左边距为自定义marker留出空间
		margin: 8px 0;

		li {
			position: relative; // 必须设置为相对定位
			line-height: 1.6;
			color: $text-secondary;
			margin-bottom: 8px;

			// 取消默认的 marker 样式
			&::marker {
				display: none !important;
			}

			// 默认显示自定义图片marker
			&::before {
				content: '';
				position: absolute;
				left: -20px;
				top: 6px;
				width: 12px;
				height: 12px;
				background-image: url('@/assets/image/briefIntroductionlogo.png');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
				flex-shrink: 0;
				display: block;
			}

			// 特殊处理：如果li包含p标签（通常是标题），隐藏li的默认marker
			&:has(> p) {
				&::before {
					display: none !important;
				}

				// 为p标签添加自定义图片marker
				> p {
					position: relative;
					// padding-left: 20px;
					margin-bottom: 8px;

					&::before {
						content: '';
						position: absolute;
						left: -20px;
						top: 6px;
						width: 12px;
						height: 12px;
						background-image: url('@/assets/image/briefIntroductionlogo.png');
						background-size: contain;
						background-repeat: no-repeat;
						background-position: center;
						flex-shrink: 0;
						display: block;
					}

					// 如果p标签包含strong，调整样式
					strong {
						font-weight: 600;
						color: $text-primary;
					}
				}

				// 嵌套列表的特殊样式
				> ul,
				> ol {
					margin-top: 8px;
					margin-left: 0;
					padding-left: 20px;

					li {
						// 嵌套列表使用蓝色圆圈
						&::before {
							content: '';
							position: absolute;
							left: -15px;
							top: 8px;
							width: 8px;
							height: 8px;
							background-color: #4a90e2;
							border-radius: 50%;
							background-image: none !important;
							display: block !important;
						}

						// 为嵌套列表项添加左边距
						padding-left: 0;
						margin-bottom: 6px;
						font-size: 13px;
						line-height: 1.5;
					}
				}
			}

			// 如果li直接包含ul/ol（没有p标签），隐藏marker
			&:has(> ul:first-child),
			&:has(> ol:first-child) {
				&::before {
					display: none !important;
				}
			}

			// 普通嵌套列表的样式
			ul,
			ol {
				margin-top: 8px;
				margin-bottom: 8px;
				padding-left: 0px;

				li {
					&::before {
						display: block !important;
						left: -18px;
					}
				}
			}
		}
	}

	// 兼容性处理：如果浏览器不支持:has()选择器
	ul li.has-paragraph {
		&::before {
			display: none !important;
		}

		> p {
			position: relative;
			// padding-left: 20px;
			margin-bottom: 8px;

			&::before {
				content: '';
				position: absolute;
				left: -20px;
				top: 6px;
				width: 12px;
				height: 12px;
				background-image: url('@/assets/image/briefIntroductionlogo.png');
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;
				flex-shrink: 0;
				display: block;
			}

			strong {
				font-weight: 600;
				color: $text-primary;
			}
		}

		> ul li,
		> ol li {
			&::before {
				content: '';
				position: absolute;
				left: -15px;
				top: 8px;
				width: 8px;
				height: 8px;
				background-color: #4a90e2;
				border-radius: 50%;
				background-image: none !important;
				display: block !important;
			}
		}
	}

	// 有序列表保持数字显示
	ol {
		// 嵌套在ol中的ul仍然显示图片marker或蓝色圆圈
		li {
			> p + ul li::before,
			ul li::before {
				content: '';
				position: absolute;
				left: -15px;
				top: 8px;
				width: 8px;
				height: 8px;
				background-color: #4a90e2;
				border-radius: 50%;
				background-image: none !important;
				display: block !important;
			}
		}
	}

	strong {
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

	& > *:first-child {
		margin-top: 0;
	}

	& > *:last-child {
		margin-bottom: 0;
	}
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
			// font-weight: 600;
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
		// margin-bottom: 15px;

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
	// margin-bottom: 15px;

	img {
		max-width: 100%;
		height: auto;
	}
}

.base-table {
	:deep(.el-table__header) {
		th {
			background-color: #5e9bff !important;
			color: white !important;

			font-weight: 500;
			font-size: 12px;
			text-align: center;
			border: 1px solid rgba(255, 255, 255, 0.2) !important;

			&:first-child {
				background-color: #0071ff !important;
			}

			&:nth-child(2) {
				background-color: #308bfe !important;
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

				&:hover > td {
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
	transition:
		transform 0.3s ease,
		height 0.3s ease;

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
		position: relative;

		// 移除原有的静态背景设置
		// background: url('@/assets/image/backgroundOfTheFirstPage.png') no-repeat center center;
		// background-size: cover;

		// 修复封面页样式 - 使用类名而不是位置选择器
		&.cover-page {
			padding: 0;
			background: none;
		}

		// 第一页背景（静态内容页）
		&.page-first {
			background: url('https://lyy-saas-oss.oss-cn-beijing.aliyuncs.com/arreport/converText/backgroundOfTheFirstPage.png') no-repeat center center;
			background-size: cover;
		}

		// 包含大标题的页面背景
		&.page-with-main-title {
			background: url('https://lyy-saas-oss.oss-cn-beijing.aliyuncs.com/arreport/converText/pageBackImg.png') no-repeat center center;
			background-size: cover;
		}

		// 普通数据内容页背景
		&.page-data-content {
			background: url('https://lyy-saas-oss.oss-cn-beijing.aliyuncs.com/arreport/converText/pageDataBackImg.png') no-repeat center center;
			background-size: cover;
		}

		// 保留原有的兼容样式
		&:not(.cover-page):not(.combined-content-page) {
			background: url('https://lyy-saas-oss.oss-cn-beijing.aliyuncs.com/arreport/converText/pageBackImg.png') no-repeat center center;
			background-size: cover;
		}
	}

	.cover-page {
		text-align: center;
		color: white;
		display: flex;
		justify-content: center;
		position: relative;
		font-family:
			PingFang SC,
			PingFang SC;

		img {
			max-width: 100%;
			height: auto;
		}

		.report-cover-logo {
			// width: 136px;
			height: 31px;
			position: absolute;
			left: 38px;
			top: 20px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.report-cover-text {
			width: 100%;
			position: absolute;
			top: 90px;
			left: 50%;
			transform: translateX(-50%);

			img {
				width: 100%;
				height: 100%;
			}
		}

		.report-cover-support {
			position: absolute;
			bottom: 36px;
			left: 50%;
			transform: translateX(-50%);

			span {
				font-weight: 500;
				font-size: 14px;
				color: #254777 !important;
			}
		}

		.report-cover-copyright {
			position: absolute;
			top: 230px;
			left: 77px;
			font-weight: 600;
			font-size: 17px;
			color: #000000;
			text-align: left;
			font-family:
				PingFang SC,
				PingFang SC;
		}

		.report-cover-copyrightNotice {
			width: 80%;
			position: absolute;
			top: 320px;
			left: 50%;
			right: 50%;
			transform: translateX(-50%);
			text-align: left;
			font-weight: 400;
			font-family:
				PingFang SC,
				PingFang SC;
			font-size: 15px;
			color: #576372;
			line-height: 2;
			text-align: left;
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
						width: 64px;
						height: 64px;
						background: linear-gradient(127deg, #1f6aff 0%, #5eceff 100%);
						border-radius: 10px 10px 10px 10px;
						border: 2px solid rgba(40, 120, 255, 0.1);

						display: flex;
						align-items: center;
						justify-content: center;
						box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

						.logo-text {
							color: white;
							text-align: center;
							line-height: 1.2;
							width: 32px;
							height: 44px;
							font-family:
								PingFang SC,
								PingFang SC;
							font-weight: 500;
							font-size: 16px;
							line-height: 22px;
							text-shadow: 0px 0px 4px rgba(4, 37, 134, 0.4);
							text-align: left;
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
							border-radius: 2px 2px 2px 2px;
							font-size: 11px;
							font-weight: 500;
							color: #266eff;

							&.tag-green {
								background: #27ae60;
							}

							&.tag-blue {
								background: #e6ebfb;
								border-radius: 2px 2px 2px 2px;
							}
						}
					}
				}
			}

			.company-meta {
				font-family:
					PingFang SC,
					PingFang SC;
				font-weight: 400;
				font-size: 13px;
				color: #1d2129;
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

				&.two-cards {
					grid-template-columns: repeat(2, 1fr);
				}

				.analysis-card {
					border-radius: 8px;

					.card-header {
						font-size: 18px;
						font-weight: bold;
						margin-bottom: 6px;
						color: #026eff;
					}

					.card-rating {
						margin-bottom: 6px;

						.el-rate {
							height: 25px;
						}

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
								// color: #f39c12;
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
									background-color: #5e9bff !important;
									color: white !important;
									font-weight: 500;
									font-size: 10px;
									text-align: center;
									padding: 8px 4px !important;
									border: 1px solid rgba(255, 255, 255, 0.2) !important;
									line-height: 1.2;

									&:first-child {
										background-color: #0071ff !important;
									}

									&:nth-child(2) {
										background-color: #308bfe !important;
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

										&:hover > td {
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
