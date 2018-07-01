<template>
    <div class="schedule-addtpl">
        <el-form :model="schedule" :rules="rules" ref="schedule" label-width="100px" class="form-schedule">
            <el-form-item label="出诊日期" prop="thedate" required>
                <el-date-picker
                        v-model="schedule.thedate"
                        align="right"
                        type="date"
                        :editable="false"
                        placeholder="选择出诊日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="门诊时刻" prop="daypart" required>
                <el-select v-model="schedule.daypart" placeholder="请选择门诊时段">
                    <el-option :label="label" :value="value" v-for="(label, value) in dayparts" :key="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="门诊类型" prop="tkttype" required>
                <el-select v-model="schedule.tkttype" placeholder="请选择门诊类型">
                    <el-option :label="label" :value="value" v-for="(label, value) in tkttypes" :key="value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="最大预约数" prop="maxcnt" required>
                <el-input type="number" v-model="schedule.maxcnt" placeholder="请输入最大预约数"></el-input>
            </el-form-item>


            <el-form-item label="疾病类型">
                <el-input v-model="schedule.disease_name" readonly></el-input>
            </el-form-item>

            <el-form-item label="门诊时段">
                <el-input :value="schedule.scheduletpl.begin_hour_str + '至' + schedule.scheduletpl.end_hour_str" readonly></el-input>
            </el-form-item>

            <el-form-item label="门诊电话">
                <el-input v-model="schedule.scheduletpl.scheduletpl_mobile" readonly></el-input>
            </el-form-item>

            <el-form-item label="门诊费用">
                <el-input v-model="schedule.scheduletpl.scheduletpl_cost" readonly></el-input>
            </el-form-item>

            <el-form-item label="门诊地址">
                <el-input v-model="schedule.scheduletpl.address" readonly></el-input>
            </el-form-item>

            <el-form-item label="就诊提示">
                <el-input v-model="schedule.scheduletpl.tip" readonly></el-input>
            </el-form-item>

            <el-form-item label="状态" prop="status" required>
                <el-radio-group v-model="schedule.status">
                    <el-radio label="1">上线</el-radio>
                    <el-radio label="0">下线</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('schedule')">保存</el-button>
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
                schedule: {
                    id: 0,
                    doctorid: 0,
                    diseaseid: "0",
                    op_hz: 'weekly',
                    day_part: 'am',
                    scheduletpl: {
                        begin_hour_str: '',
                        end_hour_str: '',
                        hour_str: [
                            '08:00:00',
                            '12:00:00',
                        ],
                    },
                    op_type: 'normal',
                    schedule_mobile: '',
                    schedule_cost: '',
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
                    thedate: [
                        {required: true, message: '请选择出诊日期', trigger: 'blur'},
                    ],
                    diseaseid: [
                        {required: true, message: '请选择疾病类型', trigger: 'blur'},
                    ],
                    daypart: [
                        {required: true, message: '请选择门诊时刻', trigger: 'blur'},
                    ],
                    tkttype: [
                        {required: true, message: '请选择门诊类型', trigger: 'blur'},
                    ],
                    maxcnt: [
                        {required: true, message: '请选择最大预约数', trigger: 'blur'},
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'},
                    ],
                },

                dayparts: [],
                tkttypes: [],

            }
        },
        methods: {
            fetchData() {
                let self = this;
                let url = api.get('schedulemgr.modify');

                common.ajax({
                    url: url,
                    params: {
                        scheduleid: self.schedule.id
                    },
                    isNeedLoading: false,
                    done: function (data) {
                        self.dayparts = data.dayparts;
                        self.tkttypes = data.tkttypes;

                        self.schedule = data.schedule;
                        self.schedule.maxcnt = parseInt(self.schedule.maxcnt);
                        self.schedule.dow = parseInt(self.schedule.dow);
                    }
                });
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let self = this;
                        let url = api.get('schedulemgr.modifypost');
                        let params = self.schedule;

                        common.ajax({
                            url: url,
                            params: params,
                            isNeedLoading: false,
                            done: function (data) {
                                self.$message({
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 800,
                                    onClose() {
                                        self.$router.push({
                                            path: '/schedule/list',
                                            query: {
                                                doctorid: self.schedule.doctorid
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
        },
        created: function () {
            this.schedule.id = this.$route.params.scheduleid;

            this.fetchData();
        },
        mounted: function () {
            document.title = "门诊实例";
        }
    }
</script>

<style scoped>
    .schedule-addtpl {
        padding: 20px;
        background-color: #fff;
    }

    .form-schedule {
        width: 480px;
    }
</style>

<style>
    .form-schedule .el-input, .form-schedule .el-textarea, .form-schedule .el-date-editor {
        width: 380px;
    }
</style>
