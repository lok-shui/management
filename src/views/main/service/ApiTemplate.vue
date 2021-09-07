<template>
  <div class="form-contain">
    <h1 v-if="editType !== 'edit' && templateFade == true">新增模板</h1>
    <h1 v-if="editType !== 'edit' && fadeItem == true">新增接口</h1>
    <h1 v-if="editType == 'edit' && templateFade == true">编辑模板</h1>
    <h1 v-if="editType == 'edit' && fadeItem == true">编辑接口</h1>

    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="选择模板"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-show="editType !== 'edit' && fadeItem == true"
      >
        <a-select
          showSearch
          v-decorator="[
            'template',
            { rules: [{ required: false, message: '请选择模板' }] }
          ]"
          placeholder="请选择模板"
          optionFilterProp="name"
          :filterOption="filterOption"
          @change="changeTemplate"
        >
          <a-select-option
            v-for="item in templateList"
            :key="item.interfaceId"
            :value="item.interfaceId"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="接口名称"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-show="fadeItem"
      >
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: checkname, message: '请输入接口名称' },
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
        v-show="fadeItem"
      >
        <a-input
          v-decorator="[
            'desc',
            {
              rules: [
                { required: checkdesc, message: '请输入接口描述' },
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
        v-show="fadeItem"
      >
        <a-select
          showSearch
          v-decorator="[
            'sid',
            { rules: [{ required: checksid, message: '请选择服务' }] }
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
        label="模板名称"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-show="templateFade"
      >
        <a-input
          v-decorator="[
            'name',
            {
              rules: [
                { required: checktTname, message: '请输入模板名称' },
                { max: 50, message: '输入长度不能超过50' }
              ]
            }
          ]"
          placeholder="输入模板名称"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="域名或服务器IP+端口"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'address',
            {
              rules: [{ required: true, message: '请输入域名或服务器IP端口' }]
            }
          ]"
          placeholder="如：http://service-manager.mis.dev.dm-ai.cn"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="url"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'url',
            { rules: [{ required: true, message: '请输入URL' }] }
          ]"
          placeholder="如：/model.ai/crnn"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="应用名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'host',
            {
              rules: [
                {
                  required: true,
                  message:
                    'ADP部署方式为应用名+*，容器化部署方式请联系运维沟通填写方式'
                }
              ]
            }
          ]"
          placeholder="ADP部署方式为应用名+*，容器化部署方式请联系运维沟通填写方式"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="使用限制"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="['limit', {}]"
          placeholder="文件大小不能超过2M"
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
          placeholder="如:GET"
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
        label="请求头集合"
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

          <template slot="required" slot-scope="required, row">
            <a-checkbox
              v-if="row.editable"
              :defaultChecked="!!required"
              @change="
                e =>
                  handleHeaderChange(
                    e.target.checked ? 1 : 0,
                    index,
                    'required'
                  )
              "
            />
            <span v-else>{{ required ? "是" : "否" }}</span>
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
          >新增
        </a-button>
      </a-form-item>

      <a-form-item
        label="请求体集合"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-table
          :columns="bodyColums"
          :dataSource="bodies"
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
          >新增
        </a-button>
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
        label="返回值说明"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-table
          :columns="returnDatasColums"
          :dataSource="returnDatas"
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
                @change="
                  e => handleReturnDatasChange(e.target.value, index, col)
                "
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a class="a-btn" @click="saveReturnDatas(index)">保存</a>
              <a @click="editReturnDatas(index, false)">取消</a>
            </span>
            <span v-else>
              <a
                class="a-btn"
                :disabled="returnDatasIndex !== ''"
                @click="editReturnDatas(index, true)"
                >编辑</a
              >
              <a-popconfirm
                title="确认删除？"
                @confirm="deleteReturnDatas(index)"
              >
                <a :disabled="returnDatasIndex !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="returnDatasIndex !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addReturnDatas"
          >新增
        </a-button>
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
          >新增
        </a-button>
      </a-form-item>

      <a-form-item
        label="脚本执行命令"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-textarea
          v-decorator="[
            'testscript',
            { rules: [{ required: true, message: '请输入脚本执行命令' }] }
          ]"
          placeholder="请输入脚本执行命令"
          :rows="3"
        />
      </a-form-item>

      <a-form-item
        label="脚本文件上传"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-if="fadeItem"
      >
        <a-table
          :columns="ScriptFileColumns"
          :dataSource="scriptFile"
          rowKey="index"
          :locale="{
            emptyText: '暂无数据'
          }"
          :pagination="false"
        >
          <template slot="type" slot-scope="type, row, index">
            <div>
              <a-input
                v-if="row.editable"
                :value="type"
                :disabled="editClientNameEnable"
                @change="
                  e => handleScriptFileChange(e.target.value, index, 'type')
                "
              />
              <span v-else>{{ type }}</span>
            </div>
          </template>

          <template slot="file" slot-scope="file, row, index">
            <a-upload
              :disabled="!row.editable"
              name="file"
              :multiple="false"
              :fileList="ScriptFileArray[index]"
              @change="handleChange(file, row, index, $event)"
              :before-upload="() => false"
            >
              <a-button>
                <a-icon type="upload" />
                Click to Upload
              </a-button>
            </a-upload>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a class="a-btn" @click="saveScriptFile(index)">保存</a>
              <a @click="editScriptFile(index, false)">取消</a>
            </span>
            <span v-else>
              <a
                class="a-btn"
                :disabled="scriptFileIndex !== ''"
                @click="editScriptFile(index, true)"
                >编辑</a
              >
              <a-popconfirm
                title="确认删除？"
                @confirm="deleteScriptFile(index)"
              >
                <a :disabled="scriptFileIndex !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="scriptFileIndex !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addScriptFile"
          >新增
        </a-button>
      </a-form-item>

      <a-form-item
        label="资源文件上传(支持多文件上传)"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-if="fadeItem"
      >
        <a-upload
          name="file"
          list-type="picture"
          :fileList="photoList"
          @change="MultiFileHandleChange"
          :customRequest="() => {}"
        >
          <a-button type="default">
            <a-icon type="upload" />
            Click to Upload
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item
        class="btn-contain"
        :wrapper-col="{ span: 18, offset: 12 }"
        style="margin-top: 30px; margin-bottom: 100px"
      >
        <a-button type="primary" html-type="submit" :loading="submitLoading">
          确定
        </a-button>
        <a-button @click="routeBack">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import hljs from "highlight.js";
import { quillEditor } from "vue-quill-editor";
import { cloneDeep } from "lodash";

import "highlight.js/styles/tomorrow.css";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import ManageService from "@/service/manage";

const manageService = ManageService.getService();

interface header {
  key: string;
  value: string;
  desc: string;
  index?: number;
  editable?: boolean;
}

interface photos {
  id: number;
  interfaceId: number;
  url: string;
  order: number;
  index?: number;
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

interface returnDatas {
  type: string;
  name: string;
  desc: string;
  index?: number;
  editable?: boolean;
}

interface scriptFile {
  type: string;
  file: File | null | string;
  index?: number;
  editable?: boolean;
}

const baseHeader = {
  key: "",
  value: "",
  desc: "",
  required: 1
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

const baseReturnDatas = {
  name: "",
  type: "",
  desc: ""
};

const baseScriptFile = {
  type: "",
  file: null
};

@Component({
  components: {
    quillEditor
  }
})
export default class ApiTemplate extends Vue {
  form: any = {};
  editType: string = "new";
  interfaceId: any;
  changedService: boolean = false;

  headers: header[] = [];

  testFileName: string = ""; // 上传单个文件的名字

  ScriptFileArray: Object[][] = [[]];

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

  bodies: body[] = [];
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

  returnDatas: returnDatas[] = [];
  cacheReturnDatas: returnDatas[] = [];
  returnDatasIndex: any = "";
  returnDatasKey: number = 0;
  returnDatasColums: any[] = [
    {
      title: "参数名",
      dataIndex: "name",
      scopedSlots: { customRender: "name" }
    },
    {
      title: "参数类型",
      dataIndex: "type",
      scopedSlots: { customRender: "type" }
    },
    { title: "说明", dataIndex: "desc", scopedSlots: { customRender: "desc" } },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      scopedSlots: { customRender: "operation" }
    }
  ];

  scriptFile: scriptFile[] = [];
  cacheScriptFile: scriptFile[] = [];
  scriptFileIndex: any = "";
  scriptFileKey: number = 0;
  ScriptFileColumns: any[] = [
    {
      title: "代码类型",
      dataIndex: "type",
      scopedSlots: { customRender: "type" }
    },
    {
      title: "文件",
      dataIndex: "file",
      scopedSlots: { customRender: "file" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 100,
      scopedSlots: { customRender: "operation" }
    }
  ];

  serviceList: any[] = [];
  requestMethods: any[] = [
    { name: "GET", value: 0 },
    { name: "POST", value: 1 },
    { name: "PUT", value: 2 },
    { name: "PATCH", value: 3 },
    { name: "DELETE", value: 4 }
  ];

  editorOption: any = {
    modules: {
      toolbar: [["code-block"]],
      syntax: {
        highlight: (text: any) => hljs.highlightAuto(text).value
      }
    }
  };

  formData: any[] = [];
  files: any = {};
  fadeItem: boolean = false; // 显示‘新增接口’页面
  templateFade: boolean = false; // 显示‘新增模板’页面
  checktTname: boolean = false; // 是否验证'模板名称'
  checkname: boolean = false; // 是否验证'接口名称'
  checkdesc: boolean = false; // 是否验证'接口描述'
  checksid: boolean = false; // 是否验证'服务id'

  formid: number = -1; // 调用第二个接口时传的id
  photoList: any = []; // 上传多个文件的photo

  templateList: any = [];

  eventType: string = "new";

  deleteFliesNameList: any = [];
  uploadFilesList: any = [];
  oldClients: any = [];

  created() {
    this.form = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    const event = this.$route.query.event;
    const type = this.$route.query.type;

    if (id) {
      this.editType = "edit";
      this.interfaceId = id;
      this.formid = Number(id);
      this.getInterfaceDetail(id);
      if (type == "0") {
        this.fadeItem = true;
      } else {
        this.templateFade = true;
      }
    }
    // 判断是不是'新增接口'页面
    if (event == "new") {
      this.fadeItem = true;
      this.checktTname = false;
      this.checkname = true;
      this.checkdesc = true;
      this.checksid = true;

      this.getTemplateList();
    }
    // 判断是不是'新增模板'页面
    if (event == "template") {
      this.templateFade = true;
      this.checktTname = true;
      this.checkname = false;
      this.checkdesc = false;
      this.checksid = false;
    }
    this.getServiceList();
  }

  changeService(e: any) {
    this.changedService = true;
  }

  async getTemplateList() {
    const response = await manageService.getTemplateList();
    this.templateList = response;
  }

  changeTemplate(id: any) {
    this.getInterfaceDetail(id);
  }

  async getInterfaceDetail(id: any) {
    const response = await manageService.getInterfaceDetail(id);
    const {
      name,
      desc,
      address,
      url,
      host,
      method,
      sid,
      success,
      fail,
      headers,
      bodies,
      codes,
      limit,
      testscript,
      clientcodes,
      returndatas,
      photo
    } = response;
    this.formid = id;
    console.log("testFileName", this.testFileName);
    this.form.setFieldsValue({
      //tname,
      name,
      desc,
      address,
      url,
      host,
      // method,
      sid,
      limit,
      testscript,
      method: method - 0,
      // success: JSON.stringify(success),
      // fail: JSON.stringify(fail)
      success: success,
      fail: fail
    });
    this.headers = [];
    headers.forEach((item: header) => {
      this.headers.push({
        ...item,
        index: this.headerKey++
      });
    });
    this.bodies = [];
    bodies.forEach((item: body) => {
      this.bodies.push({
        ...item,
        index: this.bodyKey++
      });
    });
    this.errors = [];
    codes.forEach((item: error) => {
      this.errors.push({
        ...item,
        index: this.errorKey++
      });
    });
    this.returnDatas = [];
    returndatas.forEach((item: returnDatas) => {
      this.returnDatas.push({
        ...item,
        index: this.returnDatasKey++
      });
    });

    this.scriptFile = [];
    let index = 0;
    clientcodes.forEach((item: any) => {
      this.scriptFile.push({
        type: item.clientName,
        file: item.downloadUrl,
        index: this.scriptFileKey++
      });
      this.ScriptFileArray[index] = [];
      this.ScriptFileArray[index].push({
        uid: Math.random() * 100,
        name: item.fileName,
        url: item.downloadUrl
      });
      index++;
    });
    this.cacheBodys = cloneDeep(this.bodies);
    this.cacheHeaders = cloneDeep(this.headers);
    this.cacheErrors = cloneDeep(this.errors);
    this.cacheReturnDatas = cloneDeep(this.returnDatas);
    this.cacheScriptFile = cloneDeep(this.scriptFile);
    photo.forEach((item: any) => {
      this.photoList.push({ ...item });
    });
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
    this.bodies.push({ ...baseBody, index: this.bodyKey++ });
    this.cacheBodys = cloneDeep(this.bodies);
    this.editBody(this.bodies.length - 1, true);
  }

  editBody(index: number, type: boolean) {
    const newData = [...this.bodies];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheBodys[index]);
    }
    this.bodyIndex = type ? index : "";
    this.bodies = newData;
  }

  handleBodyChange(
    value: string,
    index: number,
    column: "name" | "type" | "desc"
  ) {
    const newData = [...this.bodies];
    const target = newData[index];
    target[column] = value;
    this.bodies = newData;
  }

  saveBody(index: number) {
    const newData = [...this.bodies];
    const newCacheData = [...this.cacheBodys];
    const target = newData[index];
    if (target.name == "" || target.type == "") {
      this.$message.error("属性名或者类型不能为空");
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.bodies = newData;
    Object.assign(targetCache, target);
    this.cacheBodys = newCacheData;
    this.bodyIndex = "";
  }

  deleteBody(index: number) {
    const newData = [...this.bodies];
    newData.splice(index, 1);
    this.bodies = newData;
    this.cacheBodys = cloneDeep(this.headers);
  }

  //returnDatas编辑
  addReturnDatas() {
    this.returnDatas.push({ ...baseReturnDatas, index: this.returnDatasKey++ });
    this.cacheReturnDatas = cloneDeep(this.returnDatas);
    this.editReturnDatas(this.returnDatas.length - 1, true);
  }

  editReturnDatas(index: number, type: boolean) {
    const newData = [...this.returnDatas];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheReturnDatas[index]);
    }
    this.returnDatasIndex = type ? index : "";
    this.returnDatas = newData;
  }

  handleReturnDatasChange(
    value: string,
    index: number,
    column: "name" | "type" | "desc"
  ) {
    const newData = [...this.returnDatas];
    const target = newData[index];
    target[column] = value;
    this.returnDatas = newData;
  }

  saveReturnDatas(index: number) {
    const newData = [...this.returnDatas];
    const newCacheData = [...this.cacheReturnDatas];
    const target = newData[index];
    if (target.type == "" || target.name == "") {
      this.$message.error("参数名或者类型不能为空");
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.returnDatas = newData;
    Object.assign(targetCache, target);
    this.cacheReturnDatas = newCacheData;
    this.returnDatasIndex = "";
  }

  deleteReturnDatas(index: number) {
    const newData = [...this.returnDatas];
    newData.splice(index, 1);
    this.returnDatas = newData;
    this.cacheReturnDatas = cloneDeep(this.returnDatas);
  }

  // ScriptFile编辑
  addScriptFile() {
    this.scriptFile.push({ ...baseScriptFile, index: this.scriptFileKey++ });
    this.cacheScriptFile = cloneDeep(this.scriptFile);
    this.editScriptFile(this.scriptFile.length - 1, true);
  }

  editClientNameEnable: boolean = false;
  editScriptFile(index: number, type: boolean) {
    // 判断下是否可以编辑名字
    if (typeof this.scriptFile[index].file === "string") {
      this.editClientNameEnable = true;
    }
    const newData = [...this.scriptFile];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheScriptFile[index]);
    }
    this.scriptFileIndex = type ? index : "";
    this.scriptFile = newData;
  }

  handleScriptFileChange(value: string, index: number, column: "type") {
    const newData = [...this.scriptFile];
    const target = newData[index];
    target[column] = value;
    this.scriptFile = newData;
  }

  saveScriptFile(index: number) {
    const newData = [...this.scriptFile];
    const newCacheData = [...this.cacheScriptFile];
    const target = newData[index];
    if (target.type == "") {
      this.$message.error("参数名或者示例不能为空");
      return;
    }
    if (!this.ScriptFileArray[index].length) {
      this.$message.error("请上传文件");
      return;
    }
    let flag = 0;
    this.scriptFile.forEach((item: any) => {
      if (item.type === this.scriptFile[index].type && index != item.index) {
        this.$message.error("代码类型名称已存在,不允许重复");
        flag = 1;
      }
    });
    if (flag === 1) {
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.scriptFile = newData;
    Object.assign(targetCache, target);
    this.cacheScriptFile = newCacheData;
    this.scriptFileIndex = "";
  }

  deleteScriptFile(index: number) {
    this.oldClients.push(this.scriptFile[index].type);
    this.ScriptFileArray[index] = [];

    const newData = [...this.scriptFile];
    newData.splice(index, 1);
    this.scriptFile = newData;
    this.cacheScriptFile = cloneDeep(this.scriptFile);
  }

  // 当前API特有的ERROR_MESSAG 编辑
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

  // 当前API特有的ERROR_MESSAG 编辑 end

  submitLoading = false;
  // 提交调用得接口
  handleSubmit(e: any) {
    this.submitLoading = true;
    e.preventDefault();
    this.form.validateFields(async (err: any, values: any) => {
      if (err) {
        this.submitLoading = false;
        return;
      }
      this.headers.forEach((item: any) => {
        delete item.id;
      });
      this.bodies.forEach((item: any) => {
        delete item.id;
      });
      this.errors.forEach((item: any) => {
        delete item.id;
      });
      this.returnDatas.forEach((item: any) => {
        delete item.id;
      });

      const headers = this.formatData(cloneDeep(this.headers));
      const bodies = this.formatData(cloneDeep(this.bodies));
      const errors = this.formatData(cloneDeep(this.errors));
      const returnDatas = this.formatData(cloneDeep(this.returnDatas));
      let { success, fail } = values;
      try {
        const params = {
          ...values,
          headers,
          bodies,
          success,
          returndatas: returnDatas,
          fail,
          codes: errors
        };
        console.log(params, "---------------------------------");
        this.editType === "new"
          ? await this.newInterface(params)
          : await this.update(params);
      } catch (e) {
        this.$message.warning("请检查成功/失败返回值示例是否为json格式！");
      } finally {
        this.submitLoading = false;
      }
    });
  }

  async newInterface(params: any) {
    this.templateFade
      ? Object.assign(params, { type: 1 })
      : Object.assign(params, { type: 0 });

    const response = await manageService.newInterface({
      ...params,
      modifyPerson: "admin" //后续改为登陆用户
    });
    if (response) {
      this.newInterfaceSaveFile(response);
      this.$message.success("新增成功");
    }
  }

  async update(params: any) {
    const response = await manageService.updateInterface({
      ...params,
      id: this.interfaceId,
      modifyPerson: "admin" //后续改为登陆用户
    });
    if (response) {
      this.editInterfaceSaveFile(this.interfaceId);
      this.$message.success("编辑成功");
    }
  }

  routeBack() {
    this.$router.go(-1);
  }

  MultiFileHandleChange(info: any) {
    if (this.photoList != null && info.file.status.indexOf("removed") == -1) {
      const isExist = this.photoList.some((item: any) => {
        if (info.file.name == item.name) {
          this.$message.warn("文件已近存在");
          return true;
        }
      });

      if (isExist) return;
    }

    console.log(info);
    let fileList = [...info.fileList];

    if (info.file.status.indexOf("removed") !== -1 && info.file.url != null) {
      this.deleteFliesNameList.push(info.file.name);
    }

    console.log(this.deleteFliesNameList, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    // 图片展示用的
    this.photoList = fileList;

    this.uploadFilesList = fileList.filter(item => {
      return item.status != null;
    });
  }

  newInterfaceSaveFile(id: any) {
    let formData = new FormData();

    console.log(
      this.uploadFilesList,
      "-------------------------------------------this.uploadFilesList"
    );

    this.uploadFilesList.forEach((item: any) => {
      formData.append("files", item.originFileObj);
    });

    this.scriptFile.forEach((item: any) => {
      formData.append(item.type, item.file);
    });

    formData.append("default", "default");

    const response = manageService.newInterfaceUploadFile(formData, id);
    if (response) {
      this.$router.go(-1);
    }
  }

  editInterfaceSaveFile(id: any) {
    let formData = new FormData();

    console.log(
      this.uploadFilesList,
      "-------------------------------------------this.uploadFilesList"
    );

    this.uploadFilesList.forEach((item: any) => {
      formData.append("files", item.originFileObj);
    });

    // todo 收集scriptFile被删除的文件
    formData.append("oldFiles", this.deleteFliesNameList);

    formData.append("default", "default");

    this.scriptFile.forEach((item: any) => {
      if (typeof item.file != "string") {
        formData.append(item.type, item.file);
      }
    });

    formData.append("oldClients", this.oldClients);

    const response = manageService.editInterfaceUploadFile(formData, id);
    if (response) {
      this.$router.go(-1);
    }
  }

  handleChange(file: any, row: any, index: any, e: any) {
    e.fileList = e.fileList.slice(-1);
    this.ScriptFileArray.splice(index, 1, e.fileList);

    console.log("this.ScriptFileArray!!!!!!!!");
    console.log(this.ScriptFileArray[index]);
    if (typeof this.scriptFile[index].file === "string") {
      this.oldClients.push(this.scriptFile[index].type);
    }

    const fileObj = e.file;
    this.scriptFile[index].file = fileObj;

    console.log("this.scriptFile");
    console.log(this.scriptFile);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";

.a-btn {
  margin-right: 6px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  letter-spacing: 5px;
}
</style>
