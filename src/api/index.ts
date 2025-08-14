import type { IDictResponse } from '../models/dict'
import type {
  HomeIndustry,
  IListParam,
  IListResponse,
  IOfficeCondition,
  IOfficeMapConditon,
  IOfficeRecord,
  IParkCondition,
  IParkMapRequest,
  IParkRecord,
  IParkResponseItem,
  IPlantCondition,
  IPlantMapCondition,
  IPlantMapItem,
  IPlantRecord,
} from '../models/list'
import type { IUserInfo } from '../stores/use-user'

/**
 * @description: 园区列表
 * @return {*}
 * @param {IListParam} listParam
 */
export const getParkList = (listParam: IListParam<IParkCondition>) => {
  return Http.post<IListResponse<IParkRecord>>(
    '/lymh/api/tPark/search',
    listParam,
  )
}
// 新增园区合作
export const cooperatepark = (listParam: IListParam<IParkCondition>) => {
  return Http.post<IListResponse<IParkRecord>>(
    '/lymh/business/cooperatepark/add',
    listParam,
  )
}
// 新增商务合作
export const tpark = (listParam: IListParam<IParkCondition>) => {
  return Http.post<IListResponse<IParkRecord>>(
    '/lymh/api/cooperatebus/add',
    listParam,
  )
}
// ai选址报告
export const createAiReport = (listParam: any) => {
  return Http.post<any>('/lymh/auth/report/createAiReport', listParam)
}
export const getCompanyList = (params: any) => {
  return Http.post<any>('/aiassistantReport/searchEnterprise', params)
}

export const getmsg = (msg: string) => {
  return Http.get<any>('/lymh/auth/report/sendAi/?msg=' + msg)
}

// 根据字典类型查询字典数据信息
export const getDicts = (dictType: string) => {
  return Http.get<any>(
    '/lymh/business/sysDictData/listByCodes?codes=' + dictType,
  )
}
/**
 * @description: 获取所有字典数据
 * @return {*}
 */
export const getAllDicts = () => {
  return Http.get<any>('/lymh/business/sysDictData/listAll')
}
/**
 * @description: 预选址清单园区列表
 * @return {*}
 * @param {string} ids 园区id数组
 */
export const getCartParkList = (ids: string[]) => {
  return Http.post<IParkRecord[]>('/lymh/api/preSite/park', { ids })
}
/**
 * @description: 预选址清单厂房列表
 * @return {*}
 * @param {string} ids 厂房id数组
 */
export const getCartPlantList = (ids: string[]) => {
  return Http.post<IPlantRecord[]>('/lymh/api/preSite/plant', { ids })
}
/**
 * @description: 预选址清单办公列表
 * @return {*}
 * @param {string} ids 办公id数组
 */
export const getCartOfficeList = (ids: string[]) => {
  return Http.post<IOfficeRecord[]>('/lymh/api/preSite/office', { ids })
}
/**
 * @description: 园区产业方向
 * @return {*}
 */
export const getParkIndustryDirection = () => {
  return Http.get<any>('/lymh/api/tPark/industryListAll')
}
/**
 * @description: 可视范围内园区地图数据
 * @return {*}
 * @param {IParkMapRequest} mapParam
 */
export const parkMapData = (mapParam: IParkMapRequest) => {
  return Http.post<IParkResponseItem[]>('/lymh/api/tPark/searchToMap', mapParam)
}
/**
 * @description: 厂房列表分页
 * @return {*}
 * @param {IPlantCondition} listParam
 */
export const getPlantList = (listParam: IListParam<IPlantCondition>) => {
  return Http.post<IListResponse<IPlantRecord>>(
    '/lymh/api/tPlant/search',
    listParam,
  )
}
/**
 * @description: 载体特色
 * @return {*}
 * @param {string} code 1：厂房，2：办公
 */
export const getFeatureInfo = (code: string) => {
  return Http.get<any>(`/lymh/api/tFeatureInfo/dictFeatureData/${code}`)
}
/**
 * @description: 厂房地图查询
 * @return {*}
 * @param {IPlantMapCondition} mapParam
 */
export const getPlantMap = (mapParam: IPlantMapCondition) => {
  return Http.post<IPlantMapItem[]>('/lymh/api/tPlant/searchToMap', mapParam)
}
/**
 * @description: 办公列表
 * @return {*}
 * @param {IListParam} listParam
 */
export const getOfficeList = (listParam: IListParam<IOfficeCondition>) => {
  return Http.post<IListResponse<IOfficeRecord>>(
    '/lymh/api/tOffice/search',
    listParam,
  )
}
/**
 * @description: 办公地图
 * @return {*}
 * @param {IOfficeMapConditon} mapParam
 */
export const getOfficeMap = (mapParam: IOfficeMapConditon) => {
  return Http.post<IOfficeRecord[]>('/lymh/api/tOffice/searchToMap', mapParam)
}
/**
 * @description: 发送短信验证码
 * @return {*}
 * @param {string} phone
 */
export const sendMessageCode = (phone: string) => {
  return Http.post('/lymh/business/login/sendMsg', { phone, type: 1 })
}
/**
 * @description: 用户登录接口
 * @return {*}
 * @param {string} phone
 * @param {string} code
 */
export const loginApi = (phone: string, code: string) => {
  return Http.post<IUserInfo>('/lymh/business/login/userLogin', { phone, code })
}
/**
 * @description: 生成选址报告
 * @return {*}
 * @param {string} ids
 * @param {number} type
 */
export const generateReportApi = (ids: string, type: number) => {
  return Http.post<any>('/lymh/auth/report/create', { ids, type })
}

/**
 * @description: 报告详情信处
 * @return {*}
 */
export const queryReportDetail = (id: any) => {
  return Http.post<any>(`/lymh/api/preSite/carrierReportData/${id}`)
}
/**
 * @description: 获取首页产业方向tab
 * @return {*}
 */
export const getHomeIndustry = () => {
  return Http.get<Array<HomeIndustry>>('/lymh/api/index/industryIndex')
}
/**
 * @description: 首页根据产业id获取园区数据
 * @return {*}
 * @param {string} industryId
 */
export const getParkDataWithIndustryId = (industryId: string) => {
  return Http.get<IParkRecord[]>(`/lymh/api/index/parkInfoIndex/${industryId}`)
}
/**
 * @description: AI选址分析报告详情
 * @return {*}
 * @param {string} threadId
 */
export const queryAiAnalysisReportDetail = (threadId: string) => {
  return Http.post<any>(`/lymh/api/report/aiSiteAnalysis/detail/${threadId}`)
}
/**
 * @description: 生成二维码
 * @return {*}
 */
export const createQrCode = (threadId: string) => {
  return Http.get(`/lymh/api/report/qrcreate/${threadId}`)
}
/**
 * @description: 获取购物车未下架的项目id
 * @return {*}
 * @param {string} ids
 * @param {number} typeId 0：园区；1：厂房；2：办公
 */
export const getRealCartId = (ids: string[], typeId: number) => {
  return Http.post<any>('/lymh/api/preSite/getPreSiteIdList', { ids, typeId })
}
/**
 * @description: 生成报告二维码
 * @return {*}
 * @param {string} threadId
 */
export const getReportQrCode = (threadId: string) => {
  return Http.get(`/lymh/api/report/qrcreate/${threadId}`)
}
/**
 * @description: 获取企业信息
 * @return {*}
 * @param {string} industryId
 */
export const getEnterpriseInfo = (industryId: string) => {
  return Http.get(`/lymh/api/enterpriseInfo/list/${industryId}`)
}
/**
 * @description: 配套设施字典
 * @return {*}
 */
export const getSupportingList = () => {
  return Http.get(`/lymh/api/supporting/list`)
}
