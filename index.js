const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

const items = [
  { name: "black", image: "images/black.png" },
  { name: "daffyduck", image: "images/daffyduck.png" },
  { name: "garfield", image: "images/garfield.png" },
  { name: "jerry", image: "images/jerry.png" },
  { name: "mickey", image: "images/mickey.png" },
  { name: "patrick", image: "images/patrick.png" },
  { name: "sponge", image: "images/sponge.png" },
  { name: "squidward", image: "images/squidward.png" },
  { name: "stewie", image: "images/stewie.png" },
  { name: "superman", image: "images/superman.png" },
  { name: "tiger", image: "images/tiger.jpg" },
  { name: "toystory", image: "images/toystory.png" }
];

let seconds = 0;
let minutes = 0;
let movesCount = 0;
let winCount = 0;

function timeGenerator() {
  seconds += 1;

  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }

  let secondsValue;
  if (seconds < 10) {
    secondsValue = `0${seconds}`;
  }
  else {
    secondsValue = `${seconds}`;
  }

  let minutesValue;
  if (minutes < 10) {
    minutesValue = `0${minutes}`;
  }
  else {
    minutesValue = `${minutes}`;
  }
  timeValue.innerHTML = `<span>Time : </span>${minutesValue}:${secondsValue}`;
};

function movesCounter() {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
  if (movesCount == 5) {
    result.innerHTML = `<h2>You Loser</h2>
            <h4>Moves : ${movesCount}</h4>
            <h4>Time : ${minutesValue}:${secondsValue}</h4>`;
    stopGame();
  }
};

function generateRandom(size = 4) {

  let tempArray = [...items];
  let cardValues = [];

  size = ((size * size) - 1) / 2;

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

function matrixGenerator(cardValues, size = 4) {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];

  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <section class="card-container" data-card-value="${cardValues[i].name}">
        <section class="card-before">?</section>
        <section class="card-after">
        <img src="${cardValues[i].image}" class="image"/></section>
     </section>`;
  }

  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        }
        else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
              <h4>Moves : ${movesCount}</h4>
              <h4>Time : ${minutesValue}:${secondsValue}</h4>`;
              stopGame();
            }
          }
          else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves :</span> ${movesCount}`;
  initializer();
});

stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

function initializer() {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};