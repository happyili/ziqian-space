// 题目系统 - 管理题目生成和逻辑
class QuestionSystem {
    constructor() {
        this.llmIntegration = new LLMIntegration();
        this.questionCache = new Map();
        this.currentQuestionType = null;
    }

    // 生成题目
    async generateQuestion(difficulty, level, gameType = 'all') {
        try {
            // 选择题目类型
            const questionType = this.selectQuestionType(difficulty, level, gameType);
            this.currentQuestionType = questionType;
            
            // 选择故事主题
            const theme = this.selectTheme();
            
            // 尝试从缓存获取
            const cacheKey = `${questionType}-${difficulty}-${level}-${gameType}`;
            if (this.questionCache.has(cacheKey)) {
                return this.questionCache.get(cacheKey);
            }
            
            // 生成新题目
            const question = await this.llmIntegration.generateQuestion(questionType, difficulty, theme);
            
            // 缓存题目
            this.questionCache.set(cacheKey, question);
            
            return question;
        } catch (error) {
            alert('题目生成失败:', error);
            // 返回备用题目
            return {}; // this.getFallbackQuestion(difficulty);
        }
    }

    // 生成提示
    async generateHint(questionType, question, options) {
        try {
            return await this.llmIntegration.generateHint(questionType, question, options);
        } catch (error) {
            console.error('提示生成失败:', error);
            return QuestionTemplates.hintTemplates[questionType] || '仔细思考一下，你一定能找到答案！';
        }
    }

    // 选择题目类型
    selectQuestionType(difficulty, level, gameType = 'all') {
        let types = QuestionTemplates.logicTypes;
        
        // 如果选择了特定类型，只使用该类型
        if (gameType !== 'all') {
            types = [gameType];
        }
        
        const difficultyConfig = QuestionTemplates.difficultyAdjustments[difficulty];
        
        // 根据难度和关卡选择题目类型
        let typeIndex;
        if (level <= 3) {
            typeIndex = Math.floor(Math.random() * Math.min(3, types.length)); // 前3种类型
        } else if (level <= 6) {
            typeIndex = Math.floor(Math.random() * Math.min(4, types.length)) + Math.max(0, Math.min(1, types.length - 4)); // 中间4种类型
        } else {
            typeIndex = Math.floor(Math.random() * Math.min(2, types.length)) + Math.max(0, types.length - 2); // 后2种类型
        }
        
        // 确保索引在有效范围内
        typeIndex = Math.min(typeIndex, types.length - 1);
        
        return types[typeIndex];
    }

    // 选择故事主题
    selectTheme() {
        const themes = QuestionTemplates.storyThemes;
        return themes[Math.floor(Math.random() * themes.length)];
    }

    // 获取备用题目
    getFallbackQuestion(difficulty) {
        const fallbackQuestions = {
            easy: [
                {
                    story: '奥特曼发现了一个数字序列：1, 3, 5, 7, ?',
                    question: '下一个数字是什么？',
                    options: ['9', '11', '13', '15'],
                    correctAnswer: 'A',
                    hint: '观察数字之间的规律，都是奇数'
                },
                {
                    story: '奥特曼看到了三个图案：🔴🔵🔴🔵🔴',
                    question: '下一个图案应该是什么？',
                    options: ['🔴', '🔵', '🟡', '🟢'],
                    correctAnswer: 'B',
                    hint: '观察颜色的交替规律'
                },
                {
                    story: '奥特曼遇到了三个怪兽：A怪兽会飞，B怪兽会游泳，C怪兽会飞也会游泳',
                    question: '哪个怪兽最危险？',
                    options: ['A怪兽', 'B怪兽', 'C怪兽', '都一样'],
                    correctAnswer: 'C',
                    hint: '考虑哪个怪兽的能力最多'
                }
            ],
            medium: [
                {
                    story: '奥特曼发现了一个数字序列：2, 6, 12, 20, ?',
                    question: '下一个数字是什么？',
                    options: ['30', '32', '34', '36'],
                    correctAnswer: 'A',
                    hint: '观察相邻数字的差值变化'
                },
                {
                    story: '奥特曼看到了图案序列：🔴🔵🟡🔴🔵🟡🔴',
                    question: '下一个图案应该是什么？',
                    options: ['🔴', '🔵', '🟡', '🟢'],
                    correctAnswer: 'B',
                    hint: '观察三个颜色的循环规律'
                },
                {
                    story: '奥特曼需要比较三个怪兽：A怪兽攻击力5，防御力3；B怪兽攻击力3，防御力5；C怪兽攻击力4，防御力4',
                    question: '哪个怪兽最平衡？',
                    options: ['A怪兽', 'B怪兽', 'C怪兽', '都一样'],
                    correctAnswer: 'C',
                    hint: '考虑攻击力和防御力的平衡'
                }
            ],
            hard: [
                {
                    story: '奥特曼发现了一个复杂序列：1, 1, 2, 3, 5, 8, ?',
                    question: '下一个数字是什么？',
                    options: ['11', '13', '15', '17'],
                    correctAnswer: 'B',
                    hint: '观察每个数字与前两个数字的关系'
                },
                {
                    story: '奥特曼看到了复杂图案：🔴🔵🟡🔴🔵🟡🔴🔵🟡🔴',
                    question: '下一个图案应该是什么？',
                    options: ['🔴', '🔵', '🟡', '🟢'],
                    correctAnswer: 'B',
                    hint: '观察三个颜色的循环规律'
                },
                {
                    story: '奥特曼遇到了逻辑谜题：如果所有A都是B，所有B都是C，那么所有A都是C吗？',
                    question: '这个推理正确吗？',
                    options: ['正确', '错误', '不确定', '需要更多信息'],
                    correctAnswer: 'A',
                    hint: '这是经典的逻辑推理，考虑传递性'
                }
            ]
        };
        
        const questions = fallbackQuestions[difficulty] || fallbackQuestions.easy;
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // 验证题目
    validateQuestion(question) {
        return question &&
               question.story &&
               question.question &&
               question.options &&
               question.options.length === 4 &&
               question.correctAnswer &&
               ['A', 'B', 'C', 'D'].includes(question.correctAnswer);
    }

    // 清理缓存
    clearCache() {
        this.questionCache.clear();
    }

    // 获取缓存统计
    getCacheStats() {
        return {
            size: this.questionCache.size,
            keys: Array.from(this.questionCache.keys())
        };
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionSystem;
}
