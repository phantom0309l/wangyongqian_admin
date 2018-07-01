<template>
    <div class="patient-one">
        <el-form :model="patient" ref="patient" label-width="100px" class="form-patient">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="patient.name" placeholder="请输入姓名"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-radio-group v-model="patient.sex">
                    <el-radio :label="'1'">男</el-radio>
                    <el-radio :label="'2'">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="出生日期">
                <el-date-picker
                        v-model="patient.birthday"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择出生日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="patient.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="patient.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <el-form-item label="最大预约次数" prop="max_order_cnt">
                <el-input type="number" v-model="patient.max_order_cnt" placeholder="请输入最大预约次数"></el-input>
            </el-form-item>

            <el-form-item label="已预约次数" prop="order_cnt">
                <el-input v-model="patient.order_cnt" readonly placeholder="请输入已预约次数"></el-input>
            </el-form-item>

            <el-form-item label="状态">
                <el-radio-group v-model="patient.status">
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
                patient: {
                    id: 0,
                    name: '',
                    sex: '',
                    birthday: '',
                    mobile: '',
                    email: '',
                },
            }
        },
        methods: {
            submitForm() {
                let self = this;
                let url = api.get('patientmgr.modifypost');
                let params = self.patient;

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
                let url = api.get('patientmgr.one');
                let params = {patientid: this.patient.id};

                common.ajax({
                    url: url,
                    params: params,
                    done: function (data) {
                        self.patient = data.patient;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            }
        }
        ,
        created: function () {
            this.patient.id = this.$route.params.patientid;
            this.fetchData();
        }
        ,
        mounted: function () {
            document.title = "患者详情";
        }
    }
</script>

<style scoped>
    .patient-one {
        padding: 20px;
        background-color: #fff;
    }

    .form-patient {
        width: 480px;
    }
</style>

<style>
    .form-patient .el-input, .form-patient .el-textarea, .form-patient .el-date-editor {
        width: 380px;
    }
</style>
