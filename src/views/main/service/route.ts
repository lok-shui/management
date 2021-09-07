export default {
  path: "service",
  name: "service",
  component: () =>
    import(/* webpackChunkName: "service" */ "@/views/main/service/Index.vue"),
  children: [
    {
      path: "restfulStandard",
      name: "restfulStandard",
      component: () => import("@/views/main/service/apiStandard.vue")
    },
    {
      path: "list",
      name: "serviceList",
      component: () => import("@/views/main/service/ServiceList.vue")
    },
    {
      path: "new",
      name: "serviceNew",
      component: () => import("@/views/main/service/ServiceNew.vue"),
      meta: {
        SelectedKeys: "2"
      }
    },
    {
      path: "price",
      name: "PriceNew",
      component: () => import("@/views/main/service/PriceNew.vue"),
      meta: {
        SelectedKeys: "6"
      }
    },
    {
      path: "HomeList",
      name: "HomeList",
      component: () => import("@/views/main/service/HomeList.vue")
    },
    {
      path: "HomeBannerNew",
      name: "HomeBannerNew",
      component: () => import("@/views/main/service/HomeBannerNew.vue"),
      meta: {
        SelectedKeys: "5"
      }
    },
    {
      path: "ApplicationList",
      name: "ApplicationList",
      component: () => import("@/views/main/service/ApplicationList.vue")
    },
    {
      path: "ApplicationNew",
      name: "ApplicationNew",
      component: () => import("@/views/main/service/ApplicationNew.vue"),
      meta: {
        SelectedKeys: "4"
      }
    },
    {
      path: "WorkOrderList",
      name: "WorkOrderList",
      component: () => import("@/views/main/service/WorkOrderList.vue")
    },
    {
      path: "interface/list",
      name: "apiList",
      component: () => import("@/views/main/service/ApiList.vue")
    },
    {
      path: "interface/new",
      name: "apiNew",
      component: () => import("@/views/main/service/ApiNew.vue")
    },
    {
      path: "interface/template",
      name: "apiTemplate",
      component: () => import("@/views/main/service/ApiTemplate.vue"),
      meta: {
        SelectedKeys: "3"
      }
    }
  ]
};
