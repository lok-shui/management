<template>
  <div class="nav-contain">
    <div class="left">AI赋能平台后台管理系统</div>
    <div class="right">
      <div class="head-logo"></div>
      <div class="nav-text" @click="showInfo">{{ username }}</div>
      <div class="space"></div>
      <div class="nav-text" @click="redirectFrontend" title="跳转到前台">
        前台
      </div>
      <div class="space"></div>
      <!-- <div class="nav-text" @click="changePWD">修改密码</div>
      <div class="space"></div> -->
      <div class="nav-text" @click="logout">退出</div>
    </div>

    <a-modal
      title="修改密码"
      :visible="visiblePwd"
      @ok="handleOkPwd"
      :confirmLoading="confirmLoading"
      @cancel="handleCancelPwd"
    >
      <a-input
        class="input-pwd"
        v-model="oldPwd"
        placeholder="请输入旧密码"
        type="password"
        allowClear
      />
      <a-input
        class="input-pwd"
        v-model="newPwd"
        placeholder="请输入新密码"
        type="password"
        allowClear
      />
      <a-input
        class="input-pwd"
        v-model="newPwd2"
        placeholder="请确认新密码"
        type="password"
        allowClear
      />
    </a-modal>

    <a-modal
      title="个人资料"
      :visible="visibleInfo"
      :footer="null"
      :maskClosable="true"
      :closable="true"
      @cancel="cancel"
    >
      <div class="user-infos" v-for="(item, index) in userInfos" :key="index">
        <label>{{ item.label }}:</label>
        <span>{{ item.val }}</span>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { message as Toast } from "ant-design-vue";
import LoginService from "@/service/login";
import moment from "moment";
import store from "@/store";

const loginService = LoginService.getLoginService();

@Component
export default class TaNav extends Vue {
  get username() {
    return this.$store.state.user.username;
  }

  get id() {
    return this.$store.state.user.id;
  }

  visiblePwd: any = false;
  confirmLoading: any = false;

  oldPwd: any = "";
  newPwd: any = "";
  newPwd2: any = "";

  visibleInfo: any = false;

  userInfos: any[] = [
    { label: "用户名", val: "", field: "username" },
    {
      label: "角色",
      val: "",
      field: "mipRole",
      format: (v: any[]) => {
        if (v && v.length > 0) {
          return v.join(",");
        }
        return "";
      }
    },
    { label: "部门", val: "", field: "department" },
    { label: "职位", val: "", field: "role" },
    { label: "邮箱", val: "", field: "email" },
    { label: "电话", val: "", field: "mobile" },
    {
      label: "最后登录时间",
      val: "",
      field: "lastLoginTime",
      format: (v: any) => {
        return moment(v).format("YYYY-MM-DD HH:mm");
      }
    }
  ];

  async logout() {
    this.$message.loading("正在登出中");
    store.commit("clearUser");
    this.$message.destroy();
    this.$message.success("登出成功");
    this.$router.push("/login");
  }

  changePWD() {
    this.visiblePwd = true;
  }

  async redirectFrontend() {
    window.location.href = await loginService.frontPage();
  }

  handleOkPwd() {
    if (!(this.oldPwd && this.newPwd && this.newPwd2)) {
      Toast.error("请输入密码");
    } else if (this.newPwd !== this.newPwd2) {
      Toast.error("两次输入的新密码不一致");
    } else {
      // TODO 增加密码校验规则
      loginService.changePwd({
        id: this.id,
        username: this.username,
        oldPassw: this.oldPwd,
        newPassw: this.newPwd
      });
      this.handleCancelPwd();
    }
  }

  handleCancelPwd() {
    this.visiblePwd = false;
  }

  async showInfo() {
    this.visibleInfo = true;

    const data = await loginService.getUserInfo(this.id);

    console.log(data);

    this.userInfos.forEach((m: any) => {
      if (m.format) {
        m.val = m.format(data[m.field]);
      } else {
        m.val = data[m.field];
      }
    });
  }

  cancel() {
    this.visibleInfo = false;
  }
}
</script>

<style lang="scss" scoped>
.nav-contain {
  height: 72px;
  background-color: #31c37c;
  // border-bottom: #31c37c solid 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    color: #ffffff;
    font-weight: 600;
    font-size: 20px;
    padding-left: 20px;
  }

  .right {
    padding-right: 20px;
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 16px;

    .head-logo {
      width: 32px;
      height: 32px;
      background-color: #ffffff;
      background-size: 100% 100%;
      background-image: url("../assets/logo.png");
      border-radius: 50%;
      margin-right: 12px;
    }

    .nav-text {
      cursor: pointer;
      user-select: none;
    }

    .space {
      width: 1px;
      height: 16px;
      background-color: #ffffff;
      margin: 0 16px;
    }
  }
}

.user-infos {
  label {
    width: 100px;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
  }
}
.input-pwd {
  margin: 10px;
}
</style>
