var word_achievements = [];
var score_achievements = [];
var time_achievements = [];
var player_achievements = [];

var wordList = [];
var wordListIndex = 0;

var achieveType = {
    TIME: 0,
    WORD: 1,
    SCORE: 2
}

function Achievement(newDes, newCriteria) {

	this.des = newDes;
	
	this.criteria = newCriteria;
	
	this.obtained = false;
		
}

function setStartTime() {
	
	startTime = new Date();
	wpmTime = startTime.getTime();
	console.log(startTime.getTime());
	
}

function addNewDefaultAchievement(description, value, type) {

	//var newAchievement = {'des': description, 'criteria': value, 'obtained': false};	
	
	var newAchievement = new Achievement(description, value);
	
	if (type === achieveType.WORD) {
	
		word_achievements.push(newAchievement);
	
	} else if (type === achieveType.TIME) {
	
		time_achievements.push(newAchievement);
		
	} else if (type === achieveType.SCORE) {
	
		score_achievements.push(newAchievement);
	
	}

}

function setDefaultAchievements() {
	
	addNewDefaultAchievement("Played for more than 10 seconds", 10, achieveType.TIME);
	addNewDefaultAchievement("Played for more than 60 seconds", 60, achieveType.TIME);
	addNewDefaultAchievement("Played for more than 5 minutes", 300, achieveType.TIME);
	addNewDefaultAchievement("Played for more than 10 minutes", 600, achieveType.TIME);
	addNewDefaultAchievement("Total score > 100", 100, achieveType.SCORE);
	addNewDefaultAchievement("Total score > 200", 200, achieveType.SCORE);
	addNewDefaultAchievement("Total score > 500", 500, achieveType.SCORE);
	addNewDefaultAchievement("Total score > 1000", 1000, achieveType.SCORE);
	
}

function checkAllAchievements() {

	checkTimeAchievements();
	checkScoreAchievements();
	updateWordListDisplay();
		
}

function checkTimeAchievements() {

	var current = new Date();
	
	var difference = current - startTime;
	
	var timeMinDiff = difference/1000;

	//Length caching for optimised loops.
	for (var i = 0, len = time_achievements.length; i < len; i++) {
		
		if (timeMinDiff >= time_achievements[i].criteria && !(time_achievements[i].obtained)) {
		
			time_achievements[i].obtained = true;
			addPlayerAchievement(time_achievements[i]);
			
		}
	}

}

function checkScoreAchievements() {

	var currentScore = getPlayer().score;

	//Length caching for optimised loops.
	for (var i = 0, len = score_achievements.length; i < len; i++) {
		
		if (currentScore >= score_achievements[i].criteria && !(score_achievements[i].obtained)) {
		
			score_achievements[i].obtained = true;
			addPlayerAchievement(score_achievements[i]);
				
		}
	}

}

function addPlayerAchievement(newAchievement) {

	var isFound = false;
	
	for (var i = 0, len = player_achievements.length; i < len; i++) {
		
		if (player_achievements[i].des === newAchievement.des) {
			
			isFound = true;
			
		}
	
	}

	if (!isFound) {

		player_achievements.push(newAchievement);
		displayAchievements();
	
	}

}

function displayAchievements() {

	$("#achieve").html("");

	var achieveList = '<h1>Your Acheivements</h1><ul>';

	if (player_achievements.length > 0) {

		for (var i = 0, len = player_achievements.length; i < len; i++) {
		
		  achieveList += '<li><h1>' + player_achievements[i].des + '. - <span class="red"> Complete</span><h1></li>';
 
		}
		
		achieveList += '</ul>';

	} else {

		achieveList += '<li><h1>No acheivements unlocked.<h1></li></ul>';

	}

	$('#achieve').append(achieveList);
	
}

function storeAchievements() {

	if (checkLocalStorageSupport()) {
	
		window.localStorage.setItem("player_achievements",  JSON.stringify(player_achievements));
		
		if (!(localStorage.getItem("player_highscore")) || getPlayer().score > localStorage.getItem("player_highscore")) {
				
			window.localStorage.setItem("player_highscore",  getPlayer().score);
			
		}
		
	}
	
}

function loadAchievements() {

	if (checkLocalStorageSupport() && JSON.parse(localStorage.getItem("player_achievements"))) {
	
		player_achievements = JSON.parse(localStorage.getItem("player_achievements"));
		
	}

	displayAchievements();

	$("#score").html("");
	
	if (checkLocalStorageSupport() && JSON.parse(localStorage.getItem("player_highscore"))) {
		
		$('#score').append("<h1>Your best score: " + JSON.parse(localStorage.getItem("player_highscore")) + "</h1>");
		
	} else {

		$('#score').append("<h1>No best score set.</h1>");

	} 

	updateWordListDisplay();
	
}

function updateWordList(newWord) {

		wordList[wordListIndex] = newWord;

		if (wordListIndex === 0) {

			wordListIndex = 1;

		} else {

			wordListIndex = 0;

		}

}

function updateWordListDisplay() {

	$("#words").html("");

	var wordListString = '<h1>Latest Words</h1><ul>';

	if (wordList.length > 0) {

		for (var i = 0, len = wordList.length; i < len; i++) {
		
		  wordListString += '<li><h1>' + wordList[i] + '<h1></li>';
 
		}
		
		wordListString += '</ul>';

	} else {

		wordListString += '<li><h1>No words defeated.<h1></li></ul>';

	}

	$('#words').append(wordListString);

}

function updateWPMDisplay(newWPM) {

	$("#wpm").html("");
	
	$('#wpm').append("<h1>Current WPM: " + newWPM + "</h1>");
		
}