function swap_page(element) {
	var temp = document.querySelectorAll('div.main');
	for (var i = 0; i < temp.length; i++) {
		if (temp[i].style.display == 'block') {
			document.querySelector(element).style.display = 'block';
			temp[i].style.display = 'none';
		}
		break;
	}
}
