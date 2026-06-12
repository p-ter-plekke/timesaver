
// get hourly wage
const inputHourlyWage = document.querySelector("[data-input-wage]");
let hourlyWage = 0;

inputHourlyWage.addEventListener("input", () => {
    hourlyWage = Number(inputHourlyWage.value);
});

const plusButton = document.querySelector("[data-plus-button]")
const cardBody = document.querySelector("[data-card-body]");
const card = document.querySelector("[data-card]");
const templateCircle = document.querySelector("[data-circle-ring]");
const circumference = 2 * Math.PI * Number(templateCircle.getAttribute("r"));
let newId = 0;

templateCircle.style.strokeDasharray = circumference;
templateCircle.style.strokeDashoffset = circumference;

let cardStates = {
    0: {
        isRunning: false,
        intervalId: null,
        state: "pause",
        price: 0,
        icon: null,
        totalMinutes: 0,
        progress: circumference,
        elapsedSeconds: 0,
        secondsLeft: 0,
        minLeft: 0,
    },
};

// add new card
plusButton.addEventListener("click", () => {
    const newCard = card.cloneNode(true);
    newId += 1;
    newIdString = `card-${newId.toString()}`;
    newCard.setAttribute("id", newIdString);
    cardBody.appendChild(newCard);

    cardStates[newIdString] = {
        isRunning: false,
        intervalId: null,
        price: 0,
        icon: null,
        totalMinutes: 0,
        progress: circumference,
        elapsedSeconds: 0,
        secondsLeft: 0,
        minLeft: 0,
    };

    const newCardCircle = newCard.querySelector("[data-circle-ring]");
    newCardCircle.style.strokeDasharray = circumference;
    newCardCircle.style.strokeDashoffset = circumference;
});

cardBody.addEventListener("input", (event) => {
    const priceInput = event.target.closest("[data-input-price]");
    if (!priceInput) return;
    const priceCard = priceInput.closest("[data-card]");
    const priceCardId = priceCard.getAttribute("id");

    cardStates[priceCardId].price = Number(priceInput.value);
});

cardBody.addEventListener("click", (event) => {
    const playButton = event.target.closest("[data-play-button]");
    if (!playButton) return;
    const playCard = playButton.closest("[data-card]");
    const playCardId = playCard.getAttribute("id");

    if (cardStates[playCardId].isRunning == false) {
        if (cardStates[playCardId].price === "" || hourlyWage === "") {
            return;
        } else {
            playButton.textContent = "\u23F8";
            startTimer(playCardId);
        };
    } else if (cardStates[playCardId].isRunning) {
        playButton.textContent = "\u25B6";
        pauseTimer(playCardId);
    };
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

    calcMinutes(cardId);

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

function pauseTimer(cardId) {
    if (cardStates[cardId].isRunning == false) return;

    clearInterval(cardStates[cardId].intervalId);
    cardStates[cardId].isRunning = false;
};

// remove card
cardBody.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-button]");
    if (!deleteButton) return;
    const deleteCard = deleteButton.closest("[data-card]");
    const deleteCardId = deleteCard.getAttribute("id");

    deleteCard.replaceChildren();
    deleteCard.remove();
    delete cardStates[deleteCardId];
});

// modal icon picker

