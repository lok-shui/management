<template>
  <div class="list-contain">
    <div class="operation-contain">
      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <div style="display:flex;">
              <operation-bar
                :btnItems="btnItems"
                @handleClick="handleBarClick($event)"
              />
            </div>
          </a-form-item>

          <a-form-item label="应用名称">
            <a-input
              v-decorator="['name', {}]"
              placeholder="请输入应用名称"
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
      <template slot="isUpload" slot-scope="isUpload">
        <span>{{ isUpload == true ? "是" : "否" }}</span>
      </template>
      <template slot="actived" slot-scope="actived">
        <span v-if="actived == '启用'">上线</span>
        <span v-if="actived == '上线'">上线</span>
        <span v-if="actived == '停用'">下线</span>
        <span v-if="actived == '禁用'">下线</span>
        <span v-if="actived == '下线'">下线</span>
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
import operationBar from "@/components/operationBar.vue";
import tableOperation from "@/components/tableOperation.vue";
import { cloneDeep } from "lodash";

import ManageService from "@/service/manage";

const manageService = ManageService.getService();

@Component({
  components: {
    operationBar,
    tableOperation
  }
})
export default class ApplicationPage extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;

  statusList: any = {
    0: "上线",
    1: "下线"
  };

  btnItems: any[] = [{ text: "新增行业应用", type: "primary", event: "new" }];
  getBtnGroups(rowItem: any) {
    return [
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

  columns: any[] = [
    {
      title: "行业名称",
      dataIndex: "industryClass",
      scopedSlots: { customRender: "industryClass" }
    },
    {
      title: "应用名称",
      dataIndex: "name",
      scopedSlots: { customRender: "name" }
    },
    {
      title: "是否上传应用",
      dataIndex: "isUpload",
      scopedSlots: { customRender: "isUpload" }
    },
    {
      title: "应用下载次数",
      dataIndex: "count",
      scopedSlots: { customRender: "count" }
    },
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
    this.getIndustryList();
  }

  async getIndustryList(param: any = {}) {
    const response = await manageService.getIndustryList(param);
    this.tableData = cloneDeep(response.responseList);
  }

  onPageChange(data: any) {
    this.page = data.current;
    this.paginationConfig.current = this.page;
    const values = this.form.getFieldsValue();
    this.getIndustryList(values);
  }

  handleBarClick(event: string) {
    switch (event) {
      case "new":
        this.toPath("ApplicationNew");
        break;
      case "delete":
        break;
    }
  }

  handleTableOperation(data: any) {
    const { operationType, id, tname, name, type } = data;
    switch (operationType) {
      case "delete":
        this.deleteIndustry(id);
        break;
      case "edit":
        this.toPath("ApplicationNew", { id });
        break;
    }
  }

  async deleteIndustry(id: number) {
    const response = await manageService.deleteIndustry(id);
    if (response) {
      this.$message.success("删除成功");
      this.getIndustryList();
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

  handleSubmit(e: any) {
    e.preventDefault();
    const values = this.form.getFieldsValue();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getIndustryList(values);
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getIndustryList();
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
