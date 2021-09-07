<template>
  <div class="form-contain">
    <a-form class="ta-form" :form="form" @submit="handleSubmit">
      <a-form-item
        label="选择服务"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          :disabled="true"
          v-decorator="[
            'service',
            { rules: [{ required: true, message: '请选择服务' }] }
          ]"
          placeholder="请选择服务"
        >
          <a-select-option
            v-for="item in getServiceSelect"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="前台展示页配置"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-select
          v-decorator="[
            'showUrl',
            { rules: [{ required: true, message: '请选择前台展示页配置' }] }
          ]"
          placeholder="请选择前台展示页配置"
        >
          <a-select-option
            v-for="item in configTypeList"
            :key="item.id"
            :value="item.value"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="视频资源上传"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-upload
          name="file"
          list-type="picture"
          :fileList="videoList"
          @change="videoHandleChange"
          :customRequest="() => {}"
        >
          <a-button type="default">
            <a-icon type="upload" />
            Click to Upload
          </a-button>
        </a-upload>
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
export default class VedioNew extends Vue {
  form: any = {};
  getServiceSelect: any = [];
  configTypeList: any = [];
  videoList: any = [];
  sid: number = -1;
  created() {
    this.form = this.$form.createForm(this, {});
    this.getServiceList();
    this.getConfigTypeList();

    const sid = this.$route.query.id;
    const showUrl = this.$route.query.showUrl;
    const name = this.$route.query.name;
    const showVideo = this.$route.query.showVideo as string;

    this.$nextTick(() => {
      this.form.setFieldsValue({ service: name, showUrl });
    });

    if (showVideo) {
      let index = showVideo.indexOf("?filename=");
      let fileName = showVideo.substr(index + 10);
      this.videoList.push({
        url: showVideo,
        uid: Math.random() * 100,
        type: "video/mp4",
        name: fileName
      });
    }

    this.sid = (sid as unknown) as number;
  }

  async getServiceList() {
    const response = await authorityService.getServiceSelect();
    this.getServiceSelect = response;
  }

  async getConfigTypeList() {
    const response = await authorityService.getConfigTypeList();
    this.configTypeList = response;
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      let formData = new FormData();
      formData.append("showUrl", values.showUrl);
      if (this.videoList.length > 0) {
        if (this.videoList[0].lastModified != undefined) {
          formData.append("showVideo", this.videoList[0].originFileObj);
        }
      } else {
        formData.append("delete", "true");
      }
      console.log(values);
      this.edit(formData);
    });
  }

  async edit(params: any) {
    const response = await authorityService.editVideoSource(params, this.sid);
    if (response) {
      this.$message.success("编辑成功");
      this.routeBack();
    }
  }

  videoHandleChange(info: any) {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.videoList = fileList;
    console.log(this.videoList, "this.videoList");
  }

  routeBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "./basic.scss";
</style>
