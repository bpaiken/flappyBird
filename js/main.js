import * as createjs from 'createjs-module';
let numberOfImagesLoaded = 0;
let backgroundImg = new Image();
let birdImg = new Image();
let groundImg = new Image();
let pipeImg = new Image();

let stage, bird, ground, background, pipe, pipe2, pipes;

let w = 768;
let h = 1024;
let flap = 0;
let birdRotation = 0;
let pipeGap = 240;



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

  pipe = new createjs.Bitmap(pipeImg);
  pipe.x = w - 300;
  pipe.y = ground.y - groundImg.height;

  pipe2 = new createjs.Bitmap(pipeImg);
  pipe2.x = w - 300;
  pipe2.y = pipe.y - pipeGap;
  // pipe2.rotation = 180
  // pipe2.regX = pipeImg.width / 2;
  // pipe2.regY = pipeImg.height / 2;
  pipe2.scaleY = -1;

  pipes = new createjs.Container();
  pipes.addChild(pipe);
  pipes.addChild(pipe2);
 
 
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
    
    
    ground.x -= 2;
    if (ground.x <= groundImg.width * -1) {
      ground.x = 0
    }

    bird.y += 10
    bird.y -= flap
    if (flap > 0) {
      flap = flap * .9;
    }

    // current background image is does not repeat well
    //  background.x -= 1;
    // if (background.x <= backgroundImg.width * -1) {
    //   background.x = 0
    // }



    stage.update(event);
  })
}



document.addEventListener('DOMContentLoaded',() => {
  init()
})



// // one sprite 
//   initial animation
//   jump animations 
//   death animation