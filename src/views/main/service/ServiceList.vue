<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!-- <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" /> -->

      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />
          </a-form-item>

          <a-form-item label="服务组">
            <a-select
              v-decorator="['serviceGroup', {}]"
              placeholder="请选择服务组"
              style="width: 150px;"
            >
              <a-select-option
                v-for="item in serviceGroup"
                :key="item.id"
                :value="item.name"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="类型">
            <a-select
              v-decorator="['type', {}]"
              placeholder="请选择类型"
              style="width: 150px;"
            >
              <a-select-option
                v-for="(item, index) in typeList"
                :key="index"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="名称">
            <a-input
              v-decorator="['name', {}]"
              placeholder="请输入AI能力名称"
            ></a-input>
          </a-form-item>

          <a-form-item label="状态">
            <a-select
              v-decorator="['actived', {}]"
              placeholder="请选择状态"
              style="width: 150px;"
            >
              <a-select-option
                v-for="(item, index) in statusList"
                :key="index"
                :value="item"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit">
              搜索
            </a-button>
            <a-button type="default" @click="clear">
              清除
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="id"
      :pagination="paginationConfig"
      @change="onPageChange"
    >
      <template slot="type" slot-scope="type">
        <!-- <span>{{ typeList[type] }}</span> -->
        <span>{{ type }}</span>
      </template>

      <template slot="actived" slot-scope="actived">
        <!-- <span>{{ statusList[actived] }}</span> -->
        <span>{{ actived }}</span>
      </template>

      <template slot="time" slot-scope="time">
        <span>{{ time | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
      </template>

      <template slot="operation" slot-scope="operation, row">
        <div class="flexCen">
          <table-operation
            :btnGroups="btnGroups"
            :rowItem="row"
            @handleClick="handleTableOperation"
          />
          <a
            class="noBorder"
            v-if="row.haveBills == true"
            @click="linkToPrice(row)"
          >
            <b>查看价格</b>
          </a>
          <a class="noBorder" v-else @click="linkToPrice(row)">设置价格</a>
        </div>
      </template>
    </a-table>
    <!-- 模板弹窗 -->
    <a-modal
      title="添加模板"
      v-model="firstVisible"
      :maskClosable="false"
      :closable="true"
      @ok="confirmModal"
    >
      <a-form :form="modalForm">
        <a-form-item
          label="前台展示页配置"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select
            v-decorator="[
              'showUrl',
              { rules: [{ required: true, message: '请选择前台展示页配置' }] }
            ]"
            placeholder="请选择前台展示页配置"
          >
            <a-select-option
              v-for="item in configTypeList"
              :key="item.id"
              :value="item.value"
            >
              {{ item.name }}
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
import ManageService from "@/service/manage";
import AuthorityService from "@/service/authority";

const manageService = ManageService.getService();
const authorityService = AuthorityService.getService();

@Component({
  components: {
    operationBar,
    tableOperation
  }
})
export default class ServiceList extends Vue {
  form: any = {};
  modalForm: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  firstVisible: boolean = false;

  typeList: any = {
    0: "SDK",
    1: "API"
  };
  statusList: any = {
    0: "下线",
    1: "上线"
  };

  btnItems: any[] = [{ text: "新增服务", type: "primary", event: "new" }];

  btnGroups: any[] = [
    {
      type: "edit",
      text: "编辑"
    },
    {
      type: "delete",
      text: "删除",
      confirm: "确认删除？"
    },
    {
      type: "modal",
      text: "添加模板"
    }
    // {
    //   type: "setPrice",
    //   text: "设置价格"
    // }
  ];

  columns: any[] = [
    { title: "服务名称", dataIndex: "name" },
    { title: "服务组", dataIndex: "gname" },
    {
      title: "服务类型",
      dataIndex: "type",
      scopedSlots: { customRender: "type" }
    },
    { title: "描述信息", dataIndex: "desc", width: "20%" },
    { title: "模板名称", dataIndex: "templateName", width: 100 },
    {
      title: "状态",
      dataIndex: "actived",
      scopedSlots: { customRender: "actived" }
    },
    { title: "创建人", dataIndex: "person" },
    {
      title: "创建时间",
      dataIndex: "time",
      scopedSlots: { customRender: "time" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: any[] = [];
  serviceGroup: any[] = [];
  configTypeList: any = [];
  listId: any;
  showUrl: string = "";

  created() {
    this.getConfigTypeList();

    this.form = this.$form.createForm(this, {});
    this.modalForm = this.$form.createForm(this, {});
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

    this.getServiceList();
    this.getServiceGroup();
  }

  async getConfigTypeList() {
    const response = await authorityService.getConfigTypeList();
    this.configTypeList = response;
  }

  async getServiceGroup() {
    // const response = await manageService.getServiceGroup();
    // this.serviceGroup = response;
    const response = await authorityService.getConfigList({
      type: "二级能力"
    });
    this.serviceGroup = response;
  }

  async getServiceList(params: any = {}) {
    const response = await manageService.getServiceList({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = response.responseList;
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    const values = this.form.getFieldsValue();
    this.getServiceList(values);
  }

  handleBarClick(event: string) {
    switch (event) {
      case "new":
        this.toPath("new");
        break;
      case "delete":
        break;
    }
  }

  // 列表操作
  handleTableOperation(data: any) {
    const { operationType, id } = data;
    switch (operationType) {
      case "delete":
        this.deleteService(id);
        break;
      case "edit":
        this.toPath("new", { id });
        break;
      case "modal":
        this.showModel(id, data);
        break;
    }
  }

  async deleteService(id: string) {
    const isBoolean = await manageService.isDeleteAble(id);
    if (isBoolean) {
      this.$message.error("该服务被接口使用,不能被删除");
    } else {
      const response = await manageService.deleteService(id);
      if (response) {
        this.$message.success("删除成功");
        this.getServiceList();
      }
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

  // 展示弹窗
  showModel(id: number, data: any) {
    this.listId = id;
    this.firstVisible = true;
  }
  // '确认'弹窗
  confirmModal() {
    this.modalForm.validateFields((err: any, values: any) => {
      if (err) return;
      this.firstVisible = false;
      const param = {
        id: this.listId,
        showUrl: values.showUrl
      };
      this.editPort(param);
    });
    this.modalForm.setFieldsValue({
      showUrl: ""
    });
  }

  // 编辑列表接口
  async editPort(params: any) {
    const response = await manageService.updateService({
      ...params
    });

    if (response) {
      this.showUrl = response.showUrl;
      this.getServiceList();
    }
  }

  // 跳到价格页面
  linkToPrice(row: any) {
    this.$router.push({
      path: "price",
      query: {
        id: row.id,
        haveBills: row.haveBills,
        name: row.name
      }
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    const values = this.form.getFieldsValue();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getServiceList(values);
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getServiceList();
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.flexCen {
  display: flex;
  align-items: center;
}
.noBorder {
  border: none;
  cursor: pointer;
}
</style>
