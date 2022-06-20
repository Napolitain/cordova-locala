/* Tictactoe game in local
 * No IA (1v1 on same device)
 * SVG animations
 */

var Tictactoe = {
	init : function() {
		Tictactoe.game = Table.create(3, 3, ' ');
		Tictactoe.turn = 'x';
		Tictactoe.timeFlag = 0;
		var tmp1 = window.innerWidth;
		var tmp2 = document.querySelector('svg.svg.tictactoe');
		if (parseInt(tmp2.getAttribute('width')) >= tmp1 - 20) {
			Tictactoe.scaling = (tmp1 / (parseInt(tmp2.getAttribute('width')) + 50));
			tmp2.style.transform = 'scale(' + Tictactoe.scaling.toString() + ')';
			var tmp4 = ((parseInt(tmp2.getAttribute('width')) - parseInt(tmp2.getAttribute('width')) * Tictactoe.scaling.toString()) / 2).toString();
			tmp2.style.left = '-' + tmp4 + 'px';
		}

		// models
		// always g group element first item in array in models
		// then always path
		Tictactoe.models = {
			'x':[
				{
					'class':"tictactoe cross"
				},
				{
					'class':"tictactoe a",
					'd':"m 20 20 l 60 60"
				},
				{
					'class':"tictactoe b",
					'd':"m 80 20 l -60 60"
				}
			],
			'o':[
				{
					'class':"tictactoe circle"
				},
				{
					'class':"tictactoe a",
					'd':"m 20 50 a 30 30 0 0 1 60 0"
				},
				{
					'class':"tictactoe b",
					'd':"m 80 50 a 30 30 0 0 1 -60 0"
				}
			]
		};

		// updated map init
		var temp = document.querySelectorAll('g.tictactoe.case');
		for (var i = 0; i < temp.length; i++) {
    		temp[i].parentElement.removeChild(temp[i]);
		}
		for (var i = 0; i < Tictactoe.game.length; i++) {
			for (var j = 0; j < Tictactoe.game[0].length; j++) {
				var temp = SVG.create('g');
				temp.setAttribute('class', 'tictactoe case');
				temp.setAttribute('x', j.toString());
				temp.setAttribute('y', i.toString());
				SVG.add(temp, 'svg.svg.tictactoe');
				var temp = SVG.create('path');
				temp.setAttribute('class', 'tictactoe blank');
				temp.setAttribute('d', 'M ' + (50 + j*100).toString() + ' ' + (50 + i*100).toString() + ' l 100 0 l 0 100 l -100 0 l 0 -100');
				temp.addEventListener('mousedown', Tictactoe.play);
				SVG.add(temp, 'g.tictactoe.case:last-child'); // append to last g element
			}
		}
		document.querySelector('.tictactoe.victory').style.opacity = 0;
		document.querySelector('div.main.tictactoe').addEventListener('mousedown', Tictactoe.eventInit); // self overwrite
	},

	eventInit : function() {
		if (Date.now() - Tictactoe.timeFlag <= 150) {
			Tictactoe.init();
		} else {
			Tictactoe.timeFlag = Date.now();
		}
	},

	play : function(event) { // element is case
		var element = event.target.parentElement;
		if (element.classList.contains('filled')) {
			return false;
		} else {
			// update game rough data
			Tictactoe.game[parseInt(element.getAttribute('y'))][parseInt(element.getAttribute('x'))] = Tictactoe.turn;

			// prepare to draw
			/*
			var gBound = element.getBoundingClientRect();
			var gPos = [gBound.left + window.scrollX, gBound.top + window.scrollY]; // get document pos and correction regarding the scroll
			var newX = gPos[0] - 6; // margin
			var newY = gPos[1] - 6;
			*/
			var newX = 50 + (100 * parseInt(element.getAttribute('x')));
			var newY = 50 + (100 * parseInt(element.getAttribute('y')));
			var tmpClass = element.getAttribute('class');
			element.setAttribute('class', tmpClass + ' filled ' + Tictactoe.turn)

			var model = Tictactoe.models[Tictactoe.turn];
			// turn === 'x' ? turn = 'o' : turn = 'x'; moved to the end, after victory check

			var newGroup = SVG.create('g');
			for (var k in model[0]) {
				newGroup.setAttribute(k, model[0][k]);
			}
			element.appendChild(newGroup);

			for (var i = 1; i < model.length; i++) {
				var newDraw = SVG.create('path');
				for (var k in model[i]) {
					if (k === 'd') {
						newDraw.setAttribute(k, 'm ' + newX + ' ' + newY + ' ' + model[i][k]);
					} else {
						newDraw.setAttribute(k, model[i][k]);
					}
				}
				newGroup.appendChild(newDraw);
			}
			if (Tictactoe.checkWin() !== false) { // if win
				var vctmp = document.querySelector('.tictactoe.victory');
				if (Tictactoe.turn === 'x') {
					vctmp.innerHTML = 'x won!'; // no IA in this
				} else {
					vctmp.innerHTML = 'o won!';
				}
				vctmp.style.opacity = 1;
				var temp = document.querySelectorAll('path.tictactoe.blank'); // remove event until init back
				for (var i = 0; i < temp.length; i++) {
					temp[i].removeEventListener('mousedown', Tictactoe.play);
				}
			}

			Tictactoe.turn === 'x' ? Tictactoe.turn = 'o' : Tictactoe.turn = 'x';
		}
	},

	checkWin : function() {
		return Table.pattern(Tictactoe.game, Tictactoe.turn.repeat(3)); // Table is an array pattern utilies self made library
	}
}
