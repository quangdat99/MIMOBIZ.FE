export default [
  {
    path: '/thaco',
    component: () => import(/* webpackChunkName: "home" */ "@/views/admin/AdminPage.vue"),
    name: 'Thaco',
    redirect: '/thaco/timesheet',
    meta: {
      anonymous: false,
      role: 1
    },
    children: [
      {
        path: 'checker',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/checker/CheckerManage.vue"),
        name: 'Nhân viên',
        meta: {
          anonymous: false,
        }
      },
      {
        path: 'bookmarkType',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/bookmarkType/BookmarkTypeManage.vue"),
        name: 'Loại hồ sơ',
        meta: {
          anonymous: false,
          role: 1
        }
      },
      {
        path: 'timesheet',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/timesheet/TimeSheetManage.vue"),
        name: 'Danh sách Hồ sơ',
        meta: {
          anonymous: false,
          role: 1
        }
      },
      {
        path: 'timeline',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/timeline/TimelineManage.vue"),
        name: 'Timeline',
        meta: {
          anonymous: false,
        }
      },
      {
        path: 'calculator',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/calculator/CalculatorManage.vue"),
        name: 'Calculator',
        meta: {
          anonymous: false,
        }
      },
      {
        path: 'dossier',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/dossier/DossierManage.vue"),
        name: 'Dossier',
        meta: {
          anonymous: false,
        }
      },
      {
        path: 'customer',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/customer/CustomerManage.vue"),
        name: 'Customer',
        meta: {
          anonymous: false,
        }
      },
      {
        path: 'manufacturer',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/manufacturer/ManufacturerManage.vue"),
        name: 'Manufacturer',
        meta: {
          anonymous: false,
          role: 1
        }
      },
      {
        path: 'taiLieuGoc',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/taiLieuGoc/TaiLieuGocManage.vue"),
        name: 'TaiLieuGoc',
        meta: {
          anonymous: false,
          role: 1
        }
      },
    ]
  },
  {
    path: '/dictionary',
    component: () => import(/* webpackChunkName: "home" */ "@/views/admin/AdminPage.vue"),
    name: 'Danh mục',
    redirect: '/dictionary/department',
    meta: {
      anonymous: false,
      role: 1
    },
    children: [
      {
        path: 'department',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/department/DepartmentManage.vue"),
        name: 'Cơ cấu tổ chức',
        meta: {
          anonymous: false,
          role: 1
        }
      },
      {
        path: 'employee',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/employee/EmployeeManage.vue"),
        name: 'Nhân viên / Người dùng',
        meta: {
          anonymous: false,
          role: 1
        }
      },
      {
        path: 'jobPosition',
        component: () => import(/* webpackChunkName: "home" */ "@/views/admin/jobPosition/JobPositionManage.vue"),
        name: 'Chức vụ, chức danh',
        meta: {
          anonymous: false,
          role: 1
        }
      }
    ]
  },
  {
    path: '/admin',
    redirect: '/thaco/timesheet'
  },
  {
    path: '/admin/:pathMatch(.*)*',
    redirect: to => {
      const match = to.params.pathMatch;
      if (['department', 'employee', 'jobPosition'].includes(match)) {
        return `/dictionary/${match}`;
      }
      return `/thaco/${match || 'timesheet'}`;
    }
  }
];