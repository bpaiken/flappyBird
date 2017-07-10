/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var numberOfImagesLoaded = 0;
var backgroundImg = new Image();
var birdImg = new Image();
var groundImg = new Image();
var pipeImg = new Image();
var resetImg = new Image();
var shareImg = new Image();
var logoImg = new Image();

var stage = void 0,
    bird = void 0,
    ground = void 0,
    background = void 0,
    pipes = void 0,
    newPipes = void 0,
    scoreText = void 0;
var reset = void 0,
    share = void 0,
    startText = void 0,
    logo = void 0,
    instructions = void 0;
var pipe1 = void 0,
    pipe2 = void 0,
    pipe3 = void 0,
    pipe4 = void 0,
    pipe5 = void 0,
    pipe6 = void 0;

var w = 768;
var h = 1024;
var flap = 0;
var birdRotation = 0;
var pipeGap = 230;
var pipeDelay = 120;
var collision = false;
var birdWidth = 40;
var birdHeight = 32;
var alive = true;
var gameStarted = false;
var score = 0;
var centerX = w / 2 - 92 / 2;
var centerY = 412;
var ticker = createjs.Ticker;
ticker.setFPS(60);

function init() {
  backgroundImg.onload = onImageLoaded;
  backgroundImg.src = 'assets/images/background.png';

  groundImg.onload = onImageLoaded;
  groundImg.src = 'assets/images/ground.png';

  pipeImg.onload = onImageLoaded;
  pipeImg.src = 'assets/images/pipe.png';

  birdImg.onload = onImageLoaded;
  birdImg.src = 'assets/images/bird.png';

  resetImg.onload = onImageLoaded;
  resetImg.src = 'assets/images/reset.png';

  shareImg.onload = onImageLoaded;
  shareImg.src = 'assets/images/share.png';

  logoImg.onload = onImageLoaded;
  logoImg.src = 'assets/images/logo.png';
}

function onImageLoaded(e) {
  numberOfImagesLoaded++;

  if (numberOfImagesLoaded === 7) {
    numberOfImagesLoaded = 0;
    startGame();
  }
}

function buildStage() {
  stage = new createjs.Stage('myCanvas');
}

function buildBackground() {
  background = new createjs.Shape();
  background.graphics.beginBitmapFill(backgroundImg).drawRect(0, 0, w + backgroundImg.width, backgroundImg.height);
}

function buildGround() {
  ground = new createjs.Shape();
  ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
  ground.y = h - groundImg.height;
}

function buildBird() {
  var birdSheet = new createjs.SpriteSheet({
    "images": [birdImg],
    "frames": { "regX": 0, "height": 64, "count": 3, "regY": 0, "width": 92 },
    "animations": {
      "fly": [0, 2, "fly", .2],
      "dead": [1, 1, "dead"]
    }
  });
  bird = new createjs.Sprite(birdSheet, 'fly');
  bird.name = "bird";
  placeBird();
}

function placeBird() {
  bird.setTransform(centerX, centerY, 1, 1);
  bird.regX = 46;
  bird.regY = 32;
}

function buildLogo() {
  logo = new createjs.Shape();
  logo.graphics.beginBitmapFill(logoImg).drawRect(0, 0, logoImg.width, logoImg.height - 2);
  logo.scaleX = 0.5;
  logo.scaleY = 0.5;
  logo.x = 120;
  logo.y = 50;
}

function buildReset() {
  reset = new createjs.Shape();
  reset.graphics.beginBitmapFill(resetImg).drawRect(0, 0, resetImg.width, resetImg.height);
  reset.scaleY = 0.75;
  reset.scaleX = 0.75;
  reset.x = w / 2 - resetImg.width / 2 * .75;
  reset.y = h / 2 - resetImg.height / 2 * .75;
  reset.addEventListener('click', restart);

  var hit = new createjs.Shape();
  hit.graphics.beginFill("#000").drawRect(0, 0, resetImg.width, resetImg.width);
  hit.scaleX = 0.75;
  hit.scaleY = 0.75;
  reset.hitArea = hit;
}

function buildShare() {
  share = new createjs.Shape();
  share.graphics.beginBitmapFill(shareImg).drawRect(0, 0, shareImg.width, shareImg.height);
  share.scaleY = 0.75;
  share.scaleX = 0.75;
  share.x = w / 2 - shareImg.width / 2 * .75;
  share.y = h / 2 - shareImg.height / 2 * .75 + 100;
  share.addEventListener('click', twitterShare);

  var hit = new createjs.Shape();
  hit.graphics.beginFill("#000").drawRect(0, 0, shareImg.width, shareImg.width);
  hit.scaleX = 0.75;
  hit.scaleY = 0.75;
  share.hitArea = hit;
}

function buildPipes() {
  var pipeArr = renderPipes();
  pipes = new createjs.Container();
  pipeArr.forEach(function (pipe) {
    return pipes.addChild(pipe);
  });
}

function buildScore() {
  scoreText = new createjs.Text("0", "bold 56px 'Press Start 2P'", "#a0522d");
  scoreText.x = centerX;
  scoreText.y = 100;
}

function buildStart() {
  startText = new createjs.Text("Press Space to Flap", "62px 'VT323'", "#a0522d");
  startText.x = 130;
  startText.y = 500;
  instructions = new createjs.Text("Avoid Pipes", "62px 'VT323'", "	#a0522d");
  instructions.x = 230;
  instructions.y = 575;
}

function setStage() {
  stage.addChild(background);
  stage.addChild(pipes, bird, ground);
  stage.addChild(scoreText, logo, startText, logo, instructions);
  stage.update();
}

function doFlap() {
  flap = 31;
}

document.onkeydown = handleKeyDown;
function handleKeyDown(e) {
  if (e.keyCode === 38 || e.keyCode === 32) {
    if (gameStarted === false) {
      gameStarted = true;
      stage.removeChild(startText, instructions, logo);
    }
    createjs.Tween.removeTweens(bird);
    doFlap();
  }
}

function startGame() {
  if (!stage) buildStage();
  if (!background) buildBackground();
  if (!ground) buildGround();
  if (!bird) buildBird();
  if (!reset) buildReset();
  if (!share) buildShare();
  if (!pipes) buildPipes();
  if (!startText) buildStart();
  if (!logo) buildLogo();
  if (!scoreText) buildScore();
  scoreText.text = "0";
  score = 0;

  var flyDelta = 20;
  createjs.Tween.get(bird, { loop: true }).to({ y: centerY + flyDelta }, 380, createjs.Ease.sineInOut).to({ y: centerY }, 380, createjs.Ease.sineInOut);

  setStage();
}

ticker.addEventListener('tick', function (event) {
  if (alive && gameStarted) {

    ground.x -= 4;
    if (ground.x <= groundImg.width * -1) {
      ground.x = 0;
    }

    bird.y += 10;
    bird.y -= flap;
    if (flap > 0) {
      flap = flap * .9;
    }

    pipes.children.forEach(function (pipe) {
      pipe.x -= 4;
    });

    for (var i = 0; i < pipes.children.length; i++) {
      if (i % 2 === 1) continue;
      if (pipes.children[i].x <= -pipeImg.width) {
        randomGap(pipes.children[i], pipes.children[i + 1]);
        pipes.children[i].x = w + 300;
        pipes.children[i + 1].x = w + 300;
      }
    }

    for (var j = 0; j < pipes.children.length; j++) {
      if (j % 2 === 0 && pipes.children[j].x + pipeImg.width < centerX - birdWidth && pipes.children[j].x + pipeImg.width > centerX - 5 - birdWidth) {
        score += 1;
        scoreText.text = score.toString();
      }
    }

    for (var _i = 0; _i < pipes.children.length; _i++) {
      if (_i % 2 === 0) {
        collision = checkLowerCollision(bird, pipes.children[_i]);
      } else {
        collision = checkTopCollision(bird, pipes.children[_i]);
      }
      if (collision) {
        die(bird, stage);
      }
    }

    if (checkGroundCollision(bird, ground)) {
      die(bird, stage);
    }
  } else if (gameStarted && !alive) {
    bird.rotation = 90;
    if (bird.y + birdWidth < backgroundImg.height) {
      bird.y += 10;
    }
  } else if (alive && !gameStarted) {
    ground.x -= 4;
    if (ground.x <= groundImg.width * -1) {
      ground.x = 0;
    }
  }

  stage.update(event);
});

function restart() {
  stage.removeAllChildren();
  createjs.Tween.removeTweens(bird);
  bird.gotoAndStop('dead');
  bird.gotoAndPlay('fly');
  alive = true;
  gameStarted = false;
  placeBird();
  buildPipes();
  startGame();
}

function twitterShare() {
  window.open('https://twitter.com/share?url=https%3A%2F%2Fbpaiken.github.io%2FflappyBird%2F&text=I scored ' + score + ' on Flappy Bird!.');
}

function randomGap(pipe1, pipe2) {
  var h = Math.random() * 400;
  pipe1.y = ground.y - groundImg.height - h;
  pipe2.y = pipe1.y - pipeGap - h / 100;
}

function renderPipes() {
  pipe1 = new createjs.Bitmap(pipeImg);
  pipe1.x = w + 300;

  pipe2 = new createjs.Bitmap(pipeImg);
  pipe2.x = w + 300;
  pipe2.scaleY = -1;
  randomGap(pipe1, pipe2);

  pipe3 = new createjs.Bitmap(pipeImg);
  pipe3.x = w + 684;

  pipe4 = new createjs.Bitmap(pipeImg);
  pipe4.x = w + 684;
  pipe4.scaleY = -1;
  randomGap(pipe3, pipe4);

  pipe5 = new createjs.Bitmap(pipeImg);
  pipe5.x = w + 1068;

  pipe6 = new createjs.Bitmap(pipeImg);
  pipe6.x = w + 1068;
  pipe6.scaleY = -1;
  randomGap(pipe5, pipe6);

  return [pipe1, pipe2, pipe3, pipe4, pipe5, pipe6];
}

function checkTopCollision(bird, pipe) {
  if (bird.y - birdHeight < pipe.y && bird.x + birdWidth > pipe.x && bird.x < pipe.x + pipe.image.width) return true;
  return false;
}

function checkLowerCollision(bird, pipe) {
  if (bird.y + birdHeight > pipe.y && bird.x + birdWidth > pipe.x && bird.x < pipe.x + pipe.image.width) return true;
  return false;
}

function checkGroundCollision(bird, ground) {
  if (bird.y + birdHeight >= ground.y) return true;
  return false;
}

function die(bird, stage) {
  if (alive === true) {
    alive = false;
    createjs.Tween.removeTweens(bird);
    bird.gotoAndStop('fly');
    bird.gotoAndPlay('dead');
    stage.addChild(reset, share);
    stage.update();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  init();
});

/***/ })
/******/ ]);
//# sourceMappingURL=flappyBird.js.map