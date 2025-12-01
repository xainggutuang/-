<template>
  <div class="movie-map-page">
    <div class="page-header">
      <h1>电影取景地地图</h1>
      <p>探索电影拍摄的真实地点</p>
    </div>
    <div class="map-layout">
      <!-- 筛选面板 -->
      <div class="filters-panel">
        <h2>筛选条件</h2> 
        
        <div class="filter-group">
          <h3>地图视图</h3>
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: !showHeatmap }"
              @click="showHeatmap = false"
            >
              普通地图
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: showHeatmap }"
              @click="showHeatmap = true"
            >
              热力图
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <h3>电影类型</h3>
          <div class="filter-options">
            <button 
              v-for="genre in genres" 
              :key="genre.value"
              class="filter-btn" 
              :class="{ active: filters.genre === genre.value }"
              @click="toggleGenreFilter(genre.value)"
            >
              {{ genre.label }}
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <h3>地区</h3>
          <div class="filter-options">
            <button 
              v-for="region in regions" 
              :key="region.value"
              class="filter-btn" 
              :class="{ active: filters.region === region.value }"
              @click="updateFilter('region', region.value)"
            >
              {{ region.label }}
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <h3>搜索</h3>
          <input 
            type="text" 
            class="search-box" 
            v-model="filters.search" 
            placeholder="搜索电影名称或地点..."
          >
        </div>
        
        <button class="reset-btn" @click="resetFilters">重置筛选</button>
        
        <!-- 统计信息 -->
        <div class="stats-panel">
          <h3>统计信息</h3>
          <div class="stats-item">
            <span>总取景地:</span>
            <span>{{ stats.total }}</span>
          </div>
          <div class="stats-item">
            <span>当前显示:</span>
            <span>{{ stats.visible }}</span>
          </div>
          <div class="stats-item">
            <span>当前视图:</span>
            <span>{{ showHeatmap ? '热力图' : '普通地图' }}</span>
          </div>
          <div class="stats-item" v-if="filters.genre !== 'all'">
            <span>选中类型:</span>
            <span>{{ getCurrentGenreName() }}</span>
          </div>
        </div>

        <!-- 新增：电影类型分布图表 -->
        <MovieGenreChart 
          :locations="filteredLocations" 
          :height="320"
          :selectedGenre="filters.genre"
          @genreSelect="handleGenreSelect"
        />
      </div>
      
      <!-- 地图区域 -->
      <div class="map-area">
        <!-- 条件渲染：普通地图或热力图 -->
        <MapContainer 
          v-if="!showHeatmap" 
          :locations="filteredLocations" 
        />
        <HeatmapLayer 
          v-else 
          :locations="filteredLocations" 
        />
        
        <!-- 图例：只在普通地图模式下显示 -->
        <div class="legend" v-if="!showHeatmap">
          <h3>图例</h3>
          <div 
            v-for="genre in genres.filter(g => g.value !== 'all')" 
            :key="genre.value"
            class="legend-item"
          >
            <div class="legend-color" :style="{ backgroundColor: genreColors[genre.value] }"></div>
            <span>{{ genre.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import MapContainer from './MapContainer.vue'
import HeatmapLayer from './HeatmapLayer.vue'
import MovieGenreChart from './MovieGenreChart.vue'
import { movieLocationsData, genreColors } from '../movieLocations'

export default {
  name: 'MovieMap',
  components: {
    MapContainer,
    HeatmapLayer,
    MovieGenreChart
  },
  setup() {
    // 响应式变量 - 控制显示热力图还是普通地图
    const showHeatmap = ref(false)
    
    // 电影类型选项
    const genres = [
      { value: 'all', label: '全部' },
      { value: 'action', label: '动作' },
      { value: 'drama', label: '剧情' },
      { value: 'comedy', label: '喜剧' },
      { value: 'sci-fi', label: '科幻' },
      { value: 'fantasy', label: '奇幻' },
      { value: 'animation', label: '动漫' },
      { value: 'historical', label: '历史' },
      { value: 'mystery', label: '悬疑' },
      { value: 'horror', label: '恐怖' },
      { value: 'crime', label: '犯罪' },
      { value: 'family', label: '家庭' }
    ]

    // 地区选项
    const regions = [
      { value: 'all', label: '全部' },
      { value: 'north', label: '华北' },
      { value: 'east', label: '华东' },
      { value: 'south', label: '华南' },
      { value: 'west', label: '西部' }
    ]

    // 电影类型名称映射
    const genreNames = {
      'action': '动作',
      'drama': '剧情',
      'comedy': '喜剧',
      'sci-fi': '科幻',
      'fantasy': '奇幻',
      'animation': '动漫',
      'historical': '历史',
      'mystery': '悬疑',
      'horror': '恐怖',
      'crime': '犯罪',
      'family': '家庭'
    }

    // 使用导入的电影取景地数据
    const movieLocations = ref(movieLocationsData)
    
    // 筛选条件
    const filters = reactive({
      genre: 'all',
      region: 'all',
      search: ''
    })
    
    // 筛选后的取景地
    const filteredLocations = computed(() => {
      console.log('开始筛选位置数据...')
      const filtered = movieLocations.value.filter(location => {
        const genreMatch = filters.genre === 'all' || location.genre === filters.genre
        const regionMatch = filters.region === 'all' || location.region === filters.region
        const searchMatch = filters.search === '' || 
          location.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          location.movies.some(movie => 
            movie.toLowerCase().includes(filters.search.toLowerCase())
          )
        
        return genreMatch && regionMatch && searchMatch
      })
      console.log(`筛选结果: ${filtered.length} 个位置`)
      return filtered
    })

    const stats = computed(() => {
      return {
        total: movieLocations.value.length,
        visible: filteredLocations.value.length,
        genres: new Set(filteredLocations.value.map(l => l.genre)).size
      }
    })
    
    // 切换类型筛选（支持点击取消）
    const toggleGenreFilter = (genreValue) => {
      if (filters.genre === genreValue) {
        // 如果点击的是当前已选中的类型，则取消选择
        filters.genre = 'all'
      } else {
        // 否则选择新类型
        filters.genre = genreValue
      }
      console.log(`切换类型筛选: ${filters.genre}`)
    }
    
    // 处理图表类型选择
    const handleGenreSelect = (genre) => {
      filters.genre = genre
      console.log(`图表选择类型: ${genre}`)
    }
    
    // 更新筛选条件（用于地区和搜索）
    const updateFilter = (type, value) => {
      filters[type] = value
      console.log(`更新筛选条件: ${type} = ${value}`)
    }
    
    // 重置筛选条件
    const resetFilters = () => {
      filters.genre = 'all'
      filters.region = 'all'
      filters.search = ''
      console.log('重置所有筛选条件')
    }
    
    // 获取当前选中类型的名称
    const getCurrentGenreName = () => {
      return genreNames[filters.genre] || filters.genre
    }

    onMounted(() => {
      console.log('MovieMap 组件已挂载')
      console.log('初始位置数据:', movieLocations.value)
      console.log('热力图显示状态:', showHeatmap.value)
    })
    
    return {
      movieLocations,
      filters,
      filteredLocations,
      stats,
      genres,
      regions,
      genreColors,
      showHeatmap,
      toggleGenreFilter,
      handleGenreSelect,
      updateFilter,
      resetFilters,
      getCurrentGenreName
    }
  }
}
</script>

<!-- 保持您原有的所有样式不变 -->
 <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Exo 2', 'Segoe UI', sans-serif;
        }

        body {
            background: #0a0a12;
            color: #e0e0ff;
            overflow: hidden;
        }

        .movie-map-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background: #0a0a12;
        }

        /* 机甲风格装饰元素 */
        .mecha-decoration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .grid-line {
            position: absolute;
            background: linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.2), transparent);
            height: 1px;
            width: 100%;
        }

        .grid-line:nth-child(2n) {
            transform: rotate(90deg);
            transform-origin: left top;
            width: 100vh;
        }

        .corner-border {
            position: absolute;
            width: 40px;
            height: 40px;
            border-color: #00ccff;
            border-style: solid;
        }

        .corner-tl {
            top: 20px;
            left: 20px;
            border-width: 3px 0 0 3px;
        }

        .corner-tr {
            top: 20px;
            right: 20px;
            border-width: 3px 3px 0 0;
        }

        .corner-bl {
            bottom: 20px;
            left: 20px;
            border-width: 0 0 3px 3px;
        }

        .corner-br {
            bottom: 20px;
            right: 20px;
            border-width: 0 3px 3px 0;
        }

        .scan-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, transparent, #00ccff, transparent);
            box-shadow: 0 0 10px #00ccff;
            animation: scan 8s linear infinite;
            opacity: 0.6;
        }

        @keyframes scan {
            0% { top: 0; }
            100% { top: 100%; }
        }

        /* 页面头部 */
        .page-header {
            flex-shrink: 0;
            background: linear-gradient(135deg, #001122, #003366, #0066cc);
            color: white;
            padding: 1.5rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
            border-bottom: 2px solid #00ccff;
            box-shadow: 0 0 20px rgba(0, 200, 255, 0.4);
        }

        .page-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: translateX(-100%);
            animation: shine 3s infinite;
        }

        @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .page-header h1 {
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 10px #00ccff;
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 2px;
        }

        .page-header p {
            font-size: 1.1rem;
            opacity: 0.9;
            color: #a0e0ff;
        }

        .map-layout {
            flex: 1;
            display: flex;
            min-height: 0;
            overflow: hidden;
            background: #0a0a12;
        }

        /* 筛选面板样式 - 机甲主题 */
        .filters-panel {
            width: 320px;
            background-color: rgba(10, 15, 30, 0.9);
            padding: 1.5rem;
            border-right: 1px solid #00aaff;
            overflow-y: auto;
            flex-shrink: 0;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.2);
            backdrop-filter: blur(5px);
        }

        .filters-panel h2 {
            margin-bottom: 1.5rem;
            color: #00ccff;
            border-bottom: 2px solid #00aaff;
            padding-bottom: 0.5rem;
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 8px rgba(0, 200, 255, 0.5);
        }

        .filter-group {
            margin-bottom: 1.5rem;
        }

        .filter-group h3 {
            margin-bottom: 0.8rem;
            color: #a0e0ff;
            font-size: 1.1rem;
        }

        /* 视图切换按钮 */
        .view-toggle {
            display: flex;
            background: rgba(0, 30, 60, 0.7);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #00aaff;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.2);
        }

        .toggle-btn {
            flex: 1;
            padding: 0.5rem 1rem;
            background: transparent;
            border: none;
            color: #a0e0ff;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            position: relative;
            overflow: hidden;
        }

        .toggle-btn.active {
            background: linear-gradient(135deg, #0066cc, #00aaff);
            color: white;
            box-shadow: inset 0 0 10px rgba(0, 200, 255, 0.5);
        }

        .toggle-btn:hover:not(.active) {
            background: rgba(0, 150, 255, 0.2);
            color: #00ccff;
        }

        .toggle-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .toggle-btn:hover::before {
            left: 100%;
        }

        .filter-options {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .filter-btn {
            background-color: rgba(0, 30, 60, 0.7);
            border: 1px solid #00aaff;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            color: #a0e0ff;
        }

        .filter-btn:hover {
            background-color: rgba(0, 150, 255, 0.3);
            color: #00ccff;
            box-shadow: 0 0 8px rgba(0, 200, 255, 0.4);
        }

        .filter-btn.active {
            background: linear-gradient(135deg, #0066cc, #00aaff);
            color: white;
            border-color: #00ccff;
            box-shadow: 0 0 12px rgba(0, 200, 255, 0.6);
        }

        .search-box {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #00aaff;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 1rem;
            background: rgba(0, 30, 60, 0.7);
            color: #e0e0ff;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .search-box:focus {
            outline: none;
            border-color: #00ccff;
            box-shadow: 0 0 0 2px rgba(0, 200, 255, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .reset-btn {
            width: 100%;
            padding: 0.8rem;
            background: linear-gradient(135deg, #cc0066, #ff3366);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
            margin-bottom: 2rem;
            box-shadow: 0 0 15px rgba(255, 51, 102, 0.4);
            font-weight: bold;
            letter-spacing: 1px;
        }

        .reset-btn:hover {
            background: linear-gradient(135deg, #ff3366, #ff0044);
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(255, 51, 102, 0.6);
        }

        /* 统计面板样式 */
        .stats-panel {
            background-color: rgba(10, 15, 30, 0.8);
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.2);
            border: 1px solid #00aaff;
            backdrop-filter: blur(5px);
        }

        .stats-panel h3 {
            margin-bottom: 0.5rem;
            color: #00ccff;
            font-family: 'Orbitron', sans-serif;
        }

        .stats-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.3rem;
            font-size: 0.9rem;
            color: #a0e0ff;
        }

        .stats-value {
            color: #00ffaa;
            text-shadow: 0 0 5px #00ffaa;
        }

        /* 地图区域 */
        .map-area {
            flex: 1;
            position: relative;
            min-height: 0;
            background: #0a0a12;
        }

        #map {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #0a0a12;
            filter: contrast(1.2) saturate(1.1);
        }

        /* 图例样式 - 机甲主题 */
        .legend {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background-color: rgba(10, 15, 30, 0.9);
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.3);
            z-index: 1000;
            border: 1px solid #00aaff;
            backdrop-filter: blur(5px);
        }

        .legend h3 {
            margin-bottom: 0.8rem;
            color: #00ccff;
            font-size: 1rem;
            font-family: 'Orbitron', sans-serif;
            text-shadow: 0 0 8px rgba(0, 200, 255, 0.5);
        }

        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 0.5rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 8px rgba(0, 200, 255, 0.5);
        }

        /* 状态指示器 */
        .status-indicator {
            position: absolute;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            gap: 10px;
        }

        .status-light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #00ff00;
            box-shadow: 0 0 8px #00ff00;
            animation: pulse 2s infinite;
        }

        .status-light.yellow {
            background: #ffff00;
            box-shadow: 0 0 8px #ffff00;
            animation-delay: 0.5s;
        }

        .status-light.blue {
            background: #00ccff;
            box-shadow: 0 0 8px #00ccff;
            animation-delay: 1s;
        }

        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }

        /* 地图控件样式 */
        .map-controls {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .control-btn {
            background: rgba(10, 15, 30, 0.9);
            border: 1px solid #00aaff;
            color: #a0e0ff;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.2);
            backdrop-filter: blur(5px);
            font-size: 0.9rem;
        }

        .control-btn:hover {
            background: rgba(0, 150, 255, 0.3);
            color: #00ccff;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.4);
        }

        .control-btn.active {
            background: linear-gradient(135deg, #0066cc, #00aaff);
            color: white;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.6);
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .movie-map-page {
                height: auto;
                min-height: 100vh;
                overflow-y: auto;
            }
            
            .map-layout {
                flex-direction: column;
            }
            
            .filters-panel {
                width: 100%;
                height: auto;
                max-height: 40vh;
                border-right: none;
                border-bottom: 1px solid #00aaff;
            }
            
            .map-area {
                height: 60vh;
                min-height: 400px;
            }
            
            .legend {
                position: relative;
                margin: 10px;
                max-width: none;
            }
            
            .page-header h1 {
                font-size: 1.8rem;
            }
        }
        .ol-yinyan{
          bottom:auto;
          right:auto;
          top:0;
          left:0;
        }
        .ol-yinyan-waikuang{
          border:1px solid black;
        }
        .ol-yinyan-map{
          border:none;
          width:300px;
        }
        .ol-yinyan-button{
          bottom:auto;
          right:auto;
          top:1px;
          left:1px;
        }
    </style>