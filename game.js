var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

// The dictionary lookup object
var cheese = [];

function set_dict(x, y) {
	cheese[x] = y;
}

function getDick() {
	
if ( window.localStorage !== null && window.localStorage.gameDict ) {

    processDictWords(window.localStorage.gameDict);
    
    console.log("LOADED FROM STORAGE");
 
// Load in the dictionary from the server
} else {
	$.ajax({
		url: "files/test.dat",
		data: "text",
		async: false,
		success: function(data) {
		
		//var twat = data.split(/\r\n|\r|\n/); //Need to remove both carriage returns and new lines. (Req. for "dict.txt")
		
			processDictWords(data);
			
			console.log("LOADED FROM FILE");
			
			if ( window.localStorage !== null ) {
				window.localStorage.clear();
                window.localStorage.gameDict = data;
                console.log("Local storage saved!!");
            }
		}
	});
	
}
	
	
}

function processDictWords(words) {
	
	var twat = words.split("\n");
		
			for (var i = 0; i < twat.length; i++) {

				set_dict(i, {'word': twat[i],'score': twat[i].length});
			}
}



getDick();
console.log(cheese.length);


// Takes in an array of letters and finds the longest
// possible word at the front of the letters

function findWord(letters) {
	// Clone the array for manipulation
		
		console.log("THE target: " + letters);
		
		//console.log("LENGTH: " + cheese.length);
		for (var i = 0; i < cheese.length; i++) {
			//console.log(letters);
			if (cheese[i].word == letters) {
				console.log("THE WORD: " + cheese[i].word);
			}
			
		}
}

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

console.log(supports_html5_storage());

//console.log(cheese[0].word.charCodeAt(2)); //Had to check the end value (should be NaN not 13)

console.log(cheese[2]);

//if (cheese[0].word == "AA") {
	
	//console.log(cheese[0].word);
//} 

findWord("sluts");

findWord("crisp");

findWord("abode");

findWord("cat");
