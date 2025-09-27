<template>
  <PageContainer title="数据源管理">
    <DataTable
      :data="dataSourceStore.dataSources"
      :columns="columns"
      :custom-actions="customActions"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
      @custom-action="handleCustomAction"
    />

    <!-- 添加/编辑数据源对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑数据源' : '添加数据源'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="数据源名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入数据源名称" />
        </el-form-item>
        
        <el-form-item label="数据源类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据源类型" style="width: 100%">
            <el-option label="MySQL" value="MySQL" />
            <el-option label="PostgreSQL" value="PostgreSQL" />
            <el-option label="Redis" value="Redis" />
            <el-option label="MongoDB" value="MongoDB" />
            <el-option label="Oracle" value="Oracle" />
            <el-option label="SQL Server" value="SQL Server" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="主机地址" prop="host">
          <el-input v-model="form.host" placeholder="请输入主机地址，如：192.168.1.100" />
        </el-form-item>
        
        <el-form-item label="端口" prop="port">
          <el-input-number
            v-model="form.port"
            :min="1"
            :max="65535"
            placeholder="请输入端口号"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="数据库名" prop="database">
          <el-input v-model="form.database" placeholder="请输入数据库名称" />
        </el-form-item>
        
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="连接正常" value="连接正常" />
            <el-option label="连接异常" value="连接异常" />
            <el-option label="未连接" value="未连接" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
<!--          <el-button @click="testConnection" :loading="testing">测试连接</el-button>-->
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '../components/DataTable.vue'
import PageContainer from '../components/PageContainer.vue'
import { dataSourceStore } from '../store'

// 表格列配置
const columns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: 'name', label: '数据源名称', minWidth: '150' },
  { prop: 'type', label: '类型', width: '120' },
  { prop: 'host', label: '主机地址', minWidth: '150' },
  { prop: 'port', label: '端口', width: '80' },
  { prop: 'database', label: '数据库', minWidth: '120' },
  { prop: 'status', label: '状态', width: '100' },
  { prop: 'createTime', label: '创建时间', width: '120' },
  { prop: 'actions', label: '操作', width: '200' }
]

// 自定义操作按钮配置
const customActions = [
  { key: 'testConnection', label: '测试连接', type: 'primary' }
]

// 对话框状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const testing = ref(false)

// 表单数据
const form = reactive({
  name: '',
  type: '',
  host: '',
  port: null,
  database: '',
  username: '',
  password: '',
  status: '未连接'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入数据源名称', trigger: 'blur' },
    { min: 2, max: 50, message: '数据源名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择数据源类型', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' },
    { pattern: /^(\d{1,3}\.){3}\d{1,3}$|^[a-zA-Z0-9.-]+$/, message: '请输入正确的IP地址或域名', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口号范围为 1-65535', trigger: 'blur' }
  ],
  database: [
    { required: true, message: '请输入数据库名称', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 重置表单
const resetForm = () => {
  form.name = ''
  form.type = ''
  form.host = ''
  form.port = null
  form.database = ''
  form.username = ''
  form.password = ''
  form.status = '未连接'
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 添加数据源
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑数据源
const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.type = row.type
  form.host = row.host
  form.port = row.port
  form.database = row.database
  form.username = row.username || ''
  form.password = '******' // 不显示真实密码
  form.status = row.status
  dialogVisible.value = true
}

// 删除数据源
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除数据源 "${row.name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    dataSourceStore.deleteDataSource(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 测试连接（从表单）
const testConnection = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      testing.value = true
      // 模拟测试连接
      setTimeout(() => {
        testing.value = false
        const success = Math.random() > 0.3 // 70% 成功率
        if (success) {
          form.status = '连接正常'
          ElMessage.success('连接测试成功')
        } else {
          form.status = '连接异常'
          ElMessage.error('连接测试失败，请检查配置')
        }
      }, 2000)
    }
  })
}

// 测试连接（从表格行数据）
const testConnectionFromRow = (row) => {
  testing.value = true
  ElMessage.info(`正在测试数据源 "${row.name}" 的连接...`)
  
  // 模拟测试连接
  setTimeout(() => {
    testing.value = false
    const success = Math.random() > 0.3 // 70% 成功率
    if (success) {
      // 更新数据源状态
      dataSourceStore.updateDataSource(row.id, { status: '连接正常' })
      ElMessage.success(`数据源 "${row.name}" 连接测试成功`)
    } else {
      // 更新数据源状态
      dataSourceStore.updateDataSource(row.id, { status: '连接异常' })
      ElMessage.error(`数据源 "${row.name}" 连接测试失败，请检查配置`)
    }
  }, 2000)
}

// 处理自定义操作
const handleCustomAction = (actionKey, row) => {
  if (actionKey === 'testConnection') {
    testConnectionFromRow(row)
  }
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const updateData = {
          name: form.name,
          type: form.type,
          host: form.host,
          port: form.port,
          database: form.database,
          status: form.status
        }
        // 只有密码不是占位符时才更新
        if (form.password !== '******') {
          updateData.username = form.username
          updateData.password = form.password
        }
        
        dataSourceStore.updateDataSource(form.id, updateData)
        ElMessage.success('更新成功')
      } else {
        dataSourceStore.addDataSource({
          name: form.name,
          type: form.type,
          host: form.host,
          port: form.port,
          database: form.database,
          username: form.username,
          password: form.password,
          status: form.status
        })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
