var Harehounds = {
	init : function() {
		Harehounds.turn = 'dog';
		Harehounds.toggle = false;
		var tmp1 = window.innerHeight;
		var tmp2 = document.querySelector('svg.svg.harehounds');
		if (parseInt(tmp2.getAttribute('height')) >= tmp1 - 20) {
			Harehounds.scaling = (tmp1 / (parseInt(tmp2.getAttribute('height'))));
			tmp2.style.transform = 'scale(' + Harehounds.scaling.toString() + ')';
			var tmp4 = ((parseInt(tmp2.getAttribute('height')) - parseInt(tmp2.getAttribute('height')) * Harehounds.scaling + 15.5) / 2).toString(); // 15.5 is half of 36 (left)
			tmp2.style.left = '-' + tmp4 + 'px';
		}
		if (Harehounds.events === undefined) {
			var temp = document.querySelectorAll('path.harehounds.case');
			for (var i = 0; i < temp.length; i++) {
				temp[i].parentElement.addEventListener('mousedown', Harehounds.play);
			}
			Harehounds.events = true;
		}
	},

	play : function(event) {
		var acase = this.children[0]; // this is stable, whereas event.target is about element or its child
		var pet = this.children[1];
		if (acase.classList.contains('toggle')) { // erase toggle
			acase.setAttribute('class', 'harehounds case');
			Harehounds.toggle = false;
		} else {
			if (Harehounds.toggle === true && pet === undefined) { // move
				var temp = document.querySelector('path.harehounds.case.toggle');
				var oldLoc = JSON.parse(temp.getAttribute('loc'));
				var newLoc = JSON.parse(acase.getAttribute('loc'));
				var loc = [newLoc[0] - oldLoc[0], newLoc[1] - oldLoc[1]];
				if (((Harehounds.turn === 'dog' && loc[0] >= 0) || (Harehounds.turn === 'rabbit')) && temp.getAttribute('roads').indexOf(acase.getAttribute('loc')) !== -1) {
					temp.setAttribute('class', 'harehounds case');
					temp.parentElement.removeChild(temp.parentElement.children[1]);
					var temp = 'm ' + (75*loc[1]).toString() + ' ' + (75*loc[0]).toString() + ' ' + Harehounds.pet.getAttribute('d');
					Harehounds.pet.setAttribute('d', temp);
					acase.parentElement.appendChild(Harehounds.pet);
					Harehounds.toggle = false;
					if (Harehounds.checkWin()) {
						var vctmp = document.querySelector('text.harehounds.victory');
						vctmp.style.opacity = 1;
						vctmp.innerHTML = (Harehounds.turn + ' won!');
						return false; // must disable moving ability
					}
					Harehounds.turn === 'dog' ? Harehounds.turn = 'rabbit' : Harehounds.turn = 'dog';
				}
			} else { // add toggle
				if (pet.classList.contains(Harehounds.turn) && Harehounds.toggle === false) {
					var temp = acase.getAttribute('class');
					acase.setAttribute('class', temp + ' toggle');
					Harehounds.toggle = true;
					Harehounds.pet = pet.cloneNode(true);
				}
			}
		}
	},

	checkWin : function() {
		var rabbit = document.querySelector('path.harehounds.rabbit');
		if (Harehounds.turn === 'rabbit') { // if rabbit is on first case 1, 2 : win
			if (rabbit.parentElement.children[0].getAttribute('loc') === '[1, 2]') {
				return true;
			} else {
				return false;
			}
		} else { // if all roads of rabbit lead to dog
			var roads = JSON.parse(rabbit.parentElement.children[0].getAttribute('roads'));
			for (var i = 0; i < roads.length; i++) {
				if (document.querySelector('path.case[loc="' + JSON.stringify(roads[i]).split(',').join(', ') + '"]').parentElement.children.length === 1) {
					return false;
				}
			}
			return true;
		}
	}
}
