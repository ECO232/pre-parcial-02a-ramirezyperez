//Uso de librerias
import express from 'express';
import cors from 'cors'
import { Server } from 'socket.io';

//Puerto de la aplicacion
const PORT = 5500;

const expressApp = express()
expressApp.use(cors())

//URL del mupi y el control
const httpServer = expressApp.listen(PORT, () => {
    console.table(
        {
            'Game:': 'http://localhost:5500/game',
        })
})

expressApp.use('/game', express.static('public-game'))
expressApp.use(express.json())

//Comportamiento del servidor
const io = new Server(httpServer, {
    path: '/real-time',
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

//Iniciar el servidor
io.on('connection', (socket) => {
    console.log('Nueva conexión de Socket.IO');
  }
)