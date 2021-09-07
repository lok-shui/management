import API from "@/api/apis";
import { message } from "ant-design-vue";

class AuthorityService {
  public static getService(): AuthorityService {
    if (!AuthorityService.instance) {
      AuthorityService.instance = new AuthorityService();
    }
    return AuthorityService.instance;
  }

  private static instance: AuthorityService;

  //账号启用
  public async openAdmin(params: any) {
    try {
      const response = await API.openAdmin(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  //账号禁用
  public async closeAdmin(params: any) {
    try {
      const response = await API.closeAdmin(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  //用户
  public async getAdminList(params: any) {
    try {
      const response = await API.getAdminList(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getDmUserAll(params?: any) {
    try {
      const response = await API.getDmUserAll(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error("ldap服务器异常");
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getAdminDetail(params: string) {
    try {
      const response = await API.getAdminDetail(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async newAdmin(params: any) {
    try {
      const response = await API.newAdmin(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async updateAdmin(params: any) {
    try {
      const response = await API.updateAdmin(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async deleteAdmin(params: any) {
    try {
      const response = await API.deleteAdmin(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  //配置
  public async getConfigList(params: any) {
    try {
      const response = await API.getConfigList(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async newConfig(params: any) {
    try {
      const response = await API.newConfig(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async updateConfig(params: any) {
    try {
      const response = await API.updateConfig(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async deleteConfig(params: string) {
    try {
      const response = await API.deleteConfig(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getConfigDetail(id: string) {
    try {
      const response = await API.getConfigDetail(id);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  //新增服务
  public async addNewService(params: any) {
    try {
      const response = await API.addNewService(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async addNewServiceApplicate(params: any) {
    try {
      const response = await API.addNewServiceApplicate(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  //新增服务
  public async addNewClassify(params: any) {
    try {
      const response = await API.addNewClassify(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  //角色
  public async getRoleList(params: any) {
    try {
      const response = await API.getRoleList(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // 添加行业应用分类
  public async addNewIndustry(params: any) {
    try {
      const response = await API.addNewIndustry(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async deleteRole(params: any) {
    try {
      const response = await API.deleteRole(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getRoleClass() {
    try {
      const response = await API.getRoleClass();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async newRole(params: any) {
    try {
      const response = await API.newRole(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async updateRole(params: any) {
    try {
      const response = await API.updateRole(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getRoleDetail(params: any) {
    try {
      const response = await API.getRoleDetail(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async activeRole(params: any) {
    try {
      const response = await API.activeRole(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async suspendRole(params: any) {
    try {
      const response = await API.suspendRole(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getActiveRole(isRoleType: boolean = true, level: number = 2) {
    try {
      const response = await API.getActiveRole();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          if (isRoleType) {
            return res.data;
          }

          // const data: string[] = [];

          // res.data
          //   .map((m: string) => {
          //     if (level === 1) {
          //       return m.substr(0, m.indexOf("/"));
          //     } else if (level === 2) {
          //       return m.substr(m.indexOf("/") + 1);
          //     }
          //     return m;
          //   })
          //   .forEach((m: string) => {
          //     if (data.indexOf(m) === -1) {
          //       data.push(m);
          //     }
          //   });

          // return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  //权限
  public async getAuthorityList(params: any) {
    try {
      const response = await API.getAuthorityList(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async deleteAuthority(params: any) {
    try {
      const response = await API.deleteAuthority(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getAuthorityDetail(params: any) {
    try {
      const response = await API.getAuthorityDetail(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async newAuthority(params: any) {
    try {
      const response = await API.newAuthority(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async updateAuthority(params: any) {
    try {
      const response = await API.updateAuthority(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getClassNameList() {
    try {
      const response = await API.getClassNameList();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getServiceVideoList(params: any) {
    try {
      const response = await API.getServiceVideoList(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getServiceSelect() {
    try {
      const response = await API.getServiceSelect();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getConfigTypeList() {
    try {
      const response = await API.getConfigTypeList();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async editVideoSource(params: any, id: number) {
    try {
      const response = await API.editVideoSource(params, id);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        } else {
          message.error(res.error);
          throw new Error(res.error);
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export default AuthorityService;
