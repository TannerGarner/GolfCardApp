const courseImageDiv = document.getElementById("courseImage");
const selectionDiv = document.getElementById("selection");
const tableContainerDivs = document.querySelectorAll(".tableContainer");
const frontNineTable = document.getElementById("frontNine");
const backNineTable = document.getElementById("backNine");
let courseData = [];
const addPlayerInput = document.getElementById('addPlayerInput');
const addPlayerButton = document.getElementById('addPlayerButton');
const resetCardButton = document.getElementById('resetCard');

const getAvailableCourses = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    courseData.push(...data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

console.log(courseData);

const getCourseDetails = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    return null;
  }
};

function findTeeBoxTypes(holeSet) {
  let teeBoxData = [...holeSet[0].teeBoxes];
  let teeBoxTypes = [];

  teeBoxData.forEach((teeBox) => {
    teeBoxTypes.push(teeBox.teeType);
  });
  console.log(teeBoxTypes);

  return teeBoxTypes;
}

async function constructCourseOptions() {
  //create parent container for options
  await getAvailableCourses(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json"
  );

  const selectLabel = document.createElement("label");
  selectLabel.htmlFor = "selectCourse";
  selectLabel.textContent = "Select Course";
  const selectBox = document.createElement("select");
  selectBox.id = "selectCourse";
  selectBox.name = "selectCourse";

  courseData.forEach((course) => {
    //create Dom element
    const option = document.createElement("option");
    option.textContent = course.name;
    option.value = course.url;
    selectBox.appendChild(option);
  });

  selectBox.addEventListener("change", async function () {
    const selectedCourseUrl = this.value;
    if (selectedCourseUrl) {
      await constructTeeSelect(selectedCourseUrl);
    }
  });

  selectionDiv.appendChild(selectLabel);
  selectionDiv.appendChild(selectBox);

  let defaultUrl = selectBox.value;
  if (defaultUrl) {
    await constructTeeSelect(defaultUrl);
  }
}

constructCourseOptions();

async function constructTeeSelect(url) {
  const courseDetail = await getCourseDetails(url);
  if (courseDetail) {
    //remove old label/select
    let currentSelect = document?.querySelector("#selectTee");
    let currentLabel = document?.querySelector("#teeLabel");
    if (currentSelect) {
      currentSelect.remove();
      currentLabel.remove();
    }
    //construct selectBox for tee Types
    let teeBoxTypes = findTeeBoxTypes(courseDetail.holes);
    const teeLabel = document.createElement("label");
    teeLabel.textContent = "Select Tee Box";
    teeLabel.id = "teeLabel";
    teeLabel.htmlFor = "selectTee";
    const selectTee = document.createElement("select");
    selectTee.id = "selectTee";
    selectTee.name = "selectTee";
    teeBoxTypes.forEach((type) => {
      const option = document.createElement("option");
      option.textContent = type;
      option.value = type;
      selectTee.appendChild(option);
    });
    selectionDiv.appendChild(teeLabel);
    selectionDiv.appendChild(selectTee);

    let teeBoxSelection = selectTee.value;
    selectTee.addEventListener("change", function () {
      teeBoxSelection = this.value;
      const nineHoleData = Array.from(courseDetail.holes).slice(0, 9);
      console.log(nineHoleData, teeBoxSelection);
      const eighteenHoleData = Array.from(courseDetail.holes).slice(9);
      console.log(eighteenHoleData, teeBoxSelection);
      constructCourseTable(nineHoleData, teeBoxSelection, frontNineTable);
      constructCourseTable(eighteenHoleData, teeBoxSelection, backNineTable);
    });

    //get first Nine Holes Data
    const nineHoleData = Array.from(courseDetail.holes).slice(0, 9);
    console.log(nineHoleData, teeBoxSelection);

    //get last Nine Holes Data
    const eighteenHoleData = Array.from(courseDetail.holes).slice(9);
    console.log(eighteenHoleData, teeBoxSelection);

    constructCourseTable(nineHoleData, teeBoxSelection, frontNineTable);
    constructCourseTable(eighteenHoleData, teeBoxSelection, backNineTable);
  }
}

async function constructCourseTable(holeData, teeBoxSelection, table) {
  // Deconstruct table
  table.innerHTML = "";

  // Construct table header row
  const thead = document.createElement("thead");
  const tr1 = document.createElement("tr");
  thead.appendChild(tr1);
  const thTitle = document.createElement("th");
  thTitle.textContent = "Hole";
  tr1.appendChild(thTitle);

  // Initialize dataByBox to store arrays of values for each category
  const dataByBox = { par: [], yards: [], handicap: [] };
  let dataTitles = Object.keys(dataByBox);

  // Construct table body
  const tbody = document.createElement("tbody");

  // Populate dataByBox with each hole's values and add table header values
  holeData.forEach((hole) => {
    const th = document.createElement("th");
    th.textContent = hole.hole;
    tr1.appendChild(th);

    // Find the selected tee box within the hole
    const teeBox = hole.teeBoxes.find((t) => t.teeType === teeBoxSelection);

    if (teeBox) {
      dataByBox.par.push(teeBox.par);
      dataByBox.yards.push(teeBox.yards);
      dataByBox.handicap.push(teeBox.hcp);
    }
  });

  //add final Total Column header
  const totalCol = document.createElement('th');
  totalCol.textContent = 'Total';
  tr1.appendChild(totalCol);
  table.appendChild(thead);

  // Construct Row Headings and Row Data with Totals
  dataTitles.forEach((category) => {
    //Row
    const tr = document.createElement("tr");
    //Row Headings
    const td1 = document.createElement("td");
    td1.textContent = capitalizeFirstLetter(category);
    tr.appendChild(td1);
    //Add each cell in the row and find the sum of all cells
    const rowTotal = dataByBox[category].reduce((acc, value) => {
      const td = document.createElement("td");
      td.className = `${category}`
      td.textContent = value;
      tr.appendChild(td);
      return acc + value;
    }, 0);

    //Add total cell at the end of the row
    const tdTotal = document.createElement('td');
    tdTotal.textContent = rowTotal;
    tr.appendChild(tdTotal);
    tbody.appendChild(tr);
  });

  //Append constructed body to the table
  table.appendChild(tbody);
}

addPlayerButton.addEventListener('click', function (){
  addPlayer(frontNineTable);
  addPlayer(backNineTable);
  addPlayerInput.value = '';
})

function addPlayer (table){
  //get input name
  let playerName = addPlayerInput.value;

  //add player name to table on new row
  const playerTr = document.createElement('tr');
  playerTr.className = "playerRow";
  table.appendChild(playerTr);

  const nameTd = document.createElement('td');
  nameTd.textContent = playerName;
  playerTr.appendChild(nameTd);

  //add number inputs on the remainder of the row
  for(i=0;i<9;i++){
    const newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.className = 'playerPar';
    const playerTd = document.createElement('td');
    playerTd.appendChild(newInput);
    playerTr.appendChild(playerTd);
  }

  //add Total for player inputs
  const playerInputRows = table.querySelectorAll('.playerRow');
  let playerInputs;
  let totalOfInputs;
  playerInputRows.forEach(row => {
    const totalDisplay = document.createElement('td');
    totalDisplay.className = 'playerTotal';

    playerInputs = row.querySelectorAll('.playerPar');

    playerInputs.forEach(par => {
      par.addEventListener('change', function () {
        //Reset total to 0
        let totalOfInputs = 0;
        
        playerInputs.forEach(input => {
          totalOfInputs += Number(input.value) || 0;

        });

        //Display Total
        totalDisplay.textContent = totalOfInputs;
        playerTr.appendChild(totalDisplay);
      })
    });
    totalDisplay.textContent = totalOfInputs;
    playerTr.appendChild(totalDisplay);
  });
}

resetCardButton.addEventListener('click', function(){
  //delete all player rows
  const playerRows = document.querySelectorAll(".playerRow");
  playerRows.forEach(playerRow => {
    playerRow.remove();
  });
})

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}