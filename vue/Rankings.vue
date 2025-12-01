<template>
  <div class="rankings-page">
    <div class="page-header">
      <div class="container">
        <h1>电影排行榜</h1>
        <p>发现最受欢迎的电影和取景地</p>
      </div>
    </div>

    <div class="rankings-content">
      <div class="container">
        <!-- 分类切换 -->
        <div class="ranking-categories">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-btn', { active: activeCategory === category.id }]"
            @click="handleCategoryChange(category.id)"
          >
            <i :class="category.icon"></i>
            {{ category.name }}
          </button>
        </div>

        <!-- 排行榜列表 -->
        <div class="ranking-list">
          <div 
            v-for="(item, index) in currentRankings" 
            :key="item.id"
            :class="['ranking-item', `rank-${index + 1}`]"
            @click="handleItemClick(item)"
          >
            <div class="rank-number">
              {{ index + 1 }}
            </div>
            <div class="item-content">
              <div class="item-image">
                <img :src="item.image" :alt="item.title">
              </div>
              <div class="item-details">
                <h3>{{ item.title }}</h3>
                <p class="item-meta">{{ item.meta }}</p>
                <div class="item-stats">
                  <span class="rating">
                    <i class="fa fa-star"></i>
                    {{ item.rating }}
                  </span>
                  <span class="votes">
                    <i class="fa fa-eye"></i>
                    {{ item.votes }}
                  </span>
                </div>
              </div>
            </div>
            <div class="rank-badge" v-if="index < 3">
              <i class="fa fa-trophy"></i>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="currentRankings.length === 0" class="no-rankings">
          <i class="fa fa-trophy"></i>
          <h3>暂无排行榜数据</h3>
          <p>请选择其他分类查看</p>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selectedItem" class="detail-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">
          <i class="fa fa-times"></i>
        </button>
        
        <div class="modal-header">
          <img :src="selectedItem.image" :alt="selectedItem.title" class="modal-image">
          <div class="modal-header-info">
            <h2>{{ selectedItem.title }}</h2>
            <p class="modal-meta">{{ selectedItem.meta }}</p>
            <div class="modal-stats">
              <div class="stat-item">
                <i class="fa fa-star"></i>
                <span class="stat-value">{{ selectedItem.rating }}</span>
                <span class="stat-label">评分</span>
              </div>
              <div class="stat-item">
                <i class="fa fa-eye"></i>
                <span class="stat-value">{{ selectedItem.votes }}</span>
                <span class="stat-label">热度</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-body">
          <div class="info-section">
            <h3>详细信息</h3>
            <div class="info-grid">
              <div class="info-item" v-for="(value, key) in selectedItem.details" :key="key">
                <span class="info-label">{{ getDetailLabel(key) }}：</span>
                <span class="info-value">{{ value }}</span>
              </div>
            </div>
          </div>

          <div class="description-section" v-if="selectedItem.description">
            <h3>简介</h3>
            <p>{{ selectedItem.description }}</p>
          </div>

          <div class="action-buttons">
            <button class="btn btn-primary">
              <i class="fa fa-heart"></i>
              收藏
            </button>
            <button class="btn btn-secondary">
              <i class="fa fa-share"></i>
              分享
            </button>
            <button class="btn btn-outline">
              <i class="fa fa-map-marker"></i>
              查看取景地
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rankings',
  data() {
    return {
      activeCategory: 'movies',
      selectedItem: null,
      categories: [
        { id: 'movies', name: '热门电影', icon: 'fa fa-film' },
        { id: 'locations', name: '热门取景地', icon: 'fa fa-map-marker' },
        { id: 'actors', name: '热门演员', icon: 'fa fa-user' },
        { id: 'directors', name: '热门导演', icon: 'fa fa-video-camera' }
      ],
      rankingsData: {
        movies: [
          {
            id: 1,
            title: '肖申克的救赎',
            meta: '1994 · 剧情/犯罪',
            rating: 9.7,
            votes: '256万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=电影1',
            description: '一场谋杀案使银行家安迪蒙冤入狱，谋杀妻子及其情人的指控将囚禁他终生。在肖申克监狱的首次现身就让监狱"大哥"瑞德对他另眼相看。瑞德帮助他搞到一把石锤和一幅女明星海报，两人渐成患难之交。很快，安迪在监狱里大显其才，担当监狱图书管理员，并利用自己的金融知识帮助监狱官避税，引起了典狱长的注意，被招致麾下帮助典狱长洗黑钱。偶然一次，他得知一名新入狱的小偷能够作证帮他洗脱谋杀罪。燃起一丝希望的安迪找到了典狱长，希望他能帮自己翻案。阴险伪善的狱长假装答应安迪，背后却派人杀死小偷，让他唯一能合法出狱的希望泯灭。沮丧的安迪并没有绝望，在一个电闪雷鸣的风雨夜，一场暗藏几十年的越狱计划让他自我救赎，重获自由！老朋友瑞德在他的鼓舞和帮助下，也勇敢地奔向自由。',
            details: {
              director: '弗兰克·德拉邦特',
              actors: '蒂姆·罗宾斯, 摩根·弗里曼, 鲍勃·冈顿',
              releaseDate: '1994-09-10',
              duration: '142分钟',
              country: '美国',
              language: '英语'
            }
          },
          {
            id: 2,
            title: '霸王别姬',
            meta: '1993 · 剧情/爱情',
            rating: 9.6,
            votes: '198万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=电影2',
            description: '段小楼与程蝶衣是一对打小一起长大的师兄弟，两人一个演生，一个饰旦，一向配合天衣无缝，尤其一出《霸王别姬》，更是誉满京城，为此，两人约定合演一辈子《霸王别姬》。但两人对戏剧与人生关系的理解有本质不同，段小楼深知戏非人生，程蝶衣则是人戏不分。',
            details: {
              director: '陈凯歌',
              actors: '张国荣, 张丰毅, 巩俐',
              releaseDate: '1993-01-01',
              duration: '171分钟',
              country: '中国大陆',
              language: '汉语普通话'
            }
          },
          {
            id: 3,
            title: '阿甘正传',
            meta: '1994 · 剧情/爱情',
            rating: 9.5,
            votes: '187万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=电影3',
            description: '阿甘是个智商只有75的低能儿。在学校里为了躲避别的孩子的欺侮，听从一个朋友珍妮的话而开始"跑"。他跑着躲避别人的捉弄。在中学时，他为了躲避别人而跑进了一所学校的橄榄球场，就这样跑进了大学。阿甘被破格录取，并成了橄榄球巨星，受到了肯尼迪总统的接见。',
            details: {
              director: '罗伯特·泽米吉斯',
              actors: '汤姆·汉克斯, 罗宾·怀特, 加里·西尼斯',
              releaseDate: '1994-06-23',
              duration: '142分钟',
              country: '美国',
              language: '英语'
            }
          },
          {
            id: 4,
            title: '这个杀手不太冷',
            meta: '1994 · 剧情/动作',
            rating: 9.4,
            votes: '176万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=电影4',
            description: '里昂是名孤独的职业杀手，受人雇佣。一天，邻居家小姑娘马蒂尔达敲开他的房门，要求在他那里暂避杀身之祸。原来邻居家的主人是警方缉毒组的眼线，只因贪污了一小包毒品而遭恶警杀害全家的惩罚。马蒂尔达得到里昂的留救，幸免于难，并留在里昂那里。里昂教小女孩使枪，她教里昂法文，两人关系日趋亲密，相处融洽。',
            details: {
              director: '吕克·贝松',
              actors: '让·雷诺, 娜塔莉·波特曼, 加里·奥德曼',
              releaseDate: '1994-09-14',
              duration: '110分钟',
              country: '法国',
              language: '英语'
            }
          },
          {
            id: 5,
            title: '泰坦尼克号',
            meta: '1997 · 剧情/爱情',
            rating: 9.4,
            votes: '165万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=电影5',
            description: '1912年4月10日，号称 "世界工业史上的奇迹"的豪华客轮泰坦尼克号开始了自己的处女航，从英国的南安普顿出发驶往美国纽约。富家少女罗丝与母亲及未婚夫卡尔坐上了头等舱；另一边，放荡不羁的少年画家杰克也在码头的一场赌博中赢得了下等舱的船票。',
            details: {
              director: '詹姆斯·卡梅隆',
              actors: '莱昂纳多·迪卡普里奥, 凯特·温丝莱特, 比利·赞恩',
              releaseDate: '1997-12-19',
              duration: '194分钟',
              country: '美国',
              language: '英语'
            }
          }
        ],
        locations: [
          {
            id: 1,
            title: '故宫博物院',
            meta: '北京 · 历史建筑',
            rating: 9.8,
            votes: '89万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=故宫',
            description: '故宫是中国明清两代的皇家宫殿，旧称紫禁城，位于北京中轴线的中心。北京故宫以三大殿为中心，占地面积约72万平方米，建筑面积约15万平方米，有大小宫殿七十多座，房屋九千余间。',
            details: {
              address: '北京市东城区景山前街4号',
              featuredMovies: '末代皇帝, 还珠格格, 甄嬛传',
              bestTime: '春秋季节',
              ticketPrice: '60元',
              openTime: '08:30-17:00'
            }
          },
          {
            id: 2,
            title: '上海外滩',
            meta: '上海 · 城市景观',
            rating: 9.6,
            votes: '76万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=外滩',
            description: '外滩位于上海市黄浦区的黄浦江畔，即外黄浦滩，为中国历史文化街区。1844年起，外滩这一带被划为英国租界，成为上海十里洋场的真实写照，也是旧上海租界区以及整个上海近代城市开始的起点。',
            details: {
              address: '上海市黄浦区中山东一路',
              featuredMovies: '小时代, 色戒, 苏州河',
              bestTime: '夜晚',
              ticketPrice: '免费',
              openTime: '全天开放'
            }
          },
          {
            id: 3,
            title: '张家界',
            meta: '湖南 · 自然景观',
            rating: 9.5,
            votes: '68万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=张家界',
            description: '张家界国家森林公园是中国第一个国家森林公园，距张家界市区32公里，东连索溪峪，北邻天子山，面积130平方公里。张家界国家森林公园集神奇、钟秀、雄浑、原始、清新于一体，以岩称奇。',
            details: {
              address: '湖南省张家界市武陵源区',
              featuredMovies: '阿凡达, 西游记, 虹猫蓝兔七侠传',
              bestTime: '4-10月',
              ticketPrice: '228元',
              openTime: '07:00-18:00'
            }
          },
          {
            id: 4,
            title: '敦煌莫高窟',
            meta: '甘肃 · 文化遗址',
            rating: 9.4,
            votes: '54万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=莫高窟',
            description: '莫高窟，俗称千佛洞，坐落在河西走廊西端的敦煌。它始建于十六国的前秦时期，历经十六国、北朝、隋、唐、五代、西夏、元等历代的兴建，形成巨大的规模，有洞窟735个，壁画4.5万平方米、泥质彩塑2415尊，是世界上现存规模最大、内容最丰富的佛教艺术地。',
            details: {
              address: '甘肃省敦煌市东南25公里',
              featuredMovies: '敦煌, 天脉传奇, 新龙门客栈',
              bestTime: '5-10月',
              ticketPrice: '238元',
              openTime: '08:00-18:00'
            }
          },
          {
            id: 5,
            title: '重庆洪崖洞',
            meta: '重庆 · 城市景观',
            rating: 9.3,
            votes: '47万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=洪崖洞',
            description: '洪崖洞民俗风貌区是重庆市重点景观工程，建筑面积4.6万平方米，主要景点由吊脚楼、仿古商业街等景观组成。洪崖洞一共有11层，夜晚灯光从晚上6点开灯，10点熄灯。',
            details: {
              address: '重庆市渝中区嘉滨路88号',
              featuredMovies: '从你的全世界路过, 疯狂的石头, 火锅英雄',
              bestTime: '夜晚',
              ticketPrice: '免费',
              openTime: '11:00-23:00'
            }
          }
        ],
        actors: [
          {
            id: 1,
            title: '张国荣',
            meta: '演员 · 歌手',
            rating: 9.9,
            votes: '342万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=张国荣',
            description: '张国荣，出生于香港，中国香港男歌手、演员、音乐人。1977年正式出道。1983年以《风继续吹》成名。1984年演唱的《Monica》是香港歌坛第一支同获十大中文金曲、十大劲歌金曲的舞曲。',
            details: {
              birthDate: '1956-09-12',
              birthPlace: '香港',
              representativeWorks: '霸王别姬, 阿飞正传, 英雄本色',
              awards: '香港电影金像奖最佳男主角, 日本影评人大奖最佳男主角',
              height: '175cm'
            }
          },
          {
            id: 2,
            title: '周润发',
            meta: '演员',
            rating: 9.8,
            votes: '298万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=周润发',
            description: '周润发，出生于香港南丫岛，中国影视演员、摄影家，国家一级演员。1974年毕业于TVB艺员训练班，主演了《网中人》、《上海滩》等20余部剧集。',
            details: {
              birthDate: '1955-05-18',
              birthPlace: '香港南丫岛',
              representativeWorks: '英雄本色, 赌神, 卧虎藏龙',
              awards: '三届香港电影金像奖最佳男主角, 两届台湾金马奖最佳男主角',
              height: '182cm'
            }
          },
          {
            id: 3,
            title: '梁朝伟',
            meta: '演员',
            rating: 9.7,
            votes: '287万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=梁朝伟',
            description: '梁朝伟，出生于中国香港，祖籍广东省台山市，华语影视男演员、歌手，国家一级演员。1982年考入TVB艺员训练班正式进入演艺界。',
            details: {
              birthDate: '1962-06-27',
              birthPlace: '香港',
              representativeWorks: '花样年华, 无间道, 色戒',
              awards: '五届香港电影金像奖最佳男主角, 三届台湾金马奖最佳男主角',
              height: '174cm'
            }
          },
          {
            id: 4,
            title: '巩俐',
            meta: '演员',
            rating: 9.6,
            votes: '234万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=巩俐',
            description: '巩俐，出生于辽宁省沈阳市，祖籍山东省济南市，新加坡籍女演员。1987年因主演电影《红高粱》成名，该片获得第38届柏林国际电影节金熊奖。',
            details: {
              birthDate: '1965-12-31',
              birthPlace: '辽宁省沈阳市',
              representativeWorks: '红高粱, 霸王别姬, 秋菊打官司',
              awards: '威尼斯国际电影节最佳女演员, 蒙特利尔国际电影节最佳女演员',
              height: '169cm'
            }
          },
          {
            id: 5,
            title: '章子怡',
            meta: '演员',
            rating: 9.5,
            votes: '198万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=章子怡',
            description: '章子怡，出生于北京市，华语影视女演员、制片人，毕业于中央戏剧学院表演系。1998年，因主演电影《我的父亲母亲》成名，该片获得第50届柏林国际电影节银熊奖。',
            details: {
              birthDate: '1979-02-09',
              birthPlace: '北京市',
              representativeWorks: '我的父亲母亲, 卧虎藏龙, 一代宗师',
              awards: '三届中国电影华表奖最佳女主角, 两届香港电影金像奖最佳女主角',
              height: '164cm'
            }
          }
        ],
        directors: [
          {
            id: 1,
            title: '张艺谋',
            meta: '导演 · 摄影师',
            rating: 9.8,
            votes: '287万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=张艺谋',
            description: '张艺谋，出生于陕西西安，中国电影导演，"第五代导演"代表人物之一，美国波士顿大学、耶鲁大学荣誉博士。1978年进入北京电影学院摄影系学习。1987年执导的第一部电影《红高粱》获中国首个国际电影节金熊奖。',
            details: {
              birthDate: '1950-04-02',
              birthPlace: '陕西省西安市',
              representativeWorks: '红高粱, 活着, 英雄',
              awards: '两届威尼斯国际电影节金狮奖, 一届柏林国际电影节金熊奖',
              graduation: '北京电影学院'
            }
          },
          {
            id: 2,
            title: '陈凯歌',
            meta: '导演',
            rating: 9.7,
            votes: '265万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=陈凯歌',
            description: '陈凯歌，出生于北京，中国电影导演，毕业于北京电影学院。1984年执导电影处女作《黄土地》，该片获得第38届洛迦诺国际电影节银豹奖。1993年执导的文艺片《霸王别姬》成为首部获得戛纳国际电影节金棕榈奖的中国电影。',
            details: {
              birthDate: '1952-08-12',
              birthPlace: '北京市',
              representativeWorks: '霸王别姬, 黄土地, 荆轲刺秦王',
              awards: '戛纳国际电影节金棕榈奖, 中国电影金鸡奖最佳导演',
              graduation: '北京电影学院'
            }
          },
          {
            id: 3,
            title: '王家卫',
            meta: '导演 · 监制',
            rating: 9.6,
            votes: '243万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=王家卫',
            description: '王家卫，出生于上海，香港电影导演、监制及编剧，擅长文艺电影。1990年执导电影《阿飞正传》获得香港电影金像奖最佳导演奖及金马奖最佳导演奖。1997年执导电影《春光乍泄》获得戛纳国际电影节最佳导演奖，成为首位获此奖项的香港导演。',
            details: {
              birthDate: '1958-07-17',
              birthPlace: '上海市',
              representativeWorks: '花样年华, 重庆森林, 一代宗师',
              awards: '戛纳国际电影节最佳导演, 香港电影金像奖最佳导演',
              graduation: '香港理工大学'
            }
          },
          {
            id: 4,
            title: '李安',
            meta: '导演 · 编剧',
            rating: 9.5,
            votes: '231万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=李安',
            description: '李安，出生于台湾屏东县潮州镇，祖籍江西德安，编剧、导演。1995年，凭借英文电影《理智与情感》，获得奥斯卡金像奖七项提名，进入好莱坞A级导演行列。1999年，因执导《卧虎藏龙》首次获得奥斯卡金像奖最佳外语片奖。',
            details: {
              birthDate: '1954-10-23',
              birthPlace: '台湾屏东县',
              representativeWorks: '卧虎藏龙, 断背山, 少年派的奇幻漂流',
              awards: '两届奥斯卡最佳导演奖, 两届金球奖最佳导演奖',
              graduation: '纽约大学'
            }
          },
          {
            id: 5,
            title: '冯小刚',
            meta: '导演 · 演员',
            rating: 9.4,
            votes: '219万',
            image: 'https://via.placeholder.com/80x120/2c3e50/ffffff?text=冯小刚',
            description: '冯小刚，出生于北京，中国内地导演、编剧、演员。作品风格以京味儿喜剧著称，擅长商业片，在业界享有贺岁片之父的美誉。其导演过的电影总票房超过20亿，是中国内地最具有电影票房号召力的导演之一。',
            details: {
              birthDate: '1958-03-18',
              birthPlace: '北京市',
              representativeWorks: '甲方乙方, 天下无贼, 非诚勿扰',
              awards: '中国电影金鸡奖最佳导演, 大众电影百花奖最佳导演',
              graduation: '中国戏曲学院'
            }
          }
        ]
      }
    }
  },
  computed: {
    currentRankings() {
      return this.rankingsData[this.activeCategory] || [];
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      console.log('切换分类:', categoryId);
      this.activeCategory = categoryId;
      this.selectedItem = null;
    },
    
    handleItemClick(item) {
      console.log('点击项目:', item);
      this.selectedItem = item;
    },
    
    closeModal() {
      this.selectedItem = null;
    },
    
    getDetailLabel(key) {
      const labels = {
        director: '导演',
        actors: '主演',
        releaseDate: '上映时间',
        duration: '片长',
        country: '国家',
        language: '语言',
        address: '地址',
        featuredMovies: '相关影视',
        bestTime: '最佳游览时间',
        ticketPrice: '门票价格',
        openTime: '开放时间',
        birthDate: '出生日期',
        birthPlace: '出生地',
        representativeWorks: '代表作品',
        awards: '获奖情况',
        height: '身高',
        graduation: '毕业院校'
      };
      return labels[key] || key;
    }
  },
  mounted() {
    console.log('排行榜页面加载完成');
  }
}
</script>

<style scoped>
.rankings-page {
  min-height: 100vh;
  background: #0f1419;
  color: #e0e0e0;
}

.page-header {
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  color: white;
  padding: 3rem 0;
  text-align: center;
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
  background: linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.rankings-content {
  padding: 3rem 0;
}

/* 分类切换 */
.ranking-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.category-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border: 2px solid #2a3a4a;
  background: #1a232e;
  color: #8a9ba8;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
}

.category-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.category-btn:hover {
  border-color: #00ffff;
  color: #00ffff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 255, 255, 0.2);
}

.category-btn:hover::before {
  left: 100%;
}

.category-btn.active {
  background: linear-gradient(135deg, #0056b3, #4a00e0);
  color: white;
  border-color: #00a8ff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.4);
}

.category-btn i {
  font-size: 1.3rem;
}

/* 排行榜列表 */
.ranking-list {
  max-width: 800px;
  margin: 0 auto;
}

.ranking-item {
  position: relative;
  display: flex;
  align-items: center;
  background: #1a232e;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border-left: 4px solid #2a3a4a;
  overflow: hidden;
  cursor: pointer;
}

.ranking-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #00a8ff, #4a00e0);
  opacity: 0;
  transition: opacity 0.3s;
}

.ranking-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 25px rgba(0, 168, 255, 0.2);
  border-left-color: #00a8ff;
}

.ranking-item:hover::before {
  opacity: 1;
}

/* 前三名特殊样式 */
.rank-1 {
  border-left-color: #ffd700;
  background: linear-gradient(135deg, #2a2319, #1a232e);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
}

.rank-2 {
  border-left-color: #c0c0c0;
  background: linear-gradient(135deg, #2a2a2a, #1a232e);
  box-shadow: 0 5px 20px rgba(192, 192, 192, 0.2);
}

.rank-3 {
  border-left-color: #cd7f32;
  background: linear-gradient(135deg, #2a2219, #1a232e);
  box-shadow: 0 5px 20px rgba(205, 127, 50, 0.2);
}

.rank-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3a4a5a;
  margin-right: 1.5rem;
  min-width: 60px;
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 168, 255, 0.5);
}

.rank-1 .rank-number {
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(255, 215, 0, 0.5);
}

.rank-2 .rank-number {
  color: #c0c0c0;
  text-shadow: 0 2px 4px rgba(192, 192, 192, 0.5);
}

.rank-3 .rank-number {
  color: #cd7f32;
  text-shadow: 0 2px 4px rgba(205, 127, 50, 0.5);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.item-image {
  flex-shrink: 0;
  position: relative;
}

.item-image::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 5px;
  right: 5px;
  height: 10px;
  background: rgba(0, 168, 255, 0.2);
  filter: blur(5px);
  z-index: -1;
}

.item-image img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
  border: 1px solid #2a3a4a;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #e0e0e0;
}

.item-meta {
  color: #8a9ba8;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.item-stats {
  display: flex;
  gap: 1.5rem;
}

.rating, .votes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #e0e0e0;
  font-weight: 600;
}

.rating i {
  color: #ff9e00;
  text-shadow: 0 0 5px rgba(255, 158, 0, 0.5);
}

.votes i {
  color: #00a8ff;
  text-shadow: 0 0 5px rgba(0, 168, 255, 0.5);
}

.rank-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a232e;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(255, 215, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.rank-2 .rank-badge {
  background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
  color: #1a232e;
  box-shadow: 0 3px 10px rgba(192, 192, 192, 0.5);
}

.rank-3 .rank-badge {
  background: linear-gradient(135deg, #cd7f32, #e69138);
  color: #1a232e;
  box-shadow: 0 3px 10px rgba(205, 127, 50, 0.5);
}

/* 空状态 */
.no-rankings {
  text-align: center;
  padding: 4rem 2rem;
  color: #8a9ba8;
}

.no-rankings i {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #2a3a4a;
}

.no-rankings h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #e0e0e0;
}

.no-rankings p {
  font-size: 1.1rem;
}

/* 详情弹窗样式 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #1a232e, #0f1419);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 168, 255, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e0e0e0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #00a8ff;
  transform: rotate(90deg);
}

.modal-header {
  display: flex;
  gap: 2rem;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, rgba(0, 168, 255, 0.1), transparent);
  border-bottom: 1px solid rgba(0, 168, 255, 0.2);
}

.modal-image {
  width: 150px;
  height: 225px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 168, 255, 0.3);
}

.modal-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modal-header-info h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
}

.modal-meta {
  color: #8a9ba8;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.modal-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-item i {
  font-size: 1.5rem;
  color: #00a8ff;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
}

.stat-label {
  color: #8a9ba8;
  font-size: 0.9rem;
}

.modal-body {
  padding: 2rem;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #00a8ff;
  border-bottom: 2px solid rgba(0, 168, 255, 0.3);
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  color: #8a9ba8;
  font-weight: 500;
}

.info-value {
  color: #e0e0e0;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.description-section {
  margin-bottom: 2rem;
}

.description-section h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #00a8ff;
  border-bottom: 2px solid rgba(0, 168, 255, 0.3);
  padding-bottom: 0.5rem;
}

.description-section p {
  line-height: 1.8;
  color: #b0b8c0;
  text-align: justify;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #00a8ff, #0056b3);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}

.btn-outline {
  background: transparent;
  color: #00a8ff;
  border: 2px solid #00a8ff;
}

.btn-outline:hover {
  background: rgba(0, 168, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 168, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ranking-categories {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  .category-btn {
    padding: 1rem 0.5rem;
    font-size: 1rem;
  }
  
  .ranking-item {
    padding: 1rem;
  }
  
  .rank-number {
    font-size: 2rem;
    margin-right: 1rem;
    min-width: 50px;
  }
  
  .item-content {
    gap: 1rem;
  }
  
  .item-image img {
    width: 60px;
    height: 90px;
  }
  
  .item-details h3 {
    font-size: 1.1rem;
  }
  
  .item-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modal-header {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem 1rem;
  }
  
  .modal-image {
    width: 120px;
    height: 180px;
    margin: 0 auto;
  }
  
  .modal-header-info h2 {
    font-size: 1.5rem;
  }
  
  .modal-stats {
    justify-content: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    justify-content: center;
  }
  
  .detail-modal {
    padding: 1rem;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}
</style>