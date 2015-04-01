/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var test = [new State(0,0,0,0,0,1,2),new State(0,0,0,0,0,1,1),new State(0,0,0,0,0,0,2),new State(0,0,0,0,0,1,0),new State(0,0,0,0,0,4,0),new State(0,0,0,0,0,4,2)];

//var test2 = deepCopy(test);
//test[0].id = 9;

//alert(test[0].id);
//alert(test2[0].id);
//alert([test[0].numberOfMistakes + test[0].numberOfSteps, test[1].numberOfMistakes + test[1].numberOfSteps, test[2].numberOfMistakes + test[2].numberOfSteps, test[3].numberOfMistakes + test[3].numberOfSteps, test[4].numberOfMistakes + test[4].numberOfSteps, test[5].numberOfMistakes + test[5].numberOfSteps]);
//sort(test);
//var Y = test[0];
//test.splice(0,1);
//alert([test[0].numberOfMistakes + test[0].numberOfSteps, test[1].numberOfMistakes + test[1].numberOfSteps, test[2].numberOfMistakes + test[2].numberOfSteps, test[3].numberOfMistakes + test[3].numberOfSteps, test[4].numberOfMistakes + test[4].numberOfSteps, test[5].numberOfMistakes + test[5].numberOfSteps]);
//var arg = new State(0,0,0,0,0,0);s

//test.sort(function(a,b) { return parseFloat(a.numberOfMistakes) - parseFloat(b.numberOfMistakes) } );
//alert(Y.blocks);
    
   
    
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
    
   /*
    for(var i = 0; i < qX; i++) {
        for(var j = 0; j < qY; j++) {
            //c.strokeRect(i * blockWidth, j * blockHeight, blockWidth, blockHeight);
        }
    }
    */
    var blocks = new Array();
    for(var i = 0; i < qY; i++) {
        for(var j = 0; j < qX; j++) {
            blocks.push(new Block(j * blockWidth, i * blockHeight, blockWidth, j + i * qY + 1, j + i * qY));
        }
    }
    
 
    var current = quantity;
    blocks[current].visible = false;
    var lastmove = "none";
    for(var i = 0; i < 14; i++) {
        mix(blocks);
    }
    //var myVar = setInterval(function () {mix(blocks); drawField(c, blocks, 0, 0, 1)}, 100);
    lastmove = "none";
    
    var endStateValues = [];
    for(var i = 0; i <= quantity; i++) endStateValues.push(i+1);
    
    //alert(solvable());
    
    
    drawField(c, blocks, 0, 0, 1);
    //alert(getInvisible());
    
    //sovable();
    
    var currentState = new State(0, blocks, 0, "none", "none", 0, numberOfMistakes());
    
    var startState = deepCopy(currentState);
    var endState;
    
    
    var open = [startState];
    var close = [];
    var X;
    var stateId = 0;
    var answer = [];
    
    var done = false;
    //alert([close.length, open.length]);
 
    var k = 0;
    while(!solution() && k < 10000) {
        k++;
    } 
    //alert(k);
    drawClose(c);
   
    if(done) {
        drawSolution();
        //alert([answer]);
        animation();
    }
    
    }
    
    
function drawSolution() {
    var temp = deepCopy(X);
    
    var p = 0;
    while(temp.id != 0 && p <= 100) {
        p++;
        for(var j = 0; j < close.length; j++) {
            if(close[j].id == temp.parentId) {
                //alert("jest!");
                answer.push(temp.swap);
                temp = deepCopy(close[j]);
                break;
            }
        }
    }
}    

function animation() {
    setState(startState);
    var i = answer.length - 1;
    var v = setInterval(function () {if(i >= 0){swap(answer[i])}; i--; drawField(c, blocks, 0, 0, 1)}, 500);
}
    
function drawOpen(c) {
    
    var scale = 0.3;
    for(var i = 0; i < open.length; i++) {
        drawField(c, open[i].blocks, 10 + 566 * scale * i, 550 + 500 * scale * open[i].numberOfSteps, scale);  
        c.fillText("Id:" + open[i].id + " | ParentId:" + open[i].parentId, 10 + 566 * scale * i, 540 + 500 * scale * open[i].numberOfSteps);

    }  
    
}

function drawClose(c) {
    var scale = 0.25;
    for(var i = 0; i < close.length; i++) {
        drawField(c, close[i].blocks, 10 + 566 * scale * i, 550 + 500 * scale * close[i].numberOfSteps, scale);     
        c.fillText("Id:" + close[i].id + " | ParentId:" + close[i].parentId + " | Step:" + close[i].numberOfSteps + " | Mist:" + close[i].numberOfMistakes, 10 + 566 * scale * i, 540 + 500 * scale * close[i].numberOfSteps);
    }  
}


function Block(x, y, size, value, index) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = value;
    this.visible = true;
    this.index = index;
    
    this.draw = function(c, x, y, scale) {
        c.strokeRect(this.x * scale + x, this.y * scale + y, this.size * scale, this.size * scale);
        c.font = "bold " + 30 * scale + "px Arial";
        c.fillText(this.value.toString(), this.x * scale + this.size * scale/2 + x, this.y * scale + this.size * scale/2 + y);
    }
    
    this.drawIndex = function(c) {
        c.font = "10px Arial";
        c.fillText(this.index.toString(), this.x + this.size/10, this.y + this.size/2);
    }
}

function State(id, blocks, parentId, swap, lastmove, numberOfSteps, numberOfMistakes) {
    this.id = id;
    this.blocks = blocks;
    this.parentId = parentId;
    this.swap = swap;
    this.lastmove = lastmove;
    this.numberOfSteps = numberOfSteps;
    this.numberOfMistakes = numberOfMistakes;
}

function sort(state) {
    state.sort(function(a,b) { return parseFloat(a.numberOfMistakes + a.numberOfSteps) - parseFloat(b.numberOfMistakes + b.numberOfSteps) } );
}

function setState(state) {
    
    blocks = createNewBlocks(state.blocks);
}

function deepCopy(p,c) { var c = c||{}; for (var i in p) {   if (typeof p[i] === 'object') {     c[i] = (p[i].constructor === Array)?[]:{};     deepCopy(p[i],c[i]);   } else c[i] = p[i];} return c; }

function createNewBlocks(blocks) {
    temp = [];
    
    for(var i = 0; i < blocks.length; i++) {
        temp.push(deepCopy(blocks[i]));
    }
    
    return temp;
}

function generateChildren() {
    
    var temp = [];
    var swapA = getInvisible();
    var parentId = X.id;
    
    if(lastmove != "down" && swapA - qX >= 0) {
        swap("up");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "up", "up", X.numberOfSteps + 1, numberOfMistakes()));
        swap("down");
    }
    if(lastmove != "up" && swapA + qX <= quantity) {
        swap("down");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "down", "down", X.numberOfSteps + 1, numberOfMistakes()));
        swap("up");
    }
    if(lastmove != "right" && swapA - 1 >= 0 && blocks[swapA - 1].y == blocks[swapA].y) {
        swap("left");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "left", "left", X.numberOfSteps + 1, numberOfMistakes()));
        swap("right");
    }
    if(lastmove != "left" && swapA + 1 <= quantity && blocks[swapA + 1].y == blocks[swapA].y) {
        swap("right");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "right", "right", X.numberOfSteps + 1, numberOfMistakes()));
        swap("left");
    }
    
    return temp;
}

function compareState(state, values) {
    
    for(var i = 0; i < state.blocks.length; i++) {
        if(state.blocks[i].value != values[i]) return false;
    }
    return true;
}

function solution() {
    
   X = deepCopy(open[0]);
   
   if(compareState(X, endStateValues)) {
       close.push(deepCopy(X));
       if(!done) alert("Uda³o siê!    Liczba sprawdzeñ: " + k);
       done = true;
       return true;
    } else {
       open.splice(0,1);
       setState(X);
       var children = generateChildren();
            for(var i = 0; i < children.length; i++) {
                if(open.indexOf(children[i]) == -1 && close.indexOf(children[i]) == -1) {
                    open.push(deepCopy(children[i]));
                }
            }
        //alert([open.length]);
        close.push(deepCopy(X));
        sort(open);
        return false;
    }
}

function drawField(c, blocks, x, y, scale) {
    c.clearRect(x,y, qX * blocks[0].size * scale, qY *blocks[0].size * scale);
    c.strokeRect(0,0,WIDTH,HEIGHT);
    for(var i = 0; i < qX * qY; i++) {
        if(blocks[i].visible) blocks[i].draw(c, x, y, scale);
        //blocks[i].drawIndex(c);
    }
}

function swap(side) {
    var swapA = getInvisible();
    var swapB = 0;
    var change = false;
    
    if(side == "up" && swapA - qX >= 0) {
        swapB = swapA - qX;
        lastmove = "up";
        change = true;
    }
    if(side == "down" && swapA + qX <= quantity) {
        swapB = swapA + qX;
        lastmove = "down";
        change = true;
    }
    if(side == "left" && swapA - 1 >= 0 && blocks[swapA - 1].y == blocks[swapA].y) {
        swapB = swapA - 1;
        lastmove = "left";
        change = true;
    }
    if(side == "right" && swapA + 1 <= quantity && blocks[swapA + 1].y == blocks[swapA].y) {
        swapB = swapA + 1;
        lastmove = "right";
        change = true;
    }
    
    if(change) {
        var temp = blocks[swapA].value;
        blocks[swapA].value = blocks[swapB].value;
        blocks[swapB].value = temp;
        if(blocks[swapA].visible && !blocks[swapB].visible) {
            blocks[swapA].visible = false;
            blocks[swapB].visible = true;
        } else {
            blocks[swapA].visible = true;
            blocks[swapB].visible = false;
        }
    }
}

function solvable() {
    var sumMain = 0;
    var sumTemp = 0;
    
    for(var i = 0; i <= quantity; i++) {
        for(var j = i + 1; j <= quantity; j++) {
            if(blocks[j].value < blocks[i].value) sumTemp++;
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
    } while(blocks[i].visible != false);
    
    return i;
}

function mix(blocks) {
    var change;
    var swapA = getInvisible();
    //for(var i = 0; i < 15; i++)
    //{
        change = false;
        while(!change) {
            var rand = Math.floor(Math.random() * 4);
            if (rand == 0 && lastmove != "down" && swapA - qX >= 0) {
                swap("up");
                change = true;
            }
            if (rand == 1 && lastmove != "up" && swapA + qX <= quantity) {
                swap("down");
                change = true;
            }
            if (rand == 2 && lastmove != "right" && swapA - 1 >= 0 && blocks[swapA - 1].y == blocks[swapA].y) {
                swap("left");
                change = true;
            }
            if (rand == 3 && lastmove != "left" && swapA + 1 <= quantity && blocks[swapA + 1].y == blocks[swapA].y) {
                swap("right");
                change = true;
            }
        }       
        //alert([rand1, rand2]);
    //}
}

function getValue(value) {
    
    var i = -1;
    do {
        i++;
    } while(box[i].value != value);
    return i;
}


function numberOfMistakes() {
    var sum = 0;
    for(var i = 0; i <= quantity; i++) {
        if(blocks[i].value != endStateValues[i] && blocks[i].visible) sum++;
    }
    return sum;
}



