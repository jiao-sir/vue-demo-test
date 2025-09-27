<template>
  <PageContainer title="数据校验管理">
    <DataTable
      :data="dataValidationStore.validations"
      :columns="columns"
      :custom-actions="customActions"
      :show-edit-delete="false"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
      @custom-action="handleCustomAction"
    />

    <!-- 添加/编辑数据校验对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑数据校验' : '添加数据校验'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="数据源A名称" prop="dataSourceA">
          <el-select v-model="form.dataSourceA" placeholder="请选择数据源A" style="width: 100%">
            <el-option 
              v-for="ds in dataSourceStore.dataSources" 
              :key="ds.id" 
              :label="ds.name" 
              :value="ds.name" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="数据源B名称" prop="dataSourceB">
          <el-select v-model="form.dataSourceB" placeholder="请选择数据源B" style="width: 100%">
            <el-option 
              v-for="ds in dataSourceStore.dataSources" 
              :key="ds.id" 
              :label="ds.name" 
              :value="ds.name" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="校验类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择校验类型" style="width: 100%">
            <el-option label="数据完整性" value="数据完整性" />
            <el-option label="数据一致性" value="数据一致性" />
            <el-option label="数据准确性" value="数据准确性" />
            <el-option label="业务规则" value="业务规则" />
            <el-option label="数据格式" value="数据格式" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="校验描述" prop="description">
          <el-input 
            v-model="form.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入校验描述" 
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 校验结果详情对话框 -->
    <el-dialog
      v-model="resultDialogVisible"
      title="校验结果详情"
      width="800px"
    >
      <div v-if="selectedValidation">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="校验ID">{{ selectedValidation.id }}</el-descriptions-item>
          <el-descriptions-item label="数据源A">{{ selectedValidation.dataSourceA }}</el-descriptions-item>
          <el-descriptions-item label="数据源B">{{ selectedValidation.dataSourceB }}</el-descriptions-item>
          <el-descriptions-item label="校验类型">{{ selectedValidation.type }}</el-descriptions-item>
          <el-descriptions-item label="校验结果">
            <el-tag :type="getResultTagType(selectedValidation.result)">
              {{ selectedValidation.result }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="校验时间">{{ selectedValidation.createTime }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ selectedValidation.completeTime || '未完成' }}</el-descriptions-item>
          <el-descriptions-item label="耗时">{{ selectedValidation.duration }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ selectedValidation.description || '无' }}</el-descriptions-item>
        </el-descriptions>
        
        <div v-if="selectedValidation.errorMessage" style="margin-top: 20px;">
          <h4>错误信息：</h4>
          <el-alert
            :title="selectedValidation.errorMessage"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resultDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 终止校验对话框 -->
    <el-dialog
      v-model="terminateDialogVisible"
      title="终止校验"
      width="400px"
    >
      <p>确定要终止校验 "{{ currentValidation?.dataSourceA }} vs {{ currentValidation?.dataSourceB }}" 吗？</p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="terminateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmTerminateValidation">确定终止</el-button>
        </span>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dataValidationStore, dataSourceStore } from '../store/index.js'
import PageContainer from '../components/PageContainer.vue'
import DataTable from '../components/DataTable.vue'

// 表格列配置
const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'dataSourceA', label: '数据源A', width: 120 },
  { prop: 'dataSourceB', label: '数据源B', width: 120 },
  { prop: 'type', label: '校验类型', width: 120 },
  { 
    prop: 'result', 
    label: '校验结果', 
    width: 120,
    formatter: (row) => {
      if (row.result === '成功') return '成功'
      if (row.result === '已终止') return '已终止'
      if (row.result === '处理中') return '处理中 ⏳'
      return '失败'
    }
  },
  { prop: 'createTime', label: '校验时间', width: 120 },
  { prop: 'completeTime', label: '完成时间', width: 120 },
  { prop: 'duration', label: '耗时', width: 80 },
  { prop: 'actions', label: '操作', width: '200' }
]

// 自定义操作按钮
const customActions = [
  { 
    key: 'revalidate', 
    label: '重新校验', 
    type: 'success', 
    icon: 'Refresh',
    disabled: (row) => row.result === '处理中'
  },
  { 
    key: 'terminate', 
    label: '终止校验', 
    type: 'danger', 
    icon: 'Close',
    disabled: (row) => row.result === '处理中'
  }
]

// 对话框状态
const dialogVisible = ref(false)
const resultDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const selectedValidation = ref(null)

// 终止校验对话框状态
const terminateDialogVisible = ref(false)
const currentValidation = ref(null)

// 表单数据
const form = reactive({
  dataSourceA: '',
  dataSourceB: '',
  type: '',
  description: ''
})

// 表单验证规则
const rules = {
  dataSourceA: [
    { required: true, message: '请选择数据源A', trigger: 'change' }
  ],
  dataSourceB: [
    { required: true, message: '请选择数据源B', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择校验类型', trigger: 'change' }
  ]
}

// 处理添加
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    dataSourceA: row.dataSourceA,
    dataSourceB: row.dataSourceB,
    type: row.type,
    description: row.description || ''
  })
  form.id = row.id
  dialogVisible.value = true
}

// 处理删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除数据校验 "${row.dataSourceA} vs ${row.dataSourceB}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    dataValidationStore.deleteValidation(row.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

// 处理自定义操作
const handleCustomAction = (actionKey, row) => {
  if (actionKey === 'revalidate') {
    handleRevalidate(row)
  } else if (actionKey === 'terminate') {
    currentValidation.value = row
    terminateDialogVisible.value = true
  }
}

// 重新校验
const handleRevalidate = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要重新校验 "${row.dataSourceA} vs ${row.dataSourceB}" 吗？`,
      '确认重新校验',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    // 模拟重新校验过程
    ElMessage.info('正在重新校验...')
    
    setTimeout(() => {
      // 随机生成校验结果
      const isSuccess = Math.random() > 0.3
      const completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      const duration = (Math.random() * 5 + 1).toFixed(1) + 's'
      
      dataValidationStore.updateValidation(row.id, {
        result: isSuccess ? '成功' : '失败',
        duration: duration,
        completeTime: completeTime,
        errorMessage: isSuccess ? null : '数据不一致：发现3条记录存在差异'
      })
      
      ElMessage.success('重新校验完成')
    }, 2000)
  } catch {
    // 用户取消操作
  }
}

// 确认终止校验
const confirmTerminateValidation = () => {
  const completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
  dataValidationStore.updateValidation(currentValidation.value.id, {
    result: '已终止',
    duration: '0.0s',
    completeTime: completeTime,
    errorMessage: '校验已被用户手动终止'
  })
  
  ElMessage.success('校验已终止')
  terminateDialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      dataValidationStore.updateValidation(form.id, {
        dataSourceA: form.dataSourceA,
        dataSourceB: form.dataSourceB,
        type: form.type,
        description: form.description
      })
      ElMessage.success('更新成功')
    } else {
      // 添加校验记录，初始状态为处理中
      const validationId = Date.now()
      const createTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      dataValidationStore.addValidation({
        id: validationId,
        dataSourceA: form.dataSourceA,
        dataSourceB: form.dataSourceB,
        type: form.type,
        description: form.description,
        result: '处理中',
        duration: '0.0s',
        createTime: createTime,
        completeTime: null,
        errorMessage: null
      })
      
      ElMessage.success('校验任务已创建，正在处理中...')
      
      // 模拟异步校验过程，30-100秒后更新结果
      const delay = Math.random() * 7 + 3 // 30-100秒
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3
        const completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        
        // 计算实际耗时（秒）
        const actualDuration = delay
        const durationText = actualDuration.toFixed(1) + 's'
        
        dataValidationStore.updateValidation(validationId, {
          result: isSuccess ? '成功' : '失败',
          duration: durationText,
          completeTime: completeTime,
          errorMessage: isSuccess ? null : '数据不一致：发现2条记录存在差异'
        })
        
        ElMessage.info(`校验完成：${isSuccess ? '成功' : '失败'}`)
      }, delay * 1000)
    }
    
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 获取结果标签类型
const getResultTagType = (result) => {
  if (result === '成功') return 'success'
  if (result === '已终止') return 'warning'
  if (result === '处理中') return 'info'
  return 'danger'
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    dataSourceA: '',
    dataSourceB: '',
    type: '',
    description: ''
  })
  if (formRef.value) {
    formRef.value.resetFields()
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
