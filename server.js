const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 用户数据存储路径
const USERS_FILE = path.join(__dirname, 'users.json');

// 中间件配置
app.use(cors()); // 支持跨域请求（适配前端Vue项目）
app.use(express.json()); // 解析JSON请求体
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件服务（兼容前端页面）

// 初始化用户数据文件
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
}

// 读取用户数据
const readUsers = () => {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
};

// 写入用户数据
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};


// 1. 新用户注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 验证必填字段
    if (!username || !password || !email) {
      return res.status(400).json({ message: '用户名、密码、邮箱不能为空' });
    }

    const users = readUsers();

    // 检查用户名或邮箱是否已存在
    const existingUser = users.find(
      user => user.username === username || user.email === email
    );
    if (existingUser) {
      return res.status(409).json({ message: '用户名或邮箱已被注册' });
    }

    // 密码加密（10轮盐值）
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 新增用户数据
    const newUser = {
      id: Date.now().toString(), // 生成唯一ID
      username,
      email,
      password: hashedPassword, // 存储加密后的密码
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeUsers(users);

    // 返回注册成功信息（不含密码）
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: '注册成功',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '服务器错误，注册失败' });
  }
});


//2. 用户账号提取接口（支持登录验证与用户列表查询）
// 登录验证（提取用户账号并验证密码）
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = readUsers();
    const user = users.find(user => user.username === username);

    // 验证用户存在性和密码正确性
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 返回用户信息（不含密码）
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: '登录成功',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误，登录失败' });
  }
});

// 获取所有用户列表（仅返回公开信息，不含密码）
app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    // 过滤敏感信息
    const safeUsers = users.map(({ password, ...rest }) => rest);
    res.status(200).json(safeUsers);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '服务器错误，无法获取用户列表' });
  }
});


//3. 前端页面路由兼容（确保现有页面正常访问）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('支持接口：');
  console.log('- POST /api/register （用户注册）');
  console.log('- POST /api/login （用户登录/账号验证）');
  console.log('- GET /api/users （获取用户列表）');
});

module.exports = app;