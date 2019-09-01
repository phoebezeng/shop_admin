<template>
    <!-- <h2>this is user</h2> -->
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table
        :data="tableData"
        style="width: 100%"
        max-height="996"
        >
        <el-table-column
            type='index'
            :index='indexMethod'
            label="#"
            width="50">
        </el-table-column>
        <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="path"
            label="路径"
            width="180">
        </el-table-column>
        <el-table-column
            label="等级">
            <template slot-scope="scope">
                <span v-if='scope.row.level == 0'>一级</span>
                <span v-else-if='scope.row.level == 1'>二级</span>
                <span v-else>三级</span>
            </template>
        </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'Rights',
    data (){
        return{
            tableData: []
        }
    },
    methods: {
        getRightsInfo(){
            this.$axios.get('rights/list')
            .then (res => {
                this.tableData = res.data.data
            })
        },
        indexMethod(index){
            return index
        }
    },
    created (){
        this.getRightsInfo()
    }

}
</script>

<style scoped>

</style>
