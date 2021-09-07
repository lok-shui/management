<template>
  <div class="list-contain">
    <div class="operation-contain">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item label="请求时间">
          <a-range-picker v-decorator="['requestTime', {}]" />
        </a-form-item>

        <a-form-item label="日志类型">
          <a-select
            v-decorator="['type', { initialValue: 'all' }]"
            placeholder="请选择日志类型"
            style="width: 150px;"
          >
            <a-select-option v-for="item in typeList" :key="item.val">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="执行时长">
          <a-input-group compact>
            <a-input
              style=" width: 100px; text-align: center"
              placeholder=""
              v-decorator="['execTimeoutStart', {}]"
            />
            <a-input
              style=" width: 30px; border-left: 0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-input
              style="width: 100px; text-align: center; border-left: 0"
              placeholder=""
              v-decorator="['execTimeoutEnd', {}]"
            />
          </a-input-group>
        </a-form-item>

        <a-form-item>
          <a-input
            v-decorator="['name', {}]"
            placeholder="服务名/用户名/访问地址"
            style="width: 300px;"
          ></a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="index"
      :pagination="paginationConfig"
      @change="onPageChange"
    >
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ClientService from "@/service/client";
import moment from "moment";

const clientService = ClientService.getService();

@Component
export default class LogList extends Vue {
  form: any = {};

  paginationConfig: any = {
    hideOnSinglePage: true
  };

  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  typeList: any[] = [];

  columns: any[] = [
    // { title: "序号", dataIndex: "index" },
    { title: "服务名", dataIndex: "serviceName" },
    { title: "用户名", dataIndex: "username" },
    // { title: "访问地址", dataIndex: "uri" },
    { title: "异常信息", dataIndex: "execpMsg" },
    { title: "执行时长(ms)", dataIndex: "execTimeout" },
    {
      title: "请求时间",
      dataIndex: "requestTime"
    }
  ];
  tableData: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});

    this.paginationConfig = {
      showQuickJumper: true,
      defaultCurrent: 1,
      defaultPageSize: this.pageSize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pageSize,
      hideOnSinglePage: true,
      total: this.totalCount,
      change: this.onPageChange
    };

    this.getLog();
    this.getLogType();
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getLog(this.paramHandler());
  }

  async getLog(params: any = {}) {
    const response = await clientService.getClientLog({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    console.log(response);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    let index = 1;
    response.data.forEach((m: any) => {
      m.index = index++;
      m.requestTime = moment(m.requestTime).format("YYYY-MM-DD HH:mm:ss");
      m.serviceName = m.serviceName || [m.method, m.uri].join(":");
    });
    this.tableData = response.data;
  }

  async getLogType() {
    const response = await clientService.getClientLogTypes();
    console.log(response);

    this.typeList = response;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getLog(this.paramHandler());
  }

  paramHandler() {
    const params = this.form.getFieldsValue();

    if (params.requestTime && params.requestTime.length) {
      params["requestTimeStart"] = +new Date(
        moment(params.requestTime[0]).format("YYYY/MM/DD")
      );
      params["requestTimeEnd"] = +new Date(
        moment(params.requestTime[1])
          .add(1, "d")
          .format("YYYY/MM/DD")
      );
      delete params.requestTime;
    }

    if (params.type === "all") {
      delete params.type;
    }

    console.log(params);
    return params;
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
