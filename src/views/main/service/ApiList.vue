<template>
  <div class="list-contain">
    <div class="operation-contain">
      <!-- <operation-bar :btnItems="btnItems" @handleClick="handleBarClick" /> -->

      <div class="search-contain">
        <a-form layout="inline" :form="form" @submit="handleSubmit">
          <a-form-item>
            <div style="display:flex;">
              <!-- <operation-bar
                :btnItems="btnItems"
                @handleClick="handleBarClick"
              /> -->
              <operation-bar
                :btnItems="btnItems2"
                @handleClick="handleBarClick2($event)"
              />
            </div>
          </a-form-item>

          <a-form-item label="名称">
            <a-input
              v-decorator="['name', {}]"
              placeholder="请输入接口名称"
            ></a-input>
          </a-form-item>

          <a-form-item label="类型">
            <a-select
              v-decorator="['type', {}]"
              placeholder="请选择类型"
              style="width: 120px;"
            >
              <a-select-option
                v-for="(item, index) in typeList"
                :key="index"
                :value="index"
              >
                {{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="服务">
            <a-select
              v-decorator="['sid', {}]"
              placeholder="请选择服务"
              style="width: 150px;"
            >
              <a-select-option
                v-for="item in serviceList"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="状态">
            <a-select
              v-decorator="['status', {}]"
              placeholder="请选择状态"
              style="width: 150px;"
            >
              <a-select-option
                v-for="(item, index) in statusList"
                :key="index"
                :value="index"
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
      <template slot="name" slot-scope="name, row">
        <span>{{ name ? name : row.tname }}</span>
      </template>
      <template slot="type" slot-scope="type">
        <span>{{ type == 1 ? "模板" : "接口" }}</span>
      </template>
      <template slot="status" slot-scope="status">
        <span>{{ statusList[status] }}</span>
      </template>

      <template slot="modifyTime" slot-scope="modifyTime">
        <span>{{ modifyTime | formatDate("YYYY-MM-DD HH:mm:ss") }}</span>
      </template>

      <template slot="operation" slot-scope="operation, row">
        <table-operation
          :btnGroups="getBtnGroups(row)"
          :rowItem="row"
          @handleClick="handleTableOperation"
        />
      </template>
    </a-table>

    <!--    模态框预览文档-->
    <a-modal
      title="预览文档"
      :visible="visible"
      @ok="hideModal"
      @cancel="handleCancel"
      okText="确认"
      cancelText="取消"
      width="50%"
      :closable="true"
      :bodyStyle="{ padding: 0 }"
    >
      <template>
        <a-button
          @click="htmlToPdf"
          style="position: absolute;top:15px; left: 80%"
          type="danger"
          >下载</a-button
        >
        <div>
          <doc v-if="doc" :doc="doc" id="pdfDom" style="padding: 30px;" />
          <div v-else>暂无内容</div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import operationBar from "@/components/operationBar.vue";
import Doc from "./doc.vue";
import tableOperation from "@/components/tableOperation.vue";
import ManageService from "@/service/manage";
import EventBus from "@/utils/eventBus"; // 中央事件

const manageService = ManageService.getService();

@Component({
  components: {
    operationBar,
    tableOperation,
    Doc
  }
})
export default class ApiList extends Vue {
  form: any = {};
  paginationConfig!: pageconfig;
  totalCount: number = 0;
  pageSize: number = 10;
  page: number = 1;
  visible: boolean = false;

  doc: any = {};

  requestMethods: any = {
    0: "GET",
    1: "POST",
    2: "PUT",
    3: "PATCH",
    4: "DELETE"
  };

  statusList: any = {
    0: "新建",
    1: "测试中",
    2: "成功",
    3: "失败",
    4: "警告"
  };

  typeList: any = {
    1: "模板",
    0: "接口"
  };

  btnItems: any[] = [{ text: "新增接口", type: "primary", event: "new" }];
  btnItems2: any[] = [
    { text: "新增接口", type: "primary", event: "new" },
    { text: "新增模板", type: "primary", event: "template" }
  ];
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
      },
      {
        type: "detail",
        text: "预览文档"
      }
    ];
  }
  fileName: string = "";

  columns: any[] = [
    {
      title: "接口/模板名称",
      dataIndex: "name",
      scopedSlots: { customRender: "name" }
    },
    {
      title: "类型",
      dataIndex: "type",
      scopedSlots: { customRender: "type" }
    },
    { title: "接口描述信息", dataIndex: "desc", width: "20%" },
    {
      title: "状态",
      dataIndex: "status",
      scopedSlots: { customRender: "status" }
    },
    {
      title: "最后操作时间",
      dataIndex: "modifyTime",
      scopedSlots: { customRender: "modifyTime" }
    },
    { title: "最后操作人", dataIndex: "modifyPerson" },
    {
      title: "操作",
      dataIndex: "operation",
      scopedSlots: { customRender: "operation" }
    }
  ];
  tableData: any[] = [];

  serviceList: any[] = [];

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

    this.getInterfaceList();
    this.getServiceList();
  }

  async getServiceList() {
    const response = await manageService.getServiceAll();
    this.serviceList = response;
  }

  async getInterfaceList(params: any = {}) {
    const response = await manageService.getInterfaceList({
      page: this.page,
      per_page: this.pageSize,
      sortBy: "modifyTime",
      order: "desc",
      ...params
    });
    // console.log(response.responseList);
    this.totalCount = response.count;
    this.paginationConfig.total = this.totalCount;
    this.paginationConfig = JSON.parse(JSON.stringify(this.paginationConfig));
    this.tableData = response.responseList;

    let list = response.responseList;
  }

  onPageChange(data: any) {
    console.log("data", data);
    this.page = data.current;
    this.paginationConfig.current = this.page;
    this.getInterfaceList(this.form.getFieldsValue());
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
  handleBarClick2(event: string, text: string) {
    console.log("new event", event);
    switch (event) {
      case "template":
        this.toPath("template", { event });

        break;
      case "new":
        this.toPath("template", { event });
        break;
    }
  }

  htmlToPdf() {
    //@ts-ignore
    this.getPdf("pdfDom", "接口文档");
  }

  handleTableOperation(data: any) {
    console.log("data", data);
    const { operationType, id, tname, name, type } = data;

    switch (operationType) {
      case "delete":
        this.deleteInterface(id);
        break;
      case "edit":
        // this.toPath("new", { id });
        this.toPath("template", { id, type });
        break;
      case "detail":
        // this.toPath("doc", { id });
        this.showModal();
        this.getInterfaceDetail(id);
        break;
    }

    // if(name && operationType) {
    //   switch (operationType) {
    //     case "delete":
    //       this.deleteInterface(id);
    //       break;
    //     case "edit":
    //       this.toPath("new", { id });
    //       break;
    //     case "detail":
    //       // this.toPath("doc", { id });
    //       this.showModal();
    //       this.getInterfaceDetail(id);
    //       break;
    //   }
    // }

    // if(tname && operationType) {
    //   switch (operationType) {
    //     case "delete":
    //       this.deleteInterface(id);
    //       break;
    //     case "edit":
    //       this.toPath("template", { id });
    //       break;
    //     case "detail":
    //       // this.toPath("doc", { id });
    //       this.showModal();
    //       this.getInterfaceDetail(id);
    //       break;
    //   }
    // }
  }

  async deleteInterface(id: string) {
    const response = await manageService.deleteInterface(id);
    if (response) {
      this.$message.success("删除成功");
      this.getInterfaceList();
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
    console.log(values);
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getInterfaceList(values);
  }

  clear() {
    this.form.resetFields();
    this.page = 1;
    this.paginationConfig.current = this.page;
    this.getInterfaceList();
  }

  showModal() {
    this.visible = true;
  }
  hideModal() {
    this.visible = false;
  }
  handleCancel() {
    this.visible = false;
  }

  async getInterfaceDetail(id: string) {
    const response = await manageService.getInterfaceDetail(id);
    console.log(response);
    this.doc = {
      title: response.name,
      content: [
        {
          title: "描述",
          key: "1",
          children: [
            {
              key: "1.1",
              type: "text",
              text: response.desc
            }
          ]
        },
        {
          title: "调用URL",
          key: "2",
          children: [
            {
              key: "2.1",
              type: "code",
              code: `${response.address}${response.url}`
            }
          ]
        },
        {
          title: "请求方法",
          key: "3",
          children: [
            {
              key: "3.1",
              type: "text",
              text: this.requestMethods[response.method]
            }
          ]
        },
        {
          title: "请求头参数",
          key: "4",
          children: [
            {
              key: "4.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "参数名", dataIndex: "key" },
                { title: "示例", dataIndex: "value" },
                { title: "参数说明", dataIndex: "desc" }
              ],
              tableData: response.headers
            }
          ]
        },
        {
          title: "请求body属性",
          key: "5",
          children: [
            {
              key: "5.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "属性名", dataIndex: "name" },
                { title: "类型", dataIndex: "type" },
                { title: "属性说明", dataIndex: "desc" },
                { title: "是否必选", dataIndex: "required" }
              ],
              tableData: response.bodies.map((item: any) =>
                Object.assign(item, { required: item.required ? "是" : "否" })
              )
            }
          ]
        },
        {
          title: "成功返回值示例",
          key: "6",
          children: [
            {
              key: "6.1",
              type: "code",
              code: response.success
            }
          ]
        },
        {
          title: "失败返回值示例",
          key: "7",
          children: [
            {
              key: "7.1",
              type: "code",
              code: response.fail
            }
          ]
        },
        {
          title: "返回值说明",
          key: "8",
          children: [
            {
              key: "8.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "参数名", dataIndex: "name" },
                { title: "参数类型", dataIndex: "type" },
                { title: "说明", dataIndex: "desc" }
              ],
              tableData: response.returndatas
            }
          ]
        },
        {
          title: "当前API特有的ERROR_MESSAGE",
          key: "9",
          children: [
            {
              key: "9.1",
              type: "table",
              rowKey: "id",
              tableColumns: [
                { title: "状态码", dataIndex: "code" },
                { title: "错误信息", dataIndex: "msg" },
                { title: "说明", dataIndex: "desc" }
              ],
              tableData: response.codes
            }
          ]
        },
        {
          title: "调用示例",
          key: "11",
          children: [
            {
              key: "11.1",
              type: "code",
              code: `${response.testscript}`
            }
          ]
        }
      ]
    };
    response.clientcodes.forEach((item: any) => {
      this.doc.content.push({
        title: item.clientName,
        children: [{ type: "code", code: item.fileText }]
      });
    });
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
