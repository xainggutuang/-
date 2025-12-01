<template>
  <div class="stats-panel">
    <h3>统计信息</h3>
    <div class="stats-item">
      <span>总取景地:</span>
      <span>{{ total }}</span>
    </div>
    <div class="stats-item">
      <span>当前显示:</span>
      <span>{{ visible }}</span>
    </div>
    <div class="stats-item">
      <span>电影类型:</span>
      <span>{{ genres }}</span>
    </div>
  </div>
</template>

<style scoped>
.stats-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(10, 15, 25, 0.85); /* 深色背景 */
  padding: 1.2rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 247, 255, 0.5); /* 青色边框 */
  box-shadow: 
    0 0 15px rgba(0, 247, 255, 0.3), /* 外发光效果 */
    0 2px 10px rgba(0, 0, 0, 0.5); /* 常规阴影 */
  z-index: 1000;
  max-width: 250px;
  color: #e0e0e0; /* 浅灰色文字 */
  font-family: 'Arial', sans-serif;
  backdrop-filter: blur(5px); /* 背景模糊效果 */
}

.stats-panel h3 {
  margin-bottom: 0.8rem;
  color: #00f7ff; /* 青色标题 */
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.7); /* 文字发光 */
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
  padding-bottom: 0.3rem;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.stats-item:hover {
  background-color: rgba(0, 247, 255, 0.1);
  padding-left: 0.5rem;
  border-radius: 4px;
}

.stats-label {
  color: #b0b0b0;
  font-weight: 500;
}

.stats-value {
  color: #00f7ff; /* 青色数值 */
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
  position: relative;
}

/* 添加数据增长动画效果 */
@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.stats-value::after {
  content: '';
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #00f7ff;
  border-radius: 50%;
  box-shadow: 0 0 8px #00f7ff;
  animation: pulse 2s infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-panel {
    position: relative;
    margin: 10px;
    max-width: none;
    top: auto;
    right: auto;
  }
}
</style>