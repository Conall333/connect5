const Connection = require('./clientModels/connection.js');
var ON_DEATH = require('death');
const config = require('../myConfig.json');

// create connection using config details
let connection = new Connection(config.hostname, config.port)


// function to exit and close connection with server
let exitGracefully = async () => {
    let response =  await connection.closeRequest()
     console.log(response)
     process.exit()
 }

// catches close signals
ON_DEATH( () =>{
    
    // send disconnect to server
    exitGracefully()

  })

// gets the players name
let readName = (readline) => {
    return new Promise((resolve,reject) =>{
    readline.question('Enter Your Name: ', (name) => {
        console.log(`Hi ${name}!`)
        resolve(name)
      })

});
}


// function to display the board in the console
let displayBoard = (board) => {
    process.stdout.write("\n")
    process.stdout.write("-----------------------------------------------")
    for (let i = 5; i > -1 ; i--) {
        process.stdout.write("\n")
        process.stdout.write("|")

        for (let j = 0; j < 9 ; j++){
            process.stdout.write(` [${board[j][i]}] `)
        }
        process.stdout.write("|")

    }
    process.stdout.write("\n")
    process.stdout.write("-----------------------------------------------")
    process.stdout.write("\n")
     
}

// ask the player to make a move
let makeMove = (readline) => {
    return new Promise((resolve,reject) =>{
    readline.question('Place a piece in column (1 - 9): ', (number) => {
            resolve(number)       
    })
    
});

}

// checks if a move is valid
let checkValidMove = async (move,board,readline) => {

    //check for exit
    if(move.toLowerCase() === "exit" || move.toLowerCase() === "disconnect") {
        await exitGracefully()
    }
    // algin move with board
    move = Number(move) - 1
    // check if number, if in bounds, and if there is a space on the board
    while (move < 0 || move  > 8 || isNaN(move) || board[move][5] !== " "  ) {
        console.log("This is not a valid move, enter a number between 1 and 9")
        move = await makeMove(readline)
         // algin move with board
        move = Number(move) - 1

    }
    return move

}

// prints a message and checks if the server determined if the game is over
let handleResponse = (response) => {

    displayBoard(response.board)
    let isGameOver = false
    console.log(response.message)
    if (response.isGameOver === true) {
        isGameOver = true
        return isGameOver
    }
    return isGameOver
}


let run = async() => {

    let isGameOver = false;

    // readline module
    let readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })

    // overwrite readline default behavior, by default readline will catch and handle
    readline.on("SIGINT", function () {
        process.emit("SIGINT");
    });

    // get name from user
    let name = await readName(readline)
    // get player details from server
    let player = JSON.parse(await connection.connectRequest(name))
    console.log(player.message)
    // symbol will be undefined when there are allready 2 players connected
    if (player.symbol === undefined) {
        process.exit()
    }
    console.log(`Your Symbol is ${player.symbol}`)
    console.log(`turn time limit is ${(config.moveTimeLimit /1000)} Seconds`)

    // store id for layer use
    let id = player.id

    // ask the server to start, will recieve response when 2 players connected
    let ready = JSON.parse(await connection.startRequest(id))
    console.log(ready.message)

    // turnToken decides which player will start
    let turnToken = ready.turn

    if (turnToken === 1) {
         displayBoard(ready.board)
         // aks player for move
         // Player has X seconds to  move or the game will end
         let timeLimit = setTimeout(exitGracefully, config.moveTimeLimit)
         let move = await makeMove(readline)
         // check if move is valid
         move = await checkValidMove(move,ready.board,readline)
         clearTimeout(timeLimit)

        // if the input is ok, then create object with input and id and send to server
        let requestObject = {move: move,id: player.id}

        let response = JSON.parse(await connection.moveRequest(requestObject))
        isGameOver = handleResponse(response)
    }


    while (isGameOver !== true) {
        // request the update state of the game from the server, will resolve when other player has made their move
        let updatedState = JSON.parse(await connection.boardRequest())
        isGameOver = handleResponse(updatedState)
        if (isGameOver === true) {break;}

        // Player has X seconds to  move or the game will end
        let timeLimit = setTimeout(exitGracefully, config.moveTimeLimit)
        let move = await makeMove(readline)
        // checks if move is valid client side
        move = await checkValidMove(move,updatedState.board,readline)
        clearTimeout(timeLimit)

        //send move to server
        let requestObject = {move: move,id: player.id}
        let response = JSON.parse(await connection.moveRequest(requestObject))
        isGameOver = handleResponse(response)

    }

    console.log("exiting...")
    // exit and tell the server
    exitGracefully()

}

run()




