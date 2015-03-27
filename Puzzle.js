/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Block(x, y, size, value) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = value;
    
    this.draw = function(c) {
        c.strokeRect(this.x, this.y, this.size, this.size);
        c.font = "bold 30px Arial";
        c.fillText(this.value.toString(), this.x + this.size/2, this.y + this.size/2);
    }
}





var canvas = document.getElementById('canvas');
if (canvas.getContext){
    var c = canvas.getContext('2d');
    var WIDTH = 500;
    var HEIGHT = 500;
    var qX = 4;
    var qY = 4;
    var quantity = qX * qY - 1;
    var blockWidth = WIDTH/qX;
    var blockHeight = HEIGHT/qY;
    
    
    c.strokeRect(0,0,WIDTH,HEIGHT);
    
    for(var i = 0; i < qX; i++) {
        for(var j = 0; j < qY; j++) {
            c.strokeRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
        }
    }
    
    var box = new Array();
    for(var i = 0; i < qY; i++) {
        for(var j = 0; j < qX; j++) {
            box.push(new Block(i * blockWidth, j * blockHeight, blockWidth, i + j * qX + 1));
        }
    }
    
    for(var i = 0; i < qX * qY - 1; i++) {
        box[i].draw(c);
    }
   
}

