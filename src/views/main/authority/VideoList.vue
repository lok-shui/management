<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!--      <a-form layout="inline" :form="form" @submit="handleSubmit">-->
      <!--        <a-form-item>-->
      <!--          <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" />-->
      <!--        </a-form-item>-->
      <!--      </a-form>-->
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="id"
      :pagination="paginationConfig"
      @change="onPageChange"
    >
      <template slot="showVideo" slot-scope="showVideo">
        <!--        <a :href="showVideo" target="_blank">{{ showVideo }}</a>-->
        <video v-if="showVideo" width="320" height="180" controls>
          <source :src="showVideo" type="video/mp4" />
        </video>
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
export default class VedioList extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  tableData: any[] = [];

  btnItems: any[] = [{ text: "新增", type: "primary", event: "new" }];
  columns: any[] = [
    {
      title: "服务名",
      dataIndex: "name"
    },
    {
      title: "前台展示页模板名称",
      dataIndex: "showTemplateName"
    },
    {
      title: "视频资源",
      dataIndex: "showVideo",
      scopedSlots: { customRender: "showVideo" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];

  handleBarClick(event: string) {
    switch (event) {
      case "new":
        this.toPath("new");
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

  getBtnGroups(rowItem: any) {
    return [
      {
        type: "edit",
        text: "编辑"
      }
    ];
  }

  handleTableOperation(data: any) {
    const { operationType, name, id, showVideo, showUrl } = data;
    console.log(data);
    switch (operationType) {
      case "delete":
        // this.deleteRole(id);
        break;
      case "edit":
        this.toPath("new", { name, id, showUrl, showVideo });
        break;
    }
  }

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

    this.getServiceVedioList();
  }

  onPageChange(data: any) {
    console.log(data, "onPageChange");
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getServiceVedioList();
  }

  async getServiceVedioList(params: any = {}) {
    const response = await authorityService.getServiceVideoList({
      page: this.page,
      per_page: this.pageSize,
      ...params
    });
    console.log(response);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    response.responseList.forEach((item: any) => {
      if (item.showVideo === "deleted") {
        item.showVideo = null;
      }
      this.tableData.push(item);
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getServiceVedioList();
  }
}
</script>

<style scoped lang="scss">
@import "./basic.scss";
</style>
