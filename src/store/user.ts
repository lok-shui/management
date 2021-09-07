import cache from "@/utils/cache";
import LoginService from "@/service/login";
const loginService = LoginService.getLoginService();

const state = {
  // username: "",
  // lastLoginTime: "",
  // realname: "",
  // email: ""
  id: "",
  dmid: "",
  username: "",
  authority: []
};

const getters = {};

const actions = {
  async getUserInfo({ commit }: any) {
    const name = cache.localGet("ai-name");
    const response = await loginService.getUserInfo(name);
    state.username = response.name;
    const dmid = cache.localGet("ai-dmid");
    commit("updateUser", { dmid });
  }
};

const mutations = {
  updateUser(state: any, theUser: any) {
    for (const i of Object.keys(theUser)) {
      state[i] = theUser[i];
    }
  },
  clearUser(state: any) {
    for (const i of Object.keys(state)) {
      if (typeof state[i] === "string") {
        state[i] = "";
      } else if (typeof state[i] === "number") {
        state[i] = 0;
      } else if (state[i] instanceof Array) {
        state[i] = [];
      } else {
        state[i] = null;
      }
    }
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
