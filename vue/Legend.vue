<template>
  <div class="legend">
    <h3>图例</h3>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #e74c3c;"></div>
      <span>动作片</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #3498db;"></div>
      <span>剧情片</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #2ecc71;"></div>
      <span>喜剧片</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #f39c12;"></div>
      <span>科幻片</span>
    </div>
    <div class="legend-item">
      <div class="legend-color" style="background-color: #9b59b6;"></div>
      <span>奇幻片</span>
    </div>
        <div class="legend-item">
      <div class="legend-color" style="background-color: #1abc9c;"></div>
      <span>动画片</span>
    </div>
  </div>
</template>

<style scoped>
.legend {
  position: absolute;
  bottom: 20px;
  left: 10px;
  background-color: rgba(10, 15, 25, 0.85); /* 深色背景 */
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 247, 255, 0.5); /* 青色边框 */
  box-shadow: 
    0 0 15px rgba(0, 247, 255, 0.3), /* 外发光效果 */
    0 2px 10px rgba(0, 0, 0, 0.5); /* 常规阴影 */
  z-index: 1000;
  color: #e0e0e0; /* 浅灰色文字 */
  font-family: 'Arial', sans-serif;
  backdrop-filter: blur(5px); /* 背景模糊效果 */
}

.legend-title {
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  color: #00f7ff; /* 青色标题 */
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.7); /* 文字发光 */
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
  padding-bottom: 0.3rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
  transition: transform 0.2s ease;
}

.legend-item:hover {
  transform: translateX(5px);
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 3px; /* 改为略带棱角 */
  margin-right: 0.7rem;
  box-shadow: 0 0 8px currentColor; /* 使用当前文字颜色的发光效果 */
  position: relative;
}

.legend-color::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 3px;
  background: linear-gradient(
    135deg, 
    rgba(255,255,255,0.2) 0%, 
    transparent 30%, 
    rgba(0,0,0,0.2) 100%
  ); /* 添加光泽效果 */
}

.legend-label {
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 机甲科技风格特定颜色示例 */
.legend-color.tech-blue {
  background-color: #0066ff;
  box-shadow: 0 0 10px #0066ff;
}

.legend-color.tech-red {
  background-color: #ff0033;
  box-shadow: 0 0 10px #ff0033;
}

.legend-color.tech-green {
  background-color: #00ff99;
  box-shadow: 0 0 10px #00ff99;
}

.legend-color.tech-purple {
  background-color: #9900ff;
  box-shadow: 0 0 10px #9900ff;
}

.legend-color.tech-orange {
  background-color: #ff6600;
  box-shadow: 0 0 10px #ff6600;
}

@media (max-width: 768px) {
  .legend {
    position: relative;
    margin: 10px;
    max-width: none;
    bottom: auto;
    left: auto;
  }
}
</style>