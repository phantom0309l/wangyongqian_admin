<template>
    <div class="schedule-addtpl">
        <el-form :model="hospital" :rules="rules" ref="hospital" label-width="100px" class="form-hospital">
            <el-form-item label="医院名称" prop="name">
                <el-input v-model="hospital.name" placeholder="请输入医院名称"></el-input>
            </el-form-item>

            <el-form-item label="医院简称" prop="shortname">
                <el-input v-model="hospital.shortname" placeholder="请输入医院简称"></el-input>
            </el-form-item>

            <el-form-item label="医院等级" prop="levelstr">
                <el-input v-model="hospital.levelstr" placeholder="请输入医院等级"></el-input>
            </el-form-item>

            <el-form-item label="医院地址" required>
                <el-form-item prop="address">
                    <el-cascader
                            :options="xprovinces"
                            v-model="hospital.address"
                            @active-item-change="handleItemChange"
                            :props="xprovinces_props"
                            placeholder="请选择地址"
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="content">
                    <el-input class="push-15-t" v-model="hospital.content" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('hospital')">立即创建</el-button>
                <el-button @click="resetForm('hospital')">重置</el-button>
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
                hospital: {
                    name: '',
                    shortname: '',
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
                    self.hospital.xprovinceid = item[0];
                    self.hospital.xcityid = item[1];
                    self.hospital.xcountyid = item[2];
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let self = this;
                        let url = api.get('hospitalmgr.addpost');
                        let params = self.hospital;
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
                                            name: 'hospital-list'
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

    .form-hospital {
        width: 480px;
    }
</style>

<style>
    .form-hospital .el-input, .form-hospital .el-textarea, .form-hospital .el-date-editor {
        width: 380px;
    }
</style>
