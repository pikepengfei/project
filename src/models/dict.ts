/**
 * 字典数据表
 */
export interface IDictResponse {
  dictCode?: number
  dictLabel?: string
  dictType?: string
  dictValue?: string
  urlKey?: string
  [property: string]: any
}

export enum E_DICT_TYPE {
  // 园区类型
  park_type = 'park_type',
  // 产业方向
  //   INDUSTRY_DIRECTION = 'industry_direction',
  // 所属区域
  street_info = 'street_info',
  // 园区配套
  supporting = 'supporting',
  // 建筑结构
  plant_structure = 'plant_structure',
  // 新旧程度
  plant_new_old = 'plant_new_old',
  // 租售类型
  rent_sale_type = 'rent_sale_type',
  // 租金
  plant_rent = 'plant_rent',
  // 厂房类型
  plant_type = 'plant_type',
  // 厂房售价
  plant_price = 'plant_price',
  // 厂房总面积
  plant_total_area = 'plant_total_area',
  // 厂房单层面积
  plant_single_area = 'plant_single_area',
  // 业务有误
  common_has_no = 'common_has_no',
  // 押付方式
  deposit_method_type = 'deposit_method_type',
  // 可办环评
  plant_evaluate = 'plant_evaluate',
  // 厂房柱距
  plant_column_distance = 'plant_column_distance',
  // 厂房耐火等级
  plant_fire_resistant = 'plant_fire_resistant',
  // 消防等级
  plant_fire_protection = 'plant_fire_protection',
  // 客梯数量
  passenger_elevator_num = 'passenger_elevator_num',
  // 货梯数量
  cargo_elevator_num = 'cargo_elevator_num',
  // 有无天车、可分割
  yes_or_no = 'yes_or_no',
  // 办公租金
  office_rent = 'office_rent',
  // 办公售价
  office_price = 'office_price',
  // 办公面积
  office_area = 'office_area',
  // 装修程度
  decoration_type = 'decoration_type',
  // 起租期
  lease_start_date = 'lease_start_date',
  // 朝向
  orientation = 'orientation',
  // 空调配置
  air_config = 'air_config',
}
