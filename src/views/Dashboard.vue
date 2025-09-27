<template>
  <PageContainer title="管理系统仪表板">

    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon user-icon">
            <el-icon>
              <User/>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ userCount }}</h3>
            <p>用户总数</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon permission-icon">
            <el-icon>
              <Lock/>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ permissionCount }}</h3>
            <p>权限总数</p>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon datasource-icon">
            <el-icon>
              <Wallet/>
            </el-icon>
          </div>
          <div class="stat-info">
            <h3>{{ dataSourceCount }}</h3>
            <p>数据源总数</p>
          </div>
        </div>
      </el-card>
    </div>

    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="action-cards">
        <el-card class="action-card" @click="$router.push('/users')">
          <div class="action-content">
            <el-icon>
              <User/>
            </el-icon>
            <h3>用户管理</h3>
            <p>管理系统用户</p>
          </div>
        </el-card>

        <el-card class="action-card" @click="$router.push('/permissions')">
          <div class="action-content">
            <el-icon>
              <Lock/>
            </el-icon>
            <h3>权限管理</h3>
            <p>管理系统权限</p>
          </div>
        </el-card>

        <el-card class="action-card" @click="$router.push('/datasources')">
          <div class="action-content">
            <el-icon>
              <Wallet/>
            </el-icon>
            <h3>数据源管理</h3>
            <p>管理数据源连接</p>
          </div>
        </el-card>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import {computed} from 'vue'
import {User, Lock, Wallet} from '@element-plus/icons-vue'
import PageContainer from '../components/PageContainer.vue'
import {userStore, permissionStore, dataSourceStore} from '../store'

const userCount = computed(() => userStore.users.length)
const permissionCount = computed(() => permissionStore.permissions.length)
const dataSourceCount = computed(() => dataSourceStore.dataSources.length)
</script>

<style scoped>
.stats-cards,
.action-cards {
  display: grid;
  grid-template-columns: repeat(3, 200px); /* 固定 3 列，每列 200px */
  gap: 16px;
  justify-items: center; /* 居中卡片 */
}

.stat-card,
.action-card {
  width: 200px;
  height: 200px;
  border-radius: 0; /* 方方正正 */
  border: 1px solid #e5e7eb;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s, transform 0.2s;
}

/* 鼠标悬停效果 */
.action-card:hover,
.stat-card:hover {
  background-color: #f3f4f6;
  transform: translateY(-3px);
}

/* 内容垂直排列 */
.stat-content,
.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

/* 图标区域 */
.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  border-radius: 4px;
}

.user-icon {
  background-color: #4f46e5;
}

.permission-icon {
  background-color: #ec4899;
}

.datasource-icon {
  background-color: #0ea5e9;
}

.stat-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.stat-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 快速操作图标 */
.action-content .el-icon {
  font-size: 36px;
  color: #2563eb;
  margin-bottom: 10px;
}

.action-content h3 {
  margin: 0 0 8px 0;
  color: #111827;
  font-weight: 600;
}

.action-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}
</style>


