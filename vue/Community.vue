<template>
  <div class="community-page page-container">
    <div class="page-header">
      <div class="container">
        <h1>电影社区</h1>
        <p>与影迷交流分享观影体验</p>
      </div>
    </div>

    <div class="community-content">
      <div class="container">
        <div class="community-layout">
          <!-- 左侧：讨论区 -->
          <div class="discussions-section">
            <div class="section-header">
              <h2>热门讨论</h2>
              <button 
                class="btn btn-primary" 
                @click="isLogin ? (showCreatePost = true) : $emit('needLogin')"
                :disabled="!isLogin"
              >
                <i class="fa fa-plus"></i>
                发布新话题
              </button>
            </div>

            <!-- 讨论列表 -->
            <div class="discussions-list">
              <div 
                v-for="discussion in discussions" 
                :key="discussion.id"
                class="discussion-card"
                @click="selectDiscussion(discussion)"
              >
                <div class="discussion-header">
                  <div class="user-info">
                    <img :src="discussion.user.avatar" :alt="discussion.user.name" class="user-avatar">
                    <div class="user-details">
                      <h4>{{ discussion.user.name }}</h4>
                      <p class="post-time">{{ discussion.time }}</p>
                    </div>
                  </div>
                  <div class="discussion-meta">
                    <!-- 讨论统计 -->
                    <div class="discussion-stats">
                      <span class="stat">
                        <i class="fa fa-comment"></i>
                        {{ discussion.comments.length }}
                      </span>
                      <span class="stat">
                        <i class="fa fa-heart"></i>
                        {{ discussion.likes }}
                      </span>
                    </div>
                    <!-- 评分显示 -->
                    <div class="discussion-rating" v-if="discussion.rating > 0">
                      <div class="rating-stars">
                        <span v-for="star in 5" :key="star">
                          <i 
                            :class="discussion.rating >= star ? 'fa-star' : 'fa-star-o'"
                            class="rating-star-icon"
                          ></i>
                        </span>
                        <span class="rating-number">{{ discussion.rating }}星</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 class="discussion-title">{{ discussion.title }}</h3>
                <p class="discussion-content">{{ discussion.content }}</p>
                <div class="discussion-tags">
                  <span 
                    v-for="tag in discussion.tags" 
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：评论区和社区信息 -->
          <div class="sidebar">
            <!-- 选中的讨论详情 -->
            <div v-if="selectedDiscussion" class="discussion-detail">
              <div class="detail-header">
                <h3>{{ selectedDiscussion.title }}</h3>
                <button class="btn-close" @click="selectedDiscussion = null">
                  <i class="fa fa-times"></i>
                </button>
              </div>
              
              <div class="original-post">
                <div class="post-user">
                  <img :src="selectedDiscussion.user.avatar" :alt="selectedDiscussion.user.name" class="user-avatar">
                  <div class="user-details">
                    <h4>{{ selectedDiscussion.user.name }}</h4>
                    <p class="post-time">{{ selectedDiscussion.time }}</p>
                  </div>
                </div>
                <!-- 详情页评分显示 -->
                <div class="post-rating" v-if="selectedDiscussion.rating > 0">
                  <span class="rating-label">电影评分：</span>
                  <div class="rating-stars">
                    <span v-for="star in 5" :key="star">
                      <i 
                        :class="selectedDiscussion.rating >= star ? 'fa-star' : 'fa-star-o'"
                        class="rating-star-icon"
                      ></i>
                    </span>
                    <span class="rating-number">{{ selectedDiscussion.rating }}星</span>
                  </div>
                </div>
                <p class="post-content">{{ selectedDiscussion.content }}</p>
              </div>

              <!-- 评论列表 -->
              <div class="comments-section">
                <h4>评论 ({{ selectedDiscussion.comments.length }})</h4>
                <div class="comments-list">
                  <div 
                    v-for="comment in selectedDiscussion.comments" 
                    :key="comment.id"
                    class="comment"
                  >
                    <div class="comment-user">
                      <img :src="comment.user.avatar" :alt="comment.user.name" class="user-avatar-small">
                      <div class="user-details">
                        <h5>{{ comment.user.name }}</h5>
                        <p class="comment-time">{{ comment.time }}</p>
                      </div>
                    </div>
                    <p class="comment-content">{{ comment.content }}</p>
                    <div class="comment-actions">
                      <button class="action-btn">
                        <i class="fa fa-heart"></i>
                        {{ comment.likes }}
                      </button>
                      <button class="action-btn">
                        <i class="fa fa-reply"></i>
                        回复
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 发表评论 -->
                <div class="add-comment">
                  <div class="comment-input">
                    <img :src="currentUser.avatar" :alt="currentUser.name" class="user-avatar-small">
                    <textarea 
                      v-model="newComment" 
                      placeholder="请先登录再评论..."
                      rows="3"
                      :disabled="!isLogin"
                    ></textarea>
                  </div>
                  <div class="comment-actions">
                    <button 
                      class="btn btn-primary" 
                      :disabled="!isLogin || !newComment.trim()"
                      @click="isLogin ? addComment() : $emit('needLogin')"
                    >
                      发表评论
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 社区统计 -->
            <div class="community-stats" v-else>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fa fa-users"></i>
                  </div>
                  <div class="stat-info">
                    <h3>1,234</h3>
                    <p>活跃用户</p>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fa fa-comments"></i>
                  </div>
                  <div class="stat-info">
                    <h3>5,678</h3>
                    <p>讨论帖子</p>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">
                    <i class="fa fa-heart"></i>
                  </div>
                  <div class="stat-info">
                    <h3>9,012</h3>
                    <p>今日互动</p>
                  </div>
                </div>
              </div>

              <!-- 热门标签 -->
              <div class="popular-tags">
                <h3>热门标签</h3>
                <div class="tags-list">
                  <span class="tag">#动作电影</span>
                  <span class="tag">#取景地推荐</span>
                  <span class="tag">#观影感受</span>
                  <span class="tag">#电影解析</span>
                  <span class="tag">#经典场景</span>
                  <span class="tag">#拍摄技巧</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 发布新话题模态框 -->
    <div v-if="showCreatePost" class="modal-overlay" @click="showCreatePost = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>发布新话题</h3>
          <button class="btn-close" @click="showCreatePost = false">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createNewPost">
            <div class="form-group">
              <label>标题</label>
              <input 
                type="text" 
                v-model="newPost.title" 
                placeholder="请输入话题标题..."
                required
              >
            </div>
            <div class="form-group">
              <label>内容</label>
              <textarea 
                v-model="newPost.content" 
                placeholder="请输入话题内容..."
                rows="6"
                required
              ></textarea>
            </div>
            <!-- 新增评分选择 -->
            <div class="form-group">
              <label>电影评分（选填）</label>
              <div class="rating-selection">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  @click="setRating(star)"
                  @mouseover="setHoverRating(star)"
                  @mouseleave="resetHoverRating()"
                  class="rating-star"
                >
                  <i 
                    :class="[
                      (hoverRating >= star || newPost.rating >= star) ? 'fa-star' : 'fa-star-o',
                      'rating-star-icon'
                    ]"
                  ></i>
                </span>
                <span class="rating-value">{{ newPost.rating > 0 ? `${newPost.rating}星` : '未评分' }}</span>
              </div>
            </div>
            <div class="form-group">
              <label>标签</label>
              <div class="tags-input">
                <span 
                  v-for="tag in newPost.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                  <button @click="removeTag(tag)">×</button>
                </span>
                <input 
                  type="text" 
                  v-model="tagInput" 
                  placeholder="添加标签..."
                  @keydown.enter.prevent="addTag"
                >
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="showCreatePost = false">
                取消
              </button>
              <button type="submit" class="btn btn-primary">
                发布
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Community',
  props: {
    isLogin: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default: () => ({
        id: '',
        name: '游客',
        avatar: 'https://via.placeholder.com/40/999/ffffff?text=游客'
      })
    }
  },
  data() {
    return {
      showCreatePost: false,
      selectedDiscussion: null,
      newComment: '',
      tagInput: '',
      hoverRating: 0, // 评分hover预览
      newPost: {
        title: '',
        content: '',
        tags: [],
        rating: 0 // 新增评分字段（0为未评分）
      },
      discussions: [
        {
          id: 1,
          title: '《霸王别姬》取景地故宫的拍摄故事',
          content: '有人知道《霸王别姬》在故宫拍摄的具体场景吗？想亲自去感受一下那种历史氛围...',
          user: {
            id: 2,
            name: '电影爱好者',
            avatar: 'https://via.placeholder.com/40/e74c3c/ffffff?text=影迷'
          },
          time: '2小时前',
          likes: 24,
          rating: 4, // 新增评分（4星）
          tags: ['#霸王别姬', '#故宫', '#经典电影'],
          comments: [
            {
              id: 1,
              content: '故宫的午门广场是主要取景地，程蝶衣和段小楼在那里有很多经典对手戏。',
              user: {
                id: 3,
                name: '历史电影迷',
                avatar: 'https://via.placeholder.com/32/2ecc71/ffffff?text=历史'
              },
              time: '1小时前',
              likes: 8
            },
            {
              id: 2,
              content: '去年我去过，确实能感受到电影中的那种沧桑感，推荐早上去人少的时候。',
              user: {
                id: 4,
                name: '旅行达人',
                avatar: 'https://via.placeholder.com/32/f39c12/ffffff?text=旅行'
              },
              time: '30分钟前',
              likes: 5
            }
          ]
        },
        {
          id: 2,
          title: '张家界真的是《阿凡达》的灵感来源吗？',
          content: '一直听说《阿凡达》的悬浮山灵感来自张家界，有人了解具体的联系吗？',
          user: {
            id: 5,
            name: '科幻迷',
            avatar: 'https://via.placeholder.com/40/9b59b6/ffffff?text=科幻'
          },
          time: '5小时前',
          likes: 18,
          rating: 5, // 新增评分（5星）
          tags: ['#阿凡达', '#张家界', '#科幻电影'],
          comments: [
            {
              id: 3,
              content: '是的，导演卡梅隆亲自确认过，张家界的乾坤柱就是悬浮山的原型。',
              user: {
                id: 6,
                name: '电影研究者',
                avatar: 'https://via.placeholder.com/32/34495e/ffffff?text=研究'
              },
              time: '3小时前',
              likes: 12
            }
          ]
        },
        {
          id: 3,
          title: '推荐几个适合拍照的电影取景地',
          content: '想规划一次电影取景地旅行，求推荐拍照效果好的地方！',
          user: {
            id: 7,
            name: '摄影爱好者',
            avatar: 'https://via.placeholder.com/40/1abc9c/ffffff?text=摄影'
          },
          time: '1天前',
          likes: 32,
          rating: 4, // 新增评分（4星）
          tags: ['#取景地', '#摄影', '#旅行'],
          comments: [
            {
              id: 4,
              content: '重庆洪崖洞的夜景超级美，特别是《从你的全世界路过》的取景角度。',
              user: {
                id: 8,
                name: '重庆本地人',
                avatar: 'https://via.placeholder.com/32/e67e22/ffffff?text=重庆'
              },
              time: '20小时前',
              likes: 15
            },
            {
              id: 5,
              content: '上海外滩也很不错，现代感十足，很多都市剧都在那里取景。',
              user: {
                id: 9,
                name: '上海影迷',
                avatar: 'https://via.placeholder.com/32/3498db/ffffff?text=上海'
              },
              time: '18小时前',
              likes: 9
            }
          ]
        }
      ]
    }
  },
  methods: {
    selectDiscussion(discussion) {
      this.selectedDiscussion = discussion
    },
    addComment() {
      if (!this.newComment.trim() || !this.selectedDiscussion) return
      
      const newComment = {
        id: Date.now(),
        content: this.newComment,
        user: this.currentUser,
        time: '刚刚',
        likes: 0
      }
      
      this.selectedDiscussion.comments.push(newComment)
      this.newComment = ''
    },
    addTag() {
      if (this.tagInput.trim() && !this.newPost.tags.includes(this.tagInput)) {
        this.newPost.tags.push(this.tagInput.trim())
        this.tagInput = ''
      }
    },
    removeTag(tag) {
      this.newPost.tags = this.newPost.tags.filter(t => t !== tag)
    },
    createNewPost() {
      const newDiscussion = {
        id: Date.now(),
        title: this.newPost.title,
        content: this.newPost.content,
        user: this.currentUser,
        time: '刚刚',
        likes: 0,
        tags: [...this.newPost.tags],
        comments: [],
        rating: this.newPost.rating // 保存评分
      }
      
      this.discussions.unshift(newDiscussion)
      this.showCreatePost = false
      this.resetNewPost()
    },
    resetNewPost() {
      this.newPost = {
        title: '',
        content: '',
        tags: [],
        rating: 0 // 重置评分
      }
      this.tagInput = ''
      this.hoverRating = 0 // 重置hover预览
    },
    // 新增评分相关方法
    setRating(star) {
      this.newPost.rating = star
    },
    setHoverRating(star) {
      this.hoverRating = star
    },
    resetHoverRating() {
      this.hoverRating = 0
    }
  },
  mounted() {
    console.log('社区页面加载完成')
  }
};
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  background: #0a0e17;
  overflow-y: auto;
}

.page-header {
  background: linear-gradient(135deg, #0c1a3a, #1a3a5f);
  color: #e0f7ff;
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid #00e5ff;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.2);
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.7);
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.community-content {
  padding: 3rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.community-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

/* 讨论区样式 */
.discussions-section {
  background: #121a2b;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid #1e3a5f;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #00e5ff;
  margin: 0;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

/* 讨论列表 */
.discussions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.discussion-card {
  background: #0d1525;
  border-radius: 6px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #1e3a5f;
  position: relative;
  overflow: hidden;
}

.discussion-card:hover {
  border-color: #00e5ff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 229, 255, 0.3);
}

.discussion-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #00e5ff, #0066ff);
}

.discussion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 新增：讨论元数据容器（统计+评分） */
.discussion-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #00e5ff;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #00e5ff;
}

.user-details h4 {
  margin: 0;
  color: #e0f7ff;
  font-size: 1rem;
}

.user-details h5 {
  margin: 0;
  color: #a0b3c6;
  font-size: 0.9rem;
}

.post-time, .comment-time {
  color: #5d7a9c;
  font-size: 0.8rem;
  margin: 0;
}

.discussion-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #5d7a9c;
  font-size: 0.9rem;
}

.discussion-title {
  font-size: 1.2rem;
  color: #e0f7ff;
  margin-bottom: 0.5rem;
}

.discussion-content {
  color: #a0b3c6;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.discussion-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(0, 229, 255, 0.1);
  color: #00e5ff;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(0, 229, 255, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.tag button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
}

/* 评分相关样式 */
.rating-selection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.rating-star {
  cursor: pointer;
  font-size: 1.25rem;
  transition: transform 0.2s ease, color 0.2s ease;
  color: #5d7a9c;
}

.rating-star:hover {
  transform: scale(1.1);
  color: #00e5ff;
}

.rating-star-icon.fa-star {
  color: #00e5ff;
}

.rating-star-icon.fa-star-o {
  color: #5d7a9c;
}

.rating-value {
  color: #e0f7ff;
  font-size: 1rem;
  min-width: 80px;
  text-align: left;
}

/* 讨论卡片评分 */
.discussion-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #a0b3c6;
  font-size: 0.9rem;
}

/* 详情页评分 */
.post-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #a0b3c6;
  font-size: 0.95rem;
}

.rating-label {
  font-size: 0.9rem;
  color: #5d7a9c;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.rating-number {
  color: #e0f7ff;
  font-size: 0.9rem;
  margin-left: 0.3rem;
}

/* 侧边栏样式 */
.sidebar {
  position: sticky;
  top: 2rem;
}

.discussion-detail, .community-stats {
  background: #121a2b;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid #1e3a5f;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #1e3a5f;
}

.detail-header h3 {
  margin: 0;
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

.btn-close {
  background: none;
  border: none;
  color: #5d7a9c;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-close:hover {
  background: rgba(0, 229, 255, 0.1);
  color: #00e5ff;
}

.original-post {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #1e3a5f;
}

.post-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.post-content {
  color: #a0b3c6;
  line-height: 1.6;
}

/* 评论区域 */
.comments-section h4 {
  color: #00e5ff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.3);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.comment {
  padding: 1rem;
  background: #0d1525;
  border-radius: 6px;
  border-left: 3px solid #00e5ff;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.comment-content {
  color: #a0b3c6;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  background: none;
  border: none;
  color: #5d7a9c;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.3s ease;
}

.action-btn:hover {
  color: #00e5ff;
}

/* 添加评论 */
.add-comment {
  background: #0d1525;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #1e3a5f;
}

.comment-input {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-input textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
  background: #0a0e17;
  color: #e0f7ff;
}

.comment-input textarea:disabled {
  background: #1a1f2e;
  color: #888;
  cursor: not-allowed;
  border-color: #333;
}

.comment-input textarea:focus {
  outline: none;
  border-color: #00e5ff;
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
}

/* 社区统计 */
.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #0d1525;
  border-radius: 6px;
  border: 1px solid #1e3a5f;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00e5ff, #0066ff);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0e17;
  font-size: 1.2rem;
}

.stat-info h3 {
  margin: 0;
  color: #e0f7ff;
}

.stat-info p {
  margin: 0;
  color: #5d7a9c;
  font-size: 0.9rem;
}

.popular-tags h3 {
  color: #00e5ff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.3);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: #121a2b;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid #1e3a5f;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #1e3a5f;
}

.modal-header h3 {
  margin: 0;
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e0f7ff;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.9rem;
  background: #0a0e17;
  color: #e0f7ff;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #00e5ff;
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #1e3a5f;
  border-radius: 6px;
  min-height: 50px;
  background: #0a0e17;
}

.tags-input input {
  flex: 1;
  border: none;
  padding: 0;
  min-width: 100px;
  background: transparent;
  color: #e0f7ff;
}

.tags-input input:focus {
  outline: none;
  box-shadow: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #00e5ff, #0066ff);
  color: #0a0e17;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 229, 255, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: #555;
  box-shadow: none;
}

.btn-outline {
  background: transparent;
  color: #00e5ff;
  border: 1px solid #00e5ff;
}

.btn-outline:hover {
  background: rgba(0, 229, 255, 0.1);
  color: #00e5ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .community-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .discussion-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .discussion-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>