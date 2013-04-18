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

	
	if (!muted) {
		bgSound.play();
	}

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
		
	if (currentLevel % 2 == 0 && enemySpawnTime > 300) {
			
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

function bulletDamage(currentIndex) {


}

function checkHealth() {

	if (currentenemy.health <= 0) {
		
		if (currentenemy.type === enemytype.HEALTH) {
			
			player.lives++;
			
			if (!muted) {		
				powerupSound.currentTime = 0;
	            powerupSound.play();
        	}

			
		} else {
			
			updatePlayerScore(currentenemy.score);
			
			if (!muted) {
				explosionSound.currentTime = 0;
	            explosionSound.play();
        	}
			
		}
		
		currentenemy.active = false;
		currentenemy.used = true;
		currentenemy = null;
		currentenemyindex = 0;
		
		clearBullets();
		
	}

}

function damageEnemy() {
	
 if (currentenemy.health > 0) {
		
	currentenemyindex++;			
	fireBullet(enemies.indexOf(currentenemy), currentenemyindex);
	
		//currentenemy.displayName = currentenemy.name.substring(currentenemyindex);
		
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
	        bullet.active = false;
	        //damageEnemy();
	        currentenemy.displayName = currentenemy.name.substring(bullet.letterIndex);
	        currentenemy.health--;
	        checkHealth();
	        enemy.delay = 2;
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
	
}

function pauseGame() {

	if (timer != null) {

		clearInterval(timer);
		timer = null;
		
		pause.active = true;
		
		if (!help.active) {
		
			pause.draw(true);	
			
		}
		

	} else if (!gameover) {
	
		pause.active = false;
	
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