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
visitor.classList.add("fa-solid", "fa-user", "fa-2x");
let patient = document.createElement("i");
patient.classList.add("fa-solid", "fa-user-injured", "fa-2x");
let doctor = document.createElement("i");
doctor.classList.add("fa-solid", "fa-user-doctor", "fa-2x")

// Users Data fetched from Backend API
const dummyUserData = [
  {type: "P", zoneID: 1, firstName: "John", lastName: "Wick"},
  {type: "P", zoneID: 2, firstName: "John", lastName: "Wick"},
  {type: "P", zoneID: 3, firstName: "John", lastName: "Wick"},
  {type: "V", zoneID: 4, firstName: "John", lastName: "Wick"},
  {type: "V", zoneID: 5, firstName: "John", lastName: "Wick"},
  {type: "D", zoneID: 6, firstName: "John", lastName: "Wick"},
  {type: "P", zoneID: 7, firstName: "John", lastName: "Wick"},
  {type: "P", zoneID: 8, firstName: "John", lastName: "Wick"},
  {type: "D", zoneID: 9, firstName: "John", lastName: "Wick"},
  {type: "P", zoneID: 10, firstName: "John", lastName: "Wick"},
  {type: "D", zoneID: 11, firstName: "John", lastName: "Wick"},
  {type: "V", zoneID: 12, firstName: "John", lastName: "Wick"},
];

let zone1 = document.getElementById("left-side");
let zone2 = document.getElementById("middle");
let zone3 = document.getElementById("right-side");

dummyUserData.forEach((user) => {
  let userDiv = document.createElement("div");
  userDiv.classList.add("user");
  let userInfo = document.createElement("div");
  userInfo.classList.add("details")
  userInfo.innerHTML = `Name: ${user.firstName} ${user.lastName}`;
  userDiv.appendChild(userInfo);
  if (user.zoneID <= 10) {
    switch (user.type) {
      case "P":
        userDiv.appendChild(patient.cloneNode(true));
        break;
      case "D":
        userDiv.appendChild(doctor.cloneNode(true));
        break;
      case "V":
        userDiv.appendChild(visitor.cloneNode(true));
        break;
    }
    zone1.appendChild(userDiv);
  } else if (user.zoneID === 11) {
    switch (user.type) {
      case "P":
        userDiv.appendChild(patient.cloneNode(true));
        break;
      case "D":
        userDiv.appendChild(doctor.cloneNode(true));
        break;
      case "V":
        userDiv.appendChild(visitor.cloneNode(true));
        break;
    }
    zone2.appendChild(userDiv);
  } else if (user.zoneID === 12) {
    switch (user.type) {
      case "P":
        userDiv.appendChild(patient.cloneNode(true));
        break;
      case "D":
        userDiv.appendChild(doctor.cloneNode(true));
        break;
      case "V":
        userDiv.appendChild(visitor.cloneNode(true));
        break;
    }
    zone3.appendChild(userDiv);
  }
})
