<template>
    <div class="login">
        <h1 style="padding: 100px 0 50px;">管理后台</h1>
        <div style="width: 300px; margin: 0 auto; padding: 50px 0;">
            <div class="push-10-b">
                <el-input placeholder="请输入账号" v-model="username">
                    <template slot="prepend">账号</template>
                </el-input>
            </div>
            <div class="push-20-b">
                <el-input placeholder="请输入密码" type="password" v-model="password">
                    <template slot="prepend">密码</template>
                </el-input>
            </div>
            <div>
                <el-button @click="onSubmit" type="primary">登录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../config/api.js';
    import common from '../lib/common.js';
    import {Loading} from 'element-ui';

    export default {
        data: function () {
            return {
                mobile: '',
                code: '',
                username: '',
                password: '',
            }
        },
        methods: {
            isLogin: function () {
                let self = this;
                let url = api.get('loginmgr.islogin');

                $.ajax({
                    url: url,
                    dataType: 'json',
                }).done(function (response) {
                    if (response.errno === '0') {
                        self.$router.push({name: 'order-list'});
                    }
                }).fail(function () {
                    self.$message.error('请求失败');
                });
            },
            onSubmit: function () {
                if (this.username.trim() === '') {
                    this.$message.error('请输入账号');
                } else if (this.password.trim() === '') {
                    this.$message.error('请输入密码');
                } else {
                    this.submit();
                }
            },
            submit: function () {
                let self = this;
                let url = api.get('loginmgr.loginpost');

                let loadingInstance = Loading.service({text: '正在登录'});

                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        username: this.username,
                        password: this.password,
                    },
                    async: false
                }).done(function (response) {
                    self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });

                    if (response.errno === '0') {
                        localStorage.setItem('_islogin_', '1');

                        self.$message.success({
                            message: '登录成功',
                            duration: 800,
                            onClose: function () {
                                let params = self.$route.params;
                                let refer_name = params.refer_name;
                                let refer_path = params.refer_path;

                                if (refer_name && refer_name.trim() !== '') {
                                    let refer_query = JSON.parse(params.refer_query);
                                    let refer_params = JSON.parse(params.refer_params);

                                    if (!$.isEmptyObject(refer_query)) {
                                        self.$router.replace({path: refer_path, query: refer_query});
                                    } else if (!$.isEmptyObject(refer_params)) {
                                        self.$router.replace({name: refer_name, params: refer_params});
                                    } else {
                                        self.$router.replace({name: refer_name});
                                    }
                                } else {
                                    self.$router.push({name: 'order-list'});
                                }
                            }
                        });
                    } else {
                        self.$message.error(response.errmsg);
                    }
                }).fail(function () {
                    self.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        loadingInstance.close();
                    });

                    self.$message.error('请求失败');
                });
            }
        },
        created: function () {
            this.isLogin();
        },
        mounted: function () {
            document.title = "管理后台-登录";
        }
    }
</script>

<style scoped>
    .login {
        padding: 10px 20px;
        /*background-color: #fff;*/
        text-align: center;
    }

    .logo-box {
        margin: 50px 0;
    }

    .el-form-item {
        margin-bottom: 10px;
    }
</style>
