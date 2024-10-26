
const courseImageDiv = document.getElementById('courseImage');
const selectionDiv = document.getElementById('selection');
const tableContainerDivs = document.querySelectorAll('.tableContainer');
const frontNineDiv = document.getElementById('frontNine');
const backNineDiv = document.getElementById('backNine');
let courseData = [];


const getAvailableCourses = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      courseData.push(...data);
    } catch (error){
        console.error("Error fetching courses:", error);
    }
}

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
}

async function constructCourseOptions (){
    //create parent container for options
    await getAvailableCourses('https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json');
    
    const selectLabel = document.createElement('label');
    selectLabel.htmlFor = 'selectCourse';
    selectLabel.textContent = 'Select Course'
    const selectBox = document.createElement('select');
    selectBox.id = 'selectCourse';
    selectBox.name = 'selectCourse';

    courseData.forEach(course => {
        //create Dom element
        const option = document.createElement('option')
        option.textContent = course.name;
        option.value = course.url;
        selectBox.appendChild(option);
    })

    selectBox.addEventListener('change', async function () {
        const selectedCourseUrl = this.value;         
        if (selectedCourseUrl) {
          await constructCourseResults(selectedCourseUrl);
        }
    });

    selectionDiv.appendChild(selectLabel);
    selectionDiv.appendChild(selectBox);
}

async function constructCourseResults(url) {
    const courseDetail = await getCourseDetails(url);
    if (courseDetail) {
      console.log(courseDetail); 
    }
  }

constructCourseOptions();

