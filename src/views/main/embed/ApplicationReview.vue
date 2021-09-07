<template>
  <div class="correctControl">
    <!-- 用户申请 -->
    <div :bordered="false">
      <div class="searchWrap">
        <a-form layout="inline">
          <a-form-item label="状态">
            <a-select
              v-model="queryParam.status"
              placeholder="请选择"
              class="selectWidth"
            >
              <a-select-option value="0">未审批</a-select-option>
              <a-select-option value="1">通过</a-select-option>
              <a-select-option value="2">不通过</a-select-option>
            </a-select>
          </a-form-item>
          <span
            class="table-page-search-submitButtons"
            :style="{ float: 'right', overflow: 'hidden' } || {}"
          >
            <a-button
              type="primary"
              @click="
                queryParam.page = 1;
                pagination.current = 1;
                applicationAjax();
              "
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="() => (this.queryParam = {})"
              >重置</a-button
            >
          </span>
        </a-form>
      </div>
      <div>
        <a-table
          rowKey="id"
          :columns="columns"
          :data-source="data"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <span slot="serialnumber" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <template slot="action" slot-scope="text, record">
            <a slot="tags" class="detail" @click="showModal(record)">详情</a>
            <a slot="tags" @click="passApplication(record)">通过</a>
            <a slot="tags" class="nopass" @click="noPassApplication(record)"
              >不通过</a
            >
          </template>
        </a-table>

        <a-modal
          title="申请详情"
          v-model="firstVisible"
          :maskClosable="false"
          :closable="true"
        >
          <div class="detaiStyle">
            <div><b>应用ID:</b>{{ detailData.appid }}</div>
            <div><b>姓名:</b>{{ detailData.name }}</div>
            <div><b>电话:</b>{{ detailData.phone }}</div>
            <div><b>邮箱:</b>{{ detailData.mail }}</div>
            <div><b>单位:</b>{{ detailData.company }}</div>
            <div><b>负责的业务模块:</b>{{ detailData.businessModule }}</div>
            <div><b>已联系的客户经理:</b>{{ detailData.accountManager }}</div>
            <div><b>应用场景描述:</b>{{ detailData.scenarioDescription }}</div>
            <div><b>审批状态:</b>{{ statusVal }}</div>
            <div><b>申请时间:</b>{{ createAt }}</div>
            <div>
              <b>审批时间:</b>{{ processAt == "Invalid date" ? "" : processAt }}
            </div>
            <div><b>修改时间:</b>{{ updateAt }}</div>
          </div>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<script>
// import {getApplicationList,applicationListReview} from "./js/uerapplication"
import userapplication from "@/utils/userapplication";
import moment from "moment";
import UserService from "@/service/userService.ts";
const userService = UserService.getService();

const columns = [
  {
    title: "序号",
    dataIndex: "serialnumber",
    scopedSlots: { customRender: "serialnumber" }
  },
  {
    title: "AppId",
    dataIndex: "appid",
    key: "appid",
    scopedSlots: { customRender: "appid" }
  },
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "手机",
    dataIndex: "phone",
    key: "phone",
    scopedSlots: { customRender: "phone" }
  },
  {
    title: "邮箱",
    dataIndex: "mail",
    key: "mail",
    scopedSlots: { customRender: "mail" }
  },
  {
    title: "公司",
    dataIndex: "company",
    key: "company",
    scopedSlots: { customRender: "company" }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    customRender: type => {
      return statusMap[type].text;
    }
  },
  {
    title: "申请时间",
    dataIndex: "createAt",
    key: "createAt",
    scopedSlots: { customRender: "createAt" },
    customRender: val => {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "";
    }
  },
  {
    title: "审核时间",
    dataIndex: "processAt",
    key: "processAt",
    scopedSlots: { customRender: "processAt" },
    customRender: val => {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "";
    }
  },
  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" }
  }
];

const statusMap = {
  0: {
    status: "0",
    text: "未审批"
  },
  1: {
    status: "1",
    text: "通过"
  },
  2: {
    status: "2",
    text: "不通过"
  }
};

const data = [];

export default {
  data() {
    return {
      data,
      columns,
      loading: false,
      pagination: {
        // 分页配置器
        pageSize: 10, // 一页的数据限制
        current: 1, // 当前页
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"], // 指定每页可以显示多少条
        showTotal: total => `共${total}条数据` // 可以展示总数
      },
      queryParam: {
        page: 1, //第几页
        per_page: 10 //每页中显示数据的条数
      },
      firstVisible: false,
      detailData: {},
      createAt: 0,
      processAt: 0,
      updateAt: 0,
      statusVal: ""
    };
  },
  mounted() {
    // this.applicationAjax();

    // 新方法
    this.getUserApplyList(this.queryParam);
  },
  methods: {
    applicationAjax() {
      this.loading = true;
      userapplication
        .getApplicationList(this.queryParam)
        .then(res => {
          // console.log("res", JSON.stringify(this.queryParam));
          if (res.data.code == 0) {
            const pagination = { ...this.pagination };
            pagination.total = res.data.data.count;
            const rows = res.data.data.rows;
            // console.log("rows", JSON.stringify(rows));
            this.data = rows;
            this.pagination = pagination;
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch(err => {
          console.log("err", err);
          this.loading = false;
        });
    },

    showModal(record) {
      this.createAt = 0;
      this.processAt = 0;
      this.updateAt = 0;

      const id = record.id;
      const parameter = { id: id };
      this.getUserApplyDetail(id);
      // userapplication.getItemDetail(parameter).then(res => {
      //   const { createAt, processAt, updateAt, status } = res.data.data;
      //   this.detailData = res.data.data;
      //   this.createAt = moment(createAt).format("YYYY-MM-DD HH:mm:ss");
      //   this.processAt = moment(processAt).format("YYYY-MM-DD HH:mm:ss");
      //   this.updateAt = moment(updateAt).format("YYYY-MM-DD HH:mm:ss");
      //   if (status == 0) {
      //     this.statusVal = "未审批";
      //   } else if (status == 1) {
      //     this.statusVal = "通过";
      //   } else if (status == 2) {
      //     this.statusVal = "不通过";
      //   }
      // });
      this.firstVisible = true;
    },

    passApplication(record) {
      //通过
      const status = record.status;
      const id = record.id;
      const parameter = { id: id, status: 1 };
      if (status != 0) {
        this.$message.info("只有【未审批】状态，才能审核为通过！");
        return;
      }
      this.$confirm({
        title: "确认审核通过吗?",
        onOk: () => {
          this.loading = true;
          this.getUserApplyReview(record.id, 2);
          // userapplication
          //   .applicationListReview(parameter)
          //   .then(res => {
          //     const code = res.data.code;
          //     if (code != 0) {
          //       this.$message.info(res.data.error);
          //       this.loading = false;
          //     } else {
          //       this.$message.info("审核操作成功！");
          //       this.applicationAjax();
          //     }
          //     console.log("res", JSON.stringify(res));
          //   })
          //   .catch(err => {
          //     console.log("err", err);
          //     this.loading = false;
          //   });
        },
        onCancel() {}
      });
    },
    noPassApplication(record) {
      //不通过
      const status = record.status;
      if (status != 0) {
        this.$message.info("只有【未审批】状态，才能审核为不通过！");
        return;
      }
      this.$confirm({
        title: "确认审核不通过吗?",
        onOk: () => {
          this.loading = true;
          const id = record.id;
          const parameter = { id: id, status: 2 };
          this.getUserApplyReview(id, 2);
          // userapplication
          //   .applicationListReview(parameter)
          //   .then(res => {
          //     const code = res.data.code;
          //     if (code != 0) {
          //       this.$message.info(res.data.error);
          //       this.loading = false;
          //     } else {
          //       this.$message.info("审核操作成功！");
          //       this.applicationAjax();
          //     }
          //     console.log("res", JSON.stringify(res));
          //   })
          //   .catch(err => {
          //     console.log("err", err);
          //     this.loading = false;
          //   });
        },
        onCancel() {}
      });
    },
    handleTableChange(pagination) {
      this.loading = true;
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.queryParam.page = pagination.current;
      this.queryParam.per_page = pagination.pageSize;
      this.applicationAjax();
    },

    // 新方法
    // 接口：列表
    async getUserApplyList(parameter) {
      this.loading = true;
      const response = await userService.getUserApplyList(parameter);
      this.loading = false;
      if (response) {
        const pagination = { ...this.pagination };
        pagination.total = response.count;
        const rows = response.rows;
        this.data = rows;
        this.pagination = pagination;
      }
    },
    // 接口：是否通过
    async getUserApplyReview(id, status) {
      const response = await userService.getUserApplyReview(id, status);
      if (response) {
        this.$message.success(response);
        this.getUserApplyList(this.queryParam);
      }
    },
    // 接口：详情
    async getUserApplyDetail(id) {
      const response = await userService.getUserApplyDetail(id);
      if (response) {
        console.log("response", response);
        const { createAt, processAt, updateAt, status } = response;
        this.detailData = response;
        this.createAt = moment(createAt).format("YYYY-MM-DD HH:mm:ss");
        this.processAt = moment(processAt).format("YYYY-MM-DD HH:mm:ss");
        this.updateAt = moment(updateAt).format("YYYY-MM-DD HH:mm:ss");
        if (status == 0) {
          this.statusVal = "未审批";
        } else if (status == 1) {
          this.statusVal = "通过";
        } else if (status == 2) {
          this.statusVal = "不通过";
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-form {
  display: flex;
  align-items: center;
}
.correctControl {
  padding: 50px;
  .detail {
    margin-right: 20px;
  }
  .searchWrap {
    text-align: left;
    margin-bottom: 50px;
  }
  .nopass {
    color: red;
    margin-left: 20px;
  }
}

.selectWidth {
  width: 260px;
}

.wrap {
  display: flex;
  margin-top: 20px;
}
.wrap p {
  line-height: 30px;
  margin-left: 20px;
  display: flex;
  margin-right: 50px;
}
.wrap .search {
  margin-right: 5px;
}
.wrap p input {
  margin-left: 10px;
  width: 300px;
}
.pass {
  margin-right: 5px;
}
.detaiStyle > div {
  margin-bottom: 10px;
}
.detaiStyle > div > b {
  min-width: 160px;
  text-align: right;
  margin-right: 10px;
  display: inline-block;
}
</style>
