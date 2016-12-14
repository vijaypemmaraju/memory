var flipCount = 0;
var cardFiles = ["10_of_clubs.png","10_of_diamonds.png","10_of_hearts.png","10_of_spades.png","2_of_clubs.png","2_of_diamonds.png","2_of_hearts.png","2_of_spades.png","3_of_clubs.png","3_of_diamonds.png","3_of_hearts.png","3_of_spades.png","4_of_clubs.png","4_of_diamonds.png","4_of_hearts.png","4_of_spades.png","5_of_clubs.png","5_of_diamonds.png","5_of_hearts.png","5_of_spades.png","6_of_clubs.png","6_of_diamonds.png","6_of_hearts.png","6_of_spades.png","7_of_clubs.png","7_of_diamonds.png","7_of_hearts.png","7_of_spades.png","8_of_clubs.png","8_of_diamonds.png","8_of_hearts.png","8_of_spades.png","9_of_clubs.png","9_of_diamonds.png","9_of_hearts.png","9_of_spades.png","ace_of_clubs.png","ace_of_diamonds.png","ace_of_hearts.png","ace_of_spades.png","jack_of_clubs.png","jack_of_diamonds.png","jack_of_hearts.png","jack_of_spades.png","king_of_clubs.png","king_of_diamonds.png","king_of_hearts.png","king_of_spades.png","queen_of_clubs.png","queen_of_diamonds.png","queen_of_hearts.png","queen_of_spades.png"]
var cards = [];
shuffle(cardFiles);
var flippedCards = [];
cardFiles.forEach(function(cardFile) {
  var split = cardFile.split("_");
  var card = new Card(split[0], split[2].split(".")[0]);
  cards.push(card);
  var result = $('.cards').append(card.getHtml());
  console.log(result);
});
var hasControl = true;

$(document).ready(function() {
  cards.forEach(function(card) {
    card.flipped = !card.flipped;
    card.redraw();
  });
});


$(document).on('click', '.card', function() {
  if (hasControl) {
    var selected = cards[$(this).index()];
    selected.flipped = !selected.flipped;
    if (selected.flipped) {
      flipCount++;
      $('.flip-count').html('Flips: ' + flipCount);
      flippedCards.push(selected);
      if (flippedCards.length >= 2) {
        if (flippedCards[0].number === flippedCards[1].number) {
          hasControl = false;
          setTimeout(function() {
            hasControl = true;
            var $matchedCardPair = $('<div class="matched-card-pair"></div>');
            flippedCards.forEach(function(flippedCard) {
              flippedCard.getElement().replaceWith(Card.getBlankSpace());
              $matchedCardPair.append(flippedCard.getHtml());
            })
            $('.matched-cards').prepend($matchedCardPair);
            flippedCards  = [];
          }, 50);
        } else {
          hasControl = false;
          setTimeout(function() {
            hasControl = true;
            flippedCards.forEach(function(flippedCard) {
              flippedCard.flipped = !flippedCard.flipped;
              flippedCard.getElement().replaceWith(flippedCard.getHtml())
            })
            flippedCards  = [];
          }, 500);
        }
      }  
    } else {
      flippedCards.splice(flippedCards.indexOf(selected), 1);
    }
    $(this).replaceWith(selected.getHtml())
  }
});