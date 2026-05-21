
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
let progress = circumference;
let intervalId = null;
let isRunning = false;

const hourWage = 15;
const price = 1;
const totalSeconds = price / (hourWage / 3600);

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    intervalId = setInterval(() => {
        progress -= (circumference / totalSeconds);
        circle.style.strokeDashoffset = progress;

        if (progress <= 0) {
            clearInterval(intervalId);
            isRunning = false;
        };
    }, 1000); // update per seconde
};

function pauseTimer() {
    if (isRunning == false) return;

    isRunning = false;
    clearInterval(intervalId);
};




