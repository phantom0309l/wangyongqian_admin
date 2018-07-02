<template>
    <div class="schedule-addtpl">
        <el-form :model="scheduletpl" :rules="rules" ref="scheduletpl" label-width="100px" class="form-scheduletpl">
            <!--<el-form-item label="疾病类型" prop="diseaseid" required>-->
                <!--<el-select v-model="scheduletpl.diseaseid" placeholder="请选择疾病类型">-->
                    <!--<el-option label="全部疾病" value="0"></el-option>-->
                    <!--<el-option :label="doctordiseaseref.disease_name" :value="doctordiseaseref.diseaseid"-->
                               <!--v-for="doctordiseaseref in doctordiseaserefs" :key="doctordiseaseref.id"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

            <el-form-item label="门诊周期" prop="op_hz" required>
                <el-select v-model="scheduletpl.op_hz" placeholder="请选择门诊周期">
                    <el-option :label="label" :value="value" v-for="(label, value) in op_hzs" :key="value"></el-option>
                </el-select>
            </el-form-item>

            <!--<el-form-item label="门诊时刻" prop="day_part" required>-->
                <!--<el-select v-model="scheduletpl.day_part" placeholder="请选择门诊时段">-->
                    <!--<el-option :label="label" :value="value" v-for="(label, value) in day_parts" :key="value"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

            <!--<el-form-item label="门诊时段">-->
                <!--<el-time-picker-->
                        <!--is-range-->
                        <!--:editable="false"-->
                        <!--v-model="scheduletpl.hour_str"-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="开始时间"-->
                        <!--end-placeholder="结束时间"-->
                        <!--placeholder="请选择门诊时段"-->
                        <!--arrow-control-->
                        <!--value-format="HH:mm:ss">-->
                <!--</el-time-picker>-->
            <!--</el-form-item>-->

            <!--<el-form-item label="门诊类型" prop="op_type" required>-->
                <!--<el-select v-model="scheduletpl.op_type" placeholder="请选择门诊类型">-->
                    <!--<el-option :label="label" :value="value" v-for="(label, value) in op_types" :key="value"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->

            <el-form-item label="门诊电话" prop="scheduletpl_mobile">
                <el-input v-model="scheduletpl.scheduletpl_mobile" placeholder="请输入门诊电话"></el-input>
            </el-form-item>

            <!--<el-form-item label="门诊费用" prop="scheduletpl_cost">-->
                <!--<el-input type="number" placeholder="请输入门诊费用" v-model="scheduletpl.scheduletpl_cost">-->
                    <!--<template slot="append">元 / 人</template>-->
                <!--</el-input>-->
            <!--</el-form-item>-->

            <el-form-item label="最近门诊日期">
                <el-date-picker
                        v-model="scheduletpl.op_date"
                        align="right"
                        type="date"
                        :editable="false"
                        placeholder="选择最近门诊日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="最大预约数" prop="maxcnt" required>
                <el-input type="number" v-model="scheduletpl.maxcnt" placeholder="请输入最大预约数"></el-input>
            </el-form-item>

            <el-form-item label="门诊地址" required>
                <el-form-item prop="address">
                    <el-cascader
                            :options="xprovinces"
                            v-model="scheduletpl.address"
                            @active-item-change="handleItemChange"
                            :props="xprovinces_props"
                            placeholder="请选择地址"
                    ></el-cascader>
                </el-form-item>
                <el-form-item prop="content">
                    <el-input class="push-15-t" v-model="scheduletpl.content" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form-item>

            <el-form-item label="就诊提示" prop="tip">
                <el-input type="textarea" v-model="scheduletpl.tip" placeholder="请输入就诊提示"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('scheduletpl')">立即创建</el-button>
                <el-button @click="resetForm('scheduletpl')">重置</el-button>
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
                scheduletpl: {
                    doctorid: 0,
                    diseaseid: "0",
                    op_hz: 'weekly',
                    day_part: 'am',
                    hour_str: [
                        '08:00:00',
                        '12:00:00',
                    ],
                    op_type: 'normal',
                    scheduletpl_mobile: '',
                    scheduletpl_cost: '',
                    op_date: '',
                    maxcnt: '',
                    address: [],
                    xprovinceid: 0,
                    xcityid: 0,
                    xcountyid: 0,
                    content: '',
                    tip: '',
                },
                rules: {
                    diseaseid: [
                        {required: true, message: '请选择疾病类型', trigger: 'blur'},
                    ],
                    op_hz: [
                        {required: true, message: '请选择门诊周期', trigger: 'blur'},
                    ],
                    day_part: [
                        {required: true, message: '请选择门诊时刻', trigger: 'blur'},
                    ],
                    op_type: [
                        {required: true, message: '请选择门诊类型', trigger: 'blur'},
                    ],
                    maxcnt: [
                        {required: true, message: '请选择最大预约数', trigger: 'blur'},
                    ],
                    address: [
                        {required: true, message: '请选择地址', trigger: 'change'},
                    ],
                    content: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'},
                    ],
                },
                xprovinces: [],
                xprovinces_props: {
                    value: 'id',
                    label: 'name',
                },
                xprovince_index: 0,
                xcity_index: 0,

                doctordiseaserefs: [],
                op_hzs: [],
                day_parts: [],
                op_types: [],

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
                    self.scheduletpl.xprovinceid = item[0];
                    self.scheduletpl.xcityid = item[1];
                    self.scheduletpl.xcountyid = item[2];
                }
            },
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
                        let url = api.get('scheduletplmgr.addpost');
                        let params = self.scheduletpl;
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
    .schedule-addtpl {
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
