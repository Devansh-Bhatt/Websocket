// const { client } = require("websocket");

// const e = require("express");

let ws = new WebSocket("ws://localhost:5050");
const crtbutton = document.getElementById("create");
const joinbutton = document.getElementById("join");
const gameidinput = document.getElementById("gameid")
const playerdiv = document.getElementById("playerdiv")
const playboard = document.getElementById("play_board")
let clientId = null;
let gameId = null;


crtbutton.addEventListener("click",()=>{
    const payload = {
        method : "create",
        clientId : clientId 
    }
    ws.send(JSON.stringify(payload));
    
})

joinbutton.addEventListener("click",()=>{
    if(gameId === null){
        gameId = gameidinput.value
    }
    const payload = {
        method : "join",
        clientId : clientId,
        gameId : gameId,
    }
    ws.send(JSON.stringify(payload));
})


ws.onmessage = message=>{
   const response = JSON.parse(message.data);
   if(response.method==="connect"){
        clientId = response.clientId;
        console.log("Client id : " + clientId + "connected");

   }
   if(response.method==="create"){
        gameId = response.game.id;
        console.log("Game created with id: " + gameId)
        
   }
   if(response.method === "join"){    
      const game = response.game;
      let playercolor = response.color
      while(playerdiv.firstChild){
        playerdiv.removeChild(playerdiv.firstChild)
      }
      game.clients.forEach(element => {
        const clientdiv = document.createElement("div")
        clientdiv.innerText = element.clientId;
        // clientdiv.style.height = "200px"
        clientdiv.style.width = "200px"
        clientdiv.style.background = element.color;
        playerdiv.appendChild(clientdiv);
      });
      while(playboard.firstChild){
        playboard.removeChild(playboard.firstChild)
    }
      for( i = 1; i <= response.game.balls ; i++ ){
        const cell = document.createElement("button");
        cell.style.height = "120px";
        cell.style.width = "120px"
        cell.addEventListener("click",()=>{
            cell.style.background = playercolor
            const payload = {
                method : "play",
                clientId : clientId,
                gameId : gameId,
                playercolor : playercolor,
                cell : i
            }
            ws.send(JSON.stringify(payload))
        })
        playboard.appendChild(cell)  
      }
   }
}