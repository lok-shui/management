<template>
  <div class="HomeList">
    <div class="status">
      <b>状态：</b>
      <a-radio-group
        name="radioGroup"
        :default-value="0"
        v-if="activeKey == tabKey[0]"
        @change="changeBannerRadio"
      >
        <a-radio
          :value="index"
          v-for="(item, index) in bannerStatus"
          :key="index"
        >
          {{ item }}
        </a-radio>
      </a-radio-group>
      <a-radio-group
        name="radioGroup"
        :default-value="0"
        v-if="activeKey == tabKey[1]"
        @change="changeServiceRadio"
      >
        <a-radio
          :value="index"
          v-for="(item, index) in serviceStatus"
          :key="index"
        >
          {{ item }}
        </a-radio>
      </a-radio-group>
      <a-radio-group
        name="radioGroup"
        :default-value="0"
        v-if="activeKey == tabKey[2]"
        @change="changeIndustryRadio"
      >
        <a-radio
          :value="index"
          v-for="(item, index) in industryStatus"
          :key="index"
        >
          {{ item }}
        </a-radio>
      </a-radio-group>
    </div>

    <a-tabs v-model="activeKey" class="tabStyle" @change="changeTab">
      <a-tab-pane :key="tabKey[0]">
        <span slot="tab" class="tabCaption"><b>BANNER图管理</b></span>
        <div class="tabBox">
          <div class="addBanner">
            <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />
          </div>
          <a-table
            :columns="bannerColumns"
            :dataSource="bannerData"
            bordered
            rowKey="id"
            :pagination="false"
          >
            <template slot="operation" slot-scope="operation, row">
              <div class="rowOperation">
                <table-operation
                  :btnGroups="getBtnGroups(row)"
                  :rowItem="row"
                  @handleClick="handleTableOperation"
                />
                <a-popconfirm title="更改状态" @confirm="changeStatus(row)">
                  <a v-if="row.status == '停用'">启用</a>
                  <a v-if="row.status == '禁用'">启用</a>
                  <a v-if="row.status == '启用'">停用</a>
                  <a v-if="row.status == '启动'">停用</a>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane :key="tabKey[1]">
        <span slot="tab" class="tabCaption"><b>服务推荐管理</b></span>
        <div class="tabGroup">
          <div class="addBanner">
            <a-button type="primary" @click="modalNewService">
              添加推荐能力
            </a-button>
          </div>
          <a-table
            :columns="serviceColumns"
            :data-source="serviceData"
            bordered
            rowKey="index"
            :pagination="false"
          >
            <template slot="status" slot-scope="status, row">
              <a v-if="row.status == 3">禁用</a>
              <a v-if="row.status == 2">启用</a>
            </template>
            <template slot="operation" slot-scope="operation, row">
              <div class="rowOperation">
                <a-popconfirm title="确认删除？" @confirm="delServiceItem(row)">
                  <a>删除</a>
                </a-popconfirm>
                <a-popconfirm title="更改状态" @confirm="changeService(row)">
                  <a v-if="row.status == 3">启用</a>
                  <a v-if="row.status == 2">禁用</a>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane :key="tabKey[2]">
        <span slot="tab" class="tabCaption"><b>行业应用推荐管理</b></span>
        <div class="tabProperty">
          <div class="addBanner">
            <a-button type="primary" @click="addNewIndustry">
              添加行业应用
            </a-button>
          </div>
          <a-table
            :columns="industryColumns"
            :data-source="industryData"
            bordered
            rowKey="index"
            :pagination="false"
          >
            <template slot="operation" slot-scope="operation, row">
              <div class="rowOperation">
                <a-popconfirm
                  title="确认删除？"
                  @confirm="delIndustryItem(row)"
                >
                  <a>删除</a>
                </a-popconfirm>
                <a-popconfirm title="更改状态" @confirm="changeActived(row)">
                  <a v-if="row.actived == '停用'">启用</a>
                  <a v-if="row.actived == '禁用'">启用</a>
                  <a v-if="row.actived == '启用'">停用</a>
                  <a v-if="row.actived == '启动'">停用</a>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <!--推荐行业--弹窗 -->
    <a-modal
      title="请选择需要添加的行业应用"
      v-model="industryVisible"
      width="800px"
      class="modalHeight"
      :maskClosable="false"
      :closable="true"
      @ok="confirmIndustry"
    >
      <a-form :form="industryForm" class="formItem">
        <a-form-item label="行业分类">
          <a-select
            @change="industrySelect"
            showSearch
            placeholder="请选择行业分类"
            v-decorator="[
              'industryClass',
              { rules: [{ required: true, message: '请选择行业分类' }] }
            ]"
          >
            <a-select-option
              v-for="(item, index) in industryClassOption"
              :key="index"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="行业详情">
          <a-select
            showSearch
            placeholder="请选择应用详情"
            @change="chooseIndustryDetail"
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请选择应用详情' }] }
            ]"
          >
            <a-select-option
              v-for="item in industryDetailOption"
              :key="item.id"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序">
          <a-select
            showSearch
            placeholder="请选择排序"
            class="selectInput"
            @change="industryModalOrder"
            v-decorator="[
              'order',
              { rules: [{ required: true, message: '请选排序' }] }
            ]"
          >
            <a-select-option
              v-for="(item, index) in maxIndustryOrder"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!--推荐服务--弹窗 -->
    <a-modal
      title="请选择需要添加的AI能力"
      v-model="serviceVisible"
      width="800px"
      class="modalHeight"
      :maskClosable="false"
      :closable="true"
      @cancel="cancelServiceModal"
      @ok="confirmService"
    >
      <a-form :form="serviceForm" class="formItem">
        <a-form-item label="一级分类">
          <a-select
            showSearch
            placeholder="请选择一级分类"
            @change="changeFirstLevel"
            v-decorator="[
              'level1',
              { rules: [{ required: true, message: '请选择一级分类' }] }
            ]"
          >
            <a-select-option
              v-for="item in level1"
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
            @change="secondLevel"
            v-decorator="[
              'level2',
              { rules: [{ required: true, message: '请选择二级分类' }] }
            ]"
          >
            <a-select-option v-for="item in level2" :key="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="排序">
          <a-select
            showSearch
            placeholder="请选择排序"
            class="selectInput"
            @change="serviceModalOrder"
            v-decorator="[
              'order',
              { rules: [{ required: true, message: '请选排序' }] }
            ]"
          >
            <a-select-option
              v-for="(item, index) in maxServiceOrder"
              :key="index"
              :value="item"
            >
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import { cloneDeep } from "lodash";
import AuthorityService from "@/service/authority";

import ManageService from "@/service/manage";
const authorityService = AuthorityService.getService();

const manageService = ManageService.getService();
interface bannerInterface {
  theme: string;
  content: string;
  order: number;
  startTime: string;
  endTime: string;
  index?: number;
  editable?: boolean;
}

@Component({
  components: { operationBar, tableOperation }
})
export default class HomeList extends Vue {
  statusForm: any = {};

  bannerStatus: any[] = ["全部", "启用", "停用"];
  serviceStatus: any[] = ["全部", "启用", "禁用"];
  industryStatus: any[] = ["全部", "启用", "停用"];

  tabKey: any[] = [0, 1, 2];
  activeKey: number = this.tabKey[0];
  cacheTabKey: number = 1;
  value: number = 0;

  bannerColumns: any[] = [
    {
      title: "标题",
      dataIndex: "title",
      scopedSlots: { customRender: "title" }
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "排序",
      dataIndex: "order",
      scopedSlots: { customRender: "order" }
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      scopedSlots: { customRender: "startTime" }
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      scopedSlots: { customRender: "endTime" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 160,
      scopedSlots: { customRender: "operation" }
    }
  ];
  bannerData: bannerInterface[] = [];
  btnItems: any[] = [{ text: "添加BANNER图", type: "primary", event: "new" }];

  industryColumns: any[] = [
    {
      title: "行业分类",
      dataIndex: "industryClass",
      scopedSlots: { customRender: "industryClass" }
    },
    {
      title: "行业应用",
      dataIndex: "application",
      scopedSlots: { customRender: "application" }
    },
    {
      title: "状态",
      dataIndex: "actived",
      scopedSlots: { customRender: "actived" }
    },
    {
      title: "分类排序",
      dataIndex: "order",
      scopedSlots: { customRender: "order" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 160,
      scopedSlots: { customRender: "operation" }
    }
  ];
  industryData: any[] = [];
  industryVisible: boolean = false;
  industryForm: any = {};
  industryClassOption: any[] = [];
  industryDetailOption: any[] = [];
  industryDetailId: number = -1;
  maxIndustryOrder: any[] = [];
  chooseIndustyOrder: number = -1;

  serviceColumns: any[] = [
    {
      title: "能力一级分类",
      dataIndex: "level1",
      scopedSlots: { customRender: "level1" }
    },
    {
      title: "能力二级分类",
      dataIndex: "serviceGroup",
      scopedSlots: { customRender: "serviceGroup" }
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "分类排序",
      dataIndex: "order",
      scopedSlots: { customRender: "order" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 160,
      scopedSlots: { customRender: "operation" }
    }
  ];
  serviceData: any[] = [];
  serviceForm: any = {};
  serviceVisible: boolean = false;
  maxServiceOrder: any[] = [];
  serviceDetailId: number = -1;
  level1: any[] = [];
  level2: any[] = [];
  levelDetail: any[] = [];

  created() {
    this.statusForm = this.$form.createForm(this, {});
    this.industryForm = this.$form.createForm(this, {});
    this.serviceForm = this.$form.createForm(this, {});
    this.getHomeBannerList({});
    this.getHomeIndustryList({});
    this.getHomeServiceList({});
  }
  mounted() {}
  changeTab() {}

  // 'BANNER'状态筛选
  changeBannerRadio(e: any) {
    const index = e.target.value;
    const statusVal = this.bannerStatus[index];
    if (statusVal == "全部") {
      this.getHomeBannerList({});
    } else {
      const param = {
        status: statusVal
      };
      this.getHomeBannerList(param);
    }
  }
  // '服务'状态筛选
  changeServiceRadio(e: any) {
    const index = e.target.value + 1;
    if (index == 1) {
      this.getHomeServiceList({});
    } else {
      const param = {
        status: index
      };
      this.getHomeServiceList(param);
    }
  }
  // '行业'状态筛选
  changeIndustryRadio(e: any) {
    const index = e.target.value;
    const statusVal = this.industryStatus[index];
    if (statusVal == "全部") {
      this.getHomeIndustryList({});
    } else {
      const param = {
        actived: statusVal
      };
      this.getHomeIndustryList(param);
    }
  }
  // BANNER: 操作
  getBtnGroups(rowItem: any) {
    return [
      {
        type: "edit",
        text: "编辑"
      }
    ];
  }
  handleTableOperation(data: any) {
    const { operationType, id, tname, name, type } = data;
    switch (operationType) {
      case "edit":
        this.toPath("HomeBannerNew", { id });
        break;
    }
  }
  // BANNER: 列表
  async getHomeBannerList(param: any) {
    this.bannerData = [];
    const response = await manageService.getHomeBannerList(param);
    response.forEach((item: any, key: number) => {
      // item.order = key + 1;
      this.bannerData.push(item);
    });
    console.log("e", this.bannerData);
  }
  // BANNER: 状态
  changeStatus(row: any) {
    let newActive: string = "";
    if (row.status == "禁用" || row.status == "停用") {
      newActive = "启用";
    } else if (row.status == "启用" || row.status == "启动") {
      newActive = "停用";
    }
    const param = {
      id: row.id,
      status: newActive
    };
    this.updateBannerStatus(param);
  }
  // BANNER: 状态接口
  async updateBannerStatus(param: any) {
    const response = await manageService.updateBannerStatus(param);
    if (response) {
      this.getHomeBannerList({});
      this.$message.success("更改成功");
    }
  }
  // BANNER: 添加BANNER图
  handleBarClick(event: string) {
    switch (event) {
      case "new":
        this.toPath("HomeBannerNew");
        break;
      case "delete":
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

  // 行业: '列表'接口
  async getHomeIndustryList(param: any) {
    this.industryData = [];
    const response = await manageService.getHomeIndustryList(param);
    // this.industryData = cloneDeep(response);
    response.forEach((item: any, key: number) => {
      // item.order = key + 1;
      this.industryData.push(item);
    });
  }
  // 行业: 更新状态
  changeActived(row: any) {
    let newActive = "";
    if (row.actived == "禁用" || row.actived == "停用") {
      newActive = "启用";
    } else if (row.actived == "启用" || row.actived == "启动") {
      newActive = "停用";
    }
    this.updateIndustryActive(row.id, newActive);
  }
  // 行业: 更新状态的接口
  async updateIndustryActive(id: number, actived: string) {
    const response = await manageService.updateIndustryActive(id, actived);
    if (response) {
      this.getHomeIndustryList({});
      this.$message.success("更改成功");
    }
  }
  // 行业: '删除'
  delIndustryItem(row: any) {
    this.deleteIndustryItem(row.id);
  }
  // 行业: '删除'的接口
  async deleteIndustryItem(id: number) {
    const response = await manageService.deleteIndustryItem(id);
    if (response) {
      this.getHomeIndustryList({});
      this.$message.success(response);
    }
  }
  // 行业弹窗
  addNewIndustry() {
    this.industryVisible = true;
    this.addIndustryClass();
    this.getHomeIndustryOrder();
  }
  // 行业弹窗: 分类接口
  async addIndustryClass() {
    const response = await authorityService.addNewService({
      type: "行业分类"
    });
    this.industryClassOption = response;
  }
  // 行业弹窗: 选项
  industrySelect(name: any) {
    // 清空上一下遗留值
    if (this.industryForm.getFieldValue("name") !== undefined) {
      this.industryForm.setFieldsValue({
        name: undefined
      });
    }
    if (this.industryForm.getFieldValue("order") !== undefined) {
      this.industryForm.setFieldsValue({
        order: undefined
      });
    }
    this.getIndustryDetail(name);
  }
  // 行业弹窗: '详情'
  async getIndustryDetail(name: any) {
    this.industryDetailOption = [];
    const response = await manageService.getIndustryDetail(name);
    if (response.length !== 0) {
      this.industryDetailOption = cloneDeep(response);
    } else {
      console.log("数据为空");
    }
  }
  // 行业弹窗: '详情'-'选项
  chooseIndustryDetail(name: any, item: any) {
    if (this.industryForm.getFieldValue("order") !== undefined) {
      this.industryForm.setFieldsValue({
        order: undefined
      });
    }
    this.industryDetailId = item.key;
  }
  // 行业弹窗: 排序选项
  industryModalOrder(value: number) {
    console.log("排序值", value);
  }
  // 行业弹窗: 排序接口
  async getHomeIndustryOrder() {
    const response = await manageService.getHomeIndustryOrder();
    if (response) {
      let a: any = response;
      a = a + 1;
      this.maxIndustryOrder = a;
    }
  }
  // 行业弹窗: '确认'
  confirmIndustry() {
    this.industryForm.validateFields((err: any, values: any) => {
      if (err) return;
      this.addHomeIndustry(this.industryDetailId, values.order);
    });
  }
  // 行业弹窗: '添加'的接口
  async addHomeIndustry(id: number, order: number) {
    const response = await manageService.addHomeIndustry(id, order);
    if (response) {
      this.industryVisible = false;
      this.$message.success(response);
      this.getHomeIndustryList({});
    }
  }

  // 服务: '列表'接口
  async getHomeServiceList(param: any) {
    this.serviceData = [];
    const response = await manageService.getHomeServiceList(param);

    response.forEach((item: any, key: number) => {
      // item.order = key + 1;
      this.serviceData.push(item);
    });
  }
  // 服务: 更新状态 2表示启用 3表示禁用
  changeService(row: any) {
    let newStatus = -1;
    if (row.status == 2) {
      newStatus = 3;
    } else if (row.status == 3) {
      newStatus = 2;
    }
    this.updateServiceStatus(row.id, newStatus);
  }
  // 服务: 更新状态的接口
  async updateServiceStatus(id: number, status: number) {
    const response = await manageService.updateServiceStatus(id, status);
    if (response) {
      this.getHomeServiceList({});
      this.$message.success("更改成功");
    }
  }
  // 服务: '删除'
  delServiceItem(row: any) {
    this.deleteServiceItem(row.id);
  }
  // 服务: '删除' 接口
  async deleteServiceItem(id: number) {
    const response = await manageService.deleteServiceItem(id);
    if (response) {
      this.getHomeServiceList({});
      this.$message.success(response);
    }
  }
  // 服务弹窗
  modalNewService() {
    this.serviceVisible = true;
    this.firstClassSelect();
    this.getHomeServiceOrder();
  }
  // 服务弹窗: 一级分类接口
  async firstClassSelect() {
    const response = await authorityService.addNewService({
      type: "一级能力"
    });
    this.level1 = cloneDeep(response);
  }
  // 服务弹窗: 一级分类选择
  changeFirstLevel(value: any, item: any) {
    // 清空上一下遗留值
    if (this.serviceForm.getFieldValue("level2") !== undefined) {
      this.serviceForm.setFieldsValue({
        level2: undefined
      });
    }
    if (this.serviceForm.getFieldValue("order") !== undefined) {
      this.serviceForm.setFieldsValue({
        order: undefined
      });
    }
    const param = {
      type: "二级能力",
      value: value
    };
    this.concatSecond(param);
  }
  // 服务弹窗: 二级分类接口
  async concatSecond(param: any) {
    this.level2 = [];
    const response = await authorityService.getConfigList(param);
    this.level2 = cloneDeep(response);
  }
  // 服务弹窗: 二级分类选项
  secondLevel(name: any, item: any) {
    if (this.serviceForm.getFieldValue("order") !== undefined) {
      this.serviceForm.setFieldsValue({
        order: undefined
      });
    }
    this.serviceDetailId = item.key;
    // this.getBannerserviceGroup(name)
  }
  // 服务弹窗: '详情'接口
  async getBannerserviceGroup(name: string) {
    this.levelDetail = [];
    const response = await manageService.getBannerserviceGroup(name);
    if (response.length !== 0) {
      this.levelDetail = cloneDeep(response);
    }
  }
  // 服务弹窗：排序选项
  serviceModalOrder(value: number) {
    console.log("排序值", value);
  }
  // 服务弹窗: 排序接口
  async getHomeServiceOrder() {
    const response = await manageService.getHomeServiceOrder();
    if (response) {
      let a: any = response;
      a = a + 1;
      this.maxServiceOrder = a;
    }
  }
  //  服务弹窗：确认
  confirmService() {
    this.serviceForm.validateFields((err: any, values: any) => {
      if (err) return;
      this.addHomeService(this.serviceDetailId, values.order);
    });
  }
  // 服务弹窗：'添加'的接口
  async addHomeService(id: number, order: number) {
    const response = await manageService.addHomeService(id, order);
    if (response) {
      this.serviceVisible = false;
      this.$message.success(response);
      this.getHomeServiceList({});
    }
  }
  cancelServiceModal() {
    this.cacheTabKey = this.activeKey;
  }
}
</script>

<style lang="scss" scoped>
.HomeList {
  padding: 50px 80px;
  text-align: left;
  .status {
    span {
      display: inline-block;
      width: 60px;
      text-align: center;
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .tabStyle {
    width: 1200px;
    margin-top: 50px;
    b {
      font-size: 18px;
    }
    .addBanner {
      text-align: right;
      margin-bottom: 20px;
    }
    .rowOperation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #5580f5;
      cursor: pointer;
    }
  }
}
.formItem {
  margin: 0 50px;
  /deep/ .ant-form-item {
    display: flex;
    input {
      width: 300px;
    }
  }
  /deep/ .ant-form-item-label {
    width: 150px;
    margin-right: 15px;
  }
  /deep/ .ant-select {
    width: 300px;
  }
}
/deep/.ant-modal-body {
  height: 400px;
}
</style>
