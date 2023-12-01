// server.js

const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').Server(app);
const PORT = 4000;
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

app.use(cors());

let users = [];
let activeUsers = [];
let currentTurn = 1; 
const maxUsersInRoom = 2;

socketIO.on('connection', (socket) => {
    if (activeUsers.length >= maxUsersInRoom) {
        console.log(`❌: ${socket.id} user denied access, room is full`);
        socket.disconnect();
        return;
    } else {
        console.log(`⚡: ${socket.id} user just connected!`);


        socket.on("newUser", data => {
            const newPlayerID = activeUsers.length + 1;
            const isPlayer1 = newPlayerID === 1;

            const newUser = { ...data, socketID: socket.id, playerID: newPlayerID, isPlayer1 };
            users.push(newUser);
            activeUsers.push(newUser);
            socketIO.emit("newUserResponse", users);

            // Ajoutez cette ligne pour informer le client de son rôle de joueur
            socket.emit("playerRole", { isPlayer1 });

            if (isPlayer1) {
                currentTurn = newPlayerID;
                socketIO.emit("updateTurn", currentTurn);
            }
        });


        socket.on("message", data => {
            const currentUser = activeUsers.find(user => user.socketID === socket.id);
            if (currentUser && currentUser.playerID === currentTurn) {
                socketIO.emit("messageResponse", { ...data, playerID: currentUser.playerID });
                
                // Passez au tour suivant
                currentTurn = (currentTurn % maxUsersInRoom) + 1;
                socketIO.emit("updateTurn", currentTurn);
            }
        });

        socket.on('disconnect', () => {
            console.log('🔥: A user disconnected');
            users = users.filter(user => user.socketID !== socket.id);
            activeUsers = activeUsers.filter(user => user.socketID !== socket.id);
            socketIO.emit("newUserResponse", users);
        });
    }
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello" });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
