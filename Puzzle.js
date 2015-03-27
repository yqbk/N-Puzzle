/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Block(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padding = 15;
    
    this.draw = function(c) {
        c.fillRect(this.x * this.width + this.padding, this.y * this.height + this.padding, this.width - 2 * this.padding, this.height - 2 * this.padding);
    }
}



var canvas = document.getElementById('canvas');
if (canvas.getContext){
    var c = canvas.getContext('2d');
    var WIDTH = 500;
    var HEIGHT = 500;
    var qX = 4;
    var qY = 4;
    var blockWidth = WIDTH/qX;
    var blockHeight = HEIGHT/qY;
    
    
    c.strokeRect(0,0,WIDTH,HEIGHT);
    
    for(var i = 0; i < qX; i++) {
        for(var j = 0; j < qY; j++) {
            c.strokeRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
        }
    }
    
    var padding = 15;
    for(var i = 0; i < qX; i++) {
        for(var j = 0; j < qY; j++) {
            c.fillRect(i * blockWidth + padding, j * blockHeight + padding, blockWidth - 2 * padding, blockHeight - 2 * padding);
        }
    }
    
    
}

