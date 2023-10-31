import { SerialPort } from 'serialport';
import { ReadlineParser } from 'serialport';
import express from 'express'; // Cambiado el import de Express
import { Server } from 'socket.io';

const app = express(); // Cambiado el nombre del objeto
const httpServer = app.listen(5500, () => {
    console.log("Node Server started at port 5500");
});

const io = new Server(httpServer);

const protocolConfiguration = {
    path: 'COM3',
    baudRate: 9600
}

let clickCountRight = 0;
let positionX = 0;
let clickCountLeft = 0;
let shootingCount = 0; // Agregado

SerialPort.list().then(
    ports => ports.forEach(port => console.log(port.path)),
    err => console.error(err)
);

const port = new SerialPort(protocolConfiguration.path, { baudRate: protocolConfiguration.baudRate }); // Agregado baudRate
const parser = port.pipe(new ReadlineParser());

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('move-right', () => {
        clickCountRight++;
        positionX += clickCountRight;
        io.emit('actualizar-posicion', positionX);
    });

    socket.on('move-left', () => {
        clickCountLeft++;
        positionX -= clickCountLeft;
        io.emit('actualizar-posicion', positionX);
    });

    socket.on('shoot', () => {
        io.emit('shoot');
    });
});

app.get('/derecho', (req, res) => {
    clickCountRight++;
    positionX += clickCountRight;
    res.json({
        clickCountRight: clickCountRight,
        positionX: positionX,
    });
});

app.get('/shooting', (req, res) => {
    shootingCount++;
    res.json({
        shootingCount: shootingCount,
    });
});

app.get('/izquierdo', (req, res) => {
    clickCountLeft++;
    positionX -= clickCountLeft;
    res.json({
        clickCountLeft: clickCountLeft,
        positionX: positionX,
    });
});

parser.on('data', (data) => {
    console.log(`Received data ${data}`);

    if (data === 'derecho') {
        io.emit('move-right');
    } else if (data === 'izquierdo') {
        io.emit('move-left');
    } else if (data === 'shoot') {
        io.emit('shoot');
    }
});

console.log("Node Server started at port 5500");
