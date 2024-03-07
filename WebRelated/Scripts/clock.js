

// Create a div element
let prisoner = document.createElement('div');
prisoner.classList.add('prisoner');

// Create an icon element with Font Awesome classes
let iconElement = document.createElement('i');
iconElement.classList.add('fa-solid', 'fa-user', 'fa-3x');
document.getElementById('population-GM').style.font = "bold 20px/30px fixed-width, sans-serif";
document.getElementById('population-LB').style.font = "bold 20px/30px fixed-width, sans-serif";
document.getElementById('population-LR').style.font = "bold 20px/30px fixed-width, sans-serif";
document.getElementById('population-CT').style.font = "bold 20px/30px fixed-width, sans-serif";

let gymPopulation = document.getElementById('population-GM').textContent;
let canteenPopulation = document.getElementById('population-CT').textContent;
let libraryPopulation = document.getElementById('population-LB').textContent;
let livingRoomPopulation = document.getElementById('population-LR').textContent;

let gym = document.getElementById('prison1');
let canteen = document.getElementById('prison2');
let library = document.getElementById('prison3');
let livingRoom = document.getElementById('prison4');

let clockText = document.getElementById("clock-text");
let play = true;
let timeIncrementor = 30// minutes back and forth when user presses button
let dateNow = new Date();
let hours = dateNow.getHours();
let minutes = dateNow.getMinutes();
let seconds = dateNow.getSeconds();
let milliseconds = dateNow.getMilliseconds();
let day = dateNow.getDay();
let month = dateNow.getMonth();
let year = dateNow.getFullYear();

var movementData = [];
var movementDataIndex = -1 // Indexes movementData to display all movement events after  movementData(index).timeStamp
playClock();

function clearPrisoners() {
    //Function to clear only the prisoner elements
    document.querySelectorAll('.prisoner').forEach((el) => el.remove());
  }
function getMovementData(){
    $.get('http://localhost:5000/api/MovementTime', (newData) => {// API endpoint conection for retrieving Movement Time Data
        //console.log(newData);
        movementData = newData.map((item) => ({
          prisonerID: item.prisonerID,
          zoneID: item.zoneID,
          timeStamp: item.timeStamp,
          type: item.type,
          firstName: item.firstNames,
          lastName: item.lastName,
          medicalConditions: item.medicalConditions,
        }));
      });
    //console.log(movementData);
}
function toggleDropdown() {
    var dropdownContent = document.querySelector('.Drop-down-content');
    if (dropdownContent) {
        dropdownContent.classList.toggle('active');
    } else {
        console.error('Dropdown content element not found.');
    }
  }
function playClock() {
    play = true;
}
function pauseClock() {
    play = false;
}
function renderUsers() {
    clearPrisoners();
    let renderedPrisoners = new Set(); // Keep track of rendered prisoners
    let gymPop = 0;
    let libraryPop = 0;
    let canteenPop = 0;
    let livingRoomPop = 0;
    for (let x = movementDataIndex + 1; x < movementData.length; x++) {
        if (movementData[x]) {
            if (!renderedPrisoners.has(movementData[x].prisonerID)) { // Check if prisoner has already been rendered
                let iconElement = document.createElement('i');
                iconElement.classList.add('fa-solid', 'fa-user', 'fa-3x');
                switch (movementData[x].type) {//Contains differnt user types
                    case 'P':// Prisoner
                        iconElement.style.color = '#fe7300';
                        break;
                    case 'V':// Visitor
                        iconElement.style.color = "White";
                        break;
                    case 'S':// Staff
                        iconElement.style.color = "Blue";
                        break;
                    default:
                        console.log("Type not recognised");
                }
                let prisoner = document.createElement('div');
                prisoner.classList.add('prisoner');
                let paragraphElement = document.createElement('p');
                paragraphElement.classList.add('prisoner-id');
                if(x ===  movementDataIndex + 1){// movementDataIndex + 1 represents the last movement
                    paragraphElement.style.color = 'yellow';// It is then styled differently to show this visually
                    paragraphElement.style.fontSize = '18px';
                    //iconElement.style.border = '1px solid black'
                    //iconElement.style.boxShadow = '0px 0px 10px 0px rgba(0, 0, 0, 0.5)';
                    iconElement.style.boxShadow =  '0 0 10px rgba(255, 255, 255, 1)';//Creates a glow effect
                    iconElement.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'
                    iconElement.style.borderRadius = '20px';
                }else{
                    paragraphElement.style.color = '#e3d8d8';                  
                }
                prisoner.onclick = function() {// Create personal URL for the user so thair movement data can be used in User Histroy page
                    // Construct the URL with query parameters
                    console.log("TEST");
                    let url = '../pages/userHistory.html';
                    url += '?prisonerID=' + encodeURIComponent(movementData[x].prisonerID);
                    // Redirect to constructed URL
                    
                    window.location.href = url;
                };


                paragraphElement.textContent = movementData[x].prisonerID;// Stores prisoner ID in a hover box
                prisoner.appendChild(paragraphElement);

                let hoverOver = document.createElement('div')// hover functionality
                hoverOver.classList.add('hoverOver');
                hoverOver.style.color = '#e3d8d8';
                hoverOver.style.marginTop = '50px'
                hoverOver.style.position = 'absolute';

                //Ternary operator to translate the role character to the full name 
                let role = movementData[x].type === "P" ? "\n Role: Prisoner" : movementData[x].type === "V" ? "\n Role: Visitor" : "\n Role: Prison Officer";
                let hoverCont = "Name: " + movementData[x].firstName + " " + movementData[x].lastName + role;
                if (movementData[x].medicalConditions != null) {// If user has medical conditions display in hover box
                    hoverCont = hoverCont + "\r\nMedical conditions: " + movementData[x].medicalConditions
                }
                hoverOver.textContent = hoverCont;

                prisoner.appendChild(hoverOver);
                switch (movementData[x].zoneID) {// Determines which zone to put the user in
                    case 1:
                        gym.appendChild(prisoner);
                        gymPop ++;
                        break;
                    case 2:
                        canteen.appendChild(prisoner);
                        canteenPop++;
                        break;
                    case 3:
                        library.appendChild(prisoner);
                        libraryPop++;
                        break;
                    case 4:
                        livingRoom.appendChild(prisoner);
                        livingRoomPop++;
                        break;
                    default:
                        console.log("Zone ID not recognised");
                }
                prisoner.appendChild(iconElement);
                
                // Add prisoner to rendered set
                renderedPrisoners.add(movementData[x].prisonerID);
            }
        } else {
            console.log(`Element at index ${x} is undefined`);
        }
    }
    gymPopulation = gymPop;
    canteenPopulation = canteenPop;
    livingRoomPopulation = livingRoomPop;
    libraryPopulation = libraryPop;

    
    // Display population in corresponding HTML elements
    document.getElementById('population-GM').textContent = 'Gym: ' + gymPop;
    document.getElementById('population-CT').textContent = 'Canteen: ' + canteenPop;
    document.getElementById('population-LB').textContent = 'Library: ' + libraryPop;
    document.getElementById('population-LR').textContent = 'Living Room: ' + livingRoomPop;
}




async function forwardBackEvent(rewind) {
    
    if (rewind && movementDataIndex < movementData.length - 1) {
        movementDataIndex++; // Increment when navigating forward
    } else if (!rewind && movementDataIndex > 0) {
        movementDataIndex--; // Decrement when navigating backward
    }
    await getMovementData(); // Wait for movement data to be fetched
    console.log("MD.length: " + movementData.length);
    console.log("MDI: " + movementDataIndex);
    
    if (movementData.length > movementDataIndex && movementDataIndex >= 0) {
        const timestampString = movementData[movementDataIndex].timeStamp;
        const dateObj = new Date(timestampString);
        
        // Extract individual components
        year = dateObj.getFullYear();
        month = dateObj.getMonth() + 1; // Months are zero-based, so add 1
        day = dateObj.getDate();
        hours = dateObj.getHours();
        minutes = dateObj.getMinutes();
        seconds = dateObj.getSeconds();
        milliseconds = dateObj.getMilliseconds();

        milliseconds = (milliseconds < 10) ? '000' + milliseconds :  (milliseconds < 100) ? '00' + milliseconds :  milliseconds;
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        month = (month < 10) ? '0' + month: month;
        day = (day < 10) ? '0' + day : day;

        console.log("Date:", year + "-" + month + "-" + day);
        console.log("Hour:", hours);
        console.log("Minute:", minutes);
        console.log("Second:", seconds);
        console.log("Millisecond:", milliseconds);
        clockText.textContent = day + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes + ':' + seconds;

        
        renderUsers();
    }
    play = !rewind && movementDataIndex === movementData.length - 1;
}




function prevEvent(){

        forwardBackEvent(true);        


}
function nextEvent() {
    if (movementDataIndex === 0) {
        play = true;
        movementDataIndex= -1;
        clearPrisoners()
        // - 1 to signify historic playback has been disabled
        // Optionally, you may want to stop the clock updater when play is set to true
        // clearInterval(clockInterval);
    } else if(movementDataIndex != -1){
        play = false;
        forwardBackEvent(false);        
    }
}


function scrollToHeight(height) {
    window.scrollTo({
      top: height,
      behavior: 'smooth'
    });
  }
function clockUpdater() {
    if (play) {
        getMovementData();
        renderUsers();
        dateNow = new Date();

        day = dateNow.getUTCDate();
        month = dateNow.getMonth() + 1;
        year = dateNow.getFullYear();
        hours = dateNow.getHours();
        minutes = dateNow.getMinutes();
        seconds = dateNow.getSeconds();
        milliseconds = dateNow.getMilliseconds();

        milliseconds = ('000' + milliseconds).slice(-4);

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        month = (month < 10) ? '0' + month: month;
        day = (day < 10) ? '0' + day : day;
    }
    clockText.textContent  = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;

}
if (play) {
    // Restart the clock if play is true
    setInterval(clockUpdater, 1);
}
clockUpdater();
getMovementData();

