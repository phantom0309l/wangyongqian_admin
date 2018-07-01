<template>
    <div class="schedule-list">
        <el-form :inline="true" :model="filter_form" class="form-inline">
            <el-form-item label="医生">
                <el-select v-model="filter_form.doctorid" placeholder="请选择医生" @change="handleDoctorChange">
                    <el-option :label="doctor.name" :value="doctor.id" v-for="doctor in doctors" :key="doctor.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="门诊日期">
                <el-date-picker
                        v-model="filter_form.dates"
                        :editable="false"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="门诊模板">
                <el-select v-model="filter_form.scheduletplid" placeholder="请选择门诊模板">
                    <el-option label="全部" value="0"></el-option>
                    <el-option :label="scheduletpl.desc" :value="scheduletpl.id" v-for="scheduletpl in scheduletpls"
                               :key="scheduletpl.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onFilter">查询</el-button>
                <template v-if="filter_form.scheduletplid !== '0'">
                    <el-tooltip class="item" effect="dark" :content="getToopTipContent" placement="bottom">
                        <el-button type="text" @click="handleBatchAdd">生成实例</el-button>
                    </el-tooltip>
                </template>
            </el-form-item>
        </el-form>

        <el-table
                border
                stripe
                v-loading="loading"
                :data="schedules"
                height="515px"
                width="100%">
            <el-table-column
                    label="#"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="disease_name"
                    label="疾病">
            </el-table-column>
            <el-table-column
                    prop="thedate"
                    label="出诊日期">
            </el-table-column>
            <el-table-column
                    prop="dow_str"
                    label="星期">
            </el-table-column>
            <el-table-column
                    prop="daypart_str"
                    label="时刻">
            </el-table-column>
            <el-table-column
                    prop="tkttype_str"
                    label="类型">
            </el-table-column>
            <el-table-column
                    prop="maxcnt"
                    label="可约数量">
            </el-table-column>
            <el-table-column
                    prop="valid_cnt"
                    label="已约数量">
            </el-table-column>
            <el-table-column
                    prop="total_cnt"
                    label="已约数量">
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
                    <el-button @click="handleDetailClick(scope.row)" size="mini">查看</el-button>
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
                    @current-change="handlePageNumChange"
                    :current-page.sync="filter_form.pagenum"
                    :page-size="filter_form.pagesize"
                    :total="total_cnt"
                    layout="total, prev, pager, next">
            </el-pagination>
            <!--<el-pagination-->
            <!--layout="prev, pager, next"-->
            <!--:page-size="filter_form.pagesize"-->
            <!--:total="total_cnt"-->
            <!--@current-change="handlePageNumChange">-->
            <!--</el-pagination>-->
        </div>
    </div>
</template>

<script>
    import api from '../../config/api.js';
    import common from '../../lib/common.js';

    export default {
        data: function () {
            return {
                schedules: [],
                total_cnt: 0,
                filter_form: {
                    pagesize: 20,
                    pagenum: 1,
                    dates: [],
                    scheduletplid: '0',
                    doctorid: '',
                },
                scheduletpls: [],
                doctors: [],
                loading: false,
            }
        },
        computed: {
            getToopTipContent() {
                let dates = this.filter_form.dates;
                if (dates && dates.length > 0) {
                    this.filter_form.start_date = dates[0];
                    this.filter_form.end_date = dates[1];

                    return "生成 " + this.filter_form.start_date + " 至 " + this.filter_form.end_date + " 的门诊实例";
                } else {
                    return "如不选择日期，默认生成 今天 至 一年后 的门诊实例";
                }
            }
        },
        methods: {
            handleDoctorChange() {
                this.fetchScheduleTpls();
            },
            handleBatchAdd() {
                let self = this;

                if (self.filter_form.doctorid === '') {
                    self.$message.error('请选择医生');
                    return false;
                } else if (self.filter_form.scheduletplid === '0') {
                    self.$message.error('请选择门诊模板');
                    return false;
                }

                this.$confirm('是否确定生成?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = api.get('schedulemgr.batchaddpost');
                    let params = this.filter_form;
                    let dates = params.dates;
                    if (dates && dates.length > 0) {
                        params.start_date = dates[0];
                        params.end_date = dates[1];
                    }

                    common.ajax({
                        url: url,
                        params: params,
                        done: function (data) {
                            self.$message.success('生成成功');
                            self.fetchData();
                        }
                    });
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
            handleDetailClick: function (schedule) {
                this.$router.push({
                    name: 'schedule-modify',
                    params: {
                        scheduleid: schedule.id
                    }
                })
            },
            fetchData: function () {
                let self = this;
                let url = api.get('schedulemgr.list');
                let params = this.filter_form;
                let dates = params.dates;
                if (dates && dates.length > 0) {
                    params.start_date = dates[0];
                    params.end_date = dates[1];
                }

                self.loading = true;
                common.ajax({
                    url: url,
                    params: params,
                    isNeedLoading: false,
                    always() {
                        self.loading = false;
                    },
                    done: function (data) {
                        self.schedules = data.schedules;
                        self.total_cnt = parseInt(data.total_cnt);
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            },
            fetchScheduleTpls: function () {
                let self = this;
                let url = api.get('scheduletplmgr.selectlist');
                let params = {
                    doctorid: self.filter_form.doctorid
                };

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data) {
                        self.scheduletpls = data.scheduletpls;

                        self.fetchData();
                    },
                })
            },
            fetchDoctors: function () {
                let self = this;
                let url = api.get('doctormgr.selectlist');

                common.ajax({
                    url: url,
                    done: function (data) {
                        self.doctors = data.doctors;
                        if (self.filter_form.doctorid === '') {
                            self.filter_form.doctorid = self.doctors.length > 0 ? self.doctors[0].id : '';
                        }

                        self.fetchScheduleTpls();
                    },
                })
            },
        }
        ,
        created: function () {
            this.filter_form.doctorid = this.$route.query.doctorid || '';
            this.filter_form.scheduletplid = this.$route.query.scheduletplid || '0';

            this.fetchDoctors();
        }
        ,
        mounted: function () {
            document.title = "查询-患者列表";
        }
    }
</script>

<style scoped>
    .schedule-list {
        padding: 20px;
        background-color: #fff;
    }
</style>
