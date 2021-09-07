<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!-- <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" /> -->

      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />
          </a-form-item>

          <!--          <a-form-item-->
          <!--            label="权限分类"-->
          <!--            class="label-select"-->
          <!--            style="width: 300px"-->
          <!--            :label-col="{ span: 10 }"-->
          <!--            :wrapper-col="{ span: 14 }"-->
          <!--          >-->
          <!--            <a-select v-decorator="['className', { initialValue: '全部' }]">-->
          <!--              <a-select-option v-for="item in classNameList" :key="item">-->
          <!--                {{ item }}-->
          <!--              </a-select-option>-->
          <!--            </a-select>-->
          <!--          </a-form-item>-->

          <!--          <a-form-item>-->
          <!--            <a-button type="primary" html-type="submit">-->
          <!--              搜索-->
          <!--            </a-button>-->
          <!--            <a-button type="default" @click="clear">-->
          <!--              清除-->
          <!--            </a-button>-->
          <!--          </a-form-item>-->
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
export default class AdminList extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  selectedRowKeys: any[] = [];

  classNameList: any[] = [];

  btnItems: any[] = [
    { text: "新增", type: "primary", event: "new" }
    // { text: "删除", type: "default", event: "delete" }
  ];

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
    // { title: "ID", dataIndex: "id" },
    { title: "权限名", dataIndex: "name" },
    { title: "请求方法", dataIndex: "method" },
    { title: "权限URL", dataIndex: "url" },
    {
      title: "权限描述",
      dataIndex: "authorityDesc"
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});
    this.paginationConfig = {
      defaultCurrent: 1,
      showQuickJumper: true,
      defaultPageSize: this.pageSize,
      current: this.page,
      class: "my-pagination",
      pageSize: this.pageSize,
      hideOnSinglePage: true,
      total: this.totalCount,
      change: this.onPageChange
    };

    this.getAuthorityList();
    this.getClassNameList();
  }

  async getAuthorityList(params: any = {}) {
    const response = await authorityService.getAuthorityList({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    console.log(this.paginationConfig);
    this.tableData = response.data;
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getAuthorityList(this.paramHandler());
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
    console.log(data);
    const { operationType, name, id } = data;
    switch (operationType) {
      case "delete":
        this.deleteAuthority({ id });
        break;
      case "edit":
        this.toPath("new", { name });
        break;
    }
  }

  async deleteAuthority(params: any) {
    const response = await authorityService.deleteAuthority(params);
    if (response) {
      this.$message.success("删除成功");
      this.getAuthorityList();
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
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getAuthorityList(this.paramHandler());
  }

  paramHandler() {
    const values = this.form.getFieldsValue();
    if (values.className && values.className === "全部") {
      delete values.className;
    }
    console.log(values);
    return values;
  }

  clear() {
    this.form.resetFields();
    // this.page = 1;
    // this.paginationConfig.current = this.page;
    this.getAuthorityList();
  }

  async getClassNameList() {
    this.classNameList = ["全部"];
    const response = await authorityService.getClassNameList();
    this.classNameList.push(...response);
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
</style>
