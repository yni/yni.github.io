"use strict";
// test
function printHi() {
    alert("hi");
}


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
function nChooseK(n, k) {
    if (n < k || n < 0 || k < 0) {return 0};
    if (n == k || k == 0) {return 1};
    return factorial(n)/factorial(k)/factorial(n - k);
}

function generateCompositions(deck, handSize) {
    // this function handles generating the compositions by moving through one index position at a time.
    // the output is a hash of arrays that has the compositions as arrays, counts as integers, and one number for the denominator.
    var results = [];
    const deckLength = deck.length;

    function iterateThroughIndex(currentIndex, assignedComposition, unAssignedCount) {
        // if every card has been assigned, then I pad elements and append the composition
        if (unAssignedCount == 0) { // pad the assignedComposition and append the results
            const padArray = Array(deckLength - assignedComposition.length).fill(0);
            const paddedAssignment = assignedComposition.concat(padArray);
            results.push(paddedAssignment);
        } else if (currentIndex > deckLength) {
            alert("terminate");
        } else { // if there is still assignment to do, add 1 more element to assignedComposition and move to the next index position
            var constraint = deck[currentIndex];
            // if currentIndex has exceeded the deck size, constraint becomes undefined and the for loop will not run
            for (let i = 0; i <= Math.min(constraint, unAssignedCount); i++) {
                var newAssignedComposition = [...assignedComposition];
                newAssignedComposition.push(i);
                iterateThroughIndex(currentIndex + 1, newAssignedComposition, unAssignedCount - i);
            }
        }
    }

    iterateThroughIndex(0, [], handSize);
    var resultsCount = [];
    results.forEach( r => {
        var product = 1;
        for (let i = 0; i < r.length; i++) {
            product = product * nChooseK(deck[i], r[i]);
        }
        resultsCount.push(product);
    })
    const cardsInDeck = deck.reduce((a, b) => parseInt(a) + parseInt(b));
    const denominator = nChooseK(cardsInDeck, handSize);
    return {"compositions": results, "counts": resultsCount, "denominator": denominator, "cards_in_deck":cardsInDeck, "deck": deck}
}

function matchToHighestTier(compositionHash, tierArray) {
    // assume tierArray starts with the most important patterns first
    function isArraySubset(smallerArray, biggerArray) {
        if (smallerArray.length != biggerArray.length) {
            return false;
        } else {
            for (let i = 0; i < smallerArray.length; i++) {
                if (smallerArray[i] > biggerArray[i]) {
                    return false;
                }
            }
            return true;
        }        
    }
    const denominator = compositionHash["denominator"];
    const numberOfTiers = tierArray.length;
    const numberOfCompositions = compositionHash["compositions"].length;
    var tierCounts = Array(numberOfTiers).fill(0);

    // iterate through each composition, which then iterates through each tier.
    for (let i = 0; i < numberOfCompositions; i++) {
        for (let j = 0; j < numberOfTiers; j++) {
            if (tierArray[j].some( (x) => isArraySubset(x, compositionHash["compositions"][i]))) {
                tierCounts[j] += compositionHash["counts"][i];
                break;
            }
        }
    }
    var tierProbabilities = {};
    var countSum = 0;
    for (let i = 0; i < numberOfTiers; i++) {
        tierProbabilities[numberOfTiers - i] = tierCounts[i] / denominator;
        countSum += tierCounts[i];
    }
    if (countSum < denominator) {
        tierProbabilities[0] = 1 - countSum / denominator;
    }
    return tierProbabilities;
}

/*
var x = generateCompositions([3,3, 3, 10], 4)

// var y = generateCompositions([3, 3, 3], 8)

var x = generateCompositions([3,3, 3, 10], 4)

//var y = {"2": [[0, 0, 0, 4], [0, 0, 1, 3]], "1": [[0, 0, 1, 3], [0, 0, 2, 2]], "0": [[0, 0, 3, 1]]}

var y = [[[0, 0, 0, 4], [0, 0, 1, 3]],[[0, 0, 1, 3], [0, 0, 2, 2]], [[0, 0, 3, 1]]]
var s = matchToHighestTier(x, [[[2,0, 0, 0]]])
*/