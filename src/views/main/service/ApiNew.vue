<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="接口名称"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: true, message: '请输入接口名称' },
                { max: 50, message: '输入长度不能超过50' }
              ]
            }
          ]"
          placeholder="请输入接口名称"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="接口描述"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'desc',
            {
              rules: [
                { required: true, message: '请输入接口描述' },
                { max: 500, message: '输入长度不能超过500' }
              ]
            }
          ]"
          placeholder="请输入接口描述"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="选择服务"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          showSearch
          v-decorator="[
            'sid',
            { rules: [{ required: true, message: '请选择服务' }] }
          ]"
          placeholder="请选择服务"
          optionFilterProp="name"
          :filterOption="filterOption"
          @change="changeService"
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

      <a-form-item
        label="URL"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'url',
            {
              rules: [
                { required: true, message: '请输入服务地址' },
                { max: 200, message: '输入长度不能超过200' }
              ]
            }
          ]"
          placeholder="服务地址，如：/v1/user/"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="域名或服务器IP端口"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'address',
            { rules: [{ required: true, message: '请输入域名或服务器IP端口' }] }
          ]"
          placeholder="请输入服务地址，含域名"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="请求方法"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          v-decorator="[
            'method',
            { rules: [{ required: true, message: '请选择方法' }] }
          ]"
          placeholder="请选择方法"
        >
          <a-select-option
            v-for="item in requestMethods"
            :key="item.value"
            :value="item.value"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="请求头参数管理"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-table
          :columns="headerColums"
          :dataSource="headers"
          rowKey="index"
          :locale="{
            emptyText: '暂无数据'
          }"
          :pagination="false"
        >
          <template
            v-for="col in ['key', 'value', 'desc']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="e => handleHeaderChange(e.target.value, index, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a class="a-btn" @click="saveHeader(index)">保存</a>
              <a @click="editHeader(index, false)">取消</a>
            </span>
            <span v-else>
              <a
                class="a-btn"
                :disabled="headerIndex !== ''"
                @click="editHeader(index, true)"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteHeader(index)">
                <a :disabled="headerIndex !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="headerIndex !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addHeader"
          >新增</a-button
        >
      </a-form-item>

      <a-form-item
        label="请求body属性管理"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-table
          :columns="bodyColums"
          :dataSource="bodys"
          rowKey="index"
          :locale="{
            emptyText: '暂无数据'
          }"
          :pagination="false"
        >
          <template
            v-for="col in ['name', 'type', 'desc']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="e => handleBodyChange(e.target.value, index, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>

          <template slot="required" slot-scope="required, row, index">
            <a-checkbox
              v-if="row.editable"
              :defaultChecked="!!required"
              @change="
                e =>
                  handleBodyChange(e.target.checked ? 1 : 0, index, 'required')
              "
            />
            <span v-else>{{ required ? "是" : "否" }}</span>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a class="a-btn" @click="saveBody(index)">保存</a>
              <a @click="editBody(index, false)">取消</a>
            </span>
            <span v-else>
              <a
                class="a-btn"
                :disabled="bodyIndex !== ''"
                @click="editBody(index, true)"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteBody(index)">
                <a :disabled="bodyIndex !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="bodyIndex !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addBody"
          >新增</a-button
        >
      </a-form-item>

      <a-form-item
        label="成功返回值示例"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- <quill-editor
          v-model="successContent"
          ref="successEditor"
          :options="editorOption"
        >
        </quill-editor> -->
        <a-textarea
          v-decorator="[
            'success',
            { rules: [{ required: true, message: '请输入成功返回值示例' }] }
          ]"
          placeholder=""
          :rows="3"
        ></a-textarea>
      </a-form-item>

      <a-form-item
        label="失败返回值示例"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- <quill-editor
          v-model="failContent"
          ref="failEditor"
          :options="editorOption"
        >
        </quill-editor> -->
        <a-textarea
          v-decorator="[
            'fail',
            { rules: [{ required: true, message: '请输入失败返回值示例' }] }
          ]"
          placeholder=""
          :rows="3"
        ></a-textarea>
      </a-form-item>

      <a-form-item
        label="当前API特有的ERROR_MESSAGE"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-table
          :columns="errorColums"
          :dataSource="errors"
          rowKey="index"
          :locale="{
            emptyText: '暂无数据'
          }"
          :pagination="false"
        >
          <template
            v-for="col in ['code', 'msg', 'desc']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="e => handleErrorChange(e.target.value, index, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a class="a-btn" @click="saveError(index)">保存</a>
              <a @click="editError(index, false)">取消</a>
            </span>
            <span v-else>
              <a
                class="a-btn"
                :disabled="errorIndex !== ''"
                @click="editError(index, true)"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteError(index)">
                <a :disabled="errorIndex !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="errorIndex !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addError"
          >新增</a-button
        >
      </a-form-item>

      <a-form-item
        label="调用示例"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <!-- <quill-editor
          v-model="exampleContent"
          ref="exampleEditor"
          :options="editorOption"
        >
        </quill-editor> -->
        <!-- <a-input v-decorator="['test', {}]" placeholder=""></a-input> -->
        <a-textarea
          v-decorator="[
            'test',
            { rules: [{ required: true, message: '请输入调用示例' }] }
          ]"
          placeholder="请输入调用示例"
          :rows="3"
        />
      </a-form-item>

      <a-form-item class="btn-contain" :wrapper-col="{ span: 18, offset: 6 }">
        <a-button type="primary" html-type="submit">
          确定
        </a-button>
        <a-button @click="routeBack">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
// import hljs from "highlight.js";
// import { quillEditor } from "vue-quill-editor";
import { cloneDeep } from "lodash";

// import "highlight.js/styles/tomorrow.css";
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

import ManageService from "@/service/manage";
const manageService = ManageService.getService();

interface header {
  key: string;
  value: string;
  desc: string;
  index?: number;
  editable?: boolean;
}

interface body {
  name: string;
  type: string;
  desc: string;
  required: number;
  index?: number;
  editable?: boolean;
}

interface error {
  code: string;
  msg: string;
  desc: string;
  index?: number;
  editable?: boolean;
}

const baseHeader = {
  key: "",
  value: "",
  desc: ""
};

const baseBody = {
  name: "",
  type: "",
  desc: "",
  required: 1
};

const baseError = {
  code: "",
  msg: "",
  desc: ""
};

@Component({
  components: {
    // quillEditor
  }
})
export default class ApiNew extends Vue {
  form: any = {};
  editType: string = "new";
  interfaceId: any;
  changedService: boolean = false;
  sId: any;

  headers: header[] = [];
  cacheHeaders: header[] = [];
  headerIndex: any = "";
  headerKey: number = 0;
  headerColums: any[] = [
    { title: "参数名", dataIndex: "key", scopedSlots: { customRender: "key" } },
    {
      title: "示例",
      dataIndex: "value",
      scopedSlots: { customRender: "value" }
    },
    {
      title: "参数说明",
      dataIndex: "desc",
      scopedSlots: { customRender: "desc" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      scopedSlots: { customRender: "operation" }
    }
  ];

  bodys: body[] = [];
  cacheBodys: body[] = [];
  bodyIndex: any = "";
  bodyKey: number = 0;
  bodyColums: any[] = [
    {
      title: "属性名",
      dataIndex: "name",
      scopedSlots: { customRender: "name" }
    },
    { title: "类型", dataIndex: "type", scopedSlots: { customRender: "type" } },
    {
      title: "属性说明",
      dataIndex: "desc",
      scopedSlots: { customRender: "desc" }
    },
    {
      title: "是否必选",
      dataIndex: "required",
      scopedSlots: { customRender: "required" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      scopedSlots: { customRender: "operation" }
    }
  ];

  errors: error[] = [];
  cacheErrors: error[] = [];
  errorIndex: any = "";
  errorKey: number = 0;
  errorColums: any[] = [
    {
      title: "状态码",
      dataIndex: "code",
      scopedSlots: { customRender: "code" }
    },
    {
      title: "错误信息",
      dataIndex: "msg",
      scopedSlots: { customRender: "msg" }
    },
    { title: "说明", dataIndex: "desc", scopedSlots: { customRender: "desc" } },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      scopedSlots: { customRender: "operation" }
    }
  ];

  successContent: any =
    '<pre class="ql-syntax" spellcheck="false"><span></span></pre>';
  failContent: any =
    '<pre class="ql-syntax" spellcheck="false"><span></span></pre>';
  exampleContent: any =
    '<pre class="ql-syntax" spellcheck="false"><span></span></pre>';
  successEditor: any;
  failEditor: any;
  exampleEditor: any;

  serviceList: any[] = [];
  requestMethods: any[] = [
    { name: "GET", value: 0 },
    { name: "POST", value: 1 },
    { name: "PUT", value: 2 },
    { name: "PATCH", value: 3 },
    { name: "DELETE", value: 4 }
  ];

  // editorOption: any = {
  //   modules: {
  //     toolbar: [["code-block"]],
  //     syntax: {
  //       highlight: (text: any) => hljs.highlightAuto(text).value
  //     }
  //   }
  // };
  resaa: any;
  created() {
    this.form = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    if (id) {
      this.editType = "edit";
      this.interfaceId = id;
      this.getInterfaceDetail(id);
    }

    this.getServiceList();
  }

  changeService(e: any) {
    this.changedService = true;
  }
  mounted() {
    // this.successEditor = (this.$refs.successEditor as any).quill;
    // this.failEditor = (this.$refs.failEditor as any).quill;
    // this.exampleEditor = (this.$refs.exampleEditor as any).quill;
  }

  async getInterfaceDetail(id: any) {
    const response = await manageService.getInterfaceDetail(id);
    this.resaa = response;

    const {
      name,
      desc,
      address,
      url,
      method,
      sid,
      success,
      fail,
      test,
      headers,
      bodys,
      codes,
      sname
    } = response;
    this.sId = sid;
    this.form.setFieldsValue({
      name,
      desc,
      address,
      url,
      // method,
      sid: sname,
      test,
      method: method - 0,
      // success: JSON.stringify(success),
      // fail: JSON.stringify(fail)
      success: success,
      fail: fail
    });
    headers.forEach((item: header) => {
      this.headers.push({
        ...item,
        index: this.headerKey++
      });
    });
    bodys.forEach((item: body) => {
      this.bodys.push({
        ...item,
        index: this.bodyKey++
      });
    });
    codes.forEach((item: error) => {
      this.errors.push({
        ...item,
        index: this.errorKey++
      });
    });
    this.cacheBodys = cloneDeep(this.bodys);
    this.cacheHeaders = cloneDeep(this.headers);
    this.cacheErrors = cloneDeep(this.errors);
  }

  async getServiceList() {
    const response = await manageService.getServiceListAll();
    this.serviceList = response;
  }

  filterOption(input: string, option: any) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }

  //header编辑
  addHeader() {
    this.headers.push({ ...baseHeader, index: this.headerKey++ });
    this.cacheHeaders = cloneDeep(this.headers);
    this.editHeader(this.headers.length - 1, true);
  }

  editHeader(index: number, type: boolean) {
    const newData = [...this.headers];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheHeaders[index]);
    }
    this.headerIndex = type ? index : "";
    this.headers = newData;
  }

  handleHeaderChange(
    value: string,
    index: number,
    column: "key" | "value" | "desc"
  ) {
    const newData = [...this.headers];
    const target = newData[index];
    target[column] = value;
    this.headers = newData;
  }

  saveHeader(index: number) {
    const newData = [...this.headers];
    const newCacheData = [...this.cacheHeaders];
    const target = newData[index];
    if (target.key == "" || target.value == "") {
      this.$message.error("参数名或者示例不能为空");
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.headers = newData;
    Object.assign(targetCache, target);
    this.cacheHeaders = newCacheData;
    this.headerIndex = "";
  }

  deleteHeader(index: number) {
    const newData = [...this.headers];
    newData.splice(index, 1);
    this.headers = newData;
    this.cacheHeaders = cloneDeep(this.headers);
  }

  //bodys编辑
  addBody() {
    this.bodys.push({ ...baseBody, index: this.bodyKey++ });
    this.cacheBodys = cloneDeep(this.bodys);
    this.editBody(this.bodys.length - 1, true);
  }

  editBody(index: number, type: boolean) {
    const newData = [...this.bodys];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheBodys[index]);
    }
    this.bodyIndex = type ? index : "";
    this.bodys = newData;
  }

  handleBodyChange(
    value: string,
    index: number,
    column: "name" | "type" | "desc"
  ) {
    const newData = [...this.bodys];
    const target = newData[index];
    target[column] = value;
    this.bodys = newData;
  }

  saveBody(index: number) {
    const newData = [...this.bodys];
    const newCacheData = [...this.cacheBodys];
    const target = newData[index];
    if (target.name == "" || target.type == "") {
      this.$message.error("属性名或者类型不能为空");
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.bodys = newData;
    Object.assign(targetCache, target);
    this.cacheBodys = newCacheData;
    this.bodyIndex = "";
  }

  deleteBody(index: number) {
    const newData = [...this.bodys];
    newData.splice(index, 1);
    this.bodys = newData;
    this.cacheBodys = cloneDeep(this.headers);
  }

  //error编辑
  addError() {
    this.errors.push({ ...baseError, index: this.errorKey++ });
    this.cacheErrors = cloneDeep(this.errors);
    this.editError(this.errors.length - 1, true);
  }

  editError(index: number, type: boolean) {
    const newData = [...this.errors];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheErrors[index]);
    }
    this.errorIndex = type ? index : "";
    this.errors = newData;
  }

  handleErrorChange(
    value: string,
    index: number,
    column: "code" | "msg" | "desc"
  ) {
    const newData = [...this.errors];
    const target = newData[index];
    target[column] = value;
    this.errors = newData;
  }

  saveError(index: number) {
    const newData = [...this.errors];
    const newCacheData = [...this.cacheErrors];
    const target = newData[index];
    if (target.code == "" || target.msg == "") {
      this.$message.error("状态码或者错误信息不能为空");
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.errors = newData;
    Object.assign(targetCache, target);
    this.cacheErrors = newCacheData;
    this.errorIndex = "";
  }

  deleteError(index: number) {
    const newData = [...this.errors];
    newData.splice(index, 1);
    this.errors = newData;
    this.cacheErrors = cloneDeep(this.errors);
  }

  formatData(data: any) {
    data.map((item: any) => {
      delete item.index;
      delete item.editable;
    });
    return data;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      const headers = this.formatData(cloneDeep(this.headers));
      const bodys = this.formatData(cloneDeep(this.bodys));
      const errors = this.formatData(cloneDeep(this.errors));
      // const success = this.successEditor.getText()
      // const fail = this.failEditor.getText()
      // const test = this.exampleEditor.getText()
      let { success, fail } = values;
      try {
        // success = JSON.parse(success);
        // fail = JSON.parse(fail);
        const params = {
          ...values,
          // success,
          // fail,
          // test,
          headers,
          bodys,
          success,
          fail,
          codes: errors
        };
        console.log(params);
        this.editType === "new" ? this.submit(params) : this.update(params);
      } catch (e) {
        // console.log(e)
        this.$message.warning("请检查成功/失败返回值示例是否为json格式！");
      }
    });
  }

  async submit(params: any) {
    const response = await manageService.newInterface({
      ...params,
      modifyPerson: "admin" //后续改为登陆用户
    });
    if (response) {
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    if (!this.changedService) {
      params.sid = this.sId;
    }
    const response = await manageService.updateInterface({
      ...params,
      id: this.interfaceId,
      modifyPerson: "admin" //后续改为登陆用户
    });
    if (response) {
      this.$message.success("编辑成功");
      this.routeBack();
    }
  }

  routeBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.a-btn {
  margin-right: 6px;
}
</style>
