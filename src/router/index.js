// import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout'
import SinglePages from './singlePages' // 单页面模块 login、register/lock.....
// Vue.use(Router)

/** 路由配置项目
 * hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面(默认 false)
 * alwaysShow: true               当设置 true 的时候永远会显示根菜单，不设置的情况下只有当子路由个数大于一个时才会显示根菜
 *                                当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式
 *                                只有一个时会将那个子路由当做根路由
 * redirect: noredirect           当设置 noredirect 的时候该路由不会在面包屑导航中出现
 * name:'router-name'             设定路由的名字，一定要填写不然 使用 <keep-alive> 时会出现各种问题
 * meta : {
    roles: ['admin','editor']     设置该路由进入的权限，支持多个权限叠加
    title: 'title'                设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'              设置该路由的图标
  }
 **/

const routes = [
  ...SinglePages,
  {
    path: '',
    component: Layout,
    redirect: 'welcome',
    hidden: true,
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        meta: { title: '首页' },
        component: () => import('@/views/singlePages/welcome')
      },
      {
        path: '404',
        name: '404',
        hidden: true,
        meta: { title: '404', noCache: true },
        component: () => import('@/views/singlePages/404Page.vue')
      }
    ]
  },
  { // 团长管理
    path: '/group-head',
    component: Layout,
    name: 'groupHead',
    meta: { title: '团长管理', icon: 'tuanzhang' },
    redirect: '/group-head/group-head-list',
    children: [
      {
        path: 'group-head-list',
        name: 'groupHeadList',
        meta: { title: '团长管理' },
        component: () => import('@/views/groupHaed/groupHeadList')
      },
      {
        path: 'ti-xian-shen-he',
        name: 'tiXianShenHe',
        meta: { title: '提现审核' },
        component: () => import('@/views/groupHaed/tiXianShenHe')
      }
    ]
  },
  { // 商品管理
    path: '/goods',
    component: Layout,
    name: 'goods',
    meta: { title: '商品管理', icon: 'shangpin' },
    redirect: '/goods/goods-list',
    children: [
      {
        path: 'classification',
        name: 'classification',
        meta: { title: '分类管理' },
        component: () => import('@/views/goods/classification')
      },
      {
        path: 'goods-list',
        name: 'goodsList',
        meta: { title: '商品管理' },
        component: () => import('@/views/goods/goodsList')
      },
      {
        path: 'goods-add',
        name: 'goodsAdd',
        hidden: true,
        meta: { title: '新增商品', isEdit: false },
        component: () => import('@/views/goods/goodsEdit')
      },
      {
        path: 'goods-edit',
        name: 'goodsEdit',
        hidden: true,
        meta: { title: '编辑商品', isEdit: true },
        component: () => import('@/views/goods/goodsEdit')
      }
    ]
  },
  { // 供应商管理
    path: '/supplier',
    component: Layout,
    name: 'supplier',
    meta: { title: '供应商管理', icon: 'gongyingshang' },
    redirect: '/supplier/supplier-list',
    children: [
      {
        path: 'supplier-list',
        name: 'supplierList',
        meta: { title: '供应商管理', icon: 'gongyingshang' },
        component: () => import('@/views/supplier/supplierList')
      }
    ]
  },
  { // 用户管理
    path: '/user',
    component: Layout,
    name: 'user',
    meta: { title: '用户管理', icon: 'yonghu' },
    redirect: '/user/user-list',
    children: [
      {
        path: 'user-list',
        name: 'userList',
        meta: { title: '用户管理', icon: 'yonghu' },
        component: () => import('@/views/user/userList')
      }
    ]
  },
  { // 活动管理
    path: '/activity',
    component: Layout,
    name: 'activity',
    meta: { title: '活动管理', icon: 'huodong' },
    redirect: '/activity/activity-list',
    children: [
      {
        path: 'activity-list',
        name: 'activityList',
        meta: { title: '活动管理' },
        component: () => import('@/views/activity/activityList')
      },
      {
        path: 'distribution',
        name: 'distribution',
        meta: { title: '配送单管理' },
        component: () => import('@/views/activity/distribution')
      }
    ]
  },
  { // 订单管理
    path: '/order',
    component: Layout,
    name: 'order',
    meta: { title: '订单管理', icon: 'dingdan' },
    redirect: '/order/activity-order',
    children: [
      {
        path: 'activity-order',
        name: 'activityOrder',
        meta: { title: '活动订单' },
        component: () => import('@/views/order/activityOrder')
      },
      {
        path: 'sale-order',
        name: 'saleOrder',
        meta: { title: '售后订单' },
        component: () => import('@/views/order/saleOrder')
      }
    ]
  },
  { // 系统设置
    path: '/system',
    component: Layout,
    name: 'system',
    meta: { title: '系统设置', icon: 'xitongshezhi' },
    redirect: '/system/system-setup',
    children: [
      {
        path: 'system-setup',
        name: 'systemSetup',
        meta: { title: '系统设置', icon: 'xitongshezhi' },
        component: () => import('@/views/systemSetup')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({ routes })
