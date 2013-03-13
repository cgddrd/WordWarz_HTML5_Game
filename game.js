var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

/*
// The dictionary lookup object
var dict = {};
 
// Do a jQuery Ajax request for the text dictionary
$.get( "dict.txt", function( txt ) {
    // Get an array of all the words
    var words = txt.split( "\n" );
    alert("hello");
 
    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for ( var i = 0; i < words.length; i++ ) {
        dict[ words[i] ] = true;
        
    }
   
    // The game would start after the dictionary was loaded
    // startGame();
});
 
// Takes in an array of letters and finds the longest
// possible word at the front of the letters
function findWord( letters ) {
    // Clone the array for manipulation
    var curLetters = letters.slice( 0 ), word = "";
   
    // Make sure the word is at least 3 letters long
    while ( curLetters.length > 2 ) {
        // Get a word out of the existing letters
        word = curLetters.join("");
   
        // And see if it's in the dictionary
        if ( dict[ word ] ) {
            // If it is, return that word
            return word;
        }
 
        // Otherwise remove another letter from the end
        curLetters.pop();
    }
}

//alert(findWord( [ "r", "a", "t", "e", "g", "k" ] ));

*/

/*var file = "test.txt";
function getFile(){
    $.get(file,function(txt){
        var lines = txt.responseText.split("\r");
        for (var i = 0, len = lines.length; i < len; i++) {
            console.log(lines[i]);
        }
    }); 
}

getFile(); */

/* jQuery.get('./dict.txt', function(data) {
   alert(data);
   //process text file line by line
  // $('#div').html(data.replace('\n','<br>'));
}); */

$(document).ready(function() {
        $.ajax({
            url : "dict.txt",
            dataType: "text",
            success : function (data) {
                //$(".text").html(data);
                console.log(data);
            }
        });
}); 