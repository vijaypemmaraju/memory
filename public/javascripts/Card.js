Card = function(number, suit) {
  this.number = number;
  this.suit = suit;
  this.flipped = true;
  this.matched = false;
}

Card.width = 75;
Card.height = 110;

Card.prototype.getHtml = function(){
  return '<img class="card" card = "' + this.getFullName() + '" src="images/cards/' + (this.flipped ? (this.getFullName()) : 'card_back') +'.png" width="'+ Card.width + '" height ="' + Card.height + '"/>'
} 

Card.prototype.getRawNumber = function() {
  switch(this.number) {
    case "ace":
      return 0;
      break;
    case "jack":
      return 10;
      break;
    case "queen":
      return 11;
      break;
    case "king":
      return 12;
      break;
    default:
      return this.number - 1;
  }
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