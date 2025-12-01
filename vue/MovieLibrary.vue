<template>
  <div class="movie-library-page">
    <div class="page-header">
      <div class="container">
        <h1>电影库</h1>
        <p>探索丰富的电影资源，发现更多精彩内容</p>
      </div>
    </div>

    <!-- 音频播放器 -->
    <div v-if="currentVoice" class="voice-player">
      <div class="player-content">
        <div class="player-info">
          <h4>正在播放：{{ currentVoice.movieTitle }}</h4>
          <p>{{ currentVoice.line }}</p>
        </div>
        <div class="player-controls">
          <button class="control-btn" @click="togglePlay">
            <i :class="isPlaying ? 'fa fa-pause' : 'fa fa-play'"></i>
          </button>
          <button class="control-btn" @click="stopVoice">
            <i class="fa fa-stop"></i>
          </button>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
        </div>
      </div>
    </div>

    <div class="library-content">
      <div class="container">
        <!-- 搜索和筛选 -->
        <div class="search-filters">
          <div class="search-box">
            <i class="fa fa-search"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索电影名称、导演、演员..."
              class="search-input"
              @input="handleSearch"
            >
          </div>

          <div class="filter-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
              @click="handleTabChange(tab.id)"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- 电影网格 -->
        <div class="movies-grid">
          <div
            v-for="movie in filteredMovies"
            :key="movie.id"
            class="movie-card"
          >
            <div class="movie-poster" @click="playMovieAudio(movie)">
              <img :src="movie.poster" :alt="movie.title">
              <div class="movie-rating">{{ movie.rating }}</div>
              
              <!-- 音频可用标识 -->
              <div v-if="movie.voices && movie.voices.length > 0" class="audio-available">
                <i class="fa fa-volume-up"></i>
              </div>
              
              <!-- 播放按钮 -->
              <div class="movie-overlay" v-if="movie.voices && movie.voices.length > 0">
                <button class="play-btn" @click.stop="playMovieAudio(movie)">
                  <i :class="getPlayButtonIcon(movie)"></i>
                </button>
              </div>
              
              <!-- 播放状态指示器 -->
              <div 
                v-if="currentMovieVoice && currentMovieVoice.movieId === movie.id" 
                class="playing-indicator"
                :class="{ playing: isPlaying }"
              >
                <i class="fa fa-volume-up"></i>
                <span>{{ isPlaying ? '播放中...' : '已暂停' }}</span>
              </div>
            </div>

            <div class="movie-info">
              <!-- 经典台词部分 -->
              <div v-if="movie.voices && movie.voices.length > 0" class="voice-section">
                <div class="voice-title">经典台词</div>
                <div class="voice-list">
                  <div
                    v-for="(voice, index) in movie.voices"
                    :key="index"
                    class="voice-item"
                    :class="{ active: currentVoice && currentVoice.id === voice.id }"
                    @click="playVoice(voice, movie.title, movie.id)"
                  >
                    <div class="voice-line">{{ voice.line }}</div>
                    <div class="voice-controls">
                      <i :class="
                        currentVoice && currentVoice.id === voice.id && isPlaying
                          ? 'fa fa-pause'
                          : 'fa fa-play'
                      "></i>
                    </div>
                  </div>
                </div>
              </div>

              <h3>{{ movie.title }}</h3>
              <p class="movie-year">{{ movie.year }}</p>
              <p class="movie-genre">{{ movie.genre.join(' / ') }}</p>
              <div class="movie-actions">
                <button class="action-btn">
                  <i class="fa fa-heart"></i>
                </button>
                <button class="action-btn">
                  <i class="fa fa-share"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 没有电影时的提示 -->
        <div v-if="filteredMovies.length === 0" class="no-results">
          <i class="fa fa-film"></i>
          <h3>暂无电影</h3>
          <p>尝试调整筛选条件或搜索关键词</p>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="filteredMovies.length > 0">
          <button class="btn btn-outline" @click="loadMore">
            <i class="fa fa-refresh"></i>
            加载更多
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieLibrary',
  data() {
    return {
      searchQuery: '',
      activeTab: 'all',
      currentPage: 1,
      itemsPerPage: 12,
      currentMovieVoice: null,
      
      // 音频播放相关数据
      audio: null,
      isPlaying: false,
      currentVoice: null,
      currentTime: 0,
      duration: 0,
      progress: 0,
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'action', name: '动作' },
      { id: 'drama', name: '剧情' },
      { id: 'comedy', name: '喜剧' },
      { id: 'sci-fi', name: '科幻' },
      { id: 'fantasy', name: '奇幻' },
      { id: 'animation', name: '动漫' }
    ], // ← 这里必须有逗号
    
    // 语音播放相关数据
    audio: null,
    isPlaying: false,
    currentVoice: null,
    currentTime: 0,
    duration: 0,
    progress: 0,
    allMovies: [
 {
    id: 1,
    title: '肖申克的救赎',
    year: 1994,
    rating: 9.7,
    genre: ['剧情', '犯罪'],
    poster: '/2a8ac1d2844ba65e15d8bcdb5c6a7651.png'
  },
  {
    id: 2,
    title: '霸王别姬',
    year: 1993,
    rating: 9.6,
    genre: ['剧情', '爱情'],
    poster: '/p1488213971.webp',
    voices: [
    {
      id: 'bw1',
      line: '说的是一辈子！差一年，一个月，一天，一个时辰，都不算一辈子！',
      audioUrl: '/yingping/2025年11月09日 11点20分(2).m4a'
    },
  ]
  },
  {
    id: 3,
    title: '阿甘正传',
    year: 1994,
    rating: 9.5,
    genre: ['剧情', '爱情'],
    poster: '/p1484728154.webp'
  },
  {
    id: 4,
    title: '这个杀手不太冷',
    year: 1994,
    rating: 9.4,
    genre: ['剧情', '动作', '犯罪'],
    poster: '/p2913554676.webp'
  },
  {
    id: 5,
    title: '泰坦尼克号',
    year: 1997,
    rating: 9.4,
    genre: ['剧情', '爱情'],
    poster: '/p457760035.webp'
  },
  {
    id: 6,
    title: '千与千寻',
    year: 2001,
    rating: 9.4,
    genre: ['动画', '奇幻', '冒险'],
    poster: '/p2557573348.webp'
  },
  {
    id: 7,
    title: '盗梦空间',
    year: 2010,
    rating: 9.3,
    genre: ['剧情', '科幻', '悬疑'],
    poster: '/p2616355133.webp'
  },
  {
    id: 8,
    title: '星际穿越',
    year: 2014,
    rating: 9.3,
    genre: ['剧情', '科幻', '冒险'],
    poster: '/p2207216219.webp'
  },
  {
    id: 9,
    title: '楚门的世界',
    year: 1998,
    rating: 9.3,
    genre: ['剧情', '科幻'],
    poster: '/p2559710521.webp'
  },
  {
    id: 10,
    title: '海上钢琴师',
    year: 1998,
    rating: 9.3,
    genre: ['剧情', '音乐'],
    poster: '/p2914698334.webp'
  },
  {
    id: 11,
    title: '疯狂动物城',
    year: 2016,
    rating: 9.2,
    genre: ['动画', '喜剧', '冒险'],
    poster: '/疯狂动物城.png'
  },
  {
    id: 12,
    title: '教父',
    year: 1972,
    rating: 9.3,
    genre: ['剧情', '犯罪'],
    poster: '/教父.webp'
  },
  {
    id: 13,
    title: '教父2',
    year: 1974,
    rating: 9.2,
    genre: ['剧情', '犯罪'],
    poster: '/教父2.webp'
  },
  {
    id: 14,
    title: '教父3',
    year: 1990,
    rating: 8.9,
    genre: ['剧情', '犯罪'],
    poster: '/教父3.webp'
  },
  {
    id: 15,
    title: '低俗小说',
    year: 1994,
    rating: 8.9,
    genre: ['剧情', '犯罪'],
    poster: '/低俗小说.webp'
  },
  {
    id: 16,
    title: '搏击俱乐部',
    year: 1999,
    rating: 9.0,
    genre: ['剧情', '动作', '悬疑'],
    poster: '/搏击俱乐部.webp'
  },
  {
    id: 17,
    title: '指环王：护戒使者',
    year: 2001,
    rating: 9.0,
    genre: ['剧情', '奇幻', '冒险'],
    poster: '/p2197698335.webp'
  },
  {
    id: 18,
    title: '指环王：双塔奇兵',
    year: 2002,
    rating: 9.1,
    genre: ['剧情', '奇幻', '冒险'],
    poster: '/p2640236255.webp'
  },
  {
    id: 19,
    title: '指环王：王者无敌',
    year: 2003,
    rating: 9.2,
    genre: ['剧情', '奇幻', '冒险'],
    poster: '/p2197533758.webp'
  },
  {
    id: 20,
    title: '哈利·波特与魔法石',
    year: 2001,
    rating: 8.9,
    genre: ['奇幻', '冒险'],
    poster: '/p2913781448.webp'
  },
  {
    id: 21,
    title: '哈利·波特与死亡圣器(下)',
    year: 2011,
    rating: 8.9,
    genre: ['奇幻', '冒险'],
    poster: '/p2913457020.webp'
  },
  {
    id: 22,
    title: '阿凡达',
    year: 2009,
    rating: 8.7,
    genre: ['动作', '科幻', '冒险'],
    poster: '/p2634997853.webp'
  },
  {
    id: 23,
    title: '复仇者联盟4：终局之战',
    year: 2019,
    rating: 8.5,
    genre: ['动作', '科幻', '冒险'],
    poster: '/p2552058346.webp'
  },
  {
    id: 24,
    title: '蜘蛛侠：平行宇宙',
    year: 2018,
    rating: 8.6,
    genre: ['动画', '动作', '冒险'],
    poster: '/p2542867516.webp'
  },
  {
    id: 25,
    title: '寻梦环游记',
    year: 2017,
    rating: 9.1,
    genre: ['动画', '奇幻', '音乐'],
    poster: '/p2503997609.webp'
  },
  {
    id: 26,
    title: '你的名字。',
    year: 2016,
    rating: 8.9,
    genre: ['动画', '剧情', '爱情'],
    poster: '/p2395733377.webp'
  },
  {
    id: 27,
    title: '流浪地球',
    year: 2019,
    rating: 8.4,
    genre: ['科幻', '冒险', '灾难'],
    poster: '/p2545472803.webp'
  },
  {
    id: 28,
    title: '哪吒之魔童降世',
    year: 2019,
    rating: 8.8,
    genre: ['动画', '奇幻', '喜剧'],
    poster: '/p2563780504.webp'
  },
  {
    id: 29,
    title: '让子弹飞',
    year: 2010,
    rating: 8.9,
    genre: ['剧情', '喜剧', '动作'],
    poster: '/p1512562287.webp'
  },
  {
    id: 30,
    title: '无间道',
    year: 2002,
    rating: 9.2,
    genre: ['剧情', '犯罪', '悬疑'],
    poster: '/p2564556863.webp'
  },
  {
    id: 31,
    title: '大话西游之大圣娶亲',
    year: 1995,
    rating: 9.2,
    genre: ['喜剧', '爱情', '奇幻'],
    poster: '/p2455050536.webp'
  },
  {
    id: 32,
    title: '星际迷航',
    year: 2009,
    rating: 8.3,
    genre: ['科幻', '动作', '冒险'],
    poster: '/p455374656.webp'
  },
  {
    id: 33,
    title: '蝙蝠侠：黑暗骑士',
    year: 2008,
    rating: 9.2,
    genre: ['动作', '犯罪', '剧情'],
    poster: '/p2918376900.webp'
  },
  {
    id: 34,
    title: 'V字仇杀队',
    year: 2005,
    rating: 8.9,
    genre: ['剧情', '动作', '科幻'],
    poster: '/v字仇杀队.webp'
  },
  {
    id: 35,
    title: '美丽人生',
    year: 1997,
    rating: 9.5,
    genre: ['剧情', '喜剧', '爱情'],
    poster: '/p2578474613.webp'
  },
  {
    id: 36,
    title: '辛德勒的名单',
    year: 1993,
    rating: 9.5,
    genre: ['剧情', '历史', '战争'],
    poster: '/p492406163.webp'
  },
  {
    id: 37,
    title: '乱世佳人',
    year: 1939,
    rating: 9.3,
    genre: ['剧情', '爱情', '历史'],
    poster: '/乱世佳人.webp'
  },
  {
    id: 38,
    title: '罗马假日',
    year: 1953,
    rating: 9.1,
    genre: ['喜剧', '剧情', '爱情'],
    poster: '/罗马假日.webp'
  },
  {
    id: 39,
    title: '音乐之声',
    year: 1965,
    rating: 9.1,
    genre: ['剧情', '爱情', '歌舞'],
    poster: '/音乐之声.webp'
  },
  {
    id: 40,
    title: '卡萨布兰卡',
    year: 1942,
    rating: 8.8,
    genre: ['剧情', '爱情', '战争'],
    poster: '/卡萨布兰卡.webp'
  },
  {
    id: 41,
    title: '飞屋环游记',
    year: 2009,
    rating: 9.0,
    genre: ['动画', '喜剧', '冒险'],
    poster: '/p485861312.webp'
  },
  {
    id: 42,
    title: '机器人总动员',
    year: 2008,
    rating: 9.3,
    genre: ['动画', '科幻', '爱情'],
    poster: '/p1461851991.webp'
  },
  {
    id: 43,
    title: '狮子王',
    year: 1994,
    rating: 9.1,
    genre: ['动画', '歌舞', '冒险'],
    poster: '/狮子王.webp'
  },
  {
    id: 44,
    title: '幽灵公主',
    year: 1997,
    rating: 8.9,
    genre: ['动画', '奇幻', '冒险'],
    poster: '/p2920895053.webp'
  },
  {
    id: 45,
    title: '风之谷',
    year: 1984,
    rating: 8.9,
    genre: ['动画', '奇幻', '科幻'],
    poster: '/p2925052941.webp'
  },
  {
    id: 46,
    title: '天空之城',
    year: 1986,
    rating: 9.1,
    genre: ['动画', '奇幻', '冒险'],
    poster: '/p2892409201.webp'
  },
  {
    id: 47,
    title: '龙猫',
    year: 1988,
    rating: 9.2,
    genre: ['动画', '奇幻', '家庭'],
    poster: '/p2540924496.webp'
  },
  {
    id: 48,
    title: '魔女宅急便',
    year: 1989,
    rating: 8.7,
    genre: ['动画', '奇幻', '冒险'],
    poster: '/魔女宅急便.webp'
  },
  {
    id: 49,
    title: '红猪',
    year: 1992,
    rating: 8.5,
    genre: ['动画', '喜剧', '奇幻'],
    poster: '/p2899263477.webp'
  },
  {
    id: 50,
    title: '侧耳倾听',
    year: 1995,
    rating: 8.9,
    genre: ['动画', '剧情', '爱情'],
    poster: '/侧耳倾听.webp'
  },
  {
    id: 51,
    title: '星际宝贝',
    year: 2002,
    rating: 8.2,
    genre: ['动画', '科幻', '喜剧'],
    poster: '/星际宝贝.webp'
  },
  {
    id: 52,
    title: '超人总动员',
    year: 2004,
    rating: 8.0,
    genre: ['动画', '动作', '喜剧'],
    poster: '/p2221537622.webp'
  },
  {
    id: 53,
    title: '美食总动员',
    year: 2007,
    rating: 8.5,
    genre: ['动画', '喜剧', '奇幻'],
    poster: '/p1803013164.webp'
  },
  {
    id: 54,
    title: '头脑特工队',
    year: 2015,
    rating: 8.7,
    genre: ['动画', '喜剧', '冒险'],
    poster: '/p2266293606.webp'
  },
  {
    id: 55,
    title: '疯狂原始人',
    year: 2013,
    rating: 8.7,
    genre: ['动画', '喜剧', '冒险'],
    poster: '/p1929817553.webp'
  },
  {
    id: 56,
    title: '功夫熊猫',
    year: 2008,
    rating: 8.1,
    genre: ['动画', '动作', '喜剧'],
    poster: '/p2243416891.webp'
  },
  {
    id: 57,
    title: '驯龙高手',
    year: 2010,
    rating: 8.7,
    genre: ['动画', '奇幻', '冒险'],
    poster: '/p490385643.webp'
  },
  {
    id: 58,
    title: '冰雪奇缘',
    year: 2013,
    rating: 8.4,
    genre: ['动画', '歌舞', '奇幻'],
    poster: '/p2166640945.webp'
  },
  {
    id: 59,
    title: '超能陆战队',
    year: 2014,
    rating: 8.6,
    genre: ['动画', '动作', '科幻'],
    poster: '/p2224568669.webp'
  },
  {
    id: 60,
    title: '蜘蛛侠：英雄无归',
    year: 2021,
    rating: 8.3,
    genre: ['动作', '科幻', '冒险'],
    poster: '/p2729512362.webp'
  }
]
    }
  },
  computed: {
    filteredMovies() {
      console.log('开始筛选电影...', this.activeTab, this.searchQuery);
      
      let filtered = this.allMovies;
      
      // 按标签筛选
      if (this.activeTab !== 'all') {
        const genreMap = {
          'action': '动作',
          'drama': '剧情', 
          'comedy': '喜剧',
          'sci-fi': '科幻',
          'fantasy': '奇幻',
          'animation': '动画'
        };
        
        const targetGenre = genreMap[this.activeTab];
        filtered = filtered.filter(movie => 
          movie.genre.includes(targetGenre)
        );
        console.log('按类型筛选后:', filtered.length);
      }
      
      // 按搜索词筛选
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(movie => 
          movie.title.toLowerCase().includes(query) ||
          movie.genre.some(genre => genre.toLowerCase().includes(query))
        );
        console.log('按搜索词筛选后:', filtered.length);
      }
      
      // 分页
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const paginated = filtered.slice(0, startIndex + this.itemsPerPage);
      console.log('分页后:', paginated.length);
      
      return paginated;
    }
  },
 methods: {
    // 播放电影音频（点击电影海报或播放按钮）
    playMovieAudio(movie) {
      if (!movie.voices || movie.voices.length === 0) {
        console.log('该电影没有音频');
        return;
      }

      // 如果正在播放同一部电影，切换播放/暂停
      if (this.currentMovieVoice && this.currentMovieVoice.movieId === movie.id) {
        this.togglePlay();
        return;
      }

      // 播放电影的第一个音频
      const voice = movie.voices[0];
      this.playVoice(voice, movie.title, movie.id);
    },

    // 获取播放按钮图标
    getPlayButtonIcon(movie) {
      if (this.currentMovieVoice && this.currentMovieVoice.movieId === movie.id && this.isPlaying) {
        return 'fa fa-pause';
      }
      return 'fa fa-play';
    },

    // 播放语音
    playVoice(voice, movieTitle, movieId) {
      // 停止当前播放
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      // 设置当前播放的电影
      this.currentMovieVoice = {
        id: voice.id,
        movieId: movieId,
        movieTitle: movieTitle,
        audioUrl: voice.audioUrl
      };

      this.currentVoice = {
        ...voice,
        movieTitle: movieTitle
      };

      // 创建音频对象
      this.audio = new Audio(voice.audioUrl);
      
      // 设置事件监听
      this.setupAudioEvents();
      
      // 播放音频
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('播放失败:', error);
        this.handleAudioError(error);
      });
    },

    // 设置音频事件监听
    setupAudioEvents() {
      this.audio.addEventListener('loadedmetadata', () => {
        this.duration = this.audio.duration;
      });

      this.audio.addEventListener('timeupdate', () => {
        this.currentTime = this.audio.currentTime;
        if (this.audio.duration) {
          this.progress = (this.audio.currentTime / this.audio.duration) * 100;
        }
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.progress = 0;
        this.currentVoice = null;
        this.currentMovieVoice = null;
      });

      this.audio.addEventListener('error', (e) => {
        console.error('音频错误:', e);
        this.handleAudioError(e);
      });
    },

    // 处理音频错误
    handleAudioError(error) {
      console.error('音频播放错误:', error);
      let message = '音频播放失败';
      
      switch (error.name) {
        case 'NotSupportedError':
          message = '浏览器不支持此音频格式';
          break;
        case 'NotAllowedError':
          message = '播放被浏览器阻止，请点击页面后重试';
          break;
        case 'NetworkError':
          message = '网络错误，音频文件加载失败';
          break;
        default:
          message = `播放失败: ${error.message}`;
      }
      
      alert(message);
      this.isPlaying = false;
      this.currentVoice = null;
      this.currentMovieVoice = null;
    },

    // 切换播放/暂停
    togglePlay() {
      if (!this.audio) return;
      
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play().then(() => {
          this.isPlaying = true;
        }).catch(error => {
          console.error('播放失败:', error);
        });
      }
    },

    // 停止播放
    stopVoice() {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.currentTime = 0;
        this.progress = 0;
        this.currentVoice = null;
        this.currentMovieVoice = null;
      }
    },

    // 格式化时间
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // 键盘快捷键处理
    handleKeyPress(event) {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return; // 在输入框中不触发快捷键
      }
      
      switch(event.code) {
        case 'Space':
          event.preventDefault();
          this.togglePlay();
          break;
        case 'Escape':
          this.stopVoice();
          break;
      }
    },

    // 原有的其他方法
    handleTabChange(tabId) {
      console.log('切换标签:', tabId);
      this.activeTab = tabId;
      this.currentPage = 1;
      this.$nextTick(() => {
        console.log('当前显示电影数量:', this.filteredMovies.length);
      });
    },

    handleSearch() {
      console.log('搜索关键词:', this.searchQuery);
      this.currentPage = 1;
      this.$nextTick(() => {
        console.log('搜索后电影数量:', this.filteredMovies.length);
      });
    },

    loadMore() {
      this.currentPage++;
      console.log('加载更多，当前页码:', this.currentPage);
    }
  },

  mounted() {
    console.log('电影库组件加载完成');
    console.log('初始电影数据:', this.allMovies.length);
    console.log('初始筛选结果:', this.filteredMovies.length);
    
    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleKeyPress);
  },

  beforeUnmount() {
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeyPress);
    
    // 清理音频
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
};
</script>

<style scoped>
/* 添加没有结果的样式 */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: #a0a8b0;
  background: rgba(10, 15, 25, 0.7);
  border-radius: 12px;
  margin: 2rem 0;
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 247, 255, 0.1);
}

.no-results i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #00f7ff;
  text-shadow: 0 0 15px rgba(0, 247, 255, 0.7);
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00f7ff;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
}

.no-results p {
  font-size: 1.1rem;
  color: #b0b8c0;
}

/* 其他样式保持不变 */
.movie-library-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0f19 0%, #1a1f2e 100%);
  color: #e0e0e0;
  font-family: 'Arial', sans-serif;
}

.page-header {
  background: linear-gradient(135deg, 
    rgba(10, 15, 25, 0.9) 0%, 
    rgba(30, 40, 70, 0.9) 50%, 
    rgba(10, 15, 25, 0.9) 100%);
  color: #e0e0e0;
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 247, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 0, 150, 0.1) 0%, transparent 50%);
  z-index: 0;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #00f7ff;
  text-shadow: 0 0 15px rgba(0, 247, 255, 0.7);
  position: relative;
  z-index: 1;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
  color: #b0b8c0;
}

.library-content {
  padding: 3rem 0;
}

.search-filters {
  background: rgba(10, 15, 25, 0.85);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 
    0 0 20px rgba(0, 247, 255, 0.2),
    0 5px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 247, 255, 0.3);
  backdrop-filter: blur(5px);
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto 2rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #00f7ff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.7);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(0, 247, 255, 0.5);
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(20, 25, 35, 0.8);
  color: #e0e0e0;
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #00f7ff;
  box-shadow: 0 0 0 3px rgba(0, 247, 255, 0.2), 0 0 20px rgba(0, 247, 255, 0.3);
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(0, 247, 255, 0.5);
  background: rgba(20, 25, 35, 0.8);
  color: #b0b8c0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.1);
}

.tab-btn.active,
.tab-btn:hover {
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  color: #0a0f19;
  border-color: #00f7ff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 247, 255, 0.4);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.movie-card {
  background: rgba(10, 15, 25, 0.85);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 5px 20px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(0, 247, 255, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 247, 255, 0.2);
  position: relative;
}

.movie-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-radius: 12px;
  background: linear-gradient(135deg, 
    rgba(0, 247, 255, 0.3) 0%, 
    transparent 30%, 
    transparent 70%, 
    rgba(255, 0, 150, 0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.movie-card:hover {
  transform: translateY(-10px);
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(0, 247, 255, 0.3);
}

.movie-card:hover::before {
  opacity: 1;
}

.movie-poster {
  position: relative;
  height: 400px;
  overflow: hidden;
  cursor: pointer;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster img {
  transform: scale(1.1);
}

.movie-rating {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 247, 255, 0.9);
  color: #0a0f19;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
  z-index: 2;
}

/* 播放状态指示器 */
.playing-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #00ff99, #00cc77);
  color: #0a0f19;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
  animation: pulse 2s infinite;
  box-shadow: 0 2px 8px rgba(0, 255, 153, 0.4);
  font-weight: 600;
}

.playing-indicator.playing {
  background: linear-gradient(135deg, #ff3366, #cc0044);
  box-shadow: 0 2px 8px rgba(255, 51, 102, 0.4);
}

.playing-indicator i {
  font-size: 0.8rem;
}

/* 播放按钮样式 */
.play-btn {
  width: 70px;
  height: 70px;
  background: rgba(10, 15, 25, 0.9);
  border: 2px solid rgba(0, 247, 255, 0.7);
  border-radius: 50%;
  color: #00f7ff;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(0, 247, 255, 0.3);
  position: relative;
  z-index: 2;
}

.play-btn:hover {
  background: rgba(0, 247, 255, 0.2);
  transform: scale(1.15);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(0, 247, 255, 0.5);
  color: #ffffff;
}

/* 播放图标在电影海报上的微调 */
.play-btn .fa-play {
  position: relative;
  left: 2px;
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.movie-info {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

.movie-info h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #00f7ff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.movie-year {
  color: #a0a8b0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.movie-genre {
  color: #ff3366;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 51, 102, 0.3);
}

.movie-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: 1px solid rgba(0, 247, 255, 0.5);
  background: rgba(20, 25, 35, 0.8);
  color: #b0b8c0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  box-shadow: 0 0 5px rgba(0, 247, 255, 0.1);
}

.action-btn:hover {
  background: rgba(0, 247, 255, 0.2);
  color: #00f7ff;
  border-color: #00f7ff;
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
}

.load-more {
  text-align: center;
}

.load-more .btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  color: #0a0f19;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 247, 255, 0.3);
}

.load-more .btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 247, 255, 0.5);
}

/* 音频播放器控制面板 */
.voice-player {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 15, 25, 0.95);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 247, 255, 0.3);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
  border: 1px solid rgba(0, 247, 255, 0.5);
  backdrop-filter: blur(10px);
}

.player-content {
  padding: 1.2rem;
}

.player-info h4 {
  margin: 0 0 0.5rem 0;
  color: #00f7ff;
  font-size: 1.1rem;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.player-info p {
  margin: 0;
  color: #b0b8c0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.2rem;
}

.control-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  color: #0a0f19;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* 播放/暂停按钮 */
.play-pause-btn {
  background: linear-gradient(135deg, #00f7ff, #0099ff);
  font-size: 1.1rem;
}

.play-pause-btn:hover {
  background: linear-gradient(135deg, #00ccff, #0077cc);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 247, 255, 0.5);
}

/* 播放图标调整 - 三角形稍微向右偏移，看起来更居中 */
.play-pause-btn .fa-play {
  position: relative;
  left: 1px;
}

/* 暂停图标调整 - 两条竖线 */
.play-pause-btn .fa-pause {
  font-size: 1rem;
}

/* 停止按钮 - 增强视觉效果 */
.stop-btn {
  background: linear-gradient(135deg, #ff0066, #ff0033);
  font-size: 1rem;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.3),
    0 0 12px rgba(255, 0, 102, 0.7);
  position: relative;
  animation: stopPulse 2s infinite;
}

.stop-btn:hover {
  background: linear-gradient(135deg, #ff0033, #cc0022);
  transform: scale(1.15);
  box-shadow: 
    0 4px 12px rgba(255, 51, 102, 0.8),
    0 0 18px rgba(255, 0, 68, 0.8);
  animation: none; /* 悬停时停止脉冲动画 */
}

/* 停止图标 - 正方形 */
.stop-btn .fa-stop {
  font-size: 0.9rem;
  position: relative;
  z-index: 2;
}

/* 停止按钮的脉冲动画 */
@keyframes stopPulse {
  0% {
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 12px rgba(255, 0, 102, 0.7);
  }
  50% {
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 18px rgba(255, 0, 102, 0.9),
      0 0 25px rgba(255, 0, 68, 0.6);
  }
  100% {
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 12px rgba(255, 0, 102, 0.7);
  }
}

/* 添加停止按钮的外圈效果 */
.stop-btn::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff0066, #ff0033);
  z-index: -1;
  opacity: 0.4;
  animation: stopRing 2s infinite;
}

@keyframes stopRing {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 0.4;
  }
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(30, 40, 60, 0.8);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 247, 255, 0.3);
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #00f7ff, #ff3366);
  transition: width 0.1s ease;
  border-radius: 3px;
  box-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
}

/* 进度条上的小圆点 */
.progress-bar::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  width: 12px;
  height: 12px;
  background: #00f7ff;
  border-radius: 50%;
  transform: translate(50%, -50%);
  box-shadow: 0 0 0 3px #0a0f19, 0 2px 4px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.progress-bar:hover::after {
  opacity: 1;
}

.time {
  font-size: 0.8rem;
  color: #b0b8c0;
  min-width: 80px;
  text-align: center;
  font-weight: 500;
}

/* 经典台词样式 */
.voice-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 247, 255, 0.2);
}

.voice-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00f7ff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.3);
}

.voice-list {
  space-y: 0.5rem;
}

.voice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid transparent;
}

.voice-item:hover {
  background: rgba(0, 247, 255, 0.1);
  border: 1px solid rgba(0, 247, 255, 0.3);
}

.voice-item.active {
  background: rgba(0, 247, 255, 0.2);
  border: 1px solid rgba(0, 247, 255, 0.5);
}

.voice-line {
  flex: 1;
  font-size: 0.8rem;
  color: #b0b8c0;
  line-height: 1.3;
}

.voice-controls {
  color: #00f7ff;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(46, 204, 113, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .filter-tabs {
    gap: 0.5rem;
  }

  .tab-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .voice-player {
    width: 95%;
    bottom: 10px;
  }
  
  .player-content {
    padding: 1rem;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .play-btn {
    width: 60px;
    height: 60px;
    font-size: 1.6rem;
  }
}
</style>