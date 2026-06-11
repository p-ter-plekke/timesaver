const inputHourlyWage = document.querySelector("[data-input-wage]");

inputHourlyWage.addEventListener("input", () => {
    hourlyWage = Number(inputHourlyWage.value);
    // calcMinutes();
    // updateTimers();
});

let cardStates = {};

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

// functie bij toevoegen kaart die 1x wordt toegepast?