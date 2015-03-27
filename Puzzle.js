/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Block(x, y, size, value, index) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = value;
    this.visible = true;
    this.index = index;
    
    this.draw = function(c) {
        c.strokeRect(this.x, this.y, this.size, this.size);
        c.font = "bold 30px Arial";
        c.fillText(this.value.toString(), this.x + this.size/2, this.y + this.size/2);
    }
}

function drawField(c) {
    c.clearRect(0,0,WIDTH,HEIGHT);
    c.strokeRect(0,0,WIDTH,HEIGHT);
    for(var i = 0; i < qX * qY; i++) {
        if(box[i].visible) box[i].draw(c);
    }
}

function getValue(value) {
    
    var i = -1;
    do {
        i++;
    } while(box[i].value != value);
    return i;
}

function getInvisible() {
    
    var i = -1;
    do {
        i++;
    } while(box[i].visible != false);
    
    return i;
}


function swap(block1, block2) {
    var temp = block1.value;
    block1.value = block2.value;
    block2.value = temp;
    if(block1.visible && !block2.visible) {
        block1.visible = false;
        block2.visible = true;
    } else {
        block1.visible = true;
        block2.visible = false;
    }
}

function mix(box) {
    for(var i = 0; i < quantity * 10; i++)
    {
        var rand1 = Math.floor(Math.random() * 15);
        var rand2 = Math.floor(Math.random() * 15);
        
        swap(box[rand1], box[rand2]);
    }
    for(var i = 0; i <= quantity; i++) 
        box[i].visible = true;
}

function neighbour(b1, b2) {
    
    if((Math.abs(b1.index - b2.index) == 1) || (Math.abs(b1.index - b2.index) == 4))
        return true;
    else
        return false;
}


function setEmpty(empty, block) {
    
    if(!neighbour(empty, block)) {
        if(empty.x > block.x) {
            swap(empty, box[empty.index - 1]);
            
        } else if(empty.y > block.y) {
            swap(empty, box[empty.index - qX]);
         
        } else if(empty.x < block.x) {
            swap(empty, box[empty.index + 1]);
           
        } else if(empty.y < block.y) {
            swap(empty, box[empty.index + qX]);
           
        };
    }
       
        drawField(c);
}

function qqqq() {
    while(!neighbour(box[getInvisible()], box[getValue(0)]))
        setEmpty(box[getInvisible()], box[getValue(0)]);
}

function goHome(block) {
    
    
}


function solution() {
   
   
}

function moveUp() {
    var next = getInvisible();
    
    
    next += qX;
    swap(box[next], box[getInvisible()]);

    drawField(c);
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
    
    
    
    
    for(var i = 0; i < qX; i++) {
        for(var j = 0; j < qY; j++) {
            c.strokeRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
        }
    }
    
    var box = new Array();
    for(var i = 0; i < qY; i++) {
        for(var j = 0; j < qX; j++) {
            box.push(new Block(j * blockWidth, i * blockHeight, blockWidth, j + i * qY, j + i * qY));
        }
    }
    
    mix(box);
    box[0].visible = false;
    //swap(box[14], box[15]);
    //swap(box[10], box[14]);
    
    //alert(neighbour(box[11], box[13])); 
    
    drawField(c);
    
    //qqqq();
    setEmpty(box[getInvisible()], box[getValue(0)]);
    setEmpty(box[getInvisible()], box[getValue(0)]);
    setEmpty(box[getInvisible()], box[getValue(0)]);
    setEmpty(box[getInvisible()], box[getValue(0)]);
    setEmpty(box[getInvisible()], box[getValue(0)]);
    setEmpty(box[getInvisible()], box[getValue(0)]);
    
    moveUp();

    }
    


