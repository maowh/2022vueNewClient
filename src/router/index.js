import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/layout/index'
import ArticleCreateRouter from './modules/ArticleCreate'
import ArticleRouter from './modules/Article'
import PermissionListRouter from './modules/PermissionList'
import RoleListRouter from './modules/RoleList'
import userManageRouter from './modules/userManage'
// import classificationInformationRouter from './modules/classificationInformation'
import outsourcingCostsRouter from './modules/outsourcingCosts'
import outsourcingPlanRouter from './modules/outsourcing-costsplan'
import systemInfomationRouter from './modules/systemInfomation'
import coefficientInformationRouter from './modules/coefficientInformation'
import customerInformationRouter from './modules/customerInformation'
import domainInformationRouter from './modules/domainInformation'
import coststandardRouter from './modules/coststandard'
import personnelRouter from './modules/personnel'
import personnelloadRouter from './modules/personnelload'
import costsreportRouter from './modules/costsreport'
import costsChartRouter from './modules/costschart'
import personnelLoadReportRouter from './modules/personnelloadreport'
import store from '../store'

// 私有路由表
// export const privateRoutes = [
//   {
//     path: '/user',
//     component: layout,
//     redirect: '/user/manage',
//     meta: {
//       title: 'user',
//       icon: 'personnel'
//     },
//     children: [
//       {
//         path: '/user/manage',
//         component: () => import('@/views/user-manage/index'),
//         meta: {
//           title: 'userManage',
//           icon: 'personnel-manage'
//         }
//       },
//       {
//         path: '/user/role',
//         component: () => import('@/views/role-list/index'),
//         meta: {
//           title: 'roleList',
//           icon: 'role'
//         }
//       },
//       {
//         path: '/user/permission',
//         component: () => import('@/views/permission-list/index'),
//         meta: {
//           title: 'permissionList',
//           icon: 'permission'
//         }
//       },
//       {
//         path: '/user/info/:id',
//         name: 'userInfo',
//         component: () => import('@/views/user-info/index'),
//         // 路由传defineprop参数
//         props: true,
//         meta: {
//           title: 'userInfo'
//         }
//       },
//       {
//         path: '/user/import',
//         name: 'import',
//         component: () => import('@/views/import/index'),
//         meta: {
//           title: 'excelImport'
//         }
//       }
//     ]
//   },
//   {
//     path: '/article',
//     component: layout,
//     redirect: '/article/ranking',
//     meta: {
//       title: 'article',
//       icon: 'article'
//     },
//     children: [
//       {
//         path: '/article/ranking',
//         component: () => import('@/views/article-ranking/index'),
//         meta: {
//           title: 'articleRanking',
//           icon: 'article-ranking'
//         }
//       },
//       {
//         path: '/article/:id',
//         component: () => import('@/views/article-detail/index'),
//         meta: {
//           title: 'articleDetail'
//         }
//       },
//       {
//         path: '/article/create',
//         component: () => import('@/views/article-create/index'),
//         meta: {
//           title: 'articleCreate',
//           icon: 'article-create'
//         }
//       },
//       {
//         path: '/article/editor/:id',
//         component: () => import('@/views/article-create/index'),
//         meta: {
//           title: 'articleEditor'
//         }
//       }
//     ]
//   }
// ]

// 公开路由表
export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    component: layout,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index'),
        meta: {
          title: 'profile',
          icon: 'el-icon-user'
        }
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error-page/404')
      },
      {
        path: '/401',
        name: '401',
        component: () => import('@/views/error-page/401')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: publicRoutes
  // routes: [...publicRoutes, ...privateRoutes]
})
export const privateRoutes = [
  userManageRouter,
  RoleListRouter,
  PermissionListRouter,
  ArticleCreateRouter,
  ArticleRouter,
  // classificationInformationRouter,
  customerInformationRouter,
  coefficientInformationRouter,
  domainInformationRouter,
  systemInfomationRouter,
  coststandardRouter,
  personnelRouter,
  outsourcingCostsRouter,
  outsourcingPlanRouter,
  personnelloadRouter,
  costsreportRouter,
  costsChartRouter,
  personnelLoadReportRouter
]

// 初始化路由表
export function resetRouter() {
  if (
    store.getters.userInfo &&
    store.getters.userInfo.permission &&
    store.getters.userInfo.permission.menus
  ) {
    const menus = store.getters.userInfo.permission.menus
    menus.forEach((menu) => {
      router.removeRoute(menu)
    })
  }
}

export default router
