var FPS = 30;
var value = 0;
var limit = 0;
var levelover = false;
var currentenemy = null;
var currentenemyindex = 0;

var timer;

function init() {

//setLimit(10);

startLevel(2);

}

function setLimit(newLimit) {

	limit = newLimit;

}

function resetValue() {

	value = 0;

}

function startLevel(wordLimit) {

var wordArray = getRandomWords(wordLimit);

while (wordArray === null) {

	wordArray = getRandomWords(wordLimit);
	
}

generateNewEnemies(wordArray);

timer = setInterval(function() {

	if (updateGame()) {
		
		//clearInterval(timer);
		console.log("game over!!");
		levelover = true;
		
	} else {
	
		drawGame();
		
	}
	
	checkLevels();
	
	
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
	
	
	currentenemy.health--;
	fireBullet(enemies.indexOf(currentenemy));
	//console.log("ENEMY DAMAGED. HEALTH: " + currentenemy.health);
	
	//if (currentenemyindex >= (currentenemy.name.length - 1)) {
	
	if (currentenemy.health <= 0) {
		
		currentenemy.active = false;
		currentenemy.used = true;
		console.log("ENEMY DESTROYED: " + currentenemy.name);
		currentenemy = null;
		currentenemyindex = 0;
		clearBullets();
		
	} else {
		
			currentenemyindex++;
				
			var test = currentenemy.name.substring(currentenemyindex)
			currentenemy.displayName = test;
		
	}
	
	
}

function checkInput(keyCode) {
	
	var array = getEnemies();
	
	var inputLetter = String.fromCharCode(keyCode);
	
	console.log("Input: " + inputLetter + " - " + keyCode);
	
	if (currentenemy === null) {
	
	enemies.forEach(function(enemy) {
	
		var test = enemy.name.toUpperCase();
	
		//console.log("WORD: " + test + " LETTER: " + test.charCodeAt(0));  
	
		if (test.charCodeAt(0) === keyCode && enemy.active === true) {
		
			console.log("NEW ENEMY FOUND: " + enemy.name);
			
			console.log("ACTUAL: " + test.charCodeAt(0) + " - " + test[0]);
			
			setCurrentEnemy(enemy);
			
			damageEnemy();
			
			
			
			
			


			
		} 
	});
	
	} else {
		
		var thing = currentenemy.name.toUpperCase();
		var value = thing.charCodeAt(currentenemyindex);
		
		console.log("ACTUAL: " + thing.charCodeAt(currentenemyindex) + " - " + String.fromCharCode(value));
		
		if (thing.charCodeAt(currentenemyindex) === keyCode) {
		
			console.log("CURRENT ENEMY DAMAGED AGAIN: ");
		
			damageEnemy();
			



			//currentenemy.name = test;
				
			
			//console.log("NEW NAME: " + test);

				
			
				
				
			
			
			
		}
		
		
	}	
}

function pauseGame() {

	if (timer != null) {

		clearInterval(timer);
		timer = null;

	} else {

		timer = setInterval(function() {
		
		
			if (updateGame()) {
		
				//clearInterval(timer);
				console.log("game over!!");
				levelover = true;
		
			} else {
	
				drawGame();
		
			}
	
			checkLevels();
			
			
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
	    
    } else {
	    
	    console.log("goodbye");
    }
    
    //console.log("RAW INPUT: " + keyCode);
    
  }