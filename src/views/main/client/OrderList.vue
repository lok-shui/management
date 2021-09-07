<template>
  <div class="list-contain">
    <div class="operation-contain">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item label="访问时间">
          <a-range-picker v-decorator="['time', {}]" />
        </a-form-item>

        <!-- <a-form-item label="状态码">
          <a-input
            v-decorator="['status', {}]"
            placeholder="请输入状态码"
            style="width: 120px"
          >
          </a-input>
        </a-form-item> -->

        <a-form-item label="用户名">
          <a-select
            class="selectstyle"
            showSearch
            v-decorator="['userId']"
            placeholder="请选择用户名"
          >
            <a-select-option
              v-for="item in usernameList"
              :key="item.userId"
              :value="item.userId"
            >
              {{ item.username }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="接口名称">
          <a-select
            class="selectstyle"
            showSearch
            v-decorator="['serviceId']"
            placeholder="请选择服务"
            optionFilterProp="name"
            :filterOption="filterOption"
            @select="selectName"
          >
            <a-select-option
              v-for="item in interfaceNameList"
              :key="item.name"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit"> 搜索 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="default" @click="reset"> 清除 </a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      :pagination="paginationConfig"
      rowKey="index"
      @change="onPageChange"
    >
      <template slot="operation" slot-scope="operation, row">
        <table-operation
          :btnGroups="btnGroups"
          :rowItem="row"
          @handleClick="handleTableOperation"
        />
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import moment, { months } from "moment";
import tableOperation from "@/components/tableOperation.vue";
import ClientService from "@/service/client";
import ManageService from "@/service/manage";
const clientService = ClientService.getService();
const manageService = ManageService.getService();

@Component({
  components: {
    tableOperation
  }
})
export default class OrderList extends Vue {
  form: any = {};

  btnGroups: any[] = [
    {
      type: "detail",
      text: "详情"
    }
  ];

  paginationConfig: any = {
    hideOnSinglePage: true
  };

  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  orderTypes: any[] = ["200", "503"]; // TODO 从后台接口获取

  username: any;
  year: any;
  periodParam: any;
  period: any;

  columns: any[] = [
    { title: "APP ID", dataIndex: "appId" },
    { title: "服务名称", dataIndex: "serviceName" },
    { title: "状态码", dataIndex: "status" },
    { title: "费用（元）", dataIndex: "cost" },
    { title: "购买用户", dataIndex: "username" },
    {
      title: "访问时间",
      dataIndex: "createTime"
    }
    // {
    //   title: "查看详情",
    //   dataIndex: "operation",
    //   scopedSlots: { customRender: "operation" }
    // }
  ];
  tableData: any[] = [];
  interfaceNameList: any[] = [];
  usernameList: any[] = [];
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
    this.getInterfaceNameList();
    this.getUsernameList();
  }

  mounted() {
    const username = this.$route.query.username;
    const services = this.$route.query.service;
    const startDate = this.$route.query.startTime;
    const endDate = this.$route.query.endTime;
    const period = this.$route.query.period;
    const periodParam = this.$route.query.periodParam;
    const year = this.$route.query.year;
    let params;
    if (username && services && period && periodParam) {
      if (startDate && endDate) {
        this.form.setFieldsValue({
          services,
          time: [moment(startDate as string), moment(endDate as string)]
        });
        const startTime = moment(startDate as string)
          .startOf("day")
          .valueOf();
        const endTime = moment(endDate as string)
          .endOf("day")
          .valueOf();
        params = {
          username,
          services,
          startTime,
          endTime,
          period,
          periodParam,
          year
        };
      } else {
        this.form.setFieldsValue({ services });
        params = { username, services, period, periodParam, year };
      }
      this.username = username;
      this.year = year;
      this.period = period;
      this.periodParam = periodParam;

      console.log(params, "跳转明细参数");
      this.loadData(params);
    } else {
      this.loadData();
    }
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.loadData(this.handleParams());
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.page = 1;
    this.paginationConfig.current = this.page;
    var a = this.form.getFieldsValue();
    console.log(a);
    this.loadData(this.handleParams());
  }

  handleParams() {
    const params = this.form.getFieldsValue();

    if (params.time && params.time.length) {
      params["startTime"] = moment(params.time[0])
        .startOf("day")
        .valueOf();
      params["endTime"] = moment(params.time[1])
        .endOf("day")
        .valueOf();
      delete params.time;
    }
    params["period"] = this.period;
    params["periodParam"] = this.periodParam;
    params["year"] = this.year;
    params["username"] = this.username;
    return params;
  }

  reset() {
    this.form.resetFields();
    this.paginationConfig.current = 1;
    this.username = null;
    this.year = null;
    this.periodParam = null;
    this.period = null;
    this.loadData();
  }

  handleTableOperation(data: any) {
    const { operationType } = data;
  }

  async loadData(params: any = {}) {
    const response = await clientService.getBillList({
      page: this.page,
      per_page: this.pageSize,
      type: 0,
      ...params
    });
    console.log(response);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    let index = 1;
    response.data.forEach((m: any) => {
      m.index = index++;
      m.createTime = moment(m.createTime).format("YYYY-MM-DD HH:mm:ss");
    });
    this.tableData = response.data;
  }
  async getInterfaceNameList() {
    const response = await manageService.getInterfaceNameList();
    console.log(response, "!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    this.interfaceNameList = response;
  }
  filterOption(input: string, option: any) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }
  selectName() {
    return;
  }
  async getUsernameList() {
    const response = await clientService.getUsernameList();
    this.usernameList = response;
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.selectstyle {
  width: 240px;
}
</style>
