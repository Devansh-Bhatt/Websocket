// const { response } = require("express")
const http = require("http")
const { v4: uuidv4 } = require("uuid")
const websocket = require("websocket").server
const express = require("express")
const { connected } = require("process")
const app = express()
app.use(express.static('client'))
const httpserver = http.createServer()
app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.listen(5051,()=>{
    console.log("Client listening on port 5051");
})

httpserver.listen(5050,()=>{
    console.log("HTTP lisnening on port 5050")
}) 

const wsServer = new websocket({
    "httpServer": httpserver
})

const clients = {}
const games = {}
const state = {}
wsServer.on("request",request=>{
    const connection = request.accept(null,request.origin);
    connection.on("open",()=>{console.log("open")})
    connection.on("close",()=>{console.log("close")})
    connection.on("message",message=>{
        
        const response = JSON.parse(message.utf8Data);
        if(response.method==="create"){
            const clientId = response.clientId;
            // clients[clientId] = clientId;
            const gameId = uuidv4();
            games[gameId] = {
                id: gameId,
                balls : 33,
                clients : []
            }
           
        const payload = {
            method : "create",
            game : games[gameId]
        }
        console.log(`Game created with id : ${gameId}`)    
        const con = clients[clientId].connection;
        con.send(JSON.stringify(payload))
        }

        if(response.method === "join"){
            const clientId = response.clientId;
            const gameId = response.gameId;
            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            let playercolor = "#" + randomColor;
            games[gameId].clients.push({
                clientId : clientId,
                color : playercolor
            })
            const payload = {
                method : "join",
                game : games[gameId],
                color : playercolor     
            }
            games[gameId].clients.forEach(element => {
                const con = clients[element.clientId].connection
                con.send(JSON.stringify(payload));    
            });
            
        }

        if(response.method === "play"){
           const gameId = response.gameId;
           const color = response.color;
           const cell = response.cell;
           let state = games[gameId].state;
           if(!state){
            state = {}
           }
           state[cell] = color;
           games[gameId].state = state

        }
    })


    // connect new client
    const clientId = uuidv4()
    
    clients[clientId] = {
        connection : connection
    }
    const payload = {
        method : "connect",
        clientId : clientId,
    }
    connection.send(JSON.stringify(payload))
   
})

