import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

const getClientList = (params: any): AxiosPromise =>
  fetch.get(`/v1/user-manager/user`, { params });

const getClientDetail = (params: string): AxiosPromise =>
  fetch.get(`/v1/user-manager/user/${params}`);

const handleClientUserStatus = (params: any): AxiosPromise =>
  fetch.put("/v1/user-manager/user/status", params);

const deleteClient = (params: any): AxiosPromise =>
  fetch.delete("/v1/user-manager/user", { data: params });

const updateClient = (id: any, params: any): AxiosPromise =>
  fetch.put(`/v1/user-manager/user/${id}`, params);

const registerClient = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/user/register/back-stage", params);

const getDataAnalysisLog = (params: any): AxiosPromise =>
  fetch.get(`/v1/data-analysis/log`, { params });
const getDataAnalysisLogTypes = (): AxiosPromise =>
  fetch.get(`/v1/data-analysis/logTypes`);

const getDataAnalysisData = (params: any): AxiosPromise =>
  fetch.get(`/v1/data-analysis/data`, { params });

const getOrderList = (params: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/order`, { params });

const getSummaryList = (params: any): AxiosPromise =>
  fetch.get(`/v1/bill-service/summary`, { params });

const getAuthorizationList = (params: any): AxiosPromise =>
  fetch.get(`/v1/user-manager/oauth`, { params });

const getAuthorization = (params: string): AxiosPromise =>
  fetch.get(`/v1/user-manager/oauth/${params}`);

const rechargeAuthorization = (params: any): AxiosPromise =>
  fetch.put("/v1/user-manager/oauth/recharge_token", params);

const deleteAuthorization = (params: string): AxiosPromise =>
  fetch.delete(`/v1/user-manager/oauth/batch/${params}`);

const newAuthorization = (params: any): AxiosPromise =>
  fetch.post("/v1/user-manager/oauth", params);

const getUsernameList = (): AxiosPromise =>
  fetch.get("/v1/user-manager/user/enable/username");

// 合作咨询
const getConsultList = (params: any): AxiosPromise =>
  fetch.get("/v1/user-manager/consult", { params });
// 合作咨询导出
const getConsultExport = (params: any): AxiosPromise =>
  fetch.get("/v1/user-manager/consult/download", { params });
// AI能力下拉菜单
const getApiNavMenu = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/runnable-list`);

const handleClientAuthStatus = (params: any): AxiosPromise =>
  fetch.post("/v1/token-server/oauth/client/status", params);
// 获取接入方法
const getUseMethod = (): AxiosPromise =>
  fetch.get("/v1/token-server/purchase-info/use-method");
// 获取计费方式
const getBillingType = (): AxiosPromise =>
  fetch.get("/v1/token-server/purchase-info/billing-type");
// 获取服务有效计算类型
const getServiceType = (): AxiosPromise =>
  fetch.get("/v1/token-server/purchase-info/service-valid-type");
// 新增账单记录
const addpurchaseinfo = (params: any): AxiosPromise =>
  fetch.post("/v1/token-server/purchase-info", params);
// 获取全部用户账单
const getPurchaseInfo = (params: any): AxiosPromise =>
  fetch.get("/v1/token-server/purchase-info", { params });
// 删除账单记录
const deletepurchaseId = (purchaseId: any): AxiosPromise =>
  fetch.delete(`/v1/token-server/purchase-info/${purchaseId}`);
// 获取全部用户账单
const getPurchase = (id: any): AxiosPromise =>
  fetch.get(`/v1/token-server/purchase-info/${id}`);
// 合作咨询导出
export default {
  getClientList,
  getClientDetail,
  handleClientUserStatus,
  deleteClient,
  updateClient,
  getDataAnalysisLog,
  getDataAnalysisLogTypes,
  getDataAnalysisData,
  getOrderList,
  getSummaryList,
  getAuthorizationList,
  getAuthorization,
  rechargeAuthorization,
  deleteAuthorization,
  newAuthorization,
  getUsernameList,
  registerClient,
  handleClientAuthStatus,
  getConsultList,
  getConsultExport,
  //
  getUseMethod,
  getBillingType,
  getServiceType,
  addpurchaseinfo,
  getPurchaseInfo,
  deletepurchaseId,
  getPurchase,
  getApiNavMenu
};
