import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    children: [
      // {
      //   name: "main",
      //   path: "/",
      //   component: () => import("@/views/Home.vue"),
      // },
      {
        path: "/",
        name: "default",
        component: () => import("@//views/monitoring/IndexPage.vue"),
      },
      {
        name: "login",
        path: "/login",
        component: () => import("@/views/auth/LoginPage.vue"),
      },
      {
        name: "SNS",
        path: "/login/social",
        component: () => import("@/views/auth/SNSPage.vue"),
      },
      {
        name: "register",
        path: "/register",
        component: () => import("@/views/auth/RegisterPage.vue"),
      },
      // {
      //   name: "findPassword",
      //   path: "/find-password",
      //   component: () => import("@/views/auth/FindPasswordPage.vue"),
      // },
    ],
  },
  // {
  //   path: "/",
  //   component: () => import("@/layouts/BlankLayout.vue"),
  //   children: [
  //     {
  //       name: "main",
  //       path: "/",
  //       component: () => import("@/views/Home.vue"),
  //     },
  //     {
  //       name: "login",
  //       path: "/login",
  //       component: () => import("@/views/auth/LoginPage.vue"),
  //     },
  //     // {
  //     //   name: "SNS",
  //     //   path: "/login/social",
  //     //   component: () => import("@/views/auth/SNSPage.vue"),
  //     // },
  //     // {
  //     //   name: "register",
  //     //   path: "/register",
  //     //   component: () => import("@/views/auth/RegisterPage.vue"),
  //     // },
  //     // {
  //     //   name: "findPassword",
  //     //   path: "/find-password",
  //     //   component: () => import("@/views/auth/FindPasswordPage.vue"),
  //     // },
  //   ],
  // },

  {
    path: "//briefing/preview",
    name: "briefing-preview",
    component: () => import("@/views/briefing/PreviewBriefingPage.vue"),
  },

  // ======== 모니터링 ===================================
  {
    path: "/monitoring",
    children: [
      {
        name: "monitoring",
        path: "/monitoring",
        component: () => import("@/views/monitoring/IndexPage.vue"),
      },
    ],
  },

  //======== 저장뉴스 ===================================
  {
    path: "/save-news",
    children: [
      {
        name: "save-news",
        path: "/save-news",
        component: () => import("@/views/save-news/IndexPage.vue"),
      },
    ],
  },

  //======== 집계 분석 ===================================
  // {
  //   path: "/analyze",
  //   component: () => import("@/layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       name: "analyze",
  //       path: "/analyze",
  //       component: () => import("@/views/analyze/IndexPage.vue"),
  //     },
  //   ],
  // },

  //======== 뉴스 보도 ===================================
  {
    path: "/distribute",
    children: [
      {
        name: "distribute",
        path: "/distribute",
        component: () => import("@/views/distribute/IndexPage.vue"),
      },
      {
        name: "distribute-edit",
        path: "/distribute/edit",
        component: () => import("@/views/distribute/EditPage.vue"),
        meta: {
          parent: "/distribute",
        },
      },
    ],
  },

  //======== 브리핑 ===================================
  {
    path: "/briefing",
    children: [
      {
        name: "briefing",
        path: "/briefing",
        component: () => import("@/views/briefing/IndexPage.vue"),
      },
      {
        name: "briefing-edit",
        path: "/briefing/edit",
        component: () => import("@/views/briefing/EditPage.vue"),
        meta: {
          parent: "/briefing",
        },
      },
    ],
  },

  //======== TOP 5 ===================================
  // {
  //   path: "/top-news",
  //   component: () => import("@/layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       name: "top-news",
  //       path: "/top-news",
  //       component: () => import("@/views/top-news/IndexPage.vue"),
  //     },
  //   ],
  // },

  //======== 메타베이 ===================================
  {
    path: "/metavey",
    children: [
      {
        name: "metavey",
        path: "/metavey",
        component: () => import("@/views/metavey/IndexPage.vue"),
      },
    ],
  },
  //======== 설정 ===================================
  {
    path: "/setting",
    children: [
      {
        name: "setting",
        path: "/setting",
        component: () => import("@/views/setting/IndexPage.vue"),
      },
    ],
  },
];

const Router = createRouter({
  history: createWebHistory(),
  routes,
});
const beforLoginRoutes = [
  "/",
  "/login",
  "/login/social",
  "/register",
  "/find-password",
];
Router.beforeEach((to, from, next) => {
  const toPath = to.path;
  const hasSession = localStorage.getItem("user_name");
  // 로그인 여부 상관 없는 페이지
  if (["/briefing/preview"].includes(toPath)) {
    return next();
  }
  // 로그인, 회원가입페이지로 가는데, 로그인중일때
  if (beforLoginRoutes.includes(toPath) && hasSession) {
    return next({ name: "monitoring" });
    //  로드인 안했는데, 불가능한 페이지로 갈때
  } else if (!beforLoginRoutes.includes(toPath) && !hasSession) {
    return next({ name: "login" });
    //  정상적일때
  } else {
    return next();
  }
  // ...
});

export default Router;
