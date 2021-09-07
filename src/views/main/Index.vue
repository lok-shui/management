<template>
  <a-layout class="app">
    <ta-nav />
    <a-layout class="main">
      <a-layout-sider width="256" style="background: #fff">
        <ta-sider />
      </a-layout-sider>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import cache from "@/utils/cache";
import TaNav from "@/components/Nav.vue";
import TaSider from "@/components/Sider.vue";

@Component({
  components: {
    TaNav,
    TaSider
  }
})
export default class Main extends Vue {
  created() {
    const dmid = cache.localGet("ai-dmid");
    if (!dmid) {
      this.$router.push({
        path: "/login"
      });
      return;
    }
    this.$store.dispatch("getUserInfo");
  }
}
</script>

<style lang="scss" scoped>
.app {
  height: 100%;
}

.main {
  // height: calc(100% - 58px);
  background-color: #ffffff;
}
/deep/.ant-layout {
  background-color: #fff;
}
</style>
