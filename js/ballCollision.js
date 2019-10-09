
var DIRECTION = [-5,-4,-3,3,4,5];
var MAXSPEED = 3;
var MAXWIDTH = 1200 - 50;
var MAXHEIGHT = 800 - 50;
var WIDTHS = [40,60,80];
var MASS = [30,40,50];
var BOXCOLOR = ['green','orange','pink'];

function getRandomNumber(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) ) + min;
}

class Box {
    constructor(parentElement){
        this.parentElement = parentElement;
        this.boxElement = null;
        this.x = null;
        this.y = null;
        this.diameter = null;
        this.backgroundColor = null;
        this.dx = 0;
        this.dy = 0;
        this.MASS = null;
    }

    setSize(d){
        this.diameter = d;
    }

    setMass(index){
        this.MASS = MASS[index];
    }

    setPosition(x,y){
        this.x = x;
        this.y = y;
    }

    setDirection(dx,dy){
        this.dx = dx;
        this.dy = dy;
    }

    setColor(color){
        this.backgroundColor = color;
    }

    reverseXDirection(){
        this.dx*=-1;
    }

    reverseYDirection(){
        this.dy*=-1;
    }

    changeBoxVelocity(box){
        var change = this.dx * (this.diameter/box.diameter);
        this.dx = box.dx * (box.diameter/this.diameter);
        box.dx = change;

        change = this.dy * (this.diameter / box.diameter);
        this.dy = box.dy * (box.diameter / this.diameter);
        box.dy = change;

        this.move();
        box.move();
    }

    checkWallCollisionX(){
        if((this.x + (2.3 * this.diameter)) >= MAXWIDTH || (this.x <= 0)){
            return true;
        }
        else{
            return false;
        }
    }

    checkWallCollisionY(){
        if(((this.y + (2.3 *this.diameter)) >= MAXHEIGHT) || ((this.y - this.diameter) <= 0)){
            return true;
        }
        else{
            return false;
        }
    }

    move(){
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
        this.draw();
    }

    create(){
        this.boxElement = document.createElement('div');
        this.boxElement.classList.add('box-style');
        this.parentElement.appendChild(this.boxElement);
    }

    draw(){
        this.boxElement.style.left = this.x + 'px';
        this.boxElement.style.top = this.y + 'px';
        this.boxElement.style.width = this.diameter + 'px';
        this.boxElement.style.height = this.diameter + 'px';
        this.boxElement.style.backgroundColor = this.backgroundColor;
    }
}

class Game{
    constructor(boxCount,parentElementID,BOXCOLOR,FPS){
        this.MAXHEIGHT = 500;
        this.MAXWIDTH = 500;
        this.boxCount = boxCount;
        this.ANIMATIONFRAME = FPS;
        this.BOXCOLOR = BOXCOLOR;
        this.parentElement = document.getElementById(parentElementID);
        this.boxes = [];
        this.createBoxes();
    }

    createBoxes(){
        for(var i = 0;i<this.boxCount;i++){
            var box= new Box(this.parentElement);
            var boxSize = getRandomNumber(30,51);
            
            var x = getRandomNumber(0,this.MAXWIDTH - boxSize);
            var y = getRandomNumber(0, this.MAXHEIGHT - boxSize);
            
            var rand1 = getRandomNumber(2 ,5);
            var rand2 = getRandomNumber(2 ,5);

            var colorIndex = getRandomNumber(0,this.BOXCOLOR.length);

        
            box.setPosition(x,y);
            box.setSize(boxSize);
            box.setDirection(rand1, rand2);
            box.setColor(this.BOXCOLOR[colorIndex]);
            box.setMass(colorIndex);
            box.create();
            box.draw();
            this.boxes.push(box);
        }
    }

    detectboxCollision(box1, box2){
        var sumOfRadius = (box1.diameter/2 + box2.diameter/2);
        var x1 = box1.x + (box1.diameter/2);
        var x2 = box2.x + (box2.diameter/2);
        var y1 = box1.y + (box1.diameter/2);
        var y2 = box2.y + (box2.diameter/2);

        var distance =  Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);

        if (distance <= (Math.pow(sumOfRadius,2))){
            console.log('true');
            return true;
        }
        else{
            return false;
        }
    }

    detectAllCollision(){
        for(var j = 0; j < (this.boxes.length); j++){
            for(var k = 0; k < (this.boxes.length); k++){
                if(j != k){
                    if(this.detectboxCollision(this.boxes[j],this.boxes[k])){
                        this.boxes[j].changeBoxVelocity(this.boxes[k]);
                    }
                }
            }
        }
    }

    moveBoxes(){
        var that = this;
        
        var interval = setInterval(function(){
            for(var i = 0;i<that.boxCount;i++){
                if(that.boxes[i].checkWallCollisionX()){
                    that.boxes[i].reverseXDirection();
                    // that.boxes[i].reverseYDirection();
                }
                if(that.boxes[i].checkWallCollisionY()){
                    that.boxes[i].reverseYDirection();
                }
                if(that.boxes[i].x)
                that.boxes[i].move();
            }
            that.detectAllCollision();
        },1000/this.ANIMATIONFRAME)
    }
}

game = new Game(50,'box1',BOXCOLOR,50);
game.moveBoxes();


