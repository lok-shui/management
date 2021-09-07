<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="角色名称"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          :disabled="editType === 'edit'"
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入角色名称' }] }
          ]"
          placeholder="请输入角色名称"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="角色权限"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          mode="multiple"
          v-decorator="[
            'authorities',
            { rules: [{ required: true, message: '请选择角色权限' }] }
          ]"
          placeholder="请选择角色权限"
        >
          <a-select-option
            v-for="item in authorityClass"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="角色描述"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-textarea
          v-decorator="['roleDesc', { rules: [{ required: false }] }]"
          placeholder="请输入角色描述"
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
export default class AdminNew extends Vue {
  form: any = {};
  editType: string = "new";
  status: string = "active";
  roleName: any = "";
  id: number = -1;

  authorityClass: any[] = [];
  authorityList: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});
    const name = this.$route.query.name;
    if (name) {
      this.editType = "edit";
      this.roleName = name;
      this.getRoleDetail(name as string);
    }

    this.getAuthorityClass();
  }

  async getAuthorityClass() {
    const response = await authorityService.getClassNameList();
    this.authorityClass = response;
  }

  async getRoleDetail(roleName: string) {
    const response = await authorityService.getRoleDetail({ name: roleName });
    response.authorities.map((item: any) => {
      this.authorityList.push(item.id);
    });
    const { roleDesc, name, id } = response;
    this.id = id;
    this.form.setFieldsValue({
      id,
      roleDesc,
      name,
      authorities: this.authorityList
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      console.log(values);
      if (err) return;

      // if (this.editType === "edit" && this.oldRoleClass !== values.roleClass) {
      //   values.oldRoleClass = this.oldRoleClass;
      // }

      this.editType === "new" ? this.submit(values) : this.update(values);
    });
  }

  async submit(params: any) {
    const authoritiesObject = params.authorities.map((item: any) => {
      return { id: item };
    });
    const response = await authorityService.newRole({
      name: params.name,
      roleDesc: params.roleDesc,
      authorities: authoritiesObject
    });
    if (response) {
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    const authoritiesObject = params.authorities.map((item: any) => {
      return { id: item };
    });
    const response = await authorityService.updateRole({
      name: params.name,
      roleDesc: params.roleDesc,
      authorities: authoritiesObject,
      id: this.id
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
