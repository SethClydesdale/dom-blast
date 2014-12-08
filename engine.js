    devNotes = '';
	gameStarted = false;
	gamePaused = false;
	confirmBox = false;
	shipColor = '#008800';
	shieldColor = '#0088FF';
	
	
    // element constructor
    // use 'none' as an argument to skip an attribute
    function create(tag, id, classN) {
      if (tag === undefined) return console.error('createError : You must pass along at least one argument(tagname) to initialize');

      if (id === undefined || id == 'none') id = '';
      if (classN === undefined || classN == 'none') classN = '';

      var el = document.createElement(tag)
      el.id = id;
      el.className = classN;

      if (el.id == '') el.removeAttribute('id');
      if (el.className == '') el.removeAttribute('class');

      return el;
    }


    // quickly prepend an element to the body
    function bodyPrepend(object) {
      if (typeof object != 'object') return console.error('bodyPrependError : Argument must be an object to prepend to the document body');
      return document.body.insertBefore(object,document.body.childNodes[0])
    }


    // quickly append an element to the body
    function bodyAppend(object) {
      if (typeof object != 'object') return console.error('bodyAppendError : Argument must be an object to append to the document body');
      return document.body.appendChild(object);
    }

    // quickly remove an element from the body
    function bodyRemove(object) {
      if (typeof object != 'object') return console.error('bodyRemoveError : Argument must be an object to remove the element from body');
      return document.body.removeChild(object)
    }

    // round a value to the nearest 5
    // credits to http://www.hashbangcode.com/blog/javascript-round-nearest-5 for this ;-)
    function r5(x) { return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5 };
	  
	 

	// pauseable delay
    function Delay(cb, delay) {
      var tid, start, remain = delay;
	  
      this.pause = function() {
        window.clearTimeout(tid);
        remain -= new Date() - start;
      };
	  
      this.resume = function() {
        start = new Date();
        tid = window.setTimeout(cb, remain);
      };
	  
	  this.kill = function() {
	    window.clearTimeout(tid);
	    tid, start, remain = null;
	  };
	  
      this.resume();
    }
	  
	  
	// fade elements in and out with ease
	function fade(element, method, duration, callback, cbDelay) {
	  if (method == 'in') {
		var fadeIn = window.setInterval(function() {
		  if (gamePaused === true) return;
		  if (element.style.opacity == 1) {
			if (callback === true) CB_fadeOut = new Delay(function() { fade(element, 'out', duration, false) },cbDelay);
			return window.clearInterval(fadeIn);
	      }
		  element.style.opacity = Number(element.style.opacity) + 0.1;
		},duration);
	  }
		
	  if (method == 'out') {
		var fadeOut = window.setInterval(function() {
		  if (gamePaused === true) return;
		  if (element.style.opacity == 0) {
			if (callback === true) CB_fadeIn = new Delay(function() { fade(element, 'in', duration, false) },cbDelay);
			return window.clearInterval(fadeOut);
	      }
		  element.style.opacity = Number(element.style.opacity) - 0.1;
	    },duration);
	  }
	}

	
    // return the X or Y coordinates of an element as a Number
	function getX(el) { return Number(el.style.left.replace(/px/,'')) }
	function getY(el) { return Number(el.style.top.replace(/px/,'')) }
	
	
    // trigger the game when start game is clicked
    function startGame() {
      if (typeof gameStarted === true) return alert('What the ? are you trying to start the game when you already started it ?\nIf not please contact the developer about this error.');
      document.getElementById('startMenu').style.display = 'none';
	  document.getElementById('gameVersion').style.display = 'none';
      gameLogic();
    }

    // go back to the main menu / pause menu
    function goBack(el) { el.parentNode.style.display = 'none' }

    // show game instructions
    function gameInstruct() { document.getElementById('instructions').style.display = 'block' }
	
    // show game items
    function gameItems() { document.getElementById('items').style.display = 'block' }

    // show game controls
    function gameControls() { document.getElementById('controls').style.display = 'block' }
	
    // show about the game
    function gameAbout() { document.getElementById('about').style.display = 'block' }
	
    // show ship customization
    function gameCustom() { document.getElementById('customize').style.display = 'block' }


	// attempt to mitigate lag on PS3 and PS4
	// too many rounded corners seems to be a source of lag for the PlayStation browser
    if (navigator.platform == 'PlayStation 3' || navigator.platform == 'PlayStation 4') {
	  var style = create('DIV','PlayStation');
      style.innerHTML = '<style type="text/css">*{-webkit-border-radius:0!important;-moz-border-radius:0!important;border-radius:0!important;}</style>';
	  document.getElementsByTagName('HEAD')[0].appendChild(style);
    }
	
	
   // create a quick little popup
	function popup(title, message, choice, method) {
	  confirmBox = true;
	  confirmOverlay = create('DIV','none','overlay');
	  confirm = create('DIV','none','small menu');
      confirmOverlay.style.zIndex = 50;
      confirm.style.zIndex = 51
		
	  var buttons = '<div class="button" onclick="closePopup();">Okay</div>';
	  if (choice === true) buttons = '<div class="button" onclick="confirmPopup();">Yes</div><div class="button" onclick="closePopup();">No</div>';
	  confirm.innerHTML = '<div class="title">'+title+'</div><br><div class="text">'+message+'</div><br>'+buttons+'<br>';
	  bodyAppend(confirmOverlay);
	  bodyAppend(confirm);
		
	  confirmPopup = function() {
		method();
		closePopup();
	  }
		
      closePopup = function() {
		confirmBox = false;
		bodyRemove(confirmOverlay);
		bodyRemove(confirm);
	  }
	}
	
	
	// ship customization
	shipField = document.getElementById('shipColor');
	shieldField = document.getElementById('shieldColor');
	shipField.onkeyup = function() { document.getElementById('shipPreview').style.borderBottomColor = shipField.value }
	shieldField.onkeyup = function() { document.getElementById('shieldPreview').style.borderColor = shieldField.value }
	
	function saveShip() {
	  if (document.getElementById('customShip')) bodyRemove(document.getElementById('customShip'));
	  
	  if (shipField.value.length > 0) shipColor = shipField.value;
	  else if (shipField.value.length < 1) shipColor = '#008800';
	  if (shieldField.value.length > 0) shieldColor = shieldField.value;
	  else if (shieldField.value.length < 1) shieldColor = '#0088FF';
	  
	  var theStyle = create('STYLE','customShip');
	  theStyle.innerHTML = '#player.left,#player.top-left,#player.bottom-left{border-right:20px solid '+shipColor+'}#player.top{border-bottom:20px solid '+shipColor+'}#player.right,#player.bottom-right,#player.top-right{border-left:20px solid '+shipColor+'}#player.bottom{border-top:20px solid '+shipColor+'}#photon{background:'+shipColor+'}#shield{border:1px solid '+shieldColor+'}#shieldLeft{border-left:1px solid '+shieldColor+'}#shieldTop{border-top:1px solid '+shieldColor+'}#shieldRight{border-right:1px solid '+shieldColor+'}#shieldBottom{border-bottom:1px solid '+shieldColor+'}';
	  bodyAppend(theStyle);
	  
	  document.getElementById('shipPreview').style.borderBottomColor = shipColor;
	  document.getElementById('shieldPreview').style.borderColor = shieldColor;
	  
	  popup('Ship saved', 'The changes to your ship have been saved!');
	}
	
	function undoShip() { 
	  if (document.getElementById('customShip')) {
	    bodyRemove(document.getElementById('customShip'));
		popup('Undo ship', 'Your ship has been changed back to the Default style.');
      }
	  else popup('Undo ship', 'There are no changes to undo.');
	}
	
	
    // the main logic and game reside in this function
    // the entire function can be triggered by the starting menu
    function gameLogic() {

      gameStarted = true;
	  
	  var endGame = false,
      debug = false,

      x = window.innerWidth,
      y = window.innerHeight,

	  wave = 0,
	  current_weapon = 1,
	  intermission = false,
	  
      score = 0,
      lives = 3,
      deaths = 0,
	  cooldown = 100,
	  cooling = false,
      shieldActive = false,
      invincible = false,
	  speedBoost = false,
	  
	  ammo_bomb = 0,
	  ammo_homing = 0,
	  ammo_tri = 0,
	  ammo_barrage = 0,

      shotsFired = 0,
      playerHits = 0,
	  shieldwaveKills = 0,
      enemiesDestroyed = 0,
	  
	  evadeTotal = 0,
	  evadeBashes = 0,
	  
	  totalPickup = 0,
	  scorePickup = 0,
	  activePickup = false,

	  enemySuicides = 0,
	  enemyShotsFired = 0,
      enemyHits = 0,
      enemyCount = 0,
	  
	  time = '00:00:00',
	  hours = 0,
	  minutes = 0,
	  seconds = 0;
	  
	  
	  // count the total time played (idle when paused)
	  var gameTime = window.setInterval(function() {
	    if (endGame === true) return window.clearInterval(gameTime);
	    if (gamePaused === true) return;
		
		if (seconds < 59) seconds += 1;
		
		else if (minutes < 59) {
		  minutes += 1;
		  seconds = 0;
		}
		
		else if (minutes == 59 && seconds == 59) {
		  hours += 1;
		  minutes = 0;
		  seconds = 0;
		}
		
		var s = seconds;
		var m = minutes;
		var h = hours;
		if (s.toString().length < 2) var s = '0' + seconds;
		if (m.toString().length < 2) var m = '0' + minutes;
		if (h.toString().length < 2) var h = '0' + hours;

		time = h + ':' + m + ':' + s;
		
	  },1000);
	  
	  
	  // create user interface
	  UIbarTop = create('DIV','UIbarTop','UIbar');
	  UIbarTop.innerHTML = 'Score : <span id="scoreUI">0</span>';
	  bodyAppend(UIbarTop);

	  UIbarBottom = create('DIV','UIbarBottom','UIbar');
	  UIbarBottom.innerHTML = 
	  '<span id="livesUI"></span><span id="lives" class="numberUI">&nbsp;x0</span>&nbsp;&nbsp;'+
	  '<span id="bombUI"><span></span></span><span id="bombs" class="numberUI">&nbsp;x0</span><br>'+
	  '<div id="weapon">'+
	    '<div id="w1" class="slot selected"><span id="photonUI"></span>&nbsp;&infin;</div>'+
	    '<div id="w2" class="slot"><span id="barrageUI" class="barrage"><div id="b1"></div><div id="b2"></div><div id="b3"></div><div id="b4"></div></span><span id="barrageAmmo">&nbsp;x0</span></div>'+
		'<div id="w3" class="slot"><span id="triUI"><div id="p1"></div><div id="p2"></div><div id="p3"></div></span><span id="triAmmo">&nbsp;x0</span></div>'+
	  '</div>'+
	  '<div id="cd-outer"><div id="cd-text"></div><div id="cd-inner"></div></div>';
	  bodyAppend(UIbarBottom);
	  
	  
	  // use this to sync the UI
	  function syncUI() {
	    document.getElementById('scoreUI').innerHTML = score;
		document.getElementById('lives').innerHTML = '&nbsp;x' + lives;
		document.getElementById('bombs').innerHTML = '&nbsp;x' + ammo_bomb;
		document.getElementById('barrageAmmo').innerHTML = '&nbsp;x' + ammo_barrage;
		document.getElementById('triAmmo').innerHTML = '&nbsp;x' + ammo_tri;
		
		document.getElementById('cd-text').innerHTML = cooldown + '%';
		document.getElementById('cd-inner').style.width = cooldown + '%';
	  }
	  

      // respawn the player
      function respawn() {
        player.style.left = r5((Math.random() * x / 1.03) + 10);
        player.style.top = r5((Math.random() * y / 1.085) + 35);
        bodyAppend(player);
        shield('add');
        invincibility('add', 3000);

        lives -= 1;
		syncUI();
      }


      // game over function
      function gameOver() {
	    endGame = true;

	    var overlay = create('DIV','none','overlay');
        var endMenu = create('DIV','none','menu');

		endMenu.style.zIndex = 10;
		endMenu.innerHTML =
		'<div class="mainTitle">Game Over</div>'+
		
		'<div class="catg">'+
		  '<div class="title">General Statistics</div>'+

		  '<div class="row">'+
            '<span class="label">Total Score&nbsp;</span>'+
            '<span class="value">' + score + '</span>'+
          '</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Time Played&nbsp;</span>'+
            '<span class="value">' + time + '</span>'+
          '</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Waves Survived&nbsp;</span>'+
            '<span class="value">' + wave + '</span>'+
          '</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Enemies Destroyed&nbsp;</span>'+
            '<span class="value">' + enemiesDestroyed + '</span>'+
          '</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Shieldwave Kills&nbsp;</span>'+
            '<span class="value">' + shieldwaveKills + '</span>'+
          '</div>'+

		  '<div class="row last">'+
            '<span class="label">Deaths&nbsp;</span>'+
            '<span class="value">' + deaths + '</span>'+
          '</div>'+
		  
		  '<div class="title">Pickups</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Total Pickups Acquired&nbsp;</span>'+
            '<span class="value">' + totalPickup + '</span>'+
          '</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Pickups converted to Score&nbsp;</span>'+
            '<span class="value">' + scorePickup / 10 + '</span>'+
          '</div>'+
		  
		  '<div class="row last">'+
            '<span class="label">Score from Pickups&nbsp;</span>'+
            '<span class="value">' + scorePickup + '</span>'+
          '</div>'+

		  '<div class="title">Accuracy</div>'+

		  '<div class="row">'+
            '<span class="label">Shots Fired&nbsp;</span>'+
            '<span class="value">' + shotsFired + '</span>'+
          '</div>'+

		  '<div class="row">'+
            '<span class="label">Shots Hit&nbsp;</span>'+
            '<span class="value">' + playerHits + '</span>'+
          '</div>'+

		  '<div class="row last">'+
            '<span class="label">Total Accuracy&nbsp;</span>'+
            '<span class="value">' + Math.round(playerHits / shotsFired * 100).toString().replace(/(\d+)/,'$1%').replace(/NaN/,'--') + '</span>'+
          '</div>'+
		  
		  '<div class="title">Evasion</div>'+

		  '<div class="row">'+
            '<span class="label">Total Evasions&nbsp;</span>'+
            '<span class="value">' + evadeTotal + '</span>'+
          '</div>'+
		  
		  '<div class="row">'+
            '<span class="label">Evasion Bashes&nbsp;</span>'+
            '<span class="value">' + evadeBashes + '</span>'+
          '</div>'+
		  
		  '<div class="row last">'+
            '<span class="label">Score from Evasion Bashes&nbsp;</span>'+
            '<span class="value">' + evadeBashes * 15 + '</span>'+
          '</div>'+

		  '<div class="title">Enemy</div>'+

		  '<div class="row">'+
            '<span class="label">Enemy Self Destructions&nbsp;</span>'+
            '<span class="value">' + enemySuicides + '</span>'+
          '</div>'+

		  '<div class="row">'+
            '<span class="label">Enemy Shots Fired&nbsp;</span>'+
            '<span class="value">' + enemyShotsFired + '</span>'+
          '</div>'+

		  '<div class="row">'+
            '<span class="label">Enemy Shots Hit&nbsp;</span>'+
            '<span class="value">' + enemyHits + '</span>'+
          '</div>'+

		  '<div class="row last">'+
            '<span class="label">Enemy Accuracy&nbsp;</span>'+
            '<span class="value">' + Math.round(enemyHits / enemyShotsFired * 100).toString().replace(/(\d+)/,'$1%').replace(/NaN/,'--') + '</span>'+
          '</div>'+

		'</div>'+
		'<br>'+
	    '<div class="button" onclick="window.location.reload()">Back to Main Menu</div>';

		bodyAppend(overlay);
		bodyAppend(endMenu);

		if (gamePaused === true) {
		  bodyRemove(pauseOverlay);
		  bodyRemove(pauseMenu);
		}
      }
	  

	  // pause game function
	  function pause() {
	    gamePaused = true;
		if (typeof CB_fadeIn != 'undefined') CB_fadeIn.pause();
		if (typeof CB_fadeOut != 'undefined') CB_fadeOut.pause();
		if (typeof waveDelay != 'undefined') waveDelay.pause();
		if (typeof invTimer != 'undefined') invTimer.pause();
		if (typeof pu_dur != 'undefined') pu_dur.pause();
		if (typeof turboTimer != 'undefined') turboTimer.pause();

		pauseOverlay = create('DIV','none','overlay');
		pauseMenu = create('DIV','none','menu');

		pauseMenu.style.zIndex = 10;
		pauseMenu.innerHTML =
		'<div class="mainTitle">Pause Menu</div>'+
		'<div class="button" onclick="resume();">Resume</div>'+
		'<div class="button" onclick="gameInstruct();">Instructions</div>'+
		'<div class="button" onclick="gameControls();">Controls</div>'+
		'<div class="button" onclick="gameItems();">Items</div>'+
		'<div class="button" onclick="gameCustom();">Customize</div>'+
		'<div class="button" onclick="quit();">Quit Game</div>';

		bodyAppend(pauseOverlay);
		bodyAppend(pauseMenu);

	    resume = function() {
	      gamePaused = false;
		  if (typeof CB_fadeIn != 'undefined') CB_fadeIn.resume();
		  if (typeof CB_fadeOut != 'undefined') CB_fadeOut.resume();
		  if (typeof waveDelay != 'undefined') waveDelay.resume();
		  if (typeof invTimer != 'undefined') invTimer.resume();
		  if (typeof pu_dur != 'undefined') pu_dur.resume();
		  if (typeof turboTimer != 'undefined') turboTimer.resume();
		  
		  // #002 menu bug fix
		  document.getElementById('instructions').style.display = 'none';
		  document.getElementById('controls').style.display = 'none';
		  document.getElementById('items').style.display = 'none';
		  document.getElementById('customize').style.display = 'none';
			
		  bodyRemove(pauseOverlay);
		  bodyRemove(pauseMenu);
	    }
	  }
	  

	  // quit game function
	  quit = function() { popup('Quit Game', 'Do you wish to quit the current game session? All game progress will be lost and you will be taken to the Game Over screen to view your results.', true, gameOver) }


      // add or remove the shield from the player
      function shield(operation) {
        if (operation == 'add') {
          shieldActive = true;
          shld = create('DIV','shield');
          player.appendChild(shld);
        }

        if (operation == 'remove') {
          var pX = getX(player);
          var pY = getY(player);

          shldLeft = create('DIV','shieldLeft');
          shldLeft.style.left = pX - 5;
          shldLeft.style.top = pY - 5;

          shldTop = create('DIV','shieldTop');
          shldTop.style.left = pX - 5;
          shldTop.style.top = pY - 5;

          shldRight = create('DIV','shieldRight');
          shldRight.style.left = pX - 5;
          shldRight.style.top = pY - 5;

          shldBottom = create('DIV','shieldBottom');
          shldBottom.style.left = pX - 5;
          shldBottom.style.top = pY - 5;

          shieldActive = false;
          player.removeChild(shld);

          bodyAppend(shldLeft);
          bodyAppend(shldTop);
          bodyAppend(shldRight);
          bodyAppend(shldBottom);

          playerProjectile(shldLeft, 'decrement', 'left', 5, 1);
          playerProjectile(shldTop, 'decrement', 'top', 5, 1);
          playerProjectile(shldRight, 'increment', 'right', 5, 1);
          playerProjectile(shldBottom, 'increment', 'bottom', 5, 1);
        }
      }


      // trigger invincibility for the player
      function invincibility(operation, duration) {
        if (operation == 'add' && typeof duration === 'number' && invincible === false) {
          invincible = true;
          inv = create('DIV','invincible');
		  
		  if (inv.parentNode === player) return;
          player.appendChild(inv);

          invTimer = new Delay(function() {
		    if (invincible === false) return;
            invincible = false;
            player.removeChild(inv);
          },duration);
        }

        if (operation == 'remove' && invincible === true) {
          invincible = false;
          player.removeChild(inv);
          window.clearTimeout(invTimer);
        }
      }


      // hitbox data
      // insert two sets of coordinates and return a hitbox for those elements
      function hitbox(X1, Y1, X2, Y2, method) {
        var hitbox = {
          x0 : X1,
          x1 : X1 + 5,
          x2 : X1 + 10,
          x3 : X1 + 15,
          x4 : X1 - 5,
          y0 : Y1,
          y1 : Y1 + 5,
          y2 : Y1 + 10,
          y3 : Y1 + 15,
          y4 : Y1 - 5
        };

        if (X2 === hitbox.x0 && Y2 === hitbox.y0) method();
		else if (X2 === hitbox.x0 && Y2 === hitbox.y1) method();
		else if (X2 === hitbox.x0 && Y2 === hitbox.y2) method();
		else if (X2 === hitbox.x0 && Y2 === hitbox.y3) method();
		else if (X2 === hitbox.x0 && Y2 === hitbox.y4) method();

        else if (X2 === hitbox.x1 && Y2 === hitbox.y0) method();
		else if (X2 === hitbox.x1 && Y2 === hitbox.y1) method();
		else if (X2 === hitbox.x1 && Y2 === hitbox.y2) method();
		else if (X2 === hitbox.x1 && Y2 === hitbox.y3) method();
		else if (X2 === hitbox.x1 && Y2 === hitbox.y4) method();

        else if (X2 === hitbox.x2 && Y2 === hitbox.y0) method();
		else if (X2 === hitbox.x2 && Y2 === hitbox.y1) method();
		else if (X2 === hitbox.x2 && Y2 === hitbox.y2) method();
		else if (X2 === hitbox.x2 && Y2 === hitbox.y3) method();
		else if (X2 === hitbox.x2 && Y2 === hitbox.y4) method();

        else if (X2 === hitbox.x3 && Y2 === hitbox.y0) method();
		else if (X2 === hitbox.x3 && Y2 === hitbox.y1) method();
		else if (X2 === hitbox.x3 && Y2 === hitbox.y2) method();
		else if (X2 === hitbox.x3 && Y2 === hitbox.y3) method();
		else if (X2 === hitbox.x3 && Y2 === hitbox.y4) method();

        else if (X2 === hitbox.x4 && Y2 === hitbox.y0) method();
		else if (X2 === hitbox.x4 && Y2 === hitbox.y1) method();
		else if (X2 === hitbox.x4 && Y2 === hitbox.y2) method();
		else if (X2 === hitbox.x4 && Y2 === hitbox.y3) method();
		else if (X2 === hitbox.x4 && Y2 === hitbox.y4) method();
      }


      // enemy movement
      function moveAI(element, pixels, speed, hp) {
        var aiMovement = window.setInterval(function() {
          if (element.parentNode === null || endGame === true) return window.clearInterval(aiMovement);
          if (player.parentNode === null || gamePaused === true) return;

          var eX = getX(element);
          var eY = getY(element);
          var pX = getX(player);
          var pY = getY(player);

          // the enemy is extremely hostile
          // it is always moving in the direction of the player
          if (eX > pX) element.className = 'left';
          if (eY > pY) element.className = 'top';
          if (eX < pX) element.className = 'right';
          if (eY < pY) element.className = 'bottom';
          if (eX > pX && eY > pY) element.className = 'top-left';
          if (eX < pX && eY > pY) element.className = 'top-right';
          if (eX > pX && eY < pY) element.className = 'bottom-left';
          if (eX < pX && eY < pY) element.className = 'bottom-right';

          if (element.className == 'left') {
            if (eX < 10) element.className = 'right';
            element.style.left = eX - pixels;
          }

          if (element.className == 'top') {
            if (eY < 35) element.className = 'bottom';
            element.style.top = eY - pixels;
          }

          if (element.className == 'right') {
            if (eX > r5(x / 1.03)) element.className = 'left';
            element.style.left = eX + pixels;
          }

          if (element.className == 'bottom') {
            if (eY > r5(y / 1.085)) element.className = 'top';
            element.style.top = eY + pixels;
          }

          if (element.className == 'top-left') {
            if (eX < 10) element.className = 'right';
            if (eY < 35) element.className = 'bottom';
            element.style.left = eX - pixels;
            element.style.top = eY - pixels;
          }

          if (element.className == 'top-right') {
            if (eX > r5(x / 1.03)) element.className = 'left';
            if (eY < 35) element.className = 'bottom';
            element.style.left = eX + pixels;
            element.style.top = eY - pixels;
          }

          if (element.className == 'bottom-left') {
            if (eX < 10) element.className = 'right';
            if (eY > r5(y / 1.085)) element.className = 'top';
            element.style.left = eX - pixels;
            element.style.top = eY + pixels;
          }

          if (element.className == 'bottom-right') {
            if (eX > r5(x / 1.03)) element.className = 'left';
            if (eY > r5(y / 1.085)) element.className = 'top';
            element.style.left = eX + pixels;
            element.style.top = eY + pixels;
          }

          function confirmSuicide() {
		    explosion(element);
            bodyRemove(element);
            enemyCount -= 1;
            enemySuicides += 1;

            if (invincible == true) return;
            if (shieldActive === true) shield('remove');
            else if (shieldActive === false) {
			  deaths += 1;
              bodyRemove(player);

              if (lives > 0) respawn();
              else if (lives == 0) gameOver();
            }
          }

          hitbox(pX, pY, eX, eY, confirmSuicide);
		  
		  function landmine() {
		    if (element.parentNode == null || b[i].parentNode == null) return;
			if (hp == 0) {
              score += 5;
			  syncUI();
              enemiesDestroyed += 1;
              enemyCount -= 1;
			  spawnPickup('kill', getX(element), getY(element));
			  
			  explosion(b[i]);
		  	  bodyRemove(b[i]);
			  bodyRemove(element);
			}
			else {
			  hp -= 1;
			  if (hp == 1) element.id = 'enemy-t2';
              else if (hp == 0) element.id = 'enemy-t1';			  
			  
              score += 5;
			  syncUI();
		  	  explosion(b[i]);
		  	  bodyRemove(b[i]);
			}
		  }

		  var b = document.getElementsByTagName('DIV');
		  for (i = 0; i < b.length; i++) { if (b[i].id == 'bomb') hitbox(getX(b[i]), getY(b[i]), eX, eY, landmine) }		  
        },speed);
		
		// #001 hit detection bug fix
		var detectPhoton = window.setInterval(function() {
		  if (element.parentNode == null) return window.clearInterval(detectPhoton);
		
          function confirmHit() {
            if (element.parentNode == null || p[i].parentNode == null) return;
			if (hp == 0) {
              score += 5;
			  syncUI();
              enemiesDestroyed += 1;
              enemyCount -= 1;
			  spawnPickup('kill', getX(element), getY(element));
			  
              if (p[i].id == 'photon') playerHits += 1;
		      if (p[i].id == 'shieldLeft' || p[i].id == 'shieldTop' || p[i].id == 'shieldRight' || p[i].id == 'shieldBottom') shieldwaveKills += 1;
			  
			  explosion(p[i]);
		  	  bodyRemove(p[i]);
			  bodyRemove(element);
			  window.clearInterval(detectPhoton);
			}
			else {
			  hp -= 1;
			  if (hp == 1) element.id = 'enemy-t2';
              else if (hp == 0) element.id = 'enemy-t1';			  
			  
              score += 5;
			  if (p[i].id == 'photon') playerHits += 1;
			  syncUI();
		  	  explosion(p[i]);
		  	  bodyRemove(p[i]);
			}
          }
		
          var p = document.getElementsByTagName('DIV');
		  for (i = 0; i < p.length; i++) { if (p[i].id === 'photon' || p[i].id == 'shieldLeft' || p[i].id == 'shieldTop' || p[i].id == 'shieldRight' || p[i].id == 'shieldBottom') hitbox(getX(element), getY(element), getX(p[i]), getY(p[i]), confirmHit); }
		},1);
      }


      // create enemy projectile
      function firePhoton(element, pixels, speed) {
        var createProj = window.setInterval(function() {
          if (element.parentNode === null || endGame === true) return window.clearInterval(createProj);
          if (player.parentNode === null || gamePaused === true) return;

          var dir = element.className;
          var px = pixels;
          var ePhoton = create('DIV','enemyPhoton');
          ePhoton.style.left = getX(element) + 5;
          ePhoton.style.top = getY(element) + 5;
		  enemyShotsFired += 1;

          bodyAppend(ePhoton);
          animatePhoton(ePhoton, dir, px, 1);
        },speed);
      }

      // animate enemy projectile
      function animatePhoton(element, direction, pixels, speed) {
        var aiAttack = window.setInterval(function() {
		  if (endGame === true) return window.clearInterval(aiAttack);
		  if (gamePaused === true) return;

          var eX = getX(element);
          var eY = getY(element);

          if (eX < 10 || eY < 10 || eX > r5(x / 1.02) || eY > r5(y / 1.03)) {
            bodyRemove(element);
            window.clearInterval(aiAttack);
          }

          if (direction == 'left') element.style.left = eX - pixels;
          if (direction == 'top') element.style.top = eY - pixels;
          if (direction == 'right') element.style.left = eX + pixels;
          if (direction == 'bottom') element.style.top = eY + pixels;

          if (direction == 'top-left') {
            element.style.left = eX - pixels;
            element.style.top = eY - pixels;
          }

          if (direction == 'top-right') {
            element.style.left = eX + pixels;
            element.style.top = eY - pixels;
          }

          if (direction == 'bottom-left') {
            element.style.left = eX - pixels;
            element.style.top = eY + pixels;
          }

          if (direction == 'bottom-right') {
            element.style.left = eX + pixels;
            element.style.top = eY + pixels;
          }

          function confirmHit() {
            enemyHits += 1;
			explosion(element);
            bodyRemove(element);
            window.clearInterval(aiAttack);

            if (invincible == true) return;
            if (shieldActive === true) shield('remove');
            else if (shieldActive === false) {
			  deaths += 1;
              bodyRemove(player);

              if (lives > 0) respawn();
              else if (lives == 0) gameOver();
            }
          }

          hitbox(getX(player), getY(player), eX, eY, confirmHit);

        },speed);
      }


      // enemy constructor
      function createEnemy() {
        if (endGame === true) return;
        enemyCount += 1;

        var pos_rand = Math.floor(Math.random() * 8);
        if (pos_rand === 0) var dir = 'left';
        if (pos_rand === 1) var dir = 'top';
        if (pos_rand === 2) var dir = 'right';
        if (pos_rand === 3) var dir = 'bottom';
        if (pos_rand === 4) var dir = 'top-left';
        if (pos_rand === 5) var dir = 'top-right';
        if (pos_rand === 6) var dir = 'bottom-left';
        if (pos_rand === 7) var dir = 'bottom-right';

		var tier_rand = Math.floor( Math.random() * 51 );
		var hp = 0;
		var enemy = create('DIV','enemy-t1',dir);
		var armor = create('DIV');
		  
		if (wave >= 5 && tier_rand > 30) {
		  var hp = 1;
		  var enemy = create('DIV','enemy-t2',dir);
		  enemy.appendChild(armor);
		}
		
		if (wave >= 10 && tier_rand > 40) {
		  var hp = 2;
		  var enemy = create('DIV','enemy-t3',dir);
		  enemy.appendChild(armor);
		}
		
        enemy.style.left = r5((Math.random() * x / 1.03) + 10);
        enemy.style.top = r5((Math.random() * y / 1.085) + 35);

        moveAI(enemy, 5, 100, hp);
        firePhoton(enemy, 5, Math.floor(Math.random() * 2001 + 1500));
        bodyAppend(enemy);
      }

      // explosive effects
      function explosion(element) {
	  
        var exp = create('DIV','explosion');
        exp.style.left = getX(element);
        exp.style.top = getY(element);
		exp.style.width = 10;
		exp.style.height = 10;
		exp.style.opacity = 1;

        bodyAppend(exp);
		
        var exp_ani = window.setInterval(function() {
		  if (exp.style.opacity <= 0) {
		    window.clearInterval(exp_ani);
			return bodyRemove(exp);
	      }
          exp.style.left = getX(exp) - 0.5;
          exp.style.top = getY(exp) - 0.5;
		  exp.style.width = Number(exp.style.width.replace(/px/,'')) + 1;
		  exp.style.height = Number(exp.style.height.replace(/px/,'')) + 1;
		  exp.style.opacity = exp.style.opacity - 0.02;
		},10);
      }
	  
	  
	  function cd_energy() {
	    if (cooling === true) return;
		else cooling = true;
	  
		var evadeCooldown = window.setInterval(function() {
		  var inner = document.getElementById('cd-inner');
		
		  if (gamePaused === true) return;
		  if (cooldown == 100 || endGame === true) {
		    cooling = false;
		    if (endGame === false) inner.style.background = '#006600';
		    return window.clearInterval(evadeCooldown);
		  }
		  
		  if (cooldown == 10) inner.style.background = '#600';
		  if (cooldown == 20) inner.style.background = '#620';
		  if (cooldown == 30) inner.style.background = '#630';
		  if (cooldown == 40) inner.style.background = '#640';
		  if (cooldown == 50) inner.style.background = '#660';
		  if (cooldown == 60) inner.style.background = '#560';
		  if (cooldown == 70) inner.style.background = '#460';
		  if (cooldown == 80) inner.style.background = '#360';
		  if (cooldown == 90) inner.style.background = '#260';
		  cooldown += 1;
		  syncUI();
		},50);
	  }


      // animate the movement of player projectile
      function playerProjectile(element, operation, direction, pixels, speed) {
        var proj_anim = window.setInterval(function() {
		  if (endGame === true || element.parentNode === null) return window.clearInterval(proj_anim);
		  if (gamePaused === true) return;

          var pX = getX(element);
          var pY = getY(element);

          if (pX < 10 || pY < 10 || pX > r5(x / 1.02) || pY > r5(y / 1.03)) {
            bodyRemove(element);
            window.clearInterval(proj_anim);
          }

          // check what method to run
          if (direction == 'left' || direction == 'right' && operation == 'increment') element.style.left = pX + pixels;
          if (direction == 'top' || direction == 'bottom' && operation == 'increment') element.style.top = pY + pixels;

          if (direction == 'left' || direction == 'right' && operation == 'decrement') element.style.left = pX - pixels;
          if (direction == 'top' || direction == 'bottom' && operation == 'decrement') element.style.top = pY - pixels;

          if (direction == 'top-left' && operation == 'decrement') {
            element.style.left = pX - pixels;
            element.style.top = pY - pixels;
          }

          if (direction == 'top-right' && operation == 'inc/dec') {
            element.style.left = pX + pixels;
            element.style.top = pY - pixels;
          }

          if (direction == 'bottom-left' && operation == 'dec/inc') {
            element.style.left = pX - pixels;
            element.style.top = pY + pixels;
          }

          if (direction == 'bottom-right' && operation == 'increment') {
            element.style.left = pX + pixels;
            element.style.top = pY + pixels;
          }
		  
		  /*if (direction == 'auto' && operation == 'homing') {
		    var e = document.getElementsByTagName('DIV');
			  for (i=0; i<e.length; i++) {
				
			    if (e[i].id == 'enemy-t1' || e[i].id == 'enemy-t2' || e[i].id == 'enemy-t3') {
			
                  var eX = getX(e[i]);
                  var eY = getY(e[i]);				 

                  if (pX > eX) element.style.left = pX - pixels;
                  if (pY > eY) element.style.top = pY - pixels;
                  if (pX < eX) element.style.left = pX + pixels;
                  if (pY < eY) element.style.top = pX + pixels;
				  
                  if (pX > eX && pY > eY) {
                    element.style.left = pX - pixels;
                    element.style.top = pY - pixels;
		          }
				  
                  if (pX < eX && pY > eY) {
                    element.style.left = pX + pixels;
                    element.style.top = pY - pixels;
		          }
				  
                  if (pX > eX && pY < eY) {
                    element.style.left = pX - pixels;
                    element.style.top = pY + pixels;
		          }
				  
                  if (pX < eX && pY < eY) {
                    element.style.left = pX + pixels;
                    element.style.top = pY + pixels;
		          }
			   }
			}
		  }*/

        },speed);
      }

      function photonBarrage(parent, opt, dir) {
        var el = create('DIV','photon','barrage-split');
        el.style.left = getX(parent);
        el.style.top = getY(parent);
        bodyAppend(el);
        playerProjectile(el, opt, dir, 5, 1);
      }
	  
	  function evade(pos) {
	    cooldown -= 75;
		cd_energy();
		evadeTotal += 1;
		invincibility('add', 500);
		document.getElementById('cd-inner').style.background = '#620'
		syncUI();
		
		var val = 0;
        var e = document.getElementsByTagName('DIV');
		
		function bashed() {
		  score += 15;
		  evadeBashes += 1;
		  enemiesDestroyed += 1;
          enemyCount -= 1;
		  syncUI();
		  spawnPickup('kill', getX(e[i]), getY(e[i]));
		  
		  explosion(e[i]);
		  bodyRemove(e[i]);
		}
		
		function evadeHit() { for (i = 0; i < e.length; i++) { if (e[i].id == 'enemy-t1' || e[i].id == 'enemy-t2' || e[i].id == 'enemy-t3') hitbox(getX(e[i]), getY(e[i]), getX(player), getY(player), bashed) } }
		
		if (pos == 'left') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getX(player) < 10) return clearInterval(evasion);
			val += 5;
			player.style.left = getX(player) - 5;
			evadeHit();
		  },1);
		}
		
		if (pos == 'top') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getY(player) < 35) return clearInterval(evasion);
			val += 5;
			player.style.top = getY(player) - 5;
			evadeHit();
		  },1);
		}
		
		if (pos == 'right') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getX(player) > r5(x / 1.03)) return clearInterval(evasion);
			val += 5;
			player.style.left = getX(player) + 5;
			evadeHit();
		  },1);
		}
		
		if (pos == 'bottom') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getY(player) > r5(y / 1.085)) return clearInterval(evasion);
			val += 5;
			player.style.top = getY(player) + 5;
			evadeHit();
		  },1);
		}
		
		if (pos == 'top-left') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getY(player) < 35 || getX(player) < 10) return clearInterval(evasion);
			val += 5;
			player.style.left = getX(player) - 5;
			player.style.top = getY(player) - 5;
			evadeHit();
		  },1);
		}
	
		if (pos == 'top-right') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getY(player) < 35 || getX(player) > r5(x / 1.03)) return clearInterval(evasion);
			val += 5;
			player.style.left = getX(player) + 5;
			player.style.top = getY(player) - 5;
			evadeHit();
		  },1);
		}
	
		if (pos == 'bottom-left') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getY(player) > r5(y / 1.085) || getX(player) < 10) return clearInterval(evasion);
			val += 5;
			player.style.left = getX(player) - 5;
			player.style.top = getY(player) + 5;
			evadeHit();
		  },1);
		}
	
		if (pos == 'bottom-right') {
		  var evasion = window.setInterval(function() {
		    if (val == 100 || getY(player) > r5(y / 1.085) || getX(player) > r5(x / 1.03)) return clearInterval(evasion);
			val += 5;
			player.style.left = getX(player) + 5;
			player.style.top = getY(player) + 5;
			evadeHit();
		  },1);
		}
	  }
	  

	  // spawn a random pickup
	  function spawnPickup(drop, X, Y) {
	    if (activePickup === true || gamePaused === true) return;

	    var pu_rand = Math.floor(Math.random() * 151);

		if (pu_rand == 0 || drop == 'shield') {
		  activePickup = true;
		  pickup = create('DIV','repair','pickup');
		  pickup.innerHTML = '<div>R</div>';
		}

		else if (pu_rand == 25) {
		  activePickup = true;
		  pickup = create('DIV','overdrive','pickup');
		}
		
		else if (pu_rand == 50) {
		  activePickup = true;
		  pickup = create('DIV','extralive','pickup');
		  pickup.innerHTML = '<div>1</div>';
		}
		
		else if (pu_rand == 75) {
		  activePickup = true;
		  pickup = create('DIV','bombAmmo','pickup');
		  pickup.innerHTML = '<div></div>';
		}
		
		else if (pu_rand == 100) {
		  activePickup = true;
		  pickup = create('DIV','speedBoost','pickup');
		  pickup.innerHTML = '<div>S</div>';
		}
		
		else if (pu_rand == 125) {
		  activePickup = true;
		  pickup = create('DIV','barrage','pickup');
		  pickup.innerHTML = '<div class="weaponPickup"></div><div id="b1"></div><div id="b2"></div><div id="b3"></div><div id="b4"></div>';
		}
		
		else if (pu_rand == 150) {
		  activePickup = true;
		  pickup = create('DIV','tri-photon','pickup');
		  pickup.innerHTML = '<div class="weaponPickup"></div><div id="p1"></div><div id="p2"></div><div id="p3"></div>';
		}

	    if (activePickup === true) {
		  if (drop == 'kill') {
            pickup.style.left = X;
            pickup.style.top = Y;
		  }
		  else {
            pickup.style.left = r5((Math.random() * x / 1.03) + 10);
            pickup.style.top = r5((Math.random() * y / 1.15) + 35);
		  }
		  
		  if (drop == 'shield') {
            pickup.style.left = r5(x / 2.05);
            pickup.style.top = r5(y / 2.05);
		  }
		  
		  bodyAppend(pickup);
		  
		  pu_dur = new Delay(function() {
		    if (activePickup === false) return;
		    activePickup = false;
		    bodyRemove(pickup);
	      },30000);
	    }
	  }
	  
	  pickupInt = window.setInterval(function() {
	    if (endGame === true) return window.clearInterval(pickupInt);
	    spawnPickup();
	  },1000);
	  
	  
	  // add to the three common variables used in pickups
	  function pu_sync(puTotal, puScore, totalScore) {
	    totalPickup += puTotal;
		scorePickup += puScore;
		score += totalScore;
		activePickup = false;
	  }


	  // shield repair pickup
	  function pu_repair() {
		bodyRemove(pickup);
		pu_dur.kill();

		if (shieldActive === false) {
		  pu_sync(1, 0, 0);
		  shield('add');
		}

		else {
		  pu_sync(1, 10, 10);
		  syncUI();
		}
	  }


	  // overdrive pickup
	  function pu_overdrive() {
		bodyRemove(pickup);
		pu_dur.kill();

		if (invincible === false) {
		  pu_sync(1, 0, 0);
		  invincibility('add', 5000);
		}

		else {
		  pu_sync(1, 10, 10);
		  syncUI();
		}
	  }

	  // extra live pickup
	  function pu_live() {
		bodyRemove(pickup);
		pu_dur.kill();
		
		if (lives < 9) {
		  pu_sync(1, 0, 0);
		  lives += 1;
		  syncUI();
		}
		  
		else {
		  pu_sync(1, 10, 10);
		  syncUI();
		}
	  }
	  
	  // bomb pickup
	  function pu_bomb() {
		bodyRemove(pickup);
		pu_dur.kill();
		
		if (ammo_bomb < 9) {
		  pu_sync(1, 0, 0);
		  if (ammo_bomb <= 6) ammo_bomb += 3;
		  else if (ammo_bomb == 7) ammo_bomb += 2;
		  else if (ammo_bomb == 8) ammo_bomb += 1;
		  syncUI();
		}
		  
		else {
		  pu_sync(1, 10, 10);
		  syncUI();
		}
	  }
	  
	  
	  // speed boost pickup
	  function pu_speed() {
		bodyRemove(pickup);
		pu_dur.kill();

		if (speedBoost === false) {
		  pu_sync(1, 0, 0);
		  speedBoost = true;
		  
		  turboTimer = new Delay(function() {
		    speedBoost = false;
		  },15000);
		}

		else {
		  pu_sync(1, 10, 10);
		  syncUI();
		}
	  }
	  
	  // photon barrage pickup
	  function pu_barrage() {
		bodyRemove(pickup);
		pu_dur.kill();
		
	    pu_sync(1, 0, 0);
        ammo_barrage += 5;
		syncUI();
	  }
	  
	  // tri-photon pickup
	  function pu_tri() {
		bodyRemove(pickup);
		pu_dur.kill();
		
	    pu_sync(1, 0, 0);
        ammo_tri += 5;
		syncUI();
	  }
	  

      // here the player element is created and start position set
      var player = create('DIV','player','top');
      player.style.left = r5(x / 2.05);
      player.style.top = r5(y / 2.05);
      bodyAppend(player);
      shield('add');
	  syncUI();
	  
	  
      function newWave() {
		createEnemy();
        if (wave >= 5) createEnemy();
        if (wave >= 10) createEnemy();
        if (wave >= 15) createEnemy();
        if (wave >= 20) createEnemy();
      }

	  
      // spawn a wave of enemies; amount depends on score.
	  checkState = window.setInterval(function() {
	  
	    // first run a quick check on the enemyCount and game state
	    if (endGame === true) return window.clearInterval(checkState);
	    if (intermission === true || gamePaused === true) return;
	    if (enemyCount == 0 && intermission === false) {
		  intermission = true;
		  wave += 1;
		}
		else return;
		
		var ann = create('DIV','announceWave');
		ann.style.opacity = 0;
		
		if (lives > 0) {
		  var ann_rand = Math.floor(Math.random() * 10);
		  if (ann_rand == 0) var announcement = 'More Reds incoming!';
		  if (ann_rand == 1) var announcement = 'These guys are relentless..';
		  if (ann_rand == 2) var announcement = 'Another wave, another death.';
		  if (ann_rand == 3) var announcement = 'How many of these guys are there?';
		  if (ann_rand == 4) var announcement = 'Keep kicking their as -- er butts!';
		  if (ann_rand == 5) var announcement = 'We\'re going to need some more Pickups...';
		  if (ann_rand == 6) var announcement = 'Get ready, here comes another wave!';
		  if (ann_rand == 7) var announcement = 'Keep your finger on the trigger!';
		  if (ann_rand == 8) var announcement = 'I think you got something Red on you.';
		  if (ann_rand == 9) var announcement = 'How high can you get the numbers?';
		}
		
		
		if (lives < 1) {
		  var death_rand = Math.floor(Math.random() * 6);
		  if (death_rand == 0) var announcement = 'Don\'t die on me now, Rookie!';
		  if (death_rand == 1) var announcement = 'I\'m surprised you\'re still ticking, Rookie!';
		  if (death_rand == 2) var announcement = 'It would be pointless to give up now!';
		  if (death_rand == 3) var announcement = 'Keep fighting, you\'re bound to find something soon!';
		  if (death_rand == 4) var announcement = 'Take those Reds down with you, Rookie!';
		  if (death_rand == 5) var announcement = 'Rookie? Are you all right Rookie!?';
		}
		
	    if (wave == 1) {
		  activePickup = true;
		  var announcement = 'Prepare yourself, Rookie!<br>Use the <span style="color:#8F8;">Arrow Keys to Move</span> and <span style="color:#C66;">Space Bar to Shoot</span>.';
		}
		
		if (wave == 2) var announcement = 'If you get hit while your shield is active you will unleash a <span style="color:#8FF;">Shieldwave</span>.';
		if (wave == 3) {
	      activePickup = false;
		  spawnPickup('shield');
		  var announcement = 'Look out for Pickups to <span style="color:#8FF;">Repair your Shield</span>, or gain Score!';
		}
		
		if (wave == 4) var announcement = 'You can take a break at anytime by pressing <span style="color:#8F8;">P</span>.';
		if (wave == 5) var announcement = 'That\'s all you need to know to <span style="color:#C66;">defeat the Reds</span>.<br>Good luck, Rookie!';
		
		if (intermission === true) {
		  ann.innerHTML = '<span class="waveCount">Wave ' + wave + '</span><br>' + announcement;
		  bodyAppend(ann);
		  fade(ann, 'in', 50, true, 3000);
		  
		  waveDelay = new Delay(function() {
		    if (intermission === false) return;
		    newWave();
			bodyRemove(ann);
			intermission = false;
	      },5000);
		}
	  },1);
	  

	  // change the selected weapon
	  function selectWeapon(n) {
        var w1 = document.getElementById('w1');
	    var w2 = document.getElementById('w2');
		var w3 = document.getElementById('w3');
		var sel = ' selected'
		
		if (n != 1 && current_weapon == 1) w1.className = w1.className.replace(sel,'');
		if (n != 2 && current_weapon == 2) w2.className = w2.className.replace(sel,'');
		if (n != 3 && current_weapon == 3) w3.className = w3.className.replace(sel,'');
		
		if (n == 1 && current_weapon != 1) {
		  current_weapon = 1;
		  w1.className = w1.className + sel;
	    }
		
		if (n == 2 && current_weapon != 2) {
		  current_weapon = 2;
		  w2.className = w2.className + sel;
	    }
		
		if (n == 3 && current_weapon != 3) {
		  current_weapon = 3;
		  w3.className = w3.className + sel;
	    }
	  }
	  
	  
	  // the default attack for the player
	  function defaultAttack() {
        if (cooldown < 20) return;		
		cooldown -= 20;
		cd_energy();
		syncUI();
		
        var position = player.className;
        var photon = create('DIV','photon');
        photon.style.left = getX(player) + 5;
        photon.style.top = getY(player) + 5;

        bodyAppend(photon);
        shotsFired += 1;

        if (position == 'left') playerProjectile(photon, 'decrement', 'left', 5, 1);
        if (position == 'top') playerProjectile(photon, 'decrement', 'top', 5, 1);
        if (position == 'right') playerProjectile(photon, 'increment', 'right', 5, 1);
        if (position == 'bottom') playerProjectile(photon, 'increment', 'bottom', 5, 1);

        if (position == 'top-left') playerProjectile(photon, 'decrement', 'top-left', 5, 1);
        if (position == 'top-right') playerProjectile(photon, 'inc/dec', 'top-right', 5, 1);
        if (position == 'bottom-left') playerProjectile(photon, 'dec/inc', 'bottom-left', 5, 1);
        if (position == 'bottom-right') playerProjectile(photon, 'increment', 'bottom-right', 5, 1);
      }
		
      // player attack for PS3 / PS4
	  if (navigator.platform == 'PlayStation 3' || navigator.platform == 'PlayStation 4') {
		if (cooldown < 20) return;
		cooldown -= 20;
		cd_energy();
		syncUI();
		
        var photon = create('DIV','photon');
        photon.style.left = getX(player) + 5;
        photon.style.top = getY(player) + 5;

        bodyAppend(photon);
        shotsFired += 1;
		
        if (e.keyCode == 37) playerProjectile(photon, 'decrement', 'left', 5, 1);
        if (e.keyCode == 38) playerProjectile(photon, 'decrement', 'top', 5, 1);
        if (e.keyCode == 39) playerProjectile(photon, 'increment', 'right', 5, 1);
        if (e.keyCode == 40) playerProjectile(photon, 'increment', 'bottom', 5, 1);
      }
	  
      // START Key functions
      document.onkeydown = function(e) {
	    if (endGame === true || gamePaused === true) return;
        if (e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) e.preventDefault();

        var pX = getX(player);
        var pY = getY(player);

		// pickup interaction
		if (activePickup === true && typeof pickup != 'undefined') {
		  if (pickup.id == 'repair') var method = pu_repair;
		  if (pickup.id == 'overdrive') var method = pu_overdrive;
		  if (pickup.id == 'extralive') var method = pu_live;
		  if (pickup.id == 'bombAmmo') var method = pu_bomb;
		  if (pickup.id == 'speedBoost') var method = pu_speed;
		  if (pickup.id == 'barrage') var method = pu_barrage;
		  if (pickup.id == 'tri-photon') var method = pu_tri;

		  hitbox(pX, pY, getX(pickup), getY(pickup), method);
		}


        // left movement
        if (e.keyCode == 37 || e.keyCode == 65 || e.keyCode == 100) {
          if (pX < 10) return;
          player.className = 'left';
          player.style.left = pX - 5;
		  if (speedBoost === true) player.style.left = getX(player) - 5;
        }

        // up movement
        if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 104) {
          if (pY < 35) return;
          player.className = 'top';
          player.style.top = pY - 5;
		  if (speedBoost === true) player.style.top = getY(player) - 5;
        }

        // right movement
        if (e.keyCode == 39 || e.keyCode == 68 || e.keyCode == 102) {
          if (pX > r5(x / 1.03)) return;
          player.className = 'right';
          player.style.left = pX + 5;
		  if (speedBoost === true) player.style.left = getX(player) + 5;
        }

        // down movement
        if (e.keyCode == 40 || e.keyCode == 83 || e.keyCode == 98) {
          if (pY > r5(y / 1.085)) return;
          player.className = 'bottom';
          player.style.top = pY + 5;
		  if (speedBoost === true) player.style.top = getY(player) + 5;
        }

        // top-left movement
        if (e.keyCode == 81 || e.keyCode == 103) {
          if (pX < 10 || pY < 35) return;
          player.className = 'top-left';
          player.style.left = pX - 5;
          player.style.top = pY - 5;
		  if (speedBoost === true) {
		    player.style.left = getX(player) - 5;
            player.style.top = getY(player) - 5;
          }
        }

        // top-right movement
        if (e.keyCode == 69 || e.keyCode == 105) {
          if (pX > r5(x / 1.03) || pY < 35) return;
          player.className = 'top-right';
          player.style.left = pX + 5;
          player.style.top = pY - 5;
		  if (speedBoost === true) {
		    player.style.left = getX(player) + 5;
            player.style.top = getY(player) - 5;
          }
        }

        // bottom-left movement
        if (e.keyCode == 90 || e.keyCode == 97) {
          if (pX < 10 || pY > r5(y / 1.085)) return;
          player.className = 'bottom-left';
          player.style.left = pX - 5;
          player.style.top = pY + 5;
		  if (speedBoost === true) {
		    player.style.left = getX(player) - 5;
            player.style.top = getY(player) + 5;
          }
        }

        // bottom-right movement
        if (e.keyCode == 67 || e.keyCode == 99) {
          if (pX > r5(x / 1.03) || pY > r5(y / 1.085)) return;
          player.className = 'bottom-right';
          player.style.left = pX + 5;
          player.style.top = pY + 5;
		  if (speedBoost === true) {
		    player.style.left = getX(player) + 5;
            player.style.top = getY(player) + 5;
          }
        }
		
		// evasion
		if (e.ctrlKey && cooldown >= 75) evade(player.className);
		
		if (e.keyCode == 49) selectWeapon(1);
		if (e.keyCode == 50) selectWeapon(2);
		if (e.keyCode == 51) selectWeapon(3);
      }
	  
	  // keyup functions
      document.onkeyup = function(e) {
        if (endGame === true) return;

	    // pause / unpause game
		if (e.keyCode == 19 || e.keyCode == 80) {
		  if (gamePaused === false) pause();
		  else if (gamePaused === true && confirmBox === false && shipField !== document.activeElement && shieldField !== document.activeElement) resume();
		}

        if (gamePaused === true) return;

        // player attack
        if (current_weapon == 1 && e.keyCode == 32) defaultAttack();

		
		// photon bomb
		if (e.keyCode == 66 && ammo_bomb > 0) {
		  ammo_bomb -= 1;
		  syncUI();
		  
		  var pos = player.className;
          var bomb = create('DIV','bomb');
		  bomb.innerHTML = '<div></div>';
		  
		  if (pos == 'top') {
		    bomb.style.left = getX(player);
		    if (getY(player) + 25 < r5(y / 1.085)) bomb.style.top = getY(player) + 25;
			else bomb.style.top = getY(player);
	      }
		  
		  if (pos == 'left') {
		    if (getX(player) + 25 < r5(x / 1.03)) bomb.style.left = getX(player) + 25;
			else bomb.style.left = getX(player);
			bomb.style.top = getY(player);
		  }
		  
		  if (pos == 'bottom') {
		    bomb.style.left = getX(player);
		    if (getY(player) - 20 > 35) bomb.style.top = getY(player) - 20;
			else bomb.style.top = getY(player);
	      }
		  
		  if (pos == 'right') {
		    if (getX(player) - 20 > 10) bomb.style.left = getX(player) - 20;
			else bomb.style.left = getX(player);
			bomb.style.top = getY(player);
		  }
		  
		  if (pos == 'top-left') {
		    if (getX(player) + 20 < r5(x / 1.03)) bomb.style.left = getX(player) + 20;
			else bomb.style.left = getX(player);
		    if (getY(player) + 20 < r5(y / 1.085)) bomb.style.top = getY(player) + 20;
			else bomb.style.top = getY(player);
		  }
		  
		  if (pos == 'bottom-left') {
		    if (getX(player) + 20 < r5(x / 1.03)) bomb.style.left = getX(player) + 20;
			else bomb.style.left = getX(player);
		    if (getY(player) - 15 > 35) bomb.style.top = getY(player) - 15;
			else bomb.style.top = getY(player);
		  }
		  
		  if (pos == 'top-right') {
		    if (getX(player) - 15 > 10) bomb.style.left = getX(player) - 15;
			else bomb.style.left = getX(player);
		    if (getY(player) + 20 < r5(y / 1.085)) bomb.style.top = getY(player) + 20;
			else bomb.style.top = getY(player);
		  }
		  
		  if (pos == 'bottom-right') {
		    if (getX(player) - 15 > 10) bomb.style.left = getX(player) - 15;
			else bomb.style.left = getX(player);
		    if (getY(player) - 15 > 35) bomb.style.top = getY(player) - 15;
			else bomb.style.top = getY(player);
		  }

          bodyAppend(bomb);
		}
		
		// Homing photon 
		if (ammo_homing > 0 && e.keyCode == 72) {
		  var h_photon = create('DIV','photon','homing');
		  h_photon.style.left = getX(player) + 5;
		  h_photon.style.top = getY(player) + 5;
		  bodyAppend(h_photon);
		  
		  playerProjectile(h_photon, 'homing', 'auto', 5, 1);
		}
		
		// photon barrage
		if (current_weapon == 2 && e.keyCode == 32) {
		  if (ammo_barrage < 1) { selectWeapon(1); return defaultAttack() }
		  ammo_barrage -= 1;
		  shotsFired += 1;
		  syncUI();
		  var loops = 0;
		  var pos = player.className;
		  var a_photon = create('DIV','photon','barrage');
		  a_photon.innerHTML = '<div id="b1"></div><div id="b2"></div><div id="b3"></div><div id="b4"></div>';
		  a_photon.style.left = getX(player) + 5;
		  a_photon.style.top = getY(player) + 5;
		  bodyAppend(a_photon);
		  
		  
		  var barrageDelay = window.setInterval(function() {
		    if (gamePaused === true) return;
		    if (loops == 30 || a_photon.parentNode == null || getX(a_photon) < 15 || getY(a_photon) < 35 || getX(a_photon) > r5(x / 1.03) || getY(a_photon) > r5(y / 1.085)) {
		      shotsFired += 8;
		  
		      photonBarrage(a_photon, 'decrement', 'left');
			  photonBarrage(a_photon, 'decrement', 'top');
              photonBarrage(a_photon, 'increment', 'right');
			  photonBarrage(a_photon, 'increment', 'bottom');
              photonBarrage(a_photon, 'decrement', 'top-left');
		      photonBarrage(a_photon, 'inc/dec', 'top-right');
			  photonBarrage(a_photon, 'dec/inc', 'bottom-left');
		  	  photonBarrage(a_photon, 'increment', 'bottom-right');
			
			  if (a_photon.parentNode != null) bodyRemove(a_photon);
		      return window.clearInterval(barrageDelay);
		    }
		  
		    loops += 1;
		    if (pos == 'left') a_photon.style.left = getX(a_photon) - 5;
		    if (pos == 'top') a_photon.style.top = getY(a_photon) - 5;
		    if (pos == 'right') a_photon.style.left = getX(a_photon) + 5;
		    if (pos == 'bottom') a_photon.style.top = getY(a_photon) + 5;
		    if (pos == 'top-left') { a_photon.style.left = getX(a_photon) - 5; a_photon.style.top = getY(a_photon) - 5; }
		    if (pos == 'top-right') { a_photon.style.left = getX(a_photon) + 5; a_photon.style.top = getY(a_photon) - 5; }
		    if (pos == 'bottom-left') { a_photon.style.left = getX(a_photon) - 5; a_photon.style.top = getY(a_photon) + 5; }
		    if (pos == 'bottom-right') {  a_photon.style.left = getX(a_photon) + 5; a_photon.style.top = getY(a_photon) + 5; }
		  },1);
		} 
		
		
		// tri-photon
		if (current_weapon == 3 && e.keyCode == 32) {
		  if (ammo_tri < 1) { selectWeapon(1); return defaultAttack() }
		  ammo_tri -= 1;
		  shotsFired += 3;
		  syncUI();
		
		  var pos = player.className;
		  var p1 = create('DIV','photon','tri1');
		  var p2 = create('DIV','photon','tri2');
		  var p3 = create('DIV','photon','tri3');
		  bodyAppend(p1);
		  bodyAppend(p2);
		  bodyAppend(p3);
		  
		  if (pos == 'top') {
		    p1.style.left = getX(player) + 5;
		    p1.style.top = getY(player) - 5;
		    p2.style.left = getX(player) + 15;
		    p2.style.top = getY(player) + 5;
		    p3.style.left = getX(player) - 5;
		    p3.style.top = getY(player) + 5;
		  
		    playerProjectile(p1, 'decrement', 'top', 5 ,1);
            playerProjectile(p2, 'decrement', 'top', 5 ,1);
			playerProjectile(p3, 'decrement', 'top', 5 ,1);
		  }
		  
		  if (pos == 'left') {
		    p1.style.left = getX(player) - 5;
		    p1.style.top = getY(player) + 5;
		    p2.style.left = getX(player) + 5;
		    p2.style.top = getY(player) + 15;
		    p3.style.left = getX(player) + 5;
		    p3.style.top = getY(player) - 5;
			
		    playerProjectile(p1, 'decrement', 'left', 5 ,1);
            playerProjectile(p2, 'decrement', 'left', 5 ,1);
			playerProjectile(p3, 'decrement', 'left', 5 ,1);
		  }
		  
		  if (pos == 'right') {
		    p1.style.left = getX(player) + 15;
		    p1.style.top = getY(player) + 5;
		    p2.style.left = getX(player) + 5;
		    p2.style.top = getY(player) + 15;
		    p3.style.left = getX(player) + 5;
		    p3.style.top = getY(player) - 5;
		  
		    playerProjectile(p1, 'increment', 'right', 5 ,1);
            playerProjectile(p2, 'increment', 'right', 5 ,1);
            playerProjectile(p3, 'increment', 'right', 5 ,1);
		  }
		  
		  if (pos == 'bottom') {
		    p1.style.left = getX(player) + 5;
		    p1.style.top = getY(player) + 15;
		    p2.style.left = getX(player) + 15;
		    p2.style.top = getY(player) + 5;
		    p3.style.left = getX(player) - 5;
		    p3.style.top = getY(player) + 5;
		  
		    playerProjectile(p1, 'increment', 'bottom', 5 ,1);
            playerProjectile(p2, 'increment', 'bottom', 5 ,1);
			playerProjectile(p3, 'increment', 'bottom', 5 ,1);
		  }
		  
		  if (pos == 'top-left') {
		    p1.style.left = getX(player);
		    p1.style.top = getY(player) - 5;
		    p2.style.left = getX(player) + 15;
		    p2.style.top = getY(player);
		    p3.style.left = getX(player);
		    p3.style.top = getY(player) + 10;
			
		    playerProjectile(p1, 'decrement', 'top-left', 5 ,1);
            playerProjectile(p2, 'decrement', 'top-left', 5 ,1);
			playerProjectile(p3, 'decrement', 'top-left', 5 ,1);
		  }
		  
		  if (pos == 'top-right') {
		    p1.style.left = getX(player) + 10;
		    p1.style.top = getY(player) - 5;
		    p2.style.left = getX(player) + 10;
		    p2.style.top = getY(player) + 10;
		    p3.style.left = getX(player) - 5;
		    p3.style.top = getY(player);
			
		    playerProjectile(p1, 'inc/dec', 'top-right', 5 ,1);
            playerProjectile(p2, 'inc/dec', 'top-right', 5 ,1);
			playerProjectile(p3, 'inc/dec', 'top-right', 5 ,1);
		  }
		  
		  if (pos == 'bottom-left') {
		    p1.style.left = getX(player);
		    p1.style.top = getY(player) + 10;
		    p2.style.left = getX(player);
		    p2.style.top = getY(player) - 5;
		    p3.style.left = getX(player) + 15;
		    p3.style.top = getY(player) + 5;
			
		    playerProjectile(p1, 'dec/inc', 'bottom-left', 5 ,1);
            playerProjectile(p2, 'dec/inc', 'bottom-left', 5 ,1);
			playerProjectile(p3, 'dec/inc', 'bottom-left', 5 ,1);
		  }
		  
		  if (pos == 'bottom-right') {
		    p1.style.left = getX(player) + 15;
		    p1.style.top = getY(player) + 15;
		    p2.style.left = getX(player) + 15;
		    p2.style.top = getY(player);
		    p3.style.left = getX(player);
		    p3.style.top = getY(player) + 10;
			
		    playerProjectile(p1, 'increment', 'bottom-right', 5 ,1);
            playerProjectile(p2, 'increment', 'bottom-right', 5 ,1);
			playerProjectile(p3, 'increment', 'bottom-right', 5 ,1);
		  }
		}
      }
      // END Key functions
    }
