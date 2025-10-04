// LLM集成模块 - 与OpenRouter API交互
class LLMIntegration {
    constructor() {
        this.apiUrl = GameConfig.llmConfig.apiUrl;
        this.model = GameConfig.llmConfig.model;
        this.maxTokens = GameConfig.llmConfig.maxTokens;
        this.temperature = GameConfig.llmConfig.temperature;
        
        // 请求队列管理
        this.requestQueue = [];
        this.isProcessingQueue = false;
        this.lastRequestTime = 0;
        this.minRequestInterval = 1000; // 最小请求间隔1秒
    }

    // 生成题目
    async generateQuestion(questionType, difficulty, theme) {
        const prompt = this.buildQuestionPrompt(questionType, difficulty, theme);
        
        try {
            const response = await this.queuedAPICall(prompt);
            return this.parseQuestionResponse(response);
        } catch (error) {
            alert('LLM题目生成失败目:', error);
            // 返回备用题目而不是抛出异常
            return {}; // this.getFallbackQuestion(questionType, difficulty);
        }
    }

    // 获取备用题目
    getFallbackQuestion(questionType, difficulty) {
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
                }
            ],
            hard: [
                {
                    story: '奥特曼发现了一个复杂序列：1, 1, 2, 3, 5, 8, ?',
                    question: '下一个数字是什么？',
                    options: ['11', '13', '15', '17'],
                    correctAnswer: 'B',
                    hint: '观察每个数字与前两个数字的关系'
                }
            ]
        };
        
        const questions = fallbackQuestions[difficulty] || fallbackQuestions.easy;
        return questions[Math.floor(Math.random() * questions.length)];
    }

    // 生成提示
    async generateHint(questionType, question, options) {
        const prompt = this.buildHintPrompt(questionType, question, options);
        
        try {
            const response = await this.queuedAPICall(prompt);
            return this.parseHintResponse(response);
        } catch (error) {
            console.error('LLM提示生成失败:', error);
            return '仔细思考一下，你一定能找到答案！';
        }
    }

    // 生成能力分析报告
    async generateAnalysis(gameData) {
        const prompt = this.buildAnalysisPrompt(gameData);
        
        try {
            const response = await this.queuedAPICall(prompt);
            return this.parseAnalysisResponse(response);
        } catch (error) {
            console.error('LLM分析生成失败:', error);
            return this.getFallbackAnalysis(gameData);
        }
    }

    // 调用LLM API（带重试机制）
    async callLLM(prompt, retryCount = 0, maxRetries = 2) {
        const apiKey = this.getAPIKey();
        
        // 如果没有API密钥，直接抛出错误让调用方使用备用题目
        if (!apiKey || apiKey.length === 0) {
            throw new Error('未配置API密钥，使用备用题目');
        }
        
        try {
            const response = await fetch(`${this.apiUrl}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Ultraman Logic Game',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        // {
                        //     role: 'system',
                        //     content: '你是一位专业的儿童逻辑教育专家，擅长设计有趣的逻辑推理题目。'
                        // },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: this.maxTokens,
                    temperature: this.temperature
                })
            });

            if (!response.ok) {
                // 处理不同的HTTP错误状态码
                if (response.status === 429) {
                    // 429 Too Many Requests - 需要重试
                    if (retryCount < maxRetries) {
                        const waitTime = Math.min(30, Math.max(6, Math.pow(2, retryCount) * 1000)); // 指数退避：1s, 2s, 4s, 8, 但限制在6-30秒范围之内）
                        console.warn(`API请求频率过高 (429)，${waitTime/1000}秒后重试... (${retryCount + 1}/${maxRetries + 1})`);
                        await this.sleep(waitTime);
                        return await this.callLLM(prompt, retryCount + 1, maxRetries);
                    } else {
                        throw new Error(`API请求频率限制，已重试${maxRetries}次仍然失败`);
                    }
                } else if (response.status === 401) {
                    throw new Error('API密钥无效或已过期');
                } else if (response.status === 403) {
                    throw new Error('API访问被拒绝，请检查权限');
                } else if (response.status >= 500) {
                    // 服务器错误，可以重试
                    if (retryCount < maxRetries) {
                        const waitTime = (retryCount + 1) * 2000; // 2s, 4s, 6s
                        console.warn(`服务器错误 (${response.status})，${waitTime/1000}秒后重试... (${retryCount + 1}/${maxRetries + 1})`);
                        await this.sleep(waitTime);
                        return await this.callLLM(prompt, retryCount + 1, maxRetries);
                    } else {
                        throw new Error(`服务器错误 (${response.status})，已重试${maxRetries}次仍然失败`);
                    }
                } else {
                    throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            
            // 验证响应数据
            if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('API响应格式错误');
            }
            
            return data.choices[0].message.content;
            
        } catch (error) {
            // 网络错误或其他异常
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                if (retryCount < maxRetries) {
                    const waitTime = (retryCount + 1) * 1000; // 1s, 2s, 3s
                    console.warn(`网络错误，${waitTime/1000}秒后重试... (${retryCount + 1}/${maxRetries + 1})`);
                    await this.sleep(waitTime);
                    return await this.callLLM(prompt, retryCount + 1, maxRetries);
                }
            }
            throw error;
        }
    }
    
    // 延时函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 队列化的API调用
    async queuedAPICall(prompt) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                prompt,
                resolve,
                reject,
                timestamp: Date.now()
            });
            
            this.processQueue();
        });
    }
    
    // 处理请求队列
    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) {
            return;
        }
        
        this.isProcessingQueue = true;
        
        while (this.requestQueue.length > 0) {
            const request = this.requestQueue.shift();
            
            try {
                // 确保请求间隔
                const timeSinceLastRequest = Date.now() - this.lastRequestTime;
                if (timeSinceLastRequest < this.minRequestInterval) {
                    await this.sleep(this.minRequestInterval - timeSinceLastRequest);
                }
                
                console.log(`🔄 处理API请求队列，剩余 ${this.requestQueue.length} 个请求`);
                const result = await this.callLLM(request.prompt);
                this.lastRequestTime = Date.now();
                request.resolve(result);
                
            } catch (error) {
                request.reject(error);
            }
        }
        
        this.isProcessingQueue = false;
    }

    // 构建题目生成提示
    buildQuestionPrompt(questionType, difficulty, theme) {
        console.log('======== buildQuestionPrompt:  QuestionTemplates: ', QuestionTemplates);
        if (!QuestionTemplates || !QuestionTemplates.llmPrompts || !QuestionTemplates.llmPrompts.generateQuestion) {
            console.error('QuestionTemplates.llmPrompts.generateQuestion 未定义，使用默认提示');
            return `请为10岁儿童设计一道${difficulty}难度的${questionType}类型逻辑推理题，主题：${theme}`;
        }
        
        const template = QuestionTemplates.llmPrompts.generateQuestion;
        const Prompt = template
            .replace('{questionType}', questionType)
            .replace('{difficulty}', difficulty)
            .replace('{theme}', theme);
        console.log('LLMIntegration buildQuestionPrompt: ', Prompt);
        return Prompt;
    }

    // 构建提示生成提示
    buildHintPrompt(questionType, question, options) {
        if (!QuestionTemplates || !QuestionTemplates.llmPrompts || !QuestionTemplates.llmPrompts.generateHint) {
            console.error('QuestionTemplates.llmPrompts.generateHint 未定义，使用默认提示');
            return `请为这道${questionType}类型的题目生成提示：${question}，选项：${options.join(', ')}`;
        }
        
        const template = QuestionTemplates.llmPrompts.generateHint;
        const Prompt = template
            .replace('{questionType}', questionType)
            .replace('{question}', question)
            .replace('{options}', options.join(', '));
        console.log('LLMIntegration buildHintPrompt: ', Prompt);
        return Prompt;
    }

    // 构建分析提示
    buildAnalysisPrompt(gameData) {
        console.log('QuestionTemplates.llmPrompts: ', QuestionTemplates.llmPrompts);

        if (!QuestionTemplates || !QuestionTemplates.llmPrompts || !QuestionTemplates.llmPrompts.generateAnalysis) {
            console.error('QuestionTemplates.llmPrompts.generateAnalysis 未定义，使用默认提示');
            return `请分析以下游戏数据并生成能力报告：分数${gameData.score}，卡片${gameData.cards.length}张，平均时间${gameData.avgTime}秒，准确率${gameData.accuracy}%`;
        }
        
        const template = QuestionTemplates.llmPrompts.generateAnalysis;
        const Prompt = template
            .replace('{totalScore}', gameData.score)
            .replace('{cardCount}', gameData.cards.length)
            .replace('{avgTime}', gameData.avgTime)
            .replace('{accuracy}', gameData.accuracy)
            .replace('{difficulty}', gameData.difficulty)
            .replace('{answerHistory}', JSON.stringify(gameData.answers));

        console.log('LLMIntegration buildHintPrompt: ', Prompt);
        return Prompt;
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
            console.log('LLMIntegration parseQuestionResponse cleanResponse: ', cleanResponse);
            
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
            console.log('LLMIntegration parseQuestionResponse question: ', question);
            
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

    // 解析提示响应
    parseHintResponse(response) {
        return response.trim() || '仔细思考一下，你一定能找到答案！';
    }

    // 解析分析响应
    parseAnalysisResponse(response) {
        return response.trim() || this.getFallbackAnalysis({});
    }

    // 获取备用分析
    getFallbackAnalysis(gameData) {
        const accuracy = gameData.accuracy || 0;
        const score = gameData.score || 0;
        
        let analysis = '';
        
        if (accuracy >= 80) {
            analysis += '🎉 你的逻辑推理能力非常出色！能够快速准确地分析问题，找到正确答案。';
        } else if (accuracy >= 60) {
            analysis += '👍 你的逻辑推理能力不错！继续练习，相信你会越来越棒！';
        } else {
            analysis += '💪 虽然这次表现一般，但不要灰心！逻辑推理需要多练习，你一定能进步的！';
        }
        
        if (score >= 1000) {
            analysis += '\n\n🏆 你的总分很高，说明你不仅准确率高，而且答题速度也很快！';
        }
        
        analysis += '\n\n建议：\n- 多观察生活中的规律和模式\n- 练习数字序列和图形推理\n- 培养耐心和专注力\n- 保持积极的学习态度';
        
        return analysis;
    }

    // 获取API密钥
    getAPIKey() {
        // 优先从配置中获取API密钥
        if (GameConfig.llmConfig && GameConfig.llmConfig.apiKey) {
            return GameConfig.llmConfig.apiKey;
        }
        
        // 从localStorage获取用户设置的API密钥
        const savedKey = localStorage.getItem('openrouter_api_key');
        if (savedKey) {
            return savedKey;
        }
        
        // 使用默认的API密钥（免费版本）
        return '';
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LLMIntegration };
}
