// Create door elements for hotel
let openHotelDoor = document.createElement("img");
openHotelDoor.src = "../Images/hotel-doors/open.png";
let closedHotelDoor = document.createElement("img");
closedHotelDoor.src = "../Images/hotel-doors/closed.png";
let lockedHotelDoor = document.createElement("img");
lockedHotelDoor.src = "../Images/hotel-doors/locked.png";
let alarmedHotelDoor = document.createElement("img");
alarmedHotelDoor.src = "../Images/hotel-doors/alarmed.png";

let leftRoute = document.getElementById("left-route");
let rightRoute = document.getElementById("right-route");
let middleRoute = document.getElementById("middle-route");


//Data fetched from backend for doors
const dummyData = [{doorID: 1, locked: 0, closed: 0, alarm: 0}, {
  doorID: 2, locked: 0, closed: 0, alarm: 0
}, {doorID: 3, locked: 0, closed: 0, alarm: 0},];

dummyData.forEach((el) => {
  if (el.doorID === 1) {
    leftRoute.replaceChildren();
    if (el.alarm) {
      leftRoute.appendChild(alarmedHotelDoor.cloneNode(true));
    } else if (el.closed) {
      leftRoute.appendChild(closedHotelDoor.cloneNode(true));
    } else if (el.locked) {
      leftRoute.appendChild(lockedHotelDoor.cloneNode(true));
    } else {
      leftRoute.appendChild(openHotelDoor.cloneNode(true));
    }
  } else if (el.doorID === 2) {
    middleRoute.replaceChildren();
    if (el.alarm) {
      middleRoute.appendChild(alarmedHotelDoor.cloneNode(true));
    } else if (el.closed) {
      middleRoute.appendChild(closedHotelDoor.cloneNode(true));
    } else if (el.locked) {
      middleRoute.appendChild(lockedHotelDoor.cloneNode(true));
    } else {
      middleRoute.appendChild(openHotelDoor.cloneNode(true));
    }
  } else if (el.doorID === 3) {
    rightRoute.replaceChildren();
    if (el.alarm) {
      rightRoute.appendChild(alarmedHotelDoor.cloneNode(true));
    } else if (el.closed) {
      rightRoute.appendChild(closedHotelDoor.cloneNode(true));
    } else if (el.locked) {
      rightRoute.appendChild(lockedHotelDoor.cloneNode(true));
    } else {
      rightRoute.appendChild(openHotelDoor.cloneNode(true));
    }
  }
});


// Patients, doctors, visitors
let visitor = document.createElement("i");
visitor.classList.add("fa-solid", "fa-user-clock", "fa-2x");
let guest = document.createElement("i");
guest.classList.add("fa-solid", "fa-user", "fa-2x");
let staff = document.createElement("i");
staff.classList.add("fa-solid", "fa-user-tie", "fa-2x")

// Users Data fetched from Backend API
const dummyUserData = [{
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
  type: "S", zoneID: 12, firstName: "Wick", lastName: "Shelby"
}];

let zone1 = document.getElementById("left-side");
let zone2 = document.getElementById("middle");
let zone3 = document.getElementById("right-side");
let zone1Counter = 0;
let zone2Counter = 0;
let zone3Counter = 0;
let zone1CounterElement = document.getElementById("left-side-counter");
let zone2CounterElement = document.getElementById("middle-counter");
let zone3CounterElement = document.getElementById("right-side-counter");

dummyUserData.forEach((user) => {
  let userDiv = document.createElement("div");
  userDiv.classList.add("user");
  let userInfo = document.createElement("div");
  userInfo.classList.add("details")
  userInfo.innerHTML = `Name: ${user.firstName} ${user.lastName}`;
  userDiv.appendChild(userInfo);
  if (user.zoneID <= 10) {
    zone1Counter += 1;
    zone1CounterElement.innerHTML = `Hotel Rooms: ${zone1Counter}`;
    switch (user.type) {
      case "G":
        userDiv.appendChild(guest.cloneNode(true));
        break;
      case "S":
        userDiv.appendChild(staff.cloneNode(true));
        break;
      case "V":
        userDiv.appendChild(visitor.cloneNode(true));
        break;
    }
    zone1.appendChild(userDiv);
  } else if (user.zoneID === 11) {
    zone2Counter += 1;
    zone2CounterElement.innerHTML = `Reception: ${zone2Counter}`;
    switch (user.type) {
      case "G":
        userDiv.appendChild(guest.cloneNode(true));
        break;
      case "S":
        userDiv.appendChild(staff.cloneNode(true));
        break;
      case "V":
        userDiv.appendChild(visitor.cloneNode(true));
        break;
    }
    zone2.appendChild(userDiv);
  } else if (user.zoneID === 12) {
    zone3Counter += 1;
    zone3CounterElement.innerHTML = `Restaurant: ${zone3Counter}`;
    switch (user.type) {
      case "G":
        userDiv.appendChild(guest.cloneNode(true));
        break;
      case "S":
        userDiv.appendChild(staff.cloneNode(true));
        break;
      case "V":
        userDiv.appendChild(visitor.cloneNode(true));
        break;
    }
    zone3.appendChild(userDiv);
  }
});


//Warnings
async function showAlerts() {
  const zones = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Room 6", "Room 7", "Room 8", "Room 9", "Room 10", "Reception", "Restaurant"]
  const warnings = ["Staff needs help in ", "Temperature too high in ", "Temperature too low in ", "Noise too high in ", "Lights too low in "]

  //Fetched from API
  let warningData = [{zoneID: 1, warningID: 1}, {zoneID: 12, warningID: 3}]

  for (const warning of warningData) {
    await Swal.fire({
      title: "Warning!",
      text: `${warnings[warning.warningID - 1]}${zones[warning.zoneID - 1]}`,
      icon: "error",
      iconColor: "#7D0A0A",
      color:"#124076",
      background: "#fff",
      confirmButtonColor: "#7D0A0A"
    })
  }
}

showAlerts();
