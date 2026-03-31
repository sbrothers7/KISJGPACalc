window.onload = () => {
	// const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
	// if (darkThemeMq.matches) {
	// 	toggleDarkMode();
	// 	document.cookie = "darkmode=true";
	// }
	if (getCookie("darkmode") == "true") toggleDarkMode();
}

window.addEventListener('unload', function () {
	document.documentElement.innerHTML = '';
}); // fix memory increase after reload

function addRow(id) {
	const table = document.getElementById(id);
	const row = document.createElement("tr");
	table.append(row);

	const formative = document.createElement("td");
	const summative = document.createElement("td");
	row.append(formative);
	row.append(summative);

	const fInput = document.createElement("input");
	const sInput = document.createElement("input")

	formative.appendChild(fInput);
	summative.appendChild(sInput);

	fInput.classList.add(id + "f");
	sInput.classList.add(id + "s");
	fInput.type = "number";
	sInput.type = "number";
	fInput.autocomplete = "off";
	sInput.autocomplete = "off";
}

function setupSemester(tableId, semester) {
	const table = document.getElementById(tableId);

	table.addEventListener("change", (e) => {
		const target = e.target;
		if (target.classList.contains(`${tableId}f`)) calcColAvg(`${tableId}f`);
		else if (target.classList.contains(`${tableId}s`)) calcColAvg(`${tableId}s`);

		calcDomainSem(semester);
	});
}

function toggleDarkMode() {
	document.documentElement.classList.toggle("dark");
	setCookie("darkmode", document.documentElement.classList.contains("dark"), 365);
}

function calcColAvg(id) {
	const values = document.getElementsByClassName(id);
	let total = 0;
	let count = 0;

	for (let i = 0; i < values.length; i++) {
		if (values[i].value == '') continue;
		count++;
		total += parseFloat(values[i].value);
	}

	if (count > 0) document.getElementById(id).value = parseFloat((total / count).toFixed(2));
	else document.getElementById(id).value = '';
}

function calcDomainSem(semester, final = document.getElementById("finalcheck").checked) {
	const favg = parseFloat(document.getElementById(`s${semester}f`).value);
	const savg = parseFloat(document.getElementById(`s${semester}s`).value);
	const target = document.getElementById(`s${semester}domain`);

	let res;

	if (final) {
		// console.log("Core/AP Course");
		let finalGrade = parseFloat(document.getElementById(`s${semester}final`).value);
		if (Number.isNaN(finalGrade)) res = parseFloat(((favg * 20 + savg * 60) / 80).toFixed(1));
		else res = parseFloat(((favg * 20 + savg * 60 + finalGrade * 20) / 100).toFixed(1));
		// console.log(res);
		if (!Number.isNaN(res)) target.innerText = `${res} (${convertToLetter(res)})`;
		else target.innerText = "";
	}
	else {
		// console.log("Elective Course");
		res = parseFloat(((favg * 20 + savg * 80) / 100).toFixed(1));
		if (!Number.isNaN(res)) target.innerText = `${res} (${convertToLetter(res)})`;
		else target.innerText = "";
	}
}

function convertToLetter(percentage) {
	const pref = [98, 93, 90, 87, 83, 80, 77, 73, 70, 67, 63, 60, 50];
	const letter = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
	for (let i = 0; i < 13; i++) {
		if (Math.round(percentage) >= pref[i]) return letter[i];
	}
	return "NG";
}


// adapted from vipranarayan14/navigable-table.html
function makeNavTable(tableId, activeCell = 0) {
	const table = document.getElementById(tableId);

	table.addEventListener('focus', function () {
		var focusedTable = document.querySelector('#' + table + ':focus');
		if (focusedTable) focusedTable.style.outline = 'none';
	});

	// if (focus_NavTable_onLoad) table.focus();

	let cells = table.querySelectorAll('tr td');
	let active = activeCell;

	makeCellActive();

	// write 1,2,3... in the 'td's and add clickListener
	for (let i = 0; i < cells.length; i++) {
		if (!cells[i].innerHTML) {
			cells[i].innerHTML = i;
		}
		cells[i].addEventListener('click', function (e) {
			// console.log(e.target.nodeName);
			if (e.target.nodeName == "INPUT") { // fix clicking on input failing to update active cell
				active = Array.prototype.indexOf.call(cells, e.target.parentNode);
			}
			else if (e.target.nodeName == "TD") {
				active = Array.prototype.indexOf.call(cells, e.target);
			}
			else return;
			makeCellActive();
		});
	}


	table.addEventListener('keydown', function (e) {
		if (
			e.key == "ArrowDown" ||
			e.key == "ArrowUp" ||
			e.key == "ArrowLeft" ||
			e.key == "ArrowRight" ||
			e.key == "h" ||
			e.key == "j" ||
			e.key == "k" ||
			e.key == "l" ||
			e.key == "Tab"
		) {
			e.preventDefault();
			calculateActiveCell(e);
			makeCellActive();
			return false;
		}
	});

	function calculateActiveCell(e) {
		var rows = table.querySelectorAll('tr').length;
		var columns = table.querySelectorAll('tr')[0].childElementCount;

		if (e.key == "ArrowLeft" || e.key == "h") { //move left or wrap
			active = (active > 0) ? active - 1 : active;
		}
		if (e.key == "ArrowUp" || e.key == "k") { // move up
			active = (active - columns >= 0) ? active - columns : active;
		}
		if (e.key == "ArrowRight" || e.key == "l") { // move right or wrap
			active = (active < cells.length - 1) ? active + 1 : active;
		}
		if (e.key == "ArrowDown" || e.key == "j") { // move down
			active = (active + columns <= cells.length - 1) ? active + columns : active;
		}
		if (e.key == "Tab") { // tab to move fixed
			if (e.shiftKey) active = Math.max(0, --active);
			else active = Math.min(cells.length - 1, ++active);
		}

	}

	function makeCellActive() {
		var activeTDs = table.querySelectorAll('.active');
		for (var i = 0; i < activeTDs.length; i++) {
			activeTDs[i].classList.remove('active');
		}

		cells[active].classList.add('active');
		cells[active].children[0].select();
		cells[active].children[0].focus();
	}
}

// cookie stuff
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cookieName) {
	const cookies = document.cookie.split('; ');
	for (const cookie of cookies) {
		const [name, value] = cookie.split('=');
		if (name === cookieName) {
			return decodeURIComponent(value);
		}
	}
	return null;
}

function togglePrivacy() {
	const targets = Array.from(document.querySelectorAll("input")).concat(Array.from(document.querySelectorAll(".domain")));
	for (let i = 0; i < targets.length; i++) targets[i].classList.toggle("private");
}

function clearSem(semester) {
	const f = document.querySelectorAll(`input.s${semester}f`);
	const s = document.querySelectorAll(`input.s${semester}s`);
	for (let i = 0; i < f.length; i++) {
		f[i].value = "";
		s[i].value = "";
	}

	document.getElementById(`s${semester}f`).value = "";
	document.getElementById(`s${semester}s`).value = "";
	document.getElementById(`s${semester}domain`).innerHTML = "";

}