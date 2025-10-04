// 结果总结系统 - 生成游戏结果和能力分析
class ResultSummary {
    constructor() {
        this.llmIntegration = new LLMIntegration();
    }

    // 生成游戏结果总结
    async generateGameSummary(gameData) {
        try {
            const summary = await this.llmIntegration.generateAnalysis(gameData);
            return summary;
        } catch (error) {
            console.error('生成游戏总结失败:', error);
            return this.getFallbackSummary(gameData);
        }
    }

    // 获取备用总结
    getFallbackSummary(gameData) {
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        const cards = gameData.cards || [];
        const avgTime = gameData.avgTime || 0;
        
        let summary = '';
        
        // 整体表现评价
        if (accuracy >= 90) {
            summary += '🎉 你的表现非常出色！逻辑推理能力很强，能够快速准确地分析问题。';
        } else if (accuracy >= 80) {
            summary += '👍 你的表现很好！逻辑推理能力不错，继续练习会更好。';
        } else if (accuracy >= 70) {
            summary += '💪 你的表现还可以！逻辑推理能力有提升空间，多练习会进步的。';
        } else if (accuracy >= 60) {
            summary += '📚 你的表现一般，但不要灰心！逻辑推理需要多练习，相信你会进步的。';
        } else {
            summary += '🌟 虽然这次表现不太理想，但这是学习的过程！继续努力，你一定能进步的。';
        }
        
        // 分数评价
        if (score >= 3000) {
            summary += '\n\n🏆 你的总分很高，说明你不仅准确率高，而且答题速度也很快！';
        } else if (score >= 2000) {
            summary += '\n\n⭐ 你的总分不错，说明你有很好的逻辑推理能力！';
        } else if (score >= 1000) {
            summary += '\n\n💫 你的总分还可以，继续练习会更好的！';
        } else {
            summary += '\n\n🌱 你的总分还有提升空间，多练习逻辑推理题目会进步的！';
        }
        
        // 卡片收集评价
        if (cards.length >= 8) {
            summary += '\n\n🎴 你收集了很多奥特曼卡片，说明你很有耐心和毅力！';
        } else if (cards.length >= 5) {
            summary += '\n\n🎴 你收集了一些奥特曼卡片，继续努力收集更多！';
        } else {
            summary += '\n\n🎴 你收集的卡片不多，但每张都是你努力的成果！';
        }
        
        // 时间评价
        if (avgTime <= 15) {
            summary += '\n\n⚡ 你的答题速度很快，说明思维很敏捷！';
        } else if (avgTime <= 25) {
            summary += '\n\n⏱️ 你的答题速度不错，保持这个节奏！';
        } else {
            summary += '\n\n🕐 你的答题速度还可以，多练习会更快！';
        }
        
        // 学习建议
        summary += '\n\n📖 学习建议：';
        summary += '\n• 多观察生活中的规律和模式';
        summary += '\n• 练习数字序列和图形推理';
        summary += '\n• 培养耐心和专注力';
        summary += '\n• 保持积极的学习态度';
        summary += '\n• 多思考问题的因果关系';
        
        // 鼓励话语
        summary += '\n\n💪 继续加油，你一定能成为逻辑推理高手！';
        
        return summary;
    }

    // 生成能力分析报告
    generateAbilityAnalysis(gameData) {
        const analysis = {
            overall: this.analyzeOverallPerformance(gameData),
            strengths: this.analyzeStrengths(gameData),
            weaknesses: this.analyzeWeaknesses(gameData),
            recommendations: this.generateRecommendations(gameData),
            encouragement: this.generateEncouragement(gameData)
        };
        
        return analysis;
    }

    // 分析整体表现
    analyzeOverallPerformance(gameData) {
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        const avgTime = gameData.avgTime || 0;
        
        let level = '初学者';
        let description = '需要更多练习';
        
        if (accuracy >= 90 && score >= 3000) {
            level = '逻辑大师';
            description = '表现非常出色，逻辑推理能力很强';
        } else if (accuracy >= 80 && score >= 2000) {
            level = '推理高手';
            description = '表现很好，逻辑推理能力不错';
        } else if (accuracy >= 70 && score >= 1000) {
            level = '思维敏捷';
            description = '表现还可以，有提升空间';
        } else if (accuracy >= 60) {
            level = '逻辑新手';
            description = '表现一般，需要多练习';
        }
        
        return {
            level: level,
            description: description,
            accuracy: accuracy,
            score: score,
            avgTime: avgTime
        };
    }

    // 分析优势
    analyzeStrengths(gameData) {
        const strengths = [];
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        const avgTime = gameData.avgTime || 0;
        const cards = gameData.cards || [];
        
        if (accuracy >= 80) {
            strengths.push('逻辑推理准确率高');
        }
        
        if (score >= 2000) {
            strengths.push('综合表现优秀');
        }
        
        if (avgTime <= 20) {
            strengths.push('思维反应敏捷');
        }
        
        if (cards.length >= 5) {
            strengths.push('有耐心和毅力');
        }
        
        if (gameData.streak >= 3) {
            strengths.push('能够保持专注');
        }
        
        return strengths.length > 0 ? strengths : ['有学习潜力'];
    }

    // 分析弱点
    analyzeWeaknesses(gameData) {
        const weaknesses = [];
        const accuracy = gameData.accuracy || 0;
        const avgTime = gameData.avgTime || 0;
        
        if (accuracy < 70) {
            weaknesses.push('逻辑推理准确率需要提高');
        }
        
        if (avgTime > 25) {
            weaknesses.push('答题速度可以更快');
        }
        
        if (gameData.hintsUsed > 5) {
            weaknesses.push('独立思考能力需要加强');
        }
        
        if (gameData.skipsUsed > 2) {
            weaknesses.push('需要更多耐心');
        }
        
        return weaknesses.length > 0 ? weaknesses : ['整体表现良好'];
    }

    // 生成建议
    generateRecommendations(gameData) {
        const recommendations = [];
        const accuracy = gameData.accuracy || 0;
        const avgTime = gameData.avgTime || 0;
        
        if (accuracy < 80) {
            recommendations.push('多练习逻辑推理题目，提高准确率');
        }
        
        if (avgTime > 20) {
            recommendations.push('练习快速思考，提高答题速度');
        }
        
        if (gameData.hintsUsed > 3) {
            recommendations.push('尝试独立思考，减少对提示的依赖');
        }
        
        recommendations.push('观察生活中的规律和模式');
        recommendations.push('练习数字序列和图形推理');
        recommendations.push('培养耐心和专注力');
        
        return recommendations;
    }

    // 生成鼓励话语
    generateEncouragement(gameData) {
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        
        if (accuracy >= 90) {
            return '🎉 你的表现非常出色！继续保持，你一定能成为逻辑推理大师！';
        } else if (accuracy >= 80) {
            return '👍 你的表现很好！继续练习，相信你会更棒的！';
        } else if (accuracy >= 70) {
            return '💪 你的表现还可以！多练习会进步的，加油！';
        } else {
            return '🌟 虽然这次表现不太理想，但这是学习的过程！继续努力，你一定能进步的！';
        }
    }

    // 生成详细报告
    generateDetailedReport(gameData) {
        const analysis = this.generateAbilityAnalysis(gameData);
        
        return {
            summary: this.getFallbackSummary(gameData),
            analysis: analysis,
            stats: {
                totalQuestions: gameData.answers ? gameData.answers.length : 0,
                correctAnswers: gameData.answers ? gameData.answers.filter(a => a.isCorrect).length : 0,
                accuracy: gameData.accuracy || 0,
                totalScore: gameData.score || 0,
                averageTime: gameData.avgTime || 0,
                cardsCollected: gameData.cards ? gameData.cards.length : 0,
                hintsUsed: gameData.hintsUsed || 0,
                skipsUsed: gameData.skipsUsed || 0,
                maxStreak: gameData.maxStreak || 0
            },
            recommendations: analysis.recommendations,
            encouragement: analysis.encouragement
        };
    }

    // 生成分享文本
    generateShareText(gameData) {
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        const cards = gameData.cards || [];
        const avgTime = gameData.avgTime || 0;
        
        return `我在奥特曼逻辑推理大冒险中获得了${score}分！准确率${accuracy}%，平均用时${avgTime}秒，收集了${cards.length}张奥特曼卡片！快来挑战你的逻辑推理能力吧！`;
    }

    // 生成成就列表
    generateAchievements(gameData) {
        const achievements = [];
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        const cards = gameData.cards || [];
        const avgTime = gameData.avgTime || 0;
        const streak = gameData.maxStreak || 0;
        
        if (accuracy >= 100) {
            achievements.push({ name: '完美答题', description: '所有题目都答对了！', icon: '🎯' });
        }
        
        if (accuracy >= 90) {
            achievements.push({ name: '逻辑大师', description: '准确率超过90%', icon: '🧠' });
        }
        
        if (score >= 5000) {
            achievements.push({ name: '高分达人', description: '总分超过5000分', icon: '🏆' });
        }
        
        if (avgTime <= 15) {
            achievements.push({ name: '闪电思维', description: '平均答题时间少于15秒', icon: '⚡' });
        }
        
        if (cards.length >= 10) {
            achievements.push({ name: '卡片收藏家', description: '收集了10张以上卡片', icon: '🎴' });
        }
        
        if (streak >= 5) {
            achievements.push({ name: '连击高手', description: '连续答对5题以上', icon: '🔥' });
        }
        
        if (gameData.hintsUsed === 0) {
            achievements.push({ name: '独立思考', description: '没有使用任何提示', icon: '💡' });
        }
        
        return achievements;
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResultSummary;
}
