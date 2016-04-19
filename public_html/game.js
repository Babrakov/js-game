window.onload = init;
 
var map;
var ctxMap;
 
var pl;
var ctxPl;
 
var enemyCvs;
var ctxEnemy;
 
var stats;
var ctxStats;
 
var drawBtn;
var clearBtn;
 
var gameWidth = 800;
var gameHeight = 500;
 
var background = new Image();
background.src = "img/bg.png";
 
var background1 = new Image();
background1.src = "img/bg.png";
 
var tiles = new Image();
tiles.src = "img/tiles.png";
 
var player;
var enemies = [];
 
var isPlaying;
var health;
 
var mapX = 0;
var map1X = gameHeight;
 
//for creating enimes
var spawnInterval;
var spawnTime = 6000;
var spawnAmout = 3;

var mouseX;
var mouseY;
 
var requestAnimFrame = window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimatiobFrame ||
                        window.msRequestAnimationFrame;
 
function init(){
    map = document.getElementById("map");
    ctxMap = map.getContext("2d");
    
    pl = document.getElementById("player");
    ctxPl = pl.getContext("2d");
    
    enemyCvs = document.getElementById("enemy");
    ctxEnemy = enemyCvs.getContext("2d");
 
    stats = document.getElementById("stats");
    ctxStats = stats.getContext("2d");  
 
    map.width = gameWidth;
    map.height = gameHeight;
    pl.width = gameWidth;
    pl.height = gameHeight;
    enemyCvs.width = gameWidth;
    enemyCvs.height = gameHeight;
    stats.width = gameWidth;
    stats.height = gameHeight;
    
    ctxStats.fillStyle = "#3D3D3D";
    ctxStats.font = "bold 15pt Arial";
    
    drawBtn = document.getElementById("drawBtn");
    clearBtn = document.getElementById("clearBtn");
    
    drawBtn.addEventListener("click", drawRect, false);
    clearBtn.addEventListener("click", clearRect, false);
    
    player = new Player();
    resetHealth()
    startLoop();	
    
    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);
    document.addEventListener("mousemove", mouseMove, false);
    document.addEventListener("click", mouseClick, false);
}

function mouseMove(e){
	mouseX = e.pageX - map.offsetLeft;
	mouseY = e.pageY - map.offsetTop;
	player.drawX = mouseX - player.width/2;
	player.drawY = mouseY - player.height/2;
	document.getElementById("gameName").innerHTML = "X: " + mouseX + " Y: " + mouseY;
}

function mouseClick(e){
	
	document.getElementById("gameName").innerHTML = "Clicked";
}
 
 function resetHealth(){
    health=100;
}
 
function spawnEnemy(count){
    for(var i = 0; i < count; i++){
        enemies[i] = new Enemy();
    }
}
 
 function startCreatingEnemies(){
	stopCreatingEnemies();
	spawnInterval = setInterval(function(){spawnEnemy(spawnAmout)}, spawnTime);
}
 
function stopCreatingEnemies(){
    clearInterval(spawnInterval);
}
 
 
function loop(){
    if(isPlaying){
        draw();
        update();
        requestAnimFrame(loop);
    }
}
 
function startLoop(){
    isPlaying = true;
    loop();
    startCreatingEnemies();
}
 
function stopLoop(){
    isPlaying = false;
}
 
function draw(){
    player.draw();
    
    clearCtxEnemy();
    for(var i = 0; i < enemies.length; i++){
        enemies[i].draw();
    }
}
 
function update(){
    moveBg();
    drawBg;
    updateStats();
    player.update();
    
    for(var i = 0; i < enemies.length; i++){
        enemies[i].update();
    }
    
}
 
 function moveBg(){
    var vel = 4;
    mapX -= 4;
    map1X -= 4;
    if(mapX + gameWidth < 0) mapX = gameHeight;
    if(map1X + gameWidth < 0) map1X = gameHeight;
}
 
function Player(){
    this.srcX = 0;
    this.srcY = 0;
    this.drawX = 0;
    this.drawY = 185;
    this.width = 150;
    this.height = 83;
 
    this.isUp = false;
    this.isDown = false;
    this.isRight = false;
    this.isLeft = false;
    
    this.speed = 3;
}
 
function Enemy(){
    this.srcX = 0;
    this.srcY = 84;
    this.drawX = Math.floor(Math.random() * gameWidth) + gameWidth;
    this.drawY = Math.floor(Math.random() * gameHeight);
    this.width = 100;
    this.height = 100;
 
    this.speed = 8;
}
 
Enemy.prototype.draw = function(){
    ctxEnemy.drawImage(tiles, this.srcX, this.srcY, this.width, this.height,
        this.drawX, this.drawY, this.width, this.height);
}
 
Enemy.prototype.update = function(){
    this.drawX -= this.speed;
    if(this.drawX+this.width < 0){
        this.destroy();
    }
}
 
 Enemy.prototype.destroy = function(){
	enemies.splice(enemies.indexOf(this),1);
 }
 
Player.prototype.draw = function(){
    clearCtxPlayer();
    ctxPl.drawImage(tiles, this.srcX, this.srcY, this.width, this.height,
        this.drawX, this.drawY, this.width, this.height);
}
 
Player.prototype.update = function(){
    drawBg();
    if(health <= 0) resetHealth();
    
    if(this.drawX < (0 - 30)) this.drawX = (0 - 30);
    if(this.drawX > (gameWidth - this.width)) this.drawX = (gameWidth - this.width);
    if(this.drawY < (0 - 30)) this.drawY = (0 - 30);
    if(this.drawY > (gameHeight - this.height + 30)) this.drawY = (gameHeight - this.height + 30);
    
    for(var i = 0; i < enemies.length; i++){
        if(this.drawX >= enemies[i].drawX &&
            this.drawY >= enemies[i].drawY &&
            this.drawX <= enemies[i].drawX + enemies[i].width &&
            this.drawX <= enemies[i].drawX + enemies[i].height){
            health--;
            }
    }
    
    this.chooseDir();
}
 
Player.prototype.chooseDir = function(){
    if(this.isUp)
        this.drawY -=this.speed;
    if(this.isDown)
        this.drawY +=this.speed;
    if(this.isRight)
        this.drawX +=this.speed;
    if(this.isLeft)
        this.drawX -=this.speed;
}
 
function checkKeyDown(e){
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);
    
    if(keyChar == "W"){
        player.isUp = true;
        e.preventDefault();
    }
    if(keyChar == "S"){
        player.isDown = true;
        e.preventDefault();
    }
    if(keyChar == "D"){
        player.isRight = true;
        e.preventDefault();
    }
    if(keyChar == "A"){
        player.isLeft = true;
        e.preventDefault();
    }
}
 
function checkKeyUp(e){
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);
    
    if(keyChar == "W"){
        player.isUp = false;
        e.preventDefault();
    }
    if(keyChar == "S"){
        player.isDown = false;
        e.preventDefault();
    }
    if(keyChar == "D"){
        player.isRight = false;
        e.preventDefault();
    }
    if(keyChar == "A"){
        player.isLeft = false;
        e.preventDefault();
    }
}
 
function drawRect(){
    ctxMap.fillStyle = "#3D3D3D";
    ctxMap.fillRect(10, 10, 100, 100);
}
 
function clearRect(){
    ctxMap.clearRect(0, 0, 800, 500)
}
 
function clearCtxPlayer(){
    ctxPl.clearRect(0,0, gameWidth, gameHeight);
}
 
 function updateStats(){
    ctxStats.clearRect(0,0, gameWidth, gameHeight);
     ctxStats.fillText("Health " + health, 10, 20);
    //ctxStats.fillText("Health",10,20);
}
 
function clearCtxEnemy(){
    ctxEnemy.clearRect(0,0, gameWidth, gameHeight);
}
 
function drawBg(){
    ctxMap.clearRect(0,0, gameWidth, gameHeight);   
	//ctxMap.drawImage(background, 0, 0, 800, 480, 0, 0, gameWidth, gameHeight);
    ctxMap.drawImage(background1, 0, 0, 800, 480, mapX, 0, gameWidth, gameHeight);
    ctxMap.drawImage(background1, 0, 0, 800, 480, map1X, 0, gameWidth, gameHeight);
}