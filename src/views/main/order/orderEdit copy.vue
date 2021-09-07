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
              :value="item.userId"
            >
              {{ item.username }}
            </a-select-option>
          </a-select>
          <!-- <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: '请选择客户' }] },
            ]"
            placeholder="请输入客户名称"
          ></a-input> -->
          <a-button type="primary">添加客户</a-button>
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
          <a-table
            :columns="columns"
            :dataSource="tableData"
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
            <template slot="operation" slot-scope="text, recode">
              <span>
                <span @click="editthis(recode)">编辑</span>
                <a-divider type="vertical" />
                <span @click="deletethis(recode.id)">删除</span>
              </span>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item v-show="showserviceform">
          <a-form :form="serviceform" class="formStyle" @submit="handleservice">
            <a-form-item label="选择服务">
              <!-- <a-select
                showSearch
                placeholder="选择购买服务分类"
                v-decorator="[
                  'servicetype',
                  { rules: [{ required: true, message: '请选择服务分类' }] },
                ]"
              >
                <a-select-option
                  v-for="(item, index) in interfaceNameList"
                  :key="index"
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select> -->
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
                  :value="item.id"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="服务有效期计算"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-radio-group
                @change="ServiceTypechange"
                v-decorator="[
                  'ServiceType',
                  {
                    rules: [
                      { required: true, message: '请选择服务有效期计算类型' }
                    ]
                  }
                ]"
              >
                <a-radio
                  :value="item.id"
                  v-for="(item, index) in ServiceTypedata"
                  :key="index"
                >
                  {{ item.type }}</a-radio
                >
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="选择合同日期"
              v-if="timepickershow"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-range-picker
                @ok="pickerChange"
                v-decorator="[
                  'timepicker',
                  {
                    rules: [{ required: true, message: '请选择合同有效期' }]
                  }
                ]"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
            <a-form-item
              label="选择服务天数"
              v-if="validityshow"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }"
            >
              <a-radio-group
                @change="datechange"
                v-decorator="[
                  'access_token_validity',
                  {
                    rules: [{ required: true, message: '请选择服务有效期' }]
                  }
                ]"
              >
                <a-radio-button value="604800"> 7天 </a-radio-button>
                <a-radio-button value="1296000"> 15天 </a-radio-button>
                <a-radio-button value="2592000"> 30天 </a-radio-button>
                <a-radio-button value="7776000"> 90天 </a-radio-button>
                <a-radio-button value="15552000"> 180天 </a-radio-button>
                <a-radio-button value="31536000"> 365天 </a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="接入方式">
              <a-radio-group
                @change="methodchange"
                v-decorator="[
                  'UseMethod',
                  { rules: [{ required: true, message: '接入方式' }] }
                ]"
              >
                <a-radio
                  v-for="(item, index) in UseMethoddata"
                  :key="index"
                  :value="item.id"
                  :disabled="
                    isBY_PACKAGE.ServiceType == ''
                      ? false
                      : isBY_PACKAGE.ServiceType == 'BY_PERPETUAL' &&
                        item.id !== 'PRIVATIZATION_DEPLOYMENT'
                      ? true
                      : isBY_PACKAGE.ServiceType !== 'BY_PERPETUAL' &&
                        item.id == 'PRIVATIZATION_DEPLOYMENT'
                      ? true
                      : false
                  "
                  >{{ item.method }}</a-radio
                >
              </a-radio-group>
            </a-form-item>

            <a-form-item label="计费方式">
              <a-radio-group
                @change="BillingTypechange"
                v-decorator="[
                  'BillingType',
                  { rules: [{ required: true, message: '计费方式' }] }
                ]"
              >
                <a-radio
                  v-for="(item, index) in BillingTypedata"
                  :key="index"
                  :value="item.id"
                  :disabled="
                    isBY_PACKAGE.ServiceType == '' &&
                    isBY_PACKAGE.useMethod == ''
                      ? false
                      : isBY_PACKAGE.ServiceType == '' &&
                        isBY_PACKAGE.useMethod == 'SDK' &&
                        item.id == 'BY_PACKAGE'
                      ? true
                      : isBY_PACKAGE.ServiceType == '' &&
                        isBY_PACKAGE.useMethod == 'APK' &&
                        item.id !== 'BY_EQUIPMENT'
                      ? true
                      : isBY_PACKAGE.ServiceType == '' &&
                        isBY_PACKAGE.useMethod == 'PRIVATIZATION_DEPLOYMENT' &&
                        item.id !== 'BY_EQUIPMENT'
                      ? true
                      : isBY_PACKAGE.ServiceType == 'BY_PERPETUAL' &&
                        item.id !== 'BY_EQUIPMENT'
                      ? true
                      : isBY_PACKAGE.useMethod == 'SDK' &&
                        item.id == 'BY_PACKAGE'
                      ? true
                      : (isBY_PACKAGE.useMethod == 'APK' ||
                          isBY_PACKAGE.useMethod ==
                            'PRIVATIZATION_DEPLOYMENT') &&
                        item.id !== 'BY_EQUIPMENT'
                      ? true
                      : false
                  "
                >
                  {{ item.type + "/" + item.unit }}
                </a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="接入类型">
              <a-radio-group v-decorator="['accessMethods', {}]">
                <a-radio
                  v-for="(item, index) in accessType"
                  :key="index"
                  :value="item.label"
                  >{{ item.label }}</a-radio
                >
              </a-radio-group>
            </a-form-item>

            <a-form-item label="购买数量">
              <a-input-number
                :disabled="degreeishow"
                v-decorator="[
                  'residue_degree',
                  {
                    rules: [{ required: true, message: '请填入购买数量' }]
                  }
                ]"
                placeholder="请输入购买次数/时长/授权设备数"
                style="width: 300px"
              ></a-input-number>
            </a-form-item>

            <a-form-item label="价格" v-model="price">
              {{ price }}
            </a-form-item>

            <a-form-item>
              <div class="lineSave">
                <a-button html-type="submit" class="save">保存服务</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-form-item>
        <a-form-item label="总计原价">
          {{ "￥" + usernews.original_price }}
          <a-button type="primary">一键改价</a-button>
        </a-form-item>

        <a-form-item label="实收">
          {{ "￥" + usernews.actual_price }}
        </a-form-item>

        <a-form-item label="" class="btnstyle">
          <a-button
            type="primary"
            html-type="submit"
            v-show="billID == undefined"
            >保存草稿</a-button
          >
          <a-button
            type="primary"
            html-type="submit"
            class="btn"
            v-show="billID !== undefined"
            >确定</a-button
          >
          <a-button class="btn">取消</a-button>
          <a-button @click="createdservice" v-show="billID == undefined"
            >创建订单</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import ClientService from "@/service/client";
import ManageService from "@/service/manage";
import userOrder from "@/service/order";
import store from "@/store";
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
    operationBar,
    tableOperation
  }
})
export default class OrderEdit extends Vue {
  form: any = {};
  serviceform: any = {};
  showserviceform: boolean = true;
  chooseOption: any[] = [];
  // 客户、服务、接入方式、计费方式
  usernameList: any[] = [];
  UseMethoddata: any[] = [];
  BillingTypedata: any[] = [];
  ServiceTypedata: any[] = [];
  interfaceNameList: any[] = [];
  degreeishow: boolean = false;
  timepickershow: boolean = false;
  validityshow: boolean = false;
  UseMethodRadio: boolean = false;
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
      dataIndex: "service_valid_end_at",
      scopedSlots: { customRender: "service_valid_end_at" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 160,
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: Array<any> = [];
  // 接入类型
  accessType: any[] = [{ label: "试用（推荐POC阶段试用）", value: 0 }];
  isBY_PACKAGE: any = {
    ServiceType: "",
    billingType: "",
    useday: 0,
    useMethod: ""
  };
  creatorid: string = this.$store.state.user.id; //当前登录用户的id
  creatorname: string = this.$store.state.user.username; //当前登录用户的名字（售前或者经理）
  useMethod: string = "";
  billID: string = "";
  usernews: any = "";
  price: any = "0";
  billingscheme: any = {
    serviceId: null,
    useMethod: null,
    billingType: null,
    serviceValidType: null
  };
  servicedata: any = {
    service_id: null, //服务id
    service_name: null, //服务名称
    produce_number: null, //产品型号
    access_method: null, //接入方式: API , SDK , APK , PRIVATIZATION_DEPLOYMENT ; 见锐浩文档新增账单说明
    billing_method: null, // 计费方式：BY_TIME， BY_NUMBER，BY_PACKAGE，BY_EQUIPMENT  ; 见锐浩文档新增账单说明
    access_type: null, //接入类型
    service_valid_type: null, // 获取服务有效计算类型; 所有的值： BY_CONTRACT，BY_ACTIVATE，BY_PERPETUAL
    service_valid_start_at: null, //如果是按合同有效期计算 ， 需要传这个字段，开始日期的时间戳
    service_valid_end_at: null, //如果是按合同有效期计算 ， 需要传这个字段，结束日期的时间戳
    buy_count: null, //购买数量
    price: null, //服务价格
    active_days: null //按用户激活时间计算 ， 激活天数
  };

  created() {
    this.getUseMethod();
    this.getBillingType();
    this.getServiceType();
    this.getUsernameList();
    this.getInterfaceNameList();
    this.billID = this.$route.params.id;
    if (this.billID !== undefined) {
      this.getOrderDetails();
      this.showserviceform = false;
    }
    this.form = this.$form.createForm(this, {});
    this.serviceform = this.$form.createForm(this, {});
  }
  @Watch("billingscheme", { deep: true })
  changebilling() {
    console.log(22323);
    this.getbillingscheme(this.billingscheme);
  }
  @Watch("isBY_PACKAGE", { deep: true })
  watchchange() {
    if (
      (this.isBY_PACKAGE.billingType == "BY_PACKAGE" &&
        this.isBY_PACKAGE.ServiceType == "BY_ACTIVATE" &&
        this.isBY_PACKAGE.useday > 0 &&
        this.isBY_PACKAGE.useMethod == "API") ||
      (this.isBY_PACKAGE.billingType == "BY_PACKAGE" &&
        this.isBY_PACKAGE.ServiceType == "BY_CONTRACT" &&
        this.isBY_PACKAGE.useday > 0 &&
        this.isBY_PACKAGE.useday > 0 &&
        this.isBY_PACKAGE.useMethod == "API")
    ) {
      console.log(111);
      this.serviceform.setFieldsValue({
        residue_degree: this.isBY_PACKAGE.useday
      });
      this.degreeishow = true;
    } else {
      console.log(6666);

      this.degreeishow = false;
      this.serviceform.setFieldsValue({
        residue_degree: ""
      });
    }
  }
  @Watch("servicedata", { deep: true })
  servicedatachange() {
    console.log("servicedata", this.servicedata);
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
      this.serviceform.setFieldsValue({
        username: res.user_name,
        companyname: res.company_name
      });
    }
  }
  // 获取接入方法
  async getUseMethod() {
    const response = await clientService.getUseMethod();
    this.UseMethoddata = response;
  }
  // 获取接入方式
  async getBillingType() {
    const response = await clientService.getBillingType();
    this.BillingTypedata = response;
  }
  // 获取计算方式
  async getServiceType() {
    const response = await clientService.getServiceType();
    this.ServiceTypedata = response;
  }
  // 获取用户名
  async getUsernameList() {
    const response = await clientService.getUsernameList();
    this.usernameList = response;
  }
  // 获取服务
  async getInterfaceNameList() {
    const response = await manageService.getInterfaceNameList();
    console.log(response, "!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    this.interfaceNameList = response;
  }
  // 新增服务
  async createOrder(params: any) {
    const res = await userorder.createOrder(params);
    if (res) {
      console.log("新增服务", res);
    }
  }
  // 计费规则
  async getbillingscheme(params: any) {
    const res = await userorder.getbillingscheme(params);
    if (res) {
      console.log("计费规则", res);
    }
  }
  // 选择服务
  changeservice(e: any) {
    this.servicedata.service_id = e;
  }
  // 选择接入方式
  methodchange(e: any) {
    console.log(e.target.value);
    this.useMethod = e.target.value;
    this.isBY_PACKAGE.useMethod = e.target.value;
    this.billingscheme.useMethod = e.target.value;
    this.servicedata.access_method = e.target.value;
    if (
      this.useMethod == "APK" ||
      this.useMethod == "PRIVATIZATION_DEPLOYMENT"
    ) {
      this.serviceform.setFieldsValue({
        BillingType: "BY_EQUIPMENT"
      });
    } else {
      this.serviceform.setFieldsValue({
        BillingType: ""
      });
    }
  }
  // 服务计算类型选择
  ServiceTypechange(e: any) {
    console.log(e.target.value);
    this.isBY_PACKAGE.useday = 0;
    this.isBY_PACKAGE = {
      ServiceType: "",
      billingType: "",
      useday: 0,
      useMethod: ""
    };
    this.isBY_PACKAGE.ServiceType = e.target.value;
    this.servicedata.service_valid_type = e.target.value;
    this.serviceform.setFieldsValue({
      UseMethod: "",
      BillingType: ""
    });

    if (e.target.value == "BY_PERPETUAL") {
      this.serviceform.setFieldsValue({
        UseMethod: "PRIVATIZATION_DEPLOYMENT",
        BillingType: "BY_EQUIPMENT"
      });
    }
    const ServiceType = e.target.value;
    switch (ServiceType) {
      case "BY_CONTRACT":
        this.timepickershow = true;
        this.validityshow = false;
        this.UseMethodRadio = false;
        break;
      case "BY_ACTIVATE":
        this.timepickershow = false;
        this.validityshow = true;
        this.UseMethodRadio = false;
        break;
      case "BY_PERPETUAL":
        this.timepickershow = false;
        this.validityshow = false;
        this.serviceform.setFieldsValue({
          UseMethod: "PRIVATIZATION_DEPLOYMENT"
        });
        this.UseMethodRadio = true;
        break;
    }
  }
  // 合同日期
  pickerChange(date: any) {
    console.log(date);
    const day =
      (new Date(date[1]).getTime() - new Date(date[0]).getTime()) /
      1000 /
      60 /
      60 /
      24;
    this.isBY_PACKAGE.useday = day;
    this.servicedata.price = day;
  }
  // 选择服务使用天数
  datechange(e: any) {
    console.log(e.target.value);
    const d = e.target.value / 60 / 60 / 24;
    this.isBY_PACKAGE.useday = d;
    this.servicedata.active_days = d;
    this.servicedata.price = d;
  }
  // 选择计费方式
  BillingTypechange(e: any) {
    this.isBY_PACKAGE.billingType = e.target.value;
    this.billingscheme.billingType = e.target.value;
    this.servicedata.billing_method = e.target.value;
  }
  // 保存服务
  handleservice(e: any) {
    e.preventDefault();
    this.serviceform.validateFields((err: any, values: any) => {
      if (err) return;
      console.log("33values", values);
      let {
        servicename,
        UseMethod,
        BillingType,
        residue_degree,
        accessMethods,
        ServiceType
      } = values;
      const billingscheme = {
        serviceId: servicename,
        useMethod: UseMethod,
        billingType: BillingType,
        serviceValidType: null
      };
      this.getbillingscheme(billingscheme);
    });
  }
  // 保存草稿，确认提交
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      if (this.tableData.length == 0) {
        this.$message.error("请选择服务");
        return;
      }
      console.log("values", values);
      this.creatorid = this.$store.state.user.id;
      this.creatorname = this.$store.state.user.username;
      console.log(this.creatorid, "111111", this.creatorname);
      let {
        username,
        companyname,
        servicename,
        ServiceType,
        UseMethod,
        BillingType,
        accessMethods,
        residue_degree
      } = values;
      const params = {
        user_id: 259, //客户id
        user_name: username, //客户名称
        creator_id: this.creatorid, //当前登录用户的id
        creator_name: this.creatorname, //当前登录用户的名字（售前或者经理）
        company_name: companyname, //公司名称
        original_price: 200, //总计原价
        actual_price: 180, //实收
        status: "1", //0.草稿、1.待确认 ; 其他值不通过
        detail: [
          {
            service_id: servicename, //服务id
            service_name: "OCR服务", //服务名称
            produce_number: 123, //产品型号
            access_method: UseMethod, //接入方式: API , SDK , APK , PRIVATIZATION_DEPLOYMENT ; 见锐浩文档新增账单说明
            billing_method: BillingType, // 计费方式：BY_TIME， BY_NUMBER，BY_PACKAGE，BY_EQUIPMENT  ; 见锐浩文档新增账单说明
            access_type: "正式接入", //接入类型
            buy_count: residue_degree, //购买数量
            price: 180 //服务价格
          }
        ]
      };
      this.createOrder(params);
    });
  }
  createdservice() {
    this.creatorid = this.$store.state.user.id;
    this.creatorname = this.$store.state.user.username;
    const data = {
      user_id: "23", //客户id
      user_name: "123", //客户名称
      creator_id: this.creatorid, //当前登录用户的id
      creator_name: this.creatorname, //当前登录用户的名字（售前或者经理）
      company_name: "有1间公司", //公司名称
      original_price: 200, //总计原价
      actual_price: 180, //实收
      status: "0", //0.草稿、1.待确认 ; 其他值不通过
      detail: [
        {
          service_id: 0, //服务id
          service_name: "OCR服务", //服务名称
          produce_number: 123, //产品型号
          access_method: "API", //接入方式: API , SDK , APK , PRIVATIZATION_DEPLOYMENT ; 见锐浩文档新增账单说明
          billing_method: "BY_TIME", // 计费方式：BY_TIME， BY_NUMBER，BY_PACKAGE，BY_EQUIPMENT  ; 见锐浩文档新增账单说明
          access_type: "正式接入", //接入类型
          service_valid_type: "BY_CONTRACT", // 获取服务有效计算类型; 所有的值： BY_CONTRACT，BY_ACTIVATE，BY_PERPETUAL
          service_valid_start_at: 1614761818134, //如果是按合同有效期计算 ， 需要传这个字段，开始日期的时间戳
          service_valid_end_at: 1614761818134, //如果是按合同有效期计算 ， 需要传这个字段，结束日期的时间戳
          buy_count: 10, //购买数量
          price: 180 //服务价格
        },
        {
          service_id: 2,
          service_name: "书法服务",
          produce_number: 222333,
          access_method: "API",
          billing_method: "BY_TIME",
          access_type: "正式接入",
          service_valid_type: "BY_ACTIVATE", // 获取服务有效计算类型; 所有的值： BY_CONTRACT，BY_ACTIVATE，BY_PERPETUAL
          active_days: 7, //按用户激活时间计算 ， 激活天数
          buy_count: 20,
          price: 180
        }
      ]
    };
    this.createOrder(data);
  }
  // 编辑服务
  editthis(recode: any) {
    console.log("333", recode);
    this.showserviceform = true;
    let BillingType = "";
    this.BillingTypedata.map(item => {
      if (item.type == recode.billing_method) {
        BillingType = item.id;
      }
    });
    this.serviceform.setFieldsValue({
      servicetype: "",
      servicename: recode.service_name,
      UseMethod: recode.access_method,
      BillingType: BillingType,
      residue_degree: recode.buy_count,
      accessMethods: "试用（推荐POC阶段试用）"
    });
    this.price = recode.price;
    this.billingscheme.serviceId = recode.service_id;
    this.billingscheme.useMethod = recode.access_method;
    this.billingscheme.billingType = BillingType;
    this.billingscheme.serviceValidType = recode.service_valid_type;
  }
  // 删除服务
  deletethis(id: any) {
    console.log(id);
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
