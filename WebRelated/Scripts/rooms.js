//const { getEnvironmentData } = require("worker_threads");

let room1 = document.getElementById("room1");
let room2 = document.getElementById("room2");
let room3 = document.getElementById("room3");
let room4 = document.getElementById("room4");
let room5 = document.getElementById("room5");
let room6 = document.getElementById("room6");
let room7 = document.getElementById("room7");
let room8 = document.getElementById("room8");
let room9 = document.getElementById("room9");
let room10 = document.getElementById("room10");


// User Icons
let visitor = document.createElement("i");
visitor.classList.add("fa-solid", "fa-location-crosshairs", "fa-2x");
visitor.style.color = "#fff";
let guest = document.createElement("i");
guest.style.color = "#fe7300"
guest.classList.add("fa-solid", "fa-location-crosshairs", "fa-2x");
let staff = document.createElement("i");
staff.style.color = "blue";
staff.classList.add("fa-solid", "fa-location-crosshairs", "fa-2x")

//Display users
/*
var dummyUserData = [{
  type: "G", zoneID: 1, firstName: "John", lastName: "Wick"
}, {type: "G", zoneID: 2, firstName: "John", lastName: "Wick"}, {
  type: "G", zoneID: 3, firstName: "John", lastName: "Wick"
}, {type: "V", zoneID: 4, firstName: "John", lastName: "Wick"}, {
  type: "V", zoneID: 5, firstName: "John", lastName: "Wick"
}, {type: "S", zoneID: 6, firstName: "John", lastName: "Wick"}, {
  type: "G", zoneID: 7, firstName: "John", lastName: "Wick"
}, {type: "G", zoneID: 8, firstName: "John", lastName: "Wick"}, {
  type: "S", zoneID: 9, firstName: "John", lastName: "Wick"
}, {type: "G", zoneID: 10, firstName: "John", lastName: "Wick"}, {
  type: "S", zoneID: 11, firstName: "John", lastName: "Wick"
}, {type: "V", zoneID: 12, firstName: "John", lastName: "Wick"}, {
  type: "S", zoneID: 1, firstName: "Wick", lastName: "Shelby"
}];
*/
function clearEntity() {

  const rooms = document.querySelectorAll('.room');
  rooms.forEach(room => {

    const usersContainer = room.querySelector('.users');
    usersContainer.innerHTML = '';
  });
  
  //document.querySelectorAll('.users').forEach((el) => el.remove());

}

async function getLocationData(){
  clearEntity();
  var dummyUserData = [];
  var testData = [];
  console.log("hi");
  await $.get('http://localhost:5000/api/NewUIPositions', (newData) => {
    testData = newData.map((item) => ({
      type: item.type,
      zoneID: item.zoneID, 
      firstName: item.firstNames,
      lastName: item.lastName,
    }));
    dummyUserData = testData;
    console.log(dummyUserData);
    //console.log(formattedData);
 });


dummyUserData.forEach(user => {
  let userDiv = document.createElement("div");
  userDiv.classList.add("user");
  let userInfo = document.createElement("div");
  userInfo.classList.add("details")
  userInfo.innerHTML = `Name: ${user.firstName} ${user.lastName}`;
  userDiv.appendChild(userInfo);

  switch (user.type) {
    case "P":
      userDiv.appendChild(guest.cloneNode(true));
      break;
    case "S":
      userDiv.appendChild(staff.cloneNode(true));
      break;
    case "V":
      userDiv.appendChild(visitor.cloneNode(true));
      break;
  }

  if (user.zoneID === 1) {
    room1.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 2) {
    room2.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 3) {
    room3.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 4) {
    room4.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 5) {
    room5.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 6) {
    room6.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 7) {
    room7.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 8) {
    room8.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 9) {
    room9.childNodes[5].appendChild(userDiv);
  } else if (user.zoneID === 10) {
    room10.childNodes[5].appendChild(userDiv);
  }
})
}

//Show room info onClick
let switchCharts = document.querySelectorAll(".chart");
switchCharts.forEach(switchChart => {
  switchChart.addEventListener("click", () => {
    console.log(switchChart.parentElement.children[4].style.display)
    if (switchChart.parentElement.children[4].style.display) {
      switchChart.parentElement.children[4].style.display = "";
    } else {
      switchChart.parentElement.children[4].style.display = "block";
    }
  })
})




// Fetch room info from backend & display
const dummyRoomData = [];

async function updateRoomEnvData() {
  const rooms = document.querySelectorAll('.room');
  let zoneCounter = 4; // Start zone counter at 4

  for (const room of rooms) {
    const roomDataContainer = room.querySelector('.room-data');
    const roomDataElements = roomDataContainer.children;

    for (const element of roomDataElements) {
      const [property, value] = element.textContent.split(':');
      const propertyName = property.trim();

      try {
        const envData = await getEnvironmentData(zoneCounter);
        console.log("temp: " + envData.temp); // Move console.log here
        switch (propertyName) {
          case 'Temperature':
            element.textContent = `${propertyName}: ${envData.temp}°C`;
            break;
          case 'Light':
            element.textContent = `${propertyName}: ${envData.light}lx`;
            break;
          case 'Noise':
            element.textContent = `${propertyName}: ${envData.noise}dB`;
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error fetching environment data:', error);
      }
    }
    switch (zoneCounter){
     case 12:
      zoneCounter = 5;
      break;
     default:
      zoneCounter +=2;
      break;
    }
 
  }
}
async function getEnvironmentData(zoneNum) {
  try {
    const newData = await $.get('http://localhost:5000/api/zoneEnv/' + zoneNum);
    const testData = newData.map((item) => ({
      zoneID: item.zoneID,
      temp: item.temp, 
      noise: item.noise,
      light: item.light,
    }));
    console.log(testData);
    return testData[0]; // Return the first object from the array
  } catch (error) {
    throw error;
  }
}





setInterval(updateRoomEnvData, 500);
setInterval(getLocationData, 1000);