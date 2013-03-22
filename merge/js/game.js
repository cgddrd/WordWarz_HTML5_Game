var FPS = 30;
var value = 0;
var limit = 0;

var timer;

function init() {

setLimit(3);

timer = setInterval(function() {

	updateGame();
	drawGame();
	test();	
	

}, 1000 / FPS);

}


function test() {

	//console.log(value);

	if (value < limit) {

		if (generateNewEnemy(getSingleWord())) {
			value++;
		}
		
		
	} else {

		resetValue();
		setLimit(10);
	}

}

function setLimit(newLimit) {

	limit = newLimit;

}

function resetValue() {

	value = 0;

}
