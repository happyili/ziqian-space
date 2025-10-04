/**
 * 游戏动画效果模块
 * 包含所有视觉效果和动画相关功能
 */
class GameAnimations {
    constructor(gameInstance) {
        this.game = gameInstance;
    }

    /**
     * 高亮按钮效果
     */
    highlightButton(button) {
        // 添加按键按下的视觉效果
        button.style.transform = 'scale(0.95)';
        button.style.backgroundColor = '#0f0';
        button.style.color = '#000';
        
        setTimeout(() => {
            button.style.transform = '';
            if (!button.disabled) {
                button.style.backgroundColor = '';
                button.style.color = '';
            }
        }, 150);
    }

    /**
     * 发射玩家炮弹动画
     */
    fireBullet() {
        const playerTank = document.getElementById('playerTank');
        const enemyTank = document.getElementById('enemyTank');
        
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        
        // 选择不同的炮弹颜色
        this.game.lastBulletType = (this.game.lastBulletType + 1) % this.game.bulletTypes.length;
        bullet.style.backgroundColor = this.game.bulletTypes[this.game.lastBulletType];
        bullet.style.boxShadow = `0 0 10px ${this.game.bulletTypes[this.game.lastBulletType]}`;
        
        // 设置炮弹初始位置
        const tankRect = playerTank.getBoundingClientRect();
        const fieldRect = document.getElementById('battleField').getBoundingClientRect();
        
        // 从炮管末端发射
        bullet.style.left = (tankRect.right - fieldRect.left + this.game.PLAYER_BARREL_END_OFFSET) + 'px';
        // 炮管中心位置对齐
        bullet.style.bottom = this.game.BULLET_FIRE_Y + 'px';
        
        document.getElementById('battleField').appendChild(bullet);
        
        // 炮弹飞行动画
        const enemyRect = enemyTank.getBoundingClientRect();
        const targetX = enemyRect.left - fieldRect.left + (this.game.TANK_WIDTH / 2);
        
        let currentX = tankRect.right - fieldRect.left + this.game.PLAYER_BARREL_END_OFFSET;
        const speed = this.game.BULLET_SPEED;
        
        const flyInterval = setInterval(() => {
            currentX += speed;
            bullet.style.left = currentX + 'px';
            
            if (currentX >= targetX) {
                clearInterval(flyInterval);
                bullet.remove();
                
                // 命中敌方坦克，扣血
                this.game.hitEnemyTank();
            }
        }, 10);
    }

    /**
     * 发射敌方炮弹动画
     */
    fireEnemyBullet() {
        const playerTank = document.getElementById('playerTank');
        const enemyTank = document.getElementById('enemyTank');
        
        const bullet = document.createElement('div');
        bullet.className = 'bullet enemy-bullet';
        
        // 设置炮弹初始位置
        const tankRect = enemyTank.getBoundingClientRect();
        const fieldRect = document.getElementById('battleField').getBoundingClientRect();
        
        // 从敌方坦克炮管末端发射
        bullet.style.right = (fieldRect.right - tankRect.left + this.game.ENEMY_BARREL_END_OFFSET) + 'px';
        // 炮管中心位置对齐
        bullet.style.bottom = this.game.BULLET_FIRE_Y + 'px';
        
        document.getElementById('battleField').appendChild(bullet);
        
        // 炮弹飞行动画
        const playerRect = playerTank.getBoundingClientRect();
        const targetX = playerRect.left - fieldRect.left + (this.game.TANK_WIDTH / 2);
        
        // 从炮管末端开始飞行
        let currentX = tankRect.left - fieldRect.left - this.game.ENEMY_BARREL_END_OFFSET;
        const speed = this.game.BULLET_SPEED;
        
        const flyInterval = setInterval(() => {
            currentX -= speed;
            bullet.style.right = (fieldRect.right - fieldRect.left - currentX) + 'px';
            
            if (currentX <= targetX) {
                clearInterval(flyInterval);
                bullet.remove();
                
                // 爆炸效果
                this.createExplosion(targetX, this.game.BULLET_FIRE_Y);
                
                // 玩家坦克震动
                playerTank.style.animation = 'wrongShake 0.3s ease-out';
                setTimeout(() => {
                    playerTank.style.animation = '';
                }, 300);
            }
        }, 10);
    }

    /**
     * 创建爆炸效果
     */
    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = (x - this.game.EXPLOSION_SIZE / 2) + 'px';
        explosion.style.bottom = (y - this.game.EXPLOSION_SIZE / 2) + 'px';
        
        document.getElementById('battleField').appendChild(explosion);
        
        setTimeout(() => explosion.remove(), 500);
    }

    /**
     * 创建烟火效果
     */
    createFireworks(x, y) {
        const colors = ['#ff0', '#0ff', '#f0f', '#0f0', '#fff'];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = x + 'px';
            particle.style.bottom = y + 'px';
            
            document.getElementById('battleField').appendChild(particle);
            
            // 随机方向和速度
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 5 + Math.random() * 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let px = x;
            let py = y;
            let opacity = 1;
            
            const particleInterval = setInterval(() => {
                px += vx;
                py += vy;
                opacity -= 0.02;
                
                particle.style.left = px + 'px';
                particle.style.bottom = py + 'px';
                particle.style.opacity = opacity;
                
                if (opacity <= 0) {
                    clearInterval(particleInterval);
                    particle.remove();
                }
            }, 20);
        }
    }

    /**
     * 显示快速答题奖励提示
     */
    showQuickBonus(answerTime, quickStreak) {
        const bonus = document.createElement('div');
        bonus.className = 'quick-bonus';
        
        // 根据答题速度和连击数设置不同的提示
        let message;
        if (answerTime < 2) {
            message = '极速！🚀🚀';
        } else if (answerTime < 3) {
            message = '快速！⚡⚡';
        } else {
            message = '不错！✨';
        }
        
        // 根据连击数添加额外效果
        if (quickStreak === 1) {
            bonus.classList.add('streak-1');
            message += ' x1';
        } else if (quickStreak === 2) {
            bonus.classList.add('streak-2');
            message += ' x2';
        } else if (quickStreak >= 3) {
            bonus.classList.add('streak-3');
            message += (' x' + quickStreak + ' 完美！');
        }
        
        bonus.textContent = message;
        document.getElementById('gameScreen').appendChild(bonus);
        
        // 移除提示
        setTimeout(() => bonus.remove(), 1500);
    }

    /**
     * 显示大呆豆提示
     */
    showBigDummy() {
        const dummy = document.createElement('div');
        dummy.className = 'bigDummy';
        dummy.textContent = '大呆' + this.game.playerNickname;
        
        document.getElementById('gameScreen').appendChild(dummy);
        
        setTimeout(() => dummy.remove(), 1000);
    }

    /**
     * 显示大聪明提示
     */
    showBigSmart() {
        const dummy = document.createElement('div');
        dummy.className = 'bigDummy';
        dummy.textContent = '大大大聪明' + this.game.playerNickname;
        
        document.getElementById('gameScreen').appendChild(dummy);
        
        setTimeout(() => dummy.remove(), 1000);
    }

    /**
     * 更新连击计数器动画
     */
    updateComboCounter(quickStreak) {
        const counter = document.getElementById('comboCounter');
        const count = document.getElementById('comboCount');
        
        counter.classList.add('active');
        count.textContent = quickStreak;
        
        // 添加脉冲动画
        counter.style.animation = 'none';
        setTimeout(() => {
            counter.style.animation = 'comboPulse 0.5s ease-out';
        }, 10);
    }

    /**
     * 隐藏连击计数器
     */
    hideComboCounter() {
        const counter = document.getElementById('comboCounter');
        counter.classList.remove('active');
    }

    /**
     * 敌方坦克入场动画
     */
    spawnEnemyTankAnimation() {
        const enemyTank = document.getElementById('enemyTank');
        
        // 入场动画
        enemyTank.style.opacity = '0';
        enemyTank.style.right = '-100px';
        
        setTimeout(() => {
            enemyTank.style.transition = 'all 0.5s ease';
            enemyTank.style.opacity = '1';
            enemyTank.style.right = '100px';
        }, 100);
    }

    /**
     * 坦克爆炸动画
     */
    explodeTank(tankElement, explosionX) {
        // 添加爆炸动画
        tankElement.classList.add('tank-exploding');
        
        // 创建大爆炸效果
        const bigExplosion = document.createElement('div');
        bigExplosion.className = 'big-explosion';
        bigExplosion.style.left = (explosionX - this.game.BIG_EXPLOSION_SIZE / 2) + 'px';
        bigExplosion.style.bottom = (this.game.TANK_BOTTOM_OFFSET - this.game.TANK_HEIGHT) + 'px';
        document.getElementById('battleField').appendChild(bigExplosion);
        
        // 创建多个烟火效果
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFireworks(explosionX + (Math.random() - 0.5) * this.game.EXPLOSION_SIZE, 
                                   this.game.BULLET_FIRE_Y + (Math.random() - 0.5) * this.game.EXPLOSION_SIZE);
            }, i * 200);
        }
        
        return bigExplosion;
    }

    /**
     * 奥特曼模式激活动画
     */
    showUltramanModeActivated() {
        const notification = document.createElement('div');
        notification.className = 'ultraman-activation';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            color: #00ff00;
            font-weight: bold;
            text-shadow: 0 0 20px #00ff00;
            z-index: 1000;
            animation: ultramanActivation 3s ease-out forwards;
            pointer-events: none;
            text-align: center;
        `;
        notification.innerHTML = `
            🦸‍♂️ 奥特曼模式激活！ 🦸‍♂️<br>
            <span style="font-size: 24px; color: #fff;">与怪兽的终极对决开始！</span>
        `;
        
        // 添加激活动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ultramanActivation {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5) rotateY(180deg);
                }
                30% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2) rotateY(0deg);
                }
                70% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1) rotateY(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8) rotateY(-180deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // 3秒后移除通知
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }

    /**
     * 打字机效果
     */
    typewriterEffect(text, container, index = 0, callback) {
        if (index >= text.length) {
            if (callback) callback();
            return;
        }
        
        const char = document.createElement('span');
        char.className = 'bullet-char';
        char.textContent = text[index];
        char.style.animationDelay = (index * 0.1) + 's';
        container.appendChild(char);
        
        // 播放射击音效（可选）
        this.playShootSound();
        
        setTimeout(() => {
            this.typewriterEffect(text, container, index + 1, callback);
        }, 100);
    }

    /**
     * 播放射击音效
     */
    playShootSound() {
        try {
            // 创建简单的射击音效
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // 忽略音频上下文错误
            console.warn('Audio context not available:', e);
        }
    }

    /**
     * 显示最后倒计时数字
     */
    showFinalCountdown(number) {
        // 移除之前的倒计时数字
        const existingCountdown = document.querySelector('.final-countdown');
        if (existingCountdown) {
            existingCountdown.remove();
        }
        
        const countdown = document.createElement('div');
        countdown.className = 'final-countdown';
        countdown.textContent = number;
        
        document.body.appendChild(countdown);
        
        // 1秒后移除
        setTimeout(() => {
            countdown.remove();
        }, 1000);
    }

    /**
     * 显示按钮倒计时提示
     */
    showButtonCountdown() {
        // 创建倒计时提示
        const countdown = document.createElement('div');
        countdown.className = 'button-countdown';
        
        const questionArea = document.getElementById('questionArea');
        questionArea.appendChild(countdown);
        
        // 倒计时动画
        let timeLeft = 1;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                    if (countdown) countdown.remove();
                }, 300);
            }
        }, 100);
    }
}
