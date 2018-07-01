const BaseTemplate = {
    template: '<router-view></router-view>',
};

export default [
    {
        path: '/login',
        name: 'login',
        component: resolve => require(['../pages/Login.vue'], resolve),
        meta: {
            requireBind: false
        }
    },
    {
        path: '/operationcategory/',
        name: 'operationcategory',
        component: BaseTemplate,
        children: [
            {
                path: 'list',
                name: 'operationcategory-list',
                component: resolve => require(['../pages/operationcategory/List.vue'], resolve)
            }
        ]
    },
    {
        path: '/hospital/',
        name: 'hospital',
        component: BaseTemplate,
        children: [
            {
                path: 'list',
                name: 'hospital-list',
                component: resolve => require(['../pages/hospital/List.vue'], resolve)
            },
            {
                path: 'add',
                name: 'hospital-add',
                component: resolve => require(['../pages/hospital/Add.vue'], resolve)
            }
        ]
    },
    {
        path: '/doctor/',
        name: 'doctor',
        component: BaseTemplate,
        children: [
            {
                path: 'list',
                name: 'doctor-list',
                component: resolve => require(['../pages/doctor/List.vue'], resolve)
            },
            {
                path: 'add',
                name: 'doctor-add',
                component: resolve => require(['../pages/doctor/Add.vue'], resolve)
            }
        ]
    },
    {
        path: '/patient/',
        name: 'patient',
        component: BaseTemplate,
        children: [
            {
                path: 'list',
                name: 'patient-list',
                component: resolve => require(['../pages/patient/List.vue'], resolve)
            },
            {
                path: ':patientid/modify',
                name: 'patient-modify',
                component: resolve => require(['../pages/patient/Modify.vue'], resolve)
            },
        ]
    },
    {
        path: '/order/',
        name: 'order',
        component: BaseTemplate,
        children: [
            {
                path: 'list',
                name: 'order-list',
                component: resolve => require(['../pages/order/List.vue'], resolve)
            },
            // {
            //     path: ':orderid/modify',
            //     name: 'order-modify',
            //     component: resolve => require(['../pages/order/Modify.vue'], resolve)
            // },
        ]
    },
    {
        path: '/schedule/',
        name: 'schedule',
        component: BaseTemplate,
        children: [
            {
                path: 'list',
                name: 'schedule-list',
                component: resolve => require(['../pages/schedule/List.vue'], resolve)
            },
            {
                path: 'tpllist',
                name: 'schedule-tpllist',
                component: resolve => require(['../pages/schedule/TplList.vue'], resolve)
            },
            {
                path: 'addtpl',
                name: 'schedule-addtpl',
                component: resolve => require(['../pages/schedule/AddTpl.vue'], resolve)
            },
            {
                path: ':scheduletplid/modifytpl',
                name: 'schedule-modifytpl',
                component: resolve => require(['../pages/schedule/ModifyTpl.vue'], resolve)
            },
            {
                path: 'batchadd',
                name: 'schedule-batchadd',
                component: resolve => require(['../pages/schedule/BatchAdd.vue'], resolve)
            },
            {
                path: ':scheduleid/modify',
                name: 'schedule-modify',
                component: resolve => require(['../pages/schedule/Modify.vue'], resolve)
            },
        ]
    },
    {
        path: '/error',
        name: 'error',
        component: resolve => require(['../pages/basic/Error.vue'], resolve),
        meta: {
            requireBind: false
        }
    },
    {
        path: '/',
        name: 'empty',
        // redirect: '/error',
        component: resolve => require(['../pages/basic/Empty.vue'], resolve),
        meta: {
            requireBind: false
        }
    },
    {
        path: '*',
        // redirect: '/error',
        redirect: to => {
            sessionStorage.setItem('_errorurl_', to.path);
            localStorage.setItem('_errorwxuErl_', to.path);
            localStorage.setItem('_errorhref_', window.location.href);
            return '/error';
        }
    }
]
