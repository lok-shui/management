<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!-- <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" /> -->

      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />
          </a-form-item>

          <a-form-item label="类型">
            <a-select
              v-decorator="['type', {}]"
              placeholder="请选择类型"
              style="width: 150px;"
            >
              <a-select-option v-for="item in typeList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="['name', {}]"
              placeholder="名称"
              style="width: 300px;"
            ></a-input>
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

    <!--
:rowSelection="{
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange
  }"
  -->
    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="id"
      :pagination="paginationConfig"
      @change="onPageChange"
    >
      <template slot="operation" slot-scope="operation, row">
        <table-operation
          v-if="row.type !== '配置类型'"
          :btnGroups="btnGroups"
          :rowItem="row"
          @handleClick="handleTableOperation"
        />
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import AuthorityService from "@/service/authority";

const authorityService = AuthorityService.getService();

@Component({
  components: {
    operationBar,
    tableOperation
  }
})
export default class ConfigList extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  selectedRowKeys: any[] = [];

  btnItems: any[] = [
    { text: "新增", type: "primary", event: "new" }
    // { text: "删除", type: "default", event: "delete" }
  ];

  typeList: any[] = [];

  btnGroups: any[] = [
    {
      type: "edit",
      text: "编辑"
    },
    {
      type: "delete",
      text: "删除",
      confirm: "确认删除？"
    }
  ];

  columns: any[] = [
    { title: "类型", dataIndex: "type", width: 200 },
    { title: "名称", dataIndex: "name", width: 200 },
    { title: "值", dataIndex: "value" },
    { title: "描述", dataIndex: "desc", width: 500 },
    {
      title: "操作",
      dataIndex: "operation",
      width: 300,
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});
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

    this.getTypeList();
    this.getConfigList();
  }

  async getTypeList() {
    const response = await authorityService.getConfigList({
      type: "配置类型"
    });
    this.typeList = response;
  }

  async getConfigList(params: any = {}) {
    const response = await authorityService.getConfigList({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    console.log(response);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = response.data;
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getConfigList(this.form.getFieldsValue());
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

  handleTableOperation(data: any) {
    const { operationType, id } = data;
    switch (operationType) {
      case "delete":
        this.deleteConfig(id);
        break;
      case "edit":
        this.toPath("new", { id });
        break;
    }
  }

  async deleteConfig(id: string) {
    const response = await authorityService.deleteConfig(id);
    if (response) {
      this.$message.success("删除成功");
      this.getConfigList();
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

  onSelectChange(selectedRowKeys: any) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    const values = this.form.getFieldsValue();
    console.log(values);
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getConfigList(values);
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getConfigList();
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
</style>
