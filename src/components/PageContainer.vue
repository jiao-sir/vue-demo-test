<template>
  <div class="page-container">
    <div class="page-header" v-if="title">
      <h1 class="page-title">{{ title }}</h1>
      <div class="page-actions" v-if="$slots.actions">
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #fff;
  flex-shrink: 0;
  min-height: 80px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  line-height: 32px;
}

.page-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.page-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #fafafa;
}

/* 确保内容区域有最小高度 */
.page-content {
  min-height: calc(100vh - 140px); /* 减去header高度和padding */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    min-height: auto;
    padding: 16px;
  }
  
  .page-content {
    padding: 16px;
    min-height: calc(100vh - 120px);
  }
  
  .page-title {
    font-size: 20px;
  }
}
</style>
