var computer = new Player('computer');
computer.knownCards = [];
computer.difficulty = 5;
$('.computer-difficulty').change(function() {
  computer.difficulty = parseInt($(this).val());
})
for (var i = 0; i < 14; i++) {
  computer.knownCards.push([])
}
computer.addKnownCard = function(card) {
  if (computer.knownCards[card.getRawNumber()].indexOf(card) == -1) {
    computer.knownCards[card.getRawNumber()].push(card);
  }
}
computer.makeMoves = function() {
  for (var i = 0; i < 14; i++) {
    for (var j = computer.knownCards[i].length - 1; j >= 0; j--) {
      if (computer.knownCards[i][j].matched) {
        computer.knownCards[i].splice(j, 1);
      }
    }
  }
  var matches = computer.knownCards
    .filter(function(a){return a.length >= 2})
    .reduce(function(a,b) {return a.concat(b)}, []);

  var firstMatchableCardIndex, secondMatchableCardIndex;

  var unmatchedCards = cards.filter(function(card) {
    return !card.matched
  });

  if (matches.length >= 2 && Math.random() < 0.1 * computer.difficulty) {
    firstMatchableCardIndex = unmatchedCards.indexOf(matches[0]);
    secondMatchableCardIndex = unmatchedCards.indexOf(matches[1]);
  }

  if (unmatchedCards.length == 2) {
    firstMatchableCardIndex = 0;
    secondMatchableCardIndex = 1;
  }


  setTimeout(function() {
    var firstChosenCardIndex = firstMatchableCardIndex || Math.floor(Math.random() * unmatchedCards.length);
    var firstCardLocation = cards.indexOf(unmatchedCards[firstChosenCardIndex]);
    var firstCard = cards[firstCardLocation];

    computer.addKnownCard(firstCard);

    $(firstCard.getElement()).click();
    setTimeout(function() {
      var secondChosenCardIndex;
      do {
       secondChosenCardIndex = secondMatchableCardIndex || Math.floor(Math.random() * unmatchedCards.length);
      } while (secondChosenCardIndex == firstChosenCardIndex);
      var secondCardLocation = cards.indexOf(unmatchedCards[secondChosenCardIndex]);
      var secondCard = cards[secondCardLocation];

      computer.addKnownCard(secondCard);

      $(secondCard.getElement()).click();
    }, 500);
  }, 500);
}