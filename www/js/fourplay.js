/* Fourpower game
 * IA (propose coop game against several difficulties)
 * Player goes first
 * SVG animations
 */

var Fourplay = {
	init : function() {
		Fourplay.game = Table.create(7, 6, ' ');
		Fourplay.elevation = [6, 6, 6, 6, 6, 6, 6];
		Fourplay.turn = 'yellow';
		Fourplay.timeFlag = 0;
		Fourplay.scaling = 1;
		Fourplay.victory = false;
		var tmp1 = window.innerWidth;
		var tmp2 = document.querySelector('svg.svg.fourplay');
		if (parseInt(tmp2.getAttribute('width')) >= tmp1 - 20) {
			Fourplay.scaling = (tmp1 / (parseInt(tmp2.getAttribute('width'))));
			tmp2.style.transform = 'scale(' + Fourplay.scaling.toString() + ')';
			var tmp4 = ((parseInt(tmp2.getAttribute('width')) - parseInt(tmp2.getAttribute('width')) * Fourplay.scaling + 15.5) / 2).toString(); // 15.5 is half of 36 (left)
			tmp2.style.left = '-' + tmp4 + 'px';
		}

		// map graphics
		document.querySelector('.fourplay.victory').style.opacity = 0;
		var temp = document.querySelector('g.fourplay.cases');
		for (var i = temp.children.length; i > 0; i--) { // remove cases
			temp.removeChild(temp.children[i-1]);
		}
		Fourplay.pmap = document.querySelector('g.fourplay.table'); // overwrite
		if (Fourplay.pmap.children[0] === undefined) {
			Fourplay.map = SVG.create('path'); // map creation
			Fourplay.map.setAttribute('class', 'fourplay box');
			var tmpPath = [['M 30 80 l 0 300 l 390 0 l 0 -300'], []];
			for (var i = 0; i < Fourplay.game[0].length; i++) {
				tmpPath[0].push('l -40 0');
				for (var j = 0; j < Fourplay.game.length-1; j++) {
					tmpPath[0].push('l 0 10');
					tmpPath[0].push('a 20 20 0 0 1 0 37.32050807568877'); // non complete circle
					tmpPath[1].push('a 20 20 0 0 1 0 -37.32050807568877'); // using cos/sin
					tmpPath[1].push('l 0 -10');
				}
				tmpPath[0].push('l 0 10 a 20 20 0 0 1 0 37.32050807568877 a 20 20 0 0 1 -10.471975511965976 0 a 20 20 0 0 1 0 -37.32050807568877 l 0 -10');
				tmpPath[0] = tmpPath[0].concat(tmpPath[1]); // tmpPath[1] is added to tmpPath[0] after first level loop repeats
				tmpPath[1] = [];
			}
			tmpPath[0].push('z');
			Fourplay.map.setAttribute('d', tmpPath[0].join(' '));
			SVG.add(Fourplay.map, 'g.fourplay.table');
			setTimeout(function() {
				Fourplay.map.setAttribute('class', 'fourplay box completed');
				document.addEventListener('mousedown', Fourplay.event);
				document.addEventListener('mousemove', Fourplay.play.move);
				document.addEventListener('mouseup', Fourplay.play.drop);
			}, 3100);
		}

		/*
		document.addEventListener('mousedown', Fourplay.event);
		document.addEventListener('mousemove', Fourplay.play.move);
		document.addEventListener('mouseup', Fourplay.play.drop);
		*/

		Fourplay.positions = document.querySelector('path.fourplay.box').getBoundingClientRect();
		Fourplay.state = 0;
	},

	event : function(event) {
		if ((event.clientX >= Fourplay.positions.left && event.clientX <= Fourplay.positions.right) && (event.clientY >= Fourplay.positions.top && event.clientY <= Fourplay.positions.bottom)) {
			Fourplay.play.make(event.clientX, event.clientY);
		} else {
			if (Date.now() - Fourplay.timeFlag <= 150) {
				Fourplay.init();
			} else {
				Fourplay.timeFlag = Date.now();
			}
		}
	},

	play : {
		make : function(x, y) {
			Fourplay.play.columnLength = 50 * Fourplay.scaling;
			Fourplay.play.column = Math.round((x - Fourplay.positions.left) / Fourplay.play.columnLength); // unaccurate
			if (Fourplay.elevation[Fourplay.play.column-1] < 1) {return false;} // block overelevation
			if (Fourplay.victory === true) {return false;} // victory then
			if (Fourplay.play.column <= 0) {Fourplay.play.column = 1;} // force table zone play
			if (Fourplay.play.column >= 8) {Fourplay.play.column = 7;}
			Fourplay.play.chip = SVG.create('path');
			Fourplay.play.chip.setAttribute('class', 'fourplay case ' + Fourplay.turn);
			Fourplay.play.chip.setAttribute('d', 'M ' + (50 * Fourplay.play.column + 0.5 * Fourplay.play.column).toString() + ' 40 a 20 20 0 0 1 40 0 a 20 20 0 0 1 -40 0');
			Fourplay.play.chip.style.fill = Fourplay.turn;
			Fourplay.play.chip.style.transform = 'translate(0px, 0px)'; // default
			SVG.add(Fourplay.play.chip, 'g.fourplay.cases');
			Fourplay.state = 1;
		},

		move : function(event) {
			if (Fourplay.play.chip !== undefined) {
				var temp = Math.round((event.clientX - Fourplay.positions.left) / Fourplay.play.columnLength); // unaccurate
				if (temp <= 0) {temp = 1;}
				if (temp >= 8) {temp = 7;}
				if (Fourplay.play.column !== temp) {
					var xtmp = parseFloat(Fourplay.play.chip.style.transform.split('(')[1].split(',')[0]);
					Fourplay.play.chip.style.transform = 'translate(' + ((temp - Fourplay.play.column) * 50.5 + xtmp).toString() + 'px, 0px)';
					Fourplay.play.column = temp;
				}
			}
		},

		drop : function(event) {
			if (Fourplay.play.chip !== undefined) {
				var temp = Fourplay.play.chip.style.transform.split('(')[1].split(',')[0]; // 47.79248358765474 because it is 37.x + 10.y (precise answer not obvious)
				Fourplay.play.chip.style.transform = 'translate(' + temp + ',' + (47.79248358765474 * Fourplay.elevation[Fourplay.play.column-1] + 20).toString() + 'px)';
				SVG.add(Fourplay.pmap, 'svg.svg.fourplay'); // simulate z-index by repainting without animation table map
				Fourplay.game[Fourplay.elevation[Fourplay.play.column-1]-1][Fourplay.play.column-1] = Fourplay.turn;
				if (Fourplay.checkWin() !== false) { // if win
					Fourplay.victory = true;
					var vctmp = document.querySelector('.fourplay.victory');
					if (Fourplay.turn === 'yellow') {
						vctmp.innerHTML = 'yellow won!'; // no IA in this
					} else {
						vctmp.innerHTML = 'red won!';
					}
					vctmp.style.opacity = 1;
				}
				Fourplay.turn === 'yellow' ? Fourplay.turn = 'red' : Fourplay.turn = 'yellow';
				Fourplay.elevation[Fourplay.play.column-1]--;
				delete Fourplay.play.chip;
			}
		}
	},

	checkWin : function() {
		return Table.pattern(Fourplay.game, Fourplay.turn.repeat(4)); // Table is an array pattern utilies self made library
	}
}
