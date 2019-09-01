<template>
  <!-- <h2>this is roles</h2> -->
  <el-table :data="tableData" style="width: 100%">
    <!-- 展示行开始 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- 第一层 -->
        <el-row class="row1" v-for="item1 in scope.row.children" :key="item1.id">
          <el-col :span="4">
            <el-tag type="primary" closable>{{ item1.authName }}</el-tag>
            <i class="el-icon-arrow-right"></i>
          </el-col>
          <el-col :span="20">
            <!-- 第二层  -->
            <el-row class="row2" v-for="item2 in item1.children" :key="item2.id">
              <el-col :span="4">
                <el-tag type="success" closable>{{ item2.authName }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <!-- 第三层 -->
                <span v-for="item3 in item2.children" :key="item3.id" class="tag">
                  <el-tag type="warning">{{item3.authName }}</el-tag>
                </span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index" label="#" width="100"></el-table-column>
    <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
    <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        <el-button
          type="success"
          plain
          size="mini"
          icon="el-icon-check"
          @click="showAssignDialog(scope.row)"
        >分配角色</el-button>
        <el-dialog title="角色授权" :visible.sync="dialogAssignRightsVisible" :append-to-body="true">
          <el-tree
            :data="treeData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          ></el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAssignRightsVisible = false">取 消</el-button>
            <el-button type="primary" @click="assignRights">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      tableData: [],
      treeData: {},
      dialogAssignRightsVisible: false,
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    getRolesInfo() {
      this.$axios.get("roles").then(res => {
        // console.log("角色", res);
        this.tableData = res.data.data;
      });
    },
    indexMethod(index) {
      return index;
    },
    loadAllRightsData() {
      this.$axios.get("rights/tree").then(res => {
        console.log("hhh", res);
        this.treeData = res.data;
      });
    },
    showAssignDialog(row) {
      //0. 拿到row的id(角色id) 保存起来
      this.roleId = row.id;

      //1. 窗口显示
      this.dialogAssignRightsVisible = true;

      //2. 获取第三层的id
      let keys = [];
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            console.log(item3.id);
            keys.push(item3.id);
          });
        });
      });

      //3. 设置  keys
      // 原因异步DOM更新,打印有点早了,
      // DOM更新完毕了,再获取
      // nextTick
      this.$nextTick(() => {
        console.log(this.$refs.tree);
        this.$refs.tree.setCheckedKeys(keys);
      });
    },
    async assignRights() {
      //1. 获取Tree 里 半选和选中的key
      let keys1 = this.$refs.tree.getHalfCheckedKeys();
      let keys2 = this.$refs.tree.getCheckedKeys();
      // console.log(keys2)
      let keys = keys1.concat(keys2);

      // 参数
      // 参数1 : roleId 当前角色的id   this.roleId
      // 参数2 :  rids 权限的id
      let res = await this.$axios.post(`roles/${this.roleId}/rights`, {
        // 要的是,分割的字符串
        rids: keys.join(",")
      });

      console.log(res);
      if (res.data.meta.status === 200) {
        // 1. 关闭对话框
        this.dialogAssignRightsVisible = false;
        // 2. 提示消息
        this.$message({
          message: "分配权限成功",
          type: "success",
          duration: 800
        });
        // 3. 刷新
        this.loadRolesData();
      }
    }
  },
  created() {
    this.getRolesInfo();
    this.loadAllRightsData();
  }
};
</script>

<style lang='less' scoped>
.row1 {
  border-bottom: 1px dashed #ccc;
  margin-top: 10px;
  &:last-child {
    border: none;
  }
}

.row2 {
  margin-bottom: 10px;
}

.tag {
  margin: 0 3px;
}
</style>
