// region Basic jQuery Settings

// Fading in on load
$(document).ready(function () {
    $(".stuff").fadeIn("slow");
});

// Menu Buttons link Settings
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

$("#quizlink").click(function () {
    $.when($(".stuff").fadeOut("slow")).done(function () {
        window.location.href = "/pages/quiz-page-for-meeting-the-criteria.html";
    });
});

// Quiz Start Button & Load Quiz JSON
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
// endregion

// region Variables
let slider = document.getElementById("questions"); // Slider for controlling the no. of questions
let shortAnswer = document.getElementById("SA"); // Short Answer Input Form
let multipleChoice = document.getElementById("MC"); // Multiple Choices Input Form
let questionText = document.getElementById("question"); // Text displaying the question
let endText = document.getElementById("endText"); // Text displaying final message
let textField = document.getElementById("textAnswer"); // Short Answer input
let quizField = document.getElementById("quiz"); // Quiz Field for Style
let nextButton = document.getElementById("next"); // Button going to the next Question
let previousButton = document.getElementById("previous"); // Button going to the previous Question
// Multiple Choice input
let a = document.getElementById("A");
let b = document.getElementById("B");
let c = document.getElementById("C");
let d = document.getElementById("D");
// Multiple Choice Labels
let aText = document.getElementById("AText");
let bText = document.getElementById("BText");
let cText = document.getElementById("CText");
let dText = document.getElementById("DText");
let questionNum; // No. of questions
let quizObj; // Object imported from JSON
let quizGiven = []; // List of questions randomly selected to question the user
let correctAnswers = []; // Correct Answers of the questions
let choices = []; // Temporary variable for randomizing Multiple Choices choices
let choicesData = []; // Variable for storing randomized choices
let currentQuestion; // Current Question that is displayed
let pos = -1; // Position of the Current Question inside given questions
let answers = []; // Answers user chose
let questionsCorrect = []; // List of determining if user for the questions got it correct or wrong
let quizEnd = false; // Boolean variable determining if the quiz ended
// endregion

// region Quiz Script
// region Early Settings
// If is in Quiz Page:
if (slider) {
    slider.addEventListener("input", updateText);
    updateText();
}

if (nextButton && previousButton) {
    nextButton.addEventListener("click", nextQuestion);
    previousButton
        .addEventListener("click", previousQuestion);
}

// Updating text to display no. of questions
function updateText() {
    questionNum = slider.value;
    document.getElementById("number").innerHTML = questionNum;
}

// Loading Quiz JSON file
function loadQuiz(json) {
    quizObj = String(json).replace(/\t/g, "");
    quizObj = String(quizObj).replace(/\n/g, "");
    quizObj = JSON.parse(quizObj);
    let numbers = [];
    // Randomizing Questions Given to User
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
                // Randomizing Multiple Choices
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
                // Storing question data
                correctAnswers.push(quizObj.quiz[randNum].answer);
                choicesData.push(choices);
                break;
            case "SA":
                correctAnswers.push(quizObj.quiz[randNum].answers);
                choicesData.push(null); // No choices in Short Answer questions
                break;
        }
    }
    // Start Quiz
    nextQuestion();
    $("#quizcontainer").fadeIn("slow");
}

// endregion

// region UI/UX
function updateUI() {
    // Resetting UI
    $("input").prop("checked", false);
    $("input").val("");
    currentQuestion = quizGiven[pos];
    switch (currentQuestion.type) {
        case "MC":
            // Updating Multiple Choice UI
            multipleChoice.style.display = "block";
            shortAnswer.style.display = "none";
            a.value = aText.innerHTML = choicesData[pos][0];
            b.value = bText.innerHTML = choicesData[pos][1];
            c.value = cText.innerHTML = choicesData[pos][2];
            d.value = dText.innerHTML = choicesData[pos][3];
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
                }
            }
            break;
        case "SA":
            // Updating Short Answers UI
            shortAnswer.style.display = "inline";
            multipleChoice.style.display = "none";
            if (answers[pos]) {
                textField.value = answers[pos];
            }
            break;
    }
    questionText.innerHTML = quizGiven[pos].question; // Updating question text
    // Indicating whether user got the question right or wrong
    if (quizEnd) {
        if (questionsCorrect[pos]) {
            quizField.style.border = "4px solid green";
        } else {
            quizField.style.border = "4px solid red";
        }
    }
}

// Going to the previous Question
function previousQuestion() {
    if (pos < 1) return;
    if (currentQuestion.type == "MC") {
        answers[pos] = $(
            "input[name='MultipleChoice']:checked",
            "#MC"
        ).val(); // Storing the user's answers
    } else if (currentQuestion.type == "SA") {
        answers[pos] = textField.value;
    }
    pos--;
    currentQuestion = quizGiven[pos];
    updateUI();
}

// Going to the next Question
function nextQuestion() {
    if (pos !== -1) {
        if (currentQuestion.type == "MC") {
            answers[pos] = $(
                "input[name='MultipleChoice']:checked",
                "#MC"
            ).val(); // Storing the user's answers
        } else if (currentQuestion.type == "SA") {
            answers[pos] = textField.value;
        }
    }
    pos++;
    if (pos == quizGiven.length) { // If quiz Ended
        if (quizEnd) {
            pos--;
        } else {
            checkQuiz();
        }
    } else {
        updateUI();
    }
}

// endregion

// region Later Processing
function checkQuiz() {
    // Checking answers of the quiz
    for (let i = 0; i < correctAnswers.length; i++) {
        if (typeof correctAnswers[i] == "string") {
            if (answers[i] == correctAnswers[i]) {
                questionsCorrect.push(true);
            } else {
                questionsCorrect.push(false);
            }
        } else if (typeof correctAnswers[i] == "object") {
            if (correctAnswers[i].includes(answers[i].toLowerCase())) {
                questionsCorrect.push(true);
            } else {
                questionsCorrect.push(false);
            }
        } else {
            alert("Unexpected Error. Please Reload.");
        }
    }
    let count = 0; // Counting how much questions the user got correct
    for (let i = 0; i < questionsCorrect.length; ++i) {
        if (questionsCorrect[i] == true) count++;
    }
    let message; // Message for finishing the quiz
    let result = Math.round((count / questionsCorrect.length) * 100);
    if (result < 20) {
        message = "I wrote 300 lines of JavaScript making this and how to you dare get this SCORE??";
    } else if (result < 40) {
        message = "Writing a whole page about me wasn't really helpful";
    } else if (result < 60) {
        message = "Better next time please";
    } else if (result < 80) {
        message = "Congrats";
    } else if (result < 90) {
        message = "Thank you";
    } else {
        message = "Woah...impressive! Congratulations";
    }
    endText.innerHTML = `${message}: ${count}/${questionsCorrect.length} (${result}%)`;
    // Disabling all inputs except buttons
    $(".choiceEl").attr("disabled", true);
    textField.readOnly = true;
    quizEnd = true; // Confirming the quiz has ended
    pos = 0;
    updateUI();
}

// endregion
// endregion

//region Collapsible Elements
// Collapsible Code by W3Schools
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
// endregion
