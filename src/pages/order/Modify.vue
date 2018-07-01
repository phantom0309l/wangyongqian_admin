<template>
    <div class="order-one">
        <el-form :model="order" ref="order" label-width="100px" class="form-order">
            <el-form-item label="姓名" prop="patient.name">
                <el-input v-model="order.patient.name" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="patient.sex">
                <el-input v-model="order.patient.sex_str" placeholder="请输入性别"></el-input>
            </el-form-item>

            <el-form-item label="出生日期" prop="patient.birthday">
                <el-input v-model="order.patient.birthday" placeholder="请输入出生日期" readonly></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="patient.mobile">
                <el-input v-model="order.patient.mobile" placeholder="请输入手机号" readonly></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="patient.email">
                <el-input v-model="order.patient.email" placeholder="请输入邮箱" readonly></el-input>
            </el-form-item>

            <el-form-item label="来源" prop="createby_str">
                <el-input v-model="order.createby_str" readonly></el-input>
            </el-form-item>

            <el-form-item label="预约日期" prop="thedate" required>
                <el-date-picker
                        v-model="order.thedate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择预约日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="手术方式" prop="operationcategory_str">
                <el-input type="textarea" autosize v-model="order.operationcategory_str" placeholder="请输入手术方式" readonly></el-input>
            </el-form-item>

            <el-form-item label="面诊凭证">
                <!--<el-input v-model="order." readonly></el-input>-->
            </el-form-item>

            <el-form-item label="患者备注" prop="remark">
                <el-input type="textarea" autosize v-model="order.remark" placeholder="请输入患者备注"></el-input>
            </el-form-item>

            <el-form-item label="状态" prop="status" v-if="order.auditstatus === '1'">
                <el-radio-group v-model="order.status">
                    <el-radio :label="'1'">上线</el-radio>
                    <el-radio :label="'0'">下线</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import api from '../../config/api.js';
    import common from '../../lib/common.js';

    export default {
        data: function () {
            return {
                order: {
                    patient: {
                        name: ''
                    }
                    // id: 0,
                    // name: '',
                    // sex: '',
                    // birthday: '',
                    // mobile: '',
                    // email: '',
                },
            }
        },
        methods: {
            submitForm() {
                let self = this;
                let url = api.get('ordermgr.modifypost');
                let params = self.order;

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data) {
                        self.fetchData();
                        self.$message({
                            message: '保存成功',
                            type: 'success',
                            duration: 800,
                        });
                    }
                });
            },
            fetchData() {
                let self = this;
                let url = api.get('ordermgr.modify');
                let params = {orderid: this.order.id};

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data) {
                        self.order = data.order;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            }
        }
        ,
        created: function () {
            this.order.id = this.$route.params.orderid;
            this.fetchData();
        }
        ,
        mounted: function () {
            document.title = "预约详情";
        }
    }
</script>

<style scoped>
    .order-one {
        padding: 20px;
        background-color: #fff;
    }

    .form-order {
        width: 480px;
    }
</style>

<style>
    .form-order .el-input, .form-order .el-textarea, .form-order .el-date-editor {
        width: 380px;
    }
</style>
