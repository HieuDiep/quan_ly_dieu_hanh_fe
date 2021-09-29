import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";
import Login from "../views/Login.vue";
import ChuKy from "../views/chu-ky/index.vue";
import auth from "../middleware/auth";
import api from "@/services";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "ASGL - Đăng nhập",
    },
  },
  {
    path: "/",
    name: "index",
    component: () => import("../views/propose/Propose.vue"),
    meta: {
      title: "ASGL",
    },
  },

  {
    path: "/de-xuat",
    name: "de-xuat",
    component: () => import("../views/propose/Propose.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/de-xuat/sao-chep/:id",
    name: "de-xuat",
    component: () => import("../views/propose/Copy.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/de-xuat/tao-moi",
    name: "de xuat tao moi",

    component: () => import("../views/propose/Create.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/de-xuat/chinh-sua/:id",
    name: "de xuat chinh sua",

    component: () => import("../views/propose/Update.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/de-xuat/chi-tiet/:id",
    name: "de xuat chinh sua",

    component: () => import("../views/propose/Detail.vue"),
    meta: {
      title: "ASGL",
    },
  },

  {
    path: "/can-duyet",
    name: "Cần duyệt",

    component: () => import("../views/approval/Approval.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/can-duyet/:id",
    name: "Chi tiết cần duyệt",

    component: () => import("../views/approval/ApprovalDetail.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/theo-doi",
    name: "Theo dõi",
    component: () => import("../views/follow/Follow.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/theo-doi/chi-tiet/:id",
    name: "Chi tiết theo dõi",

    component: () => import("../views/propose/Detail.vue"),
    meta: {
      title: "ASGL",
    },
  },

  {
    path: "/danh-muc",
    name: "danh-muc",
    component: () => import("../views/category/Category.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/danh-muc/tao-moi",
    name: "danh-muc tao-moi",
    component: () => import("../views/category/Create.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/danh-muc/chinh-sua/:id",
    name: "danh-muc",
    component: () => import("../views/category/Create.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/tai-lieu/in/:id",
    name: "in-tai-lieu",
    component: () => import("../views/print/doc/index.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/chu-ky",
    name: "chu-ky",
    component: ChuKy,
    meta: {
      title: "ASGL - Chữ ký",
    },
  },
  {
    path: "/giao-viec",
    name: "Giao việc",
    component: () => import("../views/to-do/index.vue"),
    meta: {
      title: "ASGL",
    },
  },
  {
    path: "/giao-viec/:id",
    name: "Chi tiết giao việc",
    component: () => import("../views/to-do/Detail.vue"),
    meta: {
      title: "ASGL",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});
router.beforeEach(async (to, from, next) => {
  if (to?.meta?.title) {
    document.title = to.meta.title;
  }
  if (to.path.includes("/login")) {
    if (auth()) {
      const userAuth = store.state.auth;
      if (userAuth.isAuth && userAuth.user) {
        next();
        return;
      }
      setTimeout(async () => {
        const res = await api.user.getUserInfo();
        if (!res) {
          localStorage.removeItem("auth._token.local");
          await api.user.redirectToSSO();
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
          //  if (process.env.VUE_APP_ENV === "DEV") {
          //   next({
          //     path: "/login",
          //     query: { redirect: to.fullPath },
          //    });
          //  }
        }
        try {
          if (res.status > 399) {
            localStorage.removeItem("auth._token.local");
            await api.user.redirectToSSO();
            // if (process.env.VUE_APP_ENV === "DEV") {
            //  next({
            //   path: "/login",
            //   query: { redirect: to.fullPath },
            //  });
            // }
            next({
              path: "/login",
              query: { redirect: to.fullPath },
            });

            return;
          }
          if (res.response && !res.response.data.success) {
            localStorage.removeItem("auth._token.local");
            next({
              path: "/login",
              query: { redirect: to.fullPath },
            });
            return;
          }
          const localToken = localStorage.getItem("auth._token.local");
          const auth_set = {
            isAuth: true,
            user: res.data.data,
            token: `Bearer ${localToken}`,
          };
          store.commit("SET_USER_LOGGEDIN", auth_set);
          const nextStep =
            to.query && to.query.redirect ? to.query.redirect : "/";
          next({
            path: String(nextStep),
          });
        } catch (error) {
          console.log(error);
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
        }
      }, 1000);
    } else {
      await api.user.redirectToSSO();
      //  if (process.env.VUE_APP_ENV === "DEV") {
      //   next();
      //  }
      next();
    }
    return;
  } else {
    if (auth()) {
      const userAuth = store.state.auth;
      if (userAuth.isAuth && userAuth.user) {
        next();
        return;
      }
      setTimeout(async () => {
        const res = await api.user.getUserInfo();
        if (!res) {
          localStorage.removeItem("auth._token.local");
          await api.user.redirectToSSO();
          //  if (process.env.VUE_APP_ENV === "DEV") {
          //   next({
          //    path: "/login",
          //    query: { redirect: to.fullPath },
          //   });
          //  }
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
        }
        try {
          if (res.status > 399) {
            localStorage.removeItem("auth._token.local");
            await api.user.redirectToSSO();
            // if (process.env.VUE_APP_ENV === "DEV") {
            //  next({
            //   path: "/login",
            //   query: { redirect: to.fullPath },
            //  });
            // }
            next({
              path: "/login",
              query: { redirect: to.fullPath },
            });
            return;
          }
          if (res.response && !res.response.data.success) {
            localStorage.removeItem("auth._token.local");
            await api.user.redirectToSSO();
            // if (process.env.VUE_APP_ENV === "DEV") {
            //  next({
            //   path: "/login",
            //   query: { redirect: to.fullPath },
            //  });
            // }
            next({
              path: "/login",
              query: { redirect: to.fullPath },
            });
            return;
          }
          const localToken = localStorage.getItem("auth._token.local");
          const auth_set = {
            isAuth: true,
            user: res.data.data,
            token: `Bearer ${localToken}`,
          };
          store.commit("SET_USER_LOGGEDIN", auth_set);
          // const nextStep = to.query && to.query.redirect ? to.query.redirect : "/";
          const nextStep = to.fullPath;
          next({
            path: String(nextStep),
          });
        } catch (error) {
          console.log(error);
          await api.user.redirectToSSO();
          //  if (process.env.VUE_APP_ENV === "DEV") {
          //   next({
          //    path: "/login",
          //    query: { redirect: to.fullPath },
          //   });
          //  }
          next({
            path: "/login",
            query: { redirect: to.fullPath },
          });
        }
      }, 1000);
    } else {
      localStorage.removeItem("auth._token.local");
      await api.user.redirectToSSO();
      //  if (process.env.VUE_APP_ENV === "DEV") {
      //   next({
      //    path: "/login",
      //    query: { redirect: to.fullPath },
      //   });
      //  }
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  }
});
export default router;
