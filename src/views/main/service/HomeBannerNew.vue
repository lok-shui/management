<template>
  <div class="bannerDetail">
    <a-form :form="form" @submit="handleSubmit" class="formStyle">
      <a-form-item label="BANNER标题">
        <a-input
          v-decorator="[
            'title',
            { rules: [{ required: true, message: '请输入应用名称' }] }
          ]"
          placeholder="请输入应用名称"
        ></a-input>
      </a-form-item>

      <a-form-item label="显示时间">
        <a-range-picker
          v-decorator="[
            'time',
            { rules: [{ required: true, message: '请选择时间' }] }
          ]"
          :show-time="{ format: 'HH:mm:ss' }"
          format="YYYY-MM-DD HH:mm:ss"
          :placeholder="['Start Time', 'End Time']"
          @change="onChange"
        />
      </a-form-item>

      <a-form-item label="排序">
        <a-select
          showSearch
          placeholder="请选排序"
          class="selectInput"
          @change="changeOrder"
          v-decorator="[
            'order',
            { rules: [{ required: true, message: '请选排序' }] }
          ]"
        >
          <a-select-option
            v-for="(item, index) in orderSelect"
            :key="index"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="上传图片">
        <a-upload
          list-type="picture-card"
          @preview="bannerHandlePreview"
          :file-list="bannerList"
          :remove="bannerHandleRemove"
          name="file"
          :customRequest="bannerUploadFile"
          v-decorator="[
            'banner',
            { rules: [{ required: bannerRequire, message: '请上传图片' }] }
          ]"
        >
          <div>
            <a-icon type="cloud-upload" />
            <div>
              选择上传图片
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="bannerVisible"
          :footer="null"
          @cancel="bannerHandleCancel"
        >
          <img alt="example" style="width: 100%" :src="bannerPreviewImage" />
        </a-modal>
      </a-form-item>

      <a-form-item label="关联服务">
        <a-select
          showSearch
          placeholder="请选择关联服务"
          class="typeInput"
          @change="linkSelectHandle"
          v-decorator="[
            'linkedType',
            { rules: [{ required: true, message: '请选择关联服务' }] }
          ]"
        >
          <a-select-option
            v-for="(item, index) in linkSelect"
            :key="index"
            :value="item"
          >
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="链接URL" v-if="chooseVal == '输入URL'">
        <a-input
          v-decorator="[
            'linkUrl',
            { rules: [{ required: true, message: '请输入URL' }] }
          ]"
        ></a-input>
      </a-form-item>

      <!-- AI能力  -->
      <a-form-item label="AI能力" v-if="chooseVal == 'AI能力'">
        <a-select
          showSearch
          placeholder="请选择一级类型"
          class="typeInput"
          @change="changeFirstLevel"
          v-decorator="[
            'level1',
            { rules: [{ required: true, message: '请选择一级类型' }] }
          ]"
        >
          <a-select-option
            v-for="(item, index) in AILevelF"
            :key="index"
            :value="item.value"
          >
            {{ item.value }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="二级类型" v-if="chooseVal == 'AI能力'">
        <a-select
          showSearch
          placeholder="请选择二级类型"
          class="typeInput"
          @change="secondLevel"
          v-decorator="[
            'level2',
            { rules: [{ required: true, message: '请选择二级类型' }] }
          ]"
        >
          <a-select-option
            v-for="(item, index) in level2"
            :key="index"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="能力详情" v-if="chooseVal == 'AI能力'">
        <a-select
          showSearch
          placeholder="请选择能力详情"
          @change="chooseDetail"
          class="typeInput"
          v-decorator="[
            'AIdetail',
            { rules: [{ required: true, message: '请选择能力详情' }] }
          ]"
        >
          <a-select-option
            v-for="item in levelDetail"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- 行业应用 -->
      <a-form-item label="行业分类" v-if="chooseVal == '行业分类'">
        <a-select
          showSearch
          @change="chooseIndustry"
          placeholder="请选择行业分类"
          class="typeInput"
          v-decorator="[
            'industryLevel1',
            { rules: [{ required: true, message: '请选择行业分类' }] }
          ]"
        >
          <a-select-option
            v-for="(item, index) in industrySelect"
            :key="index"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="行业详情" v-if="chooseVal == '行业分类'">
        <a-select
          showSearch
          placeholder="请选择行业详情"
          @change="chooseIndustryDetail"
          class="typeInput"
          v-decorator="[
            'industryContent',
            { rules: [{ required: true, message: '请选择行业详情' }] }
          ]"
        >
          <a-select-option
            v-for="item in industryDetail"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item class="btn-contain" :wrapper-col="{ span: 18, offset: 6 }">
        <a-button type="primary" html-type="submit" class="confirmBtn">
          确定
        </a-button>
        <a-button @click="routeBack">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ManageService from "@/service/manage";
import AuthorityService from "@/service/authority";
import { cloneDeep } from "lodash";

const manageService = ManageService.getService();
const authorityService = AuthorityService.getService();

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component
export default class ApplicationNew extends Vue {
  form: any = {};
  editType: string = "new";
  // AI
  AILevelF: any[] = [];
  level2: any[] = [];
  levelDetail: any[] = [];
  secondShow: boolean = false;
  thirdShow: boolean = false;
  chooseVal: string = "";
  bannerVal: string = "";
  bannerRequire: boolean = true;
  detailVal: any;
  orderSelect: any[] = [];
  serviceId: number = -1;
  // 行业
  industrySelect: any[] = [];
  industryDetail: any[] = [];
  // 上传列表
  bannerList: any = [];
  cloneBannerFile: any;
  bannerVisible: boolean = false;
  bannerPreviewImage: string = "";
  previewList: any[] = []; // 预览
  rowIndex: number = -1;
  // 关联服务
  linkSelect: any[] = ["AI能力", "行业分类", "输入URL"];
  // 编辑
  defaultParam: any = {};
  calendar: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});
    this.getHomeBannerOrder();
    const id = this.$route.query.id;

    if (id) {
      this.editType = "edit";
      this.serviceId = Number(id);
      this.geHomeBannerEdit(this.serviceId);
    }
  }

  mounted() {}

  // 编辑页面的接口
  async geHomeBannerEdit(gid: any) {
    const response = await manageService.geHomeBannerEdit(gid);
    const {
      endTime,
      id,
      level1,
      level2,
      linkedContent,
      linkedType,
      order,
      startTime,
      status,
      title,
      banner
    } = response;

    this.defaultParam = {
      id: id,
      status: status,
      linkedContent: linkedContent,
      linkedType: linkedType,
      banner: banner,
      startTime: startTime,
      endTime: endTime
    };
    this.bannerVal = banner;
    if (banner !== "") {
      this.bannerRequire = false;
    }
    // 二级分类选项
    if (level1 !== undefined) {
      const param = {
        type: "二级能力",
        value: level1
      };
      this.concatSecond(param);
    }
    // 详情选项
    if (level2 !== undefined) {
      this.getBannerserviceGroup(level2);
    }
    // 显示图片
    if (banner == "delete") {
      this.bannerList = [];
    } else if (banner) {
      this.bannerList.push({
        url: banner,
        uid: id,
        name: banner.substring(banner.lastIndexOf("/") + 1),
        status: "done"
      });
    }
    console.log("图片列表", this.bannerList);

    // 传入的值要和表单的值一一对应
    this.chooseVal = linkedType;
    if (this.chooseVal == "AI能力") {
      this.firstClassSelect();
      this.$nextTick(() => {
        this.form.setFieldsValue({
          linkedType,
          banner,
          order,
          title,
          level1: level1,
          level2,
          AIdetail: linkedContent,
          time: [startTime, endTime]
        });
      });
    } else if (this.chooseVal == "行业分类") {
      this.industryPort(this.chooseVal);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          linkedType,
          banner,
          order,
          title,
          industryLevel1: level1,
          industryContent: linkedContent,
          time: [startTime, endTime]
        });
      });
    } else {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          linkUrl: linkedContent,
          banner,
          order,
          title,
          linkedType: linkedType,
          time: [startTime, endTime]
        });
      });
    }
  }
  // 编辑接口end ↑↑↑↑↑↑↑

  // 日期
  onChange(value: any, dateString: any) {
    this.calendar = dateString;
    this.defaultParam.startTime = dateString[0];
    this.defaultParam.endTime = dateString[1];
  }

  // 排序
  changeOrder(value: number) {
    console.log("排序的值", value, typeof value);
  }
  // 排序接口
  async getHomeBannerOrder() {
    const response = await manageService.getHomeBannerOrder();
    if (this.editType == "new") {
      let a: any = response;
      a = a + 1;
      for (let x = 1; x <= a; x++) {
        this.orderSelect.push(x);
      }
      // this.orderSelect = a;
    } else {
      // this.orderSelect = response;
      for (let x = 1; x <= response; x++) {
        this.orderSelect.push(x);
      }
    }
  }

  // 表单验证并提交
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      if (values.banner !== "") {
        this.bannerRequire = false;
      }
      console.log("values", values);
      const bannerForm = new FormData();
      const newForm = new FormData();
      const {
        banner,
        order,
        title,
        linkedType,
        AIdetail,
        linkUrl,
        industryContent
      } = values;

      // '新增'的参数
      if (this.editType == "new") {
        let linkedContent = "";
        if (this.bannerList.length !== 0) {
          newForm.append("banner", this.bannerList[0]);
        }
        if (this.chooseVal == "输入URL" && linkUrl !== undefined) {
          console.log("选择了url", linkUrl);
          linkedContent = linkUrl;
        } else if (this.chooseVal == "AI能力" && AIdetail !== undefined) {
          linkedContent = AIdetail;
        } else if (
          this.chooseVal == "行业分类" &&
          industryContent !== undefined
        ) {
          linkedContent = industryContent;
        }

        const newParams: any = {
          title,
          startTime: this.defaultParam.startTime,
          endTime: this.defaultParam.endTime,
          order,
          linkedType,
          linkedContent: linkedContent
        };
        for (let a in newParams) {
          newForm.append(a, newParams[a]);
        }

        for (let pair of newForm.entries()) {
          //   console.log(pair[0]+ ', '+ pair[1]);
          if (pair[1] == "undefined") {
            newForm.delete(pair[0]);
          }
        }
      } else {
        let linkedContent: any = undefined;
        if (this.bannerList.length !== 0) {
          newForm.append("banner", this.bannerList[0]);
        }
        if (this.chooseVal == "输入URL" && linkUrl !== undefined) {
          linkedContent = linkUrl;
        } else if (this.chooseVal == "AI能力" && AIdetail !== undefined) {
          linkedContent = AIdetail;
        } else if (
          this.chooseVal == "行业分类" &&
          industryContent !== undefined
        ) {
          linkedContent = industryContent;
        }
        // '编辑'的参数
        const params: any = {
          order,
          title,
          linkedType,
          startTime: this.defaultParam.startTime,
          endTime: this.defaultParam.endTime,
          linkedContent:
            linkedContent !== undefined
              ? linkedContent
              : this.defaultParam.linkedContent,
          id: this.defaultParam.id,
          status: this.defaultParam.status
        };

        for (let a in params) {
          bannerForm.append(a, params[a]);
        }
        if (this.cloneBannerFile !== undefined) {
          bannerForm.append("banner", this.cloneBannerFile.file);
        } else if (this.bannerVal == "delete") {
          bannerForm.append("banner", "delete");
        } else {
          bannerForm.append("banner", this.defaultParam.banner);
        }
        // 去掉undefined的参数
        for (let pair of bannerForm.entries()) {
          if (pair[1] == "undefined") {
            bannerForm.delete(pair[0]);
          }
        }
      }

      try {
        this.editType === "new"
          ? this.addNewBanner(newForm)
          : this.editPort(bannerForm, this.defaultParam.id);
      } catch (e) {
        this.$message.warning("请检查成功/失败返回值示例是否为json格式！");
      }
    });
  }

  // 新建接口
  async addNewBanner(params: any) {
    const response = await manageService.addNewBanner(params);
    if (response) {
      this.$message.success(response);
      this.routeBack();
    }
  }

  // 编辑接口
  async editPort(params: any, id: any) {
    const response = await manageService.updateHomeBanner(params, id);
    if (response) {
      this.$message.success("编辑成功");
      this.routeBack();
    }
  }

  // 显示图片：预览
  async bannerHandlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.bannerPreviewImage = file.url || file.preview;
    this.bannerVisible = true;
  }
  // 显示图片：上传
  bannerUploadFile(file: any) {
    this.toBase64(file.file);
    this.bannerList = [];
    this.bannerList.push(file.file);
    this.cloneBannerFile = cloneDeep(file);
    console.log("图片列表", this.bannerList);
    console.log("form", this.form.getFieldValue("banner"));
  }
  // 显示图片：取消
  bannerHandleCancel() {
    console.log("取消上传文件");
    this.bannerVisible = false;
  }
  // 显示图片：删除
  bannerHandleRemove(file: any) {
    this.form.setFieldsValue({
      banner: undefined
    });
    this.bannerList.length = 0;
    this.bannerPreviewImage = "";
    this.bannerVal = "delete";
  }
  // base64
  async toBase64(value: any) {
    const preview: any = await getBase64(value);
    this.bannerPreviewImage = preview;
    this.bannerVal = preview;
    if (this.rowIndex !== -1) {
      this.previewList[this.rowIndex].url = this.bannerPreviewImage;
    }
  }

  // 关联服务： 选择
  linkSelectHandle(value: any, item: any) {
    // console.log(this.form.getFieldValue("level1"),this.form.getFieldValue("level2"))
    this.chooseVal = value;
    if (value == "AI能力") {
      this.firstClassSelect();
    } else {
      this.industryPort(value);
    }
  }

  // 行业分类接口
  async industryPort(type: any) {
    if (this.form.getFieldValue("level1") !== undefined) {
      this.form.setFieldsValue({
        industryLevel1: undefined
      });
      this.industrySelect = [];
    }
    const response = await authorityService.addNewService({
      type: type
    });
    this.industrySelect = cloneDeep(response);
  }
  // AI一级分类接口
  async firstClassSelect() {
    this.AILevelF = [];
    this.level2 = [];
    this.levelDetail = [];

    const response = await authorityService.addNewService({
      type: "一级能力"
    });
    this.AILevelF = cloneDeep(response);
  }
  // AI一级分类选择
  changeFirstLevel(value: any, item: any) {
    this.level2 = [];
    this.secondShow = false;
    // 清空上一次遗留值
    if (this.form.getFieldValue("level2") !== undefined) {
      this.form.setFieldsValue({
        level2: undefined
      });
      this.level2 = [];
    }
    if (this.form.getFieldValue("AIdetail") !== undefined) {
      this.form.setFieldsValue({
        AIdetail: undefined
      });
      this.levelDetail = [];
    }
    const param = {
      type: "二级能力",
      value: value
    };
    this.concatSecond(param);
  }
  // AI二级分类
  async concatSecond(param: any) {
    const response = await authorityService.getConfigList(param);
    this.secondShow = true;
    this.level2 = cloneDeep(response);
  }
  // AI二级分类选择
  secondLevel(name: any, item: any) {
    if (this.form.getFieldValue("AIdetail") !== undefined) {
      this.form.setFieldsValue({
        AIdetail: ""
      });
      this.levelDetail = [];
    }
    this.getBannerserviceGroup(name);
  }
  // AI详情
  async getBannerserviceGroup(name: string) {
    const response = await manageService.getBannerserviceGroup(name);
    if (response.length !== 0) {
      this.thirdShow = true;
      this.levelDetail = cloneDeep(response);
    }
  }
  // AI详情选项
  chooseDetail(value: any, item: any) {
    this.defaultParam.linkedContent = value;
    this.detailVal = item.key;
    // this.defaultParam.linkedContent = item.key;
  }

  // 行业分类
  chooseIndustry(value: any, item: any) {
    // this.defaultParam.linkedContent = value;
    this.getIndustryDetail(value);
  }
  // 行业详情
  async getIndustryDetail(name: any) {
    const response = await manageService.getIndustryDetail(name);
    if (response.length !== 0) {
      this.industryDetail = cloneDeep(response);
    } else {
      this.industryDetail = [];
    }
  }
  // 行业详情: 选择
  chooseIndustryDetail(name: any, item: any) {
    this.defaultParam.linkedContent = name;
  }

  // 第二个接口：上传文件
  async uploadIndustryFile(param: any, id: number) {
    const response = await manageService.uploadIndustryFile(param, id);
  }

  // 表单验证并提交 --------- end

  routeBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
.bannerDetail {
  padding-top: 40px;
}
/deep/.ant-form-item {
  display: flex;
  width: 1200px;
}
.ant-row {
  width: 1200px;
}
/deep/ .ant-table-title {
  display: none;
}
/deep/ .ant-form-item-label {
  flex: 1;
  text-align: right;
  margin-right: 15px;
}
/deep/ .ant-form-item-control-wrapper {
  text-align: left;
  flex: 4;
}

.formStyle {
  width: 1200px;
  margin: 0 auto;
  input {
    width: 350px;
  }
}

.a-btn {
  margin-right: 20px;
}
.selectInput {
  width: 260px;
}
.typeInput {
  width: 260px;
  margin-right: 20px;
}
.rowInput {
  width: 260px;
}
.uploadImg {
  width: 200px;
  height: 150px;
}
.editRow {
  margin-right: 10px;
}
.uploadStyle {
  width: 140px;
  height: 130px;
}
.correlateTable {
  margin-top: 15px;
}
.saveStyle {
  margin: 20px auto 40px auto;
  display: flex;
  .save {
    width: 200px;
    margin-right: 20px;
  }
}
.lineSave {
  width: 950px;
  margin: -30px auto 0 250px;
  button {
    width: 100%;
    font-weight: bold;
    color: black;
    letter-spacing: 4px;
  }
}
.modifyBtn {
  border: 1px solid #a8e4c7;
  color: #31c37c;
  padding: 0 2px;
  margin-right: 20px;
  border-radius: 4px;
  cursor: pointer;
}
.confirmBtn {
  margin-right: 20px;
}
/deep/ .notShow {
  display: none;
}
.modalInput {
  width: 500px;
}
</style>
