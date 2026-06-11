
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = circumference;

const inputPriceBox = document.querySelector("#input-price");
const inputWageBox = document.querySelector("#input-wage");
const playButton = document.querySelector(".play-button");
const tracker = document.querySelector(".card-tracker");

let price = "";
let hourWage = "";
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
        if (price === "" || hourWage === "") {
            return;
        } else {
            state = "play";
            playButton.textContent = "\u23F8";
            startTimer();
        };
    } else if (state === "play") {
        state = "pause";
        playButton.textContent = "\u25B6";
        pauseTimer();
    };
});

// modal

const openModalButtons = document.querySelectorAll("[data-modal-target]"); // as if there are more buttons to open modal
const closeModalButtons = document.querySelectorAll("[data-close-button]"); // as if there are more buttons to close modal
const overlay = document.getElementById("overlay");
const modalBody = document.querySelector(".modal-body");
let placeholderImg = document.querySelector(".icon-button");

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget) // will camelcase name for us. will get element with id #modal from html
        openModal(modal);
    });
});

overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
        closeModal(modal);
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
};

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
};

modalBody.addEventListener("click", (event) => {
    let targetIcon = event.target;
    placeholderImg.src = targetIcon.src;
    closeModal(modal);
});

// test clone node

const cardsBody = document.querySelector(".card-body");
const card = document.querySelector(".card");

for (i = 0; i < 5; i++) {
    const copyCard = card.cloneNode(true);
    cardsBody.appendChild(copyCard);
};






