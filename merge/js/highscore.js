var highscores = [];
var word_achievements = [];
var score_achievements = [];
var time_achievements = [];
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

function addAchievement(description, value, type) {

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
	
	addAchievement("Played for more than 10 secs", 10, achieveType.TIME); 
}

function checkAllAchievements() {
	
	checkTimeAchievements();
	//checkScoreAcheivements();
	//checkWordAcheievements();
		
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
			
		}
	}
	
		
	
	
	
	
}