/**
 * 题目逻辑模块
 * 包含题目生成、答案验证等相关功能
 */
class QuestionLogic {
    constructor(gameInstance) {
        this.game = gameInstance;
    }

    /**
     * 生成原始数学题目
     */
    generateRawQuestion() {
        let answer;
        let questionStr;
        let a, b;
        let isAddition;
        let isSubtraction;
        let isMultiplication;
        let isDivision;

        // 确定题目类型 - 根据启用的运算类型随机选择
        const availableTypes = [];
        if (this.game.enableAddition) availableTypes.push('addition');
        if (this.game.enableSubtraction) availableTypes.push('subtraction');
        if (this.game.enableMultiplication) availableTypes.push('multiplication');
        if (this.game.enableDivision) availableTypes.push('division');
        
        const operationType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        isAddition = operationType === 'addition';
        isSubtraction = operationType === 'subtraction';
        isMultiplication = operationType === 'multiplication';
        isDivision = operationType === 'division';

        if (isAddition) {
            // 加法逻辑
            const result = this.generateAdditionQuestion();
            a = result.a;
            b = result.b;
            answer = a + b;
            questionStr = `${a} + ${b} = ?`;
        } else if (isSubtraction) {
            // 减法逻辑
            const result = this.generateSubtractionQuestion();
            a = result.a;
            b = result.b;
            answer = a - b;
            questionStr = `${a} - ${b} = ?`;
        } else if (isMultiplication) {
            // 乘法逻辑
            const result = this.generateMultiplicationQuestion();
            a = result.a;
            b = result.b;
            answer = a * b;
            questionStr = `${a} × ${b} = ?`;
        } else if (isDivision) {
            // 除法逻辑（均为整除）
            const result = this.generateDivisionQuestion();
            a = result.a;
            b = result.b;
            answer = a / b;
            questionStr = `${a} ÷ ${b} = ?`;
        }
        
        return { answer, questionStr };
    }

    /**
     * 生成加法题目
     */
    generateAdditionQuestion() {
        let a, b;
        
        switch (this.game.additionMode) {
            case 'simple': // 个位数加法
                a = Math.floor(Math.random() * 9) + 1; // 1-9
                b = Math.floor(Math.random() * 9) + 1; // 1-9
                break;
            case 'carry': // 一定有进位的加法
                do {
                    a = Math.floor(Math.random() * 90) + 10;
                    b = Math.floor(Math.random() * 90) + 10;
                    // 检查是否有进位：个位数相加是否大于等于10
                } while ((a % 10) + (b % 10) < 10);
                break;
            case 'nocarry':  // 一定没有进位的加法
                const a1 = Math.floor(Math.random() * 9) + 1;
                const a2 = Math.floor(Math.random() * 10);
                const b1 = Math.floor(Math.random() * 9);
                const b2 = Math.floor(Math.random() * (9 - a2)) + 1; // skip 0
                a = a1 * 10 + a2;
                b = b1 * 10 + b2;
                break;
            case 'both':
            default: // 都可以 - 随机生成两位数加法
                a = Math.floor(Math.random() * 90) + 10;
                b = Math.floor(Math.random() * 90) + 10;
                break;
        }
        
        return { a, b };
    }

    /**
     * 生成减法题目
     */
    generateSubtractionQuestion() {
        let a, b;
        
        switch (this.game.subtractionMode) {
            case 'simple': // 小于20的减法
                // 1开头的减法并确保有借位
                // 0 ---- 9 10 -----18 19
                //          <-- a --->
                //            <--- b' --->  // a - 19之间的random，确保有借位。
                // b = b' - 10
                a = Math.floor(Math.random() * 8) + 11;           // 11-18
                b = 9 - Math.floor(Math.random() * (19 - a));     // 1-9
                break;
            case 'borrow': // 一定有借位的减法
                do {
                    a = Math.floor(Math.random() * 90) + 10;
                    b = Math.floor(Math.random() * (a - 1)) + 1; // 确保b不为0且小于a
                    // 检查是否有借位：被减数的个位数小于减数的个位数
                } while ((a % 10) >= (b % 10));
                break;
            case 'noborrow': // 一定没有借位的减法
                const a1 = Math.floor(Math.random() * 9) + 1;
                const a2 = Math.floor(Math.random() * 10);
                const b1 = Math.floor(Math.random() * a1);
                const b2 = Math.floor(Math.random() * a2);
                a = a1 * 10 + a2;
                b = b1 * 10 + b2;
                break;
            case 'both':
            default:  // 都可以 - 随机生成两位数减法
                a = Math.floor(Math.random() * 90) + 10;
                b = Math.floor(Math.random() * a) + 1; // 确保b < a
                break;
        }
        
        return { a, b };
    }

    /**
     * 生成乘法题目
     */
    generateMultiplicationQuestion() {
        let a, b;
        
        switch (this.game.multiplicationMode) {
            case 'single': // 一位数乘法(2以上)
                a = Math.floor(Math.random() * 8) + 2; // 2-9
                b = Math.floor(Math.random() * 8) + 2; // 2-9
                break;
            case 'two_one': // 两位数和一位数乘法(1以上)
                // 随机选择是两位数乘一位数还是一位数乘两位数
                if (Math.random() < 0.5) {
                    a = Math.floor(Math.random() * 89) + 11; // 10-99
                    b = Math.floor(Math.random() * 8) + 2;   // 2-9
                } else {
                    a = Math.floor(Math.random() * 8) + 2;   // 2-9
                    b = Math.floor(Math.random() * 89) + 11; // 10-99
                }
                break;
            case 'two': // 两位数乘法(11及以上)
                a = Math.floor(Math.random() * 89) + 11; // 11-99
                b = Math.floor(Math.random() * 89) + 11; // 11-99
                break;
            case 'both':
            default:
                a = Math.floor(Math.random() * 99) + 1; // 2-99
                b = Math.floor(Math.random() * 99) + 1; // 2-99
                break;
        }
        
        return { a, b };
    }

    /**
     * 生成除法题目
     */
    generateDivisionQuestion() {
        let a, b, quotient;
        
        switch (this.game.divisionMode) {
            case 'two_one': {
                // 两位数 ÷ 一位数（≥1），整除
                b = Math.floor(Math.random() * 8) + 2; // 2-9
                quotient = Math.floor(Math.random() * 8) + 2; // 2-9
                a = b * quotient; // 两位数
                break;
            }
            case 'three_one': {
                // 三位数 ÷ 一位数（除数>=2），整除
                b = Math.floor(Math.random() * 8) + 2; // 2-9
                const qMin = Math.ceil(100 / b);
                const qMax = Math.floor(999 / b);
                quotient = Math.floor(Math.random() * (qMax - qMin + 1)) + qMin;
                a = b * quotient; // 三位数
                break;
            }
            case 'three_two': {
                // 三位数 ÷ 两位数（除数≥11），整除
                b = Math.floor(Math.random() * 89) + 11; // 11-99
                const qMin = Math.ceil(100 / b);
                const qMax = Math.floor(999 / b);
                quotient = Math.floor(Math.random() * (qMax - qMin + 1)) + qMin;
                a = b * quotient; // 三位数
                break;
            }
            default: {
                // 默认情况
                b = Math.floor(Math.random() * 8) + 2;
                quotient = Math.floor(Math.random() * 8) + 2;
                a = b * quotient;
                break;
            }
        }
        
        return { a, b };
    }

    /**
     * 生成答案选项
     */
    generateAnswerOptions(correctAnswer) {
        const options = [correctAnswer];
        const usedOptions = new Set([correctAnswer]);
        
        // 生成相似的错误答案
        while (options.length < 3) {
            let wrongAnswer;
            const strategy = Math.random();
            
            if (strategy < 0.2) {
                // 策略1: ±1-3
                const diff = Math.floor(Math.random() * 3) + 1;
                wrongAnswer = correctAnswer + (Math.random() < 0.5 ? diff : -diff);
            } else if (strategy < 0.8) {
                // 策略2: ±10
                wrongAnswer = correctAnswer + (Math.random() < 0.5 ? 10 : -10);
            } else {
                // 策略3: 个位数变化
                const ones = correctAnswer % 10;
                const tens = Math.floor(correctAnswer / 10);
                const newOnes = (ones + Math.floor(Math.random() * 9) + 1) % 10;
                wrongAnswer = tens * 10 + newOnes;
            }
            
            // 确保答案合理且不重复
            if (wrongAnswer >= 0 && wrongAnswer <= 9999 && !usedOptions.has(wrongAnswer)) {
                options.push(wrongAnswer);
                usedOptions.add(wrongAnswer);
            }
        }
        
        // 随机打乱选项顺序
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        return options;
    }

    /**
     * 创建答案按钮DOM元素
     */
    createAnswerButtons(options) {
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn disabled';  // 初始禁用状态
            btn.disabled = true;  // 禁用按钮
            btn.onclick = () => this.game.checkAnswer(option);
            btn.setAttribute('data-answer', option);
            btn.setAttribute('data-key', index + 1);
            
            // 创建按钮内容容器
            const btnContent = document.createElement('div');
            btnContent.className = 'btn-content';
            
            // 创建快捷键提示
            const keyHint = document.createElement('span');
            keyHint.className = 'key-hint';
            keyHint.textContent = index + 1;
            
            // 创建答案文本
            const answerText = document.createElement('span');
            answerText.className = 'answer-text';
            answerText.textContent = option;
            
            btnContent.appendChild(keyHint);
            btnContent.appendChild(answerText);
            btn.appendChild(btnContent);
            
            optionsContainer.appendChild(btn);
        });
    }

    /**
     * 启用答案按钮
     */
    enableAnswerButtons() {
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('disabled');
        });
        
        // 移除倒计时提示
        const countdown = document.querySelector('.button-countdown');
        if (countdown) {
            countdown.remove();
        }
    }

    /**
     * 验证答案
     */
    validateAnswer(userAnswer, correctAnswer, timeLeft) {
        const isCorrect = userAnswer === correctAnswer && timeLeft > 0;
        return {
            isCorrect,
            userAnswer,
            correctAnswer
        };
    }

    /**
     * 处理答案反馈视觉效果
     */
    handleAnswerFeedback(userAnswer, correctAnswer) {
        // 获取所有答案按钮
        const buttons = document.querySelectorAll('.answer-btn');
        buttons.forEach(btn => {
            const btnAnswer = parseInt(btn.getAttribute('data-answer'));
            if (btnAnswer === userAnswer) {
                if (userAnswer === correctAnswer) {
                    btn.classList.add('correct-answer');
                } else {
                    btn.classList.add('wrong-answer');
                }
            }
        });
    }
}
