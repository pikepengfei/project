<template>
  <div class="report-container">
    <!-- 报告封面 -->
    <div class="report-page cover-page">
      <img src="@/assets/image/reportCover.png" alt="">
    </div>
    <!-- 第一部分第一页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-content">
        <div class="company-analysis-container">
          <!-- 公司标题部分 -->
          <div class="company-header">
            <div class="company-info">
              <div class="company-logo">
                <div class="logo-circle">
                  <span class="logo-text">华夏幸福</span>
                </div>
              </div>
              <div class="company-details">
                <h1 class="company-title">{{ reportData.information.name }}</h1>
                <div class="company-tags">
                  <template v-for="(tag, index) in reportData.information.tags" :key="index">
                    <span class="tag tag-green" v-if="tag === '存续'">存续</span>
                    <span class="tag tag-blue" v-else>{{ tag }}</span>
                  </template>
                </div>
              </div>
            </div>
            <div class="company-meta">
              <div class="meta-row">
                <span class="meta-label">法人代表：</span>
                <span class="meta-value">{{ reportData.information.legalRepresentative }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">注册地址：</span>
                <span class="meta-value">{{ reportData.information.registeredAddress }}</span>
              </div>
            </div>
          </div>

          <!-- 相关分析部分 -->
          <div class="analysis-section">
            <h3 class="analysis-title">相关分析</h3>
            <div class="analysis-cards">
              <div class="analysis-card small-enterprise">
                <div class="card-header">{{ reportData.analysis.enterpriseScale }}</div>
                <div class="card-rating" style="margin-bottom: 0px;">
                  <el-rate v-model="reportData.star" disabled />
                </div>
                <div class="card-category">企业规模</div>
              </div>

              <div class="analysis-card d7-card">
                <div class="card-header">{{ reportData.ratingInfo.comprehensiveRating }}</div>
                <div class="card-status warning">{{ reportData.analysis.investmentPotential }}</div>
                <div class="card-category">企业运转动力</div>
              </div>

              <div class="analysis-card e3-card">
                <div class="card-header">{{ reportData.ratingInfo.riskRatingValue }}</div>
                <div class="card-status success">{{ reportData.analysis.riskRating }}</div>
                <div class="card-category">企业风险评级</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 公司简介部分 -->
        <div class="company-profile">
          <h2 class="section-title">公司简介 <img src="@/assets/image/companyProfileLogo.png" alt=""> </h2>
          <div class="profile-content">
            <p>
              {{ reportData.companyProfile.introduction }}
            </p>
            <div class="profile-meta">
              <img src="@/assets/image/briefIntroductionlogo.png" alt="">
              <p>
                <strong>
                  成立时间：
                </strong>
                {{ reportData.companyProfile.establishmentDate }}
              </p>
            </div>
            <div class="profile-meta">
              <img src="@/assets/image/briefIntroductionlogo.png" alt="">
              <p>
                <strong>
                  组织架构：
                </strong>
                {{ reportData.companyProfile.organizationalStructure }}
              </p>
            </div>
            <div class="profile-meta">
              <img src="@/assets/image/briefIntroductionlogo.png" alt="">
              <p>
                <strong>
                  经营范围：
                </strong>
                {{ reportData.companyProfile.businessScope }}
              </p>
            </div>
            <div class="profile-meta">
              <img src="@/assets/image/briefIntroductionlogo.png" alt="">
              <p>
                <strong>
                  核心产品：
                </strong>
              </p>
            </div>
            <ul class="product-list">
              <template v-for="(product, index) in reportData.companyProfile.coreProducts" :key="index">
                <li>{{ product }}</li>
              </template>
            </ul>
            <div class="profile-meta">
              <img src="@/assets/image/briefIntroductionlogo.png" alt="">
              <p>
                <strong>
                  融资进展：
                </strong>
                {{ reportData.companyProfile.shareholdingStructure }}
              </p>
            </div>
          </div>
        </div>
        <!-- 页面底部信息 -->
        <div class="page-footer">
          <div class="footer-text">报告生成日期：2025/06/05</div>
          <div class="footer-watermark">内容贵责为企业，仅供参考</div>
        </div>
      </div>
    </div>
    <!-- 第一部分第二页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">
        <div class="pageOne-content-header">
          <img src="@/assets/image/pageTitle1.png" alt="">
          <div class="content-header-card">
            <div class="rating-card">
              <div class="rating-upper">
                <span class="rating-grade">D9</span>
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
          <img style="margin-top: 25px;" src="@/assets/image/pageTitle101.png" alt="">
        </div>
        <!-- 行业趋势 -->
        <div class="pageOne-content-industry">
          <h2 class="industry-title">1.1行业趋势 <img src="@/assets/image/companyProfileLogo.png" alt=""> </h2>

          <!-- 行业背景及现状 -->
          <div class="industry-section">
            <h3 class="industry-subtitle">(1) 行业背景及现状</h3>

            <div class="industry-content">
              <p>{{ reportData.industryTrend.background.description }}</p>

              <!-- 新能源电力装备 -->
              <div class="industry-subsection">
                <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 新能源电力装备：</h4>
                <ul class="industry-list">
                  <li v-for="(item, index) in reportData.industryTrend.background.newEnergyEquipment" :key="index">
                    <span class="list-label">{{ item.title }}：</span>
                    <span class="list-content">{{ item.content }}</span>
                  </li>
                </ul>
              </div>

              <!-- 商业航天配套 -->
              <div class="industry-subsection">
                <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 商业航天配套：</h4>
                <ul class="industry-list">
                  <li v-for="(item, index) in reportData.industryTrend.background.commercialAerospace" :key="index">
                    <span class="list-label">{{ item.title }}：</span>
                    <span class="list-content">{{ item.content }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 行业对企业发展的影响 -->
          <div class="industry-section">
            <h3 class="industry-subtitle">(2) 行业对企业发展的影响</h3>

            <div class="industry-content">
              <div class="impact-item" v-for="(item, index) in reportData.industryTrend.impact" :key="index">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    {{ item.title }}：
                  </strong>
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第一部分第三页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">
        <!-- 政策影响 -->
        <div class="pageOne-content-industry">
          <h2 class="industry-title">1.2 政策影响 <img src="@/assets/image/companyProfileLogo.png" alt=""> </h2>

          <!-- 政策对企业发展的整体影响 -->
          <div class="industry-section">
            <h3 class="industry-subtitle">(1) 政策对企业发展的整体影响</h3>

            <div class="industry-content">
              <!-- 市场机会 -->
              <div class="policy-subsection">
                <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 市场机会：</h4>
                <div class="policy-item"
                  v-for="(item, index) in reportData.policyImpact.overallImpact.marketOpportunity" :key="index">
                  <span class="policy-text">{{ item }}</span>
                </div>
              </div>

              <!-- 技术创新 -->
              <div class="policy-subsection">
                <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 技术创新：</h4>
                <div class="policy-item"
                  v-for="(item, index) in reportData.policyImpact.overallImpact.technicalInnovation" :key="index">
                  <span class="policy-text">{{ item }}</span>
                </div>
              </div>

              <!-- 成本实际 -->
              <div class="policy-subsection">
                <h4 class="subsection-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 成本实际：</h4>
                <div class="policy-item" v-for="(item, index) in reportData.policyImpact.overallImpact.costActual"
                  :key="index">
                  <span class="policy-text">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 企业动态 -->
        <div class="enterprise-dynamics-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle102.png" alt="">
          </div>

          <!-- 市场拓展 -->
          <div class="dynamics-section">
            <h3 class="dynamics-subtitle">2.1 市场拓展 <img src="@/assets/image/companyProfileLogo.png" alt=""> </h3>

            <div class="dynamics-content">
              <h4 class="dynamics-item-title">(1) 新能源装备制造承布局</h4>
              <p class="dynamics-description">{{ reportData.enterpriseDynamics.marketExpansion.description }}</p>

              <div class="dynamics-subsection">
                <h5 class="dynamics-point-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 政长市重要事项：
                </h5>
                <div class="dynamics-item"
                  v-for="(item, index) in reportData.enterpriseDynamics.marketExpansion.keyMatters" :key="index">
                  <span class="dynamics-text">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 资本运作 -->
          <div class="dynamics-section">
            <h3 class="dynamics-subtitle">2.2 资本运作 <img src="@/assets/image/companyProfileLogo.png" alt=""> </h3>

            <div class="dynamics-content">
              <div class="capital-subsection">
                <h5 class="dynamics-point-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 资攻市在本调美：
                </h5>
                <p class="dynamics-description">{{ reportData.enterpriseDynamics.capitalOperation.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第一部分第四页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">
        <!-- 市场渗透多元化 -->
        <div class="market-penetration-section">
          <h4 class="market-subtitle"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 市场渗透多元化：</h4>
          <div class="market-item" v-for="(item, index) in reportData.enterpriseDynamics.marketPenetration"
            :key="index">
            <span class="market-text">{{ item }}</span>
          </div>
        </div>

        <!-- 2.3 政府考察 -->
        <div class="government-inspection-section">
          <h2 class="section-title-blue">2.3 政府考察 <img src="@/assets/image/companyProfileLogo.png" alt=""></h2>

          <!-- 整体运行情况 -->
          <div class="inspection-subsection">
            <h4 class="inspection-subtitle"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 整体运行情况：</h4>
            <div class="inspection-item" v-for="(item, index) in reportData.governmentInspection.overallOperation"
              :key="index">
              <span class="inspection-text">{{ item }}</span>
            </div>
          </div>

          <!-- 政策落地情况 -->
          <div class="inspection-subsection">
            <h4 class="inspection-subtitle"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 政策落地情况：</h4>
            <div class="inspection-item" v-for="(item, index) in reportData.governmentInspection.policyImplementation"
              :key="index">
              <span class="inspection-text">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- 2.4 供应链 -->
        <div class="supply-chain-section">
          <h2 class="section-title-blue">2.4 供应链 <img src="@/assets/image/companyProfileLogo.png" alt=""></h2>

          <div class="supply-chain-intro">
            <p>{{ reportData.supplyChain.introduction }}</p>
          </div>

          <!-- 客户产展扩编 -->
          <div class="supply-subsection">
            <h4 class="supply-subtitle"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 客户产展扩编：</h4>
            <div class="supply-item" v-for="(item, index) in reportData.supplyChain.customerExpansion" :key="index">
              <span class="supply-text">{{ item }}</span>
            </div>
          </div>

          <!-- 供应链协调优化 -->
          <div class="supply-subsection">
            <h4 class="supply-subtitle"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 供应链协调优化：</h4>
            <div class="supply-item" v-for="(item, index) in reportData.supplyChain.coordinationOptimization"
              :key="index">
              <span class="supply-text">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- 2.5 综合评级 -->
        <div class="comprehensive-rating-section">
          <h2 class="section-title-blue">2.5 综合评级 <img src="@/assets/image/companyProfileLogo.png" alt=""></h2>

          <div class="rating-content">
            <p class="rating-description">{{ reportData.ratingInfo.comprehensiveRatingDescription }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 第二部分第一页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">
        <div class="pageOne-content-header">
          <img src="@/assets/image/pageTitle2.png" alt="">
          <div class="content-header-card risk-analysis-card">
            <div class="rating-card">
              <div class="rating-upper">
                <span class="rating-grade risk-grade">{{ reportData.ratingInfo.riskRatingValue }}</span>
                <div class="rating-stars">
                  <div class="star-display">
                    <el-rate v-model="reportData.ratingInfo.ratingValue" disabled show-score />
                  </div>
                </div>
                <div class="rating-status risk-status">{{ reportData.analysis.riskRating }}</div>
              </div>
              <div class="rating-below">
                <p style="font-size: 16px; font-weight: 600;">企业综合风险评级</p>
                <p style="margin-left: 10px;">风险评级范围为 E1~E10，评级越高，企业投资风险越高</p>
              </div>
            </div>
          </div>
          <img style="margin-top: 25px;" src="@/assets/image/pageTitle201.png" alt="">
        </div>

        <!-- 风险分析标题区域 -->
        <div class="risk-analysis-section">

          <!-- 企业司法、经营风险 -->
          <div class="legal-business-risk-section">
            <!-- 风险分析 -->
            <div class="risk-analysis-content">
              <div class="risk-item-header">【风险分析】</div>

              <div class="risk-warning-box">
                <p>企业共扫描出 <strong>{{ reportData.riskAnalysis.warningCount }}</strong> 个异常提醒，其中重要风险 <strong>{{
                    reportData.riskAnalysis.importantRiskCount }}</strong> 个。</p>
              </div>

              <div class="risk-details">
                <h4 class="risk-detail-title">详情分析</h4>
                <div class="risk-detail-content">
                  <div class="risk-point">
                    <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                    <p>{{ reportData.riskAnalysis.analysisDescription }}</p>
                  </div>
                  <ul class="risk-list">
                    <li v-for="(item, index) in reportData.riskAnalysis.riskList" :key="index">{{ item }}</li>
                  </ul>
                </div>
              </div>

              <!-- 企业风险一览表 -->
              <div class="enterprise-risk-table">
                <div class="table-header">【企业风险一览表】</div>
                <div class="risk-table-container">
                  <el-table :data="riskTableData" border style="width: 100%" class="risk-table">
                    <el-table-column prop="year" label="时间" width="80" align="center" header-align="center" />
                    <el-table-column prop="totalSelfRisk" label="自身风险总量" width="80" align="center"
                      header-align="center"></el-table-column>
                    <el-table-column label="重要风险" align="center" header-align="center">
                      <el-table-column prop="dishonestExecuted" label="失信被执行人" align="center" header-align="center" />
                      <el-table-column prop="taxViolation" label="税务违法" width="60" align="center"
                        header-align="center" />
                      <el-table-column prop="productViolation" label="产品违法" width="60" align="center"
                        header-align="center" />
                      <el-table-column prop="adminPunishment" label="行政处罚" width="60" align="center"
                        header-align="center" />
                      <el-table-column prop="restrictedConsumption" label="限制高消费" width="60" align="center"
                        header-align="center" />
                      <el-table-column prop="businessException" label="经营异常" width="60" align="center"
                        header-align="center" />
                      <el-table-column prop="executed" label="被执行人" width="60" align="center" header-align="center" />
                      <el-table-column prop="caseInfo" label="立案信息" width="60" align="center" header-align="center" />
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 第二部分第二页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">

        <!-- 关联企业风险 -->
        <div class="related-enterprise-risk-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle202.png" alt="">
          </div>

          <!-- 企业司法、经营风险 -->
          <div class="legal-business-risk-section">
            <!-- 风险分析 -->
            <div class="risk-analysis-content">
              <div class="risk-item-header">【风险分析】</div>

              <div class="risk-warning-box">
                <p>公司关联企业共有 <strong>{{ reportData.riskAnalysis.relatedWarningCount }}</strong> 家，共扫描出 <strong>{{
                    reportData.riskAnalysis.relatedImportantRiskCount }}</strong> 个风险提醒，其中以下风险信得关注：</p>
              </div>

              <div class="risk-details">
                <h4 class="risk-detail-title">详情分析</h4>
                <div class="risk-detail-content">
                  <div class="risk-point">
                    <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                    <p>{{ reportData.riskAnalysis.relatedAnalysisDescription }}</p>
                  </div>
                  <ul class="risk-list">
                    <li v-for="(item, index) in reportData.riskAnalysis.relatedRiskList" :key="index">{{ item }}</li>
                  </ul>
                </div>
              </div>

              <!-- 关联企业近一年风险一览 -->
              <div class="enterprise-risk-table">
                <div class="table-header">【关联企业近一年风险一览】</div>
                <div class="risk-table-container">
                  <el-table :data="relatedRiskTableData" border style="width: 100%" class="risk-table">
                    <el-table-column prop="companyType" label="类型" width="120" align="center" header-align="center" />
                    <el-table-column prop="relatedCompany" label="关联企业" width="80" align="center"
                      header-align="center" />
                    <el-table-column prop="riskLevel" label="风险等级" width="80" align="center" header-align="center" />
                    <el-table-column label="重要风险" align="center" header-align="center">
                      <el-table-column prop="shareholdingRatio" label="失信被执行人" width="90" align="center"
                        header-align="center" />
                      <el-table-column prop="taxViolation" label="税务违法" width="80" align="center"
                        header-align="center" />
                      <el-table-column prop="productRecall" label="产品召回" width="80" align="center"
                        header-align="center" />
                      <el-table-column prop="adminPunishment" label="行政处罚" width="80" align="center"
                        header-align="center" />
                      <el-table-column prop="restrictedConsumption" label="限制高消费" width="90" align="center"
                        header-align="center" />
                      <el-table-column prop="businessException" label="经营异常" width="80" align="center"
                        header-align="center" />
                      <el-table-column prop="executed" label="被执行人" width="80" align="center" header-align="center" />
                      <el-table-column prop="caseInfo" label="立案信息" width="80" align="center" header-align="center" />
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 财务及风险管理 -->
        <div class="financial-risk-management-section">
          <div class="section-header">
            <img style="margin-top: 25px;" src="@/assets/image/pageTitle203.png" alt="">
          </div>

          <!-- 风险设计标题 -->
          <div class="risk-design-section">
            <div class="risk-design-header">
              <h3 class="risk-design-title">风险设计标题（一级标题）<img src="@/assets/image/companyProfileLogo.png" alt=""></h3>
            </div>

            <!-- 确定性选址 -->
            <div class="certainty-location-section">
              <h4 class="certainty-title">(1) 确定性选址（概率>95%）（二级标题）：</h4>

              <!-- 客户类型承接 -->
              <div class="customer-type-section">
                <h5 class="customer-type-title"><img src="@/assets/image/briefIntroductionlogo.png" alt=""> 客户类型承接（三级标题）
                </h5>
                <div class="customer-content">
                  <div class="customer-item"
                    v-for="(item, index) in reportData.financialRiskManagement.certaintyLocation.customerTypeSupport.items"
                    :key="index">
                    <span class="customer-text">{{ item }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二部分第三页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">

        <!-- 行业及竞争风险 -->
        <div class="industry-competitive-risk-section">
          <div class="section-header">
            <img src="@/assets/image/pageTitle204.png" alt="">
          </div>

          <!-- 风险设计标题 -->
          <div class="risk-design-section">
            <div class="risk-design-header">
              <h3 class="risk-design-title">风险设计标题<img src="@/assets/image/companyProfileLogo.png" alt=""></h3>
            </div>

            <!-- 成立时间等信息 -->
            <div class="establishment-info-section">
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    成立时间：
                  </strong>
                  {{ reportData.industryCompetitiveRisk.establishmentInfo.establishmentTime }}
                </p>
              </div>
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    团队构成：
                  </strong>
                  {{ reportData.industryCompetitiveRisk.establishmentInfo.teamComposition }}
                </p>
              </div>
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    业务定位：
                  </strong>
                  {{ reportData.industryCompetitiveRisk.establishmentInfo.businessPositioning }}
                </p>
              </div>
            </div>

            <!-- 风险设计标题（一级标题） -->
            <div class="level-one-title-section">
              <div class="risk-design-header">
                <h3 class="risk-design-title">风险设计标题（一级标题）<img src="@/assets/image/companyProfileLogo.png" alt=""></h3>
              </div>

              <!-- 确定性选址 -->
              <div class="certainty-location-section">
                <h4 class="certainty-title">(1) 确定性选址（概率>95%）（二级标题）：</h4>

                <!-- 客户产能扩张 -->
                <div class="customer-expansion-section">
                  <h5 class="customer-expansion-title"><img src="@/assets/image/briefIntroductionlogo.png" alt="">
                    {{ reportData.industryCompetitiveRisk.certaintyLocationExpansion.customerCapacityExpansion.title }}
                  </h5>
                  <div class="customer-content">
                    <div class="customer-item"
                      v-for="(item, index) in reportData.industryCompetitiveRisk.certaintyLocationExpansion.customerCapacityExpansion.items"
                      :key="index">
                      <span class="customer-text">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 第三部分第一页 -->
    <div class="report-page">
      <div class="report-page_header">
        <img src="@/assets/image/headerLogo.png" alt="Logo">
      </div>
      <div class="report-pageOne-content">
        <div class="pageOne-content-header">
          <img src="@/assets/image/pageTitle3.png" alt="">
        </div>
        <!-- 投资区域偏好 -->
        <div class="investment-regional-preference-section">
          <h2 class="section-title-blue">3.1 投资区域偏好 <img src="@/assets/image/companyProfileLogo.png" alt=""></h2>

          <!-- 现有布局特征 -->
          <div class="regional-section">
            <h3 class="regional-subtitle">(1) 现有布局特征</h3>

            <div class="regional-content">
              <!-- 沿海新能源产业 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    沿海新能源产业：
                  </strong>
                  {{ reportData.investmentRegionalPreference.existingLayout.coastalNewEnergy }}
                </p>
              </div>

              <!-- 高耗能产业聚集区 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    高耗能产业聚集区：
                  </strong>
                  {{ reportData.investmentRegionalPreference.existingLayout.highEnergyIndustry }}
                </p>
              </div>

              <!-- 绿电储备富集区 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    绿电储备富集区：
                  </strong>
                  {{ reportData.investmentRegionalPreference.existingLayout.greenPowerReserve }}
                </p>
              </div>
            </div>
          </div>

          <!-- 企业投资扩张销 -->
          <div class="regional-section">
            <h3 class="regional-subtitle">(2) 企业投资扩张销</h3>

            <div class="regional-content">
              <!-- 沿海新能源产业 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    沿海新能源产业：
                  </strong>
                  {{ reportData.investmentRegionalPreference.investmentExpansion.coastalNewEnergy }}
                </p>
              </div>

              <!-- 高耗能产业聚集区 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    高耗能产业聚集区：
                  </strong>
                  {{ reportData.investmentRegionalPreference.investmentExpansion.highEnergyIndustry }}
                </p>
              </div>

              <!-- 绿电储备富集区 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    绿电储备富集区：
                  </strong>
                  {{ reportData.investmentRegionalPreference.investmentExpansion.greenPowerReserve }}
                </p>
              </div>
            </div>
          </div>

          <!-- 潜在目的区域 -->
          <div class="regional-section">
            <h3 class="regional-subtitle">(3) 潜在目的区域</h3>

            <div class="regional-content">
              <!-- 沿海新能源产业 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    沿海新能源产业：
                  </strong>
                  {{ reportData.investmentRegionalPreference.potentialTarget.coastalNewEnergy }}
                </p>
              </div>

              <!-- 高耗能产业聚集区 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    高耗能产业聚集区：
                  </strong>
                  {{ reportData.investmentRegionalPreference.potentialTarget.highEnergyIndustry }}
                </p>
              </div>

              <!-- 绿电储备富集区 -->
              <div class="info-item">
                <img src="@/assets/image/briefIntroductionlogo.png" alt="">
                <p>
                  <strong>
                    绿电储备富集区：
                  </strong>
                  {{ reportData.investmentRegionalPreference.potentialTarget.greenPowerReserve }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts" name="reportDetail">
import { reactive, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useReportApi } from '@/api/report/index';
import { mockReportData, mockApiCall } from '@/mock/reportData';
import type { ReportData } from '@/types/report';

// 获取路由参数
const route = useRoute();
const reportId = route.params.id as string;
const ratingValue = ref(4.5); // 添加评分值

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
  companyProfile: {
    introduction: '',
    establishmentDate: '',
    organizationalStructure: '',
    businessScope: '',
    coreProducts: [],
    shareholdingStructure: '',
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
    existingLayout: {
      coastalNewEnergy: '',
      highEnergyIndustry: '',
      greenPowerReserve: ''
    },
    investmentExpansion: {
      coastalNewEnergy: '',
      highEnergyIndustry: '',
      greenPowerReserve: ''
    },
    potentialTarget: {
      coastalNewEnergy: '',
      highEnergyIndustry: '',
      greenPowerReserve: ''
    }
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
  }
});

// 风险表格数据 - 现在从API获取
const riskTableData = ref(reportData.riskAnalysis.riskTableData);
const relatedRiskTableData = ref(reportData.riskAnalysis.relatedRiskTableData);

// API实例
const reportApi = useReportApi();

// 获取报告数据
const fetchReportData = async () => {
  try {
    // 使用模拟数据，实际项目中替换为真实API调用
    // const response = await reportApi.getReportDetail(reportId);
    const response = await mockApiCall(mockReportData, 500);

    if (response.code === 0) {
      // 更新响应式数据
      Object.assign(reportData, response.data);

      // 更新表格数据的引用
      riskTableData.value = reportData.riskAnalysis.riskTableData;
      relatedRiskTableData.value = reportData.riskAnalysis.relatedRiskTableData;
    }
  } catch (error) {
    console.error('获取报告数据失败:', error);
  }
};

// 生命周期
onMounted(() => {
  console.log('报告ID:', reportId);
  fetchReportData();
});
</script>

<style scoped lang="scss">
// SCSS变量定义
$primary-color: #4285f4;
$secondary-color: #007bff;
$success-color: #165DFF;
$warning-color: #e74c3c;
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
    margin-bottom: 15px;
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
    margin-bottom: 20px;

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
  margin-bottom: 20px;

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

  @media print {
    box-shadow: none;
    margin: 0;
    max-width: none;
    overflow: visible;
  }

  .report-page {
    height: 297mm;
    width: 210mm;
    max-height: 297mm;
    padding: 1px 64px;
    background: url('@/assets/image/backgroundOfTheFirstPage.png') no-repeat center center;
    background-size: cover;
    position: relative;

    &:first-child {
      padding: 0;
    }

    &:not(:nth-child(2)) {
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
    margin-bottom: 15px;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .report-content {
    .company-analysis-container {
      background-color: rgb(244, 249, 255);
      background-image: url('@/assets/image/companyBackImg.png');
      background-size: cover;
      background-position: center;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.1);

      .company-header {
        margin-bottom: 20px;
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
                background-color: rgba(231, 76, 60, 0.1);
              }

              &.success {
                color: $success-color;
                background-color: rgba(52, 152, 219, 0.1);
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
      border-top: 1px solid #eaeaea;
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
          margin-bottom: 15px;
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
            margin-bottom: 15px;
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
                    word-break: break-word;
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
