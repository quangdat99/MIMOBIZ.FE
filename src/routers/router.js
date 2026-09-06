import { createRouter, createWebHistory } from "vue-router";
import routerAdmin from "./routerAdmin.js";
import commonFn from '@/commons/commonFunction.js';
import auth from '@/commons/authService.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "",
      redirect: '/thaco/timesheet',
      name: 'Trang chủ',
      component: () => import(/* webpackChunkName: "home" */ '@/views/admin/AdminPage.vue'),
      meta: {
        anonymous: false
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import(/* webpackChunkName: "home" */ '@/views/notfound/NotFound.vue'),
      meta: {
        anonymous: true
      }
    }, {
      path: '/login',
      component: () => import(/* webpackChunkName: "home" */ '@/views/login/LoginPage.vue'),
      name: 'Đăng nhập',
      meta: {
        anonymous: true
      }
    },
    ...routerAdmin
  ],
});

router.beforeEach((to, from, next) => {
  // khi chuyển router sẽ show maskLoading cho người dùng xử lý
  commonFn.mask();
  document.title = to.name;
  if (to.meta.anonymous) {
    next();
    return;
  }
  // kiểm tra authen --> redirect login
  if (!auth.isAuthenticated(to)) {
    auth.login(to);
    return;
  }
  next();
})

router.afterEach(() => {
  commonFn.unmask();
})

export default router;
