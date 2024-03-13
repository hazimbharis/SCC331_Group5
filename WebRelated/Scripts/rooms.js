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
  type: "S", zoneID: 1, firstName: "Wick", lastName: "Shelby"
}];

dummyUserData.forEach(user => {
  let userDiv = document.createElement("div");
  userDiv.classList.add("user");
  let userInfo = document.createElement("div");
  userInfo.classList.add("details")
  userInfo.innerHTML = `Name: ${user.firstName} ${user.lastName}`;
  userDiv.appendChild(userInfo);

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
const dummyRoomData = []
