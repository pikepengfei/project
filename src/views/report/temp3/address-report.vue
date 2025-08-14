<template>
	<div class="address-report report-font">
		<div v-if="detail?.carrierListVos?.length" class="address-report__carrier-list">
			<div class="address-report__title-image">
				<img src="@/assets/images/address-report__carrier-list.png" alt="" />
			</div>
			<div class="address-report__computer-image">
				<img src="@/assets/images/address-report__computer.png" alt="" />
			</div>
			<div class="address-report__carrier-content">
				<div v-for="(item, index) in detail?.carrierListVos" :key="index" class="address-report__carrier-item">
					<div class="address-report__carrier-name">
						{{ item.parkName }}
					</div>
					<div class="address-report__carrier-info" v-for="(items, indexs) in item.appletReportCarrierVos"
						:key="indexs">
						<div class="address-report__info-item">
							<div class="address-report__info-label">载体类型</div>
							<div class="address-report__info-value">
								{{ items.carrierType }}
							</div>
						</div>

						<div class="address-report__info-item">
							<div class="address-report__info-label">载体数量</div>
							<div class="address-report__info-value">
								{{ items.carrierNum }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div v-for="item in dataList" :key="item.id" class="break-after-page">
			<!-- 标题 园区：缺少VR链接字段，园区图片字段。产业方向值错误 所有字段没有单位-->
			<div class="flex">
				<template v-if="item.vrUrl">
					<a :href="item.vrUrl" target="_blank">
						<div class="section-title">{{ handleNum(item) }} {{ item.titleName }}</div>
					</a>
					<a :href="item.vrUrl" target="_blank">
						<div class="vr-link-wrapper">
							<div class="vr-link">
								查看VR
							</div>
						</div>
					</a>
				</template>
				<template v-else>
					<div class="section-title">{{ handleNum(item) }} {{ item.titleName }}</div>
				</template>
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
						<div class="park-image-wrapper" v-if="item.fileList.length">
							<img class="park-image"
								:src="props.optimizeImageUrl(item.fileList?.[0]?.file?.[0]?.transFileUrl || item.fileList?.[0]?.file?.[0]?.path || '', { width: 350, quality: 65 })"
								alt="" />
						</div>
						<div class="park-info-wrapper">
							<!-- 类型 区域 方向 地址 -->
							<div class="park-info-list">
								<div v-for="info in handleParkTopInfo(item)" :key="info.name" class="park-info-item">
									<div class="park-info-label">{{ info.name }}</div>
									<div class="park-info-value">{{ info.value }}</div>
								</div>
							</div>
							<!-- 经纪人 -->
							<div class="park-broker-wrapper">
								<div class="broker-card">
									<div class="broker-avatar-wrapper">
										<img class="broker-avatar"
											:src="props.optimizeImageUrl(handleAvatar(item), { width: 80, quality: 70 })" alt="" />
									</div>
									<div class="broker-info">
										<div class="broker-header">
											<div class="broker-name" :title="item.userInfo?.userName">
												{{ item.userInfo?.userName || '' }}
											</div>
											<div class="broker-job">
												{{ item.userInfo?.job || '' }}
											</div>
										</div>
										<div class="broker-slogan">敬待咨询，竭诚为您服务</div>
										<div class="broker-phone">
											{{ item.userInfo?.phone || '' }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 支持’地铁等‘ -->
					<div class="support-wrapper">
						<DetailSupport :item-style="{ width: '114px', height: '42px', fontSize: '12px' }"
							:icon-style="{ width: '14px', height: '14px' }" :list="item.supporting || []"></DetailSupport>
					</div>

					<div class="desc-wrapper" v-if="item.description">
						<div class="cell-title">
							{{ getDescName(item) }}
						</div>
						<div class="desc-content">
							{{ item.description }}
						</div>
					</div>

					<div class="map-wrapper" v-if="item.picUrl && item.aroundInfo">
						<div class="cell-title">周边配套</div>
						<div class="map-container">
							<ReportMap :detail="item"></ReportMap>
						</div>
					</div>
				</div>
				<div v-if="!isPark(item)">
					<div class="flex mt-5">
						<div class="flex-1">
							<!-- 价格 租售价格都可能有 -->
							<div v-if="!isPark(item)" class="price-wrapper">
								<div v-for="priceInfo in getPriceItems(item)" :key="priceInfo.label" class="price-item">
									<div class="price-label">{{ priceInfo.label }}</div>
									<div class="price-value">
										{{ priceInfo.value }}
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
						<div class="broker-card-wrapper">
							<div class="broker-card">
								<div class="broker-avatar-wrapper">
									<img class="broker-avatar"
										:src="props.optimizeImageUrl(haouseWarAvatar(item), { width: 80, quality: 70 })" alt="" />
								</div>
								<div class="broker-info">
									<div class="broker-header">
										<div class="broker-name" :title="item.submitUser?.userName">
											{{ item.submitUser?.userName || '' }}
										</div>
										<div class="broker-job">
											{{ item.submitUser?.job || '' }}
										</div>
									</div>

									<div class="broker-slogan">敬待咨询，竭诚为您服务</div>
									<div class="broker-phone">
										{{ item.submitUser?.phone || '' }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="!isPark(item)" class="flex">
					<!-- 图片 -->
					<div class="carrier-image-container">
						<img class="carrier-image" :src="props.optimizeImageUrl(hadndleImg(item), { width: 450, quality: 65 })"
							alt="" />
					</div>
				</div>
				<!-- 仓库参数 -->
				<div v-if="isWare(item)" class="params-wrapper">
					<div class="cell-title">仓库参数</div>
					<div class="params-grid">
						<div v-for="info in handleWareInfo(item)" :key="info.name" class="param-item">
							<div class="param-label">
								{{ info.name }}
							</div>
							<div class="param-value">{{ info.value }}</div>
						</div>
					</div>
				</div>
				<!-- 厂房参数 -->
				<div v-if="isPlant(item)" class="params-wrapper">
					<div class="cell-title">厂房参数</div>
					<div class="params-grid">
						<div v-for="info in handlePlantInfo(item)" :key="info.name" class="param-item">
							<div class="param-label">
								{{ info.name }}
							</div>
							<div class="param-value">
								{{ info.value }}
							</div>
						</div>
					</div>
				</div>
				<!-- 楼层信息 -->
				<div class="floor-wrapper" v-if="item.floorList && item.floorList.length > 0">
					<div class="cell-title">
						{{ `各楼层信息（${item.totalNumber}层）` }}
					</div>
					<div class="params-grid">
						<div class="param-item">
							<div class="param-label">
								可分割
							</div>
							<div class="param-value">
								<span>{{ item.isDivisible }}</span>
							</div>
						</div>
						<div class="param-item">
							<div class="param-label">
								最小分割面积
							</div>
							<div class="param-value">
								<span>{{ item.minSplit != null ? item.minSplit + '㎡' : '--' }}</span>
							</div>
						</div>
					</div>
					<template v-for="(floor, floorIndex) in item.floorList || []" :key="floorIndex">
						<div class="params-grid">
							<div v-for="info in handleFloor(floor, item)" :key="info.name" class="param-item">
								<div class="param-label">
									{{ info.name }}
								</div>
								<div class="param-value" :class="{ 'vr-link': info.isVR && info.value }">
									<a v-if="info.isVR" :href="info.value" target="_blank">
										{{ info.value ? '查看' : '--' }}
									</a>
									<span v-else>{{ info.value }}</span>
								</div>
							</div>
						</div>
						<div class="floor-images">
							<div class="floor-images-grid">
								<div v-for="img in floor.interiorUrl?.slice?.(0, 2) || []" :key="img" class="floor-image-wrapper">
									<img class="floor-image" :src="props.optimizeImageUrl(img, { width: 280, quality: 60 })" alt="" />
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import DetailSupport from './detail/DetailSupport.vue';
import ReportMap from './report/ReportMap.vue';
import { watch } from 'vue';

const props = withDefaults(
	defineProps<{
		// eslint-disable-next-line vue/require-default-prop
		reportDetail?: any[];
		data?: any;
		optimizeImageUrl?: (url: string, options?: any) => string;
	}>(),
	{
		optimizeImageUrl: (url: string) => url,
	}
);
watch(
	() => [props.reportDetail, props.data],
	async () => {
		await initDetail();
	},
	{ deep: true }
);

console.log(props.reportDetail);

const detail = ref<any>(null);

// 组件挂载时初始化数据
onMounted(async () => {
	await initDetail();
});
const handleOffice = (data: any, num: any, isActive: any) => {
	if (data) {
		let tags = data.warehouseFeatures?.map((item) => item.featureName) || [];
		const { externalName: titleName, warehouseRent: rentData, warehouseFloors: floorList, submitUser: brokerInfo } = data;
		return {
			...data,
			rentData,
			vrUrl: data.vrLink || '',
			titleName,
			tags,
			floorList,
			itemType: 'ware',
			index: isActive ? `${num.index}.${num.subIndex++}` : num.index++,
			brokerInfo,
		};
	}
};

const handlePark = (data: any, num: any, userInfo: any) => {
	if (data) {
		const { introduce: description } = data;
		num.subIndex = 1;
		return {
			...data,
			vrUrl: data.vrLink || '',
			titleName: data.name || '',
			index: num.index,
			itemType: 'park',
			description,
			userInfo,
		};
	}
};

const handlePlant = (data: any, num: any, isActive: any) => {
	if (data) {
		let tags = data.featureList?.map((item) => item.featureName) || [];
		const { externalName: titleName, rentVo: rentData, submitUser: brokerInfo, floorList } = data;
		return {
			...data,
			vrUrl: data.vrLink || '',
			titleName,
			rentData,
			tags,
			brokerInfo,
			floorList,
			itemType: 'plant',
			index: isActive ? `${num.index}.${num.subIndex++}` : num.index++,
		};
	}
};

const dataList = computed(() => {
	console.log('detail.value>>>>', detail.value);
	if (detail.value) {
		const num = {
			index: 1,
			subIndex: 1,
		};

		return (
			detail.value.reportDetail
				?.map?.(({ parkBaseVo, planthouses, warehouses, userInfo }: any) => {
					const isActive = true;
					const parks = parkBaseVo ? [handlePark(parkBaseVo, num, userInfo)] : [];
					const plants = planthouses?.map((item: any) => handlePlant(item, num, isActive)) || [];
					const wares = warehouses?.map((item: any) => handleOffice(item, num, isActive)) || [];

					if (isActive) {
						num.index++;
					}
					console.log('dataList>>>>', [...parks, ...plants, ...wares]);

					return [...parks, ...plants, ...wares];
				})
				?.flat?.() || []
		);
	} else {
		return [];
	}
});

const initDetail = async () => {
	console.log('props>>>>>>>>>>', props.reportDetail, props.data);
	try {
		if (props.reportDetail) {
			detail.value = { reportDetail: props.reportDetail, carrierListVos: props.data?.carrierListVos || [] };
		}
	} catch (error) {
		console.log(error);
	}
};

const isPark = (item: any) => {
	return item.itemType === 'park';
};

const isPlant = (item: any) => {
	return item.itemType === 'plant';
};

const isWare = (item: any) => {
	return item.itemType === 'ware';
};

const handleNum = (item: any) => {
	return item.index;
};

const getDescName = (item: any) => {
	if (isPark(item)) {
		return '园区简介';
	} else if (isPlant(item)) {
		return '厂房简介';
	} else {
		return '仓库简介';
	}
};

// 根据 index 获取对应的园区数据
const getParkDataByIndex = (currentItem: any) => {
	const currentIndex = currentItem.index;
	if (typeof currentIndex === 'string' && currentIndex.includes('.')) {
		// 如果是 "1.1", "2.1" 格式，提取主索引
		const mainIndex = parseInt(currentIndex.split('.')[0]);
		// 在 dataList 中查找 index 等于主索引的园区项目
		return dataList.value.find(item =>
			isPark(item) && item.index === mainIndex
		);
	}
	return null;
};

const handleInfo = (infos: any[]) => {
	return infos.map(({ name, value, unit, ...others }) => {
		const displayValue = !!value || others.ignore ? value : '--';
		const isHide = value === null || value === undefined;
		return {
			name,
			value: displayValue !== '--' && unit ? `${displayValue}${unit}` : displayValue,
			unit,
			isHide,
			...others,
		};
	});
};

// 厂房信息
const handlePlantInfo = (item: any) => {
	console.log('handlePlantInfo item:', item);

	// 获取对应的园区数据
	const parkData = getParkDataByIndex(item);

	const {
		buildingNum,
		structureName,
		totalNumber,
		sumArea,
		spacing,
		cusElevatorNum,
		elevatorNum,
		elevatorLoad,
		span,
		wallTypeName,
		isCar,
		carLength,
		rentVo: rentData,
		newOldName,
		doorWidth,
		doorHigh,
		nowElectricity,
		waterPrice,
		electricityPrice,
		gasPrice,
		openSpace,
		fireLevelName,
		elevatorLength,
		elevatorWidth,
		elevatorHeight,
		isCrownBlock,
		crownBlock,
		canInstallCrownBlock,
	} = item;
	let elevator =
		(elevatorLength ? '长' + elevatorLength : '') + (elevatorWidth ? '宽' + elevatorWidth : '') + (elevatorHeight ? '高' + elevatorHeight : '');
	return handleInfo([
		{
			name: '楼栋号',
			value: buildingNum,
		},
		{
			name: '建筑结构',
			value: structureName,
		},
		{
			name: '总层数',
			value: totalNumber,
			unit: '层',
		},
		{
			name: '总面积',
			value: sumArea,
			unit: '㎡',
		},
		{
			name: '租售类型',
			value: rentData?.rentSaleType,
		},
		{
			name: '新旧程度',
			value: newOldName,
		},
		{
			name: '厂房柱距',
			value: spacing,
			unit: '米',
		},
		{
			name: '厂房跨度',
			value: span,
			unit: '米',
		},
		{
			name: '厂房门宽',
			value: doorWidth,
			unit: '米',
		},
		{
			name: '厂房门高',
			value: doorHigh,
			unit: '米',
		},
		{
			name: '墙体类型',
			value: wallTypeName,
		},
		{
			name: '可进大车',
			value: parkData?.isCar || item?.isCar,
		},
		{
			name: '最大可进车长',
			value: parkData?.carLength || item?.carLength,
			unit: '米',
		},
		{
			name: '押付方式',
			value: rentData?.stakePayWay,
			// isHide: !isRent,
		},
		{
			name: '最低合同年限',
			value: rentData?.minContractYear,
			unit: '年',
			// isHide: !isRent,
		},
		// {
		// 	name: '现配电',
		// 	value: nowElectricity,
		// 	unit: 'KWA',
		// },
		{
			name: '物业费',
			value: rentData?.propertyPrice,
			unit: '元/㎡/天',
		},
		{
			name: '水费',
			value: waterPrice,
			unit: '元/吨',
		},
		{
			name: '电费',
			value: electricityPrice,
			unit: '元/度',
		},
		{
			name: '燃气费',
			value: gasPrice,
			unit: '元/m³',
		},
		{
			name: '空地',
			value: openSpace,
			unit: '㎡',
		},
		{
			name: '消防等级',
			value: fireLevelName,
		},
		{
			name: '客梯数量',
			value: cusElevatorNum,
			unit: '部',
			// isHide: !isMulti,
		},
		{
			name: '货梯数量',
			value: elevatorNum,
			unit: '部',
			// isHide: !isMulti,
		},
		{
			name: '货梯荷载',
			value: elevatorLoad,
			unit: 'kg/㎡',
			// isHide: !isMulti,
		},
		{
			name: '货梯尺寸',
			value: elevator,
			unit: 'm',
			// isHide: !isMulti,
		},
		{
			name: '天车',
			value: isCrownBlock,
		},
		{
			name: '天车承重',
			value: crownBlock,
			unit: 'kg/㎡',
		},
		{
			name: '可安天车',
			value: canInstallCrownBlock,
		},
	]);
};
const hadndleImg = (item: any) => {
	if (isPlant(item)) {
		// 查找 type 为 4 的内景图片
		const interiorFile = item.plantFiles?.find((file: any) => file.type === '4');
		return interiorFile?.file?.[0]?.transFileUrl || interiorFile?.file?.[0]?.path || '';
	} else if (isWare(item)) {
		// 查找 type 为 4 的内景图片
		const interiorFile = item.warehouseFiles?.find((file: any) => file.type === '4');
		return interiorFile?.file?.[0]?.transFileUrl || interiorFile?.file?.[0]?.path || '';
	} else {
		return '';
	}
};

// 仓库信息
const handleWareInfo = (item: any) => {
	console.log('handlePlantInfo item:', item, dataList.value);

	// 获取对应的园区数据
	const parkData = getParkDataByIndex(item);

	const {
		sumArea,
		totalNumber,
		propertyFee,
		betAndPay,
		elevatorNum,
		warehouseRent: rentData,
		type,
		structure,
		newOld,
		spacing,
		span,
		fireLevel,
		fireDevice,
		platform,
		isRainshed,
		isRampway,
		unloadWay,
		doorHigh,
		doorWidth,
		isElevator,
		elevatorLoad,
		elevatorLength,
		elevatorWidth,
		elevatorHigh,
		isCusElevator,
		cusElevatorNum,
		wallType,
		isCrownBlock,
		crownBlock,
		canInstallCrownBlock,
		isCar,
		carLength,
	} = item;

	return handleInfo([
		{
			name: '总层数',
			value: totalNumber,
			unit: '层',
		},
		{
			name: '总面积',
			value: sumArea,
			unit: '㎡',
		},
		{
			name: '租售类型',
			value: rentData?.rentSaleType,
		},
		{
			name: '仓库类型',
			value: type,
		},
		{
			name: '建筑结构',
			value: structure,
		},
		{
			name: '新旧类型',
			value: newOld,
		},
		{
			name: '柱距',
			value: spacing,
			unit: 'm',
		},
		{
			name: '跨度',
			value: span,
			unit: 'm',
		},
		{
			name: '消防等级',
			value: fireLevel,
		},
		{
			name: '消防设施',
			value: fireDevice,
		},
		{
			name: '月台',
			value: platform,
		},
		{
			name: '雨棚',
			value: isRainshed,
		},
		{
			name: '坡道',
			value: isRampway,
		},
		{
			name: '卸货方式',
			value: unloadWay,
		},
		{
			name: '仓库门高度',
			value: doorHigh,
			unit: 'm',
		},
		{
			name: '仓库门宽度',
			value: doorWidth,
			unit: 'm',
		},
		{
			name: '货梯',
			value: isElevator,
		},

		{
			name: '货梯数量',
			value: elevatorNum,
			unit: '部',
		},
		{
			name: '货梯荷载',
			value: elevatorLoad,
			unit: 'kg/㎡',
		},
		{
			name: '货梯长度',
			value: elevatorLength,
			unit: 'm',
		},
		{
			name: '货梯宽度',
			value: elevatorWidth,
			unit: 'm',
		},
		{
			name: '货梯高度',
			value: elevatorHigh,
			unit: 'm',
		},
		{
			name: '客梯',
			value: isCusElevator,
		},
		{
			name: '客梯数量',
			value: cusElevatorNum,
			unit: '部',
		},
		{
			name: '墙面类型',
			value: wallType,
		},
		{
			name: '天车',
			value: isCrownBlock,
		},
		{
			name: '天车承重',
			value: crownBlock,
			unit: 'kg/㎡',
		},
		{
			name: '可安天车',
			value: canInstallCrownBlock,
		},
		{
			name: '可进大车',
			value: parkData?.isCar || item?.isCar,
		},
		{
			name: '最大可进车长',
			value: parkData?.carLength || item?.carLength,
			unit: '米',
		},
	]);
};

const handleAvatar = (item: any) => {
	const { userInfo } = item;
	if (userInfo && userInfo.avatar) {
		const avatar = userInfo.avatar || [];
		console.log('handleAvatarPath:', avatar[0]?.path);
		return avatar[0]?.path || '';
	} else {
		return '';
	}
};
const haouseWarAvatar = (item: any) => {
	console.log('handleAvatar item:', item.submitUser);
	const { submitUser } = item;
	if (submitUser && submitUser.avatar) {
		const avatar = submitUser.avatar || [];
		console.log('handleAvatarPath:', avatar[0]?.path);
		return avatar[0]?.path || '';
	} else {
		return '';
	}
};
const handleFloor = (item: any, data) => {
	const { floorHeight, floorArea, length, floorLoad, isDivisible, floorNum, floorType, floorTypeName } = item;

	return handleInfo([
		{
			name: '所在楼层',
			value: floorNum + '层',
		},
		{
			name: '层高',
			value: floorHeight,
			unit: 'm',
		},
		{
			name: '单层面积',
			value: floorArea,
			unit: '㎡',
		},
		{
			name: '楼层承重',
			value: floorLoad,
			unit: 'kg/㎡',
		},
		{
			name: '地面类型',
			value: floorTypeName || floorType,
		},
		{
			name: '现配电',
			value: item.nowElectricity,
			unit: 'KVA',
		},
	]);
};

const handleParkTopInfo = (item: any) => {
	const { formatName, industry, provinceName, cityName, regionName, businessDistrictName, purpose, purposeNames } = item;
	let provide: string =
		(provinceName ? `${provinceName}` : '') +
		(cityName ? `${cityName}` : '') +
		(regionName ? `${regionName}` : '') +
		(businessDistrictName ? `${businessDistrictName}` : '');
	return handleInfo([
		{
			name: '园区业态',
			value: formatName?.join?.(',') || '',
		},
		{
			name: '产业方向',
			value: industry?.map((item) => item.industryName)?.join(',') || '',
		},
		{
			name: '所属区域',
			value: provide,
		},
		{
			name: '用途',
			value: purposeNames,
		},
	]);
};

const isRent = (item: any) => {
	if (isPlant(item)) {
		return item.plantRentSaleType?.includes?.('1');
	} else if (isWare(item)) {
		return item.officeRentSaleType?.includes?.('1');
	} else {
		return false;
	}
};

const isSale = (item: any) => {
	if (isPlant(item)) {
		return item.plantRentSaleType?.includes?.('2');
	} else if (isWare(item)) {
		return item.officeRentSaleType?.includes?.('2');
	} else {
		return false;
	}
};

// 获取价格标签显示文本
const getPriceLabel = (item: any) => {
	const rentSaleType = item.rentData?.rentSaleType;
	if (rentSaleType) {
		// 如果包含"出租"或"租"，显示"租金"
		if (rentSaleType.includes('出租') || rentSaleType.includes('租')) {
			return '租金';
		}
		// 如果包含"出售"或"售"，显示"售价"
		if (rentSaleType.includes('出售') || rentSaleType.includes('售')) {
			return '售价';
		}
	}
	// 默认返回原始值
	return rentSaleType || '价格';
};

// 获取价格数值显示
const getPriceValue = (item: any) => {
	const rentSaleType = item.rentData?.rentSaleType;
	if (rentSaleType) {
		// 如果包含"出售"或"售"，取售价
		if (rentSaleType.includes('出售') || rentSaleType.includes('售')) {
			const salePrice = item.rentData?.salePrice;
			return salePrice ? `${salePrice}元/㎡` : '--';
		}
		// 如果包含"出租"或"租"，取租金范围
		if (rentSaleType.includes('出租') || rentSaleType.includes('租')) {
			const { rentPriceMin, rentPriceMax } = item.rentData || {};
			if (rentPriceMin && rentPriceMax) {
				return `${rentPriceMin}-${rentPriceMax}元/㎡/天`;
			} else if (rentPriceMin) {
				return `${rentPriceMin}起元/㎡/天`;
			} else if (rentPriceMax) {
				return `最高${rentPriceMax}元/㎡/天`;
			}
			const rentPrice = item.rentData?.rentPrice;
			return rentPrice ? `${rentPrice}元/㎡/天` : '--';
		}
	}
	// 默认取租金范围
	const { rentPriceMin, rentPriceMax } = item.rentData || {};
	if (rentPriceMin && rentPriceMax) {
		return `${rentPriceMin}-${rentPriceMax}元/㎡/天`;
	} else if (rentPriceMin) {
		return `${rentPriceMin}起元/㎡/天`;
	} else if (rentPriceMax) {
		return `最高${rentPriceMax}元/㎡/天`;
	}
	const rentPrice = item.rentData?.rentPrice;
	return rentPrice ? `${rentPrice}元/㎡/天` : '--';
};

// 获取价格项数组，支持同时显示租金和售价
const getPriceItems = (item: any) => {
	const rentSaleType = item.rentData?.rentSaleType;
	const priceItems: Array<{ label: string; value: string }> = [];

	if (rentSaleType) {
		// 检查是否包含出租
		if (rentSaleType.includes('出租') || rentSaleType.includes('租')) {
			const { rentPriceMin, rentPriceMax } = item.rentData || {};
			let rentValue = '';
			if (rentPriceMin && rentPriceMax) {
				rentValue = `${rentPriceMin}-${rentPriceMax}元/㎡/天`;
			} else if (rentPriceMin) {
				rentValue = `${rentPriceMin}起元/㎡/天`;
			} else if (rentPriceMax) {
				rentValue = `最高${rentPriceMax}元/㎡/天`;
			} else {
				const rentPrice = item.rentData?.rentPrice;
				rentValue = rentPrice ? `${rentPrice}元/㎡/天` : '--';
			}

			priceItems.push({
				label: '租金',
				value: rentValue,
			});
		}

		// 检查是否包含出售
		if (rentSaleType.includes('出售') || rentSaleType.includes('售')) {
			const salePrice = item.rentData?.salePrice;
			priceItems.push({
				label: '售价',
				value: salePrice ? `${salePrice}元/㎡` : '--',
			});
		}
	}

	// 如果没有价格项，返回默认项
	if (priceItems.length === 0) {
		const { rentPriceMin, rentPriceMax } = item.rentData || {};
		let defaultValue = '';
		if (rentPriceMin && rentPriceMax) {
			defaultValue = `${rentPriceMin}-${rentPriceMax}元/㎡/天`;
		} else if (rentPriceMin) {
			defaultValue = `${rentPriceMin}元/㎡/天`;
		} else if (rentPriceMax) {
			defaultValue = `最高${rentPriceMax}元/㎡/天`;
		} else {
			const rentPrice = item.rentData?.rentPrice;
			defaultValue = rentPrice ? `${rentPrice}元/㎡/天` : '--';
		}

		priceItems.push({
			label: rentSaleType || '',
			value: defaultValue,
		});
	}

	return priceItems;
};
</script>

<style lang="scss">
.address-report {
	margin-left: auto;
	margin-right: auto;
	padding-left: 40px;
	padding-right: 40px;
	// margin-bottom: 40px;
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
		border-bottom: 1px solid #edf3f8;
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
		color: #7f7e7e;
		font-size: 14px;
	}

	.info-value {
		margin-left: 11px;
		font-size: 14px;
		color: #3e4b58;
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

	.section-title a {
		color: inherit;
		text-decoration: none;
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
		color: #1763ff;
		font-size: 12px;
		background-color: rgba(23, 99, 255, 0.06);
		cursor: pointer;

		a {
			color: inherit;
			text-decoration: none;
		}
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
		color: #1763ff;
		font-size: 14px;
		background-color: #f3f7ff;
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
		color: #7f7e7e;
		flex: none;
	}

	.park-info-value {
		color: #3e4b58;
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
		border: 1px solid #dcdfe6;
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
		color: #7f7e7e;
		font-size: 12px;
		flex: none;
	}

	.broker-slogan {
		color: #7f7e7e;
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
		color: #424a53;
		font-size: 14px;
		word-wrap: break-word;
		word-break: break-all;
		overflow-wrap: break-word;

	}

	.map-wrapper {
		margin-top: 20px;
	}

	.map-container {
		margin-top: 10px;
	}

	.price-wrapper {
		display: flex;
		flex-direction: column;
		color: #1763ff;
		font-weight: 700;
		// gap: 10px;
	}

	.price-item {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f6f8fb;
		border-radius: 4px;
		// flex: 1;
		height: 35px;
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
		color: #3e4b58;
		font-size: 14px;
		background-color: #f6f8fb;
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
		margin-top: 10px;
		display: flex;
		width: 25%;
		align-items: center;
		gap: 12px;
		font-size: 14px;
	}

	.param-label {
		color: #7f7e7e;
		width: 4em;
		flex: none;
	}

	.param-value {
		color: #3e4b58;

		&.vr-link {
			color: #1763ff;
			cursor: pointer;

			a {
				color: inherit;
				text-decoration: none;
			}
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
		color: #3e4b58;
	}

	.break-after-page {
		break-after: auto;
		padding-bottom: 20px;
		box-sizing: border-box;

		// 只在打印时控制分页
		@media print {
			// break-inside: avoid;
			// page-break-inside: avoid;

			// 所有元素默认不强制分页
			break-after: auto;
			page-break-after: auto;
			break-before: auto;
			page-break-before: auto;

			// 从第二个元素开始才强制分页
			&:not(:first-child) {
				break-before: page !important;
				page-break-before: always !important;
			}

			// 第一个元素特殊处理
			&:first-child {
				break-before: avoid !important;
				page-break-before: avoid !important;
				break-after: auto !important;
				page-break-after: auto !important;
				// min-height: calc(297mm - 200px);
			}
		}
	}

	// 打印时的样式优化
	@media print {
		// 移除左右边距避免偏右
		padding-left: 0 !important;
		padding-right: 0 !important;
		margin-left: 0 !important;
		margin-right: 0 !important;

		// 确保内容宽度适配
		width: 100% !important;
		max-width: 100% !important;

		// 为每个主要内容区域添加分页控制
		.park-image-wrapper,
		.carrier-image-container,
		.params-wrapper,
		.floor-wrapper,
		.map-wrapper {
			break-inside: avoid;
			page-break-inside: avoid;
		}

		// 确保图片不会跨页断开
		.park-image,
		.carrier-image,
		.floor-image {
			break-inside: avoid;
			page-break-inside: avoid;
		}

		.park-image-wrapper {
			width: 300px !important;
		}

		.carrier-image {
			width: 100% !important;
			max-width: 500px !important;
		}

		.broker-card-wrapper {
			width: 250px !important;
		}

		.floor-image-wrapper {
			width: 300px !important;
		}
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
			line-clamp: 2;
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
		color: #04286d;
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
		width: 100%;
		min-height: 980px;
		position: relative;
		padding-top: 92px;
		padding-bottom: 24px;
		padding-left: 40px;
		padding-right: 40px;
		break-after: page;
		margin-top: 50px;
	}

	&__title-image {
		img {
			width: 132px;
		}
	}

	&__computer-image {
		position: absolute;
		top: 0;
		right: 30px;

		img {
			width: 184px;
		}
	}

	&__carrier-content {
		margin-top: 21px;
		display: flex;
		flex-direction: column;
		gap: 18px;
		border-radius: 6px;
	}

	&__carrier-item {
		padding: 24px 35px;
		background-color: white;
		border-radius: 6px;
		box-shadow: 0px 0px 44px 0px rgba(0, 0, 0, 0.03);
	}

	&__carrier-name {
		border-bottom: 1px solid #EDF3F8;
		padding-bottom: 21px;
		font-weight: 500;
	}

	&__carrier-info {
		display: flex;
		margin-top: 21px;
		align-items: center;
		justify-content: space-around;
	}

	&__info-item {
		display: flex;
		align-items: center;
		min-width: 137px;

		&:last-child {
			min-width: 75.21px;
		}
	}

	&__info-label {
		color: #7F7E7E;
		font-size: 14px;
	}

	&__info-value {
		margin-left: 11px;
		font-size: 14px;
		color: #3E4B58;
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

.support-icon img {
	width: 100%;
	height: 100%;
	object-fit: contain;
	max-width: 100%;
	max-height: 100%;
	margin: 0;
	border-radius: 0;
}

@page {
	size: A4;
}
</style>
