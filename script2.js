let cardStates = {};
const circle = document.querySelector(".circle-ring");
const circumference = 2 * Math.PI * Number(circle.getAttribute("r"));

// get hourly wage
const inputHourlyWage = document.querySelector("[data-input-wage]");

inputHourlyWage.addEventListener("input", () => {
    hourlyWage = Number(inputHourlyWage.value);
});

const plusButton = document.querySelector("[data-plus-button]")
const cardBody = document.querySelector("[data-card-body]");
const card = document.querySelector("[data-card]");
let newId = 0;

// add new card
plusButton.addEventListener("click", () => {
    const newCard = card.cloneNode(true);
    newId += 1;
    newIdString = newId.toString();
    newCard.setAttribute("id", newIdString);
    cardBody.appendChild(newCard);

    cardStates[newIdString] = {
        isRunning: false,
        intervalId: null,
        state: "pause",
        price: 0,
        icon: null,
        totalMinutes: 0,
        progress: 0,
        elapsedSeconds: 0,
        secondsLeft: 0,
        minLeft: 0,
    };

    // van newCard wil ik de circle vinden.
    const newCardCircle = newCard.querySelector("[data-circle-ring]");
    newCardCircle.style.strokeDasharray = circumference;
    newCardCircle.style.strokeDashoffset = circumference;
});

cardBody.addEventListener("click", (event) => {
    const playButton = event.target.closest("[data-play-button]");
    if (!playButton) return;
    const card = playButton.closest("[data-card]");
    startTimer(card.getAttribute("id"));
});

function calcMinutes(cardId) {
    cardStates[cardId].totalMinutes = Math.round(cardStates[cardId].price / (hourlyWage / 60));
};

function updateTimers(cardId) {
    const timerCard = document.getElementById(cardId);
    const timerTarget = timerCard.querySelector("[data-card-tracker]");
    timerTarget.textContent = `${cardStates[cardId].minLeft}m left`;
};

function startTimer(cardId) {

    const thisCard = document.getElementById(cardId);
    const thisCircle = thisCard.querySelector("[data-circle-ring]");

    if (cardStates[cardId].isRunning) return;

    cardStates[cardId].isRunning = true;

    cardStates[cardId].intervalId = setInterval(() => {
        cardStates[cardId].elapsedSeconds++;
        cardStates[cardId].progress -= (circumference / (cardStates[cardId].totalMinutes * 60)); // after needed time circle is fully visible
        thisCircle.style.strokeDashoffset = cardStates[cardId].progress; // the smaller progress the more you see the circle

        const secondsLeft = (cardStates[cardId].totalMinutes * 60) - cardStates[cardId].elapsedSeconds;
        cardStates[cardId].minLeft = Math.ceil(secondsLeft / 60);
        updateTimers(cardId);

        if (cardStates[cardId].progress <= 0) {
            clearInterval(cardStates[cardId].intervalId);
            cardStates[cardId].isRunning = false;
        };
    }, 1000); // update per second
};

// functie bij toevoegen kaart die 1x wordt toegepast?