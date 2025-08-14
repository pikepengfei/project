import type { IDictResponse } from './dict'

export enum E_PAGE_TYPE {
  PARK = 'park',
  PLANT = 'plant',
  OFFICE = 'office',
}
export interface IPageType {
  type: string
  icon: string
  title: string
  id: string
}
/**
 * 排序方式： DESC  ASC
 */
export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC',
}
/**
 * Sort
 */
export interface Sort {
  /**
   * 排序方式： DESC  ASC
   */
  direction?: Direction
  /**
   * 排序字段
   */
  property?: string
  [property: string]: any
}

/**
 * ParamEntity«IParkCondition»
 */
export interface IListParam<T> {
  condition?: T
  /**
   * 当前页码
   */
  current?: number
  /**
   * 每页显示数量
   */
  size?: number
  /**
   * 排序
   */
  sorts?: Sort[]
  [property: string]: any
}

/**
 * 园区查询条件
 */
export interface IParkCondition {
  /**
   * 产业方向code
   */
  industryId?: string
  /**
   * 搜索园区名称
   */
  parkName?: string
  /**
   * 园区类型
   */
  parkType?: number
  /**
   * 所属区域code
   */
  streetId?: string
  /**
   * 园区配套
   */
  supporting?: string[]
  [property: string]: any
}

/**
 * OrderItem
 */
export interface OrderItem {
  asc?: boolean
  column?: string
  [property: string]: any
}

/**
 * IParkRecords
 */
export interface IParkRecord {
  /**
   * 外立面url地址
   */
  externalFacadeUrl?: string
  /**
   * 是否有vr
   */
  haveVr?: number
  /**
   * 园区id
   */
  id?: string
  /**
   * 产业方向
   */
  industryName?: string[]
  /**
   * 园区标题
   */
  parkName?: string
  /**
   * 园区类型
   */
  parkType?: string[]
  /**
   * 所属街道
   */
  streetName?: string
  /**
   * 配套信息
   */
  supportingName?: string[]
  /**
   * vr链接
   */
  vrUrl?: string
  [property: string]: any
}

/**
 * 厂房的列表卡片信息
 */
export interface IPlantRecord {
  rentSaleType: string
  /**
   * 面积
   */
  areaName?: string
  /**
   * 外立面url地址
   */
  externalFacadeUrl?: string
  /**
   * 厂房特色
   */
  featureName?: string[]
  /**
   * 是否有vr
   */
  haveVr?: number
  /**
   * 厂房id
   */
  id?: string
  /**
   * 新旧程度
   */
  newOld?: number
  /**
   * 园区所属街镇
   */
  parkStreetName?: string
  /**
   * 厂房标题
   */
  plantName?: string
  /**
   * 出售类型
   */
  salePrice?: number
  /**
   * 建筑结构
   */
  structureName?: number
  /**
   * 总层数
   */
  totalNumber?: number
  /**
   * vr链接
   */
  vrUrl?: string
  [property: string]: any
}
/**
 * 办公的列表卡片信息
 */
export interface IOfficeRecord {
  rentSaleType: string
  areaName?: string
  externalFacadeUrl?: string
  floorInfo?: string
  haveVr?: number
  /**
   * 办公id
   */
  id?: string
  officeFeatureName?: string[]
  officeName?: string
  parkAddress?: string
  rentPriceOrSale?: string
  vrUrl?: string
  [property: string]: any
}
/**
 * Page«IParkRecords»
 */
export interface IListResponse<T> {
  countId?: string
  current?: number
  maxLimit?: number
  optimizeCountSql?: boolean
  orders?: OrderItem[]
  pages?: number
  records?: T[]
  searchCount?: boolean
  size?: number
  total?: number
  [property: string]: any
}
export enum E_InputType {
  AREA = 'area',
}
export interface InputInfo {
  num: number
  unit: string
  pre?: string
}
export interface MoreOption {
  key: string
  label: string
  multiple?: boolean
  options: Array<any>
  inputInfo?: Array<InputInfo>
}

/**
 * @description: 筛选项配置
 * @return {*}
 */
export interface FilterOption {
  urlKey?: string
  key: string
  label: string
  more?: Array<MoreOption>
  input?: E_InputType
  options?: Array<IDictResponse>
  id: string
}

/**
 * 园区展示地图查询条件
 */
export interface IParkMapRequest {
  /**
   * 产业方向code
   */
  industryId?: string
  /**
   * 最大纬度
   */
  maxLatitude: number
  /**
   * 最大经度
   */
  maxLongitude: number
  /**
   * 最小纬度
   */
  minLatitude: number
  /**
   * 最小经度
   */
  minLongitude: number
  /**
   * 搜索园区名称
   */
  parkName?: string
  /**
   * 园区类型
   */
  parkType?: number
  /**
   * 所属区域code
   */
  streetId?: string
  /**
   * 园区配套
   */
  supporting?: string[]
  [property: string]: any
}

/**
 * 园区展示地图返回数据
 */
export interface IParkResponseItem {
  /**
   * 纬度
   */
  latitude?: number
  /**
   * 经度
   */
  longitude?: number
  /**
   * 园区id
   */
  parkId?: string
  /**
   * 园区名称
   */
  parkName?: string
  [property: string]: any
}
/**
 * 厂房搜索查询条件
 */
export interface IPlantCondition {
  /**
   * 货梯高
   */
  cargoElevatorHigh?: string
  /**
   * 货梯数量
   */
  cargoElevatorNum?: string
  /**
   * 货梯宽
   */
  cargoElevatorWidth?: string
  /**
   * 押付方式
   */
  depositMethodType?: string
  /**
   * 可办环评
   */
  evaluate?: number
  /**
   * 产业方向
   */
  industryId?: string
  /**
   * 有无天车
   */
  isCrownBlock?: number
  /**
   * VR视频
   */
  isVr?: number
  /**
   * 园区id
   */
  parkId?: string
  /**
   * 客梯数量
   */
  passengerElevatorNum?: string
  /**
   * 厂房柱距
   */
  plantColumnDistance?: string
  /**
   * 厂房特色
   */
  plantFeatureName?: string
  /**
   * 消防等级
   */
  plantFireProtection?: number
  /**
   * 耐火等级
   */
  plantFireResistant?: number
  /**
   * 搜索厂房名称
   */
  plantName?: string
  /**
   * 新旧程度
   */
  plantNewOld?: number
  /**
   * 厂房售价
   */
  plantPrice?: string
  /**
   * 厂房租金
   */
  plantRent?: string
  /**
   * 单层面积
   */
  plantSingleArea?: string
  /**
   * 总面积
   */
  plantTotalArea?: string
  /**
   * 租售类型
   */
  rentSaleType?: string
  /**
   * 所属区域id
   */
  streetId?: string
  /**
   * 建筑结构
   */
  structure?: number
  /**
   * 园区配套
   */
  supporting?: string[]
  /**
   * 厂房类型
   */
  type?: number
  [property: string]: any
}

/**
 * 厂房展示地图查询条件
 */
export interface IPlantMapCondition {
  /**
   * 货梯高
   */
  cargoElevatorHigh?: string
  /**
   * 货梯数量
   */
  cargoElevatorNum?: string
  /**
   * 货梯宽
   */
  cargoElevatorWidth?: string
  /**
   * 押付方式
   */
  depositMethodType?: string
  /**
   * 可办环评
   */
  evaluate?: number
  /**
   * 产业方向
   */
  industryId?: string
  /**
   * 有无天车
   */
  isCrownBlock?: number
  /**
   * VR视频
   */
  isVr?: number
  /**
   * 最大纬度
   */
  maxLatitude: number
  /**
   * 最大经度
   */
  maxLongitude: number
  /**
   * 最小纬度
   */
  minLatitude: number
  /**
   * 最小经度
   */
  minLongitude: number
  /**
   * 客梯数量
   */
  passengerElevatorNum?: string
  /**
   * 厂房柱距
   */
  plantColumnDistance?: string
  /**
   * 厂房特色
   */
  plantFeatureName?: string[]
  /**
   * 消防等级
   */
  plantFireProtection?: number
  /**
   * 耐火等级
   */
  plantFireResistant?: number
  /**
   * 搜索厂房名称
   */
  plantName?: string
  /**
   * 新旧程度
   */
  plantNewOld?: number
  /**
   * 厂房售价
   */
  plantPrice?: string
  /**
   * 厂房租金
   */
  plantRent?: string
  /**
   * 单层面积
   */
  plantSingleArea?: string
  /**
   * 总面积
   */
  plantTotalArea?: string
  /**
   * 租售类型
   */
  rentSaleType?: string
  /**
   * 所属区域id
   */
  streetId?: string
  /**
   * 建筑结构
   */
  structure?: number
  /**
   * 园区配套
   */
  supporting?: string[]
  /**
   * 厂房类型
   */
  type?: number
  [property: string]: any
}

/**
 * 厂房展示地图返回数据
 */
export interface IPlantMapItem {
  /**
   * 纬度
   */
  latitude?: number
  /**
   * 经度
   */
  longitude?: number
  /**
   * 园区id
   */
  parkId?: string
  /**
   * 园区名称
   */
  parkName?: string
  /**
   * 厂房的数量
   */
  plantNumStr?: string
  [property: string]: any
}

/**
 * 办公搜索-->查询条件
 */
export interface IOfficeCondition {
  airConfig?: string[]
  /**
   * 装修类型
   */
  decorationType?: string
  /**
   * 例子：押1付3---传值为【1-3】，以 - 分隔
   */
  depositMethodType?: string
  industryId?: string
  /**
   * 是否分割
   */
  isDivision?: number
  /**
   * 可注册
   */
  isRegister?: number
  /**
   * VR视频
   */
  isVr?: number
  /**
   * 例子：1年以下---传值为【0-1】、1年 1-1、3年 3-3，以 - 分隔
   */
  leaseRent?: string
  /**
   * 面积
   */
  officeArea?: string
  /**
   * 办公特色名称
   */
  officeFeatureName?: string[]
  officeName?: string
  /**
   * 办公售价
   */
  officePrice?: string
  /**
   * 办公租金
   */
  officeRent?: string
  orientationList?: string[]
  /**
   * 园区id
   */
  parkId?: string
  /**
   * 租售类型
   */
  rentSaleType?: string
  /**
   * 层高
   */
  storeyHeight?: string
  streetId?: string
  supporting?: string[]
  [property: string]: any
}

/**
 * 办公展示地图返回数据
 */
export interface IOfficeMapItem {
  /**
   * 纬度
   */
  latitude?: number
  /**
   * 经度
   */
  longitude?: number
  /**
   * 办公的数量
   */
  officeNumStr?: string
  /**
   * 园区id
   */
  parkId?: string
  /**
   * 园区名称
   */
  parkName?: string
  [property: string]: any
}
/**
 * 办公展示地图查询条件
 */
export interface IOfficeMapConditon {
  airConfig?: string[]
  /**
   * 装修类型
   */
  decorationType?: string
  /**
   * 例子：押1付3---传值为【1-3】，以 - 分隔
   */
  depositMethodType?: string
  industryId?: string
  /**
   * 是否分割
   */
  isDivision?: number
  /**
   * 可注册
   */
  isRegister?: number
  /**
   * VR视频
   */
  isVr?: number
  /**
   * 例子：1年以下---传值为【0-1】、1年 1-1、3年 3-3，以 - 分隔
   */
  leaseRent?: string
  /**
   * 最大纬度
   */
  maxLatitude: number
  /**
   * 最大经度
   */
  maxLongitude: number
  /**
   * 最小纬度
   */
  minLatitude: number
  /**
   * 最小经度
   */
  minLongitude: number
  /**
   * 面积
   */
  officeArea?: string
  /**
   * 办公特色名称
   */
  officeFeatureName?: string[]
  officeName?: string
  /**
   * 办公售价
   */
  officePrice?: string
  /**
   * 办公租金
   */
  officeRent?: string
  orientationList?: string[]
  /**
   * 租售类型
   */
  rentSaleType?: string
  /**
   * 层高
   */
  storeyHeight?: string
  streetId?: string
  supporting?: string[]
  [property: string]: any
}

export interface HomeIndustry {
  industryId: string
  industryName: string
  descName: string
  logoUrl: string
}
