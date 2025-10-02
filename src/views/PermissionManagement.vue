<template>
  <PageContainer title="角色管理">
    <DataTable
      :data="permissionStore.permissions"
      :columns="columns"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- 添加/编辑权限对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '添加角色'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入权限名称" />
        </el-form-item>
        
        <el-form-item label="角色权限" prop="code">
          <el-input v-model="form.code" placeholder="请输入权限代码，如：user" />
        </el-form-item>
        
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
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
  </PageContainer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DataTable from '../components/DataTable.vue'
import PageContainer from '../components/PageContainer.vue'
import { permissionStore } from '../store'

// 表格列配置
const columns = [
  { prop: 'id', label: 'ID', width: '80' },
  { prop: 'name', label: '角色名称', minWidth: '120' },
  { prop: 'code', label: '角色权限', minWidth: '150' },
  { prop: 'description', label: '角色描述', minWidth: '200' },
  { prop: 'status', label: '状态', width: '100' },
  { prop: 'createTime', label: '创建时间', width: '120' },
  { prop: 'actions', label: '操作', width: '150' }
]

// 对话框状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

// 表单数据
const form = reactive({
  name: '',
  code: '',
  description: '',
  status: '启用'
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 50, message: '权限名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限代码', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_:]*$/, message: '权限代码格式不正确，应以字母开头，可包含字母、数字、下划线和冒号', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入权限描述', trigger: 'blur' },
    { max: 200, message: '权限描述不能超过 200 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 重置表单
const resetForm = () => {
  form.name = ''
  form.code = ''
  form.description = ''
  form.status = '启用'
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 添加权限
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑权限
const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.code = row.code
  form.description = row.description
  form.status = row.status
  dialogVisible.value = true
}

// 删除权限
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除权限 "${row.name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    permissionStore.deletePermission(row.id)
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
        permissionStore.updatePermission(form.id, {
          name: form.name,
          code: form.code,
          description: form.description,
          status: form.status
        })
        ElMessage.success('更新成功')
      } else {
        // 检查权限代码是否已存在
        const existingPermission = permissionStore.permissions.find(p => p.code === form.code)
        if (existingPermission) {
          ElMessage.error('权限代码已存在')
          return
        }
        
        permissionStore.addPermission({
          name: form.name,
          code: form.code,
          description: form.description,
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
