
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
let progress = circumference;

const interval = setInterval(() => {
    progress -= 1;
    circle.style.strokeDashoffset = progress;

    if (progress <= 0) {
        clearInterval(interval);
    }
}, 10);

