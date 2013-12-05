$(document).ready(function() {
  if (window.location.pathname == '/') {
    var game = new Game(5, 5);
    game.createBlankBoard();
    game.fillBoard();
    $('#new-game').click(function() {
      location.reload();
    })
    $('.gem').click(function() {
      game.processClick(this.id);
    });
    $('#hint').click(function() {
      game.giveHint();
    })
  }
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
  this.firstClick = null;
  this.secondClick = null;
  this.score = 0;
};

Game.prototype.createBlankBoard = function() {
  for(var i = 0; i < (this.numRows * this.numColumns); i++) {
    this.board.push("");
  }
  var cellId = 0;
  for(var i = 0; i < this.numRows; i++) {
    $('#game-board').append("<tr id='row_" + i + "'></tr>");
    for(var j = 0; j < this.numColumns; j++) {
      $('#row_' + i).append("<td class='gem' id='" + cellId + "'></td>");
      cellId += 1;
    };
  };
};

Game.prototype.fillBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    if(this.board[i] === "") {
      this.board[i] = randomGem();
    }
  }
  this.renderBoard();
  this.destroyAnyChains();
  if (this.gameOver()[0] === true) {
    var name = window.prompt('Game over! There are no more valid moves. Please enter your name to save your score to the high scores table:')
    if (name === null || name === "") {
      name = 'Anonymous';
    }
    var data = {name: name, score: this.score}
    $.ajax({
      type: "POST",
      url: "/high_scores",
      data: data
    });
  }
};

Game.prototype.renderBoard = function() {
  for(var i = 0; i < this.board.length; i++) {
    $('#' + i).text(this.board[i]);
  }
  $('#score').text(this.score);
};

Game.prototype.destroyAnyChains = function() {
  var thisGame = this;
  if (this.chains()) {
    this.highlightChains();
    setTimeout(function() {thisGame.eliminateChains();}, 500);
  }
}

Game.prototype.processClick = function(id) {
  if (this.firstClick === null) {
    this.firstClick = parseInt(id);
    $('#' + id).addClass('selected');
  }
  else {
    this.secondClick = parseInt(id);
  }
  if (this.secondClick != null) {
    if (this.firstClick === this.secondClick) {
      this.resetClicks();
    }
    else if (this.adjacent(this.firstClick, this.secondClick)) {
      this.swapTiles(this.firstClick, this.secondClick);
      if (this.chains()) {
        this.finishSwap();
      }
      else {
        this.swapTiles(this.firstClick, this.secondClick);
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
  $('#' + this.firstClick).removeClass('selected');
  this.firstClick = null;
  this.secondClick = null;
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

Game.prototype.swapTiles = function(tile1, tile2) {
  var firstGem = this.board[tile1];
  var secondGem = this.board[tile2];
  this.board[tile1] = secondGem;
  this.board[tile2] = firstGem;
}

Game.prototype.finishSwap = function() {
  this.resetClicks();
  this.renderBoard();
  this.destroyAnyChains();
}

Game.prototype.highlightChains = function() {
  var chains = this.chains();
  for(var i = 0; i < chains.length; i++) {
    $('#' + chains[i]).addClass('chain');
  }
}

Game.prototype.eliminateChains = function() {
  var chains = this.chains();
  for(var i = 0; i < chains.length; i++) {
    $('#' + chains[i]).removeClass('chain')
    this.board[chains[i]] = ""
    this.score += 1;
  }
  this.renderBoard();
  var thisGame = this;
  setTimeout(function() {thisGame.dropGems();}, 500);
}

Game.prototype.dropGems = function() {
  for(var i = this.board.length - 1; i >= this.numColumns; i--) {
    if (this.board[i] === "" && this.gemAbove(i) >= 0) {
      this.swapTiles(i, this.gemAbove(i));
    }
  }
  this.renderBoard();
  var thisGame = this;
  setTimeout(function() {thisGame.fillBoard()}, 500);
}

Game.prototype.gemAbove = function(i) {
  for(var j = i - this.numColumns; j >= 0; j -= this.numColumns) {
    if (this.board[j] != "") {
      return j;
    }
  }
  return -1;
}

Game.prototype.chains = function() {
  var chains = [];
  //Find horizontal chains
  for(var i = 0; i < this.board.length; i++) {
    if (!this.lastTwoColumns(i)) {
      if(this.board[i] === this.board[i+1] && this.board[i] === this.board[i+2]) {
        chains.push(i, i+1, i+2);
      }
    }
  }
  //Find vertical chains
  for(var i = 0; i < (this.board.length - 2 * this.numColumns); i++) {
    if(this.board[i] === this.board[i + this.numColumns] && 
      this.board[i] === this.board[i + 2 * this.numColumns]) {
      chains.push(i, i + this.numColumns, i + 2 * this.numColumns);
    }
  }
  if (chains.length > 0) {
    return chains.unique();
  }
  else {
    return 0;
  }
};

Game.prototype.gameOver = function() {
  for(var i = 0; i < this.board.length; i++) {
    var adjacentTiles = [];
    for(var j = 0; j < this.board.length; j++) {
      if (this.adjacent(i, j)) {
        adjacentTiles.push(j);
      }
    }
    for(var k = 0; k < adjacentTiles.length; k++) {
      this.swapTiles(i, adjacentTiles[k]);
      if (this.chains()) {
        this.swapTiles(i, adjacentTiles[k]);
        return [false, i];
      }
      this.swapTiles(i, adjacentTiles[k]);
    }
  }
  return [true, -1];
}

Game.prototype.giveHint = function() {
  $('#' + this.gameOver()[1]).addClass('selected');
  var thisGame = this;
  setTimeout(function() {
    $('#' + thisGame.gameOver()[1]).removeClass('selected')}, 250);
}

Game.prototype.lastTwoColumns = function(i) {
  return (i + 1) % this.numColumns === 0 || (i + 2) % this.numColumns === 0
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