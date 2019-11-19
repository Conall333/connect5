module.exports  = class GameLogic {
    constructor(player1,player2){
        this.player1 = player1
        this.player2 = player2
        this.rows = 6
        this.columns = 9
        this.board = this.createBoard()
        this.winner = null;
    }

// checks if a move is valid
validMove (move) {
        if (this.board[move][5] === " ") {
            return true
        }
        else {
            return false
        }
    }


//function for placing a move on the board
placeMove (id, move) {

    move = Number(move)
    
    let symbol
    if (id === this.player1.id) {
        symbol = this.player1.symbol
        
    }
    else if (id === this.player2.id) {
         symbol = this.player2.symbol
    }
    for (let i = 0; i < this.rows; i++) {

        if (this.board[move][i] === " ") {
            this.board[move][i] = symbol
            break;    
        }
    }
    this.winner = this.checkForWin()
}

//function for checking if a move wins the game or the game is over
// 1 = player1 has won, 2 = player 2 has won, 3 = gameStillGoing, 4 = tieGame
checkForWin () {

    // check verticals
    for (let i = 0; i < this.columns;i++) {
        let counter = 0
        for (let j = 0; j < this.rows -1;j++) {
            let first = this.board[i][j] 
            let second = this.board[i][j + 1]

            if (first === second && first != " ") {
                counter += 1
            }
            else {
                counter = 0
            }

            if (counter === 4) {
                console.log("Victory: Vertical")
                if (second === this.player1.symbol) {
                    return 1
                }
                else {
                    return 2
                }
            }
        }
    }

    //checkHorizontals
    for (let i = 0; i < this.rows;i++) {
        let counter = 0
        for (let j = 0; j < this.columns -1;j++) {
            let first = this.board[j][i]
            let second = this.board[j + 1][i]

            if (first === second && first != " ") {
                counter += 1
            }
            else {
                counter = 0
            }
            if (counter === 4) {
                console.log("Victory: Horizontal")
                if (second === this.player1.symbol) {
                    return 1
                }
                else {
                    return 2
                }
            }
        }
    }
    // right vertical edge case
    let edgeCase1 = ""
    for (let z = 0;z < 5; z++) {
        edgeCase1 += this.board[z][z + 1]
    }
    if (edgeCase1 === this.player2.symbol.repeat(5)){
        return 2
    }
    else if (edgeCase1 === this.player1.symbol.repeat(5) ) {
        return 1
    }

    //left vertical edge case
    let edgeCase2 = ""
    for (let z = 0;z < 5; z++) {
        edgeCase2 += this.board[8 - z][z + 1]
    }
    if (edgeCase2 === this.player2.symbol.repeat(5)){
        return 2
    }
    else if (edgeCase2 === this.player1.symbol.repeat(5) ) {
        return 1
    }

    //check verticals right
    for (let i = 0; i < 5;i++) {
        let counter = 0
        let noFinalColumn = 0
        if (i === 4 ) {
            noFinalColumn = 1
        }
        for (let j = 0; j < this.rows - (1 + noFinalColumn );j++) {
            let first = this.board[j + i][j]
            let second = this.board[j + i + 1][j + 1]

            if (first === second && first != " ") {
                counter += 1
            }
            else {
                counter = 0
            }

            if (counter === 4) {
                console.log("Victory: Vertical Right")
                if (second === this.player1.symbol) {
                    return 1
                }
                else {
                    return 2
                }
            }  
        }
    }

    // check verticles left 
    for (let i = 8; i > 3;i--) {
        let counter = 0
        let noFinalColumn = 0
        if (i === 4) {
            noFinalColumn = 1
        }
        for (let j = 0; j < this.rows - (1 + noFinalColumn );j++) {
            let first = this.board[i][j]
            let second = this.board[i - 1][j + 1 ]

            if (first === second && first != " ") {
                counter += 1
            }
            else {
                counter = 0
            }
            if (counter === 4) {
                console.log("Victory: Vertical Left")
                if (second === this.player1.symbol) {
                    return 1
                }
                else {
                    return 2
                }
            }  
        }
    }

    // check if board is full
    for (let i =0; i < this.columns;i++){
        if (this.board[i][this.rows - 1] === " ") {
            //game is ongoing
            return 3
        }   
    }
    // game is over, tie game
    return 4   
}

// creates a board
createBoard () {
    let board = [];
    for(let i=0; i < this.columns; i++) {
        board[i] = new Array(this.rows).fill(" ")
    }
    return board
    }
// prints the board
static printBoard(aBoard) {
    process.stdout.write("\n")
    process.stdout.write("-----------------------------------------------")

    for (let i = 5; i > -1 ; i--) {
        process.stdout.write("\n")
        process.stdout.write("|")


        for (let j = 0; j < 9 ; j++){

            process.stdout.write(` [${aBoard[j][i]}] `)
        }
        process.stdout.write("|")
    
    }
    process.stdout.write("\n")
    process.stdout.write("-----------------------------------------------")
    process.stdout.write("\n")


}
}



