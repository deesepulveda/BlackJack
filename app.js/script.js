"use strict";

const dealerShuffledImg = document.querySelector(".dealer-shuffled-img");
const closedShuffleImg = document.querySelector(".closed-shuffled-img");
const shuffledImg = document.querySelectorAll(".shuffled-img");
const shufflingDeckImg = document.querySelector(".shuffling-deck-img");
const shuffledContainer = document.querySelector(".shuffled-deck");
const flopDealerContainer = document.querySelector(".flop-dealer");
const flopPlayerContainer = document.querySelector(".flop-player");
const buttons = document.querySelectorAll("button");
const buttonDeal = document.querySelector(".deal-btn");
const buttonHit = document.querySelector(".hit-btn");
const buttonStay = document.querySelector(".stay-btn");
const playerValue = document.querySelector(".player-value");
const dealerValue = document.querySelector(".dealer-value");
const modal = document.querySelector(".modal");
const modalScore = document.querySelector(".modal-score");
const buttonRefresh = document.querySelector(".button-refresh");

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

// ************************************************** //

// Create Sum of Player's Flopped/Open Cards
let playerSumDeck = [];

// Create Sum of Dealers's Flopped/Open Cards
let dealerSumDeck = [];

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

// Total Sum Converter
let sumValueTotal = 0;

// Evaluate Scores/Value

const playerSumCount = (num) => {
  // Player Deck Sum
  for (let i = 0; i < playerSumDeck.length; i++) {
    sumValueTotal += num;

    // Player's Sum Displayed on Screen
    return (playerValue.textContent = `${sumValueTotal}`);
  }
};

// ************************************************** //

// Total Sum Converter
let sumDealerValueTotal = 0;

// Evaluate Scores/Value

const dealerSumCount = (num) => {
  // Player Deck Sum
  for (let i = 0; i < dealerSumDeck.length; i++) {
    sumDealerValueTotal += num;

    // Player's Sum Displayed on Screen
    return (dealerValue.textContent = `${sumDealerValueTotal}`);
  }
};

// ************************************************** //

//Check to see if Dealer or Player Wins

const winningHand = () => {
  modal.classList.add("showModal");

  if (
    playerValue.textContent > dealerValue.textContent &&
    playerValue.textContent < "22"
  ) {
    modalScore.textContent = "Player Wins!!";
  }

  if (playerValue.textContent === "21") {
    modalScore.textContent = "BlackJack! Player Wins!";
  }

  if (
    dealerValue.textContent > playerValue.textContent &&
    dealerValue.textContent < "22"
  ) {
    modalScore.textContent = "Dealer Wins!!";
  }

  if (playerValue.textContent >= "22") {
    modalScore.textContent = "Player Bust!!";
  }

  if (dealerValue.textContent == playerValue.textContent) {
    modalScore.textContent = "Push!";
  }
};

// ************************************************** //
// Automatic Modal
// When Player Hits BlackJack on Flop
// when Player Busts

// ************************************************** //

// Function to Shuffle Cards UI

const cardUIShuffle = () => {
  for (let i = 0; i < 10; i++) {
    let cardImages = document.createElement("img");
    cardImages.src = "./public/images/cardPattern.jpg";
    cardImages.classList.add("shuffling-deck-img");
    shuffledContainer.appendChild(cardImages);
    cardImages.style.animationDelay = `.${i}s`;
    cardImages.classList.add("shuffleMove");
  }
};

// ************************************************** //

// Function to Pick Random Card from CardDeck Array

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

  // Create Image for Dealer and Player First Cards Flop
  shuffledImg.forEach((s, i) => {
    s.src = `./public/images/${shuffledDeck[i]}.png`;
    playerSumDeck.push(convertStr(shuffledDeck[i]));
    playerSumCount(convertStr(shuffledDeck[i]));
  });

  dealerShuffledImg.src = `./public/images/${shuffledDeck[5]}.png`;
  dealerSumDeck.push(convertStr(shuffledDeck[5]));
  dealerSumCount(convertStr(shuffledDeck[5]));

  console.log(shuffledDeck);
  console.log(playerSumDeck);
  console.log(dealerSumDeck);
};

// ************************************************** //

// Deal Button Function

buttonDeal.addEventListener("click", () => {
  //cardUIShuffle();
  shuffleNow();
  // setTimeout(shuffleNow, 2200);

  //Remove Hidden Class from Image src
  dealerShuffledImg.classList.remove("hidden");

  shuffledImg.forEach((s) => {
    s.classList.remove("hidden");
  });

  // Show Hit Button after Deal Button Pressed
  buttons.forEach((b) => {
    if (b.classList.contains("hidden")) {
      b.classList.remove("hidden");
    }
  });

  // Hide Deal Button after First Press
  buttonDeal.classList.add("hidden");
});

// ************************************************** //

// hit Button Function

let i = 2;

buttonHit.addEventListener("click", () => {
  shuffledImg[1].classList.add("moveLeft");
  let newImages = document.createElement("img");
  newImages.classList.add("shuffled-img");
  newImages.classList.add("moveLeft");
  newImages.src = `./public/images/${shuffledDeck[i]}.png`;
  flopPlayerContainer.appendChild(newImages);
  playerSumDeck.push(convertStr(shuffledDeck[i]));
  playerSumCount(convertStr(shuffledDeck[i]));
  i++;

  console.log(playerSumDeck);

  // Hide Hit Button if Player Hits All Five Cards

  if (i == 5) {
    buttonHit.classList.add("hidden");
    buttonStay.classList.add("hiddeb");
  }
});

//Hide Hit Button After Stay Button is Pressed

let n = 6;

buttonStay.addEventListener("click", () => {
  buttonHit.classList.add("hidden");
  buttonStay.classList.add("hidden");
  closedShuffleImg.classList.add("hidden");

  // Dealer Flops Cards
  let newImages = document.createElement("img");
  newImages.classList.add("dealer-shuffled-img");
  newImages.src = `./public/images/${shuffledDeck[n]}.png`;
  flopDealerContainer.appendChild(newImages);
  dealerSumDeck.push(convertStr(shuffledDeck[n]));
  dealerSumCount(convertStr(shuffledDeck[n]));
  n++;

  winningHand();
});

// Modal Button to Refresh/New Game
buttonRefresh.addEventListener("click", () => {
  modal.classList.remove("showModal");
  window.location.reload();
});

// ************************************************** //
