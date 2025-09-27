<template>
  <PageContainer title="用户管理">
    <DataTable
      :data="userStore.users"
      :columns="columns"
      :custom-actions="customActions"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
      @custom-action="handleCustomAction"
    />

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
            <el-option label="访客" value="访客" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="启用" value="启用" />
            <el-option label="禁用" value="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置密码"
      width="400px"
    >
      <p>确定要重置用户 "{{ currentUser?.username }}" 的密码吗？</p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmResetPassword">确定重置</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      v-model="assignPermissionDialogVisible"
      title="分配权限"
      width="600px"
    >
      <div>
        <p><strong>用户：</strong>{{ currentUser?.username }}</p>
        <el-divider />
        <el-checkbox-group v-model="selectedPermissions">
          <el-checkbox
            v-for="permission in permissionStore.permissions"
            :key="permission.id"
            :label="permission.id"
            :value="permission.id"
          >
            {{ permission.name }} - {{ permission.description }}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignPermissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAssignPermissions">确定分配</el-button>
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
import { userStore, permissionStore } from '../store'

// 表格列配置
const columns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: 'username', label: '用户名', minWidth: '120' },
  { prop: 'email', label: '邮箱', minWidth: '180' },
  { prop: 'role', label: '角色', width: '120' },
  { prop: 'status', label: '状态', width: '100' },
  { prop: 'createTime', label: '创建时间', width: '120' },
  { prop: 'actions', label: '操作', width: '250' }
]

// 自定义操作按钮配置
const customActions = [
  { key: 'resetPassword', label: '重置密码', type: 'warning' },
]

// 对话框状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 重置密码对话框状态
const resetPasswordDialogVisible = ref(false)
const currentUser = ref(null)

// 分配权限对话框状态
const assignPermissionDialogVisible = ref(false)
const selectedPermissions = ref([])

// 表单数据
const form = reactive({
  username: '',
  email: '',
  role: '',
  status: '启用'
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 重置表单
const resetForm = () => {
  form.username = ''
  form.email = ''
  form.role = ''
  form.status = '启用'
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 添加用户
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.username = row.username
  form.email = row.email
  form.role = row.role
  form.status = row.status
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${row.username}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.deleteUser(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        userStore.updateUser(form.id, {
          username: form.username,
          email: form.email,
          role: form.role,
          status: form.status
        })
        ElMessage.success('更新成功')
      } else {
        userStore.addUser({
          username: form.username,
          email: form.email,
          role: form.role,
          status: form.status
        })
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}

// 处理自定义操作
const handleCustomAction = (actionKey, row) => {
  currentUser.value = row
  if (actionKey === 'resetPassword') {
    resetPasswordDialogVisible.value = true
  } else if (actionKey === 'assignPermissions') {
    // 获取用户当前权限
    selectedPermissions.value = row.permissions || []
    assignPermissionDialogVisible.value = true
  }
}

// 确认重置密码
const confirmResetPassword = () => {
  if (userStore.resetPassword(currentUser.value.id)) {
    ElMessage.success('密码重置成功')
    resetPasswordDialogVisible.value = false
  } else {
    ElMessage.error('密码重置失败')
  }
}

// 确认分配权限
const confirmAssignPermissions = () => {
  if (userStore.assignPermissions(currentUser.value.id, selectedPermissions.value)) {
    ElMessage.success('权限分配成功')
    assignPermissionDialogVisible.value = false
  } else {
    ElMessage.error('权限分配失败')
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
