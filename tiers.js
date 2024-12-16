// This is the coolest thing I've ever built. For now there is no UI because the focus as been on getting
// the math to work. This is a very elaborate combinatorics algorithm that's been designed to run
// super fast and in javascript without any libraries.

// Sorry for any jankiess in the code. I work in data science, not software engineering.
// See comments in updateTypes and updateCombos() for changes needed to support rage / typhon lines.
// Because I'm allowing gate and throne to search for rage, it will inadvertently make rage lines live
// even if not included in the deck.


// global variable as object
var scenario1 = {
  deck: new Map(),
  handSize: 5,
  types: new Map(),
  searchers: new Map(),
  reversedSearchers: new Map(),
  substitutionLimits: new Map(),
  combos: new Array()
};

scenario1.deck = new Map();
scenario1.deck.set('throne', 3);
scenario1.deck.set('gate', 3);
scenario1.deck.set('kepler', 3);
scenario1.deck.set('count', 3);
scenario1.deck.set('cope', 3);
scenario1.deck.set('gryphon', 3);
scenario1.deck.set('scale', 1);
scenario1.deck.set('swirl', 3);
scenario1.deck.set('lamia', 1);
scenario1.deck.set('thomas', 1);
scenario1.deck.set('orthros', 1);
scenario1.deck.set('ragnarok', 1);
scenario1.deck.set('necro', 1);
scenario1.deck.set('swamp', 1);
scenario1.deck.set('headhunt', 1);
scenario1.deck.set('techs',11)	

// this is for a second set of ratios
var scenario2 = {
  deck: new Map(),
  handSize: 5,
  types: new Map(),
  searchers: new Map(),
  reversedSearchers: new Map(),
  substitutionLimits: new Map(),
  combos: new Array()
};

scenario2.deck = new Map();
scenario2.deck.set('throne', 2);
scenario2.deck.set('gate', 3);
scenario2.deck.set('kepler', 3);
scenario2.deck.set('count', 3);
scenario2.deck.set('cope', 2);
scenario2.deck.set('gryphon', 3);
scenario2.deck.set('scale', 1);
scenario2.deck.set('swirl', 3);
scenario2.deck.set('lamia', 1);
scenario2.deck.set('thomas', 1);
scenario2.deck.set('orthros', 1);
scenario2.deck.set('ragnarok', 1);
scenario2.deck.set('necro', 1);
scenario2.deck.set('swamp', 1);
scenario2.deck.set('headhunt', 1);
scenario2.deck.set('techs',13)

// global functions
// How do I reverse a map in javascript where the initial map has strings as keys and array of keys as the values?
function reverseMap(originalMap) {
    const reversedMap = new Map();

    // Iterate over each entry in the original map
    for (const [key, values] of originalMap) {
        // For each value in the array, add the key to the reversed map
        values.forEach(value => {
            // If the value already exists as a key in reversedMap, push the original key to its array
            if (reversedMap.has(value)) {
                reversedMap.get(value).push(key);
            } else {
                // Otherwise, create a new array with the original key
                reversedMap.set(value, [key]);
            }
        });
    }

    return reversedMap;
};


// Given an array of strings, how do I convert those into a map where the key is the string and the value is the count.
function countCards(array) {
    const map = new Map();

    // Iterate over the array and count occurrences of each string
    for (let str of array) {
        if (map.has(str)) {
            // If the string is already in the map, increment the count
            map.set(str, map.get(str) + 1);
        } else {
            // If the string is not in the map, add it with an initial count of 1
            map.set(str, 1);
        }
    }

    return map;
};

function dedupeMaps(arrayOfMaps) {
    const seen = new Set();  // A set to store serialized maps
    const uniqueMaps = [];   // Array to store unique maps

    // Iterate over the array of maps
    for (let map of arrayOfMaps) {
        // Serialize the map by converting it to a sorted string (to handle key order)
        const serializedMap = JSON.stringify([...map.entries()].sort());

        // If the map hasn't been seen before, add it to the uniqueMaps array
        if (!seen.has(serializedMap)) {
            seen.add(serializedMap);
            uniqueMaps.push(map);
        }
    }

    return uniqueMaps;
};

// How do I filter an array of maps of string to counts in javascript to make sure that none of the counts exceed the values for those keys in a different map? If a key is not found in the reference map, that's ok. If the key is in the reference map but the value exceeds the limit, remove that entire map from the array.
function filterMaps(arrayOfMaps, referenceMap) {
  return arrayOfMaps.filter(map => {
    // Iterate through each key-value pair in the current map
    for (let [key, count] of map) {
      // Check if the key exists in the reference map and if the count exceeds the limit
      if (referenceMap.has(key) && count > referenceMap.get(key)) {
        return false;  // If the count exceeds the reference limit, exclude this map
      }
    }
    // If all checks pass, include the map
    return true;
  });
};

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

// makes sure that matches have sufficient number of cards in the deck
function deckCheck(match, calc = scenario1) {
	const hasCards = [...match].every(([key, value]) => value <= calc.deck.get(key))
	return hasCards
}


/* start of deck scenario calc */

// declare types
function updateTypes(calc = scenario1) {
	// How do I convert one map into another map where every value is 1?
	function convertToOne(originalMap) {
	    const newMap = new Map();

	    // Iterate over each entry in the original map
	    for (const [key, value] of originalMap) {
	        // Set the key in the new map with value 1
	        newMap.set(key, 1);
	    }

	    return newMap;
	}

	calc.types = new Map();
	calc.types.set('anyDD', []);
	calc.types.get('anyDD').push('kepler');
	calc.types.get('anyDD').push('count');
	calc.types.get('anyDD').push('cope');
	calc.types.get('anyDD').push('gryphon');
	calc.types.get('anyDD').push('scale');
	calc.types.get('anyDD').push('swirl');
	calc.types.get('anyDD').push('lamia');
	calc.types.get('anyDD').push('thomas');
	calc.types.get('anyDD').push('orthros');
	calc.types.get('anyDD').push('ragnarok');
	calc.types.get('anyDD').push('necro');
	calc.types.get('anyDD').push('rage');
	calc.types.get('anyDD').push('cerberus');
	calc.types.get('anyDD').push('typhon');
	// gate is technically not a dd. adding anyDD to search potential for gate
	//calc.types.get('anyDD').push('gate');

	calc.types.set('pend4', []);
	calc.types.get('pend4').push('cope');
	calc.types.get('pend4').push('gryphon');
	calc.types.get('pend4').push('orthros');
	calc.types.get('pend4').push('cerberus');

	calc.types.set('DD5', []);
	calc.types.get('DD5').push('count');
	calc.types.get('DD5').push('thomas');
	calc.types.get('DD5').push('ragnarok');
	calc.types.get('DD5').push('rage'); 
	calc.types.get('DD5').push('typhon');

	calc.types.set('typhonPartner', []);
	calc.types.get('typhonPartner').push('gate');
	calc.types.get('typhonPartner').push('kepler');
	calc.types.get('typhonPartner').push('cope');
	calc.types.get('typhonPartner').push('gryphon');

	calc.types.set('DD5Partner', []);
	calc.types.get('DD5Partner').push('gate');
	calc.types.get('DD5Partner').push('kepler');
	calc.types.get('DD5Partner').push('cope');

	calc.types.set('anyMonster', []);
	calc.types.get('anyMonster').push('kepler');
	calc.types.get('anyMonster').push('count');
	calc.types.get('anyMonster').push('cope');
	calc.types.get('anyMonster').push('gryphon');
	calc.types.get('anyMonster').push('scale');
	calc.types.get('anyMonster').push('swirl');
	calc.types.get('anyMonster').push('lamia');
	calc.types.get('anyMonster').push('thomas');
	calc.types.get('anyMonster').push('orthros');
	calc.types.get('anyMonster').push('ragnarok');
	calc.types.get('anyMonster').push('necro');
	calc.types.get('anyMonster').push('rage');
	calc.types.get('anyMonster').push('cerberus');
	calc.types.get('anyMonster').push('typhon');

	calc.types.set('anyContract', []);
	calc.types.get('anyContract').push('gate');
	calc.types.get('anyContract').push('swamp');

	calc.searchers = new Map();
	calc.searchers.set('gate', []);
	calc.searchers.get('gate').push('anyDD');
	calc.searchers.get('gate').push('pend4');
	calc.searchers.get('gate').push('DD5');
//	calc.searchers.get('gate').push('kepler'); // gate is not allowed to search kepler because kepler would search gate
	calc.searchers.get('gate').push('count');
	calc.searchers.get('gate').push('cope');
	calc.searchers.get('gate').push('gryphon');
	calc.searchers.get('gate').push('scale');
	calc.searchers.get('gate').push('swirl');
	calc.searchers.get('gate').push('lamia');
	calc.searchers.get('gate').push('thomas');
	calc.searchers.get('gate').push('orthros');
	calc.searchers.get('gate').push('ragnarok');
	calc.searchers.get('gate').push('necro');
//	calc.searchers.get('gate').push('rage'); // rage needs to be turned off when not in the decklist or else this will inflate imperm proof probabilities via gate and throne
	calc.searchers.get('gate').push('cerberus');
	calc.searchers.get('gate').push('typhon');

	calc.searchers.set('throne', []);
	calc.searchers.get('throne').push('kepler');
	calc.searchers.get('throne').push('cope');
//	calc.searchers.get('throne').push('rage'); // rage needs to be turned off when not in the decklist or else this will inflate imperm proof probabilities via gate and throne
	calc.reversedSearchers = reverseMap(calc.searchers);
	calc.substitutionLimits = convertToOne(calc.searchers);
	// types aren't real cards and can't be allowed in results
	calc.types.forEach((value, key) => {
		calc.substitutionLimits.set(key, 0);
	});
};

// read in the combos
function updateCombos(calc = scenario1) {
	calc.combos = new Array();
/*	let newCombo = new Map([
		['name', 'full combo'],
		['pieces', ['cope', 'gryphon']],
		['rating', 4]]);
	console.log(newCombo);
*/
	calc.combos.push(new Map([
		['name', 'full combo'],
		['pieces', ['cope', 'gryphon']],
		['rating', 4]
		])
	);
	calc.combos.push(new Map([
		['name', 'gate'],
		['pieces', ['gate']],
		['rating', 2]
		])
	);
	calc.combos.push(new Map([
		['name', 'kepler'],
		['pieces', ['kepler']],
		['rating', 2]
		])
	);
	calc.combos.push(new Map([
		['name', 'count'],
		['pieces', ['count', 'anyDD']],
		['rating', 2]
		])
	);
	calc.combos.push(new Map([
		['name', 'cope pend4'],
		['pieces', ['cope', 'pend4']],
		['rating', 3]
		])
	);
	calc.combos.push(new Map([
		['name', 'gryphon pend4'],
		['pieces', ['gryphon', 'pend4']],
		['rating', 3]
		])
	);
	calc.combos.push(new Map([
		['name', 'target proof'],
		['pieces', ['swirl', 'gryphon', 'anyDD']],
		['rating', 5]
		])
	);
	// need to comment this out when not playing typhon. I don't have a simple fix for this edge case yet.
/*
	calc.combos.push(new Map([
		['name', 'imperm proof typhon'],
		['pieces', ['swirl', 'typhon', 'typhonPartner']],
		['rating', 5]
		])
	);
*/
	// cope would work cuz of scale, gate would work cuz of cope, kepler would work for gate into scale, gryphon only works with typhon
	calc.combos.push(new Map([
		['name', 'imperm proof DD5'],
		['pieces', ['swirl', 'DD5', 'DD5Partner']],
		['rating', 5]
		])
	);
	// need to comment this out when not playing rage. I don't have a simple fix for this edge case yet.
/*
	calc.combos.push(new Map([
		['name', 'handtrap proof'],
		['pieces', ['swirl', 'rage', 'kepler']],
		['rating', 5]
		])
	);
*/
	calc.combos.push(new Map([
		['name', 'swirl gryphon anyDD'],
		['pieces', ['swirl', 'gryphon', 'anyDD']],
		['rating', 3]
		])
	);
	calc.combos.push(new Map([
		['name', 'swirl pend4 pend4'],
		['pieces', ['swirl', 'pend4', 'pend4']],
		['rating', 2]
		])
	);
};


function matchCombos(calc = scenario1) {
	// this has been edited so every value can be substituted by itself
	function generateVariants(array, setup = calc) {
	    // Helper function to resolve substitutes from both maps
	    function resolveSubstitute(value, visited = new Set()) {
	        // If the value has already been visited, prevent infinite recursion
	        if (visited.has(value)) return [value];
	        visited.add(value);

	        // Check if the value is a key in map1 or map2, and resolve accordingly
	        let substitutes = [];
	        
	        // Resolve from map1 if the value is a key
	        if (setup.types.has(value)) {
	            substitutes = setup.types.get(value).flatMap(substitute =>
	                resolveSubstitute(substitute, visited)
	            );
	        }
	        // Resolve from map2 if the value is a key
	        if (setup.reversedSearchers.has(value)) {
	            substitutes = substitutes.concat(setup.reversedSearchers.get(value).flatMap(substitute =>
	                resolveSubstitute(substitute, visited))
	            );
	        }
	        // If it's not a key in either map, return the value itself
	        substitutes = substitutes.concat([value]);
	        
	        return [...new Set(substitutes)];
	    }

	    // Generate the substitute options for each element in the input array
	    const substituteOptions = array.map(value => resolveSubstitute(value));

	    // Helper function to generate cartesian product (all combinations)
	    function cartesianProduct(arrays) {
	        if (arrays.length === 0) return [[]];
	        
	        const [first, ...rest] = arrays;
	        const restCombinations = cartesianProduct(rest);
	        
	        const result = [];
	        for (let value of first) {
	            for (let combination of restCombinations) {
	                result.push([value, ...combination]);
	            }
	        }
	        
	        return result;
	    }

	    // Generate all possible combinations using the cartesian product
	    return cartesianProduct(substituteOptions);
	};

	calc.combos.forEach(eachCombo => {
		let basicMatches = generateVariants(eachCombo.get('pieces'), calc);
		let dictMatches = basicMatches.map(element => countCards(element));
		let dedupedMatches = dedupeMaps(dictMatches);
		let substitutionLimits = filterMaps(dedupedMatches, calc.substitutionLimits);
		let deckChecked = substitutionLimits.filter(match => deckCheck(match, calc));
		eachCombo.set('matches', deckChecked);
	});

};

function registerMatchPieces(calc = scenario1) {
	// first step is to grab all the combo pieces
	let matchPieces = new Set();
	calc.combos.forEach(eachCombo => {
		eachCombo.get('matches').forEach(eachMatch => {
			eachMatch.keys().forEach(eachKey => {
				matchPieces.add(eachKey);
			});
		});
	});
	let cardsInDeck = new Set(calc.deck.keys());
	let intersection = new Set([...matchPieces].filter(x => cardsInDeck.has(x)));
	calc.matchPieces = Array.from(intersection).sort();
};

function deckAsTuple(calc = scenario1) {
	calc.deckAsTuple = new Array();
	indexForBlanks = calc.matchPieces.length;
	calc.deckAsTuple[indexForBlanks] = 0;

	calc.deck.forEach((value, key) => {
		let matchIndex = calc.matchPieces.indexOf(key);
		if (matchIndex > -1) {
			calc.deckAsTuple[matchIndex] = value;
		} else {
			calc.deckAsTuple[indexForBlanks] += value;
		}
	});
};

// This is a small rewrite of my existing composition function.
// arrays as references in memory. arrays as keys in map can be different even if the keys are the same.
function generateCompositions(calc = scenario1, handSize = scenario1.handSize) {
    // this function handles generating the compositions by moving through one index position at a time.
    // the output is a hash of arrays that has the compositions as arrays, counts as integers, and one number for the denominator.
    var results = [];
    const deckLength = calc.deckAsTuple.length;

    function iterateThroughIndex(currentIndex, assignedComposition, unAssignedCount) {
        // if every card has been assigned, then I pad elements and append the composition
        if (unAssignedCount == 0) { // pad the assignedComposition and append the results
            const padArray = Array(deckLength - assignedComposition.length).fill(0);
            const paddedAssignment = assignedComposition.concat(padArray);
            results.push(paddedAssignment);
        } else if (currentIndex > deckLength) {
            alert("terminate");
        } else { // if there is still assignment to do, add 1 more element to assignedComposition and move to the next index position
            var constraint = calc.deckAsTuple[currentIndex];
            // if currentIndex has exceeded the deck size, constraint becomes undefined and the for loop will not run
            for (let i = 0; i <= Math.min(constraint, unAssignedCount); i++) {
                var newAssignedComposition = [...assignedComposition];
                newAssignedComposition.push(i);
                iterateThroughIndex(currentIndex + 1, newAssignedComposition, unAssignedCount - i);
            }
        }
    }

    iterateThroughIndex(0, [], handSize);
    
    // calc.tupleCount = new Map();

    var resultsCount = [];
    results.forEach( r => {
        var product = 1;
        for (let i = 0; i < r.length; i++) {
            product = product * nChooseK(calc.deckAsTuple[i], r[i]);
        }
        resultsCount.push(product);
        // calc.tupleCount.set(r, product);
    })
    const cardsInDeck = calc.deckAsTuple.reduce((a, b) => parseInt(a) + parseInt(b));
    const denominator = nChooseK(cardsInDeck, handSize);
    //calc.denominator = nChooseK(cardsInDeck, handSize);
    //calc.results = results;
    //calc.resultsCount = resultsCount;

    // return {"compositions": results, "counts": resultsCount, "denominator": denominator, "cards_in_deck":cardsInDeck, "deck": calc.deckAsTuple}
    calc.compositionHash = {"compositions": results, "counts": resultsCount, "denominator": denominator, "cards_in_deck":cardsInDeck, "deck": calc.deckAsTuple}
};

// this is redundant with the way I wrote indexTuple
function matchPiecesAsTuple(calc = scenario1) {
	calc.combos.forEach(eachCombo => {
		let tupleSet = new Set();
		eachCombo.get('matches').forEach(eachMatch => {
			let newTuple = new Array(calc.matchPieces.length + 1).fill(0);
			eachMatch.forEach((value, key) => {
				newTuple[calc.matchPieces.indexOf(key)] = value;
			});
			tupleSet.add(newTuple);
		});
		eachCombo.set('tupleSet', tupleSet);
	});
};

function indexTuples(calc = scenario1) {
	function compareMapToTuple(inputMap, inputTuple, calc = scenario1) {
		const comparisonResult = [...inputMap].every(([key, value]) => inputTuple[calc.matchPieces.indexOf(key)] >= value);
		return comparisonResult;
	};

	function resetIndexTuples(calc = scenario1) {
		calc.combos.forEach(eachCombo => {
			eachCombo.set('tupleIndex', []);
			eachCombo.set('count', 0);
		});
	};

	// for every composition result
	// check every combo
	// for every tuple in the set
	// if one is a subset of the other
	// add that index position to the combo
	resetIndexTuples(calc);
	let currentIndex = 0;
	calc.compositionHash['compositions'].forEach(eachComposition => {
		calc.combos.forEach(eachCombo => {
			const matchToComposition = eachCombo.get('matches').some(matchMap => compareMapToTuple(matchMap, eachComposition, calc));
			if (matchToComposition) {
				eachCombo.get('tupleIndex').push(currentIndex);
				eachCombo.set('count', eachCombo.get('count') + calc.compositionHash['counts'][currentIndex]);
			};
		});
		currentIndex += 1;
	});

	// go through all combos again and set the probability
	calc.combos.forEach(eachCombo => {
		eachCombo.set('probability', eachCombo.get('count') / calc.compositionHash['denominator']);
	});
};

// for every index involved in combos, reassign them to the highest tier.
function consolidateTiers(calc = scenario1) {
	let highestRating = new Map();
	let comboName = new Map();

	calc.combos.forEach(eachCombo => {
		const rating = eachCombo.get('rating');
		eachCombo.get('tupleIndex').forEach(eachIndex => {
			if (highestRating.has(eachIndex)) {
				const currentHighest = highestRating.get(eachIndex);
		        // Store the highest rating
		        highestRating.set(eachIndex, Math.max(currentHighest, rating));
			} else {
				 highestRating.set(eachIndex, rating);
			};
			if (comboName.has(rating)) {
				comboName.get(rating).add(eachCombo.get('name'));
			} else {
				comboName.set(rating, new Set([eachCombo.get('name')]));
			};
		});
	});

	// for every rating. look up the count
	let ratingCount = new Map();
	highestRating.forEach((value, key) => {
		if (ratingCount.has(value)) {
			ratingCount.set(value, ratingCount.get(value) + calc.compositionHash['counts'][key]);
		} else {
			ratingCount.set(value, calc.compositionHash['counts'][key]);
		};
	});

	let tierProbabilities = new Map();
	ratingCount.forEach((value, key) => {
		tierProbabilities.set(key, value  / calc.compositionHash['denominator']);
	});

	calc.tiers = new Array();
	countTotal = 0;
	probabilityTotal = 0;
	[...comboName.keys()].sort((a, b) => b - a).forEach(tier => {
		let tierResult = new Map();
		tierResult.set('rating', tier);
		tierResult.set('comboName', comboName.get(tier));
		tierResult.set('count', ratingCount.get(tier));
		tierResult.set('probability', tierProbabilities.get(tier));
		calc.tiers.push(tierResult);
		countTotal += ratingCount.get(tier);
		probabilityTotal += tierProbabilities.get(tier);
	});
	let brickResult = new Map();
	brickResult.set('rating', 0);
	brickResult.set('comboName', new Set(['__BRICK__']));
	brickResult.set('count', calc.compositionHash['denominator'] - countTotal);
	brickResult.set('probability', 1 - probabilityTotal);
	calc.tiers.push(brickResult);
};

function printResults(calc = scenario1) {
	console.log('deckList:');
	console.log(calc.deck);
	console.log('deckSize');
	console.log(calc.deckAsTuple.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
	console.log('tierResults:');
	console.log(calc.tiers);
	console.log('combos');
	calc.combos.forEach(eachCombo => {
		let printMap = new Map(eachCombo);
		printMap.delete('matches');
		printMap.delete('tupleIndex');
		console.log(printMap);
	});
};

function fullRun(calc = scenario1) {
	updateTypes(calc);
	updateCombos(calc);
	matchCombos(calc);
	registerMatchPieces(calc);
	deckAsTuple(calc);
	generateCompositions(calc, calc.handSize);
	//matchPiecesAsTuple(calc);
	indexTuples(calc);
	consolidateTiers(calc);
	printResults(calc);
};

// this runs all the calcs
fullRun(scenario1);

// this repeats the run using different ratios
fullRun(scenario2)