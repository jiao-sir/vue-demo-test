<template>
  <PageContainer title="数据管理仪表板">
    <!-- 统计卡片区域 -->
    <div class="stats-section">
      <h2 class="section-title">系统统计概览</h2>
      <div class="stats-grid">
        <!-- 用户统计 -->
        <el-card class="stat-card user-card">
          <div class="stat-header">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-title">用户统计</div>
          </div>
          <div class="stat-content">
            <div class="stat-item">
              <div class="stat-number">{{ userCount }}</div>
              <div class="stat-label">用户总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number online">{{ onlineUserCount }}</div>
              <div class="stat-label">在线用户</div>
            </div>
          </div>
        </el-card>

        <!-- 数据源统计 -->
        <el-card class="stat-card datasource-card">
          <div class="stat-header">
            <div class="stat-icon datasource-icon">
              <el-icon><Wallet /></el-icon>
            </div>
            <div class="stat-title">数据源统计</div>
          </div>
          <div class="stat-content">
            <div class="stat-item">
              <div class="stat-number">{{ dataSourceCount }}</div>
              <div class="stat-label">数据源总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number active">{{ activeDataSourceCount }}</div>
              <div class="stat-label">活跃数据源</div>
            </div>
          </div>
        </el-card>

        <!-- 数据校验统计 -->
        <el-card class="stat-card validation-card">
          <div class="stat-header">
            <div class="stat-icon validation-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-title">数据校验统计</div>
          </div>
          <div class="stat-content">
            <div class="stat-item">
              <div class="stat-number">{{ validationTotal }}</div>
              <div class="stat-label">校验总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number success">{{ validationSuccess }}</div>
              <div class="stat-label">成功数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number error">{{ validationFailed }}</div>
              <div class="stat-label">失败数量</div>
            </div>
          </div>
        </el-card>

        <!-- 数据迁移统计 -->
        <el-card class="stat-card migration-card">
          <div class="stat-header">
            <div class="stat-icon migration-icon">
              <el-icon><Upload /></el-icon>
            </div>
            <div class="stat-title">数据迁移统计</div>
          </div>
          <div class="stat-content">
            <div class="stat-item">
              <div class="stat-number">{{ migrationTotal }}</div>
              <div class="stat-label">迁移总数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number success">{{ migrationSuccess }}</div>
              <div class="stat-label">成功数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number error">{{ migrationFailed }}</div>
              <div class="stat-label">失败数量</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="actions-section">
      <h2 class="section-title">快速操作</h2>
      <div class="actions-grid">
        <el-card class="action-card" @click="$router.push('/users')">
          <div class="action-content">
            <el-icon class="action-icon"><User /></el-icon>
            <h3>用户管理</h3>
            <p>管理系统用户</p>
          </div>
        </el-card>

        <el-card class="action-card" @click="$router.push('/permissions')">
          <div class="action-content">
            <el-icon class="action-icon"><Lock /></el-icon>
            <h3>权限管理</h3>
            <p>管理系统权限</p>
          </div>
        </el-card>

        <el-card class="action-card" @click="$router.push('/datasources')">
          <div class="action-content">
            <el-icon class="action-icon"><Wallet /></el-icon>
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
import {User, Lock, Wallet, Check, Upload} from '@element-plus/icons-vue'
import PageContainer from '../components/PageContainer.vue'
import {userStore, dataSourceStore, dataValidationStore, dataMigrationStore} from '../store'

// 用户统计
const userCount = computed(() => userStore.users.length)
const onlineUserCount = computed(() => userStore.users.filter(user => user.isOnline).length)

// 数据源统计
const dataSourceCount = computed(() => dataSourceStore.dataSources.length)
const activeDataSourceCount = computed(() => dataSourceStore.dataSources.filter(ds => ds.status === '连接正常').length)

// 数据校验统计
const validationTotal = computed(() => dataValidationStore.validations.length)
const validationSuccess = computed(() => dataValidationStore.validations.filter(v => v.status === '成功').length)
const validationFailed = computed(() => dataValidationStore.validations.filter(v => v.status === '失败').length)

// 数据迁移统计
const migrationTotal = computed(() => dataMigrationStore.migrations.length)
const migrationSuccess = computed(() => dataMigrationStore.migrations.filter(m => m.status === '成功').length)
const migrationFailed = computed(() => dataMigrationStore.migrations.filter(m => m.status === '失败').length)
</script>

<style scoped>
/* 区域标题 */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

/* 统计区域 */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* 统计卡片 */
.stat-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* 卡片头部 */
.stat-header {
  display: flex;
  align-items: center;
  padding: 20px 20px 15px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #f1f5f9;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-icon {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.datasource-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.validation-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.migration-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

/* 卡片内容 */
.stat-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-number.online {
  color: #10b981;
}

.stat-number.active {
  color: #0ea5e9;
}

.stat-number.success {
  color: #10b981;
}

.stat-number.error {
  color: #ef4444;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 快速操作区域 */
.actions-section {
  margin-top: 40px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.action-content {
  padding: 30px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.action-icon {
  font-size: 48px;
  color: #3b82f6;
  margin-bottom: 10px;
}

.action-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.action-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-header {
    padding: 15px;
  }
  
  .stat-content {
    padding: 15px;
  }
  
  .action-content {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 18px;
  }
  
  .stat-title {
    font-size: 14px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .action-content h3 {
    font-size: 16px;
  }
}
</style>


