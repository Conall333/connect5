let assert = require('chai').assert
let expect = require('chai').expect

let Player = require('../server/serverModels/Player.js')

let GameLogic = require('../server/serverModels/GameLogic.js')

describe('testing createId function', () => {
    let player = new Player("name","X")
  it('should return an id of length 10', () => {
        assert.lengthOf(player.id, 10)
  });
  it('player id should be a string', () => {
        assert.typeOf(player.id, 'string');
  });

});

describe('testing gameLogic', () => {
    
let player1 = new Player("p1","X")
let player2 = new Player("p2","O")
let gameLogic = new GameLogic(player1,player2)

  it('should place a move on the board', () => {
        gameLogic.placeMove(player1.id, 0)
        expect(gameLogic.board[0][0]).to.equal('X');    
  });
   it('should place a different Symbol on next Spot', () => {
        gameLogic.placeMove(player2.id, 0)
        expect(gameLogic.board[0][1]).to.equal('O');    
  });
   it('should show player 1 is the winner', () => {
        gameLogic.placeMove(player1.id, 1)
        gameLogic.placeMove(player1.id, 2)
        gameLogic.placeMove(player1.id, 3)
        gameLogic.placeMove(player1.id, 4)
        expect(gameLogic.winner).to.equal(1);    
  });

});