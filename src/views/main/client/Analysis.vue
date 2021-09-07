<template>
  <div class="list-contain">
    <a-menu
      class="menu-tab"
      v-model="menuItem"
      mode="horizontal"
      @click="handleClick"
    >
      <a-menu-item :key="1">访问时长</a-menu-item>
      <a-menu-item :key="2">访问时段</a-menu-item>
    </a-menu>

    <div class="main-contain">
      <div class="operation-contain">
        <a-range-picker
          @change="onDateChange"
          :defaultValue="[moment(startDate), moment(endDate)]"
        />
      </div>

      <div class="chart-item" ref="myChart"></div>

      <div class="operation-contain">
        <!-- <a-form layout="inline">
          <a-form-item label="排序">
            <a-select>

            </a-select>
          </a-form-item>
        </a-form> -->
      </div>
      <a-table
        class="my-table"
        :columns="columns"
        :dataSource="tableData"
        rowKey="id"
        :pagination="false"
      >
      </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import moment from "moment";
import echarts from "echarts";
import { cloneDeep } from "lodash";
import ClientService from "@/service/client";

const clientService = ClientService.getService();

@Component
export default class ClientAnalysis extends Vue {
  menuItem: any[] = [1];
  tabIndex: number = 1;

  startDate: string = "";
  endDate: string = "";

  // columns: any[] = []
  tableData: any[] = [];
  baseTableItem = {
    total: 0,
    percent: 0,
    pc: 0,
    android: 0,
    iphone: 0
  };

  chartColors: string[] = ["#5B8FF9", "#AFE39B", "#33D3EB"];
  myEChart: any;

  get columns() {
    const columns: any[] = [
      {
        title:
          this.statisticsType === "onlineTimeDate" ? "访问时长" : "访问时段",
        dataIndex: "label"
      },
      { title: "访问人数", dataIndex: "total" },
      { title: "人数占比", dataIndex: "percent" },
      {
        title: "访问客户端",
        children: [
          { title: "pc", dataIndex: "pc", width: "15%", align: "center" },
          {
            title: "android",
            dataIndex: "android",
            width: "15%",
            align: "center"
          },
          { title: "ios", dataIndex: "iphone", width: "15%", align: "center" }
        ]
      }
    ];

    return columns;
  }

  get moment() {
    return moment;
  }

  get statisticsType() {
    return this.tabIndex === 1 ? "onlineTimeDate" : "onlineTimeHour";
  }

  created() {
    const start = moment()
      .subtract(30, "days")
      .format("YYYY-MM-DD");
    const end = moment().format("YYYY-MM-DD");
    this.startDate = start;
    this.endDate = end;

    this.getAnalysisData();
  }

  mounted() {
    this.myEChart = echarts.init(this.$refs.myChart);
  }

  async getAnalysisData() {
    const response = await clientService.getAnalysisData({
      type: this.statisticsType,
      dateStart: moment(this.startDate).format("YYYYMMDD"),
      dateEnd: moment(this.endDate).format("YYYYMMDD")
    });
    this.tableData =
      this.statisticsType === "onlineTimeDate"
        ? this.formatDateData(response)
        : this.formatTimeData(response);
    this.renderChart();
  }

  formatDateData(data: any[]) {
    const totalCount = data.length || 1;
    let tableData: any = [];
    for (let i = 0; i <= 12; i++) {
      const item = {
        id: i,
        label: i === 12 ? ">12" : `${i}-${i + 1}`,
        ...this.baseTableItem
      };
      tableData.push(item);
    }

    data.forEach((item: any) => {
      const { total, platform } = item;
      const tag = total / 60 > 12 ? 12 : Math.floor(total / 60);
      tableData[tag].total += 1;
      tableData[tag][platform] += 1;
    });

    tableData.forEach((item: any) => {
      item.percent = Math.round((item.total * 100) / totalCount) + "%";
    });

    return tableData;
  }

  formatTimeData(data: any[]) {
    const totalCount = data.length || 1;
    let tableData: any = [];
    for (let i = 8; i <= 21; i++) {
      const item = {
        id: i,
        label: i === 21 ? "21:00-8:00" : `${i}:00-${i + 1}:00`,
        ...this.baseTableItem
      };
      tableData.push(item);
    }

    data.forEach((item: any) => {
      const { time, platform } = item;
      const tag = time > 21 || time < 8 ? 13 : time - 8;
      tableData[tag].total += 1;
      tableData[tag][platform] += 1;
    });

    tableData.forEach((item: any) => {
      item.percent = Math.round((item.total * 100) / totalCount) + "%";
    });

    return tableData;
  }

  renderChart() {
    const data = cloneDeep(this.tableData);
    this.statisticsType === "onlineTimeDate"
      ? this.renderDateChart(data)
      : this.renderTimeChart(data);
  }

  renderDateChart(data: any) {
    const options = {
      tooltip: {
        trigger: "axis"
      },
      xAxis: {
        type: "category",
        data: data.map((item: any) => item.label)
        // axisLabel: { interval: 0 }
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: data.map((item: any) => item.total),
          type: "bar",
          barMaxWidth: "80px"
        }
      ],
      color: this.chartColors
    };
    this.myEChart.setOption(options);
    this.myEChart.resize();
  }

  renderTimeChart(data: any) {
    const options = {
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        // boundaryGap: false,
        data: data.map((item: any) => item.label)
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          type: "line",
          data: data.map((item: any) => item.total)
        }
      ],
      color: this.chartColors
    };
    this.myEChart.setOption(options);
    this.myEChart.resize();
  }

  handleClick(e: any) {
    if (this.tabIndex === e.key) return;
    this.tabIndex = e.key;

    this.getAnalysisData();
  }

  onDateChange(date: any, dateString: any) {
    console.log(date);
    console.log(dateString);
    const [start, end] = dateString;
    this.startDate = start;
    this.endDate = end;
    this.getAnalysisData();
  }
}
</script>

<style lang="scss" scoped>
@import "../authority/basic.scss";

.menu-tab {
  margin-top: 20px;
  text-align: left;
}

.main-contain {
  // padding-top: 20px;
  padding-bottom: 50px;

  .operation-contain {
    text-align: left;
  }
}

.chart-item {
  width: 100%;
  height: 400px;
  // margin: auto;
}

.my-table {
  text-align: center;
}
</style>
