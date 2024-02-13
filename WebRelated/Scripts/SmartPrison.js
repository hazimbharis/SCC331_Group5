import { addToLog } from "./log.js";

let gym = document.getElementById('prison1');
let canteen = document.getElementById('prison2');
let library = document.getElementById('prison3');
let livingRoom = document.getElementById('prison4');
let gymCount = 0;
let canteenCount = 0;
let libraryCount = 0;
let livingRoomCount = 0;

let gymDoor = document.getElementById('gym-door');
let canteenDoor = document.getElementById('canteen-door');
let libraryDoor = document.getElementById('library-door');
let livingRoomDoor = document.getElementById('living-room-door');

let formattedData = [];
let formattedData2 = [];

// Door
const data = [
  { doorID: 1, locked: 0, closed: 1, alarm: 1 },
  { doorID: 2, locked: 0, closed: 0, alarm: 0 },
  { doorID: 3, locked: 0, closed: 0, alarm: 0 },
  { doorID: 4, locked: 0, closed: 0, alarm: 1 },
]; // dummy data => fetched from API
var prevDoorData = [];



function toggleDropdown() {
  var dropdownContent = document.querySelector('.Drop-down-content');
  if (dropdownContent) {
      dropdownContent.classList.toggle('active');
  } else {
      console.error('Dropdown content element not found.');
  }
}


function updateDoors(){
  prevDoorData = data;
  //console.log(prevDoorData);
  $.get('http://localhost:5000/api/door', (newData) => {
    formattedData2 = newData.map((item) => ({
      doorID: item.doorID,
      locked: item.locked,
      closed: item.closed,
      alarm: item.alarm,
    }));


  });

  gymDoor.innerHTML = '';
  canteenDoor.innerHTML = '';
  libraryDoor.innerHTML = '';
  livingRoomDoor.innerHTML = '';

  let openIcon = document.createElement('i');
  openIcon.classList.add('fa-solid', 'fa-door-open', 'fa-4x');
  openIcon.style.color = '#633200';
  
  let lockIcon = document.createElement('i');
  
  lockIcon.classList.add('fa-solid', 'fa-lock', 'fa-2x');
  lockIcon.style.color = '#e3d8d8';
  lockIcon.style.position = 'absolute';
  lockIcon.style.top = '50%';
  lockIcon.style.left = '50%';
  lockIcon.style.transform = 'translate(-50%, -50%)';
  
  let closedIcon = document.createElement('i');
  closedIcon.classList.add('fa-solid', 'fa-door-closed', 'fa-4x');
  closedIcon.style.color = '#633200';
  
  let alarmIcon = document.createElement('i');
  alarmIcon.classList.add('fa-solid', 'fa-door-open', 'fa-4x');
  alarmIcon.style.color = 'red';
  
  let changedIcon = document.createElement('i');


  formattedData2.forEach((el) => {
  let iconContainer = document.createElement('span');

  let doorDiv;
  let doorName;
  
  switch(el.doorID) {
    case 1:
      doorDiv = gymDoor;
      doorName = "Gym Door";
      break;
    case 2:
      doorDiv = canteenDoor;
      doorName = "Canteen Door";
      break;
    case 3:
      doorDiv = libraryDoor;
      doorName = "Library Door";
      break;
    case 4:
      doorDiv = livingRoomDoor;
      doorName = "Living Room Door";
      break;
    default:
      return; // Exit loop if doorID is not recognized
  }

  // Compare current state with previous state
  //console.log(el.alarm);
  //console.log(prevDoorData[el.doorID-1].alarm);




    if (el.doorID === 1) {
      if (el.alarm) {
        gymDoor.appendChild(alarmIcon.cloneNode(true));
        changedIcon = alarmIcon.cloneNode(true);
      } else if (el.closed) {
        gymDoor.appendChild(closedIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else if (el.locked) {     
        //gymDoor.appendChild(closedIcon.cloneNode(true));
        gymDoor.appendChild(lockIcon.cloneNode(true)); 
        changedIcon = closedIcon.cloneNode(true);
      } else {
        gymDoor.appendChild(openIcon.cloneNode(true));
        changedIcon = openIcon.cloneNode(true);
      }
      
    
    } else if (el.doorID === 2) {
      if (el.alarm) {
        canteenDoor.appendChild(alarmIcon.cloneNode(true));
        changedIcon = alarmIcon.cloneNode(true);
      } else if (el.closed) {
        canteenDoor.appendChild(closedIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else if (el.locked) {
        canteenDoor.appendChild(closedIcon.cloneNode(true));
        canteenDoor.appendChild(lockIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else {
        canteenDoor.appendChild(openIcon.cloneNode(true));
        changedIcon = openIcon.cloneNode(true);
      }
    } else if (el.doorID === 3) {
      if (el.alarm) {
        libraryDoor.appendChild(alarmIcon.cloneNode(true));
        changedIcon = alarmIcon.cloneNode(true);
      } else if (el.closed) {
        libraryDoor.appendChild(closedIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else if (el.locked) {
        libraryDoor.appendChild(closedIcon.cloneNode(true));
        libraryDoor.appendChild(lockIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else {
        libraryDoor.appendChild(openIcon.cloneNode(true));
        changedIcon = openIcon.cloneNode(true);
      }
    } else if (el.doorID === 4) {
      if (el.alarm) {
        livingRoomDoor.appendChild(alarmIcon.cloneNode(true));
        changedIcon = alarmIcon.cloneNode(true);
      } else if (el.closed) {
        livingRoomDoor.appendChild(closedIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else if (el.locked) {
        livingRoomDoor.appendChild(closedIcon.cloneNode(true));
        livingRoomDoor.appendChild(lockIcon.cloneNode(true));
        changedIcon = closedIcon.cloneNode(true);
      } else {
        livingRoomDoor.appendChild(openIcon.cloneNode(true));
        changedIcon = openIcon.cloneNode(true);
      }
    }

    if (el.alarm !== prevDoorData[el.doorID-1].alarm ||
      el.closed !== prevDoorData[el.doorID-1].closed ||
      el.locked !== prevDoorData[el.doorID-1].locked) {
    changedIcon.style.fontSize = '120%';
     
    iconContainer.appendChild(changedIcon)
   
    // Generate log message
    let logMessage = `${getTimeStamp()}: ${doorName} state changed - Alarm: ${el.alarm}, Closed: ${el.closed}, Locked: ${el.locked} `;
    console.log(logMessage);
    addToLog(logMessage, iconContainer);
    // Update previous state
    prevDoorData[el.doorID-1].alarm = el.alarm;
    prevDoorData[el.doorID-1].closed = el.closed;
    prevDoorData[el.doorID-1].locked = el.locked;
  }
  });

}
function getTimeStamp(){
  var dateNow2 = new Date();

  var date2 = dateNow2.getDate();
  var hours2 = dateNow2.getHours();
  var minutes2 = dateNow2.getMinutes();
  var seconds2 = dateNow2.getSeconds();
  var milliseconds2 = dateNow2.getMilliseconds();
  var day = String(dateNow2.getDate()).padStart(2, '0');
  var month = String(dateNow2.getMonth() + 1).padStart(2, '0');
  var year = dateNow2.getFullYear();

  milliseconds = ('000' + milliseconds).slice(-3);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds + ':' + milliseconds + " " + day + "/" + month + "/" + year;

}

// Door


function clearPrisoners() {
  //Function to clear only the prisoner elements
  document.querySelectorAll('.prisoner').forEach((el) => el.remove());
}




function updateMovementInfo() {
  var oldMovementData = formattedData;
  $.get('http://localhost:5000/api/position', (newData) => {
    formattedData = newData.map((item) => ({
      id: item.prisonerID,
      zone: item.zoneID.toString(),
    }));

    //console.log(formattedData);

  // Clear existing prisoners
  clearPrisoners();
  // Reset counters
  gymCount = 0;
  canteenCount = 0;
  libraryCount = 0;
  livingRoomCount = 0;

  formattedData.forEach((element) => {

    // Create a div element
    let prisoner = document.createElement('div');
    prisoner.classList.add('prisoner');

    // Create an icon element with Font Awesome classes
    let iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid', 'fa-user', 'fa-3x');

    // Create a paragraph element for the prisoner ID
    let paragraphElement = document.createElement('p');
    paragraphElement.classList.add('prisoner-id');
    paragraphElement.style.color = '#e3d8d8';
    paragraphElement.textContent = element.id;
    prisoner.appendChild(iconElement);
    prisoner.appendChild(paragraphElement);

    if (element.zone == '1') {
      gymCount++;
      gym.appendChild(prisoner);
      gym.children[2].innerHTML = `Gym: ${gymCount}`;
      checkLocationChange(oldMovementData, element, iconElement);

    } else if (element.zone == '2') {
      canteenCount++;
      canteen.appendChild(prisoner);
      canteen.children[2].innerHTML = `Canteen: ${canteenCount}`;
      checkLocationChange(oldMovementData, element, iconElement);

    } else if (element.zone == '3') {
      libraryCount++;
      library.appendChild(prisoner);
      library.children[2].innerHTML = `Library: ${libraryCount}`;
      checkLocationChange(oldMovementData, element, iconElement);

    } else if (element.zone == '4') {
      livingRoomCount++;
      livingRoom.appendChild(prisoner);
      livingRoom.children[2].innerHTML = `Living room: ${livingRoomCount}`;
      checkLocationChange(oldMovementData, element, iconElement);

    }
  });
  });
}
function checkLocationChange(oldMovementData, element, iconElement){
  
  for (let obj of oldMovementData) {
    //console.log(obj.id + element.id);
    if (obj.zone !== element.zone && obj.id === element.id) {
        console.log("MOVEMENT FOUND");


        let iconContainer = document.createElement('span');
        let changedIcon = document.createElement('i');
        iconElement.style.color = '#fe7300'; 
        iconElement.style.fontSize = '120%'; 
        changedIcon.appendChild(iconElement); 
        iconContainer.appendChild(changedIcon);
        let logMessage = `${getTimeStamp()}: Movement detected from zone ${obj.zone} to zone ${element.zone} concerning prisoner ${element.id} `;
        console.log(logMessage);
        addToLog(logMessage, iconContainer);
    }
}

}

updateDoors();
updateMovementInfo();

setInterval(updateDoors, 500);
setInterval(updateMovementInfo, 500);
//setInterval(updateDoors, 500);
