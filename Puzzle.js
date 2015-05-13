/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

 //Field properties
var canvas = document.getElementById('canvas');
if (canvas.getContext){
    var c = canvas.getContext('2d');
    c.clearRect(0,0, 500, 625);
    var WIDTH = 500;
    var HEIGHT = 500;
    var qX = 4;
    var qY = 4;
    var quantity = qX * qY - 1;
    var blockWidth = WIDTH/qX;
    var blockHeight = HEIGHT/qY;    
    
    var blocks = new Array();
    for(var i = 0; i < qY; i++) {
        for(var j = 0; j < qX; j++) {
            blocks.push(new Block(j * blockWidth, i * blockHeight, blockWidth, j + i * qY + 1, j + i * qY));
        }
    }
    
    var current = quantity;
    blocks[current].visible = false;
    var lastmove = "none";
    
    //Generaing entrophy
    var changes = 25;
    for(var i = 0; i < changes; i++) {
       //mix(blocks);
    }
    
    //Array of wanted solution
    lastmove = "none";    
    var endStateValues = [];
    for(var i = 0; i <= quantity; i++) 
        endStateValues.push(i+1);    

    //Draw fileds of blocks
    
    //Variables init
    var currentState = new State(0, blocks, 0, "none", "none", 0, numberOfMistakes());    
    var startState = deepCopy(currentState);    
    var endState;
    var final;    
    var open = [startState];
    var close = [];
    var X;
    var stateId = 0;
    var answer = [];    
    var done = false;
    var speedOfAnimaton = 5;
    var speedOfMoves = 1;
    var idInt;
    var imagePieces = [];
    var image = new Image();
    var imageWidth;
    var imageHeight;
    image.src = 'ml.png';
    image.onload = function() {
        imageWidth = this.width;
        imageHeight = this.height;
        drawField(c, blocks, 0, 0, 1);
    }
    
    var animation = false;
    var reset = false;
    var solve = false;
    var mixing = true;
   
    var invId = getInvisible();
    var iterator = 0;
    var sidesIt = answer.length - 1;
    idInt = setInterval(animate, speedOfAnimaton);
}    
    
document.getElementById("speed").onchange = function() {
    speedOfMoves = Number(document.getElementById("speed").value);
}

document.getElementById("reset").onclick = function() {
        reset = true;
        mixing = true;
    }
    
document.getElementById("solution").onclick = function() {
        reset = true;
        mixing = false;
    }
    
document.getElementById("3x3").onclick = function() {
        qX = 3;
        qY = 3;
        endStateValues = [];
        quantity = qX * qY - 1;
        for(var i = 0; i <= quantity; i++) endStateValues.push(i+1); 
        blockWidth = WIDTH/qX;
        blockHeight = HEIGHT/qY;  
        reset = true;
        mixing = false;
    }
    
document.getElementById("4x4").onclick = function() {
        qX = 4;
        qY = 4;
        endStateValues = [];
        quantity = qX * qY - 1;
        for(var i = 0; i <= quantity; i++) endStateValues.push(i+1); 
        blockWidth = WIDTH/qX;
        blockHeight = HEIGHT/qY;  
        reset = true;
        mixing = false;
    }
    
 document.getElementById("5x5").onclick = function() {
        qX = 5;
        qY = 5;
        endStateValues = [];
        quantity = qX * qY - 1;
        for(var i = 0; i <= quantity; i++) endStateValues.push(i+1); 
        blockWidth = WIDTH/qX;
        blockHeight = HEIGHT/qY;  
        reset = true;
        mixing = false;
    }
    
document.getElementById("solve").onclick = function() {
        solve = true;
        
    }

function animate() {
    
    if(solve && !animation) {
        c.clearRect(0,0, 500, 625); 
        drawField(c, blocks, 0, 0, 1);
        done = false;
        if(solutionIDA(startState) == -1) {
            //alert("Uda³o siê!!!");
            c.font = "bold 25px Arial";
            c.fillText("Uda³o siê rozwi¹zaæ.", 10, 550);
            done = true;
            //drawClose(c, 0, 1, 0.5);
        } else {
            alert("Nie uda³o siê...");
            }
            if(done) {
                drawSolution();
                c.font = "bold 20px Arial";
                c.fillText("Liczba ruchów mieszaj¹cych: " + changes, 10, 600);
                c.fillText("Liczba ruchów prowadz¹cych do rozwi¹zania: " + answer.length, 10, 625);

                iterator = 0;
                sidesIt = answer.length - 1;
                setState(startState);

                }
        solve = false;
        animation = true;
        }
    
    if(reset) {
        c.clearRect(0,0, 500, 625);  
        blocks = new Array();
        for(var i = 0; i < qY; i++) {
            for(var j = 0; j < qX; j++) {
                blocks.push(new Block(j * blockWidth, i * blockHeight, blockWidth, j + i * qY + 1, j + i * qY));
            }
        }
        current = quantity;
        blocks[current].visible = false;
        lastmove = "none";

        if(mixing) {
            for(var i = 0; i < changes; i++) {
               mix(blocks);
            }
        }

        //Array of wanted solution
        lastmove = "none";       
        currentState = new State(0, blocks, 0, "none", "none", 0, numberOfMistakes());    
        startState = deepCopy(currentState); 
        //Draw fileds of blocks

        //Variables init  
        open = [startState];
        close = [];
        stateId = 0;
        answer = [];    
        done = false;
        speedOfAnimaton = 5;

        drawField(c, blocks, 0, 0, 1);

        animation = false;
        reset = false;
        solve = false;


        invId = getInvisible();
        iterator = 0;
        sidesIt = answer.length - 1;
    }
    
    if(animation) {
        if(answer[sidesIt] == "left") blocks[invId - 1].x+=speedOfMoves;
        if(answer[sidesIt] == "right") blocks[invId + 1].x-=speedOfMoves;
        if(answer[sidesIt] == "up") blocks[invId - qX].y+=speedOfMoves;
        if(answer[sidesIt] == "down") blocks[invId + qX].y-=speedOfMoves;

        drawField(c, blocks, 0, 0, 1);
        iterator+=speedOfMoves;
        if(iterator >= blockWidth || iterator >= blockHeight) {

            if(answer[sidesIt] == "left") blocks[invId - 1].x-=iterator;
            if(answer[sidesIt] == "right") blocks[invId + 1].x+=iterator;
            if(answer[sidesIt] == "up") blocks[invId - qX].y-=iterator;
            if(answer[sidesIt] == "down") blocks[invId + qX].y+=iterator;
            swap(answer[sidesIt]);
            invId = getInvisible();
            iterator = 0;
            sidesIt--;
            if(sidesIt >= 0) setTimeout(animate, speedOfAnimaton);
        }
    }
}

function right() {
    a+=1;
    c.strokeRect(a, b, 10, 10);
    if (a >= 300) {
        clearInterval(idInt);
        idInt = setInterval(left, 10);
    }
}

function left() {
    b++;
    c.strokeRect(a, b, 10, 10);
    if (b >= 300) clearInterval(idInt);
}


function drawSolution() {
    var temp = deepCopy(final);    
    var p = 0;
    
    while(temp.id != 0 && p <= 100) {
        p++;
        for(var j = 0; j < close.length; j++) {
            if(close[j].id == temp.parentId) {
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
    
function drawOpen(c, start, end, scale) {    
    
    for(var i = 0; i < open.length; i++) {
        drawField(c, open[i].blocks, 10 + 566 * scale * i, 550 + 500 * scale * open[i].numberOfSteps, scale);  
        c.fillText("Id:" + open[i].id + " | ParentId:" + open[i].parentId, 10 + 566 * scale * i, 540 + 500 * scale * open[i].numberOfSteps);
    }      
}

function drawClose(c, start, end, scale) {
    
    for(var i = start; i < end; i++) {
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
        c.drawImage(image, ((this.value - 1) % qX) * imageHeight/qX, imageHeight/qX * Math.round((this.value - 3) / qX), imageHeight/qX, imageHeight/qX, x + this.x * scale, y + this.y * scale, this.size * scale, this.size * scale);
        //alert(this.value + " "  + (this.value - 1) % qX + " " + Math.round((this.value - 1) / qX));
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
    state.sort(function(a,b) { 
        return parseFloat(a.numberOfMistakes + a.numberOfSteps) - parseFloat(b.numberOfMistakes + b.numberOfSteps) 
        });
}

function setState(state) {    
    blocks = createNewBlocks(state.blocks);
}

function deepCopy(p,c) { 
    var c = c||{}; 
    
    for (var i in p) {   
        if (typeof p[i] === 'object') {     
            c[i] = (p[i].constructor === Array)?[]:{};     
            deepCopy(p[i],c[i]);   
        } else c[i] = p[i];
    } 
    
    return c; 
}

function createNewBlocks(blocks) {
    temp = [];
    
    for(var i = 0; i < blocks.length; i++) {
        temp.push(deepCopy(blocks[i]));
    }
    
    return temp;
}

function generateChildren(X) {
    
    var temp = [];
    var swapA = getInvisible();
    var parentId = X.id;

    
    if(X.lastmove != "down" && swapA - qX >= 0) {
        swap("up");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "up", "up", X.numberOfSteps + 1, numberOfMistakes()));
        swap("down");
    }
    if(X.lastmove != "up" && swapA + qX <= quantity) {
        swap("down");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "down", "down", X.numberOfSteps + 1, numberOfMistakes()));
        swap("up");
    }
    if(X.lastmove != "right" && swapA - 1 >= 0 && blocks[swapA - 1].y == blocks[swapA].y) {
        swap("left");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "left", "left", X.numberOfSteps + 1, numberOfMistakes()));
        swap("right");
    }
    if(X.lastmove != "left" && swapA + 1 <= quantity && blocks[swapA + 1].y == blocks[swapA].y) {
        swap("right");
        stateId++;
        temp.push(new State(stateId, createNewBlocks(blocks), parentId, "right", "right", X.numberOfSteps + 1, numberOfMistakes()));
        swap("left");
    }
    
    return temp;
}

function compareState(state, values) {
    
    for(var i = 0; i < state.blocks.length; i++) {
        if(state.blocks[i].value != values[i]) 
            return false;
    }
    
    return true;
}

function solution() {
    
   X = deepCopy(open[0]);
   
   if(compareState(X, endStateValues)) {
       close.push(deepCopy(X));
       alert("Uda³o siê!    Liczba sprawdzeñ: " + k);
       done = true;
       
       return true;
    } else {
       open.splice(0,1);
       setState(X);
       var children = generateChildren(X);
            for(var i = 0; i < children.length; i++) {
                if(open.indexOf(children[i]) == -1 && close.indexOf(children[i]) == -1) {
                    open.push(deepCopy(children[i]));
                } 
            }

        close.push(deepCopy(X));
        sort(open);
        
        return false;
    }
}

function solutionIDA(root) {
    
   setState(root);   
   var bound = root.numberOfMistakes;
   
   while(1) {
       var t = search(root, 0, bound);
       if (t == -1) return -1;
       if (t ==  1000) return 1000;
       bound = t;
   }
}

function search(node, g, bound) {
    
    close.push(node);
    var f = g + node.numberOfMistakes;
    
    if (f > bound) 
        return f;
    if (node.numberOfMistakes <= 0) {
        final = deepCopy(node);
        return -1;
    }
    
    var min = 1000;
    setState(node);
    var children = generateChildren(node);
        
    for(var i = 0; i < children.length; i++) {    
        var t = search(children[i], children[i].numberOfSteps, bound);        
        if (t == -1) return -1;        
        close.pop();        
        if (t < min) min = t;        
    }
    return min;
}

function drawField(c, blocks, x, y, scale) {
    
    c.clearRect(x,y, qX * blocks[0].size * scale, qY *blocks[0].size * scale);
    c.strokeRect(0,0,WIDTH,HEIGHT);
    
    for(var i = 0; i < qX * qY; i++) {
        if(blocks[i].visible) blocks[i].draw(c, x, y, scale);
    }
}

function swap(side) {
    //alert("robie swap");
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
        sumTemp = 0;
    }
    
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