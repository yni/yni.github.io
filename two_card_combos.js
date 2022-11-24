"use strict";

const addCard = document.querySelector(".add_card");
const deckList = document.querySelector(".deck_list");
var comboPairs = [];

function removeCard() {
  this.parentElement.remove();
  updateDeckTotal()
}

function resetDeck() {
  const addedCard = document.querySelectorAll(".added_card");
  addedCard.forEach( (x) => {
    x.remove();
  });
  document.getElementById("blank_card_name").value = "";
  document.getElementById("blank_card_count").value = 40;
  document.getElementById("blank_card_count_delta").value = 0;
  updateDeckTotal()
}

function addNewCard() {
  const cardName = document.createElement("input");
  cardName.className = "card_name";
  cardName.type = "text";
  cardName.placeholder = "card name";

  const cardCount = document.createElement("input");
  cardCount.className = "card_count";
  cardCount.type = "number";
  cardCount.value = 3;
  cardCount.min = 0;
  cardCount.setAttribute("oninput", "updateDeckTotal()");

  const cardCountDelta = document.createElement("input");
  cardCountDelta.className = "card_count_delta";
  cardCountDelta.type = "number";
  cardCountDelta.value = 0;
  cardCountDelta.setAttribute("oninput", "updateDeckTotal()");

  const removeBtn = document.createElement("removeClass");
  removeBtn.className = "delete";
  removeBtn.innerHTML = "&times";

  removeBtn.addEventListener("click", removeCard);

  const newCard = document.createElement("div");
  newCard.className = "card added_card";

  deckList.appendChild(newCard);
  newCard.appendChild(cardName);
  newCard.appendChild(cardCount);
  newCard.appendChild(cardCountDelta);
  newCard.appendChild(removeBtn);
  updateDeckTotal()
}

addCard.addEventListener("click", addNewCard);


function drawGrid() {
  comboPairs = [];
  const gridTable = document.getElementById("grid_output");
  gridTable.innerHTML = ``;
  var cardNameQuery = document.querySelectorAll(".card_name");
  var cardCountQuery = document.querySelectorAll(".card_count");
  var numCards = cardNameQuery.length;
  var r = document.querySelector(':root');
  r.style.setProperty('--gridSize', numCards + 1);
  var newRow = "";
  newRow += `<div class="combo_filler grid_item"></div>`;
  for (let r = 0; r < numCards; r++) {
    var cardNameDisplay = cardNameQuery[r].value.toString()
    if (cardNameDisplay == "") {
      if (r == 0) {
        cardNameDisplay = "blanks"
      } else {
        cardNameDisplay = "Card: " + r.toString();
      }
    }
    const cellHeader = cardNameDisplay + ' (' + cardCountQuery[r].value + ')';
    newRow += `<div class="combo_header grid_item">${cellHeader}</div>`; 
  }
  newRow += "</div>";
  gridTable.innerHTML += newRow;
  for (let r = 0; r < numCards; r++) {
    newRow = "";
    var cardNameDisplay = cardNameQuery[r].value.toString()
    if (cardNameDisplay == "") {
      if (r == 0) {
        cardNameDisplay = "blanks"
      } else {
        cardNameDisplay = "Card: " + r.toString();
      }
    }
    const cellRow = cardNameDisplay + ' (' + cardCountQuery[r].value + ')';
    newRow += `<div class="combo_header grid_item">${cellRow}</div>`;
    for (let c = 0; c < numCards; c++) {
      //gridTable.innerHTML += '<div><input type="checkbox" ></div>';
      if (c >= r) {
        const pairId = r.toString() + "," + c.toString();
        comboPairs.push(pairId);
        newRow += `<div class="combo_input grid_item"><input type="checkbox" id="${pairId}" class="combo_checkbox"></div>`;
//      newRow += `<div><input type="range" id="${pairId}" min=0 max=3 value=0 oninput="this.nextElementSibling.value = this.value"><output>0</output></div>`;
      } else {
        newRow += '<div class="combo_filler grid_item"></div>'
      }
    }
    newRow += "</div>";
    gridTable.innerHTML += newRow;
  }
}

function generateTiers() {
  var tierArray = [[]];
  const numCards = document.querySelectorAll(".card_count").length;
  comboPairs.forEach( (p) => {
    const y = document.getElementById(p);
    if (y.checked) {
      var cardToAdd = Array(numCards).fill(0);
      var firstCard = p.split(",")[0];
      var secondCard = p.split(",")[1];
      cardToAdd[firstCard] += 1;
      cardToAdd[secondCard] += 1;
      tierArray[0].push(cardToAdd)
    }
  });
  return tierArray;
}

function calculateTierProbabilities() {
  var tierArray = generateTiers();
  var cardCountQuery = document.querySelectorAll(".card_count");
  var cardCountQueryDelta = document.querySelectorAll(".card_count_delta");
  var numCards = cardCountQuery.length;
  var deck = [];
  var deckDelta = [];
  for (let r = 0; r < numCards; r++) {
   deck.push(parseInt(cardCountQuery[r].value));
   deckDelta.push(parseInt(cardCountQuery[r].value) + parseInt(cardCountQueryDelta[r].value));
  }
  var composition = generateCompositions(deck, 5);
  var output = matchToHighestTier(composition, tierArray);
  var compositionDelta = generateCompositions(deckDelta, 5);
  var outputDelta = matchToHighestTier(compositionDelta, tierArray);
  var differenceDistribution = compareDistribution(output, outputDelta);
  updateProbabilityGraph(output, "barGraphOutput");
  updateProbabilityTable(output, "probabilityTableOutput");
  updateProbabilityGraph(differenceDistribution, "differenceGraphOutput", true);
  updateProbabilityTable(differenceDistribution, "differenceTableOutput", true);
}

function updateDeckTotal() {
  var cardCountQuery = document.querySelectorAll(".card_count");
  var cardCountQueryDelta = document.querySelectorAll(".card_count_delta");
  var numCards = cardCountQuery.length;
  var deckSize = 0;
  var deltaSize = 0;
  for (let r = 0; r < numCards; r++) {
   deckSize += parseInt(cardCountQuery[r].value);
   deltaSize += parseInt(cardCountQueryDelta[r].value);
  }
  var deckTotal = document.getElementById("card_count_total");
  var deltaTotal = document.getElementById("delta_total");
  deckTotal.innerHTML = deckSize.toString();
  deltaTotal.innerHTML = deltaSize.toString();
}