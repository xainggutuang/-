<template>
  <div class="heatmap-container">
    <div id="heatmap" ref="mapContainer"></div>
    
    <!-- 地图切换控件 -->
    <div class="map-style-controls">
      <button 
        v-for="style in mapStyles" 
        :key="style.id"
        class="style-btn" 
        :class="{ active: currentStyle === style.id }"
        @click="changeMapStyle(style.id)"
        :title="style.name"
      >
        {{ style.name }}
      </button>
    </div>
    
    <!-- 热力图控制面板 -->
    <div class="heatmap-controls">
      <h3>热力图控制</h3>
      
      <div class="control-group">
        <label>热力图强度</label>
        <input 
          type="range" 
          min="0.1" 
          max="2" 
          step="0.1" 
          v-model="heatmapIntensity" 
          @input="updateHeatmap"
        >
        <span>{{ heatmapIntensity }}</span>
      </div>
      
      <div class="control-group">
        <label>模糊半径</label>
        <input 
          type="range" 
          min="5" 
          max="50" 
          step="1" 
          v-model="blurRadius" 
          @input="updateHeatmap"
        >
        <span>{{ blurRadius }}</span>
      </div>
      
      <div class="control-group">
        <label>半径大小</label>
        <input 
          type="range" 
          min="5" 
          max="30" 
          step="1" 
          v-model="pointRadius" 
          @input="updateHeatmap"
        >
        <span>{{ pointRadius }}</span>
      </div>
      
      <div class="control-group">
        <label>透明度</label>
        <input 
          type="range" 
          min="0.1" 
          max="1" 
          step="0.1" 
          v-model="heatmapOpacity" 
          @input="updateHeatmap"
        >
        <span>{{ heatmapOpacity }}</span>
      </div>
      
      <div class="control-group">
        <label>颜色渐变</label>
        <select v-model="selectedGradient" @change="updateHeatmap">
          <option value="default">默认渐变</option>
          <option value="rainbow">彩虹渐变</option>
          <option value="fire">火焰渐变</option>
          <option value="ocean">海洋渐变</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showPoints" @change="togglePoints">
          显示数据点
        </label>
      </div>
      
      <button class="reset-btn" @click="resetControls">重置控制</button>
    </div>
    
    <!-- 数据统计面板 -->
    <div class="stats-panel">
      <h3>热力图统计</h3>
      <div class="stats-item">
        <span>数据点数量:</span>
        <span>{{ heatmapData.length }}</span>
      </div>
      <div class="stats-item">
        <span>最高密度:</span>
        <span>{{ maxDensity.toFixed(2) }}</span>
      </div>
      <div class="stats-item">
        <span>平均密度:</span>
        <span>{{ avgDensity.toFixed(2) }}</span>
      </div>
      <div class="stats-item">
        <span>覆盖区域:</span>
        <span>{{ coverageArea }}</span>
      </div>
    </div>

    <!-- 热力图图例 -->
    <div class="heatmap-legend">
      <h3>热力密度</h3>
      <div class="gradient-bar">
        <div class="gradient" :style="{ background: gradientStyle }"></div>
      </div>
      <div class="legend-labels">
        <span>低</span>
        <span>中</span>
        <span>高</span>
      </div>
    </div>

    <!-- 自定义版权信息 -->
    <div class="custom-attribution">
      地图数据 © 高德地图
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import { defaults as defaultControls } from 'ol/control'
import { ScaleLine } from 'ol/control'

export default {
  name: 'HeatmapLayer',
  props: {
    locations: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    // 地图相关引用
    const mapContainer = ref(null)
    let map = null
    let heatmapLayer = null
    let pointLayer = null
    let vectorSource = null
    let baseLayer = null
    
    // 地图样式配置
    const mapStyles = [
      {
        id: 'gaode',
        name: '高德地图',
        url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        attribution: '© 高德地图'
      },
      {
        id: 'gaode_satellite',
        name: '高德卫星',
        url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        attribution: '© 高德地图'
      }
    ]

    const currentStyle = ref('gaode')
    
    // 热力图控制参数
    const heatmapIntensity = ref(1.0)
    const blurRadius = ref(15)
    const pointRadius = ref(15)
    const heatmapOpacity = ref(0.7)
    const selectedGradient = ref('default')
    const showPoints = ref(false)
    
    // 颜色渐变配置
    const colorGradients = {
      default: [
        'rgba(0, 0, 255, 0)',
        'rgba(0, 255, 255, 0.5)',
        'rgba(0, 255, 0, 0.7)',
        'rgba(255, 255, 0, 0.8)',
        'rgba(255, 0, 0, 0.9)'
      ],
      rainbow: [
        'rgba(128, 0, 128, 0)',
        'rgba(0, 0, 255, 0.5)',
        'rgba(0, 255, 255, 0.6)',
        'rgba(0, 255, 0, 0.7)',
        'rgba(255, 255, 0, 0.8)',
        'rgba(255, 165, 0, 0.9)',
        'rgba(255, 0, 0, 1)'
      ],
      fire: [
        'rgba(0, 0, 0, 0)',
        'rgba(128, 0, 0, 0.5)',
        'rgba(255, 0, 0, 0.7)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(255, 255, 0, 0.9)',
        'rgba(255, 255, 255, 1)'
      ],
      ocean: [
        'rgba(0, 0, 128, 0)',
        'rgba(0, 0, 255, 0.5)',
        'rgba(0, 128, 255, 0.6)',
        'rgba(0, 255, 255, 0.7)',
        'rgba(128, 255, 255, 0.8)',
        'rgba(255, 255, 255, 0.9)'
      ]
    }
    
    // 统计数据
    const maxDensity = ref(0)
    const avgDensity = ref(0)
    const coverageArea = ref('中国')
    
    // 计算热力图图例的渐变样式
    const gradientStyle = computed(() => {
      const gradient = colorGradients[selectedGradient.value]
      return `linear-gradient(to right, ${gradient.join(', ')})`
    })
    
    // 计算位置权重
    const calculateLocationWeight = (location) => {
      let weight = 1.0
      
      if (location.movies && location.movies.length > 0) {
        weight += location.movies.length * 0.2
      }
      
      switch (location.genre) {
        case 'action':
          weight += 0.5
          break
        case 'drama':
          weight += 0.3
          break
        case 'fantasy':
          weight += 0.4
          break
        case 'sci-fi':
          weight += 0.6
          break
        default:
          weight += 0.2
      }
      
      return Math.min(weight, 3.0)
    }
    
    // 热力图数据
    const heatmapData = computed(() => {
      if (props.locations.length === 0) {
        return generateMockHeatmapData()
      }
      
      return props.locations.map(location => {
        const weight = calculateLocationWeight(location)
        return {
          location: [location.lng, location.lat],
          weight: weight,
          name: location.name,
          movies: location.movies,
          genre: location.genre
        }
      })
    })
    
    // 生成模拟数据
    const generateMockHeatmapData = () => {
      const mockData = []
      
      const majorCities = [
        { name: '北京', coords: [116.4, 39.9], weight: 2.5 },
        { name: '上海', coords: [121.47, 31.23], weight: 2.8 },
        { name: '广州', coords: [113.23, 23.16], weight: 2.2 },
        { name: '深圳', coords: [114.07, 22.62], weight: 2.4 },
        { name: '成都', coords: [104.06, 30.67], weight: 2.0 },
        { name: '重庆', coords: [106.50, 29.53], weight: 1.8 },
        { name: '杭州', coords: [120.19, 30.26], weight: 1.9 },
        { name: '西安', coords: [108.95, 34.27], weight: 1.7 },
        { name: '南京', coords: [118.78, 32.04], weight: 1.6 },
        { name: '武汉', coords: [114.31, 30.52], weight: 1.5 }
      ]
      
      majorCities.forEach(city => {
        mockData.push({
          location: city.coords,
          weight: city.weight,
          name: city.name,
          movies: ['多部电影取景地'],
          genre: 'mixed'
        })
        
        for (let i = 0; i < 5; i++) {
          const offsetLng = (Math.random() - 0.5) * 0.5
          const offsetLat = (Math.random() - 0.5) * 0.5
          const randomWeight = 0.5 + Math.random() * 1.5
          
          mockData.push({
            location: [city.coords[0] + offsetLng, city.coords[1] + offsetLat],
            weight: randomWeight,
            name: `${city.name}周边取景地`,
            movies: ['电影取景地'],
            genre: 'mixed'
          })
        }
      })
      
      return mockData
    }
    
    // 创建底图图层
    const createBaseLayer = (styleId) => {
      const style = mapStyles.find(s => s.id === styleId) || mapStyles[0]
      
      if (style.subdomains) {
        const urls = style.subdomains.map(sub => 
          style.url.replace('{s}', sub)
        )
        
        return new TileLayer({
          source: new XYZ({
            urls: urls,
            attributions: style.attribution,
            crossOrigin: 'anonymous'
          })
        })
      } else {
        return new TileLayer({
          source: new XYZ({
            url: style.url,
            attributions: style.attribution,
            crossOrigin: 'anonymous'
          })
        })
      }
    }
    
    // 切换地图样式
    const changeMapStyle = (styleId) => {
      if (!map || currentStyle.value === styleId) return
      
      currentStyle.value = styleId
      
      // 移除旧的底图图层
      map.getLayers().forEach((layer, index) => {
        if (index === 0) {
          map.removeLayer(layer)
        }
      })
      
      // 添加新的底图图层
      const newBaseLayer = createBaseLayer(styleId)
      map.getLayers().insertAt(0, newBaseLayer)
    }
    
    // 初始化地图
    const initMap = () => {
      if (!mapContainer.value) return
      
      // 创建数据源
      vectorSource = new VectorSource()
      
      // 创建底图图层
      baseLayer = createBaseLayer(currentStyle.value)
      
      // 创建热力图图层 - 确保使用正确的配置
      heatmapLayer = new Heatmap({
        source: vectorSource,
        blur: parseInt(blurRadius.value),
        radius: parseInt(pointRadius.value),
        opacity: parseFloat(heatmapOpacity.value),
        gradient: colorGradients[selectedGradient.value],
        weight: function(feature) {
          return feature.get('weight') || 1
        }
      })
      
      // 创建点图层
      pointLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new Circle({
            radius: 4,
            fill: new Fill({ color: 'rgba(255, 0, 0, 0.8)' }),
            stroke: new Stroke({ color: 'white', width: 1 })
          })
        }),
        visible: showPoints.value
      })
      
      // 创建比例尺控件
      const scaleLineControl = new ScaleLine({
        units: 'metric'
      })
      
      // 创建地图
      map = new Map({
        target: mapContainer.value,
        layers: [baseLayer, heatmapLayer, pointLayer],
        view: new View({
          center: fromLonLat([104.0, 35.0]),
          zoom: 4,
          minZoom: 3,
          maxZoom: 18
        }),
        controls: defaultControls().extend([scaleLineControl])
      })
      
      // 初始化数据
      updateHeatmapData()
      
      // 添加点击事件
      map.on('click', handleMapClick)
      
      // 确保地图正确渲染
      setTimeout(() => {
        if (map) {
          map.updateSize()
        }
      }, 100)
    }
    
    // 更新热力图数据
    const updateHeatmapData = () => {
      if (!vectorSource) return
      
      vectorSource.clear()
      
      heatmapData.value.forEach(dataPoint => {
        // 确保坐标转换正确
        const coordinates = fromLonLat(dataPoint.location)
        
        const feature = new Feature({
          geometry: new Point(coordinates),
          weight: dataPoint.weight,
          name: dataPoint.name,
          movies: dataPoint.movies,
          genre: dataPoint.genre
        })
        
        vectorSource.addFeature(feature)
      })
      
      updateStatistics()
      
      // 如果有点数据，则调整视图
      if (vectorSource.getFeatures().length > 0 && map) {
        const extent = vectorSource.getExtent()
        if (extent && extent[0] !== Infinity) {
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000
          })
        }
      }
    }
    
    // 更新统计信息
    const updateStatistics = () => {
      const weights = heatmapData.value.map(d => d.weight)
      if (weights.length > 0) {
        maxDensity.value = Math.max(...weights)
        avgDensity.value = weights.reduce((a, b) => a + b, 0) / weights.length
      }
    }
    
    // 更新热力图参数
    const updateHeatmap = () => {
      if (heatmapLayer) {
        heatmapLayer.setBlur(parseInt(blurRadius.value))
        heatmapLayer.setRadius(parseInt(pointRadius.value))
        heatmapLayer.setOpacity(parseFloat(heatmapOpacity.value))
        heatmapLayer.setGradient(colorGradients[selectedGradient.value])
      }
    }
    
    // 切换点显示
    const togglePoints = () => {
      if (pointLayer) {
        pointLayer.setVisible(showPoints.value)
      }
    }
    
    // 重置控制参数
    const resetControls = () => {
      heatmapIntensity.value = 1.0
      blurRadius.value = 15
      pointRadius.value = 15
      heatmapOpacity.value = 0.7
      selectedGradient.value = 'default'
      showPoints.value = false
      
      updateHeatmap()
      togglePoints()
    }
    
    // 处理地图点击事件
    const handleMapClick = (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature
      })
      
      if (feature) {
        const name = feature.get('name')
        const weight = feature.get('weight')
        const movies = feature.get('movies')
        
        alert(`取景地: ${name}\n密度权重: ${weight}\n相关电影: ${movies ? movies.join(', ') : '未知'}`)
      }
    }
    
    // 监听位置数据变化
    watch(() => props.locations, () => {
      updateHeatmapData()
    }, { deep: true })
    
    onMounted(() => {
      initMap()
    })
    
    onUnmounted(() => {
      if (map) {
        map.setTarget(null)
        map = null
      }
    })
    
    return {
      mapContainer,
      mapStyles,
      currentStyle,
      heatmapIntensity,
      blurRadius,
      pointRadius,
      heatmapOpacity,
      selectedGradient,
      showPoints,
      heatmapData,
      maxDensity,
      avgDensity,
      coverageArea,
      gradientStyle,
      changeMapStyle,
      updateHeatmap,
      togglePoints,
      resetControls
    }
  }
}
</script>

<style scoped>
.heatmap-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#heatmap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0f19 0%, #1a1f2e 100%);
}

/* 地图样式切换控件 */
.map-style-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  background: rgba(10, 15, 25, 0.9);
  border-radius: 6px;
  border: 1px solid rgba(0, 247, 255, 0.5);
  box-shadow: 
    0 0 15px rgba(0, 247, 255, 0.3),
    0 2px 5px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.style-btn {
  background: transparent;
  border: none;
  color: #b0b8c0;
  font-size: 0.8rem;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
  white-space: nowrap;
}

.style-btn:last-child {
  border-bottom: none;
}

.style-btn:hover {
  background-color: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
}

.style-btn.active {
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  color: #0a0f19;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
  box-shadow: inset 0 0 8px rgba(0, 247, 255, 0.3);
}

/* 热力图控制面板 */
.heatmap-controls {
  position: absolute;
  top: 60px;
  right: 10px;
  background: rgba(10, 15, 25, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 
    0 0 15px rgba(0, 247, 255, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border: 1px solid rgba(0, 247, 255, 0.5);
  max-width: 250px;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(5px);
}

.heatmap-controls h3 {
  margin-bottom: 15px;
  color: #00f7ff;
  border-bottom: 2px solid rgba(0, 247, 255, 0.5);
  padding-bottom: 5px;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.control-group {
  margin-bottom: 12px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  color: #b0b8c0;
  font-weight: 500;
}

.control-group input[type="range"] {
  width: 100%;
  margin-bottom: 5px;
  background: rgba(30, 40, 60, 0.8);
  border-radius: 4px;
  height: 6px;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00f7ff;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 247, 255, 0.7);
}

.control-group span {
  float: right;
  color: #8d9ba8;
  font-size: 0.9em;
}

.control-group select {
  width: 100%;
  padding: 5px;
  border: 1px solid rgba(0, 247, 255, 0.5);
  border-radius: 4px;
  background: rgba(20, 25, 35, 0.8);
  color: #b0b8c0;
}

.control-group input[type="checkbox"] {
  margin-right: 5px;
  accent-color: #00f7ff;
}

.reset-btn {
  width: 100%;
  padding: 8px;
  background: linear-gradient(135deg, #ff3366, #cc0044);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  margin-top: 10px;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
}

.reset-btn:hover {
  background: linear-gradient(135deg, #ff0044, #990033);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(255, 0, 68, 0.7);
}

/* 统计面板 */
.stats-panel {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(10, 15, 25, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 
    0 0 15px rgba(0, 247, 255, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border: 1px solid rgba(0, 247, 255, 0.5);
  max-width: 200px;
  backdrop-filter: blur(5px);
}

.stats-panel h3 {
  margin-bottom: 10px;
  color: #00f7ff;
  border-bottom: 2px solid rgba(0, 247, 255, 0.5);
  padding-bottom: 5px;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.stats-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #b0b8c0;
}

/* 热力图图例 */
.heatmap-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(10, 15, 25, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 
    0 0 15px rgba(0, 247, 255, 0.3),
    0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border: 1px solid rgba(0, 247, 255, 0.5);
  min-width: 150px;
  backdrop-filter: blur(5px);
}

.heatmap-legend h3 {
  margin-bottom: 10px;
  color: #00f7ff;
  font-size: 1rem;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.gradient-bar {
  width: 100%;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 8px rgba(0, 247, 255, 0.2);
}

.gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #0a0f19, #ff3366, #00f7ff);
}

.legend-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #8d9ba8;
}

/* 自定义版权信息样式 */
.custom-attribution {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(10, 15, 25, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #b0b8c0;
  z-index: 999;
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-style-controls {
    flex-direction: row;
    top: auto;
    bottom: 10px;
    right: 10px;
  }
  
  .style-btn {
    border-bottom: none;
    border-right: 1px solid rgba(0, 247, 255, 0.2);
    font-size: 0.7rem;
    padding: 6px 10px;
  }
  
  .style-btn:last-child {
    border-right: none;
  }
  
  .heatmap-controls {
    position: relative;
    top: auto;
    right: auto;
    max-width: none;
    margin: 10px;
  }
  
  .stats-panel {
    position: relative;
    bottom: auto;
    left: auto;
    max-width: none;
    margin: 10px;
  }

  .heatmap-legend {
    position: relative;
    bottom: auto;
    right: auto;
    margin: 10px;
    max-width: none;
  }

  .custom-attribution {
    font-size: 0.7rem;
    padding: 3px 6px;
  }
}

/* 统一缩放控件样式 */
:deep(.ol-zoom) {
  top: 10px !important;
  left: 10px !important;
  right: auto !important;
  bottom: auto !important;
}

:deep(.ol-zoom .ol-zoom-in),
:deep(.ol-zoom .ol-zoom-out) {
  background-color: rgba(10, 15, 25, 0.9) !important;
  color: #00f7ff !important;
  border-radius: 4px !important;
  border: 1px solid rgba(0, 247, 255, 0.5) !important;
  margin-bottom: 4px !important;
  font-size: 1.2rem !important;
  font-weight: bold !important;
  width: 30px !important;
  height: 30px !important;
  line-height: 0.9 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 0 8px rgba(0, 247, 255, 0.2);
}

:deep(.ol-zoom .ol-zoom-in:hover),
:deep(.ol-zoom .ol-zoom-out:hover) {
  background-color: rgba(0, 247, 255, 0.1) !important;
  cursor: pointer !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 0 12px rgba(0, 247, 255, 0.4) !important;
}

/* 隐藏OpenLayers默认的attribution */
:deep(.ol-attribution) {
  display: none !important;
}
</style>