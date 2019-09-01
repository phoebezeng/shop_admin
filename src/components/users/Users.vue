<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框部分 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryText">
          <!-- slot="append(后面)  prepend(前面) " 决定 搜索按钮的位置 -->
          <el-button @click="startQuery()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button @click="showUserFormVisible()" @close="dialogClosed">添加用户</el-button>
        <el-dialog title="添加用户" :visible.sync="dialogAddUserFormVisible">
          <el-form :model="addUserForm" :rules="rules" ref="addUserForm">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
              <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddUserFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
    <template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="username" label="姓名" width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="showEditUsersDialog(scope.row)"
              icon="el-icon-edit"
              size="mini"
            >
              <el-dialog title="编辑用户" :visible.sync="dialogFormVisible1" :append-to-body="true">
                <el-form :model="editUserForm">
                  <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-tag>{{ editUserForm.username }}</el-tag>
                  </el-form-item>
                  <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="editUserForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                  <el-button type="primary" @click="editUser">确 定</el-button>
                </div>
              </el-dialog>
            </el-button>

            <el-button
              type="danger"
              @click="delUser(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
              :disabled="scope.row.id == 500"
            ></el-button>

            <el-button
              type="success"
              plain
              size="mini"
              icon="el-icon-check"
              @click="showAssignRoleDialog(scope.row.id)"
            >分配角色</el-button>
            <el-dialog title="分配角色" :visible.sync="dialogFormVisible">
              <el-form>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                  <el-tag type="primary">admin</el-tag>
                </el-form-item>
                <el-form-item label="角色列表" :label-width="formLabelWidth">
                  <el-select v-model="assignRoleForm.rid">
                    <el-option
                      v-for="item in roleData"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="renewAssignRoleDialog(scope.row.id)">确 定</el-button>
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      @current-change="clickCurrentPage"
      background
      layout="prev, pager, next"
      :current-page="pagenum"
      :page-size="2"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      queryText: "",
      tableData: [],
      total: 0,
      pagenum: 1,
      mgState: true,
      dialogFormVisible1: false,
      dialogFormVisible: false,
      dialogAddUserFormVisible: false,
      formLabelWidth: "120px",
      roleData: [],
      assignRoleForm: [],
      editUserForm: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      //添加用户表单对象
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        // 用户名
        username: [
          // 判断是否有输入内容
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          // 判断 格式是否正确
          {
            min: 3,
            max: 5,
            message: "输入内容应该在 3-5 之间",
            trigger: "blur"
          }
        ],
        // 密码
        password: [
          // 判断是否有输入内容
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          // 判断 格式是否正确
          {
            min: 5,
            max: 10,
            message: "输入密码内容应该在 5-10 之间",
            trigger: "blur"
          }
        ],
        // 邮箱
        email: [
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: "格式不正确",
            trigger: "blur"
          }
        ],
        // 手机
        mobile: [
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: "格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    getUserInfo(pagenum = 1, query = "") {
      //   const url = "users";
      //   const config = {
      //     params: {
      //       query,
      //       pagenum,
      //       pagesize: 2
      //     }
      //   };
      this.$axios
        .get("users", {
          params: {
            query,
            pagenum,
            pagesize: 2
          }
        })
        .then(res => {
          console.log("列表", res);
          //保存数据
          this.tableData = res.data.data.users;
          // console.log(this.tableData);
          //保存用户总个数
          this.total = res.data.data.total;
          // console.log(this.total)
          //保存页码数
          this.pagenum = res.data.data.pagenum;
        });
    },

    //点击页码
    clickCurrentPage(curPage) {
      console.log(curPage);

      //改变入口路径
      this.$router.push("/users/" + curPage);

      //this.queryText 内容里面的第几页
      this.getUserInfo(curPage, this.queryText);
    },

    // 开始查询
    startQuery() {
      console.log(this.queryText);
      this.getUserInfo(1, this.queryText);
    },

    //显示添加用户
    showUserFormVisible() {
      this.dialogAddUserFormVisible = true;
    },
    //添加用户
    addUser() {
      this.$axios.post("users", this.addUserForm).then(res => {
        if (res.data.meta.status == 201) {
          //1.关闭对话
          this.dialogAddUserFormVisible = false;
          //2.刷新页面
          this.getUserInfo();
          //3.添加用户成功提示
          this.$message({
            message: "添加用户成功",
            type: "success",
            duration: 800
          });
          // 4. 重置表单
          this.$refs.addUserForm.resetFields();
        } else {
        }
      });
    },
    // 监听对话框关闭
    dialogClosed() {
      // console.log('对话框关闭了')
      this.$refs.addUserForm.resetFields();
    },

    // 状态改变
    async stateChanged(row) {
      //1. 从row 对象里 获取  id 和 mg_state
      const { id, mg_state: mgState } = row;

      // console.log('改了:', mgState)
      // change事件  false => true
      // 格式 : axios.put(url,data,config)
      let res = await this.$axios.put(`users/${id}/state/${mgState}`);
      // console.log(res)
      if (res.data.meta.status === 200) {
        //1. 提示修改状态成功
        this.$message({
          message: "修改状态成功",
          type: "success",
          duration: 800
        });
        //2. 刷新当前页
        this.getUserInfo(this.pagenum);
      }
    },

    //删除用户
    delUser(id) {
      // console.log(id);
      // if(id == 500){
      //     this.isId = true
      // }else{
      this.$confirm("此操作将永久删除文件，是否继续？", "提示", {
        confirmBottonText: "确定",
        cancelButtonText: "取消",
        type: "waring"
      })
        .then(() => {
          this.$axios.delete(`users/${id}`).then(res => {
            // console.log(res);
            if ((res.data.meta = 200)) {
              //1.刷新页面
              this.getUserInfo();
              //2.提示
              this.$message({
                type: "success",
                message: "删除成功！",
                duration: 800
              });
            }
          });
          // if(this.res.data.meta)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      // }
    },

    //显示编辑用户对话框
    showEditUsersDialog(row) {
      console.log(row);
      const { username, id, email, mobile } = row;
      this.editUserForm.username = username;
      this.editUserForm.id = id;
      this.editUserForm.email = email;
      this.editUserForm.mobile = mobile;

      this.dialogFormVisible1 = true;
    },
    //编辑用户
    async editUser() {
      const { id, email, mobile } = this.editUserForm;
      await this.$axios
        .put(`users/${id}`, {
          email,
          mobile
        })
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            //1.关闭对话框
            this.dialogFormVisible1 = false;
            //2.刷新页面
            this.getUserInfo();
            //3.提示
            this.$message({
              type: "success",
              message: "更新成功！",
              duration: 800
            });
          }
        });
    },

    //分配角色
    // 1.查询角色列表 渲染
    showAssignRoleDialog(id) {
      this.dialogFormVisible = true;
      this.$axios.get("roles").then(res => {
        // console.log("下雨", res.data.data);
        this.roleData = res.data.data;
      });
      // console.log(id);
      // // this.$axios.get(`users/${id1}`)
      this.$axios.get("users/" + id).then(res => {
        // console.log(res);

        this.assignRoleForm = res.data.data;
        this.assignRoleForm.rid = res.data.data.rid;
        // console.log(this.assignRoleForm.rid);
      });
    },
    //2.更新角色列表
    renewAssignRoleDialog() {
      // const url =
      // const config = {
      //     params:{
      //         rid: 39,
      //     }
      // }
      this.dialogFormVisible = false;

      let { id, rid } = this.assignRoleForm;
      this.$axios
        .put(`users/${id}/role`, {
          rid
        })
        .then(res => {
          // console.log(res);
          if (res.data.meta.status === 200) {
            //1. 关闭对话框
            this.dialogAssignRoleVisible = false;
            //2. 提示
            this.message({
              message: "分配角色成功",
              type: "success",
              duration: 800
            });

            //3.刷新
            this.loadUsersData(this.pagenum);
          }
        });
    }
  },

  created() {
    // 获取路由  参数=>页码
    const page = this.$route.params.page;
    // console.log(page);
    this.getUserInfo(page);
  }
};
</script>

<style lang='less' scoped>
.bread {
  height: 40px;
  background: #d4dae0;
  line-height: 40px;
  padding-left: 20px;
}
</style>