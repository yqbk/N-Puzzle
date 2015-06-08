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
    var maxMoves = 0;
    
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
    var mistake = 0;
    var currentState = new State(0, blocks, 0, "none", "none", 0, numberOfMistakes());    
    var startState = currentState;    
    var endState;
    var final;
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
        changes = parseInt(document.getElementById("moves").value);
    }
    
document.getElementById("solution").onclick = function() {
        reset = true;
        mixing = false;
    }
    
document.getElementById("size").onchange = function() {
        qX = parseInt(document.getElementById("size").value);
        qY = parseInt(document.getElementById("size").value);
        //changes = 25;
        endStateValues = [];
        quantity = qX * qY - 1;
        for(var i = 0; i <= quantity; i++) endStateValues.push(i+1); 
        blockWidth = WIDTH/qX;
        blockHeight = HEIGHT/qY;  
        reset = true;
        mixing = false;
    }
    
document.getElementById("solve").onclick = function() {
        mistake = document.getElementById("mistake").value;
        c.clearRect(0, qY * blockHeight, 500, 625);  

        lastmove = "none";       
        currentState = new State(0, blocks, 0, "none", "none", 0, numberOfMistakes());    
        startState = currentState; 
   
        close = [];
        stateId = 0;
        answer = [];    
        done = false;

        invId = getInvisible();
        iterator = 0;
        maxMoves = 0;
        solve = true;
    }

/**
 * Resets, mixes the board and initilizes the proces of finding solution
 * 
 */
function animate() {
    
    if(solve && !animation) {
        c.clearRect(0,0, 500, 625); 
        drawField(c, blocks, 0, 0, 1);
        done = false;
        if(solutionIDA(startState) == -1) {
            //alert("Udało się!!!");
            c.font = "20pt Didact Gothic";
            c.fillText("It is done!", 10, 550);
            done = true;
        } else {
            c.fillText("Cannot Solve...", 10, 550);
            }
            if(done) {
                drawSolution();
                c.font = "12pt Didact Gothic";
                c.fillText("Mix Moves " + changes, 10, 600);
                c.fillText("Fix Moves " + answer.length, 10, 625);
                //c.fillText("" + [answer], 10, 650);
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

        lastmove = "none";       
        currentState = new State(0, blocks, 0, "none", "none", 0, numberOfMistakes());    
        startState = currentState; 

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
            if(sidesIt < 0) animation = false;
        }
    }
}

/**
 * Finds the certain path from mixed to solved system of puzzles basing on previously creates list of individual stages
 * 
 */
function drawSolution() {
    var temp = final;    
    var p = 0;
    
    while(temp.id != 0 && p <= 100) {
        p++;
        for(var j = 0; j < close.length; j++) {
            if(close[j].id == temp.parentId) {
                answer.push(temp.swap);
                temp = close[j];
                break;
            }
        }
    }
}      

/**
 * Class of each piece of the puzzle
 * 
 * @param {Number} x X-coordinate where a piece should be placed
 * @param {Number} y Y-coordinate where a piece should be placed
 * @param {Number} size Length of a side of a piece
 * @param {Number} value Determines the correct order of pieces 
 * @param {Number} index Index of an each piece in the list of pieces
 * @returns {Block}
 */
function Block(x, y, size, value, index) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = value;
    this.visible = true;
    this.index = index;
    
    /**
     * Draws piece
     * 
     * @param {Context} c Context for a canvas
     * @param {Number} x X-coordinate of the offset in regard to the point (0, 0)
     * @param {Number} y Y-coordinate of the offset in regard to the point (0, 0)
     * @param {Number} scale Scale of a piece
     * 
     */
    this.draw = function(c, x, y, scale) {
        c.strokeRect(this.x * scale + x, this.y * scale + y, this.size * scale, this.size * scale);
        c.font = "bold " + 30 * scale + "px Arial";
        c.drawImage(image, ((this.value - 1) % qX) * imageWidth/qX, imageHeight/qX * mathHelp(this.value), imageHeight/qX, imageHeight/qX, x + this.x * scale, y + this.y * scale, this.size * scale, this.size * scale);
        //c.fillText(this.value + "", this.x * scale + x + this.size/2, this.y * scale + y + this.size/2);
    }
    
    /**
     * Draws index of a piece
     * 
     * @param {Context} c Context for a canvas
     */
    this.drawIndex = function(c) {
        c.font = "10px Arial";
        c.fillText(this.value.toString(), this.x + this.size/10, this.y + this.size/2);
    }
    
}

/**
 * Helps to calculate an aspect ratio of an image on each piece
 * 
 * @param {Number} value Determines the correct order of pieces 
 * @returns {Number} Calculated value
 */
function mathHelp(value) {
    var i = 0;
    while(value > i * qX) {
        i++;
    }
    i--;
    return i;
}

/**
 * Class of the board of pieces
 * 
 * @param {Number} id Unique indentifier
 * @param {Array} blocks List of pieces
 * @param {Number} parentId Identifier of the board, which this board derives from
 * @param {String} swap Determines the side, to which last piece was pushed
 * @param {String} lastmove Determines the side, to which last piece was pushed
 * @param {Number} numberOfSteps Defines amount of moves from the beginning to this certian board
 * @param {Number} numberOfMistakes Defines amount of pieces, which are in a wrong order
 * @returns {State}
 */
function State(id, blocks, parentId, swap, lastmove, numberOfSteps, numberOfMistakes) {
    this.id = id;
    this.blocks = blocks;
    this.parentId = parentId;
    this.swap = swap;
    this.lastmove = lastmove;
    this.numberOfSteps = numberOfSteps;
    this.numberOfMistakes = numberOfMistakes;
}

/**
 * Sorts the list of boards depending on a sum of numberOfSteps and numberOfMistakes
 * 
 * @param {Array} states List of boards
 * 
 */
function sort(states) {
    states.sort(function(a,b) { 
        return parseFloat(a.numberOfMistakes + a.numberOfSteps) - parseFloat(b.numberOfMistakes + b.numberOfSteps) 
        });
}

/**
 * Sets a specific board as a current board of pieces
 * 
 * @param {State} state Specific board
 */
function setState(state) {    
    blocks = createNewBlocks(state.blocks);
}

/**
 * Creates a new list of Blocks, the copy of the given argument
 * 
 * @param {Array} blocks Array of pieces, which is being copied
 * @returns {Array|temp} New array of pieces
 */
function createNewBlocks(blocks) {
    temp = [];
    
    for(var i = 0; i < blocks.length; i++) {
        temp.push(new Block(blocks[i].x, blocks[i].y, blocks[i].size, blocks[i].value, blocks[i].index));
        temp[i].visible = blocks[i].visible;
    }
    
    return temp;
}

/**
 * Generates array of board considering all possible moves
 * 
 * @param {State} X Specific board
 * @returns {Array|generateChildren.temp} Array of generated boards
 */
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

/**
 * Checks whether a board has a certain order
 * 
 * @param {State} state Specific board
 * @param {Array} values Array with a certain order of the values
 * @returns {Boolean} True if order is correct, false if not 
 */
function compareState(state, values) {
    
    for(var i = 0; i < state.blocks.length; i++) {
        if(state.blocks[i].value != values[i]) 
            return false;
    }
    
    return true;
}

/**
 * IDA* Algorythm
 * 
 * @param {State} root Initial state of a board
 * @returns {Number} -1 if the solution was found, 1000 if it wasn't
 */
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

/**
 * Analyses the board in order to find the best next move
 * 
 * @param {State} node Current node (board)
 * @param {Number} g The cost to reach current node (board)
 * @param {Number} bound ??????
 * @returns {Number} 
 */
function search(node, g, bound) {
    
    maxMoves++;
    close.push(node);
    var f = g + node.numberOfMistakes;
    if (f > bound) 
        return f;
    if (node.numberOfMistakes <= mistake) {
        final = node;
        return -1;
    }
    if(maxMoves >= 2000000) return 1000;
    
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

/**
 * Draws the board
 * 
 * @param {Context} c Context for a canvas
 * @param {Array} blocks Board to draw
 * @param {type} x X-coordinate of the offset in regard to the point (0, 0)
 * @param {type} y Y-coordinate of the offset in regard to the point (0, 0)
 * @param {type} scale Scale of the pieces
 */
function drawField(c, blocks, x, y, scale) {
    
    c.clearRect(x,y, qX * blocks[0].size * scale, qY *blocks[0].size * scale);
    c.strokeRect(0,0,WIDTH,HEIGHT);
    
    for(var i = 0; i < qX * qY; i++) {
        if(blocks[i].visible) blocks[i].draw(c, x, y, scale);
    }
}

/**
 * Moves the piece to the certain side
 * 
 * @param {String} side Determines where the piece is moved (Up, Down, Left, Right)
 */
function swap(side) {
    var swapA = getInvisible();
    var swapB = 0;
    var change = false;
    
    if(side == "up") {
        swapB = swapA - qX;
        lastmove = "up";
        change = true;
    }
    if(side == "down") {
        swapB = swapA + qX;
        lastmove = "down";
        change = true;
    }
    if(side == "left") {
        swapB = swapA - 1;
        lastmove = "left";
        change = true;
    }
    if(side == "right") {
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

/**
 * Returns an index of the empty piece
 * 
 * @returns {Number} Index of the empty piece
 */
function getInvisible() {
    
    var i = -1;
    
    do {
        i++;
    } while(blocks[i].visible != false);
    
    return i;
}

/**
 * Mixes board into random order
 * 
 * @param {type} blocks Array of pieces
 */
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

/**
 * Returns an index of the piece with the certain value
 * 
 * @param {type} value Given value
 * @returns {Number} Index of the piece
 */
function getValue(value) {
    
    var i = -1;
    
    do {
        i++;
    } while(box[i].value != value);
    
    return i;
}

/**
 * Calculates the number of pieces, which are in a wrong order
 * 
 * @returns {Number} Amout of wrong pieces
 */
function numberOfMistakes() {
    
    var sum = 0;
    
    for(var i = 0; i <= quantity; i++) {
        if(blocks[i].value != endStateValues[i] && blocks[i].visible) sum++;
    }
    
    return sum;
}
