# OpenRouter API CORS 问题解决方案

## 问题分析

你遇到的404和CORS错误主要有以下几个原因：

### 1. API URL错误
- **错误URL**: `https://openrouter.co/v1/chat/completions`
- **正确URL**: `https://openrouter.ai/api/v1/chat/completions`

### 2. CORS策略
OpenRouter API 支持CORS，但需要正确的请求头配置。

## 解决方案

### 方案1: 修复API配置（推荐）

1. **更新API URL**：
```javascript
// 在 gameConfig.js 中确保使用正确的URL
llmConfig: {
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.1-8b-instruct:free', // 免费模型
    // ... 其他配置
}
```

2. **优化请求头**：
```javascript
headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Ultraman Logic Game',
    'Accept': 'application/json'
}
```

### 方案2: 使用CORS代理（备选）

如果直接调用仍有CORS问题，可以使用代理：

```javascript
// 使用CORS代理
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = proxyUrl + 'https://openrouter.ai/api/v1/chat/completions';
```

### 方案3: 服务器端代理（最佳）

创建一个简单的Node.js代理服务器：

```javascript
// proxy-server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/openrouter', async (req, res) => {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': req.headers.authorization,
                'Content-Type': 'application/json',
                'HTTP-Referer': req.headers['http-referer'],
                'X-Title': req.headers['x-title']
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('代理服务器运行在端口3001');
});
```

## 测试步骤

1. **使用测试页面**：
   - 打开 `cors-fix-test.html`
   - 输入你的API Key
   - 运行各种测试

2. **检查网络请求**：
   - 打开浏览器开发者工具
   - 查看Network标签页
   - 检查请求状态和响应头

3. **验证API Key**：
   - 确保API Key有效
   - 检查账户余额（如果使用付费模型）

## 常见错误处理

### 404错误
- 检查API URL是否正确
- 确认模型名称是否有效

### CORS错误
- 添加正确的请求头
- 使用HTTPS协议
- 考虑使用代理服务器

### 401错误
- 检查API Key是否正确
- 确认API Key权限

### 429错误
- 请求频率过高
- 实现重试机制和限流

## 代码修复

已修复的文件：
- `gameConfig.js`: 确保使用正确的API URL
- `llmIntegration.js`: 优化请求头配置
- `test-api-fix.html`: 修复测试URL
- `cors-fix-test.html`: 新增综合测试页面

## 下一步

1. 运行 `cors-fix-test.html` 进行测试
2. 如果仍有问题，考虑使用服务器端代理
3. 监控API使用情况和错误日志
