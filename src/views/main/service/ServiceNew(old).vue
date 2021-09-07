<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="服务名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入服务名' }] }
          ]"
          placeholder="请输入服务名"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="服务类型"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-radio-group
          :options="typeList"
          v-decorator="['type', { initialValue: 1 }]"
        />
      </a-form-item>

      <a-form-item
        label="服务组"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          showSearch
          v-decorator="['gid', {}]"
          placeholder="请选择服务组"
          optionFilterProp="name"
          :filterOption="filterOption"
          @change="selectChange"
        >
          <a-select-option
            v-for="item in serviceGroup"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="状态"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-radio-group
          :options="statusList"
          v-decorator="['actived', { initialValue: 0 }]"
        />
      </a-form-item>

      <!--      <a-form-item-->
      <!--        label="展示页地址"-->
      <!--        :label-col="{ span: 6 }"-->
      <!--        :wrapper-col="{ span: 18 }"-->
      <!--      >-->
      <!--        <a-input-->
      <!--          v-decorator="[-->
      <!--            'showUrl',-->
      <!--            { rules: [{ required: true, message: '请输入展示页地址' }] }-->
      <!--          ]"-->
      <!--          placeholder="请输入展示页地址"-->
      <!--        ></a-input>-->
      <!--      </a-form-item>-->

      <a-form-item
        label="描述（可选）"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-textarea
          v-decorator="['desc', {}]"
          placeholder="请输入描述"
          :rows="3"
        />
      </a-form-item>

      <a-form-item
        label="使用场景"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-table
          :columns="sceneColums"
          :data-source="scenes"
          rowKey="index"
          :locale="{
            emptyText: '暂无数据'
          }"
          :pagination="false"
        >
          <template
            v-for="col in ['theme', 'content']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="e => handleSceneChange(e.target.value, index, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a class="a-btn" @click="saveScene(index)">保存</a>
              <a @click="editScene(index, false)">取消</a>
            </span>
            <span v-else>
              <a
                class="a-btn"
                :disabled="sceneIndex !== ''"
                @click="editScene(index, true)"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteScene(index)">
                <a :disabled="sceneIndex !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="sceneIndex !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addScene"
          >新增</a-button
        >
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
import ManageService from "@/service/manage";
import AuthorityService from "@/service/authority";
import { cloneDeep } from "lodash";

const manageService = ManageService.getService();
const authorityService = AuthorityService.getService();

// '使用场景'
interface scenes {
  title: string;
  theme: string;
  content: string;
  index?: number;
  editable?: boolean;
}
const baseScene = {
  title: "",
  theme: "",
  content: ""
};

@Component
export default class ServiceNew extends Vue {
  form: any = {};
  editType: string = "new";
  serviceId: any;
  changeGId: boolean = true;
  gId: any = {};
  videoList: any = [];

  // '服务类型'
  typeList: any[] = [
    { label: "API", value: 1 },
    { label: "SDK", value: 0 }
  ];

  // '状态'
  statusList: any[] = [
    { label: "上线", value: 1 },
    { label: "下线", value: 0 }
  ];

  // '服务组'
  serviceGroup: any[] = [];

  // '使用场景'
  sceneIndex: any = "";
  scenes: scenes[] = [];
  scenesKey: number = 0;
  cacheScenes: scenes[] = []; // 缓存'使用场景'的数据
  sceneColums: any[] = [
    {
      title: "标题",
      dataIndex: "theme",
      scopedSlots: { customRender: "theme" }
    },
    {
      title: "内容",
      dataIndex: "content",
      scopedSlots: { customRender: "content" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 120,
      scopedSlots: { customRender: "operation" }
    }
  ];

  created() {
    this.form = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    if (id) {
      this.editType = "edit";
      this.serviceId = id;
      this.getServiceDetail(id);
    }

    this.getServiceGroup();
  }

  mounted() {}

  // 编辑页面的接口
  async getServiceDetail(id: any) {
    const response = await manageService.getServiceDetail(id);
    // console.log(response);
    const {
      gid,
      name,
      type,
      actived,
      desc,
      showUrl,
      gname,
      scenes,
      showVideo
    } = response;
    this.gId = gid;
    this.form.setFieldsValue({
      gid: gname,
      name,
      type,
      actived,
      desc,
      showUrl
    });

    scenes.forEach((item: scenes) => {
      this.scenes.push({
        ...item,
        index: this.scenesKey++
      });
    });
  }

  // '服务组'选项接口
  async getServiceGroup() {
    // const response = await manageService.getServiceGroup();
    // this.serviceGroup = response;
    const response = await authorityService.getConfigList({
      type: "服务组"
    });
    // console.log("response", response);
    this.serviceGroup = response;
  }
  // '服务组'选项
  filterOption(input: string, option: any) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }
  // '服务组'选项
  selectChange() {
    this.changeGId = false;
  }

  // 表单验证并提交 --- start
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      // console.log(values);
      if (err) return;
      const scenes = this.formatData(cloneDeep(this.scenes));
      let { success, fail } = values;
      try {
        // success = JSON.parse(success);
        // fail = JSON.parse(fail);
        const params = {
          ...values,
          // success,
          // fail,
          // test,
          scenes,

          success,
          fail
        };
        values = params;
        console.log("values", values);
        this.editType === "new" ? this.submit(params) : this.update(params);
      } catch (e) {
        // console.log(e)
        this.$message.warning("请检查成功/失败返回值示例是否为json格式！");
      }
    });
  }

  async submit(params: any) {
    const response = await manageService.newService({
      ...params,
      person: "admin" //后续改为登陆用户
    });
    if (response) {
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    // console.log("编辑1", params);
    if (this.changeGId) {
      params.gid = this.gId;
    }
    const response = await manageService.updateService({
      ...params,
      id: this.serviceId,
      person: "admin" //后续改为登陆用户
    });
    // console.log("编辑2", response);
    if (response) {
      this.$message.success("编辑成功");
      this.routeBack();
    }
  }
  formatData(data: any) {
    data.map((item: any) => {
      delete item.index;
      delete item.editable;
    });
    return data;
  }
  // 表单验证并提交 --------- end

  // '使用场景'选项
  handleSceneChange(
    value: string,
    index: number,
    column: "title" | "theme" | "content"
  ) {
    const newData = [...this.scenes];
    const target: any = newData[index];

    target[column] = value;
    this.scenes = newData;
  }
  // 编辑'使用场景'选项
  editScene(index: number, type: boolean) {
    const newData = [...this.scenes];
    const target = newData[index];
    target.editable = type;
    if (!type) {
      Object.assign(target, this.cacheScenes[index]);
    }

    // console.log("edit", target.editable);

    this.scenes = newData;
  }
  // 保存'使用场景'选项
  saveScene(index: number) {
    const newData = [...this.scenes];
    const newCacheData = [...this.cacheScenes];
    const target = newData[index];
    // console.log("target", target);
    if (target.theme == "" || target.content == "") {
      this.$message.error("参数名或者示例不能为空");
      return;
    }
    const targetCache = newCacheData[index];
    delete target.editable;
    this.scenes = newData;
    Object.assign(targetCache, target);
    this.cacheScenes = newCacheData;
    this.sceneIndex = "";
  }
  // 新增'使用场景'选项
  addScene() {
    this.scenes.push({ ...baseScene, index: this.scenesKey++ });
    this.cacheScenes = cloneDeep(this.scenes);
    this.editScene(this.scenes.length - 1, true);
  }
  // 删除'使用场景'选项
  deleteScene(index: number) {
    const newData = [...this.scenes];
    newData.splice(index, 1);
    this.scenes = newData;
    this.cacheScenes = cloneDeep(this.scenes);
  }

  routeBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.a-btn {
  margin-right: 20px;
}
</style>
