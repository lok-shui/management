<template>
  <div class="form-contain">
    <a-form :form="form" @submit="handleSubmit" class="formStyle">
      <!-- 基本信息 start -->
      <a-form-item class="modules">基本信息:</a-form-item>
      <div class="flexLine">
        <a-form-item label="一级分类" class="item1">
          <a-select
            @change="firstSelect"
            showSearch
            placeholder="请选择一级分类"
            v-decorator="[
              'level1',
              { rules: [{ required: true, message: '请选择一级行业分类' }] }
            ]"
          >
            <a-select-option
              v-for="item in firstClass"
              :key="item.id"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="二级分类" class="item1">
          <a-select
            showSearch
            placeholder="请选择二级分类"
            @change="secondSelect"
            v-decorator="[
              'serviceGroup',
              { rules: [{ required: true, message: '请选择二级行业分类' }] }
            ]"
          >
            <a-select-option
              v-for="(item, index) in serviceType"
              :key="index"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="item2">
          <a-button @click="showFirstModal">新建分类</a-button>
        </a-form-item>
      </div>

      <div class="flexLine">
        <a-form-item label="服务名称" class="item1">
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入服务名' }] }
            ]"
            placeholder="请输入服务名"
          ></a-input>
        </a-form-item>

        <a-form-item label="服务英文别名" class="item1">
          <a-input
            v-decorator="[
              'alias',
              { rules: [{ required: true, message: '请输入服务英文别名' }] }
            ]"
            placeholder="请输入服务英文别名"
          ></a-input>
        </a-form-item>
      </div>

      <a-form-item label="产品型号">
        <a-input
          v-decorator="[
            'produceNumber',
            { rules: [{ required: true, message: '请输入产品型号' }] }
          ]"
          placeholder="请输入产品型号"
        ></a-input>
      </a-form-item>

      <a-form-item label="官方网站">
        <a-input
          v-decorator="['website', {}]"
          placeholder="请输入官方网站"
        ></a-input>
      </a-form-item>

      <a-form-item label="服务类型">
        <a-radio-group
          v-decorator="[
            'type',
            { rules: [{ required: true, message: '请选择服务类型' }] }
          ]"
        >
          <a-radio
            v-for="(item, index) in typeList"
            :key="index"
            :value="item.label"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>

      <a-form-item label="服务状态">
        <a-radio-group
          v-decorator="[
            'actived',
            { rules: [{ required: true, message: '请选择服务状态' }] }
          ]"
        >
          <a-radio
            v-for="(item, index) in statusList"
            :key="index"
            :value="item.label"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>

      <a-form-item label="是否按时计费">
        <a-radio-group
          v-decorator="[
            'billingOnTime',
            { rules: [{ required: true, message: '请选择是否按时计费' }] }
          ]"
        >
          <a-radio
            v-for="(item, index) in billingOnTime"
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

      <!-- :file-list="fileList" :multiple="true" 三个文件上传都是单选 -->
      <a-form-item label="上传banner图片">
        <a-upload
          list-type="picture-card"
          @preview="handlePreview"
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

      <!-- 基本信息 end -->

      <!-- 功能详情 start -->
      <a-form-item class="modules">功能详情:</a-form-item>
      <a-form-item label="功能详情">
        <a-table
          :columns="functionColumn"
          :data-source="functionData"
          bordered
          rowKey="index"
          :pagination="false"
        >
          <template slot="index" slot-scope="index">
            <div>
              {{ index }}
            </div>
          </template>
          <template
            v-for="col in ['order', 'theme', 'content']"
            :slot="col"
            slot-scope="text"
          >
            <div :key="col">
              {{ text }}
            </div>
          </template>
          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="saveFuntion(index)" class="editRow">保存</a>
              <a @click="cancelFuntion(index, false, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="funcEditingKey !== ''"
                @click="editFuntion(index, true)"
                class="editRow"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteFuntion(index)">
                <a :disabled="funcEditingKey !== ''">删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
      </a-form-item>

      <a-form-item label="功能名称">
        <a-input placeholder="请输入功能名称" v-decorator="['functionTitle']" />
      </a-form-item>
      <a-form-item label="功能详情">
        <a-input placeholder="请输入功能详情" v-decorator="['functionDesc']" />
      </a-form-item>
      <a-form-item label="上传图片">
        <a-upload
          list-type="picture-card"
          @preview="funcHandlePreview"
          :file-list="funcImgList"
          :remove="funcHandleRemove"
          name="file"
          :customRequest="funcUploadFile"
        >
          <div>
            <a-icon type="cloud-upload" />
            <div>
              选择上传图片
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="funcPreviewVisible"
          :footer="null"
          @cancel="funcHandleCancel"
        >
          <img alt="example" style="width: 100%" :src="funcPreviewImage" />
        </a-modal>
      </a-form-item>

      <a-form-item>
        <div class="lineSave">
          <a-button class="save" @click="saveAllFuntion">保存功能详情</a-button>
        </div>
      </a-form-item>

      <!-- 功能详情 end -->

      <!-- 服务分类 start -->
      <a-form-item class="modules">服务分类:</a-form-item>
      <a-form-item label="服务标签">
        <a-radio-group v-decorator="['label']">
          <a-radio
            v-for="(item, index) in serviceTag"
            :key="index"
            :value="item.label"
            >{{ item.label }}</a-radio
          >
        </a-radio-group>
      </a-form-item>
      <!-- 服务分类 end -->

      <!-- 服务详情 start -->
      <a-form-item class="modules">服务详情:</a-form-item>
      <a-form-item label="服务简介">
        <template>
          <a-textarea
            placeholder="可输入100字， 示例："
            :rows="4"
            v-decorator="['desc', {}]"
          />
        </template>
      </a-form-item>
      <!--table1  descriptions-->
      <a-form-item label="功能描述">
        <a-table
          :columns="briefColumns"
          :data-source="briefData"
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
                @change="e => handleChange(e.target.value, index, col)"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template slot="operation" slot-scope="operation, row, index">
            <span v-if="row.editable">
              <a @click="saveBrief(index)" class="editRow">保存</a>
              <a @click="cancalBrief(index, row)">取消</a>
            </span>
            <span v-else>
              <a
                :disabled="editingKey !== ''"
                @click="editBrief(index, true)"
                class="editRow"
                >编辑</a
              >
              <a-popconfirm title="确认删除？" @confirm="deleteBrief(index)">
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
          @click="addBrief"
        >
          新增功能描述
        </a-button>
      </a-form-item>

      <!-- :fileList="videoList"  showVideo: 文件流  -->
      <a-form-item label="上传视频">
        <a-upload
          name="file"
          list-type="picture"
          :file-list="singleVideo"
          :customRequest="uploadVideoFile"
          :remove="removeUploadVideo"
          v-decorator="['showVideo', {}]"
        >
          <a-button type="default" class="uploadStyle">
            <a-icon type="cloud-upload" />
            <div>选择上传文件</div>
          </a-button>
        </a-upload>
      </a-form-item>
      <!-- 服务详情 end -->

      <!-- 行业应用 start -->
      <a-form-item class="modules">行业应用:</a-form-item>
      <!-- scenes -->
      <a-form-item label="行业应用">
        <a-table
          :columns="classifyColumns"
          :data-source="classifyData"
          bordered
          rowKey="index"
          :pagination="false"
        >
          <template
            v-for="col in [
              'id',
              'path',
              'name',
              'theme',
              'industryClass',
              'content'
            ]"
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

      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="行业分类">
            <a-select
              v-decorator="['inputNewApplicate']"
              showSearch
              placeholder="请选择行业分类"
            >
              <a-select-option
                v-for="(item, index) in selectApplicate"
                :key="index"
                :value="item.name"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <a-input
              v-decorator="['addNewApplicate', {}]"
              ref="inputNewApplicate"
              placeholder="输入新建行业应用"
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item>
            <a-button @click="addNewApplicateItem">新增行业应用</a-button>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="行业标题">
        <a-input
          v-decorator="['applicateTitle', {}]"
          placeholder="请输入场景标题名字，10字内"
        ></a-input>
      </a-form-item>

      <a-form-item label="描述详情">
        <a-input
          placeholder="请输入场景描述详情，200字内"
          v-decorator="['applicateDesc']"
        />
      </a-form-item>

      <a-form-item label="上传scenes图片">
        <a-upload
          list-type="picture-card"
          @preview="applyHandlePreview"
          :file-list="videoList"
          :remove="handleRemove"
          name="file"
          :customRequest="newInterfaceSaveFile"
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
          @cancel="applyImgHandleCancel"
        >
          <img alt="example" style="width: 100%" :src="applyPreviewImage" />
        </a-modal>
      </a-form-item>

      <a-form-item label="行业应用">
        <a-select
          v-decorator="['inputSelectVal', {}]"
          showSearch
          placeholder="请选择关联行业应用"
          @change="selectApplicateHandle"
        >
          <a-select-option
            v-for="item in selectClassify"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>

        <a-button @click="addApplicate">添加行业应用</a-button>

        <a-table
          :columns="applicationColumns"
          :data-source="applicationData"
          bordered
          applyEditKey="index"
          :pagination="false"
          style="margin-top: 20px;"
        >
          <template
            v-for="col in ['index', 'theme']"
            :slot="col"
            slot-scope="text, row, index"
          >
            <div :key="col">
              <a-input
                v-if="row.editable"
                :value="text"
                @change="
                  e => applicationHandleChange(e.target.value, index, col)
                "
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template slot="operation" slot-scope="operation, row, index">
            <span>
              <a-popconfirm
                title="确认删除？"
                @confirm="deleteApplication(index)"
              >
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </a-table>
        <!-- <div class="saveStyle">
          <a-button class="save" @click="saveApplication">保存</a-button>
          <a-button
            type="dashed"
            icon="plus"
            block
            @click="addNewApplication"
            >新增行业应用</a-button>
        </div> -->
      </a-form-item>

      <a-form-item>
        <div class="lineSave">
          <a-button class="save" @click="saveApplication"
            >保存行业应用</a-button
          >
        </div>
      </a-form-item>

      <!-- 行业应用 end -->

      <!-- 服务优势 start  table4-->
      <a-form-item class="modules">服务优势:</a-form-item>
      <a-form-item label="服务优势">
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
          >新增服务优势</a-button
        >
      </a-form-item>

      <!-- 接入方式   -->
      <a-form-item class="modules">接入方式:</a-form-item>
      <a-form-item label="接入方式">
        <a-checkbox-group v-decorator="['accessMethods', {}]">
          <a-checkbox
            v-for="(item, index) in concatType"
            :key="index"
            :value="item.label"
            >{{ item.label }}</a-checkbox
          >
        </a-checkbox-group>
      </a-form-item>

      <!-- 关联服务  recommends mode="multiple"-->
      <a-form-item class="modules">关联服务:</a-form-item>
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

    <!-- 弹窗 -->
    <a-modal
      title="添加能力分类"
      v-model="firstVisible"
      :maskClosable="false"
      :closable="true"
      @cancel="cancelFirstClass"
      @ok="confirmFirstClass"
    >
      <a-form :form="firstClassForm">
        <a-form-item label="能力一级分类">
          <a-select
            showSearch
            placeholder="请选择能力一级分类"
            v-decorator="['type', {}]"
          >
            <a-select-option
              v-for="(item, index) in modalContent"
              :key="index"
              :value="item.name"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="二级分类名称">
          <a-input
            placeholder="请输入二级分类名称"
            v-decorator="['value', {}]"
          ></a-input>
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
const functionItem = {
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
interface funInterface {
  theme: string;
  content: string;
  order?: number;
  index?: number;
  path?: string;
  name?: string;
  id?: number;
  editable?: boolean;
}
interface classify {
  industryId: number;
  industryName: string;
  industryClass: string;
  theme: string;
  content: string;
  index?: number;
  path?: string;
  name?: string;
  id?: number;
  editable?: boolean;
}
interface application {
  id: number;
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
export default class ServiceNew extends Vue {
  form: any = {};
  editType: string = "new";
  serviceId: any;
  changeGId: boolean = true;
  gId: any = {};

  // 基本信息↓↓↓
  lucky: string = "";
  select2: string = "";
  firstClassForm: any = {};
  bannerPreviewVisible: boolean = false;
  bannerPreviewImage: string = "";
  serviceTag: any[] = [
    { label: "热门", value: 0 },
    { label: "独家", value: 1 },
    { label: "最新", value: 2 }
  ];
  cacheBanner: any;
  cacheShowVideo: any;
  // 服务分类↓↓↓
  // 一级分类
  firstClass: any[] = [];
  firstVisible: boolean = false;
  // 二级分类
  serviceType: any[] = [];
  // 新建一二级分类的弹窗
  modalContent: any[] = [];
  responseLevel1: string = "";
  responseLevel2: string = "";
  // 是否按时计费
  billingOnTime: any[] = [
    { label: "是", value: 1 },
    { label: "否", value: 0 }
  ];
  // 功能详情 ↓↓↓
  functionColumn: any[] = [
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
  functionData: funInterface[] = [];
  functionItemKey: number = 1;
  funcPreviewList: any[] = []; // 预览
  funcIndex: number = -1;
  funcImgList: any[] = [];
  funcPreviewImage: string = "";
  cacheFuncImageList: any[] = []; // 缓存功能详情上传文件
  funcPreviewVisible: boolean = false;
  funcResponse: any = [];
  funcImgname: string = "";
  funcEditingKey: string = "";

  // '服务类型'
  typeList: any[] = [
    { label: "API", value: 1 },
    { label: "SDK", value: 0 }
  ];
  // '服务状态'
  statusList: any[] = [
    { label: "上线", value: 1 },
    { label: "下线", value: 0 }
  ];
  // 推荐排序
  orderSelect: any[] = [];
  // 服务详情↓↓↓
  briefsItemKey: number = 0;
  // 功能描述
  briefColumns: any[] = [
    {
      title: "功能标题",
      width: 200,
      dataIndex: "theme",
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
  briefData: briefs[] = [];
  editingKey: string = "";
  cacheBrief: briefs[] = []; // 缓存数据
  // 上传banner图片
  bannerList: any = [];
  // 上传视频
  singleVideo: any = [];
  // 上传多个视频
  videoList: any = [];

  // 行业应用↓↓↓
  classifyColumns: any[] = [
    {
      title: "id",
      dataIndex: "id",
      className: "notShow"
    },
    {
      title: "path",
      dataIndex: "path",
      className: "notShow"
    },
    {
      title: "name",
      dataIndex: "name",
      className: "notShow"
    },
    {
      title: "行业分类",
      className: "cellWidth",
      dataIndex: "industryClass",
      scopedSlots: { customRender: "industryClass" }
    },
    {
      title: "行业标题",
      dataIndex: "theme",
      className: "cellWidth",
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
      className: "cellWidth",
      scopedSlots: { customRender: "operation" }
    }
  ];
  classifyData: classify[] = [];
  editingKeyA: string = "";
  cachePriviewList: any[] = [];
  classifyItemKey: number = 0;
  applyPreviewVisible: boolean = false;
  applyPreviewImage: string = "";
  applicateItemKey: number = 0;
  selectApplicate: any[] = []; // 行业'分类'select
  selectClassify: any[] = []; // 行业应用select
  applicateSelectValue: string = "";
  appliacateSelectId: number = -1;
  previewList: any[] = []; // 预览

  applicationColumns: any[] = [
    {
      title: "id",
      dataIndex: "id",
      className: "notShow"
    },
    {
      title: "行业应用",
      dataIndex: "theme",
      scopedSlots: { customRender: "theme" }
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: 200,
      scopedSlots: { customRender: "operation" }
    }
  ];
  applicationData: application[] = [];
  applyEditKey: string = "";
  cacheApplication: application[] = [];
  rowIndex: number = -1;
  scenesResponse: any = [];
  imgname: string = "";

  // 服务优势 ↓↓↓
  advantageItemKey: number = 0;
  advantageColumns: any[] = [
    {
      title: "优势标题",
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
  cacheCorrelate: correlates[] = [];
  correlateSelectValue: string = "";

  // 接入方式↓↓↓
  concatType: any[] = [
    { label: "API", value: 0 },
    { label: "SDK", value: 1 },
    { label: "私有化部署", value: 2 }
  ];

  // '服务组'
  cloneBannerFile: any;
  cloneVideoFile: any;

  created() {
    this.form = this.$form.createForm(this, {});
    this.firstClassForm = this.$form.createForm(this, {});
    const id = this.$route.query.id;
    const a = Number(this.$route.query.id);
    if (id !== undefined) {
      const param = {
        id: Number(this.$route.query.id)
      };
      this.getLinkedList(param);
    } else {
      this.getLinkedList({});
    }
    this.getIndustryList();

    if (id) {
      this.editType = "edit";
      this.serviceId = id;
      this.getServiceDetail(id);
    }

    this.firstClassSelect();
  }

  mounted() {
    this.applySelect();
  }

  // 编辑页面的接口
  async getServiceDetail(id: any) {
    const response = await manageService.getServiceDetail(id);
    const {
      gid,
      level1,
      serviceGroup,
      name,
      type,
      label,
      actived,
      desc,
      showUrl,
      gname,
      scenes,
      descriptions,
      advantages,
      showVideo,
      banner,
      accessMethods,
      order,
      recommends,
      alias,
      produceNumber,
      billingOnTime,
      website,
      functions
    } = response;

    this.gId = gid;
    this.responseLevel1 = level1;
    this.responseLevel2 = serviceGroup;

    this.scenesResponse = cloneDeep(scenes);
    this.funcResponse = cloneDeep(functions);

    this.recommendPort(serviceGroup);
    this.firstSelect(level1);

    this.form.setFieldsValue({
      gid: gname,
      level1,
      serviceGroup,
      name,
      type,
      actived,
      label,
      desc,
      showUrl,
      showVideo: showVideo,
      banner: banner,
      accessMethods,
      order,
      alias,
      produceNumber,
      billingOnTime: billingOnTime == true ? "是" : "否",
      website
    });
    this.cacheBanner = banner;
    this.cacheShowVideo = showVideo;
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
    // showVideo
    if (showVideo && showVideo !== "delete") {
      this.singleVideo.push({
        url: showVideo,
        uid: id,
        name: showVideo.substring(showVideo.lastIndexOf("/") + 1),
        status: "done"
      });
    } else if (showVideo == "delete") {
      this.singleVideo = [];
    }

    // 功能详情
    this.funcResponse.forEach((item: classify, key: number) => {
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
          this.funcImgname = urlName;
        }
      }
      // functionData控制表格数据
      this.functionData.push({
        theme: item.theme,
        content: item.content,
        path: item.path == undefined ? "delete" : item.path,
        id: item.id,
        index: this.functionItemKey++
      });
      // funcImageList控制图片
      this.funcPreviewList.push({
        url: item.path ? item.path : "none",
        uid: item.id,
        name: this.funcImgname,
        status: "done",
        index: key
      });
    });
    this.cacheFuncImageList = cloneDeep(this.funcPreviewList);

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
      this.classifyData.push({
        industryClass: item.industryClass,
        theme: item.theme,
        content: item.content,
        industryId: item.industryId,
        industryName: item.industryName,
        path: item.path == undefined ? "delete" : item.path,
        id: item.id,
        index: this.classifyItemKey++
      });

      this.previewList.push({
        url: item.path ? item.path : "none",
        uid: id,
        name: this.imgname,
        status: "done",
        index: key
      });
    });

    this.cachePriviewList = cloneDeep(this.previewList);

    scenes.forEach((item: any, value: any) => {
      let {
        content,
        industryName,
        industryClass,
        industryId,
        ...params
      } = item;
    });

    // 功能描述
    descriptions.forEach((item: briefs) => {
      this.briefData.push({
        theme: item.theme,
        content: item.content,
        index: this.briefsItemKey++
      });
    });
    this.cacheBrief = cloneDeep(descriptions);
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
  // 编辑接口end ↑↑↑

  // 基本信息
  // 一级分类：弹窗
  showFirstModal() {
    this.firstVisible = true;
    this.firstClassSelect();
  }
  // 新建分類的弹窗的取消按钮
  cancelFirstClass() {
    this.firstVisible = false;
  }
  // 新建分類的弹窗的确认按钮
  confirmFirstClass() {
    this.firstVisible = false;
    this.firstClassForm.validateFields((err: any, values: any) => {
      const param = {
        value: values.type,
        type: "二级能力",
        name: values.value
      };
      this.secondClassSelect(param);
      this.firstSelect(values.type);
      this.secondSelect(values.value);
    });
  }
  // 一级分类的select @change
  firstSelect(value: any) {
    if (this.form.getFieldValue("serviceGroup") !== undefined) {
      this.form.setFieldsValue({
        serviceGroup: undefined
      });
    }
    if (this.form.getFieldValue("order") !== undefined) {
      this.form.setFieldsValue({
        order: undefined
      });
    }
    this.lucky = value;
    const param = {
      type: "二级能力",
      value: value
    };
    this.concatSecond(param);
  }
  // 一级分类接口
  async firstClassSelect() {
    const response = await authorityService.addNewService({
      type: "一级能力"
    });
    this.firstClass = response;
    this.modalContent = response;
  }
  // 二级联动
  async concatSecond(param: any) {
    const response = await authorityService.getConfigList(param);
    this.serviceType = response;
  }
  // 二级分类的select @change
  secondSelect(value: any) {
    this.select2 = value;
    this.recommendPort(this.select2);
  }
  // 二级分类接口
  async secondClassSelect(param: any) {
    const response = await authorityService.addNewClassify(param);
    const { name, value } = response;
    this.form.setFieldsValue({
      firstClass: value,
      serviceGroup: name
    });
  }

  // 功能详情：编辑
  editFuntion(index: number, type: boolean) {
    this.funcIndex = index;
    if (this.funcPreviewList[index].url == "none") {
      this.funcPreviewList[index].url = "delete";
      this.cacheFuncImageList[index].url = "delete";
    }

    if (this.funcPreviewList[index].url !== "delete") {
      this.funcPreviewImage = this.funcPreviewList[index].url;
      this.funcImgList.push(this.funcPreviewList[index]);
    } else {
      this.funcPreviewImage = "";
      this.funcImgList.length = 0;
    }

    this.form.setFieldsValue({
      functionTitle: this.functionData[index].theme,
      functionDesc: this.functionData[index].content
    });
    const newData = [...this.functionData];
    const target = newData[index];
    if (target.content == "") {
      this.funcEditingKey = String(target.index);
    } else {
      this.funcEditingKey = target.content;
    }
    target.editable = type;
  }

  // 功能详情：取消
  cancelFuntion(index: number, type: boolean, row: any) {
    this.funcIndex = index;
    this.funcIndex = index;
    if (this.funcPreviewList[index].url == "delete") {
      this.funcPreviewList[index].url = this.functionData[index].path;
    }
    row.editable = false;
    this.funcEditingKey = "";
    this.form.setFieldsValue({
      functionTitle: "",
      functionDesc: ""
    });
    this.funcPreviewImage = "";
    this.funcImgList.length = 0;
    this.funcIndex = -1;
  }

  // 功能详情：保存
  saveFuntion(index: number) {
    this.funcIndex = index;

    if (this.funcPreviewList[index].url == "delete") {
      this.functionData[index].path = "delete";
    }
    if (this.funcImgList.length !== 0) {
      this.funcPreviewList[index].url = this.funcPreviewImage;
      this.funcPreviewList[index].name = this.funcImgList[0].name;
    } else if (
      this.funcImgList.length !== 0 &&
      this.funcImgList[0].url == undefined
    ) {
      this.funcPreviewList[index].url = this.funcPreviewImage;
      this.funcPreviewList[index].name = this.funcImgList[0].name;
    }

    this.functionData[index].theme = this.form.getFieldValue("functionTitle");
    this.functionData[index].content = this.form.getFieldValue("functionDesc");
    const newData = [...this.functionData];
    const target = newData[index];
    delete target.editable;
    this.funcEditingKey = "";
    this.form.setFieldsValue({
      functionTitle: "",
      functionDesc: ""
    });
    this.funcImgList.length = 0;
    this.funcIndex = -1;
  }
  // 功能详情：删除
  deleteFuntion(index: number) {
    const newData = [...this.functionData];
    newData.splice(index, 1);
    this.functionData = newData;
    this.functionData.forEach((item: any, key: number) => {
      item.index = key + 1;
    });

    const newPre = [...this.funcPreviewList];
    newPre.splice(index, 1);
    this.funcPreviewList = newPre;

    this.cacheFuncImageList.splice(index, 1);
  }

  // 功能详情：保存行业应用
  saveAllFuntion() {
    if (
      this.funcImgList.length !== 0 &&
      this.funcPreviewImage !== "" &&
      this.funcIndex == -1
    ) {
      this.functionData.push({
        ...functionItem,
        index: this.functionItemKey++,
        theme: this.form.getFieldValue("functionTitle"),
        content: this.form.getFieldValue("functionDesc"),
        path: this.funcPreviewImage !== "" ? this.funcPreviewImage : "delete"
      });

      this.funcPreviewList.push({
        url: this.funcPreviewImage,
        uid: "uid",
        name: this.funcImgList[0].name,
        status: "done"
      });
    } else if (this.funcIndex !== -1 && this.funcImgList.length !== 0) {
      this.funcPreviewList[this.funcIndex].url = this.funcPreviewImage;
      this.funcPreviewList[this.funcIndex].name = this.funcImgList[0].name;
      this.functionData[this.funcIndex].theme = this.form.getFieldValue(
        "functionTitle"
      );
      this.functionData[this.funcIndex].content = this.form.getFieldValue(
        "functionDesc"
      );
      this.functionData[this.funcIndex].path =
        this.funcPreviewImage !== "" ? this.funcPreviewImage : "delete";
      const newData = [...this.functionData];
      const target = newData[this.funcIndex];
      delete target.editable;
      this.funcEditingKey = "";
    } else if (this.funcIndex == -1 && this.funcImgList.length == 0) {
      this.functionData.push({
        ...functionItem,
        index: this.functionItemKey++,
        theme: this.form.getFieldValue("functionTitle"),
        content: this.form.getFieldValue("functionDesc"),
        path: "delete"
      });
      this.funcPreviewList.push({
        url: "delete",
        uid: "udi",
        name: "name",
        status: "done"
      });
      this.cacheFuncImageList.push({
        url: "delete",
        uid: "udi",
        name: "name",
        status: "done"
      });
    } else if (this.funcIndex !== -1 && this.funcImgList.length == 0) {
      const newData = [...this.functionData];
      const target = newData[this.funcIndex];
      delete target.editable;
      this.funcEditingKey = "";
      this.functionData[this.funcIndex].content = this.form.getFieldValue(
        "functionDesc"
      );
      this.functionData[this.funcIndex].theme = this.form.getFieldValue(
        "functionTitle"
      );
    }

    this.form.setFieldsValue({
      functionTitle: "",
      functionDesc: ""
    });
    this.funcImgList.length = 0;
    this.funcPreviewImage = "";
    this.funcIndex = -1;

    this.functionData.forEach((item: any, key: number) => {
      item.index = key + 1;
      this.functionItemKey = key;
    });
  }

  // 功能详情文件：预览
  async funcHandlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.funcPreviewImage = file.url || file.preview;
    this.funcPreviewVisible = true;
  }
  // 功能详情文件：上传
  funcUploadFile(file: any) {
    this.toBase64(file.file);
    this.funcImgList = [];
    this.funcImgList.push(file.file);
    // this.funcPreview.push(file.file);
    if (this.funcIndex !== -1) {
      this.cacheFuncImageList[this.funcIndex] = file.file;
    } else {
      this.cacheFuncImageList.push(file.file);
    }
  }
  // 功能详情文件：取消
  funcHandleCancel() {
    this.funcPreviewVisible = false;
  }
  // 功能详情文件：删除
  funcHandleRemove(file: any) {
    if (this.funcIndex !== -1) {
      if (this.funcPreviewList[this.funcIndex].url == this.funcPreviewImage) {
        this.funcPreviewList[this.funcIndex].url = "delete";
        this.funcPreviewImage = "";
        this.funcImgList.length = 0;
      }
      this.cacheFuncImageList[this.funcIndex] = this.funcPreviewList[
        this.funcIndex
      ];
    } else {
      this.funcPreviewImage = "";
      this.funcImgList.length = 0;
      this.cacheFuncImageList = cloneDeep(this.funcPreviewList);
    }
  }
  // base64
  async toBase64(value: any) {
    const p: any = await getBase64(value);
    this.funcPreviewImage = p;
    if (this.funcIndex !== -1) {
      this.funcPreviewList[this.funcIndex].url = this.funcPreviewImage;
    }
  }

  // 推荐排序接口
  async recommendPort(name: any) {
    const response = await manageService.getServiceOrder(name);
    this.orderSelect = response;
    if (
      this.responseLevel1 !== this.form.getFieldValue("level1") ||
      this.responseLevel2 !== this.form.getFieldValue("serviceGroup")
    ) {
      let a: any = this.orderSelect;
      a = a + 1;
      this.orderSelect = a;
    }
  }

  handleChange(value: string, key: number, column: "title" | "desc") {
    const newData = [...this.briefData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.briefData = newData;
    }
  }
  // 服务详情--功能table --↓↓↓
  editBrief(index: number, type: boolean) {
    const newData = [...this.briefData];
    // 当前行设为编辑
    const currentLine = newData[index];
    currentLine.editable = type;
    this.briefData = newData;
  }

  deleteBrief(index: number) {
    const newData = [...this.briefData];
    newData.splice(index, 1);
    this.briefData = newData;
    this.cacheBrief = cloneDeep(this.briefData);
  }

  saveBrief(index: number) {
    const newData = [...this.briefData];
    const currentLine = newData[index];
    if (currentLine.theme == "" || currentLine.content == "") {
      this.$message.error("功能标题或者功能描述不能为空");
      return;
    }
    delete currentLine.editable;
    this.briefData = newData;
    this.cacheBrief = cloneDeep(this.briefData);
    this.editingKey = "";
  }

  cancalBrief(index: number, row: any) {
    const newData = [...this.briefData];
    const currentLine = newData[index];
    delete currentLine.editable;
    this.briefData = newData;
    this.editingKey = "";
    if (row.content == "" && row.theme == "") {
      this.briefData.splice(index);
    } else {
      this.briefData = cloneDeep(this.cacheBrief);
    }
  }

  videoHandleChange(info: any) {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.videoList = fileList;
  }
  // 新增功能描述
  addBrief() {
    this.briefData.push({ ...briefsItem, index: this.briefsItemKey++ });
    this.cacheBrief = cloneDeep(this.briefData);
    this.editBrief(this.briefData.length - 1, true);
  }
  // 服务详情--功能table --↑↑↑

  // 行业应用table -- ↓↓↓
  classifyHandleChange(value: string, key: number, column: "title" | "type") {
    const newData = [...this.classifyData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.classifyData = newData;
    }
  }
  // 编辑行业table
  editClassify(index: number, type: boolean) {
    this.rowIndex = index;
    if (this.previewList[index].url == "none") {
      this.previewList[index].url = "delete";
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
      applicateDesc: this.classifyData[index].content,
      inputNewApplicate: this.classifyData[index].industryClass,
      inputSelectVal: this.classifyData[index].industryName
    });
    this.applicationData[0] = {
      id: this.classifyData[index].industryId,
      theme: this.classifyData[index].industryName,
      index: 0
    };
    const newData = [...this.classifyData];
    const target = newData[index];
    this.editingKeyA = target.content;
    target.editable = type;
  }
  // 取消行业table
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
      applicateDesc: "",
      inputNewApplicate: "",
      addNewApplicate: "",
      inputSelectVal: ""
    });
    this.applicationData.length = 0;
    this.applyPreviewImage = "";
    this.videoList.length = 0;
    this.rowIndex = -1;
  }
  // 保存行业table
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

    this.classifyData[index].industryClass = this.form.getFieldValue(
      "inputNewApplicate"
    );
    this.classifyData[index].industryId = this.appliacateSelectId;
    this.classifyData[index].industryName = this.form.getFieldValue(
      "inputSelectVal"
    );
    this.classifyData[index].theme = this.form.getFieldValue("applicateTitle");
    this.classifyData[index].content = this.form.getFieldValue("applicateDesc");

    const newData = [...this.classifyData];
    const target = newData[index];
    delete target.editable;
    this.editingKeyA = "";
    this.form.setFieldsValue({
      applicateTitle: "",
      applicateDesc: "",
      inputNewApplicate: "",
      addNewApplicate: "",
      inputSelectVal: ""
    });
    this.applicationData.length = 0;
    this.videoList.length = 0;
    this.rowIndex = -1;
  }
  // 删除行业table
  deleteClassify(index: number) {
    const newData = [...this.classifyData];
    newData.splice(index, 1);
    this.classifyData = newData;
    const newPre = [...this.previewList];
    newPre.splice(index, 1);
    this.previewList = newPre;
    this.cachePriviewList = cloneDeep(this.previewList);
  }

  // 保存行业应用
  saveApplication() {
    if (this.rowIndex !== -1) {
      this.$message.error("请点击表格里的保存");
      return;
    }
    this.applicationData = [];
    this.form.setFieldsValue({
      inputSelectVal: undefined
    });

    const industryClass =
      this.form.getFieldValue("inputNewApplicate") == undefined
        ? this.form.getFieldValue("addNewApplicate")
        : this.form.getFieldValue("inputNewApplicate");
    if (
      this.videoList.length !== 0 &&
      this.applyPreviewImage !== "" &&
      this.rowIndex == -1
    ) {
      this.classifyData.push({
        ...classifyItem,
        index: this.classifyItemKey++,
        industryClass: industryClass,
        industryId: this.appliacateSelectId,
        industryName: this.applicateSelectValue,
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
    } else if (this.rowIndex == -1 && this.videoList.length !== 0) {
      this.previewList.push({
        url: this.applyPreviewImage,
        uid: "uid",
        name: this.videoList[0].name,
        status: "done"
      });
      this.classifyData.push({
        ...classifyItem,
        index: this.classifyItemKey++,
        industryClass: industryClass,
        industryId: this.appliacateSelectId,
        industryName: this.applicateSelectValue,
        theme: this.form.getFieldValue("applicateTitle"),
        content: this.form.getFieldValue("applicateDesc"),
        path: this.applyPreviewImage !== "" ? this.applyPreviewImage : "delete"
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
    } else if (this.rowIndex == -1 && this.videoList.length == 0) {
      this.classifyData.push({
        ...classifyItem,
        index: this.classifyItemKey++,
        industryClass: industryClass,
        industryId: this.appliacateSelectId,
        industryName: this.applicateSelectValue,
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
    }

    this.form.setFieldsValue({
      applicateTitle: "",
      applicateDesc: "",
      inputNewApplicate: "",
      addNewApplicate: ""
    });
    this.videoList.length = 0;
    this.applyPreviewImage = "";
    this.rowIndex = -1;
  }

  applyImgHandleCancel() {
    this.applyPreviewVisible = false;
  }

  applicationHandleChange(value: string, key: number, column: "theme") {
    const newData = [...this.applicationData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.applicationData = newData;
    }
  }
  deleteApplication(index: number) {
    const newData = [...this.applicationData];
    newData.splice(index, 1);
    this.applicationData = newData;
    this.cacheApplication = cloneDeep(this.applicationData);
  }

  selectApplicateHandle(value: any, item: any) {
    this.appliacateSelectId = item.data.key;
    this.applicateSelectValue = value;
  }
  // 添加
  addApplicate() {
    this.applicationData.length = 0;
    if (this.applicateSelectValue == "") {
      this.$message.error("请先选择");
      return;
    }
    if (this.applicationData.length > 0) {
      this.$message.warning("最多关联一个行业应用");
      return;
    } else {
      this.applicationData.push({
        ...applicateItem,
        id: this.appliacateSelectId,
        index: this.applicateItemKey++,
        theme: this.applicateSelectValue
      });
      this.cacheApplication = cloneDeep(this.applicationData);
    }
  }
  async getIndustryList(param: any = {}) {
    const response = await manageService.getIndustryList(param);
    this.selectClassify = cloneDeep(response.responseList);
    // this.tableData = cloneDeep(response.responseList);
  }
  // 新增行业应用
  addNewApplication() {
    this.form.resetFields();
  }

  // '行业分类'选项（这里的type必须要传'行业应用'）
  async applySelect() {
    const response = await authorityService.addNewService({
      type: "行业应用"
    });
    if (response) {
      this.selectApplicate = response;
    }
  }

  // 新增行业应用
  addNewApplicateItem() {
    const inputVal: any = this.$refs.inputNewApplicate;
    if (inputVal.stateValue == "") {
      this.$message.error("请输入行业应用");
      return;
    } else {
      const param = {
        type: "行业应用",
        name: inputVal.stateValue
      };
      console.log("参数", param);
      this.addNewServiceApplicate(param);
    }
  }
  async addNewServiceApplicate(param: any) {
    const response = await authorityService.addNewServiceApplicate(param);
    if (response) {
      this.applySelect();
    }
  }
  // 行业应用table ↑↑↑

  // 服务优势table4  ↓↓↓
  advantageHandleChange(value: string, key: number, column: "theme" | "desc") {
    const newData = [...this.advantageData];
    const target: any = newData[key];
    if (target) {
      target[column] = value;
      this.advantageData = newData;
    }
  }
  editAdvantage(index: number, type: boolean) {
    const newData = [...this.advantageData];
    // 当前行设为编辑
    const currentLine = newData[index];
    currentLine.editable = type;
    this.advantageData = newData;
  }
  saveAdvantage(index: number) {
    const newData = [...this.advantageData];
    const currentLine = newData[index];
    if (currentLine.theme == "" || currentLine.content == "") {
      this.$message.error("优势标题或者描述详情不能为空");
      return;
    }
    delete currentLine.editable;
    this.advantageData = newData;
    this.cacheAdvantage = cloneDeep(this.advantageData);
    this.advantageKey = "";
  }
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

  deleteAdvantage(index: number) {
    const newData = [...this.advantageData];
    newData.splice(index, 1);
    this.advantageData = newData;
    this.cacheAdvantage = cloneDeep(this.advantageData);
  }
  // 新增服务优势
  addAdvantage() {
    this.advantageData.push({
      ...advantageItem,
      index: this.advantageItemKey++
    });
    this.editAdvantage(this.advantageData.length - 1, true);
  }
  // 服务优势  ↑↑↑

  // 关联服务7 ↓↓↓
  async getLinkedList(param: any) {
    const response = await manageService.getLinkedList(param);
    if (response) {
      this.correlateSelect = response;
    }
  }
  correlateSelectHandle(value: any, item: any) {
    this.correlateSelectValue = value;
    const a = value.indexOf(this.correlateSelect);
    if (this.correlateData.length > 2) {
      this.$message.warning("最多关联三个服务");
      return;
    }
    this.addCorrelate(item.key);
  }
  // 添加'关联服务'
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
  // '关联服务'table删除
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
  // 关联服务 ↑↑↑

  // 表单验证并提交 --- start
  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      const param1 = {
        // firstClass: values.firstClass,
        serviceGroup: values.serviceGroup,
        name: values.name,
        type: values.type,
        actived: values.actived,
        order: values.order,
        label: values.label,
        desc: values.desc,
        banner: this.cacheBanner ? this.cacheBanner : undefined,
        showVideo: this.cacheShowVideo ? this.cacheShowVideo : undefined,
        accessMethod: values.accessMethods,
        alias: values.alias,
        website: values.website,
        produceNumber: values.produceNumber,
        billingOnTime: values.billingOnTime == "是" ? true : false
      };
      const descriptions = this.formatData(cloneDeep(this.briefData)); // 功能描述
      const advantages = this.formatData(cloneDeep(this.advantageData)); // 服务优势
      const recommends: any = []; // 关联服务
      const scenes = this.formatScene(cloneDeep(this.classifyData)); // 行业应用
      const functions = this.formatScene(cloneDeep(this.functionData)); // 功能详情

      this.correlateData.forEach((item: any) => {
        recommends.push({
          rid: item.id,
          order: item.order
        });
      });
      values = param1;
      try {
        const params = {
          ...values,
          descriptions,
          advantages,
          recommends,
          scenes,
          functions
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
        console.log("总的参数", params);
        this.editType === "new" ? this.submit(params) : this.editPort(params);
      } catch (e) {
        this.$message.warning("请检查成功/失败返回值示例是否为json格式！");
      }
    });
  }
  // 新建接口
  async submit(params: any) {
    const response = await manageService.newService({
      ...params
      // person: "admin" //后续改为登陆用户
    });
    if (response) {
      // 上传功能详情文件
      const formData1 = new FormData();
      const responseId: any[] = [];

      if (this.functionData.length !== 0 && response.functions.length !== 0) {
        response.functions.forEach((item: any, key: number) => {
          if (item.id) {
            if (this.cacheFuncImageList[key].url !== "delete") {
              if (!this.cacheFuncImageList[key].index) {
                formData1.append(
                  response.functions[key].id,
                  this.cacheFuncImageList[key]
                );
                responseId.push(response.functions[key].id);
                // this.uploadIndustryFile(formData1, response.id);
              }
            }
          }
        });
      }
      if (responseId.length !== 0) {
        const id: any = `F${response.id}`;
        this.uploadFilePort(formData1, id);
      }

      // 上传scenes图片
      if (response.scenes && response.scenes.length !== 0) {
        const formData = new FormData();
        const responseId: any[] = [];

        response.scenes.forEach((item: any, key: number) => {
          if (item.id) {
            if (
              this.cachePriviewList[key].index == undefined &&
              !this.cachePriviewList[key].index
            ) {
              formData.append(item.id, this.cachePriviewList[key]);
              responseId.push(response.scenes[key].id);
              // this.uploadFilePort(formData, response.id);
            }
          }
        });
        // 多个文件流一起传
        if (responseId.length !== 0) {
          const id: any = `S${response.id}`;
          this.uploadFilePort(formData, id);
        }
      }
      // 上传banner
      if (this.cloneBannerFile !== undefined) {
        const bannerForm = new FormData();
        bannerForm.append("banner", this.cloneBannerFile.file);
        this.uploadFilePort(bannerForm, response.id);
      }
      // 上传视频
      if (this.cloneVideoFile !== undefined) {
        const videoForm = new FormData();
        videoForm.append("showVideo", this.cloneVideoFile.file);
        this.uploadFilePort(videoForm, response.id);
      }
      this.$message.success("新建成功");
      this.routeBack();
    }
  }
  // 编辑接口
  async editPort(params: any) {
    if (this.changeGId) {
      params.gid = this.gId;
    }
    const response = await manageService.updateService({
      ...params,
      id: this.serviceId,
      person: "admin" //后续改为登陆用户
    });

    if (response) {
      // 上传功能详情文件
      if (this.funcImgList.length !== 0 && this.functionData.length == 0) {
        this.$message.error("不能只上传图片，请先输入行业应用并保存");
        return;
      } else if (response.functions && this.functionData.length !== 0) {
        const uploadForm1 = new FormData();
        const responseId: any[] = [];
        response.functions.forEach((item: any, key: number) => {
          if (item.id) {
            if (this.cacheFuncImageList.length !== 0) {
              if (this.cacheFuncImageList[key].url !== "delete") {
                if (this.cacheFuncImageList[key].size) {
                  responseId.push(response.functions[key].id);
                  const id: any = `F${response.functions[key].id}`;
                  uploadForm1.append(id, this.cacheFuncImageList[key]);
                }
              }
            }
          }
        });
        if (responseId.length !== 0) {
          responseId.forEach((item: any, key: number) => {
            const formData: any = uploadForm1.get(item);
          });

          this.uploadFilePort(uploadForm1, response.id);
        }
      }

      if (this.videoList.length !== 0 && this.classifyData.length == 0) {
        // 上传scenes图片
        this.$message.error("不能只上传scenes图片，请先输入行业应用并保存");
        return;
      } else if (response.scenes && this.classifyData.length !== 0) {
        const uploadForm = new FormData();
        const responseId: any[] = [];
        response.scenes.forEach((item: any, key: number) => {
          if (item.id) {
            if (this.cachePriviewList[key].url !== "delete") {
              if (this.cachePriviewList[key].size) {
                responseId.push(response.scenes[key].id);
                const id: any = `S${response.scenes[key].id}`;
                uploadForm.append(id, this.cachePriviewList[key]);
              }
            }
          }
        });
        if (responseId.length !== 0) {
          responseId.forEach((item: any, key: number) => {
            const formData: any = uploadForm.get(item);
          });

          this.uploadFilePort(uploadForm, response.id);
        }
      }

      if (this.cloneVideoFile !== undefined) {
        // 上传视频
        const viddoForm = new FormData();
        viddoForm.append("showVideo", this.cloneVideoFile.file);
        this.uploadFilePort(viddoForm, response.id);
      }
      if (this.cloneBannerFile !== undefined) {
        // 上传banner
        const bannerForm = new FormData();
        bannerForm.append("banner", this.cloneBannerFile.file);
        this.uploadFilePort(bannerForm, response.id);
      }
      this.$message.success("编辑成功");
      this.routeBack();
    }
  }

  // 预览scenes图片
  async applyHandlePreview(file: any) {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.applyPreviewImage = file.url || file.preview;
    this.applyPreviewVisible = true;
  }
  // 上传scenes图片
  newInterfaceSaveFile(file: any) {
    this.preBase64(file.file);
    this.videoList = [];
    this.videoList.push(file.file);
    // this.previewList.push(file.file);
    if (this.rowIndex !== -1) {
      this.cachePriviewList[this.rowIndex] = file.file;
    } else {
      this.cachePriviewList.push(file.file);
    }
  }
  // base64
  async preBase64(value: any) {
    const p: any = await getBase64(value);
    this.applyPreviewImage = p;
    if (this.rowIndex !== -1) {
      this.previewList[this.rowIndex].url = this.applyPreviewImage;
    }
  }

  // 删除scenes图片
  handleRemove(file: any) {
    if (this.previewList[this.rowIndex].url == this.applyPreviewImage) {
      this.previewList[this.rowIndex].url = "delete";
      this.applyPreviewImage = "";
      this.videoList.length = 0;
    }
    this.cachePriviewList = cloneDeep(this.previewList);
  }
  handleRemove1(file: any) {
    this.classifyData[this.rowIndex].path = "delete";
    const index = this.videoList.indexOf(file);
    const newFileList = this.videoList.slice();
    newFileList.splice(index, 1);
    this.videoList = newFileList;
    delete this.classifyData[this.rowIndex].path;
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
  async handlePreview(file: any) {
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
  // 上传视频
  uploadVideoFile(file: any) {
    this.singleVideo = [];
    this.singleVideo.push(file.file);
    this.cloneVideoFile = cloneDeep(file);
    this.cacheShowVideo = undefined;
  }
  // 删除视频
  removeUploadVideo(file: any) {
    this.form.setFieldsValue({
      showVideo: "delete"
    });
    this.cacheShowVideo = "delete";
    const index = this.singleVideo.indexOf(file);
    const newFileList = this.singleVideo.slice();
    newFileList.splice(index, 1);
    this.singleVideo = newFileList;
  }
  // 上传文件接口
  async uploadFilePort(param: any, id: number) {
    const response = await manageService.uploadFilePort(param, id);
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
