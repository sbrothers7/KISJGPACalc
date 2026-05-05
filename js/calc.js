// mobile UI
if (isMobile()) {
	toggleSidebar();
	document.addEventListener("click", (e) => {
		if (e.target == document.documentElement) {
			toggleSidebar();
		}
	});
}

// resized UI
window.addEventListener("resize", () => {
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

document.getElementById("privacy").addEventListener("change", () => {
	const targets = document.querySelectorAll("td");
	for (let i = 0; i < targets.length; i++) targets[i].classList.toggle("private");
});

function setupSubjects() {
	const datalist = document.getElementById("subjects");
	const subjects = [
		"Advanced Design and Technology",
		"Advanced Engineering",
		"Advanced Robotics",
		"Advanced String Orchestra",
		"Advanced Theater",
		"Algebra II",
		"AP Art",
		"AP Biology",
		"AP Calculus AB",
		"AP Calculus BC",
		"AP Chemistry",
		"AP Chinese Language and Culture",
		"AP Comparative Government and Politics",
		"AP Computer Science A",
		"AP Computer Science Principles",
		"AP Economics",
		"AP English Language and Composition",
		"AP English Literature and Composition",
		"AP Environmental Science",
		"AP Human Geography",
		"AP Music Theory",
		"AP Physics 1",
		"AP Physics C",
		"AP Psychology",
		"AP Research",
		"AP Seminar",
		"AP Spanish",
		"AP Statistics",
		"AP United States Government and Politics",
		"AP US History",
		"AP World History: Modern",
		"Biology",
		"Calculus",
		"Chamber Choir",
		"Chemistry",
		"Chinese",
		"Choir",
		"Concert Band",
		"Creative Writing",
		"Debate",
		"Design and Technology",
		"Digital Photography",
		"Earth Science",
		"Economics",
		"Engineering",
		"English",
		"Ethics",
		"Film as Literature",
		"Geometry",
		"Global Studies",
		"Graphic Design",
		"Health and Physical Education",
		"Heritage Chinese",
		"Individual/Dual Activity",
		"Journalism",
		"Korean Language",
		"Korean Social Studies",
		"Linear Algebra",
		"Modern Band",
		"Movement & Expression",
		"Multivariable Calculus",
		"Personal Fitness",
		"Physics",
		"Pre-Calculus",
		"Programming I",
		"Programming II",
		"Psychology",
		"Public Speaking",
		"Recreational & Lifetime Sports",
		"Robotics",
		"Sociology",
		"Solo Vocal Technique",
		"Spanish",
		"String Orchestra",
		"Theater I",
		"Theater II",
		"US History",
		"Videography",
		"Visual Art I",
		"Visual Art II - 2D",
		"Visual Art II - 3D",
		"Wellness",
		"Wind Ensemble",
		"Writing 9",
		"Yearbook",
	];

	for (let subject of subjects) {
		const option = document.createElement("option");
		option.value = subject;
		datalist.appendChild(option);
	}

	const targets = document.querySelectorAll("table.data");
	for (let target of targets) {
		target.addEventListener("focusin", (e) => {
			if (e.target.tagName == "INPUT" && e.target.classList.contains(`${target.id}_0`)) {
				e.target.setAttribute("list", "subjects");
			}
		});

		target.addEventListener("focusout", (e) => {
			if (e.target.tagName == "INPUT") {
				e.target.removeAttribute("list");
			}
		});
	}
}

function addRows(tableId, nInput, col = 2, types = []) { // id of target table, id of input field
	const temp = document.getElementById(nInput);
	if (getTableData(document.getElementById(tableId)).length > 49) { // max rows = 50
		temp.value = 1;
		return;
	}

	if (temp.value > 10) temp.value = 10; // limit max added rows to 10 at a time
	for (let i = 0; i < temp.value; i++) {
		addRow(tableId, col, types);
	}
	makeNavTable(tableId);
	temp.value = 1;
}

function addRow(tableId, col = 2, types = [], autoupdate = false) {
	// target table ID, # of columns, input types, automatically update nav table
	const table = document.getElementById(tableId);
	const row = document.createElement("tr");
	table.append(row);

	for (let i = 0; i < col; i++) {
		const subject = types[i] == "subject";
		const cell = document.createElement("td");
		row.append(cell);

		const input = document.createElement("input");
		if (subject) {
			input.type = "text";
			input.list = "subjects";
		}
		else {
			if (!subject && types.length != 0) input.type = types[i];
			else input.type = "number";
		}

		cell.appendChild(input);

		input.classList.add(tableId + `_${i}`);
		if (document.getElementById("privacy").checked) cell.classList.add("private");

		input.autocomplete = "off";
	}
	if (autoupdate) makeNavTable(tableId);
}

function getTableData(table, header = true, weighted = false) {
	let data = []
	const rows = table.querySelectorAll("tr");
	for (let i = 0; i < rows.length; i++) {
		if (header && i == 0) continue;
		cells = rows[i].querySelectorAll("td");
		temp = []
		for (let j = 0; j < cells.length; j++) {
			temp.push(cells[j].firstElementChild);
		}
		data.push(temp);
	}
	return data;
}

function getCol(table, column, weighted = false) {
	const data = getTableData(table);
	let values = []
	let apCourses = []

	for (let i = 0; i < data.length; i++) {
		if (data[i][column].value == "") continue;

		if (data[i][0].value.includes("AP ")) apCourses.push(true);
		else apCourses.push(false);

		values.push(data[i][column].value);
	}

	if (weighted) return [values, apCourses];
	return [values];
}

function getCell(table, x, y) {
	const data = getTableData(table);
	return data[y][x];
}

function avg(list, parsetype = 0, weighted = false, sf = 2) {
	let total = 0;
	for (let i = 0; i < list[0].length; i++) {
		let item = list[0][i];
		if (parsetype == 1) item = parseFloat(item);
		else if (parsetype == 2) {
			if (!isNaN(item)) item = letterToPoint(percentToLetter(item));
			else item = letterToPoint(item);

			if (weighted && list[1][i]) item += 1; // if AP, weight
		}
		total += item;
	}
	const res = parseFloat((total / list[0].length).toFixed(sf));
	if (Number.isNaN(res)) return "";
	return res;
}

function calcDomainSem(semester, final, core, finalTable) {
	const favg = parseFloat(document.getElementById(`s${semester}_favg`).innerHTML);
	const savg = parseFloat(document.getElementById(`s${semester}_savg`).innerHTML);
	const target = document.getElementById(`s${semester}domain`);

	if (Number.isNaN(favg) && Number.isNaN(savg)) {
		target.innerHTML = "";
		return;
	}

	let res;
	let data = getTableData(finalTable);
	for (let i = 0; i < data.length; i++) {
		if (data[0][i].value == "") final = false;
	}

	if (final) {
		let finalGrade = parseFloat(document.getElementById(`s${semester}final`).value);
		if (Number.isNaN(finalGrade)) res = parseFloat(((favg * 20 + savg * 60) / 80).toFixed(1));
		else res = parseFloat(((favg * 20 + savg * 60 + finalGrade * 20) / 100).toFixed(1));
	}
	else {
		if (core) res = parseFloat(((favg * 20 + savg * 60) / 80).toFixed(1));
		else res = parseFloat(((favg * 20 + savg * 80) / 100).toFixed(1));
	}
	if (Number.isNaN(res)) res = !Number.isNaN(favg) ? favg : !Number.isNaN(savg) ? savg : "";
	target.innerText = `${res} (${percentToLetter(res)})`;
}

// conversions
const pBoundaries = [98, 93, 90, 87, 83, 80, 77, 73, 70, 67, 63, 60, 50, 0];
const letterGrade = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F", "NG"];
const point = [4, 4, 3.67, 3.33, 3, 2.67, 2.33, 2, 1.67, 1.33, 1, 0.67, 0, 0];

function letterToPercent(letter) {
	for (let i = 0; i < letterGrade.length; i++) {
		if (letter == letterGrade[i]) return pBoundaries[i];
	}
	return NaN;
}

function percentToLetter(percentage) {
	for (let i = 0; i < pBoundaries.length; i++) {
		if (Math.round(percentage) >= pBoundaries[i]) return letterGrade[i];
	}
	return NaN;
}

function letterToPoint(letter) {
	for (let i = 0; i < letterGrade.length; i++) {
		if (letterGrade[i] == letter) return point[i];
	}
	return NaN;
}

// adapted from vipranarayan14/navigable-table.html
function makeNavTable(tableId, activeCell = -1) {
	const table = document.getElementById(tableId);
	let active = activeCell;

	if (!table._navInitialized) {
		table._navInitialized = true;

		table.addEventListener("focus", function () {
			const focusedTable = document.querySelector("#" + tableId + ":focus");
			if (focusedTable) focusedTable.style.outline = "none";
		});

		table.addEventListener("click", function (e) {
			const td = e.target.closest("td");
			if (!td) return;

			const cells = table.querySelectorAll("tr td");
			active = Array.prototype.indexOf.call(cells, td);
			makeCellActive();
		});

		table.addEventListener("keydown", function (e) {
			let vimkeys;
			let trigger = false;
			switch (e.key) {
				case "ArrowDown":
				case "ArrowUp":
				case "ArrowLeft":
				case "ArrowRight":
				case "Tab":
					vimkeys = false;
					trigger = true;
					break
				case "h":
				case "j":
				case "k":
				case "l":
					vimkeys = true;
					trigger = true;
					break;
			}
			if (trigger) {
				// if current cell is used for selecting subjects, don't move with vimkeys
				const currentActive = table.querySelector(".active");
				if (vimkeys && currentActive.firstElementChild.getAttribute("list") == "subjects" && currentActive.firstChild.classList.contains(`${table.id}_0`)) return;

				e.preventDefault();
				calculateActiveCell(e);
				makeCellActive();
				return false;
			}
		});
	}

	// initialize any new cells that don't have content yet
	const cells = table.querySelectorAll('tr td');
	for (let i = 0; i < cells.length; i++) {
		if (!cells[i].innerHTML) {
			cells[i].innerHTML = i;
		}
	}

	active = activeCell;
	if (active < 0) return;
	makeCellActive();

	function calculateActiveCell(e) {
		const cells = table.querySelectorAll('tr td'); // fresh query
		const columns = table.querySelector('tr').childElementCount;

		if (e.key == "ArrowLeft" || e.key == "h") {
			active = (active > 0) ? active - 1 : active;
		}
		if (e.key == "ArrowUp" || e.key == "k") {
			active = (active - columns >= 0) ? active - columns : active;
		}
		if (e.key == "ArrowRight" || e.key == "l") {
			active = (active < cells.length - 1) ? active + 1 : active;
		}
		if (e.key == "ArrowDown" || e.key == "j") {
			active = (active + columns <= cells.length - 1) ? active + columns : active;
		}
		if (e.key == "Tab") {
			if (e.shiftKey) active = Math.max(0, --active);
			else active = Math.min(cells.length - 1, ++active);
		}
	}

	function makeCellActive() {
		const cells = table.querySelectorAll('tr td'); // fresh query
		const activeTDs = table.querySelectorAll('.active');
		for (let i = 0; i < activeTDs.length; i++) {
			activeTDs[i].classList.remove('active');
		}

		if (active >= cells.length) active = cells.length - 1;
		if (active < 0) active = 0;

		cells[active].classList.add('active');
		cells[active].children[0].select();
		cells[active].children[0].focus();
	}
}

function clearTable(table) {
	const data = getTableData(table);
	for (let i of data) {
		for (let j of i) {
			j.value = "";
		}
	}
}

function clearSem(semester) {
	const table = document.getElementById(`s${semester}`);
	clearTable(table);

	for (let e of document.querySelectorAll(".result-td > input")) e.value = "";
	for (let e of document.querySelectorAll(".result-td")) e.innerHTML = "";
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