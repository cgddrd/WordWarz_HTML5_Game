var highscores = [];
var word_achievements = [];
var score_achievements = [];
var time_achievements = [];
var player_achievements = [];
var MAX_SCORES = 10;
var startTime;

var achieveType = {
    TIME: 0,
    WORD: 1,
    SCORE: 2
}

function updateScoreTable(name, score) {

	var score = {'userID': name, 'userScore': score};
	
	highscores.push(score);
	sortScoreTable();
	
	if (highscores.length > MAX_SCORES) {
		
		processScores();
		
	}
	
	displayScores();
	
}

function scoreComparison(a,b) {

  return parseInt(b.userScore) - parseInt(a.userScore);
  
}

function sortScoreTable() {
	
	highscores.sort(scoreComparison);
	
}

function processScores() {
	
	while (highscores.length > MAX_SCORES) {
		
		highscores.pop();
	}
}

function displayScores() {

	$("#highscore").html("");

	var table = '<table border="1"><tr><th>Player Name</th><th>Score</th></tr>';
	
	for (var i = 0; i < highscores.length; i++) {
	
	  table += '<tr>';
	  table += '<td>' + highscores[i].userID + '</td>';
	  table += '<td>' + highscores[i].userScore + '</td>';
	  table += '</tr>';
	  
	}
	
	table += '</table>';
	
	$('#highscore').append(table);

}

function setMaxScores(newMax) {
	
	this.MAX_SCORES = newMax;
	
}

function setStartTime() {
	
	startTime = new Date();
	console.log(startTime);
	
}

function addNewDefaultAchievement(description, value, type) {

	var newAchievement = {'des': description, 'criteria': value, 'obtained': false};	
	
	if (type === achieveType.WORD) {
	
		word_achievements.push(newAchievement);
	
	} else if (type === achieveType.TIME) {
	
		time_achievements.push(newAchievement);
		
	} else if (type === achieveType.SCORE) {
	
		score_achievements.push(newAchievement);
	
	}

}

function setDefaultAchievements() {
	
	addNewDefaultAchievement("Played for more than 10 secs", 10, achieveType.TIME);
	addNewDefaultAchievement("Played for more than 60 secs", 60, achieveType.TIME);
	addNewDefaultAchievement("Got a total score > 100", 100, achieveType.SCORE);
}

function checkAllAchievements() {
	
	checkTimeAchievements();
	checkScoreAchievements();
		
}

function checkTimeAchievements() {

	var current = new Date();
	
	var difference = current - startTime;
	
	var timeMinDiff = difference/1000;

	//Length caching for optimised loops.
	for (var i = 0, len = time_achievements.length; i < len; i++) {
		
		if (timeMinDiff >= time_achievements[i].criteria && !(time_achievements[i].obtained)) {
		
			time_achievements[i].obtained = true;
			console.log("Acheivement Unlocked:" + time_achievements[i].des);
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
			console.log("Acheivement Unlocked:" + score_achievements[i].des);
			addPlayerAchievement(score_achievements[i]);
				
		}
	}

}

function addPlayerAchievement(newAchievement) {

	var isFound = new Boolean(false);
	
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

	if (player_achievements.length > 0) {
		
		$("#achieve").html("");
	
		var table = '<ul>';
		
		for (var i = 0; i < player_achievements.length; i++) {
		
		  table += '<li>' + player_achievements[i].des + '</li>';
		  
		}
		
		table += '</ul>';
		
		$('#achieve').append(table);
		
	}
	
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
	
		//processDictWords(window.localStorage.getItem("gameDict" + wordLimit), wordLimit);
		player_achievements = JSON.parse(localStorage.getItem("player_achievements"));
		//console.log(dictionary);
		
		displayAchievements();
		
	}
	
	if (checkLocalStorageSupport() && localStorage.getItem("player_highscore")) {
		
		$('#achieve').append("<p>Score: " + localStorage.getItem("player_highscore") + "</p>");
		
	}
	
}