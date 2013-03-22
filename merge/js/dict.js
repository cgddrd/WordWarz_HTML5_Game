// The dictionary lookup object
var dictionary = [];
var current_words = [];

function set_dict(x, y) {
	dictionary[x] = y;
}

function getDictFile() {

window.localStorage.clear();

	if (supports_html5_storage() && window.localStorage.gameDict) {
	
		processDictWords(window.localStorage.gameDict);
		console.log("LOADED FROM STORAGE");
		
	} else {
	
		$.ajax({
			url: "files/dict5.dat",
			data: "text",
			async: false,
			success: function(data) {
			
				//var oldData = data.split(/\r\n|\r|\n/); //Need to remove both carriage returns and new lines. (Req. for "dict.txt")
				processDictWords(data);
				console.log("LOADED FROM FILE");
				
				if (window.localStorage !== null) {
				
					window.localStorage.gameDict = data;
					console.log("Local storage saved!!");
					
				}
			}
		});
		
	}
}

function processDictWords(words) {

	var currentWord = words.split("\n");
	
	for (var i = 0; i < currentWord.length; i++) {
	
		set_dict(i, {
			'word': currentWord[i],
			'score': currentWord[i].length
		});
		
	}
}

function findWord(letters) {

	console.log("THE target: " + letters);

	for (var i = 0; i < dictionary.length; i++) {
	
		if (dictionary[i].word == letters) {
			console.log("THE WORD: " + dictionary[i].word);
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

function findBinaryWord(word) {

  // Figure out which bin we're going to search
    var l = word.length;
   
    // Don't search if there's nothing to look through
   // if ( !dict[l] ) {
     //   return false;
  //  }
   
    // Get the number of words in the dictionary bin
    
    var words = dictionary.length,
    
        // The low point from where we're starting the binary search
        low = 0,
       
        // The max high point
        high = words - 1,
       
        // And the precise middle of the search
        mid = Math.floor( words / 2 );
   
    // We continue to look until we reach a final word
    while ( high >= low ) {
    
        // Grab the word at our current position
        //var found = dict[l].substr( l * mid, l );
        
        var found = dictionary[mid].word;
       
        // If we've found the word, stop now
        if ( word === found ) {
       
            return true;

        }
       
        // Otherwise, compare
        // If we're too high, move lower
        if ( word < found ) {
            high = mid - 1;
       
        // If we're too low, go higher
        } else {
            low = mid + 1;
        }
       
        // And find the new search point
        mid = Math.floor( (low + high) / 2 );
    }
   
    // Nothing was found
    return false;
}

function getRandomWords(noOfWords) {

	var word_array = [noOfWords];

	for (var i = 0; i < noOfWords; i++) {

		var selector = Math.floor(Math.random() * dictionary.length) + 1;
	
		var selectedWord = dictionary[selector];
	
		word_array[i] = selectedWord;
	
    }

    return word_array;
	
}

function getSingleWord() {

	var selector = Math.floor(Math.random() * dictionary.length) + 1;
	
	return dictionary[selector].word;

}



getDictFile();
// console.log(dictionary.length);
// console.log(supports_html5_storage());


// var start = new Date().getMilliseconds();
// findWord("sluts");
// var end = new Date().getMilliseconds();
// var time = end - start;
// console.log('Execution time (iterative): ' + time);


// var start = new Date().getMilliseconds();
// console.log(findBinaryWord( "sluts" ));
// var end = new Date().getMilliseconds();
// var time = end - start;
// console.log('Execution time (binary): ' + time);

// console.log(getRandomWords(4));

/* 

Test functions used for the trie compression 

getDict();
lookup("cat");

*/