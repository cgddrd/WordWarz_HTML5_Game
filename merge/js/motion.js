var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var shiptime = 0;

var currentEnemy = 0;

var enemies = [];
var playerBullets = [];

var player = {

	color: "#00A",
	width: 32,
	height: 32,
	x: (CANVAS_WIDTH / 2) - 16,
	y: (CANVAS_HEIGHT / 2) - 16 ,

	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

function getEnemies() {

	return enemies;
}

function updateGame() {

	var gameover = false;

	gameover = updateEnemies();

	updateBullets();

	updatePlayer();

	handleCollisions();

	//console.log(enemies);

	//generateNewEnemy("twat");
	
	return gameover;
	
}


function drawGame() {

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	player.draw();

	enemies.forEach(function(enemy) {
		if (enemy.active && !(enemy.used)) {
		
		enemy.draw();
		
	}	}); 
	

	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});

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

function handleCollisions() {

	enemies.forEach(function(enemy) {
		if (collides(enemy, player)) {
			enemy.active = false;
			enemy.used = true;
		}
	});

}


function generateNewEnemies(array) {
	
	for (var i = 0; i < array.length; i++) {
	
		var newEnemy = new Enemy();

		newEnemy.speed = 3;
		newEnemy.name = array[i].word;
		newEnemy.active = false;

		enemies.push(newEnemy);
		
	}
	
}

function updateEnemies() {

	//console.log("Array size : " + enemies.length);

	var d = new Date();
	var current = d.getTime();
	var difference = current - this.shiptime;
	
	if (difference >= 2000 && Math.random() < 0.1) {
	
	/*	if (currentEnemy < enemies.length) {
		
			currentEnemy++;
			
			console.log(currentEnemy);
			
		
		} */
		
		
		
		if (enemies.length > 0) {
		
	//	while (enemies[value] == null) {
		
	//	value = Math.floor(Math.random() * enemies.length) + 1;
			
	//	}
		var value = Math.floor(Math.random() * enemies.length);
		
		if (!(enemies[value].active) && !(enemies[value].used)) {
			
			enemies[value].active = true;
			
			
		}
		
		} else {
			
			return true;
		}
		
		this.shiptime = current;
		
	}
	
	
	enemies.forEach(function(enemy) {
	
	if (enemy.active && !(enemy.used)) {
		
		enemy.update();
		
	}
		
	}); 
	

	enemies = enemies.filter(function(enemy) {
		return (enemy.used == false);
	}); 
	 
	 
   return false;    
       
}

function updateBullets() {

	playerBullets.forEach(function(bullet) {
		bullet.update();
	});

	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});

}

function updatePlayer() {

	player.shoot = function() {
		var bulletPosition = this.midpoint();
		playerBullets.push(Bullet({
			speed: 5,
			x: bulletPosition.x,
			y: bulletPosition.y,
			target: enemies[0]
		}));
	};

	player.midpoint = function() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		};
	};
}

function fire() {
	player.shoot();
}

function pauseGame() {

	if (timer != null) {

		clearInterval(timer);
		timer = null;

	} else {

		timer = setInterval(function() {
			updateGame();
			drawGame();
		}, 1000 / FPS);

	}
}

function determineStart() {

	return Math.floor(Math.random() * 2) + 1;

}

function Enemy(I) {

	I = I || {};

	I.active = false;
	I.used = false;

	I.angle = 0;

	I.speed = 1;

	I.width = 32;
	I.height = 32;

	I.coords = [];
	I.coordsIndex = 0;

	I.name;

	I.x = Math.floor(Math.random() * CANVAS_WIDTH) + 1;

	if (determineStart() === 2) {
		I.y = 0;
	} else {
		I.y = CANVAS_HEIGHT;
	} 

	I.inBounds = function() {
		return I.x >= 0 && I.x <= CANVAS_WIDTH 
		&& I.y >= 0 && I.y <= CANVAS_HEIGHT;
	};

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
		
		var ship_img = new Image();

		ship_img.src = "images/ship.svg";

		context.save()

		//Set the origin to the center of the image
		context.translate(this.x, this.y);

		context.rotate(this.angle);

		//draw the image    
		context.drawImage(ship_img, (this.width / 2 * (-1)), (this.height / 2 * (-1)), this.width, this.height);

		context.restore();

		context.font = "bold 12px sans-serif";
		context.fillText(I.name, (this.x + 20), this.y);

		context.beginPath();
      	context.moveTo(I.coords[0].x, I.coords[0].y);
      	context.lineTo(I.coords[I.coords.length - 1].x, I.coords[I.coords.length - 1].y);
      	context.stroke(); 

	};

	I.update = function() {

		if (I.coordsIndex < I.coords.length) {
			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex += I.speed;
		}

		//I.active = I.active && I.inBounds();
	};

	I.coords = generatePath(I.x, I.y, (player.x + (player.width / 2)), (player.y + (player.height / 2)));
	I.setAngle();

	return I;
};

function Bullet(I) {

	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.width = 3;
	I.height = 3;
	I.color = "#000";
	I.coords = [];
	I.coordsIndex = 0;

	I.inBounds = function() {
		return I.x >= 0 && I.x <= CANVAS_WIDTH && I.y >= 0 && I.y <= CANVAS_HEIGHT;
	};

	I.coords = generatePath(I.x, I.y, I.target.x, I.target.y);

	I.draw = function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	};

	I.update = function() {

		if (I.coordsIndex < I.coords.length) {

			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex++;

		} else {

			I.active = false;

		}

		I.active = I.active && I.inBounds();
	};

	return I;
}