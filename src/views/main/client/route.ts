export default {
  path: "client",
  name: "client",
  component: () =>
    import(/* webpackChunkName: "client" */ "@/views/main/client/Index.vue"),
  children: [
    {
      path: "order/list",
      name: "orderList",
      component: () => import("@/views/main/client/OrderList.vue")
    },
    {
      path: "list",
      name: "clientList",
      component: () => import("@/views/main/client/ClientList.vue")
    },
    {
      path: "new",
      name: "clientNew",
      component: () => import("@/views/main/client/ClientNew.vue")
    },
    {
      path: "bill/list",
      name: "billList",
      component: () => import("@/views/main/client/BillList.vue")
    },
    {
      path: "log/list",
      name: "logList",
      component: () => import("@/views/main/client/LogList.vue")
    },
    {
      path: "analysis",
      name: "clientAnalysis",
      component: () => import("@/views/main/client/Analysis.vue")
    },
    {
      path: "authorization/list",
      name: "authorizationList",
      component: () => import("@/views/main/client/AuthorizationList.vue")
    },
    {
      path: "authorization/new",
      name: "authorizationNew",
      component: () => import("@/views/main/client/AuthorizationNew.vue")
    },
    {
      path: "authorization/new/:id",
      name: "authorizationNew",
      component: () => import("@/views/main/client/AuthorizationNew.vue")
    },
    {
      path: "ConsultList",
      name: "ConsultList",
      component: () => import("@/views/main/client/ConsultList.vue")
    }
  ]
};
