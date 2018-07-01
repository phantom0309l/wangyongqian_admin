import api from '../config/api.js';
import {Loading, Message} from 'element-ui';
import Vue from 'vue';

export default {
    checkLoginSync: function () {
        let islogin = localStorage.getItem('_islogin_');
        if (islogin === "1") {
            return true;
        }
        let result = this.checkLoginFromServerSync();

        if (result === true) {
            localStorage.setItem('_islogin_', '1');
        }
        return result;
    },
    checkLoginFromServerSync: function () {
        let result = false;
        $.ajax({
            url: api.get('login.islogin'),
            type: 'POST',
            dataType: 'json',
            async: false,
        }).done(function (response) {
            if (response.errno === '0') {
                let data = response.data;
                if (data.islogin === '1') {
                    result = true;
                }
            } else {
                result = false
            }
        });
        return result;
    },
    fetchXProvinces(callback) {
        this.ajax({
            url: api.get('xprovincemgr.list'),
            isNeedLoading: false,
            done: function (data) {
                callback(data.xprovinces);
            }
        });
    },
    fetchXCitys(xprovinceid, callback) {
        this.ajax({
            url: api.get('xcitymgr.list'),
            params: {xprovinceid: xprovinceid},
            isNeedLoading: false,
            done: function (data) {
                callback(data.xcitys);
            }
        });
    },
    fetchXCountys(xcityid, callback) {
        this.ajax({
            url: api.get('xcountymgr.list'),
            params: {xcityid: xcityid},
            isNeedLoading: false,
            done: function (data) {
                callback(data.xcountys);
            }
        });
    },
    ajax: function (options) {
        options = options || {};
        let _default = {
            url: '',
            type: 'POST',
            dataType: 'json',
            params: [],
            isAsync: true,
            isNeedLoading: true,
            loadingText: '正在加载...',
        };

        let url = options.url || _default.url;
        let type = options.type || _default.type;
        let dataType = options.dataType || _default.dataType;
        let params = options.params || _default.params;
        let isAsync = typeof options.isAsync === 'boolean' ? options.isAsync : _default.isAsync;
        let isNeedLoading = typeof options.isNeedLoading === 'boolean' ? options.isNeedLoading : _default.isNeedLoading;
        let loadingText = options.loadingText || _default.loadingText;
        let doneCallback = options.done;
        let failCallback = options.fail;
        let dataFailCallback = options.dataFail;
        let alwaysCallback = options.always;

        if (url === '') {
            return false;
        }

        if (localStorage.getItem('_islogin_') !== '1') {
            console.log('ajax fail [ unbind ]');
            return false;
        }

        let loadingInstance;
        if (isNeedLoading) {
            loadingInstance = Loading.service({text: loadingText});
        }

        $.ajax({
            url: url,
            type: type,
            dataType: dataType,
            data: params,
            async: isAsync,
        }).done(function (response) {
            if (response.errno === '0') {
                if (typeof doneCallback === "function") {
                    doneCallback(response.data, response);
                }
            } else {
                if (typeof dataFailCallback === "function") {
                    dataFailCallback(response.errmsg, response.errno, response);
                } else {
                    Message.error(response.errmsg);
                }
            }
        }).fail(function (jqXHR, statusText, error) {
            if (typeof errorCallback === "function") {
                failCallback(jqXHR, statusText, error);
            } else {
                Message.error('请求失败');
            }
        }).always(function () {
            if (isNeedLoading) {
                Vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingInstance.close();
                });
            }
            if (typeof alwaysCallback === "function") {
                alwaysCallback();
            }
        })
    }
}
