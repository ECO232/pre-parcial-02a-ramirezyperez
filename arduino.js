import {SerialPort} from 'serialport'
import {ReadlineParser} from 'serialport'
import  Express from 'express'
import { Server } from 'socket.io'

const app = Express();
const httpServer = app.listen(5500, () => {
    console.log("node Server started at port 5500");
});

const io = new Server(httpServer)

const protocolConfiguration = {
    path: 'COM3',
    baudRate: 9600
}

let clickCountRight = 0;
let positionX = 0;
let clickCountLeft = 0;

SerialPort.list().then (
    ports => ports.forEach(port =>console.log(port.path)),
    err =>console.log(err) 

)

const port = new SerialPort(protocolConfiguration);
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
    // Respondes con el recuento de clics derecho
    res.send(`Recuento de clics derecho: ${clickCountRight}`);
    res.json({
        clickCountRight: clickCountRight,
        positionX: positionX,
    
    });
    console.log(positionX)
  });


  app.get('/shooting', (req, res) => {
    // Incrementar el recuento de disparos cuando se accede a /shooting
    shootingCount++;

    // Responder con el recuento de disparos
    res.json({
        shootingCount: shootingCount,
    });
});
  
  app.get('/izquierdo', (req, res) => {
    clickCountLeft++;
    // Restar el recuento de clics izquierdo a la posición X para mover hacia la izquierda
    positionX -= clickCountLeft;

    // Responder con el recuento de clics izquierdo y la nueva posición X
    res.json({
        clickCountLeft: clickCountLeft,
        positionX: positionX,
    });
    // Respondes con el recuento de clics izquierdo
    res.send(`Recuento de clics izquierdo: ${clickCountLeft}`);
    
  });


  app.get('/estado/boton1', (req, res) => {
    const estado = digitalRead(pinBOTON1) == HIGH ? 'Presionado' : 'No presionado';
    res.send(`Estado del botón 1: ${estado}`);
  });
  
  app.get('/estado/boton2', (req, res) => {
    const estado = digitalRead(pinBOTON2) == HIGH ? 'Presionado' : 'No presionado';
    res.send(`Estado del botón 2: ${estado}`);
  });
  
  app.get('/estado/boton3', (req, res) => { 
    const estado = digitalRead(pinBOTON3) == HIGH ? 'Presionado' : 'No presionado';
    res.send(`Estado del botón 3: ${estado}`);
  });

  app.post('/encender/led1', (req, res) => {
    // Enciende el LED 1
    digitalWrite(pinLED1, HIGH);
    res.send('LED 1 encendido');
  });
  
  app.post('/apagar/led1', (req, res) => {
    // Apaga el LED 1
    digitalWrite(pinLED1, LOW);
    res.send('LED 1 apagado');
  });
  
parser.on('data', (data) => {
    console.log(`Received data ${data}`);

    // Suponiendo que 'derecho' es el mensaje que recibes cuando el botón derecho es presionado en Arduino
    if (data === 'derecho') {
        io.emit('move-right');
    }
    // Similarmente para el botón izquierdo y disparar
    if (data === 'izquierdo') {
        io.emit('move-left');
    }
    if (data === 'disparar') {
        io.emit('shoot');
    }
});

app.listen(5500,()=>{
    console.log("node Server start at 2015")
})