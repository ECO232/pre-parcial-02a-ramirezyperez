//Bookstores
import express from 'express';
import cors from 'cors'
import { Server } from 'socket.io';

//App Port
const PORT = 5500;

const expressApp = express()
expressApp.use(cors())

//Game URL
const httpServer = expressApp.listen(PORT, () => {
    console.table(
        {
            'Game:': 'http://localhost:5500/game',
        })
})

expressApp.use('/game', express.static('public-game'))
expressApp.use(express.json())

//Server
const io = new Server(httpServer, {
    path: '/real-time',
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

//Start Server
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('move-right', () => {
        io.emit('move-right');
    });

    socket.on('move-left', () => {
        io.emit('move-left');
    });

    socket.on('shoot', () => {
        io.emit('shoot');
    });
});