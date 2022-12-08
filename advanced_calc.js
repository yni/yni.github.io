function updateTotalCards() {
  var totalCards = 0;
  $('#ctn_deck .card .card_count').each(function(i, n) {
    totalCards += parseInt(n.value);
  });
  $('#total_cards').text(totalCards);
};

//unique values by class
function listAllValuesByClass(className) {
  var matchList = [];
  const matches = document.getElementsByClassName(className);
  for (let i = 0; i < matches.length; i++) {
    matchList.push(matches[i].value);
  };
  return [... matchList];
};

//unique values by class
function listUniqueValuesByClass(className) {
  var matchList = [];
  const matches = document.getElementsByClassName(className);
  for (let i = 0; i < matches.length; i++) {
    matchList.push(matches[i].value);
  };
  return [... new Set(matchList)];
};

function countCardByName(cardName) {
  var cardNameToCount = $('#ctn_deck .card .card_name').filter(function() {return this.value == cardName});
  return parseInt(cardNameToCount.closest('.card').children('.card_count').val());
}

//calculate each combo
function calculateCombo(thisComboName, thisCombo) {
  const cardNameArray = listUniqueValuesByClass('card_name');
  if (cardNameArray.length != listAllValuesByClass('card_name').length) {
    alert('Warning: card names have duplicates. Duplicate entries are ignored.');
  };
  var cardNameHash = {};
  var cardCountHash = {};
  var orderedDeck = []
  cardNameArray.forEach((x, i) => {
    cardNameHash[x] = i;
    const cardToIndexCount = countCardByName(x);
    cardCountHash[x] = cardToIndexCount;
    orderedDeck.push(cardToIndexCount);
  });

  const handSize = $('#hand_size').val();
  const deckCompositions = generateCompositions(orderedDeck, handSize);

  const typeNameArray = listUniqueValuesByClass('type_name');
  var typeToCardHash = {};

  typeNameArray.forEach((x, i) => {
    typeToCardHash[x] = [];
    $('#ctn_type .type .type_name').filter(function() {return this.value == x}).closest('.type').find('.type_multi :selected').each(function() {
      typeToCardHash[x].push($(this)[0].innerText); //weird reference
      //typeToCardHash[x].push($(this).attr('value'));
    });
  });

  const comboNameArray = listUniqueValuesByClass('combo_name');
  var comboToCardTypeHash = {};
  var comboToRatingHash = {};
  comboNameArray.forEach((x, i) => {
    comboToCardTypeHash[x] = new Array();
    $('#ctn_combo .combo .combo_name').filter(function() {return this.value == x}).closest('.combo').find('.combo_multi :selected').each(function() {
      comboToCardTypeHash[x].push($(this)[0].innerText);
    });
    const comboRating = $('#ctn_combo .combo .combo_name').filter(function() {return this.value == x}).closest('.combo').find('.combo_rating').val();
    comboToRatingHash[x] = parseInt(comboRating);
  });
  console.log(comboToCardTypeHash);

  const cartesian = ([...a]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
  var comboHash = {};
  for (let h = 0; h < comboNameArray.length; h++) {
    const key = comboNameArray[h];
    const value = comboToCardTypeHash[key];
    console.log('value');
    console.log(value);
    if (value.length >= 1) {
      var arrayArray = new Array(value.length);
      for (let i = 0; i < value.length; i++) {
        const typeCheck = value[i];
        if (typeNameArray.includes(typeCheck)) {
          arrayArray[i] = typeToCardHash[typeCheck];
        } else {
          arrayArray[i] = [typeCheck].slice();
        };
      };
      var handCardNames = [];
      if (arrayArray.length >= 2) {
        handCardNames = cartesian(arrayArray);
      } else {
        handCardNames = arrayArray;
      };
  
      var handCompose = new Array(handCardNames.length).fill(0);
      for (let i = 0; i < handCompose.length; i++) {
        var composeArray = new Array(orderedDeck.length).fill(0);
        for (let j = 0; j < handCardNames[i].length; j++) {
          var cardNameToIndex = handCardNames[i][j];
          composeArray[cardNameHash[cardNameToIndex]] += 1;
        };
        handCompose[i] = composeArray;
      };
      comboHash[key] = handCompose;
    } else {
      comboHash[key] = [];
    };
  };
  const probabilityCalc = matchToHighestTier(deckCompositions, [comboHash[thisComboName]])['1'];
  console.log(probabilityCalc);
  console.log(thisCombo.children('.combo_text').first().innerText);
  var outputText = '  '.concat((probabilityCalc * 100).toFixed(2).toString()).concat('%');
  thisCombo.children('.combo_text').text(outputText);
};

function mapTypeToCard() {
  var typeToCardMap = {};
  $('.type_multi :selected').each(function() {
    var typeName = $(this).closest('.type').children('.type_name').attr('value');
    var cardName = $(this)[0].innerText;
    if (typeName in typeToCardMap) {
      typeToCardMap[typeName].push(cardName);
    } else {
      typeToCardMap[typeName] = [cardName];
    };
  });
};

function mapComboToCard(fromComboMulti) {
  var comboToCardMap = {};
  fromComboMulti.find(':selected').each(function() {
    var comboName = $(this).closest('.combo').children('.combo_name').attr('value');
    var cardName = $(this)[0].innerText;
    if (comboName in comboToCardMap) {
      comboToCardMap[comboName].push(cardName);
    } else {
      comboToCardMap[comboName] = [cardName];
    };
  });
  console.log(comboToCardMap);
};


function typeMapping() {
/*  var output = [];
  $('.type_multi :selected').each(function() {
    console.log($(this).closest('.type').children('.type_name').attr('value'));
    console.log($(this));
    console.log($(this)[0].innerText);
    console.log($(this).attr('option'));

  });
*/

//    console.log(typeToCardMap);
  console.log(mapComboToCard());
};