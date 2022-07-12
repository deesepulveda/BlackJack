"use strict";

// ************************************************** //
// Cached //
// ************************************************** //

const dealerCardValue = document.querySelector(".dealer-card-value");
const playerCardValue = document.querySelector(".player-card-value");
const cards = document.querySelectorAll(".cards");
const cardFront = document.querySelectorAll(".card-front");
const cardBack = document.querySelectorAll(".card-back");
const cardImgsBack = document.querySelectorAll(".card-imgs-back");
const dealButton = document.querySelector(".deal-btn");
const hitButton = document.querySelector(".hit-btn");
const stayButton = document.querySelector(".stay-btn");
const modal = document.querySelector(".modal");
const modalValue = document.querySelector(".modal-value");
const refreshButton = document.querySelector(".refresh-btn");

// ************************************************** //
// Create Deck of Cards //
// ************************************************** //

// Cards Suit and Rank Arrays
const suit = ["C", "H", "S", "D"];
const rank = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

// Deck of 52 Cards
let cardDeck = [];

// Shuffled Deck of 52 Cards
let shuffledDeck = [];

// Function to Build Deck of 52 Cards
for (let s = 0; s < suit.length; s++) {
  for (let r = 0; r < rank.length; r++) {
    cardDeck.push(suit[s] + rank[r]);
  }
}

// Create Sum of Player's Flopped/Open Cards
let playerSumDeck = [];

// Create Sum of Dealers's Flopped/Open Cards
let dealerSumDeck = [];

// ************************************************** //
// Convert Strings to Numbers //
// ************************************************** //

//Convert Str to Num then Push into Array
const convertStr = (str) => {
  // If NaN Equals Ace
  if (isNaN(str)) {
    if (str.slice(1) == "A") {
      return 11;
    }
  }

  // If NaN Equals K, Q or J
  if (isNaN(str)) {
    if (str.slice(1) == "K" || str.slice(1) == "Q" || str.slice(1) == "J") {
      return 10;
    }
  }

  //Parse Strings into Numbers
  return parseInt(str.slice(1));
};

// ************************************************** //
// Calculate Sum of Dealer's Hand //
// ************************************************** //

// Total Sum Converter
let sumDealerValueTotal = 0;

// Evaluate Scores/Value
const dealerSumCount = (num) => {
  // Player Deck Sum
  for (let i = 0; i < dealerSumDeck.length; i++) {
    sumDealerValueTotal += num;

    // Player's Sum Displayed on Screen
    return (dealerCardValue.textContent = `${sumDealerValueTotal}`);
  }
};

// ************************************************** //
// Calculate Sum of Player's Hand //
// ************************************************** //

// Total Sum Converter
let sumValueTotal = 0;

// Evaluate Scores/Value
const playerSumCount = (num) => {
  // Player Deck Sum
  for (let i = 0; i < playerSumDeck.length; i++) {
    sumValueTotal += num;

    // Player's Sum Displayed on Screen
    return (playerCardValue.textContent = `${sumValueTotal}`);
  }
};

// ************************************************** //
// CallBack Functions //
// ************************************************** //

const hideDealButton = () => {
  dealButton.classList.add("hidden");
};

const hideHitButton = () => {
  hitButton.classList.add("hidden");
};

const hideStayButton = () => {
  stayButton.classList.add("hidden");
};

const removeHiddenCards = (valueIndex) => {
  cards[valueIndex].classList.remove("cardsHidden");
};

const rotateCards = (cardIndex) => {
  cardFront[cardIndex].style.transform = "rotateY(180deg)";
  cardBack[cardIndex].style.transform = "rotateY(0deg)";
};

const addCardImgs = (valueIndex) => {
  cardImgsBack[
    valueIndex
  ].src = `./public/images/${shuffledDeck[valueIndex]}.png`;
};

const convertDealerSum = (valueIndex) => {
  dealerSumDeck.push(convertStr(shuffledDeck[valueIndex]));
  dealerSumCount(convertStr(shuffledDeck[valueIndex]));
};

const convertPlayerSum = (valueIndex) => {
  playerSumDeck.push(convertStr(shuffledDeck[valueIndex]));
  playerSumCount(convertStr(shuffledDeck[valueIndex]));
};

const dealerHitAgain = () => {
  for (let n = 2; n < 5; n++) {
    if (sumDealerValueTotal <= 17) {
      removeHiddenCards(n);
      convertDealerSum(n);
      rotateCards(n);
      addCardImgs(n);
    }
  }
};

const dealerCardHit = () => {
  convertDealerSum(0);
  rotateCards(0);
  addCardImgs(0);

  setTimeout(dealerHitAgain, 400);
};

// ************************************************** //
// Evaluate Hands //
// ************************************************** //

const blackJackorBust = (val) => {
  if (val === 21 || val > 21) {
    setTimeout(dealerCardHit, 400);
    hideHitButton();
    hideStayButton();
    setTimeout(evaluateHands, 1100);
  }
};

const evaluateHands = () => {
  modal.classList.add("showModal");

  if (
    (sumValueTotal > sumDealerValueTotal && sumValueTotal < 22) ||
    (sumDealerValueTotal >= 22 && sumValueTotal < 22)
  ) {
    modalValue.textContent = "Player Wins!!";
  }

  if (
    (sumDealerValueTotal > sumValueTotal && sumDealerValueTotal < 22) ||
    sumValueTotal > 21
  ) {
    modalValue.textContent = "Dealer Wins!!";
  }

  if (sumDealerValueTotal === sumValueTotal) {
    modalValue.textContent = "Push!";
  }
};

// ************************************************** //
// Shuffle Function //
// ************************************************** //

const shuffleNow = () => {
  // Generate Random Pick from Deck Array
  for (let i = 0; i < 52; i++) {
    // Grab Random Item from Array
    let shuffledData = cardDeck[Math.floor(Math.random() * cardDeck.length)];

    // Find Index of Random Item that was Grabbed
    let shuffledDataIndex = cardDeck.findIndex(
      (item) => item === `${shuffledData}`
    );

    // Push Random Generated Cards into New Deck
    shuffledDeck.push(shuffledData);

    // Index of Random Item to Pop from Array / Prevent Duplicates
    cardDeck.splice(shuffledDataIndex, 1);
  }

  // Generate First Card Flop for Dealer
  for (let i = 0; i < 2; i++) {
    removeHiddenCards(i);
  }

  // Only Show Dealer's 2nd Card
  for (let i = 1; i < 2; i++) {
    convertDealerSum(i);
    rotateCards(i);
    addCardImgs(i);
  }

  // Generate First Card Flop for Player
  for (let i = 5; i < 7; i++) {
    removeHiddenCards(i);
    convertPlayerSum(i);
    rotateCards(i);
    addCardImgs(i);
  }

  // If Player Hits Sum of 21 or Bust

  blackJackorBust(sumValueTotal);

  // console.log(shuffledDeck);
};

// ************************************************** //
// Deal Button Function //
// ************************************************** //

dealButton.addEventListener("click", () => {
  shuffleNow();
  hideDealButton();
  hitButton.classList.remove("hidden");
  stayButton.classList.remove("hidden");
});

// ************************************************** //
// Hit Button Function //
// ************************************************** //

let i = 7;

hitButton.addEventListener("click", () => {
  removeHiddenCards(i);
  convertPlayerSum(i);
  rotateCards(i);
  addCardImgs(i);
  i++;

  blackJackorBust(sumValueTotal);

  if (i === 10) {
    hideHitButton();
    hideStayButton();
  }
});

// ************************************************** //
// Stay Button Function //
// ************************************************** //

stayButton.addEventListener("click", () => {
  hideHitButton();
  hideStayButton();
  setTimeout(dealerCardHit, 400);
  setTimeout(evaluateHands, 1000);
});

// ************************************************** //
// Refresh Modal Button Function //
// ************************************************** //

refreshButton.addEventListener("click", () => {
  modal.classList.remove("showModal");
  window.location.reload();
});

// ************************************************** //
