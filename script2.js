
// get hourly wage
const inputHourlyWage = document.querySelector("[data-input-wage]");
let hourlyWage = "";

inputHourlyWage.addEventListener("input", () => {
    hourlyWage = Number(inputHourlyWage.value);
});

const cardTemplate = document.getElementById("card-template");
const templateCircle = cardTemplate.querySelector("[data-circle-ring]");
const cardVisible = document.getElementById("card-0");
const visibleCircle = cardVisible.querySelector("[data-circle-ring");

const circumference = 2 * Math.PI * Number(templateCircle.getAttribute("r"));

const plusButton = document.querySelector("[data-plus-button]")
const cardBody = document.querySelector("[data-card-body]");
let newId = 0;

templateCircle.style.strokeDasharray = circumference;
templateCircle.style.strokeDashoffset = circumference;
visibleCircle.style.strokeDasharray = circumference;
visibleCircle.style.strokeDashoffset = circumference;

let cardStates = {
    "card-0": {
        isRunning: false,
        hasStarted: false,
        startedAt: null,
        intervalId: null,
        price: "",
        totalMinutes: 0,
        progress: circumference,
        elapsedSeconds: 0,
        secondsLeft: 0,
        minLeft: 0,
    },
};

cardBody.addEventListener("input", (event) => {
    const priceInput = event.target.closest("[data-input-price]");
    if (!priceInput) return;
    const priceCard = priceInput.closest("[data-card]");
    const priceCardId = priceCard.getAttribute("id");

    cardStates[priceCardId].price = Number(priceInput.value);
});

// add new card
plusButton.addEventListener("click", () => {
    const newCard = cardTemplate.cloneNode(true);
    newId += 1;
    const newIdString = `card-${newId.toString()}`;
    newCard.setAttribute("id", newIdString);
    cardBody.appendChild(newCard);

    cardStates[newIdString] = {
        isRunning: false,
        hasStarted: false,
        startedAt: null,
        intervalId: null,
        price: "",
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

cardBody.addEventListener("click", (event) => {
    const playButton = event.target.closest("[data-play-button]");
    if (!playButton) return;
    const playCard = playButton.closest("[data-card]");
    const playCardId = playCard.getAttribute("id");
    const playCardInput = playCard.querySelector("[data-input-price]");

    if (cardStates[playCardId].isRunning == false) {
        if (!cardStates[playCardId].price || !hourlyWage || cardStates[playCardId].price <= 0 || hourlyWage <= 0) {
            alert("Please enter (positive) numbers for price and wage (e.g. 12 or 24.99).");
            if (!cardStates[playCardId].price || cardStates[playCardId].price <= 0) {
                playCardInput.value = "";
                cardStates[playCardId].price = "";
            };
            if (!hourlyWage || hourlyWage <= 0) {
                inputHourlyWage.value = "";
                hourlyWage = "";
            };
            return;
        } else if (cardStates[playCardId].price === "" || hourlyWage === "") {
            return;
        } else {
            Object.keys(cardStates).forEach(id => {
                if (id !== playCardId && cardStates[id].isRunning) {
                    const otherCard = document.getElementById(id);
                    const otherPlayButton = otherCard.querySelector("[data-play-button]");
                    otherPlayButton.textContent = "\u25B6";
                    otherCard.classList.remove("playing");
                    pauseTimer(id);
                };
            });

            playButton.textContent = "\u23F8";
            playCard.classList.add("playing");
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

function startTimer(cardId) {
    const thisCard = document.getElementById(cardId);
    const thisCircle = thisCard.querySelector("[data-circle-ring]");
    const thisPriceInput = thisCard.querySelector("[data-input-price]");
    const thisTracker = thisCard.querySelector("[data-card-tracker]");
    const thisPlayButton = thisCard.querySelector("[data-play-button]");
    thisPriceInput.disabled = true;
    inputHourlyWage.disabled = true;

    if (cardStates[cardId].isRunning) return;
    cardStates[cardId].isRunning = true;

    calcMinutes(cardId);

    if (cardStates[cardId].hasStarted) {
        cardStates[cardId].progress = circumference - (circumference * (cardStates[cardId].elapsedSeconds / (cardStates[cardId].totalMinutes * 60)));
        if (cardStates[cardId].progress <= 0) {
            thisCircle.style.strokeDashoffset = 0;
            thisCircle.classList.add("completed");
            thisTracker.textContent = "Finished!";
            thisPriceInput.disabled = false;
            inputHourlyWage.disabled = false;
            thisPlayButton.textContent = "\u25B6";
            cardStates[cardId].isRunning = false;
            return;
        } else {
            thisCircle.style.strokeDashoffset = cardStates[cardId].progress;
        };
    };

    cardStates[cardId].hasStarted = true;
    cardStates[cardId].startedAt = Date.now() - (cardStates[cardId].elapsedSeconds * 1000);

    cardStates[cardId].intervalId = setInterval(() => {

        const realElapsedSec = Math.floor((Date.now() - cardStates[cardId].startedAt) / 1000);
        cardStates[cardId].elapsedSeconds = realElapsedSec;

        cardStates[cardId].progress = circumference - (circumference * (realElapsedSec / (cardStates[cardId].totalMinutes * 60))); // after needed time circle is fully visible

        if (cardStates[cardId].progress <= 0) {
            thisCircle.style.strokeDashoffset = 0;
            thisCircle.classList.add("completed");
            thisTracker.textContent = "Finished!";
            clearInterval(cardStates[cardId].intervalId);
            thisPlayButton.textContent = "\u25B6";
            thisPriceInput.disabled = false;
            inputHourlyWage.disabled = false;
            cardStates[cardId].isRunning = false;
            return;
        } else {
            thisCircle.classList.remove("completed");
        };

        thisCircle.style.strokeDashoffset = cardStates[cardId].progress; // the smaller the progress the more you see the circle
        cardStates[cardId].minLeft = Math.ceil(((cardStates[cardId].totalMinutes * 60) - realElapsedSec) / 60);
        updateTimers(cardId);

    }, 1000); // update per second
};

function updateTimers(cardId) {
    const timerCard = document.getElementById(cardId);
    const timerTarget = timerCard.querySelector("[data-card-tracker]");
    timerTarget.textContent = `${cardStates[cardId].minLeft} min left`;
};

function pauseTimer(cardId) {
    if (cardStates[cardId].isRunning == false) return;

    clearInterval(cardStates[cardId].intervalId);
    cardStates[cardId].isRunning = false;
    const thisCard = document.getElementById(cardId);
    const thisPriceInput = thisCard.querySelector("[data-input-price]");
    thisPriceInput.disabled = false;
    inputHourlyWage.disabled = false;
};

// remove card
cardBody.addEventListener("click", (event) => {
    const deleteButton = event.target.closest("[data-delete-button]");
    if (!deleteButton) return;

    const confirmed = confirm("Are you sure you want to remove this card?");
    if (!confirmed) return;

    const deleteCard = deleteButton.closest("[data-card]");
    const deleteCardId = deleteCard.getAttribute("id");

    clearInterval(cardStates[deleteCardId].intervalId);
    deleteCard.remove();
    delete cardStates[deleteCardId];
});

// restart card
cardBody.addEventListener("click", (event) => {
    const restartButton = event.target.closest("[data-restart-button]");
    if (!restartButton) return;

    const confirmed = confirm("Are you sure you want to restart this card?");
    if (!confirmed) return;

    const restartCard = restartButton.closest("[data-card]");
    const restartCardId = restartCard.getAttribute("id");
    const restartCircle = restartCard.querySelector("[data-circle-ring]");
    const restartInput = restartCard.querySelector("[data-input-price]");
    const restartPlayBtn = restartCard.querySelector("[data-play-button]");
    const restartTracker = restartCard.querySelector("[data-card-tracker]");
    const savedPrice = cardStates[restartCardId].price;

    clearInterval(cardStates[restartCardId].intervalId);

    cardStates[restartCardId] = {
        isRunning: false,
        hasStarted: false,
        intervalId: null,
        price: savedPrice,
        totalMinutes: 0,
        progress: circumference,
        elapsedSeconds: 0,
        secondsLeft: 0,
        minLeft: 0,
    };

    restartCircle.style.strokeDashoffset = circumference;
    restartCircle.classList.remove("completed");
    restartCard.classList.remove("playing");
    restartPlayBtn.textContent = "\u25B6";
    restartInput.disabled = false;
    restartTracker.textContent = "-- min left";

});

// modal icon picker

const openModalButtons = document.querySelectorAll("[data-open-modal]"); // as if there are more buttons to open modal
const closeModalButtons = document.querySelectorAll("[data-close-modal]"); // as if there are more buttons to close modal
const overlay = document.getElementById("overlay");
const modalBody = document.querySelector("[data-modal-body]");
let placeholderImg = "";

cardBody.addEventListener("click", (event) => {
    const openIconModal = event.target.closest("[data-open-modal]");
    placeholderImg = openIconModal;
    if (!openIconModal) return;
    placeholderImg = openIconModal;
    const modal = document.querySelector(openIconModal.dataset.openModal);
    openModal(modal);
});

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
        placeholderImg = "";
    });
});

// close modal when clicking on overlay
overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
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
