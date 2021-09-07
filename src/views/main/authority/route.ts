export default {
  path: "authority",
  name: "authority",
  component: () =>
    import(
      /* webpackChunkName: "authority" */ "@/views/main/authority/Index.vue"
    ),
  children: [
    {
      path: "admin/list",
      name: "adminList",
      component: () => import("@/views/main/authority/AdminList.vue")
    },
    {
      path: "admin/new",
      name: "adminNew",
      component: () => import("@/views/main/authority/AdminNew.vue")
    },
    {
      path: "role/list",
      name: "roleList",
      component: () => import("@/views/main/authority/RoleList.vue")
    },
    {
      path: "role/new",
      name: "roleNew",
      component: () => import("@/views/main/authority/RoleNew.vue")
    },
    {
      path: "list",
      name: "authorityList",
      component: () => import("@/views/main/authority/AuthorityList.vue")
    },
    {
      path: "new",
      name: "authorityNew",
      component: () => import("@/views/main/authority/AuthorityNew.vue")
    },
    {
      path: "video/list",
      name: "videoList",
      component: () => import("@/views/main/authority/VideoList.vue")
    },
    {
      path: "video/new",
      name: "videoNew",
      component: () => import("@/views/main/authority/VideoNew.vue")
    },
    {
      path: "config/list",
      name: "configList",
      component: () => import("@/views/main/authority/ConfigList.vue")
    },
    {
      path: "config/new",
      name: "configNew",
      component: () => import("@/views/main/authority/ConfigNew.vue")
    },
    {
      path: "platform",
      name: "platform",
      component: () => import("@/views/main/authority/platform.vue")
    }
  ]
};
