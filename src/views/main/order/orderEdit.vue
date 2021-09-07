<template>
  <div class="bgColor">
    <div class="form-contain">
      <a-form :form="form" class="formStyle" @submit="handleSubmit">
        <a-form-item label="选择客户">
          <a-select
            showSearch
            placeholder="请选择客户"
            v-decorator="[
              'username',
              { rules: [{ required: true, message: '请选择客户' }] }
            ]"
          >
            <a-select-option
              v-for="(item, index) in usernameList"
              :key="index"
              :value="item.username"
            >
              {{ item.username }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="addClientNew">添加客户</a-button>
        </a-form-item>

        <a-form-item label="公司名称">
          <a-input
            v-decorator="[
              'companyname',
              { rules: [{ required: true, message: '请输入客户公司名称' }] }
            ]"
            placeholder="请输入客户公司名称"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary">选择服务套餐</a-button>
        </a-form-item>
        <a-form-item>
          <a-form :form="serviceform" class="formStyle" @submit="handleservice">
            <a-form-item label="一级分类">
              <a-select
                @change="firstSelect"
                showSearch
                placeholder="请选择一级分类"
                v-decorator="[
                  'level1',
                  {
                    rules: [{ required: true, message: '请选择一级行业分类' }]
                  }
                ]"
              >
                <a-select-option
                  v-for="item in firstClass"
                  :key="item.id"
                  :value="item.name"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="二级分类">
              <a-select
                showSearch
                placeholder="请选择二级分类"
                @change="secondSelect"
                v-decorator="[
                  'serviceGroup',
                  {
                    rules: [{ required: true, message: '请选择二级行业分类' }]
                  }
                ]"
              >
                <a-select-option
                  v-for="(item, index) in serviceType"
                  :key="index"
                  :value="item.name"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="选择服务">
              <a-select
                showSearch
                placeholder="选择购买服务"
                @change="changeservice"
                v-decorator="[
                  'servicename',
                  { rules: [{ required: true, message: '请选择服务' }] }
                ]"
              >
                <a-select-option
                  v-for="(item, index) in interfaceNameList"
                  :key="index"
                  :value="item.serviceId"
                >
                  {{ item.serviceName }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="可选服务">
              <a-table
                :columns="columns"
                :dataSource="servicelist"
                bordered
                rowKey="id"
                :pagination="false"
                :row-selection="{
                  selectedRowKeys: selectedRowKeys,
                  onChange: onSelectChange
                }"
              >
                <template
                  slot="service_valid_end_at"
                  slot-scope="service_valid_end_at, recode"
                >
                  <span v-if="service_valid_end_at !== null">{{
                    service_valid_end_at | formatDate("YYYY-MM-DD HH:mm")
                  }}</span>
                  <span v-else>{{ "激活" + recode.active_days + "天后" }}</span>
                </template>
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
                <template
                  slot="service_valid_type"
                  slot-scope="service_valid_type"
                >
                  <span v-if="service_valid_type == 'BY_CONTRACT'"
                    >按合同有效期计算</span
                  >
                  <span v-else-if="service_valid_type == 'BY_ACTIVATE'"
                    >按用户激活时间计算</span
                  >
                  <span v-else-if="service_valid_type == 'BY_PERPETUAL'"
                    >私有化部署</span
                  >
                </template>
                <template slot="billing_method" slot-scope="billing_method">
                  <span v-if="billing_method == 'BY_TIME'">按时计费</span>
                  <span v-else-if="billing_method == 'BY_NUMBER'"
                    >按量计费</span
                  >
                  <span v-else-if="billing_method == 'BY_PACKAGE'"
                    >包量计费</span
                  >
                  <span v-else-if="billing_method == 'BY_EQUIPMENT'"
                    >设备授权数</span
                  >
                </template>
              </a-table>
            </a-form-item>

            <a-form-item>
              <div class="lineSave">
                <a-button html-type="submit" class="save">保存服务</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-form-item>
        <a-form-item label="已选套餐">
          <a-table
            :columns="isSelecte"
            :dataSource="isSelecteData"
            bordered
            rowKey="id"
            :pagination="false"
          >
            <template
              slot="service_valid_end_at"
              slot-scope="service_valid_end_at, recode"
            >
              <span v-if="service_valid_end_at !== null">{{
                service_valid_end_at | formatDate("YYYY-MM-DD HH:mm")
              }}</span>
              <span v-else>{{ "激活" + recode.active_days + "天后" }}</span>
            </template>
            <template slot="operation" slot-scope="text, recode, index">
              <a-button @click="deletethis(recode, index)">删除</a-button>
            </template>
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
            <template slot="service_valid_type" slot-scope="service_valid_type">
              <span v-if="service_valid_type == 'BY_CONTRACT'"
                >按合同有效期计算</span
              >
              <span v-else-if="service_valid_type == 'BY_ACTIVATE'"
                >按用户激活时间计算</span
              >
              <span v-else-if="service_valid_type == 'BY_PERPETUAL'"
                >私有化部署</span
              >
            </template>
            <template slot="billing_method" slot-scope="billing_method">
              <span v-if="billing_method == 'BY_TIME'">按时计费</span>
              <span v-else-if="billing_method == 'BY_NUMBER'">按量计费</span>
              <span v-else-if="billing_method == 'BY_PACKAGE'">包量计费</span>
              <span v-else-if="billing_method == 'BY_EQUIPMENT'"
                >设备授权数</span
              >
            </template>
          </a-table>
        </a-form-item>
        <a-form-item label="总计原价">
          {{ "￥" + usernews.original_price }}
        </a-form-item>

        <a-form-item label="实收">
          {{ "￥" + usernews.actual_price }}
          <a-button
            type="primary"
            v-show="usernews.actual_price > 0"
            @click="changeprice"
            >一键改价</a-button
          >
        </a-form-item>

        <a-form-item label="" class="btnstyle">
          <a-button
            class="btn"
            @click="status = '0'"
            v-show="usernews.status == '0' || usernews.status == undefined"
            html-type="submit"
            >保存草稿</a-button
          >
          <a-button
            type="primary"
            class="btn"
            v-show="usernews.status == '1'"
            html-type="submit"
            >确定</a-button
          >
          <a-button
            class="btn"
            type="primary"
            @click="status = '1'"
            html-type="submit"
            v-show="usernews.status == '0' || usernews.status == undefined"
            >创建订单</a-button
          >
          <a-button>取消</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-modal
      :visible="showClientNew"
      @cancel="closeClientNew"
      :footer="null"
      width="1000px"
    >
      <ClientNew />
    </a-modal>
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
        <div>{{ "￥" + usernews.actual_price }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ClientNew from "@/views/main/client/ClientNew.vue";
import ClientService from "@/service/client";
import ManageService from "@/service/manage";
import userOrder from "@/service/order";
import store from "@/store";
import AuthorityService from "@/service/authority";
const authorityService = AuthorityService.getService();
const userorder = userOrder.getOrder();
const clientService = ClientService.getService();
const manageService = ManageService.getService();
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
    ClientNew
  }
})
export default class OrderEdit extends Vue {
  form: any = {};
  serviceform: any = {};
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
      dataIndex: "service_valid_type",
      scopedSlots: { customRender: "service_valid_type" }
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
      dataIndex: "service_valid_desc",
      scopedSlots: { customRender: "service_valid_desc" }
    }
  ];
  isSelecte: any[] = [
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
      dataIndex: "service_valid_type",
      scopedSlots: { customRender: "service_valid_type" }
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
      dataIndex: "service_valid_desc",
      scopedSlots: { customRender: "service_valid_desc" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 160,
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: Array<any> = [];
  isSelecteData: Array<any> = [];
  SelecteData: Array<any> = [];
  servicelist: Array<any> = [];
  BillingTypedata: Array<any> = [];
  usernameList: Array<any> = [];
  interfaceNameList: Array<any> = [];
  creatorid: string = this.$store.state.user.id; //当前登录用户的id
  creatorname: string = this.$store.state.user.username; //当前登录用户的名字（售前或者经理）
  billID: string = "";
  price: any = "0";
  firstClass: any[] = [];
  modalContent: any[] = [];
  serviceType: any[] = [];
  lucky: string = "";
  select2: string = "";
  showClientNew: boolean = false;
  selectedRowKeys: Array<any> = [];
  // 一键改价
  pricevisible: boolean = false;
  priceconfirmLoading: boolean = false;
  usernews: any = {
    original_price: 0,
    actual_price: 0
  };
  discountvalue: any = "";
  actualprice: any = "";
  diffprice: any = "";
  paramsdata: any = {};
  status: string = "";
  orderdata: any = {
    user_id: "", //客户id
    user_name: "", //客户名称
    company_name: "", //公司名称
    original_price: 0, //总计原价
    actual_price: 0, //实收
    status: this.status, //0.草稿、1.待确认、2.线下转账中、3.交易成功、4.交易取消; 这里只有0，1才能新增，其他值一律不过
    detail: []
  };

  ServiceTypedata: Array<any> = [];
  created() {
    this.firstClassSelect();
    this.getUsernameList();
    this.getBillingType();
    this.getServiceType();
    this.billID = this.$route.params.id;
    if (this.billID !== undefined) {
      this.getOrderDetails();
    }
    this.form = this.$form.createForm(this, {});
    this.serviceform = this.$form.createForm(this, {});
  }
  // 获取订单详情
  async getOrderDetails() {
    const res = await userorder.getOrderDetails(this.billID);
    if (res) {
      console.log("res", res);
      this.tableData = res.detail;
      this.usernews = res;
      this.form.setFieldsValue({
        username: res.user_name,
        companyname: res.company_name
      });
      this.paramsdata = {
        buy_order_id: res.buy_order_id
      };
      this.orderdata.original_price = res.original_price;
      this.orderdata.actual_price = res.actual_price;
      this.isSelecteData = res.detail;
    }
  }
  // 订单数据更新
  async putOrderList(params: any) {
    const res = await userorder.putOrderList(params);
    if (res) {
      console.log("修改成功", res);
      this.$message.success("订单更新成功");
      // this.getOrderDetails();
      this.$router.push(
        "/main/order/orderDatils/" + this.usernews.buy_order_id
      );
    }
  }
  // 新增服务 草稿或订单
  async createOrder(params: any) {
    const res = await userorder.createOrder(params);
    if (res) {
      console.log("新增服务", res);
      if (this.status == "0") {
        this.$message.success("已保存为草稿");
      } else {
        this.$message.success("创建订单成功");
      }

      this.$router.push("/main/order/orderList");
    }
  }
  // 获取接入方式
  async getBillingType() {
    const response = await clientService.getBillingType();
    this.BillingTypedata = response;
  }
  // 获取用户名
  async getUsernameList() {
    const response = await clientService.getUsernameList();
    this.usernameList = response;
  }
  // 获取服务
  async getInterfaceNameList(params: any) {
    const response = await userorder.getInterfaceNameList(params);
    console.log(response, "套餐!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    this.interfaceNameList = response;
  }
  // 获取计算方式
  async getServiceType() {
    const response = await clientService.getServiceType();
    this.ServiceTypedata = response;
  }
  // 一级分类接口
  async firstClassSelect() {
    const response = await authorityService.addNewService({
      type: "一级能力"
    });
    this.firstClass = response;
    this.modalContent = response;
  }
  // 二级联动
  async concatSecond(param: any) {
    const response = await authorityService.getConfigList(param);
    this.serviceType = response;
  }
  // 二级分类接口
  async secondClassSelect(param: any) {
    const response = await authorityService.addNewClassify(param);
    const { name, value } = response;
    this.form.setFieldsValue({
      firstClass: value,
      serviceGroup: name
    });
  }
  // 服务套餐
  async getbillingscheme(params: any) {
    const res = await userorder.getbillingscheme(params);
    if (res) {
      console.log("计费规则", res);
      if (res[0].prices == undefined) {
        this.servicelist = [];
        return;
      }
      let pricelist: Array<any> = res[0].prices;
      pricelist.map(item => {
        let list = {
          service_id: res[0].serviceId, //服务id
          service_name: res[0].serviceName, //服务名称
          produce_number: res[0].productNumber, //产品型号
          access_method: res[0].useMethod, //接入方式: API , SDK , APK , PRIVATIZATION_DEPLOYMENT ; 见锐浩文档新增账单说明
          billing_method: item.billingType, // 计费方式：BY_TIME， BY_NUMBER，BY_PACKAGE，BY_EQUIPMENT  ; 见锐浩文档新增账单说明
          access_type: "正式接入", //接入类型
          service_valid_type: res[0].serviceValidType, // 获取服务有效计算类型; 所有的值： BY_CONTRACT，BY_ACTIVATE，BY_PERPETUAL
          service_valid_desc: item.expire, //如果是按合同有效期计算 ， 需要传这个字段, 有效期描述
          buy_count:
            res[0].serviceValidType == "BY_ACTIVATE" &&
            item.billingType == "BY_PACKAGE"
              ? res[0].activeCount
              : item.account, //购买数量
          price: item.price, //服务价格
          // id: item.id, //套餐id
          service_desc: res[0].serviceDescription //服务说明
        };
        console.log("2323", res[0].activeCount);

        if (res[0].serviceValidType == "BY_ACTIVATE") {
          list = {
            ...list,
            ...{ active_days: res[0].activeCount }
          };
        }
        this.servicelist.push(list);
      });
      console.log(" this.servicelist", this.servicelist);
    }
  }
  // 选择服务
  onSelectChange(selectedRowKeys: any, selectedRows: any) {
    console.log(" this.selectedRows", selectedRows);
    this.SelecteData = selectedRows;
    this.selectedRowKeys = selectedRowKeys;
  }
  // 保存服务
  handleservice(e: any) {
    e.preventDefault();
    this.serviceform.validateFields((err: any, values: any) => {
      if (err) return;
      this.usernews.original_price = 0;
      this.usernews.actual_price = 0;
      this.isSelecteData = [...this.isSelecteData, ...this.SelecteData];
      console.log(" this.isSelecteData ", this.isSelecteData);

      this.isSelecteData.map(item => {
        this.usernews.original_price =
          this.usernews.original_price + item.price;
        this.usernews.actual_price = this.usernews.actual_price + item.price;
      });
    });
  }
  // 删除服务
  deletethis(id: any, index: any) {
    console.log(id, index);
    this.usernews.original_price = 0;
    this.usernews.actual_price = 0;
    this.isSelecteData.splice(index, 1);
    this.isSelecteData.map(item => {
      this.usernews.original_price = this.usernews.original_price + item.price;
      this.usernews.actual_price = this.usernews.actual_price + item.price;
    });
  }
  async patchOrderList(params: any) {
    const res = await userorder.patchOrderList(params);
    if (res) {
      console.log("修改成功", res);
      this.getOrderDetails();
    }
  }
  // 编辑服务
  editthis(recode: any) {
    console.log("333", recode);
    let BillingType = "";
    this.BillingTypedata.map(item => {
      if (item.type == recode.billing_method) {
        BillingType = item.id;
      }
    });
  }

  // 二级分类的select @change
  secondSelect(value: any) {
    this.select2 = value;
    this.getInterfaceNameList({ serviceGroup: this.select2 });
  }

  // 一级分类的select @change
  firstSelect(value: any) {
    console.log("一级能力:", value);
    if (this.form.getFieldValue("serviceGroup") !== undefined) {
      this.form.setFieldsValue({
        serviceGroup: undefined
      });
    }
    if (this.form.getFieldValue("order") !== undefined) {
      this.form.setFieldsValue({
        order: undefined
      });
    }
    this.lucky = value;
    const param = {
      type: "二级能力",
      value: value
    };
    this.concatSecond(param);
  }
  changeservice(value: any) {
    this.getbillingscheme({ serviceId: value });
  }
  handleSubmit(e: any) {
    console.log("status", this.status);
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      console.log(1111, values);
      let { username, companyname } = values;
      let userId = "";
      this.usernameList.map(item => {
        if (item.username == username) {
          userId = item.userId;
        }
      });
      this.orderdata = {
        user_id: userId, //客户id
        user_name: username, //客户名称
        company_name: companyname, //公司名称
        original_price: this.usernews.original_price, //总计原价
        actual_price: this.usernews.actual_price, //实收
        status: this.status, //0.草稿、1.待确认、2.线下转账中、3.交易成功、4.交易取消; 这里只有0，1才能新增，其他值一律不过
        detail: this.isSelecteData
      };
      this.usernews = {
        ...this.usernews,
        user_name: username, //客户名称
        company_name: companyname, //公司名称
        detail: this.isSelecteData
      };
      // 创建和更新订单数据
      if (this.billID !== undefined) {
        if (this.status == "1") {
          this.createOrder(this.orderdata);
        } else {
          this.putOrderList(this.usernews);
        }
      } else {
        this.createOrder(this.orderdata);
      }
    });
  }

  addClientNew() {
    this.showClientNew = true;
  }
  closeClientNew() {
    this.showClientNew = false;
  }
  // 修改价格
  changeprice() {
    this.pricevisible = true;
  }
  handleCancel(e: any) {
    this.pricevisible = false;
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
  changediscount() {
    console.log("this.discountvalue", Number(this.discountvalue));
    if (Number(this.discountvalue) == 0) {
      this.actualprice = "";
      this.diffprice = "";
      return;
    }
    let num = Number(this.discountvalue);
    if (!isNaN(num)) {
      this.actualprice = num * Number(this.usernews.original_price);
      this.diffprice = this.actualprice - Number(this.usernews.original_price);
    } else {
      this.actualprice = "";
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.bgColor {
  background: #fff;
}
.btnstyle {
  padding-left: 200px;
}
.btn {
  margin: 0 30px;
}
</style>
