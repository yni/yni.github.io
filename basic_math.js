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
    if (n < k || n < 0 || k < 0) {return 0};
    if (n == k || k == 0) {return 1};
    return factorial(n)/factorial(k)/factorial(n - k);
}

// calculate live probability
function calculateProbability(deck, hand, starters) {
    if (starters > deck || hand > deck || deck <= 0 || hand <= 0 || starters <= 0) {
        return 0};
    var numPossibilities = choose(deck, hand);
    var numBricks = choose(deck - starters, hand);
    return (1 - numBricks/numPossibilities);
}

// calculate probability of getting an exact number of hits
function calculateExactProbability(deck, hand, starters, hits) {
    if (starters > deck || hand > deck || hits > hand) {
        return 0
    };
    var numPossibilities = choose(deck, hand);
    var numHits = choose(starters, hits) * choose(deck - starters, hand - hits);
    return numHits/numPossibilities;
}

// generate a hash of the distribution that is later used to update outputs
function generateBasicDistribution(deck, hand, starters) {
    var distribution = {};
    for (let i = 0; i < hand + 1; i++) {
        distribution[i] = calculateExactProbability(deck, hand, starters, i);
    }
    return distribution;
}