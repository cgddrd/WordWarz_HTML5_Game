var FPS = 30;
var levelover = false;
var currentenemy = null;
var currentenemyindex = 0;
var timer;
var currentLevel = 1;
var enemyspeed = 1;
var enemySpawnTime = 1000;
var enemySpawnDelay = 0.025;
var wordLimit = 5;

var levelEnum = {
    EASY: 0,
    MEDIUM: 1,
    HARD: 2
}

function initGame() {

	window.localStorage.clear();

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
	
	if (currentLevel % 5 == 0 && enemyspeed < 5) {
			
		enemyspeed++;
		
	} 
		
	if (currentLevel % 4 == 0 && enemySpawnDelay < 0.04) {
			
		enemySpawnDelay+=0.005;
			
	} 
		
	if (currentLevel % 2 == 0 && enemySpawnTime > 300) {
			
		enemySpawnTime-=50;
			
	} 
		
	initLevel(enemySpawnTime, enemySpawnDelay);

}

function setLevelWordLength() {

	if (currentLevel < 5) {
			
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
	
				
		if (currentLevel < 10) {
			
			wordLimit++;
			
			
		} else {
			
			wordLimit+=2;
			
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

function damageEnemy() {
	
	fireBullet(enemies.indexOf(currentenemy));
	
	currentenemy.health--;
	
	if (currentenemy.health <= 0) {
		
		updatePlayerScore(currentenemy.score);
		
		currentenemy.active = false;
		currentenemy.used = true;
		currentenemy = null;
		currentenemyindex = 0;
		
		clearBullets();
		
	} else {
		
		currentenemyindex++;
			
		currentenemy.displayName = currentenemy.name.substring(currentenemyindex);
		
	}
}

function checkUserInput(keyCode) {
	
	var inputLetter = String.fromCharCode(keyCode);
	
	if (currentenemy === null) {
	
		enemies.forEach(function(enemy) {
		
			var enemyName = enemy.name.toUpperCase();
		
			if (enemyName.charCodeAt(0) === keyCode && enemy.active === true) {
				
				setCurrentEnemy(enemy);
				
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
			
			player.lives--;
			
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
	
}

function pauseGame() {

	if (timer != null) {

		clearInterval(timer);
		timer = null;

	} else {

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
    
}