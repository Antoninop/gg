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
const maxUsersInRoom = 2;

socketIO.on('connection', (socket) => {

    if (activeUsers.length >= maxUsersInRoom) {
        console.log(`❌: ${socket.id} user denied access, room is full`);
        socket.disconnect();
        return;
    }

    else
    {
        console.log(`⚡: ${socket.id} user just connected!`);
        socket.on("message", data => {
            if (activeUsers.find(user => user.socketID === socket.id)) {
                socketIO.emit("messageResponse", data);
            }
        });
    
        socket.on("newUser", data => {
            users.push(data);
            activeUsers.push(data);
            socketIO.emit("newUserResponse", users);
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
