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

	initialiseDictionary();
	
	setDefaultAchievements()

	setStartTime();

	startLevel();

}

function obtainWords(wordLimit, thevalue) {
	
	var wordArray = null;

	while (wordArray === null) {
	
		wordArray = getRandomWords(wordLimit, thevalue);
		
	}
	
	return wordArray;
	
}

function setLevelSpeed() {
	
	if (currentLevel % 4 == 0 && enemyspeed < 6) {
			
			enemyspeed++;
			console.log("Enemy speed increased - " + enemyspeed);
		
		} 
		
		if (currentLevel % 5 == 0 && enemySpawnDelay < 0.04) {
			
			enemySpawnDelay+=0.005;
			console.log("Spawn delay incremented - " + enemySpawnDelay);
			
		} 
		
		if (currentLevel % 2 == 0 && enemySpawnTime > 300) {
			
			enemySpawnTime-=50;
			console.log("Spawn time decreased - " + enemySpawnTime);
			
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
		//generateNewEnemies(obtainWords(wordLimit, 3), enemyspeed);
		generateNewEnemies(getRandomWords(wordLimit, levelEnum.EASY), enemyspeed);
		
		
	} else {
	
				
		if (currentLevel < 10) {
			
			wordLimit++;
			
			
		} else {
			
			wordLimit+=2;
			
		}
		
		setLevelSpeed();
		
		setLevelWordLength();
		
	
		console.log("Spawn time - " + enemySpawnTime);
		console.log("Spawn delay - " + enemySpawnDelay);
		console.log("Enemy speed - " + enemyspeed);
		
	}
	
	
	timer = setInterval(function() {
	
	updateGame();
	
		if (!checkEnemyCount()) {
			
			clearInterval(timer);
			console.log("game over!!");
			levelover = true;
			
		} else {
		
			drawGame();
			updateGameStats(currentLevel, getPlayer().score);
			
		}
		
		checkLevels();
		
		handleCollisions();
		
		checkAllAchievements();
		
		
	}, 1000 / FPS);	
}

function checkLevels() {
	
	if (levelover) {
	
		currentLevel++;
	
		console.log("Level finished - Starting level " + currentLevel);
		
		clearInterval(timer);
		
		levelover = false;
		
		resetUsedLetters();
		
		startLevel();
		
	}
	
}

function addScore(scoreValue) {
	
	getPlayer().score+=scoreValue;
	
}

function setCurrentEnemy(enemy) {
	
	this.currentenemy = enemy;
	
}

function damageEnemy() {
	
	fireBullet(enemies.indexOf(currentenemy));
	
	currentenemy.health--;
	
	if (currentenemy.health <= 0) {
		
		addScore(currentenemy.score);
		
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

function checkInput(keyCode) {
	
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
	
	console.log("GAME OVER!!");
	
	clearInterval(timer);
	
	updateScoreTable("THE PLAYER", getPlayer().score);
	
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
			console.log("game over!!");
			levelover = true;
			
		} else {
		
			drawGame();
			updateGameStats(currentLevel, getPlayer().score);
			
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
    
    checkInput(keyCode);
	    
  }
    
}