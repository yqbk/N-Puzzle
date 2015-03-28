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

function sovable() {
    var sumMain = 0;
    var sumTemp = 0;
    
    for(var i = 0; i <= quantity; i++) {
        for(var j = i + 1; j < quantity; j++) {
            if(box[j].value < box[i].value) sumTemp++;
        }
        sumMain += sumTemp;
        //alert(sumTemp);
        sumTemp = 0;
    }
    //alert(sumMain);
    return sumMain;
}

function getInvisible() {
    
    var i = -1;
    do {
        i++;
    } while(box[i].visible != false);
    
    return i;
}

function mix() {
    
    //do {
        for(var i = 0; i < 10; i++)
        {
        var changed = false;
            
        while(!changed) {
            var direction = Math.floor(Math.random() * 4);
            //alert(direction);
            if(direction == 0 && current + 1 >= 0 && current + 1 <= 15 && box[current + 1].y == box[current].y && lastmove != "left") {
                swap(box[current + 1], box[current]);
                lastmove = "right";
                changed = true;
            }
            if(direction == 1 && current - 1 >= 0 && current - 1 <= 15 && box[current - 1].y == box[current].y && lastmove != "right") {
                swap(box[current - 1], box[current]);
                lastmove = "left";
                changed = true;
            }
            if(direction == 2 && current + qX >= 0 && current + qX <= 15 && box[current + qX].x == box[current].x && lastmove != "up") {
                swap(box[current + qX], box[current]);
                lastmove = "down";
                changed = true;
            }
            if(direction == 3 && current - qX >= 0 && current - qX <= 15 && box[current - qX].x == box[current].x && lastmove != "down") { 
                swap(box[current - qX], box[current]);
                lastmove = "up";
                changed = true;
            }
        }
            
            //drawField(c);
            current = getInvisible();
            //alert(current);
            drawField(c);
            
        }
       // alert(sovable());
    //} while(sovable()%2 != 0);
    
}

function getValue(value) {
    
    var i = -1;
    do {
        i++;
    } while(box[i].value != value);
    return i;
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


function numberOfMistakes() {
    var sum = 0;
    for(var i = 0; i < quantity; i++) {
        if(box[i].value != i || box[i].visible == false) sum++;
    }
    return sum;
}

function nextStep() {
    var var1, var2, var3, var4;
    
    var1 = 1000;
    var2 = 1000;
    var3 = 1000;
    var4 = 1000;
    
    /*
    if(current - qX >= 0 && current - qX <= 15 && box[current - qX].x == box[current].x && lastmove != "down") var1 = Math.abs(box[current - qY].value - current);
    if(current + 1 >= 0 && current + 1 <= 15 && box[current + 1].y == box[current].y && lastmove != "left") var2 = Math.abs(box[current + 1].value - current);
    if(current + qX >= 0 && current + qX <= 15 && box[current + qX].x == box[current].x && lastmove != "up") var3 = Math.abs(box[current + qX].value - current);
    if(current - 1 >= 0 && current - 1 <= 15 && box[current - 1].y == box[current].y && lastmove != "right") var4 = Math.abs(box[current - 1].value - current);
    */
    
    //alert(var1 + " " + var2 + " " + var3 + " " + var4);
    
   
   
   if(current - qX >= 0 && current - qX <= quantity && box[current - qX].x == box[current].x && lastmove != "down") {
        swap(box[current - qX], box[current]);
        var1 = numberOfMistakes();
        swap(box[current - qX], box[current]);
    }
    if(current + 1 >= 0 && current + 1 <= quantity && box[current + 1].y == box[current].y && lastmove != "left") {
        swap(box[current + 1], box[current]);
        var2 = numberOfMistakes();
        swap(box[current + 1], box[current]);
    }
    if(current + qX >= 0 && current + qX <= quantity && box[current + qX].x == box[current].x && lastmove != "up") {
        swap(box[current + qX], box[current]);
        var3 = numberOfMistakes();
        swap(box[current + qX], box[current]);
    }
    if(current - 1 >= 0 && current - 1 <= quantity && box[current - 1].y == box[current].y && lastmove != "right") {
        swap(box[current - 1], box[current]);
        var4 = numberOfMistakes();
        swap(box[current - 1], box[current]);
    }
    
    //alert(var1 + " " + var2 + " " + var3 + " " + var4);
    if(Math.min(var1, var2, var3, var4) == var1) {
        swap(box[current - qY], box[current]);
        lastmove = "up";
    } else if(Math.min(var1, var2, var3, var4) == var2) {
        swap(box[current + 1], box[current]);
        lastmove = "right";
    } else if(Math.min(var1, var2, var3, var4) == var3) {
        swap(box[current + qX], box[current]);
        lastmove = "down";
    } else if(Math.min(var1, var2, var3, var4) == var4) {
        swap(box[current - 1], box[current]);
        lastmove = "left";
    }
    
    
    current = getInvisible();  
    drawField(c);
    if(numberOfMistakes() == 0) alert("Uda³o siê!");
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
    
 
    var current = quantity;
    box[current].visible = false;
    var lastmove = "none";
    mix();
    //setInterval(function() {mix()}, 100);
 
    /*
    box[0].value = 11;
    box[1].value = 0;
    box[2].value = 9;
    box[3].value = 1;
    box[4].value = 6;
    box[5].value = 10;
    box[6].value = 3;
    box[7].value = 13;
    box[8].value = 4;
    box[9].value = 8;
    box[10].value = 14;
    box[11].value = 2;
    box[12].value = 7;
    box[13].value = 12;
    box[14].value = 5;
    box[15].value = 15;
    */
    

    drawField(c);
    //sovable();
    setInterval(function() {nextStep()}, 100);
    

    }
    


