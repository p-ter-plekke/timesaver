
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

const inputPriceBox = document.querySelector("#inputprice");
const setPriceButton = document.querySelector(".set-price-button");
const inputWageBox = document.querySelector("#inputwage");
const setWageButton = document.querySelector(".set-wage-button");
const playButton = document.querySelector(".playbutton");
const pauseButton = document.querySelector(".pausebutton");
let goalTimer = document.querySelector("#goal-timer");

let price = 0;
let hourWage = 0;
let totalMinutes = 0;
const delay = 1000;
let progress = circumference;
let intervalId = null;
let isRunning = false;

setPriceButton.addEventListener("click", () => {
    price = Number(inputPriceBox.value);
    calcMinutes();
    updateTimers();
});

setWageButton.addEventListener("click", () => {
    hourWage = Number(inputWageBox.value);
    calcMinutes();
    updateTimers();
});

function calcMinutes() {
    totalMinutes = price / (hourWage / 60);
};

function updateTimers() {
    goalTimer.textContent = totalMinutes;
};

function startTimer() {
    if (isRunning) return;

    isRunning = true;

    intervalId = setInterval(() => {
        progress -= (circumference / (totalMinutes * 60)); // after needed time circle is fully visible
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




