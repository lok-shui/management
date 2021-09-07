import Vue from "vue";
import VueRouter from "vue-router";

import authorityRoute from "@/views/main/authority/route";
import serviceRoute from "@/views/main/service/route";
import clientRoute from "@/views/main/client/route";
import embedRoute from "@/views/main/embed/route";
import orderRoute from "@/views/main/order/route";
Vue.use(VueRouter);

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to: any) {
  //@ts-ignore
  return VueRouterPush.call(this, to).catch((err: any) => err);
};

const routes = [
  {
    path: "/",
    redirect: "/main/service/list"
  },
  {
    path: "/main",
    name: "main",
    component: () =>
      import(/* webpackChunkName: "main" */ "@/views/main/Index.vue"),
    children: [
      authorityRoute,
      serviceRoute,
      clientRoute,
      embedRoute,
      orderRoute
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/Index.vue")
  },
  {
    path: "/logout",
    name: "logout",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/Index.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
