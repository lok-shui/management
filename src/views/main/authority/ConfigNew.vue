<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="配置名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入配置名' }] }
          ]"
          placeholder="请输入配置名"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="配置值"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'value',
            { rules: [{ required: true, message: '请输入配置值' }] }
          ]"
          placeholder="请输入配置值"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="类型"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          v-decorator="['type', { initialValue: '服务组' }]"
          placeholder="请选择类型"
        >
          <a-select-option v-for="item in typeList" :key="item.name">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="描述"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-textarea
          v-decorator="[
            'desc',
            { rules: [{ max: 500, message: '描述长度不能超过500' }] }
          ]"
          placeholder="请输入描述"
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
import AuthorityService from "@/service/authority";

const authorityService = AuthorityService.getService();

@Component
export default class ConfigNew extends Vue {
  form: any = {};
  editType: string = "new";
  configId: any;

  typeList: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    if (id) {
      this.editType = "edit";
      this.configId = id;
      this.getConfigDetail(id);
    }

    this.getTypeList();
  }

  async getConfigDetail(id: any) {
    const response = await authorityService.getConfigDetail(id);
    const { name, value, type, desc } = response;
    this.form.setFieldsValue({
      name,
      value,
      type,
      desc
    });
  }

  async getTypeList() {
    const response = await authorityService.getConfigList({
      type: "配置类型"
    });
    this.typeList = response;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      console.log(values);
      if (err) return;
      this.editType === "new" ? this.submit(values) : this.update(values);
    });
  }

  async submit(params: any) {
    const response = await authorityService.newConfig(params);
    if (response) {
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    const response = await authorityService.updateConfig({
      ...params,
      id: this.configId
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
@import "./basic.scss";
</style>
