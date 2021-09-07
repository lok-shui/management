import axios from "axios";

// 用户反馈
// dev：http://user-feedback-svc.daipops.dev.dm-ai.cn
// test：http://user-feedback-svc.daipops.test.dm-ai.cn

// 根据当前主机的URL， 判断是dev还是test环境
let firstBaseURL = "";
let secondBaseUrl = "";

if (
  location.hostname == "aiep-platform-management.mip.dev.dm-ai.cn" ||
  location.hostname == "aiep-platform-management-mip.dev.dm-ai.cn" ||
  location.hostname == "localhost"
) {
  firstBaseURL = "http://user-feedback-svc.daipops.dev.dm-ai.cn";
  secondBaseUrl = "http://application-manager.mip.dev.dm-ai.cn";
} else if (
  location.hostname == "aiep-platform-management.mip.test.dm-ai.cn" ||
  location.hostname == "aiep-platform-management-mip.test.dm-ai.cn"
) {
  firstBaseURL = "http://user-feedback-svc.daipops.test.dm-ai.cn";
  secondBaseUrl = "http://application-manager.mip.test.dm-ai.cn";
}
const firstRequest = axios.create({
  baseURL: firstBaseURL,
  timeout: 6000 // 请求超时时间
});

// 用户申请
// dev：http://application-manager.mip.dev.dm-ai.cn
// test：http://application-manager.mip.test.dm-ai.cn

const secondRequest = axios.create({
  baseURL: secondBaseUrl,
  timeout: 6000 // 请求超时时间
});

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: "http://am-daip.dev.dm-ai.cn",
  timeout: 6000 // 请求超时时间
});

const api = {
  application: "/api/v1/application",
  feedback: "/api/v1/feedback"
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  token: "Tfbzvepj0rrpwkbPhm9CuhIe6jtiCDth"
};

// 用户申请 接口
function getApplicationList(parameter: any) {
  return secondRequest({
    url: api.application,
    method: "get",
    params: parameter,
    headers: headers
  });
}
function applicationListReview(parameter: any) {
  return secondRequest({
    url: "/api/v1/application/" + parameter.id + "/review/" + parameter.status,
    method: "get",
    headers: headers
  });
}
function getItemDetail(parameter: any) {
  return secondRequest({
    url: "/api/v1/application/" + parameter.id,
    method: "get",
    headers: headers
  });
}

// function getApplicationList(parameter: any) {
//   return request({
//     url: api.application,
//     method: "get",
//     params: parameter,
//     headers: { token: "Tfbzvepj0rrpwkbPhm9CuhIe6jtiCDth" }
//   });
// }
// function applicationListReview(parameter: any) {
//   return request({
//     url: "/api/v1/application/" + parameter.id + "/review/" + parameter.status,
//     method: "get",
//     headers: { token: "Tfbzvepj0rrpwkbPhm9CuhIe6jtiCDth" }
//   });
// }
// function getItemDetail(parameter: any) {
//   return request({
//     url: "/api/v1/application/" + parameter.id,
//     method: "get",
//     headers: { token: "Tfbzvepj0rrpwkbPhm9CuhIe6jtiCDth" }
//   });
// }

// function getUserFeedbackList(parameter: any) {
//   return request({
//     url: api.feedback,
//     method: "get",
//     params: parameter
//   });
// }
// function updateUserFeedback(parameter: any) {
//   console.log("parameter====", JSON.stringify(parameter));
//   return request({
//     url: "/api/v1/feedback/" + parameter.id, //这里是拼接的查询条件 看文档
//     method: "PATCH",
//     data: parameter
//   });
// }

// function userFeedbackDetails(parameter: any) {
//   console.log("parameter====", JSON.stringify(parameter));
//   return request({
//     url: "/api/v1/feedback/" + parameter.id, //这里是拼接的查询条件 看文档
//     method: "get"
//   });
// }

// 用户反馈 接口
function getUserFeedbackList(parameter: any) {
  return firstRequest({
    url: api.feedback,
    method: "get",
    params: parameter
  });
}
function updateUserFeedback(parameter: any) {
  console.log("parameter====", JSON.stringify(parameter));
  return firstRequest({
    url: "/api/v1/feedback/" + parameter.id, //这里是拼接的查询条件 看文档
    method: "PATCH",
    data: parameter
  });
}
function userFeedbackDetails(parameter: any) {
  console.log("parameter====", JSON.stringify(parameter));
  return firstRequest({
    url: "/api/v1/feedback/" + parameter.id, //这里是拼接的查询条件 看文档
    method: "get"
  });
}

export default {
  getApplicationList,
  applicationListReview,
  getUserFeedbackList,
  updateUserFeedback,
  userFeedbackDetails,
  getItemDetail
};
