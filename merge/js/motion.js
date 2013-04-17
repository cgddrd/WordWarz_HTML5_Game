var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var shiptime = 0;

var currentEnemy = 0;

var enemies = [];
var playerBullets = [];

//var ship_img = loadImages();

var player = {

	color: "#00A",
	width: 32,
	height: 32,
	lives: 3,
	score: 0, 
	x: (CANVAS_WIDTH / 2) - 16,
	y: (CANVAS_HEIGHT / 2) - 16 ,

	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

var enemytype = {
    	ENEMY: 0,
    	HEALTH: 1
    	};
    	
var pause = new PauseButton();
var helpButton = new HelpButton();
var help = new HelpScreen();

function getPlayer() {

	return player;
	
}

function loadImages(newEnemyType) {

	var ship_img = new Image();
	
	if (newEnemyType === enemytype.ENEMY) {
	
	if ($.browser.mozilla) {

		ship_img.src = "images/ship.png";
	
	} else {
	
		ship_img.src = "images/ship.svg";
	
	}
	
	} else {
		
		ship_img.src = "images/hospital-cross.png";
		
	}
	
	return ship_img;
		
}


function updateGame() {

	updateEnemies();

	updateBullets();

	updatePlayer();

	return checkEnemyCount();
	
}

function initLevel(time, delay) {
	
	this.enemySpawnTime = time;
	this.enemySpawnDelay = delay;
	
}

function updateGameStats(currentLevel, currentScore, currentLives) {
	
	context.font="20px Arial";
	context.fillStyle = 'blue';
	context.fillText("Level: " + currentLevel, (canvas.width-100), 30);
	context.fillText("Score: " + currentScore, (canvas.width-100), 60);
	context.fillText("Lives: " + currentLives, (canvas.width-100), 90);
	
}

function clearCanvas() {
	
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	
}


function drawGame() {

	clearCanvas();
	
	player.draw();

	enemies.forEach(function(enemy) {
	
		if (enemy.active && !(enemy.used)) {
		
		enemy.draw();
		
		}	
	}); 
	

	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});
	
	pause.draw(false);
	helpButton.draw();

}

function generatePath(sourceX, sourceY, targetX, targetY) {

		var pathArray = [];

		var dx = Math.abs(targetX - sourceX);
		var dy = Math.abs(targetY - sourceY);
		var sx = (sourceX < targetX) ? 1 : -1;
		var sy = (sourceY < targetY) ? 1 : -1;
		var err = dx - dy;

		while (true) {

			pathArray.push({
				x: sourceX,
				y: sourceY
			});


			if (sourceX == targetX && sourceY == targetY) {
				break;
			}

			var e2 = 2 * err;

			if (e2 > -dy) {
				err = err - dy;
				sourceX = sourceX + sx;
			}
			
			if (e2 < dx) {
				err = err + dx;
				sourceY = sourceY + sy;
			}
		}

		return pathArray;
	}

function calculateAngle(dy, dx) {

	var targetAngle = Math.atan2(dy, dx);
	return targetAngle;

}

function collides(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x 
	&& a.y < b.y + b.height && a.y + a.height > b.y;
}

function generateNewEnemies(array, speed) {
	
	for (var i = 0; i < array.length; i++) {
	
		var newEnemy = new Enemy();
		
		if (Math.random() < 0.07) {
			
			console.log("helath generated");
			newEnemy.type = enemytype.HEALTH;
			
		} else {
			
			newEnemy.type = enemytype.ENEMY;
			
		}

		newEnemy.image = loadImages(newEnemy.type);
		newEnemy.speed = speed;
		newEnemy.name = array[i].word;
		newEnemy.score = array[i].score;
		newEnemy.displayName = newEnemy.name;
		newEnemy.health = (array[i].word.length);
		
		newEnemy.active = false;

		enemies.push(newEnemy);
		
	}
	
}

function checkEnemyCount() {
	
	if (enemies.length > 0) {
		
		return true;
	}
	
	return false;
}

function updateEnemies() {

	var d = new Date();
	var current = d.getTime();
	var difference = current - this.shiptime;
	
	if (difference >= enemySpawnTime && Math.random() < enemySpawnDelay) {

		if (checkEnemyCount()) {

			var value = Math.floor(Math.random() * enemies.length);
			
			if (!(enemies[value].active) && !(enemies[value].used)) {
				
				enemies[value].active = true;
					
			}
		
		}
		
		this.shiptime = current;
		
	}
	
	
	enemies.forEach(function(enemy) {
	
	if (enemy.active && !(enemy.used)) {
		
		enemy.update();
		
	}
		
	}); 
	

	enemies = enemies.filter(function(enemy) {
		return (enemy.used === false);
	});   
       
}

function updateBullets() {

	playerBullets.forEach(function(bullet) {
		bullet.update();
	});

	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});

}

function clearBullets() {
	
	playerBullets.forEach(function(bullet) {
		bullet.active = false;
	});
	
	
}

function updatePlayer() {

	player.shoot = function(enemyIndex) {
	
		var bulletPosition = this.midpoint();
		
		playerBullets.push(Bullet({
			speed: 8,
			x: bulletPosition.x,
			y: bulletPosition.y,
			target: enemies[enemyIndex]
		}));
	};

	player.midpoint = function() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		};
	};
}

function fireBullet(enemyIndex) {
	this.player.shoot(enemyIndex);
}


function determineStart() {

	return Math.floor(Math.random() * 2) + 1;

}

function Enemy(I) {

	I = I || {};
	
	I.active = false;
	I.used = false;
	
	I.type;
	
	I.image;

	I.angle = 0;

	I.speed = 1;

	I.width = 32;
	I.height = 32;

	I.coords = [];
	I.coordsIndex = 0;

	I.displayName;
	
	I.health;

	I.x = Math.floor(Math.random() * CANVAS_WIDTH) + 1;

	if (determineStart() === 2) {
	
		I.y = 0;
		
	} else {
	
		I.y = CANVAS_HEIGHT;
		
	} 

	I.setAngle = function() {

		var centrex = I.coords[Math.floor(I.coords.length / 2)].x;
		var centrey = I.coords[Math.floor(I.coords.length / 2)].y;
		var endx = I.coords[I.coords.length - 1].x;
		var endy = I.coords[I.coords.length - 1].y;

		var dy = endy - centrey;
		var dx = endx - centrex;

		this.angle = calculateAngle(dy, dx) + (90 * (Math.PI / 180));

	};

	I.draw = function() {
	
	if (I.type === enemytype.ENEMY) {
		
		context.save();
		
		//Set the origin to the center of the image
		context.translate(this.x, this.y);

		context.rotate(this.angle);

		context.drawImage(I.image, (I.width / 2 * (-1)), (I.height / 2 * (-1)), I.width, I.height);

		context.restore();
		
	} else {
		
		context.save();
		context.translate(this.x, this.y);
		context.drawImage(I.image, (I.width / 2 * (-1)), (I.height / 2 * (-1)), I.width, I.height);
		context.restore();
		
	}
		
		context.font = "bold 12px sans-serif";
		
		context.fillText(I.displayName, (this.x + 20), this.y);

		/*
		context.beginPath();
      	context.moveTo(I.coords[0].x, I.coords[0].y);
      	context.lineTo(I.coords[I.coords.length - 1].x, I.coords[I.coords.length - 1].y);
      	context.stroke(); 
      	*/

	};

	I.update = function() {

		if (I.coordsIndex < I.coords.length) {
			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex += I.speed;
		}

	};

	I.coords = generatePath(I.x, I.y, (player.x + (player.width / 2)), (player.y + (player.height / 2)));
	I.setAngle();

	return I;
};

function Bullet(I) {

	I = I || {};

	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3;
	I.color = "#000";
	I.coords = [];
	I.coordsIndex = 0;

	I.coords = generatePath(I.x, I.y, I.target.x, I.target.y);

	I.draw = function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	};

	I.update = function() {

		if (I.coordsIndex < I.coords.length) {

			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex+=I.speed;

		} else {

			I.active = false;

		}

	};

	return I;
}

function PauseButton(I) {

	I = I || {};

	I.x = 10;
	I.y = 10;
	I.width = 50;
	I.height = 20;
	I.color = "#000";
	I.active;

	I.draw = function(resumeFlag) {
		context.font = '12pt Calibri';
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillStyle = '#fff';
		
		if (!resumeFlag) {
			
			context.fillText("Pause", (this.x + 5), (this.y + 15));
			
		} else {
		
			context.fillStyle = this.color;
			context.fillRect(this.x, this.y, this.width + 10, this.height);
			context.fillStyle = '#fff';
			context.fillText("Resume", (this.x + 5), (this.y + 15));
			
		}
		
	};
	
	I.inBounds = function(inputX, inputY) {
		
		return (inputX > this.x && inputX < (this.x + this.width)) 
			&& (inputY > this.y && inputY < (this.y + this.height));
		
	}

	return I;
}

function HelpButton(I) {

	I = I || {};

	I.x = 80;
	I.y = 10;
	I.width = 50;
	I.height = 20;
	I.color = "#000";

	I.draw = function() {
		context.font = '12pt Calibri';
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillStyle = '#fff';
		context.fillText("Help", (this.x + 5), (this.y + 15));
		
	};
	
	I.inBounds = function(inputX, inputY) {
		
		return (inputX > this.x && inputX < (this.x + this.width)) 
			&& (inputY > this.y && inputY < (this.y + this.height));
		
	}

	return I;
}

function HelpScreen(I) {

	I = I || {};

	I.active;
	I.x = 150;
	I.y = 50;
	I.width = 500;
	I.height = 500;
	I.color = "rgba(0, 0, 0, 0.7)";
	
	I.button = {
		
		x: (I.x + 10),
		y: (I.y + 60),
		height: 20,
		width: 30
		
	}

	I.draw = function() {
		
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
		context.fillStyle = '#fff';	
		context.font = '18pt Calibri';
		context.fillText("In-Game Help Screen:", (I.x + 10), (I.y + 40));
		
		
		context.fillStyle = 'blue';	
		context.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
	};

	I.buttonInBounds = function(inputX, inputY) {
		
		return (inputX > this.button.x && inputX < (this.button.x + this.button.width)) 
			&& (inputY > this.button.y && inputY < (this.button.y + this.button.height));
		
	}

	return I;
}

function createHelpScreen() {
	
	if (!help.active) {
		
		help.draw();
		help.active = true;
			
	} else {
		
		help.active = false;
	}
	
	pauseGame();
	
}

function checkMouse(mouse_event) {
	
	var bounding_box = canvas.getBoundingClientRect();
	
	var mousex = (mouse_event.clientX-bounding_box.left) * (canvas.width/bounding_box.width);	
        
    var mousey = (mouse_event.clientY-bounding_box.top) * (canvas.height/bounding_box.height);	
	
	if (pause.inBounds(mousex, mousey) && !(help.active)) {
		
		
		pauseGame();
	
	}
	
	if (helpButton.inBounds(mousex, mousey) && !(help.active) && !(pause.active)) {
		
		createHelpScreen();
	
	}
	
	if (help.buttonInBounds(mousex, mousey)) {
		
		createHelpScreen();
		
	}
}
