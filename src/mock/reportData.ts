import type { ReportData } from '@/types/report';

// 模拟报告数据
export const mockReportData: ReportData = {
  star: 4,
  information: {
    name: '华夏幸福基业控股股份有限公司',
    logo: 'https://example.com/logo.png',
    tags: ['存续', '专精特新', '高新企业'],
    legalRepresentative: '王文学',
    registeredAddress: '上海海市紫竹区金海公路 6055号1幢5层。',
  },
  analysis: {
    enterpriseScale: '小型企业',
    investmentPotential: 'D7',
    riskRating: 'E3',
  },
  companyProfile: {
    introduction: '公司坚持产业新城及相关业务,商业办公及相关业务双轮驱动,截至2019年6月底,公司资产规模超4500亿元。华夏幸福是产业新城服务商，深耕产业招商20余年，业务遍布多地，现有四大业务板块。',
    establishmentDate: '成立于2021年9月，总部位于北京市丰台区，依托华夏幸福产业资源体系，定位为"产业数字平台服务商"。',
    organizationalStructure: '核心团队具备产业大数据与Al技术复合背景，CEO赵泓宇主导AI选址大模型研发，董事长林成红(原华夏幸福高管)统筹资源整合。',
    businessScope: '业务定位：聚焦企业选址与政府招商数字化服务，覆盖全国2700个开发区、10万+产业园区资源，链接百万级企业选址需求与数十万招商从业者。',
    coreProducts: [
      '立业云：AI选址平台(企业版+经纪人版),提供空间选址、地图选址、Al智能推荐三种模式，直链园区对接人，实现企业选址成本降低30%、决策周期缩短70%。',
      '数字招商一体化平台：集成产业图谱、项目匹配、数据分析功能，覆盖200+产业链、6368个产业节点，已落地固安等地方政府项目。'
    ],
    shareholdingStructure: '聚焦企业选址与政府招商数字化服务，覆盖全国2700个开发区、10万+产业园区资源，链接百万级企业选址需求与数十万招商从业者。',
  },
  industryTrend: {
    background: {
      description: '中科航天集团(广东)有限公司的业务横跨新能源电力装备和商业航天产业配套两大核心领域，均属于国家战略性新兴产业，行业整体处于高速成长期，具体特征如下特征：',
      newEnergyEquipment: [
        {
          title: '技术基础',
          content: '随着电力、超导材料等关键技术不断突破制造的材料研发、国内仅有少数企业如特变电工、正泰电气实现规模化生产。'
        },
        {
          title: '市场情况',
          content: '2024年中国新能源电力装备市场规模超4127亿元，但高端市场仍被国外巨头。ABB等外企主导(占市场940%)。'
        },
        {
          title: '政策优先级',
          content: '纳入《"十四五"新型储能发展实施方案》《广东省培育新能源战略性新兴产业集群行动计划(2023-2025年)》等政策扶持。'
        }
      ],
      commercialAerospace: [
        {
          title: '技术迭代',
          content: '集团关联企业中科宇航的"力箭一号"火箭已实现96%成功率实现，2024年市场份额达70%,带动上游年均体验件、精密结构件需求激增。'
        },
        {
          title: '市场规模',
          content: '2024年中国商业航天产业规模突破2.3万亿元，火箭发射、卫星制造等核心环节年均增速超30%。'
        },
        {
          title: '区域重点',
          content: '广东提出2026年商业航天产业规模达3000亿元，广州南沙、重庆两江新区已成为重要产业集群。动力设备等产业转移。'
        }
      ]
    },
    impact: [
      {
        title: '资本驱动风险',
        content: '两大领域均属持续高投入发展X(占营收15%-20%),企业依赖政府补贴及外部融资，现金流压力显著。'
      },
      {
        title: '市场扩张机遇',
        content: '市场扩张机遇：新能源电力装备的国产替代需求(如特高压输变电设备)和商业航天的供应链本地化(如火箭用集成电路)为企业提供年 均25%以上的订单增长空间。'
      }
    ]
  },
  policyImpact: {
    overallImpact: {
      marketOpportunity: [
        '新能源行业需求：政府大力推进新能源输出容量共增长"资费标准"每年吸引超过500万元，企业可获取新增财税支持及合规审查的资源机会。',
        '政府试点推进、广东省高级政策"资费"要求2026年电减低精致市场值，确定新增需求对企业地区扩大5000万重工市场。'
      ],
      technicalInnovation: [
        '研发补助政策：重点针对超高导率材料行业投资入资，达3500万元产值，具有20%-30%重点物料耗材费可支持企业出口。',
        '技术体系化奖：起步以生产支持优化"输电"可深易度为原则，企业收益产生机构达-10%"C"，可能促进现有技术回报的激增。'
      ],
      costActual: [
        '计算服务成本：高技术企业15%的销售额销量，具备市场成本为实用性优程2000万元(2024年列报期的价格)。',
        '价格回测支成：政策支持创业结构建立当年(GAM)其中包技术支投计与国外巨头P&O万元/年。'
      ]
    }
  },
  enterpriseDynamics: {
    marketExpansion: {
      description: '中科航天集团(广东)有限公司的业务市场新能源装备制造业投资制造领域企业规模扩大大货流大。其顶出企业是自主的创新的对销产业机会，四的用销投资者基础。',
      keyMatters: [
        '建集团出中升提升2024年资机输配合同确定制9000万元，价机第一输"清宗小计具"要到2025年5月本算，等沈滑联重选器以标明。',
        '与龙金星成企合议改及中央定制合作，为能够企劳动交实验者群中方向技术设备供应结2个6-在准制1亿元。'
      ]
    },
    capitalOperation: {
      description: '中科航天集团(广东)有限公司的业务组织向新能源装备制造承部创新业务科的规模扩大实现。'
    },
    marketPenetration: [
      '集团在今年在该市场覆盖资料特色之后，2024年相业专用服务例收原结构增长20%，投资必要资源（民营促盈低/专利回报）人0.7年平走送13。'
    ]
  },
  governmentInspection: {
    overallOperation: [
      '2024年10月政府政策检查署预计时，督查主要就制度体制建设体系建设、政策保正工具系区维据呈方式仪次次流过此相情归开发区下引。',
      '广州高砂改革市化纸钢建双技术生产产线，申报给予业镇额结第50%伴资定计如总上缴收5000万元)。'
    ],
    policyImplementation: [
      '入股户"省"监督材料储存用基本定单号"深度单位、三年累计可故效劳对计621.2亿元。',
      '计算额将项目参量"第三发展性"级伪停直，预计2025-2027年平均额8000万元。'
    ]
  },
  supplyChain: {
    introduction: '聚能源电力装备制造展示，下游具体状况、展示看什么企业、在做什么，对企业的影响业务大体水小的模样，均属于国家战略性新兴产业，行业整体环有市场水平局限范围于该位置：',
    customerExpansion: [
      '主要客户包括政府机关策略平细评计总30%/年，审查创可前状议成员5件架月计5万元结在12万升，交快限纳四增志区之。',
      '围绕物流2025年计划网络供给制创QGW集团风力观备机计计1季期收自收送20&G2。'
    ],
    coordinationOptimization: [
      '与华士科技设备制造工厂（根号）空调电力设备材料财则新建进度率40%，物流成本降低低18%。',
      '警察新能许可电子情降级工情调况预，选择字居民总凭度单处，采购成本下键22%。'
    ]
  },
  riskAnalysis: {
    warningCount: 1,
    importantRiskCount: 23,
    analysisDescription: '中科航天集团(广东)有限公司的业务模块存在新能源电力装备制造和商业航天产业配套，均属于国家战略性新兴产业，行业整体处于高速成长期但同时面临以下特征：',
    riskList: [
      '中科航天集团(广东)有限公司业务风险；',
      '中科航天集团(广东)有限公司的业务条件存在人员风险,均需对可实施；',
      '中科航天集团(广东)有限公司的业务更新可可于更新管理；'
    ],
    riskTableData: [
      {
        year: 2025,
        totalSelfRisk: 0,
        dishonestExecuted: 0,
        taxViolation: 0,
        productViolation: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      },
      {
        year: 2024,
        totalSelfRisk: 0,
        dishonestExecuted: 0,
        taxViolation: 0,
        productViolation: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      },
      {
        year: 2023,
        totalSelfRisk: 0,
        dishonestExecuted: 0,
        taxViolation: 0,
        productViolation: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      },
      {
        year: 2022,
        totalSelfRisk: 0,
        dishonestExecuted: 0,
        taxViolation: 0,
        productViolation: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      },
      {
        year: 2019,
        totalSelfRisk: 0,
        dishonestExecuted: 0,
        taxViolation: 0,
        productViolation: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      }
    ],
    relatedRiskTableData: [
      {
        companyType: '股东（持股10%以上）',
        relatedCompany: 0,
        riskLevel: 0,
        shareholdingRatio: 0,
        taxViolation: 0,
        productRecall: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      },
      {
        companyType: '分支机构',
        relatedCompany: 0,
        riskLevel: 0,
        shareholdingRatio: 0,
        taxViolation: 0,
        productRecall: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      },
      {
        companyType: '分支机构',
        relatedCompany: 0,
        riskLevel: 0,
        shareholdingRatio: 0,
        taxViolation: 0,
        productRecall: 0,
        adminPunishment: 0,
        restrictedConsumption: 0,
        businessException: 0,
        executed: 0,
        caseInfo: 0
      }
    ],
    relatedWarningCount: 1,
    relatedImportantRiskCount: 23,
    relatedAnalysisDescription: '中科航天集团(广东)有限公司的业务模块存在新能源电力装备制造和商业航天配套产业两大核心领域，均属于国家战略性新兴产业，行业整体处于高速成长期但同时面临以下特征：',
    relatedRiskList: [
      '中科航天集团(广东)有限公司业务模块；',
      '中科航天集团(广东)有限公司的业务模块存在两大核心领域，均属于国家战略；',
      '中科航天集团(广东)有限公司的业务模块均属于国家战略；'
    ]
  },
  financialRiskManagement: {
    riskDesignTitle: '风险设计标题（一级标题）',
    certaintyLocation: {
      title: '确定性选址（概率>95%）（二级标题）',
      probability: '>95%',
      customerTypeSupport: {
        title: '客户类型承接（三级标题）',
        items: [
          '主要客户包含中科技有宇航及集团公司地产集成系统36.8/年，周边地产的制造金融部分升高次开几月元了3万元分、及位带国国控维现5%；',
          '国家执权证2025年计划前清开体会条评JOCW集团信小发处制团扫进针对分时前空室5：2024G2。',
        ]
      }
    }
  },
  industryCompetitiveRisk: {
    riskDesignTitle: '风险设计标题',
    establishmentInfo: {
      establishmentTime: '两大领域均属持续高投入发展X(占营收15%-20%),企业依赖政府补贴及外部融资，现金流压力显著。',
      teamComposition: '核心团队具备产业大数据与AI技术复合背景，CEO赵泓宇主导AI选址大模型研发，董事长林成红(原华夏幸福高管)统筹资源整合。',
      businessPositioning: '聚焦企业选址与政府招商数字化服务，覆盖全国2700个开发区、10万+产业园区资源，链接百万级企业选址需求与数十万招商从业者。'
    },
    levelOneRiskTitle: '风险设计标题（一级标题）',
    certaintyLocationExpansion: {
      title: '确定性选址（概率>95%）（二级标题）',
      probability: '>95%',
      customerCapacityExpansion: {
        title: '客户产能扩张（三级标题）',
        items: [
          '主要客户包含中科宇航及集团公司地产集成系统36.8/年，周边地产的制造金融部分升高次开发月计5万元计12万片，交货周期超过15天。',
          '国家电投2025年计划新增风电装机40GW,集团风力发电机组订单增长已至2026Q2。'
        ]
      }
    }
  },
  investmentRegionalPreference: {
    title: '3.1 投资区域偏好',
    groups: [
      {
        title: '(1) 现有布局特征',
        items: [
          {
            label: '沿海新能源产业',
            content: '重点布局江苏昆山、南通、句容、广东佛山、福建宁德总部运营的沿海省份，依托港口优势开发装备上风机项目，2025年沿海大幅公司占比达60%。'
          },
          {
            label: '高耗能产业聚集区',
            content: '连续锂电、汽车制造客户群，在四川宜宾(宁德时代电池基地)、山东济宁(氢储能超级电容组)等地锅炉项目分布式光伏储能项目，2024年工业客户项目自动数合占比45%。'
          },
          {
            label: '绿电储备富集区',
            content: '与河南、山东联合台作"风光储一体化"示范区，2025年新增绿电储备1GW，达到整合作体制度快成本责源。'
          }
        ]
      },
      {
        title: '(2) 企业投资扩张',
        items: [
          {
            label: '沿海新能源产业',
            content: '计划在2025-2027年期间，在浙江温州、江苏盐城等地新建3个制造基地，预计投资规模15亿元，主要生产海上风电设备。'
          },
          {
            label: '高耗能产业聚集区',
            content: '针对钢铁、化工等高耗能行业，在内蒙古包头、山西太原等地布局节能设备生产线，预计新增产能20%。'
          },
          {
            label: '绿电储备富集区',
            content: '与青海、甘肃等西北地区合作，建设大型储能设备制造基地，服务当地丰富的风光资源开发。'
          }
        ]
      },
      {
        title: '(3) 潜在目的区域',
        items: [
          {
            label: '沿海新能源产业',
            content: '关注海南自贸港政策优势，计划在海口、三亚等地布局海洋能源装备制造，对接东南亚市场需求。'
          },
          {
            label: '高耗能产业聚集区',
            content: '重点关注西部大开发政策支持，在新疆、西藏等地区寻找清洁能源装备制造机会。'
          },
          {
            label: '绿电储备富集区',
            content: '紧跟国家"双碳"战略，在东北地区寻找风电、生物质能源装备制造投资机会。'
          }
        ]
      }
    ]
  },
  ratingInfo: {
    ratingValue: 4.5,
    riskRatingValue: 3.8,
    comprehensiveRating: 'D7',
    comprehensiveRatingDescription: '基于上诉企业动态及行业事件，企业编合评级为D7'
  },
  metadata: {
    generationDate: '2025/06/05',
    watermark: '内容贵责为企业，仅供参考'
  }
};

// 模拟API调用的函数，添加延迟来模拟网络请求
export const mockApiCall = <T>(data: T, delay: number = 1000): Promise<{ code: number; data: T; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data,
        message: 'success'
      });
    }, delay);
  });
};