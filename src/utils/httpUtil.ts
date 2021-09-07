const httpUtil = {
  getResponseData(response: any) {
    if (response.data) {
      const res: any = response.data;
      if (res.code === 0) {
        const data = res.data;
        return data;
      } else {
        throw new Error(res.error);
      }
    }
  }
};

export default httpUtil;
