//Ducks
let duck, duck2;
//back;
let ducks = [];
let spawnInterval = 1500; 
let proSpawnInterval = 5000; 
let lastSpawnTime = 0;
let lastProSpawnTime = 0;
let positionX = [0, 264, 528, 792, 1056, 1320];

//timer
let count = 30;
let countInterval = 1000;
let lastCountUpdate = 0;

//Cursor
let cursorX;
let cursorY;
let game_cursor;

//game
let score = 0;
let isGameOver = false
let socket;

//Duck characteristics
class Duck{
  constructor(img, speed){
    this.x = random(positionX);
    this.y = 0;
    this.speed = speed;
    this.img = img;
  }

  update(){
    this.y += this.speed;
  }

  show(){
    image(this.img, this.x, this.y, 100, 100);
  }
}

//Charge imgs
function preload() {
  duck = loadImage('img/pato.png'); 
  duck2 = loadImage('img/pato2.png');
  game_cursor = loadImage('img/mira.png');
}

function setup() {
    frameRate(60)
    createCanvas(1320, 650);
    cursor(game_cursor);
    noCursor();

    socket = io.connect('http://localhost:5500');

    socket.on('move-right', moveRight);
    socket.on('move-left', moveLeft);
    socket.on('shoot', shooter);
}

function draw() {
  background(220);

  //timer
  if (!isGameOver && millis() - lastCountUpdate > countInterval && count > 0) {
    count--;
    lastCountUpdate = millis();
  }
  textSize(24);
  fill(0);
  stroke(10);
  text(`Time: ${count} `, 1100, 30);
  text(`Score: ${score}`,1100, 70)

  //Game over state
  if(count == 0){
    isGameOver = true
  }


    //Crosshair code
    cursorX = mouseX;
    cursorY = mouseY;
    image(game_cursor,cursorX, cursorY, 40, 40);

    //Duck spaws
    if(!isGameOver && millis() - lastSpawnTime > spawnInterval){
        let newDuck = new Duck(duck, 1);
        ducks.push(newDuck);
        lastSpawnTime = millis();
    }
    
    //Duck2 spaws
    if(!isGameOver && millis() - lastProSpawnTime > proSpawnInterval){
        let newDuck2 = new Duck(duck2, 4);
        ducks.push(newDuck2);
        lastProSpawnTime = millis();
    }

    for (let i = ducks.length - 1; i >= 0; i--) {
        ducks[i].update();
        ducks[i].show();

    if (ducks[i].x < -50) {
        ducks.splice(i, 1); 
    }
  }

  //GameOver 
  if(isGameOver){
    fill(0, 100);
    rect(0, 0, width, height);

    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(`Score: ${score}`, width / 2, height / 2+20)
  }
}

function moveRight(){
    cursorX += 5;
}

function moveLeft(){
    cursorX -= 5;
}

//kill
function shooter(){
    if (!isGameOver && mouseIsPressed) {
    for (let i = ducks.length - 1; i >= 0; i--) {
        const duck = ducks[i];
        const duckX = duck.x;
        const duckY = duck.y;
        const duckWidth = 100;  
        const duckHeight = 100;

        // Check kill
        if (
        mouseX >= duckX &&
        mouseX <= duckX + duckWidth &&
        mouseY >= duckY &&
        mouseY <= duckY + duckHeight
        ) {
        if(duck.img === duck2){
            score += 30;
        }else{
            score += 10;
        }

        ducks.splice(i, 1);
        }
    }
    }
}
