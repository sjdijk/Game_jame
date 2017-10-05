const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/client')));

let allClients =[]

//Routing
app.get('/', function(req, res) {
     res.sendFile('/index.html');
});
//Game room
let numUsers = 0;
let players =[];

function Player(username, x, y, h,w,color) {
    this.username = data.username;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.color = color;
}

setInterval(heartbeat, 33);

function heartbeat() {

    io.sockets.emit('username', players);
}

io.on('connection',
    function (socket) {
        let addedUser = false;
            // when the client emits 'new message', this listens and executes
             socket.on('new message', function (data) {
            // we tell the client to execute 'new message'
            socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });
    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }

        socket.on('user joined',
            // We are given a websocket object in our function
            function(socket) {
                allClients.push(socket.username);
                setInterval(heartbeat, 33);
                socket.emit("messages");
                console.log("We have a new client: " + data.username);

                socket.on('user joined',
                    function (data) {

                        let player = new Player(socket.username, data.x, data.y, data.h, data.w, data.color);
                        players.push(player);
                    }
                );


            });






        socket.on('update',
            function (data) {
                if(allClients.includes(socket.username) ){
                    console.log(data.username);
                    let player;

                    for (let i = 0; i < players.length; i++) {
                        if (socket.username === players[i].username) {
                            player = players[i];
                            console.log(players);
                        }
                    }
                    player.x = data.x;
                    player.y = data.y;
                    player.h = data.h;
                    player.w = data.w;
                    player.color = data.color;
                }
            }
        );
    });


    });



});


// app.get('/', function(req, res) {
//     res.sendFile('/index.html');
// });

// io.on('connect', function(client) {
//     console.log('Client connected...');
//
//     client.on('join', function(data) {
//         console.log(data);
//         client.emit('messages', 'You are connected');
//         });
//
//     client.on('disconnect', function(){
//             console.log('Client disconnected');
//         });
//     client.on('location', function(data){
//         if(data !== null) {
//             console.log(data);
//             //  client.emit('location', this.player.props.x);
//             //  client.emit('location', this.player.props.y);
//         }
//     });
// });

server.listen(port, function() {
    console.log('Server listening at port %d',port)
});



