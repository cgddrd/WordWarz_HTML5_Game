/**
 * Main game engine script used to process the progress of the player through the game.
 * In addition handles all of the font/sound loading and keyboard input. 
 * 
 * @author Connor Luke Goddard (clg11)
 */
 
var FPS = 30;
var levelOver = false;
var gameOver = false;
var lockedEnemy = null;
var lockedEnemyIndex = 0;
var timer;
var currentLevel = 1;
var enemySpeed = 1;
var enemySpawnTime = 1000;
var enemySpawnDelay = 0.025;
var wordLimit = 5;
var inputChars = 0;
var wpmTime = 0;

var powerupSound = $("#powerupSound").get(0);
var laserSound = $("#laserSound").get(0);
var explosionSound = $("#explosionSound").get(0);
var bgSound = $("#bgSound").get(0);

explosionSound.volume = 0.2;
laserSound.volume = 0.2;
powerupSound.volume = 0.2;

var muted = false;

var levelDifficultyEnum = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2
}

/**
 * Google Fonts WebLoader script that allows the non-asynchronous fonts
 * to be loaded via Javascript. 
 */
   WebFontConfig = {
        google: {
            families : ['Open Sans', 'Oswald']
        }
    };

    var webFontsInit = function() {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
    }();

/**
 * Window/tab focus detection via jQuery to automatically pause the game. 
 */
$(document).ready(function(){
  $(window).blur(function(){
    if (timer !== null && gameOver === false) {
    	pauseGame();
    }
  });
});

/**
 * Backspace key detection to prevent the browser default behaviour of navigating back. 
 */
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD')) 
             || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});

/**
 * Determines the keybaord input from the user and calls the appropiate actions. 
 */
window.document.onkeydown = function(event) {
  
  var keyCode; 
  
  if(event === null) {
  
    keyCode = window.event.keyCode; 
    
  } else {
  
    keyCode = event.keyCode; 
    
  }
  
  //If any alpha keys are pressed.. (a-z/A-Z))
  if (keyCode >= 65 && keyCode <= 122) {
    
    //Check the input.
    inputChars++;
    checkUserInput(keyCode);
	    
  }

  //If the 'esc' key is pressed
  if (keyCode === 27) {

	//Pause the game.
  	pauseGame();
  }
    
}

/**
 * Perform preliminary background tasks 
 * and display welcome screen. 
 */
function welcomeGame() {

	//Access word data files. 
	initialiseDictionary();
	
	if (gameOver === true) {
		resetGame();
		gameOverScreen.active = false;
	}

	//Load any exisitng acheivements/scores.
	loadAchievements();

	//Fill canvas with gradient.
	var grd=context.createLinearGradient(0,0,0,800);
	grd.addColorStop(0,"#091926");
	grd.addColorStop(1,"#3D5B73");

	context.fillStyle=grd;
	context.fillRect(0, 0, 800, 600);

	//Add action listener to allow canvas to accept mouse clicks. 
	canvas.addEventListener("click",checkMouse,false);
	
	welcome.active = true;
	welcome.draw();	
	
}



/**
 * Reset game statistics to allow the game to be restarted. 
 */
function resetGame() {

	player.score = 0;
	player.lives = 3;
	enemies = [];
	levelOver = false;
	gameOver = false;
	lockedEnemy = null;
	playerBullets = [];
	currentEnemy = 0;
	lockedEnemyIndex = 0;
	currentLevel = 1;
	enemySpeed = 1;
	enemySpawnTime = 1000;
	enemySpawnDelay = 0.025;
	wordLimit = 5;

}

/**
 * Mute/unmute the background music and sound effects. 
 */
function toggleAllSounds() {

	if (!muted) {

		stopAllSounds();

		muted = true;

	} else {

		playBGSound();
		muted = false;

	}


}

/**
 * Mute all HTML5 audio elements. 
 */
function stopAllSounds() {

	$.each($('audio'), function () {
		    this.pause();
		});
}

/**
 * Play the background music HTML5 audio element. 
 */
function playBGSound() {

	bgSound.play();

}

/**
 * Set sound muting to false. 
 */
function disableMute() {
	
	muted = false;
	
}

/**
 * Initialise and begin the game. 
 */
function initGame() {

	//Hide welcome screen. 
	welcome.active = false;

	//Start game sounds. 
	bgSound.addEventListener('canplaythrough', function() {
	 
	   if (typeof bgSound.loop === 'boolean') {
		    bgSound.loop = true;
		} else {
		    bgSound.addEventListener('ended', function() {
		        this.currentTime = 0;
		        this.play();
		    }, false);
		}
		 
	}, false);


	disableMute();
	
	//Begin playing background music.
	bgSound.currentTime = 0;
	playBGSound();

	//Set the in-game acheivements.
	setDefaultAchievements()

	//Set the stating time of the game.  (Used for awarding acheivements)
	setStartTime();
	
	//Start the first level.
	startLevel();

}

/**
 * Controls the level of difficulty for the game as the player progresses
 * through levels. 
 */
function setLevelDifficulty() {
	
	if (currentLevel % 5 == 0 && enemySpeed < 3) {
			
		enemySpeed++;
		
	} 
		
	if (currentLevel % 3 == 0 && enemySpawnDelay < 0.04) {
			
		enemySpawnDelay+=0.005;
			
	} 
		
	if (currentLevel % 4 == 0 && enemySpawnTime > 400) {
			
		enemySpawnTime-=50;
			
	} 

}

/**
 * Controls the maximum length of words used in levels as the player progresses
 * through the game. 
 */
function setLevelWordLength() {

	if (currentLevel < 8) {
			
			generateNewEnemies(getRandomWords(wordLimit, levelDifficultyEnum.EASY), enemySpeed);
			
	} else if (currentLevel >=8 && currentLevel <=12) {
			
			generateNewEnemies(getRandomWords(wordLimit, levelDifficultyEnum.MEDIUM), enemySpeed);
			
	} else {
		
		generateNewEnemies(getRandomWords(wordLimit, levelDifficultyEnum.HARD), enemySpeed);
		
	}
		
}

/**
 * Initialises and begins the current level. 
 */
function startLevel() {

	//If it is the first level, begin the level witht he default difficulty settings.
	if (currentLevel === 1) {
		
		initLevel(enemySpawnTime, enemySpawnDelay);

		generateNewEnemies(getRandomWords(wordLimit, levelDifficultyEnum.EASY), enemySpeed);
		
		
	} else {
	
	/* Otherwise, check to see what the current level is and 
	 * decide how many words should be included in the level.
	 */
	if (wordLimit < 26) {

		if (currentLevel < 10) {
			
			wordLimit++;
			
		} else {
			
			wordLimit+=2;
			
		}

	}
		
		setLevelDifficulty();
		
		initLevel(enemySpawnTime, enemySpawnDelay);
		
		setLevelWordLength();
		
	}
	
	//Start the game loop used to run and animate the game. 
	timer = setInterval(function() {
	
		//Update the game statistics and data. 
		updateGame();
	
		//If all the enemies have been destoryed, end the level.
		if (!checkEnemyCount()) {
			
			clearInterval(timer);
			levelOver = true;
		
		//Otherwise continue on with the level.
		} else {
		
			//Update the HTML5 canvas. 
			drawGame();
			
			//Update the game statistics. 
			updateGameStats(currentLevel, getPlayer().score, getPlayer().lives);
			
		}
		
		//Process any collisions that have occured. 
		handleCollisions();
		
		//Check whether any new acheivements have been completed. 
		checkAllAchievements();

		//Calculate the current WPM value. 
		calcWPM();
		
		//SWAPPED AROUND!!
		
		//Check if the level has been finished.
		checkLevels();
		
		
	}, 1000 / FPS);	
}

/**
 * Checks to see if the current level has been completed. 
 */
function checkLevels() {
	
	if (levelOver) {
	
		currentLevel++;
		
		//Stop the game loop. 
		//clearInterval(timer);
		
		levelOver = false;
		
		//Reset the letters used in the last level. 
		resetUsedLetters();
		
		
		//Start the next level.
		startLevel();
		
	}
	
}

/**
 * Updates the current score of the player.
 *
 * @param scoreValue The new score to be incremented. 
 */
function updatePlayerScore(scoreValue) {
	
	getPlayer().score+=scoreValue;
	
}

/**
 * Sets the current enemy being attacked/"locked into".
 *
 * @param scoreValue The new score to be incremented. 
 */
function setLockedEnemy(enemy) {
	
	this.lockedEnemy = enemy;
	
}

/**
 * Checks whether the current enemy has died or not. 
 *
 * @param theEnemy The current enemy being attacked.
 */
function checkEnemyHealth(theEnemy) {

	//Reduce the health of the enemy. 
	theEnemy.health--;


	//If the enemy has died...
	if (theEnemy.health <= 0) {
		
		//If the enemy is a health ship
		if (theEnemy.type === enemytype.HEALTH) {
			
			//Increase the players lives by one. 
			player.lives++;
			
			//Play the sound efefct if not muted. 
			if (!muted) {		
	            powerupSound.play();
        	}

        
        //Otherwise if it is an enemy ship...
		} else {
			
			//Update the score of the player.
			updatePlayerScore(theEnemy.score);
			
			if (!muted) {
	            explosionSound.play();
        	}
			
		}

		//Update the "latest words" container on the webpage.
		updateWordList(theEnemy.name);
		
		//Remove the enemy form the game and release it from the lock.
		theEnemy.active = false;
		theEnemy.used = true;
		lockedEnemy = null;
		lockedEnemyIndex = 0;
		
		//Clear any remaining bullets from the canvas. 
		clearBullets();		

	//Otherwise if the enemy is not dead
	} else {

		//Increment the enemy value index to the next letter in the array to be removed. 
		lockedEnemyIndex++;
		
		//Update the display name of the enemy on the canvas. 
		lockedEnemy.displayName = lockedEnemy.name.substring(lockedEnemyIndex);

	}

}

/**
 * Fires a bullet towards the enemy to damage them. 
 */
function damageEnemy() {

 //If the current enemy has not died..
 if (lockedEnemy.health > 0) {
	
	//Fire a bullet towards them to damage them.	
	fireBullet(enemies.indexOf(lockedEnemy), lockedEnemyIndex);
	
	//Update the health of the enemy. 
	checkEnemyHealth(lockedEnemy);


	if (!muted) {
        laserSound.play();
   	}

   	//Update the image of the player sprite to indicate a bullet has been fired. 
   	player_img.src = "images/player3.png";

 }

}

/**
 * Processes the keyboard input from the user. 
 *
 * @param keyCode The ASCII code of the inputted character. 
 */
function checkUserInput(keyCode) {
	
	var inputLetter = String.fromCharCode(keyCode);
	
	//If no enemy is current "locked in"
	if (lockedEnemy === null) {
	
		//Attempt to locate a new enemy to "lock onto".
		enemies.forEach(function(enemy) {
		
			var enemyName = enemy.name.toUpperCase();
		
			if (enemyName.charCodeAt(0) === keyCode && enemy.active === true) {
				
				/* If an enemy currenly in the game has a word with the 
				 * first character matching the entered character, lock onto them.
				 */
				setLockedEnemy(enemy);
				lockedEnemy.textColor = '#FE8E34';

				damageEnemy();
				
			} 
		});
	
	//Otherwise if there is an enemy already locked onto..
	} else {
		
		//Check to see if the user has spelt the next character correctly, and if so fire a bullet.
		var enemyName = lockedEnemy.name.toUpperCase();
		var letterCode = enemyName.charCodeAt(lockedEnemyIndex);
		
		if (enemyName.charCodeAt(lockedEnemyIndex) === keyCode) {
		
			damageEnemy();

		}		
	}	
}

/**
 * Processes what actions take place when 
 * various game sprites collide with each other. 
 */
function handleCollisions() {

	//Handle bullet/enemy collsions
	playerBullets.forEach(function(bullet) {
	    enemies.forEach(function(enemy) {
	    
	      if (collides(bullet, enemy)) {
	  
		    //Slightly delay the movement progress of the enemy
	        enemy.delay = 2;
	        
	        //Move the enemy back slightly to simulate being hit by the bullet. 
	        var coordsindex = enemy.coordsIndex - 5;
	        enemy.coordsIndex = coordsindex;
	        
	        //Clear the bullet
	        bullet.active = false;

	      }
	    });
	  });

	//Handle enemy/player collisions
	enemies.forEach(function(enemy) {
	
		if (collides(enemy, player)) {
		
			//Clear the enemy
			enemy.active = false;
			enemy.used = true;
			lockedEnemy = null;
			lockedEnemyIndex = 0;
			
			//If an enemy ship (not health) collides..
			if (enemy.type === enemytype.ENEMY) {
				
				//Reduce the lives of the player.
				player.lives--;
				
				//Update the image of the player sprite to indicate collision/
				player_img.src = "images/player2.png";
				
			}
			
			//Check if the player has died..
			if (player.lives <= 0) {
				
				//If so reset the canvas
				clearCanvas();
				
				//End the game.
				processGameOver();
				
			}
		}
	});

}

/**
 * Calculates the current words-per-minute
 * speed of the player.  
 */
function calcWPM() {

	var d = new Date();
	var current = d.getTime();
	var difference = current - wpmTime;

	//Update every 10 seconds.
	if (difference >= 10000) {

		//Calculate the number of words entered in 10 seconds
		var noWords = (Math.ceil(inputChars / 5));
		
		//Multiply this by six to get average words in a minute
		var grossWPM = noWords * 6;

		//Reset the values of the WPM formula
		wpmTime = current;
		inputChars = 0;

		//Update the display of the WPM counter on the webpage.
		updateWPMDisplay(grossWPM);

	}

}

/**
 * Processes the actions required at the end of the game. 
 */
function processGameOver() {
	
	//Stop the game loop.
	clearInterval(timer);


	//Store any new acheivements/best scores in HTML5 local storage. 
	storeAchievements();
	
	gameOver = true;

	//Mute all sounds
	stopAllSounds();

	//Fill canvas with gradient.
	var grd=context.createLinearGradient(0,0,0,800);
	grd.addColorStop(0,"#091926");
	grd.addColorStop(1,"#3D5B73");


	context.fillStyle=grd;
	context.fillRect(0, 0, 800, 600);

	//Display the game over dialog.
	gameOverScreen.active = true;
	gameOverScreen.draw();	
	
}

/**
 * Pauses the current game state where it is currently at.  
 */
function pauseGame() {

	//Check if the game is running or not.
	if(!welcome.active) {
	
		//If the game is not currently paused..
		if (timer !== null) {
	
			//Mute all sounds
			stopAllSounds();
	
			//Stop the game loop.
			clearInterval(timer);
			timer = null;
			
			pause.active = true;
			
			//If the help screen is not currently displayed, display the pause dialog.
			if (!help.active) {
			
				pause.draw(true);
	
				pauseScreen.active = true;
				pauseScreen.draw();
				
			}
	
		//Otherwise of the game is already paused, and the game is not over, continue the game.
		} else if (!gameOver) {
		
			//Restart the background music if not alreday muted. 
			if (!muted) {
	
				playBGSound();
	
			}
			
			pause.active = false;
	
			pauseScreen.active = false;
		
			//Restart the game loop.
			timer = setInterval(function() {
		
			updateGame();
		
			if (!checkEnemyCount()) {
				
				clearInterval(timer);
				levelOver = true;
				
			} else {
			
				drawGame();
				updateGameStats(currentLevel, getPlayer().score, getPlayer().lives);
				
			}
			
			checkLevels();
			
			handleCollisions();
			
			checkAllAchievements();
			
			
		}, 1000 / FPS);	
	
		}
		
	}
}