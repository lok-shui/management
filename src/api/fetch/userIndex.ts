import axios, { AxiosInstance } from "axios";
import { message as Toast } from "ant-design-vue";
import Vue from "vue";

import cache from "@/utils/cache";
import axiosConfig from "@/api/fetch/userConfig";
// eslint-disable-next-line
import router from '@/router'

const userConfig: AxiosInstance = axios.create({
  ...axiosConfig
});

userConfig.interceptors.request.use(
  async config => {
    try {
      const dmid = cache.localGet("ai-dmid");
      if (dmid) {
        config.headers.token = dmid;
      }
    } catch (err) {
      console.log(err);
      // 如果刷新失败，应当终止当前请求
      return Promise.reject(err);
    }
    return config;
  },
  error => Promise.reject(error)
);

// respone拦截器
userConfig.interceptors.response.use(
  async response => {
    cache.localSet("ai-dmid", response.config.headers.token);
    if (response.data && response.data.code === "420") {
      Toast.destroy();
      Toast.error(response.data.error, 3);
      router.push("/login");
    }
    if (response.data && response.data.code !== 0) {
      const error =
        response.data.error || response.data.data || "请求出错，请检查重试";
      Toast.error(error);
      return Promise.reject({
        error,
        code: response.data.code
      });
    }
    return response;
  },

  async error => {
    let msg;
    if (error.response) {
      if (error.response.status >= 500) {
        msg = "服务器好像开小差了，请稍后重试";
      } else if (error.response.status === 403) {
        cache.localClear();
        if (error.response.data && error.response.data.error) {
          msg = error.response.data.error;
        } else {
          msg = "账号过期，请重新登录";
        }
        // 这里直接跳转，不返回rejected
        console.log("强制跳转到login");
        //@ts-ignore
        setTimeout(
          () =>
            Vue.nextTick(() => setTimeout(() => router.push("/login"), 566)),
          566
        );
        Toast.error(msg, 5);
        return Promise.reject(new Error(msg));
      } else if (error.response.status === 401) {
        router.push("/login");
      } else if (error.response.status === 400) {
        msg = "账号或密码错误";
      } else if (error.response.status >= 400) {
        msg = "请求出错，请检查重试";
      }
    } else if (error.code === "ECONNABORTED") {
      msg = "网络出了点问题，请稍后重试";
    } else {
      msg = "网络出了点问题，请稍后重试";
    }
    Toast.error(msg || "服务器好像开小差了", 5);
    return Promise.reject(error);
  }
);

export default userConfig;
