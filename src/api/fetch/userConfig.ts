// 批改系统配置
const userConfig: object = {
  timeout: 300000, // 超时时间五分钟
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "-1",
    language: "en"
  },
  withCredentials: true
};

export default userConfig;
