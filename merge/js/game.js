var FPS = 30;
var levelover = false;
var gameover = false;
var currentenemy = null;
var currentenemyindex = 0;
var timer;
var currentLevel = 1;
var enemyspeed = 1;
var enemySpawnTime = 1000;
var enemySpawnDelay = 0.025;
var wordLimit = 5;
var bulletcount = 0;

var powerupSound = $("#powerupSound").get(0);
var laserSound = $("#laserSound").get(0);
var explosionSound = $("#explosionSound").get(0);
var bgSound = $("#bgSound").get(0);

explosionSound.volume = 0.2;
laserSound.volume = 0.2;
powerupSound.volume = 0.2;

var muted = false;

var levelEnum = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2
}

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

function welcomeGame() {
	
	if (gameover === true) {
		resetGame();
		gameOverScreen.active = false;
	}

	var grd=context.createLinearGradient(0,0,0,800);
	grd.addColorStop(0,"#091926");
	grd.addColorStop(1,"#3D5B73");

	// Fill with gradient
	context.fillStyle=grd;
	context.fillRect(0, 0, 800, 600);

	canvas.addEventListener("click",checkMouse,false);
	welcome.active = true;
	welcome.draw();	
	
}

function resetGame() {

	player.score = 0;
	player.lives = 3;
	enemies = [];
	levelover = false;
	gameover = false;
	currentenemy = null;
	playerBullets = [];
	currentEnemy = 0;
	currentenemyindex = 0;
	currentLevel = 1;
	enemyspeed = 1;
	enemySpawnTime = 1000;
	enemySpawnDelay = 0.025;
	wordLimit = 5;

}

function toggleAllSounds() {

	if (!muted) {

		$.each($('audio'), function () {
		    this.pause();
		});

		muted = true;

	} else {

		bgSound.play();
		muted = false;

	}


}

function initGame() {

	welcome.active = false;

	bgSound.addEventListener('canplaythrough', function() { 
	   if (typeof bgSound.loop == 'boolean') {
		    bgSound.loop = true;
		} else {
		    bgSound.addEventListener('ended', function() {
		        this.currentTime = 0;
		        this.play();
		    }, false);
		}
	}, false);

	bgSound.currentTime = 0;
	bgSound.play();
	muted = false;

	initialiseDictionary();
	
	setDefaultAchievements()

	setStartTime();
	
	loadAchievements();

	startLevel();

}

function obtainWords(wordLimit, thevalue) {
	
	var wordArray = null;

	while (wordArray === null) {
	
		wordArray = getRandomWords(wordLimit, thevalue);
		
	}
	
	return wordArray;
	
}

function setLevelDifficulty() {
	
	if (currentLevel % 5 == 0 && enemyspeed < 3) {
			
		enemyspeed++;
		
	} 
		
	if (currentLevel % 3 == 0 && enemySpawnDelay < 0.04) {
			
		enemySpawnDelay+=0.005;
			
	} 
		
	if (currentLevel % 2 == 0 && enemySpawnTime > 400) {
			
		enemySpawnTime-=50;
			
	} 
		
	initLevel(enemySpawnTime, enemySpawnDelay);

}

function setLevelWordLength() {

	if (currentLevel < 5) {
			
			generateNewEnemies(getRandomWords(wordLimit, levelEnum.EASY), enemyspeed);
			
	} else if (currentLevel >=5 && currentLevel < 10) {
			
			generateNewEnemies(getRandomWords(wordLimit, levelEnum.MEDIUM), enemyspeed);
			
	} else {
		
		generateNewEnemies(getRandomWords(wordLimit, levelEnum.HARD), enemyspeed);
		
	}
		
}

function startLevel() {

	if (currentLevel === 1) {
		
		initLevel(enemySpawnTime, enemySpawnDelay);

		generateNewEnemies(getRandomWords(wordLimit, levelEnum.EASY), enemyspeed);
		
		
	} else {
	
	if (wordLimit < 26) {

		if (currentLevel < 10) {
			
			wordLimit++;
			
		} else {
			
			wordLimit+=2;
			
		}

	}
		
		setLevelDifficulty();
		
		setLevelWordLength();
		
	}
	
	
	timer = setInterval(function() {
	
		updateGame();
	
		if (!checkEnemyCount()) {
			
			clearInterval(timer);
			levelover = true;
			
		} else {
		
			drawGame();
			updateGameStats(currentLevel, getPlayer().score, getPlayer().lives);
			
		}
		
		checkLevels();
		
		handleCollisions();
		
		checkAllAchievements();
		
		
	}, 1000 / FPS);	
}

function checkLevels() {
	
	if (levelover) {
	
		currentLevel++;
		
		clearInterval(timer);
		
		levelover = false;
		
		resetUsedLetters();
		
		startLevel();
		
	}
	
}

function updatePlayerScore(scoreValue) {
	
	getPlayer().score+=scoreValue;
	
}

function setCurrentEnemy(enemy) {
	
	this.currentenemy = enemy;
	
}

function checkHealth(theEnemy) {

	theEnemy.health--;

	if (theEnemy.health <= 0) {
		
		if (theEnemy.type === enemytype.HEALTH) {
			
			player.lives++;
			
			if (!muted) {		
				powerupSound.currentTime = 0;
	            powerupSound.play();
        	}

			
		} else {
			
			updatePlayerScore(theEnemy.score);
			
			if (!muted) {
				explosionSound.currentTime = 0;
	            explosionSound.play();
        	}
			
		}
		
		theEnemy.active = false;
		theEnemy.used = true;
		currentenemy = null;
		currentenemyindex = 0;
		
		clearBullets();		
	} else {

		currentenemyindex++;
		currentenemy.displayName = currentenemy.name.substring(currentenemyindex);

	}

}

function damageEnemy() {
	
 if (currentenemy.health > 0) {
		
	fireBullet(enemies.indexOf(currentenemy), currentenemyindex);
	checkHealth(currentenemy);

	if (!muted) {
		laserSound.currentTime = 0;
        laserSound.play();
   	}

   	player_img.src = "images/player3.png";

 }

}

function checkUserInput(keyCode) {
	
	var inputLetter = String.fromCharCode(keyCode);
	
	if (currentenemy === null) {
	
		enemies.forEach(function(enemy) {
		
			var enemyName = enemy.name.toUpperCase();
		
			if (enemyName.charCodeAt(0) === keyCode && enemy.active === true) {
				
				setCurrentEnemy(enemy);
				currentenemy.textColor = '#FE8E34';

				damageEnemy();
				
			} 
		});
	
	} else {
		
		var enemyName = currentenemy.name.toUpperCase();
		var letterCode = enemyName.charCodeAt(currentenemyindex);
		
		if (enemyName.charCodeAt(currentenemyindex) === keyCode) {
		
			damageEnemy();

		}		
	}	
}

function handleCollisions() {

	playerBullets.forEach(function(bullet) {
	    enemies.forEach(function(enemy) {
	      if (collides(bullet, enemy)) {
	  
	        enemy.delay = 2;
	        var coordsindex = enemy.coordsIndex - 5;
	        enemy.coordsIndex = coordsindex;
	        
	        bullet.active = false;

	      }
	    });
	  });

	enemies.forEach(function(enemy) {
	
		if (collides(enemy, player)) {
			enemy.active = false;
			enemy.used = true;
			currentenemy = null;
			currentenemyindex = 0;
			
			if (enemy.type === enemytype.ENEMY) {
				
				player.lives--;
				player_img.src = "images/player2.png";
				
			}
			
			if (player.lives <= 0) {
				
				clearCanvas();
				gameOver();
				
			}
		}
	});

}

function gameOver() {
	
	clearInterval(timer);

	storeAchievements();
	
	gameover = true;

	if (!muted) {

		toggleAllSounds();

	}

	var grd=context.createLinearGradient(0,0,0,800);
	grd.addColorStop(0,"#091926");
	grd.addColorStop(1,"#3D5B73");

	// Fill with gradient
	context.fillStyle=grd;
	context.fillRect(0, 0, 800, 600);

	canvas.addEventListener("click",checkMouse,false);
	gameOverScreen.active = true;
	gameOverScreen.draw();	
	
}

function pauseGame() {

	toggleAllSounds();

	if (timer != null) {

		clearInterval(timer);
		timer = null;
		
		pause.active = true;
		
		if (!help.active) {
		
			pause.draw(true);

			pauseScreen.active = true;
			pauseScreen.draw();
			
		}

	} else if (!gameover) {
	
		pause.active = false;

		pauseScreen.active = false;
	
		timer = setInterval(function() {
	
		updateGame();
	
		if (!checkEnemyCount()) {
			
			clearInterval(timer);
			levelover = true;
			
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

document.onkeydown = function(event) {
  
  var keyCode; 
  
  if(event === null) {
  
    keyCode = window.event.keyCode; 
    
  } else {
  
    keyCode = event.keyCode; 
    
  }
  
  if (keyCode >= 65 && keyCode <= 122) {
    
    checkUserInput(keyCode);
	    
  }

  if (keyCode === 27) {

  	pauseGame();
  }
    
}