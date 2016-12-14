Card = function(number, suit) {
  this.number = number;
  this.suit = suit;
  this.flipped = true;
  this.matched = false;
}

Card.width = 100;
Card.height = 146;

Card.prototype.getHtml = function(){
  return '<img class="card" card = "' + this.getFullName() + '" src="images/cards/' + (this.flipped ? (this.getFullName()) : 'card_back') +'.png" width="'+ Card.width + '" height ="' + Card.height + '"/>'
} 

Card.prototype.getFullName = function() {
  return this.number + '_of_' + this.suit; 
}

Card.prototype.getElement = function() {
  return $("[card="+this.getFullName()+"]");
}

Card.prototype.redraw = function() {
  this.getElement().replaceWith(this.getHtml());
}

Card.getBlankSpace = function() {
  return '<span style="width: '+ Card.width + 'px; height: '+ Card.height + 'px; display: inline-block" />'; 
}