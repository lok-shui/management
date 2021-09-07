<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="管理员账号"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          showSearch
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请选择管理员账号' }] }
          ]"
          placeholder="请选择管理员账号"
          optionFilterProp="username"
          :filterOption="filterOption"
        >
          <a-select-option
            v-for="item in userList"
            :key="item.cn"
            :value="item.cn"
          >
            {{ item.displayName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="关联角色"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          mode="multiple"
          v-decorator="['role', {}]"
          placeholder="请选择关联角色"
        >
          <a-select-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
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
  adminId: number = -1;
  userList: any[] = [];

  roleList: any[] = ["管理员", "普通管理员", "审核员"];

  created() {
    this.form = this.$form.createForm(this, {});
    const name = this.$route.query.name;
    if (name) {
      this.editType = "edit";
      console.log(name, "name");
      this.getAdminDetail(name as string);
    }

    this.getDmUserAll();
    this.getRoleList();
  }

  async getDmUserAll() {
    const response = await authorityService.getDmUserAll();
    console.log(response);
    this.userList = response;
  }

  async getAdminDetail(adminId: string) {
    const response = await authorityService.getAdminDetail(adminId);
    console.log(response, "qqqqqq");
    const { id, name, roles } = response;
    this.adminId = id;
    const role = roles.map((item: any) => {
      return item.id;
    });
    this.form.setFieldsValue({
      id,
      name,
      role: role
    });
  }

  filterOption(input: string, option: any) {
    return (
      option.componentOptions.children[0].text
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      console.log(values);
      if (err) return;
      const { name, role } = values;
      const rolesObject = role.map((item: any) => {
        return { id: item };
      });
      const params = { name, rolesObject };
      this.editType === "new" ? this.submit(params) : this.update(params);
    });
  }

  async submit(params: any) {
    const response = await authorityService.newAdmin({
      name: params.name,
      roles: params.rolesObject,
      actived: 0
    });
    console.log(response);
    if (response) {
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    const response = await authorityService.updateAdmin({
      id: this.adminId,
      name: params.name,
      roles: params.rolesObject
    });
    if (response) {
      this.$message.success("编辑成功");
      this.routeBack();
    }
  }

  routeBack() {
    this.$router.go(-1);
  }

  async getRoleList() {
    this.roleList = await authorityService.getActiveRole();
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
</style>
