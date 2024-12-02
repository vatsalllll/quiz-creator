const setupSection = document.getElementById("setup-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const numQuestionsInput = document.getElementById("num-questions");
const createQuizBtn = document.getElementById("create-quiz");
const questionSetupDiv = document.getElementById("question-setup");
const questionDisplay = document.getElementById("question-display");
const timerDisplay = document.getElementById("timer");
const submitAnswerBtn = document.getElementById("submit-answer");
const scoreDisplay = document.getElementById("score-display");
const highScoreDisplay = document.getElementById("high-score-display");
const restartQuizBtn = document.getElementById("restart-quiz");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timePerQuestion = 10;

createQuizBtn.addEventListener("click", function () {
  questionSetupDiv.innerHTML = "";
  const numQuestions = parseInt(numQuestionsInput.value);
  if (!numQuestions || numQuestions <= 0)
    return alert("Enter a valid number of questions.");

  for (let i = 0; i < numQuestions; i++) {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
      <label>Question ${i + 1}:</label>
      <input type="text" class="question-text" placeholder="Enter question" required>
      <label>Choices (comma separated):</label>
      <input type="text" class="question-choices" placeholder="e.g., Option-1, Option-2, Option-3, Option-4" required>
      <label>Correct Answer:</label>
      <input type="text" class="question-answer" placeholder="Enter correct answer" required>
    `;
    questionSetupDiv.appendChild(questionDiv);
  }

  const finishSetupBtn = document.createElement("button");
  finishSetupBtn.textContent = "Finish Setup";
  finishSetupBtn.addEventListener("click", finishSetup);
  questionSetupDiv.appendChild(finishSetupBtn);
});

function finishSetup() {
  questions = [];
  const questionTexts = document.querySelectorAll(".question-text");
  const questionChoices = document.querySelectorAll(".question-choices");
  const questionAnswers = document.querySelectorAll(".question-answer");

  for (let i = 0; i < questionTexts.length; i++) {
    const text = questionTexts[i].value;
    const choices = questionChoices[i].value
      .split(",")
      .map((choice) => choice.trim());
    const answer = questionAnswers[i].value.trim();

    if (!text || choices.length < 2 || !answer)
      return alert("Please fill in all fields correctly.");

    questions.push({ text, choices, answer });
  }

  questions = questions.sort(() => Math.random() - 0.5);
  for (let q of questions) {
    q.choices = q.choices.sort(() => Math.random() - 0.5);
  }

  startQuiz();
}

function startQuiz() {
  setupSection.classList.add("hidden");
  quizSection.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) return endQuiz();

  const currentQuestion = questions[currentQuestionIndex];
  questionDisplay.innerHTML = `<p>${currentQuestion.text}</p>`;
  currentQuestion.choices.forEach((choice) => {
    const choiceBtn = document.createElement("button");
    choiceBtn.textContent = choice;
    choiceBtn.addEventListener("click", () => checkAnswer(choice));
    questionDisplay.appendChild(choiceBtn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  let timeLeft = timePerQuestion;
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer(choice) {
  if (choice === questions[currentQuestionIndex].answer) score++;
  nextQuestion();
}

function nextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

function endQuiz() {
  clearInterval(timer);
  quizSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
  scoreDisplay.textContent = `You scored: ${score} / ${questions.length}`;

  const highScore = Math.max(
    score,
    parseInt(localStorage.getItem("highScore") || "0")
  );
  localStorage.setItem("highScore", highScore);
  highScoreDisplay.textContent = `High Score: ${highScore}`;
}

restartQuizBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  setupSection.classList.remove("hidden");
});
