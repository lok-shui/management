<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!-- <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" /> -->

      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />
          </a-form-item>

          <a-form-item label="注册时间">
            <a-range-picker v-decorator="['registTime', {}]" />
          </a-form-item>

          <a-form-item label="状态">
            <a-select
              v-decorator="['code', {}]"
              placeholder="请选择状态"
              style="width: 150px;"
            >
              <a-select-option v-for="(val, key) in statusList" :key="key">
                {{ val }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="['name', {}]"
              placeholder="账号/手机号"
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

    <a-table
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :columns="columns"
      :dataSource="tableData"
      :pagination="paginationConfig"
      rowKey="id"
      @change="onPageChange"
    >
      <span slot="status" slot-scope="val">{{ statusList[val] }}</span>
      <template slot="operation" slot-scope="operation, row">
        <table-operation
          :btnGroups="getBtnGroups(row)"
          :rowItem="row"
          @handleClick="handleTableOperation"
        />
      </template>
    </a-table>
    <a-modal
      title="客户详细信息"
      v-model="visible"
      @ok="hideModal"
      okText="确认"
      cancelText="取消"
    >
      <table style="font-size: larger;">
        <tr>
          <td class="left">用户名：</td>
          <td class="right">
            {{ this.userDetail.username }}
          </td>
        </tr>
        <tr>
          <td class="left">邮箱：</td>
          <td class="right">
            {{ this.userDetail.email }}
          </td>
        </tr>
        <tr>
          <td class="left">手机号：</td>
          <td class="right">
            {{ this.userDetail.phone }}
          </td>
        </tr>
        <tr>
          <td class="left">真实姓名：</td>
          <td class="right">
            {{ this.userDetail.realName }}
          </td>
        </tr>
        <tr>
          <td class="left">公司：</td>
          <td class="right">
            {{ this.userDetail.company }}
          </td>
        </tr>
        <tr>
          <td class="left">注册时间：</td>
          <td class="right">
            {{ this.userDetail.registerTime }}
          </td>
        </tr>
        <tr>
          <td class="left">最后登录时间：</td>
          <td class="right">{{ this.userDetail.lastLoginTime }}</td>
        </tr>
      </table>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment, { months } from "moment";
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import ClientService from "@/service/client";
import { message as Toast } from "ant-design-vue";

const clientService = ClientService.getService();

@Component({
  components: {
    operationBar,
    tableOperation
  }
})
export default class ClientList extends Vue {
  form: any = {};
  selectedRowKeys: any[] = [];
  visible: Boolean = false;
  userDetail: any = {};

  paginationConfig: any = {
    hideOnSinglePage: true
  };

  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  btnItems: any[] = [
    // { text: "新增", type: "primary", event: "new" },
    { text: "启用", type: "default", event: "active" },
    { text: "禁用", type: "default", event: "suspend" },
    { text: "删除", type: "default", event: "delete" },
    { text: "新增", type: "primary", event: "add" }
  ];

  statusList: object = { "": "全部", "1": "启用", "0": "禁用" };

  columns: any[] = [
    // { title: "编号", dataIndex: "index" },
    { title: "手机号", dataIndex: "phone" },
    { title: "账号", dataIndex: "username" },
    { title: "邮箱", dataIndex: "email" },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "注册时间",
      dataIndex: "registerTime",
      scopedSlots: { customRender: "registerTime" }
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
    this.loadData();
  }

  getBtnGroups(rowItem: any) {
    return [
      {
        confirm: false,
        type: "look",
        text: "查看"
      },
      {
        type: "status",
        text: rowItem.status === 1 ? "禁用" : "启用"
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
  }

  async handleBarClick(event: string) {
    if (!this.selectedRowKeys.length && event != "add") {
      Toast.warning("请选择数据", 3);
      return;
    }

    let response: any = {};
    if (event === "active" || event === "suspend") {
      const status = event === "active" ? 1 : 0;
      const params = this.selectedRowKeys.map((id: any) => {
        return { id: id, status: status };
      });
      response = await clientService.handleClientUserStatus(params);
    } else if (event === "delete") {
      // TODO 暂未走通
      const ids = this.selectedRowKeys.join(",");
      response = await clientService.deleteClient({ ids: ids });
    } else if (event === "add") {
      this.toPath("new");
    }

    console.log(response);

    if (response.data && response.data.error) {
      Toast.error(response.data.error, 5);
    } else {
      this.selectedRowKeys = [];
      this.handleSubmit(null);
    }
  }

  async handleTableOperation(data: any) {
    console.log(data);
    const { operationType, id } = data;
    let response: any = {};
    switch (operationType) {
      case "look":
        this.userDetail["username"] = data.username;
        this.userDetail["password"] = data.password;
        this.userDetail["phone"] = data.phone;
        this.userDetail["email"] = data.email;
        this.userDetail["realName"] = data.realName;
        this.userDetail["company"] = data.company;
        this.userDetail["registerTime"] = moment(data.registerTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.userDetail["lastLoginTime"] = moment(data.lastLoginTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.showModal();
        break;
      case "status":
        response = await clientService.handleClientUserStatus([
          { id, status: data.status === 0 ? 1 : 0 }
        ]);
        this.$message.success("状态更新成功");
        break;
      case "edit":
        this.toPath("new", { id });
        break;
      case "delete":
        response = await clientService.deleteClient({ ids: id });
        this.$message.success("删除成功");
        break;
    }

    if (operationType === "edit") return;

    if (operationType === "look") return;

    console.log(operationType, response);

    if (response.data && response.data.error) {
      Toast.error(response.data.error, 5);
    } else {
      this.handleSubmit(null);
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

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.loadData(this.handlerParams());
  }

  handleSubmit(e: any) {
    if (e) {
      e.preventDefault();
    }
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.loadData(this.handlerParams());
  }

  handlerParams() {
    const params = this.form.getFieldsValue();

    if (params.name) {
      params["phone"] = params.name;
      delete params.name;
    }

    if (params.registTime && params.registTime.length) {
      params["registTimeStart"] = new Date(
        moment(params.registTime[0]).format("YYYY/MM/DD")
      ).getTime();
      params["registTimeEnd"] = new Date(
        moment(params.registTime[1])
          .add(1, "d")
          .format("YYYY/MM/DD")
      ).getTime();
      delete params.registTime;
    }
    return params;
  }

  async loadData(params: any = {}) {
    const response = await clientService.getClientList({
      page: this.page,
      per_page: this.pageSize,
      sortBy: "registerTime",
      order: "desc",
      ...params
    });
    console.log(response);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    let index = 1;
    response.data.forEach((m: any) => {
      m.index = index++;
      m.registerTime = moment(m.registerTime).format("YYYY-MM-DD HH:mm:ss");
    });
    this.tableData = response.data;
  }

  showModal() {
    this.visible = true;
  }
  hideModal() {
    this.visible = false;
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.loadData();
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.right {
  text-align: left;
  padding-left: 10px;
  padding-bottom: 10px;
}
.left {
  font-weight: bold;
  text-align: right;
  padding-bottom: 10px;
}
</style>
