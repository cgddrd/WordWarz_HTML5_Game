/**
 * Processes player and game statistics including handling
 * acheivements and highscores. 
 * 
 * @author Connor Luke Goddard (clg11)
 */

//Collections of different achievement types. 
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

/**
 * Data model object for a new in-game acheivement. 
 *
 * @param newDes The description of the new acheivement. 
 * @param newCriteria The awarding criteria of the new acheivement. 
 * @this {Acheivement}
 */
function Achievement(newDes, newCriteria) {

	this.des = newDes;
	
	this.criteria = newCriteria;
	
	this.obtained = false;
		
}

/**
 * Sets the start time of a new game. 
 * (Used to calculate playign durations for time acheivements).
 */
function setStartTime() {
	
	startTime = new Date();
	wpmTime = startTime.getTime();
	
}

/**
 * Creates and stores new acheivements that can be obtained. 
 *
 * @param description The description of the new acheivement. 
 * @param criteria The awarding criteria of the new acheivement. 
 */
function addNewDefaultAchievement(description, criteria, type) {
	
	var newAchievement = new Achievement(description, criteria);
	
	if (type === achieveType.WORD) {
	
		word_achievements.push(newAchievement);
	
	} else if (type === achieveType.TIME) {
	
		time_achievements.push(newAchievement);
		
	} else if (type === achieveType.SCORE) {
	
		score_achievements.push(newAchievement);
	
	}

}

/**
 * Generates the default in-game achievements.
 */
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

/**
 * Performs award checking of all types of achievement. 
 */
function checkAllAchievements() {

	checkTimeAchievements();
	checkScoreAchievements();
	updateWordListDisplay();
		
}

/**
 * Checks if any new time achievements can be awarded. 
 */
function checkTimeAchievements() {

	//Obtain the difference in time from the starting time of the game, and the current time. 
	var current = new Date();
	var difference = current - startTime;
	var timeMinDiff = difference/1000;

	//LENGTH CACHING USED TO OPTIMISE LOOPS - http://jsperf.com/caching-array-length/4.
	
	for (var i = 0, len = time_achievements.length; i < len; i++) {
		
		//If the difference in time matches any of the acheivement criteria
		if (timeMinDiff >= time_achievements[i].criteria && !(time_achievements[i].obtained)) {
		
			//Award the achievement.
			time_achievements[i].obtained = true;
			addPlayerAchievement(time_achievements[i]);
			
		}
	}

}

/**
 * Checks if any new score achievements can be awarded. 
 */
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

/**
 * Awards a new achievement to the player ready for storage
 * in HTML5 local storage. 
 */
function addPlayerAchievement(newAchievement) {

	var isFound = false;
	
	//Check to see if the player has already previously been awarded the achievement. 
	for (var i = 0, len = player_achievements.length; i < len; i++) {
		
		if (player_achievements[i].des === newAchievement.des) {
			
			isFound = true;
			
		}
	
	}

	//If the achievement has not already been rewarded..
	if (!isFound) {

		//Award it to the player. 
		player_achievements.push(newAchievement);
		displayAchievements();
	
	}

}

/**
 * Utilises jQuery to dynamically update the statistic '<div>' containers on the webpage. 
 */
function displayAchievements() {

	$("#achieve").html("");

	var achieveList = '<h1>Your Acheivements</h1><ul>';

	//Collect of the acheivements awarded to the player.
	if (player_achievements.length > 0) {

		for (var i = 0, len = player_achievements.length; i < len; i++) {
		
		  achieveList += '<li><h1>' + player_achievements[i].des + '. - <span class="red"> Complete</span><h1></li>';
 
		}
		
		achieveList += '</ul>';

	//If no achievements have been awarded, display message to user. 
	} else {

		achieveList += '<li><h1>No acheivements unlocked.<h1></li></ul>';

	}

	//Update the HTML code. 
	$('#achieve').append(achieveList);
	
}

/**
 * Attempts to store the achievements/score awarded to the player in 
 * HTML5 local storage.  
 */
function storeAchievements() {

	//Check if local storage is supported by the web browser
	if (checkLocalStorageSupport()) {
	
		//If so store the array of player acheivements as a JSON object in HTML5 local storage.
		window.localStorage.setItem("player_achievements",  JSON.stringify(player_achievements));
		
		//If there is current no high score value in local storage, or the player has bettered their previous score
		if (!(localStorage.getItem("player_highscore")) || getPlayer().score > localStorage.getItem("player_highscore")) {
			
			//Store the score of the player. 
			window.localStorage.setItem("player_highscore",  getPlayer().score);
			
		}
		
	}
	
}

/**
 * Attempts to load the player achievements/score stored in
 * HTML5 local storage.   
 */
function loadAchievements() {

	//If local storage is supported, and there is an existing collection of achievements stored in local storage
	if (checkLocalStorageSupport() && JSON.parse(localStorage.getItem("player_achievements"))) {
	
		//Load in the existing array. 
		player_achievements = JSON.parse(localStorage.getItem("player_achievements"));
		
	}

	//Update the HTML to display these achievements.
	displayAchievements();

	$("#score").html("");
	
	//If local storage is supported, and there is an existing player score stored in local storage
	if (checkLocalStorageSupport() && JSON.parse(localStorage.getItem("player_highscore"))) {
		
		//Update the HTML display with this score
		$('#score').append("<h1>Your best score: " + JSON.parse(localStorage.getItem("player_highscore")) + "</h1>");
		
	} else {

		//Otherwise display a message to the user. 
		$('#score').append("<h1>No best score set.</h1>");

	} 

	//Update the "latest words" display. 
	updateWordListDisplay();
	
}

/**
 * Updates the record of the last two enemies defated by the player.
 *
 * @param newWord The word of the latest enemy to be defeated.  
 */
function updateWordList(newWord) {

		wordList[wordListIndex] = newWord;

		if (wordListIndex === 0) {

			wordListIndex = 1;

		} else {

			wordListIndex = 0;

		}

}

/**
 * Updates the HTML content to display the words of the 
 * latest two enemies to be defeated. 
 */
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

/**
 * Updates the HTML content to display the current
 * WPM score of the user. 
 */
function updateWPMDisplay(newWPM) {

	$("#wpm").html("");
	
	$('#wpm').append("<h1>Current WPM: " + newWPM + "</h1>");
		
}