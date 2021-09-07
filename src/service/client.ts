import API from "@/api/apis";
import httpUtil from "@/utils/httpUtil";
import { message } from "ant-design-vue";

class ClientService {
  public static getService(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  public async getUsernameList() {
    try {
      const response = await API.getUsernameList();
      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getConsultList(params: any) {
    try {
      return await API.getConsultList(params);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getConsultExport(params: any) {
    try {
      const response = await API.getConsultExport(params);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getClientList(params: any) {
    try {
      const response = await API.getClientList(params);
      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getClientDetail(params: string) {
    try {
      const response = await API.getClientDetail(params);
      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async handleClientUserStatus(params: any) {
    try {
      return await API.handleClientUserStatus(params);
    } catch (err) {
      console.log("请求失败", err);
      return Promise.reject(err);
    }
  }

  public async handleClientAuthStatus(params: any) {
    try {
      return await API.handleClientAuthStatus(params);
    } catch (err) {
      console.log("请求失败", err);
      return Promise.reject(err);
    }
  }

  public async deleteClient(params: any) {
    try {
      console.log("deleteClient", params);
      return await API.deleteClient(params);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async updateClient(id: any, params: any) {
    try {
      return await API.updateClient(id, params);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async registerClient(params: any) {
    try {
      return await API.registerClient(params);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getClientLog(params: any) {
    try {
      const response = await API.getDataAnalysisLog(params);
      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getClientLogTypes() {
    try {
      const response = await API.getDataAnalysisLogTypes();
      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getOrderList(params: any) {
    try {
      const response = await API.getOrderList(params);
      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getBillList(params: any) {
    try {
      const response = await API.getSummaryList(params);

      return httpUtil.getResponseData(response);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getAnalysisData(params: any) {
    try {
      const response = await API.getDataAnalysisData(params);
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

  public async getAuthorizationList() {
    try {
      const response = await API.getAuthorizationList();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getAuthorization(params: string) {
    try {
      const response = await API.getAuthorization(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async rechargeAuthorization(params: any) {
    try {
      const response = await API.rechargeAuthorization(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async newAuthorization(params: any) {
    try {
      const response = await API.newAuthorization(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async deleteAuthorization(params: string) {
    try {
      const response = await API.deleteAuthorization(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getUseMethod() {
    try {
      const response = await API.getUseMethod();
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
  public async getBillingType() {
    try {
      const response = await API.getBillingType();
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
  public async getServiceType() {
    try {
      const response = await API.getServiceType();
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
  public async addpurchaseinfo(params: any) {
    try {
      const response = await API.addpurchaseinfo(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getPurchaseInfo(params: any) {
    try {
      const response = await API.getPurchaseInfo(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async deletepurchaseId(purchaseId: any) {
    try {
      const response = await API.deletepurchaseId(purchaseId);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
  public async getPurchase(params: any) {
    try {
      const response = await API.getPurchase(params);
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          return data;
        }
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async getApiNavMenu() {
    try {
      const response = await API.getApiNavMenu();
      if (response.data) {
        const res: any = response.data;
        if (res.code === 0) {
          const data = res.data;
          if (res) {
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

  private static instance: ClientService;
}

export default ClientService;
