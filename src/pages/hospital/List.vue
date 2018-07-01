<template>
    <div class="hospital-list">
        <el-form :inline="true" :model="filter_form" class="form-inline border-b push-10-b">
            <el-form-item label="医院名称">
                <el-input v-model="filter_form.name" placeholder="医院名称"></el-input>
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
                :data="hospitals"
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
                    label="医院名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
            <el-table-column
                    prop="levelstr"
                    label="医院等级">
            </el-table-column>
            <el-table-column
                    prop="doctor_cnt"
                    label="医生数">
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
                total_cnt: 0,
                filter_form: {
                    pagesize: 2,
                    pagenum: 1,
                    name: '',
                },
                loading: false,
            }
        },
        methods: {
            goAdd() {
                this.$router.push({
                    name: 'hospital-add'
                });
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
            fetchData: function () {
                let self = this;
                let url = api.get('hospitalmgr.list');
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
                        self.hospitals = data.hospitals;
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
            this.fetchData();
        }
        ,
        mounted: function () {
            document.title = "医院列表";
        }
    }
</script>

<style scoped>
    .hospital-list {
        padding: 20px;
        background-color: #fff;
    }
</style>
