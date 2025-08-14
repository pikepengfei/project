<template>
	<div class="ai-home-box">
		<div class="ai-home">
			<img src="@/assets/images/ai-bg.png" class="background-image" alt="" />
			<div v-if="!isRender" class="ai-home__content">
				<div class="content-container">
					<div class="title-container">
						<!-- <img class="title-image" src="@/assets/images/aiTitle.png" alt="" /> -->
					</div>
					<div class="gif-container">
						<img src="@/assets/images/home.gif" alt="" />
					</div>
					<div class="gif-title-container">
						<img class="gif-title-image" src="@/assets/images/gifTitle.png" alt="" />
					</div>
				</div>

				<div class="ai-home__input-cell">
					<img class="reply-icon" src="@/assets/images/ai-icon-reply.png" />
					<!-- <el-select class="company-select" v-model="currentCompany" allow-create filterable remote
            value-key="companyId" placeholder="输入您想要研判分析的企业" :remote-method="queryCompanyList" :loading="isLoading"
            @keyup.enter="handleEnter">
            <el-option v-for="item in dataList" :key="item.companyId" :value="item" :label="item.companyName" />
          </el-select> -->
					<el-input v-model="currentCompany" @keyup.enter="handleEnter" placeholder="输入您想要研判分析的企业" />
					<img class="send-button" :class="{ active: currentCompany }" src="@/assets/images/plane.png" @click="goAssistant" />
				</div>
			</div>

			<div v-else class="ai-home__content">
				<assistant :keyword="currentCompany.companyName || currentCompany" @back="back" @to-detail="toDetail" :finish="!!reportId"></assistant>
			</div>
		</div>
	</div>
</template>

<script setup name="AiHome">
import assistant from './assistant.vue';
import { getCompanyList, analysisReport, checkReportStatus } from '@/api/business/ai';
import { ElMessageBox, ElMessage } from 'element-plus';
import { debounce } from 'lodash-es';

const router = useRouter();

const currentCompany = ref('');
const isRender = ref(false);
const dataList = ref([]);
const isLoading = ref(false);
const reportId = ref('');
const isComposing = ref(false);

const changeRender = (b) => {
	isRender.value = b;
};

const changeLoading = (b) => {
	isLoading.value = b;
};

const handleReport = async () => {
	try {
		const params = {
			configId: 'test-config-001',
			tenantId: 'test-tenant-001',
			queryCondition: currentCompany.value,
			userId: 'test-user-001',
		};
		const result = await analysisReport({
			configId: params.configId || 'string',
			tenantId: params.tenantId || 'string',
			queryCondition: params.queryCondition || 'string',
			userId: params.userId || '123',
		});

		if (result.code === 200) {
			const tempReportId = result.data.reportId;
			console.log('报告创建请求成功，开始轮询检查生成状态', tempReportId);

			// 开始轮询检查报告生成状态
			await pollReportStatus(tempReportId);
		} else {
			isRender.value = false;
			console.log(result.msg || '报告生成失败');
		}
	} catch (error) {
		console.log(error);
	}
};

// 轮询检查报告生成状态
const pollReportStatus = async (tempReportId, maxAttempts = 100, interval = 20000) => {
	let attempts = 0;

	const checkStatus = async () => {
		try {
			attempts++;
			console.log(`第${attempts}次检查报告状态...`);

			const statusResult = await checkReportStatus(tempReportId);

			if (statusResult.code === 200) {
				const status = statusResult.data?.status; // 假设后端返回 status 字段

				if (status == 10) {
					// 报告生成完成
					reportId.value = tempReportId;
					console.log('报告生成成功', reportId.value);
					// ElMessage.success('报告生成成功');
					return;
				} else if (status == 4) {
					// 报告生成失败
					isRender.value = false;
					ElMessage.error('报告生成失败');
					return;
				} else if (status == 0 || status == 1 || status == 2) {
					// 报告还在生成中，继续轮询
					if (attempts < maxAttempts) {
						setTimeout(checkStatus, interval);
					} else {
						// 超过最大尝试次数
						isRender.value = false;
						// ElMessage.warning('报告生成超时，请稍后重试');
					}
				}
			} else {
				// API调用失败，继续轮询
				if (attempts < maxAttempts) {
					setTimeout(checkStatus, interval);
				} else {
					isRender.value = false;
					// ElMessage.error('检查报告状态失败');
				}
			}
		} catch (error) {
			console.error('检查报告状态出错:', error);
			if (attempts < maxAttempts) {
				setTimeout(checkStatus, interval);
			} else {
				isRender.value = false;
				// ElMessage.error('检查报告状态出错');
			}
		}
	};

	// 开始第一次检查
	checkStatus();
};

const goAssistant = () => {
	if (currentCompany.value) {
		changeRender(true);
		handleReport();
	}
};

const queryCompanyList = async (companyName) => {};
const searchRequest = debounce(async (companyName) => {
	try {
		if (companyName) {
			changeLoading(true);
			const result = await getCompanyList({ companyName });
			dataList.value = result.rows;
		}
	} catch (error) {
		console.log(error);
	} finally {
		changeLoading(false);
	}
}, 300);
onMounted(() => {
	const inputElement = document.querySelector('input');

	inputElement.addEventListener('compositionstart', () => {
		isComposing.value = true;
		console.log('中文输入开始');
	});

	// inputElement.addEventListener('compositionend', () => {
	//   isComposing.value = false;
	//   console.log('中文输入完成，当前值为：', inputElement.value);
	//   searchRequest(inputElement.value);
	// });
	// inputElement.addEventListener('input', () => {
	//   if (!isComposing.value) {
	//     console.log('非中文输入，当前值为：', inputElement.value);
	//     searchRequest(inputElement.value);
	//   }
	// });
});
const toDetail = async () => {
	router.push({
		name: 'reportTemp1',
		params: {
			id: reportId.value,
		},
	});
};

const back = () => {
	changeLoading(false);
	currentCompany.value = '';
};

const handleEnter = () => {
	goAssistant();
};
</script>

<style scoped lang="scss">
.ai-home-box {
	width: 100%;
	height: 100vh;
	position: relative;
	overflow: hidden;
}

.ai-home {
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	position: relative;

	.ai-home__content {
		width: 100%;
		height: 100%;
	}

	&__input-cell {
		background: url('@/assets/images/radius.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 800px;
		height: 80px;
		padding: 0 40px;
		position: absolute;
		bottom: 120px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;

		.el-select__wrapper {
			background: transparent;
			box-shadow: none !important;
		}

		// 自定义输入框样式
		.el-input {
			flex: 1;
			margin: 0 15px;
			height: 100%;

			:deep(.el-input__wrapper) {
				background: transparent !important;
				border: none !important;
				box-shadow: none !important;
				padding: 0 !important;
				height: 100% !important;
				min-height: unset !important;

				.el-input__inner {
					background: transparent !important;
					border: none !important;
					color: #333 !important;
					font-size: 16px !important;
					padding: 0 !important;
					height: 100% !important;
					line-height: normal !important;

					&::placeholder {
						color: #999 !important;
						font-size: 16px !important;
					}

					&:focus {
						outline: none !important;
						box-shadow: none !important;
					}
				}
			}

			// 聚焦状态
			&.is-focus {
				:deep(.el-input__wrapper) {
					box-shadow: none !important;
				}
			}

			// 悬停状态
			&:hover {
				:deep(.el-input__wrapper) {
					box-shadow: none !important;
				}
			}
		}
	}
}

.background-image {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.content-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 100px;
}

.title-container {
	margin-left: 30px;
	margin-bottom: 50px;
}

.title-image {
	width: auto;
	height: 22px;
	position: relative;
	z-index: 10;
}

.gif-container {
	width: 50%;
	margin-top: 50px;
	margin-left: -30px;
	display: flex;
	justify-content: center;

	img {
		width: 100%;
		height: auto;
		/* 设置图片背景透明 */
		background: transparent;
		/* 使用混合模式让白色背景透明 */
		mix-blend-mode: multiply;
		/* 或者使用screen模式（根据gif的具体情况选择） */
		/* mix-blend-mode: screen; */
		/* 添加滤镜去除白色背景 */
		filter: contrast(1.2) brightness(1.1);
	}
}

.gif-title-container {
	margin-top: -80px;
	margin-left: 10px;
	display: flex;
	justify-content: center;
}

.gif-title-image {
	width: 488px;
	height: 81px;
}

.reply-icon {
	width: 52.43px;
	height: 55.23px;
	margin-right: 15px;
}

.company-select {
	flex: 1;
	align-self: flex-start;
	margin: 0 15px;

	:deep(.el-input__wrapper) {
		background: transparent;
		border: none;
		box-shadow: none;
	}
}

.send-button {
	width: 42px;
	height: 42px;
	position: relative;
	z-index: 10;
	margin-left: 15px;
	transition: all 0.3s ease;

	&.active {
		cursor: pointer;
		opacity: 1;

		&:hover {
			transform: scale(1.1);
		}
	}

	&:not(.active) {
		opacity: 0.5;
		cursor: not-allowed;
	}
}
</style>
