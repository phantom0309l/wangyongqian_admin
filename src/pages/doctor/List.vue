<template>
    <div class="doctor-list">
        <el-form :inline="true" :model="filter_form" class="form-inline border-b push-10-b">
            <el-form-item label="医院">
                <el-select v-model="filter_form.hospitalid" placeholder="请选择医院">
                    <el-option label="全部" value="0"></el-option>
                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitals"
                               :key="hospital.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医生姓名">
                <el-input v-model="filter_form.name" placeholder="医生姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="filter_form.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onFilter">查询</el-button>
            </el-form-item>
        </el-form>

        <div class="text-left push-10-b">
            <el-button type="primary" @click="goAdd">添加</el-button>
        </div>

        <el-table
                border
                stripe
                v-loading="loading"
                :data="doctors"
                width="100%">
            <el-table-column
                    label="#"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="createtime"
                    label="创建日期">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="sex_str"
                    label="性别"
                    width="70">
            </el-table-column>
            <el-table-column
                    prop="hospital_name"
                    label="医院">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="编码">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="100">
                <template slot-scope="scope">
                    <el-tag size="medium"
                            :type="scope.row.status === '1' ? 'success' : 'info'">{{ scope.row.status_str }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="150">
                <template slot-scope="scope">
                    <el-button @click="handleDetailClick(scope.row.id)" size="mini">查看</el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">下线
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                    layout="total, prev, pager, next"
                    :current-page.sync="filter_form.pagenum"
                    :page-size="filter_form.pagesize"
                    :total="total_cnt"
                    @current-change="handlePageNumChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import api from '../../config/api.js';
    import common from '../../lib/common.js';

    export default {
        data: function () {
            return {
                hospitals: [],
                doctors: [],
                total_cnt: 0,
                filter_form: {
                    pagesize: 20,
                    pagenum: 1,
                    name: '',
                },
                loading: false,
            }
        },
        methods: {
            goAdd() {
                this.$router.push({
                    name: 'doctor-add'
                })
            },
            onFilter: function () {
                this.fetchData();
            },
            handlePageNumChange(pagenum) {
                console.log(`当前页: ${pagenum}`);
                this.filter_form.pagenum = pagenum;

                this.fetchData();
            },
            handleDetailClick: function () {

            },
            fetchHospitals: function () {
                let self = this;
                let url = api.get('hospitalmgr.selectlist');

                common.ajax({
                    url: url,
                    done: function (data) {
                        self.hospitals = data.hospitals;

                        self.fetchData();
                    },
                })
            },
            fetchData: function () {
                let self = this;
                let url = api.get('doctormgr.list');
                let params = this.filter_form;

                self.loading = true;
                common.ajax({
                    url: url,
                    params: params,
                    isNeedLoading: false,
                    always() {
                        self.loading = false;
                    },
                    done: function (data) {
                        self.doctors = data.doctors;
                        self.total_cnt = parseInt(data.total_cnt);
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            },
        }
        ,
        created: function () {
            this.fetchHospitals();
        }
        ,
        mounted: function () {
            document.title = "医生列表";
        }
    }
</script>

<style scoped>
    .doctor-list {
        padding: 20px;
        background-color: #fff;
    }
</style>
