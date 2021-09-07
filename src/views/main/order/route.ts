export default {
  path: "order",
  name: "order",
  component: () =>
    import(/* webpackChunkName: "order" */ "@/views/main/order/Index.vue"),
  children: [
    {
      path: "orderList",
      name: "orderList",
      component: () => import("@/views/main/order/orderList.vue")
    },
    {
      path: "orderEdit",
      name: "orderEdit",
      component: () => import("@/views/main/order/orderEdit.vue")
    },
    {
      path: "orderEdit/:id",
      name: "orderEdit",
      component: () => import("@/views/main/order/orderEdit.vue")
    },
    {
      path: "orderDatils/:id",
      name: "orderDatils",
      component: () => import("@/views/main/order/orderDatils.vue")
    }
  ]
};
