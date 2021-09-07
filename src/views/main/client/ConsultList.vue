<template>
  <div class="consultList">
    <div class="title"><b>合作咨询</b></div>
    <a-form :form="form" @submit="handleSubmit" class="formStyle">
      <a-form-item label="咨询时间">
        <!-- <a-range-picker v-decorator="['time', {}]"  class="rangeTime"/> -->
        <a-range-picker
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['Start Time', 'End Time']"
          @change="onChangeTime"
        />
      </a-form-item>
      <a-form-item label="服务类型" class="serviceType">
        <a-select
          v-decorator="['serviceType', {}]"
          placeholder="请选择服务类型"
        >
          <a-select-option
            v-for="item in serviceType"
            :key="item"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" html-type="submit" class="searchBtn"
        >搜索</a-button
      >
      <a-button type="default" @click="reset">清除</a-button>
    </a-form>
    <div class="export">
      <a-button @click="exportData">
        <a :href="downloadURL" class="exportA" v-if="exportBtn">导出</a>
        <a v-else class="unExport">导出</a>
      </a-button>
    </div>

    <a-table
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :columns="consultColumns"
      :dataSource="tableData"
      @change="onPageChange"
      :pagination="paginationConfig"
      rowKey="id"
    >
      <template slot="consultTime" slot-scope="consultTime">
        <span>{{ consultTime | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { cloneDeep } from "lodash";

import ClientService from "@/service/client";
// import { delete } from 'vue/types/umd';
const clientService = ClientService.getService();

@Component
export default class ConsultList extends Vue {
  form: any = {};
  serviceType: any[] = [];

  consultColumns: any[] = [
    { title: "企业名称", dataIndex: "companyName" },
    {
      title: "咨询日期",
      dataIndex: "consultTime",
      scopedSlots: { customRender: "consultTime" }
    },
    { title: "服务类型", dataIndex: "serviceType" },
    { title: "服务内容", dataIndex: "service" },
    { title: "内容描述", dataIndex: "descContent" },
    { title: "咨询人", dataIndex: "consultants" },
    { title: "手机号码", dataIndex: "phone" },
    { title: "电子邮箱", dataIndex: "email" }
  ];
  tableData: any[] = [];
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  startTime: any = undefined;
  endTime: any = undefined;
  selectedRowKeys: any[] = [];
  downloadURL: string = "";
  exportBtn: boolean = false;
  idParam: any = undefined;

  created() {
    this.form = this.$form.createForm(this, {});
    this.paginationConfig = {
      defaultCurrent: 1,
      showQuickJumper: true,
      defaultPageSize: this.pageSize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pageSize,
      total: this.totalCount,
      change: this.onPageChange
    };
    this.requestListPort();
    this.runnableList();
  }

  mounted() {}

  // 默认列表
  requestListPort() {
    const param: any = {
      page: this.page,
      per_page: this.pageSize,
      sortBy: "consultTime",
      order: "desc"
    };
    this.getConsultList(param);
  }
  // 选择时间
  onChangeTime(value: any, dateString: any) {
    this.startTime = undefined;
    this.endTime = undefined;
    if (value.length !== 0) {
      const st1 = new Date(dateString[0].replace(/-/g, "/"));
      const st = st1.getTime();
      const et1 = new Date(dateString[1].replace(/-/g, "/"));
      const et = et1.getTime();
      this.startTime = st;
      this.endTime = et;
    } else {
      this.requestListPort();
    }
  }

  // 翻页
  onPageChange(data: any) {
    console.log("data", data);
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.requestListPort();
  }

  // '搜索'
  handleSubmit(e: any) {
    e.preventDefault();

    const params = this.form.getFieldsValue();
    const data: any = {
      page: this.page,
      per_page: this.pageSize,
      startTime: this.startTime,
      endTime: this.endTime,
      sortBy: "consultTime",
      order: "desc",
      serviceType: params.serviceType
    };
    for (let a in data) {
      if (data[a] == undefined) {
        delete data[a];
      }
    }
    this.getConsultList(data);
  }

  // 清除
  reset() {
    this.form.resetFields();
    this.requestListPort();
  }
  // AI能力二级菜单接口
  async runnableList() {
    const response = await clientService.getApiNavMenu();
    response.forEach((item: any, key: number) => {
      this.serviceType.push(item.level1);
    });
  }
  // 列表接口
  async getConsultList(params: any) {
    const response = await clientService.getConsultList(params);
    this.totalCount = response.data.data.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = cloneDeep(response.data.data.data);
  }
  // '导出'的接口
  async getConsultExport(params: any) {
    const response = await clientService.getConsultExport(params);
    if (response) {
      this.$message.success("导出成功！");
    }
  }

  // 导出
  exportData() {
    if (this.exportBtn == false) {
      this.$message.error("请先勾选列表选项，再导出");
      return;
    }
    const params = this.form.getFieldsValue();
    const url =
      "/v1/user-manager/consult/download" +
      "?startTime=" +
      `${this.startTime}` +
      "&endTime=" +
      `${this.endTime}` +
      "&serviceType=" +
      `${params.serviceType}`;
    // this.downloadURL = url;

    this.exportBtn = true;
    // const url = 'http://192.168.2.4:8096/v1/user-manager/consult/download?startTime=1604309760000&endTime=1604309760000&serviceType=人脸朝向'
    // this.downloadFile(this.idParam)
  }

  // '勾选'
  onSelectChange(selectedRowKeys: any) {
    this.idParam = `${selectedRowKeys}`;
    if (this.idParam == "" || this.idParam == undefined) {
      this.exportBtn = false;
    } else {
      this.exportBtn = true;
      const newUrl =
        "/v1/user-manager/consult/download?ids=" + `${this.idParam}`;
      this.downloadURL = newUrl;
    }
    this.selectedRowKeys = selectedRowKeys;
  }

  downloadFile(url: string, fileName = "") {
    const eleLink = document.createElement("a");
    console.log(eleLink);
    eleLink.download = fileName;
    eleLink.style.display = "none";
    eleLink.href = url;
    // 受浏览器安全策略的因素，动态创建的元素必须添加到浏览器后才能实施点击
    document.body.appendChild(eleLink);
    // 触发点击
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }

  formatDate(timeStamp: any) {
    const a = new Date(timeStamp);
    const y = a.getFullYear();
    const m = a.getMonth();
    const d = a.getDate();
    // 含有时分秒
    // const result = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + a.toTimeString().substr(0, 8)
    const YMD = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
    return YMD;
  }
}
</script>

<style scoped lang="scss">
.consultList {
  padding: 20px 50px;
  .title {
    text-align: left;
    font-size: 24px;
  }
  .formStyle {
    margin: 50px auto 0 auto;
    display: flex;
    /deep/ .ant-form-item {
      display: flex;
      justify-content: space-between;
    }
    /deep/ .ant-form-item-control {
      width: 260px;
    }
    .rangeTime {
      width: 400px;
      margin-right: 200px;
    }
    .serviceType {
      margin-left: 200px;
    }
    .searchBtn {
      margin: 0 40px;
    }
  }
  .export {
    text-align: left;
    margin-bottom: 50px;
    button {
      width: 100px;
      height: 40px;
      padding: 0;
      display: block;
    }
    .exportA {
      margin: 0;
      width: 100%;
      height: 100%;
      line-height: 40px;
      letter-spacing: 4px;
      display: block;
      color: #31c37c;
    }
    .unExport {
      color: lightgray;
    }
  }
}
</style>
