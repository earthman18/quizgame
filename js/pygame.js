const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

let questions = [];

fetch('pythonquestions.json')
	.then((res) => {
		return res.json();
	})
	.then((loadedQuestions) => {
		questions = loadedQuestions;
		startGame();
	})
	.catch((err) => {
		console.error(err);
	});

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
	questionCounter = 0;
	score = 0;
	availableQuesions = [ ...questions ];
	getNewQuestion();
	game.classList.remove('hidden');
	loader.classList.add('hidden');
};

getNewQuestion = () => {
	if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
		localStorage.setItem('mostRecentScore', score);
		//go to the end page
		return window.location.assign('/end.html');
	}
	questionCounter++;
	progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
	//Update the progress bar
	progressBarFull.style.width = `${questionCounter / MAX_QUESTIONS * 100}%`;

	const questionIndex = Math.floor(Math.random() * availableQuesions.length);
	currentQuestion = availableQuesions[questionIndex];
	question.innerText = currentQuestion.question;

	choices.forEach((choice) => {
		const number = choice.dataset['number'];
		choice.innerText = currentQuestion['choice' + number];
	});

	availableQuesions.splice(questionIndex, 1);
	acceptingAnswers = true;
};

choices.forEach((choice) => {
	choice.addEventListener('click', (e) => {
		if (!acceptingAnswers) return;

		acceptingAnswers = false;
		const selectedChoice = e.target;
		const selectedAnswer = selectedChoice.dataset['number'];

		const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

		if (classToApply === 'correct') {
			incrementScore(CORRECT_BONUS);
		}
        else {

        }

		selectedChoice.parentElement.classList.add(classToApply);

		setTimeout(() => {
			selectedChoice.parentElement.classList.remove(classToApply);
			getNewQuestion();
		}, 1000);
	});
});

function showNewQuestion(){
	const answer = document.getElementById('answer-container');
	if (answer.style.display === 'none') {
		answer.style.display = 'flex';
	} else {
		answer.style.display = 'none';
	}
}

incrementScore = (num) => {
	score += num;
	scoreText.innerText = score;
};