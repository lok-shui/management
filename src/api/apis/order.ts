import { AxiosPromise } from "axios";
import fetch from "@/api/fetch";

// const getOrderList = (): AxiosPromise =>
//   fetch.get("/v1/order-manager/purchaseOrder");
const getOrderList = (params: any): AxiosPromise =>
  fetch.get("/v1/order-manager/purchaseOrder", { params });
const createOrder = (params: any): AxiosPromise =>
  fetch.post("/v1/order-manager/purchaseOrder", params);
const getOrderDetails = (id: any): AxiosPromise =>
  fetch.get(`/v1/order-manager/purchaseOrder/${id}`);
const putOrderList = (params: any): AxiosPromise =>
  fetch.put("/v1/order-manager/purchaseOrder", params);
const patchOrderList = (params: any): AxiosPromise =>
  fetch.patch("/v1/order-manager/purchaseOrder", params);
const getbillingscheme = (params: any): AxiosPromise =>
  fetch.get("/v1/service-manager/service/billing-scheme", { params });
const getInterfaceNameList = (params: any): AxiosPromise =>
  fetch.get("/v1/service-manager/service/all", { params });
export default {
  getOrderList,
  createOrder,
  getOrderDetails,
  putOrderList,
  patchOrderList,
  getbillingscheme,
  getInterfaceNameList
};
