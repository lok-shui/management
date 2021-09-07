<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="token"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-if="isBoolean"
      >
      </a-form-item>

      <a-form-item
        v-if="!isBoolean"
        label="用户名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          showSearch
          v-decorator="[
            'userId',
            { rules: [{ required: true, message: '请输入新增权限的用户名' }] }
          ]"
          placeholder="请输入新增权限的用户名"
        >
          <a-select-option
            v-for="item in usernameList"
            :key="item.userId"
            :value="item.username"
          >
            {{ item.username }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="接口名称"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          showSearch
          @change="changeservice"
          v-decorator="[
            'resource_ids',
            { rules: [{ required: true, message: '请选择服务' }] }
          ]"
          placeholder="请选择服务"
          optionFilterProp="name"
          :filterOption="filterOption"
          @select="selectName"
          :disabled="isBoolean"
          :value="selectservice"
        >
          <a-select-option
            v-for="item in interfaceNameList"
            :key="item.serviceId"
            :value="
              item.serviceId + ',' + item.billingOnTime + ',' + item.serviceName
            "
          >
            {{ item.serviceName }}
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
              rules: [{ required: true, message: '请选择服务有效期计算类型' }]
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
      <a-form-item
        label="接入方式"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-radio-group
          @change="methodchange"
          v-decorator="[
            'UseMethod',
            {
              rules: [{ required: true, message: '请选择接入方式' }]
            }
          ]"
        >
          <a-radio
            :value="item.id"
            v-for="(item, index) in UseMethoddata"
            :key="index"
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
          >
            {{ item.method }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="计费方式"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-radio-group
          @change="BillingTypechange"
          v-decorator="[
            'BillingType',
            {
              rules: [{ required: true, message: '请选择计费方式' }]
            }
          ]"
        >
          <a-radio
            :value="item.id"
            v-for="(item, index) in BillingTypedata"
            :key="index"
            :disabled="
              billingOnTime == 'false' && item.id == 'BY_TIME'
                ? true
                : isBY_PACKAGE.ServiceType == '' && isBY_PACKAGE.useMethod == ''
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
                : isBY_PACKAGE.useMethod == 'SDK' && item.id == 'BY_PACKAGE'
                ? true
                : (isBY_PACKAGE.useMethod == 'APK' ||
                    isBY_PACKAGE.useMethod == 'PRIVATIZATION_DEPLOYMENT') &&
                  item.id !== 'BY_EQUIPMENT'
                ? true
                : false
            "
          >
            {{ item.type + "/" + item.unit }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="接入类型"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-radio-group v-decorator="['radiotype']">
          <a-radio value="正式接入">正式接入</a-radio>
          <a-radio value="试用"> 试用</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="购买数量"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input-number
          :disabled="degreeishow"
          v-decorator="[
            'residue_degree',
            {
              rules: [{ required: true, message: '请填入购买数量' }]
            }
          ]"
          placeholder="请输入购买次数/时长/授权设备数"
          style="width: 100%"
        ></a-input-number>
      </a-form-item>

      <a-form-item>
        <div
          v-if="isBoolean"
          style="color: red; width: 550px; margin: 0 auto; font-size: 15px"
        ></div>
      </a-form-item>
      <a-form-item class="btn-contain" :wrapper-col="{ span: 18, offset: 6 }">
        <a-button type="primary" html-type="submit"> 确定 </a-button>
        <a-button @click="routeBack">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ClientService from "@/service/client";
import ManageService from "@/service/manage";
import moment from "moment";
const clientService = ClientService.getService();
const manageService = ManageService.getService();
interface purchaseinfo {
  userId: any;
  serviceId: any;
  useMethod: any;
  billingType: any;
  account?: any;
  expirationTime?: any;
  serviceValidType?: any;
  activeCount?: any;
  accessType?: any;
  serviceValidStartTime?: any;
  serviceValidEndTime?: any;
}
@Component
export default class AuthorizationNew extends Vue {
  form: any = {};
  editType: string = "new";
  clientId: any = "";
  detailData: any;
  isBoolean: Boolean = false;
  interfaceNameList: any[] = [];
  usernameList: any[] = [];
  token: string = "";
  UseMethoddata: Array<any> = [];
  BillingTypedata: Array<any> = [];
  ServiceTypedata: Array<any> = [];
  timepickershow: boolean = false;
  validityshow: boolean = false;
  UseMethodRadio: boolean = false;
  userId: string = "";
  isBY_PACKAGE: any = {
    ServiceType: "",
    billingType: "",
    useday: 0,
    useMethod: ""
  };
  useMethod: string = "";
  degreeishow: boolean = false;
  billingOnTime: boolean = true;
  selectservice: string = "";
  serviceId: string = "";
  created() {
    this.getUseMethod();
    this.getBillingType();
    this.getServiceType();
    this.form = this.$form.createForm(this, {});
    const id = this.$route.query.clientId;
    const purchaseinfoid = this.$route.params.id;
    if (id) {
      this.editType = "recharge";
      this.clientId = id;
      this.getDetail(id as string);
      this.isBoolean = true;
    } else {
      this.getUsernameList();
      this.getInterfaceNameList();
    }
    if (purchaseinfoid) {
      this.purchaseinfo(purchaseinfoid);
    }
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
      this.form.setFieldsValue({
        residue_degree: this.isBY_PACKAGE.useday
      });
      this.degreeishow = true;
    } else {
      this.degreeishow = false;
      this.form.setFieldsValue({
        residue_degree: ""
      });
    }
  }
  selectName() {
    return;
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
  async getUsernameList() {
    const response = await clientService.getUsernameList();
    this.usernameList = response;
  }

  async getInterfaceNameList() {
    const response = await manageService.getAuthorizationList();
    this.interfaceNameList = response;
    console.log(33333, this.interfaceNameList);
    if (this.$route.params.id) {
      this.purchaseinfo(this.$route.params.id);
    }
    // let index = 0;
    // response.forEach((item: any) => {
    //   this.interfaceNameList.push({ id: index++, name: item });
    // });
  }

  async getDetail(id: string) {
    const response = await clientService.getPurchaseInfo(id);
    console.log("getDetail", response);
    this.userId = response.userId;
    console.log("this.userId", this.userId);

    const { accessToken, resourceIds } = response;
    this.detailData = response;
    this.token = accessToken;
    this.form.setFieldsValue({
      resource_ids: resourceIds.split(",")
    });
  }

  filterOption(input: string, option: any) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      // console.log("values", values);
      if (err) return;
      const {
        userId,
        access_token_validity,
        residue_degree,
        resource_ids,
        ServiceType,
        timepicker,
        UseMethod,
        BillingType,
        radiotype
      } = values;
      this.usernameList.map(item => {
        if (userId == item.username) {
          this.userId = item.userId;
        }
      });

      console.log("values", values);
      console.log("timepicker", timepicker);
      let starttime = 0;
      let endttime = 0;
      if (timepicker !== undefined) {
        starttime = new Date(timepicker[0]).getTime();
        endttime = new Date(timepicker[1]).getTime();
      }
      console.log("time", starttime, endttime);
      // let arr = resource_ids.split(",");
      const purchase = {
        userId: this.userId,
        serviceId: this.serviceId,
        useMethod: UseMethod,
        billingType: BillingType,
        account: residue_degree,
        serviceValidType: ServiceType,
        accessType: radiotype,
        activeCount: access_token_validity / 60 / 60 / 24,
        serviceValidStartTime: starttime == 0 ? "" : starttime,
        serviceValidEndTime: endttime == 0 ? "" : endttime
      };

      const addpurchase = {
        ...purchase,
        userId: this.userId
      };
      this.addpurchaseinfo(addpurchase);
    });
  }
  routeBack() {
    this.$router.go(-1);
  }
  // 选择服务使用天数
  datechange(e: any) {
    console.log(e.target.value);
    const d = e.target.value / 60 / 60 / 24;
    this.isBY_PACKAGE.useday = d;
  }
  // 选择计费方式
  BillingTypechange(e: any) {
    this.isBY_PACKAGE.billingType = e.target.value;
  }
  // 选择接入方式
  methodchange(e: any) {
    console.log(e.target.value);
    this.isBY_PACKAGE.useMethod = e.target.value;
    this.form.setFieldsValue({
      BillingType: ""
    });
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
    this.form.setFieldsValue({
      UseMethod: "",
      BillingType: ""
    });

    if (e.target.value == "BY_PERPETUAL") {
      this.form.setFieldsValue({
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
        this.form.setFieldsValue({
          UseMethod: "PRIVATIZATION_DEPLOYMENT"
        });
        this.UseMethodRadio = true;
        break;
    }
  }
  // 新增账单
  async addpurchaseinfo(params: purchaseinfo) {
    console.log("params", params);
    const response = await clientService.addpurchaseinfo(params);
    try {
      if (response) {
        console.log(121212);
        this.$message.success("新增账单成功");
        this.routeBack();
      }
    } catch (error) {
      return error;
    }
  }
  // 合同日期
  pickerChange(date: any) {
    console.log(date);
    this.isBY_PACKAGE.useday =
      (new Date(date[1]).getTime() - new Date(date[0]).getTime()) /
      1000 /
      60 /
      60 /
      24;
  }
  // 获取详情
  async purchaseinfo(id: any) {
    const response = await clientService.getPurchase(id);
    if (response) {
      console.log(222, response.serviceName);
      this.form.setFieldsValue({
        userId: response.username,
        resource_ids: response.serviceName
      });
      console.log(666, this.interfaceNameList);
      this.interfaceNameList.map(item => {
        if (response.serviceName == item.serviceName) {
          this.serviceId = item.serviceId;
          console.log(11, this.serviceId);
        }
      });
      console.log(" this.serviceId", this.serviceId);
    }
  }
  changeservice(e: any) {
    console.log("e", e);
    let arr = e.split(",");
    this.billingOnTime = arr[1];
    this.selectservice = arr[2];
    this.serviceId = arr[0];
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
