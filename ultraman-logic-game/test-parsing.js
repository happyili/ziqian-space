#!/usr/bin/env node

/**
 * 题目解析功能单元测试
 * 使用方法：node test-parsing.js
 */

// 模拟浏览器环境的基础对象
global.GameConfig = {
    llmConfig: {
        apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        maxTokens: 500,
        temperature: 0.7,
        apiKey: 'test-key'
    }
};

global.QuestionTemplates = {
    llmPrompts: {
        generateQuestion: 'test prompt',
        generateHint: 'test hint prompt',
        generateAnalysis: 'test analysis prompt'
    },
    hintTemplates: {
        sequence: '测试提示'
    }
};

// 模拟LLMIntegration类的核心解析方法
class LLMIntegration {
    constructor() {
        // 模拟构造函数
    }
    
    // 解析题目响应
    parseQuestionResponse(response) {
        try {
            // 清理响应文本，移除可能的markdown代码块标记
            let cleanResponse = response.trim();
            
            // 移除可能的markdown代码块
            if (cleanResponse.startsWith('```json')) {
                cleanResponse = cleanResponse.replace(/^```json\s*/, '');
            }
            if (cleanResponse.startsWith('```')) {
                cleanResponse = cleanResponse.replace(/^```\s*/, '');
            }
            if (cleanResponse.endsWith('```')) {
                cleanResponse = cleanResponse.replace(/\s*```$/, '');
            }
            
            // 尝试解析JSON
            let parsedQuestion;
            try {
                parsedQuestion = JSON.parse(cleanResponse);
            } catch (jsonError) {
                console.warn('JSON解析失败，尝试文本解析:', jsonError.message);
                return this.parseQuestionResponseLegacy(response);
            }
            
            // 验证和标准化解析后的数据
            const question = this.validateAndNormalizeQuestion(parsedQuestion);
            
            console.log('✅ 成功解析JSON格式题目');
            return question;
            
        } catch (error) {
            console.error('题目解析失败:', error);
            console.log('原始响应:', response);
            throw error;
        }
    }
    
    // 验证和标准化题目数据
    validateAndNormalizeQuestion(parsedQuestion) {
        const question = {
            story: '',
            question: '',
            options: [],
            correctAnswer: '',
            hint: '',
            explanation: ''
        };
        
        // 验证必需字段
        if (!parsedQuestion.story || typeof parsedQuestion.story !== 'string') {
            throw new Error('缺少或无效的故事字段');
        }
        if (!parsedQuestion.question || typeof parsedQuestion.question !== 'string') {
            throw new Error('缺少或无效的题目字段');
        }
        if (!Array.isArray(parsedQuestion.options) || parsedQuestion.options.length !== 4) {
            throw new Error('选项必须是包含4个元素的数组');
        }
        if (!parsedQuestion.correctAnswer || !['A', 'B', 'C', 'D'].includes(parsedQuestion.correctAnswer)) {
            throw new Error('正确答案必须是A、B、C、D之一');
        }
        
        // 验证选项内容
        for (let i = 0; i < parsedQuestion.options.length; i++) {
            if (!parsedQuestion.options[i] || typeof parsedQuestion.options[i] !== 'string') {
                throw new Error(`选项${String.fromCharCode(65 + i)}内容无效`);
            }
        }
        
        // 填充验证后的数据
        question.story = parsedQuestion.story.trim();
        question.question = parsedQuestion.question.trim();
        question.options = parsedQuestion.options.map(opt => opt.trim());
        question.correctAnswer = parsedQuestion.correctAnswer.trim();
        question.hint = (parsedQuestion.hint || '仔细思考一下，你一定能找到答案！').trim();
        question.explanation = (parsedQuestion.explanation || '').trim();
        
        return question;
    }
    
    // 兼容旧格式的解析方法
    parseQuestionResponseLegacy(response) {
        console.log('🔄 使用兼容模式解析文本格式');
        
        try {
            const lines = response.split('\n');
            const question = {
                story: '',
                question: '',
                options: [],
                correctAnswer: '',
                hint: '',
                explanation: ''
            };

            let currentSection = '';
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                
                if (trimmedLine.startsWith('故事：')) {
                    currentSection = 'story';
                    question.story = trimmedLine.substring(3);
                } else if (trimmedLine.startsWith('题目：')) {
                    currentSection = 'question';
                    question.question = trimmedLine.substring(3);
                } else if (trimmedLine.startsWith('选项A：')) {
                    question.options[0] = trimmedLine.substring(4);
                } else if (trimmedLine.startsWith('选项B：')) {
                    question.options[1] = trimmedLine.substring(4);
                } else if (trimmedLine.startsWith('选项C：')) {
                    question.options[2] = trimmedLine.substring(4);
                } else if (trimmedLine.startsWith('选项D：')) {
                    question.options[3] = trimmedLine.substring(4);
                } else if (trimmedLine.startsWith('正确答案：')) {
                    question.correctAnswer = trimmedLine.substring(5);
                } else if (trimmedLine.startsWith('提示：')) {
                    question.hint = trimmedLine.substring(3);
                } else if (trimmedLine.startsWith('解题思路：')) {
                    question.explanation = trimmedLine.substring(5);
                } else if (currentSection && trimmedLine) {
                    // 继续当前部分的内容
                    if (currentSection === 'story') {
                        question.story += ' ' + trimmedLine;
                    } else if (currentSection === 'question') {
                        question.question += ' ' + trimmedLine;
                    }
                }
            }

            // 验证题目完整性
            if (!question.story || !question.question || question.options.length !== 4 || !question.correctAnswer) {
                throw new Error('题目格式不完整');
            }

            // 标准化正确答案格式
            if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
                throw new Error('正确答案格式错误，必须是A、B、C、D之一');
            }

            // 设置默认提示
            if (!question.hint) {
                question.hint = '仔细思考一下，你一定能找到答案！';
            }

            console.log('✅ 成功解析文本格式题目');
            return question;
            
        } catch (error) {
            console.error('兼容模式解析失败:', error);
            throw error;
        }
    }
}

// 测试用例
const testCases = [
    {
        name: '有效的JSON格式',
        input: `{
  "story": "奥特曼在宇宙中发现了一个神秘的数字序列：2, 4, 8, 16, ?",
  "question": "下一个数字应该是什么？",
  "options": ["20", "24", "32", "64"],
  "correctAnswer": "C",
  "explanation": "这是一个等比数列，每个数字都是前一个数字的2倍",
  "hint": "观察每个数字之间的倍数关系"
}`,
        shouldPass: true
    },
    {
        name: 'Markdown代码块中的JSON',
        input: `\`\`\`json
{
  "story": "奥特曼遇到了图案序列：🔴🔵🔴🔵🔴",
  "question": "下一个图案应该是什么？",
  "options": ["🔴", "🔵", "🟡", "🟢"],
  "correctAnswer": "B",
  "explanation": "这是一个交替出现的模式",
  "hint": "观察颜色的交替规律"
}
\`\`\``,
        shouldPass: true
    },
    {
        name: '有效的文本格式',
        input: `故事：奥特曼在战斗中发现了一个逻辑谜题：如果A大于B，B大于C，那么A和C的关系是什么？
题目：根据给定条件，A和C的关系是？
选项A：A大于C
选项B：A小于C
选项C：A等于C
选项D：无法确定
正确答案：A
解题思路：根据传递性，如果A>B且B>C，那么A>C
提示：想想数学中的大小关系传递性`,
        shouldPass: true
    },
    {
        name: '缺少必需字段',
        input: `{
  "story": "奥特曼的故事",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "A"
}`,
        shouldPass: false,
        expectedError: '缺少或无效的题目字段'
    },
    {
        name: '无效的正确答案',
        input: `{
  "story": "奥特曼的故事",
  "question": "什么问题？",
  "options": ["选项1", "选项2", "选项3", "选项4"],
  "correctAnswer": "E"
}`,
        shouldPass: false,
        expectedError: '正确答案必须是A、B、C、D之一'
    },
    {
        name: '选项数量不足',
        input: `{
  "story": "奥特曼的故事",
  "question": "什么问题？",
  "options": ["选项1", "选项2"],
  "correctAnswer": "A"
}`,
        shouldPass: false,
        expectedError: '选项必须是包含4个元素的数组'
    }
];

// 运行测试
function runTests() {
    console.log('🧪 开始运行题目解析单元测试\n');
    
    const llm = new LLMIntegration();
    let passed = 0;
    let failed = 0;
    
    for (const testCase of testCases) {
        console.log(`\n📝 测试: ${testCase.name}`);
        console.log('─'.repeat(50));
        
        try {
            const result = llm.parseQuestionResponse(testCase.input);
            
            if (testCase.shouldPass) {
                // 验证解析结果的完整性
                if (result.story && result.question && result.options.length === 4 && result.correctAnswer) {
                    console.log('✅ 通过 - 成功解析题目');
                    console.log(`   故事: ${result.story.substring(0, 30)}...`);
                    console.log(`   题目: ${result.question.substring(0, 30)}...`);
                    console.log(`   答案: ${result.correctAnswer}`);
                    passed++;
                } else {
                    console.log('❌ 失败 - 解析结果不完整');
                    failed++;
                }
            } else {
                console.log('❌ 失败 - 测试应该失败但却成功了');
                failed++;
            }
        } catch (error) {
            if (testCase.shouldPass) {
                console.log(`❌ 失败 - 解析失败: ${error.message}`);
                failed++;
            } else {
                const expectedError = testCase.expectedError || '';
                const actualError = error.message;
                const errorMatches = !expectedError || actualError.includes(expectedError);
                
                if (errorMatches) {
                    console.log(`✅ 通过 - 正确捕获了预期错误: ${actualError}`);
                    passed++;
                } else {
                    console.log(`❌ 失败 - 错误信息不匹配`);
                    console.log(`   预期: "${expectedError}"`);
                    console.log(`   实际: "${actualError}"`);
                    failed++;
                }
            }
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试结果统计');
    console.log('='.repeat(60));
    console.log(`总测试数: ${passed + failed}`);
    console.log(`通过: ${passed}`);
    console.log(`失败: ${failed}`);
    console.log(`成功率: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 所有测试都通过了！');
        process.exit(0);
    } else {
        console.log('\n⚠️  有测试失败，请检查代码');
        process.exit(1);
    }
}

// 运行性能测试
function runPerformanceTest() {
    console.log('\n⚡ 运行性能测试');
    console.log('─'.repeat(30));
    
    const llm = new LLMIntegration();
    const testInput = testCases[0].input; // 使用第一个有效测试用例
    const iterations = 1000;
    
    const startTime = Date.now();
    for (let i = 0; i < iterations; i++) {
        llm.parseQuestionResponse(testInput);
    }
    const endTime = Date.now();
    
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    
    console.log(`${iterations}次解析总耗时: ${totalTime}ms`);
    console.log(`平均每次解析耗时: ${avgTime.toFixed(2)}ms`);
    
    if (avgTime < 5) {
        console.log('✅ 性能测试通过 (< 5ms per parse)');
    } else {
        console.log('⚠️  性能可能需要优化 (> 5ms per parse)');
    }
}

// 主程序
if (require.main === module) {
    runTests();
    runPerformanceTest();
}

module.exports = { LLMIntegration, testCases };
