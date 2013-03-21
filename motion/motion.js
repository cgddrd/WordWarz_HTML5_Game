var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var shiptime = 0;

var FPS = 30;

var enemies = [];
var playerBullets = [];


var timer = setInterval(function() {
	update();
	draw();
}, 1000 / FPS);

var point = {x : 0, y : 0};

var player = {
	color: "#00A",
	x: (canvas.width / 2),
	y: 50,
	width: 32,
	height: 32,
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

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

		var targetAngle = Math.atan2(dy, dx) - 0.3;
		targetAngle = (targetAngle + 360) % 360;
		return targetAngle;

	}


function Enemy(I) {

	I = I || {};

	I.active = true;

	I.angle = 0;

	I.coords = [];
	I.coordsIndex = 0;

	I.x = Math.floor(Math.random() * CANVAS_WIDTH) + 1;
	I.y = CANVAS_HEIGHT;

	I.width = 32;
	I.height = 32;

	I.inBounds = function() {
		return I.x >= 0 && I.x <= CANVAS_WIDTH 
		&& I.y >= 0 && I.y <= CANVAS_HEIGHT;
	};

	I.draw = function() {
		
		var katy_img = new Image("ship.svg");

		katy_img.src = "ship.svg";

		var centrex = I.coords[Math.floor(I.coords.length / 2)].x;
		var centrey = I.coords[Math.floor(I.coords.length / 2)].y;
		var endx = I.coords[I.coords.length - 1].x;
		var endy = I.coords[I.coords.length - 1].y;
		var dy = endy - centrey;
		var dx = endx - centrex;

		this.angle = calculateAngle(dy, dx);
		
		context.save()

		//Set the origin to the center of the image
		context.translate(this.x, this.y);

		context.rotate(this.angle);

		//draw the image    
		context.drawImage(katy_img, (this.width / 2 * (-1)), (this.height / 2 * (-1)), this.width, this.height);

		context.font = "bold 12px sans-serif";
		context.fillText("Hello", (this.width / 2 * (-1)), (this.height / 2 * (-1)) + this.height + 10);

		context.restore();

	};

	I.update = function() {

		if (I.coordsIndex < I.coords.length) {
			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex = I.coordsIndex + 3;
		}

		I.active = I.active && I.inBounds();
	};

	I.coords = generatePath(I.x, I.y, player.x, player.y);

	return I;
};


function collides(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x 
	&& a.y < b.y + b.height && a.y + a.height > b.y;
}

function handleCollisions() {
	enemies.forEach(function(enemy) {
		if (collides(enemy, player)) {
			enemy.active = false;
		}
	});
}

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
	I.storeCoords = function(xVal, yVal) {
		I.coords.push({
			x: xVal,
			y: yVal
		});
	}

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

function update() {
	enemies.forEach(function(enemy) {
		enemy.update();
	});
	enemies = enemies.filter(function(enemy) {
		return enemy.active;
	});

	handleCollisions();


	if (enemies.length < 3 && Math.random() < 0.02) {

		var d = new Date();
		var current = d.getTime();
		var difference = current - this.shiptime;

		if (difference >= 1000) {

			enemies.push(Enemy());
			this.shiptime = current;

		}
			
	}


	playerBullets.forEach(function(bullet) {
		bullet.update();
	});

	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});

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

function draw() {

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	player.draw();

	enemies.forEach(function(enemy) {
		enemy.draw();
	});

	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});

}

function fire() {
	player.shoot();
}

function pause() {
	if (timer != null) {
		clearInterval(timer);
		timer = null;
	} else {
		timer = setInterval(function() {
			update();
			draw();
		}, 1000 / FPS);
	}
}