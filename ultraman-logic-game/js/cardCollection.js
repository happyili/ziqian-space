// 卡片收集系统 - 管理奥特曼卡片收集和展示
class CardCollection {
    constructor() {
        this.collectedCards = this.loadCollectedCards();
        this.cardTemplates = this.initializeCardTemplates();
    }

    // 初始化卡片模板
    initializeCardTemplates() {
        return {
            common: [
                { name: '初代奥特曼', description: '勇敢的奥特曼战士', emoji: '🦸‍♂️' },
                { name: '赛文奥特曼', description: '智慧的奥特曼英雄', emoji: '🦸‍♂️' },
                { name: '杰克奥特曼', description: '强壮的奥特曼勇士', emoji: '🦸‍♂️' },
                { name: '艾斯奥特曼', description: '敏捷的奥特曼战士', emoji: '🦸‍♂️' },
                { name: '泰罗奥特曼', description: '年轻的奥特曼英雄', emoji: '🦸‍♂️' },
                { name: '佐菲奥特曼', description: '宇宙警备队队长', emoji: '🛡️' },
                { name: '奥特之母', description: '慈爱的奥特曼之母', emoji: '👩‍👦' },
                { name: '奥特之父', description: '光之国的领导者', emoji: '👨‍👦' },
                { name: '雷欧奥特曼', description: '格斗之王奥特曼', emoji: '🥋' },
                { name: '爱迪奥特曼', description: '全能型奥特曼', emoji: '🌟' },
                { name: '阿斯特拉奥特曼', description: '雷欧的弟弟', emoji: '👬' },
                { name: '尤莉安奥特曼', description: '爱迪的恋人', emoji: '💕' },
                { name: '乔尼亚斯奥特曼', description: '来自U40的奥特曼', emoji: '🌌' },
                { name: '史考特奥特曼', description: '美国奥特曼', emoji: '🇺🇸' },
                { name: '查克奥特曼', description: '美国奥特曼', emoji: '🇺🇸' },
                { name: '贝斯奥特曼', description: '美国奥特曼', emoji: '🇺🇸' },
                { name: '葛雷奥特曼', description: '澳大利亚奥特曼', emoji: '🇦🇺' },
                { name: '帕瓦特奥特曼', description: '美国奥特曼', emoji: '🇺🇸' },
                { name: '纳伊斯奥特曼', description: '搞笑奥特曼', emoji: '😄' },
                { name: '哉阿斯奥特曼', description: '洁癖奥特曼', emoji: '🧼' }
            ],
            rare: [
                { name: '迪迦奥特曼', description: '光之巨人奥特曼', emoji: '✨' },
                { name: '戴拿奥特曼', description: '奇迹之光奥特曼', emoji: '💫' },
                { name: '盖亚奥特曼', description: '大地之光奥特曼', emoji: '🌍' },
                { name: '阿古茹奥特曼', description: '海洋之光奥特曼', emoji: '🌊' },
                { name: '高斯奥特曼', description: '慈爱的勇者奥特曼', emoji: '💙' },
                { name: '杰斯提斯奥特曼', description: '正义的奥特曼', emoji: '⚖️' },
                { name: '奈克瑟斯奥特曼', description: '纽带之光奥特曼', emoji: '🔗' },
                { name: '麦克斯奥特曼', description: '最快最强的奥特曼', emoji: '⚡' },
                { name: '梦比优斯奥特曼', description: '未来的奥特曼', emoji: '🚀' },
                { name: '希卡利奥特曼', description: '智慧的蓝族奥特曼', emoji: '🔬' },
                { name: '赛罗奥特曼', description: '年轻的战士奥特曼', emoji: '⚔️' },
                { name: '银河奥特曼', description: '银河之光奥特曼', emoji: '🌌' },
                { name: '维克特利奥特曼', description: '胜利之光奥特曼', emoji: '🏆' },
                { name: '艾克斯奥特曼', description: '未知之光奥特曼', emoji: '❓' },
                { name: '欧布奥特曼', description: '融合之光奥特曼', emoji: '🔄' },
                { name: '捷德奥特曼', description: '命运之光奥特曼', emoji: '🎭' },
                { name: '罗布奥特曼', description: '兄弟之光奥特曼', emoji: '👬' },
                { name: '泰迦奥特曼', description: '新生之光奥特曼', emoji: '🌱' },
                { name: '泽塔奥特曼', description: '传承之光奥特曼', emoji: '📚' },
                { name: '特利迦奥特曼', description: '永恒之光奥特曼', emoji: '♾️' },
                { name: '德凯奥特曼', description: '未来之光奥特曼', emoji: '🔮' },
                { name: '布莱泽奥特曼', description: '原始之光奥特曼', emoji: '🔥' },
                { name: '雷古洛斯奥特曼', description: '宇宙拳法奥特曼', emoji: '👊' },
                { name: '利布特奥特曼', description: '马来西亚奥特曼', emoji: '🇲🇾' },
                { name: '安德鲁美洛斯奥特曼', description: '安德鲁超战士', emoji: '🛡️' }
            ],
            epic: [
                { name: '奥特之王', description: '传说中的奥特曼之王', emoji: '👑' },
                { name: '诺亚奥特曼', description: '传说中的奥特曼之神', emoji: '🌟' },
                { name: '雷杰多奥特曼', description: '传说中的奥特曼', emoji: '💎' },
                { name: '赛迦奥特曼', description: '传说中的奥特曼', emoji: '🌈' },
                { name: '奥特之父', description: '光之国的领导者', emoji: '👨‍👦' },
                { name: '奥特之母', description: '慈爱的奥特曼之母', emoji: '👩‍👦' },
                { name: '格罗布奥特曼', description: '兄弟合体奥特曼', emoji: '⚡' },
                { name: '赛罗暗黑形态', description: '赛罗的黑暗力量', emoji: '🌑' },
                { name: '贝利亚尔奥特曼', description: '堕落的黑暗战士', emoji: '👹' },
                { name: '托雷吉亚奥特曼', description: '泰罗的挚友', emoji: '🔮' },
                { name: '朱蒂奥特曼', description: '融合战士', emoji: '💠' },
                { name: '奥特曼光辉形态', description: '梦比优斯的最强形态', emoji: '✨' },
                { name: '奈克斯特奥特曼', description: '诺亚的年轻形态', emoji: '🌅' },
                { name: '扎拉布星人奥特曼', description: '伪装的奥特曼', emoji: '🎭' },
                { name: '格利扎', description: '虚无的存在', emoji: '🕳️' },
                { name: '暗黑迪迦', description: '黑暗的巨人', emoji: '🌚' },
                { name: '邪恶迪迦', description: '邪恶的光之巨人', emoji: '😈' },
                { name: '暗黑扎基', description: '黑暗的仿制品', emoji: '🖤' },
                { name: '阿克(Ultraman Arc)', description: '2024年最新奥特曼', emoji: '🌟' },
                { name: '迪迦黑暗形态', description: '迪迦的黑暗力量', emoji: '🌑' },
                { name: '盖亚至高形态', description: '盖亚的最强形态', emoji: '🌍' },
                { name: '阿古茹至高形态', description: '阿古茹的最强形态', emoji: '🌊' },
                { name: '高斯日冕形态', description: '高斯的火焰力量', emoji: '☀️' },
                { name: '杰斯提斯破碎形态', description: '杰斯提斯的最强形态', emoji: '⚔️' },
                { name: '奈克瑟斯究极形态', description: '奈克瑟斯的终极力量', emoji: '🔗' }
            ],
            legendary: [
                { name: '银河维克特利奥特曼', description: '银河与维克特利合体', emoji: '🌌' },
                { name: '欧布源生形态', description: '欧布的原初力量', emoji: '🔄' },
                { name: '捷德极限形态', description: '捷德的最强形态', emoji: '🎭' },
                { name: '罗索奥特曼', description: '罗布的兄长', emoji: '🔥' },
                { name: '布鲁奥特曼', description: '罗布的弟弟', emoji: '💧' },
                { name: '泰塔斯奥特曼', description: '泰迦的伙伴', emoji: '💪' },
                { name: '风马奥特曼', description: '泰迦的伙伴', emoji: '💨' },
                { name: '泽塔阿尔法装甲', description: '泽塔的初始形态', emoji: '⚔️' },
                { name: '泽塔贝塔冲击', description: '泽塔的力量形态', emoji: '👊' },
                { name: '泽塔伽马未来', description: '泽塔的未来形态', emoji: '🔮' },
                { name: '泽塔德尔塔天爪', description: '泽塔的敏捷形态', emoji: '🦅' },
                { name: '特利迦真理形态', description: '特利迦的真实力量', emoji: '♾️' },
                { name: '特利迦永恒闪耀', description: '特利迦的最强形态', emoji: '✨' },
                { name: '德凯闪耀形态', description: '德凯的光辉力量', emoji: '🌟' },
                { name: '布莱泽费利斯', description: '布莱泽的装甲形态', emoji: '🔥' },
                { name: '阿克(Ultraman Arc)究极形态', description: '阿克的最强力量', emoji: '⚡' },
                { name: '赛罗终极形态', description: '赛罗的究极力量', emoji: '👑' },
                { name: '赛罗光辉形态', description: '赛罗的闪耀力量', emoji: '💫' },
                { name: '迪迦闪耀形态', description: '迪迦的最强形态', emoji: '✨' },
                { name: '戴拿奇迹形态', description: '戴拿的奇迹力量', emoji: '🌟' },
                { name: '梦比优斯凤凰勇者', description: '梦比优斯的终极形态', emoji: '🔥' },
                { name: '梦比优斯无限形态', description: '梦比优斯的无限力量', emoji: '♾️' },
                { name: '高斯未来形态', description: '高斯的未来力量', emoji: '🔮' },
                { name: '高斯蚀日形态', description: '高斯的日蚀力量', emoji: '🌑' },
                { name: '麦克斯斯拉修形态', description: '麦克斯的终极力量', emoji: '⚡' },
                { name: '奈克瑟斯蓝色青年', description: '奈克瑟斯的青年形态', emoji: '💙' },
                { name: '奈克瑟斯红色成年', description: '奈克瑟斯的成年形态', emoji: '❤️' },
                { name: '奈克瑟斯诺亚', description: '奈克瑟斯的最终形态', emoji: '🌟' },
                { name: '欧布三位一体', description: '欧布的三重力量', emoji: '🔱' },
                { name: '捷德王者形态', description: '捷德的王者力量', emoji: '👑' }
            ]
        };
    }

    // 生成卡片
    generateCard(score, streak) {
        const rarity = this.determineRarity(score, streak);
        const template = this.cardTemplates[rarity];
        const randomCard = template[Math.floor(Math.random() * template.length)];
        
        const card = {
            id: this.generateCardId(),
            name: randomCard.name,
            description: randomCard.description,
            emoji: randomCard.emoji,
            rarity: rarity,
            score: this.getRarityScore(rarity),
            collectedAt: new Date().toISOString(),
            collectedDate: new Date().toLocaleDateString('zh-CN')
        };

        // 添加到收集列表
        this.collectedCards.push(card);
        this.saveCollectedCards();

        return card;
    }

    // 确定卡片稀有度
    determineRarity(score, streak) {
        const totalScore = score + (streak * 100);
        
        if (totalScore >= 3000) return 'legendary';
        if (totalScore >= 2000) return 'epic';
        if (totalScore >= 1000) return 'rare';
        return 'common';
    }

    // 获取稀有度分数
    getRarityScore(rarity) {
        const scores = {
            common: 100,
            rare: 300,
            epic: 500,
            legendary: 1000
        };
        return scores[rarity];
    }

    // 生成卡片ID
    generateCardId() {
        return 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 获取收集的卡片
    getCollectedCards() {
        return this.collectedCards;
    }

    // 获取卡片统计
    getCardStats() {
        const stats = {
            total: this.collectedCards.length,
            byRarity: {
                common: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            },
            totalScore: 0,
            recentCards: this.collectedCards.slice(-5)
        };

        this.collectedCards.forEach(card => {
            stats.byRarity[card.rarity]++;
            stats.totalScore += card.score;
        });

        return stats;
    }

    // 检查是否已收集卡片
    hasCard(cardName) {
        return this.collectedCards.some(card => card.name === cardName);
    }

    // 获取卡片详情
    getCardDetails(cardId) {
        return this.collectedCards.find(card => card.id === cardId);
    }

    // 按稀有度获取卡片
    getCardsByRarity(rarity) {
        return this.collectedCards.filter(card => card.rarity === rarity);
    }

    // 获取最近收集的卡片
    getRecentCards(count = 5) {
        return this.collectedCards.slice(-count).reverse();
    }

    // 搜索卡片
    searchCards(query) {
        const lowerQuery = query.toLowerCase();
        return this.collectedCards.filter(card => 
            card.name.toLowerCase().includes(lowerQuery) ||
            card.description.toLowerCase().includes(lowerQuery)
        );
    }

    // 排序卡片
    sortCards(sortBy = 'collectedAt', order = 'desc') {
        const sortedCards = [...this.collectedCards];
        
        sortedCards.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'collectedAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return sortedCards;
    }

    // 获取卡片展示HTML
    getCardDisplayHTML(card) {
        return `
            <div class="card ${card.rarity}" data-card-id="${card.id}">
                <div class="card-header">
                    <span class="card-emoji">${card.emoji}</span>
                    <span class="card-rarity">${this.getRarityName(card.rarity)}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-name">${card.name}</h3>
                    <p class="card-description">${card.description}</p>
                </div>
                <div class="card-footer">
                    <span class="card-score">${card.score}分</span>
                    <span class="card-date">${card.collectedDate}</span>
                </div>
            </div>
        `;
    }

    // 获取稀有度名称
    getRarityName(rarity) {
        const names = {
            common: '普通',
            rare: '稀有',
            epic: '史诗',
            legendary: '传说'
        };
        return names[rarity];
    }

    // 获取稀有度颜色
    getRarityColor(rarity) {
        const colors = {
            common: '#95A5A6',
            rare: '#3498DB',
            epic: '#9B59B6',
            legendary: '#F39C12'
        };
        return colors[rarity];
    }

    // 创建卡片墙HTML
    createCardWall() {
        const cards = this.sortCards('collectedAt', 'desc');
        const wallHTML = cards.map(card => this.getCardDisplayHTML(card)).join('');
        
        return `
            <div class="card-wall">
                <div class="wall-header">
                    <h2>🎴 奥特曼卡片收藏墙</h2>
                    <div class="wall-stats">
                        <span>总计: ${cards.length}张</span>
                        <span>分数: ${this.getCardStats().totalScore}</span>
                    </div>
                </div>
                <div class="wall-content">
                    ${wallHTML}
                </div>
            </div>
        `;
    }

    // 创建卡片统计HTML
    createCardStatsHTML() {
        const stats = this.getCardStats();
        
        return `
            <div class="card-stats">
                <h3>📊 卡片收集统计</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">总卡片数</span>
                        <span class="stat-value">${stats.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">普通卡片</span>
                        <span class="stat-value">${stats.byRarity.common}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">稀有卡片</span>
                        <span class="stat-value">${stats.byRarity.rare}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">史诗卡片</span>
                        <span class="stat-value">${stats.byRarity.epic}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">传说卡片</span>
                        <span class="stat-value">${stats.byRarity.legendary}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">总分数</span>
                        <span class="stat-value">${stats.totalScore}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 加载收集的卡片
    loadCollectedCards() {
        try {
            const saved = localStorage.getItem(GameConfig.storageKeys.collectedCards);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('加载卡片数据失败:', error);
            return [];
        }
    }

    // 保存收集的卡片
    saveCollectedCards() {
        try {
            localStorage.setItem(GameConfig.storageKeys.collectedCards, JSON.stringify(this.collectedCards));
        } catch (error) {
            console.error('保存卡片数据失败:', error);
        }
    }

    // 清除所有卡片
    clearAllCards() {
        this.collectedCards = [];
        this.saveCollectedCards();
    }

    // 导出卡片数据
    exportCards() {
        return {
            cards: this.collectedCards,
            stats: this.getCardStats(),
            exportDate: new Date().toISOString()
        };
    }

    // 导入卡片数据
    importCards(data) {
        try {
            if (data.cards && Array.isArray(data.cards)) {
                this.collectedCards = data.cards;
                this.saveCollectedCards();
                return true;
            }
            return false;
        } catch (error) {
            console.error('导入卡片数据失败:', error);
            return false;
        }
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardCollection;
}
