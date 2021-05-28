import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

let router = new Router({
        // mode:'history',
        routes: [{
                path: '/',
                name: 'default',
                component: () =>
                    import ('@/layout/Default'),
                redirect: '/SZhome',
                children: [{
                        path: 'SZhome',
                        name: 'SZHome',
                        component: () =>
                            import ('@/pages/home/Home')
                    },
                    {
                        path: 'alarmMonitor',
                        name: 'AlarmMonitor',
                        component: () =>
                            import ('@/pages/alarmMonitor/AlarmMonitor'),
                        children: [{
                            path: 'alarmDetail',
                            name: 'AlarmDetail',
                            component: () =>
                                import ('@/pages/alarmMonitor/AlarmDetail'),
                            meta: { btnPermissions: [] },
                            children: [{
                                path: 'alarmData',
                                name: 'AlarmData',
                                component: () =>
                                    import ('@/pages/alarmMonitor/AlarmData'),
                            }, {
                                path: 'alarmCheck',
                                name: 'AlarmCheck',
                                component: () =>
                                    import ('@/pages/alarmMonitor/AlarmCheck'),
                            }, {
                                path: 'alarmDispose',
                                name: 'AlarmDispose',
                                component: () =>
                                    import ('@/pages/alarmMonitor/AlarmDispose'),
                            }, {
                                path: 'alarmFeedback',
                                name: 'AlarmFeedback',
                                component: () =>
                                    import ('@/pages/alarmMonitor/AlarmFeedback'),
                            }, ]
                        }]
                    },
                    {
                        path: 'report',
                        name: 'Report',
                        component: () =>
                            import ('@/pages/report/Report')
                    },
                    {
                        path: 'pdfview',
                        name: 'pdfView',
                        component: () =>
                            import ('@/pages/report/pdfview')
                    },
                    {
                        path: 'setting',
                        name: 'Setting',
                        component: () =>
                            import ('@/pages/setting/Setting'),
                        children: [{
                                path: 'myConcern',
                                name: 'MyConcern',
                                component: () =>
                                    import ('@/pages/setting/MyConcern'),
                            }, {
                                path: 'programSetting',
                                name: 'ProgramSetting',
                                component: () =>
                                    import ('@/pages/setting/ProgramSetting'),
                            }, {
                                path: 'about',
                                name: 'About',
                                component: () =>
                                    import ('@/pages/setting/About'),
                            },
                            {
                                path: 'settingConcern',
                                name: 'SettingConcern',
                                component: () =>
                                    import ('@/pages/setting/SettingConcern'),
                            }
                        ]
                    }
                ]
            },
            // {
            //     path: '*',
            //     redirect: '/SZhome'
            // }
        ],
        // scrollBehavior (to, from, savedPosition) {
        //   if (savedPosition) {
        //     return savedPosition
        //   } else {
        //     return {x: 0, y: 0}
        //   }
        // }
    })
    // 全局路由守卫
    // router.beforeEach((to, from, next) => {
    //   const nextRoute = ['User', 'Cart', 'GoodsDetail'] // 需要登录的页面
    //   let isLogin = localTake('userMsg')  // 判断是否登录，本地存储有用户数据则视为已经登录
    //   未登录状态；当路由到 nextRoute 指定页时，跳转至 UserLogIn
    //   if (nextRoute.indexOf(to.name) >= 0) { // 检测是否登录的页面
    //     if (!isLogin) { // 如果未登录（本地存储无用户数据），并且要跳到登录页面
    //       if (from.name === 'UserLogIn') {
    //         next('/')
    //         return
    //       }
    //       // 登录后，跳到到当前页面
    //       router.push({
    //         name: 'UserLogIn',
    //         params: {redirect: to.fullPath}
    //       })
    //     }
    //   }
    //   已登录状态；当路由到 UserLogIn 时，跳转至 Home
    //   console.log(this)
    //   console.log(to,from)
    //   if (to.name === 'AlarmMonitor') {
    //
    //   }
    //   next() // 必须使用 next ,执行效果依赖 next 方法的调用参数
    // })


export default router;