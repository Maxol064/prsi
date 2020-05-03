const express = require('express');
const socketIO = require('socket.io');
const Player = require('./player');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static('www/'));
let server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const Room = require('./room');
let rooms = [
    new Room(0, 'Mistnost jedna'),
    new Room(1, 'Mistnost dva'),
    new Room(2, 'Mistnost tri'),
    new Room(3, 'Mistnost ctyri')
];

const io = socketIO(server);

setInterval(() => console.log(rooms), 1000);

io.on('connection', (socket) => {
    console.log('We got a new boi');

    socket.emit('roomlist', rooms);

    let room, player;

    socket.on('joinreq', req => {  // req = { roomid: 'foo', name: 'users name' }
        console.log('joinreq', req);
        socket.join(req.roomid, () => {
            room = rooms[req.roomid];
            console.log('room', room);
            player = new Player(socket.id, req.name);
            console.log('player', player);
            room.newBoi(player);
            console.log('player added');

            io.emit('roomlist', rooms);  // TODO: send only to lobby
            console.log('roomlist emitted');
            socket.emit('joinres', req.roomid);
            console.log('joinres emitted');
            io.to(req.roomid).emit('room-status', room.players);
            console.log('room-status emitted');
        });
    });

    socket.on('disconnect', () => {
        console.log('Bye bye');

        if (room) {
            room.boiLeft(player);
            io.to(room.id).emit('room-status', room.players);
            io.emit('roomlist', rooms);
            room = null;
        }
    });
    
});

