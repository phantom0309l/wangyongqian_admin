<template>
    <div class="operationcategory-list">
        <el-table
                :data="operationcategorys"
                default-expand-all
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-tag
                            :key="tag.title"
                            v-for="tag in props.row.children"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(props.$index, tag)">
                        {{tag.title}}
                    </el-tag>
                    <el-input
                            class="input-new-tag"
                            v-if="props.row.inputVisible"
                            :ref="'saveTagInput' + props.$index"
                            size="small"
                            placeholder="请输入二级分类"
                            @keyup.enter.native="handleInputConfirm($event, props.$index)"
                            @blur="handleInputConfirm($event, props.$index)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(props.$index)">+ 新增</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="术式">
                <template slot-scope="scope">
                    <el-input style="width: 200px;" v-model="scope.row.title" placeholder="请输入一级分类"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="150">
                <template slot-scope="scope">
                    <el-button @click="handleRemoveClick(scope.row, scope.$index)" size="mini" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pull-20-t">
            <el-button type="primary" @click="pushParent">新增一级分类</el-button>
            <el-button type="primary" @click="submitPost">保存</el-button>
        </div>
    </div>
</template>

<script>
    import api from '../../config/api.js';
    import common from '../../lib/common.js';

    export default {
        data: function () {
            return {
                id: 0,
                doctorid: 0,
                operationcategorys: [
                    // {
                    //     title: '哈哈哈哈',
                    //     children: [
                    //         'qwe',
                    //         'asd',
                    //         'zxc',
                    //         '123123',
                    //     ]
                    // },
                    // {
                    //     title: '嘿嘿嘿',
                    //     children: [],
                    // }
                ],
                loading: false,
            }
        },
        methods: {
            handleClose(index, tag) {
                let children = this.operationcategorys[index].children;
                children.splice(children.indexOf(tag), 1);
            },
            showInput(index) {
                let operationcategory = this.operationcategorys[index];
                operationcategory.inputVisible = true;
                this.$set(this.operationcategorys, index, operationcategory);
                this.$nextTick(_ => {
                    this.$refs['saveTagInput' + index].$refs.input.focus();
                });
            },
            handleInputConfirm(event, index) {
                let operationcategory = this.operationcategorys[index];
                if (operationcategory.inputVisible) {
                    let inputValue = event.target.value,
                        children = operationcategory.children;
                    console.log(inputValue);
                    if (inputValue) {
                        children.push({title: inputValue});
                    }
                    operationcategory.inputVisible = false;
                }
            },
            handleRemoveClick(row, index) {
                this.operationcategorys.splice(index, 1);
            },
            pushParent() {
                let self = this;
                self.operationcategorys.push({
                    title: '',
                    children: []
                });
            },
            submitPost() {
                let self = this;
                let url = api.get('operationcategorymgr.savepost');
                let params = {doctorid: self.doctorid, operationcategorys: self.operationcategorys};

                self.loading = true;
                common.ajax({
                    url: url,
                    params: params,
                    isNeedLoading: false,
                    always() {
                        self.loading = false;
                    },
                    done: function (data) {
                        self.operationcategorys = data.operationcategorys;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                });
            },
            fetchData: function () {
                let self = this;
                let url = api.get('operationcategorymgr.list');
                let params = {doctorid: self.doctorid};

                self.loading = true;
                common.ajax({
                    url: url,
                    params: params,
                    isNeedLoading: false,
                    always() {
                        self.loading = false;
                    },
                    done: function (data) {
                        self.operationcategorys = data.operationcategorys;
                    },
                    dataFail: function (errmsg) {
                        self.$message.error(errmsg);
                    }
                })
            },
        }
        ,
        created: function () {
            this.doctorid = this.$route.query.doctorid;

            this.fetchData();
        }
        ,
        mounted: function () {
            document.title = "可行手术术式";
        }
    }
</script>

<style scoped>
    .operationcategory-list {
        padding: 20px;
        background-color: #fff;
    }
</style>

<style>
    .el-tree-node__content {
        height: 40px;
    }
</style>