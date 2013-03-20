var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var FPS = 30;

var textX = (canvas.width / 2);
var textY = 50;

var dx = 2;
var dy = 4;


var enemies = [];
var playerBullets = [];


var timer = setInterval(function() {
	update();
	draw();
}, 1000 / FPS);


var player = {
	color: "#00A",
	x: textX,
	y: textY,
	width: 32,
	height: 32,
	draw: function() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
	}
};

function Enemy(I) {
	I = I || {};
	I.active = true;
	I.age = Math.floor(Math.random() * 128);
	I.angle = 0;
	I.turnSpeed = 1;
	I.Xstep = 1;
	I.Ystep = 1;
	I.coords = [];
	I.coordsIndex = 0;
	var index = Math.floor(Math.random() * 2) + 1;
	I.x = Math.floor(Math.random() * CANVAS_WIDTH) + 1;
	I.y = CANVAS_HEIGHT;
	//I.y = Math.floor(Math.random() * ((CANVAS_HEIGHT - (CANVAS_HEIGHT * 0.75)) + 1)) + CANVAS_HEIGHT * 0.75;
	I.xVelocity = 0;
	I.yVelocity = 0;
	I.width = 32;
	I.height = 32;
	I.xVelocity = 2 * Math.sin(I.age * Math.PI / 64);
	I.inBounds = function() {
		return I.x >= 0 && I.x <= CANVAS_WIDTH && I.y >= 0 && I.y <= CANVAS_HEIGHT;
	};
	I.storeCoords = function(xVal, yVal) {
		I.coords.push({
			x: xVal,
			y: yVal
		});
	}
	I.calc = function() {
		var x1 = I.x;
		var x2 = textX + 16;
		var y1 = I.y;
		var y2 = textY + 16;
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);
		var sx = (x1 < x2) ? 1 : -1;
		var sy = (y1 < y2) ? 1 : -1;
		var err = dx - dy;
		while (true) {
			I.storeCoords(x1, y1)
			if (x1 == x2 && y1 == y2) {
				break;
			}
			var e2 = 2 * err;
			if (e2 > -dy) {
				err = err - dy;
				x1 = x1 + sx;
			}
			if (e2 < dx) {
				err = err + dx;
				y1 = y1 + sy;
			}
		}
	}
	I.calc();
	I.draw = function() {
		var katy_img = new Image();
		// katy_img.src="ship.gif";
		katy_img.src = "ship.svg";
		var targetX = textX - I.x;
		var targetY = textY - I.y;
		var centrex = I.coords[Math.floor(I.coords.length / 2)].x;
		var centrey = I.coords[Math.floor(I.coords.length / 2)].y;
		var endx = I.coords[I.coords.length - 1].x;
		var endy = I.coords[I.coords.length - 1].y;
		var dy = endy - centrey;
		var dx = endx - centrex;
		var targetAngle = Math.atan2(dy, dx) - 0.3;
		targetAngle = (targetAngle + 360) % 360;
		
		context.save()
		//Set the origin to the center of the image
		context.translate(this.x, this.y);
		context.rotate(targetAngle);
		//draw the image    
		context.drawImage(katy_img, (this.width / 2 * (-1)), (this.height / 2 * (-1)), this.width, this.height);
		context.font = "bold 12px sans-serif";
		context.fillText("Hello", (this.width / 2 * (-1)), (this.height / 2 * (-1)) + this.height + 10);
		context.restore();
/*  context.beginPath();
      context.moveTo(I.coords[0].x, I.coords[0].y);
      context.lineTo(I.coords[I.coords.length - 1].x, I.coords[I.coords.length - 1].y);
      context.stroke(); */
	};
	I.update = function() {
		if (I.coordsIndex < I.coords.length) {
			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex = I.coordsIndex + 3;
		}
		I.active = I.active && I.inBounds();
	};
	return I;
};

function collides(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function handleCollisions() {
	enemies.forEach(function(enemy) {
		if (collides(enemy, player)) {
			enemy.active = false;
			//player.explode();
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
	I.calc = function() {
		var x1 = I.x;
		var x2 = I.target.x;
		var y1 = I.y;
		var y2 = I.target.y;
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);
		var sx = (x1 < x2) ? 1 : -1;
		var sy = (y1 < y2) ? 1 : -1;
		var err = dx - dy;
		while (true) {
			I.storeCoords(x1, y1)
			if (x1 == x2 && y1 == y2) {
				break;
			}
			var e2 = 2 * err;
			if (e2 > -dy) {
				err = err - dy;
				x1 = x1 + sx;
			}
			if (e2 < dx) {
				err = err + dx;
				y1 = y1 + sy;
			}
		}
	}
	I.calc();
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
	if (enemies.length < 3 && Math.random() < 0.015) {
		enemies.push(Enemy());
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