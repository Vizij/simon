$(document).ready(function() {
	var $count = $("#count");
	var $start = $("#start");
	var $strict = $("#strict");
	var $strictLight = $("#strictLight");
	var $colors = $("#green, #red, #yellow, #blue");
	var $green = $("#green");
	var $red = $("#red");
	var $yellow = $("#yellow");
	var $blue = $("#blue");
	var $power = $(".power");
	var $body = $("body");

	var power = false;
	var active = false;
	var strictGame = false;
	var repeat = false;
	var count = 0;
	var gSequence = [];
	var hSequence = [];
	var reboot = false;
	var restart = false;
	var colors = ["G", "R", "Y", "B"];
	var beepG = new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
	var beepR = new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
	var beepY = new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
	var beepB = new Audio ("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
	var o1812 = new Audio ("audio/1812_overture.mp3");

	$power.on("click", function() {
		$power.toggleClass("off");
		if (!power) {
			power = true;
			reboot = false;
			restart = false;
			$count.css("color", "red");
		} else {
			power = false;
			active = false;
			strictGame = false;
			repeat = false;
			count = 0;
			gSequence = [];
			hSequence = [];
			$strictLight.css("background-color", "black");
			$count.css("color", "#720A1B");
			$count.text("--");
			$power.off("click.reboot");
		}
	});

	$strict.on("click", function() {
		if (power) {
			if (!strictGame) {
				strictGame = true;
				$strictLight.css("background-color", "red");
			} else {
				strictGame = false;
				$strictLight.css("background-color", "black");
			}
		}
	});

	$start.on("click", function() {
		if (power) {
			if (!active) { // Start new game
				active = true;
				restart = false;
				$start.off("click.restart");
				gameStart();
			} else { // Cancel current game
				active = false;
				repeat = false;
				count = 0;
				gSequence = [];
				hSequence = [];
				$count.text("NG");
			}
		}
	});

	function gameStart() {
		// 'Cancel Game' scenarios
		$power.on("click.reboot", function() {reboot = true;});
		$start.on("click.restart", function() {restart = true;});
		if (reboot || restart) {return;}
		// Variables
		var x = Math.floor(Math.random() * 4);
		var c = colors[x];
		var delay = 750;
		// Update count
		if (!repeat) {count++;}
		if (count === 21) {return winningAnimation();} // 'Win Game' scenario
		if (count < 10) {$count.text("0" + count);} else {$count.text(count);}
		// Game turn
		if (!repeat) {gSequence.push(c);}
		gSequence.forEach(function(color) {
			delay += 750;
			window.setTimeout(function() {fourCorners(color);}, delay);
		});
		// Human turn
		hSequence = [];
		window.setTimeout(function() {toggleUserInput("enable");}, delay);
		delay += delay + 2000;
		// Sequence check
		window.setTimeout(function() {
			toggleUserInput("disable");
			for (var i = 0, gLen = gSequence.length; i < gLen; i++) {
				if (gSequence[i] !== hSequence[i]) {
					if (!strictGame) {
						repeat = true;
					} else {
						count = 0;
						gSequence = [];
					}
					$count.text("!!");
					window.setTimeout(function() {
						gameStart(); // Repeat round or start over
					}, 1500);
					break;
				}
				if (i === gLen - 1) {
					repeat = false;
					gameStart(); // Next round
				}
			}
			// Remove handlers
			$power.off("click.reboot");
			$start.off("click.restart");
		}, delay);
	}

	function fourCorners(color) {
		if (power) {
			switch (color) {
				case "G":
					$green.css("background-color", "#11D843");
					beepG.play();
					window.setTimeout(function() {$green.css("background-color", "green");}, 500);
					break;
				case "R":
					$red.css("background-color", "red");
					beepR.play();
					window.setTimeout(function() {$red.css("background-color", "#990303");}, 500);
					break;
				case "Y":
					$yellow.css("background-color", "yellow");
					beepY.play();
					window.setTimeout(function() {$yellow.css("background-color", "#CCC026");}, 500);
					break;
				case "B":
					$blue.css("background-color", "#289BFF");
					beepB.play();
					window.setTimeout(function() {$blue.css("background-color", "#185D99");}, 500);
					break;
			}
		}
	}

	function toggleUserInput(command) {
		if (command === "enable") {
			$green.on("click", function() {
				hSequence.push("G");
				fourCorners("G");
			});
			$red.on("click", function() {
				hSequence.push("R");
				fourCorners("R");
			});
			$yellow.on("click", function() {
				hSequence.push("Y");
				fourCorners("Y");
			});
			$blue.on("click", function() {
				hSequence.push("B");
				fourCorners("B");
			});
		} else if (command === "disable") {
			$colors.off();
		}
	}

	function winningAnimation() {
		$count.text("W!");
		for (var i = 0; i < 4; i++) {
			window.setTimeout(function() {fourCorners("G");}, 200 + (i * 800));
			window.setTimeout(function() {fourCorners("R");}, 400 + (i * 800));
			window.setTimeout(function() {fourCorners("Y");}, 600 + (i * 800));
			window.setTimeout(function() {fourCorners("B");}, 800 + (i * 800));
		}
		window.setTimeout(function() {
			$body.addClass("fireworks");
			o1812.play();
		}, 3500);
	}
});
