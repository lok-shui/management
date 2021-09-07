<template>
  <div class="list-contain">
    <div class="operation-contain">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item label="访问时间">
          <a-range-picker v-decorator="['time', {}]" />
        </a-form-item>

        <a-form-item label="状态码">
          <a-input
            v-decorator="['status', {}]"
            placeholder="请输入状态码"
            style="width: 120px;"
          >
            <!--            <a-select-option v-for="item in orderTypes" :key="item">-->
            <!--              {{ item }}-->
            <!--            </a-select-option>-->
          </a-input>
        </a-form-item>

        <a-form-item label="服务名称">
          <a-input
            v-decorator="['services', {}]"
            placeholder="服务名称"
            style="width: 300px;"
          ></a-input>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="default" @click="reset">
            清除
          </a-button>
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

const clientService = ClientService.getService();

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
    { title: "订单号", dataIndex: "id" },
    { title: "服务名称", dataIndex: "service" },
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
    const response = await clientService.getOrderList({
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
      m.createTime = moment(m.createTime).format("YYYY-MM-DD HH:mm:ss");
    });
    this.tableData = response.data;
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
