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

// ************************************************** //
// Hide All Cards in Beginning//
// ************************************************** //
cards.forEach((c) => {
  c.classList.add("cardsHidden");
});

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

// Store Final Score
let dealerFinalHandCount = "";

// Evaluate Scores/Value
const dealerSumCount = (num) => {
  // Player Deck Sum
  for (let i = 0; i < dealerSumDeck.length; i++) {
    sumDealerValueTotal += num;

    // Player's Sum Displayed on Screen
    return (
      (dealerCardValue.textContent = `${sumDealerValueTotal}`),
      (dealerFinalHandCount = sumDealerValueTotal)
    );
  }
};

// ************************************************** //
// Calculate Sum of Player's Hand //
// ************************************************** //

// Total Sum Converter
let sumValueTotal = 0;

// Store Final Score
let playerFinalHandCount = "";

// Evaluate Scores/Value
const playerSumCount = (num) => {
  // Player Deck Sum
  for (let i = 0; i < playerSumDeck.length; i++) {
    sumValueTotal += num;

    // Player's Sum Displayed on Screen
    return (
      (playerCardValue.textContent = `${sumValueTotal}`),
      (playerFinalHandCount = sumValueTotal)
    );
  }
};

// ************************************************** //
// Change of State Function //
// ************************************************** //

const stateChange = () => {
  cards[i].classList.remove("cardsHidden");
  cardFront[i].style.transform = "rotateY(-180deg)";
  cardBack[i].style.transform = "rotateY(0deg)";
  playerSumDeck.push(convertStr(shuffledDeck[i]));
  playerSumCount(convertStr(shuffledDeck[i]));
  i++;
};

// ************************************************** //
// Functions //
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
    cards[i].classList.remove("cardsHidden");
    dealerSumDeck.push(convertStr(shuffledDeck[i]));
    dealerSumCount(convertStr(shuffledDeck[i]));
    cardFront[1].style.transform = "rotateY(-180deg)";
    cardBack[1].style.transform = "rotateY(0deg)";
  }

  // Generate First Card Flop for Player
  cardImgsBack.forEach((s, i) => {
    s.src = `./public/images/${shuffledDeck[i]}.png`;
  });

  for (let i = 5; i < 7; i++) {
    cards[i].classList.remove("cardsHidden");
    playerSumDeck.push(convertStr(shuffledDeck[i]));
    playerSumCount(convertStr(shuffledDeck[i]));
    cardFront[i].style.transform = "rotateY(-180deg)";
    cardBack[i].style.transform = "rotateY(0deg)";
  }

  // If Player Hits Sum of 21 or Bust

  // blackJackorBust(playerFinalHandCount);

  console.log(shuffledDeck);
};

// ************************************************** //
// Deal Button Function //
// ************************************************** //

dealButton.addEventListener("click", () => {
  shuffleNow();
  hideDealButton();
});

// ************************************************** //
// Hit Button Function //
// ************************************************** //

let i = 7;

hitButton.addEventListener("click", () => {
  stateChange();
});

// ************************************************** //
// Stay Button Function //
// ************************************************** //

stayButton.addEventListener("click", () => {
  hideHitButton();
  hideStayButton();
});
