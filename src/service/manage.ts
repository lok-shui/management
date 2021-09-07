import API from "@/api/apis";

class ManageService {
  public static getService(): ManageService {
    if (!ManageService.instance) {
      ManageService.instance = new ManageService();
    }
    return ManageService.instance;
  }

  private static instance: ManageService;

  public async getInterfaceList(params: any) {
    try {
      const response = await API.getInterfaceList(params);
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

  public async getInterfaceDetail(params: string) {
    try {
      const response = await API.getInterfaceDetail(params);
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

  public async getTemplateList() {
    try {
      const response = await API.getTemplateList();
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

  public async deleteInterface(params: string) {
    try {
      const response = await API.deleteInterface(params);
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

  public async newInterface(params: any) {
    try {
      const response = await API.newInterface(params);
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

  public async updateInterface(params: any) {
    try {
      const response = await API.updateInterface(params);
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

  public async getServiceList(params: any) {
    try {
      const response = await API.getServiceList(params);
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

  public async deleteService(params: string) {
    try {
      const response = await API.deleteService(params);
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

  public async isDeleteAble(params: string) {
    try {
      const response = await API.isDeleteAble(params);
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

  public async fileUpload(params: string, id: number) {
    try {
      const response = await API.fileUpload(params, id);
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

  public async getServiceGroup() {
    try {
      const response = await API.getServiceGroup();
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

  public async newService(params: any) {
    try {
      const response = await API.newService(params);
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

  public async updateService(params: any) {
    try {
      const response = await API.updateService(params);
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

  public async uploadVideoSource(params: any, id: any) {
    try {
      const response = await API.uploadVideoSource(params, id);
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

  public async getServiceDetail(params: string) {
    try {
      const response = await API.getServiceDetail(params);
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

  public async getServiceOrder(params: string) {
    try {
      const response = await API.getServiceOrder(params);
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

  public async uploadFilePort(params: any, id: number) {
    try {
      const response = await API.uploadFilePort(params, id);
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

  public async getLinkedList(param: any) {
    try {
      const response = await API.getLinkedList(param);
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

  public async getServiceListAll() {
    try {
      const response = await API.getServiceListAll();
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

  public async getServiceAll() {
    try {
      const response = await API.getServiceAll();
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

  public async getInterfaceNameList() {
    try {
      const response = await API.getInterfaceNameList();
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

  public async getAuthorizationList() {
    try {
      const response = await API.getAuthorizationList();
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

  public async getServiceManagerList(params: any) {
    try {
      const response = await API.getServiceManagerList(params);
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

  public async editInterfaceUploadFile(params: any, id: number) {
    try {
      const response = await API.editInterfaceUploadFile(params, id);
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

  public async newInterfaceUploadFile(params: any, id: number) {
    try {
      const response = await API.newInterfaceUploadFile(params, id);
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

  public async getIndustryList(params: any) {
    try {
      const response = await API.getIndustryList(params);
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

  public async getIndustryEdit(id: number) {
    try {
      const response = await API.getIndustryEdit(id);
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

  public async getIndustryOrder(params: string) {
    try {
      const response = await API.getIndustryOrder(params);
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

  public async newIndustry(params: any) {
    try {
      const response = await API.newIndustry(params);
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

  public async updateIndustry(params: any) {
    try {
      const response = await API.updateIndustry(params);
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

  public async uploadIndustryFile(params: any, id: number) {
    try {
      const response = await API.uploadIndustryFile(params, id);
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

  public async deleteIndustry(id: number) {
    try {
      const response = await API.deleteIndustry(id);
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

  // 首页
  public async getHomeBannerList(params: any) {
    try {
      const response = await API.getHomeBannerList(params);
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

  public async addNewBanner(params: any) {
    try {
      const response = await API.addNewBanner(params);
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

  public async geHomeBannerEdit(id: number) {
    try {
      const response = await API.getHomeBannerEdit(id);
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

  public async getIndustryDetail(name: any) {
    try {
      const response = await API.getIndustryDetail(name);
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

  public async updateHomeBanner(params: any, id: number) {
    try {
      const response = await API.updateHomeBanner(params, id);
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

  public async getBannerserviceGroup(name: any) {
    try {
      const response = await API.getBannerserviceGroup(name);
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

  public async updateBannerStatus(params: any) {
    try {
      const response = await API.updateBannerStatus(params);
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

  public async getHomeIndustryList(params: any) {
    try {
      const response = await API.getHomeIndustryList(params);
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

  public async updateIndustryActive(id: number, actived: string) {
    try {
      const response = await API.updateIndustryActive(id, actived);
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

  public async addHomeIndustry(id: number, order: number) {
    try {
      const response = await API.addHomeIndustry(id, order);
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
  public async addHomeService(id: number, order: number) {
    try {
      const response = await API.addHomeService(id, order);
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

  public async getHomeServiceList(params: any) {
    try {
      const response = await API.getHomeServiceList(params);
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
  public async updateServiceStatus(id: number, status: number) {
    try {
      const response = await API.updateServiceStatus(id, status);
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

  public async deleteIndustryItem(id: number) {
    try {
      const response = await API.deleteIndustryItem(id);
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

  public async deleteServiceItem(id: number) {
    try {
      const response = await API.deleteServiceItem(id);
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

  public async getHomeServiceOrder() {
    try {
      const response = await API.getHomeServiceOrder();
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

  public async getHomeIndustryOrder() {
    try {
      const response = await API.getHomeIndustryOrder();
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

  public async getHomeBannerOrder() {
    try {
      const response = await API.getHomeBannerOrder();
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

  public async getWorkOrder(params: any) {
    try {
      const response = await API.getWorkOrder(params);
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

  public async getActiveOrkOrder(id: any, status: any) {
    try {
      const response = await API.getActiveOrkOrder(id, status);
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

  public async getDetailWorkOrder(id: any) {
    try {
      const response = await API.getDetailWorkOrder(id);
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
}

export default ManageService;
