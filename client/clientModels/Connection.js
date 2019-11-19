const http = require('http')

module.exports = class Connection {
    constructor(hostname,port){
        this._port = port;
        this._hostname = hostname;
        this._agent = new http.Agent({ 
            keepAlive: true,
            keepAliveMsecs: 180000
        });
        this.connected = false  
    }

    get port(){
        return this._port
    }
    get hostname(){
        return this._hostname
    }
    get agent(){
        return this._agent
    }

    // request to connect to server
    connectRequest (name) {

        const data = JSON.stringify({name})
        let options = {
            hostname: this.hostname,
            port: this.port,
            agent: this.agent,
            path: '/connect', 
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }   
          }
    
        let result = this.sendRequest(options,data)
        return result
    
    }
    
    //request to start the game
    startRequest  (player) {
        this.connected = true
        const data = JSON.stringify({player})
        let options = {
            hostname: this.hostname,
            port: this.port,
            agent: this.agent,
            path: '/start', 
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }   
          }
    
        let result = this.sendRequest(options,data)
        return result
    }
    
    // request to make a move
    moveRequest  (requestObject) {
        const data = JSON.stringify({requestObject})
        let options = {
            hostname: this.hostname,
            port: this.port,
            agent: this.agent,
            path: '/move', 
            method: 'POST',
            headers:  {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }   
          }
    
        let result = this.sendRequest(options,data)
        return result
    }
    
    // request to get the board
    boardRequest  () {
    
        let options = {
            hostname: this.hostname,
            port: this.port,
            agent: this.agent,
            path: '/board', 
            method: 'GET',
    
          }
        let result = this.sendRequest(options)
        return result
    }
    
    // request to close connection
    closeRequest () {

        let options = {
            hostname: this.hostname,
            port: this.port,
            agent: this.agent,
            path: '/close', 
            method: 'GET',
          }
        let result = this.sendRequest(options)
        return result
    
    }

 
    // send the request ot the server
    sendRequest(options,data) {

        return new Promise((resolve,reject) =>
        {
              let req = http.request(options, res => {
                // console.log(`statusCode: ${res.statusCode}`)
                res.on('data', d => {
                    d = d.toString('utf8');
                    resolve(d)
                })
              })
              
              req.on('error', error => {
                console.log(error)
                console.log("Another player did not connect within 3 minutes, or the server is no longer available")
            
                if (this.connected) {
                this.closeRequest().then((response =>{
                    console.log(response)
                    process.exit()
                }))
                }
                else {
                    process.exit()
                }
     
        
 
              })
    
              if (data !== undefined) {
                  // console.log("data wrote")
                req.write(data)
              }
    
              req.end()
        });
    
    }


    

}
