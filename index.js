const courseImageDiv = document.getElementById("courseImage");
const selectionDiv = document.getElementById("selection");
const tableContainerDivs = document.querySelectorAll(".tableContainer");
const frontNineTable = document.getElementById("frontNine");
const backNineTable = document.getElementById("backNine");
let courseData = [];

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

    // constructCourseTable(nineHoleData, teeBoxSelection);
    // constructCourseTable(eighteenHoleData, teeBoxSelection);

  }
}

async function constructCourseTable(holeData, teeBoxSelection, table) {
  //deconstruct table
  table.innerHTML = "";

  //construct table header
  const thead = document.createElement("thead");
  const tr1 = document.createElement("tr");
  thead.appendChild(tr1);
  const thTitle = document.createElement("th");
  thTitle.textContent = "Hole";
  tr1.appendChild(thTitle);

  let dataByBox;

  holeData.forEach((hole) => {
    //create most of top line
    const th = document.createElement("th");
    th.textContent = hole.hole;
    tr1.appendChild(th);

    dataByBox = hole?.teeBoxes.find((t) => {
      return t.teeType === teeBoxSelection;
    });
  });
  console.log(dataByBox);

  //get

  //construct table body
  const tbody = document.createElement("tbody");
  //construct each row

  table.appendChild(thead);
}

async function constructFrontNine(data, teeBox) {}
