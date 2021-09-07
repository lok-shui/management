<template>
  <div class="list-contain">
    <div class="operation-contain">
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-form-item label="时间范围">
          <a-range-picker v-decorator="['time', {}]" />
        </a-form-item>

        <!-- <a-form-item label="费用范围">
          <a-input-group compact>
            <a-input
              style="width: 100px; text-align: center"
              placeholder=""
              v-decorator="['minCost', {}]"
            />
            <a-input
              style="
                width: 30px;
                border-left: 0;
                pointer-events: none;
                backgroundcolor: #fff;
              "
              placeholder="~"
              disabled
            />
            <a-input
              style="width: 100px; text-align: center; border-left: 0"
              placeholder=""
              v-decorator="['maxCost', {}]"
            />
          </a-input-group>
        </a-form-item> -->
        <!-- <a-form-item
          label="token"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
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
import tableOperation from "@/components/tableOperation.vue";
import ClientService from "@/service/client";
import ManageService from "@/service/manage";
import moment from "moment";

const clientService = ClientService.getService();
const manageService = ManageService.getService();

@Component({
  components: {
    tableOperation
  }
})
export default class BillList extends Vue {
  form: any = {};

  paginationConfig: any = {
    hideOnSinglePage: true
  };

  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  period: number = 1;
  btnGroups: any[] = [
    // {
    //   type: "detail",
    //   text: "详情"
    // },
    {
      type: "particulars",
      text: "明细"
    }
  ];
  columns: any[] = [
    // { title: "序号", dataIndex: "index" },
    { title: "客户名", dataIndex: "username" },
    { title: "产品名称", dataIndex: "serviceName" },
    {
      title: "费用（元）",
      dataIndex: "cost",
      scopedSlots: { customRender: "cost" }
    },
    {
      title: "时间",
      dataIndex: "date"
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
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

    this.loadData();
    this.getInterfaceNameList();
    this.getUsernameList();
  }

  reset() {
    this.form.resetFields();
    this.paginationConfig.current = 1;
    this.loadData();
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
    this.loadData(this.handleParams());
  }

  handleParams() {
    const params = this.form.getFieldsValue();
    console.log("params", params);

    if (params.name) {
      params["search"] = params.name;
      delete params.name;
    }
    if (params.time) {
      params["startTime"] = params.time[0].startOf("day").valueOf();
      params["endTime"] = params.time[1].endOf("day").valueOf();
      delete params.time;
    }
    console.log("params2", params);
    return params;
  }

  handleTableOperation(data: any) {
    const { username, service, date, operationType, year, period } = data;
    console.log("operationType", data);

    let params = {};

    let periodSelector = this.form.getFieldsValue().period;
    let time = this.form.getFieldsValue().time;
    if (time) {
      const startTime = time[0].format("YYYYMMDD");
      const endTime = time[1].format("YYYYMMDD");
      Object.assign(params, { startTime: startTime, endTime: endTime });
    }
    // 具体数据 第三个月 periodParam=3
    let periodParam;

    if (periodSelector == "date" || periodSelector == undefined) {
      periodParam = date;
      periodSelector = "d";
    } else {
      periodParam = period;
    }

    Object.assign(params, {
      year: year,
      period: periodSelector,
      periodParam: periodParam,
      service: service,
      username: username
    });
    console.log(params, "---------------------");
    switch (operationType) {
      case "particulars":
        // TODO 传参处理
        this.toPath("../order/list", params);
        break;
    }
  }

  toPath(url: string, params?: any) {
    this.$router.push({
      path: url,
      query: {
        ...params
      }
    });
  }

  async loadData(params: any = {}) {
    const response = await clientService.getBillList({
      page: this.page,
      per_page: this.pageSize,
      sortBy: "createTime",
      order: "asc",
      type: 1,
      ...params
    });
    console.log(response);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
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
