# 奥特曼逻辑推理游戏 - 部署说明

## 快速部署

### 1. 本地运行
```bash
# 进入游戏目录
cd ultraman-logic-game

# 使用Python启动本地服务器
python -m http.server 8000

# 或使用Node.js
npx http-server

# 或使用PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

### 2. 静态网站托管

#### Vercel部署
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### Netlify部署
1. 将项目文件拖拽到Netlify的部署区域
2. 或连接GitHub仓库自动部署

#### GitHub Pages部署
1. 将项目推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支为main

### 3. 服务器部署

#### Nginx配置
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/ultraman-logic-game;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache配置
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/ultraman-logic-game
    
    <Directory /path/to/ultraman-logic-game>
        AllowOverride All
        Require all granted
    </Directory>
    
    # 静态资源缓存
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

## 环境要求

### 最低要求
- 现代浏览器（Chrome 60+, Firefox 55+, Safari 12+, Edge 79+）
- 支持JavaScript ES6+
- 支持CSS3动画
- 支持本地存储（LocalStorage）

### 推荐配置
- 2GB RAM
- 现代CPU
- 稳定的网络连接（用于LLM API调用）

## 配置说明

### 1. API配置
在 `config/gameConfig.js` 中修改LLM API配置：

```javascript
llmConfig: {
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free',
    maxTokens: 500,
    temperature: 0.7
}
```

### 2. 游戏配置
可以调整游戏参数：

```javascript
difficulty: {
    easy: {
        timeLimit: 45,        // 时间限制（秒）
        questionsPerLevel: 5, // 每关题目数量
        scoreMultiplier: 1    // 分数倍数
    }
}
```

### 3. 样式配置
在 `css/main.css` 中修改主题颜色：

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ffd700;
}
```

## 性能优化

### 1. 资源压缩
```bash
# 压缩CSS
npx clean-css-cli -o css/main.min.css css/main.css

# 压缩JavaScript
npx terser js/main.js -o js/main.min.js
```

### 2. 图片优化
- 使用WebP格式图片
- 压缩图片文件大小
- 使用适当的图片尺寸

### 3. 缓存策略
- 设置静态资源缓存头
- 使用CDN加速
- 启用Gzip压缩

## 安全考虑

### 1. HTTPS
- 使用HTTPS协议
- 配置SSL证书
- 启用HSTS

### 2. 内容安全策略
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 3. API安全
- 使用环境变量存储API密钥
- 限制API调用频率
- 验证API响应

## 监控和维护

### 1. 错误监控
```javascript
// 添加错误监控
window.addEventListener('error', (e) => {
    console.error('游戏错误:', e.error);
    // 发送错误报告到监控服务
});
```

### 2. 性能监控
```javascript
// 监控页面加载时间
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log('页面加载时间:', loadTime);
});
```

### 3. 用户分析
- 集成Google Analytics
- 监控用户行为
- 分析游戏数据

## 故障排除

### 常见问题

#### 1. 题目加载失败
**原因**: API配置错误或网络问题
**解决**: 检查API配置和网络连接

#### 2. 动画卡顿
**原因**: 设备性能不足
**解决**: 降低动画复杂度或关闭动画

#### 3. 数据丢失
**原因**: 浏览器本地存储被清除
**解决**: 实现数据备份和恢复功能

#### 4. 音效无法播放
**原因**: 浏览器音效权限问题
**解决**: 检查浏览器音效权限设置

### 调试工具

#### 1. 浏览器开发者工具
- F12打开开发者工具
- 查看Console错误信息
- 检查Network请求

#### 2. 游戏调试模式
```javascript
// 在控制台中启用调试模式
window.ultramanGame.debugMode = true;
```

#### 3. 日志记录
```javascript
// 启用详细日志
localStorage.setItem('debug', 'true');
```

## 更新和维护

### 1. 版本管理
- 使用语义化版本号
- 记录更新日志
- 提供回滚方案

### 2. 数据迁移
- 备份用户数据
- 提供数据迁移脚本
- 测试兼容性

### 3. 功能扩展
- 添加新题目类型
- 增加新的奥特曼卡片
- 优化用户体验

## 联系支持

如果遇到部署问题，请：
1. 查看本文档的故障排除部分
2. 检查浏览器控制台错误信息
3. 联系技术支持团队

---

**注意**: 本游戏需要网络连接才能使用LLM功能。如果无法访问外部API，游戏将使用备用题目。
