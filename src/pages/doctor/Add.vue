<template>
    <div class="schedule-addtpl">
        <el-form :model="doctor" :rules="rules" ref="doctor" label-width="100px" class="form-doctor">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="doctor.name" placeholder="请输入医院名称"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-radio-group v-model="doctor.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="医院">
                <el-select v-model="doctor.hospitalid" placeholder="请选择医院">
                    <el-option :label="hospital.name" :value="hospital.id" v-for="hospital in hospitals"
                               :key="hospital.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="职称" prop="title">
                <el-input v-model="doctor.title" placeholder="请输入职称"></el-input>
            </el-form-item>

            <el-form-item label="科室" prop="department">
                <el-input v-model="doctor.department" placeholder="请输入科室"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="doctor.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="doctor.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <!--<el-form-item label="疾病">-->
                <!--<el-checkbox-group v-model="form.type">-->
                    <!--<el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>-->
                    <!--<el-checkbox label="地推活动" name="type"></el-checkbox>-->
                    <!--<el-checkbox label="线下主题活动" name="type"></el-checkbox>-->
                    <!--<el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>-->
                <!--</el-checkbox-group>-->
            <!--</el-form-item>-->

            <el-form-item>
                <el-button type="primary" @click="submitForm('doctor')">立即创建</el-button>
                <el-button @click="resetForm('doctor')">重置</el-button>
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
                hospitals: [],
                doctor: {
                    name: '',
                    shortname: '',
                    hospitalid: '',
                    levelstr: '',
                    address: [],
                    xprovinceid: 0,
                    xcityid: 0,
                    xcountyid: 0,
                    content: '',
                },
                rules: {
                    name: [
                        {required: true, message: '请输入医院名称', trigger: 'blur'},
                    ],
                    shortname: [
                        {required: true, message: '请输入医院简称', trigger: 'blur'},
                    ],
                    levelstr: [
                        {required: true, message: '请输入医院等级', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请选择地址', trigger: 'blur'},
                    ],
                    content: [
                        {required: true, message: '请输入医院地址', trigger: 'blur'},
                    ],
                },
                xprovinces: [],
                xprovinces_props: {
                    value: 'id',
                    label: 'name',
                },
                xprovince_index: 0,
                xcity_index: 0,
            }
        },
        methods: {
            fetchHospitals: function () {
                let self = this;
                let url = api.get('hospitalmgr.selectlist');

                common.ajax({
                    url: url,
                    done: function (data) {
                        self.hospitals = data.hospitals;
                    },
                })
            },
            handleItemChange(item) {
                var self = this;

                let xprovince_children = self.xprovinces[self.xprovince_index].children;
                if (item.length === 1) {
                    self.xprovinces.forEach((value, index) => {
                        if (value.id === item[0]) {
                            self.xprovince_index = index;
                            return false;
                        }
                    });
                    xprovince_children = self.xprovinces[self.xprovince_index].children;
                    if (xprovince_children.length === 0) {
                        common.fetchXCitys(item[0], (xcitys) => {
                            xprovince_children = xcitys;

                            self.xprovinces[self.xprovince_index].children = xprovince_children;
                        })
                    }
                }

                // 获取地区
                if (item.length === 2) {
                    xprovince_children.forEach((value, index) => {
                        if (value.id === item[1]) {
                            self.xcity_index = index;
                            return false;
                        }
                    });
                    if (xprovince_children[self.xcity_index].children.length === 0) {
                        common.fetchXCountys(item[1], (xcountys) => {
                            xprovince_children[self.xcity_index].children = xcountys;
                        })
                    }
                }

                if (item.length === 3) {
                    self.doctor.xprovinceid = item[0];
                    self.doctor.xcityid = item[1];
                    self.doctor.xcountyid = item[2];
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let self = this;
                        let url = api.get('doctormgr.addpost');
                        let params = self.doctor;
                        params.xprovinceid = params.address[0];
                        params.xcityid = params.address[1];
                        params.xcountyid = params.address[2];

                        common.ajax({
                            url: url,
                            params: params,
                            isNeedLoading: false,
                            done: function (data) {
                                self.$message({
                                    message: '创建成功',
                                    type: 'success',
                                    duration: 800,
                                    onClose() {
                                        self.$router.push({
                                            name: 'doctor-list'
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
            common.fetchXProvinces((xprovinces) => {
                this.xprovinces = xprovinces
            });

            this.fetchHospitals();
        }
        ,
        mounted: function () {
            document.title = "添加医院";
        }
    }
</script>

<style scoped>
    .schedule-addtpl {
        padding: 20px;
        background-color: #fff;
    }

    .form-doctor {
        width: 480px;
    }
</style>

<style>
    .form-doctor .el-input, .form-doctor .el-textarea, .form-doctor .el-date-editor {
        width: 380px;
    }
</style>
