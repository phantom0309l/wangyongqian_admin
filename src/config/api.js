import config from './config.js'

let urls = {
    'patientmgr': {
        'list': '/patientmgr/list',
        'one': '/patientmgr/one',
        'modifypost': '/patientmgr/modifypost',
        'auditpost': '/patientmgr/auditpost',
        'changestatuspost': '/patientmgr/changestatuspost',
    },
    'ordermgr': {
        'list': '/ordermgr/list',
        'modify': '/ordermgr/modify',
        'modifypost': '/ordermgr/modifypost',
        'addpost': '/ordermgr/addpost',
        'auditpost': '/ordermgr/auditpost',
        'changestatuspost': '/ordermgr/changestatuspost',
    },
    'scheduletplmgr': {
        'list': '/scheduletplmgr/list',
        'selectlist': '/scheduletplmgr/selectlist',
        'add': '/scheduletplmgr/add',
        'addpost': '/scheduletplmgr/addpost',
        'modify': '/scheduletplmgr/modify',
        'modifypost': '/scheduletplmgr/modifypost',
        'changestatuspost': '/scheduletplmgr/changestatuspost',
    },
    'schedulemgr': {
        'list': '/schedulemgr/list',
        'batchaddpost': '/schedulemgr/batchaddpost',
        'modify': '/schedulemgr/modify',
        'modifypost': '/schedulemgr/modifypost',
        'changestatuspost': '/schedulemgr/changestatuspost',
    },
    'xprovincemgr': {
        'list': '/xprovincemgr/list',
    },
    'xcitymgr': {
        'list': '/xcitymgr/list',
    },
    'xcountymgr': {
        'list': '/xcountymgr/list',
    },
    'doctormgr': {
        'list': '/doctormgr/list',
        'selectlist': '/doctormgr/selectlist',
    },
    'hospitalmgr': {
        'list': '/hospitalmgr/list',
        'addpost': '/hospitalmgr/addpost',
        'selectlist': '/hospitalmgr/selectlist',
    },
    'operationcategorymgr': {
        'list': '/operationcategorymgr/list',
        'savepost': '/operationcategorymgr/savepost',
    },
    'loginmgr': {
        'loginpost': '/loginmgr/loginpost',
        'islogin': '/loginmgr/islogin',
    },
};

export default {
    'get': function (str) {
        let params = str.split('.');
        let url = '';
        if (params.length === 1) {
            url = urls[params[0] + ''];
        } else if (params.length === 2) {
            url = urls[params[0] + ''][params[1] + ''];
        } else if (params.length === 3) {
            url = urls[params[0] + ''][params[1] + ''][params[2] + ''];
        }

        url = config.host + url + config.dev;
        return url;
    }
}
