var gems = ["X", "O", "V", "#", "&"];

function randomGem() {
   var n = Math.floor((Math.random()*(gems.length)));
   return gems[n];
}

function Game() {
  this.board = ["", "", "", "",
                "", "", "", "",
                "", "", "", "",
                "", "", "", ""]
};

Game.prototype.fillBoard = function() {
  for(var i=0; i<this.board.length; i++) {
    if (this.board[i] === "") {
      this.board[i] = randomGem();
    }
  }
};

Game.prototype.renderBoard = function() {
  for(var i=0; i<this.board.length; i++) {
    $('#' + i.toString()).text(this.board[i]);
  }
}

$(document).ready(function() {
  var game = new Game();
  game.fillBoard();
  game.renderBoard();
});