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
    if (starter > deck || hand > deck) {
        return 0};
    var numPossibilities = choose(deck, hand);
    var numBricks = choose(deck - starter, hand);
    return (1 - numBricks/numPossibilities);
}

function basicCalc() {
    var deckSize = parseInt(document.getElementById("deckSize").value, 10);
    var handSize = parseInt(document.getElementById("handSize").value, 10);
    var numStarters = parseInt(document.getElementById("numStarters").value, 10);
    var liveProbability = calculateProbability(deckSize, handSize, numStarters);
    var output = document.getElementById("output");
    output.innerHTML = (100 * liveProbability).toFixed(2).toString() + '%';
/*    var html = `<p><label>Deck size: </label>${deckSize}</p>
        <p><label>Number of Starters: </label>${numStarters}</p>
        <p><label>Result: </label>${(100 * liveProbability).toFixed(2)}%</p>`;
    document.write(html);
*/
}