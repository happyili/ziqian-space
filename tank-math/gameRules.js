/**
 * 游戏规则模块
 * 包含游戏逻辑、血量管理、得分计算、等级系统等
 */
class GameRules {
    constructor(gameInstance) {
        this.game = gameInstance;
    }

    /**
     * 初始化游戏状态
     */
    initializeGame() {
        // 重置统计信息
        this.game.mistakes = 0;
        this.game.lastMistake = false;
        this.game.totalCorrect = 0;
        this.game.quickStreak = 0;
        this.game.quickAnswerTotalNumber = 0;
        this.game.continueCurrect = 0;
        this.game.score = 0;
        this.game.playerHealth = this.game.playerMaxHealth;
        this.game.questionRecords = [];
        this.game.isPaused = false;
        this.game.answerLocked = false;
        this.game.maxTime = 9;
        this.game.gameEnded = false;
        this.game.ultramanModeActivated = false;
        
        // 初始化敌方坦克状态
        this.game.enemyLevel = 1;
        this.game.enemyMaxHealth = 3;
        this.game.enemyHealth = 3;
        this.game.enemyTankDestroyed = false;
    }

    /**
     * 处理正确答案
     */
    handleCorrectAnswer(answerTime) {
        this.game.totalCorrect++;
        this.game.lastMistake = false;
        
        // 记录答题时间
        this.game.questionRecords.push({
            question: this.game.currentQuestion,
            time: answerTime,
            correct: true
        });
        
        // 基础得分
        this.game.score += this.game.CORRECT_ANSWER_SCORE;
        
        // 处理快速答题奖励
        if (answerTime < this.game.QUICK_ANSWER_THRESHOLD) {
            this.handleQuickAnswer(answerTime);
        } else {
            this.game.quickStreak = 0;
            this.game.animations.hideComboCounter();
        }
        
        // 连续答对奖励
        this.game.continueCurrect++;
        if (this.game.continueCurrect > 3) {
            this.game.animations.showBigSmart();
        }
        
        // 发射炮弹
        this.game.animations.fireBullet();
        
        // 更新显示
        this.updateGameDisplay();
    }

    /**
     * 处理快速答题
     */
    handleQuickAnswer(answerTime) {
        this.game.quickStreak++;
        this.game.quickAnswerTotalNumber++;
        
        // 快速答题额外得分
        this.game.score += this.game.QUICK_ANSWER_BONUS * this.game.quickStreak;
        
        // 显示快速答题奖励提示
        this.game.animations.showQuickBonus(answerTime, this.game.quickStreak);
        
        // 更新连击计数器
        this.game.animations.updateComboCounter(this.game.quickStreak);
    }

    /**
     * 处理错误答案
     */
    handleWrongAnswer(answerTime) {
        this.game.mistakes++;
        this.game.lastMistake = true;
        this.game.continueCurrect = 0;
        this.game.quickStreak = 0;
        
        // 记录答题时间
        this.game.questionRecords.push({
            question: this.game.currentQuestion,
            time: answerTime,
            correct: false
        });
        
        // 隐藏连击计数器
        this.game.animations.hideComboCounter();
        
        // 被敌方攻击
        this.enemyAttackPlayer();
        
        // 显示大呆豆提示
        if (this.game.mistakes > 5) {
            this.game.animations.showBigDummy();
        }
        
        // 更新显示
        this.updateGameDisplay();
    }

    /**
     * 处理超时
     */
    handleTimeout() {
        this.game.mistakes++;
        this.game.lastMistake = true;
        this.game.quickStreak = 0;
        
        // 记录超时
        this.game.questionRecords.push({
            question: this.game.currentQuestion,
            time: this.game.maxTime,
            correct: false
        });
        
        // 隐藏连击计数器
        this.game.animations.hideComboCounter();
        
        // 被敌方攻击
        this.enemyAttackPlayer();
        
        // 显示大呆豆提示
        if (this.game.mistakes > 5) {
            this.game.animations.showBigDummy();
        }
        
        // 更新显示
        this.updateGameDisplay();
    }

    /**
     * 敌方攻击玩家
     */
    enemyAttackPlayer() {
        // 扣血
        this.game.playerHealth--;
        this.updatePlayerHealthBar();
        
        // 敌方坦克发射炮弹动画
        this.game.animations.fireEnemyBullet();
        
        // 检查是否GameOver
        if (this.game.playerHealth <= 0) {
            this.gameOver();
        }
    }

    /**
     * 命中敌方坦克
     */
    hitEnemyTank() {
        if (this.game.enemyTankDestroyed) return;
        
        // 扣血
        this.game.enemyHealth--;
        this.updateEnemyHealthBar();
        
        const enemyTank = document.getElementById('enemyTank');
        const tankRect = enemyTank.getBoundingClientRect();
        const fieldRect = document.getElementById('battleField').getBoundingClientRect();
        const targetX = tankRect.left - fieldRect.left + (this.game.TANK_WIDTH / 2);
        
        if (this.game.enemyHealth <= 0) {
            // 坦克被摧毁
            this.destroyEnemyTank();
        } else {
            // 普通爆炸效果
            this.game.animations.createExplosion(targetX, this.game.BULLET_FIRE_Y);
            
            // 如果失误为0，添加烟火效果
            if (this.game.mistakes === 0) {
                this.game.animations.createFireworks(targetX, this.game.BULLET_FIRE_Y);
            }
            
            // 坦克震动效果
            enemyTank.style.animation = 'wrongShake 0.3s ease-out';
            setTimeout(() => {
                enemyTank.style.animation = '';
            }, 300);
        }
    }

    /**
     * 摧毁敌方坦克
     */
    destroyEnemyTank() {
        this.game.enemyTankDestroyed = true;
        const enemyTank = document.getElementById('enemyTank');
        const tankRect = enemyTank.getBoundingClientRect();
        const fieldRect = document.getElementById('battleField').getBoundingClientRect();
        const explosionX = tankRect.left - fieldRect.left + (this.game.TANK_WIDTH / 2);
        
        // 给玩家加血
        if (this.game.playerHealth < this.game.playerMaxHealth) {
            this.game.playerHealth++;
            this.updatePlayerHealthBar();
        }
        
        // 爆炸动画
        const bigExplosion = this.game.animations.explodeTank(enemyTank, explosionX);
        
        // 1秒后生成新的敌方坦克
        setTimeout(() => {
            bigExplosion.remove();
            this.spawnNewEnemyTank();
        }, 1000);
    }

    /**
     * 生成新的敌方坦克
     */
    spawnNewEnemyTank() {
        const enemyTank = document.getElementById('enemyTank');
        
        // 升级敌方坦克
        this.game.enemyLevel++;
        this.game.enemyMaxHealth = 3 + this.game.enemyLevel - 1;  // 每级增加1点血量
        this.game.enemyHealth = this.game.enemyMaxHealth;
        this.game.enemyTankDestroyed = false;
        
        // 减少超时时间（每过一关减少1秒，最少2秒）
        if (this.game.maxTime > 2) {
            this.game.maxTime--;
        }
        
        // 重置坦克样式和动画
        enemyTank.classList.remove('tank-exploding');
        enemyTank.style.animation = '';
        
        // 检查是否到达第6关，启用奥特曼模式（只在第一次激活）
        if (this.game.enemyLevel >= 6 && !this.game.ultramanModeActivated) {
            this.enableUltramanMode();
            this.game.ultramanModeActivated = true;
        }
        
        // 根据等级调整坦克大小
        const scale = 1 + (this.game.enemyLevel - 1) * 0.2;  // 每级增大20%
        enemyTank.style.transform = `scale(${scale})`;
        
        // 更新等级显示
        this.updateEnemyLevelDisplay();
        
        // 更新血条
        this.updateEnemyHealthBar();
        
        // 入场动画
        this.game.animations.spawnEnemyTankAnimation();
    }

    /**
     * 启用奥特曼模式
     */
    enableUltramanMode() {
        // 给游戏容器添加奥特曼模式样式类
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.classList.add('ultraman-mode');
        
        // 显示特殊的奥特曼模式提示
        this.game.animations.showUltramanModeActivated();
        
        // 更改背景色调
        const battleField = document.getElementById('battleField');
        battleField.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)';
        
        console.log('🦸‍♂️ 奥特曼模式已激活！');
    }

    /**
     * 重置奥特曼模式
     */
    resetUltramanMode() {
        // 移除奥特曼模式样式类
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.classList.remove('ultraman-mode');
        
        // 重置战场背景
        const battleField = document.getElementById('battleField');
        battleField.style.background = '#222';
        
        // 重置敌方坦克等级显示样式
        const levelDisplay = document.querySelector('#enemyTank .enemy-level');
        if (levelDisplay) {
            levelDisplay.style.color = '#f00';
            levelDisplay.style.fontSize = '20px';
        }
        
        console.log('🔄 奥特曼模式已重置');
    }

    /**
     * 更新敌方坦克等级显示
     */
    updateEnemyLevelDisplay() {
        const levelDisplay = document.querySelector('#enemyTank .enemy-level');
        if (this.game.enemyLevel >= 6) {
            levelDisplay.textContent = `👾 Lv.${this.game.enemyLevel}`;
            levelDisplay.style.color = '#ff00ff';
            levelDisplay.style.fontSize = '24px';
        } else {
            levelDisplay.textContent = `Lv.${this.game.enemyLevel}`;
        }
    }

    /**
     * 更新玩家血条
     */
    updatePlayerHealthBar() {
        const healthBar = document.querySelector('#playerTank .health-bar-fill');
        const healthPercent = (this.game.playerHealth / this.game.playerMaxHealth) * 100;
        healthBar.style.width = healthPercent + '%';
        
        // 根据血量改变颜色
        healthBar.classList.remove('medium', 'low');
        if (healthPercent <= this.game.LOW_HEALTH_THRESHOLD) {
            healthBar.classList.add('low');
        } else if (healthPercent <= this.game.MEDIUM_HEALTH_THRESHOLD) {
            healthBar.classList.add('medium');
        }
    }

    /**
     * 更新敌方血条
     */
    updateEnemyHealthBar() {
        const healthBar = document.querySelector('#enemyTank .health-bar-fill');
        const healthPercent = (this.game.enemyHealth / this.game.enemyMaxHealth) * 100;
        healthBar.style.width = healthPercent + '%';
        
        // 根据血量改变颜色
        healthBar.classList.remove('medium', 'low');
        if (healthPercent <= this.game.ENEMY_LOW_HEALTH_THRESHOLD) {
            healthBar.classList.add('low');
        } else if (healthPercent <= this.game.ENEMY_MEDIUM_HEALTH_THRESHOLD) {
            healthBar.classList.add('medium');
        }
    }

    /**
     * 更新游戏显示
     */
    updateGameDisplay() {
        this.updateMistakeCounter();
        this.updateTotalCorrect();
        this.updateQuickStreak();
        this.updateScore();
    }

    /**
     * 更新失误计数器
     */
    updateMistakeCounter() {
        document.getElementById('mistakeCounter').textContent = `失误: ${this.game.mistakes}`;
    }

    /**
     * 更新快速答题统计
     */
    updateQuickStreak() {
        document.getElementById('quickAnswerTotalNumber').textContent = this.game.quickAnswerTotalNumber;
    }

    /**
     * 更新总答对数
     */
    updateTotalCorrect() {
        document.getElementById('totalCorrect').textContent = this.game.totalCorrect;
    }

    /**
     * 更新得分
     */
    updateScore() {
        document.getElementById('scoreCounter').textContent = `得分: ${this.game.score}`;
    }

    /**
     * 游戏结束
     */
    gameOver() {
        // 停止倒计时全屏闪烁
        if (this.game.timeoutWarningInterval) {
            clearInterval(this.game.timeoutWarningInterval);
            this.game.timeoutWarningInterval = null;
        }
        
        // 隐藏倒计时警告
        const warning = document.getElementById('timeoutWarning');
        if (warning) {
            warning.style.display = 'none';
            warning.style.opacity = '0';
        }
        
        // 清除所有可能的闪烁定时器
        for (let i = 1; i < 10000; i++) {
            clearInterval(i);
        }
        
        // 防止重复调用
        if (this.game.gameEnded) return;
        this.game.gameEnded = true;
        
        // 停止游戏
        clearInterval(this.game.timer);
        this.game.isPaused = true;
        
        // 显示GameOver画面
        this.showGameOverScreen();
    }

    /**
     * 显示游戏结束画面
     */
    showGameOverScreen() {
        // 计算统计数据
        const avgTime = this.calculateAverageTime();
        const slowestQuestions = this.getSlowestQuestions();
        const wrongQuestions = this.getWrongQuestions();
        
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.style.display = 'block';
        
        // 清空内容，准备打字效果
        gameOverScreen.innerHTML = '';
        
        // 创建标题容器
        const titleContainer = document.createElement('h2');
        titleContainer.id = 'gameOverTitle';
        gameOverScreen.appendChild(titleContainer);
        
        // 创建统计容器
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        gameOverScreen.appendChild(statsContainer);
        
        // 创建慢题容器
        const slowContainer = document.createElement('div');
        slowContainer.className = 'slow-questions';
        gameOverScreen.appendChild(slowContainer);
        
        // 创建答错题目容器
        const wrongContainer = document.createElement('div');
        wrongContainer.className = 'wrong-questions';
        gameOverScreen.appendChild(wrongContainer);
        
        // 创建重试按钮
        const retryBtn = document.createElement('button');
        retryBtn.id = 'retryBtn';
        retryBtn.textContent = '重新开始';
        retryBtn.onclick = () => this.game.retryGame();
        gameOverScreen.appendChild(retryBtn);
        
        // 开始打字效果
        this.game.animations.typewriterEffect('GAME OVER', titleContainer, 0, () => {
            // 标题打完后，开始显示统计数据
            setTimeout(() => {
                this.showGameStats(statsContainer, slowContainer, wrongContainer, {
                    score: this.game.score,
                    correct: this.game.totalCorrect,
                    mistakes: this.game.mistakes,
                    avgTime: avgTime,
                    slowestQuestions: slowestQuestions,
                    wrongQuestions: wrongQuestions
                });
            }, 500);
        });
    }

    /**
     * 显示游戏统计数据
     */
    showGameStats(statsContainer, slowContainer, wrongContainer, stats) {
        // 创建统计项
        const statItems = [
            { label: '最终得分：', value: stats.score.toString() },
            { label: '总答对题数：', value: stats.correct.toString() },
            { label: '总失误次数：', value: stats.mistakes.toString() },
            { label: '平均答题时间：', value: stats.avgTime.toFixed(1) + '秒' }
        ];
        
        statItems.forEach((item, index) => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.style.animationDelay = (index * 0.2) + 's';
            
            const label = document.createElement('span');
            label.className = 'stat-label';
            label.textContent = item.label;
            
            const value = document.createElement('span');
            value.className = 'stat-value';
            value.textContent = item.value;
            
            statItem.appendChild(label);
            statItem.appendChild(value);
            statsContainer.appendChild(statItem);
        });
        
        // 显示最慢的三道题
        setTimeout(() => {
            const slowTitle = document.createElement('h3');
            slowTitle.textContent = '答题最慢的三道题：';
            slowContainer.appendChild(slowTitle);
            
            stats.slowestQuestions.forEach((record, index) => {
                setTimeout(() => {
                    const item = document.createElement('div');
                    item.className = 'slow-question-item';
                    item.innerHTML = `${index + 1}. ${record.question} <span class="slow-question-time">(${record.time.toFixed(1)}秒)</span>`;
                    slowContainer.appendChild(item);
                }, index * 200);
            });
        }, 1000);
        
        // 显示所有答错的题目
        setTimeout(() => {
            if (stats.wrongQuestions.length > 0) {
                const wrongTitle = document.createElement('h3');
                wrongTitle.textContent = `所有答错的题目 (共${stats.wrongQuestions.length}道)：`;
                wrongContainer.appendChild(wrongTitle);
                
                stats.wrongQuestions.forEach((record, index) => {
                    setTimeout(() => {
                        const item = document.createElement('div');
                        item.className = 'wrong-question-item';
                        item.innerHTML = `${index + 1}. ${record.question} <span class="wrong-question-time">(${record.time.toFixed(1)}秒)</span>`;
                        wrongContainer.appendChild(item);
                    }, index * 150);
                });
            } else {
                const noWrongTitle = document.createElement('h3');
                noWrongTitle.textContent = '🎉 完美！没有答错任何题目！';
                noWrongTitle.style.color = '#0f0';
                wrongContainer.appendChild(noWrongTitle);
            }
        }, 1500);
    }

    /**
     * 计算平均答题时间
     */
    calculateAverageTime() {
        if (this.game.questionRecords.length === 0) return 0;
        const totalTime = this.game.questionRecords.reduce((sum, record) => sum + record.time, 0);
        return totalTime / this.game.questionRecords.length;
    }

    /**
     * 获取最慢的三道题
     */
    getSlowestQuestions() {
        // 复制并排序记录
        const sorted = [...this.game.questionRecords]
            .sort((a, b) => b.time - a.time)
            .slice(0, 3);  // 取前三个最慢的
        return sorted;
    }

    /**
     * 获取答错的题目
     */
    getWrongQuestions() {
        // 获取所有答错的题目
        return this.game.questionRecords.filter(record => !record.correct);
    }
}
