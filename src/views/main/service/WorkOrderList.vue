<template>
  <div class="list-contain">
    <div class="operation-contain">
      <b>工单列表</b>
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="id"
      :pagination="paginationConfig"
      @change="onPageChange"
    >
      <template slot="type" slot-scope="type">
        <span>{{ type }}</span>
      </template>

      <template slot="actived" slot-scope="actived">
        <span>{{ actived }}</span>
      </template>

      <template slot="createAt" slot-scope="createAt">
        <span>{{ createAt | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
      </template>

      <template slot="operation" slot-scope="operation, row">
        <table-operation
          :btnGroups="btnGroups"
          :rowItem="row"
          @handleClick="handleTableOperation"
        />
      </template>
    </a-table>

    <a-modal
      title="改变状态"
      v-model="activeVisible"
      :maskClosable="false"
      :closable="true"
      @ok="confirmActived"
    >
      <a-form :form="modalForm">
        <a-form-item
          label="状态"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <a-select
            v-decorator="[
              'status',
              { rules: [{ required: true, message: '请选择状态' }] }
            ]"
            placeholder="请选择状态"
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
      </a-form>
    </a-modal>

    <a-modal
      title="查看详情"
      v-model="detailVisible"
      :maskClosable="false"
      :closable="true"
      @ok="confirmDetail"
    >
      <div>
        <div><b>咨询类型：</b>{{ orderDetail.type }}</div>
        <div><b>咨询服务：</b>{{ orderDetail.products }}</div>
        <div><b>应用平台：</b>{{ orderDetail.platform }}</div>
        <div><b>接入方式：</b>{{ orderDetail.accessMethod }}</div>
        <div><b>接入需求：</b>{{ orderDetail.demand }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ManageService from "@/service/manage";
import { config } from "vue/types/umd";
import tableOperation from "@/components/tableOperation.vue";

const manageService = ManageService.getService();

@Component({
  components: { tableOperation }
})
export default class ServiceList extends Vue {
  form: any = {};
  modalForm: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  activeVisible: boolean = false;
  detailVisible: boolean = false;
  orderDetail: any = {};

  statusList: any = {
    0: "待处理",
    1: "处理中",
    2: "已处理",
    3: "提交成功"
  };

  btnGroups: any[] = [
    {
      type: "detail",
      text: "详情"
    },
    {
      type: "actived",
      text: "状态"
    }
  ];

  columns: any[] = [
    { title: "工单编号", dataIndex: "id" },
    { title: "相关产品与服务", dataIndex: "products" },
    {
      title: "问题类型",
      dataIndex: "type",
      scopedSlots: { customRender: "type" }
    },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "提交时间",
      dataIndex: "createAt",
      scopedSlots: { customRender: "createAt" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: any[] = [];
  listId: any;

  created() {
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
    this.getWorkOrder();
  }

  // 列表接口
  async getWorkOrder(params: any = {}) {
    const response = await manageService.getWorkOrder({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    console.log("response", response);
    this.tableData = response.rows;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
  }

  // 列表操作
  handleTableOperation(data: any) {
    const { operationType, id } = data;
    switch (operationType) {
      case "actived":
        this.showActived(id, data);
        break;
      case "detail":
        this.showDetail(id, data);
        break;
    }
  }
  // 状态弹窗
  showActived(id: number, data: any) {
    this.listId = id;
    this.activeVisible = true;
  }
  // 状态-确认
  confirmActived() {
    this.modalForm.validateFields((err: any, values: any) => {
      if (err) return;
      this.getActiveOrkOrder(this.listId, { status: values.status });
      this.getWorkOrder();
    });
    this.modalForm.setFieldsValue({
      status: ""
    });
    this.activeVisible = false;
  }

  // 状态接口
  async getActiveOrkOrder(id: any, status: any) {
    const response = await manageService.getActiveOrkOrder(id, status);
    this.$message.success(response);
  }

  // 详情弹窗
  showDetail(id: number, data: any) {
    this.getDetailWorkOrder(id);
    this.detailVisible = true;
  }

  // 详情接口
  async getDetailWorkOrder(id: any) {
    const response = await manageService.getDetailWorkOrder(id);
    this.orderDetail = response;
  }

  // 详情-确认
  confirmDetail() {
    this.detailVisible = false;
  }

  // 翻页
  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    const values = this.form.getFieldsValue();
    this.getWorkOrder(values);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.ant-modal-content {
  width: 600px;
  height: 300px;
}
.ant-modal-body {
  height: 180px;
}
</style>
