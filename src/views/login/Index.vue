<template>
  <div class="login-contain">
    <div class="login-form">
      <div class="title">AI赋能平台</div>
      <div class="sub-title">后台管理系统</div>

      <a-form class="form-contain" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            size="large"
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入账号!' }] }
            ]"
            placeholder="请输入账号"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码!' }] }
            ]"
            placeholder="请输入密码"
            type="password"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            size="large"
            html-type="submit"
            class="login-btn"
          >
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LoginService from "@/service/login";

const loginService = LoginService.getLoginService();

@Component
export default class Login extends Vue {
  form: any = {};

  created() {
    this.form = this.$form.createForm(this, {});
    const path = this.$route.path;
    console.log(path);
    if (path.endsWith("logout")) {
      loginService.clearUserCache();
      this.$router.push("/login");
      // loginService.logout();
    }
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, values: any) => {
      if (err) return;
      const { name, password } = values;
      this.handleLogin({
        name,
        password
      });
    });
  }

  //后续修改登陆接口
  async handleLogin(user: any) {
    try {
      // this.$message.loading("正在登录中");
      const response = await loginService.login(user);
      this.$message.destroy();
      if (!response) {
        this.$message.error("用户名或密码不正确!");
        return;
      }
      this.$message.success("登录成功");
      this.$router.push("/");
    } catch (err) {
      this.$message.destroy();
      this.$message.error(err.error);
    }
  }
}
</script>

<style scoped lang="scss">
.login-contain {
  width: 100%;
  min-width: 1440px;
  height: 100%;
  background-color: #e8f6ef;
  display: flex;
  align-items: center;
  justify-content: center;

  .login-form {
    width: 400px;
    height: 432px;
    background-color: #fff;
    box-shadow: 0 10px 30px -8px rgba(54, 131, 94, 0.2);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      margin-top: 42px;
      background-size: 100% 100%;
      width: 144px;
      height: 42px;
      // background-image: url("../../assets/images/login-title.png");
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }

    .sub-title {
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      font-size: 20px;
      margin-top: 4px;
    }

    .form-contain {
      width: 328px;
      margin-top: 42px;
      text-align: left;

      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
