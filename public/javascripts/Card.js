Card = function(number, suit) {
  this.number = number;
  this.suit = suit;
  this.flipped = false;
}

Card.prototype.getHtml = function(){
  return '<img class="card" card = "' + this.getFullName() + '" src="images/cards/' + (this.flipped ? (this.getFullName()) : 'card_back') +'.png" width="50" height ="73"/>'
} 

Card.prototype.getFullName = function() {
  return this.number + '_of_' + this.suit; 
}

Card.prototype.getElement = function() {
  return $("[card="+this.getFullName()+"]");
}

Card.getBlankSpace = function() {
  return '<span class="empty" />';
}