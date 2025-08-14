// 报告相关类型定义

// 基础信息
export interface CompanyInformation {
  name: string;
  logo?: string;
  tags: string[];
  legalRepresentative: string;
  registeredAddress: string;
}

// 相关分析
export interface CompanyAnalysis {
  enterpriseScale: string;
  investmentPotential: string;
  riskRating: string;
}

// 公司简介
export interface CompanyProfile {
  introduction: string;
  establishmentDate: string;
  organizationalStructure: string;
  businessScope: string;
  coreProducts: string[];
  shareholdingStructure: string;
  // 新增：支持Markdown格式的公司简介内容
  markdownContent?: string;
}

// 行业数据项
export interface IndustryItem {
  title: string;
  content: string;
}

// 行业趋势
export interface IndustryTrend {
  background: {
    description: string;
    newEnergyEquipment: IndustryItem[];
    commercialAerospace: IndustryItem[];
  };
  impact: IndustryItem[];
}

// 政策影响
export interface PolicyImpact {
  overallImpact: {
    marketOpportunity: string[];
    technicalInnovation: string[];
    costActual: string[];
  };
}

// 企业动态
export interface EnterpriseDynamics {
  marketExpansion: {
    description: string;
    keyMatters: string[];
  };
  capitalOperation: {
    description: string;
  };
  marketPenetration: string[];
}

// 政府考察
export interface GovernmentInspection {
  overallOperation: string[];
  policyImplementation: string[];
}

// 供应链
export interface SupplyChain {
  introduction: string;
  customerExpansion: string[];
  coordinationOptimization: string[];
}

// 风险数据
export interface RiskTableItem {
  year: number;
  totalSelfRisk: number;
  dishonestExecuted: number;
  taxViolation: number;
  productViolation: number;
  adminPunishment: number;
  restrictedConsumption: number;
  businessException: number;
  executed: number;
  caseInfo: number;
}

export interface RelatedRiskTableItem {
  companyType: string;
  relatedCompany: number;
  riskLevel: number;
  shareholdingRatio: number;
  taxViolation: number;
  productRecall: number;
  adminPunishment: number;
  restrictedConsumption: number;
  businessException: number;
  executed: number;
  caseInfo: number;
}

// 风险分析
export interface RiskAnalysis {
  warningCount: number;
  importantRiskCount: number;
  analysisDescription: string;
  riskList: string[];
  riskTableData: RiskTableItem[];
  relatedRiskTableData: RelatedRiskTableItem[];
  relatedWarningCount: number;
  relatedImportantRiskCount: number;
  relatedAnalysisDescription: string;
  relatedRiskList: string[];
}

// 财务及风险管理
export interface FinancialRiskManagement {
  riskDesignTitle: string;
  certaintyLocation: {
    title: string;
    probability: string;
    customerTypeSupport: {
      title: string;
      items: string[];
    };
  };
}

// 行业及竞争风险
export interface IndustryCompetitiveRisk {
  riskDesignTitle: string;
  establishmentInfo: {
    establishmentTime: string;
    teamComposition: string;
    businessPositioning: string;
  };
  levelOneRiskTitle: string;
  certaintyLocationExpansion: {
    title: string;
    probability: string;
    customerCapacityExpansion: {
      title: string;
      items: string[];
    };
  };
}

// 投资区域偏好项目
export interface RegionalPreferenceItem {
  label: string; // 字段标签，如"沿海新能源产业"
  content: string; // 具体内容
}

// 投资区域偏好分组
export interface RegionalPreferenceGroup {
  title: string; // 分组标题，如"(1) 现有布局特征"
  items: RegionalPreferenceItem[];
}

// 投资区域偏好
export interface InvestmentRegionalPreference {
  title: string; // 主标题，如"3.1 投资区域偏好"
  groups: RegionalPreferenceGroup[];
}

// 评级信息
export interface RatingInfo {
  ratingValue: number;
  riskRatingValue: number;
  comprehensiveRating: string;
  comprehensiveRatingDescription: string;
}

// 报告元数据
export interface ReportMetadata {
  generationDate: string;
  watermark: string;
}

// 完整报告数据
export interface ReportData {
  star: number;
  information: CompanyInformation;
  analysis: CompanyAnalysis;
  industryTrend: IndustryTrend;
  policyImpact: PolicyImpact;
  enterpriseDynamics: EnterpriseDynamics;
  governmentInspection: GovernmentInspection;
  supplyChain: SupplyChain;
  riskAnalysis: RiskAnalysis;
  financialRiskManagement: FinancialRiskManagement;
  industryCompetitiveRisk: IndustryCompetitiveRisk;
  investmentRegionalPreference: InvestmentRegionalPreference;
  ratingInfo: RatingInfo;
  metadata: ReportMetadata;
  // 新增：支持自定义属性
  [key: string]: any; // 支持自定义属性
}

// 添加模块化报告相关类型
export interface ReportModule {
  id: string;
  type: 'cover' | 'company-overview' | 'industry-analysis' | 'policy-impact' | 'enterprise-dynamics' | 'risk-analysis' | 'financial-management' | 'competitive-risk' | 'investment-preference';
  title: string;
  priority: number;
  data: any;
  estimatedHeight?: number;
  isBreakable?: boolean; // 是否可以跨页分割
}

export interface PageConfig {
  maxHeight: number; // A4页面最大内容高度
  headerHeight: number;
  footerHeight: number;
  marginTop: number;
  marginBottom: number;
}

export interface GeneratedPage {
  id: string;
  pageNumber: number;
  modules: ReportModule[];
  currentHeight: number;
  hasHeader: boolean;
  hasFooter: boolean;
}

export interface ReportLayoutConfig {
  pageConfig: PageConfig;
  moduleOrder: string[];
  autoBreak: boolean;
  preserveModuleIntegrity: boolean;
}