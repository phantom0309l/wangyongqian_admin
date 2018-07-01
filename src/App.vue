<template>
    <div id="app">
        <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
        <!--<el-radio-button :label="false">展开</el-radio-button>-->
        <!--<el-radio-button :label="true">收起</el-radio-button>-->
        <!--</el-radio-group>-->
        <el-container v-if="!isLoginPage">
            <el-header>
                <el-row :gutter="20" class="navbar-header">
                    <el-col :span="6">
                        <a class="navbar-brand">管理后台</a>
                    </el-col>
                    <el-col :span="6" :offset="12" class="text-right">
                        {{getName()}}&nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text" @click="logout" class="fc-text_white">退出登录</el-button>
                    </el-col>
                </el-row>

            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu default-active="1-4-1" class="el-menu-vertical" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
                             router>
                        <el-menu-item index="/patient/list">
                            <i class="el-icon-menu"></i>
                            <span slot="title">患者列表</span>
                        </el-menu-item>

                        <el-menu-item index="/order/list">
                            <i class="el-icon-menu"></i>
                            <span slot="title">预约列表</span>
                        </el-menu-item>

                        <el-submenu index="/schedule">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">门诊</span>
                            </template>
                            <el-menu-item index="/schedule/tpllist">门诊表</el-menu-item>
                            <el-menu-item index="/schedule/list">门诊实例</el-menu-item>
                        </el-submenu>

                        <el-menu-item index="/doctor/list">
                            <i class="el-icon-menu"></i>
                            <span slot="title">医生列表</span>
                        </el-menu-item>

                        <el-menu-item index="/hospital/list">
                            <i class="el-icon-menu"></i>
                            <span slot="title">医院列表</span>
                        </el-menu-item>

                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">文章列表</span>
                        </el-menu-item>

                        <el-menu-item index="4">
                            <i class="el-icon-menu"></i>
                            <span slot="title">工作量统计</span>
                        </el-menu-item>

                        <!--<el-menu-item index="3" disabled>-->
                        <!--<i class="el-icon-document"></i>-->
                        <!--<span slot="title">导航三</span>-->
                        <!--</el-menu-item>-->
                        <!--<el-menu-item index="4">-->
                        <!--<i class="el-icon-setting"></i>-->
                        <!--<span slot="title">导航四</span>-->
                        <!--</el-menu-item>-->
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <keep-alive>
                            <router-view v-if="$route.meta.keepAlive"></router-view>
                        </keep-alive>
                        <router-view v-if="!$route.meta.keepAlive"></router-view>
                    </el-main>
                    <!--<el-footer></el-footer>-->
                </el-container>
            </el-container>
        </el-container>
        <router-view v-else></router-view>
    </div>
</template>

<style scoped>
    .el-menu {
        text-align: left;
    }

    .el-header {
        width: 100%;
        height: 100%;
        background-color: #1996EA;
    }

    .navbar-header {
        text-align: left;
        height: 100%;
        line-height: 60px;
        color: #fff;
    }

    .navbar-brand {
        font-size: 18px;
        font-weight: bolder;
    }
</style>

<script>
    export default {
        name: 'app',
        data: function () {
            return {
                isCollapse: false
            }
        },
        computed: {
            isLoginPage: function () {
                return this.$route.name === 'login'
            },
        },
        methods: {
            getName: function () {
                return localStorage.getItem('_name_') || '用户';
            },
            logout() {
                localStorage.setItem('_islogin_', '');
                localStorage.setItem('_name_', '');

                this.$router.push({name: 'login'});
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        mounted: function () {
            var self = this;
            $(document).ajaxSuccess(function (event, xhr, settings) {
                if (xhr.responseJSON.errno === '1001') {
                    localStorage.setItem('_islogin_', '');

                    self.$message.error({
                        message: '未登录，前登录页面。',
                        duration: 2000,
                        onClose: function () {
                            self.$router.replace({
                                name: 'login',
                                params: {
                                    'refer_name': self.$route.name,
                                    'refer_path': self.$route.path,
                                    'refer_query': JSON.stringify(self.$route.query),
                                    'refer_params': JSON.stringify(self.$route.params),
                                }
                            });
                        }
                    });
                }
            })
        },
        created: function () {

        }
    }
</script>
