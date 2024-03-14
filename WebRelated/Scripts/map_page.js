let gym = document.getElementById('gym-prisoners');
let canteen = document.getElementById('canteen-prisoners');
let library = document.getElementById('library-prisoners');
let livingRoom = document.getElementById('living-room-prisoners');
let gymCount = 0;
let canteenCount = 0;
let libraryCount = 0;
let livingRoomCount = 0;
let gymTitle = document.getElementById("gym-title");
let libraryTitle = document.getElementById("library-title");
let canteenTitle = document.getElementById("canteen-title");
let livingRoomTitle = document.getElementById("living-room-title");
let gymDoor = document.getElementById('gym-door');
let canteenDoor = document.getElementById('canteen-door');
let libraryDoor = document.getElementById('library-door');
let livingRoomDoor = document.getElementById('living-room-door');


let formattedData = [];
let data = [];
let alertShown = false;

// Door


async function updateDoorInfo(){//Door api end point to fetch door state from MySql database
  await $.get('http://localhost:5000/api/door', (newData) => {
    data = newData.map((item) => ({
      doorID: item.doorID,
      locked: item.locked,
      closed: item.closed,
      alarm: item.alarm,
    }));
    //console.log(data);
  });
  let openIcon = document.createElement('i');
openIcon.classList.add('fa-solid', 'fa-door-open', 'fa-3x');
openIcon.style.color = '#e3d8d8';

let lockIcon = document.createElement('i');
lockIcon.classList.add('fa-solid', 'fa-lock', 'fa-2x', "lock-icon");
lockIcon.style.color = 'red';
lockIcon.style.position = 'absolute';
lockIcon.style.bottom = '30px';
lockIcon.style.right = "35px";

let closedIcon = document.createElement('i');
closedIcon.classList.add('fa-solid', 'fa-door-closed', 'fa-3x');
closedIcon.style.color = '#e3d8d8';

let alarmIcon = document.createElement('i');
alarmIcon.classList.add('fa-solid', 'fa-door-open', 'fa-3x');
alarmIcon.style.color = 'red';

data.forEach((el) => {
  if (el.doorID === 1) {
    gymDoor.replaceChildren();
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
    canteenDoor.replaceChildren();
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
    libraryDoor.replaceChildren();
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
    livingRoomDoor.replaceChildren();
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



/*
  data = [{doorID: 1, locked: 0, closed: 1, alarm: 0}, {
  doorID: 2, locked: 0, closed: 1, alarm: 0
}, {doorID: 3, locked: 0, closed: 1, alarm: 0}, {
  doorID: 4, locked: 0, closed: 1, alarm: 0
},]; // dummy data => fetched from API*/



// Door

function clearPrisoners() {
  //Function to clear only the prisoner elements
  document.querySelectorAll('.prisoner').forEach((el) => el.remove());
}

function checkAlerts() { 
  //checks each interval if alerts exist
  $.get('http://localhost:5000/api/warnings', function(data){
  console.log(data.length)  
  if(!data.length)
    {
      return
    }
  })

  if (!alertShown)
    showAlerts()
  //create a variable which checks if an alert is already being shown
  //if alerts exist, do showAlerts

}

async function showAlerts() {
  const zones = ["GYM", "CANTEEN", "LIBRARY", "LIVING ROOM"]
  const warnings = ["Guard needs help in ", "Temperature too high in ", "Temperature too low in ", "Noise too high in ", "Lights too low in "]

  //Fetched from API
  let warningData = [{zoneID: 1, warningID: 1}, {zoneID: 2, warningID: 3}]
  
  await $.get('http://localhost:5000/api/warnings', (newData) => {
    warningData = newData.map((item) => ({
      zoneID: item.zoneID,
      warningID: item.warningID,
    }));
  });

  alertShown = true
  
  for (const warning of warningData) {
    await Swal.fire({
      title: "Warning!",
      text: `${warnings[warning.warningID - 1]}${zones[warning.zoneID - 1]}`,
      icon: "error",
      background: "#e3d8d8",
      confirmButtonColor: "#44414f"
    }).then((value) => { 
      $.get('http://localhost:5000/api/deletewarning/'+warning.zoneID+'/'+warning.warningID)

    }) 
  }

  alertShown = false
}

async function updateMovementInfo() {
   await $.get('http://localhost:5000/api/NewUIPositions', (newData) => {
     formattedData = newData.map((item) => ({
       type: item.type,
       zone: item.zoneID,
       id: item.prisonerID, 
       name: item.firstNames + ' ' + item.lastName,
     }));
  
     //console.log(formattedData);
  });
  // Clear existing prisoners
  clearPrisoners();

  // Reset counters
  gymCount = 0;
  canteenCount = 0;
  libraryCount = 0;
  livingRoomCount = 0;
/*
  formattedData = [{
    type: "P", zone: 1, id: "A1234CV", name: "Asdu3basd",
  }, {
    type: "P", zone: 1, id: "A1234CV", name: "Asdu3basd",
  }, {
    type: "G", zone: 2, id: "A1234CV", name: "Buhfuwus"
  }, {
    type: "V", zone: 3, id: "A1234CV", name: "Buhfuwus"
  },]
*/
  formattedData.forEach((element) => {
    // Create a div element
    let prisoner = document.createElement('div');
    prisoner.classList.add('prisoner');

    // Create an icon element with Font Awesome classes
    let iconElement = document.createElement('i');
    iconElement.classList.add('fa-solid', 'fa-location-crosshairs', 'fa-3x');
    iconElement.style.cursor = "pointer"
    switch (element.type) {
      case "P":
        iconElement.style.color = "#fe7300";
        break;
      case "S":
        iconElement.style.color = "blue";
        break;
      case "V":
        iconElement.style.color = "white";
        break;
      default:
        iconElement.style.color = "#fe7300";
    }

    // Create a box for additional info
    let prisonerInfo = document.createElement('div');
    prisonerInfo.classList.add("prisoner-info")
    let div1 = document.createElement("div");
    div1.innerHTML = `ID: ${element.id}`;
    let div2 = document.createElement("div");
    div2.innerHTML = `Name: ${element.name}`;
    prisonerInfo.appendChild(div1);
    prisonerInfo.appendChild(div2);
    prisoner.appendChild(iconElement);
    prisoner.appendChild(prisonerInfo);

    if (element.zone <= 10) {
      livingRoomCount++;
      livingRoom.appendChild(prisoner);
      livingRoomTitle.innerHTML = `CELLS: ${livingRoomCount}`;
    } else if (element.zone === 11) {
      gymCount++;
      gym.appendChild(prisoner);
      gymTitle.innerHTML = `GYM: ${gymCount}`;
    } else if (element.zone === 12) {
      canteenCount++;
      canteen.appendChild(prisoner);
      canteenTitle.innerHTML = `CANTEEN: ${canteenCount}`;
    } else if (element.zone === 13) {
      libraryCount++;
      library.appendChild(prisoner);
      libraryTitle.innerHTML = `LIBRARY: ${libraryCount}`;
    }
  });

}

updateMovementInfo();
showAlerts()
setInterval(checkAlerts, 500);
updateDoorInfo();
setInterval(updateMovementInfo, 2000);
setInterval(updateDoorInfo, 2000);
