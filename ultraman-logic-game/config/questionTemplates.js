// 题目模板配置
const QuestionTemplates = {
    // 逻辑推理题目类型
    logicTypes: [
        'sequence',      // 序列推理
        'pattern',       // 模式识别
        'comparison',    // 比较推理
        'categorization', // 分类推理
        'cause_effect',  // 因果关系
        'deduction',     // 演绎推理
        'math_olympiad'  // 奥数综合题
    ],

    // 故事主题
    storyThemes: [
        '奥特曼拯救地球',
        '怪兽入侵城市',
        '宇宙探险之旅',
        '时间穿越冒险',
        '魔法世界奇遇',
        '未来科技挑战'
    ],

    // 题目难度关键词
    difficultyKeywords: {
        easy: ['简单', '基础', '容易', '明显'],
        medium: ['中等', '需要思考', '稍微复杂', '有一定难度'],
        hard: ['困难', '复杂', '需要深度思考', '挑战性']
    },

    // 提示模板
    hintTemplates: {
        sequence: '仔细观察数字或图案的变化规律',
        pattern: '寻找重复出现的模式或特征',
        comparison: '比较不同对象之间的相同点和不同点',
        categorization: '思考这些物品的共同特征',
        cause_effect: '分析事件之间的因果关系',
        deduction: '从已知条件推导出结论',
        math_olympiad: '运用数学知识和逻辑思维，仔细分析题目条件'
    },

    // 基础题目模板
    baseTemplates: [
        {
            type: 'sequence',
            template: `在奥特曼的冒险中，他遇到了一个数字序列谜题：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '仔细观察数字的变化规律，可能是加法、减法或乘法'
        },
        {
            type: 'pattern',
            template: `奥特曼在探索神秘星球时发现了奇怪的图案：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '寻找图案中重复出现的规律或对称性'
        },
        {
            type: 'comparison',
            template: `奥特曼需要比较不同怪兽的能力：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '仔细比较各个选项的相同点和不同点'
        },
        {
            type: 'categorization',
            template: `奥特曼需要将不同的物品进行分类：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '思考这些物品的共同特征或属性'
        },
        {
            type: 'cause_effect',
            template: `奥特曼分析事件之间的因果关系：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '分析哪个事件导致了另一个事件的发生'
        },
        {
            type: 'deduction',
            template: `奥特曼运用逻辑推理解决难题：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '从已知条件出发，逐步推导出结论'
        },
        {
            type: 'math_olympiad',
            template: `奥特曼遇到了一个复杂的数学奥数题：

故事：{story}

题目：{question}

选项：
A) {optionA}
B) {optionB}
C) {optionC}
D) {optionD}

正确答案：{correctAnswer}`,
            hint: '运用数学知识和逻辑思维，仔细分析题目条件'
        }
    ],

    // 故事生成模板
    storyTemplates: [
        {
            theme: '奥特曼拯救地球',
            templates: [
                '奥特曼发现了一个神秘的信号，来自遥远的星球。信号中包含了一串数字：{sequence}。奥特曼需要破解这个密码来拯救地球。',
                '怪兽在城市中留下了奇怪的标记，奥特曼追踪这些标记发现了一个规律：{pattern}。',
                '奥特曼遇到了三个不同的怪兽，它们分别具有不同的能力。{comparison}奥特曼需要找出哪个怪兽最危险。',
                '奥特曼在基地中发现了各种奇怪的物品：{items}。他需要将这些物品按照某种规律分类。',
                '奥特曼观察到一系列事件：{events}。他需要分析这些事件之间的因果关系。',
                '奥特曼收到了一个逻辑谜题：{logic}。他需要运用推理能力来解决这个问题。',
                '奥特曼遇到了一个复杂的数学奥数题：{math}。他需要运用数学知识和逻辑思维来解决。'
            ]
        },
        {
            theme: '怪兽入侵城市',
            templates: [
                '怪兽在城市中设置了陷阱，陷阱的激活顺序是：{sequence}。奥特曼需要预测下一个陷阱的位置。',
                '怪兽留下了神秘的图案，奥特曼发现图案的规律是：{pattern}。',
                '三个怪兽同时出现，它们的能力分别是：{comparison}。奥特曼需要决定先对付哪一个。',
                '怪兽在城市中散布了各种物品：{items}。奥特曼需要识别哪些物品是危险的。',
                '怪兽的行动导致了以下结果：{events}。奥特曼需要找出怪兽的真正目的。',
                '怪兽给奥特曼出了一个逻辑题：{logic}。奥特曼必须答对才能阻止怪兽的阴谋。',
                '怪兽给奥特曼出了一个数学奥数题：{math}。奥特曼必须运用数学知识才能破解怪兽的陷阱。'
            ]
        },
        {
            theme: '宇宙探险之旅',
            templates: [
                '奥特曼在宇宙飞船中发现了一个导航序列：{sequence}。他需要计算出下一个航点。',
                '外星文明留下了神秘的符号图案：{pattern}。奥特曼需要理解这些符号的含义。',
                '奥特曼遇到了三个不同的外星种族：{comparison}。他需要选择与哪个种族合作。',
                '宇宙飞船中发现了各种外星物品：{items}。奥特曼需要将它们分类整理。',
                '宇宙中发生了一系列神秘事件：{events}。奥特曼需要分析这些事件的原因。',
                '外星人给奥特曼出了一个逻辑测试：{logic}。奥特曼必须通过测试才能获得帮助。',
                '外星人给奥特曼出了一个数学奥数题：{math}。奥特曼必须运用数学知识才能获得外星科技。'
            ]
        }
    ],

    // 难度调整参数
    difficultyAdjustments: {
        easy: {
            sequenceLength: 3,
            patternComplexity: 'simple',
            comparisonItems: 2,
            categorizationItems: 3,
            causeEffectSteps: 2,
            deductionSteps: 2
        },
        medium: {
            sequenceLength: 4,
            patternComplexity: 'medium',
            comparisonItems: 3,
            categorizationItems: 4,
            causeEffectSteps: 3,
            deductionSteps: 3
        },
        hard: {
            sequenceLength: 5,
            patternComplexity: 'complex',
            comparisonItems: 4,
            categorizationItems: 5,
            causeEffectSteps: 4,
            deductionSteps: 4
        }
    },

    // LLM 提示词模板
    llmPrompts: {
        generateQuestion: `你是一位专业的儿童逻辑教育专家，请为10岁儿童设计一道有趣的逻辑推理题目。

要求：
1. 题目类型：{questionType}
2. 难度等级：{difficulty}
3. 故事主题：{theme}
4. 题目应该有趣且适合儿童理解
5. 选项要有一定的迷惑性，但正确答案要明确
6. 提供详细的解题思路

**重要：请严格按照以下JSON格式输出，不要添加任何其他文字或解释：**

{
  "story": "一个有趣的奥特曼相关小故事，描述逻辑推理的情境",
  "question": "具体的逻辑推理问题",
  "options": [
    "选项A的内容",
    "选项B的内容", 
    "选项C的内容",
    "选项D的内容"
  ],
  "correctAnswer": "A",
  "explanation": "详细的解题过程和思路",
  "hint": "给孩子的提示，不要直接给出答案"
}

**注意：**
- correctAnswer必须是A、B、C、D之一
- options数组必须包含4个选项
- 所有字段都必须填写完整
- 输出必须是有效的JSON格式`,

        generateAnalysis: `你是一位儿童教育专家，请根据以下游戏数据生成一份能力分析报告：

游戏数据：
- 总分数：{totalScore}
- 收集卡片数：{cardCount}
- 平均答题时间：{avgTime}
- 正确率：{accuracy}
- 难度等级：{difficulty}
- 答题历史：{answerHistory}

请生成一份适合10岁儿童的能力分析报告，包括：
1. 整体表现评价
2. 优势能力分析
3. 需要改进的地方
4. 学习建议
5. 鼓励性的话语

要求语言亲切、易懂，充满正能量。`,

        generateHint: `你是一位儿童教育专家，请为以下题目生成一个适合10岁儿童的提示：

题目类型：{questionType}
题目内容：{question}
当前选项：{options}

请生成一个：
1. 不会直接给出答案的提示
2. 引导孩子思考的方向
3. 语言简单易懂
4. 充满鼓励性

提示内容：`
    }
};

console.log('QuestionTemplates.baseTemplates: ', QuestionTemplates.baseTemplates);
console.log('QuestionTemplates.llmPrompts: ', QuestionTemplates.llmPrompts);

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionTemplates;
}
