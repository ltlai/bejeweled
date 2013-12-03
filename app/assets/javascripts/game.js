$(document).ready(function() {
  var game = new Game(5, 5);
  game.createBlankBoard();
  game.fillBoard();
  $('td').click(function() {
    game.processClick(this.id);
  });
});

var gems = ["X", "O", "@", "#", "&"];

function randomGem() {
   var n = Math.floor((Math.random()*(gems.length)));
   return gems[n];
};

function Game(numRows, numColumns) {
  this.numRows = numRows;
  this.numColumns = numColumns;
  this.board =  [];
  this.firstClick = "";
  this.secondClick = "";
};

Game.prototype.processClick = function(id) {
  if (this.firstClick === "") {
    this.firstClick = parseInt(id);
  }
  else {
    this.secondClick = parseInt(id);
  }
  if (this.secondClick) {
    if (this.adjacent(this.firstClick, this.secondClick)) {
      this.swapGems();
      if (this.checkForChains()) {
        this.finishSwap();
      }
      else {
        this.swapGems();
        this.resetClicks();
        alert("Sorry, that move does not create any chains");
      }
    }
    else {
      this.resetClicks();
      alert("Sorry, only adjacent gems may be swapped");
    }
  }
}

Game.prototype.resetClicks = function() {
  this.firstClick = "";
  this.secondClick = "";
}

Game.prototype.adjacent = function(tile1, tile2) {
  if (tile1 > tile2) {
    var larger = tile1;
    var smaller = tile2;
  }
  else {
    var larger = tile2;
    var smaller = tile1;
  }
  if (larger - smaller === this.numColumns) {
    return true;
  }
  else if (larger - smaller === 1 && larger % this.numColumns != 0) {
    return true;
  }
  return false;
}

Game.prototype.swapGems = function() {
  var firstGem = this.board[this.firstClick];
  var secondGem = this.board[this.secondClick];
  this.board[this.firstClick] = secondGem;
  this.board[this.secondClick] = firstGem;
}

Game.prototype.finishSwap = function() {
  this.resetClicks();
  this.renderBoard();
}

Game.prototype.createBlankBoard = function() {
  for(var i = 0; i < (this.numRows * this.numColumns); i++) {
    this.board.push("");
  }
};

Game.prototype.fillBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    if(this.board[i] === "") {
      this.board[i] = randomGem();
    }
  }
  this.renderBoard();
};

Game.prototype.checkForChains = function() {
  var thisGame = this;
  if (this.horizontalChains().length > 0 || this.verticalChains().length > 0) {
    setTimeout(function() {thisGame.eliminateChains();}, 1500);
    return true;
  }
  return false;
}

Game.prototype.renderBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    $('#' + i.toString()).text(this.board[i]);
  }
  this.checkForChains();
};

Game.prototype.lastTwoColumns = function(i) {
  if((i + 1) % this.numColumns === 0 || (i + 2) % this.numColumns === 0) {
    return true;
  }
  return false;
};

Game.prototype.horizontalChains = function() {
  var horizontalChains = [];
  var potentialChain = [];
  for(var i = 0; i < this.board.length; i++) {
    if (!this.lastTwoColumns(i)) {
      potentialChain.push(i, i+1, i+2)
      if(this.board[i] === this.board[i+1] && this.board[i+1] === this.board[i+2]) {
        horizontalChains.push(i, i+1, i+2);
      }
      else {potentialChain = []};
    }
  }
  return horizontalChains.unique();
};

Game.prototype.verticalChains = function() {
  var verticalChains = [];
  var potentialChain = [];
  for(var i = 0; i < (this.board.length - 2 * this.numColumns); i++) {
    potentialChain.push(i, i + this.numColumns, i + 2 * this.numColumns)
    if(this.board[i] === this.board[i + this.numColumns] && 
      this.board[i] === this.board[i + 2 * this.numColumns]) {
      verticalChains.push(i, i + this.numColumns, i + 2 * this.numColumns);
    }
    else {potentialChain = []};
  }
  return verticalChains.unique();
};

Game.prototype.eliminateChains = function() {
  var horChains = this.horizontalChains();
  var vertChains = this.verticalChains();
  for(var i = 0; i < horChains.length; i++) {
    this.board[horChains[i]] = ""
  }
  for(var i = 0; i < vertChains.length; i++) {
    this.board[vertChains[i]] = ""
  }
  this.renderBoard();
  var thisGame = this;
  setTimeout(function() {thisGame.dropGems();}, 750);
  setTimeout(function() {thisGame.fillBoard();}, 1500);
}

Game.prototype.dropGems = function() {
  for(var i = this.board.length - 1; i >= this.numColumns; i--) {
    if (this.board[i] === "" && this.gemAbove(i)[0]) {
      this.board[i] = this.gemAbove(i)[0];
      this.board[this.gemAbove(i)[1]] = ""
    }
  }
  this.renderBoard();
}

Game.prototype.gemAbove = function(i) {
  for(var j = i - this.numColumns; j >= 0; j -= this.numColumns) {
    if (this.board[j] != "") {
      return [this.board[j], j] 
    }
  }
  return [false, -1];
}

Array.prototype.contains = function(value) {
  for(var i = 0; i < this.length; i++) {
    if(this[i] === value) {
      return true;
    }
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
    if(!arr.contains(this[i])) {
      arr.push(this[i]);
    }
  }
  return arr; 
};