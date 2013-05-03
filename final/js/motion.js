/**
 * Processes and handles all animation/interactive 
 * aspects of the game. 
 * 
 * @author Connor Luke Goddard (clg11)
 */

//Provides access to the canvas and it's drawing toolset. 
var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var lastEnemyCreationTime = 0;

//Currently "locked on" enemy in the game. 
var currentEnemy = 0;

//Collections of enemies and bullets currently active in the game. 
var enemies = [];
var playerBullets = [];

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

	
	},

	//Return the position coordinate at the middle of the player sprite. 
	midpoint: function() {
		return {
			x: Math.floor(this.x + this.width / 2),
			y: Math.floor(this.y + this.height / 2)
		};
	}
};

//Image used to represent the player sprite in the game. 
var player_img = new Image();
player_img.src = "images/player1.png";

//Determines whether the enemy is a powerup, or typical enemy. 
var enemytype = {
   	ENEMY: 0,
   	HEALTH: 1
 };
 
//Instantiate various dialog windows/buttons used in the game.   	
var pause = new PauseButton();
var pauseScreen = new PauseScreen();
var helpButton = new HelpButton();
var help = new HelpScreen();
var muteButton = new MuteButton();
var welcome = new WelcomeScreen();
var gameOverScreen = new GameOverScreen();


/**
 * Updates both the current status of the game, 
 * and the various sprite locations/statistics.
 *
 * @return The total number of active enemies. 
 */
function updateGame() {

	//Update all the active enemies.
	updateEnemies();

	//Update all the active bullets.
	updateBullets();

	//Update the player sprite.
	updatePlayer();
	
	return checkEnemyCount();
	
}

/**
 * Draws the updated game model (and all active sprites) 
 * to the canvas element. 
 */
function drawGame() {

	//Reset the canvas.
	clearCanvas();
	
	//Draw the player sprite.
	player.draw();
	
	//Ensure the sprite image is reset back to the default image.
	player_img.src = "images/player1.png";

	//For every active enemy that is not dead...
	enemies.forEach(function(enemy) {
	
		if (enemy.active && !(enemy.used)) {
		
			//Draw the enemy sprite to the canvas.
			enemy.draw();
		
		}	
	}); 
	
	//Draw every active bullet to the canvas.
	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});
	
	//Draw the game control buttons at the top of the canvas. 
	
	context.fillStyle = "#323232";
	context.fillRect(0, 0, 800, 40);
	
	pause.draw(false);
	helpButton.draw();
	muteButton.draw();

}

/**
 * Initialises the current level with the appropiate enemy
 * difficualty settings.
 *
 * @param The time span between each enemy being released.
 * @param The delay between each enemy to be released.
 */
function initLevel(time, delay) {
	
	this.enemySpawnTime = time;
	this.enemySpawnDelay = delay;
	
}

/**
 * Updates the current game statisics in the status bar on the canvas. 
 *
 * @param The current level being played.
 * @param The current score of the player.
 * @param The total number of lives the player currently has. 
 */
function updateGameStats(currentLevel, currentScore, currentLives) {
	
	context.font="300 18px Oswald";
	context.fillStyle = '#eee';
	context.fillText("Level: " + currentLevel, (canvas.width-230), 27);
	context.fillText("Score: " + currentScore, (canvas.width-150), 27);
	context.fillText("Lives: " + currentLives, (canvas.width-70), 27);
	
}

/**
 * Returns the sprite object of the current player. 
 * 
 * @return The player sprite.
 */
function getPlayer() {

	return player;
	
}

/**
 * Loads the images used to represent the various enemy sprites.
 * Detects browser type to decide the image format to load. 
 * 
 * @param newEnemyType The type of the new enemy object. 
 */
function loadEnemyImages(newEnemyType) {

	var ship_img = new Image();
	
	if (newEnemyType === enemytype.ENEMY) {
	
		//If the browser is Mozilla Firefox or Internet Explorer
	//	if ($.browser.mozilla || $.browser.msie) {
	
			//Use the ".png" image
			ship_img.src = "images/ship.png";
		
	//	} else {
			
			//Otherise use the higher quality ".svg" image. 
		//	ship_img.src = "images/ship.svg";
		
		//}
	
	//Otherwise if the new enemy is a health ship	
	} else {
		
		ship_img.src = "images/hospital-cross.png";
			
	}
	
	return ship_img;
		
}

/**
 * Clears and resets the HTML5 canvas to allow the updated game 
 * display to be drawn. 
 */
function clearCanvas() {
	

	//Clear the entire canvas. 
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	//Fill canvas with gradient
	var grd=context.createRadialGradient(400,300,600,40,60,100);
	grd.addColorStop(0,"#091926");
	grd.addColorStop(1,"#2A76B2");


	context.fillStyle=grd;
	context.fillRect(0, 0, 800, 600);

}

/**
 * Generates an array of position coordinates to create the 
 * shortest possible path from an enemy/bullet sprite to the player sprite. 
 *
 * Utilises the Bresenham Line Algorithm - http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
 *
 * @param sourceX The X coordinate of the source object (enemy/bullet sprite)
 * @param sourceY The Y coordinate of the source object (enemy/bullet sprite)
 * @param targetX The X coordinate of the target object (player sprite)
 * @param targetY The Y coordinate of the target object (player sprite)
 * @return An array of coordinates that make up the generated line. 
 */
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


/**
 * Calculates the arctangent angle between two objects.
 * Ensures enemy sprites always face the direction of their target.  
 *
 * Utilises the 'atan2()' function.- http://en.wikipedia.org/wiki/Atan2
 *
 * @param dy The derivative Y coordinate of the vector from the source to the target.
 * @param dx The derivative X coordinate of the vector from the source to the target.
 * @return The arctangent of the quotient of the vector between the source and target (in degrees). 
 */
function calculateAngle(dy, dx) {

	var targetAngle = Math.atan2(dy, dx);
	return targetAngle;

}


/**
 * Box-based collision detection algorithm used to determine
 * two or more sprites have collided with each other. 
 *
 * @param a The first sprite object being checked.
 * @param a The second sprite object being checked.
 * @return Boolean determining if the two obhects in question have collided or not. 
 */
function collides(a, b) {
	  return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

/**
 * Box-based collision detection algorithm used to determine
 * where an enemy has collided with the player or noT. 
 *
 * @param a The first sprite object being checked.
 * @param a The second sprite object being checked.
 * @return Boolean determining if the two obhects in question have collided or not. 
 */
function collidesPlayer(a, b) {
	  return !(
        ((a.y + a.height) < (b.midpoint().y)) ||
        (a.y > (b.midpoint().y + Math.floor((b.height/2)))) ||
        ((a.x + a.width) < (b.midpoint().x)) ||
        (a.x > (b.midpoint().x + (Math.floor(b.width/2))))
    );
}

/**
 * Generates a collection of new enemies for the current level using 
 * data collected from the internal word collection. 
 *
 * @param wordArray The collection of words selected from the internal word datastore. 
 * @param speed The desired movement speed of the new enemies. 
 */
function generateNewEnemies(wordArray, speed) {

	//Loop through all the selected  words for the new level
	for (var i = 0; i < wordArray.length; i++) {
	
		//Create a new enemy sprite object
		var newEnemy = new Enemy();
		
		//Randomly introduce some "health ships"
		if (Math.random() < healthSpawnProb) {
			
			newEnemy.type = enemytype.HEALTH;
			
		} else {
			
			newEnemy.type = enemytype.ENEMY;
			
		}

		//Set the enemy sprite image.
		newEnemy.image = loadEnemyImages(newEnemy.type);
		
		//Set the enemy sprite movement speed.
		newEnemy.speed = speed;
		
		//Set the word that the new enemy will represent. 
		newEnemy.name = wordArray[i].word;
		
		//Set the score awarded for defeating the new enemy.
		newEnemy.score = wordArray[i].score;
		
		//Set the display name of the enemy that is drawn to the canvas.
		newEnemy.displayName = newEnemy.name;

		//Set the health of the new enemy sprite. 
		newEnemy.health = (wordArray[i].word.length);
		
		newEnemy.active = false;
		
		
		//Add the new enemy to the collection of enemies for the current level.
		enemies.push(newEnemy);
		
	}
	
}

/**
 * Checks whether any enemies still exist for the current level.
 *
 * @return Boolean determining if all enemies for a level have been defeated or not. 
 */
function checkEnemyCount() {
	
	if (enemies.length > 0) {
		
		return true;
	}
	
	return false;
}

function checkActiveEnemies() {

var deadenemy = false;
	
	enemies.forEach(function(enemy) {
	
		if (!(enemy.active) && enemy.used) {
			
			deadenemy = true;
			
		}
		
		if (enemy.active && !(enemy.used)) {
			
			return true;
		}
		
	}); 
	
	if (deadenemy) {
		
		return false;
	
	}
	
	return true;
	
}


/**
 * Updates the statistics/status for all enemies.
 * Statistics include position coordinates, health and death. 
 * Also releases new enemies into the game model for players to attack,
 * and removes any in-active enemies from the game. 
 */
function updateEnemies() {

	var d = new Date();
	var current = d.getTime();
	var difference = current - this.lastEnemyCreationTime;
	
	//If the allocated time span and delay between each enemy generated has passed...
	if (difference >= enemySpawnTime && Math.random() < enemySpawnDelay) {

		//...and at least one enemy is still exists..
		if (checkEnemyCount()) {

			//Release the new enemy into the game. 
			var value = Math.floor(Math.random() * enemies.length);
			
			if (!(enemies[value].active) && !(enemies[value].used)) {
				
				enemies[value].active = true;
					
			}
		
		}
		
		//Update the time of the latest enemey creation.
		this.lastEnemyCreationTime = current;
		
	}
	
	//Loop through all the currently active enemies..
	enemies.forEach(function(enemy) {
	
	if (enemy.active && !(enemy.used)) {
		
		//If they have a movement delay set (as they have been hit by a bullet)
		if (enemy.delay > 0) {

			//Reduce the delay, but do not move them along
			enemy.delay--;

		} else {

			//Otherwise update their positon coordinates and move them.
			enemy.update();	

		}
	}
		
	}); 
	
	//REMOVE ANY ENEMIES THAT HAVE DIED IN THIS GAME CYCLE.
	enemies = enemies.filter(function(enemy) {
		return (enemy.used === false);
	});   
       
}

/**
 * Updates the statistics/status for all bullets, and removes any
 * in-active bullets from the game.  
 */
function updateBullets() {

	playerBullets.forEach(function(bullet) {
		bullet.update();
	});

	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});

}

/**
 * Removes any remaining bullets from the game model.  
 */
function clearBullets() {
	
	playerBullets.forEach(function(bullet) {
		bullet.active = false;
	});
	
	
}

/**
 * Updates the statistics/status for the player sprite, and provides
 * the ability to fire new bullets towards enemies.  
 */
function updatePlayer() {

	//Fire a new bullet toward the enemy.
	player.shoot = function(enemyIndex, newLetterIndex) {

		var bulletPosition = this.midpoint();
		
		//Create a new bullet sprite object with the current enemy as the target. 
		playerBullets.push(Bullet({
			speed: 20,
			x: bulletPosition.x,
			y: bulletPosition.y,
			letterIndex: newLetterIndex,
			target: enemies[enemyIndex]
		}));
	};
}

/**
 * Fires a new bullet towards the current enemy.   
 */
function fireBullet(enemyIndex, letterIndex) {
	this.player.shoot(enemyIndex, letterIndex);
}

/**
 * Generates a random number used to determine the starting position of a new enemy.
 *
 * @return A random number between 1 and 2.  
 */
function determineStart() {

	return Math.floor(Math.random() * 2) + 1;

}

/**
 * Generates and displays the in-game help dialog window.
 */
function createHelpScreen() {
	
	if (!help.active) {
		
		help.draw();
		help.active = true;
			
	} else {
		
		help.active = false;
	}
	
	pauseGame();
	
}

/**
 * Handles mouse click events that occur on the HTML5 canvas element. 
 *
 * @param mouse_event The X/Y coordinates of the latest mouse click event.   
 */
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


