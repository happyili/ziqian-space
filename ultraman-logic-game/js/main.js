// 主程序文件 - 游戏初始化和主要逻辑
class UltramanLogicGame {
    constructor() {
        this.gameEngine = null;
        this.scoringSystem = null;
        this.cardCollection = null;
        this.animationEngine = null;
        this.resultSummary = null;
        this.questionSystem = null;
        
        this.init();
    }

    // 初始化游戏
    init() {
        try {
            // 初始化各个系统
            this.scoringSystem = new ScoringSystem();
            this.cardCollection = new CardCollection();
            this.animationEngine = new AnimationEngine();
            this.resultSummary = new ResultSummary();
            this.questionSystem = new QuestionSystem();
            
            // 初始化游戏引擎
            this.gameEngine = new GameEngine();
            
            // 设置游戏引擎的依赖
            this.setupGameEngineDependencies();
            
            // 初始化UI
            this.initializeUI();
            
            // 显示开始界面
            this.showStartScreen();
            
            console.log('奥特曼逻辑推理游戏初始化完成！');
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.showError('游戏初始化失败，请刷新页面重试');
        }
    }

    // 设置游戏引擎依赖
    setupGameEngineDependencies() {
        // 将各个系统注入到游戏引擎中
        this.gameEngine.scoringSystem = this.scoringSystem;
        this.gameEngine.cardCollection = this.cardCollection;
        this.gameEngine.animationEngine = this.animationEngine;
        this.gameEngine.resultSummary = this.resultSummary;
        this.gameEngine.questionSystem = this.questionSystem;
    }

    // 初始化UI
    initializeUI() {
        // 更新高分显示
        this.updateHighScoresDisplay();
        
        // 更新卡片收集显示
        this.updateCardCollectionDisplay();
        
        // 设置音效控制
        this.setupAudioControls();
        
        // 设置键盘快捷键
        this.setupKeyboardShortcuts();
    }

    // 更新高分显示
    updateHighScoresDisplay() {
        const highScores = this.scoringSystem.getHighScores();
        if (highScores.length > 0) {
            const highestScore = highScores[0];
            console.log(`最高分: ${highestScore.score}分 (${highestScore.difficulty})`);
        }
    }

    // 更新卡片收集显示
    updateCardCollectionDisplay() {
        const cardStats = this.cardCollection.getCardStats();
        console.log(`已收集卡片: ${cardStats.total}张`);
    }

    // 设置音效控制
    setupAudioControls() {
        // 检查浏览器是否支持音效
        const audio = document.getElementById('bg-music');
        if (audio) {
            audio.volume = 0.3; // 设置背景音乐音量
        }
    }

    // 设置键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 只在游戏界面响应快捷键
            if (!document.getElementById('game-screen').classList.contains('active')) {
                return;
            }
            
            switch(e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                    // 选择答案
                    const optionIndex = parseInt(e.key) - 1;
                    const optionButtons = document.querySelectorAll('.option-btn');
                    if (optionButtons[optionIndex]) {
                        optionButtons[optionIndex].click();
                    }
                    break;
                case 'h':
                case 'H':
                    // 显示提示
                    document.getElementById('hint-btn').click();
                    break;
                case 's':
                case 'S':
                    // 跳过题目
                    document.getElementById('skip-btn').click();
                    break;
                case 'f':
                case 'F':
                    // 翻转卡片
                    document.getElementById('flip-card-btn').click();
                    break;
            }
        });
    }

    // 显示开始界面
    showStartScreen() {
        this.gameEngine.showStartScreen();
    }

    // 显示错误信息
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3>❌ 错误</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="action-btn primary">重新加载</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 添加错误样式
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .error-content {
                background: white;
                border-radius: 20px;
                padding: 30px;
                text-align: center;
                color: #333;
                max-width: 400px;
            }
            .error-content h3 {
                color: #e74c3c;
                margin-bottom: 15px;
            }
        `;
        document.head.appendChild(style);
    }

    // 获取游戏统计信息
    getGameStats() {
        return {
            scoring: this.scoringSystem.getScoreStats(),
            cards: this.cardCollection.getCardStats(),
            achievements: this.resultSummary.generateAchievements({
                score: this.scoringSystem.getCurrentScore(),
                accuracy: 0,
                cards: this.cardCollection.getCollectedCards(),
                avgTime: 0
            })
        };
    }

    // 重置游戏数据
    resetGameData() {
        this.scoringSystem.clearAllData();
        this.cardCollection.clearAllCards();
        console.log('游戏数据已重置');
    }

    // 导出游戏数据
    exportGameData() {
        const data = {
            scores: this.scoringSystem.exportData(),
            cards: this.cardCollection.exportCards(),
            stats: this.getGameStats(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ultraman-game-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // 导入游戏数据
    importGameData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.scores) {
                    this.scoringSystem.importData(data.scores);
                }
                
                if (data.cards) {
                    this.cardCollection.importCards(data.cards);
                }
                
                console.log('游戏数据导入成功');
                this.showMessage('游戏数据导入成功！');
            } catch (error) {
                console.error('导入数据失败:', error);
                this.showMessage('导入数据失败，请检查文件格式');
            }
        };
        reader.readAsText(file);
    }

    // 显示消息
    showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'game-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 1.1rem;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // 检查浏览器兼容性
    checkBrowserCompatibility() {
        const features = {
            localStorage: typeof Storage !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            audio: typeof Audio !== 'undefined',
            canvas: typeof HTMLCanvasElement !== 'undefined'
        };
        
        const unsupported = Object.keys(features).filter(key => !features[key]);
        
        if (unsupported.length > 0) {
            console.warn('浏览器不支持以下功能:', unsupported);
            return false;
        }
        
        return true;
    }

    // 获取游戏版本信息
    getVersionInfo() {
        return {
            version: '1.0.0',
            buildDate: '2024-01-01',
            features: [
                '奥特曼主题界面',
                '逻辑推理题目',
                '卡片收集系统',
                '分数排行榜',
                'AI智能分析',
                '动画效果',
                '音效支持',
                '响应式设计'
            ]
        };
    }
}

// 游戏启动
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 开始初始化奥特曼逻辑推理游戏...');
        
        // 创建游戏实例
        const game = new UltramanLogicGame();
        
        // 检查浏览器兼容性
        if (!game.checkBrowserCompatibility()) {
            game.showError('您的浏览器版本过低，请升级到最新版本以获得最佳体验');
            return;
        }
        
        // 显示版本信息
        const versionInfo = game.getVersionInfo();
        console.log(`奥特曼逻辑推理游戏 v${versionInfo.version}`);
        console.log('功能特性:', versionInfo.features);
        
        // 将游戏实例暴露到全局，方便调试
        window.ultramanGame = game;
        
        console.log('✅ 游戏初始化成功！');
    } catch (error) {
        console.error('❌ 游戏启动失败:', error);
        // 显示错误信息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 1.1rem;
            text-align: center;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <h3>❌ 游戏启动失败</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #e74c3c;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 15px;
                cursor: pointer;
            ">重新加载</button>
        `;
        document.body.appendChild(errorDiv);
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('游戏运行时错误:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise拒绝:', e.reason);
});

// 导出游戏类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UltramanLogicGame;
}
