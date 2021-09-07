<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="权限名"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          :disabled="editType === 'edit'"
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入权限分类' }] }
          ]"
          placeholder="请输入权限分类"
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
            { rules: [{ required: true, message: '请选择角色' }] }
          ]"
          placeholder="请选择角色"
        >
          <a-select-option v-for="item in method" :key="item" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="权限URL"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'url',
            { rules: [{ required: true, message: '请输入权限URL' }] }
          ]"
          placeholder="请输入权限URL"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="权限描述"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-input
          v-decorator="[
            'authorityDesc',
            { rules: [{ required: false, message: '请输入权限描述' }] }
          ]"
          placeholder="请输入权限描述"
        ></a-input>
      </a-form-item>

      <a-form-item
        label="是否按用户过滤"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-radio-group
          v-decorator="[
            'userFilter',
            { rules: [{ required: true, message: '请选择是否按时计费' }] }
          ]"
        >
          <a-radio
            v-for="(item, index) in userFilter"
            :key="index"
            :value="item.label"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
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
  className: any = "";
  authorityDetail: any = null;
  id: number = -1;

  roleList: any[] = [];

  method: any[] = ["get", "post", "all"];
  userFilter: any[] = [
    { label: "是", value: 1 },
    { label: "否", value: 0 }
  ];

  created() {
    this.form = this.$form.createForm(this, {});
    const name = this.$route.query.name;
    if (name) {
      this.editType = "edit";
      this.className = name;
      console.log(this.$route.query);
      this.getAuthorityDetail({
        name
      });
    }
  }

  async getAuthorityDetail(params: any) {
    const response = await authorityService.getAuthorityDetail(params);
    const { name, url, method, authorityDesc, userFilter, id } = response;
    console.log("filder", userFilter);
    this.id = id;
    this.authorityDetail = response;
    this.form.setFieldsValue({
      name,
      url,
      method,
      authorityDesc,
      userFilter: userFilter == true ? "是" : "否"
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      values.userFilter = values.userFilter == "是" ? true : false;
      console.log(values.userFilter);
      if (err) return;
      this.editType === "new" ? this.submit(values) : this.update(values);
    });
  }

  async submit(params: any) {
    const response = await authorityService.newAuthority(params);
    console.log(response);
    if (response) {
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  async update(params: any) {
    // if (params.url !== this.authorityDetail.url) {
    //   params = {
    //     ...params,
    //     oldUrl: this.authorityDetail.url
    //   };
    // } else if (params.method !== this.authorityDetail.method) {
    //   params = {
    //     ...params,
    //     oldType: this.authorityDetail.type
    //   };
    // }
    const response = await authorityService.updateAuthority(
      Object.assign(params, { id: this.id })
    );
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
