//region Basic jQuery Settings
$(document).ready(function () {
    $(".stuff").fadeIn("slow");
});

$("#interestslink").click(function () {
    $.when($(".stuff").fadeOut("slow")).done(function () {
        window.location.href = "/pages/interests.html";
    });
});

$("#organizationslink").click(function () {
    $.when($(".stuff").fadeOut("slow")).done(function () {
        window.location.href = "/pages/organizations.html";
    });
});

$("#homelink").click(function () {
    $.when($("body").fadeOut("slow")).done(function () {
        window.location.href = "/index.html";
    });
});

$("#contactlink").click(function () {
    $.when($(".stuff").fadeOut("slow")).done(function () {
        window.location.href = "/pages/contact.html";
    });
});

$("#aboutlink").click(function () {
    $.when($(".stuff").fadeOut("slow")).done(function () {
        window.location.href = "/pages/about.html";
    });
});

$("#startButton").click(function () {
    $.when($(".stuff").fadeOut("slow")).done(function () {
        fetch("/resources/quiz.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((response) => response.text())
            .then((text) => loadQuiz(text));
    });
});
//endregion

//region Variables
let slider = document.getElementById("questions");
let shortAnswer = document.getElementById("SA");
let multipleChoice = document.getElementById("MC");
let questionText = document.getElementById("question");
let endText = document.getElementById("endText");
let textField = document.getElementById("textAnswer");
let answerField = document.getElementById("quiz");
let buttons = document.getElementById("buttons");
let nextButton = document.getElementById("next");
let previousButton = document.getElementById("previous");
let a = document.getElementById("A");
let b = document.getElementById("B");
let c = document.getElementById("C");
let d = document.getElementById("D");
let aText = document.getElementById("AText");
let bText = document.getElementById("BText");
let cText = document.getElementById("CText");
let dText = document.getElementById("DText");
let questionNum;
let quizObj;
let quizGiven = [];
let correctAnswers = [];
let choices = [];
let choicesData = [];
let currentQuestion;
let pos = -1;
let answers = [];
let questionsCorrect = [];
let quizEnd = false;
//endregion

//region Quiz Script
//region Early Settings
if (slider) {
    slider.addEventListener("input", updateText);
    updateText();
}

if (nextButton && previousButton) {
    nextButton.addEventListener("click", nextQuestion);
    previousButton
        .addEventListener("click", previousQuestion);
}

function updateText() {
    questionNum = slider.value;
    document.getElementById("number").innerHTML = questionNum;
}

function loadQuiz(json) {
    quizObj = String(json).replace(/\t/g, "");
    quizObj = String(quizObj).replace(/\n/g, "");
    quizObj = JSON.parse(quizObj);
    let numbers = [];
    for (let i = 0; i < questionNum; i++) {
        let randNum = Math.floor(Math.random() * quizObj.quiz.length);
        if (numbers.includes(randNum)) {
            i--;
            continue;
        }
        numbers.push(randNum);
        quizGiven.push(quizObj.quiz[randNum]);
        switch (quizObj.quiz[randNum].type) {
            case "MC":
                let numbers = [];
                choices = [];
                for (let j = 0; j < 4; j++) {
                    let randNum = Math.floor(Math.random() * 4);
                    if (numbers.includes(randNum)) {
                        j--;
                        continue;
                    }
                    numbers.push(randNum);
                    switch (j) {
                        case 0:
                            choices.push(quizGiven[i].choices[randNum]);
                            break;
                        case 1:
                            choices.push(quizGiven[i].choices[randNum]);
                            break;
                        case 2:
                            choices.push(quizGiven[i].choices[randNum]);
                            break;
                        case 3:
                            choices.push(quizGiven[i].choices[randNum]);
                            break;
                        default:
                            alert(
                                "OH NO WHY DID THIS HAPPEN??? PLEASE RELOAD :("
                            );
                    }
                }
                correctAnswers.push(quizObj.quiz[randNum].answer);
                choicesData.push(choices);
                break;
            case "SA":
                correctAnswers.push(quizObj.quiz[randNum].answers);
                choicesData.push(null);
                break;
            default:
                alert(
                    "There is an unvalid data in the JSON file. Please reload."
                );
        }
    }
    console.log(quizGiven);
    nextQuestion();
    $("#quizcontainer").fadeIn("slow");
}
//endregion

//region UI/UX
function updateUI() {
    $("input").prop("checked", false);
    $("input").val("");
    currentQuestion = quizGiven[pos];
    if (currentQuestion.type == "MC") {
        multipleChoice.style.display = "block";
        shortAnswer.style.display = "none";
        a.value = choicesData[pos][0];
        b.value = choicesData[pos][1];
        c.value = choicesData[pos][2];
        d.value = choicesData[pos][3];
        aText.innerHTML = choicesData[pos][0];
        bText.innerHTML = choicesData[pos][1];
        cText.innerHTML = choicesData[pos][2];
        dText.innerHTML = choicesData[pos][3];
        for (let i = 0; i < 4; i++) {
            switch (i) {
                case 0:
                    if (a.value == answers[pos]) {
                        $("#A").prop("checked", true);
                    }
                    break;
                case 1:
                    if (b.value == answers[pos]) {
                        $("#B").prop("checked", true);
                    }
                    break;
                case 2:
                    if (c.value == answers[pos]) {
                        $("#C").prop("checked", true);
                    }
                    break;
                case 3:
                    if (d.value == answers[pos]) {
                        $("#D").prop("checked", true);
                    }
                    break;
                default:
                    alert("This isn't supposed to happen. Please reload.");
            }
        }
    } else if (currentQuestion.type == "SA") {
        shortAnswer.style.display = "inline";
        multipleChoice.style.display = "none";
        if (answers[pos]) {
            textField.value = answers[pos];
        }
    }
    questionText.innerHTML = quizGiven[pos].question;
    if (quizEnd){
        if (questionsCorrect[pos]){
            answerField.style.border = "4px solid green";
        } else {
            answerField.style.border = "4px solid red";
        }
    }
}

function previousQuestion() {
    if (pos < 1) return;
    if (currentQuestion.type == "MC") {
        answers[pos] = $(
            "input[name='MultipleChoice']:checked",
            "#MC"
        ).val();
    } else if (currentQuestion.type == "SA") {
        answers[pos] = textField.value;
    }
    pos--;
    currentQuestion = quizGiven[pos];
    console.log(pos);
    updateUI();
}

function nextQuestion() {
    if (pos !== -1) {
        if (currentQuestion.type == "MC") {
            answers[pos] = $(
                "input[name='MultipleChoice']:checked",
                "#MC"
            ).val();
        } else if (currentQuestion.type == "SA") {
            answers[pos] = textField.value;
        }
    }
    pos++;
    console.log(pos);
    if (pos == quizGiven.length) {
        if (quizEnd) {
            pos--;
            console.log("quizEnd");
        } else {
            checkQuiz();
            console.log("checkQuiz");
        }
        return;
    } else {
        updateUI();
    }
}
//endregion

//region Later Processing
function checkQuiz() {
    for (let i = 0; i < correctAnswers.length; i++) {
        if (typeof correctAnswers[i] == "string") {
            if (answers[i] == correctAnswers[i]) {
                questionsCorrect.push(true);
            } else {
                questionsCorrect.push(false);
            }
        } else if (typeof correctAnswers[i] == "object") {
            if (correctAnswers[i].includes(answers[i].toLowerCase())) {
                console.log(answers[i].toLowerCase());
                questionsCorrect.push(true);
            } else {
                questionsCorrect.push(false);
            }
        } else {
            alert("Unexpected Error. Please Reload.");
        }
    }
    let count = 0;
    for (let i = 0; i < questionsCorrect.length; ++i) {
        if (questionsCorrect[i] == true) count++;
    }
    let message;
    let result = Math.round((count / questionsCorrect.length) * 100);
    if (result < 20){
        message = "I wrote 300 lines of JavaScript making this and how to you dare get this SCORE??";
    } else if (result < 40){
        message = "Please. You know my mom will get disappointed if she knows that not many people doesn't know about me.";
    } else if (result < 60){
        message = "Meh. You finished the test.";
    } else if (result < 80){
        message = "Congrats. You finished the test!";
    } else if (result < 90){
        message = "Thank you for recognizing my identity :)";
    } else {
        message = "Is finding out someone to the most secrets your hobby? Nice.";
    }
    endText.innerHTML = `${message}: ${count}/${questionsCorrect.length} (${result}%)`;
    multipleChoice.readOnly = true;
    $(".choiceEl").attr("disabled", true);
    textField.readOnly = true;
    quizEnd = true;
    pos = 0;
    updateUI();
}
//endregion
//endregion

//region Collapsible Elements
let coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}
//endregion
