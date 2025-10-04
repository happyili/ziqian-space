// 动画引擎 - 管理游戏中的各种动画效果
class AnimationEngine {
    constructor() {
        this.animations = new Map();
        this.isAnimating = false;
    }

    // 奥特曼攻击动画
    ultramanAttack() {
        const ultraman = document.getElementById('ultraman-character');
        const effects = document.getElementById('battle-effects');
        
        // 奥特曼攻击动作
        ultraman.classList.add('attacking');
        
        // 创建能量波效果
        const energyWave = document.createElement('div');
        energyWave.className = 'energy-wave';
        energyWave.innerHTML = '💥';
        effects.appendChild(energyWave);
        
        // 动画结束后清理
        setTimeout(() => {
            ultraman.classList.remove('attacking');
            energyWave.remove();
        }, GameConfig.animations.ultramanAttackDuration);
    }

    // 卡片翻转动画
    flipCard(cardElement) {
        return new Promise((resolve) => {
            cardElement.classList.add('flipping');
            
            setTimeout(() => {
                cardElement.classList.remove('flipping');
                cardElement.classList.add('flipped');
                resolve();
            }, GameConfig.animations.cardFlipDuration / 2);
        });
    }

    // 胜利庆祝动画
    victoryCelebration() {
        const container = document.getElementById('game-container');
        
        // 创建庆祝效果
        const celebration = document.createElement('div');
        celebration.className = 'victory-celebration';
        celebration.innerHTML = `
            <div class="celebration-text">🎉 胜利！🎉</div>
            <div class="celebration-effects">
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
            </div>
        `;
        
        container.appendChild(celebration);
        
        // 动画结束后清理
        setTimeout(() => {
            celebration.remove();
        }, GameConfig.animations.victoryCelebrationDuration);
    }

    // 错误动画
    showError() {
        const container = document.getElementById('game-container');
        
        const errorEffect = document.createElement('div');
        errorEffect.className = 'error-effect';
        errorEffect.innerHTML = '❌ 错误！';
        
        container.appendChild(errorEffect);
        
        setTimeout(() => {
            errorEffect.remove();
        }, 1000);
    }

    // 正确动画
    showCorrect() {
        const container = document.getElementById('game-container');
        
        const correctEffect = document.createElement('div');
        correctEffect.className = 'correct-effect';
        correctEffect.innerHTML = '✅ 正确！';
        
        container.appendChild(correctEffect);
        
        setTimeout(() => {
            correctEffect.remove();
        }, 1000);
    }

    // 卡片获得动画
    showCardAward(card) {
        const container = document.getElementById('game-container');
        
        const awardEffect = document.createElement('div');
        awardEffect.className = 'card-award-effect';
        awardEffect.innerHTML = `
            <div class="award-content">
                <h3>🎴 获得新卡片！</h3>
                <div class="awarded-card ${card.rarity}">
                    <span class="card-emoji">${card.emoji}</span>
                    <span class="card-name">${card.name}</span>
                </div>
                <p class="card-description">${card.description}</p>
            </div>
        `;
        
        container.appendChild(awardEffect);
        
        setTimeout(() => {
            awardEffect.remove();
        }, 3000);
    }

    // 分数增加动画
    showScoreIncrease(score) {
        const scoreElement = document.getElementById('current-score');
        
        // 创建分数增加效果
        const scoreEffect = document.createElement('div');
        scoreEffect.className = 'score-increase-effect';
        scoreEffect.textContent = `+${score}`;
        
        scoreElement.parentElement.appendChild(scoreEffect);
        
        setTimeout(() => {
            scoreEffect.remove();
        }, 1500);
    }

    // 连击动画
    showStreak(streak) {
        const container = document.getElementById('game-container');
        
        const streakEffect = document.createElement('div');
        streakEffect.className = 'streak-effect';
        streakEffect.innerHTML = `
            <div class="streak-content">
                <span class="streak-text">连击 x${streak}!</span>
                <div class="streak-fireworks">🎆</div>
            </div>
        `;
        
        container.appendChild(streakEffect);
        
        setTimeout(() => {
            streakEffect.remove();
        }, 2000);
    }

    // 时间警告动画
    showTimeWarning() {
        const timerElement = document.getElementById('timer');
        timerElement.classList.add('time-warning');
        
        // 闪烁效果
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            timerElement.classList.toggle('flashing');
            flashCount++;
            
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                timerElement.classList.remove('flashing');
            }
        }, 200);
    }

    // 进度条动画
    updateProgress(progress) {
        const progressBar = document.getElementById('progress-fill');
        progressBar.style.width = `${progress}%`;
        
        // 添加进度更新动画
        progressBar.classList.add('progress-updating');
        
        setTimeout(() => {
            progressBar.classList.remove('progress-updating');
        }, 500);
    }

    // 屏幕切换动画
    switchScreen(fromScreen, toScreen) {
        return new Promise((resolve) => {
            // 淡出当前屏幕
            fromScreen.classList.add('fade-out');
            
            setTimeout(() => {
                fromScreen.classList.remove('active', 'fade-out');
                toScreen.classList.add('active', 'fade-in');
                
                setTimeout(() => {
                    toScreen.classList.remove('fade-in');
                    resolve();
                }, GameConfig.animations.transitionDuration);
            }, GameConfig.animations.transitionDuration);
        });
    }

    // 加载动画
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('active');
        
        // 创建加载动画
        const spinner = loadingScreen.querySelector('.loading-spinner');
        if (spinner) {
            spinner.classList.add('spinning');
        }
    }

    // 隐藏加载动画
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('active');
        
        const spinner = loadingScreen.querySelector('.loading-spinner');
        if (spinner) {
            spinner.classList.remove('spinning');
        }
    }

    // 创建粒子效果
    createParticleEffect(type, x, y) {
        const container = document.getElementById('game-container');
        
        const particle = document.createElement('div');
        particle.className = `particle ${type}`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // 创建爆炸效果
    createExplosion(x, y) {
        const container = document.getElementById('game-container');
        
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        explosion.innerHTML = '💥';
        
        container.appendChild(explosion);
        
        setTimeout(() => {
            explosion.remove();
        }, 800);
    }

    // 创建能量环效果
    createEnergyRing() {
        const ultraman = document.getElementById('ultraman-character');
        const energyRing = ultraman.querySelector('.energy-ring');
        
        if (energyRing) {
            energyRing.classList.add('active');
            
            setTimeout(() => {
                energyRing.classList.remove('active');
            }, 2000);
        }
    }

    // 创建文字动画
    createTextAnimation(text, x, y, color = '#fff') {
        const container = document.getElementById('game-container');
        
        const textElement = document.createElement('div');
        textElement.className = 'text-animation';
        textElement.textContent = text;
        textElement.style.left = `${x}px`;
        textElement.style.top = `${y}px`;
        textElement.style.color = color;
        
        container.appendChild(textElement);
        
        setTimeout(() => {
            textElement.remove();
        }, 2000);
    }

    // 创建震动效果
    createShake(element) {
        element.classList.add('shaking');
        
        setTimeout(() => {
            element.classList.remove('shaking');
        }, 500);
    }

    // 创建缩放效果
    createScale(element, scale = 1.2) {
        element.style.transform = `scale(${scale})`;
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }

    // 创建旋转效果
    createRotate(element, degrees = 360) {
        element.style.transform = `rotate(${degrees}deg)`;
        element.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            element.style.transform = 'rotate(0deg)';
        }, 500);
    }

    // 创建弹跳效果
    createBounce(element) {
        element.classList.add('bouncing');
        
        setTimeout(() => {
            element.classList.remove('bouncing');
        }, 600);
    }

    // 创建淡入效果
    createFadeIn(element, duration = 1000) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    }

    // 创建淡出效果
    createFadeOut(element, duration = 1000) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    // 停止所有动画
    stopAllAnimations() {
        this.isAnimating = false;
        
        // 移除所有动画类
        document.querySelectorAll('.attacking, .flipping, .shaking, .bouncing').forEach(element => {
            element.classList.remove('attacking', 'flipping', 'shaking', 'bouncing');
        });
        
        // 清理所有效果元素
        document.querySelectorAll('.energy-wave, .victory-celebration, .error-effect, .correct-effect').forEach(element => {
            element.remove();
        });
    }

    // 检查是否正在动画
    isCurrentlyAnimating() {
        return this.isAnimating;
    }

    // 设置动画状态
    setAnimating(state) {
        this.isAnimating = state;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationEngine;
}
