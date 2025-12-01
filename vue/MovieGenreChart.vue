<!-- MovieGenreChart.vue -->
<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3 class="chart-title">电影类型分布</h3>
      <div class="chart-controls">
        <div class="chart-type-buttons">
          <button 
            class="chart-type-btn" 
            :class="{ active: chartType === 'pie' }"
            @click="chartType = 'pie'"
          >
            饼状
          </button>
          <button 
            class="chart-type-btn" 
            :class="{ active: chartType === 'bar' }"
            @click="chartType = 'bar'"
          >
            柱状
          </button>
        </div>
        <button class="toggle-chart-btn" @click="toggleChart">
          {{ isExpanded ? '收起' : '展开' }}
        </button>
      </div>
    </div>
    
    <div v-show="isExpanded" class="chart-content">
      <div ref="chartRef" class="chart" :style="{ height: chartHeight + 'px' }"></div>
      <div class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">总取景地:</span>
          <span class="stat-value">{{ totalLocations }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">类型数量:</span>
          <span class="stat-value">{{ genreCount }}</span>
        </div>
        <div class="stat-item" v-if="currentSelectedGenre">
          <span class="stat-label">当前选中:</span>
          <span class="stat-value">{{ getGenreName(currentSelectedGenre) }}</span>
          <button class="clear-selection" @click="clearSelection" title="清除选择">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import { genreColors } from '../movieLocations'

export default {
  name: 'MovieGenreChart',
  props: {
    locations: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      default: 320
    },
    selectedGenre: {
      type: String,
      default: 'all'
    }
  },
  setup(props, { emit }) {
    const chartRef = ref(null)
    const chartType = ref('pie')
    const isExpanded = ref(true)
    let chartInstance = null
    
    const chartHeight = ref(props.height)
    const currentSelectedGenre = ref('')
    
    // 计算统计数据
    const totalLocations = ref(0)
    const genreCount = ref(0)
    
    // 切换图表展开/收起
    const toggleChart = () => {
      isExpanded.value = !isExpanded.value
      // 当展开时，确保图表重新渲染
      if (isExpanded.value) {
        nextTick(() => {
          if (chartInstance) {
            chartInstance.resize()
          } else {
            initChart()
          }
        })
      }
    }
    
    // 处理数据
    const processChartData = () => {
      const genreCountMap = {}
      
      props.locations.forEach(location => {
        const genre = location.genre
        genreCountMap[genre] = (genreCountMap[genre] || 0) + 1
      })
      
      totalLocations.value = props.locations.length
      genreCount.value = Object.keys(genreCountMap).length
      
      return Object.keys(genreCountMap).map(genre => ({
        name: getGenreName(genre),
        value: genreCountMap[genre],
        genre: genre,
        itemStyle: {
          color: genreColors[genre] || '#cccccc',
          borderColor: '#FFFDE7',
          borderWidth: currentSelectedGenre.value === genre ? 3 : 1
        },
        emphasis: {
          itemStyle: {
            borderColor: '#FFA000',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(255, 160, 0, 0.5)'
          }
        }
      })).sort((a, b) => b.value - a.value)
    }
    
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
    
    const getGenreName = (genre) => {
      return genreNames[genre] || genre
    }
    
    // 初始化图表
    const initChart = () => {
      if (!chartRef.value) {
        console.warn('图表容器未找到')
        return
      }
      
      // 销毁现有实例
      if (chartInstance) {
        chartInstance.dispose()
      }
      
      try {
        // 创建新实例
        chartInstance = echarts.init(chartRef.value)
        
        // 设置图表配置
        updateChart()
        
        // 添加点击事件
        chartInstance.on('click', (params) => {
          if (params.componentType === 'series') {
            const clickedGenre = params.data.genre
            
            // 如果点击的是当前已选中的类型，则取消选择，否则选择新类型
            if (currentSelectedGenre.value === clickedGenre) {
              clearSelection()
            } else {
              currentSelectedGenre.value = clickedGenre
              emit('genreSelect', clickedGenre)
            }
            
            // 更新图表高亮
            updateChart()
          }
        })
        
        console.log('图表初始化成功')
      } catch (error) {
        console.error('图表初始化失败:', error)
      }
    }
    
    // 清除选择
    const clearSelection = () => {
      currentSelectedGenre.value = ''
      emit('genreSelect', 'all')
      updateChart()
    }
    
    // 更新图表
    const updateChart = () => {
      if (!chartInstance) {
        console.warn('图表实例不存在')
        return
      }
      
      const chartData = processChartData()
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255, 253, 231, 0.95)',
          borderColor: '#FFA000',
          textStyle: {
            color: '#5D4037'
          }
        },
        legend: chartType.value === 'pie' ? {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            color: '#5D4037',
            fontSize: 12
          },
          itemWidth: 12,
          itemHeight: 12,
          pageTextStyle: {
            color: '#5D4037'
          }
        } : undefined,
        series: chartType.value === 'pie' ? [
          {
            name: '电影类型',
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderColor: '#FFFDE7',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}',
              color: '#5D4037',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 15
            },
            data: chartData
          }
        ] : [
          {
            name: '电影类型',
            type: 'bar',
            data: chartData,
            itemStyle: {
              color: (params) => {
                const color = genreColors[chartData[params.dataIndex].genre] || '#cccccc'
                // 如果当前选中，加深颜色
                return currentSelectedGenre.value === chartData[params.dataIndex].genre 
                  ? color.replace(')', ', 0.9)').replace('ff', '') 
                  : color
              },
              borderColor: (params) => {
                return currentSelectedGenre.value === chartData[params.dataIndex].genre 
                  ? '#FFA000' 
                  : 'transparent'
              },
              borderWidth: (params) => {
                return currentSelectedGenre.value === chartData[params.dataIndex].genre ? 2 : 0
              }
            },
            label: {
              show: true,
              position: 'top',
              color: '#5D4037',
              fontWeight: (params) => {
                return currentSelectedGenre.value === chartData[params.dataIndex].genre 
                  ? 'bold' 
                  : 'normal'
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 8,
                shadowColor: 'rgba(255, 160, 0, 0.3)'
              }
            }
          }
        ],
        grid: chartType.value === 'bar' ? {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '10%',
          containLabel: true
        } : undefined,
        xAxis: chartType.value === 'bar' ? {
          type: 'category',
          data: chartData.map(item => item.name),
          axisLabel: {
            color: '#5D4037',
            rotate: 45,
            fontSize: 12,
            fontWeight: (value) => {
              const genre = chartData.find(item => item.name === value)?.genre
              return currentSelectedGenre.value === genre ? 'bold' : 'normal'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#FFD54F'
            }
          }
        } : undefined,
        yAxis: chartType.value === 'bar' ? {
          type: 'value',
          axisLabel: {
            color: '#5D4037'
          },
          axisLine: {
            lineStyle: {
              color: '#FFD54F'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255, 213, 79, 0.3)',
              type: 'dashed'
            }
          }
        } : undefined
      }
      
      chartInstance.setOption(option, true)
    }
    
    // 响应窗口大小变化
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }
    
    onMounted(() => {
      nextTick(() => {
        initChart()
        window.addEventListener('resize', handleResize)
      })
    })
    
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
      }
      window.removeEventListener('resize', handleResize)
    })
    
    // 监听数据变化
    watch(() => props.locations, () => {
      updateChart()
    }, { deep: true })
    
    // 监听图表类型变化
    watch(chartType, () => {
      updateChart()
    })
    
    // 监听外部选中的类型变化
    watch(() => props.selectedGenre, (newGenre) => {
      if (newGenre === 'all') {
        currentSelectedGenre.value = ''
      } else {
        currentSelectedGenre.value = newGenre
      }
      updateChart()
    })
    
    return {
      chartRef,
      chartType,
      chartHeight,
      isExpanded,
      currentSelectedGenre,
      totalLocations,
      genreCount,
      toggleChart,
      clearSelection,
      getGenreName
    }
  }
}
</script>

<style scoped>
.chart-container {
  background: rgba(255, 253, 231, 0.95);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #FFECB3;
  box-shadow: 0 2px 10px rgba(255, 193, 7, 0.1);
  margin-top: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.chart-title {
  margin: 0;
  color: #5D4037;
  font-size: 1.1rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex: 1;
}

.chart-type-buttons {
  display: flex;
  background: #FFF9C4;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #FFD54F;
}

.chart-type-btn {
  padding: 0.4rem 0.8rem;
  background: transparent;
  border: none;
  color: #5D4037;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.chart-type-btn.active {
  background: linear-gradient(135deg, #FFA000, #FF6F00);
  color: white;
  border-color: #FF8F00;
}

.chart-type-btn:hover:not(.active) {
  background: #FFEE58;
}

.toggle-chart-btn {
  padding: 0.4rem 0.8rem;
  background: #FFF9C4;
  border: 1px solid #FFD54F;
  color: #5D4037;
  cursor: pointer;
  font-size: 0.8rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  min-width: 50px;
  text-align: center;
}

.toggle-chart-btn:hover {
  background: #FFEE58;
}

.chart-content {
  transition: all 0.3s ease;
}

.chart {
  width: 100%;
  transition: all 0.3s ease;
}

.chart-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #FFECB3;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 80px;
}

.stat-label {
  font-size: 0.8rem;
  color: #6D4C41;
  margin-bottom: 0.2rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #FF6F00;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.clear-selection {
  background: #FF6F00;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-selection:hover {
  background: #E65100;
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
  
  .chart-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .chart-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .stat-item {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    min-width: auto;
  }
  
  .chart-type-btn,
  .toggle-chart-btn {
    min-width: 45px;
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .chart-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .chart-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .chart-type-buttons {
    justify-content: center;
  }
}
</style>