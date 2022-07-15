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
const splitButton = document.querySelector(".split-btn");
const modal = document.querySelector(".modal");
const modalValue = document.querySelector(".modal-value");
const refreshButton = document.querySelector(".refresh-btn");
const blackjack = document.querySelector(".blackjack");

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

// Convert Str to Num then Push into Array
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

const addSplitButton = () => {
  splitButton.classList.remove("hidden");
};

const hideSplitButton = () => {
  splitButton.classList.add("hidden");
};

const rotateAndAddImage = (cardIndex) => {
  cardFront[cardIndex].classList.add("rotateFrontCard");
  cardBack[cardIndex].classList.add("rotateBackCard");
  cardImgsBack[
    cardIndex
  ].src = `./public/images/${shuffledDeck[cardIndex]}.png`;
};

const moveCardLeft = (cardIndex) => {
  cards[cardIndex].classList.add("moveLeft");
};

const addWidth = (cardIndex) => {
  cards[cardIndex].classList.add("widthOpen");
};

// Check Ace if 11 or 1 and Sum up Cards for Dealer
const convertDealerSum = (valueIndex) => {
  let x = 11;

  if (convertStr(shuffledDeck[valueIndex]) == x && dealerSumDeck.length > 2) {
    let newAceValue = x;
    newAceValue = 1;
    dealerSumDeck.push(newAceValue);
    dealerSumCount(newAceValue);
  } else {
    dealerSumDeck.push(convertStr(shuffledDeck[valueIndex]));
    dealerSumCount(convertStr(shuffledDeck[valueIndex]));
  }
};

// Check Ace if 11 or 1 and Sum up Cards for Player
const convertPlayerSum = (valueIndex) => {
  let x = 11;

  if (convertStr(shuffledDeck[valueIndex]) == x && playerSumDeck.length > 2) {
    let newAceValue = x;
    newAceValue = 1;
    playerSumDeck.push(newAceValue);
    playerSumCount(newAceValue);
  } else {
    playerSumDeck.push(convertStr(shuffledDeck[valueIndex]));
    playerSumCount(convertStr(shuffledDeck[valueIndex]));
  }
};

// Convert Ace Values to 1 for Dealer
const changeItemValueDealer = () => {
  const indexOfAceDealer = dealerSumDeck.indexOf(11);

  if (indexOfAceDealer !== -1) {
    dealerSumDeck[indexOfAceDealer] = 1;
    dealerSumCount(dealerSumDeck[indexOfAceDealer] - 11);
  }
};

// Convert Ace Values to 1 for Player
const changeItemValue = () => {
  const indexOfAce = playerSumDeck.indexOf(11);

  if (indexOfAce !== -1) {
    playerSumDeck[indexOfAce] = 1;
    playerSumCount(playerSumDeck[indexOfAce] - 11);
  }
};

const dealerHitAgain = () => {
  for (let n = 2; n < 5; n++) {
    if (sumDealerValueTotal <= 16) {
      addWidth(n);
      convertDealerSum(n);
      rotateAndAddImage(n);
      moveCardLeft(n);
      changeItemValueDealer();
    }
  }
};

const dealerCardHit = () => {
  addWidth(0);
  convertDealerSum(0);
  rotateAndAddImage(0);
  moveCardLeft(1);
  changeItemValueDealer();
  setTimeout(dealerHitAgain, 600);
};

// ************************************************** //
// Evaluate Hands //
// ************************************************** //

const blackJackorBust = (val) => {
  if (val === 21 || val > 21) {
    hideHitButton();
    hideSplitButton();
    hideStayButton();
    setTimeout(dealerCardHit, 400);
    setTimeout(evaluateHands, 1100);
  }
};

const splitValue = (val1, val2) => {
  if (val1 === val2) {
    addSplitButton();
  }
};

const evaluateHands = () => {
  modal.classList.add("showModal");

  if (sumValueTotal == 21 && playerSumDeck.length == 2) {
    blackjack.textContent = "BLACKJACK!";
    modalValue.textContent = "Player Wins!";
  }

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
    addWidth(i);
  }

  // Only Show Dealer's 2nd Card
  for (let i = 1; i < 2; i++) {
    rotateAndAddImage(i);
    convertDealerSum(i);
  }

  // Generate First Card Flop for Player
  for (let i = 5; i < 7; i++) {
    addWidth(i);
    rotateAndAddImage(i);
    convertPlayerSum(i);
  }

  // If Player Hits Sum of 21 or Bust
  blackJackorBust(sumValueTotal);
};

// ************************************************** //
// Deal Button Function //
// ************************************************** //

dealButton.addEventListener("click", () => {
  shuffleNow();
  hideDealButton();
  hitButton.classList.remove("hidden");
  stayButton.classList.remove("hidden");
  splitValue(shuffledDeck[5].slice(1), shuffledDeck[6].slice(1));
});

// ************************************************** //
// Hit Button Function //
// ************************************************** //

let i = 7;

hitButton.addEventListener("click", () => {
  addWidth(i);
  rotateAndAddImage(i);
  moveCardLeft(6);
  moveCardLeft(i);
  convertPlayerSum(i);

  i++;

  changeItemValue();

  blackJackorBust(sumValueTotal);

  if (i === 10) {
    hideHitButton();
    hideStayButton();
    setTimeout(dealerCardHit, 400);
    setTimeout(evaluateHands, 1400);
  }
});

// ************************************************** //
// Stay Button Function //
// ************************************************** //

stayButton.addEventListener("click", () => {
  hideHitButton();
  hideStayButton();
  hideSplitButton();
  setTimeout(dealerCardHit, 400);
  setTimeout(evaluateHands, 1400);
});

// ************************************************** //
// Refresh Modal Button Function //
// ************************************************** //

refreshButton.addEventListener("click", () => {
  modal.classList.remove("showModal");
  window.location.reload();
});

// ************************************************** //
// Confetti Winnding Function //
// ************************************************** //

// Create Different size/color confetti
// Create Different Speed
// Create Different Duration
// Create Different Positions

// ************************************************** //
// Chips Betting Function //
// ************************************************** //
