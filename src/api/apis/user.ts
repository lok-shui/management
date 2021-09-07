import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";
import cache from "@/utils/cache";

const userLogin = (params: any): AxiosPromise =>
  fetch.post("/v1/system-manager/employee/login", params);

const getUserInfo = (params: string): AxiosPromise =>
  fetch.get(`/v1/system-manager/employee/detail?name=` + params);

const changePwd = (params: string): AxiosPromise =>
  fetch.put(`/v1/system-manager/employee/password-change`, params);

const frontPage = (params: number): AxiosPromise =>
  fetch.get(`/v1/system-manager/redirect/${params}`);

export default {
  userLogin,
  getUserInfo,
  changePwd,
  frontPage
};
