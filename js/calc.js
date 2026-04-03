// mobile UI
if (isMobile()) {
	toggleSidebar();
}

// resized to mobile UI
window.addEventListener('resize', () => {
	const collapsed = document.querySelector(".sidebar").classList.contains("collapsed");
	if (isMobile()) {
		if (!collapsed) {
			toggleSidebar();
		}
	}
	else {
		if (collapsed) {
			toggleSidebar();
		}
	}
});

function addRows(id, nInput) { // id of target table, id of input field
	const temp = document.getElementById(nInput);
	if (temp.value > 10) temp.value = 10; // limit max rows to 10 at a time
	for (let i = 0; i < temp.value; i++) {
		addRow(id, false);
	}
	makeNavTable(id);
	temp.value = 1;
}

function addRow(id, autoupdate = false) {
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

	if (autoupdate) makeNavTable(id);
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

// conversions
const pBoundaries = [98, 93, 90, 87, 83, 80, 77, 73, 70, 67, 63, 60, 50];
const letterGrade = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
const point = [4, 4, 3.67, 3.33, 3, 2.67, 2.33, 2, 1.67, 1.33, 1, 0.67, 0.33, 0];

function convertToLetter(percentage) {
	for (let i = 0; i < 13; i++) {
		if (Math.round(percentage) >= pBoundaries[i]) return letterGrade[i];
	}
	return "NG";
}

function convertToPoints(letter) {
	for (let i = 0; i < letterGrade.length; i++) {
		if (letterGrade[i] == letter) return point[i];
	}
	return 0;
}

// adapted from vipranarayan14/navigable-table.html
function makeNavTable(tableId, activeCell = 0) {
	const table = document.getElementById(tableId);

	if (!table._navInitialized) table._navInitialized = true;

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
		if (!cells[i]._clickInitialized) {
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
	}


	table.addEventListener("keydown", function (e) {
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

function togglePrivacy() {
	const targets = Array.from(document.querySelectorAll("input")).concat(Array.from(document.querySelectorAll(".result")));
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

function toggleSidebar() {
	const sidebar = document.querySelector(".sidebar");
	const sidebarAnchor = document.querySelector(".sidebar-anchor");

	sidebar.classList.toggle("collapsed");
	sidebarAnchor.classList.toggle("collapsed");

	const close = document.querySelector(".closeicon");
	const expand = document.querySelector(".expandicon");
	close.classList.toggle("hidden");
	expand.classList.toggle("hidden");

	if (isMobile()) {
		if (sidebar.classList.contains("collapsed")) {
			document.querySelector(".main").classList.remove("hidden");
			document.querySelector("#darkmode").classList.remove("hidden");
		}
		else {
			document.querySelector(".main").classList.add("hidden");
			document.querySelector("#darkmode").classList.add("hidden");
		}
	}
}