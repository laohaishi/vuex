import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex实例
import NProgress from 'nprogress' // 引入进度条模块
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 白名单 表示不需要强制token存在的页面
const state = {
  token: getToken()
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}
const actions = {
  async login(context, data) {
    const result = await login(data)
    context.commit('setToken', result)
  }
}
// 路由的前置守卫
router.beforeEach(function(to, from, next) {
  NProgress.start() // 开启进度条
  // 首先判断有无token
  if (store.getters.token) {
    if (to.path === '/login') {
      // 如果是登录页
      next('/') // 跳到主页
    } else {
      // 如果不是登录页
      next() // 直接放过
    }
    NProgress.done() // 开启进度条
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 是否在白名单
      next() // 跳过
    } else {
      // 如果不在白名单
      next('/login') // 跳到登录页
    }
    NProgress.done() // 开启进度条
  }
})

// 路由的后置守卫

router.afterEach(function() {
  // 关闭进度条
  NProgress.done() // 开启进度条
})
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
