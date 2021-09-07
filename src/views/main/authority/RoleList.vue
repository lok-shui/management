<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!-- <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" /> -->

      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />
          </a-form-item>

          <a-form-item
            label="权限分类"
            class="label-select"
            style="width: 230px"
            :label-col="{ span: 10 }"
            :wrapper-col="{ span: 14 }"
          >
            <a-select v-decorator="['authorityId', { initialValue: '全部' }]">
              <a-select-option
                v-for="item in roleClassList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
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
      <template slot="actived" slot-scope="actived">
        {{ actived === 0 ? "启用" : "禁用" }}
      </template>
      <template slot="auth" slot-scope="auth">
        <a-tag v-for="i in auth" :key="i" color="red">
          {{ i }}
        </a-tag>
      </template>
      <template slot="operation" slot-scope="operation, row, index">
        <table-operation
          :btnGroups="getBtnGroups(row, index)"
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
  selectedRowKeys: any[] = [];
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  roleClassList: any[] = ["管理员", "普通管理员", "审核员"];

  btnItems: any[] = [
    { text: "新增", type: "primary", event: "new" }
    // { text: "启用", type: "default", event: "active" },
    // { text: "禁用", type: "default", event: "suspend" },
    // { text: "删除", type: "default", event: "delete" }
  ];

  columns: any[] = [
    // { title: "ID", dataIndex: "id" },
    // { title: "角色分类", dataIndex: "roleType" },
    { title: "角色名", dataIndex: "name" },
    { title: "角色描述", dataIndex: "roleDesc" },
    {
      title: "所拥有权限",
      dataIndex: "auth",
      scopedSlots: { customRender: "auth" }
    },
    {
      title: "状态",
      dataIndex: "actived",
      scopedSlots: { customRender: "actived" }
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

    this.getRoleList();
    this.getRoleClassList();
  }

  onPageChange(data: any) {
    console.log(data, "onPageChange");
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getRoleList(this.paramHandler());
  }

  async getRoleList(params: any = {}) {
    console.log(this.page, this.pageSize);
    const response = await authorityService.getRoleList({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    console.log(response, "data");
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    console.log(this.paginationConfig);
    this.tableData = response.data.map((item: any) => {
      let auth: any = [];
      item.authorities.map((i: any) => {
        auth.push(i.name);
      });
      return Object.assign(item, { auth: auth });
    });
  }

  getBtnGroups(rowItem: any) {
    const isAdmin = rowItem.name.indexOf("超级管理员") !== -1;
    let btnGroups = [
      {
        type: "status",
        text: rowItem.actived === 0 ? "禁用" : "启用"
      },
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
    isAdmin && btnGroups.shift();
    return btnGroups;
  }

  handleBarClick(event: string) {
    switch (event) {
      case "new":
        this.toPath("new");
        break;
      case "active":
        break;
      case "suspend":
        break;
      case "delete":
        break;
    }
  }

  handleTableOperation(data: any) {
    const { operationType, name, actived, id } = data;
    console.log(data);
    switch (operationType) {
      case "delete":
        this.deleteRole(id);
        break;
      case "status":
        this.handleRoleStatus(data, id, actived);
        break;
      case "edit":
        this.toPath("new", { name });
        break;
    }
  }

  async deleteRole(id: number) {
    const response = await authorityService.deleteRole({ id });
    if (response) {
      this.$message.success("删除成功");
      this.getRoleList();
    }
  }

  async handleRoleStatus(rowData: any, id: number, actived: number) {
    let response = null;
    if (actived === 0) {
      //禁用
      response = await authorityService.suspendRole({ id });
    } else {
      //启用
      response = await authorityService.activeRole({ id });
    }
    this.$message.success(response);
    this.getRoleList();
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
    this.getRoleList(this.paramHandler());
  }

  paramHandler() {
    const values = this.form.getFieldsValue();
    if (
      values.authorityId &&
      (values.authorityId === "全部" || values.authorityId === -1)
    ) {
      delete values.authorityId;
    }
    return values;
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getRoleList();
  }

  async getRoleClassList() {
    const response = await authorityService.getClassNameList();
    console.log(response, "response");
    this.roleClassList = [{ name: "全部", id: -1 }];
    this.roleClassList.push(...response);
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
</style>
