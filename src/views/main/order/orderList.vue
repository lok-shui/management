<template>
  <div class="bgColor">
    <div class="staticName">我的订单</div>
    <div class="listContent">
      <div class="status">
        <b>状态：</b>
        <a-radio-group name="radioGroup" @change="changestatus">
          <a-radio
            v-for="(item, index) in checkStatus"
            :key="index"
            :value="item.status"
          >
            {{ item.name }}
          </a-radio>
        </a-radio-group>
      </div>

      <div class="createOrder">
        <a-button type="primary" @click="toEditPage">创建订单</a-button>
      </div>

      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        rowKey="id"
        :pagination="paginationConfig"
        @change="onPageChange"
      >
        <!-- 0.草稿、1.待确认、2.线下转账中、3.线下转账中、4.交易成功、5.交易取消  -->
        <template slot="status" slot-scope="status">
          <span>{{
            status == 0
              ? "草稿"
              : status == 1
              ? "待确认"
              : status == 2
              ? "线下转账中"
              : status == 3
              ? "线下转账中"
              : status == 4
              ? "交易成功"
              : "交易取消"
          }}</span>
        </template>
        <template slot="created_at" slot-scope="created_at">
          <span>{{ created_at | formatDate("YYYY-MM-DD HH:mm") }}</span>
        </template>
        <template slot="operation" slot-scope="text, recode">
          <span v-if="recode.status == 0"
            ><a-button @click="orderEdit(recode.buy_order_id)" type="primary"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <a-button @click="lookdetails(recode.buy_order_id)" type="primary"
              >查看</a-button
            ></span
          >
          <span v-else-if="recode.status == 1">
            <a-button @click="orderEdit(recode.buy_order_id)" type="primary"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <!-- <a-button @click="lookdetails(recode.buy_order_id)" type="primary"
              >申请改价</a-button
            > -->
            <!-- <a-divider type="vertical" /> -->
            <a-button @click="forwarding(recode.buy_order_id)" type="primary"
              >转发</a-button
            >
            <a-divider type="vertical" />
            <a-button @click="lookdetails(recode.buy_order_id)" type="primary"
              >查看</a-button
            >
          </span>
          <span v-else-if="recode.status == 2 || recode.status == 3">
            <!-- <a-button type="primary">确认已支付</a-button> -->
            <!-- <a-divider type="vertical" /> -->
            <a-button @click="lookdetails(recode.buy_order_id)" type="primary"
              >查看</a-button
            >
          </span>
          <span v-else-if="recode.status == 4">
            <a-button @click="lookdetails(recode.buy_order_id)" type="primary"
              >再次编辑</a-button
            >
          </span>
          <!-- <span v-else-if="recode.status == 5">
            <a-button @click="orderEdit(recode.buy_order_id)" type="primary"
              >再次编辑</a-button
            >
          </span> -->
        </template>
      </a-table>
    </div>
    <a-modal
      title="订单链接"
      :visible="showmodal"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="复制链接"
    >
      <div>{{ webside }}</div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import userOrder from "@/service/order";
import cache from "@/utils/cache";
const userorder = userOrder.getOrder();
interface tableInterface {
  theme: string;
  content: string;
  order: number;
  startTime: string;
  endTime: string;
  index?: number;
  editable?: boolean;
}
@Component({
  components: {
    operationBar,
    tableOperation
  }
})
export default class OrderList extends Vue {
  showmodal: boolean = false;
  checkStatus: any[] = [
    { name: "全部", status: null },
    { name: "草稿", status: 0 },
    { name: "待确认", status: 1 },
    { name: "线下转账中", status: 2 },
    { name: "交易成功", status: 3 },
    { name: "交易取消", status: 4 }
  ];
  columns: any[] = [
    {
      title: "订单编号",
      dataIndex: "show_order_id",
      scopedSlots: { customRender: "show_order_id" }
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "客户名称",
      dataIndex: "user_name",
      scopedSlots: { customRender: "user_name" }
    },
    {
      title: "公司名称",
      dataIndex: "company_name",
      scopedSlots: { customRender: "company_name" }
    },
    {
      title: "购买服务",
      dataIndex: "buy_service_name",
      scopedSlots: { customRender: "buy_service_name" }
    },
    {
      title: "总价",
      dataIndex: "actual_price",
      scopedSlots: { customRender: "actual_price" }
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      scopedSlots: { customRender: "created_at" }
    },
    {
      title: "创建人",
      dataIndex: "creator_name",
      scopedSlots: { customRender: "creator_name" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 400,
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: tableInterface[] = [];
  parmesdata: any = {
    page: 1,
    per_page: "10"
  };
  webside: string = "";
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  page: number = 1;
  pageSize: number = 10;
  created() {
    this.getOrderList();
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
  async getOrderList() {
    const res = await userorder.getOrderList(this.parmesdata);
    if (res) {
      console.log("res", res);
      this.tableData = res.rows;
      this.totalCount = res.count;
      this.paginationConfig.total = this.totalCount;
      this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    }
  }
  toEditPage() {
    this.$router.push({
      path: "orderEdit"
    });
  }
  lookdetails(id: any) {
    console.log("id", id);
    this.$router.push("/main/order/orderDatils/" + id);
  }
  changestatus(e: any) {
    console.log(e.target.value);
    this.parmesdata = {
      ...this.parmesdata,
      status: e.target.value,
      page: 1
    };
    this.getOrderList();
  }
  orderEdit(id: any) {
    this.$router.push("/main/order/orderEdit/" + id);
  }
  handleOk(e: any) {
    let url = this.webside;
    let oInput = document.createElement("input");
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    console.log(oInput.value);
    document.execCommand("Copy"); // 执行浏览器复制命令
    this.showmodal = false;
    this.$message.success("链接已复制，快去粘贴吧");
  }
  handleCancel(e: any) {
    this.showmodal = false;
  }
  forwarding(id: any) {
    this.showmodal = true;
    console.log(id);
    this.webside =
      "https://aiep-platform-frontend-mip.dev.dm-ai.cn/order/confirm/orderconfirm?oderid=" +
      id +
      "&username=" +
      cache.localGet("ai-name");
  }
  // 分页器
  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.parmesdata.page = this.page;
    this.getOrderList();
  }
}
</script>

<style lang="scss" scoped>
.bgColor {
  background: #fff;
  // border: 1px solid gray;
  .staticName {
    margin: 20px 0 0 20px;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
  }
  .listContent {
    padding: 50px 80px;
    .status {
      text-align: left;
      margin-bottom: 30px;
    }
    .createOrder {
      display: flex;
      justify-content: flex-end;
      // border: 1px solid red;
      margin-bottom: 20px;
    }
  }
}
</style>
