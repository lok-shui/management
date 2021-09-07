<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="用户名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          :disabled="editType === 'edit'"
          v-decorator="[
            'username',
            { rules: [{ required: true, message: '请输入账号' }] }
          ]"
          placeholder="请输入账号"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="密码"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        v-if="editType === 'new'"
      >
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码' }] }
          ]"
          placeholder="请输入账号"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="手机号"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'phone',
            { rules: [{ required: true, message: '请输入手机号' }] }
          ]"
          placeholder="请输入手机号"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="公司名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'company',
            { rules: [{ required: false, message: '请输入公司名' }] }
          ]"
          placeholder="请输入公司名"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="邮箱"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'email',
            { rules: [{ required: true, message: '请输入邮箱' }] }
          ]"
          placeholder="请输入邮箱"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="真实姓名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'realName',
            { rules: [{ required: false, message: '请输入真实姓名' }] }
          ]"
          placeholder="请输入真实姓名"
        ></a-input>
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
import ClientService from "@/service/client";

const clientService = ClientService.getService();

@Component
export default class UserNew extends Vue {
  form: any = {};
  editType: string = "new";
  status: string = "active";
  clientId: any = "";

  created() {
    this.form = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    if (id) {
      this.editType = "edit";
      this.clientId = id;
      this.getClientDetail(id as string);
    }
  }

  async getClientDetail(clientId: string) {
    const response = await clientService.getClientDetail(clientId);
    const { username, phone, company, email, realName } = response;
    this.form.setFieldsValue({
      username,
      phone,
      company,
      email,
      realName
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      console.log(values);
      if (err) return;
      this.editType === "new"
        ? this.registerClient(values)
        : this.update(values);
    });
  }

  async registerClient(params: any) {
    console.log("新增方法");
    const response = await clientService.registerClient({
      ...params,
      isVerify: false
    });
    if (response) {
      this.$message.success("新增成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    const response = await clientService.updateClient(this.clientId, {
      ...params
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
</style>
