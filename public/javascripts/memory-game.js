var cardFiles = ["10_of_clubs.png", "10_of_diamonds.png", "10_of_hearts.png", "10_of_spades.png", "2_of_clubs.png", "2_of_diamonds.png", "2_of_hearts.png", "2_of_spades.png", "3_of_clubs.png", "3_of_diamonds.png", "3_of_hearts.png", "3_of_spades.png", "4_of_clubs.png", "4_of_diamonds.png", "4_of_hearts.png", "4_of_spades.png", "5_of_clubs.png", "5_of_diamonds.png", "5_of_hearts.png", "5_of_spades.png", "6_of_clubs.png", "6_of_diamonds.png", "6_of_hearts.png", "6_of_spades.png", "7_of_clubs.png", "7_of_diamonds.png", "7_of_hearts.png", "7_of_spades.png", "8_of_clubs.png", "8_of_diamonds.png", "8_of_hearts.png", "8_of_spades.png", "9_of_clubs.png", "9_of_diamonds.png", "9_of_hearts.png", "9_of_spades.png", "ace_of_clubs.png", "ace_of_diamonds.png", "ace_of_hearts.png", "ace_of_spades.png", "jack_of_clubs.png", "jack_of_diamonds.png", "jack_of_hearts.png", "jack_of_spades.png", "king_of_clubs.png", "king_of_diamonds.png", "king_of_hearts.png", "king_of_spades.png", "queen_of_clubs.png", "queen_of_diamonds.png", "queen_of_hearts.png", "queen_of_spades.png"]

var cards = [];
shuffle(cardFiles);
var flippedCards = [];
var gameState = {
  yourTurn: true
};
var player = new Player('player');

var currentPlayer = player;

$('.cards').css("width", Card.width*13);

$(document).ready(function() {
  // Flip all the cards initially to preload all the images
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
  if (isGameOver()) {
    if (player.matchCount > computer.matchCount) {
      $('.status').text('You Win!');
    } else if (player.matchCount < computer.matchCount){
      $('.status').text('The Computer Wins!');
    } else {
      $('.status').text('It\'s a tie!');
    }
  } else {
    if (gameState.yourTurn) {
      $('.status').text('It is your turn.');
    } else {
      $('.status').text('It is the computer\'s turn.');
    }
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

function isGameOver() {
  return player.matchCount + computer.matchCount === cardFiles.length/2;
}

$(document).on('click', '.cards .card', function(e) {
  if (isCurrentPlayer(e)) {
    var selected = cards[$(this).index()];


    if (selected.flipped) {
      return;
    }
    
    selected.flipped = true;

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
          if (currentPlayer === computer && !isGameOver()) {
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
            flippedCard.flipped = false;
            flippedCard.getElement().replaceWith(flippedCard.getHtml())
            computer.addKnownCard(flippedCard);
          })
          flippedCards = [];
          changeTurns();
        }, 500);
      }
    }
 
    $(this).replaceWith(selected.getHtml())
  }
  renderSidebar();
});