// start select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countDown");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
// end select elements

// start get data function
let question;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;
      // add spans function
      createBullets(questionsCount);

      // add questions to the page
      addQuestionsData(questionsObject[currentIndex], questionsCount);

      // count down timer
      countDown(60, questionsCount);
      // check if right answer
      submitButton.onclick = function () {
        question = questionsObject[currentIndex];
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        checkAnswer(theRightAnswer, questionsCount);
        currentIndex++;

        // remove all answers and question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionsData(questionsObject[currentIndex], questionsCount);

        handelBullets();

        // count down timer
        clearInterval(countDownInterval);
        countDown(60, questionsCount);

        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}
getQuestions();
// end get data function

// start create spans bullets function
function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    if (i === 0) {
      span.classList.add("on");
    }
    bulletsSpanContainer.appendChild(span);
  }
}
// end create spans bullets function

// start add questions data function
function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    // create the title for question
    let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(obj.title));
    quizArea.appendChild(questionTitle);

    // create the answers
    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.classList.add("answer");
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      
      if (i === 1) {
        radioInput.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.appendChild(document.createTextNode(obj[`answer_${i}`]));
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);
      answersArea.appendChild(mainDiv);
    }
  }
}
// end questions data function

// start check answer function
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  var theChosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChosenAnswer) {
    rightAnswers += 1;
  }
  // add all right answers to the page
  getAnswers(question, rAnswer, theChosenAnswer);
}
// end check answer function

// start handelBullets function
function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.classList.add("on");
    }
  });
}
// end handelBullets function

// start showResults function
function showResults(count) {
  let theResults;
  if (currentIndex == count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} form ${count}`;
    } else if (rightAnswers == count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers is good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} form ${count}`;
    }
    results.innerHTML = theResults;
    results.style.padding = "10px";
    results.style.backgroundColor = "white";
    results.style.marginTop = "10px";
    getQuestions();

    // add all right answers to the page
    addAnswers();
  }
}
// end showResults function

// start countDown timer
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
// end countDown timer

// start add all right answers to the page
let dataAnswers = [];

function getAnswers(question, rAnswer, chose) {
  let answer = {
    title: question.title,
    ra: rAnswer,
    ca: chose,
  };
  dataAnswers.push(answer);
}
function addAnswers() {
  for (let i = 0; i < dataAnswers.length; i++) {
    let div = document.createElement("div");

    let title = document.createElement("h2");
    title.appendChild(document.createTextNode(dataAnswers[i].title));

    let rightAnswer = document.createElement("p");
    rightAnswer.style.marginTop = "10px";
    rightAnswer.style.fontSize = "20px";
    rightAnswer.style.padding = "10px";
    rightAnswer.style.border = "3px solid green";
    rightAnswer.appendChild(document.createTextNode(dataAnswers[i].ra));

    let chosenAnswer = document.createElement("p");
    chosenAnswer.style.marginTop = "10px";
    chosenAnswer.style.fontSize = "20px";
    chosenAnswer.style.padding = "10px";
    chosenAnswer.style.border = "3px solid red";
    chosenAnswer.appendChild(document.createTextNode(dataAnswers[i].ca));

    div.appendChild(title);
    if (dataAnswers[i].ca != dataAnswers[i].ra) {
      div.appendChild(chosenAnswer);
    }
    div.appendChild(rightAnswer);

    div.style.padding = "10px";
    div.style.margin = "10px 0";
    div.style.backgroundColor = "#eee";

    results.appendChild(div);
  }
}
// end add all right answers to the page
