<template>
    <div class="patient-list">
        <el-form :inline="true" :model="filter_form" class="form-inline">
            <el-form-item label="状态">
                <el-select v-model="filter_form.status" placeholder="请选择状态">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="待审核" value="1"></el-option>
                    <el-option label="审核通过" value="2"></el-option>
                    <el-option label="审核拒绝" value="3"></el-option>
                    <el-option label="下线患者" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="患者姓名">
                <el-input v-model="filter_form.name" placeholder="患者姓名"></el-input>
            </el-form-item>
            <el-form-item label="出生日期">
                <el-date-picker type="date"
                                placeholder="选择出生日期"
                                v-model="filter_form.birthday"
                                value-format="yyyy-MM-dd"
                                default-value="1990-01-01"></el-date-picker>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="filter_form.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onFilter">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table
                border
                stripe
                v-loading="loading"
                :data="patients"
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
                    prop="birthday"
                    label="出生日期">
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
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="handleDetailClick(scope.row)" size="mini">查看</el-button>

                    <template v-if="scope.row.status === '0' && scope.row.auditstatus === '0'">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleBtnClick(scope.row)">
                            审核
                        </el-button>
                    </template>
                    <template v-else-if="scope.row.status === '0' && scope.row.auditstatus === '2'">
                        <el-button
                                size="mini"
                                type="primary"
                                @click="handleBtnClick(scope.row)">
                            审核
                        </el-button>
                    </template>
                    <template v-else-if="scope.row.status === '0' && scope.row.auditstatus === '1'">
                        <el-button
                                size="mini"
                                @click="handleBtnClick(scope.row)">
                            上线
                        </el-button>
                    </template>
                    <template v-else-if="scope.row.status === '1' && scope.row.auditstatus === '1'">
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleBtnClick(scope.row)">
                            下线
                        </el-button>
                    </template>
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
                patients: [],
                total_cnt: 0,
                filter_form: {
                    pagesize: 15,
                    pagenum: 1,
                    status: '0',
                    name: '',
                    mobile: '',
                    birthday: '',
                },
                audit: {
                    status: '0',
                    remark: ''
                },
                loading: false,
            }
        },
        methods: {
            onFilter: function () {
                this.fetchData();
            },
            handlePageNumChange(pagenum) {
                console.log(`当前页: ${pagenum}`);
                this.filter_form.pagenum = pagenum;

                this.fetchData();
            },
            handleDetailClick: function (patient) {
                this.goPatientModify(patient);
            },
            goPatientModify(patient) {
                this.$router.push({
                    name: 'patient-modify',
                    params: {
                        patientid: patient.id,
                    }
                })
            },
            handleBtnClick: function (patient) {
                if (patient.status === '0' && patient.auditstatus === '0') { // 待审核
                    this.doAudit(patient);
                } else if (patient.status === '0' && patient.auditstatus === '1') { // 下线
                    this.doChangeStatus(patient, 1);
                } else if (patient.status === '0' && patient.auditstatus === '2') { // 审核拒绝
                    this.doAudit(patient);
                } else if (patient.status === '1' && patient.auditstatus === '1') { // 上线
                    this.doChangeStatus(patient, 0);
                }
            },
            doChangeStatus(patient, status) {
                let self = this;

                let url = api.get('patientmgr.changestatuspost');
                let params = {patientid: patient.id, status: status};

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
            doAudit(patient) {
                let self = this;
                this.$alert(`
                        <form id="audit_form">
                            <div class="push-5-b">
                                <label style="width: 80px">审核结果</label>
                                <div>
                                    <input type="radio" name="status" value="1" id="status_1" ${patient.auditstatus === '1' ? 'checked' : ''}> <label class="push-5-r" style="width: 80px" for="status_1">通过</label>
                                    <input type="radio" name="status" value="2" id="status_2" ${patient.auditstatus === '2' ? 'checked' : ''}> <label style="width: 80px" for="status_2">拒绝</label>
                                </div>
                            </div>
                            <div>
                                <label style="width: 80px">审核备注</label>
                                <div>
                                    <textarea name="remark" class="el-textarea__inner" rows="2" placeholder="请输入审核备注"> ${patient.auditremark}</textarea>
                                </div>
                            </div>
                        </form>
                    `, '审核', {
                    confirmButtonText: '保存',
                    dangerouslyUseHTMLString: true,
                }).then(({}) => {
                    let data = $('#audit_form').serializeArray();
                    data.forEach(function (item) {
                        self.audit[item.name] = item.value;
                    });
                    self.audit.patientid = patient.id;

                    let url = api.get('patientmgr.auditpost');
                    let params = self.audit;

                    common.ajax({
                        url: url,
                        params: params,
                        done: function () {
                            self.$message.success('审核成功');
                            self.fetchData();
                        },
                        dataFail: function (errmsg) {
                            self.$message.error(errmsg);
                        }
                    });
                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '取消输入'
                    // });
                });
            },
            fetchData: function () {
                let self = this;
                let url = api.get('patientmgr.list');
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
                        self.patients = data.patients;
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
            document.title = "患者列表";
        }
    }
</script>

<style scoped>
    .patient-list {
        padding: 20px;
        background-color: #fff;
    }
</style>
