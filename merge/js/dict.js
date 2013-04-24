/**
 * Handles all external data file processing and word collection
 * generation used to produce levels in the game. 
 * 
 * @author Connor Luke Goddard (clg11)
 */

//The entire collection of words, catagorised by word length.
var gameDictionary = [];

/*
 * Collection of letters that have been used as the first letter 
 * of a word added to the collection of words generated for a level.
 */
var letters = [];

/**
 * Retrieves the multiple data files that contain the entire dictionary of 
 * words used in the game. These files are either retrieved from HTML5 local
 * storage, or from the web server via AJAX requests.
 */
function initialiseDictionary() {

	//Check to see if local storage is supported, and if so that the word collection already exists
	if (checkLocalStorageSupport() && JSON.parse(localStorage.getItem("dictionary"))) {
	
		/*
		 * If local storage already contains the dictionary, load the dictionary JSON objects.
		 * (Does not require the downloading of data files from the web server)
		 */
		gameDictionary = JSON.parse(localStorage.getItem("dictionary"));
		console.log('storage');
	
	//Otherwise, retrieve the various data files from the web server and process them.	
	} else {
	
		for (var i = 3; i <=15; i++) {
			
			getDictFile("files/dict" + i + ".dat", i);
			
		}

		console.log('file');
	}
	
	console.log(gameDictionary);
}

/**
 * Retrieves the data ('.dat') files from the web server via
 * AJAX requests ready for processing. 
 *
 * @param fileName The file path of the required file on the web server.
 * @param wordLimit The word length of words to be retrieved (required for file name and processing).
 */
function getDictFile(fileName, wordLimit) {

	//jQuery AJAX request for the specified file from the web server.
	$.ajax({
		url: fileName,
		data: "text",
		async: false,
		success: function(data) {
			
			//Process the retrieved data file.
			processDictWords(data, wordLimit);
		}
	});
}

/**
 * Processes the contents of word data files to create a colletion of word JSON
 * objects later utilised by the game engine. 
 *
 * @param words String object of all the words loaded in from the data file.
 * @param wordLimit The character length of words in the data file.
 */
function processDictWords(words, wordLength) {

	var currentWord = words.split("\n");
	var wordCollection = [];
	
	//LENGTH CACHING USED TO OPTIMISE LOOPS - http://jsperf.com/caching-array-length/4.
	for (var i = 0, len = currentWord.length; i < len; i++) {
	
		if (currentWord[i].length > 0) {
		
			//Create a new JSON object for the word.
			wordCollection.push({
					'word': currentWord[i],
					'score': currentWord[i].length
			});	
			
		}
		
	}
	
	//Create a new JSON object for the new collection of words with the same character length.
	gameDictionary.push({
		'letterCount': wordLength,
		'wordCollection': wordCollection
	});	
		
	//If HTML5 local storage is supported by the web browser
	if (checkLocalStorageSupport()) {
		
		//Store the collection of words in local storage to prevent the data files haveing to be retrieved/processed next time. 
		window.localStorage.setItem("dictionary",  JSON.stringify(gameDictionary));
		
	}
}

/**
 * Determines whether HTML5 local storage is supported by the current web browser. - http://diveintohtml5.info/storage.html
 *
 * @return Boolean determining whether HTML5 local storage is supported. 
 */
function checkLocalStorageSupport() {

	try {
	
		return 'localStorage' in window && window['localStorage'] !== null;
		
	} catch (e) {
	
		return false;
		
	}
	
}


/**
 * Obtains a collection of words from the internal dictionary  
 * that will be used for the current level. 
 *
 * @param noOfWords The number of words to be retrieved for this level.
 * @param levelDifficulty The current difficualt rating usd to determine approved word lengths that can be selected. 
 * @return An array of words retrieved from the internal dictionary.
 */
function getRandomWords(noOfWords, levelDifficulty) {

	var word_array = [noOfWords];
	var charcode;
	var selectedWord;
	var selector;
	
	try {

		for (var i = 0, len = noOfWords; i < len; i++) {
		
			//If the difficulty rating is set to 'easy'
			if (levelDifficulty === levelDifficultyEnum.EASY) {
				
				//Only allow words that are 6-3 characters long to be chosen.
				selector = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
				
			} else if (levelDifficulty === levelDifficultyEnum.MEDIUM) {
				
				selector = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
				
			} else {
				
				selector = Math.floor(Math.random() * (15 - 3 + 1)) + 3;
				
			}
		
				//Obtain the first character of the selected word.
				selectedWord = getNewWord(selector);
				charcode = selectedWord.word.charCodeAt(0);
	
				/* Check to see if any other words in the generated word collection
				 * already have the same first letter. 
				 *
				 * THIS IS VITAL TO ENSURE THAT THE SYSTEM KNOWS WHICH ENEMY TO "LOCK ONTO" WHEN
				 * THE USER IS PLAYING THE GAME - (I.E. IN A SINGLE LEVEL, EACH GENERATED WORD MUST START WITH A DIFFERENT LETTER)
				 */
				while (checkExistingLetter(charcode)) {
	
					selectedWord = getNewWord(selector);
					
					charcode = selectedWord.word.charCodeAt(0);
					
				}
			
			word_array[i] = selectedWord;
	
		}
    
    } catch (e) {
   
    	return [];
			
	}

    return word_array;
	
}

/**
 * Obtains a single random word from a specific sub-catagory of the internal dictionary.
 *
 * @param dictionaryNo The sub-catagory ID number to select a word from (i.e. word length)
 * @return A randomly selected word from the dictionary with the specified character length. 
 */
function getNewWord(dictionaryNo) {

	var collection;
	
	//Locate the specified sub-catagory of the dictonary
	for (var i = 0, len = gameDictionary.length; i < len; i++) {
		
		if (dictionaryNo === gameDictionary[i].letterCount) {
			
			collection = gameDictionary[i].wordCollection;
			
		}
	}
		
	//Select a random word from that dictionary. 
	var selector = Math.floor(Math.random() * (collection.length - 1));
	
	return collection[selector];
	
}


/**
 * Determines if the another word in the generated collection of words for a level
 * already starts with the specified character. 
 *
 * @param letterCode The ASCII code value of the charcter to be checked.
 * @return Boolean determining if another word starting with the same character has alreday been generated. 
 */
function checkExistingLetter(lettercode) {
	
	for (var i = 0, len = letters.length; i < len; i++) {
			
		if (lettercode === letters[i]) {
				
			return true;
				
		}
			
	}
	
	letters.push(lettercode);
	
	return false;
	
	
}

/**
 * Resets the array of used letters to allow a new collection of words to
 * be generated for a new level. 
 */
function resetUsedLetters() {
	
	this.letters = [];
}