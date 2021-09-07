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
            label="角色"
            class="label-select"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-select v-decorator="['roleId', { initialValue: '全部' }]">
              <template v-for="item in roleList">
                <a-select-option :key="item.id" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </template>
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
      <template slot="lastLoginTime" slot-scope="lastLoginTime">
        <span>{{ lastLoginTime | formatDate("YYYY-MM-DD HH:mm") }}</span>
      </template>

      <template slot="actived" slot-scope="actived">
        {{ actived === 0 ? "启用" : "禁用" }}
      </template>
      <template slot="role" slot-scope="role">
        <a-tag v-for="i in role" :key="i" color="red">
          {{ i }}
        </a-tag>
      </template>

      <template slot="operation" slot-scope="operation, row">
        <table-operation
          :btnGroups="getBtnGroups(row)"
          :rowItem="row"
          @handleClick="handleTableOperation"
        />
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment from "moment";
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

  roleList: any[] = ["管理员", "普通管理员", "审核员"];

  btnItems: any[] = [
    { text: "新增", type: "primary", event: "new" }
    // { text: "启用", type: "default", event: "active" },
    // { text: "禁用", type: "default", event: "suspend" },
    // { text: "删除", type: "default", event: "delete" }
  ];

  columns: any[] = [
    // { title: "ID", dataIndex: "id" },
    { title: "管理员账号", dataIndex: "name" },
    { title: "登录次数", dataIndex: "loginTimes" },
    { title: "角色", dataIndex: "role", scopedSlots: { customRender: "role" } },
    {
      title: "状态",
      dataIndex: "actived",
      scopedSlots: { customRender: "actived" }
    },
    {
      title: "最后登录时间",
      dataIndex: "lastLoginTime",
      scopedSlots: { customRender: "lastLoginTime" }
    },
    // {
    //   title: "是否启用",
    //   dataIndex: "status",
    //   scopedSlots: { customRender: "status" }
    // },
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

    this.getAdminList();

    this.getRoleList();
  }

  async getAdminList(params: any = {}) {
    const response = await authorityService.getAdminList({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = response.data.map((m: any) => {
      let role: any = [];
      m.roles.map((item: any) => {
        role.push(item.name);
      });
      return Object.assign(m, { role: role });
    });
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getAdminList(this.paramHandler());
  }

  getBtnGroups(rowItem: any) {
    return [
      {
        type: "status",
        text: rowItem.actived === 0 ? "禁用" : "启用"
      },
      {
        type: "edit",
        text: "编辑"
      },
      // {
      //   type: "status",
      //   text: rowItem.status === "active" ? "禁用" : "启用"
      // },
      // {
      //   type: "authority",
      //   text: "授权"
      // },
      {
        type: "delete",
        text: "删除",
        confirm: "确认删除？"
      }
    ];
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
    console.log(data, "data");
    switch (operationType) {
      case "delete":
        this.deleteAdmin(id);
        break;
      case "edit":
        this.toPath("new", { name });
        break;
      case "status":
        this.changeStatus(id, actived);
        break;
    }
  }

  async deleteAdmin(id: string) {
    const response = await authorityService.deleteAdmin({ id });
    if (response) {
      this.$message.success("删除成功");
      this.getAdminList();
    }
  }

  toPath(url: string, params?: any) {
    this.$router.push({
      path: url,
      query: {
        ...params,
        t: new Date().getTime()
      }
    });
  }

  async changeStatus(id: any, actived: any) {
    let response = null;
    if (actived === 0) {
      //禁用
      response = await authorityService.closeAdmin({ id });
    } else {
      //启用
      response = await authorityService.openAdmin({ id });
    }
    this.$message.success(response);
    this.getAdminList();
  }

  onSelectChange(selectedRowKeys: any) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.selectedRowKeys = selectedRowKeys;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getAdminList(this.paramHandler());
  }

  paramHandler() {
    const values = this.form.getFieldsValue();

    console.log(
      values,
      values.roleId && (values.roleId === 0 || values.roleId === "全部")
    );
    if (values.roleId === 0 || values.roleId === "全部") {
      delete values.roleId;
    }
    console.log(values);
    return values;
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getAdminList();
  }

  async getRoleList() {
    const response = await authorityService.getActiveRole();
    this.roleList = [{ name: "全部", id: 0 }];
    this.roleList.push(...response);
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
</style>
