<template>
  <div class="bgColor">
    <div class="header">
      <a-button
        type="primary"
        v-show="usernews.status == 0 || usernews.status == 1"
        class="mr"
        @click="orderEdit(usernews.buy_order_id)"
        >编辑</a-button
      >
      <a-button type="primary" v-show="usernews.status == 1" @click="forwarding"
        >分享转发</a-button
      >
    </div>
    <div class="staticName">基本信息</div>
    <div class="usernews">
      <div class="list">
        <div>订单ID</div>
        <div>{{ usernews.show_order_id }}</div>
      </div>
      <div class="list">
        <div>订单状态</div>
        <div>
          {{
            usernews.status == 0
              ? "草稿"
              : usernews.status == 1
              ? "待确认"
              : usernews.status == 2
              ? "线下转账中"
              : usernews.status == 3
              ? "交易成功"
              : "交易取消"
          }}
        </div>
        <div>
          {{
            usernews.expired_at | formatDate("YYYY-MM-DD HH:mm")
          }}前不确认自动关闭
        </div>
      </div>
      <div class="list">
        <div>客户查看记录</div>
        <div>{{ usernews.view_count }}</div>
        <div>最近一次查看{{ usernews.last_view_at }}</div>
      </div>
      <div class="list">
        <div>客户姓名</div>
        <div>{{ usernews.user_name }}</div>
      </div>
      <div class="list">
        <div>公司</div>
        <div>{{ usernews.company_name }}</div>
      </div>
    </div>
    <div class="staticName">服务购买清单</div>
    <div class="listContent">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        rowKey="id"
        :pagination="false"
      >
        <template
          slot="service_valid_type"
          slot-scope="service_valid_type, recode"
        >
          <span>{{
            service_valid_type == "BY_CONTRACT"
              ? recode.service_valid_desc
              : service_valid_type == "BY_ACTIVATE"
              ? "激活后" + recode.active_days + "天"
              : "长期"
          }}</span>
        </template>
        <template slot="action" slot-scope="text, recode">
          <!-- <a-button
            type="primary"
            class="mr"
            v-show="recode.status == '0'"
            @click="orderEdit(usernews.buy_order_id)"
            >编辑</a-button
          >
          <a-button
            type="primary"
            class="mr"
            v-show="recode.status == 1 "
            @click="changeprice"
            >申请改价</a-button
          > -->
          <a-button
            type="primary"
            class="mr"
            v-show="recode.status == 1"
            @click="
              okpay(recode.detail_id, recode.status, recode.service_valid_type)
            "
            >客户已支付</a-button
          >
          <a-button
            type="primary"
            v-show="recode.status == 2 && issuper == '0'"
            @click="
              okpay(recode.detail_id, recode.status, recode.service_valid_type)
            "
            >确认授权</a-button
          >
          <a-button type="primary" v-show="recode.status == 4" :disabled="true"
            >已授权</a-button
          >
          <!-- <a-button type="primary" @click="authorizationservice(recode)">
            确认授权</a-button
          > -->
        </template>
      </a-table>
      <div class="price">
        <div class="mr">总计原价：{{ usernews.original_price }}</div>
        <div>实收：{{ usernews.actual_price }}</div>
      </div>
      <div>
        <!-- <a-button
          type="primary"
          class="mr"
          v-show="usernews.status == '0' || usernews.status == 1"
          @click="orderEdit(usernews.buy_order_id)"
          >编辑</a-button
        > -->
        <a-button
          type="primary"
          class="mr"
          v-show="usernews.status == 1"
          @click="changeprice"
          >申请改价</a-button
        >
        <!-- <a-button
          type="primary"
          class="mr"
          v-show="usernews.status == 2"
          @click="okpay"
          >确认已支付</a-button
        >
        <a-button
          type="primary"
          v-show="usernews.status == 2 && issuper == '0'"
          @click="authorization"
          >确认授权</a-button
        > -->
      </div>
    </div>
    <a-modal
      title="修改价格"
      :visible="pricevisible"
      :confirm-loading="priceconfirmLoading"
      @ok="pricehandleOk"
      @cancel="handleCancel"
    >
      <div class="changeprice">
        <div class="pricebox">
          <div>总计原价</div>
          <div>￥{{ usernews.original_price }}</div>
        </div>
        <div class="pricebox">
          <div>请输入涨价或者折扣</div>
          <div class="discount">
            <a-input
              class="br"
              @change="changediscount"
              v-model="discountvalue"
            />
            <span>折=$￥</span>
            <span class="br" style="width: 100px; padding: 0 10px">{{
              diffprice
            }}</span>
          </div>
        </div>
        <div>实收：(实收 = 总计原价 + 涨价或者折扣)</div>
        <div>{{ "￥" + actualprice }}</div>
      </div>
    </a-modal>
    <a-modal
      title="订单链接"
      :visible="showmodal"
      @ok="handleOk"
      @cancel="forwardingCancel"
    >
      <div>{{ webside }}</div>
    </a-modal>
    <a-modal :visible="okshow" @ok="handleokshow" @cancel="okshowCancel">
      <div>{{ okshowtext }}</div>
    </a-modal>
    <a-modal
      :visible="contractshow"
      @ok="handleokcontract"
      @cancel="contractCancel"
    >
      <div>请根据合同，填写服务有效期</div>
      <a-range-picker @change="rangeChange" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import userOrder from "@/service/order";
import cache from "@/utils/cache";
import ClientService from "@/service/client";
import moment from "moment";
const clientService = ClientService.getService();
const userorder = userOrder.getOrder();
@Component({
  components: {
    operationBar,
    tableOperation
  }
})
export default class OrderList extends Vue {
  showmodal: boolean = false;
  columns: any[] = [
    {
      title: "服务名称",
      dataIndex: "service_name",
      scopedSlots: { customRender: "service_name" }
    },
    {
      title: "产品型号",
      dataIndex: "produce_number",
      scopedSlots: { customRender: "produce_number" }
    },
    {
      title: "交付形态",
      dataIndex: "access_method",
      scopedSlots: { customRender: "access_method" }
    },
    {
      title: "计费方式",
      dataIndex: "billing_method",
      scopedSlots: { customRender: "billing_method" }
    },
    {
      title: "购买数量",
      dataIndex: "buy_count",
      scopedSlots: { customRender: "buy_count" }
    },
    {
      title: "价格",
      dataIndex: "price",
      scopedSlots: { customRender: "price" }
    },
    {
      title: "有效期",
      dataIndex: "service_valid_type",
      scopedSlots: { customRender: "service_valid_type" }
    },
    {
      title: "操作",
      dataIndex: "action",
      scopedSlots: { customRender: "action" }
    }
  ];
  tableData: Array<any> = [];
  BillingTypedata: Array<any> = [];
  usernews: any = "";
  pricevisible: boolean = false;
  priceconfirmLoading: boolean = false;
  ModalText: string = "";
  discountvalue: any = "";
  actualprice: any = "";
  diffprice: any = "";
  issuper: string = ""; //当前登录用户的id
  billID: string = "";
  paramsdata: any = {};
  webside: string = "";
  okshow: boolean = false;
  contractshow: boolean = false;
  okshowtext: any = "";
  detail_id: any = "";
  created() {
    this.getBillingType();
    this.billID = this.$route.params.id;
    this.getOrderDetails();
    if (this.$store.state.user.actived !== undefined) {
      this.issuper = this.$store.state.user.actived;
      cache.localSet("issuper", this.issuper);
    } else {
      this.issuper = cache.localGet("issuper");
    }
    console.log("this.issuper", this.issuper);
  }
  // 获取接入方式
  async getBillingType() {
    const response = await clientService.getBillingType();
    this.BillingTypedata = response;
  }
  async getOrderDetails() {
    const res = await userorder.getOrderDetails(this.billID);
    if (res) {
      console.log("res", res);
      this.usernews = res;
      this.tableData = res.detail;
      this.tableData.map(item => {
        this.BillingTypedata.map(i => {
          item.billing_method =
            item.billing_method == i.id ? i.type : item.billing_method;
        });
      });
      this.paramsdata = {
        buy_order_id: this.usernews.buy_order_id
      };
    }
  }
  async putOrderList(params: any) {
    const res = await userorder.putOrderList(params);
    if (res) {
      console.log("修改成功", res);
      this.getOrderDetails();
    }
  }
  async patchOrderList(params: any) {
    const res = await userorder.patchOrderList(params);
    if (res) {
      console.log("修改成功", res);
      if (this.pricevisible) {
        this.$message.success("修改价格成功");
        this.pricevisible = false;
      }
      if (this.okshow) {
        if (this.okshowtext == "您是否确认客户已完成线下支付") {
          this.$message.success("已确认支付");
        } else if (
          this.okshowtext ==
          "您是否确认客户已完成线下支付,确认后客户将自动获得服务和数量"
        ) {
          this.$message.success("已授权");
        }

        this.okshow = false;
      }

      this.getOrderDetails();
    }
  }
  toEditPage() {
    this.$router.push({
      path: "orderEdit"
    });
  }
  // 修改价格
  changeprice() {
    this.pricevisible = true;
  }
  pricehandleOk(e: any) {
    this.priceconfirmLoading = true;
    setTimeout(() => {
      this.pricevisible = false;
      this.priceconfirmLoading = false;
    }, 2000);
    this.paramsdata = {
      ...this.paramsdata,
      type: "1",
      price: this.actualprice
    };
    this.patchOrderList(this.paramsdata);
  }
  handleCancel(e: any) {
    this.pricevisible = false;
  }
  changediscount() {
    console.log("this.discountvalue", Number(this.discountvalue));
    if (Number(this.discountvalue) == 0) {
      this.actualprice = "";
      this.diffprice = "";
      return;
    }
    let num = Number(this.discountvalue);
    if (!isNaN(num)) {
      this.actualprice = (num / 10) * Number(this.usernews.original_price);
      this.diffprice = this.actualprice - Number(this.usernews.original_price);
    } else {
      this.actualprice = "";
    }
  }
  // 修改订单状态
  okpay(id: any, status: any, type: any) {
    this.paramsdata = {
      ...this.paramsdata,
      detail_id: id
    };
    if (status == 1) {
      this.okshow = true;
      this.okshowtext = "您是否确认客户已完成线下支付";
      this.paramsdata = {
        ...this.paramsdata,
        type: "2"
      };
    } else if (status == 2) {
      this.okshowtext =
        "您是否确认客户已完成线下支付,确认后客户将自动获得服务和数量";
      this.paramsdata = {
        ...this.paramsdata,
        type: "3"
      };
      if (type == "BY_CONTRACT") {
        this.contractshow = true;
      } else {
        this.okshow = true;
      }
    }
  }
  handleokshow(e: any) {
    this.patchOrderList(this.paramsdata);
  }
  okshowCancel(e: any) {
    this.okshow = false;
  }
  authorization() {
    this.paramsdata = {
      ...this.paramsdata,
      type: "2",
      status: "3"
    };
    this.patchOrderList(this.paramsdata);
  }
  // 编辑
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
  authorizationservice(value: any) {
    console.log(value);
  }
  forwardingCancel(e: any) {
    this.showmodal = false;
  }
  forwarding(id: any) {
    this.showmodal = true;
    console.log(id);
    this.webside =
      "https://aiep-platform-frontend-mip.dev.dm-ai.cn/order/confirm/orderconfirm?oderid=" +
      this.usernews.buy_order_id +
      "&username=" +
      cache.localGet("ai-name");
  }
  formatTime(date: any, time: string) {
    return +new Date(`${moment(date).format("YYYY-MM-DD")} ${time}`);
  }
  rangeChange(date: any, dateString: any) {
    console.log(date, dateString);
    Object.assign(this.paramsdata, {
      service_valid_start_at: this.formatTime(new Date(date[0]), "00:00:00"),
      service_valid_end_at: this.formatTime(new Date(date[1]), "23:59:59")
    });
  }
  handleokcontract(e: any) {
    this.contractshow = false;
    this.okshow = true;
  }
  contractCancel(e: any) {
    this.contractshow = false;
  }
}
</script>

<style lang="scss" scoped>
.bgColor {
  background: #fff;
  padding: 50px 80px;
  // border: 1px solid gray;
  .header {
    float: right;
  }
  .staticName {
    margin: 20px 0 0 0;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .usernews {
    display: flex;
    flex-flow: wrap;
    .list {
      width: 30%;
      height: 100px;
      text-align: left;
      font-size: 16px;
      border: 1px solid rgba($color: #000000, $alpha: 0.2);
      padding: 10px;
      margin-right: 30px;
      margin-bottom: 30px;
    }
  }
  .listContent {
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
    .price {
      display: flex;
      justify-content: center;
      font-size: 24px;
      padding: 20px;
      margin-top: 50px;
    }
  }
  .mr {
    margin-right: 30px;
  }
}
</style>
