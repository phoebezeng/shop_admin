<template>
  <!-- 侧栏 -->
  <!--
    el-menu : 菜单组件
      -  default-active="2" 默认选中 默认高亮 (index:2)
      - @open="handleOpen"
      - @close="handleClose"
    el-submenu 菜单子组件 (可展开)
    el-menu-item 菜单元素 (最小单位)
    el-menu-item-group 分组
  -->
  <section class="container">
    <el-col :span="3">
      <el-menu
        :router="true"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        text-color="#fff"
        background-color="#545c64"
        active-text-color="#ffd04b"
      >
        <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.authName}}</span>
          </template>
          <el-menu-item
            :index="'/'+item1.path"
            v-for="item1 in item.children"
            :key="item1.id"
          >{{item1.authName}}</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
    <el-main>
      <!-- 子组件的出口 -->
      <router-view></router-view>
    </el-main>
  </section>
</template>

<script>
import Users from "./users/Users";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      menus: []
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getHomeInfo() {
      this.$axios.get("menus").then(res => {
        console.log(res);
        this.menus = res.data.data;
      });
    }
  },
  created() {
    this.getHomeInfo();
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}

.el-col {
  height: 100%;
  background-color: #545c64;
}
</style>
