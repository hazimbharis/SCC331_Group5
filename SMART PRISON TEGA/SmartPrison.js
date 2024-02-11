let gym = document.getElementById('prison1');
let canteen = document.getElementById('prison2');
let library = document.getElementById('prison3');
let livingRoom = document.getElementById('prison4');
let gymCount = 0;
let canteenCount = 0;
let libraryCount = 0;
let livingRoomCount = 0;

let data = [
  {
    id: 'A1234BC',
    zone: '1',
  },
  {
    id: 'A1235BE',
    zone: '2',
  },
  {
    id: 'A2411NY',
    zone: '3',
  },
  {
    id: 'A4751BM',
    zone: '4',
  },
  {
    id: 'A1231VT',
    zone: '1',
  },
]; //fetched from API, backend

data.forEach((element) => {
  // Create a div element
  let prisoner = document.createElement('div');
  prisoner.classList.add('prisoner');

  // Create an icon element with Font Awesome classes
  let iconElement = document.createElement('i');
  iconElement.classList.add('fa-solid', 'fa-user', 'fa-3x');

  // Create a paragraph element for the prisoner ID
  let paragraphElement = document.createElement('p');
  paragraphElement.classList.add('prisoner-id');
  paragraphElement.textContent = element.id;
  prisoner.appendChild(iconElement);
  prisoner.appendChild(paragraphElement);
  if (element.zone == '1') {
    gymCount++;
    gym.appendChild(prisoner);
    gym.children[1].innerHTML = `Gym: ${gymCount}`;
  } else if (element.zone == '2') {
    canteenCount++;
    canteen.appendChild(prisoner);
    canteen.children[1].innerHTML = `Canteen: ${canteenCount}`;
  } else if (element.zone == '3') {
    libraryCount++;
    library.appendChild(prisoner);
    library.children[1].innerHTML = `Library: ${libraryCount}`;
  } else if (element.zone == '4') {
    livingRoomCount++;
    livingRoom.appendChild(prisoner);
    livingRoom.children[1].innerHTML = `Living room: ${livingRoomCount}`;
  }
});
