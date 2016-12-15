var computer = new Player('computer');

/**
 * Keeps track of all the cards the computer has seen, either by flipping cards itself or by observing the player's flips.
 * @type {Array}
 */
computer.knownCards = [];

for (var i = 0; i < 14; i++) {
  computer.knownCards.push([])
}

computer.addKnownCard = function(card) {
  if (computer.knownCards[card.getRawNumber()].indexOf(card) === -1) {
    computer.knownCards[card.getRawNumber()].push(card);
  }
}

/**
 * Essentially a multiplier for the match rate. 
 * A difficulty of 10 means that the computer 
 * will always choose a match it knows about, 
 * whereas a difficulty of 5 means it will do 
 * so with a 50% probability.
 * @type {Number}
 */
computer.difficulty = 5;

$('.computer-difficulty').change(function() {
  computer.difficulty = parseInt($(this).val());
})

/**
 * Find a match amongst known cards
 */
computer.findMatches = function() {
  return computer.knownCards
  .filter(function(a){return a.length >= 2})
  .reduce(function(a,b) {return a.concat(b)}, []);
}

/**
 * Choose the matched cards with a probability based on the difficulty setting
 */
computer.hasMatch = function(matches) {
  return matches.length >= 2 && Math.random() < 0.1 * computer.difficulty;
}

/**
 * This is where all of the AI logic happens. 
 * The computer keeps track of all cards it has seen,
 * and either chooses matches it knows about (with a 
 * probability weighted by the difficulty setting)
 * or chooses cards randomly.
 */
computer.makeMoves = function() {

  // Clear out any known cards that have already been matched
  for (var i = 0; i < 14; i++) {
    for (var j = computer.knownCards[i].length - 1; j >= 0; j--) {
      if (computer.knownCards[i][j].matched) {
        computer.knownCards[i].splice(j, 1);
      }
    }
  }

  var firstMatchableCardIndex, secondMatchableCardIndex;

  var unmatchedCards = cards.filter(function(card) {
    return !card.matched
  });

  var matches = computer.findMatches();

  if (computer.hasMatch(matches)) {
    firstMatchableCardIndex = unmatchedCards.indexOf(matches[0]);
    secondMatchableCardIndex = unmatchedCards.indexOf(matches[1]);
  }

  // Edge case for when the game is down to two cards
  if (unmatchedCards.length === 2) {
    firstMatchableCardIndex = 0;
    secondMatchableCardIndex = 1;
  }

  setTimeout(function() {
    // Choose the matched card if present, otherwise choose randomly.
    var firstChosenCardIndex = firstMatchableCardIndex !== undefined ? firstMatchableCardIndex : Math.floor(Math.random() * unmatchedCards.length);
    var firstCardLocation = cards.indexOf(unmatchedCards[firstChosenCardIndex]);
    var firstCard = cards[firstCardLocation];

    computer.addKnownCard(firstCard);

    $(firstCard.getElement()).click();

    setTimeout(function() {
      // Remove first card we chose so we don't choose it again
      if (unmatchedCards.length > 2) {
      unmatchedCards.splice(firstChosenCardIndex, 1);
      }

      // Recalculate matches after flipping the first card.
      matches = computer.findMatches();
      if (computer.hasMatch(matches)) {
        for (var i = 0; i < matches.length; i++) {
          if (firstCard !== matches[i]) {  
            secondMatchableCardIndex = unmatchedCards.indexOf(matches[i]);
            break;
          }
        }
      }
      
      var secondChosenCardIndex = secondMatchableCardIndex !== undefined ? secondMatchableCardIndex :Math.floor(Math.random() * (unmatchedCards.length - 1));
      var secondCardLocation = cards.indexOf(unmatchedCards[secondChosenCardIndex]);
      var secondCard = cards[secondCardLocation];

      computer.addKnownCard(secondCard);

      $(secondCard.getElement()).click();
    }, 500);
  }, 500);
}