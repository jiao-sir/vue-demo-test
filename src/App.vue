<script setup>
import {ref} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {
  Menu as IconMenu,
  User,
  Lock,
  Wallet,
  Monitor,
  Fold,
  Expand
} from '@element-plus/icons-vue'


const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)

const menuItems = [
  {
    index: '/',
    title: '仪表板',
    icon: Monitor
  },
  {
    index: '/users',
    title: '用户管理',
    icon: User
  },
  {
    index: '/permissions',
    title: '权限管理',
    icon: Lock
  },
  {
    index: '/datasources',
    title: '数据源管理',
    icon: Wallet
  }
]

const handleMenuSelect = (index) => {
  router.push(index)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapse }">
      <div class="sidebar-header">
        <h2 v-if="!isCollapse">管理系统</h2>
        <el-button
            type="text"
            @click="toggleCollapse"
            class="collapse-btn"
        >
          <el-icon>
            <Expand v-if="isCollapse"/>
            <Fold v-else/>
          </el-icon>
        </el-button>
      </div>

      <el-menu
          :default-active="route.path"
          :collapse="isCollapse"
          @select="handleMenuSelect"
          class="sidebar-menu"
      >
        <el-menu-item
            v-for="item in menuItems"
            :key="item.index"
            :index="item.index"
        >
          <el-icon>
            <component :is="item.icon"/>
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content" :class="{ expanded: isCollapse }">
      <router-view/>
    </div>
  </div>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 250px;
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #263445;
  color: white;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.collapse-btn {
  color: white !important;
  padding: 8px !important;
}

.sidebar-menu {
  border: none;
  background-color: #304156;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
  border-bottom: 1px solid #263445;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #263445;
  color: #409eff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: white;
}

.main-content {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background-color: white;
  display: flex;
  flex-direction: column;
}

/* 全局样式重置 */
:deep(.el-menu--collapse .el-menu-item) {
  padding: 0 20px !important;
}
</style>
