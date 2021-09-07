<template>
  <div class="sider-contain">
    <a-menu
      @click="handleClick"
      style="width: 256px"
      :openKeys.sync="defaultOpenKeys"
      :selectedKeys="defaultSelectedKeys"
      mode="inline"
    >
      <a-sub-menu v-for="menu in menuItems" :key="menu.key">
        <span
          slot="title"
          :class="menu.key == defaultOpenKeys ? '' : 'defaultColor'"
          >{{ menu.label }}</span
        >
        <template v-for="item in menu.children">
          <a-sub-menu
            v-if="item.children && item.children.length"
            :key="item.key"
            :title="item.label"
          >
            <a-menu-item
              v-for="subItem in item.children"
              :key="subItem.key"
              @click="toPath(subItem.path)"
              >{{ subItem.label }}</a-menu-item
            >
          </a-sub-menu>
          <a-menu-item v-else :key="item.key" @click="toPath(item.path)">{{
            item.label
          }}</a-menu-item>
        </template>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class TaSider extends Vue {
  defaultOpenKeys: string[] = ["sub2"];
  defaultSelectedKeys: string[] = ["2"];

  menuItems: any[] = [
    {
      key: "sub1",
      label: "系统管理",
      base: "authority",
      children: [
        { key: "1", label: "用户管理", path: "/main/authority/admin/list" },
        { key: "2", label: "角色管理", path: "/main/authority/role/list" },
        { key: "3", label: "权限管理", path: "/main/authority/list" },
        { key: "4", label: "配置管理", path: "/main/authority/config/list" },
        { key: "5", label: "服务资源管理", path: "/main/authority/video/list" }
        // { key: "5", label: "平台概况", path: "/main/authority/platform" },
        // { key: "6", label: "系统监控", path: "/main/authority/system" }
      ]
    },
    {
      key: "sub2",
      label: "服务管理",
      base: "service",
      children: [
        { key: "1", label: "api规范", path: "/main/service/restfulStandard" },
        { key: "2", label: "服务列表", path: "/main/service/list" },
        { key: "3", label: "接口管理", path: "/main/service/interface/list" },
        {
          key: "4",
          label: "行业应用管理",
          path: "/main/service/ApplicationList"
        },
        { key: "5", label: "首页管理", path: "/main/service/HomeList" },
        { key: "16", label: "工单管理", path: "/main/service/WorkOrderList" }
      ]
    },
    {
      key: "sub3",
      label: "客户管理",
      base: "client",
      children: [
        { key: "10", label: "客户列表", path: "/main/client/list" },
        {
          key: "11",
          label: "授权管理",
          path: "/main/client/authorization/list"
        },
        { key: "12", label: "服务记录", path: "/main/client/order/list" },
        { key: "13", label: "服务账单", path: "/main/client/bill/list" },
        { key: "14", label: "合作咨询", path: "/main/client/ConsultList" }
        // { key: "14", label: "访问日志", path: "/main/client/log/list" },
        // { key: "15", label: "行为分析", path: "/main/client/analysis" }
      ]
    },
    {
      key: "sub4",
      label: "批改系统",
      base: "embed",
      children: [
        { key: "1", label: "用户申请", path: "/main/embed/ApplicationReview" },
        { key: "2", label: "用户反馈", path: "/main/embed/userfeedtaskform" }
      ]
    },
    {
      key: "sub5",
      label: "订单管理",
      base: "order",
      children: [{ key: "1", label: "我的订单", path: "/main/order/orderList" }]
    }
  ];

  @Watch("$route.path")
  pathWatch() {
    this.refreshMeum();
  }

  created() {
    this.refreshMeum();
    // if (routeItem) {
    //   this.defaultOpenKeys = [base.key];
    //   this.defaultSelectedKeys = [routeItem.key];
    // }
  }

  refreshMeum() {
    const path = this.$route.path;
    const base = this.menuItems.filter(
      item => path.indexOf(item.base) !== -1
    )[0];
    const routeItem = base.children.filter(
      (item: any) => path.replace("new", "list") === item.path
    )[0];
    if (base) this.defaultOpenKeys = [base.key];
    if (routeItem) this.defaultSelectedKeys = [routeItem.key];
    if (this.$route.meta.SelectedKeys !== undefined) {
      this.defaultSelectedKeys = [this.$route.meta.SelectedKeys];
    }
  }

  handleClick(e: any) {
    console.log("click", e);
  }

  titleClick(e: any) {
    console.log("titleClick", e);
  }

  toPath(url: string) {
    if (!url || url.indexOf("/") === -1) return;
    this.$router.push({
      path: url
    });
  }
}
</script>

<style lang="scss" scoped>
.sider-contain {
  height: 100%;
  text-align: left;

  ul {
    height: 100%;
  }
}
.defaultColor {
  color: rgba(0, 0, 0, 0.65);
}
</style>
