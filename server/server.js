const express = require('express');
const config = require('../myConfig.json');
const body_parser = require('body-parser');
const EventEmitter = require('events').EventEmitter;
const Player = require('./serverModels/Player.js');
const GameLogic = require('./serverModels/GameLogic.js');


let run = () =>  {

    const server = express();
    server.use(body_parser.json());
    let emitter = new EventEmitter();
    let currentPlayers = 0;
    let player1;
    let player2;
    let gameLogic;
    let winByDisconnect = false

    // connection request
    server.post("/connect", (req, res) => {
        let response = {}
        response.message = "Unable to Play, There Are Allready 2 players Connected"
        
        // won't connect if two players allready connected
        if (currentPlayers < 2) {
        let name = req.body.name
        // determine symbol
        let symbol = currentPlayers === 0 ? "X" : "O"
        let id;
        // create player object
        currentPlayers === 0 ? player1 = new Player(name,symbol) : player2 = new Player(name,symbol)
        currentPlayers === 0 ? id = player1.id : id = player2.id
        
        let message = "Connection Successfull, Waiting for Opponent..."
        response = {name: name, symbol: symbol, id: id, message: message}
        currentPlayers += 1

        }
        res.json(response);

    });

    // start request
    server.post("/start", (req, res) => {
        res.on('error',(error)=>{ console.log(error)})
        let playerId = req.body.player
        console.log(`${playerId} is ready to start`)
        // this player will start
        if (currentPlayers === 1) {
            return emitter.once('readyToStart', () => {
                gameLogic = new GameLogic(player1,player2)
                let response = {turn: 1, message: ` ${gameLogic.player1.name} VS ${gameLogic.player2.name}, You will Start`, board: gameLogic.board}
                res.json(response);
            });
        }
        
        // this player will go second
        else if (currentPlayers === 2) {
            emitter.emit('readyToStart');
            let response = {turn: 2, message: ` ${gameLogic.player1.name} VS ${gameLogic.player2.name}, Your Opponent will start `}
            setTimeout(function(){res.json(response)},500)         
        }
        
    });

    server.post("/move", (req, res) => {
        // deconstruct sent object
        let requestObject = req.body.requestObject
        let move = requestObject.move
        let id = requestObject.id
        console.log(`move recieved form ${id}`)

        // place the move
        gameLogic.placeMove(id,move)

        // handle game state
        let playerStatus = "madeMove"
        let responseObject = handleOutcome(winByDisconnect,gameLogic,playerStatus)

        res.json(responseObject)

        emitter.emit('nextMove');

    });
    server.get("/board", (req, res) => {
        return emitter.once('nextMove', () => {
            // handle game state
            let playerStatus = "waiting"
            let responseObject = handleOutcome(winByDisconnect,gameLogic,playerStatus)
            
            res.json(responseObject);
            

            // end the game
        });


    });
    server.get("/close", (req, res) => {  
        console.log("recieved close request")
        res.set("Connection", "close")
        res.json("connection closed")
        winByDisconnect = true
        emitter.emit('nextMove');
        currentPlayers -= 1;
        if (currentPlayers === 0) {
            winByDisconnect = false
        }
    });


    const port = config.port;
    server.listen(port, () => {
        console.log(`Server listening at ${port}`);
    });
  
}

let handleOutcome = (winByDisconnect,gameLogic,gameStatus) => {


    let isGameOver = false;
    let gameResult;
    let outcome = gameLogic.winner

    if (outcome === 1 || outcome === 2 || outcome === 4){
        isGameOver = true;

        if (outcome === 1) {gameResult = `${gameLogic.player1.name} Has Won!`}
        if (outcome === 2) {gameResult = `${gameLogic.player2.name} Has Won!`}
        if (outcome === 4) {gameResult = `The game was a tie`}
    }

    if (winByDisconnect === true) {isGameOver = true}

    let responseObject;

    if (isGameOver === false)  {
        if (gameStatus === "madeMove") {
            responseObject = {
                message: "Move made, waiting for other player...",
                isGameOver: isGameOver,
                board: gameLogic.board
            } 
        }
        else {
            responseObject = {
                message: "It's your turn",
                isGameOver: isGameOver,
                board: gameLogic.board
            }
        }
    }
    
    else {  
        let message;
        if (winByDisconnect === true) {
            message = `Your Opponent Disconnected, You have won`
        }
        else {
            message = ` Game Over, ${gameResult} `
        }
        responseObject = {
            message: message,
            isGameOver: isGameOver,
            board: gameLogic.board
        }
    }
    return responseObject
}

run()
