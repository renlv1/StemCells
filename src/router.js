import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/*eslint-disable*/
const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: require('./views/common/login').default
    },
    {
      path: '/auth',
      component: require('./views/common/auth').default
    },
    {
      path: '/home',
      component: require('./views/home').default
    },
    {
      path: '/user/info',
      component: require('./views/user/info').default
    },
    {
      path: '/user/fans',
      component: require('./views/user/fans').default
    },
    {
      path: '/news/newsList',
      component: require('./views/news/newsList').default,
      meta: {
        // keepAlive: true
      }
    },
    {
      path: '/news/newsDetail',
      component: require('./views/news/newsDetail').default
    },
    {
      path: '/news/draftList',
      component: require('./views/news/draftList').default
    },
    {
      path: '/news/createNews',
      component: require('./views/news/createNews').default
    },
    {
      path: '/news/comment',
      component: require('./views/news/comment').default
    },
    {
      path: '/asset/manager',
      component: require('./views/asset/manager').default,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/asset/detail',
      component: require('./views/asset/detail').default
    },
    {
      path: '/asset/myBank',
      component: require('./views/asset/myBank').default
    },
    {
      path: '/asset/withdraw',
      component: require('./views/asset/withdraw').default
    },
    {
      path: '/asset/addBank',
      component: require('./views/asset/addBank').default
    },
    {
      path: '/notice/notice',
      component: require('./views/notice/notice').default,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/notice/noticeDetail',
      component: require('./views/notice/noticeDetail').default
    },
	  {
		  path: '/org/orgIndex', // 机构管理
		  component: require('./views/org/org').default
	  },
	  {
		  path: '/org/orgIndex/orgAdd', // 机构管理 -- 添加机构
		  component: require('./views/org/orgAdd').default
	  },
	  {
		  path: '/org/service', // 服务管理
		  component: require('./views/org/service').default
	  },
	  {
		  path: '/org/service/serviceDetail', // 服务管理 ---> 服务详情
		  component: require('./views/org/serviceDetail').default
	  },
	  {
		  path: '/org/label', // 标签管理
		  component: require('./views/org/label').default
	  },
	  {
		  path: '/org/label/labelDetail', // 标签管理 --> 标签管理详情
		  component: require('./views/org/labelDetail').default
	  },
	  {
		  path: '/org/community', // 公开课
		  component: require('./views/org/community').default
	  },
	  {
		  path: '/org/community/communityDetails', // 公开课 -- 详情
		  component: require('./views/org/communityDetails').default
	  },
    {
      path: '/',
      redirect: '/release/release'
    },
    { // 编辑，嵌套与app
      path: '/release/release',
      component: require('./views/release/release').default
    },
    { // 预览，嵌套与app
      path: '/preview/preview',
      component: require('./views/preview/preview').default
    },
    // 外访详情页面
    {
      path: '/details/details',
      component: require('./views/details/details').default
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    // 从新闻详情回到新闻列表保持滚动条的位置
    if (to.path === '/news/newsList' && from.path === '/news/newsDetail' && savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
