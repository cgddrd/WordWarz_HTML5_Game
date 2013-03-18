var canvas = document.getElementById('main_canvas');
var context = canvas.getContext('2d');

var CANVAS_WIDTH = canvas.width;
var CANVAS_HEIGHT = canvas.height;

var FPS = 30;

var textX = (canvas.width / 2);
var textY = 50;

var dx = 2;
var dy = 4;

var enemies = [];


setInterval(function() {

  update();
  draw();
  
}, 1000/FPS);

var player = {
  color: "#00A",
  x: textX,
  y: textY,
  width: 32,
  height: 32,
  draw: function() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
};


function Enemy(I) {

  I = I || {};

  I.active = true;
  I.age = Math.floor(Math.random() * 128);
  
  I.angle = 0;
  I.turnSpeed = 1;
  
  I.Xstep = 1;
  I.Ystep = 1;
  I.coords = [];
  I.coordsIndex = 0;
  
  var index = Math.floor(Math.random() * 2) + 1;
  
  I.x = Math.floor(Math.random() * CANVAS_WIDTH) + 1;
  I.y = Math.floor(Math.random() * (CANVAS_HEIGHT - (textY + 20) + 1)) + (textY + 20);
  

//  I.x = CANVAS_WIDTH / 8 + Math.random() * CANVAS_WIDTH / 2;
  
 // if (index == 1) {
	  
//	  I.y = CANVAS_HEIGHT  - Math.random() * CANVAS_HEIGHT / 2;
	  
//  } else {
	  
//	  I.y = CANVAS_HEIGHT / 8 + Math.random() * CANVAS_HEIGHT / 2;
//  }
 
  
  I.xVelocity = 0;
  I.yVelocity = 0;

  I.width = 32;
  I.height = 32;
  
  I.xVelocity = 2 * Math.sin(I.age * Math.PI / 64);

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };
  
  I.storeCoords = function (xVal, yVal) {
  
    I.coords.push({x: xVal, y: yVal});
    
  }
  
  I.calc = function () {
  
 // console.log("helo");
  
  var x1 = I.x;
  var x2 = textX + 16;
  var y1 = I.y;
  var y2 = textY + 16;
  
var dx = Math.abs(x2 - x1);
var dy = Math.abs(y2 - y1);

var sx = (x1 < x2) ? 1 : -1;
var sy = (y1 < y2) ? 1 : -1;

var err = dx - dy;

while (true) {

    console.log(x1 + " - " + y1);
    I.storeCoords(x1, y1)

    if (x1 == x2 && y1 == y2) {
        break;
    }

    var e2 = 2 * err;

    if (e2 > -dy) {
        err = err - dy;
        x1 = x1 + sx;
    }

    if (e2 < dx) {
        err = err + dx;
        y1 = y1 + sy;
    }
}
  }
  
  I.calc();
  

  I.draw = function() { 
  
  	
    var katy_img=new Image();
    katy_img.src="ship.gif";
    
    var targetX = textX - I.x;
    var targetY = textY - I.y;

   // this.rotation = Math.atan2(targetY, targetX);
    
  //  context.save();
    
   // context.rotate(Math.PI / 4);
   
 //  rad = Math.atan2(targetY, targetX);
   
  // var targetAngle = (Math.atan2(textY - this.y, textX - this.x) * (180 / Math.PI))+90;
  
  var targetAngle = (Math.atan2((textY + 16) - this.y, (textX + 16) - this.x));
   
   targetAngle = (targetAngle+360)%360;  
   
    if(this.angle != targetAngle) {
    
    //REMOVE ALL NUMBERS TO MAKE THEM SPIN!!
        // Get the difference between the current angle and the target angle
        var netAngle = (this.angle - targetAngle + 360)%360 ;
        var delta = Math.min(Math.abs(netAngle-360), netAngle, this.turnSpeed);
        var sign  = (netAngle-180) >= 0 ? 1 : -1;
        // Turn in the closest direction to the target

        this.angle += sign*delta+360;            
        this.angle %= 360;

    }
   
   // context.drawImage(katy_img,this.x,this.y, this.width, this.height);
   
   context.save()
    
     //Set the origin to the center of the image
    context.translate(this.x, this.y);

    //Rotate the canvas around the origin
   // context.rotate(rad);
   
   context.rotate(this.angle);

    //draw the image    
    context.drawImage(katy_img,(this.width / 2 * (-1)) - this.width / 2,(this.height / 2 * (-1)) - this.height / 2,this.width,this.height);

    //reset the canvas  
  //  context.rotate(rad * ( -1 ) );
  //  context.translate((this.x + this.width / 2) * (-1), (this.y + this.height / 2) * (-1));
    
    context.restore();   
    
      context.beginPath();
      context.moveTo(I.coords[0].x, I.coords[0].y);
      context.lineTo(I.coords[I.coords.length - 1].x, I.coords[I.coords.length - 1].y);
      context.stroke();

  };

  I.update = function() {
  
//  textX = Math.cos(Math.PI / 4) * textX - Math.sin(Math.PI / 4) * textY;
//  textY = Math.sin(Math.PI / 4) * textX + Math.cos(Math.PI / 4) * textY;
  
 // console.log("TEXT X: " + textX);
 // console.log("TEXT Y: " + textY);
 // console.log("MY X: " + I.x);
 // console.log("MY Y: " + I.y);
  
//slope = (I.y - textY) / (I.x - textX);
//this.Ystep = this.Xstep * slope;
  
  
/*  if( (I.x == textX) && (I.y == textY) ) {
  
  	
  	
  	}

if(I.x  < textX){
I.x = I.x + this.Xstep;
}

if(I.x   > textX){
I.x = I.x - this.Xstep;
}

if(I.y< textY){
I.y = I.y + this.Ystep;
}

if(I.y > textY){
I.y = I.y - this.Ystep;
} */

if (I.coordsIndex < I.coords.length) {
	
	I.x = I.coords[I.coordsIndex].x;
	I.y = I.coords[I.coordsIndex].y;
	I.coordsIndex++;
	
} else {
	
	
	//this.active = false;
}

  
  
  
   // I.x += I.xVelocity;
    //I.y += I.yVelocity;

    

  //  I.age++;
  
//}

    I.active = I.active && I.inBounds();
  };

  return I;
};

  function collides(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
  
  function handleCollisions() {

  enemies.forEach(function(enemy) {
    if (collides(enemy, player)) {
      enemy.active = false;
      //player.explode();
    }
  });
}

function update() { 


  enemies.forEach(function(enemy) {
    enemy.update();
  });

  enemies = enemies.filter(function(enemy) {
    return enemy.active;
  });
  
 //   if(Math.random() < 0.1) {
 //   enemies.push(Enemy());
 // }
  
   if(enemies.length < 1) {
    enemies.push(Enemy());
  }
  
  handleCollisions();
  

  
}

function draw() { 
  
  
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();
 // context.fillRect(textX, textY, 10, 10);
    
   enemies.forEach(function(enemy) {
    enemy.draw();
   
  });
 
 }
 
 
