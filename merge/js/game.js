var FPS = 30;
var levelover = false;
var currentenemy = null;
var currentenemyindex = 0;
var timer;
var currentLevel = 1;
var enemyspeed = 1;
var enemySpawnTime = 1000;
var enemySpawnDelay = 0.05;
var wordLimit = 5;

function initGame() {

	startLevel();

}

function obtainWords(wordLimit) {
	
	var wordArray = null;

	while (wordArray === null) {
	
		wordArray = getRandomWords(wordLimit);
		
	}
	
	return wordArray;
	
}

function startLevel() {


	if (currentLevel === 1) {
		
		initLevel(enemySpawnTime, enemySpawnDelay);
		generateNewEnemies(obtainWords(wordLimit), enemyspeed);
		
	} else {
	
		if (currentLevel % 5 == 0 && enemyspeed < 8) {
			
			enemyspeed++;
		
		}
		
		if (currentLevel % 2 == 0 && enemySpawnDelay < 0.5) {
			
			enemySpawnDelay+=0.01
			
		}
		
		if (currentLevel % 3 == 0 && enemySpawnTime > 200) {
			
			enemySpawnTime-=10;
			
		}
		
		wordLimit+=2;
		
		initLevel(enemySpawnTime, enemySpawnDelay);
		generateNewEnemies(obtainWords(wordLimit), enemyspeed);
		
	}
	
	
	timer = setInterval(function() {
	
	updateGame();
	
		if (!checkEnemyCount()) {
			
			clearInterval(timer);
			console.log("game over!!");
			levelover = true;
			
		} else {
		
			drawGame();
			
		}
		
		checkLevels();
		
		handleCollisions();
		
		
	}, 1000 / FPS);	
}

function checkLevels() {
	
	if (levelover) {
	
		currentLevel++;
	
		console.log("Level finished - Starting level " + currentLevel);
		
		clearInterval(timer);
		
		levelover = false;
		
		resetLetters();
		
		startLevel();
		
	}
	
}

function setCurrentEnemy(enemy) {
	
	this.currentenemy = enemy;
	
}

function damageEnemy() {
	
	fireBullet(enemies.indexOf(currentenemy));
	
	currentenemy.health--;
	
	if (currentenemy.health <= 0) {
		
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
		}
	});

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
			
		}
		
		checkLevels();
		
		handleCollisions();
		
		
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