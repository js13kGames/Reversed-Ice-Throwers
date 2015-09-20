// declaring dom elements
var intro = document.getElementById("introScreen");
var game = document.getElementById("gameScreen");
var play = document.getElementById("play");

// declaring canvas elements
var requestAnimFrame = window.requestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						function (callback) {
							window.setTimeout(callback, 1000 / 60);
						}

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

isPlaying = false;
score = 0;
var door = new Door();
var icethrower = new IceThrowers();
var player = new Player();


// declaring variables for the ground
var groundHeight = 10,
	g1 = {x: 0, y: 200, w: 500, h: groundHeight},
	g2 = {x: 600, y: 200, w: 500, h: groundHeight},
	g3 = {x: 200, y: 300, w: 500, h: groundHeight},
	g4 = {x: 0, y: 400, w: 400, h: groundHeight},
	g5 = {x: 500, y: 400, w: canvas.width, h: groundHeight},
	g6 = {x: 0, y: 500, w: canvas.width, h: groundHeight};

// declaring variables for ice
function IceThrowers() {
	this.x = 10,
	this.y = 120,
	this.x1 = 300,
	this.y1 = 0,
	this.x2 = 600,
	this.x3 = 150,
	this.x4 = 450,
	this.y2 = canvas.height,
	this.x5 = 750,
	this.speed = 5,
	this.dx = this.x * this.speed;
	this.dy = this.y * this.speed;
	this.ice = new Array();
	this.isFalling = false;
}
	
// declaring variables for the player
function Player() {
	this.angle = 35,
	this.radians = 0,
	this.alien = {x:100, y:100},
	this.speed = 2,
	this.xunits = 0,
	this.yunits = 0,
	this.isUpKey = false,
	this.isRightKey = false,
	this.isDownKey = false,
	this.isLeftKey = false;
	this.isDead = false;
	this.width = 70;
	this.height = 90;
}

function Door() {
	this.x = 700,
	this.y = 430,
	this.w = 50,
	this.h = 70;
}

// snowflake particles
var mp = 50;		// max particles
var particles = [];

for (var i = 0; i < mp; i++) {
	particles.push({
		x: Math.random() * canvas.width,			// x-coordinate
		y: Math.random() * canvas.height - 130,		// y-coordinate
		r: Math.random() * 2 + 1,		// radius
		d: Math.random() * mp			// density
	})
}

window.addEventListener("load", startScreen, false);

function startScreen() {
	intro.style.display = "block";
	game.style.display = "none";
	play.addEventListener("click", startGame, false);
}

// start game
function startGame() {
	intro.style.display = "none";
	game.style.display = "block";
	
	document.addEventListener("keydown", function(e) {
		checkKey(e, true);
	}, false);
	document.addEventListener("keyup", function(e) {
		checkKey(e, false);
	}, false);
	
	playGame();
}

function playGame() {
	drawGame();
	isPlaying = true;
	requestAnimFrame(loop);
}

function updateGame() {
	clearContext(ctx);
	drawGame();

	// update player
	player.update();
}

function loop() {
	if (isPlaying) {
		drawGame();
		updateGame();
		requestAnimFrame(loop);
	}
}

function clearContext(ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function randomRange(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function drawGame() {
	/******************** THE BACKGROUND ********************/
	// the night sky
	var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height - 130);
	gradient.addColorStop(0, "#06F");
	gradient.addColorStop(0.5, "#6B29B9");
	gradient.addColorStop(1, "#FFFFFF");
	ctx.fillStyle = gradient;
	ctx.clearRect(0, 0, canvas.width, canvas.height - 130);
	ctx.fillRect(0, 0, canvas.width, canvas.height - 130);
//	drawBackdrop1();
	
	ctx.fill();
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.beginPath();
	for (var i = 0; i < mp; i++) {
		var p = particles[i];
		ctx.moveTo(p.x, p.y);
		ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
	}
	// the ground
	ctx.fill();
	ctx.fillStyle = "#FAEBD7";
	ctx.fillRect(0, canvas.height - 130, canvas.width, canvas.height);
	
	var start1 = 10;
	var start2 = 40;
	ctx.fillStyle = "#FAEBD7";
	ctx.beginPath();
	ctx.moveTo(0, canvas.height - 130);
	ctx.bezierCurveTo(start1, canvas.height - 150, start2, canvas.height - 150, start2, canvas.height - 130);
	for (var i = 40; i < canvas.width; i += 40) {
		ctx.bezierCurveTo(start1 + i, canvas.height - 150, start2 + i, canvas.height - 150, start2 + i, canvas.height - 130);
		ctx.fill();
	}

	/******************** THE GROUND ********************/
	ctx.fillStyle = "#F0F";
	ctx.shadowOffsetX = 4;
	ctx.shadowOffsetY = 4;
	ctx.shadowColor = "#333";
	ctx.shadowBlur = 4;
	ctx.fillRect(g1.x, g1.y, g1.w, groundHeight);
	ctx.fillRect(g2.x, g2.y, g2.w, groundHeight);
	ctx.fillRect(g3.x, g3.y, g3.w, groundHeight);
	ctx.fillRect(g4.x, g4.y, g4.w, groundHeight);
	ctx.fillRect(g5.x, g5.y, g5.w, groundHeight);
	ctx.fillRect(g6.x, g6.y, g6.w, groundHeight);
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
	
	/******************** THE ICETHROWERS ********************/
	ctx.fillStyle = "#333";
	ctx.beginPath();
	ctx.arc(300, 0, 30, (Math.PI / 180) * 0, (Math.PI / 180) * 180, false);
	ctx.arc(600, 0, 30, (Math.PI / 180) * 0, (Math.PI / 180) * 180, false);
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(150, canvas.height, 30, (Math.PI / 180) * 180, (Math.PI / 180) * 0, false);
	ctx.arc(450, canvas.height, 30, (Math.PI / 180) * 180, (Math.PI / 180) * 0, false);
	ctx.arc(750, canvas.height, 30, (Math.PI / 180) * 180, (Math.PI / 180) * 0, false);
	ctx.fill();
	ctx.closePath();
	
	icethrower.draw();
	door.draw();
	player.draw();
}

/******************** THE ICE FALLING ********************/
IceThrowers.prototype.draw = function() {
	// ice falling
	ctx.fillStyle = "#999";
	ctx.beginPath();
	ctx.moveTo(this.x1 - this.x, this.y1);
	ctx.quadraticCurveTo(this.x1, this.y1 + this.y, this.x1 + this.x, this.y1);
	ctx.moveTo(this.x2 - this.x, this.y1);
	ctx.quadraticCurveTo(this.x2, this.y1 + this.y, this.x2 + this.x, this.y1);
	ctx.moveTo(this.x3 - this.x, this.y2);
	ctx.quadraticCurveTo(this.x3, this.y2 - this.y, this.x3 + this.x, this.y2);
	ctx.moveTo(this.x4 - this.x, this.y2);
	ctx.quadraticCurveTo(this.x4, this.y2 - this.y, this.x4 + this.x, this.y2);
	ctx.moveTo(this.x5 - this.x, this.y2);
	ctx.quadraticCurveTo(this.x5, this.y2 - this.y, this.x5 + this.x, this.y2);
	ctx.moveTo(this.x6 - this.x, this.y2);
	ctx.quadraticCurveTo(this.x6, this.y2 - this.y, this.x6 + this.x, this.y2);
	ctx.fill();
	ctx.closePath();
	
	this.update();
}

IceThrowers.prototype.update = function() {
	this.y1 += this.speed;
	if (this.y1 > canvas.height) {
		this.y1 = -this.y1;
	}
	this.y2 -= this.speed;
	if (this.y2 < 0) {
		this.y2 = -this.y1;
	}
	this.isFalling = true;
	
	checkHitPlayer();
}

/******************** THE PLAYER ********************/
Player.prototype.draw = function() {
	this.alien.y += this.yunits;
	// player - head
	ctx.beginPath();
	ctx.fillStyle = "#9FA";
	ctx.arc(this.alien.x, this.alien.y, 20, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
	ctx.fill();
	ctx.closePath();
	// player - eyes
	ctx.beginPath();
	ctx.fillStyle = "#000";
	drawEllipse(this.alien.x, this.alien.y - 5, 5, 10);
	drawEllipse(this.alien.x + 10, this.alien.y - 5, 6, 10);
	ctx.fill();
	ctx.closePath();
	// player - antennas
	ctx.strokeStyle = "#0F0";
	ctx.moveTo(this.alien.x - 5, this.alien.y - 20);
	ctx.quadraticCurveTo(this.alien.x - 20, this.alien.y - 50, this.alien.x - 30, this.alien.y - 50);
	ctx.moveTo(this.alien.x + 5, this.alien.y - 20);
	ctx.quadraticCurveTo(this.alien.x + 20, this.alien.y - 50, this.alien.x + 30, this.alien.y - 50);
	ctx.stroke();
	ctx.beginPath();
	ctx.fillStyle = "#0F0";
	ctx.arc(this.alien.x - 30, this.alien.y - 50, 2, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(this.alien.x + 30, this.alien.y - 50, 2, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
	ctx.fill();
	ctx.closePath();
	
	collisionDetection();
}

Player.prototype.update = function() {
	// update player
	player.radians = player.angle * Math.PI / 180;
	player.xunits = Math.cos(player.radians) * player.speed;
	player.yunits = Math.sin(player.radians) * player.speed;
	checkDirection();
}

Door.prototype.draw = function() {
	ctx.strokeStyle = "#999";
	ctx.fillStyle = "#333";
	ctx.lineWidth = 2;
	ctx.fillRect(this.x + 5, this.y + 5, this.w - 10, this.h - 10);
	ctx.strokeRect(this.x, this.y, this.w, this.h);
	ctx.clearRect(this.x + 15, this.y + 15, this.w - 30, this.h - 30);
	ctx.beginPath();
	ctx.fillStyle = "#F00";
	ctx.arc(this.x + 10, this.y + 40, 5, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
	ctx.fill();
	ctx.closePath();
}

function collisionDetection() {
	if (player.alien.x + 30 > canvas.width || player.alien.x - 30 < 0) {
		player.angle = 180 - player.angle;
		player.update();
	}
	else if (player.alien.y + 20 > canvas.height || player.alien.y - 50 < 0) {
		player.angle = 360 - player.angle;
		player.update();
	}
	
	if (player.alien.y + 20 > g1.y && player.alien.x - 20 < g1.w) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y + 20 > g2.y && player.alien.x + 30 > g2.x && player.alien.x < (g2.x + g2.w)) {
		player.angle = 360 - player.angle;
	}
	if ((player.alien.y+20) - 5 > g3.y && player.alien.x + 30 > g3.x && player.alien.x - 20 < (g3.x + g3.w)) {
		player.angle = 360 - player.angle;
	}
	if ((player.alien.y+20) + 5 > g4.y && player.alien.x + 30 > g4.x && player.alien.x - 20 < (g4.x + g4.w)) {
		player.angle = 360 - player.angle;
	}
	if ((player.alien.y+20) + 5 > g5.y && player.alien.x + 30 > g5.x) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y + 20 > g6.y && player.alien.x + 30 < g6.w) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y - 20 < g1.y && player.alien.x - 30 > g1.x && player.alien.x < (g1.x + g1.w)) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y - 20 > g2.y && player.alien.x + 30 > g2.x && player.alien.x < (g2.x + g2.w)) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y > g3.y + 30 && player.alien.x > g3.x && player.alien.x - 20 < (g3.x + g3.w)) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y - 20 > g4.y && player.alien.x - 30 > g4.x && player.alien.x - 20 < (g4.x + g4.w)) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.y - 20 > g5.y && player.alien.x + 30 > g5.x && player.alien.x < (g5.x + g5.w)) {
		player.angle = 360 - player.angle;
	}
	if (player.alien.x + 30 > door.x && player.alien.y > door.y + 30) {
		isPlaying = false;
		ctx.fillStyle = "#00F";
		ctx.font = "40pt Sans-Serif";
		ctx.textBaseline = "top";
		ctx.shadowOffsetX = 4;
		ctx.shadowOffsetY = 4;
		ctx.shadowColor = "#333";
		ctx.shadowBlur = 4;
		ctx.fillText("You Win!", canvas.width / 4, canvas.height / 2);
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;
	}
}

function checkHitPlayer() {
	if ((player.alien.x + 30 > icethrower.x1 && player.alien.y + 20 < (icethrower.y1 + icethrower.y))  && 
		 (player.alien.x - 30 < (icethrower.x1 + icethrower.x) && player.alien.y - 20 > icethrower.y1)) {
				 player.alien.x = 100;
				 player.alien.y = 100;
				 player.update();
	}
	else if ((player.alien.x + 30 > icethrower.x2 && player.alien.y + 20 < (icethrower.y1 + icethrower.y)) &&
			 (player.alien.x - 30 < (icethrower.x2 + icethrower.x) && player.alien.y - 20 > icethrower.y1)) {
				 player.alien.x = 100;
				 player.alien.y = 100;
				 player.update();
	}
	else if ((player.alien.x + 30 > icethrower.x3 && player.alien.y - 20 > (icethrower.y2 - icethrower.y)) &&
			 (player.alien.x - 30 < (icethrower.x3 + icethrower.x) && player.alien.y + 20 < icethrower.y2)) {
				 player.alien.x = 100;
				 player.alien.y = 100;
				 player.update();
	}
	else if ((player.alien.x + 30 > icethrower.x4 && player.alien.y - 20 > (icethrower.y2 - icethrower.y)) &&
			 (player.alien.x - 30 < (icethrower.x4 + icethrower.x) && player.alien.y + 20 < icethrower.y2)) {
				 player.alien.x = 100;
				 player.alien.y = 100;
				 player.update();
	}
	else if ((player.alien.x + 30 > icethrower.x5 && player.alien.y - 20 > (icethrower.y2 - icethrower.y)) &&
			 (player.alien.x - 30 < (icethrower.x5 + icethrower.x) && player.alien.y + 20 < icethrower.y2)) {
				 player.alien.x = 100;
				 player.alien.y = 100;
				 player.update();
	}
}

// function to draw ellipse
function drawEllipse(centreX, centreY, width, height) {
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.moveTo(centreX, centreY - height / 2);
	ctx.bezierCurveTo(centreX + width / 2, centreY - height / 2, centreX  + width / 2, centreY + height / 2, centreX, centreY + height / 2);
	ctx.bezierCurveTo(centreX - width / 2, centreY + height / 2, centreX - width / 2, centreY - height / 2, centreX, centreY - height / 2);
	ctx.fill();
	ctx.closePath();
}

function checkDirection() {
	var newDrawX = player.alien.x,
		newDrawY = player.alien.y;
	
	if (player.isRightKey) {
		newDrawX += player.speed;
	}
	else if (player.isLeftKey) {
		newDrawX -= player.speed;
	}
	player.alien.x = newDrawX;
	player.alien.y = newDrawY;
}

function checkKey(e, value) {
	var keyID = e.keyCode || e.which;
	if (keyID === 39) {		// Right arrow
		player.isRightKey = value;
		e.preventDefault();
	}
	if (keyID === 37) {		// Left arrow
		player.isLeftKey = value;
		e.preventDefault();
	}
}
