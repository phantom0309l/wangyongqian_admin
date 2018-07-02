<template>
    <div class="schedule-tpllist">
        <el-form :inline="true" class="form-inline border-b push-10-b">
            <el-form-item label="医生">
                <el-select v-model="doctorid" placeholder="请选择医生">
                    <el-option :label="doctor.name" :value="doctor.id" v-for="doctor in doctors" :key="doctor.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onFilter">查询</el-button>
            </el-form-item>
        </el-form>

        <div class="text-left push-10-b">
            <el-button type="primary" @click="goAddTpl">添加</el-button>
        </div>

        <el-table
                border
                stripe
                v-loading="loading"
                :data="scheduletpls"
                width="100%">
            <el-table-column
                    label="#"
                    type="index"
                    width="50">
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="disease_name"-->
                    <!--label="疾病">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="op_hz_str"
                    label="周期">
            </el-table-column>
            <el-table-column
                    prop="op_date"
                    label="出诊日期">
            </el-table-column>
            <el-table-column
                    prop="wday_str"
                    label="星期">
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="day_part_str"-->
                    <!--label="时刻">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--prop="op_type_str"-->
                    <!--label="类型">-->
            <!--</el-table-column>-->
            <el-table-column
                    prop="maxcnt"
                    label="最大预约数量">
            </el-table-column>
            <el-table-column
                    label="实例">
                <template slot-scope="scope">
                    <el-button
                            @click="goScheduleList(scope.row.id)"
                            type="text"
                            size="small">
                        {{scope.row.schedule_cnt}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="revisitrecord_cnt"
                    label="已预约">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地点">
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
                            v-if="scope.row.status === '1'"
                            size="mini"
                            type="danger"
                            @click="handleChangeStatus(scope.row, 0)">下线
                    </el-button>
                    <el-button
                            v-else
                            size="mini"
                            type="primary"
                            @click="handleChangeStatus(scope.row, 1)">上线
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

    </div>
</template>

<script>
    import api from '../../config/api.js';
    import common from '../../lib/common.js';

    export default {
        data: function () {
            return {
                doctors: [],
                doctorid: 0,
                scheduletpls: [],
                loading: false,
            }
        },
        methods: {
            handleChangeStatus(scheduletpl, status) {
                let self = this;

                let url = api.get('scheduletplmgr.changestatuspost');
                let params = {scheduletplid: scheduletpl.id, status: status};

                common.ajax({
                    url: url,
                    params: params,
                    done: function () {
                        self.$message.success('操作成功');
                        self.fetchData();
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                });
            },
            goScheduleList(scheduletplid) {
                this.$router.push({
                    path: '/schedule/list',
                    query: {
                        doctorid: this.doctorid,
                        scheduletplid: scheduletplid
                    }
                })
            },
            goAddTpl() {
                this.$router.push({
                    path: '/schedule/addtpl',
                    query: {
                        doctorid: this.doctorid
                    }
                })
            },
            handleDetailClick: function (scheduletpl) {
                this.$router.push({
                    name: 'schedule-modifytpl',
                    params: {
                        scheduletplid: scheduletpl.id
                    }
                })
            },
            onFilter() {
                this.fetchData()
            },
            fetchData: function () {
                let self = this;
                let url = api.get('scheduletplmgr.list');
                let params = {
                    doctorid: self.doctorid
                };

                self.loading = true;
                common.ajax({
                    url: url,
                    params: params,
                    isNeedLoading: false,
                    always() {
                        self.loading = false;
                    },
                    done: function (data) {
                        self.scheduletpls = data.scheduletpls;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            },
            fetchDoctors: function () {
                let self = this;
                let url = api.get('doctormgr.selectlist');

                common.ajax({
                    url: url,
                    done: function (data) {
                        self.doctors = data.doctors;
                        if (self.doctorid === '') {
                            self.doctorid = self.doctors.length > 0 ? self.doctors[0].id : '';
                        }

                        self.fetchData();
                    },
                })
            },
        }
        ,
        created: function () {
            this.doctorid = this.$route.query.doctorid || '';

            this.fetchDoctors();
        }
        ,
        mounted: function () {
            document.title = "门诊表";
        }
    }
</script>

<style scoped>
    .schedule-tpllist {
        padding: 20px;
        background-color: #fff;
    }
</style>
