<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      :class="{'bg-primary/90 backdrop-blur shadow-md py-3': scrollY > 50, 'bg-transparent py-5': scrollY <= 50}"
    >
      <div class="container flex items-center justify-between">
        <a href="#" class="flex items-center gap-2">
          <i class="fa fa-film text-secondary text-3xl"></i>
          <span class="text-2xl font-bold tracking-tight">CINEPLEX</span>
        </a>
        
        <!-- 桌面导航 -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#" class="text-white hover:text-secondary transition-colors font-medium relative group">
            首页
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" class="text-gray-300 hover:text-secondary transition-colors font-medium relative group">
            电影库
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" class="text-gray-300 hover:text-secondary transition-colors font-medium relative group">
            取景地
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" class="text-gray-300 hover:text-secondary transition-colors font-medium relative group">
            排行榜
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#" class="text-gray-300 hover:text-secondary transition-colors font-medium relative group">
            社区
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>
        
        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center bg-white/10 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-secondary/50 transition-all">
            <i class="fa fa-search text-gray-400 mr-2"></i>
            <input type="text" placeholder="搜索电影、演员..." class="bg-transparent w-full focus:outline-none text-sm" />
          </div>
          
          <button class="md:hidden text-xl text-gray-200 hover:text-white">
            <i class="fa fa-search"></i>
          </button>
          <button class="md:hidden text-xl text-gray-200 hover:text-white" @click="toggleMenu">
            <i :class="menuOpen ? 'fa fa-times' : 'fa fa-bars'"></i>
          </button>
          
          <a href="#" class="hidden md:block btn-primary">
            登录
          </a>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div 
        class="md:hidden absolute top-full left-0 right-0 bg-neutral/95 backdrop-blur shadow-lg transition-all duration-300 overflow-hidden"
        :style="{ maxHeight: menuOpen ? '500px' : '0px', opacity: menuOpen ? '1' : '0' }"
      >
        <div class="container py-4 flex flex-col gap-4">
          <a href="#" class="py-2 px-4 hover:bg-white/5 rounded-lg transition-colors">首页</a>
          <a href="#" class="py-2 px-4 hover:bg-white/5 rounded-lg transition-colors">电影库</a>
          <a href="#" class="py-2 px-4 hover:bg-white/5 rounded-lg transition-colors">取景地</a>
          <a href="#" class="py-2 px-4 hover:bg-white/5 rounded-lg transition-colors">排行榜</a>
          <a href="#" class="py-2 px-4 hover:bg-white/5 rounded-lg transition-colors">社区</a>
          
          <div class="flex items-center bg-white/10 rounded-full px-4 py-2 mt-2">
            <i class="fa fa-search text-gray-400 mr-2"></i>
            <input type="text" placeholder="搜索电影、演员..." class="bg-transparent w-full focus:outline-none text-sm" />
          </div>
          
          <a href="#" class="btn-primary text-center mt-2">
            登录
          </a>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-grow">
      <!-- 英雄区轮播 -->
      <section class="relative h-screen overflow-hidden">
        <!-- 轮播背景图 -->
        <div class="absolute inset-0 z-0">
          <div 
            class="absolute inset-0 transition-opacity duration-1500 ease-in-out"
            :class="{ 'opacity-100': currentSlide === 0, 'opacity-0': currentSlide !== 0 }"
          >
            <img 
              src="https://ts1.tc.mm.bing.net/th/id/R-C.a924ed5e21023520f6cda192b690ab82?rik=MUS2sSwLtL0Keg&riu=http%3a%2f%2fimg.doooor.com%2fimg%2fforum%2f201706%2f19%2f221444pjvwjvvsjmjwi0b0.jpg&ehk=6QsTOBINcKyFAwWnWDuv2IidD0NfgXwfhZdjDXP%2f%2fJ8%3d&risl=&pid=ImgRaw&r=0" 
              alt="霸王别姬电影海报" 
              class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-15000 ease-in-out"
              :style="{ transform: currentSlide === 0 ? 'scale(1.1)' : 'scale(1)' }"
            >
          </div>
          <div 
            class="absolute inset-0 transition-opacity duration-1500 ease-in-out"
            :class="{ 'opacity-100': currentSlide === 1, 'opacity-0': currentSlide !== 1 }"
          >
            <img 
              src="https://ts1.tc.mm.bing.net/th/id/R-C.024aff85a76bdfbb93c7fa0586717ae8?rik=OWuGrcu8WHH%2fzg&riu=http%3a%2f%2fwww.cgstheater.cn%2frepository%2fimage%2fbd53e17e-96c8-4eb2-8d40-b1370ef84804.jpg_1180xa.jpg&ehk=cPFyBgDJlUzTrp%2b1oA6Phin5NJaPc3ItjhrgRHeik8Y%3d&risl=&pid=ImgRaw&r=0" 
              alt="千与千寻电影海报" 
              class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-15000 ease-in-out"
              :style="{ transform: currentSlide === 1 ? 'scale(1.1)' : 'scale(1)' }"
            >
          </div>
          <div 
            class="absolute inset-0 transition-opacity duration-1500 ease-in-out"
            :class="{ 'opacity-100': currentSlide === 2, 'opacity-0': currentSlide !== 2 }"
          >
            <img 
              src="https://ts1.tc.mm.bing.net/th/id/R-C.96e76592cc2f5f8021abeaa2a1ddf3ab?rik=VPeHRT7R5Acb1g&riu=http%3a%2f%2fstatic.quanminbagua.com%2fgallery%2fngg%2f%e9%82%a3%e4%ba%9b%e4%b8%8d%e5%be%97%e4%b8%8d%e7%9c%8b%e7%9a%84%e7%b2%be%e5%93%81%e7%94%b5%e5%bd%b1-1%2f6.1%e6%b3%b0%e5%9d%a6%e5%b0%bc%e5%85%8b%e5%8f%b72.jpg&ehk=aeQcu4hPfgToLhFEkPG5JsXN8gIMxybRTVR7Qe4wxwk%3d&risl=&pid=ImgRaw&r=0" 
              alt="泰坦尼克号电影海报" 
              class="w-full h-full object-cover object-center transform scale-105 transition-transform duration-15000 ease-in-out"
              :style="{ transform: currentSlide === 2 ? 'scale(1.1)' : 'scale(1)' }"
            >
          </div>
          
          <!-- 渐变遮罩 -->
          <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent z-10"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent z-10"></div>
        </div>
        
        <!-- 轮播内容 -->
        <div class="relative z-20 h-full flex items-end">
          <div class="container pb-20 md:pb-32">
            <!-- 轮播1内容 -->
            <div 
              class="transition-all duration-1000 ease-out"
              :class="{ 'opacity-100 translate-x-0': currentSlide === 0, 'opacity-0 -translate-x-10 pointer-events-none': currentSlide !== 0 }"
            >
              <span class="inline-block bg-accent text-primary font-bold px-3 py-1 rounded-full text-sm mb-4">9.6 分</span>
              <h1 class="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight text-shadow mb-4">霸王别姬</h1>
              <div class="flex flex-wrap gap-4 mb-6 text-gray-200">
                <span>1993</span>
                <span>中国大陆 / 中国香港</span>
                <span>剧情 / 爱情</span>
                <span>171分钟</span>
              </div>
              <p class="text-gray-200 max-w-2xl text-lg md:text-xl mb-8 leading-relaxed">
                说的是一辈子！差一年，一个月，一天，一个时辰，都不算一辈子！
              </p>
              <div class="flex flex-wrap gap-4">
                <a href="#" class="btn-primary flex items-center gap-2">
                  <i class="fa fa-play-circle"></i>
                  <span>立即观看</span>
                </a>
                <a href="#" class="btn-outline flex items-center gap-2">
                  <i class="fa fa-info-circle"></i>
                  <span>影片详情</span>
                </a>
              </div>
            </div>
            
            <!-- 轮播2内容 -->
            <div 
              class="transition-all duration-1000 ease-out absolute"
              :class="{ 'opacity-100 translate-x-0': currentSlide === 1, 'opacity-0 -translate-x-10 pointer-events-none': currentSlide !== 1 }"
            >
              <span class="inline-block bg-accent text-primary font-bold px-3 py-1 rounded-full text-sm mb-4">9.4 分</span>
              <h1 class="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight text-shadow mb-4">千与千寻</h1>
              <div class="flex flex-wrap gap-4 mb-6 text-gray-200">
                <span>2001</span>
                <span>日本</span>
                <span>动画 / 奇幻 / 冒险</span>
                <span>125分钟</span>
              </div>
              <p class="text-gray-200 max-w-2xl text-lg md:text-xl mb-8 leading-relaxed">
                不管前方的路有多苦，只要走的方向正确，不管多么崎岖不平，都比站在原地更接近幸福。
              </p>
              <div class="flex flex-wrap gap-4">
                <a href="#" class="btn-primary flex items-center gap-2">
                  <i class="fa fa-play-circle"></i>
                  <span>立即观看</span>
                </a>
                <a href="#" class="btn-outline flex items-center gap-2">
                  <i class="fa fa-info-circle"></i>
                  <span>影片详情</span>
                </a>
              </div>
            </div>
            
            <!-- 轮播3内容 -->
            <div 
              class="transition-all duration-1000 ease-out absolute"
              :class="{ 'opacity-100 translate-x-0': currentSlide === 2, 'opacity-0 -translate-x-10 pointer-events-none': currentSlide !== 2 }"
            >
              <span class="inline-block bg-accent text-primary font-bold px-3 py-1 rounded-full text-sm mb-4">9.4 分</span>
              <h1 class="text-[clamp(2.5rem,8vw,5rem)] font-bold leading-tight text-shadow mb-4">泰坦尼克号</h1>
              <div class="flex flex-wrap gap-4 mb-6 text-gray-200">
                <span>1997</span>
                <span>美国</span>
                <span>剧情 / 爱情 / 灾难</span>
                <span>194分钟</span>
              </div>
              <p class="text-gray-200 max-w-2xl text-lg md:text-xl mb-8 leading-relaxed">
                You jump, I jump.
              </p>
              <div class="flex flex-wrap gap-4">
                <a href="#" class="btn-primary flex items-center gap-2">
                  <i class="fa fa-play-circle"></i>
                  <span>立即观看</span>
                </a>
                <a href="#" class="btn-outline flex items-center gap-2">
                  <i class="fa fa-info-circle"></i>
                  <span>影片详情</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 轮播控制 -->
        <div class="absolute bottom-8 right-8 z-30 flex flex-col gap-4">
          <div class="flex gap-2">
            <button 
              @click="goToSlide(0)" 
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="{ 'bg-secondary w-8': currentSlide === 0, 'bg-white/40 hover:bg-white/60': currentSlide !== 0 }"
              aria-label="切换到第1张"
            ></button>
            <button 
              @click="goToSlide(1)" 
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="{ 'bg-secondary w-8': currentSlide === 1, 'bg-white/40 hover:bg-white/60': currentSlide !== 1 }"
              aria-label="切换到第2张"
            ></button>
            <button 
              @click="goToSlide(2)" 
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="{ 'bg-secondary w-8': currentSlide === 2, 'bg-white/40 hover:bg-white/60': currentSlide !== 2 }"
              aria-label="切换到第3张"
            ></button>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="prevSlide"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              aria-label="上一张"
            >
              <i class="fa fa-chevron-left"></i>
            </button>
            <button 
              @click="nextSlide"
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              aria-label="下一张"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
        
        <!-- 向下滚动指示器 -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <a href="#featured" class="text-white/60 hover:text-white transition-colors">
            <i class="fa fa-angle-down text-2xl"></i>
          </a>
        </div>
      </section>
      
      <!-- 特色分类 -->
      <section id="featured" class="py-16 bg-neutral">
        <div class="container">
          <h2 class="section-title">探索分类</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <a href="#" class="group relative h-40 md:h-56 rounded-xl overflow-hidden">
              <img 
                src="https://ts1.tc.mm.bing.net/th/id/R-C.d30206e9578363d8679b0de06dc50af3?rik=xbiN8J%2ftlNZpGA&riu=http%3a%2f%2fn.sinaimg.cn%2ffront%2f233%2fw2048h1385%2f20190224%2fZFw2-htknpmi3260480.jpg&ehk=c4BmbPUMRRyuJYCiLqIDSk0Kvqa9WqOaeTmvvnLQZRY%3d&risl=&pid=ImgRaw&r=0" 
                alt="动作电影" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4 md:p-6">
                <i class="fa fa-bolt text-secondary text-2xl mb-2"></i>
                <h3 class="font-bold text-lg md:text-xl">动作</h3>
                <p class="text-sm text-gray-300">1 部电影</p>
              </div>
            </a>
            
            <a href="#" class="group relative h-40 md:h-56 rounded-xl overflow-hidden">
              <img 
                src="https://ts3.tc.mm.bing.net/th/id/OIP-C.sUUxHtnYYStutYhlbZUfdQHaMP?rs=1&pid=ImgDetMain&o=7&rm=3" 
                alt="动漫电影" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4 md:p-6">
                <i class="fa fa-rocket text-secondary text-2xl mb-2"></i>
                <h3 class="font-bold text-lg md:text-xl">动漫</h3>
                <p class="text-sm text-gray-300">2 部电影</p>
              </div>
            </a>
            
            <a href="#" class="group relative h-40 md:h-56 rounded-xl overflow-hidden">
              <img 
                src="https://ts1.tc.mm.bing.net/th/id/R-C.c0f0edcc152ba4f53e99bd271f42f41c?rik=8y43Dk92NDilHg&riu=http%3a%2f%2fi0.qhimg.com%2ft01acc8b96b4edb1d4b.jpg&ehk=Lxte2pnUCaLLeiuqQcB%2bRsMhVsiqzhizqvkSZd%2fKEnI%3d&risl=&pid=ImgRaw&r=0" 
                alt="爱情电影" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4 md:p-6">
                <i class="fa fa-heart text-secondary text-2xl mb-2"></i>
                <h3 class="font-bold text-lg md:text-xl">爱情</h3>
                <p class="text-sm text-gray-300">3 部电影</p>
              </div>
            </a>
            
            <a href="#" class="group relative h-40 md:h-56 rounded-xl overflow-hidden">
              <img 
                src="https://picsum.photos/id/241/400/600" 
                alt="悬疑电影" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4 md:p-6">
                <i class="fa fa-puzzle-piece text-secondary text-2xl mb-2"></i>
                <h3 class="font-bold text-lg md:text-xl">悬疑</h3>
                <p class="text-sm text-gray-300">4 部电影</p>
              </div>
            </a>
          </div>
        </div>
      </section>
      
      <!-- 热门电影 -->
      <section class="py-16 bg-primary">
        <div class="container">
          <div class="flex justify-between items-end mb-8">
            <h2 class="section-title">热门电影</h2>
            <a href="#" class="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors">
              <span>查看全部</span>
              <i class="fa fa-angle-right"></i>
            </a>
          </div>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <div 
  class="movie-card group animate-fade-in opacity-0" 
  v-for="(movie, index) in popularMovies" 
  :key="index"
  :style="{ animationDelay: `${index * 100}ms` }"
>
              <div class="aspect-[2/3] rounded-xl overflow-hidden relative">
                <img 
                  :src="movie.image" 
                  :alt="movie.title" 
                  class="w-full h-full object-cover"
                  loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- 评分标签 -->
                <div class="absolute top-2 right-2 bg-accent text-primary text-xs font-bold px-2 py-1 rounded">
                  {{ movie.rating }}
                </div>
                
                <!-- 悬停时显示的按钮 -->
                <div class="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div class="flex gap-2">
                    <button class="flex-1 bg-secondary hover:bg-secondary/90 text-white p-2 rounded-full text-center text-sm transition-colors">
                      <i class="fa fa-play mr-1"></i> 播放
                    </button>
                    <button class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <h3 class="font-semibold mt-3 line-clamp-1 group-hover:text-secondary transition-colors">
                {{ movie.title }}
              </h3>
              <p class="text-gray-400 text-sm line-clamp-1">{{ movie.year }} • {{ movie.genre }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 电影取景地 -->
      <section class="py-16 bg-neutral">
        <div class="container">
          <div class="flex justify-between items-end mb-8">
            <h2 class="section-title">著名取景地</h2>
            <a href="#" class="text-gray-300 hover:text-secondary flex items-center gap-2 transition-colors">
              <span>探索地图</span>
              <i class="fa fa-map-o"></i>
            </a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div 
  class="group relative h-80 rounded-xl overflow-hidden shadow-lg animate-slide-up opacity-0"
  v-for="(location, index) in filmingLocations" 
  :key="index"
  :style="{ animationDelay: `${index * 200}ms` }"
>
              <img 
                :src="location.image" 
                :alt="location.name" 
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
              
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <div class="flex items-center gap-2 mb-2">
                  <i class="fa fa-map-marker text-secondary"></i>
                  <span class="text-gray-300 text-sm">{{ location.country }}</span>
                </div>
                <h3 class="text-xl font-bold mb-2 group-hover:text-secondary transition-colors">
                  {{ location.name }}
                </h3>
                <p class="text-gray-300 text-sm mb-4">
                  曾拍摄: {{ location.movies }}
                </p>
                <a href="#" class="inline-block bg-white/10 hover:bg-secondary px-4 py-2 rounded-full text-sm transition-colors">
                  查看详情
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 订阅区域 -->
      <section class="py-20 bg-gradient-to-r from-primary to-neutral relative overflow-hidden">
        <!-- 装饰元素 -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
        
        <div class="container relative z-10">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-[clamp(1.8rem,4vw,3rem)] font-bold mb-4">获取最新电影资讯</h2>
            <p class="text-gray-300 text-lg mb-8">
              订阅我们的新闻通讯，抢先了解新片上映、独家访谈和电影活动信息
            </p>
            
            <div class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="输入您的邮箱地址" 
                class="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-white placeholder-gray-400"
                v-model="email"
              >
              <button 
                class="btn-primary whitespace-nowrap"
                @click="subscribe"
              >
                立即订阅
              </button>
            </div>
            
            <p class="text-gray-400 text-sm mt-4">
              我们尊重您的隐私，不会向第三方分享您的信息
            </p>
          </div>
        </div>
      </section>
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-primary border-t border-white/10 pt-16 pb-8">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div class="flex items-center gap-2 mb-6">
              <i class="fa fa-film text-secondary text-3xl"></i>
              <span class="text-2xl font-bold tracking-tight">CINEPLEX</span>
            </div>
            <p class="text-gray-400 mb-6 leading-relaxed">
              探索电影的无限可能，发现每部电影背后的故事与美景。
            </p>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <i class="fa fa-facebook"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <i class="fa fa-twitter"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <i class="fa fa-instagram"></i>
              </a>
              <a href="#" class="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center transition-colors">
                <i class="fa fa-youtube-play"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-6">快速链接</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">首页</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">电影库</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">排行榜</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">电影日历</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">电影取景地</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-6">帮助中心</h3>
            <ul class="space-y-3">
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">常见问题</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">联系我们</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">隐私政策</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">使用条款</a></li>
              <li><a href="#" class="text-gray-400 hover:text-secondary transition-colors">反馈建议</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-6">联系我们</h3>
            <ul class="space-y-4">
              <li class="flex items-start">
                <i class="fa fa-map-marker text-secondary mt-1 mr-3"></i>
                <span class="text-gray-400">浙江农林大学</span>
              </li>
              <li class="flex items-center">
                <i class="fa fa-phone text-secondary mr-3"></i>
                <span class="text-gray-400">+86 123 4567 8910</span>
              </li>
              <li class="flex items-center">
                <i class="fa fa-envelope text-secondary mr-3"></i>
                <span class="text-gray-400">xiazheng@wobuhui.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2025 CINEPLEX 电影网. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 导航状态
      menuOpen: false,
      scrollY: 0,
      
      // 轮播状态
      currentSlide: 0,
      slideInterval: null,
      
      // 订阅邮箱
      email: '',
      
      // 热门电影数据
      popularMovies: [
        {
          title: "肖申克的救赎",
          image: "/public/2a8ac1d2844ba65e15d8bcdb5c6a7651.png",
          rating: 9.7,
          year: 1994,
          genre: "剧情 / 犯罪"
        },
        {
          title: "教父",
          image: "https://ts1.tc.mm.bing.net/th/id/R-C.8b835eb05fcefefb85a4cf2ce09dec4d?rik=7Y0eAWqSYcM3EQ&riu=http%3a%2f%2fpuui.qpic.cn%2fvcover_vt_pic%2f0%2fx90v161tdg3lrzl1567482990%2f0&ehk=JINDpaNEHHL6Wro7no%2b%2fCrvRvt7gVmOOyUOPe5%2bnqMg%3d&risl=&pid=ImgRaw&r=0",
          rating: 9.6,
          year: 1972,
          genre: "剧情 / 犯罪"
        },
        {
          title: "霸王别姬",
          image: "https://ts1.tc.mm.bing.net/th/id/R-C.b1b12f1bc204c390f08411db91514535?rik=WsZu9dpTvc6n5w&riu=http%3a%2f%2fn.sinaimg.cn%2fsinakd20230812ac%2f231%2fw1383h2048%2f20230812%2f0796-f2ff789ad1a2bd07a096c66c337faace.jpg&ehk=BaYCTuaTYep3%2f7HzJx9Yflomfrcfmmk1evWWeInt50A%3d&risl=&pid=ImgRaw&r=0",
          rating: 9.6,
          year: 1993,
          genre: "剧情 / 爱情"
        },
        {
          title: "阿甘正传",
          image: "https://ts1.tc.mm.bing.net/th/id/R-C.bbc380112ca38ab57caf4b798cd8810b?rik=YHutETyWufP2uA&riu=http%3a%2f%2fpuui.qpic.cn%2fvcover_vt_pic%2f0%2fr6hc2kqgvnmiejn1567396046%2f0&ehk=%2bkNZ0pXo%2fkRDGZXeNPhf0tHOWvOAI9u1jbMudSramGg%3d&risl=&pid=ImgRaw&r=0",
          rating: 9.5,
          year: 1994,
          genre: "剧情 / 爱情"
        },
        {
          title: "泰坦尼克号",
          image: "https://n.sinaimg.cn/sinacn10105/181/w1089h1492/20190414/a8d1-hvscktf5131902.jpg",
          rating: 9.4,
          year: 1997,
          genre: "剧情 / 爱情"
        },
        {
          title: "千与千寻",
          image: "https://ts1.tc.mm.bing.net/th/id/R-C.1cfa027b1b2398c2124a04e2d1297e45?rik=2p6qK%2f2%2fr7mfPw&riu=http%3a%2f%2fpuui.qpic.cn%2fvcover_vt_pic%2f0%2fdxejskxh9kkcry31560833007%2f0&ehk=ldoJCS6610Ds6FF4t%2fqXE8P1eZPMlDJr%2fnSJ9%2b3%2fIYI%3d&risl=&pid=ImgRaw&r=0",
          rating: 9.4,
          year: 2001,
          genre: "动画 / 奇幻"
        }
      ],
      
      // 取景地数据
      filmingLocations: [
        {
          name: "霍比特人村庄",
          country: "新西兰",
          image: "https://youimg1.c-ctrip.com/target/100b11000000qkmi64379.jpg",
          movies: "《指环王》系列、《霍比特人》系列"
        },
        {
          name: "蓝湖温泉",
          country: "冰岛",
          image: "https://picsum.photos/id/1015/800/600",
          movies: "《权力的游戏》、《007：择日而亡》"
        },
        {
          name: "张家界",
          country: "中国",
          image: "https://img1.qunarzz.com/travel/d4/1712/10/7ee01a95ef53bfb5.jpg?ver=1",
          movies: "《阿凡达》、《西游记》"
        }
      ]
    };
  },
  
  methods: {
    // 菜单切换
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    
    // 轮播控制
    startSlideTimer() {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 6000);
    },
    
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % 3;
    },
    
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + 3) % 3;
    },
    
    goToSlide(index) {
      this.currentSlide = index;
    },
    
    // 订阅功能
    subscribe() {
      if (this.email && this.validateEmail(this.email)) {
        alert(`感谢订阅！最新电影资讯将发送至 ${this.email}`);
        this.email = '';
      } else {
        alert('请输入有效的邮箱地址');
      }
    },
    
    // 邮箱验证
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  },
  
  mounted() {
    // 监听滚动事件
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });
    
    // 启动轮播
    this.startSlideTimer();
    
    // 图片懒加载初始化
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.classList.add('opacity-100');
            image.classList.remove('opacity-0');
            imageObserver.unobserve(image);
          }
        });
      });
      
      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
    }
  },
  
  beforeUnmount() {
    // 清理定时器和事件监听
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    window.removeEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });
  }
};
</script>

<style scoped>
/* 基础动画定义 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* 图片加载过渡 */
img[loading="lazy"] {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

img[loading="lazy"].opacity-100 {
  opacity: 1;
}
</style>
