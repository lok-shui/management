import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

const getInterfaceList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/interface`, { params });

const deleteInterface = (params: string): AxiosPromise =>
  fetch.delete(`/v1/service-manager/interface/${params}`);

const newInterface = (params: any): AxiosPromise =>
  fetch.post(`/v1/service-manager/interface`, params);

const updateInterface = (params: any): AxiosPromise =>
  fetch.put(`/v1/service-manager/interface`, params);

const getInterfaceDetail = (params: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/interface/${params}`);

const getTemplateList = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/interface/template`);

const fileUpload = (params: any, id: number): AxiosPromise =>
  fetch.put(`/v1/service-manager/interface/file-upload/${id}`, params);

const getServiceList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/service`, { params });

const deleteService = (params: string): AxiosPromise =>
  fetch.delete(`/v1/service-manager/service/${params}`);

const isDeleteAble = (params: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/delete-able/${params}`);

const getServiceGroup = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/serviceGroup`);

const newService = (params: any): AxiosPromise =>
  fetch.post("/v1/service-manager/service", params);

const updateService = (params: any): AxiosPromise =>
  fetch.put("/v1/service-manager/service", params);

const getServiceDetail = (params: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/${params}`);
// 服务：推荐排序
const getServiceOrder = (params: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/order/${params}`);
// 服务：上传文件
const uploadFilePort = (param: any, id: number): AxiosPromise =>
  fetch.post("/v1/service-manager/service/file-upload/" + `${id}`, param, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
// 关联服务
const getLinkedList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/linked-list`, { params });

// 行业应用: 列表
const getIndustryList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/industry`, { params });
// 行业应用: 编辑
const getIndustryEdit = (id: number): AxiosPromise =>
  fetch.get(`/v1/service-manager/industry/` + `${id}`);
// 行业应用: '新建分类'
const addNewIndustry = (params: any): AxiosPromise =>
  fetch.post("/v1/service-manager/industry/setting", params);
// 行业应用：推荐排序
const getIndustryOrder = (params: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/industry/order/${params}`);

// 行业应用: 新增
const newIndustry = (params: any): AxiosPromise =>
  fetch.post("/v1/service-manager/industry", params);
// 行业应用: 更新
const updateIndustry = (params: any): AxiosPromise =>
  fetch.put("/v1/service-manager/industry", params);
// 行业应用：上传文件
const uploadIndustryFile = (param: any, id: number): AxiosPromise =>
  fetch.post("/v1/service-manager/industry/file-upload/" + `${id}`, param, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
// 行业应用：删除
const deleteIndustry = (id: number): AxiosPromise =>
  fetch.delete(`/v1/service-manager/industry/${id}`);

// 首页：BANNER-列表 + 8
const getHomeBannerList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/banner`, { params });
// 首页：BANNER-新增
const addNewBanner = (params: any): AxiosPromise =>
  fetch.post("/v1/service-manager/index/banner", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
// 首页：BANNER-编辑(按照ID查询Banner的详细信息)
const getHomeBannerEdit = (id: number): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/banner/` + `${id}`);
// 首页：BANNER-关联-依据行业分类获取所有上线的行业应用
const getIndustryDetail = (name: any): AxiosPromise =>
  fetch.get(
    `/v1/service-manager/index/industryClass/` + `${name}` + `/application`
  );
// 首页：BANNER-按照ID更新Banner信息
const updateHomeBanner = (param: any, id: number): AxiosPromise =>
  fetch.post(`/v1/service-manager/index/banner/` + `${id}`, param, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });
// 首页：BANNER-AI能力-依据serviceGroup获取服务列表
const getBannerserviceGroup = (name: string): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/banner/serviceGroup/` + `${name}`);
// 首页：BANNER-按照ID修改某个Banner状态
const updateBannerStatus = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/banner/status`, { params });
// 首页：BANNER-最大可选序号
const getHomeBannerOrder = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/banner/order`);

// 首页：行业应用-列表  + 5
const getHomeIndustryList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/industryApplication`, { params });
// 首页：行业应用-更新状态
const updateIndustryActive = (id: number, actived: string): AxiosPromise =>
  fetch.get(
    `/v1/service-manager/index/industryApplication/actived` +
      `?id=` +
      `${id}` +
      `&actived=` +
      `${actived}`
  );
// 首页：行业应用-添加
const addHomeIndustry = (id: number, order: number): AxiosPromise =>
  fetch.get(
    `/v1/service-manager/index/industryApplication/` +
      `${id}` +
      `/` +
      `${order}`
  );
// 首页：行业应用-删除
const deleteIndustryItem = (id: number): AxiosPromise =>
  fetch.delete(`/v1/service-manager/index/industryApplication/${id}`);
// 首页：行业应用-最大可选序号
const getHomeIndustryOrder = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/industryClass/order`);

// 首页：服务-列表 + 5
const getHomeServiceList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/serviceGroup`, { params });
// 首页：服务-更新状态
const updateServiceStatus = (id: number, status: number): AxiosPromise =>
  fetch.put(`/v1/service-manager/index/serviceGroup/${id}/${status}`);
// 首页：服务-删除
const deleteServiceItem = (id: number): AxiosPromise =>
  fetch.delete(`/v1/service-manager/index/serviceGroup/${id}`);
// 首页：服务-最大可选序号
const getHomeServiceOrder = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/serviceGroup/order`);
// 首页：服务-添加
const addHomeService = (id: number, order: number): AxiosPromise =>
  fetch.get(`/v1/service-manager/index/serviceGroup/${id}/${order}`);

// 我的工单: 查询工单列表
const getWorkOrder = (params: any): AxiosPromise =>
  fetch.get("/api/v1/application-manager/workOrder", { params });
// 我的工单: 改变工单状态
const getActiveOrkOrder = (id: any, params: any): AxiosPromise =>
  fetch.get(`/api/v1/application-manager/workOrder/${id}/review`, { params });
// 我的工单: 查看工单详情
const getDetailWorkOrder = (id: any): AxiosPromise =>
  fetch.get(`/api/v1/application-manager/workOrder/${id}`);

const getServiceListAll = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/list`);

const getServiceAll = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/list`);

// const getInterfaceNameList = (): AxiosPromise =>
//   fetch.get(`/v1/service-manager/interface/list`);
// 服务接口修改
const getInterfaceNameList = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/list`);
const getAuthorizationList = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/all`);

const getServiceManagerList = (params: any): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/list`, { params });

const newInterfaceUploadFile = (params: any, id: number): AxiosPromise =>
  fetch.post(`/v1/service-manager/interface/file-upload/${id}`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });

const editInterfaceUploadFile = (params: any, id: number): AxiosPromise =>
  fetch.post(`/v1/service-manager/interface/files/${id}`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });

const uploadVideoSource = (params: any, id: number): AxiosPromise =>
  fetch.post(`/v1/service-manager/service/video-upload/${id}`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });

export default {
  getInterfaceList,
  getInterfaceDetail,
  deleteInterface,
  newInterface,
  updateInterface,
  getServiceList,
  deleteService,
  getServiceGroup,
  newService,
  updateService,
  getServiceDetail,
  getServiceListAll,
  getServiceAll,
  fileUpload,
  getTemplateList,
  isDeleteAble,
  editInterfaceUploadFile,
  newInterfaceUploadFile,
  uploadVideoSource,
  getInterfaceNameList,
  getAuthorizationList,
  getServiceManagerList,
  getServiceOrder,
  uploadFilePort,
  getLinkedList,
  getIndustryList,
  getIndustryEdit,
  getIndustryOrder,
  newIndustry,
  updateIndustry,
  uploadIndustryFile,
  deleteIndustry,
  addNewIndustry,
  getHomeBannerList,
  addNewBanner,
  getHomeBannerEdit,
  getIndustryDetail,
  updateHomeBanner,
  getBannerserviceGroup,
  updateBannerStatus,
  getHomeIndustryList,
  updateIndustryActive,
  addHomeIndustry,
  getHomeServiceList,
  updateServiceStatus,
  deleteIndustryItem,
  deleteServiceItem,
  getHomeBannerOrder,
  getHomeIndustryOrder,
  getHomeServiceOrder,
  addHomeService,
  getWorkOrder,
  getActiveOrkOrder,
  getDetailWorkOrder
};
