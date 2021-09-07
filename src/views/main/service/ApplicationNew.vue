<template>
  <div class="form-contain">
    <a-form :form="form" @submit="handleSubmit" class="formStyle">
      <!-- 行业简介 start -->
      <a-form-item class="modules">行业简介:</a-form-item>
      <a-form-item label="行业分类">
        <a-select
          @change="firstSelect"
          showSearch
          placeholder="请选择行业分类"
          v-decorator="[
            'industryClass',
            { rules: [{ required: true, message: '请选择行业分类' }] }
          ]"
        >
          <a-select-option
            v-for="(item, index) in firstClassList"
            :key="index"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-button @click="showFirstModal">新建分类</a-button>
      </a-form-item>

      <a-form-item label="应用状态">
        <a-radio-group
          v-decorator="[
            'actived',
            { rules: [{ required: true, message: '请选择服务状态' }] }
          ]"
        >
          <a-radio
            @change="changeActivedRadio"
            v-for="(item, index) in statusList"
            :key="index"
            :value="item.label"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>

      <a-form-item label="推荐排序">
        <a-select
          showSearch
          placeholder="请选推荐排序"
          @change="changeRecommend"
          v-decorator="[
            'order',
            { rules: [{ required: true, message: '请选推荐排序' }] }
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

      <a-form-item label="上传banner图片">
        <a-upload
          list-type="picture-card"
          @preview="bannerHandlePreview"
          :file-list="bannerList"
          :customRequest="uploadBannerImg"
          :remove="removeBannerImg"
          v-decorator="['banner', {}]"
        >
          <div>
            <a-icon type="cloud-upload" />
            <div class="ant-upload-text">
              选择上传图片
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="bannerPreviewVisible"
          :footer="null"
          @cancel="bannerImgHandleCancel"
        >
          <img alt="example" style="width: 100%" :src="bannerPreviewImage" />
        </a-modal>
      </a-form-item>

      <a-form-item class="modules">应用详情:</a-form-item>
      <a-form-item label="应用名称">
        <a-input
          v-decorator="[
            'name',
            { rules: [{ required: true, message: '请输入应用名称' }] }
          ]"
          placeholder="请输入应用名称"
        ></a-input>
      </a-form-item>

      <a-form-item label="应用简介">
        <template>
          <a-textarea
            placeholder="可输入100字， 示例："
            :rows="4"
            v-decorator="['desc', {}]"
          />
        </template>
      </a-form-item>

      <a-form-item label="解决问题描述">
        <a-table
          :columns="descColumns"
          :data-source="descData"
          bordered
          rowKey="index"
          :pagination="false"
        >
          <template
            v-for="col in ['content', 'theme']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                :placeholder="'请输入' + col"
                @change="e => changeDesc(e.target.value, index, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="saveDesc(index)" class="editRow">保存</a>
              <a @click="cancalDesc(index, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="editingKey !== ''"
                @click="editDesc(index, true)"
                class="editRow"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteDesc(index)">
                <a :disabled="editingKey !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="editingKey !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addDesc"
        >
          新增功能描述
        </a-button>
      </a-form-item>
      <!-- key:手机版  key:平板版 -->
      <a-form-item label="上传应用">
        <div class="versions">
          <a-upload
            list-type="picture-card"
            @preview="handlePreviewPhone"
            :file-list="phoneList"
            :customRequest="uploadPhoneFile"
            :remove="removePhoneFile"
            v-decorator="['phoneVersion', {}]"
          >
            <div>
              <a-icon type="cloud-upload" />
              <div class="ant-upload-text">
                选择上传手机版文件
              </div>
            </div>
          </a-upload>
          <a-modal :visible="phoneVisible" :footer="null" @cancel="cancelPhone">
            <img alt="example" style="width: 100%" :src="previewPhoneImage" />
          </a-modal>

          <a-upload
            list-type="picture-card"
            @preview="handlePreviewIpad"
            :file-list="ipadList"
            :customRequest="uploadIpadFile"
            :remove="removeIpadFile"
            v-decorator="['ipadVersion', {}]"
          >
            <div>
              <a-icon type="cloud-upload" />
              <div class="ant-upload-text">
                选择上传平板版文件
              </div>
            </div>
          </a-upload>
          <a-modal
            :visible="ipadVisible"
            :footer="null"
            @cancel="cancelIpadPreview"
          >
            <img alt="example" style="width: 100%" :src="previewIpadImage" />
          </a-modal>
        </div>
        <div>支持apk/dmg格式文件</div>
      </a-form-item>

      <a-form-item class="modules">使用功能:</a-form-item>
      <a-form-item label="使用功能">
        <a-table
          :columns="classifyColumns"
          :data-source="classifyData"
          bordered
          rowKey="index"
          :pagination="false"
        >
          <template
            v-for="col in ['order', 'theme', 'industryClass', 'content']"
            :slot="col"
            slot-scope="text"
          >
            <div :key="col">
              {{ text }}
            </div>
          </template>
          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="saveClassify(index)" class="editRow">保存</a>
              <a @click="cancelClassify(index, false, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="editingKeyA !== ''"
                @click="editClassify(index, true)"
                class="editRow"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteClassify(index)">
                <a :disabled="editingKeyA !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-form-item>

      <a-form-item label="功能名称">
        <a-input
          v-decorator="['applicateTitle', {}]"
          placeholder="请输入场景标题名字，10字内"
        ></a-input>
      </a-form-item>

      <a-form-item label="功能详情">
        <a-input
          placeholder="请输入场景描述详情，200字内"
          v-decorator="['applicateDesc']"
        />
      </a-form-item>

      <a-form-item label="上传图片">
        <a-upload
          list-type="picture-card"
          @preview="applyHandlePreview"
          :file-list="videoList"
          :remove="applyHandleRemove"
          name="file"
          :customRequest="applyUploadFile"
        >
          <div>
            <a-icon type="cloud-upload" />
            <div>
              选择上传图片
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="applyPreviewVisible"
          :footer="null"
          @cancel="applyHandleCancel"
        >
          <img alt="example" style="width: 100%" :src="applyPreviewImage" />
        </a-modal>
      </a-form-item>

      <a-form-item>
        <div class="lineSave">
          <a-button class="save" @click="saveApplication"
            >保存行业应用</a-button
          >
        </div>
      </a-form-item>

      <!-- 服务优势 -->
      <a-form-item class="modules">应用特性:</a-form-item>
      <a-form-item label="应用特性">
        <a-table
          :columns="advantageColumns"
          :data-source="advantageData"
          bordered
          rowKey="index"
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
                @change="e => advantageHandleChange(e.target.value, index, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="saveAdvantage(index)" class="editRow">保存</a>
              <a @click="cancalAdvantage(index, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="advantageKey !== ''"
                @click="editAdvantage(index, true)"
                class="editRow"
                >编辑</a
              >
              <a-popconfirm
                title="确认删除？"
                @confirm="deleteAdvantage(index)"
              >
                <a :disabled="advantageKey !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <a-button
          :disabled="advantageKey !== ''"
          type="dashed"
          icon="plus"
          block
          @click="addAdvantage"
          >新增优势</a-button
        >
      </a-form-item>

      <!-- 关联服务  recommends mode="multiple"-->
      <a-form-item class="modules">关联能力服务:</a-form-item>
      <a-form-item label="关联服务">
        <a-select
          showSearch
          placeholder="请选择关联服务"
          @change="correlateSelectHandle"
          v-decorator="['recommends', {}]"
        >
          <a-select-option
            v-for="(item, index) in correlateSelect"
            :key="index"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
        <!-- <a-button @click="addCorrelate">添加</a-button> -->
        <p>最多关联3个服务</p>
        <a-table
          :columns="correlateColumns"
          :data-source="correlateData"
          bordered
          rowKey="index"
          :pagination="false"
          class="correlateTable"
        >
          <template
            v-for="col in ['order', 'level1', 'name']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="e => correlateHandleChange(e.target.value, index, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="operation, row, index">
            <span>
              <span @click="upindex(index, row)" class="modifyBtn"
                ><a-icon type="arrow-up" />上移</span
              >
              <span @click="moveDown(index, row)" class="modifyBtn"
                ><a-icon type="arrow-down" />下移</span
              >
              <a-popconfirm
                title="确认删除？"
                @confirm="deleteCorrelate(index)"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-form-item>

      <a-form-item class="btn-contain" :wrapper-col="{ span: 18, offset: 6 }">
        <a-button type="primary" html-type="submit" class="confirmBtn">
          确定
        </a-button>
        <a-button @click="routeBack">取消</a-button>
      </a-form-item>
    </a-form>

    <!-- '新建分类'弹窗 -->
    <a-modal
      title="添加行业分类"
      width="850px"
      v-model="firstVisible"
      :maskClosable="false"
      :closable="true"
      @cancel="cancelFirstClass"
      @ok="confirmFirstClass"
    >
      <a-form :form="firstClassForm" class="applicationModal">
        <a-form-item label="分类名称">
          <a-input
            placeholder="请输入二级分类名称"
            class="modalInput"
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请填写分类名称' }] }
            ]"
          ></a-input>
        </a-form-item>

        <a-form-item label="上传BANNER图片">
          <a-upload
            list-type="picture-card"
            @preview="handlePreviewModal"
            :file-list="modalImgList"
            :customRequest="uploadModalFile"
            :remove="removeModalUpload"
            v-decorator="[
              'banner',
              { rules: [{ required: true, message: '请上传BANNER图片' }] }
            ]"
          >
            <div>
              <a-icon type="cloud-upload" />
              <div class="ant-upload-text">
                选择上传文件
              </div>
            </div>
          </a-upload>
          <a-modal
            :visible="modalVisible"
            :footer="null"
            @cancel="cancelModalPreview"
          >
            <img alt="example" style="width: 100%" :src="modalPreviewImage" />
          </a-modal>
          <div class="gray">
            支持jpg/png/gif格式文件,图片比例1:1， 文件不超过1M. 尺寸：1000*1000
          </div>
        </a-form-item>

        <a-form-item label="分类简述">
          <a-textarea
            class="modalInput"
            placeholder="可输入100字， 示例："
            :rows="4"
            v-decorator="[
              'desc',
              { rules: [{ required: true, message: '请填写分类简述' }] }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ManageService from "@/service/manage";
import AuthorityService from "@/service/authority";
import { cloneDeep } from "lodash";

const manageService = ManageService.getService();
const authorityService = AuthorityService.getService();

const briefsItem = {
  theme: "",
  content: ""
};
const correlateItem = {
  id: undefined,
  order: 0,
  level1: "",
  name: ""
};
const applicateItem = {
  theme: ""
};
const advantageItem = {
  theme: "",
  content: ""
};
const classifyItem = {
  industryClass: "",
  theme: "",
  content: ""
};
interface briefs {
  theme: string;
  content: string;
  index?: number;
  editable?: boolean;
}
interface classify {
  theme: string;
  content: string;
  order?: number;
  index?: number;
  path?: string;
  name?: string;
  id?: number;
  editable?: boolean;
}
interface application {
  theme: string;
  index?: number;
  editable?: boolean;
}
interface advantages {
  theme: string;
  content: string;
  index?: number;
  editable?: boolean;
}
interface correlates {
  id: number;
  order: number;
  level1: string;
  name: string;
  index?: number;
  editable?: boolean;
}
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
  serviceId: number = -1;

  // 基本信息↓↓↓
  firstClassForm: any = {};
  bannerPreviewVisible: boolean = false;
  bannerList: any[] = [];
  cloneBannerFile: any;
  bannerPreviewImage: string = "";
  cacheBanner: any; // 缓存banner参数
  // 手机版的回显
  applicationFile: any[] = [];
  phoneVisible: boolean = false;
  phoneList: any = [];
  clonePhoneFile: any;
  previewPhoneImage: string = "";
  phoneFileId: number = -1;
  phoneIndex: number = -1;
  // 平板版的回显
  ipadVisible: boolean = false;
  ipadList: any = [];
  cloneIpadFile: any;
  previewIpadImage: string = "";
  ipadFileId: number = -1;
  ipadIndex: number = -1;

  // 服务分类↓↓↓
  // 一级分类
  firstClassList: any[] = [];
  firstVisible: boolean = false;
  copyIndustryClass: string = "";

  // '服务状态'
  statusList: any[] = [
    { label: "上线", value: 1 },
    { label: "下线", value: 0 }
  ];
  defaultActive: string = "";
  // 推荐排序
  orderSelect: any[] = [];
  // 服务详情↓↓↓
  briefsItemKey: number = 0;
  // 解决问题描述
  descColumns: any[] = [
    {
      title: "解决问题",
      dataIndex: "theme",
      width: 180,
      scopedSlots: { customRender: "theme" }
    },
    {
      title: "描述详情",
      dataIndex: "content",
      scopedSlots: { customRender: "content" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  descData: briefs[] = [];
  editingKey: string = "";
  cacheDesc: briefs[] = []; // 缓存数据
  // 行业应用上传列表
  videoList: any = [];

  // 使用功能↓↓↓
  classifyColumns: any[] = [
    {
      title: "排序",
      dataIndex: "index",
      scopedSlots: { customRender: "index" }
    },
    {
      title: "功能名称",
      dataIndex: "theme",
      width: 200,
      scopedSlots: { customRender: "theme" }
    },
    {
      title: "功能描述",
      dataIndex: "content",
      scopedSlots: { customRender: "content" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  classifyData: classify[] = [];
  editingKeyA: string = "";
  cachePriviewList: any[] = []; // 缓存行业应用上传文件
  classifyItemKey: number = 1;
  applyPreviewVisible: boolean = false;
  applyPreviewImage: string = "";
  applicateItemKey: number = 0;
  selectApplicate: any[] = []; // 行业应用select
  applicateSelectValue: string = "";
  previewList: any[] = []; // 预览

  applicationData: application[] = [];
  cacheApplication: application[] = [];
  rowIndex: number = -1;
  scenesResponse: any = [];
  imgname: string = "";

  // 应用特性 ↓↓↓
  advantageItemKey: number = 0;
  advantageColumns: any[] = [
    {
      title: "特性标题",
      dataIndex: "theme",
      width: 200,
      scopedSlots: { customRender: "theme" }
    },
    {
      title: "描述详情",
      dataIndex: "content",
      scopedSlots: { customRender: "content" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  advantageData: advantages[] = [];
  advantageKey: string = "";
  cacheAdvantage: advantages[] = [];
  // 关联服务 ↓↓↓
  correlateSelect: any[] = [];
  correlateItemKey: number = 1;
  correlateColumns: any[] = [
    {
      title: "id",
      dataIndex: "id",
      className: "notShow"
    },
    {
      title: "排序",
      dataIndex: "order",
      scopedSlots: { customRender: "order" }
    },
    {
      title: "类型",
      dataIndex: "level1",
      scopedSlots: { customRender: "level1" }
    },
    {
      title: "能力名称",
      dataIndex: "name",
      width: 200,
      scopedSlots: { customRender: "name" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  correlateData: correlates[] = [];
  correlateKey: string = "";
  cacheCorrelate: correlates[] = [];
  correlateSelectValue: string = "";

  // 弹窗
  modalFile: any = {};
  modalVisible: boolean = false;
  modalPreviewImage: string = "";
  modalImgList: any = [];
  modalContent: any[] = [];

  created() {
    this.form = this.$form.createForm(this, {});
    this.firstClassForm = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    this.getLinkedList({});

    if (id) {
      this.editType = "edit";
      this.serviceId = Number(id);
      this.getIndustryEdit(this.serviceId);
    }
    this.firstClassSelect();
  }

  mounted() {}

  // 编辑页面的接口
  async getIndustryEdit(gid: any) {
    const response = await manageService.getIndustryEdit(gid);
    const {
      id,
      industryClass,
      actived,
      order,
      name,
      desc,
      applications,
      descriptions,
      advantages,
      banner,
      functions,
      recommends
    } = response;
    this.cacheBanner = banner;
    this.copyIndustryClass = industryClass;
    this.applicationFile = cloneDeep(applications);
    // banner
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

    if (applications && applications.length !== 0) {
      applications.forEach((item: any, key: number) => {
        if (item.type == "手机版" && item.path !== "delete") {
          this.phoneFileId = item.id;
          this.phoneIndex = key;
          this.phoneList.push({
            url: item.path,
            uid: item.id,
            name: item.path.substring(item.path.lastIndexOf("/") + 1),
            status: "done"
          });
        } else if (item.type == "平板版" && item.path !== "delete") {
          this.ipadFileId = item.id;
          this.ipadIndex = key;
          this.ipadList.push({
            url: item.path,
            uid: item.id,
            name: item.path.substring(item.path.lastIndexOf("/") + 1),
            status: "done"
          });
        }
      });
    }

    this.scenesResponse = cloneDeep(functions);
    this.recommendPort(industryClass);
    this.defaultActive = actived;
    let formActived = "";
    if (actived == "启用" || actived == "停用" || actived == "上线") {
      formActived = "上线";
    } else {
      formActived = "下线";
    }
    this.form.setFieldsValue({
      industryClass,
      name,
      actived: formActived,
      desc,
      banner: banner,
      order
    });

    // 行业应用
    this.scenesResponse.forEach((item: classify, key: number) => {
      let names: any = "";
      if (item.path) {
        const fit = [
          ".png",
          ".jpg",
          ".jpeg",
          ".bmp",
          ".gif",
          ".webp",
          ".psd",
          ".svg",
          ".tiff"
        ];
        const urlName = item.path.substring(item.path.lastIndexOf("/") + 1); // 获取图片的名字
        const urlSuffix = urlName.substring(urlName.lastIndexOf(".")); // 获取图片的格式
        if (fit.indexOf(urlSuffix) !== -1) {
          this.imgname = urlName;
        }
      }
      // classifyData控制表格数据
      this.classifyData.push({
        theme: item.theme,
        content: item.content,
        path: item.path == undefined ? "delete" : item.path,
        id: item.id,
        index: this.classifyItemKey++,
        order: item.order
      });
      // previewList控制文件 ，两者分开
      this.previewList.push({
        url: item.path ? item.path : "none",
        uid: item.id,
        name: this.imgname,
        status: "done",
        index: key++
      });
    });

    this.cachePriviewList = cloneDeep(this.previewList);
    // 功能描述
    descriptions.forEach((item: briefs) => {
      this.descData.push({
        theme: item.theme,
        content: item.content,
        index: this.briefsItemKey++
      });
    });
    this.cacheDesc = cloneDeep(descriptions);
    // 关联服务
    if (recommends.length !== 0) {
      recommends.forEach((item: correlates) => {
        this.correlateData.push({
          ...item,
          order: this.correlateItemKey++
        });
      });
    }
    // 服务优势
    advantages.forEach((item: advantages) => {
      this.advantageData.push({
        theme: item.theme,
        content: item.content,
        index: this.advantageItemKey++
      });
    });
    this.cacheAdvantage = cloneDeep(advantages);
  }
  // 编辑接口end ↑↑↑↑↑↑↑

  // '新建分类'：弹窗
  showFirstModal() {
    this.firstVisible = true;
    this.firstClassSelect();
  }
  // 弹窗: 取消
  cancelFirstClass() {
    this.firstVisible = false;
    this.modalImgList = [];
    this.firstClassForm.resetFields();
  }
  // 弹窗: 确认
  confirmFirstClass() {
    this.firstVisible = false;
    this.firstClassForm.validateFields((err: any, values: any) => {
      const form = new FormData();
      form.append("banner", this.modalFile);
      form.append("name", values.name);
      form.append("desc", values.desc);
      this.addNewIndustryClass(form);
    });
  }
  // 弹窗: 接口
  async addNewIndustryClass(param: any) {
    const response = await authorityService.addNewIndustry(param);
    const { name, value } = response;
    this.form.setFieldsValue({
      industryClass: name
    });
    this.recommendPort(name);
    this.firstClassSelect();
  }

  // 行业分类
  firstSelect(value: any) {
    if (this.form.getFieldValue("order") !== undefined) {
      this.form.setFieldsValue({
        order: undefined
      });
    }
    this.recommendPort(value);
  }
  // 行业一级分类接口
  async firstClassSelect() {
    const response = await authorityService.addNewService({
      type: "行业分类"
    });
    this.firstClassList = response;
    this.modalContent = response;
  }

  // 服务状态
  changeActivedRadio(e: any) {
    console.log("e", e.target.value);
  }
  // 推薦排序的
  changeRecommend(value: any) {
    // this.recommendPort(value)
  }
  // 推荐排序接口
  async recommendPort(name: any) {
    const response = await manageService.getIndustryOrder(name);
    this.orderSelect = response;
    if (this.copyIndustryClass !== this.form.getFieldValue("industryClass")) {
      let a: any = this.orderSelect;
      a = a + 1;
      this.orderSelect = a;
    }
  }
  // 上传banner图片
  uploadBannerImg(file: any) {
    this.bannerList = [];
    this.bannerList.push(file.file);
    this.cloneBannerFile = cloneDeep(file);
    this.cacheBanner = undefined;
  }
  // 删除banner图片
  removeBannerImg(file: any) {
    this.form.setFieldsValue({
      banner: "delete"
    });
    this.cacheBanner = "delete";
    const index = this.bannerList.indexOf(file);
    const newFileList = this.bannerList.slice();
    newFileList.splice(index, 1);
    this.bannerList = newFileList;
  }

  // 预览banner图片
  async bannerHandlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.bannerPreviewImage = file.url || file.preview;
    this.bannerPreviewVisible = true;
  }
  // cancel 上传banner图片
  bannerImgHandleCancel() {
    this.bannerPreviewVisible = false;
  }

  // 解决问题描述: change
  changeDesc(value: string, key: number, column: "title" | "desc") {
    const newData = [...this.descData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.descData = newData;
    }
  }
  // 解决问题描述: 编辑
  editDesc(index: number, type: boolean) {
    const newData = [...this.descData];
    // 当前行设为编辑
    const currentLine = newData[index];
    currentLine.editable = type;
    this.descData = newData;
  }
  // 解决问题描述: 删除
  deleteDesc(index: number) {
    const newData = [...this.descData];
    newData.splice(index, 1);
    this.descData = newData;
    this.cacheDesc = cloneDeep(this.descData);
  }
  // 解决问题描述: 保存
  saveDesc(index: number) {
    const newData = [...this.descData];
    const currentLine = newData[index];
    if (currentLine.theme == "" || currentLine.content == "") {
      this.$message.error("解决问题或者描述详情不能为空");
      return;
    }
    delete currentLine.editable;
    this.descData = newData;
    this.cacheDesc = cloneDeep(this.descData);
    this.editingKey = "";
  }
  cancalDesc(index: number, row: any) {
    const newData = [...this.descData];
    const currentLine = newData[index];
    delete currentLine.editable;
    this.descData = newData;
    this.editingKey = "";
    if (row.content == "" && row.theme == "") {
      this.descData.splice(index);
    } else {
      this.descData = cloneDeep(this.cacheDesc);
    }
  }
  // 解决问题描述: 新增
  addDesc() {
    this.descData.push({ ...briefsItem, index: this.briefsItemKey++ });
    this.cacheDesc = cloneDeep(this.descData);
    this.editDesc(this.descData.length - 1, true);
  }

  // 使用功能：编辑
  editClassify(index: number, type: boolean) {
    this.rowIndex = index;
    if (this.previewList[index].url == "none") {
      this.previewList[index].url = "delete";
      this.cachePriviewList[index].url = "delete";
    }

    if (this.previewList[index].url !== "delete") {
      this.applyPreviewImage = this.previewList[index].url;
      this.videoList.push(this.previewList[index]);
    } else {
      this.applyPreviewImage = "";
      this.videoList.length = 0;
    }

    this.form.setFieldsValue({
      applicateTitle: this.classifyData[index].theme,
      applicateDesc: this.classifyData[index].content
    });
    const newData = [...this.classifyData];
    const target = newData[index];

    if (target.content == "") {
      this.editingKeyA = String(target.index);
    } else {
      this.editingKeyA = target.content;
    }

    target.editable = type;
  }
  // 使用功能：取消
  cancelClassify(index: number, type: boolean, row: any) {
    this.rowIndex = index;
    this.rowIndex = index;
    if (this.previewList[index].url == "delete") {
      this.previewList[index].url = this.classifyData[index].path;
    }
    row.editable = false;
    this.editingKeyA = "";
    this.form.setFieldsValue({
      applicateTitle: "",
      applicateDesc: ""
    });
    this.applyPreviewImage = "";
    this.videoList.length = 0;
    this.rowIndex = -1;
  }
  // 使用功能：保存
  saveClassify(index: number) {
    this.rowIndex = index;

    if (this.previewList[index].url == "delete") {
      this.classifyData[index].path = "delete";
    }
    if (this.videoList.length !== 0) {
      this.previewList[index].url = this.applyPreviewImage;
      this.previewList[index].name = this.videoList[0].name;
    } else if (
      this.videoList.length !== 0 &&
      this.videoList[0].url == undefined
    ) {
      this.previewList[index].url = this.applyPreviewImage;
      this.previewList[index].name = this.videoList[0].name;
    }

    this.classifyData[index].theme = this.form.getFieldValue("applicateTitle");
    this.classifyData[index].content = this.form.getFieldValue("applicateDesc");
    const newData = [...this.classifyData];
    const target = newData[index];
    delete target.editable;
    this.editingKeyA = "";
    this.form.setFieldsValue({
      applicateTitle: "",
      applicateDesc: ""
    });
    this.videoList.length = 0;
    this.rowIndex = -1;
  }
  // 使用功能：删除
  deleteClassify(index: number) {
    const newData = [...this.classifyData];
    newData.splice(index, 1);
    this.classifyData = newData;
    this.classifyData.forEach((item: any, key: number) => {
      item.index = key + 1;
    });

    const newPre = [...this.previewList];
    newPre.splice(index, 1);
    this.previewList = newPre;

    this.cachePriviewList.splice(index, 1);
    this.classifyItemKey = this.classifyData.length;
  }

  // 使用功能：保存行业应用
  saveApplication() {
    if (
      this.videoList.length !== 0 &&
      this.applyPreviewImage !== "" &&
      this.rowIndex == -1
    ) {
      this.classifyData.push({
        ...classifyItem,
        index: this.classifyItemKey++,
        theme: this.form.getFieldValue("applicateTitle"),
        content: this.form.getFieldValue("applicateDesc"),
        path: this.applyPreviewImage !== "" ? this.applyPreviewImage : "delete"
      });

      this.previewList.push({
        url: this.applyPreviewImage,
        uid: "uid",
        name: this.videoList[0].name,
        status: "done"
      });
    } else if (this.rowIndex !== -1 && this.videoList.length !== 0) {
      this.previewList[this.rowIndex].url = this.applyPreviewImage;
      this.previewList[this.rowIndex].name = this.videoList[0].name;
      this.classifyData[this.rowIndex].theme = this.form.getFieldValue(
        "applicateTitle"
      );
      this.classifyData[this.rowIndex].content = this.form.getFieldValue(
        "applicateDesc"
      );
      this.classifyData[this.rowIndex].path =
        this.applyPreviewImage !== "" ? this.applyPreviewImage : "delete";
      const newData = [...this.classifyData];
      const target = newData[this.rowIndex];
      delete target.editable;
      this.editingKeyA = "";
    } else if (this.rowIndex == -1 && this.videoList.length == 0) {
      this.classifyData.push({
        ...classifyItem,
        index: this.classifyItemKey++,
        theme: this.form.getFieldValue("applicateTitle"),
        content: this.form.getFieldValue("applicateDesc"),
        path: "delete"
      });
      this.previewList.push({
        url: "delete",
        uid: "udi",
        name: "name",
        status: "done"
      });
      this.cachePriviewList.push({
        url: "delete",
        uid: "udi",
        name: "name",
        status: "done"
      });
    } else {
      const newData = [...this.classifyData];
      const target = newData[this.rowIndex];
      delete target.editable;
      this.editingKeyA = "";
    }

    this.form.setFieldsValue({
      applicateTitle: "",
      applicateDesc: ""
    });
    this.videoList.length = 0;
    this.applyPreviewImage = "";
    this.rowIndex = -1;

    this.classifyData.forEach((item: any, key: number) => {
      item.index = key + 1;
      this.classifyItemKey = key;
    });
  }

  // 优势   ↓↓↓
  advantageHandleChange(value: string, key: number, column: "theme" | "desc") {
    const newData = [...this.advantageData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.advantageData = newData;
    }
  }
  // 服务优势: 编辑
  editAdvantage(index: number, type: boolean) {
    const newData = [...this.advantageData];
    // 当前行设为编辑
    const currentLine = newData[index];
    currentLine.editable = type;
    this.advantageData = newData;
  }
  // 服务优势: 保存
  saveAdvantage(index: number) {
    const newData = [...this.advantageData];
    const currentLine = newData[index];
    if (currentLine.theme == "" || currentLine.content == "") {
      this.$message.error("特性标题或者描述详情不能为空");
      return;
    }
    delete currentLine.editable;
    this.advantageData = newData;
    this.cacheAdvantage = cloneDeep(this.advantageData);
    this.advantageKey = "";
  }
  // 服务优势: 取消
  cancalAdvantage(index: number, row: any) {
    const newData = [...this.advantageData];
    const currentLine = newData[index];
    delete currentLine.editable;
    this.advantageData = newData;
    this.advantageKey = "";
    if (row.content == "" && row.theme == "") {
      this.advantageData.splice(index);
    } else {
      this.advantageData = cloneDeep(this.cacheAdvantage);
    }
  }
  // 服务优势: 删除
  deleteAdvantage(index: number) {
    const newData = [...this.advantageData];
    newData.splice(index, 1);
    this.advantageData = newData;
    this.cacheAdvantage = cloneDeep(this.advantageData);
  }
  // 服务优势: 新增
  addAdvantage() {
    this.advantageData.push({
      ...advantageItem,
      index: this.advantageItemKey++
    });
    this.editAdvantage(this.advantageData.length - 1, true);
  }

  // 关联服务：接口  ↓↓↓
  async getLinkedList(paran: any) {
    const response = await manageService.getLinkedList({});
    if (response) {
      this.correlateSelect = response;
    }
  }
  // 关联服务：添加
  correlateSelectHandle(value: any, item: any) {
    this.correlateSelectValue = value;
    const a = value.indexOf(this.correlateSelect);
    if (this.correlateData.length > 2) {
      this.$message.warning("最多关联三个服务");
      return;
    }
    this.addCorrelate(item.key);
  }

  addCorrelate(index: number) {
    if (this.correlateSelectValue == "") {
      this.$message.error("请先选择");
      return;
    } else {
      // order: this.correlateItemKey++ ,
      this.correlateData.push({
        ...correlateItem,
        id: this.correlateSelect[index].id,
        level1: this.correlateSelect[index].level1,
        name: this.correlateSelectValue
      });
      this.correlateData.forEach((item: any, key: number) => {
        item.order = key + 1;
      });
      this.cacheCorrelate = cloneDeep(this.correlateData);
    }
  }
  correlateHandleChange(
    value: string,
    key: number,
    column: "index" | "theme" | "type"
  ) {
    const newData = [...this.correlateData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.correlateData = newData;
    }
  }
  // 关联服务：删除
  deleteCorrelate(index: number) {
    const newData = [...this.correlateData];
    newData.splice(index, 1);
    this.correlateItemKey = index + 1;
    this.correlateData = newData;
    this.correlateData.forEach((item: any, key: number) => {
      item.order = key + 1;
    });
    this.cacheCorrelate = cloneDeep(this.correlateData);
    this.cacheCorrelate = cloneDeep(this.correlateData);
  }
  // 上移
  upindex(index: number, row: any) {
    if (index > 0) {
      let upDate = this.correlateData[index - 1]; // 先把第一个拿出来
      this.correlateData.splice(index - 1, 1); // 减掉第一个
      this.correlateData.splice(index, 0, upDate);
      this.correlateData.forEach((item: any, key: number) => {
        item.order = key + 1;
      });
    } else {
      this.$message.error("已经是第一条，不可上移");
    }
  }
  // 下移
  moveDown(index: number, row: any) {
    if (index + 1 === this.correlateData.length) {
      this.$message.error("已经是最后一条，不可下移");
    } else {
      let downDate = this.correlateData[index + 1];
      this.correlateData.splice(index + 1, 1);
      this.correlateData.splice(index, 0, downDate);
      this.correlateData.forEach((item: any, key: number) => {
        item.order = key + 1;
      });
    }
  }

  // 表单验证并提交
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      let active: string = "";
      if (this.defaultActive == "下线" || this.defaultActive == "禁用") {
        if (values.actived == "上线") {
          active = "上线";
        } else {
          active = this.defaultActive;
        }
      } else if (
        this.defaultActive == "启用" ||
        this.defaultActive == "停用" ||
        this.defaultActive == "上线"
      ) {
        if (values.actived == "上线") {
          active = this.defaultActive;
        } else {
          active = values.actived;
        }
      } else {
        // 新增时的active
        active = values.actived;
      }

      const stringParams = {
        industryClass: values.industryClass,
        name: values.name,
        type: values.type,
        actived: active,
        order: values.order,
        label: values.label,
        desc: values.desc,
        banner: this.cacheBanner ? this.cacheBanner : undefined
      };
      const descriptions = this.formatData(cloneDeep(this.descData)); // 功能描述
      const advantages = this.formatData(cloneDeep(this.advantageData)); // 服务优势
      const functions = this.formatScene(cloneDeep(this.classifyData)); // 行业应用
      const applications = cloneDeep(this.applicationFile);
      const recommends: any = []; // 关联服务
      this.correlateData.forEach((item: any) => {
        recommends.push({
          rid: item.id,
          order: item.order
        });
      });
      values = stringParams;
      try {
        const params = {
          ...values,
          descriptions,
          advantages,
          recommends,
          functions,
          applications
        };

        for (let a in params) {
          // 去掉空的数组
          // if (Array.isArray(params[a]) && params[a].length == 0) {
          //   delete params[a];
          // }
          if (params[a] == undefined) {
            delete params[a];
          }
        }
        values = params;
        // console.log("总的参数", params);
        this.editType === "new"
          ? this.newIndustry(params)
          : this.editPort(params);
      } catch (e) {
        this.$message.warning("请检查成功/失败返回值示例是否为json格式！");
      }
    });
  }
  // 新建接口
  async newIndustry(params: any) {
    const response = await manageService.newIndustry({
      ...params
      // person: "admin" //后续改为登陆用户
    });
    if (response) {
      // 上传行业应用文件
      const formData1 = new FormData();
      const responseId: any[] = [];

      if (this.classifyData.length !== 0 && response.functions.length !== 0) {
        response.functions.forEach((item: any, key: number) => {
          if (item.id) {
            if (this.cachePriviewList[key].url !== "delete") {
              if (!this.cachePriviewList[key].index) {
                formData1.append(
                  response.functions[key].id,
                  this.cachePriviewList[key]
                );
                responseId.push(response.functions[key].id);
                // this.uploadIndustryFile(formData1, response.id);
              }
            }
          }
        });
      }
      if (responseId.length !== 0) {
        this.uploadIndustryFile(formData1, response.id);
      }

      // 上传手机版和平板版
      const formData2 = new FormData();
      if (this.clonePhoneFile !== undefined) {
        formData2.append("手机版", this.clonePhoneFile.file);
      }
      if (this.cloneIpadFile !== undefined) {
        formData2.append("平板版", this.cloneIpadFile.file);
      }
      // 上传banner
      if (this.cloneBannerFile !== undefined) {
        formData2.append("banner", this.cloneBannerFile.file);
      }

      if (
        this.clonePhoneFile !== undefined ||
        this.cloneIpadFile !== undefined ||
        this.cloneBannerFile !== undefined
      ) {
        this.uploadIndustryFile(formData2, response.id);
      }
      this.$message.success("新建成功");
      this.routeBack();
    }
  }

  // 编辑接口
  async editPort(params: any) {
    const response = await manageService.updateIndustry({
      ...params,
      id: this.serviceId,
      person: "admin" //后续改为登陆用户
    });

    if (response) {
      if (this.videoList.length !== 0 && this.classifyData.length == 0) {
        // 上传行业应用
        this.$message.error("不能只上传scenes图片，请先输入行业应用并保存");
        return;
      } else if (response.functions && this.classifyData.length !== 0) {
        const uploadForm1 = new FormData();
        const responseId: any[] = [];
        response.functions.forEach((item: any, key: number) => {
          if (item.id) {
            if (this.cachePriviewList[key].url !== "delete") {
              if (this.cachePriviewList[key].size) {
                responseId.push(response.functions[key].id);
                uploadForm1.append(
                  response.functions[key].id,
                  this.cachePriviewList[key]
                );
              }
            }
          }
        });
        if (responseId.length !== 0) {
          responseId.forEach((item: any, key: number) => {
            const formData: any = uploadForm1.get(item);
          });
          this.uploadIndustryFile(uploadForm1, response.id);
        }
      }
      // 上传手机版和平板版
      const uploadForm2 = new FormData();
      if (this.clonePhoneFile !== undefined) {
        uploadForm2.append("手机版", this.clonePhoneFile.file);
      }
      if (this.cloneIpadFile !== undefined) {
        uploadForm2.append("平板版", this.cloneIpadFile.file);
      }
      // 上传banner
      if (this.cloneBannerFile !== undefined) {
        uploadForm2.append("banner", this.cloneBannerFile.file);
      }

      if (
        this.clonePhoneFile !== undefined ||
        this.cloneIpadFile !== undefined ||
        this.cloneBannerFile !== undefined
      ) {
        this.uploadIndustryFile(uploadForm2, response.id);
      }

      this.$message.success("编辑成功");
      this.routeBack();
    }
  }

  // 行业应用文件：预览
  async applyHandlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.applyPreviewImage = file.url || file.preview;
    this.applyPreviewVisible = true;
  }
  // 行业应用文件：上传
  applyUploadFile(file: any) {
    this.toBase64(file.file);
    this.videoList = [];
    this.videoList.push(file.file);
    // this.previewList.push(file.file);
    if (this.rowIndex !== -1) {
      this.cachePriviewList[this.rowIndex] = file.file;
    } else {
      this.cachePriviewList.push(file.file);
    }
  }
  // 行业应用文件：取消
  applyHandleCancel() {
    this.applyPreviewVisible = false;
  }
  // 行业应用文件：删除
  applyHandleRemove(file: any) {
    if (this.rowIndex !== -1) {
      if (this.previewList[this.rowIndex].url == this.applyPreviewImage) {
        this.previewList[this.rowIndex].url = "delete";
        this.applyPreviewImage = "";
        this.videoList.length = 0;
      }
      this.cachePriviewList[this.rowIndex] = this.previewList[this.rowIndex];
    } else {
      this.applyPreviewImage = "";
      this.videoList.length = 0;
      this.cachePriviewList = cloneDeep(this.previewList);
    }
  }
  // base64
  async toBase64(value: any) {
    const p: any = await getBase64(value);
    this.applyPreviewImage = p;
    if (this.rowIndex !== -1) {
      this.previewList[this.rowIndex].url = this.applyPreviewImage;
    }
  }

  // 手机版: 上传
  uploadPhoneFile(file: any) {
    this.phoneList = [];
    this.phoneList.push(file.file);
    this.clonePhoneFile = cloneDeep(file);
    this.applicationFile.forEach((item: any, key: number) => {
      if (item.type == "手机版") {
        this.applicationFile.splice(key, 1);
      }
    });
  }
  // 手机版: 删除
  removePhoneFile(file: any) {
    this.form.setFieldsValue({
      phoneVersion: "delete"
    });
    const index = this.phoneList.indexOf(file);
    const newFileList = this.phoneList.slice();
    newFileList.splice(index, 1);
    this.phoneList = newFileList;
    this.clonePhoneFile = undefined;
    this.applicationFile.forEach((item: any, key: number) => {
      if (item.type == "手机版") {
        this.applicationFile.splice(key, 1);
      }
    });
  }
  // 手机版: 预览
  async handlePreviewPhone(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.previewPhoneImage = file.url || file.preview;
    this.phoneVisible = true;
  }
  // 手机版: 取消
  cancelPhone() {
    this.phoneVisible = false;
  }

  // 平板版：上传
  uploadIpadFile(file: any) {
    this.ipadList = [];
    this.ipadList.push(file.file);
    this.cloneIpadFile = cloneDeep(file);
    this.applicationFile.forEach((item: any, key: number) => {
      if (item.type == "平板版") {
        this.applicationFile.splice(key, 1);
      }
    });
  }
  // 平板版：删除
  removeIpadFile(file: any) {
    this.form.setFieldsValue({
      ipadVersion: "delete"
    });
    const index = this.ipadList.indexOf(file);
    const newFileList = this.ipadList.slice();
    newFileList.splice(index, 1);
    this.ipadList = newFileList;
    this.cloneIpadFile = undefined;
    this.applicationFile.forEach((item: any, key: number) => {
      if (item.type == "平板版") {
        this.applicationFile.splice(key, 1);
      }
    });
  }
  // 平板版：预览
  async handlePreviewIpad(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.previewIpadImage = file.url || file.preview;
    this.ipadVisible = true;
  }
  // 平板版：取消
  cancelIpadPreview() {
    this.ipadVisible = false;
  }

  // '新建分类'弹窗: 预览上传banner
  async handlePreviewModal(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.modalPreviewImage = file.url || file.preview;
    this.modalVisible = true;
  }
  // '新建分类'弹窗: 取消上传banner
  cancelModalPreview() {
    this.modalVisible = false;
  }
  // '新建分类'弹窗: 上传banner
  uploadModalFile(file: any) {
    this.modalFile = file.file;
    this.modalImgList = [];
    this.modalImgList.push(file.file);
  }
  // '新建分类'弹窗: 删除banner
  removeModalUpload(file: any) {
    this.firstClassForm.setFieldsValue({
      banner: "delete"
    });
    const index = this.modalImgList.indexOf(file);
    const newFileList = this.modalImgList.slice();
    newFileList.splice(index, 1);
    this.modalImgList = newFileList;
  }

  // 第二个接口：上传文件
  async uploadIndustryFile(param: any, id: number) {
    const response = await manageService.uploadIndustryFile(param, id);
  }

  formatData(data: any) {
    data.map((item: any) => {
      delete item.index;
      delete item.editable;
    });
    return data;
  }
  formatScene(data: any) {
    data.map((item: any) => {
      if (item.path !== "delete") {
        delete item.path;
        delete item.index;
        delete item.editable;
        delete item.id;
      } else {
        delete item.index;
        delete item.editable;
        delete item.id;
      }
    });
    return data;
  }
  routeBack() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";
</style>
