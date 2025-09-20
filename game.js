/**
 * 坦克数学大战 - 主游戏类
 * 整合各个模块，管理游戏流程
 */
class MathTankGame {
    constructor() {
        // 坦克尺寸常量
        this.TANK_WIDTH = 60;
        this.TANK_HEIGHT = 40;
        this.TANK_BOTTOM_OFFSET = 150;
        this.TANK_SIDE_OFFSET = 100;
        
        // 炮管常量
        this.BARREL_WIDTH = 40;
        this.BARREL_HEIGHT = 8;
        this.BARREL_TOP_OFFSET = 16;
        this.BARREL_EXTEND = 20;
        this.BULLET_FIRE_Y_OFFSET = 20;
        
        // 炮弹常量
        this.BULLET_SIZE = 20;
        this.BULLET_RADIUS = this.BULLET_SIZE / 2;
        this.BULLET_SPEED = 26;
        this.BULLET_ANIMATION_INTERVAL = 10;
        
        // 爆炸效果常量
        this.EXPLOSION_SIZE = 60;
        this.BIG_EXPLOSION_SIZE = 120;
        this.EXPLOSION_ANIMATION_DURATION = 500;
        this.BIG_EXPLOSION_DURATION = 1000;
        
        // 敌方坦克常量
        this.INITIAL_ENEMY_LEVEL = 1;
        this.INITIAL_ENEMY_MAX_HEALTH = 3;
        this.TANK_SCALE_INCREASE = 0.2;
        this.ENEMY_SPAWN_DELAY = 1000;
        this.FIREWORK_COUNT = 3;
        this.FIREWORK_DELAY = 200;
        this.FIREWORK_PARTICLE_COUNT = 20;
        this.FIREWORK_ANIMATION_INTERVAL = 20;
        this.FIREWORK_OPACITY_DECREASE = 0.02;
        
        // 玩家坦克常量
        this.INITIAL_PLAYER_MAX_HEALTH = 5;
        
        // 数学题生成常量
        this.RANDOM_PROBABILITY = 0.5;
        this.TWO_DIGIT_MIN = 10;
        this.TWO_DIGIT_MAX = 90;
        this.SINGLE_DIGIT_MAX = 9;
        this.TENS_DIGIT_MULTIPLIER = 10;
        this.ANSWER_OPTION_COUNT = 3;
        this.WRONG_ANSWER_DIFF_MAX = 3;
        this.DECIMAL_BASE = 10;
        
        // 得分常量
        this.CORRECT_ANSWER_SCORE = 3;
        this.QUICK_ANSWER_BONUS = 5;
        this.COMBO_MULTIPLIER_START = 1;
        this.QUICK_ANSWER_THRESHOLD = 5;
        this.FAST_ANSWER_THRESHOLD = 2;
        this.VERY_FAST_ANSWER_THRESHOLD = 3;
        this.PERFECT_COMBO_THRESHOLD = 3;
        
        // 血量显示常量
        this.HEALTH_PERCENTAGE_MULTIPLIER = 100;
        this.LOW_HEALTH_THRESHOLD = 20;
        this.MEDIUM_HEALTH_THRESHOLD = 40;
        this.ENEMY_LOW_HEALTH_THRESHOLD = 33;
        this.ENEMY_MEDIUM_HEALTH_THRESHOLD = 66;
        
        // 动画和效果常量
        this.SHAKE_ANIMATION_DURATION = 300;
        this.TANK_ENTER_ANIMATION_DELAY = 100;
        this.TANK_ENTER_ANIMATION_DURATION = 500;
        this.TANK_SPAWN_POSITION_OFFSET = 100;
        
        // 布局常量
        this.QUESTION_AREA_BOTTOM_OFFSET = 10;
        this.QUESTION_AREA_MIN_WIDTH = 400;
        this.ANSWER_BUTTON_MIN_WIDTH = 120;
        this.ANSWER_BUTTON_GAP = 20;
        this.KEYBOARD_HINT_DELAY_MULTIPLIER = 100;
        
        // 计算出的关键位置
        this.TANK_CENTER_Y = this.TANK_BOTTOM_OFFSET + this.TANK_HEIGHT / 2;
        this.BARREL_CENTER_Y = this.TANK_BOTTOM_OFFSET + this.BARREL_TOP_OFFSET + this.BARREL_HEIGHT / 2;
        this.BULLET_FIRE_Y = this.BARREL_CENTER_Y - this.BULLET_RADIUS + this.BULLET_FIRE_Y_OFFSET;
        this.PLAYER_BARREL_END_OFFSET = this.BARREL_WIDTH - this.BULLET_RADIUS;
        this.ENEMY_BARREL_END_OFFSET = this.BARREL_WIDTH - this.BULLET_RADIUS;
        
        // 时间相关常量
        this.DEFAULT_TIME_LIMIT = 10;
        this.INITIAL_MAX_TIME = 10;
        this.MIN_TIME_LIMIT = 3;
        this.ANSWER_BUTTON_DELAY = 1;
        this.MILLISECONDS_PER_SECOND = 1000;
        
        // 游戏状态变量
        this.recentQuestions = [];
        this.mistakes = 0;
        this.quickStreak = 0;
        this.quickAnswerTotalNumber = 0;
        this.continueCurrect = 0;
        this.totalCorrect = 0;
        this.isPaused = false;
        this.answerTimes = [];
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.timer = null;
        
        this.timeLeft = this.DEFAULT_TIME_LIMIT;
        this.maxTime = this.INITIAL_MAX_TIME;
        
        // 游戏设置
        this.enableAddition = true;
        this.enableSubtraction = true;
        this.enableMultiplication = false;
        this.enableDivision = false;
        this.additionMode = 'carry'; // 'carry', 'nocarry', 'both', 'simple'
        this.subtractionMode = 'borrow'; // 'borrow', 'noborrow', 'both', 'simple'
        this.multiplicationMode = 'single'; // 'single', 'two_one', 'two'
        this.divisionMode = 'two_one'; // 'two_one', 'three_one', 'three_two'
        this.timeoutWarningInterval = null;
        this.lastBulletType = 0;
        this.bulletTypes = ['#ff0', '#0ff', '#f0f', '#fff', '#0f0'];
        this.answerLocked = false;
        this.gameEnded = false;
        this.enableButtonTimer = null;
        this.keyboardListener = null;
        this.ultramanModeActivated = false;
        
        // 敌方坦克属性
        this.enemyLevel = this.INITIAL_ENEMY_LEVEL;
        this.enemyMaxHealth = this.INITIAL_ENEMY_MAX_HEALTH;
        this.enemyHealth = this.INITIAL_ENEMY_MAX_HEALTH;
        this.enemyTankDestroyed = false;
        
        // 得分系统
        this.score = 0;
        
        // 玩家坦克属性
        this.playerMaxHealth = this.INITIAL_PLAYER_MAX_HEALTH;
        this.playerHealth = this.INITIAL_PLAYER_MAX_HEALTH;
        
        // 答题记录
        this.questionRecords = [];
        
        // 初始化模块
        this.animations = new GameAnimations(this);
        this.gameRules = new GameRules(this);
        this.questionLogic = new QuestionLogic(this);
    }

    /**
     * 初始化游戏
     */
    init() {
        // 设置按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('retryBtn').addEventListener('click', () => this.retryGame());
        
        // 设置复选框逻辑
        this.setupCheckboxLogic();
        
        // 设置键盘监听器
        this.setupKeyboardListener();
    }

    /**
     * 设置复选框逻辑
     */
    setupCheckboxLogic() {
        const enableAddition = document.getElementById('enableAddition');
        const enableSubtraction = document.getElementById('enableSubtraction');
        const enableMultiplication = document.getElementById('enableMultiplication');
        const enableDivision = document.getElementById('enableDivision');
        const additionOptions = document.getElementById('additionOptions');
        const subtractionOptions = document.getElementById('subtractionOptions');
        const multiplicationOptions = document.getElementById('multiplicationOptions');
        const divisionOptions = document.getElementById('divisionOptions');

        // 加法开关逻辑
        enableAddition.addEventListener('change', () => {
            if (enableAddition.checked) {
                additionOptions.classList.remove('disabled-group');
            } else {
                additionOptions.classList.add('disabled-group');
                // 如果减法和乘法也被禁用，至少保持一个启用
                if (!enableSubtraction.checked && !enableMultiplication.checked && !enableDivision.checked) {
                    enableSubtraction.checked = true;
                    subtractionOptions.classList.remove('disabled-group');
                }
            }
        });

        // 减法开关逻辑
        enableSubtraction.addEventListener('change', () => {
            if (enableSubtraction.checked) {
                subtractionOptions.classList.remove('disabled-group');
            } else {
                subtractionOptions.classList.add('disabled-group');
                // 如果加法和乘法也被禁用，至少保持一个启用
                if (!enableAddition.checked && !enableMultiplication.checked && !enableDivision.checked) {
                    enableAddition.checked = true;
                    additionOptions.classList.remove('disabled-group');
                }
            }
        });

        // 乘法开关逻辑
        enableMultiplication.addEventListener('change', () => {
            if (enableMultiplication.checked) {
                multiplicationOptions.classList.remove('disabled-group');
            } else {
                multiplicationOptions.classList.add('disabled-group');
                // 如果加法和减法也被禁用，至少保持一个启用
                if (!enableAddition.checked && !enableSubtraction.checked && !enableDivision.checked) {
                    enableAddition.checked = true;
                    additionOptions.classList.remove('disabled-group');
                }
            }
        });

        // 除法开关逻辑
        enableDivision.addEventListener('change', () => {
            if (enableDivision.checked) {
                divisionOptions.classList.remove('disabled-group');
            } else {
                divisionOptions.classList.add('disabled-group');
                // 如果加法、减法、乘法也被禁用，至少保持一个启用
                if (!enableAddition.checked && !enableSubtraction.checked && !enableMultiplication.checked) {
                    enableAddition.checked = true;
                    additionOptions.classList.remove('disabled-group');
                }
            }
        });
    }

    /**
     * 设置键盘监听器
     */
    setupKeyboardListener() {
        // 移除旧的监听器（如果存在）
        if (this.keyboardListener) {
            document.removeEventListener('keydown', this.keyboardListener);
        }
        
        // 创建新的监听器
        this.keyboardListener = (event) => {
            this.handleKeyPress(event);
        };
        
        // 添加监听器
        document.addEventListener('keydown', this.keyboardListener);
    }

    /**
     * 处理键盘按键
     */
    handleKeyPress(event) {
        // 只在游戏界面活跃时处理按键
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen.style.display === 'none') return;
        
        // 检查是否是数字键1、2、3
        if (event.key >= '1' && event.key <= '3') {
            event.preventDefault(); // 防止默认行为
            
            // 获取对应的答案按钮
            const keyNum = parseInt(event.key);
            const buttons = document.querySelectorAll('.answer-btn');
            
            if (buttons.length >= keyNum) {
                const targetButton = buttons[keyNum - 1];
                const answer = parseInt(targetButton.getAttribute('data-answer'));
                
                // 模拟点击
                this.checkAnswer(answer);
                
                // 添加视觉反馈
                this.animations.highlightButton(targetButton);
            }
        }
    }

    /**
     * 开始游戏
     */
    startGame() {
        // 获取设置
        this.loadGameSettings();
        
        // 切换界面
        document.getElementById('setupScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';

        // 设置暂停按钮事件
        this.setupPauseButton();
        
        // 初始化游戏状态
        this.gameRules.initializeGame();
        
        // 清理界面
        this.cleanupGameInterface();
        
        // 重置坦克显示
        this.resetTankDisplay();
        
        // 重置奥特曼模式
        this.gameRules.resetUltramanMode();

        // 重置倒计时显示
        this.resetTimerDisplay();
        
        // 更新所有显示
        this.gameRules.updateGameDisplay();
        this.gameRules.updatePlayerHealthBar();
        this.animations.hideComboCounter();
        
        // 生成第一道题
        this.generateQuestion();
    }

    /**
     * 加载游戏设置
     */
    loadGameSettings() {
        this.enableAddition = document.getElementById('enableAddition').checked;
        this.enableSubtraction = document.getElementById('enableSubtraction').checked;
        this.enableMultiplication = document.getElementById('enableMultiplication').checked;
        this.enableDivision = document.getElementById('enableDivision').checked;
        
        // 获取加法模式
        const additionModeRadios = document.getElementsByName('additionMode');
        for (let radio of additionModeRadios) {
            if (radio.checked) {
                this.additionMode = radio.value;
                break;
            }
        }
        
        // 获取减法模式
        const subtractionModeRadios = document.getElementsByName('subtractionMode');
        for (let radio of subtractionModeRadios) {
            if (radio.checked) {
                this.subtractionMode = radio.value;
                break;
            }
        }
        
        // 获取乘法模式
        const multiplicationModeRadios = document.getElementsByName('multiplicationMode');
        for (let radio of multiplicationModeRadios) {
            if (radio.checked) {
                this.multiplicationMode = radio.value;
                break;
            }
        }

        // 获取除法模式
        const divisionModeRadios = document.getElementsByName('divisionMode');
        for (let radio of divisionModeRadios) {
            if (radio.checked) {
                this.divisionMode = radio.value;
                break;
            }
        }
    }

    /**
     * 设置暂停按钮
     */
    setupPauseButton() {
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.replaceWith(pauseBtn.cloneNode(true));  // 移除所有事件监听器
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        // 重置暂停按钮状态
        document.getElementById('pauseBtn').textContent = '暂停';
        document.getElementById('pauseBtn').classList.remove('paused');
        document.getElementById('pauseOverlay').style.display = 'none';
    }

    /**
     * 清理游戏界面
     */
    cleanupGameInterface() {
        // 清理按钮启用计时器
        if (this.enableButtonTimer) {
            clearTimeout(this.enableButtonTimer);
            this.enableButtonTimer = null;
        }
        
        // 清理倒计时提示
        const countdown = document.querySelector('.button-countdown');
        if (countdown) {
            countdown.remove();
        }

        // 清理战场（移除所有炮弹和爆炸效果）
        const battleField = document.getElementById('battleField');
        battleField.querySelectorAll('.bullet, .explosion, .big-explosion, .firework').forEach(el => el.remove());
        
        // 清理游戏界面上的提示（大呆豆、快速奖励等）
        document.querySelectorAll('.bigDummy, .quick-bonus').forEach(el => el.remove());
    }

    /**
     * 重置坦克显示
     */
    resetTankDisplay() {
        // 重置玩家坦克显示
        const playerTank = document.getElementById('playerTank');
        playerTank.style.animation = '';
        playerTank.classList.remove('tank-exploding');
        
        // 重置敌方坦克显示
        const enemyTank = document.getElementById('enemyTank');
        enemyTank.style.animation = '';
        enemyTank.classList.remove('tank-exploding');
        enemyTank.querySelector('.enemy-level').textContent = 'Lv.1';
        this.gameRules.updateEnemyHealthBar();
    }

    /**
     * 切换暂停状态
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        const pauseOverlay = document.getElementById('pauseOverlay');
        
        if (this.isPaused) {
            // 暂停游戏
            pauseBtn.textContent = '继续';
            pauseBtn.classList.add('paused');
            pauseOverlay.style.display = 'block';
            
            // 停止计时器
            if (this.timer) {
                clearInterval(this.timer);
            }
            
            // 停止按钮启用计时器
            if (this.enableButtonTimer) {
                clearTimeout(this.enableButtonTimer);
                this.enableButtonTimer = null;
            }
            
            // 暂停时隐藏警告效果
            const timeoutWarning = document.getElementById('timeoutWarning');
            if (timeoutWarning) {
                timeoutWarning.style.display = 'none';
                timeoutWarning.classList.remove('active');
            }
            
            // 清理倒计时数字
            const existingCountdown = document.querySelector('.final-countdown');
            if (existingCountdown) {
                existingCountdown.remove();
            }
        } else {
            // 继续游戏
            pauseBtn.textContent = '暂停';
            pauseBtn.classList.remove('paused');
            pauseOverlay.style.display = 'none';
            
            // 恢复计时器
            if (this.timeLeft > 0 && !this.answerLocked) {
                this.timer = setInterval(() => {
                    this.timeLeft--;
                    this.updateTimerDisplay();
                    
                    if (this.timeLeft <= 0) {
                        this.handleTimeout();
                    }
                }, 1000);
            }
        }
    }

    /**
     * 生成题目
     */
    generateQuestion() {
        if (this.lastMistake) {
            this.lastMistake = false;
        } else {
            const rawQuestion = this.questionLogic.generateRawQuestion();
            this.currentQuestion = rawQuestion.questionStr;
            this.currentAnswer = rawQuestion.answer;
        }

        document.getElementById('question').textContent = this.currentQuestion;
        this.generateAnswerOptions(this.currentAnswer);

        // 重置答案锁定
        this.answerLocked = false;

        // 开始倒计时
        this.startTimer();
    }

    /**
     * 生成答案选项
     */
    generateAnswerOptions(correctAnswer) {
        const options = this.questionLogic.generateAnswerOptions(correctAnswer);
        
        // 创建答案按钮
        this.questionLogic.createAnswerButtons(options);
        
        // 显示倒计时提示
        this.animations.showButtonCountdown();
        
        // 1秒后启用答案按钮
        this.enableButtonTimer = setTimeout(() => {
            this.questionLogic.enableAnswerButtons();
        }, 200);
    }

    /**
     * 开始计时器
     */
    startTimer() {
        this.timeLeft = this.maxTime;
        this.answerStartTime = Date.now();
        
        if (this.timer) clearInterval(this.timer);
        
        // 重置进度条到100%
        this.resetTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.handleTimeout();
            }
        }, 1000);
    }

    /**
     * 处理超时
     */
    handleTimeout() {
        clearInterval(this.timer);
        
        // 防止重复处理 - 锁定答案
        this.answerLocked = true;
        
        // 清理按钮启用计时器
        if (this.enableButtonTimer) {
            clearTimeout(this.enableButtonTimer);
            this.enableButtonTimer = null;
        }
        
        // 使用游戏规则模块处理超时
        this.gameRules.handleTimeout();

        // 生成新题目（如果还活着）
        if (this.playerHealth > 0) {
            setTimeout(() => this.generateQuestion(), 1000);
        }
    }

    /**
     * 检查答案
     */
    checkAnswer(userAnswer) {
        if (this.answerLocked || this.isPaused) return;
        
        // 检查答案按钮是否还在禁用期
        const answerButtons = document.querySelectorAll('.answer-btn');
        const anyDisabled = Array.from(answerButtons).some(btn => btn.disabled);
        if (anyDisabled) return;
        
        this.answerLocked = true;
        clearInterval(this.timer);
        
        // 清理按钮启用计时器
        if (this.enableButtonTimer) {
            clearTimeout(this.enableButtonTimer);
            this.enableButtonTimer = null;
        }
        
        const answerTime = (Date.now() - this.answerStartTime) / 1000;
        
        // 处理答案反馈视觉效果
        this.questionLogic.handleAnswerFeedback(userAnswer, this.currentAnswer);
        
        // 验证答案
        const validation = this.questionLogic.validateAnswer(userAnswer, this.currentAnswer, this.timeLeft);
        
        if (validation.isCorrect) {
            // 答对了
            this.gameRules.handleCorrectAnswer(answerTime);
        } else {
            // 答错了
            this.gameRules.handleWrongAnswer(answerTime);
        }
        
        // 生成新题目（如果还活着）
        if (this.playerHealth > 0) {
            setTimeout(() => this.generateQuestion(), 1000);
        }
    }

    /**
     * 命中敌方坦克
     */
    hitEnemyTank() {
        this.gameRules.hitEnemyTank();
    }

    /**
     * 更新计时器显示
     */
    updateTimerDisplay() {
        const timerProgress = document.getElementById('timerProgress');
        const timerText = document.getElementById('timerText');
        const timeoutWarning = document.getElementById('timeoutWarning');
        
        // 更新进度条宽度
        const progressPercent = (this.timeLeft / this.maxTime) * 100;
        timerProgress.style.width = progressPercent + '%';
        
        // 更新文字
        timerText.textContent = this.timeLeft;
        
        // 最后3秒的警告效果
        if (this.timeLeft <= 3 && this.timeLeft > 0) {
            timeoutWarning.style.display = 'block';
            timeoutWarning.classList.add('active');
            
            // 显示大数字倒计时
            this.animations.showFinalCountdown(this.timeLeft);
        } else {
            timeoutWarning.style.display = 'none';
            timeoutWarning.classList.remove('active');
        }
    }

    /**
     * 重置计时器显示
     */
    resetTimerDisplay() {
        const timerProgress = document.getElementById('timerProgress');
        const timerText = document.getElementById('timerText');
        const timeoutWarning = document.getElementById('timeoutWarning');
        
        if (timerProgress) {
            timerProgress.style.width = '100%';
        }
        if (timerText) {
            timerText.textContent = this.maxTime;
        }
        
        // 隐藏警告
        if (timeoutWarning) {
            timeoutWarning.style.display = 'none';
            timeoutWarning.classList.remove('active');
        }
        
        // 清理倒计时数字
        const existingCountdown = document.querySelector('.final-countdown');
        if (existingCountdown) {
            existingCountdown.remove();
        }
    }

    /**
     * 重试游戏
     */
    retryGame() {
        // 隐藏GameOver画面
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // 重新开始游戏
        this.startGame();
    }
}

// 移动端触摸优化
function initMobileOptimizations() {
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // 防止长按菜单
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // 防止页面滚动
    document.addEventListener('touchmove', function(e) {
        if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    }, { passive: false });

    // 优化答案按钮的触摸体验
    document.addEventListener('DOMContentLoaded', function() {
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            // 添加触摸反馈
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                this.style.transition = 'transform 0.1s';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = '';
            });
            
            button.addEventListener('touchcancel', function() {
                this.style.transform = '';
            });
        });
    });

    // 检测设备方向变化
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // 强制重新计算布局
            window.scrollTo(0, 0);
            
            // 如果是横屏且高度较小，显示提示
            if (window.orientation === 90 || window.orientation === -90) {
                if (window.innerHeight < 500) {
                    console.log('建议竖屏游戏以获得最佳体验');
                }
            }
        }, 100);
    });

    // 设置viewport以防止缩放
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
}

// 初始化游戏
const game = new MathTankGame();
game.init();

// 初始化移动端优化
initMobileOptimizations();
