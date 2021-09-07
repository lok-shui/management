import API from "@/api/apis/embed";

class userService {
  public static getService(): userService {
    if (!userService.instance) {
      userService.instance = new userService();
    }
    return userService.instance;
  }
  private static instance: userService;

  public async getUserApplyList(param: any) {
    try {
      const response = await API.getUserApplyList(param);
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

  public async getUserApplyReview(id: any, status: any) {
    try {
      const response = await API.getUserApplyReview(id, status);
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

  public async getUserApplyDetail(id: any) {
    try {
      const response = await API.getUserApplyDetail(id);
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

  public async getUserFeedbackList(param: any) {
    try {
      const response = await API.getUserFeedbackList(param);
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

  public async getUserFeedbackId(id: any, params: any) {
    try {
      const response = await API.getUserFeedbackId(id, params);
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

  public async getUserFeedbackDetail(id: any) {
    try {
      const response = await API.getUserFeedbackDetail(id);
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

export default userService;
