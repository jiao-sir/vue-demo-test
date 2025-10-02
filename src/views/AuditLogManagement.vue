<template>
  <PageContainer title="日志审计管理">
    <!-- 筛选条件 -->
    <div class="filter-section">
      <el-card class="filter-card">
        <el-form :model="filterForm" :inline="true" class="filter-form">
          <el-form-item label="用户ID">
            <el-input
              v-model="filterForm.userId"
              placeholder="请输入用户ID"
              clearable
              style="width: 150px"
            />
          </el-form-item>
          
          <el-form-item label="用户名称">
            <el-input
              v-model="filterForm.username"
              placeholder="请输入用户名称"
              clearable
              style="width: 150px"
            />
          </el-form-item>
          
          <el-form-item label="操作模块">
            <el-select
              v-model="filterForm.module"
              placeholder="请选择操作模块"
              clearable
              style="width: 150px"
            >
              <el-option label="用户管理" value="用户管理" />
              <el-option label="角色管理" value="角色管理" />
              <el-option label="数据源管理" value="数据源管理" />
              <el-option label="数据校验管理" value="数据校验管理" />
              <el-option label="数据迁移管理" value="数据迁移管理" />
              <el-option label="系统登录" value="系统登录" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="操作事件">
            <el-select
              v-model="filterForm.action"
              placeholder="请选择操作事件"
              clearable
              style="width: 150px"
            >
              <el-option label="登录" value="登录" />
              <el-option label="退出登录" value="退出登录" />
              <el-option label="添加" value="添加" />
              <el-option label="编辑" value="编辑" />
              <el-option label="删除" value="删除" />
              <el-option label="查看" value="查看" />
              <el-option label="重置密码" value="重置密码" />
              <el-option label="修改密码" value="修改密码" />
              <el-option label="分配权限" value="分配权限" />
              <el-option label="重新校验" value="重新校验" />
              <el-option label="终止校验" value="终止校验" />
              <el-option label="终止迁移" value="终止迁移" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 300px"
            />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="success" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <DataTable
      :data="filteredAuditLogs"
      :columns="columns"
      :show-edit-delete="false"
      :show-add="false"
      @row-click="handleViewDetail"
    />

    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="操作详情"
      width="600px"
    >
      <div v-if="selectedLog">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="日志ID">{{ selectedLog.id }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ selectedLog.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户名称">{{ selectedLog.username }}</el-descriptions-item>
          <el-descriptions-item label="操作模块">{{ selectedLog.module }}</el-descriptions-item>
          <el-descriptions-item label="操作事件">{{ selectedLog.action }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ selectedLog.operationTime }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ selectedLog.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="用户代理">{{ selectedLog.userAgent }}</el-descriptions-item>
          <el-descriptions-item label="操作结果" :span="2">
            <el-tag :type="selectedLog.result === '成功' ? 'success' : 'danger'">
              {{ selectedLog.result }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作描述" :span="2">{{ selectedLog.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { auditLogStore } from '../store/index.js'
import PageContainer from '../components/PageContainer.vue'
import DataTable from '../components/DataTable.vue'

// 表格列配置
const columns = [
  { prop: 'id', label: '日志ID', width: 80 },
  { prop: 'userId', label: '用户ID', width: 80 },
  { prop: 'username', label: '用户名称', width: 120 },
  { prop: 'module', label: '操作模块', width: 120 },
  { prop: 'action', label: '操作事件', width: 120 },
  { prop: 'operationTime', label: '操作时间', width: 150 },
  { prop: 'ipAddress', label: 'IP地址', width: 120 },
  { 
    prop: 'result', 
    label: '操作结果', 
    width: 100,
    formatter: (row) => {
      return row.result === '成功' ? '成功' : '失败'
    }
  },
  { 
    prop: 'actions', 
    label: '操作', 
    width: 100,
    formatter: (row) => {
      return '查看详情'
    }
  }
]

// 筛选表单
const filterForm = reactive({
  userId: '',
  username: '',
  module: '',
  action: '',
  dateRange: []
})

// 对话框状态
const detailDialogVisible = ref(false)
const selectedLog = ref(null)

// 筛选后的日志数据
const filteredAuditLogs = computed(() => {
  let logs = auditLogStore.auditLogs

  // 用户ID筛选
  if (filterForm.userId) {
    logs = logs.filter(log => log.userId.toString().includes(filterForm.userId))
  }

  // 用户名称筛选
  if (filterForm.username) {
    logs = logs.filter(log => log.username.includes(filterForm.username))
  }

  // 操作模块筛选
  if (filterForm.module) {
    logs = logs.filter(log => log.module === filterForm.module)
  }

  // 操作事件筛选
  if (filterForm.action) {
    logs = logs.filter(log => log.action === filterForm.action)
  }

  // 时间范围筛选
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const [startTime, endTime] = filterForm.dateRange
    logs = logs.filter(log => {
      const logTime = new Date(log.operationTime)
      return logTime >= new Date(startTime) && logTime <= new Date(endTime)
    })
  }

  return logs
})

// 搜索
const handleSearch = () => {
  ElMessage.success('搜索完成')
}

// 重置筛选条件
const handleReset = () => {
  Object.assign(filterForm, {
    userId: '',
    username: '',
    module: '',
    action: '',
    dateRange: []
  })
  ElMessage.info('筛选条件已重置')
}

// 导出日志
const handleExport = () => {
  ElMessage.success('日志导出功能开发中...')
}

// 查看详情
const handleViewDetail = (row) => {
  selectedLog.value = row
  detailDialogVisible.value = true
}

// 组件挂载时添加一些示例日志
onMounted(() => {
  // 添加一些示例审计日志
  const now = new Date()
  const sampleLogs = [
    {
      id: 1,
      userId: 1,
      username: 'admin',
      module: '系统登录',
      action: '登录',
      operationTime: new Date(now.getTime() - 3600000).toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      result: '成功',
      description: '用户admin成功登录系统'
    },
    {
      id: 2,
      userId: 1,
      username: 'admin',
      module: '用户管理',
      action: '添加',
      operationTime: new Date(now.getTime() - 3000000).toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      result: '成功',
      description: '添加新用户：user1'
    },
    {
      id: 3,
      userId: 1,
      username: 'admin',
      module: '数据源管理',
      action: '添加',
      operationTime: new Date(now.getTime() - 2400000).toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      result: '成功',
      description: '添加新数据源：MySQL主库'
    },
    {
      id: 4,
      userId: 1,
      username: 'admin',
      module: '数据校验管理',
      action: '添加',
      operationTime: new Date(now.getTime() - 1800000).toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      result: '成功',
      description: '创建数据校验任务：MySQL主库 vs PostgreSQL备库'
    },
    {
      id: 5,
      userId: 1,
      username: 'admin',
      module: '数据迁移管理',
      action: '添加',
      operationTime: new Date(now.getTime() - 1200000).toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      result: '成功',
      description: '创建数据迁移任务：用户表迁移'
    },
    {
      id: 6,
      userId: 1,
      username: 'admin',
      module: '角色管理',
      action: '编辑',
      operationTime: new Date(now.getTime() - 600000).toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      result: '成功',
      description: '修改权限：用户管理权限'
    }
  ]

  // 如果store中没有日志，添加示例日志
  if (auditLogStore.auditLogs.length === 0) {
    sampleLogs.forEach(log => {
      auditLogStore.addAuditLog(log)
    })
  }
})
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}

.filter-card {
  border-radius: 8px;
}

.filter-form {
  margin-bottom: 0;
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
