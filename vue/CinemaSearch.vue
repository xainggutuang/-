<template>
  <div class="cinema-search-page">
    <!-- 页面标题和搜索栏 -->
    <div class="search-header">
      <h1 class="page-title">影院搜索</h1>
      <p class="page-subtitle">查找电影院，在线选座购票</p>
      
      <div class="search-controls">
        <div class="search-input-container">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="输入城市名称搜索影院（如：北京、上海）..."
            class="search-input"
            @keyup.enter="searchCinemas"
          />
          <button class="search-btn" @click="searchCinemas">
            <i class="fa fa-search"></i>
            搜索
          </button>
        </div>
      </div>

      <!-- 搜索状态 -->
      <div v-if="searchStatus" class="search-status" :class="searchStatus.type">
        <i :class="searchStatus.icon"></i>
        {{ searchStatus.message }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="search-content">
      <!-- 地图容器 -->
      <div class="map-container">
        <div v-if="!mapLoaded" class="map-placeholder">
          <div class="placeholder-content">
            <i class="fa fa-map"></i>
            <h3>影院地图</h3>
            <p>搜索后将在此显示影院位置</p>
            <div class="placeholder-cinemas">
              <div class="placeholder-cinema" v-for="n in 6" :key="n">
                <div class="cinema-dot"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else id="cinema-map" class="map">
          <!-- 模拟地图显示，确保有内容 -->
          <div class="map-fallback" v-if="!amapLoaded">
            <div class="fallback-content">
              <h3><i class="fa fa-map-marker-alt"></i> 影院位置图</h3>
              <div class="fallback-map">
                <div class="map-grid"></div>
                <!-- 影院标记 -->
                <div 
                  v-for="(cinema, index) in cinemas" 
                  :key="index"
                  class="fallback-marker"
                  :style="{
                    left: `${10 + (index % 3) * 40}%`,
                    top: `${20 + Math.floor(index / 3) * 25}%`
                  }"
                  @click="selectCinema(cinema)"
                  :title="cinema.name"
                >
                  <i class="fa fa-film"></i>
                  <div class="marker-tooltip">{{ cinema.name }}</div>
                </div>
              </div>
              <p class="fallback-note">地图加载中...如无法显示请检查网络</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 搜索结果列表 -->
      <div class="results-sidebar">
        <h3 class="results-title">
          搜索结果 ({{ cinemas.length }})
        </h3>
        
        <div class="search-stats" v-if="searchStats">
          <i class="fa fa-info-circle"></i>
          {{ searchStats }}
        </div>
        
        <div class="cinema-list">
          <div 
            v-for="cinema in cinemas" 
            :key="cinema.id"
            class="cinema-item"
            @click="selectCinema(cinema)"
            :class="{ active: selectedCinema && selectedCinema.id === cinema.id }"
          >
            <div class="cinema-info">
              <h4 class="cinema-name">{{ cinema.name }}</h4>
              <p class="cinema-address">
                <i class="fa fa-map-marker"></i>
                {{ cinema.address }}
              </p>
              <p class="cinema-tel" v-if="cinema.tel">
                <i class="fa fa-phone"></i>
                {{ cinema.tel }}
              </p>
              <div class="cinema-tags">
                <span class="tag rating-tag">
                  评分: {{ cinema.rating }}
                </span>
                <span class="tag price-tag">
                  {{ cinema.price }}
                </span>
              </div>
              <div class="cinema-features">
                <span class="feature-tag" v-for="feature in cinema.features" :key="feature">
                  {{ feature }}
                </span>
              </div>
            </div>
            <div class="cinema-actions">
              <button class="action-btn ticket-btn" @click.stop="showTicketSelection(cinema)">
                <i class="fa fa-ticket"></i>
                购票
              </button>
            </div>
          </div>
          
          <div v-if="cinemas.length === 0 && !isLoading" class="empty-state">
            <i class="fa fa-film"></i>
            <p>暂无搜索结果</p>
            <p class="empty-tip">请尝试搜索其他城市</p>
            <button class="demo-btn" @click="loadDemoData">
              <i class="fa fa-play-circle"></i>
              加载演示数据
            </button>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>正在搜索影院...</p>
        </div>
      </div>
    </div>

    <!-- 选票弹窗 -->
    <div v-if="showTicketModal" class="modal-overlay" @click="closeTicketModal">
      <div class="modal-content ticket-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedCinema?.name }} - 选座购票</h3>
          <button class="btn-close" @click="closeTicketModal">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="movie-selection">
            <h4>选择电影</h4>
            <div class="movie-list">
              <div 
                v-for="movie in movies" 
                :key="movie.id"
                class="movie-item"
                :class="{ active: selectedMovie && selectedMovie.id === movie.id }"
                @click="selectMovie(movie)"
              >
                <div class="movie-poster">
                  <i class="fa fa-film"></i>
                </div>
                <div class="movie-info">
                  <h5>{{ movie.name }}</h5>
                  <p class="movie-duration">{{ movie.duration }}</p>
                  <p class="movie-type">{{ movie.type }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="time-selection" v-if="selectedMovie">
            <h4>选择场次</h4>
            <div class="time-list">
              <div 
                v-for="timeSlot in timeSlots" 
                :key="timeSlot.id"
                class="time-item"
                :class="{ active: selectedTime && selectedTime.id === timeSlot.id }"
                @click="selectTime(timeSlot)"
              >
                <div class="time-info">
                  <span class="time">{{ timeSlot.time }}</span>
                  <span class="hall">{{ timeSlot.hall }}</span>
                </div>
                <div class="price-info">
                  <span class="price">{{ timeSlot.price }}</span>
                  <span class="language">{{ timeSlot.language }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="seat-selection" v-if="selectedTime">
            <h4>选择座位</h4>
            <div class="screen">银幕</div>
            <div class="seats-container">
              <div class="seat-row" v-for="(row, rowIndex) in seats" :key="rowIndex">
                <span class="row-label">{{ String.fromCharCode(65 + rowIndex) }}</span>
                <div 
                  v-for="(seat, seatIndex) in row" 
                  :key="seatIndex"
                  class="seat"
                  :class="{
                    available: seat.status === 'available',
                    selected: seat.status === 'selected',
                    sold: seat.status === 'sold',
                    vip: seat.type === 'vip'
                  }"
                  @click="selectSeat(seat, rowIndex, seatIndex)"
                >
                  {{ seatIndex + 1 }}
                </div>
              </div>
            </div>
            
            <!-- 座位图例 -->
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat-sample available"></div>
                <span>可选</span>
              </div>
              <div class="legend-item">
                <div class="seat-sample selected"></div>
                <span>已选</span>
              </div>
              <div class="legend-item">
                <div class="seat-sample sold"></div>
                <span>已售</span>
              </div>
              <div class="legend-item">
                <div class="seat-sample vip"></div>
                <span>VIP</span>
              </div>
            </div>
          </div>

          <div class="order-summary" v-if="selectedSeats.length > 0">
            <h4>订单摘要</h4>
            <div class="summary-details">
              <p>电影：{{ selectedMovie?.name }}</p>
              <p>影院：{{ selectedCinema?.name }}</p>
              <p>时间：{{ selectedTime?.time }}</p>
              <p>座位：{{ selectedSeats.map(seat => `${String.fromCharCode(65 + seat.row)}排${seat.number + 1}座`).join(', ') }}</p>
              <p class="total-price">总价：<span>¥{{ totalPrice }}</span></p>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-outline" @click="closeTicketModal">取消</button>
            <button 
              class="btn btn-primary" 
              @click="confirmOrder"
              :disabled="selectedSeats.length === 0 || !isLogin"
            >
              <i class="fa fa-shopping-cart"></i>
              {{ isLogin ? '确认购票' : '请先登录' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付二维码弹窗 -->
    <div v-if="showPaymentModal" class="modal-overlay" @click="closePaymentModal">
      <div class="modal-content payment-modal" @click.stop>
        <div class="modal-header">
          <h3>扫码支付</h3>
          <button class="btn-close" @click="closePaymentModal">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="payment-info">
            <div class="qr-code">
              <img src="/支付图片.png" alt="微信支付二维码" class="qr-image">
              <p class="qr-tip">请使用微信扫码支付</p>
              <p class="amount">支付金额: ¥{{ totalPrice }}</p>
            </div>
            <div class="order-details">
              <h4>订单详情</h4>
              <div class="detail-item">
                <label>电影：</label>
                <span>{{ selectedMovie?.name }}</span>
              </div>
              <div class="detail-item">
                <label>影院：</label>
                <span>{{ selectedCinema?.name }}</span>
              </div>
              <div class="detail-item">
                <label>时间：</label>
                <span>{{ selectedTime?.time }}</span>
              </div>
              <div class="detail-item">
                <label>座位：</label>
                <span>{{ selectedSeats.map(seat => `${String.fromCharCode(65 + seat.row)}排${seat.number + 1}座`).join(', ') }}</span>
              </div>
              <div class="detail-item total">
                <label>实付金额：</label>
                <span class="amount">¥{{ totalPrice }}</span>
              </div>
            </div>
          </div>
          <div class="payment-actions">
            <button class="btn btn-outline" @click="closePaymentModal">取消支付</button>
            <button class="btn btn-success" @click="simulatePayment">
              <i class="fa fa-check"></i>
              模拟支付成功
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单成功弹窗 -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success-modal" @click.stop>
        <div class="modal-header">
          <h3>购票成功</h3>
          <button class="btn-close" @click="closeSuccessModal">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="success-content">
            <i class="fa fa-check-circle"></i>
            <h4>支付成功！</h4>
            <p>您的电影票已购买成功</p>
            <div class="ticket-info">
              <div class="ticket-qr">
                <div class="ticket-qr-placeholder">
                  <i class="fa fa-ticket"></i>
                  <p>取票二维码</p>
                  <p class="ticket-number">{{ ticketNumber }}</p>
                </div>
              </div>
              <div class="ticket-details">
                <p><strong>{{ selectedMovie?.name }}</strong></p>
                <p>{{ selectedCinema?.name }}</p>
                <p>{{ selectedTime?.time }} {{ selectedTime?.hall }}</p>
                <p>座位：{{ selectedSeats.map(seat => `${String.fromCharCode(65 + seat.row)}排${seat.number + 1}座`).join(', ') }}</p>
                <p class="ticket-note">请凭取票码到影院自助取票机取票</p>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-primary" @click="closeSuccessModal">完成</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CinemaSearch',
  props: {
    isLogin: Boolean,
    currentUser: Object
  },
  data() {
    return {
      searchKeyword: '北京',
      cinemas: [],
      selectedCinema: null,
      isLoading: false,
      mapLoaded: true, // 设置为true确保地图容器显示
      searchStats: null,
      searchStatus: null,
      map: null,
      markers: [],

      // 购票相关数据保持不变
      showTicketModal: false,
      showPaymentModal: false,
      showSuccessModal: false,
      movies: [],
      selectedMovie: null,
      timeSlots: [],
      selectedTime: null,
      seats: [],
      selectedSeats: [],
      ticketNumber: '',
      
      // 地图状态
      amapLoaded: false,
      mapRetryCount: 0
    };
  },
  computed: {
    totalPrice() {
      return this.selectedSeats.length * (this.selectedTime ? parseInt(this.selectedTime.price.replace('¥', '')) : 45);
    }
  },
  mounted() {
    this.loadDemoData();
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap() {
      // 尝试加载高德地图
      this.loadAMap();
    },
    
    // 加载高德地图
    loadAMap() {
      // 检查是否已加载
      if (window.AMap) {
        this.createAMap();
        return;
      }
      
      // 加载高德地图API
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://webapi.amap.com/maps?v=2.0&key=5e7fefef8e9703c90fe3f4f5ef46e668&callback=initAMap`;
      script.async = true;
      
      window.initAMap = () => {
        console.log('高德地图API加载成功');
        this.amapLoaded = true;
        this.createAMap();
      };
      
      script.onerror = () => {
        console.log('高德地图API加载失败，显示模拟地图');
        this.amapLoaded = false;
        // 确保地图容器显示内容
        this.mapLoaded = true;
      };
      
      document.head.appendChild(script);
      
      // 设置超时，防止无限等待
      setTimeout(() => {
        if (!this.amapLoaded) {
          console.log('地图加载超时，显示模拟地图');
          this.amapLoaded = false;
          this.mapLoaded = true;
        }
      }, 3000);
    },
    
    // 创建高德地图
    createAMap() {
      try {
        if (!window.AMap) {
          throw new Error('高德地图API未加载');
        }
        
        // 清除之前的模拟地图内容
        const fallback = document.querySelector('.map-fallback');
        if (fallback) {
          fallback.style.display = 'none';
        }
        
        // 创建地图实例
        this.map = new AMap.Map('cinema-map', {
          zoom: 12,
          center: [116.397428, 39.90923], // 北京中心坐标
          viewMode: '3D',
          mapStyle: 'amap://styles/light',
          showIndoorMap: true,
          resizeEnable: true
        });
        
        // 添加控件
        this.map.addControl(new AMap.ZoomControl());
        this.map.addControl(new AMap.Scale());
        this.map.addControl(new AMap.ToolBar({ position: 'RB' }));
        
        // 添加影院标记
        this.addAMapMarkers();
        
        this.amapLoaded = true;
        
      } catch (error) {
        console.error('高德地图创建失败:', error);
        this.amapLoaded = false;
        this.mapLoaded = true;
      }
    },
    
    // 添加高德地图标记
    addAMapMarkers() {
      if (!this.map || !window.AMap) return;
      
      // 清除现有标记
      this.markers.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });
      this.markers = [];
      
      // 北京各区的坐标
      const beijingCoordinates = [
        [116.486409, 39.921489], // 朝阳区
        [116.418757, 39.917544], // 东城区
        [116.366794, 39.915309], // 西城区
        [116.298056, 39.959912], // 海淀区
        [116.287149, 39.863642], // 丰台区
        [116.235907, 40.218085], // 昌平区
      ];
      
      this.cinemas.forEach((cinema, index) => {
        const coord = beijingCoordinates[index % beijingCoordinates.length] || [116.397428, 39.90923];
        
        // 添加随机偏移
        const lng = coord[0] + (Math.random() - 0.5) * 0.1;
        const lat = coord[1] + (Math.random() - 0.5) * 0.1;
        
        const marker = new AMap.Marker({
          position: [lng, lat],
          title: cinema.name,
          map: this.map,
          offset: new AMap.Pixel(-13, -30),
          content: `
            <div style="width: 30px; height: 30px; background: linear-gradient(135deg, #00f7ff, #00a8b0); 
                       border-radius: 50%; border: 2px solid white; display: flex; align-items: center; 
                       justify-content: center; color: white; font-size: 12px; cursor: pointer;">
              <i class="fa fa-film" style="font-size: 14px;"></i>
            </div>
          `
        });
        
        // 信息窗口
        const infoWindow = new AMap.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px; background: #1a1f2e; color: white; border: 1px solid #00f7ff; border-radius: 8px;">
              <h4 style="margin: 0 0 10px 0; color: #00f7ff;">${cinema.name}</h4>
              <p style="margin: 5px 0; font-size: 12px;"><i class="fa fa-map-marker"></i> ${cinema.address}</p>
              <p style="margin: 5px 0; font-size: 12px;"><i class="fa fa-phone"></i> ${cinema.tel}</p>
              <p style="margin: 5px 0; color: #ffc107; font-size: 12px;">评分: ${cinema.rating} | ${cinema.price}</p>
              <button onclick="document.querySelector('.amap-info-close').click();" 
                      style="background: #00f7ff; color: #0a0f19; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 5px;">
                选择此影院
              </button>
            </div>
          `,
          offset: new AMap.Pixel(0, -30)
        });
        
        marker.on('click', () => {
          this.selectCinema(cinema);
          infoWindow.open(this.map, marker.getPosition());
        });
        
        this.markers.push(marker);
      });
      
      // 调整视野
      if (this.markers.length > 0) {
        this.map.setFitView();
      }
    },

    // 搜索影院
    async searchCinemas() {
      if (!this.searchKeyword.trim()) {
        this.showSearchStatus('error', '请输入搜索关键词');
        return;
      }

      this.isLoading = true;
      this.cinemas = [];
      this.showSearchStatus('info', '正在搜索影院...');

      try {
        // 模拟搜索延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 使用模拟数据
        this.loadDemoData(this.searchKeyword);
        
        this.showSearchStatus('success', `在"${this.searchKeyword}"找到 ${this.cinemas.length} 家影院`);
        
        // 更新地图标记
        if (this.amapLoaded && this.map) {
          this.addAMapMarkers();
        }
        
      } catch (error) {
        console.error('搜索影院失败：', error);
        this.showSearchStatus('error', '搜索失败，请重试');
        this.loadDemoData();
      } finally {
        this.isLoading = false;
      }
    },

    // 加载演示数据
    loadDemoData(city = '北京') {
      this.cinemas = [
        {
          id: '1',
          name: `${city}万达影城(CBD店)`,
          address: `${city}市朝阳区建国路93号万达广场B座3层`,
          tel: '010-12345678',
          rating: '4.5',
          price: '¥45起',
          features: ['IMAX', '3D', '杜比全景声', '免费停车']
        },
        {
          id: '2',
          name: `UME影城(${city}中心店)`,
          address: `${city}市商业区购物中心5-6层`,
          tel: '010-87654321',
          rating: '4.3',
          price: '¥42起',
          features: ['4DX', '3D', '巨幕厅', '会员优惠']
        },
        {
          id: '3',
          name: `CGV影城(${city}旗舰店)`,
          address: `${city}市繁华区商业中心L3`,
          tel: '010-23456789',
          rating: '4.6',
          price: '¥48起',
          features: ['IMAX', '4D', '黄金位置', '餐饮服务']
        },
        {
          id: '4',
          name: `金逸影城(${city}影城店)`,
          address: `${city}市购物区大悦城8层`,
          tel: '010-34567890',
          rating: '4.4',
          price: '¥40起',
          features: ['3D', '情侣座', '儿童优惠', '商场停车']
        },
        {
          id: '5',
          name: `博纳国际影城(${city}店)`,
          address: `${city}市商业区ID MALL 5层`,
          tel: '010-56789012',
          rating: '4.2',
          price: '¥38起',
          features: ['激光厅', '3D', '会员日', '免费WIFI']
        },
        {
          id: '6',
          name: `卢米埃影城(${city}天街店)`,
          address: `${city}市天街购物中心西区4层`,
          tel: '010-67890123',
          rating: '4.7',
          price: '¥50起',
          features: ['IMAX', '4D', '贵宾厅', '专属停车']
        }
      ];
      
      this.searchStats = `在"${city}"找到 ${this.cinemas.length} 家影院`;
      this.mapLoaded = true;
    },

    // 显示搜索状态
    showSearchStatus(type, message) {
      this.searchStatus = {
        type,
        message,
        icon: type === 'success' ? 'fa fa-check-circle' : 
              type === 'error' ? 'fa fa-exclamation-circle' : 'fa fa-info-circle'
      };
      
      setTimeout(() => {
        this.searchStatus = null;
      }, 5000);
    },

    // 选择影院
    selectCinema(cinema) {
      this.selectedCinema = cinema;
      
      // 如果是高德地图
      if (this.amapLoaded && this.map && window.AMap) {
        const markers = this.markers.filter(m => m.getTitle() === cinema.name);
        if (markers.length > 0) {
          this.map.setCenter(markers[0].getPosition());
          this.map.setZoom(16);
        }
      }
    },

    // 购票功能方法
    showTicketSelection(cinema) {
      if (!this.isLogin) {
        this.$emit('needLogin');
        return;
      }
      
      this.selectedCinema = cinema;
      this.loadMovies();
      this.showTicketModal = true;
    },

    loadMovies() {
      // 模拟电影数据
      this.movies = [
        {
          id: 1,
          name: '沙丘2',
          duration: '166分钟',
          type: '科幻/冒险'
        },
        {
          id: 2,
          name: '热辣滚烫',
          duration: '129分钟',
          type: '喜剧/剧情'
        },
        {
          id: 3,
          name: '第二十条',
          duration: '141分钟',
          type: '剧情/喜剧'
        }
      ];
    },

    selectMovie(movie) {
      this.selectedMovie = movie;
      this.selectedTime = null;
      this.selectedSeats = [];
      this.loadTimeSlots();
    },

    loadTimeSlots() {
      // 模拟场次数据
      this.timeSlots = [
        {
          id: 1,
          time: '14:30',
          hall: '1号激光厅',
          price: '¥45',
          language: '国语2D'
        },
        {
          id: 2,
          time: '16:45',
          hall: '2号IMAX厅',
          price: '¥65',
          language: '英语IMAX'
        },
        {
          id: 3,
          time: '19:20',
          hall: '3号杜比厅',
          price: '¥55',
          language: '国语杜比'
        },
        {
          id: 4,
          time: '21:30',
          hall: '4号4D厅',
          price: '¥75',
          language: '英语4D'
        }
      ];
    },

    selectTime(timeSlot) {
      this.selectedTime = timeSlot;
      this.selectedSeats = [];
      this.generateSeats();
    },

    generateSeats() {
      // 生成座位数据
      this.seats = [];
      const rows = 8;
      const cols = 12;
      
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          // 随机设置一些座位已售
          const status = Math.random() > 0.7 ? 'sold' : 'available';
          // 前两排为VIP座位
          const type = i < 2 ? 'vip' : 'normal';
          row.push({
            status,
            type,
            row: i,
            number: j
          });
        }
        this.seats.push(row);
      }
    },

    selectSeat(seat, row, number) {
      if (seat.status === 'sold') return;
      
      if (seat.status === 'selected') {
        seat.status = 'available';
        this.selectedSeats = this.selectedSeats.filter(s => !(s.row === row && s.number === number));
      } else {
        if (this.selectedSeats.length >= 6) {
          alert('最多选择6个座位');
          return;
        }
        seat.status = 'selected';
        this.selectedSeats.push({ row, number });
      }
    },

    confirmOrder() {
      if (this.selectedSeats.length === 0) {
        alert('请选择座位');
        return;
      }
      this.showTicketModal = false;
      this.showPaymentModal = true;
    },

    simulatePayment() {
      // 生成取票码
      this.ticketNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
      this.showPaymentModal = false;
      this.showSuccessModal = true;
    },

    closeTicketModal() {
      this.showTicketModal = false;
      this.selectedMovie = null;
      this.selectedTime = null;
      this.selectedSeats = [];
    },

    closePaymentModal() {
      this.showPaymentModal = false;
    },

    closeSuccessModal() {
      this.showSuccessModal = false;
      this.selectedMovie = null;
      this.selectedTime = null;
      this.selectedSeats = [];
    }
  }
};
</script>

<style scoped>
/* 原有样式保持不变，只添加地图相关样式 */
.cinema-search-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0f19 0%, #1a1f2e 100%);
  padding: 2rem;
}

.search-header {
  max-width: 1400px;
  margin: 0 auto 2rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  color: #00f7ff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
}

.page-subtitle {
  color: #b0b8c0;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.search-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search-input-container {
  display: flex;
  background: rgba(10, 15, 25, 0.8);
  border: 1px solid rgba(0, 247, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.1);
}

.search-input {
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 1rem;
  min-width: 300px;
  outline: none;
}

.search-input::placeholder {
  color: #8d9ba8;
}

.search-btn {
  background: linear-gradient(90deg, #00f7ff, #00a8b0);
  color: #0a0f19;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
}

.search-status {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.search-status.success {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.search-status.error {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.search-status.info {
  background: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  border: 1px solid rgba(0, 247, 255, 0.3);
}

.search-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  gap: 2rem;
  height: 600px;
}

.map-container {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 247, 255, 0.3);
  position: relative;
  background: rgba(10, 15, 25, 0.6);
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #b0b8c0;
}

.placeholder-content i {
  font-size: 4rem;
  color: rgba(0, 247, 255, 0.3);
  margin-bottom: 1rem;
}

.placeholder-content h3 {
  color: #00f7ff;
  margin-bottom: 0.5rem;
}

.placeholder-cinemas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.placeholder-cinema {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cinema-dot {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #00f7ff, #00a8b0);
  border-radius: 50%;
  margin-bottom: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.map {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
}

/* 模拟地图样式 */
.map-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.fallback-content {
  text-align: center;
  padding: 2rem;
  color: white;
  width: 100%;
}

.fallback-content h3 {
  color: #00f7ff;
  margin-bottom: 1rem;
}

.fallback-map {
  width: 100%;
  height: 400px;
  position: relative;
  margin: 2rem 0;
  border: 2px solid rgba(0, 247, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px),
    repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px);
}

.fallback-marker {
  position: absolute;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ff3366, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  border: 2px solid white;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
  z-index: 10;
}

.fallback-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.8);
}

.fallback-marker i {
  font-size: 14px;
}

.marker-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  border: 1px solid #00f7ff;
  font-size: 12px;
}

.fallback-marker:hover .marker-tooltip {
  opacity: 1;
}

.fallback-note {
  color: #b0b8c0;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.results-sidebar {
  width: 350px;
  background: rgba(10, 15, 25, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 247, 255, 0.3);
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.results-title {
  padding: 1.5rem;
  margin: 0;
  background: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
}

.search-stats {
  padding: 0.75rem 1rem;
  background: rgba(0, 247, 255, 0.05);
  border-bottom: 1px solid rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cinema-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cinema-item {
  background: rgba(18, 26, 43, 0.8);
  border: 1px solid rgba(0, 247, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cinema-item:hover {
  border-color: rgba(0, 247, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 247, 255, 0.2);
}

.cinema-item.active {
  border-color: #00f7ff;
  background: rgba(0, 247, 255, 0.1);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
}

.cinema-info {
  flex: 1;
}

.cinema-name {
  color: #00f7ff;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.cinema-address,
.cinema-tel {
  color: #b0b8c0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cinema-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid;
}

.rating-tag {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border-color: rgba(255, 193, 7, 0.3);
}

.price-tag {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border-color: rgba(40, 167, 69, 0.3);
}

.cinema-features {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.feature-tag {
  background: rgba(255, 51, 102, 0.2);
  color: #ff3366;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  border: 1px solid rgba(255, 51, 102, 0.3);
}

.cinema-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  border: 1px solid rgba(0, 247, 255, 0.3);
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(0, 247, 255, 0.2);
  border-color: rgba(0, 247, 255, 0.6);
}

.ticket-btn {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border-color: rgba(255, 193, 7, 0.3);
}

.ticket-btn:hover {
  background: rgba(255, 193, 7, 0.3);
  border-color: rgba(255, 193, 7, 0.6);
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #8d9ba8;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: rgba(0, 247, 255, 0.5);
}

.empty-tip {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.demo-btn {
  background: linear-gradient(90deg, #00f7ff, #00a8b0);
  color: #0a0f19;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 247, 255, 0.3);
  border-top: 4px solid #00f7ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 购票弹窗样式 */
.ticket-modal {
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.movie-selection, .time-selection, .seat-selection {
  margin-bottom: 2rem;
}

.movie-selection h4, .time-selection h4, .seat-selection h4 {
  color: #00f7ff;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.movie-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid rgba(0, 247, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.movie-item:hover {
  border-color: rgba(0, 247, 255, 0.5);
  background: rgba(0, 247, 255, 0.05);
}

.movie-item.active {
  border-color: #00f7ff;
  background: rgba(0, 247, 255, 0.1);
}

.movie-poster {
  width: 60px;
  height: 80px;
  border-radius: 4px;
  margin-right: 1rem;
  background: rgba(0, 247, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00f7ff;
  font-size: 1.5rem;
}

.movie-info h5 {
  color: #e0e0e0;
  margin-bottom: 0.5rem;
}

.movie-duration, .movie-type {
  color: #b0b8c0;
  font-size: 0.8rem;
  margin: 0.2rem 0;
}

.time-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.time-item {
  padding: 1rem;
  border: 1px solid rgba(0, 247, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.time-item:hover {
  border-color: rgba(0, 247, 255, 0.5);
  background: rgba(0, 247, 255, 0.05);
}

.time-item.active {
  border-color: #00f7ff;
  background: rgba(0, 247, 255, 0.1);
}

.time-info {
  margin-bottom: 0.5rem;
}

.time {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #00f7ff;
}

.hall {
  font-size: 0.8rem;
  color: #b0b8c0;
}

.price-info .price {
  color: #ffc107;
  font-weight: bold;
}

.price-info .language {
  font-size: 0.8rem;
  color: #b0b8c0;
}

.screen {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 247, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 2rem;
  color: #00f7ff;
  font-weight: bold;
  border: 1px solid rgba(0, 247, 255, 0.3);
}

.seats-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0, 247, 255, 0.05);
  border-radius: 8px;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.row-label {
  width: 30px;
  text-align: center;
  color: #b0b8c0;
  font-size: 0.8rem;
  font-weight: bold;
}

.seat {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
  font-weight: bold;
}

.seat.available {
  background: rgba(40, 167, 69, 0.3);
  color: #28a745;
  border-color: rgba(40, 167, 69, 0.7);
}

.seat.selected {
  background: rgba(0, 247, 255, 0.3);
  color: #00f7ff;
  border-color: rgba(0, 247, 255, 0.7);
  transform: scale(1.1);
}

.seat.sold {
  background: rgba(108, 117, 125, 0.3);
  color: #6c757d;
  border-color: rgba(108, 117, 125, 0.7);
  cursor: not-allowed;
}

.seat.vip {
  background: rgba(255, 193, 7, 0.3);
  color: #ffc107;
  border-color: rgba(255, 193, 7, 0.7);
  position: relative;
}

.seat.vip::after {
  content: 'VIP';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: #ffc107;
  white-space: nowrap;
}

.seat-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0, 247, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(0, 247, 255, 0.2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e0e0e0;
  font-size: 0.9rem;
}

.seat-sample {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid;
}

.seat-sample.available {
  background: rgba(40, 167, 69, 0.3);
  border-color: rgba(40, 167, 69, 0.7);
}

.seat-sample.selected {
  background: rgba(0, 247, 255, 0.3);
  border-color: rgba(0, 247, 255, 0.7);
}

.seat-sample.sold {
  background: rgba(108, 117, 125, 0.3);
  border-color: rgba(108, 117, 125, 0.7);
}

.seat-sample.vip {
  background: rgba(255, 193, 7, 0.3);
  border-color: rgba(255, 193, 7, 0.7);
}

.order-summary {
  background: rgba(0, 247, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 247, 255, 0.2);
}

.order-summary h4 {
  color: #00f7ff;
  margin-bottom: 1rem;
}

.summary-details p {
  margin: 0.5rem 0;
  color: #e0e0e0;
}

.total-price {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 247, 255, 0.2);
  font-weight: bold;
  color: #ffc107;
}

.total-price span {
  font-size: 1.2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-outline {
  background: transparent;
  color: #b0b8c0;
  border: 1px solid rgba(0, 247, 255, 0.3);
}

.btn-outline:hover {
  border-color: rgba(0, 247, 255, 0.6);
  color: #00f7ff;
}

.btn-primary {
  background: linear-gradient(90deg, #00f7ff, #00a8b0);
  color: #0a0f19;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-success {
  background: linear-gradient(90deg, #28a745, #20c997);
  color: white;
  border: none;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(40, 167, 69, 0.4);
}

/* 支付弹窗样式 */
.payment-modal {
  max-width: 600px;
}

.payment-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.qr-code {
  flex: 1;
  text-align: center;
}

.qr-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 2px solid rgba(0, 247, 255, 0.3);
  object-fit: cover;
}

.qr-tip {
  color: #b0b8c0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.order-details {
  flex: 1;
}

.order-details h4 {
  color: #00f7ff;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(0, 247, 255, 0.1);
}

.detail-item label {
  width: 80px;
  color: #b0b8c0;
}

.detail-item span {
  flex: 1;
  color: #e0e0e0;
}

.detail-item.total {
  border-bottom: none;
  font-weight: bold;
  margin-top: 1rem;
}

.detail-item.total .amount {
  color: #ffc107;
  font-size: 1.2rem;
}

.payment-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* 成功弹窗样式 */
.success-modal {
  max-width: 500px;
}

.success-content {
  text-align: center;
  margin-bottom: 2rem;
}

.success-content i {
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.success-content h4 {
  color: #28a745;
  margin-bottom: 0.5rem;
}

.success-content p {
  color: #b0b8c0;
  margin-bottom: 2rem;
}

.ticket-info {
  display: flex;
  gap: 2rem;
  background: rgba(0, 247, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 247, 255, 0.2);
}

.ticket-qr {
  flex: 1;
}

.ticket-qr-placeholder {
  width: 120px;
  height: 120px;
  background: rgba(0, 247, 255, 0.1);
  border: 2px dashed rgba(0, 247, 255, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #00f7ff;
  position: relative;
}

.ticket-details {
  flex: 2;
  text-align: left;
}

.ticket-details p {
  margin: 0.5rem 0;
  color: #e0e0e0;
}

.ticket-number {
  font-weight: bold;
  color: #ffc107;
  margin-top: 1rem;
  font-size: 1.1rem;
}

.ticket-note {
  font-size: 0.9rem;
  color: #8d9ba8;
  margin-top: 0.5rem;
}

/* 模态框通用样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(135deg, #1a1f2e 0%, #0a0f19 100%);
  border-radius: 12px;
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 247, 255, 0.2);
  width: 100%;
  max-width: 90vw;
  animation: modalAppear 0.3s ease-out;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #00f7ff;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #b0b8c0;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.btn-close:hover {
  color: #00f7ff;
  background: rgba(0, 247, 255, 0.1);
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .search-content {
    flex-direction: column;
    height: auto;
  }
  
  .results-sidebar {
    width: 100%;
    height: 400px;
  }
  
  .map-container {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .cinema-search-page {
    padding: 1rem;
  }
  
  .search-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input-container {
    min-width: auto;
  }
  
  .search-input {
    min-width: auto;
  }
  
  .cinema-item {
    flex-direction: column;
  }
  
  .cinema-actions {
    margin-top: 1rem;
    width: 100%;
    justify-content: flex-end;
  }
  
  .payment-info {
    flex-direction: column;
  }
  
  .ticket-info {
    flex-direction: column;
  }
  
  .seat-legend {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .seat.vip::after {
    display: none;
  }
}
</style>