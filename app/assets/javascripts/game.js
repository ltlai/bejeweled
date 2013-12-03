$(document).ready(function() {
  var game = new Game();
  game.fillBoard();
  game.renderBoard();
});

var gems = ["X", "O", "V", "#", "&"];

function randomGem() {
   var n = Math.floor((Math.random()*(gems.length)));
   return gems[n];
};

function Game() {
  this.board = ["", "", "", "",
                "", "", "", "",
                "", "", "", "",
                "", "", "", ""]
};

Game.prototype.fillBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    if(this.board[i] === "") {
      this.board[i] = randomGem();
    }
  }
};

Game.prototype.renderBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    $('#' + i.toString()).text(this.board[i]);
  }
};

function lastTwoColumns(i) {
  if((i + 1) % 4 === 0 || (i + 2) % 4 === 0) {
    return true;
  }
  return false;
};

Game.prototype.horizontalChains = function() {
  var horizontalChains = [];
  var potentialChain = [];
  for(var i = 0; i < this.board.length; i++) {
    if (!lastTwoColumns(i)) {
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
    if (i < 8) {
      potentialChain.push(i, i+4, i+8)
      if(this.board[i] === this.board[i+4] && this.board[i+4] === this.board[i+8]) {
        verticalChains.push(i, i+4, i+8);
      }
      else {potentialChain = []};
    }
  }
  return verticalChains.unique();
};

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