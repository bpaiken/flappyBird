import * as createjs from 'createjs-module';
let numberOfImagesLoaded = 0;
let backgroundImg = new Image();
let birdImg = new Image();
let groundImg = new Image();
let pipeImg = new Image();

let stage, bird, ground, background, pipes, newPipes;
let pipe1, pipe2, pipe3, pipe4, pipe5, pipe6;

let w = 768;
let h = 1024;
let flap = 0;
let birdRotation = 0;
let pipeGap = 240;
let pipeDelay = 120;
let collision = false;
let birdWidth = 92
let birdHeight = 64



function init() {
  backgroundImg.onload = onImageLoaded;
  backgroundImg.src = 'assets/images/background.png';

  groundImg.onload = onImageLoaded;
  groundImg.src = 'assets/images/ground.png';

  pipeImg.onload = onImageLoaded;
  pipeImg.src = 'assets/images/pipe.png'

  birdImg.onload = onImageLoaded;
  birdImg.src = 'assets/images/bird.png';
}


function onImageLoaded(e) {
  numberOfImagesLoaded++;

  if (numberOfImagesLoaded === 4) {
    numberOfImagesLoaded = 0
    startGame();
  }
}

function startGame() {
  let stage = new createjs.Stage('myCanvas');

  // let backgroundBit = new createjs.Bitmap(background);

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
    },
  });

  


 
  let bird = new createjs.Sprite(birdSheet, 'fly');
  bird.name = "bird";
  // bird.regX = 46;
  // bird.regY = 32;

  let centerX = w/2 - 92/2
  let centerY = 412
  let flyDelta = 20;

  bird.setTransform(centerX, centerY, 1, 1);

  //tween for initial hover
  createjs.Tween.get(bird, {loop:true})
  .to({y:centerY + flyDelta}, 380, createjs.Ease.sineInOut)
  .to({y:centerY}, 380, createjs.Ease.sineInOut);

  let pipeArr = renderPipes()
  pipes = new createjs.Container();
  pipeArr.forEach(pipe => pipes.addChild(pipe));

  stage.addChild(background);
  stage.addChild(bird, pipes, ground);
 

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

    // current background image is does not repeat well
    //  background.x -= 1;
    // if (background.x <= backgroundImg.width * -1) {
    //   background.x = 0
    // }

    for (var i = 0; i < pipes.children.length; i++) {
        // collision = ndgmr.checkPixelCollision(bird, pipes,1,true)
        // collision = bird.hitTest(pipes.children[0])
        // collision = checkCollision(bird, pipes.children[i])
        if (collision) {
          console.log('collision!')
        }
    }

    // if (ndgmr.checkPixelCollision(bird, pipe1)) {
    //   console.log('collision')
    // }

    stage.update(event);
  })

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

function checkCollision(sprite, pipe) {
  if (
      sprite.x < pipe.x + pipe.image.width &&
      sprite.x + birdWidth > pipe.x &&
      sprite.y < pipe.y + pipe.image.height &&
      sprite.y + birdHeight > pipe.y
    ) return true;
  return false;
}

document.addEventListener('DOMContentLoaded',() => {
  init()
})
