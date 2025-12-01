<template>
  <div id="app">
    <!-- 全局导航栏 -->
    <nav class="global-nav">
      <div class="nav-container">
        <router-link to="/" class="logo">
          <i class="fa fa-film"></i>
          <span>电影取景地探索</span>
        </router-link>
        
        <div class="nav-menu">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ active: $route.path === '/' }"
          >
            <i class="fa fa-home"></i>
            首页
          </router-link>
          <router-link 
            to="/moviemap" 
            class="nav-link"
            :class="{ active: $route.path === '/moviemap' }"
          >
            <i class="fa fa-map"></i>
            地图探索
          </router-link>
          <router-link 
            to="/cinema-search" 
            class="nav-link"
            :class="{ active: $route.path === '/cinema-search' }"
          >
            <i class="fa fa-map-marker"></i>
            影院搜索
          </router-link>
          <router-link 
            to="/library" 
            class="nav-link"
            :class="{ active: $route.path === '/library' }"
          >
            <i class="fa fa-video-camera"></i>
            电影库
          </router-link>
          <router-link 
            to="/rankings" 
            class="nav-link"
            :class="{ active: $route.path === '/rankings' }"
          >
            <i class="fa fa-trophy"></i>
            排行榜
          </router-link>
          <router-link 
            to="/community" 
            class="nav-link"
            :class="{ active: $route.path === '/community' }"
          >
            <i class="fa fa-users"></i>
            社区
          </router-link>

          <!-- 导航栏登录/注册按钮（初始样式区分） -->
          <button 
            class="nav-link login-btn"
            @click="showLoginModal = true"
            v-if="!isLogin"
          >
            <i class="fa fa-sign-in"></i>
            登录
          </button>
          <button 
            class="nav-link register-btn"
            @click="showRegisterModal = true"
            v-if="!isLogin"
          >
            <i class="fa fa-user-plus"></i>
            注册
          </button>
          <div class="nav-link user-info" v-else>
            <span>{{ username }}</span>
            <button 
              class="logout-btn"
              @click="handleLogout"
              style="padding: 0 0.5rem; margin-left: 0.5rem"
            >
              <i class="fa fa-sign-out"></i>
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 登录弹窗（保持原有蓝色系，不修改） -->
    <div v-if="showLoginModal" class="modal-overlay">
      <div class="modal-content login-modal">
        <div class="modal-header">
          <h3>用户登录</h3>
          <button class="btn-close" @click="showLoginModal = false">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                v-model="loginForm.username"
                required
                class="login-input"
                placeholder="请输入用户名"
              >
            </div>
            <div class="form-group">
              <label>密码</label>
              <input 
                type="password" 
                v-model="loginForm.password"
                required
                class="login-input"
                placeholder="请输入密码"
              >
            </div>
            <!-- 测试账号提示 -->
            <div style="margin-bottom: 1rem; font-size: 0.8rem; color: #8d9ba8;">
              测试账号：test / 123456
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="showLoginModal = false">取消</button>
              <button type="submit" class="btn btn-login">登录</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 注册弹窗（保持原有红色系，不修改） -->
    <div v-if="showRegisterModal" class="modal-overlay">
      <div class="modal-content register-modal">
        <div class="modal-header">
          <h3>用户注册</h3>
          <button class="btn-close" @click="showRegisterModal = false">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                v-model="registerForm.username"
                required
                class="register-input"
                placeholder="请输入用户名"
              >
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input 
                type="email" 
                v-model="registerForm.email"
                required
                class="register-input"
                placeholder="请输入邮箱"
              >
            </div>
            <div class="form-group">
              <label>密码</label>
              <input 
                type="password" 
                v-model="registerForm.password"
                required
                minlength="6"
                class="register-input"
                placeholder="请输入至少6位密码"
              >
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="showRegisterModal = false">取消</button>
              <button type="submit" class="btn btn-register">注册</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view 
        :isLogin="isLogin" 
        :currentUser="{ id: userId, name: username, avatar: userAvatar }"
        @needLogin="showLoginModal = true"
      ></router-view>
    </main>

    <!-- 全局页脚 -->
    <footer class="global-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>电影取景地探索平台</h3>
          <p>发现电影背后的真实场景，从银幕到现实的奇妙旅程</p>
        </div>
        <div class="footer-links">
          <a href="#">关于我们</a>
          <a href="#">联系方式</a>
          <a href="#">隐私政策</a>
          <a href="#">使用帮助</a>
        </div>
        <div class="footer-copyright">
          <p>&copy; 2024 电影取景地探索平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      showLoginModal: false,
      showRegisterModal: false,
      isLogin: localStorage.getItem('isLogin') === 'true',
      username: localStorage.getItem('username') || '',
      userId: localStorage.getItem('userId') || '',
      userAvatar: localStorage.getItem('userAvatar') || 'https://via.placeholder.com/40/3498db/ffffff?text=用户',
      // 登录表单
      loginForm: { username: '', password: '' },
      // 注册表单
      registerForm: { username: '', email: '', password: '' },
      // 是否使用模拟数据（后端未就绪时启用）
      useMockData: true,
      // 接口基础地址
      apiBaseUrl: 'http://localhost:3001/api',
    };
  },
  methods: {
    // 注册功能（原生 fetch 实现，无 axios 依赖）
    async handleRegister() {
      try {
        console.log('注册请求数据：', this.registerForm);
        
        // 模拟注册（后端未就绪时使用，默认启用）
        if (this.useMockData) {
          // 简单输入验证
          if (this.registerForm.username.trim().length < 2) {
            alert('用户名至少2个字符');
            return;
          }
          if (this.registerForm.password.trim().length < 6) {
            alert('密码至少6个字符');
            return;
          }
          
          // 模拟注册成功
          alert('注册成功！可使用该账号登录');
          this.showRegisterModal = false;
          this.registerForm = { username: '', email: '', password: '' };
          // 自动打开登录弹窗
          this.showLoginModal = true;
          return;
        }

        // 真实接口请求（后端就绪时使用，需关闭 useMockData）
        const response = await fetch(`${this.apiBaseUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.registerForm),
          timeout: 5000, // 超时时间（原生 fetch 无 timeout，下方通过 Promise.race 实现）
        });

        // 处理响应
        if (!response.ok) {
          throw new Error(`HTTP错误！状态码：${response.status}`);
        }

        const res = await response.json();
        
        // 验证响应格式（兼容 code:200 或 success:true）
        if (res.code === 200 || res.success) {
          alert(res.message || '注册成功！');
          this.showRegisterModal = false;
          this.registerForm = { username: '', email: '', password: '' };
          this.showLoginModal = true; // 注册成功后自动跳转登录
        } else {
          alert(res.message || '注册失败，请重试');
        }
      } catch (error) {
        console.error('注册失败详情：', error);
        // 错误分类提示
        if (error.message.includes('timeout')) {
          alert('请求超时，请检查后端服务是否启动');
        } else if (error.message.includes('Failed to fetch')) {
          alert('网络错误，请检查接口地址是否正确或后端是否运行');
        } else {
          alert('注册失败：' + error.message);
        }
      }
    },

    // 登录功能（原生 fetch 实现，无 axios 依赖）
    async handleLogin() {
      try {
        console.log('登录请求数据：', this.loginForm);
        
        // 模拟登录（后端未就绪时使用，默认启用）
        if (this.useMockData) {
          // 测试账号：test/123456，或任意用户名（≥2位）+ 密码（≥6位）
          if ((this.loginForm.username === 'test' && this.loginForm.password === '123456') || 
              (this.loginForm.username.trim().length >= 2 && this.loginForm.password.trim().length >= 6)) {
            // 模拟登录成功数据
            const mockUser = {
              id: Date.now().toString(), // 用时间戳作为唯一ID
              username: this.loginForm.username,
              avatar: `https://via.placeholder.com/40/3498db/ffffff?text=${this.loginForm.username[0]}`,
            };
            
            // 保存登录状态到本地存储
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('username', mockUser.username);
            localStorage.setItem('userId', mockUser.id);
            localStorage.setItem('userAvatar', mockUser.avatar);
            
            // 更新页面状态
            this.isLogin = true;
            this.username = mockUser.username;
            this.userId = mockUser.id;
            this.userAvatar = mockUser.avatar;
            
            alert('登录成功！');
            this.showLoginModal = false;
            this.loginForm = { username: '', password: '' };
          } else {
            alert('登录失败：用户名或密码错误（测试账号：test/123456）');
          }
          return;
        }

        // 真实接口请求（后端就绪时使用，需关闭 useMockData）
        const response = await fetch(`${this.apiBaseUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.loginForm),
        });

        // 处理响应
        if (!response.ok) {
          throw new Error(`HTTP错误！状态码：${response.status}`);
        }

        const res = await response.json();
        
        // 验证响应格式
        if (res.code === 200 || res.success) {
          const user = res.user || {};
          
          // 保存登录状态
          localStorage.setItem('isLogin', 'true');
          localStorage.setItem('username', user.username || this.loginForm.username);
          localStorage.setItem('userId', user.id || Date.now().toString());
          localStorage.setItem('userAvatar', user.avatar || `https://via.placeholder.com/40/3498db/ffffff?text=${user.username?.[0] || '用'}`);
          
          // 更新页面状态
          this.isLogin = true;
          this.username = user.username || this.loginForm.username;
          this.userId = user.id || Date.now().toString();
          this.userAvatar = localStorage.getItem('userAvatar');
          
          alert(res.message || '登录成功！');
          this.showLoginModal = false;
          this.loginForm = { username: '', password: '' };
        } else {
          alert(res.message || '登录失败：用户名或密码错误');
        }
      } catch (error) {
        console.error('登录失败详情：', error);
        // 错误分类提示
        if (error.message.includes('Failed to fetch')) {
          alert('网络错误，请检查后端服务是否启动（端口3001）');
        } else {
          alert('登录失败：' + error.message);
        }
      }
    },

    // 退出登录
    handleLogout() {
      try {
        // 清除本地存储的登录状态
        localStorage.removeItem('isLogin');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('userAvatar');
        
        // 更新页面状态
        this.isLogin = false;
        this.username = '';
        this.userId = '';
        this.userAvatar = 'https://via.placeholder.com/40/3498db/ffffff?text=用户';
        
        alert('已退出登录');
      } catch (error) {
        console.error('退出登录失败：', error);
        alert('退出登录失败，请重试');
      }
    },
  },
  // 页面加载时恢复登录状态
  mounted() {
    try {
      const savedIsLogin = localStorage.getItem('isLogin') === 'true';
      if (savedIsLogin) {
        this.isLogin = true;
        this.username = localStorage.getItem('username') || '';
        this.userId = localStorage.getItem('userId') || '';
        this.userAvatar = localStorage.getItem('userAvatar') || 'https://via.placeholder.com/40/3498db/ffffff?text=用户';
      }
    } catch (error) {
      console.error('恢复登录状态失败：', error);
    }
  },
};
</script>

<style>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #e0e0e0;
  background: linear-gradient(135deg, #0a0f19 0%, #1a1f2e 100%);
}

body {
  overflow-y: auto !important;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

/* 导航栏样式 - 机甲科技主题 */
.global-nav {
  background: rgba(10, 15, 25, 0.95);
  padding: 0;
  box-shadow: 
    0 2px 20px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(0, 247, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 247, 255, 0.3);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #00f7ff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 0;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
  transition: all 0.3s ease;
}

.logo:hover {
  color: #ffffff;
  text-shadow: 
    0 0 15px rgba(0, 247, 255, 0.8),
    0 0 20px rgba(0, 247, 255, 0.4);
}

.logo i {
  font-size: 1.8rem;
  color: #00f7ff;
  text-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b0b8c0;
  text-decoration: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #00f7ff, #ff3366);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(0, 247, 255, 0.5);
}

.nav-link::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 247, 255, 0.1), transparent);
  transition: left 0.5s;
}

.nav-link:hover::after {
  left: 100%;
}

.nav-link:hover::before,
.nav-link.active::before {
  width: 80%;
}

.nav-link:hover,
.nav-link.active {
  background-color: rgba(0, 247, 255, 0.1);
  color: #00f7ff;
  transform: translateY(-2px);
  border: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.2);
}

.nav-link i {
  font-size: 1.1rem;
}

/* 页脚样式 - 机甲科技主题 */
.global-footer {
  background: rgba(10, 15, 25, 0.95);
  color: #b0b8c0;
  padding: 3rem 0 1.5rem;
  margin-top: auto;
  border-top: 1px solid rgba(0, 247, 255, 0.3);
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.3);
  position: relative;
}

.global-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00f7ff, transparent);
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.5);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-section {
  text-align: center;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #00f7ff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.3);
}

.footer-section p {
  color: #b0b8c0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.footer-links a {
  color: #b0b8c0;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.footer-links a::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #00f7ff;
  transition: width 0.3s ease;
  box-shadow: 0 0 5px rgba(0, 247, 255, 0.5);
}

.footer-links a:hover {
  color: #00f7ff;
  text-shadow: 0 0 5px rgba(0, 247, 255, 0.3);
}

.footer-links a:hover::before {
  width: 100%;
}

.footer-copyright {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 247, 255, 0.2);
  color: #8d9ba8;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-menu {
    gap: 0.25rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 1rem;
  }
  
  .nav-link {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .footer-links {
    gap: 1rem;
  }
  
  .footer-links a {
    font-size: 0.9rem;
  }
  
  .footer-section h3 {
    font-size: 1.3rem;
  }
  
  .footer-section p {
    font-size: 0.9rem;
  }
}

/* 核心修改：导航栏登录/注册按钮 初始样式区分 */
/* 登录按钮 - 初始蓝色系 */
.login-btn {
  color: #00f7ff !important;
  border-color: rgba(0, 247, 255, 0.4) !important;
  background-color: rgba(0, 247, 255, 0.05) !important;
}

.login-btn:hover {
  border-color: rgba(0, 247, 255, 0.8) !important;
  background-color: rgba(0, 247, 255, 0.15) !important;
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.4) !important;
}

/* 注册按钮 - 初始红色系 */
.register-btn {
  color: #ff3366 !important;
  border-color: rgba(255, 51, 102, 0.4) !important;
  background-color: rgba(255, 51, 102, 0.05) !important;
}

.register-btn:hover {
  border-color: rgba(255, 51, 102, 0.8) !important;
  background-color: rgba(255, 51, 102, 0.15) !important;
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.4) !important;
}

/* 退出按钮样式 */
.logout-btn {
  background: none;
  border: 1px solid transparent;
  color: #b0b8c0;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.logout-btn:hover {
  color: #ff3366;
  border-color: rgba(255, 51, 102, 0.3);
  background: rgba(255, 51, 102, 0.1);
}

/* 弹窗基础样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: #121a2b;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  padding: 1.2rem;
  background: linear-gradient(90deg, #0a0f19, #1a1f2e);
  border-bottom: 1px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  text-shadow: 0 0 10px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #b0b8c0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  color: #ff3366;
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #b0b8c0;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid;
}

/* 登录弹窗样式（蓝色系） */
.login-modal {
  border: 1px solid #00f7ff;
  box-shadow: 0 0 30px rgba(0, 247, 255, 0.2);
}

.login-modal .modal-header {
  border-bottom-color: #00f7ff;
}

.login-modal .modal-header h3 {
  color: #00f7ff;
  text-shadow: 0 0 8px rgba(0, 247, 255, 0.5);
}

.login-input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #00f7ff;
  background: rgba(10, 15, 25, 0.5);
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.login-input:focus {
  outline: none;
  border-color: #00f7ff;
  box-shadow: 0 0 10px rgba(0, 247, 255, 0.3);
}

.btn-login {
  background: linear-gradient(90deg, #00f7ff, #00a8b0);
  color: #0a0f19;
  border: none;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 247, 255, 0.4);
}

.login-modal .btn-outline {
  border-color: #00f7ff;
  color: #00f7ff;
}

.login-modal .btn-outline:hover {
  background: rgba(0, 247, 255, 0.1);
}

/* 注册弹窗样式（红色系） */
.register-modal {
  border: 1px solid #ff3366;
  box-shadow: 0 0 30px rgba(255, 51, 102, 0.2);
}

.register-modal .modal-header {
  border-bottom-color: #ff3366;
}

.register-modal .modal-header h3 {
  color: #ff3366;
  text-shadow: 0 0 8px rgba(255, 51, 102, 0.5);
}

.register-input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ff3366;
  background: rgba(10, 15, 25, 0.5);
  color: #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.register-input:focus {
  outline: none;
  border-color: #ff3366;
  box-shadow: 0 0 10px rgba(255, 51, 102, 0.3);
}

.btn-register {
  background: linear-gradient(90deg, #ff3366, #c02647);
  color: #fff;
  border: none;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(255, 51, 102, 0.4);
}

.register-modal .btn-outline {
  border-color: #ff3366;
  color: #ff3366;
}

.register-modal .btn-outline:hover {
  background: rgba(255, 51, 102, 0.1);
}
</style>