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
  height: 100vh;
  width: 100%;
  min-height: 100vh;
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
  height: calc(100vh - 80px); /* 减去header高度 */
  min-height: 0; /* 防止flex子元素溢出 */
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-header {
    padding: 20px 20px 0 20px;
  }
  
  .page-content {
    padding: 20px;
  }
}

@media (max-width: 1024px) {
  .page-header {
    padding: 18px 18px 0 18px;
    min-height: 70px;
  }
  
  .page-content {
    padding: 18px;
    height: calc(100vh - 70px);
  }
  
  .page-title {
    font-size: 22px;
  }
}

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
    height: calc(100vh - 100px);
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 12px;
    gap: 12px;
  }
  
  .page-content {
    padding: 12px;
    height: calc(100vh - 80px);
  }
  
  .page-title {
    font-size: 18px;
    line-height: 24px;
  }
  
  .page-actions {
    gap: 8px;
  }
}

@media (max-width: 320px) {
  .page-header {
    padding: 8px;
  }
  
  .page-content {
    padding: 8px;
  }
  
  .page-title {
    font-size: 16px;
  }
}
</style>
