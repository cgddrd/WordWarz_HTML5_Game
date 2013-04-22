var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var shiptime = 0;

var currentEnemy = 0;

var enemies = [];
var playerBullets = [];

var player_img = new Image();
player_img.src = "images/player1.png";

var player = {

	color: "#00A",
	width: 64,
	height: 64,
	lives: 3,
	score: 0, 
	x: (CANVAS_WIDTH / 2) - 32,
	y: (CANVAS_HEIGHT / 2) - 32,

	draw: function() {

		context.drawImage(player_img, this.x, this.y, this.width, this.height);

	
	}
};

var enemytype = {
   	ENEMY: 0,
   	HEALTH: 1
 };
    	
var pause = new PauseButton();
var pauseScreen = new PauseScreen();
var helpButton = new HelpButton();
var help = new HelpScreen();
var muteButton = new MuteButton();
var welcome = new WelcomeScreen();
var gameOverScreen = new GameOverScreen();

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
	
	context.font="300 18px Oswald";
	context.fillStyle = '#eee';
	context.fillText("Level: " + currentLevel, (canvas.width-230), 27);
	context.fillText("Score: " + currentScore, (canvas.width-150), 27);
	context.fillText("Lives: " + currentLives, (canvas.width-70), 27);
	
}

function clearCanvas() {
	
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	var grd=context.createRadialGradient(400,300,600,40,60,100);
	grd.addColorStop(0,"#091926");
	grd.addColorStop(1,"#2A76B2");

	// Fill with gradient
	context.fillStyle=grd;
	context.fillRect(0, 0, 800, 600);

	context.fillStyle = "#323232";
	context.fillRect(0, 0, 800, 40);

}


function drawGame() {

	clearCanvas();
	
	player.draw();

	player_img.src = "images/player1.png";

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
	muteButton.draw();

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

// function collides(a, b) {
// 	return a.x < b.x + b.width && a.x + a.width > b.x 
// 	&& a.y < b.y + b.height && a.y + a.height > b.y;
// }

function collides(a, b) {
	  return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function generateNewEnemies(array, speed) {
	
	for (var i = 0; i < array.length; i++) {
	
		var newEnemy = new Enemy();
		
		if (Math.random() < 0.07) {
			
			newEnemy.type = enemytype.HEALTH;
			
		} else {
			
			newEnemy.type = enemytype.ENEMY;
			
		}

		newEnemy.image = loadImages(newEnemy.type);
		newEnemy.speed = speed;
		newEnemy.name = array[i].word;
		newEnemy.score = array[i].score;
		newEnemy.displayName = newEnemy.name;
      //newEnemy.textWidth = (newEnemy.displayName.length * 7);

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
		
		if (enemy.delay > 0) {

			enemy.delay--;

		} else {

			enemy.update();	

		}
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

	player.shoot = function(enemyIndex, newLetterIndex) {

		var bulletPosition = this.midpoint();
		
		playerBullets.push(Bullet({
			speed: 20,
			x: bulletPosition.x,
			y: bulletPosition.y,
			letterIndex: newLetterIndex,
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

function fireBullet(enemyIndex, letterIndex) {
	this.player.shoot(enemyIndex, letterIndex);
}


function determineStart() {

	return Math.floor(Math.random() * 2) + 1;

}


