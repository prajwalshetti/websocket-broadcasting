const express=require("express")
const app=express()
const cors=require("cors")
app.use(cors())

//Installing WebSocketServer
const {WebSocketServer,WebSocket}=require('ws')
//creating a server
const server=require('http').createServer(app)
//creating an WebSocketServer object
const wss=new WebSocketServer({server})

//web socket controller
wss.on('connection',(ws)=>{
  console.log("New client connected!")

  ws.on('message',(message)=>{
    // console.log("New message : ",message.toString())
    message=message.toString()
    wss.clients.forEach((client)=>{
      if(client.readyState==WebSocket.OPEN){
        client.send(message)
      }
    })
  })

  ws.on('close',()=>{
    console.log("Client left")
  })

  ws.on('error',(error)=>{
    console.log("WebSocket Error",error)
  })
})

const PORT=5000;
server.listen(PORT,()=>{
  console.log("Server Running on PORT ",PORT);
})