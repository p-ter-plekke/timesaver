
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

const playButton = document.querySelector(".playbutton");
const pauseButton = document.querySelector(".pausebutton");
const hourWage = Number(document.querySelector("#inputwage").value);
const setWageButton = document.querySelector(".set-wage-button");

const delay = 1000;
let progress = circumference;
let intervalId = null;
let isRunning = false;

const price = 1;
const totalSeconds = price / (hourWage / 3600);

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    intervalId = setInterval(() => {
        progress -= (circumference / totalSeconds); // after needed time circle is fully visible
        circle.style.strokeDashoffset = progress; // the smaller progress the more you see the circle

        if (progress <= 0) {
            clearInterval(intervalId);
            isRunning = false;
        };
    }, delay); // update per second
};

function pauseTimer() {
    if (isRunning == false) return;

    isRunning = false;
    clearInterval(intervalId);
};

playButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);




