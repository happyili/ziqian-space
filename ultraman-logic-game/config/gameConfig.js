// 游戏配置
const GameConfig = {
    // 难度等级配置
    difficulty: {
        easy: {
            name: '初级探险',
            timeLimit: 300, // 5分钟 (300秒) - 总游戏时间
            questionTimeLimit: 60, // 30秒 - 单题时间限制
            questionsPerLevel: 5,
            scoreMultiplier: 1,
            hintPenalty: 5,
            skipPenalty: 10
        },
        medium: {
            name: '中级挑战',
            timeLimit: 240, // 4分钟 (240秒) - 总游戏时间
            questionTimeLimit: 60, // 25秒 - 单题时间限制
            questionsPerLevel: 7,
            scoreMultiplier: 1.5,
            hintPenalty: 8,
            skipPenalty: 15
        },
        hard: {
            name: '高级大师',
            timeLimit: 180, // 3分钟 (180秒) - 总游戏时间
            questionTimeLimit: 60, // 20秒 - 单题时间限制
            questionsPerLevel: 10,
            scoreMultiplier: 2,
            hintPenalty: 10,
            skipPenalty: 20
        }
    },

    // 计分规则
    scoring: {
        baseScore: 100,
        timeBonus: 50, // 剩余时间奖励
        perfectBonus: 200, // 完美答题奖励
        streakBonus: 50, // 连续答对奖励
        maxStreak: 5
    },

    // 奥特曼卡片配置
    ultramanCards: {
        common: {
            name: '普通奥特曼',
            rarity: 'common',
            score: 100,
            description: '勇敢的奥特曼战士'
        },
        rare: {
            name: '稀有奥特曼',
            rarity: 'rare',
            score: 300,
            description: '强大的奥特曼英雄'
        },
        epic: {
            name: '史诗奥特曼',
            rarity: 'epic',
            score: 500,
            description: '传说中的奥特曼王者'
        },
        legendary: {
            name: '传说奥特曼',
            rarity: 'legendary',
            score: 1000,
            description: '神话般的奥特曼之神'
        }
    },

    // 游戏状态
    gameStates: {
        START: 'start',
        PLAYING: 'playing',
        PAUSED: 'paused',
        FINISHED: 'finished',
        LOADING: 'loading'
    },

    // 动画配置
    animations: {
        cardFlipDuration: 600,
        ultramanAttackDuration: 1000,
        victoryCelebrationDuration: 2000,
        transitionDuration: 300
    },

    // LLM API 配置
    // qwen/qwen3-coder:free
    // google/gemini-2.5-flash-preview-09-2025
    // google/gemini-2.5-flash-lite
    // openai/gpt-oss-20b:free
    llmConfig: {
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'openai/gpt-oss-20b:free', // 使用免费模型. model: 'qwen/qwen3-coder:free',
        maxTokens: 10000,
        temperature: 0.7,
        // 可以在这里设置你的API密钥，或者在localStorage中设置 'openrouter_api_key'
        apiKey: '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'
    },

    // 本地存储键名
    storageKeys: {
        highScores: 'ultraman_high_scores',
        collectedCards: 'ultraman_collected_cards',
        gameSettings: 'ultraman_game_settings',
        playerStats: 'ultraman_player_stats'
    }
};


// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameConfig };
}
