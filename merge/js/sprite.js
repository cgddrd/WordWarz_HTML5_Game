/**
 * Holds the variety of sprite data objects used within the game.
 * 
 * @author Connor Luke Goddard (clg11)
 */

/**
 * Represents the sprite object for a enemy within the 
 * game. Holds a number of specific variables and member functions
 * unique to an enemy sprite, and allows new enemy objects to be instantiated. 
 *
 * @constructor
 * @this {Enemy}
 * @param I Constructor object for an enemy. 
 */
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

	//Determines the starting Y position of the enemy on the canvas. 
	I.x = Math.floor(Math.random() * CANVAS_WIDTH) + 1;

	//Determines the starting Y position of the enemy on the canvas. 
	if (determineStart() === 2) {
	
		I.y = 0;
		
	} else {
	
		I.y = CANVAS_HEIGHT;
		
	} 

	//Sets the angle direction that the enemy must face.
	I.setAngle = function() {

		var centrex = I.coords[Math.floor(I.coords.length / 2)].x;
		var centrey = I.coords[Math.floor(I.coords.length / 2)].y;
		var endx = I.coords[I.coords.length - 1].x;
		var endy = I.coords[I.coords.length - 1].y;

		var dy = endy - centrey;
		var dx = endx - centrex;

		this.angle = calculateAngle(dy, dx) + (90 * (Math.PI / 180));

	};

	//Draws the enemy sprite to the canvas. 
	I.draw = function() {
			
			context.save();
			
			//Set the origin to the centre of the sprite..
			context.translate(this.x, this.y);
	
			//If the enemy uses the "space ship" image
			if (I.type === enemytype.ENEMY) {
			
				//Rotate the sprite to face the enemy.  
				context.rotate(this.angle);
			
			}
	
			context.drawImage(I.image, (I.width / 2 * (-1)), (I.height / 2 * (-1)), I.width, I.height);
	
			context.restore();

		
		context.fillStyle = "rgba(0, 0, 0, 0.5)";
	
		//Determine the pixel width of the enemy display name.
		var metrics = context.measureText(I.displayName);
		
		//Set the width of the display text background box.
	    I.textWidth = metrics.width;
	
	    context.fillRect(this.x + 20, this.y, I.textWidth, 25);
	
	    context.font = "300 14pt Oswald";
		context.fillStyle = I.textColor;
		
		//Draw the enemy display name to the canvas. 
		context.fillText(I.displayName, (this.x + 20), this.y + 18);

	};

	//Updates the positon coordinates of the enemy to follow it's generated path. 
	I.update = function() {

		if (I.coordsIndex < I.coords.length) {
			I.x = I.coords[I.coordsIndex].x;
			I.y = I.coords[I.coordsIndex].y;
			I.coordsIndex += I.speed;
		}

	};

	//Generate the shortest path between the current enemy and the player sprite. 
	I.coords = generatePath(I.x, I.y, (player.x + (player.width / 2)), (player.y + (player.height / 2)));
	
	//Set the rotation angle of the current enemy sprite. 
	I.setAngle();

	return I;
};

/**
 * Represents the sprite object for an indivual bullet within the 
 * game. Holds a number of specific variables and member functions
 * unique to an bullet sprite, and allows new bullet objects to be instantiated. 
 *
 * @constructor
 * @this {Bullet}
 * @param I Constructor object for an bullet. 
 */
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
	  
	  //Draw a circle to represent the bullet.
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

/**
 * Represents the pause control button, and allows a new pause button to be instantiated. 
 *
 * @constructor
 * @this {PauseButton}
 * @param I Constructor object for an new pause button. 
 */
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

/**
 * Represents the view help button, and allows the button to be instantiated. 
 *
 * @constructor
 * @this {HelpButton}
 * @param I Constructor object for an new view help button. 
 */
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

/**
 * Represents the mute sound button, and allows the button to be instantiated. 
 *
 * @constructor
 * @this {MuteButton}
 * @param I Constructor object for an new mute sound button. 
 */
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

/**
 * Represents the in-game help screen dialog window, 
 * and allows a new window to be instantiated and displayed on the canvas. 
 *
 * @constructor
 * @this {HelpScreen}
 * @param I Constructor object for an new in-game help dialog. 
 */
function HelpScreen(I) {

	I = I || {};

	I.active;
	I.x = 100;
	I.y = 50;
	I.width = 550;
	I.height = 480;
	I.color = "rgba(0, 0, 0, 0.8)";
	
	//Load the example images of the various enemy sprites. 
	I.shipImage = loadEnemyImages(enemytype.ENEMY);
	I.healthImage = loadEnemyImages(enemytype.HEALTH);
	
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

/**
 * Represents the welcome screen dialog window, 
 * and allows a new window to be instantiated and displayed on the canvas. 
 *
 * @constructor
 * @this {WelcomeScreen}
 * @param I Constructor object for an new welcome dialog. 
 */
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

/**
 * Represents the game over dialog window, 
 * and allows a new window to be instantiated and displayed on the canvas. 
 *
 * @constructor
 * @this {GameOverScreen}
 * @param I Constructor object for a new game over dialog. 
 */
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

/**
 * Represents the in-game pause dialog window, 
 * and allows a new window to be instantiated and displayed on the canvas. 
 *
 * @constructor
 * @this {PauseScreen}
 * @param I Constructor object for an new in-game pause dialog. 
 */
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
		
		//Display the current score of the user on screen.
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