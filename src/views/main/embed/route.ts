export default {
  path: "embed",
  name: "embed",
  component: () =>
    import(/* webpackChunkName: "embed" */ "@/views/main/embed/Index.vue"),
  children: [
    {
      path: "ApplicationReview",
      name: "ApplicationReview",
      component: () => import("@/views/main/embed/ApplicationReview.vue")
    },
    {
      path: "userfeedtaskform",
      name: "userfeedtaskform",
      component: () => import("@/views/main/embed/userfeedtaskform.vue")
    }
  ]
};
