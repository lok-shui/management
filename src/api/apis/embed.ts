import { AxiosPromise } from "axios";
import userFetch from "@/api/fetch/userIndex";

// 用户申请: 列表
const getUserApplyList = (params: any): AxiosPromise =>
  userFetch.get(`/api/v1/application`, { params });
// 用户申请: 是否通过
const getUserApplyReview = (id: any, status: any): AxiosPromise =>
  userFetch.get(`/api/v1/application/${id}/review/${status}`);
// 用户申请: 详情
const getUserApplyDetail = (id: any): AxiosPromise =>
  userFetch.get(`/api/v1/application/${id}`);

// 用户反馈: 列表
const getUserFeedbackList = (params: any): AxiosPromise =>
  userFetch.get(`/api/v1/feedback`, { params });
// 用户反馈: 已处理/搁置
const getUserFeedbackId = (id: any, params: any): AxiosPromise =>
  userFetch.get(`/api/v1/feedback/${id}`, { params });
// 用户反馈: 查看
const getUserFeedbackDetail = (id: any): AxiosPromise =>
  userFetch.get(`/api/v1/feedback/${id}`);

export default {
  getUserApplyList,
  getUserApplyReview,
  getUserApplyDetail,
  getUserFeedbackList,
  getUserFeedbackId,
  getUserFeedbackDetail
};
