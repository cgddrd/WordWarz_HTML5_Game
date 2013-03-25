var FPS = 30;
var levelover = false;
var currentenemy = null;
var currentenemyindex = 0;
var timer;

function init() {

	startLevel(2);

}

function startLevel(wordLimit) {

	var wordArray = getRandomWords(wordLimit);

	while (wordArray === null) {
	
		wordArray = getRandomWords(wordLimit);
		
	}
	
	generateNewEnemies(wordArray);
	
	console.log(checkEnemyCount());
	
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
	
		console.log("level finished");
		
		clearInterval(timer);
		
		levelover = false;
		
		resetLetters();
		
		startLevel(5);
		
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

function pauseGame() {

	if (timer != null) {

		clearInterval(timer);
		timer = null;

	} else {

		timer = setInterval(function() {
		
		
		if (!checkEnemyCount()) {
			//if (updateGame()) {
		
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