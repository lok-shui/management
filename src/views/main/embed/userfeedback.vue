<template>
  <div>
    <div :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="0">未处理</a-select-option>
                  <a-select-option value="1">已处理</a-select-option>
                  <a-select-option value="2">搁置</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8 || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' } || {}"
              >
                <a-button
                  type="primary"
                  @click="
                    queryParam.offset = 0;
                    userFeedbackList();
                  "
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px"
                  @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
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
          <!-- <span slot="serialnumber" slot-scope="text, record, index">
          {{ index + 1 }}
        </span> -->
          <template slot="action" slot-scope="text, record">
            <a
              slot="tags"
              class="pass"
              style="color: green"
              @click="passApplication(record)"
              >已处理 <span style="color:lightgrey">|</span></a
            >
            <a
              slot="tags"
              class="nopass"
              style="color: red"
              @click="noPassApplication(record)"
              >搁置 <span style="color:lightgrey">|</span></a
            >
            <a
              slot="tags"
              class="see"
              style="color:  green"
              @click="seeApplication(record)"
              >查看</a
            >
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
// import {getUserFeedbackList, updateUserFeedback,userFeedbackDetails} from "./js/uerapplication";
import userapplication from "@/utils/userapplication";
import userfeedtaskform from "./userfeedtaskform";
import moment from "moment";

const columns = [
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    scopedSlots: { customRender: "description" }
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
    title: "反馈时间",
    dataIndex: "createdAt",
    key: "createdAt",
    scopedSlots: { customRender: "createdAt" },
    customRender: val => {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "";
    }
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    key: "updatedAt",
    scopedSlots: { customRender: "updatedAt" },
    customRender: val => {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "";
    }
  },
  {
    title: "处理时间",
    dataIndex: "processedAt",
    key: "processedAt",
    scopedSlots: { customRender: "processedAt" },
    customRender: val => {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "";
    }
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

const statusMap = {
  0: {
    status: "0",
    text: "未处理"
  },
  1: {
    status: "1",
    text: "已处理"
  },
  2: {
    status: "2",
    text: "搁置"
  }
};

const data = [];

export default {
  data() {
    return {
      data,
      columns,
      loading: true,
      pagination: {
        // 分页配置器
        pageSize: 10, // 一页的数据限制
        current: 0, // 当前页
        total: 0, // 总数
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"], // 指定每页可以显示多少条
        showTotal: total => `共${total}条数据` // 可以展示总数
      },
      queryParam: {
        offset: 0, //第几页
        limit: 10 //每页中显示数据的条数
      }
    };
  },
  mounted() {
    this.userFeedbackList();
  },
  methods: {
    userFeedbackList() {
      this.loading = true;
      userapplication
        .getUserFeedbackList(this.queryParam)
        .then(res => {
          console.log("queryParam:", JSON.stringify(this.queryParam));
          console.log("res:", JSON.stringify(res));
          if (res.data.code == 0) {
            const pagination = { ...this.pagination };
            pagination.total = res.data.data.count;
            const data = res.data.data.docs; //这里写动态数组名称
            console.log("data", JSON.stringify(data));
            this.data = data;
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
    passApplication(record) {
      //已处理
      const id = record.id;
      const parameter = { id: id, status: 1 };
      const status = record.status;
      console.log("parameter:", parameter);
      if (status != 0) {
        this.$message.info("只有【未处理】状态，才能标记已处理！");
        return;
      }
      this.$confirm({
        title: "确认标记成【已处理】状态吗?",
        onOk: () => {
          this.loading = true;
          userapplication
            .updateUserFeedback(parameter)
            .then(res => {
              const code = res.data.code;
              if (code != 0) {
                this.$message.info(res.data.error);
                this.loading = false;
              } else {
                this.$message.info("操作成功！");
                this.userFeedbackList();
              }
              console.log("res", JSON.stringify(res));
            })
            .catch(err => {
              console.log("err", err);
              this.loading = false;
            });
        },
        onCancel() {}
      });
    },
    noPassApplication(record) {
      //搁置
      const id = record.id;
      const status = record.status;
      const parameter = { id: id, status: 2 };
      if (status != 0) {
        this.$message.info("只有【未处理】状态，才能处理才能标记搁置！");
        return;
      }
      this.$confirm({
        title: "确认标记成【搁置】状态吗?",
        onOk: () => {
          this.loading = true;
          userapplication
            .updateUserFeedback(parameter)
            .then(res => {
              const code = res.data.code;
              if (code != 0) {
                this.$message.info(res.data.error);
                this.loading = false;
              } else {
                this.$message.info("操作成功！");
                this.userFeedbackList();
              }
              console.log("res", JSON.stringify(res));
            })
            .catch(err => {
              console.log("err", err);
              this.loading = false;
            });
        },
        onCancel() {}
      });
    },
    seeApplication(record) {
      console.log("record:", JSON.stringify(record));
      const id = record.id;
      const parameter = { id: id };
      userFeedbackDetails
        .userFeedbackDetails(parameter)
        .then(res => {
          console.log("res:", JSON.stringify(res));
          const code = res.data.code;
          const detailsData = res.data.data;
          if (code != 0) {
            this.$message.info(res.data.error);
            return;
          }
          this.$dialog(
            userfeedtaskform,
            // component props
            {
              detailsData,
              on: {
                ok() {
                  console.log("ok 回调");
                },
                cancel() {
                  console.log("cancel 回调");
                },
                close() {
                  console.log("modal close 回调");
                }
              }
            },
            // modal props
            {
              title: "查看",
              width: 1000,
              centered: true,
              maskClosable: false
            }
          );
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    handleTableChange(pagination) {
      this.loading = true;
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.queryParam.page = pagination.current;
      this.queryParam.per_page = pagination.pageSize;
      this.userFeedbackList();
    }
  }
};
</script>

<style>
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
.nopass {
  margin-right: 5px;
}
.see {
  margin-left: 5px;
}
</style>
