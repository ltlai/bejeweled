$(document).ready(function() {
  var game = new Game(4, 4);
  game.createBlankBoard();
  game.fillBoard();
  if (game.horizontalChains().length > 0 || game.verticalChains().length > 0) {
    setTimeout(function() {game.eliminateChains();}, 1500);
  }
});

var gems = ["X", "O", "V", "#", "&"];

function randomGem() {
   var n = Math.floor((Math.random()*(gems.length)));
   return gems[n];
};

function Game(numRows, numColumns) {
  this.numRows = numRows;
  this.numColumns = numColumns;
  this.board =  [];
};

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

Game.prototype.renderBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    $('#' + i.toString()).text(this.board[i]);
  }
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
  for(var i = 0; i < this.board.length; i++) {
    if (i < 2 * this.numColumns) {
      potentialChain.push(i, i + this.numColumns, i + 2 * this.numColumns)
      if(this.board[i] === this.board[i + this.numColumns] && 
        this.board[i] === this.board[i + 2 * this.numColumns]) {
        verticalChains.push(i, i + this.numColumns, i + 2 * this.numColumns);
      }
      else {potentialChain = []};
    }
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
  setTimeout(function() {thisGame.fillBoard();}, 1500);
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