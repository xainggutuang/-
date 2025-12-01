<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
    
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
    
    <!-- 全局控件容器 -->
    <div class="global-controls">
      <!-- 缩放控件 -->
      <div class="control-group zoom-controls">
        <button class="control-btn zoom-in" @click="zoomIn" title="放大">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        <button class="control-btn zoom-out" @click="zoomOut" title="缩小">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
      </div>
      
      <!-- 全屏控件 -->
      <div class="control-group">
        <button class="control-btn fullscreen-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="!isFullscreen" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            <path v-else d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        </button>
      </div>
      
      <!-- 重置视图控件 -->
      <div class="control-group">
        <button class="control-btn reset-view-btn" @click="resetView" title="重置视图">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 信息弹窗 -->
    <div v-if="popupVisible" class="custom-popup" :style="popupStyle">
      <div class="popup-content">
        <button class="popup-close" @click="closePopup">×</button>
        <h3>{{ popupData.name }}</h3>
        <img v-if="popupData.image" :src="popupData.image" :alt="popupData.name" class="popup-image">
        <div class="popup-details">
          <p><strong>相关电影:</strong> {{ popupData.movies ? popupData.movies.join(', ') : '未知' }}</p>
          <p><strong>场景描述:</strong> {{ popupData.description || '暂无描述' }}</p>
          <p><strong>电影类型:</strong> {{ getGenreName(popupData.genre) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick, reactive } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Text, Fill, Stroke, Circle } from 'ol/style'
import { defaults as defaultControls, FullScreen } from 'ol/control'
import { genreColors } from '../movieLocations'
import Cluster from 'ol/source/Cluster'

export default {
  name: 'MapContainer',
  props: {
    locations: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const mapContainer = ref(null)
    let map = null
    let vectorSource = null
    let clusterSource = null
    let vectorLayer = null
    let baseLayer = null
    
    // 地图样式配置
    const mapStyles = [
      {
        id: 'gaode',
        name: '矢量',
        url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}&key=5e7fefef8e9703c90fe3f4f5ef46e668',
        subdomains: ['1', '2', '3', '4'],
        attribution: '© 高德地图'
      },
      {
        id: 'gaode_satellite',
        name: '卫星',
        url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}&key=5e7fefef8e9703c90fe3f4f5ef46e668',
        subdomains: ['1', '2', '3', '4'],
        attribution: '© 高德地图'
      }
    ]
    
    const currentStyle = ref('gaode')
    const isFullscreen = ref(false)
    
    // 弹窗相关状态
    const popupVisible = ref(false)
    const popupData = reactive({
      name: '',
      movies: [],
      description: '',
      image: '',
      genre: '',
      coordinates: [0, 0]
    })
    const popupStyle = ref({})
    
    // 聚合样式缓存
    const styleCache = {}
    
    // 电影类型映射
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
      'family': '家庭',
      'mixed': '混合类型'
    }
    
    const getGenreName = (genre) => {
      return genreNames[genre] || genre
    }
    
    // 聚合图层样式函数
    const clusterStyle = (feature) => {
      const size = feature.get('features').length
      let style = styleCache[size]
      
      if (!style) {
        style = new Style({
          image: new Circle({
            radius: Math.min(10 + size, 20),
            stroke: new Stroke({
              color: '#fff',
              width: 2
            }),
            fill: new Fill({
              color: '#3399CC'
            })
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({
              color: '#fff'
            }),
            font: 'bold 12px Arial, sans-serif'
          })
        })
        styleCache[size] = style
      }
      return style
    }
    
    // 单个要素样式函数
    const singleFeatureStyle = (feature) => {
      const genre = feature.get('genre')
      const name = feature.get('name')
      
      return new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: genreColors[genre] || '#666666'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 2
          })
        }),
        text: new Text({
          text: name,
          offsetY: -15,
          font: '12px Arial, sans-serif',
          fill: new Fill({
            color: '#5D4037'
          }),
          stroke: new Stroke({
            color: '#ffffff',
            width: 3
          }),
          backgroundFill: new Fill({
            color: 'rgba(255, 253, 231, 0.9)'
          }),
          padding: [2, 4],
          backgroundStroke: new Stroke({
            color: '#FFECB3',
            width: 1
          })
        })
      })
    }
    
    const initMap = () => {
      console.log('初始化 OpenLayers 地图...')
      
      if (!mapContainer.value) {
        console.error('地图容器未找到')
        return
      }
      
      try {
        // 创建矢量数据源
        vectorSource = new VectorSource()
        
        // 创建聚合数据源
        clusterSource = new Cluster({
          distance: 40,
          source: vectorSource
        })
        
        // 创建聚合图层
        vectorLayer = new VectorLayer({
          source: clusterSource,
          style: (feature) => {
            const features = feature.get('features')
            if (features.length === 1) {
              return singleFeatureStyle(features[0])
            } else {
              return clusterStyle(feature)
            }
          }
        })
        
        // 创建底图图层
        baseLayer = createBaseLayer(currentStyle.value)
        
        // 初始化地图
        map = new Map({
          target: mapContainer.value,
          layers: [baseLayer, vectorLayer],
          view: new View({
            center: fromLonLat([104.0, 35.0]),
            zoom: 4,
            minZoom: 3,
            maxZoom: 18
          }),
          controls: defaultControls({
            attribution: false,
            zoom: false,
            rotate: false
          }).extend([
            new FullScreen({
              className: 'custom-fullscreen',
              target: mapContainer.value
            })
          ])
        })
        
        // 添加事件监听
        map.on('click', handleMapClick)
        map.on('moveend', closePopup)
        
        // 监听全屏变化
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        
        // 初始添加标记点
        updateMarkers()
        
        console.log('OpenLayers 地图初始化完成')
        
      } catch (error) {
        console.error('地图初始化失败:', error)
      }
    }
    
    const createBaseLayer = (styleId) => {
      const style = mapStyles.find(s => s.id === styleId) || mapStyles[0]
      
      if (styleId.includes('gaode') && style.subdomains) {
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
      
      console.log(`切换地图样式为: ${styleId}`)
    }
    
    const updateMarkers = () => {
      if (!vectorSource) {
        console.warn('矢量数据源未初始化')
        return
      }
      
      vectorSource.clear()
      console.log('清除现有标记点')
      
      if (props.locations.length === 0) {
        console.log('没有位置数据可显示')
        return
      }
      
      props.locations.forEach(location => {
        try {
          const feature = new Feature({
            geometry: new Point(fromLonLat([location.lng, location.lat])),
            name: location.name,
            genre: location.genre,
            movies: location.movies,
            description: location.description,
            image: location.image
          })
          
          vectorSource.addFeature(feature)
        } catch (error) {
          console.error('创建标记点失败:', error, location)
        }
      })
      
      console.log(`成功添加 ${props.locations.length} 个标记点`)
      
      if (props.locations.length > 0 && map) {
        try {
          const extent = vectorSource.getExtent()
          map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000
          })
          console.log('地图视图调整完成')
        } catch (error) {
          console.error('调整地图视图失败:', error)
        }
      }
    }
    
    const handleMapClick = (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature
      })
      
      if (feature) {
        const features = feature.get('features')
        let actualFeature = feature
        
        // 如果是聚合点，获取第一个要素的信息
        if (features && features.length > 0) {
          actualFeature = features[0]
        }
        
        const coordinates = event.coordinate
        const lonLat = toLonLat(coordinates)
        
        Object.assign(popupData, {
          name: actualFeature.get('name'),
          genre: actualFeature.get('genre'),
          movies: actualFeature.get('movies'),
          description: actualFeature.get('description'),
          image: actualFeature.get('image'),
          coordinates: lonLat
        })
        
        const pixel = map.getPixelFromCoordinate(coordinates)
        const mapRect = mapContainer.value.getBoundingClientRect()
        
        popupStyle.value = {
          left: (pixel[0] + 10) + 'px',
          top: (pixel[1] - 10) + 'px',
          transform: 'translateY(-100%)'
        }
        
        popupVisible.value = true
        
        setTimeout(() => {
          map.once('click', (e) => {
            if (!map.forEachFeatureAtPixel(e.pixel, () => true)) {
              closePopup()
            }
          })
        }, 100)
      } else {
        closePopup()
      }
    }
    
    const closePopup = () => {
      popupVisible.value = false
    }
    
    const zoomIn = () => {
      if (map) {
        const view = map.getView()
        const currentZoom = view.getZoom()
        view.animate({
          zoom: currentZoom + 1,
          duration: 250
        })
      }
    }
    
    const zoomOut = () => {
      if (map) {
        const view = map.getView()
        const currentZoom = view.getZoom()
        view.animate({
          zoom: currentZoom - 1,
          duration: 250
        })
      }
    }
    
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        mapContainer.value.requestFullscreen?.().catch(err => {
          console.error('全屏请求失败:', err)
        })
      } else {
        document.exitFullscreen?.()
      }
    }
    
    const handleFullscreenChange = () => {
      isFullscreen.value = !!document.fullscreenElement
    }
    
    const resetView = () => {
      if (map) {
        map.getView().animate({
          center: fromLonLat([104.0, 35.0]),
          zoom: 4,
          duration: 1000
        })
      }
    }
    
    onMounted(() => {
      console.log('MapContainer 组件已挂载')
      
      nextTick(() => {
        setTimeout(() => {
          initMap()
        }, 300)
      })
    })
    
    watch(() => props.locations, (newLocations) => {
      console.log('位置数据变化，更新标记点:', newLocations.length)
      updateMarkers()
    }, { deep: true })
    
    onUnmounted(() => {
      if (map) {
        map.setTarget(null)
        map = null
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    })
    
    return {
      mapContainer,
      mapStyles,
      currentStyle,
      popupVisible,
      popupData,
      popupStyle,
      isFullscreen,
      getGenreName,
      changeMapStyle,
      zoomIn,
      zoomOut,
      toggleFullscreen,
      resetView,
      closePopup
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

#map {
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
  z-index: 1000;
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

/* 全局控件容器 - 位置下移 */
.global-controls {
  position: absolute;
  top: 100px; /* 下移避免与地图切换控件重合 */
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group {
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

.control-btn {
  background: transparent;
  border: none;
  color: #b0b8c0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.control-btn:hover {
  background-color: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
}

.control-btn.active {
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  color: #0a0f19;
  box-shadow: inset 0 0 8px rgba(0, 247, 255, 0.3);
}

/* 缩放控件特殊样式 */
.zoom-controls .control-btn {
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
}

.zoom-controls .control-btn:last-child {
  border-bottom: none;
}

/* 自定义弹窗样式 */
.custom-popup {
  position: absolute;
  z-index: 1000;
  background: rgba(10, 15, 25, 0.95);
  border: 1px solid rgba(0, 247, 255, 0.5);
  border-radius: 8px;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 247, 255, 0.3);
  min-width: 300px;
  max-width: 400px;
  animation: popupFadeIn 0.3s ease-out;
  backdrop-filter: blur(5px);
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateY(-100%);
  }
}

.popup-content {
  position: relative;
  padding: 20px;
}

.popup-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ff3366, #cc0044);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(255, 51, 102, 0.5);
}

.popup-close:hover {
  background: linear-gradient(135deg, #ff0044, #990033);
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(255, 0, 68, 0.7);
}

.popup-content h3 {
  margin: 0 0 15px 0;
  color: #00f7ff;
  font-size: 1.3rem;
  border-bottom: 2px solid rgba(0, 247, 255, 0.5);
  padding-bottom: 8px;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.popup-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 15px;
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.2);
}

.popup-details {
  color: #b0b8c0;
}

.popup-details p {
  margin: 8px 0;
  line-height: 1.5;
}

.popup-details strong {
  color: #00f7ff;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.3);
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
  
  .global-controls {
    top: auto;
    bottom: 60px;
    right: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    width: auto;
  }
  
  .control-group {
    flex-direction: row;
  }
  
  .custom-popup {
    min-width: 280px;
    max-width: 90vw;
    left: 5vw !important;
    right: 5vw;
    transform: none !important;
    top: 10px !important;
  }
  
  .popup-content {
    padding: 15px;
  }
  
  .popup-image {
    height: 150px;
  }
}
</style>