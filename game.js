var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');
// The dictionary lookup object
var cheese = [];

function set_dict(x, y) {
	cheese[x] = y;
}

function getDick() {
/*// Do a jQuery Ajax request for the text dictionary
$.get( "dict.txt", function( txt ) {
    // Get an array of all the words
    var twat = txt.split( "\n" );
    //alert("hello");

    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for ( var i = 0; i < twat.length; i++ ) {
        //dict['word':twat[i]];
        dict[i] = {'word':twat[i], 'score':76}
        //console.log(dict[i]);
    }
    
    console.log(twat.length);
    console.log(dict[0].word);
    console.log(dict[0].score);
   
    // The game would start after the dictionary was loaded
    // startGame();
}, 'text'); */

	$.ajax({
		url: "dict.txt",
		data: "text",
		async: false,
		success: function(data) {
		
		var twat = data.split("\n");
		
			for (var i = 0; i < twat.length; i++) {
				//dict['word':twat[i]];
				set_dict(i, {'word': twat[i],'score': 76});
				//console.log(dict[i]);
			}
			//set_dict();
		}
	});
	
	
}


getDick();
console.log(cheese.length);
console.log(cheese[176435].word);




// Takes in an array of letters and finds the longest
// possible word at the front of the letters

function findWord(letters) {
	// Clone the array for manipulation
		
		console.log("LENGTH: " + cheese.length);
		for (var i = 0; i < cheese.length; i++) {
		
		if (cheese[i].score == letters) {
			
			console.log(cheese[i].word);
			
		}
	}
}

findWord(76);

/*var file = "dict.txt";
var lines = new Array();

function getFile() {

    $.get(file,function(txt) {
        twat = txt.split("\n");
        for (var i = 0, len = twat.length; i < len; i++) {
            console.log(twat[i]);
        }
    }); 
}

function test() {

 	console.log(lines.length);
    console.log(lines[1]);   
}

getFile(); 
//test(); 

*/
/* jQuery.get('./dict.txt', function(data) {
   alert(data);
   //process text file line by line
  // $('#div').html(data.replace('\n','<br>'));
}); */
/*var number = 0;

$(document).ready(function() {
        $.ajax({
            url : "dict.txt",
            dataType: "text",
            success : function (data) {
                //$(".text").html(data);
                console.log(data);
                ++number;
                console.log(number);
            }
        });     
}); */