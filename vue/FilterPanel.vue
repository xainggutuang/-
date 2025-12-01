<template>
  <div class="filters-panel">
    <h2>筛选条件</h2>
    
    <div class="filter-group">
      <h3>电影类型</h3>
      <div class="filter-options">
        <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'all' }"
          @click="updateFilter('genre', 'all')"
        >全部</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'action' }"
          @click="updateFilter('genre', 'action')"
        >动作</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'drama' }"
          @click="updateFilter('genre', 'drama')"
        >剧情</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'comedy' }"
          @click="updateFilter('genre', 'comedy')"
        >喜剧</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'sci-fi' }"
          @click="updateFilter('genre', 'sci-fi')"
        >科幻</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'fantasy' }"
          @click="updateFilter('genre', 'fantasy')"
        >奇幻</button>
                <button 
          class="filter-btn" 
          :class="{ active: filters.genre === 'animation' }"
          @click="updateFilter('genre', 'animation')"
        >动漫</button>
      </div>
    </div>
    
    <div class="filter-group">
      <h3>地区</h3>
      <div class="filter-options">
        <button 
          class="filter-btn" 
          :class="{ active: filters.region === 'all' }"
          @click="updateFilter('region', 'all')"
        >全部</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.region === 'north' }"
          @click="updateFilter('region', 'north')"
        >华北</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.region === 'east' }"
          @click="updateFilter('region', 'east')"
        >华东</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.region === 'south' }"
          @click="updateFilter('region', 'south')"
        >华南</button>
        <button 
          class="filter-btn" 
          :class="{ active: filters.region === 'west' }"
          @click="updateFilter('region', 'west')"
        >西部</button>
      </div>
    </div>
    
    <div class="filter-group">
      <h3>电影名称</h3>
      <input 
        type="text" 
        class="search-box" 
        :value="filters.search" 
        @input="updateFilter('search', $event.target.value)"
        placeholder="搜索电影名称..."
      >
    </div>
    
    <button class="reset-btn" @click="resetFilters">重置筛选</button>
  </div>
</template>

<script>
export default {
  name: 'FilterPanel',
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  emits: ['update-filters', 'reset-filters'],
  setup(props, { emit }) {
    const updateFilter = (type, value) => {
      emit('update-filters', { type, value })
    }
    
    const resetFilters = () => {
      emit('reset-filters')
    }
    
    return {
      updateFilter,
      resetFilters
    }
  }
}
</script>

<style scoped>
.filters-panel {
  width: 300px;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.filters-panel h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group h3 {
  margin-bottom: 0.8rem;
  color: #34495e;
  font-size: 1.1rem;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  background-color: #ecf0f1;
  border: 1px solid #bdc3c7;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-btn:hover {
  background-color: #d6dbdf;
}

.filter-btn.active {
  background-color: #3498db;
  color: white;
  border-color: #2980b9;
}

.search-box {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.reset-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .filters-panel {
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>