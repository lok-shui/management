<template>
  <div class="list-contain">
    <div class="operation-contain">
      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSearch">
          <a-form-item>
            <a-select
              showSearch
              v-decorator="['username', {}]"
              placeholder="用户名"
              style="width: 300px"
            >
              <a-select-option
                v-for="item in usernameList"
                :key="item.userId"
                :value="item.username"
              >
                {{ item.username }}</a-select-option
              ></a-select
            >
          </a-form-item>

          <a-form-item>
            <a-select
              v-decorator="['servicename', {}]"
              placeholder="服务名称"
              style="width: 300px"
            >
              <a-select-option
                v-for="item in interfaceNameList"
                :key="item.serviceId"
                :value="item.serviceId"
              >
                {{ item.serviceName }}
              </a-select-option></a-select
            >
          </a-form-item>
          <a-form-item>
            <a-range-picker v-decorator="['registTime', {}]" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit"> 搜索 </a-button>
            <a-button type="default" @click="clear"> 清除 </a-button>
            <a-button type="primary" @click="addnew"> 新增 </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <div class="table">
      <a-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :columns="columns"
        :data-source="UserServiceList"
        :pagination="paginationConfig"
        @change="onPageChange"
      >
        <template slot="surplusAmount" slot-scope="surplusAmount">
          <span>{{ surplusAmount }}</span>
        </template>
        <template slot="purchaseTime" slot-scope="purchaseTime">
          <span>{{ purchaseTime | formatDate("YYYY-MM-DD HH:mm") }}</span>
        </template>
        <span slot="action" slot-scope="recode">
          <!-- <a>查看详情</a> -->
          <!-- <a-divider type="vertical" /> -->
          <a @click="upgrade(recode.id)">续费升级</a>
          <a-divider type="vertical" />
          <a @click="deletepurchase(recode.id)">删除</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import ClientService from "@/service/client";
import moment from "moment";
import ManageService from "@/service/manage";
import { useTime, useNum } from "@/utils/timeFormat";
const clientService = ClientService.getService();
const manageService = ManageService.getService();
@Component
export default class ClientAuthorization extends Vue {
  columns: Array<any> = [
    {
      title: "应用名称",
      dataIndex: "username"
    },
    {
      title: "服务名称",
      dataIndex: "serviceName"
    },
    {
      title: "剩余量",
      dataIndex: "surplusAmount",
      scopedSlots: { customRender: "surplusAmount" }
    },
    {
      title: "购买时间",
      dataIndex: "purchaseTime",
      scopedSlots: { customRender: "purchaseTime" }
    },
    {
      title: "操作",
      scopedSlots: { customRender: "action" }
    }
  ];

  page: number = 1;
  pageSize: number = 10;
  // 分页器
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  data: Array<any> = [];
  UserServiceList: Array<any> = [];
  selectedRowKeys: any[] = [];
  form: any = "";
  usernameList: any[] = [];
  interfaceNameList: any[] = [];
  created() {
    this.form = this.$form.createForm(this, {});
    this.getPurchaseInfo();
    this.getUsernameList();
    this.getInterfaceNameList();

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
  // 获取全部用户的账单列表
  async getPurchaseInfo(params: any = {}) {
    console.log("params", params);

    const response = await clientService.getPurchaseInfo({
      page: this.page,
      per_page: this.pageSize,
      sortBy: "purchaseTime",
      order: "desc",
      ...params
    });
    if (response) {
      this.UserServiceList = response.data;
      this.totalCount = response.count;
      this.paginationConfig.total = this.totalCount;
      this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
      this.UserServiceList.map(item => {
        // 状态和有效期管理
        item.account = item.account + item.unit;
        // 购买数量格式转换修改
        if (item.unit == "次") {
          console.log("item.account", item.account);
          item.surplusAmount = useNum(item.surplusAmount);
        } else if (item.unit == "小时") {
          item.surplusAmount =
            item.surplusAmount < 0
              ? "-" + useTime(item.surplusAmount)
              : useTime(item.surplusAmount);
        } else {
          item.surplusAmount = item.surplusAmount + item.unit;
        }
      });
    }
  }
  // 列表选择
  onSelectChange() {}
  // 分页器
  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getPurchaseInfo();
    // this.getList(this.handleParams());
  }
  // 搜索功能
  handleSearch(e: any) {
    e.preventDefault();
    this.form.validateFields((error: any, values: any) => {
      console.log("error", error);
      console.log("values", values);
      if (error) return;
      let userId = "";
      this.usernameList.map(item => {
        if (values.username == item.username) {
          userId = item.userId;
        }
      });
      const data = {
        startTime:
          values.registTime == undefined
            ? ""
            : new Date(values.registTime[0]).getTime(),
        endTime:
          values.registTime == undefined
            ? ""
            : new Date(values.registTime[1]).getTime(),
        userId: userId,
        serviceId: values.servicename == undefined ? "" : values.servicename
      };
      console.log("data", data);
      this.getPurchaseInfo(data);
    });
  }
  async getUsernameList() {
    const response = await clientService.getUsernameList();
    this.usernameList = response;
  }

  async getInterfaceNameList() {
    const response = await manageService.getAuthorizationList();
    this.interfaceNameList = response;
    console.log(" this.interfaceNameList", this.interfaceNameList);
  }

  handleReset() {
    this.form.resetFields();
  }

  toggle() {
    // this.expand = !this.expand;
  }
  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getPurchaseInfo();
  }
  // 新增id
  addnew() {
    this.$router.push("new");
  }
  upgrade(id: any) {
    this.$router.push("new/" + id);
  }
  // 删除
  async deletepurchase(purchaseId: any) {
    console.log(purchaseId);
    const response = await clientService.deletepurchaseId(purchaseId);
    if (response) {
      console.log(response);
      this.$message.success("删除成功");
      setTimeout(() => {
        this.$router.go(0);
      }, 500);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
