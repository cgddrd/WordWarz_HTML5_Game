var FPS = 30;
var value = 0;
var limit = 0;
var levelover = false;

var timer;

function init() {

//setLimit(10);

startLevel(3);

}

function setLimit(newLimit) {

	limit = newLimit;

}

function resetValue() {

	value = 0;

}

function startLevel(thislimit) {

generateNewEnemies(getRandomWords(thislimit));

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
		startLevel(20);
	}
	
}
