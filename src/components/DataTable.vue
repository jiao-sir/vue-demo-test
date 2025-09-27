<template>
  <div class="data-table">
    <!-- 搜索和操作栏 -->
    <div class="table-header">
      <div class="search-box">
        <el-input
          v-model="searchText"
          placeholder="请输入搜索关键词"
          style="width: 300px"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
      <div class="action-buttons" v-if="showAdd">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="filteredData"
      style="width: 100%"
      border
      stripe
      @row-click="handleRowClick"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
      >
        <template #default="scope" v-if="column.prop === 'actions'">
          <div class="action-buttons">
            <el-button
              v-if="showEditDelete"
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="showEditDelete"
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
            <!-- 自定义操作按钮 -->
            <template v-for="action in customActions" :key="action.key">
              <el-button
                :type="action.type || 'default'"
                size="small"
                @click="handleCustomAction(action.key, scope.row)"
              >
                {{ action.label }}
              </el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="filteredData.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  customActions: {
    type: Array,
    default: () => []
  },
  showEditDelete: {
    type: Boolean,
    default: true
  },
  showAdd: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['add', 'edit', 'delete', 'custom-action', 'row-click'])

const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤数据
const filteredData = computed(() => {
  if (!searchText.value) {
    return props.data
  }
  
  return props.data.filter(item => {
    return Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchText.value.toLowerCase())
    )
  })
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 操作处理
const handleAdd = () => {
  emit('add')
}

const handleEdit = (row) => {
  emit('edit', row)
}

const handleDelete = (row) => {
  emit('delete', row)
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleCustomAction = (actionKey, row) => {
  emit('custom-action', actionKey, row)
}

const handleRowClick = (row) => {
  emit('row-click', row)
}
</script>

<style scoped>
.data-table {
  width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  align-items: center;
}
</style>
