import * as createjs from 'createjs-module';
let numberOfImagesLoaded = 0;
let backgroundImg = new Image();
let birdImg = new Image();
let groundImg = new Image();
let pipeImg = new Image();
let resetImg = new Image();

let stage, bird, ground, background, pipes, newPipes, scoreText;
let reset;
let pipe1, pipe2, pipe3, pipe4, pipe5, pipe6;

let w = 768;
let h = 1024;
let flap = 0;
let birdRotation = 0;
let pipeGap = 260;
let pipeDelay = 120;
let collision = false;
let birdWidth = 40
let birdHeight = 32
let alive = true;
let score = 0

window.pipes = pipes
window.bird = bird



function init() {
  backgroundImg.onload = onImageLoaded;
  backgroundImg.src = 'assets/images/background.png';

  groundImg.onload = onImageLoaded;
  groundImg.src = 'assets/images/ground.png';

  pipeImg.onload = onImageLoaded;
  pipeImg.src = 'assets/images/pipe.png'

  birdImg.onload = onImageLoaded;
  birdImg.src = 'assets/images/bird.png';

  resetImg.onload = onImageLoaded
  resetImg.src = 'assets/images/reset.png'
}


function onImageLoaded(e) {
  numberOfImagesLoaded++;

  if (numberOfImagesLoaded === 5) {
    numberOfImagesLoaded = 0
    startGame();
  }
}

function startGame() {
  let stage = new createjs.Stage('myCanvas');

  background = new createjs.Shape();
  background.graphics.beginBitmapFill(backgroundImg).drawRect(0, 0, w + backgroundImg.width, backgroundImg.height)
  

  ground = new createjs.Shape();
  ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height)
  ground.y = h-groundImg.height;
 
  let birdSheet = new createjs.SpriteSheet({
    "images": [birdImg],
    "frames": {"regX": 0, "height": 64, "count": 3, "regY": 0, "width": 92},
    "animations": {
      "fly": [0, 2, "fly", .2],
      "dead": [1, 1, "dead" ],
    },
  });

  let bird = new createjs.Sprite(birdSheet, 'fly');
  bird.name = "bird";

  let centerX = w/2 - 92/2
  let centerY = 412
  let flyDelta = 20;

  bird.setTransform(centerX, centerY, 1, 1);

  // tween for initial hover
  createjs.Tween.get(bird, {loop:true})
  .to({y:centerY + flyDelta}, 380, createjs.Ease.sineInOut)
  .to({y:centerY}, 380, createjs.Ease.sineInOut);

  bird.regX = 46;
  bird.regY = 32;

  reset = new createjs.Shape();
  reset.graphics.beginBitmapFill(resetImg).drawRect(0, 0, resetImg.width, resetImg.height);
  reset.scaleY = 0.75
  reset.scaleX = 0.75
  reset.x = (w / 2) - (resetImg.width / 2 * .75)
  reset.y = (h / 2) - (resetImg.height / 2 * .75)
  reset.addEventListener('click', restart.bind(null, stage, bird))

  var hit = new createjs.Shape();
  hit.graphics.beginFill("#000").drawRect(0, 0, resetImg.width, resetImg.width)
  hit.scaleX = 0.75
  hit.scaleY = 0.75
  reset.hitArea = hit


  let pipeArr = renderPipes()
  pipes = new createjs.Container();
  pipeArr.forEach(pipe => pipes.addChild(pipe));

  stage.addChild(background)
  stage.addChild(pipes, bird, ground);
 
  scoreText = new createjs.Text("0", "bold 56px 'Press Start 2P'", "#DAA520");
  scoreText.x = centerX
  scoreText.y = 100

  stage.addChild(scoreText);
  stage.update();

  function doFlap() {
    flap = 36;
  }
  
  document.onkeydown = handleKeyDown;
  function handleKeyDown(e) {
  createjs.Tween.removeTweens(bird)
  doFlap();
}

  const ticker = createjs.Ticker
  ticker.setFPS(60); 
  ticker.addEventListener('tick', (event) => {
    
  if (alive) {

    ground.x -= 3;
    if (ground.x <= groundImg.width * -1) {
      ground.x = 0
    }


    bird.y += 10
    bird.y -= flap
    if (flap > 0) {
      flap = flap * .9;
    }

    pipes.children.forEach(pipe => {
      pipe.x -= 3;
    })

    for (let i = 0; i < pipes.children.length; i++) {
      if (i % 2 === 1) continue;
      if (pipes.children[i].x === -pipeImg.width) {
        randomGap(pipes.children[i], pipes.children[i+1]);
        pipes.children[i].x = w + 300;
        pipes.children[i+1].x = w + 300;
      }
      
    }

    for (let j = 0; j < pipes.children.length; j++) {
      if (j % 2 === 0 && pipes.children[j].x < centerX && pipes.children[j].x > centerX - 5) {
        score += 1
        scoreText.text = score.toString();
      }
    }

    for (let i = 0; i < pipes.children.length; i++) {
        if (i % 2 === 0) {
          collision = checkLowerCollision(bird, pipes.children[i])
        }
        else {
          collision = checkTopCollision(bird, pipes.children[i])
        } 
        if (collision) {
          die(bird, stage);
        }   
    }

    if (checkGroundCollision(bird,ground)) {
       die(bird, stage);
    } 

  } else {
    bird.rotation = 90;
    if (bird.y + birdWidth < backgroundImg.height) {
        bird.y += 10;
    }
  }


    stage.update(event);
  })

}

function restart(stage, bird) {
  stage.removeAllChildren();
  createjs.Tween.removeTweens(bird)
    bird.gotoAndStop('dead')
    bird.gotoAndPlay('fly')
  init();
}

function renderPipes() {
  pipe1 = new createjs.Bitmap(pipeImg);
  pipe1.x = w + 300;
  pipe1.y = ground.y - groundImg.height
    
  pipe2 = new createjs.Bitmap(pipeImg);
  pipe2.x = w + 300;
  pipe2.y = pipe1.y - pipeGap
  pipe2.scaleY = -1;

  pipe3 = new createjs.Bitmap(pipeImg);
  pipe3.x = w + 684;
  pipe3.y = ground.y - groundImg.height;

  pipe4 = new createjs.Bitmap(pipeImg);
  pipe4.x = w + 684;
  pipe4.y = pipe3.y - pipeGap;
  pipe4.scaleY = -1;

  pipe5 = new createjs.Bitmap(pipeImg);
  pipe5.x = w + 1068;
  pipe5.y = ground.y - groundImg.height;

  pipe6 = new createjs.Bitmap(pipeImg);
  pipe6.x = w + 1068;
  pipe6.y = pipe5.y - pipeGap;
  pipe6.scaleY = -1;

  return [pipe1, pipe2, pipe3, pipe4, pipe5, pipe6]
}

function randomGap(pipe1, pipe2) {
  let h = Math.random() * 400;
  pipe1.y = ground.y - groundImg.height - h;
  pipe2.y = pipe1.y - pipeGap - (h/100);
}

function checkTopCollision(bird, pipe) {
  if (
      bird.y - birdHeight < pipe.y &&
      bird.x + birdWidth > pipe.x &&
      bird.x < pipe.x + pipe.image.width
    ) return true;
  return false;
}

function checkLowerCollision(bird, pipe) {
  if (
      bird.y + birdHeight > pipe.y &&
      bird.x + birdWidth > pipe.x &&
      bird.x < pipe.x + pipe.image.width
    ) return true;
  return false;
}

function checkGroundCollision(bird, ground) {
  if (bird.y + birdHeight >= ground.y) return true;
  return false;
}

function die(bird,stage) {
  if (alive === true) {
    alive = false
    createjs.Tween.removeTweens(bird)
    bird.gotoAndStop('fly')
    bird.gotoAndPlay('dead')
    stage.addChild(reset);
    stage.update();
  }
}










document.addEventListener('DOMContentLoaded',() => {
  init()
})





// x -------->
// y
// |
// |
// |
// | 
// v
//
