// The dictionary lookup object
var gameDictionary = [];
var letters = [];

function initialiseDictionary() {

if (checkLocalStorageSupport() && JSON.parse(localStorage.getItem("dictionary"))) {
	
		//processDictWords(window.localStorage.getItem("gameDict" + wordLimit), wordLimit);
		this.gameDictionary = JSON.parse(localStorage.getItem("dictionary"));
		//console.log(dictionary);
		console.log("LOADED FROM STORAGE");
		
	} else {
	
		getDictFile("files/dict3.dat", 3);
		getDictFile("files/dict4.dat", 4);
		getDictFile("files/dict5.dat", 5);
		getDictFile("files/dict6.dat", 6);
	
	}
	
	
}

function getDictFile(fileName, wordLimit) {

	$.ajax({
		url: fileName,
		data: "text",
		async: false,
		success: function(data) {
			
			processDictWords(data, wordLimit);
			console.log("LOADED FROM FILE");
		}
	});
}

function processDictWords(words, wordLength) {

	var currentWord = words.split("\n");
	var wordCollection = [];
	
	for (var i = 0; i < currentWord.length; i++) {
	
		if (currentWord[i].length > 0) {
		
		wordCollection.push({
				'word': currentWord[i],
				'score': currentWord[i].length
				});	
		}
		
	}
	
	gameDictionary.push({
		'letterCount': wordLength,
		'wordCollection': wordCollection
		});	
		
		if (window.localStorage !== null) {
		
			window.localStorage.setItem("dictionary",  JSON.stringify(gameDictionary));
		
		}
}


function checkLocalStorageSupport() {

	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
	
}


function getRandomWords(noOfWords, levelDifficulty) {

	var word_array = [noOfWords];
	var charcode;
	var selectedWord;
	var selector;
	
	try {

		for (var i = 0; i < noOfWords; i++) {
		
		if (levelDifficulty === levelEnum.EASY) {
			
			selector = Math.floor(Math.random() * (4 - 3 + 1)) + 3;
			
		} else if (levelDifficulty === levelEnum.MEDIUM) {
			
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

var collection;

for (var i = 0; i < gameDictionary.length; i++) {
	
	if (dictionaryNo === gameDictionary[i].letterCount) {
		
		collection = gameDictionary[i].wordCollection;
		
	}
}
	
	var selector = Math.floor(Math.random() * (collection.length - 1));
	
	return collection[selector];
	
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

function resetUsedLetters() {
	
	this.letters = [];
}