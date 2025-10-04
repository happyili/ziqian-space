// 游戏引擎 - 核心游戏逻辑管理
class GameEngine {
    constructor() {
        this.currentState = GameConfig.gameStates.START;
        this.currentDifficulty = 'easy';
        this.currentGameType = 'all'; // 默认选择全部类型
        this.currentLevel = 1;
        this.currentQuestion = null;
        this.gameData = {
            score: 0,
            cards: [],
            timeSpent: [],
            answers: [],
            hintsUsed: 0,
            skipsUsed: 0,
            streak: 0,
            maxStreak: 0
        };
        this.timer = null;
        this.timeRemaining = 0;
        this.isCardFlipped = false;
        
        // 延迟初始化事件监听器，确保DOM元素存在
        setTimeout(() => {
            this.initializeEventListeners();
        }, 100);
    }

    // 初始化事件监听器
    initializeEventListeners() {
        try {
            // 游戏类型选择按钮
            const gameTypeBtns = document.querySelectorAll('.game-type-btn');
            gameTypeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const button = e.currentTarget;
                    const gameType = button.dataset.type;
                    console.log('选择游戏类型:', gameType);
                    this.selectGameType(gameType);
                });
            });

            // 难度选择按钮
            const difficultyBtns = document.querySelectorAll('.difficulty-btn');
            difficultyBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // 确保获取按钮元素的 data-level，而不是子元素的
                    const button = e.currentTarget;
                    const level = button.dataset.level;
                    console.log('选择难度:', level);
                    this.startGame(level);
                });
            });

            // 游戏操作按钮
            const flipCardBtn = document.getElementById('flip-card-btn');
            if (flipCardBtn) {
                flipCardBtn.addEventListener('click', () => {
                    this.flipCard();
                });
            }

            const hintBtn = document.getElementById('hint-btn');
            if (hintBtn) {
                hintBtn.addEventListener('click', () => {
                    this.showHint();
                });
            }

            const skipBtn = document.getElementById('skip-btn');
            if (skipBtn) {
                skipBtn.addEventListener('click', () => {
                    this.skipQuestion();
                });
            }

            // 结果界面按钮
            const playAgainBtn = document.getElementById('play-again-btn');
            if (playAgainBtn) {
                playAgainBtn.addEventListener('click', () => {
                    this.restartGame();
                });
            }

            const changeDifficultyBtn = document.getElementById('change-difficulty-btn');
            if (changeDifficultyBtn) {
                changeDifficultyBtn.addEventListener('click', () => {
                    this.showStartScreen();
                });
            }

            const shareResultBtn = document.getElementById('share-result-btn');
            if (shareResultBtn) {
                shareResultBtn.addEventListener('click', () => {
                    this.shareResult();
                });
            }

            // 提示弹窗
            const closeHintBtn = document.getElementById('close-hint-btn');
            if (closeHintBtn) {
                closeHintBtn.addEventListener('click', () => {
                    this.closeHintModal();
                });
            }

            // API设置按钮
            const apiSettingsBtn = document.getElementById('api-settings-btn');
            if (apiSettingsBtn) {
                apiSettingsBtn.addEventListener('click', () => {
                    this.showAPISettingsModal();
                });
            }

            const saveApiKeyBtn = document.getElementById('save-api-key-btn');
            if (saveApiKeyBtn) {
                saveApiKeyBtn.addEventListener('click', () => {
                    this.saveAPIKey();
                });
            }

            const cancelApiSettingsBtn = document.getElementById('cancel-api-settings-btn');
            if (cancelApiSettingsBtn) {
                cancelApiSettingsBtn.addEventListener('click', () => {
                    this.closeAPISettingsModal();
                });
            }
        } catch (error) {
            console.error('初始化事件监听器失败:', error);
        }
    }

    // 选择游戏类型
    selectGameType(gameType) {
        console.log('选择游戏类型:', gameType);
        this.currentGameType = gameType;
        
        // 更新UI显示
        const gameTypeBtns = document.querySelectorAll('.game-type-btn');
        gameTypeBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`[data-type="${gameType}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        console.log('当前游戏类型已设置为:', this.currentGameType);
    }

    // 开始游戏
    async startGame(difficulty) {
        console.log('开始游戏，难度:', difficulty);
        this.currentDifficulty = difficulty;
        this.currentLevel = 1;
        this.gameData = {
            score: 0,
            cards: [],
            timeSpent: [],
            answers: [],
            hintsUsed: 0,
            skipsUsed: 0,
            streak: 0,
            maxStreak: 0
        };

        this.showLoadingScreen();
        
        try {
            // 生成第一道题目
            await this.generateNewQuestion();
            this.showGameScreen();
            // 注意：不立即启动定时器，等用户翻转卡片后再启动
        } catch (error) {
            console.error('游戏启动失败:', error);
            this.showError('游戏启动失败，请重试');
        }
    }

    // 显示加载界面
    showLoadingScreen() {
        this.hideAllScreens();
        document.getElementById('loading-screen').classList.add('active');
    }

    // 显示游戏界面
    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('game-screen').classList.add('active');
        this.updateGameUI();
    }

    // 显示结果界面
    showResultScreen() {
        this.hideAllScreens();
        document.getElementById('result-screen').classList.add('active');
        this.updateResultUI();
        this.generateAnalysisReport();
    }

    // 隐藏所有界面
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    // 生成新题目
    async generateNewQuestion() {
        try {
            console.log('生成新题目，当前难度:', this.currentDifficulty, '当前关卡:', this.currentLevel, '游戏类型:', this.currentGameType);
            const questionSystem = new QuestionSystem();
            this.currentQuestion = await questionSystem.generateQuestion(
                this.currentDifficulty,
                this.currentLevel,
                this.currentGameType
            );
            
            this.displayQuestion();
            this.resetCardState();
        } catch (error) {
            console.error('题目生成失败:', error);
            // 使用备用题目
            this.currentQuestion = this.getFallbackQuestion();
            this.displayQuestion();
            this.resetCardState();
        }
    }

    // 翻转卡片
    flipCard() {
        if (this.isCardFlipped) return;
        
        const card = document.querySelector('.monster-card');
        card.classList.add('flipped');
        this.isCardFlipped = true;
        
        // 显示题目和选项
        this.displayQuestionAndOptions();
        
        // 播放音效
        this.playSound('card-flip-sound');
        
        // 开始计时
        this.startQuestionTimer();
    }

    // 显示题目和选项
    displayQuestionAndOptions() {
        const questionElement = document.getElementById('question-text');
        const optionsElement = document.getElementById('answer-options');
        
        questionElement.textContent = this.currentQuestion.question;
        
        // 清空选项
        optionsElement.innerHTML = '';
        
        // 创建选项按钮
        this.currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            button.dataset.answer = String.fromCharCode(65 + index);
            
            button.addEventListener('click', (e) => {
                this.selectAnswer(e.target.dataset.answer);
            });
            
            optionsElement.appendChild(button);
        });
    }

    // 选择答案
    selectAnswer(selectedAnswer) {
        const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;
        const timeSpent = GameConfig.difficulty[this.currentDifficulty].questionTimeLimit - this.timeRemaining;
        
        // 记录答案
        this.gameData.answers.push({
            question: this.currentQuestion.question,
            selectedAnswer,
            correctAnswer: this.currentQuestion.correctAnswer,
            isCorrect,
            timeSpent,
            hintsUsed: this.gameData.hintsUsed
        });
        
        // 计算分数
        const score = this.calculateScore(isCorrect, timeSpent);
        this.gameData.score += score;
        
        // 更新连击
        if (isCorrect) {
            this.gameData.streak++;
            this.gameData.maxStreak = Math.max(this.gameData.maxStreak, this.gameData.streak);
        } else {
            this.gameData.streak = 0;
        }
        
        // 播放音效和动画
        if (isCorrect) {
            this.playSound('correct-sound');
            this.showCorrectAnimation();
            this.awardCard();
        } else {
            this.playSound('wrong-sound');
            this.showWrongAnimation();
        }
        
        // 停止计时器
        this.stopTimer();
        
        // 延迟后进入下一题
        setTimeout(() => {
            this.showLoadingScreen('正在生成下一题...');
            this.nextQuestion();
        }, 2000);
    }

    // 计算分数
    calculateScore(isCorrect, timeSpent) {
        if (!isCorrect) return 0;
        
        const config = GameConfig.difficulty[this.currentDifficulty];
        const baseScore = GameConfig.scoring.baseScore * config.scoreMultiplier;
        const timeBonus = Math.max(0, config.timeLimit - timeSpent) * GameConfig.scoring.timeBonus / config.timeLimit;
        const streakBonus = this.gameData.streak * GameConfig.scoring.streakBonus;
        
        return Math.round(baseScore + timeBonus + streakBonus);
    }

    // 显示提示
    async showHint() {
        if (this.gameData.hintsUsed >= 3) {
            this.showMessage('提示次数已达上限！');
            return;
        }
        
        try {
            const hint = await this.generateHint();
            this.showHintModal(hint);
            this.gameData.hintsUsed++;
            
            // 扣分
            const penalty = GameConfig.difficulty[this.currentDifficulty].hintPenalty;
            this.gameData.score = Math.max(0, this.gameData.score - penalty);
            this.updateGameUI();
        } catch (error) {
            console.error('提示生成失败:', error);
            this.showMessage('提示生成失败，请重试');
        }
    }

    // 跳过题目
    skipQuestion() {
        const penalty = GameConfig.difficulty[this.currentDifficulty].skipPenalty;
        this.gameData.score = Math.max(0, this.gameData.score - penalty);
        this.gameData.skipsUsed++;
        this.gameData.streak = 0;
        
        this.stopTimer();
        this.showLoadingScreen('正在生成下一题...');
        this.nextQuestion();
    }

    // 下一题
    async nextQuestion() {
        // 确保清除当前定时器
        this.stopTimer();
        
        this.currentLevel++;
        const maxLevel = GameConfig.difficulty[this.currentDifficulty].questionsPerLevel;
        
        if (this.currentLevel > maxLevel) {
            this.finishGame();
        } else {
            await this.generateNewQuestion();
            this.showGameScreen();
            // 注意：这里不立即启动定时器，等用户翻转卡片后再启动
        }
    }

    // 完成游戏
    finishGame() {
        this.currentState = GameConfig.gameStates.FINISHED;
        this.stopTimer();
        this.saveGameData();
        this.showResultScreen();
    }

    // 重新开始游戏
    restartGame() {
        this.startGame(this.currentDifficulty);
    }

    // 开始计时器
    startTimer() {
        // 确保清除之前的定时器
        this.stopTimer();
        
        // 使用配置中的单题时间限制
        this.timeRemaining = GameConfig.difficulty[this.currentDifficulty].questionTimeLimit;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    // 开始题目计时器（与startTimer合并，避免重复）
    startQuestionTimer() {
        // 直接调用startTimer，避免重复逻辑
        this.startTimer();
    }

    // 停止计时器
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    // 时间到
    timeUp() {
        console.log('题目超时！');
        this.stopTimer();
        
        // 记录超时答案
        this.gameData.answers.push({
            question: this.currentQuestion.question,
            selectedAnswer: '',
            correctAnswer: this.currentQuestion.correctAnswer,
            isCorrect: false,
            timeSpent: GameConfig.difficulty[this.currentDifficulty].questionTimeLimit, // 使用配置的超时时间
            hintsUsed: this.gameData.hintsUsed,
            isTimeout: true
        });
        
        // 重置连击
        this.gameData.streak = 0;
        
        // 播放超时音效
        this.playSound('wrong-sound');
        this.showMessage('⏰ 时间到！');
        
        // 延迟后显示加载界面并进入下一题
        setTimeout(() => {
            this.showLoadingScreen('正在生成下一题...');
            this.nextQuestion();
        }, 2000);
    }

    // 更新计时器显示
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = this.timeRemaining;
        
        // 时间警告
        if (this.timeRemaining <= 10) {
            timerElement.classList.add('warning');
        } else {
            timerElement.classList.remove('warning');
        }
    }

    // 更新游戏UI
    updateGameUI() {
        document.getElementById('current-score').textContent = this.gameData.score;
        document.getElementById('current-level').textContent = this.currentLevel;
        
        // 更新进度条
        const maxLevel = GameConfig.difficulty[this.currentDifficulty].questionsPerLevel;
        const progress = (this.currentLevel - 1) / maxLevel * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // 更新收集的卡片
        this.updateCollectedCards();
    }

    // 更新收集的卡片
    updateCollectedCards() {
        const container = document.getElementById('collected-cards');
        container.innerHTML = '';
        
        this.gameData.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `collected-card ${card.rarity}`;
            cardElement.textContent = card.name;
            container.appendChild(cardElement);
        });
    }

    // 奖励卡片
    awardCard() {
        const cardSystem = new CardCollection();
        const card = cardSystem.generateCard(this.gameData.score, this.gameData.streak);
        this.gameData.cards.push(card);
        
        // 显示卡片获得动画
        this.showCardAwardAnimation(card);
    }

    // 显示卡片获得动画
    showCardAwardAnimation(card) {
        const animation = document.createElement('div');
        animation.className = 'card-award-animation';
        animation.innerHTML = `
            <div class="card-award-content">
                <h3>🎴 获得新卡片！</h3>
                <div class="awarded-card ${card.rarity}">
                    ${card.name}
                </div>
                <p>${card.description}</p>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 3000);
    }

    // 显示正确动画
    showCorrectAnimation() {
        const animation = document.createElement('div');
        animation.className = 'correct-animation';
        animation.innerHTML = '✅ 正确！';
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    // 显示错误动画
    showWrongAnimation() {
        const animation = document.createElement('div');
        animation.className = 'wrong-animation';
        animation.innerHTML = '❌ 错误！';
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    // 播放音效
    playSound(soundId) {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('音效播放失败:', e));
        }
    }

    // 显示消息
    showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    // 显示错误
    showError(message) {
        this.showMessage(`❌ ${message}`);
    }

    // 重置卡片状态
    resetCardState() {
        this.isCardFlipped = false;
        const card = document.querySelector('.monster-card');
        if (card) {
            card.classList.remove('flipped');
        }
        
        // 清理答题选项
        const optionsElement = document.getElementById('answer-options');
        if (optionsElement) {
            optionsElement.innerHTML = '';
        }
        
        // 清理题目文本
        const questionElement = document.getElementById('question-text');
        if (questionElement) {
            questionElement.textContent = '';
        }
    }

    // 显示题目
    displayQuestion() {
        const storyElement = document.getElementById('story-text');
        const monsterElement = document.getElementById('monster-image');
        
        if (storyElement) storyElement.textContent = this.currentQuestion.story;
        if (monsterElement) monsterElement.textContent = this.getMonsterEmoji();
        
        // 重置卡片状态（包括清理答题选项）
        this.resetCardState();
    }

    // 获取怪兽表情
    getMonsterEmoji() {
        const monsters = ['👹', '👺', '🤖', '👽', '👾', '🤡', '💀', '👻'];
        return monsters[Math.floor(Math.random() * monsters.length)];
    }

    // 显示题目和选项
    displayQuestionAndOptions() {
        const questionElement = document.getElementById('question-text');
        const optionsElement = document.getElementById('answer-options');
        
        if (questionElement) questionElement.textContent = this.currentQuestion.question;
        
        if (optionsElement) {
            // 清空选项
            optionsElement.innerHTML = '';
            
            // 创建选项按钮
            this.currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
                button.dataset.answer = String.fromCharCode(65 + index);
                
                button.addEventListener('click', (e) => {
                    this.selectAnswer(e.target.dataset.answer);
                });
                
                optionsElement.appendChild(button);
            });
        }
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

    // 显示错误
    showError(message) {
        this.showMessage(`❌ ${message}`);
    }

    // 播放音效
    playSound(soundId) {
        const audio = document.getElementById(soundId);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('音效播放失败:', e));
        }
    }

    // 显示API设置弹窗
    showAPISettingsModal() {
        const modal = document.getElementById('api-settings-modal');
        const input = document.getElementById('api-key-input');
        
        if (modal && input) {
            // 加载当前保存的API密钥
            const savedKey = localStorage.getItem('openrouter_api_key');
            if (savedKey) {
                input.value = savedKey;
            }
            modal.classList.add('active');
        }
    }

    // 关闭API设置弹窗
    closeAPISettingsModal() {
        const modal = document.getElementById('api-settings-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // 保存API密钥
    saveAPIKey() {
        const input = document.getElementById('api-key-input');
        if (input) {
            const apiKey = input.value.trim();
            if (apiKey) {
                localStorage.setItem('openrouter_api_key', apiKey);
                this.showMessage('✅ API密钥已保存！重新开始游戏后生效。');
            } else {
                localStorage.removeItem('openrouter_api_key');
                this.showMessage('✅ API密钥已清除！将使用备用题目。');
            }
            this.closeAPISettingsModal();
        }
    }

    // 保存游戏数据
    saveGameData() {
        const gameStats = {
            score: this.gameData.score,
            cards: this.gameData.cards,
            accuracy: this.calculateAccuracy(),
            avgTime: this.calculateAverageTime(),
            difficulty: this.currentDifficulty,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(GameConfig.storageKeys.playerStats, JSON.stringify(gameStats));
    }

    // 计算准确率
    calculateAccuracy() {
        if (this.gameData.answers.length === 0) return 0;
        const correct = this.gameData.answers.filter(a => a.isCorrect).length;
        return Math.round((correct / this.gameData.answers.length) * 100);
    }

    // 计算平均时间
    calculateAverageTime() {
        if (this.gameData.answers.length === 0) return 0;
        const totalTime = this.gameData.answers.reduce((sum, a) => sum + a.timeSpent, 0);
        return Math.round(totalTime / this.gameData.answers.length);
    }

    // 分享结果
    shareResult() {
        const accuracy = this.calculateAccuracy();
        const avgTime = this.calculateAverageTime();
        const text = `我在奥特曼逻辑推理大冒险中获得了${this.gameData.score}分！准确率${accuracy}%，平均用时${avgTime}秒，收集了${this.gameData.cards.length}张奥特曼卡片！`;
        
        if (navigator.share) {
            navigator.share({
                title: '奥特曼逻辑推理大冒险',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage('结果已复制到剪贴板！');
            });
        }
    }

    // 显示加载界面
    showLoadingScreen(message = '正在生成题目...') {
        this.hideAllScreens();
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            // 更新加载消息
            const loadingText = loadingScreen.querySelector('.loading-content p');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }

    // 显示游戏界面
    showGameScreen() {
        this.hideAllScreens();
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.add('active');
        }
        this.updateGameUI();
    }

    // 显示开始界面
    showStartScreen() {
        this.hideAllScreens();
        const startScreen = document.getElementById('start-screen');
        if (startScreen) {
            startScreen.classList.add('active');
        }
        this.currentState = GameConfig.gameStates.START;
    }

    // 显示结果界面
    showResultScreen() {
        this.hideAllScreens();
        const resultScreen = document.getElementById('result-screen');
        if (resultScreen) {
            resultScreen.classList.add('active');
        }
        this.updateResultUI();
        this.generateAnalysisReport();
    }

    // 保存游戏数据
    saveGameData() {
        const gameStats = {
            score: this.gameData.score,
            cards: this.gameData.cards,
            accuracy: this.calculateAccuracy(),
            avgTime: this.calculateAverageTime(),
            difficulty: this.currentDifficulty,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem(GameConfig.storageKeys.playerStats, JSON.stringify(gameStats));
        } catch (error) {
            console.error('保存游戏数据失败:', error);
        }
    }

    // 奖励卡片
    awardCard() {
        if (this.cardCollection) {
            const card = this.cardCollection.generateCard(this.gameData.score, this.gameData.streak);
            this.gameData.cards.push(card);
            
            // 显示卡片获得动画
            this.showCardAwardAnimation(card);
        }
    }

    // 更新收集的卡片
    updateCollectedCards() {
        const container = document.getElementById('collected-cards');
        if (container) {
            container.innerHTML = '';
            
            this.gameData.cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = `collected-card ${card.rarity}`;
                cardElement.textContent = card.name;
                container.appendChild(cardElement);
            });
        }
    }

    // 生成提示
    async generateHint() {
        try {
            if (this.questionSystem && this.currentQuestion) {
                return await this.questionSystem.generateHint(
                    this.questionSystem.currentQuestionType,
                    this.currentQuestion.question,
                    this.currentQuestion.options
                );
            }
            return '仔细思考一下，你一定能找到答案！';
        } catch (error) {
            console.error('生成提示失败:', error);
            return '仔细思考一下，你一定能找到答案！';
        }
    }

    // 显示正确动画
    showCorrectAnimation() {
        const animation = document.createElement('div');
        animation.className = 'correct-animation';
        animation.innerHTML = '✅ 正确！';
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    // 显示错误动画
    showWrongAnimation() {
        const animation = document.createElement('div');
        animation.className = 'wrong-animation';
        animation.innerHTML = '❌ 错误！';
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    // 显示卡片获得动画
    showCardAwardAnimation(card) {
        const animation = document.createElement('div');
        animation.className = 'card-award-animation';
        animation.innerHTML = `
            <div class="card-award-content">
                <h3>🎴 获得新卡片！</h3>
                <div class="awarded-card ${card.rarity}">
                    ${card.name}
                </div>
                <p>${card.description}</p>
            </div>
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 3000);
    }

    // 显示提示弹窗
    showHintModal(hint) {
        const modal = document.getElementById('hint-modal');
        const hintText = document.getElementById('hint-text');
        
        if (modal && hintText) {
            hintText.textContent = hint;
            modal.classList.add('active');
        }
    }

    // 关闭提示弹窗
    closeHintModal() {
        const modal = document.getElementById('hint-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // 更新结果界面UI
    updateResultUI() {
        const finalScore = document.getElementById('final-score');
        const finalCards = document.getElementById('final-cards');
        const avgTime = document.getElementById('avg-time');
        const accuracy = document.getElementById('accuracy');
        const cardWall = document.getElementById('card-wall');
        
        if (finalScore) finalScore.textContent = this.gameData.score;
        if (finalCards) finalCards.textContent = this.gameData.cards.length;
        if (avgTime) avgTime.textContent = this.calculateAverageTime() + 's';
        if (accuracy) accuracy.textContent = this.calculateAccuracy() + '%';
        
        if (cardWall && this.cardCollection) {
            cardWall.innerHTML = this.cardCollection.createCardWall();
        }
    }

    // 生成分析报告
    async generateAnalysisReport() {
        try {
            const analysisContent = document.getElementById('analysis-content');
            if (analysisContent) {
                analysisContent.innerHTML = '正在生成分析报告...';
                
                const gameData = {
                    score: this.gameData.score,
                    cards: this.gameData.cards,
                    accuracy: this.calculateAccuracy(),
                    avgTime: this.calculateAverageTime(),
                    difficulty: this.currentDifficulty,
                    answers: this.gameData.answers
                };
                
                if (this.resultSummary) {
                    const summary = await this.resultSummary.generateGameSummary(gameData);
                    analysisContent.innerHTML = summary;
                } else {
                    analysisContent.innerHTML = '分析报告生成失败，请重试';
                }
            }
        } catch (error) {
            console.error('生成分析报告失败:', error);
            const analysisContent = document.getElementById('analysis-content');
            if (analysisContent) {
                analysisContent.innerHTML = '分析报告生成失败，请重试';
            }
        }
    }
}

// 导出游戏引擎
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}
