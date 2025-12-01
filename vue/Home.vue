<template>
  <div class="home-page page-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">探索电影背后的真实场景</h1>
        <p class="hero-subtitle">从银幕到现实，发现中国电影取景地的魅力与故事</p>
        <div class="hero-actions">
          <router-link to="/moviemap" class="btn btn-primary">
            <i class="fa fa-map-marker"></i>
            开始探索
          </router-link>
          <router-link to="/library" class="btn btn-secondary">
            <i class="fa fa-play-circle"></i>
            浏览电影
          </router-link>
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">平台特色</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa fa-map-o"></i>
            </div>
            <h3>交互式地图</h3>
            <p>直观的地图界面，轻松探索电影取景地分布</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa fa-filter"></i>
            </div>
            <h3>智能筛选</h3>
            <p>按类型、地区、电影名称精准筛选取景地</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa fa-photo"></i>
            </div>
            <h3>场景对比</h3>
            <p>电影场景与现实取景地的视觉对比</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fa fa-share-alt"></i>
            </div>
            <h3>社区分享</h3>
            <p>与影迷交流分享观影体验和旅行故事</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.locations }}</div>
            <div class="stat-label">取景地点</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.movies }}</div>
            <div class="stat-label">电影作品</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.genres }}</div>
            <div class="stat-label">电影类型</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.regions }}</div>
            <div class="stat-label">覆盖地区</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新动态 -->
    <section class="news-section">
      <div class="container">
        <h2 class="section-title">最新动态</h2>
        <div class="news-grid">
          <div class="news-card">
            <div class="news-image">
              <img src="https://via.placeholder.com/400x250/3498db/ffffff?text=新电影上映" alt="新电影">
            </div>
            <div class="news-content">
              <h3>《罗小黑战记2》取景地揭秘</h3>
              <p class="news-date">2024年1月15日</p>
              <p>探索这部热门动画电影在苍南渔寮沙滩的真实取景地...</p>
              <a href="#" class="news-link">阅读更多</a>
            </div>
          </div>
          <div class="news-card">
            <div class="news-image">
              <img src="https://via.placeholder.com/400x250/e74c3c/ffffff?text=取景地推荐" alt="取景地">
            </div>
            <div class="news-content">
              <h3>十大必去电影取景地</h3>
              <p class="news-date">2024年1月10日</p>
              <p>从故宫到张家界，这些经典电影取景地值得你亲自探访...</p>
              <a href="#" class="news-link">阅读更多</a>
            </div>
          </div>
          <div class="news-card">
            <div class="news-image">
              <img src="https://via.placeholder.com/400x250/2ecc71/ffffff?text=社区活动" alt="社区">
            </div>
            <div class="news-content">
              <h3>电影取景地摄影大赛</h3>
              <p class="news-date">2024年1月5日</p>
              <p>分享你在电影取景地拍摄的照片，赢取精美电影周边...</p>
              <a href="#" class="news-link">阅读更多</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 新增：合作单位 -->
    <section class="partners-section">
      <div class="container">
        <h2 class="section-title">合作单位</h2>
        <p class="partners-subtitle">与国内领先的视频平台合作，提供丰富的电影资源和取景地信息</p>
        <div class="partners-grid">
          <a href="https://www.iqiyi.com/" target="_blank" class="partner-card">
            <div class="partner-logo">
              <i class="fa fa-play-circle"></i>
            </div>
            <h3>爱奇艺</h3>
            <p>领先的视频娱乐平台</p>
          </a>
<a href="https://v.qq.com" target="_blank" class="partner-card">
  <div class="partner-logo">
    <i class="fa fa-television"></i>
  </div>
  <h3>腾讯视频</h3>
  <p>海量高清影视内容</p>
</a>
           <a href="https://www.youku.com/ku/webhome" target="_blank" class="partner-card">
            <div class="partner-logo">
              <i class="fa fa-video-camera"></i>
            </div>
            <h3>优酷视频</h3>
            <p>专业视频内容平台</p>
          </a>
          <a href="https://www.mgtv.com/" target="_blank" class="partner-card">
            <div class="partner-logo">
              <i class="fa fa-film"></i>
            </div>
            <h3>芒果TV</h3>
            <p>青春时尚娱乐平台</p>
          </a>
          <a href="https://www.bilibili.com/" target="_blank" class="partner-card">
            <div class="partner-logo">
              <i class="fa fa-youtube-play"></i>
            </div>
            <h3>哔哩哔哩</h3>
            <p>年轻人文化社区</p>
          </a>
          <a href="https://m.ixigua.com/video/404" target="_blank" class="partner-card">
            <div class="partner-logo">
              <i class="fa fa-play"></i>
            </div>
            <h3>西瓜视频</h3>
            <p>个性化推荐平台</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { movieLocationsData } from '../movieLocations'

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        locations: 0,
        movies: 0,
        genres: 0,
        regions: 0
      }
    }
  },
  mounted() {
    this.calculateStats()
  },
  methods: {
    calculateStats() {
      const allMovies = new Set()
      const allGenres = new Set()
      const allRegions = new Set()
      
      movieLocationsData.forEach(location => {
        location.movies.forEach(movie => allMovies.add(movie))
        allGenres.add(location.genre)
        allRegions.add(location.region)
      })
      
      this.stats = {
        locations: movieLocationsData.length,
        movies: allMovies.size,
        genres: allGenres.size,
        regions: allRegions.size
      }
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #0a0f19 0%, #1a1f2e 100%);
  color: #e0e0e0;
  font-family: 'Arial', sans-serif;
}

/* 英雄区域 - 机甲科技主题 */
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0f19 0%, #1a1f2e 30%, #2a1f3e 70%, #0a0f19 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 51, 102, 0.1) 0%, transparent 50%),
    linear-gradient(to bottom, rgba(10, 15, 25, 0.3) 0%, rgba(10, 15, 25, 0.7) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #00f7ff;
  text-shadow: 
    0 0 10px rgba(0, 247, 255, 0.5),
    2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: textGlow 3s ease-in-out infinite alternate;
}

@keyframes textGlow {
  from {
    text-shadow: 
      0 0 10px rgba(0, 247, 255, 0.5),
      2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  to {
    text-shadow: 
      0 0 15px rgba(0, 247, 255, 0.8),
      0 0 20px rgba(0, 247, 255, 0.4),
      2px 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  color: #b0b8c0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮样式 - 机甲科技主题 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  color: #0a0f19;
  box-shadow: 
    0 4px 15px rgba(0, 247, 255, 0.4),
    0 0 10px rgba(0, 247, 255, 0.2);
  border: 1px solid rgba(0, 247, 255, 0.5);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(0, 247, 255, 0.6),
    0 0 15px rgba(0, 247, 255, 0.4);
}

.btn-secondary {
  background: rgba(20, 25, 35, 0.8);
  color: #b0b8c0;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.3);
}

.btn-outline {
  background: transparent;
  color: #00f7ff;
  border: 2px solid #00f7ff;
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.2);
}

.btn-outline:hover {
  background: rgba(0, 247, 255, 0.1);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
}

/* 容器和章节标题 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #00f7ff;
  position: relative;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #00f7ff, #ff3366);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(0, 247, 255, 0.5);
}

/* 特色功能区域 */
.features-section {
  padding: 5rem 0;
  background: rgba(10, 15, 25, 0.7);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: rgba(20, 25, 35, 0.8);
  border-radius: 12px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(0, 247, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 247, 255, 0.2);
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  background: linear-gradient(135deg, 
    rgba(0, 247, 255, 0.2) 0%, 
    transparent 30%, 
    transparent 70%, 
    rgba(255, 51, 102, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(0, 247, 255, 0.2);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0f19;
  font-size: 2rem;
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.5);
  position: relative;
  z-index: 2;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00f7ff;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.3);
  position: relative;
  z-index: 2;
}

.feature-card p {
  color: #b0b8c0;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* 数据统计区域 - 机甲科技主题 */
.stats-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, rgba(0, 247, 255, 0.1) 0%, rgba(255, 51, 102, 0.1) 100%);
  color: white;
  border-top: 1px solid rgba(0, 247, 255, 0.3);
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(20, 25, 35, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(0, 247, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.1);
  backdrop-filter: blur(5px);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #00f7ff;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
}

.stat-label {
  font-size: 1.1rem;
  color: #b0b8c0;
}

/* 最新动态区域 */
.news-section {
  padding: 5rem 0;
  background: rgba(10, 15, 25, 0.5);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.news-card {
  background: rgba(20, 25, 35, 0.8);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 5px 20px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(0, 247, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 247, 255, 0.2);
  backdrop-filter: blur(5px);
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 15px 30px rgba(0, 0, 0, 0.4),
    0 0 15px rgba(0, 247, 255, 0.2);
}

.news-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.news-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 70%, rgba(10, 15, 25, 0.8) 100%);
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 1.5rem;
}

.news-content h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #00f7ff;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.3);
}

.news-date {
  color: #8d9ba8;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.news-content p {
  color: #b0b8c0;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.news-link {
  color: #00f7ff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.news-link:hover {
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.5);
}

/* 新增：合作单位区域 */
.partners-section {
  padding: 5rem 0;
  background: rgba(10, 15, 25, 0.7);
  border-top: 1px solid rgba(0, 247, 255, 0.2);
}

.partners-subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #b0b8c0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.partner-card {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: rgba(20, 25, 35, 0.8);
  border-radius: 12px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(0, 247, 255, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(0, 247, 255, 0.2);
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.partner-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  background: linear-gradient(135deg, 
    rgba(0, 247, 255, 0.2) 0%, 
    transparent 30%, 
    transparent 70%, 
    rgba(255, 51, 102, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.partner-card:hover {
  transform: translateY(-10px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(0, 247, 255, 0.2);
}

.partner-card:hover::before {
  opacity: 1;
}

.partner-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #ff3366, #ff6699);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.5);
  position: relative;
  z-index: 2;
}

.partner-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ff3366;
  text-shadow: 0 0 5px rgba(255, 51, 102, 0.3);
  position: relative;
  z-index: 2;
}

.partner-card p {
  color: #b0b8c0;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
    justify-content: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .news-grid, .partners-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card, .stat-item, .news-card, .partner-card {
    margin: 0 1rem;
  }
}
</style>