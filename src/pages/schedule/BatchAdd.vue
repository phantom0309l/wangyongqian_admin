<template>
    <div class="patient-list">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="form-scheduletpl">
            <el-form-item label="活动时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.start_date" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.end_date" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">立即批量生成门诊实例</el-button>
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
                form: {
                    scheduletplid: '0',
                    start_date: '',
                    end_date: ''
                },
                rules: {
                    start_date: [
                        {required: true, message: '请选择开始日期', trigger: 'blur'},
                    ],
                    end_date: [
                        {required: true, message: '请选择结束日期', trigger: 'blur'},
                    ],
                }
            }
        },
        methods: {
            fetchData() {
                let self = this;
                let url = api.get('scheduletplmgr.add');

                common.ajax({
                    url: url,
                    params: {
                        doctorid: self.scheduletpl.doctorid
                    },
                    isNeedLoading: false,
                    done: function (data) {
                        self.doctordiseaserefs = data.doctordiseaserefs;
                        self.op_hzs = data.op_hzs;
                        self.day_parts = data.day_parts;
                        self.op_types = data.op_types;
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let self = this;
                        let url = api.get('schedulemgr.batchaddpost');
                        let params = self.form;

                        common.ajax({
                            url: url,
                            params: params,
                            isNeedLoading: false,
                            done: function (data) {
                                self.$message({
                                    message: '创建成功',
                                    type: 'success',
                                    onClose() {
                                        self.$router.push({
                                            path: '/schedule/tpllist',
                                            query: {
                                                doctorid: self.scheduletpl.doctorid
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
        ,
        created: function () {
            this.scheduletpl.doctorid = this.$route.query.doctorid;

            this.fetchData();

            common.fetchXProvinces((xprovinces) => {
                this.xprovinces = xprovinces
            });
        }
        ,
        mounted: function () {
            document.title = "查询-患者列表";
        }
    }
</script>

<style scoped>
    .patient-list {
        padding: 20px;
        background-color: #fff;
    }

    .form-scheduletpl {
        width: 480px;
    }
</style>

<style>
    .form-scheduletpl .el-input, .form-scheduletpl .el-textarea, .form-scheduletpl .el-date-editor {
        width: 380px;
    }
</style>
