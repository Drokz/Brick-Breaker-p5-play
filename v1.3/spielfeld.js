var ball;
var paddle;

var wallTop;
var wallBottom;
var wallLeft;
var wallRight;

var ROWS = 10;
var COLUMNS = 8;

var brickPos;
var whatBrick = [];
var bricks;
var brick_w = 150;
var brick_h = 30;
var brick_m = 10;

var doubleBricks;

var lives = 1;
var gameover = false;

var lvl = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);
    $("#gameover").hide();
    $("#lives").html(lives);

    
    // Paddle creation
    paddle = createSprite(600, 800, 150, 30);
    paddle.immovable = true;
    paddle.setCollider("rectangle", 0, 0, 150, 30);
    paddle.debug = true;

    // Wall creation
    wallTop = createSprite(0, -10, windowWidth * 2, 10);
    wallTop.immovable = true;
    wallBottom = createSprite(0, windowHeight + 10, windowWidth * 2, 10);
    wallBottom.immovable = true;
    wallLeft = createSprite(-10, 0, 10, windowHeight * 2);
    wallLeft.immovable = true;
    wallRight = createSprite(windowWidth + 10, 0, 10, windowHeight * 2);
    wallRight.immovable = true;

    // Brick creation
    bricks = new Group();
    doubleBricks = new Group();

    var offsetX = width/2-(COLUMNS-1)*(brick_m+brick_w)/2;
    var offsetY = 80;

        for(var r = 0; r < ROWS; r++) {
            for(var c = 0; c < COLUMNS; c++) {
                brickPos = r+"-"+c;
                if(brickPos == "0-0" || brickPos == "0-7" || brickPos == "9-0" || brickPos == "9-7") {
                    var doubleBrick = createSprite(offsetX + c * (brick_w + brick_m), offsetY + r * (brick_h + brick_m), brick_w, brick_h);
                    doubleBricks.add(doubleBrick);
                    doubleBrick.immovable = true;
                    doubleBrick.shapeColor = color(150,0,0);
                    doubleBrick.hitOnce = false;
    
                } else {
                    var brick = createSprite(offsetX + c * (brick_w + brick_m), offsetY + r * (brick_h + brick_m), brick_w, brick_h);
                    bricks.add(brick);
                    brick.immovable = true;
                    brick.shapeColor = color(255,255,255);
                }
            }
        }

    // Ball creation
    ball = createSprite(500, 600, 30, 30);
    ball.draw = function() {
        ellipse(0, 0, 30, 30);
    }
    ball.setCollider("circle", 0, 0, 15);
    ball.debug = true;
}

function draw() {
    background(0);

    ball.bounce(wallTop);
    ball.bounce(wallBottom);
    ball.bounce(wallLeft);
    ball.bounce(wallRight);
    ball.bounce(paddle);
    ball.bounce(bricks, brickHit);
    ball.bounce(doubleBricks, doubleBrickHit);

    // Start with Spacebar
    if(keyDown(" ") && gameover === false) {
        if(ball.velocity.x == 0 && ball.velocity.y == 0) {
            ball.setSpeed(random(4, 8), random(0, 360));
        }
    }

    // Paddle control
    if(keyDown(RIGHT_ARROW)) {
        paddle.setSpeed(5, 0);
        if(paddle.collide(wallRight)) {
            paddle.setSpeed(0, 0);
        }
    } else if(keyDown(LEFT_ARROW)) {
        paddle.setSpeed(5, 180);
        if(paddle.collide(wallLeft)) {
            paddle.setSpeed(0, 0);
        }
    } else {
        paddle.setSpeed(0, 0);
    }

    // Death
    if(ball.position.y > 950) {
        ballLoss();
    }

    drawSprites();
}

// Normal brick remove
function brickHit(ball, brick) {
    brick.remove();
}

// doublebrick recolor and remove
function doubleBrickHit(ball, doubleBrick) {
    if(doubleBrick.hitOnce === false) {
        doubleBrick.shapeColor = color(255,255,255);
        doubleBrick.hitOnce = true;
        //console.log("hit");
    } else if(doubleBrick.hitOnce === true) {
        doubleBrick.remove();
        //console.log("hit");
    }
}

// Ball Loss function
function ballLoss() {
    if(lives > 0) {
        lives --;
        $("#lives").html(lives);
        ball.setSpeed(0, 0, 0);
        ball.position.x = 500;
        ball.position.y = 600;
    }
    if(lives <= 0) {
        death();
    }
}

function death(brick) {
    $("#gameover").show();
    gameover = true;
    bricks.removeSprites();
    doubleBricks.removeSprites();
}
$(document).ready(function() {
    $("#reset").click(function() {
        $("#gameover").hide();
        gameover = false;
        lives = 10;
        $("#lives").html(lives);
    });
});