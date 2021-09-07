import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

//用户
const getAdminList = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/employee", { params });

const getDmUserAll = (params?: any): AxiosPromise =>
  fetch.get("/v1/system-manager/employee/list", { params });

const getAdminDetail = (params: string): AxiosPromise =>
  fetch.get(`/v1/system-manager/employee/detail?name=` + params);

const newAdmin = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/employee", params);

const updateAdmin = (params: any): AxiosPromise =>
  fetch.patch("/v1/system-manager/employee", params);

const deleteAdmin = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/employee/status/del", { params });

const openAdmin = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/employee/status/open", { params });

const closeAdmin = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/employee/status/close", { params });
//配置
const getConfigList = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/setting", { params });

const newConfig = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/setting", params);

const updateConfig = (params: any): AxiosPromise =>
  fetch.put("/v1/system-manager/setting", params);

const deleteConfig = (params: string): AxiosPromise =>
  fetch.delete(`/v1/system-manager/setting/${params}`);

const getConfigDetail = (id: string): AxiosPromise =>
  fetch.get(`/v1/system-manager/setting/${id}`);
// 新增服务
const addNewService = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/setting", { params });
//新增行业应用
const addNewServiceApplicate = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/setting", params);

// 新建分类
const addNewClassify = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/setting", params);

//角色
const getRoleList = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/role", { params });

// (行业应用管理：'新建分类'的弹窗里的接口)
const addNewIndustry = (params: any): AxiosPromise =>
  fetch.post("/v1/service-manager/industry/setting", params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });

const deleteRole = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/role/status/del", { params });

const getRoleClass = (): AxiosPromise =>
  fetch.get("/v1/system-manager/role/role-class");

const newRole = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/role", params);

const updateRole = (params: any): AxiosPromise =>
  fetch.patch("/v1/system-manager/role", params);

const getRoleDetail = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/role/detail", { params });

const activeRole = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/role/status/open", { params });

const suspendRole = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/role/status/close", { params });

const getActiveRole = (): AxiosPromise =>
  fetch.get("/v1/system-manager/role/optional-list");

//权限
const getAuthorityList = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/authority", { params });

const deleteAuthority = (params: any): AxiosPromise =>
  fetch.delete("/v1/system-manager/authority", { params });

const getAuthorityDetail = (params: any): AxiosPromise =>
  fetch.get("/v1/system-manager/authority/detail", { params });

const newAuthority = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/authority", params);

const updateAuthority = (params: any): AxiosPromise =>
  fetch.patch("/v1/system-manager/authority", params);

const getClassNameList = (): AxiosPromise =>
  fetch.get("/v1/system-manager/authority/list");

const getServiceVideoList = (params: any): AxiosPromise =>
  fetch.get("/v1/service-manager/service/setting-list", { params });

const getServiceSelect = (): AxiosPromise =>
  fetch.get(`/v1/service-manager/service/list`);

const getConfigTypeList = (): AxiosPromise =>
  fetch.get(`/v1/system-manager/setting?type=前台展示页模板名称`);

const editVideoSource = (params: any, id: number): AxiosPromise =>
  fetch.post(`/v1/service-manager/service/video-upload/${id}`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-DM-ContentType": "multipart"
    }
  });

export default {
  getAdminList,
  getDmUserAll,
  getAdminDetail,
  newAdmin,
  updateAdmin,
  deleteAdmin,
  openAdmin,
  closeAdmin,
  //
  getConfigList,
  newConfig,
  updateConfig,
  deleteConfig,
  getConfigDetail,
  //
  getAuthorityList,
  deleteAuthority,
  getAuthorityDetail,
  newAuthority,
  updateAuthority,
  getClassNameList,
  //
  getRoleList,
  deleteRole,
  getRoleClass,
  newRole,
  updateRole,
  getRoleDetail,
  activeRole,
  suspendRole,
  getActiveRole,
  //
  getServiceVideoList,
  getServiceSelect,
  getConfigTypeList,
  editVideoSource,
  //
  addNewService,
  addNewClassify,
  addNewServiceApplicate,
  addNewIndustry
};
