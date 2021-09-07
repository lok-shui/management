<template>
  <div class="form-contain">
    <a-form :form="form" @submit="handleSubmit" class="formStyle">
      <a-form-item class="modules">服务信息:</a-form-item>
      <div class="flexLine">
        <a-form-item label="一级分类" class="item1">
          <a-select
            @change="firstSelect"
            showSearch
            placeholder="请选择一级分类"
            v-decorator="[
              'level1',
              { rules: [{ required: true, message: '请选择一级行业分类' }] }
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
        <a-form-item label="二级分类" class="item1">
          <a-select
            showSearch
            @change="secondClassify"
            placeholder="请选择二级分类"
            v-decorator="[
              'serviceGroup',
              { rules: [{ required: true, message: '请选择二级行业分类' }] }
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
      </div>

      <a-form-item label="服务名称" class="item1">
        <a-select
          @change="firstSelect"
          showSearch
          placeholder="请输入服务名"
          v-decorator="['serviceName']"
        >
          <a-select-option
            v-for="item in nameList"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item class="modules">价格设置:</a-form-item>

      <a-form-item label="服务有效期计算">
        <a-radio-group v-decorator="['serviceValidType']">
          <a-radio
            @change="changeTime(item)"
            v-for="(item, index) in serviceExpire"
            :key="index"
            :value="item.type"
            >{{ item.type }}</a-radio
          >
        </a-radio-group>
        <div class="flex" v-if="showDay">
          <div
            v-for="(item, index) in dayList"
            :key="index"
            :class="dayList[index] == dayVal ? 'green' : 'dayItem'"
            @click="changeDay(item, index)"
          >
            {{ item }}
          </div>
        </div>
      </a-form-item>

      <a-form-item label="交付方式">
        <a-radio-group v-decorator="['useMethod']">
          <a-radio
            @change="changeMethod(item)"
            v-for="(item, index) in payMethod"
            :key="index"
            :value="item.id"
            :disabled="
              (serviceValidType == 'BY_CONTRACT' ||
                serviceValidType == 'BY_ACTIVATE') &&
              item.id == 'PRIVATIZATION_DEPLOYMENT'
                ? true
                : serviceValidType == 'BY_PERPETUAL' &&
                  item.id !== 'PRIVATIZATION_DEPLOYMENT'
                ? true
                : false
            "
            >{{ item.method }}</a-radio
          >
        </a-radio-group>
      </a-form-item>

      <a-form-item label="计费方式">
        <a-table
          :columns="priceColumns"
          :data-source="priceData"
          bordered
          rowKey="index"
          :pagination="false"
          class="tableStyle"
        >
          <template slot="billingType" slot-scope="billingType, row, index">
            <div>
              <a-select
                @change="changeBilling($event, index, 'billingType')"
                v-if="row.editable"
                v-model="priceData[index].billingType"
                showSearch
                placeholder="请选择计费方式"
                class="tableSelect"
              >
                <a-select-option
                  v-for="item in billingTypeArr"
                  :key="item.id"
                  :value="item.type"
                  :disabled="
                    serviceValidType == 'BY_PERPETUAL' &&
                    item.id !== 'BY_EQUIPMENT'
                      ? true
                      : servicemother == 'APK' && item.id !== 'BY_EQUIPMENT'
                      ? true
                      : servicemother == 'SDK' && item.id == 'BY_PACKAGE'
                      ? true
                      : false
                  "
                >
                  {{ item.type }}
                </a-select-option>
              </a-select>
              <span v-else>{{ billingType }}</span>
            </div>
          </template>

          <template slot="account" slot-scope="account, row, index">
            <div>
              <a-select
                :class="accountClass"
                v-if="row.editable"
                v-model="priceData[index].account"
                showSearch
                placeholder="请选择数量"
                @change="changeAccount($event, index, 'account')"
              >
                <a-select-option
                  v-for="item in accountObj"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
              <span v-else>{{ account }}</span>
            </div>
          </template>

          <template slot="price" slot-scope="price, row, index">
            <div>
              <a-input
                v-if="row.editable"
                :value="price"
                :placeholder="'请输入定价'"
                @change="changePrice($event, index, 'price')"
              />
              <span v-else>{{ price }}</span>
            </div>
          </template>

          <template slot="expire" slot-scope="expire, row, index">
            <div>
              <a-select
                v-if="row.editable"
                v-model="priceData[index].expire"
                showSearch
                placeholder="请选择有效期"
                @change="changeExpire($event, index, 'expire')"
              >
                <a-select-option
                  v-for="item in expireObj"
                  :key="item"
                  :value="item"
                >
                  {{ item }}
                </a-select-option>
              </a-select>
              <span v-else>{{ expire }}</span>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="savePrice(index, false)" class="editRow">保存</a>
              <a @click="cancelPrice(index, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="editPriceKey !== ''"
                @click="editPrice(index, true)"
                class="editRow"
                >编辑
              </a>
              <a-popconfirm title="确认删除？" @confirm="delPrice(index)">
                <a :disabled="editPriceKey !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-form-item>

      <a-form-item>
        <div class="lineSave">
          <a-button class="save" @click="addPrice">增加</a-button>
        </div>
      </a-form-item>

      <a-form-item label="服务说明">
        <a-input
          placeholder="请输入服务说明，200字内"
          v-model="inputDesc"
        ></a-input>
        <a-button class="marginLeft" @click="addServiceDesc"> 增加 </a-button>
      </a-form-item>

      <a-form-item label="服务说明">
        <a-table
          :columns="serviceColumns"
          :data-source="serviceData"
          bordered
          rowKey="index"
          :pagination="false"
        >
          <template
            v-for="col in ['content']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="e => serviceHandleChange(e.target.value, index, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="saveService(index)" class="editRow">保存</a>
              <a @click="cancelService(index, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="editServiceKey !== ''"
                @click="editService(index, true)"
                class="editRow"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="delService(index)">
                <a :disabled="editServiceKey !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-form-item>

      <a-form-item class="btn-contain" :wrapper-col="{ span: 18, offset: 6 }">
        <a-button type="primary" html-type="submit" class="confirmBtn">
          {{ confirmString }}
        </a-button>
        <a-button @click="routeBack">取消</a-button>
      </a-form-item>
    </a-form>
    <a-modal :visible="okshow" @ok="handleokshow" @cancel="okshowCancel">
      <div>切换有效期计算或者交付方式将会清空原有计费方式，确定切换吗？</div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ManageService from "@/service/manage";
import AuthorityService from "@/service/authority";
import ClientService from "@/service/client";
import userOrder from "@/service/order";
import { cloneDeep } from "lodash";
const userorder = userOrder.getOrder();
const manageService = ManageService.getService();
const clientService = ClientService.getService();
const authorityService = AuthorityService.getService();

interface serviceInterface {
  content: string;
  index?: number;
  editable?: boolean;
}
interface priceInterface {
  billingType: string;
  account: any;
  price: string;
  expire: any;
  index?: number;
  editable?: boolean;
}
const priceItem = {
  billingType: "",
  account: null,
  price: "",
  expire: null
};
const serviceItem = {
  content: ""
};

@Component
export default class PriceNew extends Vue {
  form: any = {};
  // 一级分类
  firstClass: any[] = [];
  firstVisible: boolean = false;
  // 二级分类
  serviceType: any[] = [];
  serviceName: any;
  nameList: any[] = [];
  // 服务有效期计算
  serviceExpire: any[] = [];
  // '交付方式'
  payMethod: any[] = [];
  // 计费方式-table
  priceColumns: any[] = [
    {
      title: "计费方式",
      dataIndex: "billingType",
      scopedSlots: { customRender: "billingType" }
    },
    {
      title: "数量",
      dataIndex: "account",
      scopedSlots: { customRender: "account" }
    },
    {
      title: "定价/元",
      dataIndex: "price",
      scopedSlots: { customRender: "price" }
    },
    {
      title: "有效期",
      dataIndex: "expire",
      scopedSlots: { customRender: "expire" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  priceData: priceInterface[] = [];
  priceItemKey: number = 0;
  cachePrice: priceInterface[] = []; // 缓存数据
  editPriceKey: string = "";
  accountClass: string = "showAccount";

  // 计费方式 - select
  billingTypeArr: Array<any> = [];
  accountObj: any[] = [];
  expireObj: any = [];

  // 服务说明 ↓↓↓
  serviceItemKey: number = 0;
  serviceColumns: any[] = [
    {
      title: "服务说明",
      dataIndex: "content",
      scopedSlots: { customRender: "content" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  serviceData: serviceInterface[] = [];
  cacheService: serviceInterface[] = [];
  inputDesc: string = "";
  editServiceKey: string = "";

  dayList: any[] = ["7天", "15天", "30天", "90天", "180天", "365天"];
  showDay: boolean = false;
  activeCount: any;
  dayVal: string = "";

  schemeObj: any = {
    serviceId: this.$route.query.id
  };
  serviceId: any;
  confirmString: string = "";
  serviceValidTypeVal: string = "";
  serviceValidType: any = "";
  servicemother: any = "";
  okshow: boolean = false;
  ischange: number = 0;
  created() {
    this.form = this.$form.createForm(this, {});
    this.serviceName = this.$route.query.name;
    this.serviceId = this.$route.query.id;
    this.firstClassSelect();
    this.getBillingType();
    this.getUseMethod();
    this.getServiceType();
    setTimeout(() => {
      this.getbillingscheme(this.schemeObj);
    }, 1000);
  }

  mounted() {
    if (this.$route.query.haveBills == "true") {
      this.confirmString = "修改价格";
    } else {
      this.confirmString = "确认发布";
    }

    this.form.setFieldsValue({
      serviceName: this.serviceName
    });
  }
  // @Watch("serviceValidType", { deep: true })
  // typechange() {
  //   this.form.setFieldsValue({
  //     useMethod: "",
  //   });
  //   this.priceData = [];
  // }
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      // price参数由type转为id
      const priceArr: any = cloneDeep(this.priceData);

      priceArr.forEach((item: any, key: number) => {
        const uLength = this.billingTypeArr[key].unit.length;
        let test1 = /^[0-9]+[\s\S]*$/;
        if (test1.test(item.account)) {
          const s = item.account.substring(0, item.account.length - uLength);
          item.account = s;
        }
        for (let a in this.billingTypeArr) {
          if (item.billingType == this.billingTypeArr[a]["type"]) {
            item.billingType = this.billingTypeArr[a]["id"];
          }
        }
      });
      // 多个服务说明，用逗号隔开
      const serviceArr: any = [];
      this.serviceData.forEach((item: any, key: number) => {
        serviceArr.push(item.content);
      });
      const serdesc = serviceArr.join(",");

      const params: any = {
        level1: values.level1,
        serviceGroup: values.serviceGroup,
        serviceDescription: serdesc,
        useMethod: values.useMethod,
        serviceValidType: this.serviceValidTypeVal,
        prices: priceArr,
        activeCount: this.activeCount
      };

      for (let a in params) {
        if (
          params[a] == undefined ||
          params[a] == "" ||
          params[a].length == 0
        ) {
          delete params[a];
        }
      }
      const data = {
        bills: [params],
        id: this.serviceId
      };
      console.log("参数", data);
      this.editPort(data);
    });
  }
  // 编辑接口
  async editPort(params: any) {
    const response = await manageService.updateService(params);
    this.confirmString = "修改价格";
    this.$message.success("发布成功！");
    const data = {
      serviceId: response.id
    };
    this.getbillingscheme(data);
  }

  // 价格页面(回显) - 接口
  async getbillingscheme(params: any) {
    const response = await userorder.getbillingscheme(params);
    this.priceData = [];
    this.cachePrice = [];
    this.serviceData = [];
    this.cacheService = [];

    if (response.length !== 0) {
      const {
        level1,
        serviceGroup,
        serviceName,
        useMethod,
        serviceValidType,
        prices,
        activeCount,
        serviceDescription
      } = response[0];
      const param = {
        type: "二级能力",
        value: level1
      };
      this.concatSecond(param);
      const allData = {
        serviceGroup: serviceGroup
      };
      this.getServiceManagerList(allData);

      if (activeCount) {
        this.activeCount = activeCount;
        this.showDay = true;
        this.dayList.filter((item: string, key: number) => {
          if (item == `${activeCount}天`) {
            this.dayVal = this.dayList[key];
          }
        });
      }

      this.serviceValidTypeVal = serviceValidType;
      this.serviceExpire.forEach((s: any, key: number) => {
        if (s.id == this.serviceValidTypeVal) {
          this.form.setFieldsValue({
            serviceValidType: s.type
          });
          this.serviceValidType = s.type;
        }
      });

      this.form.setFieldsValue({
        level1,
        serviceGroup,
        serviceName,
        useMethod
      });
      this.servicemother = useMethod;
      console.log("13213", this.servicemother);

      // 价格
      prices.forEach((item: priceInterface, key: number) => {
        let bill: any = "";
        for (let a in this.billingTypeArr) {
          if (item.billingType == this.billingTypeArr[a]["id"]) {
            bill = this.billingTypeArr[a]["type"];
          }
        }
        let test1 = /^[0-9]+[\s\S]*$/;
        if (test1.test(item.account)) {
          item.account = item.account + this.billingTypeArr[key].unit;
        }

        this.priceData.push({
          billingType: bill,
          account: item.account,
          price: item.price,
          expire: item.expire,
          index: this.priceItemKey++
        });
      });

      this.cachePrice = cloneDeep(this.priceData);
      // 服务说明
      const sdesc = serviceDescription.split(",");
      sdesc.forEach((item: serviceInterface) => {
        const s: any = {
          content: item
        };
        this.serviceData.push({
          content: s.content,
          index: this.serviceItemKey++
        });
      });
      this.cacheService = sdesc;
    }
  }

  // 一级分类 - 接口
  async firstClassSelect() {
    const response = await authorityService.addNewService({
      type: "一级能力"
    });
    this.firstClass = response;
  }

  // 一级分类: change
  firstSelect(value: any) {
    if (this.form.getFieldValue("serviceGroup") !== undefined) {
      this.form.setFieldsValue({
        serviceGroup: undefined
      });
    }
    const param = {
      type: "二级能力",
      value: value
    };
    this.concatSecond(param);
  }

  // 二级联动
  async concatSecond(param: any) {
    const response = await authorityService.getConfigList(param);
    this.serviceType = response;
  }
  secondClassify(val: any) {
    this.nameList = [];
    const data = {
      serviceGroup: val
    };
    this.getServiceManagerList(data);
  }
  async getServiceManagerList(params: any) {
    const response = await manageService.getServiceManagerList(params);
    this.nameList = cloneDeep(response);
  }

  // 计费方式 - 接口
  async getBillingType() {
    const response = await clientService.getBillingType();
    this.billingTypeArr = response;
  }

  // 计费方式: change
  changeBilling(value: any, index: number, columnVal: string) {
    const newData = [...this.priceData];
    const target: any = newData[index];
    target[columnVal] = value;
    this.priceData = newData;

    this.accountObj = [];
    this.expireObj = [];
    let chigi: any = [];

    let unit: any = "";
    this.billingTypeArr.forEach((item: any, key: number) => {
      if (value == item.type) {
        unit = this.billingTypeArr[key].unit;
        if (item.number !== "") {
          const a = item.number;
          chigi = a.split(",");
        }
        if (item.expire !== "") {
          const e = item.expire;
          this.expireObj = e.split(",");
        }
      }
    });
    if (chigi.length !== 0) {
      this.accountClass = "showAccount";
      chigi.forEach((c: any, ci: number) => {
        let test1 = /^[0-9]+[\s\S]*$/;
        if (test1.test(c)) {
          c = c + unit;
        } else {
          console.log("开头不是数字");
        }
        this.accountObj.push(c);
      });
    } else {
      this.accountClass = "hiddenAccount";
    }
  }

  changePrice(e: any, index: number, columnVal: string) {
    const newData = [...this.priceData];
    const target: any = newData[index];
    target[columnVal] = e.target.value;
    this.priceData = newData;
  }

  changeAccount(value: any, index: number, columnVal: string) {
    const newData = [...this.priceData];
    const target: any = newData[index];
    target[columnVal] = value;
    this.priceData = newData;
  }

  changeExpire(value: any, index: number, columnVal: string) {
    const newData = [...this.priceData];
    const target: any = newData[index];
    target[columnVal] = value;
    this.priceData = newData;
  }

  // 交付方式 - 接口
  async getUseMethod() {
    const response = await clientService.getUseMethod();
    this.payMethod = response;
  }

  // 服务有效期计算 - 接口
  async getServiceType() {
    const response = await clientService.getServiceType();
    this.serviceExpire = cloneDeep(response);
  }
  // 服务有效期计算： change
  changeTime(item: any) {
    console.log("123", item);
    this.ischange = 0;
    if (this.priceData.length >= 1) {
      this.okshow = true;
      this.form.setFieldsValue({
        serviceValidType: this.serviceValidType
      });
    } else {
      this.serviceValidType = item.id;
      this.serviceValidTypeVal = item.id;
      if (item.type == "按用户激活时间计算（不推荐使用）") {
        this.showDay = true;
      } else {
        this.showDay = false;
        this.activeCount = undefined;
        this.dayVal = "";
      }
      this.form.setFieldsValue({
        useMethod: ""
      });
    }
  }

  changeDay(item: any, index: number) {
    this.dayVal = item;
    this.activeCount = Number(item.substring(0, item.length - 1));
  }

  // '计费方式' - 增加
  addPrice() {
    this.priceData.push({ ...priceItem, index: this.priceItemKey++ });
    this.cachePrice = cloneDeep(this.priceData);
    this.editPrice(this.priceData.length - 1, true);
  }
  editPrice(index: number, type: boolean) {
    const newData = [...this.priceData];
    const currentLine = newData[index];
    currentLine.editable = type;
    this.priceData = newData;
  }
  delPrice(index: number) {
    const newData = [...this.priceData];
    newData.splice(index, 1);
    this.priceData = newData;
    this.cachePrice = cloneDeep(this.priceData);
  }
  savePrice(index: number) {
    const newData = [...this.priceData];
    const newCacheData = [...this.cachePrice];
    const target = newData[index];

    const targetCache = newCacheData[index];
    delete target.editable;
    this.priceData = newData;
    Object.assign(targetCache, target);
    this.cachePrice = newCacheData;
    this.editPriceKey = "";
  }
  cancelPrice(index: number, row: any) {
    const newData = [...this.priceData];
    const target = newData[index];
    delete target.editable;
    this.priceData = newData;
    this.priceData[index] = cloneDeep(this.cachePrice[index]);
    this.editPriceKey = "";
  }

  // 服务说明
  addServiceDesc() {
    if (this.inputDesc == "") {
      this.$message.error("请输入服务说明");
      return;
    }
    this.serviceData.push({
      ...serviceItem,
      index: this.serviceItemKey++,
      content: this.inputDesc
    });
    this.cacheService = cloneDeep(this.serviceData);
    this.editService(this.serviceData.length - 1, true);
    this.inputDesc = "";
  }
  editService(index: number, type: boolean) {
    const newData = [...this.serviceData];
    const currentLine = newData[index];
    currentLine.editable = type;
    this.serviceData = newData;
  }
  delService(index: number) {
    const newData = [...this.serviceData];
    newData.splice(index, 1);
    this.serviceData = newData;
    this.cacheService = cloneDeep(this.serviceData);
  }
  saveService(index: number) {
    const newData = [...this.serviceData];
    const currentLine = newData[index];
    delete currentLine.editable;
    this.serviceData = newData;
    this.cacheService = cloneDeep(this.serviceData);
    this.editServiceKey = "";
  }
  cancelService(index: number, row: any) {
    const newData = [...this.serviceData];
    const currentLine = newData[index];
    delete currentLine.editable;
    this.serviceData = newData;
    this.editServiceKey = "";
    if (row.content == "") {
      this.serviceData.splice(index);
    } else {
      this.serviceData = cloneDeep(this.cacheService);
    }
  }

  serviceHandleChange(value: string, key: number, column: "content") {
    const newData = [...this.serviceData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.serviceData = newData;
    }
  }

  routeBack() {
    this.$router.go(-1);
  }
  changeMethod(item: any) {
    this.ischange = 1;
    if (this.priceData.length >= 1) {
      this.okshow = true;
      this.form.setFieldsValue({
        // useMethod: this.servicemother,
        useMethod: this.servicemother
      });
      console.log(33, this.servicemother);
    } else {
      this.servicemother = item.id;
    }
  }
  handleokshow(e: any) {
    this.priceData = [];
    this.$message.success("计费方式已清空");
    this.okshow = false;
    this.form.setFieldsValue({
      serviceValidType: "",
      useMethod: ""
    });
  }
  okshowCancel(e: any) {
    this.okshow = false;
    if (this.ischange == 0) {
      this.form.setFieldsValue({
        serviceValidType: this.serviceValidType,
        useMethod: ""
      });
    }
    if (this.ischange == 1) {
      this.form.setFieldsValue({
        useMethod: this.servicemother
      });
    }

    console.log(33, this.servicemother);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.flex {
  display: flex;
}
.dayItem {
  border-color: #d9d9d9;
  border-style: solid;
  border-width: 1px 1px 1px 0;
  width: 60px;
  height: 32px;
  text-align: center;
  line-height: 32px;
  padding: 0 8px;
  cursor: pointer;
  &:first-child {
    border-radius: 2px 0 0 2px;
    border-left: 1px solid #d9d9d9;
  }
  &:last-child {
    border-radius: 0 2px 2px 0;
  }
}
.green {
  @extend .dayItem;
  border: 1px solid #31c37c;
}
.form-contain .formStyle .ant-select {
  width: 180px;
}
.marginLeft {
  margin-left: 15px;
}
.hiddenAccount {
  visibility: hidden;
}
.showAccount {
  visibility: visible;
}
</style>
