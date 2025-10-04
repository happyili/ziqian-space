# 奥特曼逻辑推理游戏

## 游戏概述
这是一个专为10岁儿童设计的奥特曼主题逻辑推理游戏，结合记忆训练和逻辑思维培养。

## 游戏特色
- 🦸‍♂️ 奥特曼主题卡通界面
- 🧠 逻辑推理题目训练
- 🎯 记忆能力锻炼
- ⏱️ 计时挑战系统
- 🏆 分数排行榜
- 🎴 奥特曼卡片收集
- 🤖 AI智能题目生成

## 技术架构
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **AI集成**: OpenRouter API
- **存储**: LocalStorage
- **动画**: CSS3 Animations + JavaScript

## 模块结构
```
ultraman-logic-game/
├── index.html              # 主游戏页面
├── css/
│   ├── main.css           # 主样式文件
│   ├── animations.css     # 动画效果
│   └── responsive.css     # 响应式设计
├── js/
│   ├── main.js           # 主游戏逻辑
│   ├── gameEngine.js     # 游戏引擎
│   ├── questionSystem.js # 题目系统
│   ├── scoringSystem.js  # 计分系统
│   ├── cardCollection.js # 卡片收集
│   ├── animationEngine.js # 动画引擎
│   └── llmIntegration.js # LLM集成
├── assets/
│   ├── images/           # 游戏图片资源
│   ├── sounds/           # 音效文件
│   └── fonts/            # 字体文件
└── config/
    ├── gameConfig.js     # 游戏配置
    └── questionTemplates.js # 题目模板
```

## 游戏流程
1. **开始界面**: 选择难度等级
2. **探险通道**: 奥特曼进入不同通道
3. **怪兽卡片**: 显示逻辑推理题目
4. **答题环节**: 选择正确答案
5. **奖励收集**: 获得奥特曼卡片
6. **结果总结**: 能力分析和建议

## 扩展性设计
- 模块化架构，易于添加新功能
- 可配置的题目模板系统
- 支持多种难度等级
- 可扩展的卡片收集系统
- 灵活的动画系统
