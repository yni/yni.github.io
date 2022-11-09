"use strict";

// factorial from https://stackoverflow.com/questions/7743007/most-efficient-way-to-write-combination-and-permutation-calculator-in-javascript
function factorial(n) { 
    if (n < 1) {return 0};
    var x=1; 
    var f=1;
    while (x<=n) {
        f*=x; x++;
    }
        return f;
}

// combination function
function choose(n, k) {
    if (n < k) {return 0};
    if (n == k) {return 1};
    return factorial(n)/factorial(k)/factorial(n - k);
}

// calculate live probability
function calculateProbability(deck, hand, starter) {
    if (starter > deck || hand > deck) {return 0};
    const numPossibilities = choose(deck, hand);
    const numDead = choose(deck - starter, hand);
    return (1 - numDead/numPossibilities);
}

// get deckSize from the user
const deckSize = parseInt(prompt("Enter deck size."));

// get deckSize from the user
const handSize = parseInt(prompt("Enter hand size."));

// get numStarters from the user
const numStarters = parseInt(prompt("Enter the number of starters."));

const liveProbability = calculateProbability(deckSize, handSize, numStarters);

const html = `<p><label>Deck size: </label>${deckSize}</p>
    <p><label>Number of Starters: </label>${numStarters}</p>
    <p><label>Result: </label>${(100 * liveProbability).toFixed(2)}%</p>`;

document.write(html);