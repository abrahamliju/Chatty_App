// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

// Function to handle the number of Users connected to the server

const connectedUsers = (users) => {
  let message;
  if(users === 1) {
    message = `${users} user connected`;
  }
  if (users > 1) {
    message = `${users} users connected`;
  }

  return {
           type: "onlineClients",
            content: message
         }
}

wss.broadcast = function (data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState) {
      client.send(data);
    }
    console.log("Data Sent", data)
  });
};

let noOfUsers = 0;

wss.on('connection', (ws) => {

  noOfUsers += 1;
  console.log("No of Users Online ", noOfUsers);
  wss.broadcast(
                  JSON.stringify(connectedUsers(noOfUsers))
               );
  ws.on('message', function (message) {
    var msg = JSON.parse(message);
    msg.id = uuidV1();
    if(msg.name === ""){
      msg.name = "Anonymous";
    }
    if(msg.type === "postMessage"){
      msg.type = "incomingMessage"
    }
    if(msg.type ==="postNotification"){
      msg.type = "incomingNotification"
    }
    msgs = JSON.stringify(msg);
    wss.broadcast(msgs)

    console.log('received: %s', msgs);
  });

  console.log('Client connected');

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
      noOfUsers -= 1;
      wss.broadcast(
                      JSON.stringify ( connectedUsers(noOfUsers) )
                   )

      console.log("Users Online", noOfUsers);
      console.log('Client disconnected');
    });
});
