// Данные тестов
const testData = {
    "1": {
        title: "Введение в Linux",
        modules: {
            "1-1": {
                title: "Что такое Linux",
                questions: [
                    {
                        question: "Что такое операционная система?",
                        options: [
                            "Программа, предоставляющая пользователю интерфейс для управления файловой системой и запуска приложений",
                            "Комплекс программ, управляющих аппаратными и программными ресурсами компьютера",
                            "Набор драйверов для подключения устройств",
                            "Платформа для разработки и выполнения прикладного программного обеспечения"
                        ],
                        correct: 1,
                        topic: "Основы операционных систем",
                        explanation: {
                            correct: "Вариант Б — операционная система это комплекс программ, который управляет аппаратными ресурсами компьютера (процессор, память, диски) и обеспечивает платформу для выполнения прикладных программ.",
                            incorrect: [
                                "Вариант А — Описывает компонент ОС (например, проводник или оболочку), но не всю систему.",
                                "Вариант В — драйверы лишь часть операционной системы",
                                "Вариант Г — ОС предоставляет среду для разработки и выполнения ПО, но сама не является платформой разработки (как, например, IDE или фреймворк)."
                            ]
                        }
                    },
                    {
                        question: "Какая из перечисленных операционных систем является Unix-подобной?",
                        options: [
                            "Windows",
                            "macOS",
                            "DOS",
                            "Все перечисленные"
                        ],
                        correct: 1,
                        topic: "Unix-подобные системы",
                        explanation: {
                            correct: "macOS — это Unix-подобная операционная система, основанная на Darwin (BSD).",
                            incorrect: [
                                "Windows — это собственная ОС от Microsoft, не основанная на Unix.",
                                "DOS — это старая дисковая операционная система, не связанная с Unix.",
                                "Не все перечисленные системы являются Unix-подобными."
                            ]
                        }
                    }
                ]
            },
            "1-2": {
                title: "Конфигурация",
                questions: [
                    {
                        question: "Что такое конфигурационный файл в Linux?",
                        options: [
                            "Файл с расширением .exe",
                            "Текстовый файл с настройками программы или системы",
                            "Бинарный файл с исполняемым кодом",
                            "Файл с изображениями"
                        ],
                        correct: 1,
                        topic: "Конфигурационные файлы Linux",
                        explanation: {
                            correct: "Конфигурационные файлы в Linux — это текстовые файлы, содержащие настройки программ и системных компонентов.",
                            incorrect: [
                                "Файлы .exe — это исполняемые файлы Windows, не используемые в Linux.",
                                "Бинарные файлы содержат машинный код, а не настройки.",
                                "Файлы с изображениями не являются конфигурационными."
                            ]
                        }
                    }
                ]
            }
        }
    },
    "2": {
        title: "Основы командной строки",
        modules: {
            "2-1": {
                title: "Базовые команды",
                questions: [
                    {
                        question: "Какая команда используется для просмотра содержимого директории?",
                        options: [
                            "cat",
                            "ls",
                            "cd",
                            "pwd"
                        ],
                        correct: 1,
                        topic: "Базовые команды Linux",
                        explanation: {
                            correct: "Команда ls используется для просмотра содержимого директории.",
                            incorrect: [
                                "cat — команда для просмотра содержимого файлов.",
                                "cd — команда для смены директории.",
                                "pwd — команда для показа текущего пути."
                            ]
                        }
                    }
                ]
            }
        }
    }
};

// Глобальные переменные
let currentTopic = null;
let currentModule = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let currentQuestions = [];

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Добавляем обработчики для кнопок тем
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic');
            showModules(topicId);
        });
    });
}

function showModules(topicId) {
    currentTopic = topicId;
    const topic = testData[topicId];
    
    if (!topic) {
        alert('Данные для этой темы пока не загружены');
        return;
    }
    
    const mainContent = document.getElementById('main-content');
    let modulesHTML = `
        <button class="back-btn" onclick="showHome()">← Назад к темам</button>
        <h2>${topic.title}</h2>
        <div class="modules-grid">
    `;
    
    Object.keys(topic.modules).forEach(moduleId => {
        const module = topic.modules[moduleId];
        modulesHTML += `
            <button class="module-btn" data-module="${moduleId}">
                Модуль ${moduleId}. ${module.title}
            </button>
        `;
    });
    
    modulesHTML += '</div>';
    mainContent.innerHTML = modulesHTML;
    
    // Добавляем обработчики для кнопок модулей
    document.querySelectorAll('.module-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            startQuiz(topicId, moduleId);
        });
    });
}

function startQuiz(topicId, moduleId) {
    currentModule = moduleId;
    currentQuestionIndex = 0;
    userAnswers = [];
    
    const topic = testData[topicId];
    const module = topic.modules[moduleId];
    currentQuestions = module.questions;
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalResults();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    const mainContent = document.getElementById('main-content');
    
    let questionHTML = `
        <button class="back-btn" onclick="showModules('${currentTopic}')">← Назад к модулям</button>
        <div class="quiz-container">
            <h3 class="question">${currentQuestionIndex + 1}. ${question.question}</h3>
            <div class="options">
    `;
    
    const options = ['А', 'Б', 'В', 'Г'];
    question.options.forEach((option, index) => {
        questionHTML += `
            <label class="option">
                <input type="radio" name="answer" value="${index}">
                ${options[index]}: ${option}
            </label>
        `;
    });
    
    questionHTML += `
            </div>
            <button class="check-btn" onclick="checkAnswer()">Проверить ответ</button>
        </div>
    `;
    
    mainContent.innerHTML = questionHTML;
    
    // Добавляем обработчики для выбора ответов
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            this.closest('.option').classList.add('selected');
        });
    });
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedAnswer) {
        alert('Пожалуйста, выберите ответ');
        return;
    }
    
    const userAnswer = parseInt(selectedAnswer.value);
    const question = currentQuestions[currentQuestionIndex];
    const isCorrect = userAnswer === question.correct;
    
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        userAnswer: userAnswer,
        correct: isCorrect,
        topic: question.topic
    });
    
    showResult(isCorrect, question, userAnswer);
}

function showResult(isCorrect, question, userAnswer) {
    const quizContainer = document.querySelector('.quiz-container');
    const options = ['А', 'Б', 'В', 'Г'];
    
    let resultHTML = `
        <div class="result ${isCorrect ? 'correct' : 'incorrect'}">
            <h4>${isCorrect ? '✅ Правильно!' : '❌ Неправильно!'}</h4>
            <p><strong>Результат:</strong></p>
            <p>${isCorrect ? '✅ Правильный ответ!' : `❌ Правильный ответ: ${options[question.correct]}!`}</p>
            
            <div class="explanation">
                <p><strong>Объяснение:</strong></p>
                <p class="correct-option">✅ ${options[question.correct]}: ${question.explanation.correct}</p>
    `;
    
    question.explanation.incorrect.forEach((explanation, index) => {
        const optionIndex = index < question.correct ? index : index + 1;
        resultHTML += `<p class="incorrect-option">❌ ${options[optionIndex]}: ${explanation}</p>`;
    });
    
    resultHTML += `
            </div>
        </div>
        <button class="next-btn" onclick="nextQuestion()">${currentQuestionIndex + 1 >= currentQuestions.length ? 'Завершить тест' : 'Следующий вопрос'}</button>
    `;
    
    quizContainer.innerHTML += resultHTML;
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function showFinalResults() {
    const correctAnswers = userAnswers.filter(answer => answer.correct).length;
    const totalQuestions = currentQuestions.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Получаем темы для изучения (неправильные ответы)
    const incorrectAnswers = userAnswers.filter(answer => !answer.correct);
    const topicsToStudy = [...new Set(incorrectAnswers.map(answer => answer.topic))];
    
    const mainContent = document.getElementById('main-content');
    let resultsHTML = `
        <div class="final-result">
            <h2>Тест завершен!</h2>
            <div class="score">Правильных ответов: ${correctAnswers} из ${totalQuestions}</div>
            <div class="percentage">${percentage}%</div>
    `;
    
    if (topicsToStudy.length > 0) {
        resultsHTML += `
            <div class="topics-to-study">
                <h3>Темы для дополнительного изучения:</h3>
                <ul class="topics-list">
        `;
        
        topicsToStudy.forEach(topic => {
            resultsHTML += `<li>${topic}</li>`;
        });
        
        resultsHTML += `
                </ul>
            </div>
        `;
    }
    
    resultsHTML += `
            <button class="home-btn" onclick="showHome()">Вернуться на главную</button>
        </div>
    `;
    
    mainContent.innerHTML = resultsHTML;
}

function showHome() {
    currentTopic = null;
    currentModule = null;
    currentQuestionIndex = 0;
    userAnswers = [];
    currentQuestions = [];
    
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="topics-grid">
            <button class="topic-btn" data-topic="1">1. Введение в Linux</button>
            <button class="topic-btn" data-topic="2">2. Основы командной строки</button>
            <button class="topic-btn" data-topic="3">3. Файловая система</button>
            <button class="topic-btn" data-topic="4">4. Управление процессами</button>
            <button class="topic-btn" data-topic="5">5. Сетевые настройки</button>
            <button class="topic-btn" data-topic="6">6. Безопасность</button>
            <button class="topic-btn" data-topic="7">7. Установка программ</button>
            <button class="topic-btn" data-topic="8">8. Администрирование</button>
        </div>
    `;
    
    // Повторно добавляем обработчики
    document.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic');
            showModules(topicId);
        });
    });
} 