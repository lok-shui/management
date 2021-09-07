import API from "@/api/apis/order";

class userOrder {
  public static getOrder(): userOrder {
    if (!userOrder.instance) {
      userOrder.instance = new userOrder();
    }
    return userOrder.instance;
  }
  private static instance: userOrder;

  public async getOrderList(params: any) {
    try {
      const response = await API.getOrderList(params);
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
  public async createOrder(params: any) {
    try {
      const response = await API.createOrder(params);
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
  public async getOrderDetails(id: any) {
    try {
      const response = await API.getOrderDetails(id);
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
  public async putOrderList(params: any) {
    try {
      const response = await API.putOrderList(params);
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
  public async patchOrderList(params: any) {
    try {
      const response = await API.patchOrderList(params);
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
  public async getbillingscheme(params: any) {
    try {
      const response = await API.getbillingscheme(params);
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
  public async getInterfaceNameList(params: any) {
    try {
      const response = await API.getInterfaceNameList(params);
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

export default userOrder;
