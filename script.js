
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

const inputPriceBox = document.querySelector("#inputprice");
const inputWageBox = document.querySelector("#inputwage");
const playButton = document.querySelector(".playbutton");
const pauseButton = document.querySelector(".pausebutton");
const tracker = document.querySelector(".cardtracker");

let price = 0;
let hourWage = 0;
let totalMinutes = 0;
let elapsedSeconds = 0;
let minLeft = 0;
const delay = 1000;
let progress = circumference;
let intervalId = null;
let isRunning = false;
let state = "pause";

inputPriceBox.addEventListener("input", () => {
    price = Number(inputPriceBox.value);
    calcMinutes();
    updateTimers();
});

inputWageBox.addEventListener("input", () => {
    hourWage = Number(inputWageBox.value);
    calcMinutes();
    updateTimers();
});

function calcMinutes() {
    totalMinutes = Math.round(price / (hourWage / 60));
};

function updateTimers() {
    tracker.textContent = `${minLeft}m left`;
};

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    intervalId = setInterval(() => {
        elapsedSeconds++;
        progress -= (circumference / (totalMinutes * 60)); // after needed time circle is fully visible
        circle.style.strokeDashoffset = progress; // the smaller progress the more you see the circle

        const secondsLeft = (totalMinutes * 60) - elapsedSeconds;
        minLeft = Math.ceil(secondsLeft / 60);
        updateTimers();

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

playButton.addEventListener("click", () => {
    if (state === "pause") {
        state = "play";
        startTimer();
    } else if (state === "play") {
        state = "pause";
        pauseTimer();
    };
});




