import API from "@/api/apis";
import store from "@/store";

import cache from "@/utils/cache";

class LoginService {
  public static getLoginService(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  private static instance: LoginService;

  public async login(user: any) {
    try {
      const response = await API.userLogin(user);
      if (response.data) {
        const res: any = response.data;
        const token = response.headers.token;
        console.log(res);
        if (res.code === 0) {
          const data = res.data;
          if (data && token) {
            // 先清空再更新
            cache.localClear();
            store.commit("clearUser");
            store.commit("updateUser", { ...data });
            cache.localSet("ai-dmid", token);
            cache.localSet("ai-name", data.name);
            return data;
          } else {
            throw new Error(response.data.error);
          }
        } else {
          return null;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async frontPage() {
    const response = await API.frontPage(0);
    return response.data.data.toString() + "/login";
  }

  // private async _frontPage(type: number) {
  //   const response = await API.frontPage(type);
  //   console.log(response, "---------------------------------------login");
  //   return `${response.data.data}#${cache.localGet("ai-dmid")}`;
  // }

  public async logout() {
    try {
      // const response = await API.userLogout();
      // console.log(response);

      // 只要没有异常就清除缓存
      // 因后台未销毁dmid 前台缓存仍需清除
      // this.redirectFrontLogoutPage();
      store.commit("clearUser");
      // if (response.data) {
      //   const res: any = response.data;
      //   if (res.code === 0) {
      //     const data = res.data;
      //     cache.localClear();
      //     store.commit("clearUser");
      //     return data;
      //   } else {
      //     throw new Error(res.error);
      //   }
      // }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public clearUserCache() {
    cache.localClear();
    store.commit("clearUser");
  }

  public async getUserInfo(params: string) {
    try {
      const response = await API.getUserInfo(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          // const { username } = data
          store.commit("updateUser", { ...data });
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async changePwd(params: any) {
    try {
      const response = await API.changePwd(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          return res.data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default LoginService;
