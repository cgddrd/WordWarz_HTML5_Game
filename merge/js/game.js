var FPS = 30;
var value = 0;
var limit = 0;
var levelover = false;

var timer;

function init() {

//setLimit(10);

startLevel(5);

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
		
		startLevel(20);
		
	}
	
}

function checkInput(keyCode) {
	
	var array = getEnemies();
	
	enemies.forEach(function(enemy) {
	
		var test = enemy.name.toUpperCase();
	
		//console.log("WORD: " + test + " LETTER: " + test.charCodeAt(0));  
	
		if (test.charCodeAt(0) === keyCode && enemy.active === true) {
		
			console.log("ENEMY FOUND: " + enemy.name);
			
			fireBullet(enemies.indexOf(enemy));
		
		}
	});
	
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
    
    console.log("RAW INPUT: " + keyCode);
    
  }