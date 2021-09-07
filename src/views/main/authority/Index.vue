<template>
  <a-layout theme="light" class="ta-contain">
    <a-layout-content theme="light" class="ta-content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class School extends Vue {}
</script>

<style scoped lang="scss">
.ta-contain {
  height: 100%;
  background-color: #ffffff;
}
</style>
