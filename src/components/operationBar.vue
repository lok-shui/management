<template>
  <div class="main-contain">
    <a-button
      v-for="(btn, index) in btnItems"
      :key="index"
      class="ta-btn"
      :type="btn.type"
      @click="handleClick(btn.event)"
    >
      {{ btn.text }}
    </a-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class operationBar extends Vue {
  @Prop() hideDelete?: boolean;
  @Prop() btnItems?: any[];

  // btnItems: any[] = [
  //   { text: "新增", type: "primary", event: "new" },
  //   { text: "启用", type: "default", event: "active" },
  //   { text: "禁用", type: "default", event: "suspend" },
  //   { text: "删除", type: "default", event: "delete" }
  // ];

  handleClick(event: string) {
    this.$emit("handleClick", event);
  }
}
</script>

<style lang="scss" scoped>
.main-contain {
  // width: 100%;
  // height: 72px;
  display: flex;
  align-items: center;
  margin-right: 100px;

  .ta-btn {
    // width: 88px;
    margin-right: 8px;
  }
}
</style>
