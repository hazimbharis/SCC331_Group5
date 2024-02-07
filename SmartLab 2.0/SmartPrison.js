let gym = document.getElementById('prison1');
let canteen = document.getElementById('prison2');
let library = document.getElementById('prison3');
let livingRoom = document.getElementById('prison4');
let gymCount = [0, 0, 0];
let canteenCount = [0, 0, 0];
let libraryCount = [0, 0, 0];
let livingRoomCount = [0, 0, 0];


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




function updateDoors(){
  $.get('http://localhost:5000/api/door', (newData) => {
    formattedData2 = newData.map((item) => ({
      doorID: item.doorID,
      locked: item.locked,
      closed: item.closed,
      alarm: item.alarm,
    }));
    console.log(data);
    console.log(formattedData2);

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
  
  formattedData2.forEach((el) => {
    if (el.doorID === 1) {
      if (el.alarm) {
        gymDoor.appendChild(alarmIcon.cloneNode(true));
      } else if (el.closed) {
        gymDoor.appendChild(closedIcon.cloneNode(true));
      } else if (el.locked) {
        gymDoor.appendChild(closedIcon.cloneNode(true));
        gymDoor.appendChild(lockIcon.cloneNode(true));
      } else {
        gymDoor.appendChild(openIcon.cloneNode(true));
      }
    } else if (el.doorID === 2) {
      if (el.alarm) {
        canteenDoor.appendChild(alarmIcon.cloneNode(true));
      } else if (el.closed) {
        canteenDoor.appendChild(closedIcon.cloneNode(true));
      } else if (el.locked) {
        canteenDoor.appendChild(closedIcon.cloneNode(true));
        canteenDoor.appendChild(lockIcon.cloneNode(true));
      } else {
        canteenDoor.appendChild(openIcon.cloneNode(true));
      }
    } else if (el.doorID === 3) {
      if (el.alarm) {
        libraryDoor.appendChild(alarmIcon.cloneNode(true));
      } else if (el.closed) {
        libraryDoor.appendChild(closedIcon.cloneNode(true));
      } else if (el.locked) {
        libraryDoor.appendChild(closedIcon.cloneNode(true));
        libraryDoor.appendChild(lockIcon.cloneNode(true));
      } else {
        libraryDoor.appendChild(openIcon.cloneNode(true));
      }
    } else if (el.doorID === 4) {
      if (el.alarm) {
        livingRoomDoor.appendChild(alarmIcon.cloneNode(true));
      } else if (el.closed) {
        livingRoomDoor.appendChild(closedIcon.cloneNode(true));
      } else if (el.locked) {
        livingRoomDoor.appendChild(closedIcon.cloneNode(true));
        livingRoomDoor.appendChild(lockIcon.cloneNode(true));
      } else {
        livingRoomDoor.appendChild(openIcon.cloneNode(true));
      }
    }
  });

}

// Door


function clearPrisoners() {
  //Function to clear only the prisoner elements
  document.querySelectorAll('.prisoner').forEach((el) => el.remove());
}
function updateMovementInfo() {
  $.get('http://localhost:5000/api/position', (newData) => {
    formattedData = newData.map((item) => ({
      id: item.prisonerID,
      zone: item.zoneID.toString(),
      firstNames: item.firstNames,
      lastName: item.lastName,
      medicalConditions: item.medicalConditions,
      type: item.type
    }));

    console.log(formattedData);
  });
  // Clear existing prisoners
  clearPrisoners();
  // Reset counters
  gymCount = [0, 0, 0];
  canteenCount = [0, 0, 0];
  libraryCount = [0, 0, 0];
  livingRoomCount = [0, 0, 0];

  formattedData.forEach((element) => {
    // Create a div element
    let prisoner = document.createElement('div');
    prisoner.classList.add('prisoner');

    // Create an icon element with Font Awesome classes
    let iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid', 'fa-user', 'fa-3x');

    //Create tooltip when hovering over user
    let hoverOver = document.createElement('div')
    hoverOver.classList.add('hoverOver');
    hoverOver.style.color = '#e3d8d8';
    hoverCont = "Name: " + element.firstNames + " " + element.lastName;
    if (element.medicalConditions != null) {
      hoverCont = hoverCont + "\r\nMedical conditions: " + element.medicalConditions
    }
    "\r\nMedical conditions: " + element.medicalConditions;
    var typex;
    if (element.type == "S") { //Differentiate user types in UI using colours
      iconElement.style.color = "Blue"; //Staff
      r = getStaffRole(element.id)
      typex = 1;
    } else if (element.type == "V") { //Visitors
      iconElement.style.color = "White";
      typex = 2;
    } else { //Prisoners
      typex = 0
    }
    hoverOver.textContent = hoverCont;
    // Create a paragraph element for the prisoner ID
    let paragraphElement = document.createElement('p');
    paragraphElement.classList.add('prisoner-id');
    paragraphElement.style.color = '#e3d8d8';
    paragraphElement.textContent = element.id;

    prisoner.appendChild(iconElement);
    prisoner.appendChild(paragraphElement);
    prisoner.appendChild(hoverOver)

    if (element.zone == '1') {
      gymCount[typex]++;
      gym.appendChild(prisoner);
      gym.children[2].innerHTML = `Gym: ${gymCount.reduce((x, y) => x + y, 0)}`;
    } else if (element.zone == '2') {
      canteenCount[typex]++;
      canteen.appendChild(prisoner);
      canteen.children[2].innerHTML = `Canteen: ${canteenCount.reduce((x, y) => x + y, 0)}`;
    } else if (element.zone == '3') {
      libraryCount[typex]++;
      library.appendChild(prisoner);
      library.children[2].innerHTML = `Library: ${libraryCount.reduce((x, y) => x + y, 0)}`;
    } else if (element.zone == '4') {
      livingRoomCount[typex]++;
      livingRoom.appendChild(prisoner);
      livingRoom.children[2].innerHTML = `Living room: ${livingRoomCount.reduce((x, y) => x + y, 0)}`;
    }
  });
  zs = [gym, canteen, library, livingRoom];
  zcs = [gymCount, canteenCount, libraryCount, livingRoomCount];
  i = 0;
  zs.forEach((elem) => {
    let hoverOver = document.createElement('div');
    hoverOver.classList.add('hoverOver');
    hoverOver.textContent = "Prisoners: " + zcs[i][0] + " Staff: " + zcs[i][1] + " Visitors: " + zcs[i][2];
    hoverOver.style.position = "absolute"
    hoverOver.style.width = "220px"
    hoverOver.style.bottom = "100%"
    hoverOver.style.left = "50%";
    hoverOver.style.transform = "translateX(-50%)"
    elem.children[2].appendChild(hoverOver)
    i++
  })
}

function getStaffRole(id) {
  x = "asd"
  $.get('http://localhost:5000/api/staffRole/' + id, (newData) => x = newData)
  console.log(x)
}

updateDoors();
updateMovementInfo();

setInterval(updateDoors, 500);
setInterval(updateMovementInfo, 500);
//setInterval(updateDoors, 500);
