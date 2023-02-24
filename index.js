const http = require("http")
const { connect } = require("http2")
let { connection } = require("websocket")
const WebsocketServer = require("websocket").server
const httpserver = http.createServer((req,res)=>{
    console.log("recieved a request!!")
})

const websocket = new WebsocketServer({
    "httpServer" : httpserver

})

websocket.on("request",request=>{
    connection = request.accept(null,request.origin)
    connection.on("open",()=>{console.log("connection opened")})
    connection.on("close",()=>{console.log("connection closed")})
    connection.on("message",message=>{
        console.log(`Message: ${message.utf8Data}`)
    })

})


httpserver.listen(8080,()=>{
    console.log("server listening on port 8080")
})