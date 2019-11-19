var assert = require('assert');

module.exports = class Player {
    constructor(name,symbol){
        this.name = name;
        this.symbol = symbol
        this.id = this.createId()
        
    }
    // creates a 10 Character id for ther player 
    createId () {
        var id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charsLen = chars.length;
        for ( var i = 0; i < 10; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * charsLen));
        }
        assert.equal(id.length, 10);
        return id;
    }

    
}