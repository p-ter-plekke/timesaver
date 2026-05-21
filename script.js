
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
let progress = circumference;
const hourWage = 5;
const price = 1;
const totalSeconds = price / (hourWage / 3600);

const interval = setInterval(() => {
    progress -= (circumference / totalSeconds);
    circle.style.strokeDashoffset = progress;

    if (progress <= 0) {
        clearInterval(interval);
    }
}, 1000); // update per seconde



