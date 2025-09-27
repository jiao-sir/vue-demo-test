<script setup>
import {ref, onMounted, onUnmounted, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  User,
  Lock,
  Wallet,
  Monitor,
  Fold,
  Expand,
  Check,
  SwitchButton,
  Key,
  Upload
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const isLoggedIn = ref(false)
const username = ref('')

// 修改密码对话框状态
const changePasswordDialogVisible = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordFormRef = ref()

// 密码表单验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

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
  },
  {
    index: '/data-validation',
    title: '数据校验管理',
    icon: Check
  },
  {
    index: '/data-migration',
    title: '数据迁移管理',
    icon: Upload
  }
]

const handleMenuSelect = (index) => {
  router.push(index)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 检查登录状态
const checkLoginStatus = () => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  const user = localStorage.getItem('username')
  
  if (loggedIn === 'true' && user) {
    isLoggedIn.value = true
    username.value = user
  } else {
    isLoggedIn.value = false
    username.value = ''
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '确认退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    isLoggedIn.value = false
    username.value = ''
    
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 用户取消操作
  }
}

// 修改密码
const handleChangePassword = () => {
  // 重置表单
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  changePasswordDialogVisible.value = true
}

// 确认修改密码
const confirmChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    
    // 模拟验证当前密码（实际项目中应该调用API）
    if (passwordForm.value.currentPassword !== '123456') {
      ElMessage.error('当前密码错误')
      return
    }
    
    // 模拟修改密码请求
    ElMessage.success('密码修改成功')
    changePasswordDialogVisible.value = false
    
    // 重置表单
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    console.error('密码修改验证失败:', error)
  }
}

// 取消修改密码
const cancelChangePassword = () => {
  changePasswordDialogVisible.value = false
  // 重置表单
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus()
  
  // 如果未登录且不在登录页面，跳转到登录页
  if (!isLoggedIn.value && route.path !== '/login') {
    router.push('/login')
  }
})

// 监听路由变化，检查登录状态
watch(() => route.path, (newPath) => {
  checkLoginStatus()
  
  // 如果未登录且不在登录页面，跳转到登录页
  if (!isLoggedIn.value && newPath !== '/login') {
    router.push('/login')
  }
})

// 监听localStorage变化，实时更新登录状态
const handleStorageChange = (e) => {
  if (e.key === 'isLoggedIn' || e.key === 'username') {
    checkLoginStatus()
  }
}

// 监听登录状态变化事件
const handleLoginStatusChange = (e) => {
  if (e.detail) {
    isLoggedIn.value = e.detail.isLoggedIn
    username.value = e.detail.username
  }
}

// 添加事件监听
onMounted(() => {
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('loginStatusChanged', handleLoginStatusChange)
})

// 清理监听器
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('loginStatusChanged', handleLoginStatusChange)
})
</script>

<template>
  <!-- 登录页面 -->
  <div v-if="route.path === '/login'">
    <router-view/>
  </div>
  
  <!-- 主应用界面 -->
  <div v-else-if="isLoggedIn" class="app-container">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="navbar-left">
        <h3>管理系统</h3>
      </div>
      <div class="navbar-right">
        <span class="welcome-text">欢迎，{{ username }}</span>
        <el-button
          type="primary"
          size="small"
          :icon="Key"
          @click="handleChangePassword"
          class="action-btn"
        >
          修改密码
        </el-button>
        <el-button
          type="danger"
          size="small"
          :icon="SwitchButton"
          @click="handleLogout"
          class="action-btn"
        >
          退出登录
        </el-button>
      </div>
    </div>

    <div class="main-layout">
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
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordDialogVisible"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelChangePassword">取消</el-button>
          <el-button type="primary" @click="confirmChangePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止出现多余滚动条 */
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 铺满浏览器高度 */
  width: 100vw; /* 铺满浏览器宽度 */
}

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-left h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.welcome-text {
  color: #666;
  font-size: 14px;
}

.action-btn {
  margin-left: 5px;
}

/* 主布局 */
.main-layout {
  display: flex;
  flex: 1;
  height: calc(100vh - 60px);
}

.sidebar {
  width: 250px;
  min-width: 250px;
  background-color: #304156;
  transition: all 0.3s ease;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar.collapsed {
  width: 64px;
  min-width: 64px;
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

/* 🔥 优化后的右侧内容区 */
.main-content {
  flex: 1;
  background-color: #f9fafb;
  height: 100%;
  overflow: auto;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.main-content > * {
  flex: 1;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 避免 el-row 默认的 margin 导致居中 */
:deep(.el-row) {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
    min-width: 200px;
  }

  .sidebar.collapsed {
    width: 64px;
    min-width: 64px;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    min-height: 60px;
  }

  .sidebar.collapsed {
    width: 100%;
    min-width: 100%;
  }

  .sidebar-header h2 {
    font-size: 16px;
  }

  .main-content {
    height: calc(100vh - 60px);
  }

  .sidebar-menu {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }

  .sidebar-menu .el-menu-item {
    flex-shrink: 0;
    border-bottom: none;
    border-right: 1px solid #263445;
  }
}

@media (max-width: 480px) {
  .sidebar-header {
    padding: 0 15px;
  }

  .sidebar-header h2 {
    font-size: 14px;
  }

  .sidebar-menu .el-menu-item {
    padding: 0 15px;
  }
}

/* 全局样式重置 */
:deep(.el-menu--collapse .el-menu-item) {
  padding: 0 20px !important;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
