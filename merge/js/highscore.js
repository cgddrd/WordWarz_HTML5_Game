var highscores = [];
var MAX_SCORES = 10;

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