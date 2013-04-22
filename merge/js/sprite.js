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

	I.delay = 0;

	I.textColor = '#eee';
	I.textWidth;

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
		
		context.fillStyle = "rgba(0, 0, 0, 0.5)";

		var metrics = context.measureText(I.displayName);
      	I.textWidth = metrics.width;

		context.fillRect(this.x + 20, this.y, I.textWidth, 25);

		context.font = "300 14pt Oswald";
		context.fillStyle = I.textColor;
		
		context.fillText(I.displayName, (this.x + 20), this.y + 18);

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
	I.width = 3;
	I.height = 3;
	I.color = "#eee";
	I.coords = [];
	I.coordsIndex = 0;

	I.coords = generatePath(I.x, I.y, I.target.x, I.target.y);

	I.draw = function() {
	  var radius = 2;

      context.beginPath();
      context.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = '#eee';
      context.fill();
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
		context.font = '300 14pt Oswald';
		context.fillStyle = '#fff';
		
		if (!resumeFlag) {
			
			context.fillText("Pause", (this.x + 5), (this.y + 15));
			
		} else {
		
			context.fillStyle = "#323232";
			context.fillRect(0, 0, 60, 40);
			context.fillStyle = '#fff';
			context.fillText("Resume", (this.x + 5), (this.y + 16));
			
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
		context.font = '300 14pt Oswald';
		context.fillStyle = '#fff';
		context.fillText("Help", (this.x + 5), (this.y + 16));
		
	};
	
	I.inBounds = function(inputX, inputY) {
		
		return (inputX > this.x && inputX < (this.x + this.width)) 
			&& (inputY > this.y && inputY < (this.y + this.height));
		
	}

	return I;
}

function MuteButton(I) {

	I = I || {};

	I.x = 140;
	I.y = 10;
	I.width = 50;
	I.height = 20;
	I.color = "#000";

	I.draw = function() {
		context.font = '300 14pt Oswald';
		context.fillStyle = '#fff';
		context.fillText("Toggle Sound", (this.x + 5), (this.y + 16));
		
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
	I.x = 100;
	I.y = 50;
	I.width = 550;
	I.height = 480;
	I.color = "rgba(0, 0, 0, 0.8)";
	I.shipImage = loadImages(enemytype.ENEMY);
	I.healthImage = loadImages(enemytype.HEALTH);
	
	I.button = {
		
		x: (I.width - 80),
		y: (I.height - 10),
		height: 40,
		width: 130
		
	};

	I.draw = function() {
		
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
		context.fillStyle = '#fff';	
		context.font = '300 18pt Oswald';
		context.fillText("Game Help:", (I.x + 20), (I.y + 40));

		context.font = '300 14pt Oswald';
		context.fillText("Aim", (I.x + 20), (I.y + 90));

		context.font = '10pt Open Sans';
		context.fillText("Shoot down as many ships as you possibly can by correctly spelling the", (I.x + 30), (I.y + 110));
		context.fillText("words that represent them.", (I.x + 30), (I.y + 125));

		context.font = '300 14pt Oswald';
		context.fillText("How to Play", (I.x + 20), (I.y + 175));

		context.font = '10pt Open Sans';
		context.fillText("Simply type in words as they appear on the screen using your keyboard.", (I.x + 30), (I.y + 195));
		context.fillText("You can only enter one word at a time, and the whole word must", (I.x + 30), (I.y + 230));
		context.fillText("be spelt correctly before continuing. If you mis-spell a word,", (I.x + 30), (I.y + 245));
		context.fillText("simply continue from the point at which you went wrong, there is no", (I.x + 30), (I.y + 260));
		context.fillText("need to re-enter the entire word again.", (I.x + 30), (I.y + 275));

		context.font = '300 14pt Oswald';
		context.fillText("Game Elements", (I.x + 20), (I.y + 325));
		context.drawImage(I.shipImage, (I.x + 60), (I.y + 340),48, 48);
		
		context.font = '10pt Open Sans';
		context.fillText("These are the enemy ships.", (I.x + 120), (I.y + 360));
		context.fillText("DESTROY = Your score + (Points x word length)", (I.x + 120), (I.y + 375));
		context.fillText("COLLISION = 1 life lost", (I.x + 120), (I.y + 390));

		context.drawImage(I.healthImage, (I.x + 60), (I.y + 410),48, 48);
		
		context.font = '10pt Open Sans';
		context.fillText("These are health vessels.", (I.x + 120), (I.y + 430));
		context.fillText("DESTROY = +1 life", (I.x + 120), (I.y + 445));
		context.fillText("COLLISION = Nothing", (I.x + 120), (I.y + 460));

		context.fillStyle = '#eee';	
		context.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
		
		context.font = '400 12pt Oswald';
		context.fillStyle = '#333';
		context.fillText("Continue Game", (this.button.x + 15), (this.button.y + 25));
	};

	I.buttonInBounds = function(inputX, inputY) {
		
		return (inputX > this.button.x && inputX < (this.button.x + this.button.width)) 
			&& (inputY > this.button.y && inputY < (this.button.y + this.button.height));
		
	}

	return I;
}

function WelcomeScreen(I) {

	I = I || {};

	I.active;
	I.x = (CANVAS_WIDTH / 2) - 150;
	I.y = (CANVAS_HEIGHT / 2) - 100;
	I.width = 300;
	I.height = 200;
	I.color = "rgba(0, 0, 0, 0.7)";
	
	I.button = {
		
		x: ((I.x + (I.width / 2)) - 70),
		y: ((I.y + I.height) - 60),
		height: 40,
		width: 140
		
	};

	I.draw = function() {
		
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
		context.fillStyle = '#eee';	
		context.font = '300 26pt Oswald';
		context.fillText("WordWarz", (I.x + (85)), (I.y + 60));

		context.fillStyle = '#eee';	
		context.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
		
		context.font = '300 10pt Oswald';
		context.fillText("By", (I.x + (140)), (I.y + 90));

		context.font = '300 12pt Oswald';
		context.fillText("Connor Goddard (clg11)", (I.x + (85)), (I.y + 110));

		context.font = '400 12pt Oswald';
		context.fillStyle = '#333';
		context.fillText("Begin Game", (this.button.x + 30), (this.button.y + 25));
	};

	I.buttonInBounds = function(inputX, inputY) {
		
		return (inputX > this.button.x && inputX < (this.button.x + this.button.width)) 
			&& (inputY > this.button.y && inputY < (this.button.y + this.button.height));
		
	}

	return I;
}

function GameOverScreen(I) {

	I = I || {};

	I.active;
	I.x = (CANVAS_WIDTH / 2) - 150;
	I.y = (CANVAS_HEIGHT / 2) - 100;
	I.width = 300;
	I.height = 200;
	I.color = "rgba(0, 0, 0, 0.7)";
	
	I.button = {
		
		x: ((I.x + (I.width / 2)) - 70),
		y: ((I.y + I.height) - 60),
		height: 40,
		width: 140
		
	};

	I.draw = function() {
		
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
		context.fillStyle = '#eee';
		context.font = '300 26pt Oswald';
		context.fillText("Game Over", (I.x + (80)), (I.y + 60));

		context.fillStyle = '#eee';	
		context.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
		
		context.font = '300 12pt Oswald';
		context.fillText("Your Score: " + player.score, (I.x + (110)), (I.y + 90));

		context.font = '400 12pt Oswald';
		context.fillStyle = '#333';
		context.fillText("Restart Game", (this.button.x + 25), (this.button.y + 25));
	};

	I.buttonInBounds = function(inputX, inputY) {
		
		return (inputX > this.button.x && inputX < (this.button.x + this.button.width)) 
			&& (inputY > this.button.y && inputY < (this.button.y + this.button.height));
		
	}

	return I;
}

function PauseScreen(I) {

	I = I || {};

	I.active;
	I.x = (CANVAS_WIDTH / 2) - 150;
	I.y = (CANVAS_HEIGHT / 2) - 100;
	I.width = 300;
	I.height = 200;
	I.color = "rgba(0, 0, 0, 0.7)";
	
	I.button = {
		
		x: ((I.x + (I.width / 2)) - 70),
		y: ((I.y + I.height) - 60),
		height: 40,
		width: 140
		
	};

	I.draw = function() {
		
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
		context.fillStyle = '#eee';
		context.font = '300 26pt Oswald';
		context.fillText("Game Paused", (I.x + (65)), (I.y + 60));

		context.fillStyle = '#eee';	
		context.fillRect(this.button.x, this.button.y, this.button.width, this.button.height);
		
		context.font = '300 12pt Oswald';
		context.fillText("Your Score: " + player.score + "   Lives: " + player.lives + "   Level: " + currentLevel, (I.x + 65), (I.y + 90));

		context.font = '400 12pt Oswald';
		context.fillStyle = '#333';
		context.fillText("Continue Game", (this.button.x + 25), (this.button.y + 25));
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

	if (muteButton.inBounds(mousex, mousey) && !(help.active) && !(pause.active)) {
		
		toggleAllSounds();
	
	}
	
	
	if (help.buttonInBounds(mousex, mousey)) {
		
		createHelpScreen();
		
	}
	
	if (welcome.buttonInBounds(mousex, mousey) && welcome.active) {
		
		initGame();
		
	}

	if (gameOverScreen.buttonInBounds(mousex, mousey) && gameOverScreen.active) {
		
		welcomeGame();
		
	}

	if (pauseScreen.buttonInBounds(mousex, mousey) && pauseScreen.active) {
		
		pauseGame();
		
	}
}