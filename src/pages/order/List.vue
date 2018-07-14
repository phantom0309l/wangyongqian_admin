<template>
    <div class="order-list">
        <el-form :inline="true" :model="filter_form" class="form-inline">
            <el-form-item label="状态">
                <el-select v-model="filter_form.status" placeholder="请选择状态">
                    <el-option label="全部" value="0"></el-option>
                    <el-option label="待审核" value="1"></el-option>
                    <el-option label="审核通过" value="2"></el-option>
                    <el-option label="审核拒绝" value="3"></el-option>
                    <el-option label="审核通过下线" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预约日期">
                <el-date-picker
                        v-model="filter_form.dates"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
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
                :data="orders"
                width="100%">
            <el-table-column
                    label="#"
                    type="index"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="createtime"
                    label="申请时间">
            </el-table-column>
            <el-table-column
                    prop="thedate"
                    label="预约日期"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="patient.name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="patient.sex_str"
                    label="性别"
                    width="70">
            </el-table-column>
            <el-table-column
                    prop="patient.birthday"
                    label="出生日期">
            </el-table-column>
            <el-table-column
                    prop="patient.mobile"
                    label="手机号">
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="patient.email"-->
                    <!--label="邮箱">-->
            <!--</el-table-column>-->
            <el-table-column
                    label="状态">
                <template slot-scope="scope">
                    <el-tag size="medium"
                            type="info">{{ scope.row.status_desc }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="180">
                <template slot-scope="scope">
                    <el-button @click="handleDetailClick(scope.row)" size="mini">查看</el-button>

                    <template v-if="scope.row.auditstatus === '0' || scope.row.auditstatus === '2'">
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
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                orders: [],
                total_cnt: 0,
                filter_form: {
                    pagesize: 15,
                    pagenum: 1,
                    status: '0',
                    name: '',
                    mobile: '',
                    birthday: '',
                    dates: []
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
            handleDetailClick: function (order) {
                this.goorderModify(order);
            },
            goorderModify(order) {
                this.$router.push({
                    name: 'order-modify',
                    params: {
                        orderid: order.id,
                    }
                })
            },
            handleBtnClick: function (order) {
                if (order.auditstatus === '0') { // 待审核
                    this.doAudit(order);
                } else if (order.status === '0' && order.auditstatus === '1') { // 下线
                    this.doChangeStatus(order, 1);
                } else if (order.auditstatus === '2') { // 审核拒绝
                    this.doAudit(order);
                } else if (order.status === '1' && order.auditstatus === '1') { // 上线
                    this.doChangeStatus(order, 0);
                }
            },
            doChangeStatus(order, status) {
                let self = this;

                let url = api.get('ordermgr.changestatuspost');
                let params = {orderid: order.id, status: status};

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
            doAudit(order) {
                let self = this;
                this.$alert(`
                        <form id="audit_form">
                            <div class="push-5-b">
                                <label style="width: 80px">审核结果</label>
                                <div>
                                    <input type="radio" name="status" value="1" id="status_1" ${order.auditstatus === '1' ? 'checked' : ''}> <label class="push-5-r" style="width: 80px" for="status_1">通过</label>
                                    <input type="radio" name="status" value="2" id="status_2" ${order.auditstatus === '2' ? 'checked' : ''}> <label style="width: 80px" for="status_2">拒绝</label>
                                </div>
                            </div>
                            <div>
                                <label style="width: 80px">审核备注</label>
                                <div>
                                    <textarea name="remark" class="el-textarea__inner" rows="2" placeholder="请输入审核备注"> ${order.auditremark}</textarea>
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
                    self.audit.orderid = order.id;

                    let url = api.get('ordermgr.auditpost');
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
                let url = api.get('ordermgr.list');
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
                        self.orders = data.orders;
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
            document.title = "预约列表";
        }
    }
</script>

<style scoped>
    .order-list {
        padding: 20px;
        background-color: #fff;
    }
</style>
