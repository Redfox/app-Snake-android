var canvas, ctx, width, height, fps, tileSize, playing, loose, score;
var snake;

var keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    restart: 82
}

window.addEventListener("resize", resizeWindow);
window.addEventListener("keydown", keyDown);

function keyDown(e)
{
    if(!playing && (e.keyCode == keys.up || e.keyCode == keys.right || e.keyCode == keys.down || e.keyCode == keys.left)) 
    {
        playing = true;
        //document.getElementById("text").textContent = "";
    }

    switch (e.keyCode)
    {
        case keys.left:
            snake.direction = [-1, 0];
            break;
        case keys.up:
            snake.direction = [0, -1];
            break;
        case keys.right:
            snake.direction = [1, 0];
            break;
        case keys.down:
            snake.direction = [0, 1];
            break;
    }

    if(loose && e.keyCode == keys.restart)
    {
        newGame();
        //document.getElementById("score").textContent = score;
       //document.getElementById("text").textContent = "Pressione uma direcional para comecar";
    }
}
function init()
{
    canvas = document.createElement("canvas");
    resizeWindow();
    document.body.appendChild(canvas);
    document.querySelector("canvas").id = "canvas";
    ctx = canvas.getContext("2d");

    fps = 15;
    
    newGame();
    run();
}

function newGame()
{
    snake = new Snake();
    dot = new Dot();
    
    playing = false;
    loose = false;
    score = 0;
}

function resizeWindow()
{
    width = window.innerWidth;
    height = window.innerHeight/2;

    canvas.width = width;
    canvas.height = height;
    
    tileSize = Math.max(Math.floor(width / 60), Math.floor(height / 60));
}

function Snake()
{
    this.body = [[10, 10], [10, 11], [10, 12]];
    this.color = "#fff";
    this.direction = [0, -1];

    this.update = function()
    {
        var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];

        if(!playing)
        {
            if(this.direction[1] == -1 && nextPos[1] <= (height * 0.1 /  tileSize))
                this.direction = [1, 0];

            else if(this.direction[0] == 1 && nextPos[0] >= (width * 0.9 /  tileSize))
                this.direction = [0, 1];

            else if(this.direction[1] == 1 && nextPos[1] >= (height * 0.9 /  tileSize))
                this.direction = [-1, 0];

            else if(this.direction[0] == -1 && nextPos[0] <= (width * 0.1 /  tileSize))
                this.direction = [0, -1];
        }

        if(nextPos[0] == this.body[1][0] && nextPos[1] == this.body[1][1])
        {
            this.body.reverse();
            nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]]
        }

        this.body.pop();
        this.body.splice(0, 0, nextPos);

        //loose
        if(nextPos[0] <= -1)
            gameOver();
        else if(nextPos[0] >= Math.round(canvas.width/tileSize))
            gameOver();
        else if(nextPos[1] <= -1)
            gameOver();
        else if(nextPos[1] >= Math.round(canvas.height/tileSize))
            gameOver();

        //eatin
        if(snake.body[0][0] == dot.body[0] && snake.body[0][1] == dot.body[1])
        {
            dot.catch();
            this.grow();
        }

        //if hit ourself
        for(var i = 1; i < this.body.length; i++)
        {
            //console.log(this.body[0] + " - " + this.body[i]);
            if(this.body[0][0] == this.body[i][0] && this.body[0][1] == this.body[i][1])
            {
                gameOver();
            }
        }
    }

    this.draw = function()
    {
        ctx.fillStyle = this.color;
        for(var i = 0; i < this.body.length; i++)
        {
            ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
        }
    }

    this.grow = function()
    {
        this.body.push([]);
    }
}


function Dot()
{
    this.body = [Math.floor(Math.random() * Math.round(canvas.width/tileSize)), Math.floor(Math.random() * Math.round(canvas.height/tileSize))];
    this.color = "#ee0000";
    
    this.draw = function()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.body[0] * tileSize, this.body[1] * tileSize, tileSize, tileSize);
    }

    this.catch = function()
    {
        this.body = [Math.floor(Math.random() * Math.round(canvas.width/tileSize)), Math.floor(Math.random() * Math.round(canvas.height/tileSize))];
        console.log(this.body);
        score++;
        //document.getElementById("score").textContent = score;
    }
}

function gameOver()
{
    loose = true;
    //document.getElementById("text").textContent = "Game Over! Press 'R' to restart.";
}

function update() 
{
    if(!loose)
        snake.update();
}

function draw() 
{
    ctx.clearRect(0, 0, width, height);

    snake.draw();
    dot.draw();
}

function run() 
{
    update();
    draw();

    setTimeout(run, 1000 / fps);
}

var ts_x;
var ts_y;
document.addEventListener('touchstart', function(e) {
   e.preventDefault();
   var touch = e.changedTouches[0];
   ts_x = touch.pageX;
   ts_y = touch.pageY;
   if(!playing)
    playing = true;
}, false);

document.addEventListener('touchmove', function(e) {
   e.preventDefault();
   var touch = e.changedTouches[0];
   td_x = touch.pageX - ts_x; // deslocamento na horizontal
   td_y = touch.pageY - ts_y; // deslocamento na vertical
   // O movimento principal foi vertical ou horizontal?
   if( Math.abs( td_x ) > Math.abs( td_y ) ) {
      // é horizontal
      if( td_x < 0 ) {
         snake.direction = [-1, 0];
      } else {
        snake.direction = [1, 0];
      }
   } else {
      // é vertical
      if( td_y < 0 ) {
         snake.direction = [0, -1];
      } else {
         snake.direction = [0, 1];
      }
   }
}, false);