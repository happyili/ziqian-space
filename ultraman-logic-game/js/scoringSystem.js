// 计分系统 - 管理分数计算和排行榜
class ScoringSystem {
    constructor() {
        this.currentScore = 0;
        this.highScores = this.loadHighScores();
        this.scoreHistory = [];
        this.streakBonus = 0;
        this.perfectBonus = 0;
    }

    // 计算题目分数
    calculateQuestionScore(isCorrect, timeSpent, timeLimit, difficulty, streak) {
        if (!isCorrect) return 0;

        const config = GameConfig.difficulty[difficulty];
        const scoring = GameConfig.scoring;

        // 基础分数
        let score = scoring.baseScore * config.scoreMultiplier;

        // 时间奖励
        const timeBonus = Math.max(0, timeLimit - timeSpent) * scoring.timeBonus / timeLimit;
        score += timeBonus;

        // 连击奖励
        if (streak > 1) {
            const streakBonus = Math.min(streak, scoring.maxStreak) * scoring.streakBonus;
            score += streakBonus;
        }

        // 完美奖励（快速且准确）
        if (timeSpent <= timeLimit * 0.3) {
            score += scoring.perfectBonus;
            this.perfectBonus += scoring.perfectBonus;
        }

        return Math.round(score);
    }

    // 添加分数
    addScore(score) {
        this.currentScore += score;
        this.scoreHistory.push({
            score: score,
            totalScore: this.currentScore,
            timestamp: new Date().toISOString()
        });
    }

    // 扣除分数（提示或跳过）
    deductScore(penalty) {
        this.currentScore = Math.max(0, this.currentScore - penalty);
    }

    // 获取当前分数
    getCurrentScore() {
        return this.currentScore;
    }

    // 重置分数
    resetScore() {
        this.currentScore = 0;
        this.scoreHistory = [];
        this.streakBonus = 0;
        this.perfectBonus = 0;
    }

    // 保存高分
    saveHighScore(difficulty, score, cards, accuracy, avgTime) {
        const highScore = {
            score: score,
            cards: cards,
            accuracy: accuracy,
            avgTime: avgTime,
            difficulty: difficulty,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('zh-CN')
        };

        // 添加到高分列表
        this.highScores.push(highScore);

        // 按分数排序
        this.highScores.sort((a, b) => b.score - a.score);

        // 只保留前10名
        this.highScores = this.highScores.slice(0, 10);

        // 保存到本地存储
        this.saveHighScores();
    }

    // 获取高分列表
    getHighScores() {
        return this.highScores;
    }

    // 获取最高分
    getHighestScore() {
        return this.highScores.length > 0 ? this.highScores[0].score : 0;
    }

    // 检查是否创造新纪录
    isNewRecord(score) {
        return score > this.getHighestScore();
    }

    // 获取分数等级
    getScoreLevel(score) {
        if (score >= 5000) return { level: 'S', name: '逻辑大师', color: '#FFD700' };
        if (score >= 3000) return { level: 'A', name: '推理高手', color: '#FF6B6B' };
        if (score >= 2000) return { level: 'B', name: '思维敏捷', color: '#4ECDC4' };
        if (score >= 1000) return { level: 'C', name: '逻辑新手', color: '#45B7D1' };
        return { level: 'D', name: '初学者', color: '#96CEB4' };
    }

    // 计算准确率
    calculateAccuracy(answers) {
        if (answers.length === 0) return 0;
        const correct = answers.filter(a => a.isCorrect).length;
        return Math.round((correct / answers.length) * 100);
    }

    // 计算平均时间
    calculateAverageTime(answers) {
        if (answers.length === 0) return 0;
        const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
        return Math.round(totalTime / answers.length);
    }

    // 获取分数统计
    getScoreStats() {
        return {
            currentScore: this.currentScore,
            highestScore: this.getHighestScore(),
            totalGames: this.highScores.length,
            averageScore: this.calculateAverageScore(),
            perfectBonuses: this.perfectBonus,
            scoreHistory: this.scoreHistory
        };
    }

    // 计算平均分数
    calculateAverageScore() {
        if (this.highScores.length === 0) return 0;
        const totalScore = this.highScores.reduce((sum, score) => sum + score.score, 0);
        return Math.round(totalScore / this.highScores.length);
    }

    // 加载高分数据
    loadHighScores() {
        try {
            const saved = localStorage.getItem(GameConfig.storageKeys.highScores);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('加载高分数据失败:', error);
            return [];
        }
    }

    // 保存高分数据
    saveHighScores() {
        try {
            localStorage.setItem(GameConfig.storageKeys.highScores, JSON.stringify(this.highScores));
        } catch (error) {
            console.error('保存高分数据失败:', error);
        }
    }

    // 清除所有数据
    clearAllData() {
        this.highScores = [];
        this.scoreHistory = [];
        this.currentScore = 0;
        localStorage.removeItem(GameConfig.storageKeys.highScores);
    }

    // 导出数据
    exportData() {
        return {
            highScores: this.highScores,
            scoreHistory: this.scoreHistory,
            stats: this.getScoreStats()
        };
    }

    // 导入数据
    importData(data) {
        try {
            if (data.highScores) {
                this.highScores = data.highScores;
                this.saveHighScores();
            }
            if (data.scoreHistory) {
                this.scoreHistory = data.scoreHistory;
            }
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoringSystem;
}
