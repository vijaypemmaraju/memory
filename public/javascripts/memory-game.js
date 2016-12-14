var flipCount = 0;
var cardFiles = ["10_of_clubs.png", "10_of_diamonds.png", "10_of_hearts.png", "10_of_spades.png", "2_of_clubs.png", "2_of_diamonds.png", "2_of_hearts.png", "2_of_spades.png", "3_of_clubs.png", "3_of_diamonds.png", "3_of_hearts.png", "3_of_spades.png", "4_of_clubs.png", "4_of_diamonds.png", "4_of_hearts.png", "4_of_spades.png", "5_of_clubs.png", "5_of_diamonds.png", "5_of_hearts.png", "5_of_spades.png", "6_of_clubs.png", "6_of_diamonds.png", "6_of_hearts.png", "6_of_spades.png", "7_of_clubs.png", "7_of_diamonds.png", "7_of_hearts.png", "7_of_spades.png", "8_of_clubs.png", "8_of_diamonds.png", "8_of_hearts.png", "8_of_spades.png", "9_of_clubs.png", "9_of_diamonds.png", "9_of_hearts.png", "9_of_spades.png", "ace_of_clubs.png", "ace_of_diamonds.png", "ace_of_hearts.png", "ace_of_spades.png", "jack_of_clubs.png", "jack_of_diamonds.png", "jack_of_hearts.png", "jack_of_spades.png", "king_of_clubs.png", "king_of_diamonds.png", "king_of_hearts.png", "king_of_spades.png", "queen_of_clubs.png", "queen_of_diamonds.png", "queen_of_hearts.png", "queen_of_spades.png"]

var cards = [];
shuffle(cardFiles);
var flippedCards = [];
var gameState = {
  yourTurn: true
};
var player = new Player('player');
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
    console.log("first:" + firstChosenCardIndex);
    var firstCardLocation = cards.indexOf(unmatchedCards[firstChosenCardIndex]);
    var firstCard = cards[firstCardLocation];

    computer.addKnownCard(firstCard);

    $(firstCard.getElement()).click();
    setTimeout(function() {
      var secondChosenCardIndex;
      do {
       secondChosenCardIndex = secondMatchableCardIndex || Math.floor(Math.random() * unmatchedCards.length);
      console.log("second:" + secondChosenCardIndex);
      } while (secondChosenCardIndex == firstChosenCardIndex);
      var secondCardLocation = cards.indexOf(unmatchedCards[secondChosenCardIndex]);
      var secondCard = cards[secondCardLocation];

      computer.addKnownCard(secondCard);

      $(secondCard.getElement()).click();
    }, 500);
  }, 500);
}
var currentPlayer = player;

$(document).ready(function() {
  cards.forEach(function(card) {
    card.flipped = !card.flipped;
    card.redraw();
  });
  renderSidebar();
});

cardFiles.forEach(function(cardFile) {
  var split = cardFile.split("_");
  var card = new Card(split[0], split[2].split(".")[0]);
  cards.push(card);
  var result = $('.cards').append(card.getHtml());
});

function renderSidebar() {
  $('.' + currentPlayer.name + '-match-count span').html(currentPlayer.matchCount);
  if (gameState.yourTurn) {
    $('.turn').text('It is your turn.');
  } else {
    $('.turn').text('It is the computer\'s turn.');
  }
}

function changeTurns() {
  gameState.yourTurn = !gameState.yourTurn;
  if (gameState.yourTurn) {
    currentPlayer = player;
  } else {
    currentPlayer = computer;
    computer.makeMoves();
  }
  renderSidebar();
}

function isCurrentPlayer(e) {
  return (currentPlayer == player && e.originalEvent && player.hasControl) || (currentPlayer == computer && e.originalEvent == null)
}



$(document).on('click', '.cards .card', function(e) {
  console.log(currentPlayer.name + " click attempt");
  if (isCurrentPlayer(e)) {
    console.log(currentPlayer.name + " click!");
    var selected = cards[$(this).index()];
    if (selected.flipped && flippedCards.length == 1) {
      return;
    }
    selected.flipped = !selected.flipped;
    if (selected.flipped) {
      flippedCards.push(selected);
      if (flippedCards.length >= 2) {
        if (flippedCards[0].number === flippedCards[1].number) {
          currentPlayer.hasControl = false;
          setTimeout(function() {
            currentPlayer.hasControl = true;
            var $matchedCardPair = $('<div class="matched-card-pair"></div>');
            currentPlayer.matchCount++;
            flippedCards.forEach(function(flippedCard) {
              flippedCard.matched = true;
              flippedCard.getElement().replaceWith(Card.getBlankSpace());
              $matchedCardPair.append(flippedCard.getHtml());
            })
            $('.' + currentPlayer.name + '-matched-cards').append($matchedCardPair);
            if (currentPlayer === computer) {
              computer.makeMoves();
            }
            flippedCards = [];
            renderSidebar();
          }, 50);
        } else {
          currentPlayer.hasControl = false;
          setTimeout(function() {
            currentPlayer.hasControl = true;
            flippedCards.forEach(function(flippedCard) {
              flippedCard.flipped = !flippedCard.flipped;
              flippedCard.getElement().replaceWith(flippedCard.getHtml())
              computer.addKnownCard(flippedCard);
            })
            flippedCards = [];
            changeTurns();
          }, 500);
        }
      }
    } else {
      flippedCards.splice(flippedCards.indexOf(selected), 1);
    }
    $(this).replaceWith(selected.getHtml())
    renderSidebar();
  }
});