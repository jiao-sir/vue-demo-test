<template>
  <PageContainer title="数据迁移管理">
    <DataTable
        :data="dataMigrationStore.migrations"
        :columns="columns"
        :custom-actions="customActions"
        :show-edit-delete="false"
        @add="handleAdd"
        @edit="handleEdit"
        @delete="handleDelete"
        @custom-action="handleCustomAction"
    />

    <!-- 添加/编辑数据迁移对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="isEdit ? '编辑数据迁移' : '添加数据迁移'"
        width="600px"
    >
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
      >
        <el-form-item label="迁移名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入迁移名称" />
        </el-form-item>

        <el-form-item label="源数据源" prop="source">
          <el-select v-model="form.source" placeholder="请选择源数据源" style="width: 100%">
            <el-option
                v-for="ds in dataSourceStore.dataSources"
                :key="ds.id"
                :label="ds.name"
                :value="ds.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="目标数据源" prop="target">
          <el-select v-model="form.target" placeholder="请选择目标数据源" style="width: 100%">
            <el-option
                v-for="ds in dataSourceStore.dataSources"
                :key="ds.id"
                :label="ds.name"
                :value="ds.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="迁移类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择迁移类型" style="width: 100%">
            <el-option label="全量迁移" value="全量迁移"/>
            <el-option label="增量迁移" value="增量迁移"/>
            <el-option label="结构迁移" value="结构迁移"/>
            <el-option label="数据同步" value="数据同步"/>
          </el-select>
        </el-form-item>

        <el-form-item label="迁移描述" prop="description">
          <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入迁移描述"
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

    <!-- 迁移结果详情对话框 -->
    <el-dialog
        v-model="resultDialogVisible"
        title="迁移结果详情"
        width="800px"
    >
      <div v-if="selectedMigration">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="迁移ID">{{ selectedMigration.id }}</el-descriptions-item>
          <el-descriptions-item label="迁移名称">{{ selectedMigration.name }}</el-descriptions-item>
          <el-descriptions-item label="源数据源">{{ selectedMigration.source }}</el-descriptions-item>
          <el-descriptions-item label="目标数据源">{{ selectedMigration.target }}</el-descriptions-item>
          <el-descriptions-item label="迁移类型">{{ selectedMigration.type }}</el-descriptions-item>
          <el-descriptions-item label="迁移结果">
            <el-tag :type="getResultTagType(selectedMigration.result)">
              {{ selectedMigration.result }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ selectedMigration.createTime }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{
              selectedMigration.completeTime || '未完成'
            }}
          </el-descriptions-item>
          <el-descriptions-item label="耗时">{{ selectedMigration.duration }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{
              selectedMigration.description || '无'
            }}
          </el-descriptions-item>
        </el-descriptions>

        <div v-if="selectedMigration.errorMessage" style="margin-top: 20px;">
          <h4>错误信息：</h4>
          <el-alert
              :title="selectedMigration.errorMessage"
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

    <!-- 终止迁移对话框 -->
    <el-dialog
        v-model="terminateDialogVisible"
        title="终止迁移"
        width="400px"
    >
      <p>确定要终止迁移 "{{ currentMigration?.name }}" 吗？</p>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="terminateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmTerminateMigration">确定终止</el-button>
        </span>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {dataMigrationStore, dataSourceStore} from '../store/index.js'
import PageContainer from '../components/PageContainer.vue'
import DataTable from '../components/DataTable.vue'

// 表格列配置
const columns = [
  {prop: 'id', label: 'ID', width: 80},
  {prop: 'name', label: '迁移名称', width: 150},
  {prop: 'source', label: '源数据源', width: 120},
  {prop: 'target', label: '目标数据源', width: 120},
  {prop: 'type', label: '迁移类型', width: 120},
  {
    prop: 'result',
    label: '迁移结果',
    width: 120,
    formatter: (row) => {
      if (row.result === '成功') return '成功'
      if (row.result === '已终止') return '已终止'
      if (row.result === '迁移中') return '迁移中 ⏳'
      return '失败'
    }
  },
  {prop: 'createTime', label: '开始时间', width: 120},
  {prop: 'completeTime', label: '完成时间', width: 120},
  {prop: 'duration', label: '耗时', width: 80},
  {prop: 'actions', label: '操作', width: '200'}
]

// 自定义操作按钮
const customActions = [
  {
    key: 'terminate',
    label: '终止迁移',
    type: 'danger',
    icon: 'Close',
    disabled: (row) => row.result === '迁移中'
  }
]

// 对话框状态
const dialogVisible = ref(false)
const resultDialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const selectedMigration = ref(null)

// 终止迁移对话框状态
const terminateDialogVisible = ref(false)
const currentMigration = ref(null)

// 表单数据
const form = reactive({
  name: '',
  source: '',
  target: '',
  type: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    {required: true, message: '请输入迁移名称', trigger: 'blur'}
  ],
  source: [
    {required: true, message: '请选择源数据源', trigger: 'change'}
  ],
  target: [
    {required: true, message: '请选择目标数据源', trigger: 'change'}
  ],
  type: [
    {required: true, message: '请选择迁移类型', trigger: 'change'}
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
    name: row.name,
    source: row.source,
    target: row.target,
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
        `确定要删除数据迁移 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    dataMigrationStore.deleteMigration(row.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消删除
  }
}

// 处理自定义操作
const handleCustomAction = (actionKey, row) => {
  if (actionKey === 'terminate') {
    currentMigration.value = row
    terminateDialogVisible.value = true
  }
}

// 确认终止迁移
const confirmTerminateMigration = () => {
  const completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
  dataMigrationStore.updateMigration(currentMigration.value.id, {
    result: '已终止',
    duration: '0.0s',
    completeTime: completeTime,
    errorMessage: '迁移已被用户手动终止'
  })

  ElMessage.success('迁移已终止')
  terminateDialogVisible.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (isEdit.value) {
      dataMigrationStore.updateMigration(form.id, {
        name: form.name,
        source: form.source,
        target: form.target,
        type: form.type,
        description: form.description
      })
      ElMessage.success('更新成功')
    } else {
      // 添加迁移记录，初始状态为迁移中
      const migrationId = Date.now()
      const createTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      dataMigrationStore.addMigration({
        id: migrationId,
        name: form.name,
        source: form.source,
        target: form.target,
        type: form.type,
        description: form.description,
        result: '迁移中',
        duration: '0.0s',
        createTime: createTime,
        completeTime: null,
        errorMessage: null
      })

      ElMessage.success('迁移任务已创建，正在迁移中...')

      // 模拟异步迁移过程，30-100秒后更新结果
      const delay = Math.random() * 7 + 3 // 30-100秒
      setTimeout(() => {
        const isSuccess = Math.random() > 0.3
        const completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)

        // 计算实际耗时（秒）
        const actualDuration = delay
        const durationText = actualDuration.toFixed(1) + 's'

        dataMigrationStore.updateMigration(migrationId, {
          result: isSuccess ? '成功' : '失败',
          duration: durationText,
          completeTime: completeTime,
          errorMessage: isSuccess ? null : '迁移失败：目标数据源连接超时'
        })

        ElMessage.info(`迁移完成：${isSuccess ? '成功' : '失败'}`)
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
  if (result === '迁移中') return 'info'
  return 'danger'
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: '',
    source: '',
    target: '',
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
