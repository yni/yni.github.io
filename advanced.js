$(function() {
  //jquery methods go here

  //basic controls
  //add card
  $('#btn_add_card').click(function() {
    var card = document.createElement('form');
    card.classList.add('card');

    var cardName = document.createElement('input');
    cardName.classList.add('card_name');
    cardName.setAttribute('type', 'text');
    var cardIndex = getMaxByPattern(listUniqueValuesByClass('card_name'), 'card') + 1 ;
    cardName.setAttribute('value', 'card' + cardIndex.toString());

    var cardCount = document.createElement('input');
    cardCount.classList.add('card_count');
    cardCount.setAttribute('type', 'number');
    cardCount.setAttribute('value', 3);
    cardCount.setAttribute('min', 0);
    cardCount.setAttribute('onchange', 'updateTotalCards()');

    var btnRemoveCard = document.createElement('button'); //button
    btnRemoveCard.setAttribute('type', 'button');
    btnRemoveCard.innerText = 'remove';
    btnRemoveCard.setAttribute('onclick', 'this.parentNode.remove(); updateTotalCards()');

    card.appendChild(cardName);
    card.appendChild(cardCount);
    card.appendChild(btnRemoveCard);
    document.getElementById('ctn_deck').appendChild(card);

    updateTotalCards();
  });

  //add type
  $('#btn_add_type').click(function() {
    var type = document.createElement('form');
    type.classList.add('type');

    var typeName = document.createElement('input');
    typeName.classList.add('type_name');
    typeName.setAttribute('type', 'text');
    var typeIndex = getMaxByPattern(listUniqueValuesByClass('type_name'), 'type') + 1 ;
    typeName.setAttribute('value', 'type' + typeIndex.toString());

    var typeMulti = document.createElement('select');
    typeMulti.classList.add('type_multi');
    typeMulti.setAttribute('multiple', 'multiple');

    var btnRemoveType = document.createElement('button');
    btnRemoveType.setAttribute('type', 'button');
    btnRemoveType.innerText = 'remove';
    btnRemoveType.setAttribute('onclick', 'this.parentNode.remove()');

    var btnCopyType = document.createElement('button');
    btnCopyType.classList.add('btn_copy_type');
    btnCopyType.setAttribute('type', 'button');
    btnCopyType.innerText = 'copy';

    type.appendChild(typeName);
    type.appendChild(typeMulti);
    type.appendChild(btnRemoveType);
    type.appendChild(btnCopyType);

    document.getElementById('ctn_type').appendChild(type);
    $('#ctn_type .type .type_multi').last().select2();
    $('#ctn_type .type .btn_copy_type').last().click(function() {
      var copyFrom = $(this).closest('.type').children('.type_multi');
      copyType(copyFrom);
    });

/*
    $('#ctn_deck .card .card_name').each(function(i, n) {
      console.log($(this).attr('value'));
    });
*/
    //for latest multi_type add the option
    newOptionsToLastTypeMulti(listUniqueValuesByClass('card_name'));
  });

  //unique values by class
  function listUniqueValuesByClass(className) {
    var matchList = [];
    const matches = document.getElementsByClassName(className);
    for (let i = 0; i < matches.length; i++) {
      matchList.push(matches[i].value);
    };
    return [... new Set(matchList)];
  };

  //get the max value to increment by 1 for index
  function getMaxByPattern(inputArray, pattern) {
    var patternMatches = inputArray.filter(x => x.startsWith(pattern)).map(y => parseInt(y.replace(pattern, '')));
    var maxMatch = 0;
    patternMatches.forEach((x) => {
      if (x > maxMatch) {
        maxMatch = x;
      };
    });
    return maxMatch;
  };

  //adds updated options to last type multi selector2
  function newOptionsToLastTypeMulti(uniqueCardNames) {
    uniqueCardNames.forEach((x, i) => {
      var newOption = new Option(x, i, false, false);
      $('#ctn_type .type .type_multi').last().append(newOption).trigger('change');
    });
  };

  //adds updated options to last combo multi selector2
  function newOptionsToLastComboMulti(uniqueCardNames, uniqueTypeNames) {
    const allUniqueNames = uniqueCardNames.concat(uniqueTypeNames);
    allUniqueNames.forEach((x, i) => {
      var newOption = new Option(x, i, false, false);
      $('#ctn_combo .combo .combo_multi').last().append(newOption).trigger('change');
    });
  };

  function copyType(multiFrom) {
    $('#btn_add_type').trigger('click');
    $('.type_multi').last().val(multiFrom.val()).trigger("change");
  };

  function copyCombo(multiFrom, ratingFrom) {
    $('#btn_add_combo').trigger('click');
    $('.combo_multi').last().val(multiFrom.val()).trigger("change");
    $('.combo_rating').last().val(ratingFrom.val()).trigger("change");
  };

  $('#btn_reset_deck').click(function() {
    $('#ctn_deck').empty();
    $('#ctn_type').empty();
    updateTotalCards();
  });

  $('#btn_add_combo').click(function() {
    var combo = document.createElement('form');
    combo.classList.add('combo');

    var comboName = document.createElement('input');
    comboName.classList.add('combo_name');
    comboName.setAttribute('type', 'hidden');
    var comboIndex = getMaxByPattern(listUniqueValuesByClass('combo_name'), 'combo') + 1 ;
    comboName.setAttribute('value', 'combo' + comboIndex.toString());  

    var comboMulti = document.createElement('select');
    comboMulti.classList.add('combo_multi');
    comboMulti.setAttribute('multiple', 'multiple');

    var btnRemoveCombo = document.createElement('button');
    btnRemoveCombo.setAttribute('type', 'button');
    btnRemoveCombo.innerText = 'remove';
    btnRemoveCombo.setAttribute('onclick', 'this.parentNode.remove()');

    var btnCopyCombo = document.createElement('button');
    btnCopyCombo.classList.add('btn_copy_combo');
    btnCopyCombo.setAttribute('type', 'button');
    btnCopyCombo.innerText = 'copy';

    var btnCalcCombo = document.createElement('button');
    btnCalcCombo.classList.add('btn_calculate_combo');
    btnCalcCombo.setAttribute('type', 'button');
    btnCalcCombo.innerText = 'calculate';
    
    var comboText = document.createElement('i');
    comboText.classList.add('combo_text');
    comboText.innerText = '  __% '; 

    var comboRating = document.createElement('input');
    comboRating.classList.add('combo_rating');
    comboRating.setAttribute('type', 'number');
    comboRating.setAttribute('value', 1);
    comboRating.setAttribute('min', 0);
    comboRating.style.display = "none";

    combo.appendChild(comboName);
    combo.appendChild(comboMulti);
    combo.appendChild(btnRemoveCombo);
    combo.appendChild(btnCopyCombo);
    combo.appendChild(btnCalcCombo);
    combo.appendChild(comboText);
    combo.appendChild(comboRating);
    
    document.getElementById('ctn_combo').appendChild(combo);

    $('#ctn_combo .combo .combo_multi').last().select2();
    
    $('#ctn_combo .combo .btn_copy_combo').last().click(function() {
      var fromCombo = $(this).closest('.combo').children('.combo_multi');
      var fromRating = $(this).closest('.combo').children('.combo_rating');
      copyCombo(fromCombo, fromRating);
    });

    $('#ctn_combo .combo .btn_calculate_combo').last().click(function() {
      //need to calculate here
      //var thisComboMulti = $(this).closest('.combo').children('.combo_multi');
      //calculateCombo(thisComboMulti);
      var thisComboName = $(this).closest('.combo').children('.combo_name').val();
      var thisCombo = $(this).closest('.combo');
      calculateCombo(thisComboName, thisCombo);
      //alert('calculate');
    });

    newOptionsToLastComboMulti(listUniqueValuesByClass('card_name'), listUniqueValuesByClass('type_name'));
  });

  //finalize deck and types for combos
  //calculate probability
  //store current run for comparison

  //controls of dynamic html elements
  //functions that do nothing because of better js or jquery implementation
/*  $('.btn_remove_card').click() //remove card
  $('.btn_remove_type').click(); // also does nothing beause it's js. it's also not created before the element
  $('.btn_copy_type').click(); //this has also been changed to do nothing
  $('.btn_remove_combo').click();
  $('.btn_duplicate_combo').click();
*/

  //complicated options updates necessary. each new select2, included ones created by copy will have latest set of options
  //this avoids removing all existing selections by updating all options.
  //if an option is removed, it will take away from all selectors
  
  //allow duplicate selection

  //this adds the first card
  $("#btn_add_card").trigger("click");
});