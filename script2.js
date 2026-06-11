let cardStates = {};

// get hourly wage
const inputHourlyWage = document.querySelector("[data-input-wage]");

inputHourlyWage.addEventListener("input", () => {
    hourlyWage = Number(inputHourlyWage.value);
    // calcMinutes();
    // updateTimers();
});

// get input price (per card)
const inputPrices = document.querySelectorAll("[data-input-price]");

inputPrices.forEach(inputPrice => {
    inputPrice.addEventListener("input", (event) => {
        const targetInputPrice = event.target;
        const priceInput = Number(targetInputPrice.value);
        const priceCard = targetInputPrice.closest("[data-card]");
        const priceId = priceCard.getAttribute("id");
        cardStates[priceId].price = priceInput;
    });
    // calcMinutes();
    // updateTimers();
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
        state: pause,
        price: 0,
        icon: null,
        totalMinutes: 0,
        progress: 0,
        elapsedSeconds: 0,
        secondsLeft: 0,
        minLeft: 0,
    };
});

// alle buttons werkend maken:
const playButtons = document.querySelectorAll("[data-play-button]");

playButtons.forEach(playButton => {
    playButton.addEventListener("click", (event) => {
        targetPlayButton = event.target;
        const playCard = targetPlayButton.closest("[data-card]");
        // startTimer runt op playCard.
    });
});

function calcMinutes(cardId) {
    cardStates[cardId].totalMinutes = Math.round(cardStates[cardId].price / (hourlyWage / 60));
};

function updateTimers(cardId) {
    const timerCard = document.getElementById(cardId);
    const timerTarget = timerCard.querySelector("[data-card-tracker]");
    timerTarget.textContent = `${minLeft}m left`;
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

// functie bij toevoegen kaart die 1x wordt toegepast?