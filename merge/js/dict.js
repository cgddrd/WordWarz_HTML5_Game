// The dictionary lookup object
var dictionary = [];
var current_words = [];
var letters = [];

function getDictFile(fileName, wordLimit) {

//window.localStorage.clear();

	if (supports_html5_storage() && JSON.parse(localStorage.getItem("dictionary"))) {
	
		//processDictWords(window.localStorage.getItem("gameDict" + wordLimit), wordLimit);
		this.dictionary = JSON.parse(localStorage.getItem("dictionary"));
		//console.log(dictionary);
		console.log("LOADED FROM STORAGE");
		
	} else {
	
		$.ajax({
			url: fileName,
			data: "text",
			async: false,
			success: function(data) {
			
				//var oldData = data.split(/\r\n|\r|\n/); //Need to remove both carriage returns and new lines. (Req. for "dict.txt")
				processDictWords(data, wordLimit);
				console.log("LOADED FROM FILE");
				
			//	if (window.localStorage !== null) {
				
					//window.localStorage.gameDict = data;
					//window.localStorage.setItem("gameDict" + wordLimit, data);
				//	console.log("Local storage saved!!");
					
				//}
			}
		});
		
	}
}

function processDictWords(words, wordLength) {

	var currentWord = words.split("\n");
	var test = [];
	
	for (var i = 0; i < currentWord.length; i++) {
	
		if (currentWord[i].length > 0) {
		
		test.push({
				'word': currentWord[i],
				'score': currentWord[i].length
				});	
		}
		
	}
	
	dictionary.push({
		'letterCount': wordLength,
		'wordCollection': test
		});	
		
		if (window.localStorage !== null) {
		
		window.localStorage.setItem("dictionary",  JSON.stringify(dictionary));
		
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

function getRandomWords(noOfWords, thevalue) {

	var word_array = [noOfWords];
	var charcode;
	var selectedWord;
	var selector;
	
	try {

		for (var i = 0; i < noOfWords; i++) {
		
		if (thevalue === levelEnum.EASY) {
			
			selector = Math.floor(Math.random() * (4 - 3 + 1)) + 3;
			
		} else if (thevalue === levelEnum.MEDIUM) {
			
			selector = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
			
		} else {
			
			selector = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
			
		}
	
			selectedWord = getNewWord(selector);
			charcode = selectedWord.word.charCodeAt(0);

			while (checkExistingLetter(charcode)) {

				selectedWord = getNewWord(selector);
				
				charcode = selectedWord.word.charCodeAt(0);
				
			}
		
			word_array[i] = selectedWord;
			console.log(word_array[i].word);
	
		}
    
    } catch (e) {
    
    	console.log("error getting word");
    
    	return null;
			
	}

    return word_array;
	
}

function getNewWord(dictionaryNo) {

var thearray;

for (var i = 0; i < dictionary.length; i++) {
	
	if (dictionaryNo === dictionary[i].letterCount) {
		
		thearray = dictionary[i].wordCollection;
		
	}
}
	
	var selector = Math.floor(Math.random() * (thearray.length - 1));
	
	return thearray[selector];
	
}


function checkExistingLetter(lettercode) {
	
	for (var i = 0; i < letters.length; i++) {
			
			if (lettercode === letters[i]) {
				
				return true;
				
			}
			
	}
	
	letters.push(lettercode);
	
	return false;
	
	
}

function resetLetters() {
	
	this.letters = [];
}

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